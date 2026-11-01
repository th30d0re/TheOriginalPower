import React from 'react';
import {MapStage, Route, useProject, useProjection, type Camera} from '@stage';
import map from '../handoff/map.json';
import polities1486 from '../data/polities_1486.json';
import {geoPath} from 'd3-geo';
import type {FeatureCollection,Geometry} from 'geojson';
import {iberiaFit,labelOffsets} from './mapGeometry';
import {color,Tokens} from '../tokens';
const m=map.iberia;
const points=m.route.waypoints.map(p=>[p.lon,p.lat] as [number,number]);
export const defaultPolities1486 = polities1486 as unknown as Polities;
function Overlays({draw,world}:{draw:number;world:boolean}) {
 const project=useProject();
 const portugal=project([-8.5,39.5]);
 if(world) return <text x={portugal[0]+12} y={portugal[1]-6} fontFamily={Tokens.fonts.mono} fontSize={12} letterSpacing={1} fill={color(map.world.label.fill)}>{map.world.label.text}</text>;
 return <><Route waypoints={points} tension={.4} convention="handoff" draw={draw} stroke={color(m.route.stroke)} strokeWidth={m.route.strokeWidth} dashOverlay={{stroke:color(m.route.dashOverlay.stroke),strokeWidth:1,dasharray:m.route.dashOverlay.dasharray}}/>{m.markers.map((v,i)=>{const [x,y]=project(v.lonlat as [number,number]);const offset=labelOffsets[i];return <g key={v.name} opacity={draw>0?1:0}><circle cx={x} cy={y} r={v.marker.diameter/2} fill={color(v.marker.fill)} stroke={color(v.marker.stroke)} strokeWidth={v.marker.strokeWidth}/><text x={x+offset[0]} y={y+offset[1]+12} fontFamily={Tokens.fonts.mono} fontSize={12} letterSpacing={1} fill={color('color/text/primary')}>{v.label.text}</text></g>;})}</>;
}
export type PolityProperties={Name?:string;FromYear?:number;ToYear?:number;style?:{fill?:string;stroke?:string;strokeWidth?:number;strokeDasharray?:string;opacity?:number};label?:{text:string;at:[number,number];color?:string}};
export type Polities=FeatureCollection<Geometry,PolityProperties>;
function PolityLayer({polities}:{polities?:Polities}) {
 const projection=useProjection(),path=geoPath(projection);
 return <g data-layer="polities">{polities?.features.map((feature,i)=>{const {style={},label}=feature.properties??{},point=label?projection(label.at):null;return <g key={feature.id??i}><path d={path(feature)??''} fill={style.fill??'none'} stroke={style.stroke??color('color/line/wire')} strokeWidth={style.strokeWidth??1} strokeDasharray={style.strokeDasharray} opacity={style.opacity??1}/>{label&&point&&<text x={point[0]} y={point[1]} fontFamily={Tokens.fonts.mono} fontSize={10} letterSpacing={0.8} fill={label.color??color('color/text/primary')}>{label.text}</text>}</g>;})}</g>;
}
export type DashboardMapProps={world?:boolean;camera?:Camera;draw?:number;worldOpacity?:number;mapOpacity?:number;polities?:Polities};
export function DashboardMap({world=false,camera,draw=1,worldOpacity=0,mapOpacity,polities}:DashboardMapProps) {
 const activePolities=world?undefined:(polities??defaultPolities1486);
 const hasPeriodPortugal=Boolean(activePolities?.features.some(f=>f.properties?.Name==='Kingdom of Portugal'));
 const common={width:1856,height:968,engraved:true,clip:{x:0,y:0,width:1856,height:968},land:{fill:color(m.land.fill),stroke:color(m.land.stroke),strokeWidth:m.land.strokeWidth},graticule:{step:10,stroke:color(m.graticule.stroke),strokeWidth:.8,opacity:1},highlight:hasPeriodPortugal?[]:[{id:'620',color:color(m.portugal.fill),amount:1}]};
 return <div style={{position:'absolute',left:32,top:84,width:1856,height:968,overflow:'hidden',...(mapOpacity===undefined?{}:{opacity:mapOpacity})}}>
 <MapStage {...common} {...(world?{camera:{center:[0,0] as [number,number],zoom:1}}:camera?{camera}:{fit:iberiaFit})} projection="equalEarth" rhumb={world?undefined:{centres:m.rhumbLines.hubs_lonlat as [number,number][],spokes:16,stroke:color(m.rhumbLines.stroke),strokeWidth:.8,opacity:1}}><PolityLayer polities={activePolities}/><Overlays draw={draw} world={world}/></MapStage>
 </div>;
}
