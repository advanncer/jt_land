import React from 'react';

export function Tag({selected=false,removable=false,onClick,onRemove,children,style}){
  const [h,setH]=React.useState(false);
  return (
    <span onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:'inline-flex',alignItems:'center',gap:'var(--space-2)',height:36,padding:'0 16px',
        borderRadius:'var(--radius-pill)',cursor:onClick?'pointer':'default',
        border:'var(--border-regular) solid '+(selected?'var(--border-brand)':'var(--border-subtle)'),
        background:selected?'var(--orange-25)':(h&&onClick?'var(--base-100)':'var(--base-50)'),
        color:selected?'var(--orange-700)':'var(--text-secondary)',
        fontFamily:'var(--font-core)',fontWeight:'var(--fw-semibold)',fontSize:'var(--fs-body)',lineHeight:1,
        transition:'background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard)',...style}}>
      {children}
      {removable&&<span onClick={e=>{e.stopPropagation();onRemove&&onRemove()}} style={{cursor:'pointer',opacity:.6,fontWeight:'var(--fw-bold)'}}>×</span>}
    </span>
  );
}
