import React from 'react';
import {BootIn, DrawRect, Flicker, KitSound, StageSceneFrame, color, cubicOut, progress, type SceneProps} from '@stage';

export const frame=(ms:number)=>Math.round(ms*30/1000);
export const enter=(ms:number,at:number,duration=460)=>cubicOut(progress(ms,at,at+duration));

export type Box={x:number;y:number;w:number;h:number};

export const Panel=({box,at,accent='color/fill/gold',children}:{box:Box;at:number;accent?:string;children?:React.ReactNode})=><>
  <BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat/>
  <DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent}/>{children}
</>;

export const Copy=({at,box,children,size=28,tone='color/text/primary',mono=false,align='left'}:{at:number;box:Box;children:React.ReactNode;size?:number;tone?:string;mono?:boolean;align?:'left'|'center'|'right'})=><Flicker startFrame={frame(at)} durationFrames={15} beat><div data-text="min32-35" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px ${mono?'"IBM Plex Mono"':'"IBM Plex Sans"'}`,lineHeight:1.18,color:color(tone),textAlign:align}}>{children}</div></Flicker>;

export const Scene=({segment,children}:{segment:SceneProps['segment'];children:React.ReactNode})=><StageSceneFrame segment={segment}><KitSound mode="beats">{children}</KitSound></StageSceneFrame>;
