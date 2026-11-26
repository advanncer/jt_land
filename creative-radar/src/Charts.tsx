import type { ReactNode } from 'react';
import { fmt,kpi,pct,ratio,dateLabel } from './types';
import type { Report,Totals } from './types';

function Card({title,note,children}:{title:string;note:string;children:ReactNode}){
  return <article className="card"><h3>{title}</h3><p className="note muted">{note}</p>{children}</article>;
}
const tooltip=(m:Totals)=>'Спенд '+fmt(m.spend)+' грн · '+fmt(m.leads)+' лідів · '+fmt(m.pays)+' оплат';
function Bars({r,metric,target}:{r:Report;metric:'CMC'|'CPL'|'ROAS';target?:number}){
  const series=[r.test,r.rest], values=series.map(m=>kpi(m,metric)),max=Math.max(1,...values.map(v=>v??0),target||0)*1.08;
  return <>{series.map((m,i)=><div className="barrow" key={i} title={tooltip(m)}><span>{i?'Решта':'Тести'}</span><div className="track"><div className="fill" style={{width:(values[i]??0)/max*100+'%',background:i?'var(--grey)':'var(--orange)'}}/>{target&&<i className="goal" style={{left:target/max*100+'%'}}/>}</div><b>{values[i]===null&&metric==='CMC'?'без оплат':metric==='ROAS'?pct(values[i]):fmt(values[i])}</b></div>)}</>;
}
function Weeks({r,share}:{r:Report;share:boolean}){
  const data=share?[r.weekly.map(w=>ratio(w.test.spend,w.test.spend+w.rest.spend,100))]:
    [r.weekly.map(w=>kpi(w.test,'CMC')),r.weekly.map(w=>kpi(w.rest,'CMC'))];
  const max=Math.max(1,share?0:r.rule.cmc,...data.flat().map(v=>v??0))*1.13;
  const x=(i:number)=>26+i*57,y=(v:number)=>88-v/max*64;
  return <svg className="spark" viewBox="0 0 280 115" role="img" aria-label={share?'Частка бюджету за тижнями':'CMC за тижнями'}>
    {!share&&<line x1="8" x2="272" y1={y(r.rule.cmc)} y2={y(r.rule.cmc)} stroke="var(--plan)" strokeDasharray="5 4"/>}
    {data.map((s,j)=>s.map((v,i)=>{
      const hue=j?'var(--grey)':'var(--orange)',prev=s[i-1],w=r.weekly[i],tip=dateLabel(w.start)+' · '+tooltip(j?w.rest:w.test);
      if(v===null) return <g key={j+'-'+i}><title>{tip}</title><text x={x(i)} y={j?19:8} textAnchor="middle" fontSize="8">{share?'—':'без оплат'}</text></g>;
      return <g key={j+'-'+i}><title>{tip+' · '+fmt(v,1)+(share?'%':' грн')}</title>
        {share?<rect x={x(i)-11} width="22" y={y(v)} height={88-y(v)} fill={hue}/>:<>{prev!=null&&<line x1={x(i-1)} x2={x(i)} y1={y(prev)} y2={y(v)} stroke={hue} strokeWidth="2.4"/>}<circle cx={x(i)} cy={y(v)} r="3.7" fill={hue}/></>}
        <text x={x(i)} y={y(v)+(j?13:-6)} textAnchor="middle" fontSize="9">{share?pct(v):fmt(v)}</text>
      </g>;
    }))}
    {r.weekly.map((w,i)=><text key={w.start} x={x(i)} y="107" textAnchor="middle" fontSize="10">{dateLabel(w.start).slice(0,5)}</text>)}
  </svg>;
}
export function Overview({r}:{r:Report}){
  const outside=r.outside, testCreativePays=r.testedPays;
  return <><div className="section"><h2>Огляд тестів</h2><div className="legend"><span><i className="sw"/>Тести {r.rule.buyer}</span><span><i className="sw gray"/>Решта акаунта</span><span><i className="sw plan"/>План</span></div></div><div className="grid">
    <Card title="Win rate креативів" note="Креативи в плані"><strong className="big">{pct(ratio(r.won,r.count,100))}</strong><b>{r.won} із {r.count}</b><span className="small">У тесті {r.wonTest} · поза тестом {r.wonOut}</span><progress value={r.won} max={r.count||1}/></Card>
    <Card title="CMC, грн" note={'План '+fmt(r.rule.cmc)+' грн'}><Bars r={r} metric="CMC" target={r.rule.cmc}/></Card>
    <Card title="CPL, грн" note="Витрати на один лід"><Bars r={r} metric="CPL"/></Card>
    <Card title="ROAS" note="Окупність 100%"><Bars r={r} metric="ROAS" target={100}/></Card>
    <Card title="Оплати протестованих креативів" note="У всіх кампаніях"><b className="big">{testCreativePays+r.outPays}</b><div className="stack" title={tooltip(r.test)}><span style={{width:(ratio(testCreativePays,testCreativePays+r.outPays,100)||0)+'%'}}/></div><span className="small">{testCreativePays} у тесті · {r.outPays} поза тестом</span></Card>
    <Card title="Масштаб поза тестом" note={'CMC · план '+fmt(r.rule.cmc)+' грн'}><b className="big">{outside.pays?fmt(kpi(outside,'CMC')):'без оплат'}</b><span className="small">ROAS {pct(kpi(outside,'ROAS'))} · {outside.pays} оплат · {fmt(outside.spend)} грн · {r.scaled} креативів від {fmt(r.rule.minSpend)} грн</span></Card>
    <Card title="Частка тестів у бюджеті" note={pct(ratio(r.test.spend,r.test.spend+r.rest.spend,100))+' за цикл'}><Weeks r={r} share/></Card>
    <Card title="CMC по тижнях" note={'План '+fmt(r.rule.cmc)+' грн'}><Weeks r={r} share={false}/></Card>
  </div><p className="foot">У плані — від {r.rule.minPays} оплат при CMC до {fmt(r.rule.cmc)} грн включно в тесті або поза ним. Обидва середовища оцінюються окремо. Без пізніх запусків — {r.matureWon} із {r.count-r.late} ({pct(ratio(r.matureWon,r.count-r.late,100))}). Пізніх запусків — {r.late}, зі спендом до {fmt(r.rule.minSpend)} грн — {r.small}, з оплатою в тесті — {r.withPay}.</p></>;
}
