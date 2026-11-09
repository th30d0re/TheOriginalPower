import React from 'react';
import {BootIn, DrawRect, Flicker, FitBox, color} from '@stage';

export type Box={x:number;y:number;w:number;h:number};
export const frame=(ms:number)=>Math.round(ms*30/1000);

export function Panel({box,at,red=false,beat=false}:{box:Box;at:number;red?:boolean;beat?:boolean}){
  const stroke=red?'color/marker/race':'color/line/hairline-strong';
  const glow=red?'color/marker/race':'color/fill/gold';
  return <><BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={stroke} fillToken="color/fill/panel-render" glowToken={glow} beat={beat}/><DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={stroke} fillToken="color/fill/panel-render" glowToken={glow}/></>;
}

export function Copy({at,box,children,size=26,tone='color/text/primary',align='left'}:React.PropsWithChildren<{at:number;box:Box;size?:number;tone?:string;align?:'left'|'center'|'right'}>){
  return <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="min50-53" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px "IBM Plex Sans"`,lineHeight:1.18,color:color(tone),textAlign:align}}>{children}</div></Flicker>;
}

export function Tag({at,x,y,text,red=false}:{at:number;x:number;y:number;text:string;red?:boolean}){
  const accent=red?'color/marker/race':'color/fill/gold';
  return <FitBox text={text} x={x} y={y} size={24} weight={600} tag="ARCHIVE" startFrame={frame(at)} durationFrames={16} textToken="color/text/primary" strokeToken={accent} fillToken="color/fill/panel-render" accentToken={accent} beat/>;
}
