import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {MapStage, Route, useProject, useProjection, color} from '@stage';
import {geoPath} from 'd3-geo';
import polities1486 from '../data/polities_1486.json';
import handoffMap from '../handoff/map.json';
import {Tokens} from '../tokens';
import type {FeatureCollection, Geometry} from 'geojson';

const frame=(ms:number)=>Math.round(ms*30/1000);
type Point=[number,number];
type Focus='iberia'|'coast'|'atlantic'|'rome';
type RouteKind='portugal'|'coast'|'trade'|'atlantic'|'rome';
const handoffMarkers=Object.fromEntries(handoffMap.iberia.markers.map(marker=>[marker.name,marker.lonlat as Point]));
const places:Record<string,Point>={Lisbon:handoffMarkers.Lisbon,Lagos:[-8.67,37.1],RioDeOro:[-13.3,23.6],Bojador:handoffMarkers['Cape Bojador'],Arguin:[-16,20.6],Senegal:[-17.5,15],CapeVerde:handoffMarkers['Cape Verde'],Elmina:handoffMarkers.Elmina,Rome:[12.5,41.9]};
const routes:Record<RouteKind,string[]>={
  portugal:['Lisbon','Lagos'],
  coast:['Lisbon','RioDeOro','Bojador','Arguin','Senegal'],
  trade:['Lisbon','Bojador','Senegal','CapeVerde'],
  atlantic:['Lisbon','Bojador','CapeVerde','Elmina'],
  rome:['Lisbon','Rome'],
};
const cameras:Record<Focus,{center:Point;zoom:number}>={iberia:{center:[-8,37],zoom:5.1},coast:{center:[-15,20],zoom:4.1},atlantic:{center:[-11,22],zoom:3.05},rome:{center:[1,39],zoom:2.9}};

function Polities(){
  const projection=useProjection(),path=geoPath(projection);
  const data=polities1486 as unknown as FeatureCollection<Geometry,{style?:{fill?:string;stroke?:string;strokeWidth?:number;opacity?:number}}>;
  return <g opacity={.72}>{data.features.map((feature,i)=>{const style=feature.properties?.style??{};return <path key={feature.id??i} d={path(feature)??''} fill={style.fill??'none'} stroke={style.stroke??color('color/line/wire')} strokeWidth={style.strokeWidth??.7} opacity={style.opacity??1}/>;})}</g>;
}
function Markers({names,visible}:{names:string[];visible:number}){
  const project=useProject();
  return <g opacity={visible}>{names.map(name=>{const point=places[name],p=project(point),left=name==='Elmina'||name==='Rome';return <g key={name}><circle cx={p[0]} cy={p[1]} r={5} fill={color('color/fill/gold')} stroke={color('color/bg/field')} strokeWidth={1.5}/><text x={p[0]+(left?11:-11)} y={p[1]-9} textAnchor={left?'start':'end'} fontFamily={Tokens.fonts.mono} fontSize={15} letterSpacing={1.2} fill={color('color/text/primary')}>{name.replace(/([A-Z])/g,' $1').trim().toUpperCase()}</text></g>;})}</g>;
}

/** Engraved map in the dashboard's projection, with a cue-driven route and labels. */
export function AtlanticMap({at,route='coast',focus='atlantic',labels}:{at:number;route?:RouteKind;focus?:Focus;labels?:string[]}){
  const current=useCurrentFrame(), progress=interpolate(current,[frame(at),frame(at)+32],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const points=routes[route].map(name=>places[name]);
  const markerNames=labels??Array.from(new Set(routes[route]));
  const origin=cameras.iberia, destination=cameras[focus];
  const camera={center:[interpolate(progress,[0,1],[origin.center[0],destination.center[0]]),interpolate(progress,[0,1],[origin.center[1],destination.center[1]])] as Point,zoom:interpolate(progress,[0,1],[origin.zoom,destination.zoom])};
  return <div style={{position:'absolute',left:32,top:84,width:1856,height:968,overflow:'hidden',opacity:progress}}>
    <MapStage width={1856} height={968} camera={camera} projection="equalEarth" engraved resolution="50m" clip={{x:0,y:0,width:1856,height:968}} land={{fill:color('color/surface/1'),stroke:color('color/line/wire'),strokeWidth:1.1}} borders={{stroke:color('color/line/border'),strokeWidth:.7,opacity:1}} graticule={{step:10,stroke:color('color/line/graticule'),strokeWidth:.8,opacity:1}} rhumb={{centres:[[-26,31],[-30,13],[-5,12],[-2,38]],spokes:16,stroke:color('color/line/graticule'),strokeWidth:.8,opacity:.65}}>
      <Polities/>
      <Route waypoints={points} tension={.4} convention="handoff" draw={progress} stroke={color('color/fill/gold')} strokeWidth={3.2} dashOverlay={{stroke:color('color/line/hairline-strong'),strokeWidth:1,dasharray:[2,7]}}/>
      <Markers names={markerNames} visible={progress}/>
    </MapStage>
  </div>;
}

/** A non-distorting, cue-faded illustration with a restrained Ken Burns move. */
export function CineStill({name,at,caption,durationFrames=78}:{name:string;at:number;caption?:string;durationFrames?:number}){
  const current=useCurrentFrame(), start=frame(at), reveal=interpolate(current,[start,start+12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}), exit=interpolate(current,[start+durationFrames-12,start+durationFrames],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}), scale=interpolate(current,[start,start+durationFrames],[1,1.08],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <div style={{position:'absolute',inset:0,overflow:'hidden',opacity:reveal*exit,background:color('color/bg/field')}}>
    <Img src={staticFile(`stage/YT02v2_ov/cine/${name}.png`)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${scale})`,transformOrigin:'50% 50%'}}/>
    {caption&&<div data-text="cinematic-caption" style={{position:'absolute',left:92,bottom:76,font:'500 20px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/primary'),background:color('color/fill/panel-render'),padding:'10px 14px'}}>{caption}</div>}
  </div>;
}
