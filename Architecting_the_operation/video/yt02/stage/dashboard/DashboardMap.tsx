import React from 'react';
import {MapStage, CompassRose, Route, useProject, type Camera} from '@stage';
import map from '../handoff/map.json';
import overlay from '../handoff/map_overlay.json';
import {color,Tokens} from '../tokens';
const m=map.iberia;
const points=m.route.waypoints.map(p=>[p.lon,p.lat] as [number,number]);
function Overlays({draw,world}:{draw:number;world:boolean}) {
 const project=useProject();
 if(world) return <text x={map.world.label.x} y={map.world.label.y+12} fontFamily={Tokens.fonts.mono} fontSize={12} letterSpacing={1} fill={color(map.world.label.fill)}>{map.world.label.text}</text>;
 const rose=project(m.compassRose.centre_lonlat as [number,number]);
 return <><Route waypoints={points} tension={.4} convention="handoff" draw={draw} stroke={color(m.route.stroke)} strokeWidth={m.route.strokeWidth} dashOverlay={{stroke:color(m.route.dashOverlay.stroke),strokeWidth:1,dasharray:m.route.dashOverlay.dasharray}}/><CompassRose engraved centre={rose} radius={70} starStroke={color(m.compassRose.star.stroke)} stroke={color('color/line/hairline-strong')} fill={color(m.compassRose.star.fill)} labelColor={color('color/text/primary')}/>{m.markers.map((v,i)=>{const [x,y]=project(v.lonlat as [number,number]);const reference=Object.values(overlay.iberia.named)[i];return <g key={v.name} opacity={draw>0?1:0}><circle cx={x} cy={y} r={v.marker.diameter/2} fill={color(v.marker.fill)} stroke={color(v.marker.stroke)} strokeWidth={v.marker.strokeWidth}/><text x={x+v.label.x-reference[0]} y={y+v.label.y-reference[1]+12} fontFamily={Tokens.fonts.mono} fontSize={12} letterSpacing={1} fill={color('color/text/primary')}>{v.label.text}</text></g>;})}</>;
}
export type DashboardMapProps={world?:boolean;camera?:Camera;draw?:number;worldOpacity?:number};
export function DashboardMap({world=false,camera,draw=1,worldOpacity=0}:DashboardMapProps) {
 const common={width:1856,height:968,engraved:true,clip:{x:0,y:0,width:1856,height:968},land:{fill:color(m.land.fill),stroke:color(m.land.stroke),strokeWidth:m.land.strokeWidth},borders:{stroke:color(m.countryBorders.stroke),strokeWidth:m.countryBorders.strokeWidth,opacity:1},graticule:{step:10,stroke:color(m.graticule.stroke),strokeWidth:.8,opacity:1},highlight:[{id:'620',color:color(m.portugal.fill),amount:1}]};
 return <div style={{position:'absolute',left:32,top:84,width:1856,height:968,overflow:'hidden'}}>{!world&&<MapStage {...common} {...(camera?{fit:{center:camera.center,pxPerDeg:camera.zoom}}:{fit:{center:[8,24.2] as [number,number],pxPerDeg:19.5}})} projection="equirectangular" rhumb={{centres:m.rhumbLines.hubs_lonlat as [number,number][],spokes:16,stroke:color(m.rhumbLines.stroke),strokeWidth:.8,opacity:1}}><Overlays draw={draw} world={false}/></MapStage>}{(world||worldOpacity>0)&&<div style={{position:'absolute',inset:0,opacity:world?1:worldOpacity}}><MapStage {...common} projection="naturalEarth" resolution="110m" camera={{center:[0,0],zoom:1}}><Overlays draw={0} world/></MapStage></div>}</div>;
}
