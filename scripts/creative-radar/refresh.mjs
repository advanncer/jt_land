import { readFile } from 'node:fs/promises';
import { buildReport, compareReference, currentEnd, validEnd } from '../../server/creative-radar/report.js';
import { runQuery } from './bigquery.mjs';

const config = {
  adult:{subject:'English',student_type:'Adult'},child:{subject:'English',student_type:'Child'},
  math:{subject:'Math',student_type:'Child'},prog:{subject:'Programming',student_type:'Child'}
};
const root=new URL('../../sql/creative-radar/',import.meta.url);
const end=process.argv[2]||currentEnd();
if(!validEnd(end)||end>currentEnd()) throw new Error('cycle_end must be a completed Sunday in Kyiv');
const baselineRules=[{subject:'adult',buyer:'Julia',marker:'EngAdult',month:'2026-11',cmc:4500,minPays:3,minSpend:400,lateDays:10}];
const rules=JSON.parse(process.env.CREATIVE_RADAR_RULES_JSON||'null')??baselineRules;

const factSQL=await readFile(new URL('facts.sql',root),'utf8');
const inventorySQL=await readFile(new URL('inventory.sql',root),'utf8');
const storeUrl=process.env.SUPABASE_URL,storeKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!storeUrl||!storeKey) throw new Error('Supabase environment missing');
async function storedReferences() {
  const endpoint=new URL('/rest/v1/creative_radar_settings?name=eq.references&select=value',storeUrl);
  const response=await fetch(endpoint,{headers:{apikey:storeKey,Authorization:'Bearer '+storeKey}});
  if(!response.ok) throw new Error('Reference configuration unavailable');
  return (await response.json())[0]?.value||[];
}
const references=process.env.CREATIVE_RADAR_REFERENCES_JSON?JSON.parse(process.env.CREATIVE_RADAR_REFERENCES_JSON):await storedReferences();
const cache=new Map();
async function facts(subject,cycle_end) {
  const id=subject+'/'+cycle_end;
  if(!cache.has(id)) cache.set(id,runQuery(factSQL,{cycle_end,...config[subject]}));
  return cache.get(id);
}
function checkRule(rule) {
  if(!rule||!config[rule.subject]||!rule.marker||!rule.buyer||!/^\d{4}-\d{2}$/.test(rule.month)
    ||!Number.isFinite(rule.cmc)||rule.cmc<=0||!Number.isInteger(rule.minPays)||rule.minPays<1
    ||!Number.isFinite(rule.minSpend)||rule.minSpend<=0||!Number.isInteger(rule.lateDays)||rule.lateDays<0) throw new Error('Invalid creative radar rule');
}
rules.forEach(checkRule);
const inventory=await runQuery(inventorySQL,{cycle_end:end});
if(!inventory.length) throw new Error('Empty inventory: retained preceding cycle');
const slices=[];
const effective = new Map();
for (const rule of [...rules].sort((a,b)=>a.month.localeCompare(b.month))) {
  if (rule.month<=end.slice(0,7)) effective.set(rule.subject+'/'+rule.buyer,rule);
}
for (const rule of effective.values()) {
  if(slices.some(s=>s.subject===rule.subject&&s.buyer===rule.buyer)) throw new Error('Duplicate applicable rule');
  const report=buildReport(await facts(rule.subject,end),end,rule);
  const control=references.find(r=>r.subject===rule.subject&&r.buyer===rule.buyer);
  let reference={passed:false,rows:[],cycle:null};
  if(control) {
    if(!validEnd(control.cycle_end)) throw new Error('Invalid reference cycle');
    const refRule=rules.find(r=>r.month===control.cycle_end.slice(0,7)&&r.subject===rule.subject&&r.buyer===rule.buyer);
    if(!refRule) throw new Error('Historical rule missing for reference cycle');
    const prior=buildReport(await facts(rule.subject,control.cycle_end),control.cycle_end,refRule);
    reference={...compareReference(prior,control.expected),cycle:control.cycle_end};
    reference.passed=reference.passed && !prior.checks.inconsistentWeeks.length;
  }
  const ready=rule.month===end.slice(0,7) && reference.passed && !report.checks.inconsistentWeeks.length && !report.checks.unresolved.pays && report.count>0;
  slices.push({subject:rule.subject,buyer:rule.buyer,ready,reference,report});
}
const url=new URL('/rest/v1/creative_radar_cycles',storeUrl);
url.searchParams.set('on_conflict','cycle_end');
const response=await fetch(url,{method:'POST',headers:{apikey:storeKey,Authorization:'Bearer '+storeKey,
  Prefer:'resolution=merge-duplicates,return=minimal','Content-Type':'application/json'},
  body:JSON.stringify({cycle_end:end,calculated_at:new Date().toISOString(),report:{inventory,slices}}),signal:AbortSignal.timeout(30000)});
if(!response.ok) throw new Error('Supabase snapshot write returned '+response.status);
console.log('Saved cycle '+end+'; verified slices '+slices.filter(s=>s.ready).length+'/'+slices.length);
