import React from 'react';
import {BootIn, DrawRect, Flicker, color} from '@stage';

export type Box = {x:number; y:number; w:number; h:number};
export const frame=(ms:number)=>Math.round(ms*30/1000);
export const entered=(ms:number, at:number, duration=480)=>Math.max(0,Math.min(1,(ms-at)/duration));

export function Panel({box, at, accent='color/fill/gold', seed=1, children}:React.PropsWithChildren<{box:Box;at:number;accent?:string;seed?:number}>){
  return <>
    <BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat/>
    <DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} seed={seed}/>
    {children}
  </>;
}

export function Copy({id='copy', at, box, children, size=28, tone='color/text/primary', mono=false, align='left'}:React.PropsWithChildren<{id?:string;at:number;box:Box;size?:number;tone?:string;mono?:boolean;align?:'left'|'center'|'right'}>){
  return <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text={id} data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px ${mono?'"IBM Plex Mono"':'"IBM Plex Sans"'}`,lineHeight:1.22,color:color(tone),textAlign:align}}>{children}</div></Flicker>;
}
