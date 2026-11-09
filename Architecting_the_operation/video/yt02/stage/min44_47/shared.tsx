import React from 'react';
import {BootIn, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, color, type SceneProps} from '@stage';

export type Box={x:number;y:number;w:number;h:number};
export const frame=(ms:number)=>Math.round(ms*30/1000);

export function Scene({segment,children}:{segment:SceneProps['segment'];children:React.ReactNode}) {
  return <StageSceneFrame segment={segment}><KitSound mode="beats">{children}</KitSound></StageSceneFrame>;
}

export function Panel({box,at,accent='color/fill/gold'}:{box:Box;at:number;accent?:string}) {
  return <><BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat/>
    <DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent}/></>;
}

export function Copy({at,box,children,size=28,tone='color/text/primary',mono=false,align='left'}:{at:number;box:Box;children:React.ReactNode;size?:number;tone?:string;mono?:boolean;align?:'left'|'center'|'right'}) {
  return <Flicker startFrame={frame(at)} durationFrames={15} beat><div data-text="min44-47" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px ${mono?'"IBM Plex Mono"':'"IBM Plex Sans"'}`,lineHeight:1.18,color:color(tone),textAlign:align}}>{children}</div></Flicker>;
}

export function Term({text,x,y,at,accent='color/fill/gold'}:{text:string;x:number;y:number;at:number;accent?:string}) {
  return <FitBox text={text} x={x} y={y} size={28} weight={600} tag="TERM" startFrame={frame(at)} durationFrames={16} textToken="color/text/primary" strokeToken={accent} fillToken="color/fill/panel-render" accentToken={accent} beat/>;
}
