export type Totals = {spend:number;leads:number;invites:number;pays:number;revenue:number};
export type Week = {start:string;test:Totals;rest:Totals;creativeSpend:number;control:{account:number;test:number}};
export type Rule = {cmc:number;minPays:number;minSpend:number;lateDays:number;buyer:string};
export type Checks = {inconsistentWeeks:string[];invalid:string[];badNames:string[];unresolved:Totals;exclusions:Record<string,Totals[]>};
export type Report = {rule:Rule;test:Totals;rest:Totals;outside:Totals;testedPays:number;outPays:number;weekly:Week[];count:number;won:number;wonTest:number;wonOut:number;late:number;matureWon:number;small:number;withPay:number;scaled:number;checks:Checks};
export type Creative = {name:string;launch:string;launchWeek:number;test:Totals;out:Totals;outWeeks:Totals[];campaigns:[string,number][];inTest:boolean;inOut:boolean;late:boolean};
export type Payload = {delivery?:{count:number;test:number;rest:number}|null;end:string;expected:string;updated:string;ready:boolean;inventory:{subject:string;student_type:string;buyer:string;campaigns:number}[];report:Report|null;checks:Checks|null;reference:{passed:boolean;cycle:string|null;rows:{metric:string;expected:number|null;actual:number|null;ok:boolean}[]}|null};
export type Page = {rows:Creative[];total:number;tail:{count:number;spend:number;pays:number}|null};
export const directions = {adult:['Англійська · дорослі','English','Adult'],child:['Англійська · діти','English','Child'],math:['Математика','Math','Child'],prog:['Програмування','Programming','Child']} as const;
export type Direction = keyof typeof directions;
export const fmt=(v:number|null|undefined,digits=0)=>v==null?'—':new Intl.NumberFormat('uk-UA',{maximumFractionDigits:digits}).format(v);
export const ratio=(v:number,base:number,scale=1)=>base?v/base*scale:null;
export function dateLabel(value:string,days=0){const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toLocaleDateString('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'});}
export function kpi(m:Totals,metric:'CMC'|'CPL'|'ROAS'){return metric==='ROAS'?ratio(m.revenue,m.spend,100):ratio(m.spend,metric==='CMC'?m.pays:m.leads);}
export const pct=(v:number|null)=>v===null?'—':fmt(v,1)+'%';
