import React from 'react';

export function Input({label,placeholder,value,onChange,type='text',error,hint,disabled=false,required=false,prefix,suffix,size='md',style}){
  const [focus,setFocus]=React.useState(false);
  const h=size==='sm'?40:size==='lg'?56:48;
  const borderColor=error?'var(--danger-border)':focus?'var(--border-brand)':'var(--border-default)';
  return (
    <label style={{display:'flex',flexDirection:'column',gap:'var(--space-2)',fontFamily:'var(--font-core)',...style}}>
      {label&&<span style={{fontSize:'var(--fs-body)',fontWeight:'var(--fw-semibold)',color:'var(--text-body)'}}>
        {label}{required&&<span style={{color:'var(--brand)'}}> *</span>}
      </span>}
      <span style={{display:'flex',alignItems:'center',gap:'var(--space-2)',height:h,padding:'0 16px',
        background:disabled?'var(--base-100)':'var(--base-50)',
        border:'var(--border-regular) solid '+borderColor,borderRadius:'var(--radius-md)',
        boxShadow:focus&&!error?'var(--focus-ring)':'none',
        transition:'border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)'}}>
        {prefix&&<span style={{color:'var(--text-muted)',display:'flex'}}>{prefix}</span>}
        <input type={type} value={value} placeholder={placeholder} disabled={disabled}
          onChange={onChange} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',
            fontFamily:'var(--font-core)',fontSize:'var(--fs-body-lg)',fontWeight:'var(--fw-medium)',
            color:disabled?'var(--text-disabled)':'var(--text-strong)'}}/>
        {suffix&&<span style={{color:'var(--text-muted)',display:'flex'}}>{suffix}</span>}
      </span>
      {(error||hint)&&<span style={{fontSize:'var(--fs-label)',fontWeight:'var(--fw-medium)',
        color:error?'var(--danger)':'var(--text-muted)'}}>{error||hint}</span>}
    </label>
  );
}
