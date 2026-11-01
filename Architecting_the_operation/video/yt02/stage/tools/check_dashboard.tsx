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
import {Dashboard,rail} from '../dashboard/Dashboard';
import {DashboardMap,defaultPolities1486,type Polities} from '../dashboard/DashboardMap';
import {PanelContent,instruments,formatCoord} from '../dashboard/PanelContent';
import {regionalProjection as project,worldCamera,iberiaCamera,iberiaFit,labelOffsets} from '../dashboard/mapGeometry';
import {wageReadings,dangerPolygon} from '../dashboard/ComplexWagePlane';
import {color} from '../tokens';
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

const times=[500,5600,6200,6233.333333,7300,8400,13000,14500,14700,16000,18200,19500,19700,21000,22800];

if(process.env.DASHBOARD_SNAPSHOT==='1') {
 const result=[...times.map(ms=>state(ms)),state(13000,true)].map(html=>{
  const sections=html.match(/<section\b[\s\S]*?<\/section>/g)!;
  assert.equal(sections.length,11);
  assert.ok(!html.includes('NaN'));
  assert.ok(!html.includes('blur('));
  assert.ok(!html.includes('<button'));
  assert.ok(html.includes('rgba(13,27,42,0.88)'));
  return {left:sections.slice(0,5),right:sections.slice(5,9),strips:sections.slice(9),whole:createHash('sha256').update(html).digest('hex')};
 });
 console.log(JSON.stringify(result));
} else {
 // 1. Panel legibility without blur
 assert.equal(color('color/fill/panel-render'),'rgba(13,27,42,0.88)');
 for(const name of Object.keys(instruments)) {
  for(const mode of ['compact','expanded','settings'] as const) {
   const html=renderToStaticMarkup(<PanelContent name={name} mode={mode}/>);
   assert.ok(html.length>100);
   assert.ok(!html.includes('NaN'));
   assert.ok(!html.includes('blur('));
   assert.ok(html.includes(color('color/fill/panel-render')),`${name} ${mode} missing panel-render fill`);
   assert.ok(html.includes(color('color/fill/panel-wash')),`${name} ${mode} missing panel-wash tint`);
   assert.ok(html.includes(color('color/line/hairline')),`${name} ${mode} missing hairline`);
  }
 }
 const interactiveCompact=renderToStaticMarkup(<ClockContext.Provider value={{ms:0,fps:30,interactive:true}}><PanelContent name="Era clock" mode="compact"/></ClockContext.Provider>);
 assert.ok(interactiveCompact.includes('blur(6px)'));

 // 2. Iberia framing under Equal Earth & route land-hit check
 const points=map.iberia.route.waypoints.map(p=>project([p.lon,p.lat])!);
 const route=catmullRomPath(points,.4,'handoff');
 const nums=route.d.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!.map(Number);
 const land=feature(atlas as any,atlas.objects.land as any);
 let current=nums.slice(0,2),hits=0,samples=0,routeMinY=Infinity,routeMaxY=-Infinity;
 for(let i=2;i<nums.length;i+=6){
  const c1=nums.slice(i,i+2),c2=nums.slice(i+2,i+4),end=nums.slice(i+4,i+6);
  for(let j=0;j<=80;j++){
   const t=j/80,u=1-t,p=current.map((v,k)=>u**3*v+3*u*u*t*c1[k]+3*u*t*t*c2[k]+t**3*end[k]) as [number,number];
   hits+=Number(geoContains(land,project.invert!(p)!));
   routeMinY=Math.min(routeMinY,p[1]);
   routeMaxY=Math.max(routeMaxY,p[1]);
   samples++;
  }
  current=end;
 }
 assert.equal(hits,0,`route land hits ${hits}`);
 assert.ok(routeMinY>12&&routeMaxY<921,`route vertical bounds ${routeMinY}..${routeMaxY} not clear of strips`);

 // Measure Portugal height in settled 1486 state
 const ptMainlandNorth=project([-8.2,42.113])!;
 const ptMainlandSouth=project([-7.9,37.002])!;
 const ptEnclaveSouth=project([-5.9,35.32])!;
 const portugalMainlandHeightPx=Number((ptMainlandSouth[1]-ptMainlandNorth[1]).toFixed(2));
 const portugalWithEnclaveHeightPx=Number((ptEnclaveSouth[1]-ptMainlandNorth[1]).toFixed(2));
 // handoff/svg/map.iberia.svg mainland Portugal height is 100.07 px (99 px in PNG; 130..140 px with route/enclave)
 assert.ok(portugalMainlandHeightPx>=90&&portugalMainlandHeightPx<=110,`mainland Portugal height ${portugalMainlandHeightPx}px outside ±10% of 100.07px`);
 assert.ok(portugalWithEnclaveHeightPx>=126&&portugalWithEnclaveHeightPx<=154,`Portugal mainland+enclave height ${portugalWithEnclaveHeightPx}px outside ±10% of 140px`);

 assert.equal(resolveMode(21000,[{at:19500,mode:'settings'}]).weights.settings,1);
 let previous=0;
 for(let ms=6200;ms<=8400;ms+=10){
  const camera=flyTo(ms,[{at:6200,camera:worldCamera},{at:8400,camera:iberiaCamera}],cubicInOut);
  const p=createProjection(camera,'equalEarth',1856,968);
  assert.ok(p.scale()>=previous-1e-8,`zoom-out at ${ms}`);
  previous=p.scale();
 }
 const final=createProjection(iberiaCamera,'equalEarth',1856,968);
 for(const p of map.iberia.route.waypoints) {
  assert.ok(Math.hypot(...project([p.lon,p.lat])!.map((v,i)=>v-final([p.lon,p.lat])![i]) as [number,number])<1e-8);
 }
 const labels=map.iberia.markers.map((m,i)=>{
  const p=project(m.lonlat as [number,number])!;
  return {name:m.name,point:p,box:[p[0]+labelOffsets[i][0],p[1]-7,m.label.w+10,16] as [number,number,number,number]};
 });
 for(const {name,box:[x,y,w,h]} of labels){
  assert.ok(x>317&&x+w<1639&&y>12&&y+h<921,`${name} label [${x},${y},${w},${h}] not clear of panels/strips`);
 }

 // 3. Compass widget & removal of map compass rose
 const mapHtml=renderToStaticMarkup(<DashboardMap/>);
 assert.ok(!mapHtml.includes('aria-label="Compass rose"'),'map still contains CompassRose');
 const compassCompact=renderToStaticMarkup(<PanelContent name="Compass" mode="compact"/>);
 const compassExpanded=renderToStaticMarkup(<PanelContent name="Compass" mode="expanded"/>);
 const compassSettings=renderToStaticMarkup(<PanelContent name="Compass" mode="settings"/>);
 assert.ok(compassCompact.includes('data-compass-rose="56"')&&compassCompact.includes('22.2°N 5.0°E')&&compassCompact.includes('500 km'));
 assert.ok(compassExpanded.includes('data-compass-rose="148"')&&compassExpanded.includes('Equal Earth')&&compassExpanded.includes('3.53×')&&compassExpanded.includes('1000 km'));
 assert.ok(compassSettings.includes('Šavrič, Patterson and Jenny, 2018')&&compassSettings.includes('Natural Earth, public domain; Cliopatria, CC BY 4.0, Bennett et al. 2025'));

 // Verify Compass updates during flyTo
 const flyStartHtml=state(6200);
 const flyMidHtml=state(7300);
 const flyEndHtml=state(8400);
 const midCamera=flyTo(7300,[{at:6200,camera:worldCamera},{at:8400,camera:iberiaCamera}],cubicInOut);
 assert.ok(flyStartHtml.includes('data-compass-center="0.0°N 0.0°E"')&&flyStartHtml.includes('data-compass-scale-km="2000"'));
 assert.ok(flyMidHtml.includes(`data-compass-center="${formatCoord(midCamera.center)}"`));
 assert.ok(flyEndHtml.includes('data-compass-center="22.2°N 5.0°E"')&&flyEndHtml.includes('data-compass-scale-km="500"'));

 // 4. Period polities for 1486 (Cliopatria) & label collision checks
 const geojsonRaw=fs.readFileSync(new URL('../data/polities_1486.geojson',import.meta.url),'utf8');
 assert.ok(geojsonRaw.length<1024*1024,'polities_1486.geojson exceeds 1 MB');
 assert.equal(JSON.parse(geojsonRaw).features.length,75);
 assert.equal(defaultPolities1486.features.length,75);
 const bootHtml=state(500);
 assert.ok(bootHtml.includes('<g data-layer="polities"></g>'),'world boot view must not draw polities');
 const compact1486Html=state(13000);
 assert.ok(compact1486Html.includes('stroke-dasharray="4 3"')&&compact1486Html.includes('PORTUGAL')&&compact1486Html.includes('CASTILE')&&compact1486Html.includes('SONGHAI'));

 // Check polity label non-collision against each other, route labels, and compact panels (in map-local coords)
 const panelBoxesMapLocal=rail.map((p,i)=>{
  const d=instruments[p.instrument].compact;
  const start=i<5?0:5;
  const y=i<9?96+rail.slice(start,i).reduce((s,item)=>s+instruments[item.instrument].compact.h+8,0):p.y;
  const x=i>=5?p.x+p.w-d.w:p.x;
  return {name:`panel:${p.name}`,box:[x-32,y-84,d.w,d.h] as [number,number,number,number]};
 });
 const polityLabelBoxes=defaultPolities1486.features.filter(f=>f.properties?.label).map(f=>{
  const lbl=f.properties!.label!;
  const [px,py]=project(lbl.at)!;
  const w=lbl.text.length*6.8+4,h=12;
  return {name:`polity:${lbl.text}`,at:lbl.at,point:[px,py],box:[px,py-10,w,h] as [number,number,number,number]};
 });
 assert.equal(polityLabelBoxes.length,16);
 const overlaps=(a:[number,number,number,number],b:[number,number,number,number],pad=2)=>!(a[0]+a[2]+pad<=b[0]||b[0]+b[2]+pad<=a[0]||a[1]+a[3]+pad<=b[1]||b[1]+b[3]+pad<=a[1]);
 for(let i=0;i<polityLabelBoxes.length;i++){
  const a=polityLabelBoxes[i];
  assert.ok(a.box[0]>0&&a.box[0]+a.box[2]<1856&&a.box[1]>12&&a.box[1]+a.box[3]<837,`${a.name} outside safe map area`);
  for(let j=i+1;j<polityLabelBoxes.length;j++){
   assert.ok(!overlaps(a.box,polityLabelBoxes[j].box,2),`${a.name} collides with ${polityLabelBoxes[j].name}`);
  }
  for(const rLbl of labels){
   assert.ok(!overlaps(a.box,rLbl.box,2),`${a.name} collides with route label ${rLbl.name}`);
  }
  for(const pBox of panelBoxesMapLocal){
   assert.ok(!overlaps(a.box,pBox.box,2),`${a.name} collides with ${pBox.name}`);
  }
 }

 // Check timeline states & layout restacking
 for(const ms of times){
  const html=state(ms);
  assert.ok(!html.includes('NaN'));
  assert.equal(html,state(ms));
  assert.equal((html.match(/<section/g)??[]).length,11);
  if(ms===13000) assert.ok(html.includes('top:483.8px')); // Compass restacked below Interference (333 + 142.8 + 8)
  if(ms===16000) assert.ok(html.includes('top:816.2px')); // Compass restacked below expanded Interference (333 + 475.2 + 8)
  if(ms===21000) assert.ok(html.includes('top:560.2px')); // Backlash below Wage plane settings
  if(ms===500) assert.ok(html.includes('opacity:0.3'));
 }
 const expanded=state(13000,true);
 assert.ok(expanded.includes('left:922px;top:228px;width:960px;height:650px'));
 assert.ok(expanded.includes('top:886px'));
 assert.ok(expanded.includes('data-plane-size="420"'));

 const r=wageReadings();
 assert.deepEqual([r.theta,r.magnitude,r.clock,r.quadrant,r.M,r.margin,r.elite.s,r.elite.m],[90,60,'3:00',1,18,22,80,-36]);
 assert.deepEqual(dangerPolygon(),[[-100,-100],[100,-100],[100,-50],[-100,90]]);

 const polities:Polities={type:'FeatureCollection',features:[{type:'Feature',properties:{style:{fill:'#123456',stroke:'#654321'},label:{text:'TEST POLITY',at:[0,25]}},geometry:{type:'Polygon',coordinates:[[[0,20],[0,30],[10,30],[10,20],[0,20]]]}}]};
 const layer=renderToStaticMarkup(<DashboardMap polities={polities}/>);
 assert.ok(layer.includes('#123456'));
 assert.ok(layer.includes('TEST POLITY'));
 assert.ok(layer.indexOf('TEST POLITY')<layer.indexOf('stroke-dasharray'));

 const geometry={
  projection:'equalEarth',
  fit:iberiaFit,
  camera:iberiaCamera,
  scale:project.scale(),
  portugalHeightPx:{
   mainlandCliopatria:portugalMainlandHeightPx,
   mainlandPlusMoroccoEnclaveCliopatria:portugalWithEnclaveHeightPx,
   handoffSvgMainland:100.07,
   handoffPngMainland:99,
   handoffPngWithRoute:130,
  },
  points,
  route:route.d,
  landHits:hits,
  samples,
  labels,
  polityLabels:polityLabelBoxes,
  politiesCount:defaultPolities1486.features.length,
  hubs:map.iberia.rhumbLines.hubs_lonlat.map(p=>project(p as [number,number])),
  clipMidpointExtents:{
   west:project.invert!([0,484]),
   east:project.invert!([1856,484]),
   north:project.invert!([928,0]),
   south:project.invert!([928,968]),
  },
 };
 fs.writeFileSync(new URL('../review/map-geometry-fix1.json',import.meta.url),JSON.stringify(geometry,null,2)+'\n');
 fs.writeFileSync(new URL('../review/map-geometry-fix2.json',import.meta.url),JSON.stringify(geometry,null,2)+'\n');
 console.log(`PASS: Equal Earth route ${samples} samples / ${hits} land hits; Portugal height ${portugalMainlandHeightPx}px mainland (${portugalWithEnclaveHeightPx}px with 1486 Moroccan enclave); monotonic flight; label clearance; ${times.length} deterministic timeline states; all 33 instrument modes (11 instruments × 3 modes) with opaque panel-render fill; Compass widget live camera updates; 75 Cliopatria 1486 polities with ${polityLabelBoxes.length} non-colliding labels.`);
}
