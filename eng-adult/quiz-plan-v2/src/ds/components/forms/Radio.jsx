import React from 'react';

export function Radio({checked=false,onChange,label,description,disabled=false,style}){
  return (
    <label onClick={()=>!disabled&&onChange&&onChange(true)}
      style={{display:'flex',alignItems:description?'flex-start':'center',gap:'var(--space-3)',
        fontFamily:'var(--font-core)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,...style}}>
      <span style={{flex:'0 0 auto',width:22,height:22,marginTop:description?2:0,borderRadius:'var(--radius-circle)',
        display:'flex',alignItems:'center',justifyContent:'center',background:'var(--base-50)',
        border:'var(--border-thick) solid '+(checked?'var(--brand)':'var(--border-strong)'),
        transition:'border-color var(--dur-fast) var(--ease-standard)'}}>
        {checked&&<span style={{width:10,height:10,borderRadius:'var(--radius-circle)',background:'var(--brand)'}}/>}
      </span>
      <span style={{display:'flex',flexDirection:'column',gap:2}}>
        {label&&<span style={{fontSize:'var(--fs-body)',fontWeight:'var(--fw-medium)',color:'var(--text-body)'}}>{label}</span>}
        {description&&<span style={{fontSize:'var(--fs-label)',fontWeight:'var(--fw-regular)',color:'var(--text-muted)'}}>{description}</span>}
      </span>
    </label>
  );
}
