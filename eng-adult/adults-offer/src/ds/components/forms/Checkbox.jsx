import React from 'react';

export function Checkbox({checked=false,onChange,label,description,disabled=false,style}){
  return (
    <label style={{display:'flex',alignItems:description?'flex-start':'center',gap:'var(--space-3)',
      fontFamily:'var(--font-core)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,...style}}>
      <span onClick={()=>!disabled&&onChange&&onChange(!checked)}
        style={{flex:'0 0 auto',width:22,height:22,marginTop:description?2:0,borderRadius:'var(--radius-xs)',
          display:'flex',alignItems:'center',justifyContent:'center',
          background:checked?'var(--brand)':'var(--base-50)',
          border:'var(--border-regular) solid '+(checked?'var(--brand)':'var(--border-strong)'),
          transition:'background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard)'}}>
        {checked&&<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.8 5 9.6 11 3.2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span style={{display:'flex',flexDirection:'column',gap:2}}>
        {label&&<span style={{fontSize:'var(--fs-body)',fontWeight:'var(--fw-medium)',color:'var(--text-body)'}}>{label}</span>}
        {description&&<span style={{fontSize:'var(--fs-label)',fontWeight:'var(--fw-regular)',color:'var(--text-muted)'}}>{description}</span>}
      </span>
    </label>
  );
}
