import React from 'react';

export function Card({variant='raised',padding='lg',interactive=false,onClick,children,style}){
  const [h,setH]=React.useState(false);
  const pad={none:0,sm:'var(--space-4)',md:'var(--space-5)',lg:'var(--space-6)',xl:'var(--space-8)'}[padding];
  const skin={
    raised:{background:'var(--surface-card)',border:'none',boxShadow:h&&interactive?'var(--shadow-md)':'var(--shadow-sm)'},
    outlined:{background:'var(--surface-card)',border:'var(--border-hairline) solid var(--border-subtle)',boxShadow:'none'},
    warm:{background:'var(--surface-page-warm)',border:'none',boxShadow:'none'},
    brand:{background:'var(--surface-brand)',border:'none',boxShadow:'none',color:'var(--text-on-brand)'},
    inverse:{background:'var(--surface-inverse)',border:'none',boxShadow:'none',color:'var(--text-inverse)'}
  }[variant];
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{borderRadius:'var(--radius-xl)',padding:pad,overflow:'hidden',
        fontFamily:'var(--font-core)',cursor:interactive?'pointer':'default',
        transform:interactive&&h?'translateY(var(--lift-hover))':'none',
        transition:'transform var(--dur-base) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',
        ...skin,...style}}>
      {children}
    </div>
  );
}
