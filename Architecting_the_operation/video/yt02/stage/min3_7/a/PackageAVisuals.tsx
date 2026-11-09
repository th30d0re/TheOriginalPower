import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, KitSound, cubicOut, progress} from '@stage';
import {color} from '../../tokens';
import {ColoredTerm, type EquationTermId} from '../../equations';

export {ActionIcon, HeartIcon, NumberBadge, ScanLines, StickFigure, SystemIcon, WordIcon} from '@stage';

export type Box = {x:number; y:number; w:number; h:number};
export type Point = readonly [number,number];

export const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));
export const clamp = (value:number) => Math.max(0, Math.min(1, value));
/** Stage narration cues are milliseconds; kit timing is on the 30 fps composition timeline. */
export const cueFrame = (ms:number) => Math.round(ms * 30 / 1000);
export {BootIn, DrawLine, DrawRect, Flicker, KitSound};

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

export function Panel({id,box,opacity=1,accent,fillToken='color/fill/panel-render',startMs,durationMs=420,style,children}:{id:string;box:Box;opacity?:number;accent?:string;fillToken?:string;startMs?:number;durationMs?:number;style?:React.CSSProperties;children?:React.ReactNode}){
  const drawTiming=startMs===undefined ? {progress:1} : {startFrame:cueFrame(startMs),durationFrames:Math.round(durationMs*30/1000)};
  return <div {...shapeAttrs(id,box,'frame')} style={{...PANEL_STYLE,left:box.x,top:box.y,width:box.w,height:box.h,opacity,border:'none',background:'transparent',...style}}>
    <DrawRect id={`${id}-draw`} box={{x:0,y:0,w:box.w,h:box.h}} {...drawTiming} strokeToken={accent??'color/line/hairline'} fillToken={fillToken} glowToken={accent??'color/fill/gold'} notch={false}/>
    {children}
  </div>;
}

/** A panel whose approved resting geometry remains the ordinary Panel geometry. */
export function BootPanel({id,box,startMs,durationMs=500,beat=false,accent,style}:{id:string;box:Box;startMs:number;durationMs?:number;beat?:boolean;accent?:string;style?:React.CSSProperties}){
  return <BootIn box={box} startFrame={cueFrame(startMs)} durationFrames={Math.round(durationMs * 30 / 1000)} beat={beat}>
    <div {...shapeAttrs(id,box,'frame')} style={{...PANEL_STYLE,position:'absolute',inset:0,width:'100%',height:'100%',border:accent?`1px solid ${color(accent)}`:PANEL_STYLE.border,...style}}/>
  </BootIn>;
}

export function FlickerLabel({startMs,durationMs=460,beat=false,...props}:{startMs:number;durationMs?:number;beat?:boolean}&React.ComponentProps<typeof Label>){
  return <Flicker startFrame={cueFrame(startMs)} durationFrames={Math.round(durationMs * 30 / 1000)} beat={beat}><Label {...props}/></Flicker>;
}

export function AuditedTermBlock({id,box,term,summary,glyph,accent='color/fill/gold',unit,opacity=1,selected=false,framed=false,titleSize=27,summarySize=24,termId,ms,pulses,startMs}:{
  id:string;box:Box;term:string;summary?:string;glyph:React.ReactNode;accent?:string;unit?:string;opacity?:number;selected?:boolean;framed?:boolean;titleSize?:number;summarySize?:number;
  termId?:EquationTermId;ms?:number;pulses?:readonly number[];startMs?:number;
}){
  const title={x:box.x+92,y:box.y+18,w:box.w-112,h:66};
  const summaryBox={x:box.x+92,y:box.y+91,w:box.w-112,h:36};
  const icon={x:box.x+24,y:box.y+22,w:48,h:48};
  const unitBox={x:box.x+24,y:box.y+box.h-38,w:box.w-48,h:26};
  return <>
    <Panel id={`${id}-frame`} box={box} opacity={opacity} accent={selected||framed?accent:undefined} startMs={startMs}/>
    <div {...shapeAttrs(`${id}-icon`,icon,'mark',`${id}-icon`)} style={{position:'absolute',left:icon.x,top:icon.y,width:icon.w,height:icon.h,opacity,display:'grid',placeItems:'center'}}>{glyph}</div>
    {termId&&ms!==undefined
      ? <ColoredTerm term={termId} ms={ms} pulses={pulses} box={title} display={term} style={{position:'absolute',left:title.x,top:title.y,width:title.w,height:title.h,font:`650 ${titleSize}px "IBM Plex Sans"`,lineHeight:1.15,opacity}}/>
      : <Label id={`${id}-title`} box={title} size={titleSize} weight={650} lh={1.15} sans opacity={opacity}>{term}</Label>}
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
