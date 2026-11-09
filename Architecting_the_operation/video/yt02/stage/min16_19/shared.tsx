import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, StickFigure, color, type SceneProps} from '@stage';

export const frame = (ms:number) => Math.round(ms * 30 / 1000);
export type Box = {x:number;y:number;w:number;h:number};

export const Copy = ({at, box, children, size=28, tone='color/text/primary', align='left'}: React.PropsWithChildren<{at:number;box:Box;size?:number;tone?:string;align?:'left'|'center'|'right'}>) =>
  <Flicker startFrame={frame(at)} durationFrames={15} beat><div data-text="min16-19-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px "IBM Plex Sans"`,lineHeight:1.18,textAlign:align,whiteSpace:'pre-line',color:color(tone)}}>{children}</div></Flicker>;

export const Panel = ({box,at,accent='color/line/hairline-strong',children}:React.PropsWithChildren<{box:Box;at:number;accent?:string}>) => <>
  <BootIn box={box} startFrame={frame(at)} durationFrames={20} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat/>
  <DrawRect box={box} startFrame={frame(at)} durationFrames={20} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent}/>{children}
</>;

export const Arrow = ({at,points,red=false}: {at:number;points:[number,number][];red?:boolean}) => <DrawLine points={points} startFrame={frame(at)} durationFrames={18} strokeToken={red?'color/marker/race':'color/fill/gold'} glowToken={red?'color/marker/race':'color/fill/gold'} strokeWidth={5} end="arrow" beat/>;

export {FitBox, KitSound, StageSceneFrame, StickFigure, type SceneProps};
