import { serve } from '../server/creative-radar/http.js';
const project = 'https://wwkjigmyqihpobsuaroj.supabase.co';
export default async function handler(req,res) {
  const password=process.env.CREATIVE_RADAR_PASSWORD || process.env.RESIZER_PASSWORD;
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(password && serviceKey) return serve(req,res,{password,serviceKey,key:process.env.CREATIVE_RADAR_SESSION_SECRET||serviceKey,url:process.env.SUPABASE_URL||project});
  res.setHeader('Cache-Control','private, no-store');
  try {
    if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host) return res.status(403).end();
    if(!['GET','POST','OPTIONS'].includes(req.method)) return res.status(405).end();
    const url=new URL('/functions/v1/creative-radar',project);
    for(const [k,v] of Object.entries(req.query||{})) if(typeof v==='string') url.searchParams.set(k,v);
    const session=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('js_creative_radar='))||'';
    const upstream=await fetch(url,{method:req.method,redirect:'error',headers:{Cookie:session,'Content-Type':'application/json'},
      body:req.method==='POST'?typeof req.body==='string'?req.body:JSON.stringify(req.body||{}):undefined,signal:AbortSignal.timeout(14000)});
    const cookies=upstream.headers.getSetCookie?.() || [upstream.headers.get('set-cookie') || ''];
    const teamCookie=cookies.flatMap(h=>h.split(/,(?=\s*[A-Za-z0-9_-]+=)/)).map(h=>h.trim()).find(h=>h.startsWith('js_creative_radar='));
    if(teamCookie) res.setHeader('Set-Cookie',teamCookie);
    for(const h of ['content-type','allow','vary']) {const value=upstream.headers.get(h);if(value)res.setHeader(h,value);}
    return res.status(upstream.status).end(await upstream.text());
  }catch{return res.status(503).json({error:'store_unavailable'});}
}
