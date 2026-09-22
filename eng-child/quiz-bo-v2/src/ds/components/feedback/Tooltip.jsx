import React from 'react';

export function Tooltip({content,placement='top',children,style}){
  const [show,setShow]=React.useState(false);
  const pos={
    top:{bottom:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)'},
    bottom:{top:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)'},
    left:{right:'calc(100% + 8px)',top:'50%',transform:'translateY(-50%)'},
    right:{left:'calc(100% + 8px)',top:'50%',transform:'translateY(-50%)'}
  }[placement];
  return (
    <span style={{position:'relative',display:'inline-flex',...style}}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show&&<span role="tooltip" style={{position:'absolute',zIndex:60,whiteSpace:'nowrap',
        padding:'6px 10px',background:'var(--surface-inverse)',color:'var(--text-inverse)',
        borderRadius:'var(--radius-sm)',fontFamily:'var(--font-core)',fontSize:'var(--fs-label)',
        fontWeight:'var(--fw-semibold)',boxShadow:'var(--shadow-md)',...pos}}>{content}</span>}
    </span>
  );
}
