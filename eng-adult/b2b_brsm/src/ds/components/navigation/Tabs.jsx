import React from 'react';

export function Tabs({items=[],value,onChange,variant='pill',style}){
  const active=value??(items[0]&&(items[0].value??items[0]));
  if(variant==='underline'){
    return (
      <div style={{display:'flex',gap:'var(--space-6)',borderBottom:'var(--border-hairline) solid var(--border-subtle)',
        fontFamily:'var(--font-core)',...style}}>
        {items.map((it,i)=>{const v=it.value??it,l=it.label??it,on=v===active;
          return <button key={i} type="button" onClick={()=>onChange&&onChange(v)}
            style={{padding:'0 0 12px',border:'none',background:'none',cursor:'pointer',
              fontFamily:'var(--font-core)',fontSize:'var(--fs-body-lg)',
              fontWeight:on?'var(--fw-bold)':'var(--fw-medium)',
              color:on?'var(--text-strong)':'var(--text-muted)',
              boxShadow:on?'inset 0 -3px 0 0 var(--brand)':'none',
              transition:'color var(--dur-fast) var(--ease-standard)'}}>{l}</button>;})}
      </div>
    );
  }
  return (
    <div style={{display:'inline-flex',gap:'var(--space-1)',padding:'var(--space-1)',
      background:'var(--surface-sunken)',borderRadius:'var(--radius-pill)',fontFamily:'var(--font-core)',...style}}>
      {items.map((it,i)=>{const v=it.value??it,l=it.label??it,on=v===active;
        return <button key={i} type="button" onClick={()=>onChange&&onChange(v)}
          style={{height:36,padding:'0 20px',borderRadius:'var(--radius-pill)',border:'none',cursor:'pointer',
            background:on?'var(--base-50)':'transparent',
            color:on?'var(--text-strong)':'var(--text-muted)',
            boxShadow:on?'var(--shadow-xs)':'none',
            fontFamily:'var(--font-core)',fontSize:'var(--fs-body)',
            fontWeight:on?'var(--fw-bold)':'var(--fw-semibold)',
            transition:'background var(--dur-fast) var(--ease-standard)'}}>{l}</button>;})}
    </div>
  );
}
