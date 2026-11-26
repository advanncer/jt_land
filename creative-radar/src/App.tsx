import { useCallback, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Overview } from './Charts';
import { directions,fmt,kpi,pct,ratio,dateLabel } from './types';
import type { Direction,Page,Payload,Report } from './types';

type Session = 'loading'|'login'|'active'|'error';
type Tab = 'Огляд'|'Креативи'|'Масштаб'|'Звірка даних';
const tabs:Tab[]=['Огляд','Креативи','Масштаб','Звірка даних'];
class ApiError extends Error {
  status:number;
  constructor(code:string,status:number){super(code);this.status=status;}
}
async function api<T>(action:string,params:Record<string,string>={},body?:unknown,signal?:AbortSignal):Promise<T>{
  const query=new URLSearchParams({action,...params});
  const res=await fetch('/api/creative-radar?'+query,{credentials:'same-origin',cache:'no-store',signal,
    method:body===undefined?'GET':'POST',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  const payload=await res.json().catch(()=>({}));
  if(!res.ok) throw new ApiError(payload.error||'network',res.status);
  return payload;
}
function message(e:unknown){
  if(e instanceof ApiError){
    if(e.message==='no_cycle') return 'Перший цикл ще не завантажено.';
    if(e.message==='password') return 'Перевірте командний пароль.';
    if(e.message==='login_unavailable') return 'Серверний вхід ще не налаштовано.';
    if(e.message==='store_unavailable') return 'Сховище звітів тимчасово недоступне.';
  }
  return 'Не вдалося отримати дані. Спробуйте ще раз.';
}
function Table({heads,children}:{heads:string[];children:ReactNode}){
  return <div className="surface scroll"><table><thead><tr>{heads.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
const metricLabels:Record<string,string>={count:'Протестовані креативи',won:'У плані',wonTest:'У плані в тесті',wonOut:'У плані поза тестом',testPays:'Оплати в тесті',outPays:'Оплати поза тестом',testSpend:'Спенд тестів, грн',outSpend:'Спенд поза тестом, грн',scaled:'Масштабовані креативи',late:'Пізні запуски',small:'Малий спенд у тесті',withPay:'З оплатами у тесті',accountWeeks:'Спенд акаунта',testCmc:'CMC тестів',restCmc:'CMC решти',testCpl:'CPL тестів',restCpl:'CPL решти',testRoas:'ROAS тестів, %',restRoas:'ROAS решти, %',outRoas:'ROAS поза тестом, %',budgetShare:'Бюджет тестів, %',weeklyShare:'Частка бюджету, %',testWeeklyCmc:'CMC тестів',restWeeklyCmc:'CMC решти',outWeekly:'Спенд поза тестом'};
function ChecksPanel({data}:{data:Payload}){
 const c=data.checks, ref=data.reference;
 return <><div className="section"><h2>Звірка даних</h2></div>{ref?.cycle?<><p>Контрольний цикл до {dateLabel(ref.cycle)} · {ref.passed?'звірено':'є розбіжності'}</p><Table heads={['Показник','Еталон','BigQuery','Стан']}>{ref.rows.map(r=>{const [id,week]=r.metric.split(' · ');return <tr key={r.metric}><td>{metricLabels[id]||id}{week?' · '+week:''}</td><td>{fmt(r.expected,2)}</td><td>{fmt(r.actual,2)}</td><td>{r.ok?'Збіг':'Перевірити'}</td></tr>})}</Table></>:<p className="notice">Для цього зрізу очікуємо контрольний цикл із підтвердженим джерелом оплат.</p>}
 {c&&<><p>Неоднозначна атрибуція — {c.unresolved.pays} оплат і {c.unresolved.invites} запрошень. Тижні з розбіжністю понад 1% — {c.inconsistentWeeks.join(', ')||'немає'}.</p><Table heads={['Виключено','Тиждень','Витрати, грн','Оплати']}>{Object.entries(c.exclusions).flatMap(([reason,weeks])=>weeks.map((w,i)=><tr key={reason+i}><td>{reason}</td><td>{i+1}</td><td>{fmt(w.spend,2)}</td><td>{w.pays}</td></tr>))}</Table><details><summary>Кампанії з нерозпізнаною датою ({c.invalid.length})</summary>{c.invalid.map(n=><p key={n}>{n}</p>)}</details><details><summary>Виключені назви у тестах ({c.badNames.length})</summary>{c.badNames.map(n=><p key={n}>{n}</p>)}</details></>}
 </>;
}
function CreativeTable({r,p,scale}:{r:Report;p:Page;scale:boolean}){
 const spendLimit=fmt(r.rule.minSpend);
 const heads=scale?['Креатив','Запуск / тиждень','Тест, грн','Оплати в тесті','CMC тесту','Поза тестом, грн','Т1','Т2','Т3','Т4','Т5','Оплати поза','CMC поза','ROAS поза','Кампанії та витрати']:['Креатив','Запуск / тиждень','Тест, грн','Ліди','CPL','ПУ','Оплати','CR','CMC','ROAS','Поза тестом, грн','Оплати поза','CMC поза','Усі оплати','Позначки'];
 return <><Table heads={heads}>{p.rows.map(v=><tr key={v.name}><td className="name">{v.name}</td><td>{dateLabel(v.launch)} · Т{v.launchWeek}</td><td>{fmt(v.test.spend)}</td>{scale?<><td>{v.test.pays}</td><td>{fmt(kpi(v.test,'CMC'))}</td><td>{fmt(v.out.spend)}</td>{v.outWeeks.map((w,i)=><td key={i}>{fmt(w.spend)}</td>)}<td>{v.out.pays}</td><td>{fmt(kpi(v.out,'CMC'))}</td><td>{pct(kpi(v.out,'ROAS'))}</td><td className="name">{v.campaigns.map(([name,amt])=><div key={name}>{name} · {fmt(amt)} грн</div>)}</td></>:<><td>{v.test.leads}</td><td>{fmt(kpi(v.test,'CPL'))}</td><td>{pct(ratio(v.test.invites,v.test.leads,100))}</td><td>{v.test.pays}</td><td>{pct(ratio(v.test.pays,v.test.leads,100))}</td><td>{fmt(kpi(v.test,'CMC'))}</td><td>{pct(kpi(v.test,'ROAS'))}</td><td>{fmt(v.out.spend)}</td><td>{v.out.pays}</td><td>{fmt(kpi(v.out,'CMC'))}</td><td>{v.test.pays+v.out.pays}</td><td>{[v.inTest&&'У плані в тесті',v.inOut&&'У плані поза тестом',v.late&&'Пізній запуск',v.test.spend<r.rule.minSpend&&'До '+spendLimit+' грн'].filter(Boolean).join(' · ')||'—'}</td></>}</tr>)}
 {scale&&p.tail&&p.tail.count>0&&<tr><td colSpan={5}>Ще {p.tail.count} креативів &lt; {spendLimit} грн</td><td>{fmt(p.tail.spend)}</td><td colSpan={5}></td><td>{p.tail.pays}</td><td colSpan={3}></td></tr>}
 {scale&&<tr><th colSpan={5}>Разом за цикл</th><td>{fmt(r.outside.spend)}</td><td colSpan={5}></td><td>{r.outside.pays}</td><td>{fmt(kpi(r.outside,'CMC'))}</td><td>{pct(kpi(r.outside,'ROAS'))}</td><td/></tr>}</Table>{!p.total&&<p>Немає креативів за цими фільтрами.</p>}</>;
}
type DeliveryPage={total:number;rows:{name:string;launch:string;launchWeek:number;test:number;out:number;campaigns:[string,number][]}[]};
function DeliveryTable({end,subject,buyer,scale,onExpired}:{end:string;subject:string;buyer:string;scale:boolean;onExpired:()=>void}) {
 const [q,setQ]=useState(''),[week,setWeek]=useState('0'),[page,setPage]=useState(1);
 const [result,setResult]=useState<DeliveryPage|null>(null),[error,setError]=useState('');
 useEffect(()=>{const c=new AbortController();setResult(null);setError('');
 const t=setTimeout(()=>{api<DeliveryPage>('delivery',{cycle_end:end,subject,buyer,q,week,page:String(page),mode:scale?'scale':'all'},undefined,c.signal).then(setResult).catch(e=>{if(!c.signal.aborted){if(e.status===401)onExpired();else setError(message(e));}})},120);
 return()=>{c.abort();clearTimeout(t)}},[end,subject,buyer,scale,q,week,page,onExpired]);
 return <><div className="tools"><label>Назва креативу<input type="search" value={q} onChange={e=>{setQ(e.target.value);setPage(1)}}/></label><label>Тиждень запуску<select value={week} onChange={e=>{setWeek(e.target.value);setPage(1)}}><option value="0">Усі</option>{[1,2,3,4,5].map(w=><option key={w}>{w}</option>)}</select></label></div>
 {error?<p role="alert">{error}</p>:result?<><p className="small">{result.total} креативів за вибраними фільтрами</p><Table heads={['Креатив','Запуск','Тиждень','Спенд тесту, грн','Спенд поза тестом, грн','Кампанії масштабу']}>{result.rows.map(v=><tr key={v.name}><td className="name">{v.name}</td><td>{dateLabel(v.launch)}</td><td>{v.launchWeek}</td><td>{fmt(v.test,2)}</td><td>{fmt(v.out,2)}</td><td className="name">{v.campaigns.map(([n,x])=><div key={n}>{n} · {fmt(x)} грн</div>)}</td></tr>)}</Table>{result.total>50&&<div className="tools"><button className="btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Попередня</button>{page} / {Math.ceil(result.total/50)}<button className="btn" disabled={page*50>=result.total} onClick={()=>setPage(p=>p+1)}>Наступна</button></div>}</>:<p>Завантажуємо таблицю…</p>}</>;
}
function Dashboard({logout,onExpired}:{logout:()=>void;onExpired:()=>void}){
 const [subject,setSubject]=useState<Direction>('adult'),[buyer,setBuyer]=useState('Julia'),[cycle,setCycle]=useState(''),[cycles,setCycles]=useState<string[]>([]);
 const [tab,setTab]=useState<Tab>('Огляд'),[data,setData]=useState<Payload|null>(null),[error,setError]=useState(''),[tick,setTick]=useState(0);
 const [page,setPage]=useState(1),[search,setSearch]=useState(''),[mode,setMode]=useState('all'),[week,setWeek]=useState('0'),[table,setTable]=useState<Page|null>(null),[tableError,setTableError]=useState('');
 useEffect(()=>{const c=new AbortController();api<{cycles:string[]}>('cycles',{},undefined,c.signal).then(x=>setCycles(x.cycles)).catch(()=>{});return()=>c.abort()},[tick]);
 useEffect(()=>{const c=new AbortController();setData(null);setError('');setPage(1);api<Payload>('dashboard',{subject,buyer,cycle_end:cycle},undefined,c.signal).then(setData).catch(e=>{if(!c.signal.aborted){if(e.status===401)onExpired();else setError(message(e));}});return()=>c.abort()},[subject,buyer,cycle,tick,onExpired]);
 useEffect(()=>{setTable(null);setTableError('');if(!data?.ready||!['Креативи','Масштаб'].includes(tab))return;
  const c=new AbortController(),scale=tab==='Масштаб';
  const timer=setTimeout(()=>{api<Page>('creatives',{subject,buyer,cycle_end:data.end,page:String(page),mode:scale?'scale':mode,q:scale?'':search,week:scale?'0':week},undefined,c.signal).then(setTable).catch(e=>{if(!c.signal.aborted){if(e.status===401)onExpired();else setTableError(message(e));}})},100);
  return()=>{clearTimeout(timer);c.abort()}},[data,tab,page,mode,search,week,subject,buyer,onExpired]);
 const inv=data?.inventory.filter(i=>i.subject===directions[subject][1]&&i.student_type===directions[subject][2])||[];
 const options=[...new Set(['Julia',buyer,...inv.map(i=>i.buyer)])];
 const filtered=inv.filter(i=>buyer==='Всі'||i.buyer===buyer);
 return <><div className="heading"><div><h1>Creative Radar</h1><p className="sub">Результати тестів і масштабування креативів</p></div><button className="btn" onClick={logout}>Вийти</button></div>
 <div className="tools"><label>Напрям<select value={subject} onChange={e=>{setSubject(e.target.value as Direction);setBuyer('Всі')}}>{Object.entries(directions).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label>
 <label>Баєр<select value={buyer} onChange={e=>setBuyer(e.target.value)}>{['Всі',...options.filter(b=>b!=='Всі')].map(b=><option key={b}>{b}</option>)}</select></label>
 <label>Цикл<select value={cycle} onChange={e=>setCycle(e.target.value)}><option value="">Останній повний цикл</option>{cycles.map(d=><option key={d} value={d}>{dateLabel(d,-34)} — {dateLabel(d)}</option>)}</select></label></div>
 <nav className="nav" aria-label="Розділи">{tabs.map(t=><button key={t} aria-pressed={tab===t} onClick={()=>{setTab(t);setPage(1)}}>{t}</button>)}</nav>
 {error?<div className="notice" role="alert">{error} <button className="btn" onClick={()=>setTick(n=>n+1)}>Оновити</button></div>:!data?<p role="status">Завантажуємо цикл…</p>:<>
 <p className="source">BigQuery · {dateLabel(data.end,-34)} — {dateLabel(data.end)} · оновлено {new Date(data.updated).toLocaleString('uk-UA',{timeZone:'Europe/Kyiv'})} за Києвом</p>
 {!cycle&&data.end<data.expected&&<p className="notice">Оновлення за цикл до {dateLabel(data.expected)} затримується. Нижче останній доступний цикл.</p>}
 {tab==='Звірка даних'?<ChecksPanel data={data}/>:!data.report?<><h2>{directions[subject][0]}</h2><div className="notice">Win rate очікує звірки оплат та правил тесту для цього зрізу. Деталі — у розділі «Звірка даних».</div>{data.delivery&&<p className="source">За поточними правилами відбору — {fmt(data.delivery.count)} креативів · {fmt(data.delivery.test)} грн у тестах.</p>}{data.delivery && (tab==='Креативи'||tab==='Масштаб')?<DeliveryTable key={[subject,buyer,tab,data.end].join('/')} end={data.end} subject={subject} buyer={buyer} scale={tab==='Масштаб'} onExpired={onExpired}/>:<Table heads={['Баєр','Facebook-кампанії з витратами']}>{filtered.map(i=><tr key={i.buyer}><td>{i.buyer}</td><td>{fmt(i.campaigns)}</td></tr>)}</Table>}</>:tab==='Огляд'?<Overview r={data.report}/>:<>
 <div className="section"><h2>{tab==='Масштаб'?'Що з тестів пішло в масштаб':'Усі протестовані креативи'}</h2></div>
 {tab==='Креативи'&&<div className="tools"><label>Пошук за неймінгом<input type="search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></label>
 <label>Результат<select value={mode} onChange={e=>{setMode(e.target.value);setPage(1)}}><option value="all">Усі</option><option value="won">У плані</option><option value="small">Мало спенду</option></select></label><label>Тиждень запуску<select value={week} onChange={e=>{setWeek(e.target.value);setPage(1)}}><option value="0">Усі тижні</option>{[1,2,3,4,5].map(w=><option key={w}>{w}</option>)}</select></label></div>}
 {tableError?<p role="alert">{tableError}</p>:!table?<p>Завантажуємо таблицю…</p>:<><CreativeTable r={data.report} p={table} scale={tab==='Масштаб'}/>{table.total>50&&<div className="tools"><button className="btn" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Попередня</button><span>{page} / {Math.ceil(table.total/50)}</span><button className="btn" disabled={page*50>=table.total} onClick={()=>setPage(p=>p+1)}>Наступна</button></div>}</>}</>}</>}</>;
}
export default function App(){
 const [session,setSession]=useState<Session>('loading'),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const expired=useCallback(()=>setSession('login'),[]);
 async function verify(){setSession('loading');setError('');try{await api('verify');setSession('active')}catch(e){if(e instanceof ApiError&&e.status===401)setSession('login');else{setSession('error');setError(message(e));}}}
 useEffect(()=>{void verify()},[]);
 async function login(e:FormEvent){e.preventDefault();setBusy(true);setError('');try{await api('login',{}, {password});setPassword('');setSession('active')}catch(e){setError(message(e))}finally{setBusy(false)}}
 async function logout(){try{await api('logout',{},{});setSession('login');setError('')}catch(e){setError(message(e))}}
 return <><header><div className="bar"><div className="identity"><span className="ring" aria-hidden="true"/>JustSchool</div><span className="scope">Marketing</span></div></header><main>{session==='active'?<><Dashboard logout={logout} onExpired={expired}/>{error&&<p role="alert">{error}</p>}</>:<section className="login surface"><h1>Creative Radar</h1>{session==='loading'?<p>Перевіряємо доступ…</p>:session==='error'?<><p role="alert">{error}</p><button className="btn" onClick={verify}>Спробувати ще раз</button></>:<form onSubmit={login}><label>Командний пароль<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert">{error}</p>}<button className="btn primary" disabled={busy}>{busy?'Входимо…':'Увійти'}</button></form>}</section>}</main></>;
}
