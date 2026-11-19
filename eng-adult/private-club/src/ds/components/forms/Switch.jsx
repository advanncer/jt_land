import React from 'react';

export function Switch({checked=false,onChange,label,disabled=false,size='md',style}){
  const w=size==='sm'?36:44,h=size==='sm'?20:24,knob=h-6;
  return (
    <label style={{display:'inline-flex',alignItems:'center',gap:'var(--space-3)',fontFamily:'var(--font-core)',
      cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,...style}}>
      <span onClick={()=>!disabled&&onChange&&onChange(!checked)}
        style={{position:'relative',flex:'0 0 auto',width:w,height:h,borderRadius:'var(--radius-pill)',
          background:checked?'var(--brand)':'var(--base-400)',
          transition:'background var(--dur-base) var(--ease-standard)'}}>
        <span style={{position:'absolute',top:3,left:checked?w-knob-3:3,width:knob,height:knob,
          borderRadius:'var(--radius-circle)',background:'var(--base-50)',boxShadow:'var(--shadow-xs)',
          transition:'left var(--dur-base) var(--ease-bounce)'}}/>
      </span>
      {label&&<span style={{fontSize:'var(--fs-body)',fontWeight:'var(--fw-medium)',color:'var(--text-body)'}}>{label}</span>}
    </label>
  );
}
