import { createHmac, timingSafeEqual, createHash } from 'node:crypto';
import { currentEnd, validEnd } from './report.js';

const cookieName = 'js_creative_radar';
const apiPath = '/api/creative-radar';
const lifetime = 8 * 3600;
function equal(a,b) {
  const hash = v => createHash('sha256').update(v).digest();
  return timingSafeEqual(hash(a),hash(b));
}
function signature(exp,password,key) {
  return createHmac('sha256',key).update('creative-radar/v1\0'+password+'\0'+exp).digest('base64url');
}
function cookie(token,age) {
  return cookieName+'='+token+'; Path='+apiPath+'; HttpOnly; Secure; SameSite=Strict; Max-Age='+age;
}
function session(req,password,key,now) {
  const cookies=(req.headers.cookie||'').split(';').map(x=>x.trim());
  const token=cookies.find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';
  const [exp,mac,...rest]=token.split('.');
  return !rest.length && /^\d{10}$/.test(exp) && Boolean(mac) && +exp>now && +exp<=now+lifetime && equal(mac,signature(exp,password,key));
}
async function db(query,url,key) {
  if(!url||!key) throw new Error('store_unavailable');
  const endpoint=new URL('/rest/v1/creative_radar_cycles',url);
  endpoint.search=new URLSearchParams(query);
  const r=await fetch(endpoint,{headers:{apikey:key,Authorization:'Bearer '+key},signal:AbortSignal.timeout(8000)});
  if(!r.ok) throw new Error('store_unavailable');
  return r.json();
}
export async function serve(req,res,{password,key,url,serviceKey}) {
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Vary','Origin, Cookie');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  const origin=req.headers.origin;
  if(origin) {
    try { if(new URL(origin).host!==req.headers.host) return res.status(403).json({error:'origin'}); }
    catch {return res.status(403).json({error:'origin'});}
    res.setHeader('Access-Control-Allow-Origin',origin);
  }
  if(req.method==='OPTIONS') return res.status(200).end();
  const action=req.query?.action||'dashboard';
  if(action==='health' && req.method==='GET') return res.status(200).json({ok:true});
  const read=query=>db(query,url,serviceKey);
  if(!password||!key) return res.status(503).json({error:'login_unavailable'});
  const now=Math.floor(Date.now()/1000);
  if(action==='login'||action==='logout') {
    if(req.method!=='POST') return res.status(405).end();
    if(action==='logout') {res.setHeader('Set-Cookie',cookie('',0));return res.status(200).json({ok:true});}
    let body;
    try {body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'invalid_json'});}
    if(typeof body?.password!=='string'||body.password.length>1024||!equal(body.password,password)) return res.status(401).json({error:'password'});
    const exp=String(now+lifetime);
    res.setHeader('Set-Cookie',cookie(exp+'.'+signature(exp,password,key),lifetime));
    return res.status(200).json({ok:true});
  }
  if(!session(req,password,key,now)) return res.status(401).json({error:'session'});
  if(req.method!=='GET') return res.status(405).end();
  if(action==='verify') return res.status(200).json({ok:true});
  if(!['cycles','dashboard','creatives','delivery'].includes(action)) return res.status(404).end();
  try {
    if(action==='cycles') {
      const list=await read({select:'cycle_end',order:'cycle_end.desc',limit:'200'});
      return res.status(200).json({cycles:list.map(c=>c.cycle_end)});
    }
    const end=req.query.cycle_end, expected=currentEnd();
    if(end && (!validEnd(end)||end>expected)) return res.status(400).json({error:'cycle_end'});
    const data=await read({select:'cycle_end,calculated_at,report',order:'cycle_end.desc',limit:'1',cycle_end:end?'eq.'+end:'lte.'+expected});
    if(!data.length) return res.status(404).json({error:'no_cycle'});
    const row=data[0],snapshot=row.report, subject=req.query.subject||'adult', buyer=req.query.buyer||'Julia';
    if(!['adult','child','math','prog'].includes(subject)||typeof buyer!=='string'||buyer.length>96) return res.status(400).json({error:'filter'});
    const slice=snapshot.slices.find(s=>s.subject===subject&&s.buyer===buyer);
    const summary={end:row.cycle_end,updated:row.calculated_at,expected,inventory:snapshot.inventory,ready:slice?.ready||false,reference:slice?.reference||null};
    if(action==='dashboard') {
      const report=slice?.report;
      if(!report || !slice.ready) return res.status(200).json({...summary,report:null,checks:report?.checks||null,delivery:report?{count:report.count,test:report.test.spend,rest:report.rest.spend}:null});
      const {creatives,...publicReport}=report;
      return res.status(200).json({...summary,report:publicReport,checks:report.checks});
    }
    if(action==='delivery') {
      if(!slice) return res.status(200).json({rows:[],total:0,tail:null});
      const page=Number(req.query.page||1), week=Number(req.query.week||0);
      if(!Number.isInteger(page)||page<1||!Number.isInteger(week)||week<0||week>5) return res.status(400).json({error:'filter'});
      const q=String(req.query.q||'').toLowerCase(), scale=req.query.mode==='scale';
      const list=slice.report.creatives.filter(v=>v.name.toLowerCase().includes(q)&&(!week||week===v.launchWeek)&&(!scale||v.out.spend>0))
        .sort((a,b)=>scale?b.out.spend-a.out.spend:b.test.spend-a.test.spend);
      const rows=list.slice((page-1)*50,page*50).map(v=>({name:v.name,launch:v.launch,launchWeek:v.launchWeek,test:v.test.spend,out:v.out.spend,campaigns:v.campaigns}));
      return res.status(200).json({rows,total:list.length});
    }
    if(!slice?.ready) return res.status(409).json({error:'pending_validation'});
    const page=Number(req.query.page||1),mode=req.query.mode||'all',q=String(req.query.q||'').toLowerCase(),week=Number(req.query.week||0);
    if(!Number.isInteger(page)||page<1||!Number.isInteger(week)||week<0||week>5||!['all','won','scale','small'].includes(mode)) return res.status(400).json({error:'filter'});
    const {report}=slice, list=report.creatives.filter(v=>(!week||v.launchWeek===week)&&v.name.toLowerCase().includes(q)&&
      (mode==='all'||mode==='won'&&(v.inTest||v.inOut)||mode==='small'&&v.test.spend<report.rule.minSpend||mode==='scale'&&v.out.spend>=report.rule.minSpend));
    if(mode==='scale') list.sort((a,b)=>b.out.spend-a.out.spend);
    const tail=report.creatives.filter(v=>v.out.spend>0&&v.out.spend<report.rule.minSpend);
    return res.status(200).json({rows:list.slice((page-1)*50,page*50),total:list.length,
      tail:mode==='scale'?{count:tail.length,spend:tail.reduce((n,v)=>n+v.out.spend,0),pays:tail.reduce((n,v)=>n+v.out.pays,0)}:null});
  } catch {return res.status(503).json({error:'store_unavailable'});}
}
