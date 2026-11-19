import React from 'react';

export function Dialog({open=false,title,description,onClose,footer,width=480,children}){
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',
      justifyContent:'center',padding:'var(--space-6)',background:'rgba(20,20,20,.48)',
      backdropFilter:'blur(4px)',fontFamily:'var(--font-core)'}}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:width,background:'var(--surface-card)',
        borderRadius:'var(--radius-2xl)',boxShadow:'var(--shadow-lg)',padding:'var(--space-8)',
        display:'flex',flexDirection:'column',gap:'var(--space-5)',
        animation:'none'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'var(--space-4)'}}>
          <div style={{display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
            {title&&<h2 style={{margin:0,fontSize:'var(--fs-h3-mobile)',fontWeight:'var(--fw-bold)',color:'var(--text-strong)'}}>{title}</h2>}
            {description&&<p style={{margin:0,fontSize:'var(--fs-body-lg)',lineHeight:'var(--lh-body)',color:'var(--text-secondary)'}}>{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Закрити"
            style={{flex:'0 0 auto',width:36,height:36,borderRadius:'var(--radius-circle)',border:'none',
              background:'var(--base-100)',cursor:'pointer',color:'var(--text-secondary)',fontSize:16}}>×</button>
        </div>
        {children}
        {footer&&<div style={{display:'flex',gap:'var(--space-3)',justifyContent:'flex-end'}}>{footer}</div>}
      </div>
    </div>
  );
}
