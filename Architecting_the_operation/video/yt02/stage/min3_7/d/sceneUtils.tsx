import React from 'react';
import {cubicOut, progress} from '@stage';
import {color} from '../../tokens';

export type LayoutBox = {x:number;y:number;w:number;h:number};

export const clamp = (value:number) => Math.max(0, Math.min(1, value));
export const enter = (ms:number, at:number, duration=500) => cubicOut(progress(ms, at, at+duration));

export function FadeIn({ms, at, duration=500, children, style, dataBeat}:{ms:number;at:number;duration?:number;children:React.ReactNode;style?:React.CSSProperties;dataBeat?:string}) {
  if (ms < at) return null;
  const p=enter(ms,at,duration);
  return <div data-beat={dataBeat} style={{opacity:p,transform:`translateY(${14*(1-p)}px)`,...style}}>{children}</div>;
}

export function Panel({box, children, accent=false, style, dataPanel}:{box:LayoutBox;children?:React.ReactNode;accent?:boolean;style?:React.CSSProperties;dataPanel?:string}) {
  return <div data-panel={dataPanel} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',overflow:'hidden',background:color('color/fill/panel-render'),border:`1px solid ${accent?color('color/line/hairline-strong'):color('color/line/hairline')}`,...style}}>{children}</div>;
}

export function MiniNetwork({x,y,w,h,progress:rawProgress=1,hot=false}:{x:number;y:number;w:number;h:number;progress?:number;hot?:boolean}) {
  const p=clamp(rawProgress), layers=[3,4,4,3];
  const points=layers.map((count,layer)=>Array.from({length:count},(_,index)=>({x:x+layer*w/(layers.length-1),y:y+(index+1)*h/(count+1)})));
  return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}} aria-hidden="true">
    {points.slice(0,-1).flatMap((layer,li)=>layer.flatMap((a,ai)=>points[li+1].map((b,bi)=><line key={`${li}-${ai}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hot?color('color/fill/gold'):color('color/line/wire')} strokeWidth={hot?2.6:1.5} opacity={p*(hot?.72:.4)}/>)))}
    {points.flatMap((layer,li)=>layer.map((point,index)=><circle key={`${li}-${index}`} cx={point.x} cy={point.y} r={7+3*p} fill={color('color/bg/field')} stroke={li/(layers.length-1)<p?color('color/fill/gold'):color('color/line/hairline')} strokeWidth="2"/>))}
  </svg>;
}

export function CurveLane({box, mean, label, progress:rawProgress, tone='gold'}:{box:LayoutBox;mean:number;label:string;progress:number;tone?:'gold'|'red'}) {
  const p=clamp(rawProgress), axisY=box.y+box.h-44, left=box.x+34, right=box.x+box.w-28;
  const path=Array.from({length:61},(_,index)=>{
    const u=index/60, px=left+u*(right-left), g=Math.exp(-.5*34*(u-mean)*(u-mean)), py=axisY-g*(box.h-96);
    return `${index?'L':'M'}${px.toFixed(1)} ${py.toFixed(1)}`;
  }).join(' ');
  return <>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}} aria-hidden="true">
      <line x1={left} y1={axisY} x2={right} y2={axisY} stroke={color('color/line/hairline')} strokeWidth="1.5" opacity={p}/>
      <path d={path} fill="none" stroke={tone==='red'?color('color/marker/race'):color('color/fill/gold')} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
    </svg>
    <div style={{position:'absolute',left:box.x+24,top:box.y+18,font:'500 20px "IBM Plex Mono"',letterSpacing:1,color:tone==='red'?color('color/marker/race'):color('color/fill/gold'),opacity:p}}>{label}</div>
  </>;
}
