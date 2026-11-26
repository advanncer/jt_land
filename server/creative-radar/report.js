const fields = ['spend', 'leads', 'invites', 'pays', 'revenue'];
const empty = () => ({ spend: 0, leads: 0, invites: 0, pays: 0, revenue: 0 });
const weeks = make => Array.from({ length: 5 }, make);
function add(total, row) {
  for (const key of fields) total[key] += Number(row[key] || 0);
}
export function offset(date, days) {
  const value = new Date(date + 'T12:00:00Z');
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function validEnd(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const d = new Date(value + 'T12:00:00Z');
  return Number.isFinite(+d) && d.toISOString().slice(0,10) === value && d.getUTCDay() === 0;
}
export function currentEnd(now = new Date()) {
  const iso = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Kyiv' }).format(now);
  const day = new Date(iso + 'T12:00:00Z').getUTCDay();
  return offset(iso, -(day || 7));
}
function campaignDate(name, buyer) {
  if (!name.startsWith(buyer + '_')) return null;
  const match = name.slice(buyer.length + 1).match(/^(\d{2})-(\d{2})-(\d{4})(?:_|$)/);
  if (!match) return null;
  const iso = match[3] + '-' + match[1] + '-' + match[2];
  const date = new Date(iso + 'T12:00:00Z');
  return Number.isFinite(+date) && date.toISOString().slice(0,10) === iso ? iso : null;
}
function exclusion(campaign, creative, marker) {
  const label = (campaign+' '+creative).toLowerCase();
  if (/english[ _-]*after[ _-]*40|40granny|apex40|guide40|200phrases|40\+outside/i.test(label)) return '40+ / FreeProduct';
  if (/hrcalculator|(?:^|[^a-z])b2b(?:[^a-z]|$)/i.test(label)) return 'B2B';
  if (/^допис в instagram/i.test(creative)) return 'Дописи Instagram';
  if (/_var\d+[_-]\d+(?:_|$)/i.test(creative)) return 'Пак варіантів';
  if (!/^Y2\d_W\d+_/.test(creative)) return 'Без неймінгу варіанта';
  if (!creative.toLowerCase().includes(marker.toLowerCase())) return 'Інший предмет';
  return '';
}
export function buildReport(rows, end, rule) {
  const start = offset(end,-34);
  const test=empty(), rest=empty(), outside=empty(), testWeeks=weeks(empty), restWeeks=weeks(empty);
  const controls=weeks(()=>({account:0,test:0})), variants=new Map(), invalid=new Set(), badNames=new Set();
  const exclusions=new Map(), unresolved=empty();
  for (const r of rows) {
    if (!Number.isInteger(r.week) || r.week<0 || r.week>4) throw new Error('Week outside cycle');
    if (r.kind==='unresolved') { add(unresolved,r); continue; }
    const name=r.creative || '', campaign=r.campaign || '';
    const date=campaignDate(campaign,rule.buyer);
    const testing=!!date && date>=start && date<=end;
    if (campaign.startsWith(rule.buyer+'_') && !date) invalid.add(campaign);
    const reason=exclusion(campaign,name,rule.marker);
    if (reason) {
      if (r.kind==='fact') {
        if (!exclusions.has(reason)) exclusions.set(reason,weeks(empty));
        add(exclusions.get(reason)[r.week],r);
        if (testing) badNames.add(name || '∅');
      }
      continue;
    }
    if (r.kind==='control') {
      controls[r.week].account+=r.spend;
      if (testing) controls[r.week].test+=r.spend;
      continue;
    }
    add(testing?test:rest,r);
    add((testing?testWeeks:restWeeks)[r.week],r);
    if (!variants.has(name)) variants.set(name,{name,launch:null,test:empty(),out:empty(),testWeeks:weeks(empty),outWeeks:weeks(empty),campaignSpend:new Map()});
    const v=variants.get(name);
    if (testing && r.spend>0 && (!v.launch || date<v.launch)) v.launch=date;
    add(testing?v.test:v.out,r); add((testing?v.testWeeks:v.outWeeks)[r.week],r);
    if (!testing && r.spend>0) v.campaignSpend.set(campaign,(v.campaignSpend.get(campaign)||0)+r.spend);
  }
  const creatives=[]; const perWeek=weeks(()=>0);
  let won=0, wonTest=0, wonOut=0, late=0, matureWon=0, small=0, withPay=0, scaled=0, testedPays=0, outPays=0;
  const plan=m=>m.pays>=rule.minPays && m.spend/m.pays<=rule.cmc;
  for(const v of variants.values()) {
    if(v.test.spend<=0) continue;
    const inTest=plan(v.test), inOut=plan(v.out), isLate=v.launch>=offset(end,-rule.lateDays);
    if(inTest||inOut) won++;
    if(inTest) wonTest++;
    if(inOut) wonOut++;
    if(isLate) late++; else if(inTest||inOut) matureWon++;
    if(v.test.spend<rule.minSpend) small++;
    if(v.test.pays>0) withPay++;
    if(v.out.spend>=rule.minSpend) scaled++;
    testedPays+=v.test.pays;
    outPays+=v.out.pays;
    if(v.out.spend>0) add(outside,v.out);
    v.testWeeks.forEach((w,i)=>{perWeek[i]+=w.spend;});
    const launchWeek=Math.floor((Date.parse(v.launch)-Date.parse(start))/604800000)+1;
    creatives.push({name:v.name,launch:v.launch,launchWeek,test:v.test,out:v.out,outWeeks:v.outWeeks,
      campaigns:[...v.campaignSpend].sort((a,b)=>b[1]-a[1]),inTest,inOut,late:isLate});
  }
  creatives.sort((a,b)=>(b.test.pays+b.out.pays)-(a.test.pays+a.out.pays)||a.name.localeCompare(b.name));
  const count=creatives.length;
  const weekly=testWeeks.map((t,i)=>({start:offset(start,i*7),test:t,rest:restWeeks[i],control:controls[i],creativeSpend:perWeek[i]}));
  const difference=(a,b)=>Math.abs(a-b)>Math.max(.01, Math.abs(b)*.01);
  const inconsistentWeeks=weekly.filter(w=>difference(w.creativeSpend,w.control.test)||difference(w.test.spend+w.rest.spend,w.control.account)).map(w=>w.start);
  return {rule,test,rest,outside,testedPays,outPays,weekly,creatives,count,won,wonTest,wonOut,late,matureWon,small,withPay,scaled,
    checks:{unresolved,invalid:[...invalid],badNames:[...badNames],exclusions:Object.fromEntries(exclusions),inconsistentWeeks}};
}
export function compareReference(report, reference) {
  const a={count:report.count,won:report.won,wonTest:report.wonTest,wonOut:report.wonOut,testPays:report.test.pays,outPays:report.outPays,
    testSpend:report.test.spend,outSpend:report.outside.spend,scaled:report.scaled,late:report.late,small:report.small,withPay:report.withPay,
    accountWeeks:report.weekly.map(w=>w.test.spend+w.rest.spend),
    testCmc:ratio(report.test.spend,report.test.pays),restCmc:ratio(report.rest.spend,report.rest.pays),
    testCpl:ratio(report.test.spend,report.test.leads),restCpl:ratio(report.rest.spend,report.rest.leads),
    testRoas:ratio(100*report.test.revenue,report.test.spend),restRoas:ratio(100*report.rest.revenue,report.rest.spend),
    outRoas:ratio(100*report.outside.revenue,report.outside.spend),budgetShare:ratio(100*report.test.spend,report.test.spend+report.rest.spend),
    weeklyShare:report.weekly.map(w=>ratio(100*w.test.spend,w.test.spend+w.rest.spend)),
    testWeeklyCmc:report.weekly.map(w=>ratio(w.test.spend,w.test.pays)),restWeeklyCmc:report.weekly.map(w=>ratio(w.rest.spend,w.rest.pays)),
    outWeekly:report.weekly.map((_,i)=>report.creatives.reduce((sum,v)=>sum+v.outWeeks[i].spend,0))};
  if(!reference) return {passed:false,rows:[]};
  const exact=new Set(['count','won','wonTest','wonOut','testPays','outPays','scaled','late','small','withPay']);
  const checks=[];
  for(const [metric,observed] of Object.entries(a)) {
    const expected=reference[metric];
    const actual=Array.isArray(observed)?observed:[observed];
    const wanted=Array.isArray(expected)?expected:[expected];
    actual.forEach((value,i)=>{
      const target=wanted[i]??null, known=i<wanted.length && wanted[i]!==undefined;
      const margin=exact.has(metric)?0:metric.toLowerCase().includes('share') ? 0.051 : Math.max(.51,Math.abs(target||0)*.01);
      const ok=known && (target===null||value===null?target===value:Math.abs(value-target)<=margin);
      checks.push({metric:actual.length>1?metric+' · T'+(i+1):metric,expected:target,actual:value,ok});
    });
  }
  return {passed:checks.every(x=>x.ok),rows:checks};
}
const ratio=(a,b)=>b?a/b:null;
