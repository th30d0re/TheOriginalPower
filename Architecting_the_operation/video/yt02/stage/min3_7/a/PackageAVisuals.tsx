import React from 'react';
import {cubicOut, progress} from '@stage';
import {color} from '../../tokens';

export type Box = {x:number; y:number; w:number; h:number};
export type Point = readonly [number,number];

export const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));
export const clamp = (value:number) => Math.max(0, Math.min(1, value));

const round=(value:number)=>Math.round(value*10)/10;
export const boxData=(box:Box)=>`${round(box.x)} ${round(box.y)} ${round(box.w)} ${round(box.h)}`;
export const textAttrs=(id:string,box:Box,fit?:{size:number;ls?:number;lh?:number;sans?:boolean})=>({
  'data-text':id,'data-box':boxData(box),
  ...(fit?{'data-fit':`${fit.sans?'sans':'mono'} ${fit.size} ${fit.ls??0} ${fit.lh??1.25}`}:{}),
});
export const shapeAttrs=(id:string,box:Box,role:'frame'|'mark'='mark',layer?:string)=>({
  'data-shape':id,'data-role':role,'data-box':boxData(box),...(layer?{'data-layer':layer}:{}),
});
export const lineAttrs=(id:string,points:readonly Point[],pad=2)=>{
  const xs=points.map(([x])=>x),ys=points.map(([,y])=>y);
  const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
  return {'data-shape':id,'data-role':'line','data-box':boxData({x:x-pad,y:y-pad,w:w+2*pad,h:h+2*pad}),'data-points':points.map(([px,py])=>`${round(px)},${round(py)}`).join(' ')};
};
export const pathFrom=(points:readonly Point[])=>points.map(([x,y],index)=>`${index?'L':'M'}${round(x)} ${round(y)}`).join(' ');

export function Label({id,box,children,size=20,weight=500,ls=0,lh=1.25,sans=false,align='left',ink,opacity=1,style}:{
  id:string;box:Box;children:React.ReactNode;size?:number;weight?:number;ls?:number;lh?:number;sans?:boolean;
  align?:'left'|'center'|'right';ink?:string;opacity?:number;style?:React.CSSProperties;
}){
  return <div {...textAttrs(id,box,{size,ls,lh,sans})} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',font:`${weight} ${size}px "${sans?'IBM Plex Sans':'IBM Plex Mono'}"`,letterSpacing:ls,lineHeight:lh,textAlign:align,color:ink??color('color/text/primary'),opacity,...style}}>{children}</div>;
}

export function Panel({id,box,opacity=1,accent,style}:{id:string;box:Box;opacity?:number;accent?:string;style?:React.CSSProperties}){
  return <div {...shapeAttrs(id,box,'frame')} style={{...PANEL_STYLE,left:box.x,top:box.y,width:box.w,height:box.h,opacity,border:accent?`1px solid ${color(accent)}`:PANEL_STYLE.border,...style}}/>;
}

export function AuditedTermBlock({id,box,term,summary,glyph,accent='color/fill/gold',unit,opacity=1,selected=false,titleSize=27,summarySize=24}:{
  id:string;box:Box;term:string;summary?:string;glyph:React.ReactNode;accent?:string;unit?:string;opacity?:number;selected?:boolean;titleSize?:number;summarySize?:number;
}){
  const title={x:box.x+92,y:box.y+18,w:box.w-112,h:66};
  const summaryBox={x:box.x+92,y:box.y+91,w:box.w-112,h:36};
  const icon={x:box.x+24,y:box.y+22,w:48,h:48};
  const unitBox={x:box.x+24,y:box.y+box.h-38,w:box.w-48,h:26};
  return <>
    <Panel id={`${id}-frame`} box={box} opacity={opacity} accent={selected?accent:undefined} style={{border:selected?`2px solid ${color(accent)}`:undefined}}/>
    <div {...shapeAttrs(`${id}-icon`,icon,'mark',`${id}-icon`)} style={{position:'absolute',left:icon.x,top:icon.y,width:icon.w,height:icon.h,opacity,display:'grid',placeItems:'center'}}>{glyph}</div>
    <Label id={`${id}-title`} box={title} size={titleSize} weight={650} lh={1.15} sans opacity={opacity}>{term}</Label>
    {summary&&<Label id={`${id}-summary`} box={summaryBox} size={summarySize} weight={400} lh={1.2} sans opacity={opacity} ink={color('color/text/soft')}>{summary}</Label>}
    {unit&&<Label id={`${id}-unit`} box={unitBox} size={20} weight={400} lh={1.25} opacity={opacity} ink={color('color/text/muted')}>{unit}</Label>}
  </>;
}

export function SceneSource({id='source',text,opacity=1}:{id?:string;text:string;opacity?:number}){
  return <Label id={id} box={{x:116,y:968,w:740,h:30}} size={20} weight={400} ls={.35} lh={1.35} opacity={opacity} ink={color('color/text/muted')}>{text}</Label>;
}

export const PANEL_STYLE:React.CSSProperties = {
  position:'absolute', boxSizing:'border-box', overflow:'hidden',
  background:color('color/fill/panel-render'), border:`1px solid ${color('color/line/hairline')}`,
};

export function NumberBadge({value, active=1}:{value:string; active?:number}) {
  return <div aria-hidden="true" style={{width:48,height:48,borderRadius:24,display:'grid',placeItems:'center',font:'500 24px "IBM Plex Mono"',color:color('color/fill/gold'),border:`2px solid ${color('color/fill/gold')}`,opacity:active}}>{value}</div>;
}

export function PersonIcon({tone='color/text/soft'}:{tone?:string}) {
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="14" r="8" fill="none" stroke={color(tone)} strokeWidth="2.5"/>
    <path d="M9 42 Q12 25 24 25 Q36 25 39 42" fill="none" stroke={color(tone)} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
}

export function ActionIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M7 24 H38 M28 13 L39 24 L28 35" fill="none" stroke={color('color/fill/gold')} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function SystemIcon({tone='color/text/soft'}:{tone?:string}) {
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    {[10,24,38].map((x,index)=><circle key={x} cx={x} cy={index===1?10:34} r="5" fill={color('color/bg/field')} stroke={color(tone)} strokeWidth="2"/>)}
    <path d="M13 31 L21 14 M27 14 L35 31 M15 34 H33" fill="none" stroke={color(tone)} strokeWidth="2"/>
  </svg>;
}

export function WordIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M6 10 H42 V34 H25 L16 42 V34 H6 Z" fill="none" stroke={color('color/text/soft')} strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M13 19 H35 M13 26 H29" stroke={color('color/fill/gold')} strokeWidth="2"/>
  </svg>;
}

export function HeartIcon() {
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z" fill="none" stroke={color('color/marker/race')} strokeWidth="2.5"/>
  </svg>;
}

export function CausalArrow({x1,x2,y,p=1,accent='color/fill/gold',width=3,id}:{x1:number;x2:number;y:number;p?:number;accent?:string;width?:number;id?:string}) {
  const end=x1+(x2-x1)*clamp(p);
  return <g data-causal-arrow={id}>
    <line x1={x1} y1={y} x2={end} y2={y} stroke={color(accent)} strokeWidth={width} strokeLinecap="round"/>
    {p>.88&&<path d={`M ${end-12} ${y-8} L ${end} ${y} L ${end-12} ${y+8}`} fill="none" stroke={color(accent)} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"/>}
  </g>;
}

export function ScanLines({x,y,w,h,progress:raw}:{x:number;y:number;w:number;h:number;progress:number}) {
  const p=clamp(raw);
  return <g aria-hidden="true" opacity={p}>
    {Array.from({length:7},(_,index)=>{
      const yy=y+index*h/6;
      return <line key={index} x1={x} y1={yy} x2={x+w*p} y2={yy} stroke={color('color/fill/gold')} strokeWidth="1" opacity={.25+index*.06}/>;
    })}
  </g>;
}
