import React from 'react';
import {BootIn, DrawRect, Flicker, FitBox, color, useStageMs} from '@stage';
import {interpolate, Img, staticFile} from 'remotion';
import {DashboardMap} from '../dashboard/DashboardMap';

export type Box={x:number;y:number;w:number;h:number};
export const frame=(ms:number)=>Math.round(ms*30/1000);

export function Panel({box,at,red=false,beat=false}:{box:Box;at:number;red?:boolean;beat?:boolean}){
  const stroke=red?'color/marker/race':'color/line/hairline-strong';
  const glow=red?'color/marker/race':'color/fill/gold';
  return <><BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={stroke} fillToken="rgba(9,18,28,0.72)" glowToken={glow} beat={beat}/><DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={stroke} fillToken="rgba(9,18,28,0.72)" glowToken={glow}/></>;
}

export function Copy({at,box,children,size=26,tone='color/text/primary',align='left'}:React.PropsWithChildren<{at:number;box:Box;size?:number;tone?:string;align?:'left'|'center'|'right'}>){
  return <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="min50-53" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,font:`500 ${size}px "IBM Plex Sans"`,lineHeight:1.18,color:color(tone),textAlign:align}}>{children}</div></Flicker>;
}

export function Tag({at,x,y,text,red=false}:{at:number;x:number;y:number;text:string;red?:boolean}){
  const accent=red?'color/marker/race':'color/fill/gold';
  return <FitBox text={text} x={x} y={y} size={24} weight={600} tag="ARCHIVE" startFrame={frame(at)} durationFrames={16} textToken="color/text/primary" strokeToken={accent} fillToken="color/fill/panel-render" accentToken={accent} beat/>;
}

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const FADE_MS = 267; // ~8 frames at 30 fps

export function AtlanticMap({at,until,drawAt=at,coastAt,label}:{at:number;until?:number;drawAt?:number;coastAt?:number;label?:string}){
  const ms=useStageMs();
  if(ms<at||(until!==undefined&&ms>=until))return null;
  const end=until??at+6000;
  const fade=Math.min(FADE_MS,(end-at)/2);
  const move=interpolate(ms,[coastAt??drawAt,(coastAt??drawAt)+1200],[0,1],clamp);
  const draw=interpolate(ms,[drawAt,drawAt+1000],[0,1],clamp);
  const opacity=interpolate(ms,[at,at+fade,end-fade,end],[0,1,1,0],clamp);
  return <div style={{position:'absolute',inset:0,opacity,pointerEvents:'none'}}>
    <DashboardMap camera={{center:[-8-move*7,36-move*16],zoom:2.8}} draw={draw}/>
    {label&&<div data-text="map-label" data-box="116 928 500 28" style={{position:'absolute',left:116,top:928,font:'500 20px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/text/primary'),background:'rgba(9,18,28,.62)',padding:'7px 10px'}}>{label}</div>}
  </div>;
}

export function WorldMap({at,until,label}:{at:number;until?:number;label:string}){
  const ms=useStageMs();
  if(ms<at||(until!==undefined&&ms>=until))return null;
  const end=until??at+6000;
  const fade=Math.min(FADE_MS,(end-at)/2);
  const opacity=interpolate(ms,[at,at+fade,end-fade,end],[0,1,1,0],clamp);
  return <div style={{position:'absolute',inset:0,opacity,pointerEvents:'none'}}>
    <DashboardMap world mapOpacity={.94}/>
    <div data-text="map-label" data-box="116 928 620 28" style={{position:'absolute',left:116,top:928,font:'500 20px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/text/primary'),background:'rgba(9,18,28,.62)',padding:'7px 10px'}}>{label}</div>
  </div>;
}

export function CineStill({at,name,caption,until}:{at:number;name:string;caption?:string;until?:number}){
  const ms=useStageMs();
  if(ms<at||(until!==undefined&&ms>=until))return null;
  const end=until??at+6000;
  const fade=Math.min(FADE_MS,(end-at)/2);
  const opacity=interpolate(ms,[at,at+fade,end-fade,end],[0,1,1,0],clamp),scale=interpolate(ms,[at,end],[1,1.05],clamp);
  return <div style={{position:'absolute',inset:0,zIndex:20,overflow:'hidden',opacity,background:color('color/bg/field')}}>
    <Img src={staticFile(`stage/YT02v2_ov/cine/${name}.png`)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${scale})`}}/>
    {caption&&<div data-text="still-caption" style={{position:'absolute',left:92,bottom:76,font:'500 20px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/primary'),background:'rgba(9,18,28,.72)',padding:'10px 14px'}}>{caption}</div>}
  </div>;
}
