import React from 'react';

const SIZES={
  sm:{height:36,padding:'0 16px',fontSize:'var(--fs-label)'},
  md:{height:44,padding:'0 24px',fontSize:'var(--fs-button)'},
  lg:{height:56,padding:'0 32px',fontSize:'var(--fs-body-lg)'}
};

const VARIANTS={
  primary:{background:'var(--brand)',color:'var(--text-on-brand)',border:'none',hover:'var(--brand-hover)',active:'var(--brand-active)'},
  secondary:{background:'var(--base-50)',color:'var(--text-strong)',border:'var(--border-regular) solid var(--border-default)',hover:'var(--base-100)',active:'var(--base-200)'},
  ghost:{background:'transparent',color:'var(--brand)',border:'none',hover:'var(--orange-25)',active:'var(--orange-50)'},
  inverse:{background:'var(--base-50)',color:'var(--brand)',border:'none',hover:'var(--orange-25)',active:'var(--orange-50)'}
};

export function Button({variant='primary',size='md',fullWidth=false,disabled=false,iconLeft,iconRight,onClick,type='button',children,style}){
  const [h,setH]=React.useState(false);
  const [p,setP]=React.useState(false);
  const v=VARIANTS[variant]||VARIANTS.primary;
  const s=SIZES[size]||SIZES.md;
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setP(false)}}
      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'var(--space-2)',
        width:fullWidth?'100%':'auto',height:s.height,padding:s.padding,fontSize:s.fontSize,
        fontFamily:'var(--font-core)',fontWeight:'var(--fw-bold)',lineHeight:1,letterSpacing:'-0.01em',
        borderRadius:'var(--radius-pill)',border:v.border,cursor:disabled?'not-allowed':'pointer',
        background:disabled?'var(--base-200)':(p?v.active:h?v.hover:v.background),
        color:disabled?'var(--text-disabled)':v.color,
        boxShadow:variant==='primary'&&!disabled&&h?'var(--shadow-brand)':'none',
        transform:p&&!disabled?'scale(var(--press-scale))':'none',
        transition:'background var(--dur-fast) var(--ease-standard),transform var(--dur-instant) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',
        ...style}}>
      {iconLeft}{children}{iconRight}
    </button>
  );
}
