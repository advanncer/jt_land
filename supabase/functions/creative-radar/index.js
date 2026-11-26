import { serve } from '../../../server/creative-radar/http.js';
import { Buffer } from 'node:buffer';

Deno.serve(async request=>{
  const url=new URL(request.url), dbUrl=Deno.env.get('SUPABASE_URL'), serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const headers=new Headers({'Cache-Control':'private, no-store'});
  const reply={code:200,setHeader(k,v){headers.set(k,v)},status(n){this.code=n;return this},
    end(body){return new Response(body||null,{status:this.code,headers})},
    json(value){headers.set('Content-Type','application/json');return this.end(JSON.stringify(value))}};
  try {
    const action=url.searchParams.get('action');
    if(request.headers.get('Origin') && new URL(request.headers.get('Origin')).host!==url.host) return reply.status(403).end();
    if(action==='health')return reply.json({ok:true});
    const auth=await fetch(new URL('/rest/v1/creative_radar_settings?name=eq.team_login&select=value',dbUrl),{headers:{apikey:serviceKey,Authorization:'Bearer '+serviceKey}});
    if(!auth.ok)throw Error('missing_login');
    const [{value:cfg}]=await auth.json();
    let body={};
    if(request.method==='POST'&&action==='login'){
      try{body=await request.json()}catch{return reply.status(400).json({error:'invalid_json'})}
      if(typeof body?.password!=='string'||body.password.length>1024)return reply.status(401).json({error:'password'});
      const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(body.password),'PBKDF2',false,['deriveBits']);
      const digest=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:Buffer.from(cfg.salt,'hex'),iterations:210000},material,256);
      body={password:Buffer.from(digest).toString('hex')};
    }
    return await serve({headers:{cookie:request.headers.get('Cookie')||'',host:url.host},query:Object.fromEntries(url.searchParams),method:request.method,body},reply,
      {password:cfg.hash,key:serviceKey,serviceKey,url:dbUrl});
  }catch{return reply.status(503).json({error:'store_unavailable'})}
});
