import React from 'react';

const TONES={
  success:{bg:'var(--success-surface)',fg:'var(--success)',border:'var(--success-border)'},
  warning:{bg:'var(--warning-surface)',fg:'var(--yellow-700)',border:'var(--warning-border)'},
  danger:{bg:'var(--danger-surface)',fg:'var(--danger)',border:'var(--danger-border)'},
  info:{bg:'var(--info-surface)',fg:'var(--info)',border:'var(--info-border)'},
  brand:{bg:'var(--orange-25)',fg:'var(--orange-700)',border:'var(--orange-100)'}
};

export function Toast({tone='success',title,message,icon,onDismiss,style}){
  const t=TONES[tone]||TONES.success;
  return (
    <div role="status" style={{display:'flex',alignItems:'flex-start',gap:'var(--space-3)',
      padding:'var(--space-4) var(--space-5)',background:t.bg,color:t.fg,
      border:'var(--border-hairline) solid '+t.border,borderRadius:'var(--radius-lg)',
      boxShadow:'var(--shadow-md)',fontFamily:'var(--font-core)',maxWidth:420,...style}}>
      {icon&&<span style={{display:'flex',flex:'0 0 auto',marginTop:1}}>{icon}</span>}
      <div style={{display:'flex',flexDirection:'column',gap:2,minWidth:0}}>
        {title&&<span style={{fontSize:'var(--fs-body)',fontWeight:'var(--fw-bold)'}}>{title}</span>}
        {message&&<span style={{fontSize:'var(--fs-label)',fontWeight:'var(--fw-medium)',opacity:.85}}>{message}</span>}
      </div>
      {onDismiss&&<button type="button" onClick={onDismiss} aria-label="Закрити"
        style={{marginLeft:'auto',border:'none',background:'none',cursor:'pointer',color:'currentColor',opacity:.6,fontSize:15}}>×</button>}
    </div>
  );
}
