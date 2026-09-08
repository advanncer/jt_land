import React from 'react';

const SIZES={sm:32,md:40,lg:48};

export function IconButton({variant='secondary',size='md',disabled=false,label,onClick,children,style}){
  const [h,setH]=React.useState(false);
  const d=SIZES[size]||SIZES.md;
  const skin=variant==='primary'
    ? {background:h?'var(--brand-hover)':'var(--brand)',color:'var(--text-on-brand)',border:'none'}
    : variant==='ghost'
    ? {background:h?'var(--base-100)':'transparent',color:'var(--text-secondary)',border:'none'}
    : {background:h?'var(--base-100)':'var(--base-50)',color:'var(--text-strong)',border:'var(--border-hairline) solid var(--border-default)'};
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:d,height:d,display:'inline-flex',alignItems:'center',justifyContent:'center',
        borderRadius:'var(--radius-circle)',cursor:disabled?'not-allowed':'pointer',
        opacity:disabled?.5:1,transition:'background var(--dur-fast) var(--ease-standard)',...skin,...style}}>
      {children}
    </button>
  );
}
