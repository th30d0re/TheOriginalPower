import React from 'react';
import {BootIn, DrawRect, Flicker, FitBox, color} from '@stage';

export type Box = {x:number;y:number;w:number;h:number};
export const frame = (ms:number) => Math.round(ms * 30 / 1000);

export function Panel({box, at, red=false, beat=false}:{box:Box;at:number;red?:boolean;beat?:boolean}) {
  const stroke = red ? 'color/marker/race' : 'color/line/hairline-strong';
  return <><BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={stroke} fillToken="color/fill/panel-render" glowToken={red ? 'color/marker/race' : 'color/fill/gold'} beat={beat}/><DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={stroke} fillToken="color/fill/panel-render" glowToken={red ? 'color/marker/race' : 'color/fill/gold'}/></>;
}

export function Copy({at, box, children, size=26, tone='color/text/primary'}:React.PropsWithChildren<{at:number;box:Box;size?:number;tone?:string}>){
  return <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="min47-50" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px \"IBM Plex Sans\"`,lineHeight:1.18,color:color(tone)}}>{children}</div></Flicker>;
}

export function Label({at, x, y, text, tag='TERM', red=false}:{at:number;x:number;y:number;text:string;tag?:string;red?:boolean}){
  return <FitBox text={text} x={x} y={y} size={25} weight={600} tag={tag} startFrame={frame(at)} durationFrames={16} textToken="color/text/primary" strokeToken={red ? 'color/marker/race' : 'color/fill/gold'} fillToken="color/fill/panel-render" accentToken={red ? 'color/marker/race' : 'color/fill/gold'} beat/>;
}
