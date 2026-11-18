import React from 'react';

export function Select({label,options=[],value,onChange,placeholder='Виберіть…',disabled=false,error,style}){
  const [open,setOpen]=React.useState(false);
  const current=options.find(o=>(o.value??o)===value);
  const text=current?(current.label??current):placeholder;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'var(--space-2)',fontFamily:'var(--font-core)',position:'relative',...style}}>
      {label&&<span style={{fontSize:'var(--fs-body)',fontWeight:'var(--fw-semibold)',color:'var(--text-body)'}}>{label}</span>}
      <button type="button" disabled={disabled} onClick={()=>setOpen(o=>!o)}
        style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'var(--space-2)',
          height:48,padding:'0 16px',background:disabled?'var(--base-100)':'var(--base-50)',
          border:'var(--border-regular) solid '+(error?'var(--danger-border)':open?'var(--border-brand)':'var(--border-default)'),
          borderRadius:'var(--radius-md)',cursor:disabled?'not-allowed':'pointer',
          fontFamily:'var(--font-core)',fontSize:'var(--fs-body-lg)',fontWeight:'var(--fw-medium)',
          color:current?'var(--text-strong)':'var(--text-muted)',textAlign:'left'}}>
        <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{text}</span>
        <span style={{transform:open?'rotate(180deg)':'none',transition:'transform var(--dur-fast) var(--ease-standard)',
          color:'var(--text-muted)',fontSize:11}}>▼</span>
      </button>
      {open&&<div style={{position:'absolute',top:'100%',left:0,right:0,marginTop:'var(--space-1)',zIndex:20,
        background:'var(--base-50)',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-lg)',
        border:'var(--border-hairline) solid var(--border-subtle)',overflow:'hidden'}}>
        {options.map((o,i)=>{
          const v=o.value??o,l=o.label??o;
          return <div key={i} onClick={()=>{onChange&&onChange(v);setOpen(false)}}
            style={{padding:'12px 16px',fontSize:'var(--fs-body)',fontWeight:'var(--fw-medium)',cursor:'pointer',
              background:v===value?'var(--orange-25)':'transparent',color:v===value?'var(--orange-700)':'var(--text-body)'}}>{l}</div>;
        })}
      </div>}
      {error&&<span style={{fontSize:'var(--fs-label)',fontWeight:'var(--fw-medium)',color:'var(--danger)'}}>{error}</span>}
    </div>
  );
}
