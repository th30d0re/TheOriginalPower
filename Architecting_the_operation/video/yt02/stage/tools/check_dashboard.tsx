import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {geoContains} from 'd3-geo';
import {feature} from 'topojson-client';
import atlas from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/world-atlas/countries-50m.json';
import {ClockContext,PlanContext,createProjection,catmullRomPath,resolveMode,flyTo,cubicInOut,type StagePlan} from '@stage';
import {DashboardBoot,Dashboard1486} from '../Scenes';
import {Dashboard} from '../dashboard/Dashboard';
import {DashboardMap,type Polities} from '../dashboard/DashboardMap';
import {PanelContent,instruments} from '../dashboard/PanelContent';
import {regionalProjection as project,worldCamera,iberiaCamera,iberiaFit,labelOffsets} from '../dashboard/mapGeometry';
import {wageReadings,dangerPolygon} from '../dashboard/ComplexWagePlane';
import map from '../handoff/map.json';
const plan=JSON.parse(fs.readFileSync(new URL('../review/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
// Fail at the hook call itself, including hooks in descendants reached by SSR.
for(const hook of ['useState','useEffect','useLayoutEffect','useReducer'] as const) {
 (React as any)[hook]=()=>{throw new Error(`${hook} reached in non-interactive render`);};
}
for(const hook of ['useState','useEffect','useLayoutEffect','useReducer'] as const){
 const Probe=()=>{(React as any)[hook]();return null;};
 assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}
function state(ms:number,expanded=false) {
 const segment=plan.segments.find(s=>ms>=s.start_ms&&ms<s.end_ms)!;
 const Scene=ms<6000?DashboardBoot:Dashboard1486;
 return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:30,interactive:false}}>{expanded?<Dashboard modes={{'wage-plane':'expanded'}}/>:<Scene segment={segment} shots={segment.shots} shotAt={time=>segment.shots.find(s=>time>=s.start_ms&&time<s.end_ms)}/>}</ClockContext.Provider></PlanContext.Provider>);
}
const times=[500,6200,6233.333333,7300,8400,13000,14500,14700,16000,18200,19500,19700,21000,22800];
if(process.env.DASHBOARD_SNAPSHOT==='1') {
 const result=[...times.map(ms=>state(ms)),state(13000,true)].map(html=>{
  const sections=html.match(/<section\b[\s\S]*?<\/section>/g)!;
  assert.equal(sections.length,10);assert.ok(!html.includes('NaN'));assert.ok(!html.includes('blur('));assert.ok(!html.includes('<button'));
  return {right:sections.slice(4,8),strips:sections.slice(8),whole:createHash('sha256').update(html).digest('hex')};
 });
 console.log(JSON.stringify(result));
} else {
 const points=map.iberia.route.waypoints.map(p=>project([p.lon,p.lat])!);
 const route=catmullRomPath(points,.4,'handoff');
 const nums=route.d.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!.map(Number);
 const land=feature(atlas as any,atlas.objects.land as any);
 let current=nums.slice(0,2),hits=0,samples=0;
 for(let i=2;i<nums.length;i+=6){const c1=nums.slice(i,i+2),c2=nums.slice(i+2,i+4),end=nums.slice(i+4,i+6);for(let j=0;j<=80;j++){const t=j/80,u=1-t,p=current.map((v,k)=>u**3*v+3*u*u*t*c1[k]+3*u*t*t*c2[k]+t**3*end[k]) as [number,number];hits+=Number(geoContains(land,project.invert!(p)!));samples++;}current=end;}
 assert.equal(hits,0,`route land hits ${hits}`);
 assert.equal(resolveMode(21000,[{at:19500,mode:'settings'}]).weights.settings,1);
 let previous=0;
 for(let ms=6200;ms<=8400;ms+=10){const camera=flyTo(ms,[{at:6200,camera:worldCamera},{at:8400,camera:iberiaCamera}],cubicInOut),p=createProjection(camera,'equalEarth',1856,968);assert.ok(p.scale()>=previous-1e-8,`zoom-out at ${ms}`);previous=p.scale();}
 const final=createProjection(iberiaCamera,'equalEarth',1856,968);
 for(const p of map.iberia.route.waypoints)assert.ok(Math.hypot(...project([p.lon,p.lat])!.map((v,i)=>v-final([p.lon,p.lat])![i]) as [number,number])<1e-8);
 const labels=map.iberia.markers.map((m,i)=>{const p=project(m.lonlat as [number,number])!;return {name:m.name,point:p,box:[p[0]+labelOffsets[i][0],p[1]-7,m.label.w+10,16]};});
 for(const {box:[x,y,w,h]} of labels){assert.ok(x>285&&x+w<1639&&y>0&&y+h<921,'label clear of compact rails, era and strips');}
 const rose=project(map.iberia.compassRose.centre_lonlat as [number,number])!;
 assert.ok(rose[0]>82&&rose[1]>89&&rose[1]+82<921);
 assert.ok(!geoContains(land,map.iberia.compassRose.centre_lonlat as [number,number]));
 for(const ms of times){const html=state(ms);assert.ok(!html.includes('NaN'));assert.equal(html,state(ms));assert.equal((html.match(/<section/g)??[]).length,10);if(ms===21000)assert.ok(html.includes('top:560.2px'));if(ms===500)assert.ok(html.includes('opacity:0.3'));}
 for(const name of Object.keys(instruments))for(const mode of ['compact','expanded','settings'] as const){const html=renderToStaticMarkup(<PanelContent name={name} mode={mode}/>);assert.ok(html.length>100);assert.ok(!html.includes('NaN'));}
 const expanded=state(13000,true);assert.ok(expanded.includes('left:922px;top:228px;width:960px;height:650px'));assert.ok(expanded.includes('top:886px'));assert.ok(expanded.includes('data-plane-size="420"'));
 const r=wageReadings();assert.deepEqual([r.theta,r.magnitude,r.clock,r.quadrant,r.M,r.margin,r.elite.s,r.elite.m],[90,60,'3:00',1,18,22,80,-36]);assert.deepEqual(dangerPolygon(),[[-100,-100],[100,-100],[100,-50],[-100,90]]);
 const polities:Polities={type:'FeatureCollection',features:[{type:'Feature',properties:{style:{fill:'#123456',stroke:'#654321'},label:{text:'TEST POLITY',at:[0,25]}},geometry:{type:'Polygon',coordinates:[[[0,20],[0,30],[10,30],[10,20],[0,20]]]}}]};
 const layer=renderToStaticMarkup(<DashboardMap polities={polities}/>);assert.ok(layer.includes('#123456'));assert.ok(layer.includes('TEST POLITY'));assert.ok(layer.indexOf('TEST POLITY')<layer.indexOf('stroke-dasharray'));
 const geometry={projection:'equalEarth',fit:iberiaFit,camera:iberiaCamera,scale:project.scale(),points,route:route.d,landHits:hits,samples,labels,hubs:map.iberia.rhumbLines.hubs_lonlat.map(p=>project(p as [number,number])),rose,clipMidpointExtents:{west:project.invert!([0,484]),east:project.invert!([1856,484]),north:project.invert!([928,0]),south:project.invert!([928,968])}};
 fs.writeFileSync(new URL('../review/map-geometry-fix1.json',import.meta.url),JSON.stringify(geometry,null,2)+'\n');
 console.log(`PASS: Equal Earth route ${samples} samples / ${hits} land hits; monotonic flight; label clearance; ${times.length} deterministic timeline states; all 30 instrument modes; 420 px wage plane, model and rail bounds; polity layer.`);
}
