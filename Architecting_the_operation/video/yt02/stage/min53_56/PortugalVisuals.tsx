import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {color} from '../tokens';
import {DashboardMap} from '../dashboard/DashboardMap';
import {useStageMs} from '@stage';

type Point=[number,number];
type Focus='iberia'|'coast'|'atlantic'|'rome';
type RouteKind='portugal'|'coast'|'trade'|'atlantic'|'rome';
const cameras:Record<Focus,{center:Point;zoom:number}>={iberia:{center:[-8,37],zoom:5.1},coast:{center:[-15,20],zoom:4.1},atlantic:{center:[-11,22],zoom:3.05},rome:{center:[1,39],zoom:2.9}};
const routeText:Record<RouteKind,string>={portugal:'LISBON → LAGOS',coast:'LISBON → RIO DE ORO → BOJADOR → SENEGAL',trade:'LISBON → BOJADOR → SENEGAL → CAPE VERDE',atlantic:'LISBON → BOJADOR → CAPE VERDE → ELMINA',rome:'LISBON → ROME'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const FADE_MS=267; // ~8 frames at 30 fps

/** The known-good dashboard engraving, constrained to one explicit cue window. */
export function AtlanticMap({at,until,route='coast',focus='atlantic',labels}:{at:number;until?:number;route?:RouteKind;focus?:Focus;labels?:string[]}){
  const ms=useStageMs();
  if(ms<at||(until!==undefined&&ms>=until))return null;
  const end=until??at+6000;
  const fade=Math.min(FADE_MS,(end-at)/2);
  const opacity=interpolate(ms,[at,at+fade,end-fade,end],[0,1,1,0],clamp);
  const camera={center:cameras[focus].center,zoom:cameras[focus].zoom};
  const draw=interpolate(ms,[at+100,at+1000],[0,1],clamp);
  return <div style={{position:'absolute',inset:0,opacity,pointerEvents:'none'}}>
    <DashboardMap camera={camera} draw={draw} mapOpacity={.96}/>
    <div data-text="map-route" style={{position:'absolute',left:116,top:928,font:'500 18px "IBM Plex Mono"',letterSpacing:1.15,color:color('color/text/primary'),background:'rgba(9,18,28,.62)',padding:'7px 10px'}}>{labels?.join(' · ').toUpperCase()??routeText[route]}</div>
  </div>;
}

/** Full-frame illustration with the same strict eight-frame cue edges as maps. */
export function CineStill({name,at,until,caption}:{name:string;at:number;until?:number;caption?:string}){
  const ms=useStageMs();
  if(ms<at||(until!==undefined&&ms>=until))return null;
  const end=until??at+6000;
  const fade=Math.min(FADE_MS,(end-at)/2);
  const opacity=interpolate(ms,[at,at+fade,end-fade,end],[0,1,1,0],clamp),scale=interpolate(ms,[at,end],[1,1.05],clamp);
  return <div style={{position:'absolute',inset:0,zIndex:20,overflow:'hidden',opacity,background:color('color/bg/field')}}>
    <Img src={staticFile(`stage/YT02v2_ov/cine/${name}.png`)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${scale})`}}/>
    {caption&&<div data-text="cinematic-caption" style={{position:'absolute',left:92,bottom:76,font:'500 20px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/primary'),background:'rgba(9,18,28,.72)',padding:'10px 14px'}}>{caption}</div>}
  </div>;
}
