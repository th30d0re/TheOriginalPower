import React from 'react';
import {BootIn, DrawRect, Flicker, FitBox, color} from '@stage';

export type Box = {x:number;y:number;w:number;h:number};
export const frame=(ms:number)=>Math.round(ms*30/1000);

export function Copy({at,box,children,size=27,tone='color/text/primary',mono=false,align='left'}:React.PropsWithChildren<{at:number;box:Box;size?:number;tone?:string;mono?:boolean;align?:'left'|'center'}>){
  return <Flicker startFrame={frame(at)} durationFrames={15} beat><div data-text="min26_29-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px \"${mono?'IBM Plex Mono':'IBM Plex Sans'}\"`,lineHeight:1.18,color:color(tone),textAlign:align}}>{children}</div></Flicker>;
}

export function Panel({box,at,accent='color/fill/gold',children,beat=false}:React.PropsWithChildren<{box:Box;at:number;accent?:string;beat?:boolean}>){
  return <><BootIn box={box} startFrame={frame(at)} durationFrames={19} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat={beat}/><DrawRect box={box} startFrame={frame(at)} durationFrames={19} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent}/>{children}</>;
}

export function Tag({at,text,x,y,accent='color/fill/gold'}:{at:number;text:string;x:number;y:number;accent?:string}){
  return <FitBox text={text} x={x} y={y} size={25} weight={600} tag="TERM" startFrame={frame(at)} durationFrames={16} textToken="color/text/primary" strokeToken={accent} fillToken="color/fill/panel-render" accentToken={accent} beat/>;
}
