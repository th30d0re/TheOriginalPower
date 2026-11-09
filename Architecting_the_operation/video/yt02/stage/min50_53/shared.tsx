import React from 'react';
import {BootIn, DrawRect, Flicker, FitBox, color, useStageMs} from '@stage';
import {interpolate, Img, staticFile} from 'remotion';
import {DashboardMap} from '../dashboard/DashboardMap';

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

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export function AtlanticMap({at,drawAt=at,coastAt,label}:{at:number;drawAt?:number;coastAt?:number;label?:string}){
  const ms=useStageMs();
  const move=interpolate(ms,[coastAt??drawAt,(coastAt??drawAt)+3400],[0,1],clamp);
  const draw=interpolate(ms,[drawAt,drawAt+5200],[0,1],clamp);
  return <Flicker startFrame={frame(at)} durationFrames={14} beat><DashboardMap camera={{center:[-8-move*7,36-move*16],zoom:2.8}} draw={draw}/>{label&&<div data-text="map-label" data-box="116 928 500 28" style={{position:'absolute',left:116,top:928,font:'500 20px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/text/primary')}}>{label}</div>}</Flicker>;
}
export function WorldMap({at,label}:{at:number;label:string}){
  return <Flicker startFrame={frame(at)} durationFrames={14} beat><DashboardMap world mapOpacity={.94}/><div data-text="map-label" data-box="116 928 620 28" style={{position:'absolute',left:116,top:928,font:'500 20px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/text/primary')}}>{label}</div></Flicker>;
}

export function CineStill({at,name,caption,until}:{at:number;name:string;caption?:string;until?:number}){
  const ms=useStageMs(),scale=interpolate(ms,[at,at+6000],[1,1.08],clamp);
  if(until!==undefined&&ms>=until)return null;
  return <Flicker startFrame={frame(at)} durationFrames={14} beat style={{zIndex:20}}><div style={{position:'absolute',inset:0,overflow:'hidden',background:'#0d1b2a'}}><Img src={staticFile(`stage/YT02v2_ov/cine/${name}.png`)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${scale})`}}/>{caption&&<div data-text="still-caption" data-box="110 924 720 26" style={{position:'absolute',left:110,top:924,font:'500 20px "IBM Plex Mono"',letterSpacing:1.2,color:'#e8c99b',textShadow:'0 2px 8px #0d1b2a'}}>{caption}</div>}</div></Flicker>;
}
