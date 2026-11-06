import React from 'react';

const TONES={
  brand:{bg:'var(--orange-25)',fg:'var(--orange-700)'},
  success:{bg:'var(--success-surface)',fg:'var(--success)'},
  warning:{bg:'var(--warning-surface)',fg:'var(--yellow-700)'},
  danger:{bg:'var(--danger-surface)',fg:'var(--danger)'},
  info:{bg:'var(--info-surface)',fg:'var(--info)'},
  neutral:{bg:'var(--base-200)',fg:'var(--text-secondary)'},
  solid:{bg:'var(--brand)',fg:'var(--text-on-brand)'}
};

export function Badge({tone='brand',size='md',dot=false,children,style}){
  const t=TONES[tone]||TONES.brand;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:'var(--space-1)',
      height:size==='sm'?20:24,padding:size==='sm'?'0 8px':'0 10px',
      background:t.bg,color:t.fg,borderRadius:'var(--radius-pill)',
      fontFamily:'var(--font-core)',fontWeight:'var(--fw-bold)',
      fontSize:size==='sm'?'var(--fs-caption)':'var(--fs-label)',lineHeight:1,whiteSpace:'nowrap',...style}}>
      {dot&&<span style={{width:6,height:6,borderRadius:'var(--radius-circle)',background:'currentColor'}}/>}
      {children}
    </span>
  );
}
