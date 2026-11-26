import { createSign } from 'node:crypto';
const project='justschool-473216', location='US';
const api='https://bigquery.googleapis.com/bigquery/v2/projects/'+project;
async function json(url,options) {
  const r=await fetch(url,{...options,signal:AbortSignal.timeout(60000)});
  if(!r.ok) throw new Error('Google API '+new URL(url).pathname+' returned '+r.status);
  return r.json();
}
async function auth() {
  const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key=process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g,'\n');
  if(!email||!key) throw new Error('BigQuery service account is missing');
  const encode=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
  const now=Math.floor(Date.now()/1000), url='https://oauth2.googleapis.com/token';
  const jwt=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:email,aud:url,scope:'https://www.googleapis.com/auth/bigquery.readonly',iat:now,exp:now+3500});
  const signed=createSign('RSA-SHA256').update(jwt).sign(key,'base64url');
  return (await json(url,{method:'POST',body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt+'.'+signed})})).access_token;
}
export async function runQuery(sql,params) {
  const token=await auth(),headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
  const queryParameters=Object.entries(params).map(([name,value])=>({name,parameterType:{type:name==='cycle_end'?'DATE':'STRING'},parameterValue:{value}}));
  let data=await json(api+'/queries',{method:'POST',headers,body:JSON.stringify({query:sql,useLegacySql:false,location,parameterMode:'NAMED',queryParameters,timeoutMs:15000,maxResults:10000})});
  const id=data.jobReference.jobId,rows=[];
  const deadline=Date.now()+18*60*1000;
  for(;;) {
    if(data.jobComplete && data.rows) rows.push(...data.rows.map(row=>JSON.parse(row.f[0].v)));
    if(data.jobComplete&&!data.pageToken) return rows;
    if(Date.now()>deadline) throw new Error('BigQuery deadline exceeded');
    const search=new URLSearchParams({location,timeoutMs:'15000',maxResults:'10000'});
    if(data.pageToken) search.set('pageToken',data.pageToken);
    data=await json(api+'/queries/'+encodeURIComponent(id)+'?'+search,{headers});
  }
}
