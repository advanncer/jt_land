import React from 'react';

const SHAPES={cross:'cross',chevron:'chevron',rings:'rings',burst:'burst'};

export function BrandShape({shape='burst',size=120,color='var(--element-orange)',opacity=1,rotate=0,assetBase='/assets/brand',style}){
  const name=SHAPES[shape]||'burst';
  return (
    <span aria-hidden="true" style={{display:'inline-block',width:size,height:size,color,opacity,
      transform:rotate?'rotate('+rotate+'deg)':'none',...style}}>
      <img src={assetBase+'/'+name+'.svg'} width={size} height={size} alt=""
        style={{display:'block',filter:'none'}}/>
    </span>
  );
}
