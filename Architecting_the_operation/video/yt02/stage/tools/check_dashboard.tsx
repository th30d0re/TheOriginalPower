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
import {Dashboard,rail,slugs} from '../dashboard/Dashboard';
import {DashboardMap,defaultPolities1486,type Polities} from '../dashboard/DashboardMap';
import {ARTIFACT_VIEWS,PanelContent,TRAY_VIEW_LAYOUT_HEIGHTS,eraLog2,instruments,computeCompassMetrics,formatCoord} from '../dashboard/PanelContent';
import {regionalProjection as project,worldCamera,iberiaCamera,iberiaFit,labelOffsets} from '../dashboard/mapGeometry';
import {wageModel,wageReadings,dangerPolygon,WAGE_EXPANDED_BOX,WAGE_STAT_LABELS} from '../dashboard/ComplexWagePlane';
import {transitionWagePlaneMode,type WageInteractionEvent} from '../dashboard/instruments/wage-plane';
import {transitionTrayMode,type TrayInteractionEvent,TRAY_EXPANDED_BOX} from '../dashboard/instruments/tray-artifact';
import {TRAY,TRAY_CELL_WIDTH,TRAY_INSTRUMENTS,trayCellRect} from '../dashboard/trayLayout';
import {color} from '../tokens';
import map from '../handoff/map.json';
import states from '../review/states.json';

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

const times=[500,5600,6200,6233.333333,7300,8400,13000,14500,14700,16000,18200,19500,19700,21000,22000,22600,23420,23900];
const renderPanel=(name:string,mode:'compact'|'expanded'|'settings')=>renderToStaticMarkup(
 <ClockContext.Provider value={{ms:0,fps:30,interactive:false}}><PanelContent name={name} mode={mode}/></ClockContext.Provider>
);
const renderDashboard=(ms:number,modes:Record<string,any>={},modeTimelines:Record<string,any>={})=>renderToStaticMarkup(
 <ClockContext.Provider value={{ms,fps:30,interactive:false}}><Dashboard modes={modes} modeTimelines={modeTimelines}/></ClockContext.Provider>
);
const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
const trayModeHashes=()=>TRAY_INSTRUMENTS.flatMap(name=>
 (['compact','expanded','settings'] as const).map(mode=>({name,mode,hash:createHash('sha256').update(renderPanel(name,mode)).digest('hex')}))
);
function sectionRect(html:string,slug:string){
 const tag=html.match(new RegExp(`<section data-instrument="${slug}"[^>]*style="([^"]+)"`))?.[1];
 assert.ok(tag,`missing section ${slug}`);
 const value=(key:string)=>Number(tag.match(new RegExp(`${key}:([\\d.]+)px`))?.[1]);
 return {x:value('left'),y:value('top'),width:value('width'),height:value('height')};
}

if(process.env.DASHBOARD_SNAPSHOT==='1') {
 const frames=[...times.map(ms=>state(ms)),state(13000,true)].map(html=>{
  const sections=html.match(/<section\b[\s\S]*?<\/section>/g)!;
  assert.equal(sections.length,18);
  assert.ok(!html.includes('NaN'));
  assert.ok(!html.includes('blur('));
  assert.ok(!html.includes('<button'));
  assert.ok(html.includes('rgba(13,27,42,0.88)'));
  return {left:sections.slice(0,5),right:sections.slice(5,9),tray:sections.slice(9),whole:createHash('sha256').update(html).digest('hex')};
 });
 console.log(JSON.stringify({frames,tray:trayModeHashes()}));
} else {
 // 1. Panel legibility without blur
 assert.equal(color('color/fill/panel-render'),'rgba(13,27,42,0.88)');
 for(const name of Object.keys(instruments)) {
  for(const mode of ['compact','expanded','settings'] as const) {
   const html=renderPanel(name,mode);
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

 // 2. New right stack and always-on tray geometry
 assert.equal(rail.length,18);
 assert.deepEqual(rail.slice(5,9).map(p=>p.instrument),['Active Patch','Variables','Executing Function','Policy ticker']);
 const policyResults=eraLog2.fields.results as string[];
 const policyCompact=renderPanel('Policy ticker','compact'),policyExpanded=renderPanel('Policy ticker','expanded');
 assert.ok(policyCompact.includes(policyResults.at(-1)!));
 for(const result of policyResults) assert.ok(policyExpanded.includes(result),`expanded policy ticker missing: ${result}`);
 assert.ok(renderPanel('Executing Function','compact').includes(String(eraLog2.fields.executing_function)));
 assert.deepEqual(rail.slice(9).map(p=>p.instrument),[...TRAY_INSTRUMENTS]);
 assert.deepEqual(Object.keys(ARTIFACT_VIEWS),TRAY_INSTRUMENTS.slice(1));
 assert.deepEqual(slugs.slice(9),TRAY_INSTRUMENTS.map(name=>name.toLowerCase().replaceAll(' ','-')));
 assert.deepEqual(TRAY,{left:36,right:1884,top:944,height:100,gap:8,count:9});
 assert.ok(Math.abs(TRAY_CELL_WIDTH-198.2222222222)<1e-8);
 for(let i=0;i<TRAY.count;i++){
  const cell=trayCellRect(i),panel=rail[9+i];
  assert.deepEqual(panel,{name:TRAY_INSTRUMENTS[i].toLowerCase(),instrument:TRAY_INSTRUMENTS[i],mode:'compact',x:cell.x,y:cell.y,w:cell.width,h:cell.height});
  if(i>0) assert.ok(Math.abs(cell.x-(trayCellRect(i-1).x+TRAY_CELL_WIDTH+8))<1e-8);
 }
 const modelDefaultTray=new Set(['Wage plane','Phase Coherence','Five-Tier Cone','Compounding Ledger','Backlash oscillator','Thyristor Latch','AC Extraction Meter','Snubber Circuit']);
 const interactionHint=/\b(?:drag|click|arrow keys|press)\b/i;
 for(const name of TRAY_INSTRUMENTS){
  for(const mode of ['compact','expanded','settings'] as const){
   const html=renderPanel(name,mode);
   assert.ok(html.length>500,`${name} ${mode} did not render`);
   assert.ok(!interactionHint.test(html),`${name} ${mode} leaks an interaction hint`);
   assert.deepEqual(renderedUnderscoreText(html),[],`${name} ${mode} renders literal underscore markup text`);
   if(name==='Wage plane') assert.ok(html.includes(mode==='settings'?'data-settings="Wage plane"':'data-artifact="Complex Wage Plane"'));
   else assert.ok(html.includes(`data-artifact="${name}"`));
   if(mode==='expanded') assert.ok(html.includes('data-control="gear" data-action="open-settings"'));
   if(mode==='settings') assert.ok(html.includes('data-control="gear" data-action="open-expanded"'));
  }
  const settings=renderPanel(name,'settings');
  assert.equal(settings.includes('Model default:'),modelDefaultTray.has(name),`${name} model-default marker`);
 }
 const snubberSettings=renderPanel('Snubber Circuit','settings');
 assert.ok(snubberSettings.includes('raise')&&snubberSettings.includes('clamps the surge sooner')&&snubberSettings.includes('higher')&&snubberSettings.includes('lets a larger surge through')&&snubberSettings.includes('readings conflict'));
 assert.deepEqual(Object.keys(TRAY_VIEW_LAYOUT_HEIGHTS),TRAY_INSTRUMENTS);
 for(const [name,layouts] of Object.entries(TRAY_VIEW_LAYOUT_HEIGHTS)) for(const [mode,total] of Object.entries(layouts)) assert.ok(total<=828,`${name} ${mode} declared layout ${total}px exceeds 828px`);
 const thyristorCompact=renderPanel('Thyristor Latch','compact'),thyristorExpanded=renderPanel('Thyristor Latch','expanded');
 assert.ok(thyristorCompact.includes('data-trace-points="601"')&&thyristorExpanded.includes('data-trace-points="601"'),'Thyristor compact and expanded traces must share the 601-point static history');
 assert.ok(thyristorExpanded.includes('height:370px')&&thyristorExpanded.includes('height:280px'),'Thyristor expanded panels must use the audited compact heights');
 const acExpanded=renderPanel('AC Extraction Meter','expanded'); assert.ok(acExpanded.includes('height:700px')&&acExpanded.includes('height:288px')&&acExpanded.includes('height:400px'),'AC expanded columns must use the audited 700px split');
 const backlashExpanded=renderPanel('Backlash oscillator','expanded');
 assert.ok(backlashExpanded.includes('Active preset · Impulse shock')&&!backlashExpanded.includes('Initial charge Q₀')&&!backlashExpanded.includes('Sustained drive'),'non-interactive Backlash header must show only its active preset');
 assert.deepEqual([wageModel.m,wageModel.s],[0,60]);

 // 2. Iberia framing under Equal Earth & route land-hit check
 const points=map.iberia.route.waypoints.map(p=>project([p.lon,p.lat])!);
 const route=catmullRomPath(points,.4,'handoff');
 const nums=route.d.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!.map(Number);
 const land=feature(atlas as any,atlas.objects.land as any);
 let current=nums.slice(0,2),hits=0,samples=0,routeMinX=Infinity,routeMaxX=-Infinity,routeMinY=Infinity,routeMaxY=-Infinity;
 for(let i=2;i<nums.length;i+=6){
  const c1=nums.slice(i,i+2),c2=nums.slice(i+2,i+4),end=nums.slice(i+4,i+6);
  for(let j=0;j<=80;j++){
   const t=j/80,u=1-t,p=current.map((v,k)=>u**3*v+3*u*u*t*c1[k]+3*u*t*t*c2[k]+t**3*end[k]) as [number,number];
   hits+=Number(geoContains(land,project.invert!(p)!));
   routeMinX=Math.min(routeMinX,p[0]);
   routeMaxX=Math.max(routeMaxX,p[0]);
   routeMinY=Math.min(routeMinY,p[1]);
   routeMaxY=Math.max(routeMaxY,p[1]);
   samples++;
  }
  current=end;
 }
 const mapLeft=32,mapTop=84,trayTopLocal=TRAY.top-mapTop;
 const leftStackRightLocal=Math.max(...rail.slice(0,5).map(p=>p.x+instruments[p.instrument].compact.w))-mapLeft;
 const rightStackLeftLocal=Math.min(...rail.slice(5,9).map(p=>p.x+p.w-instruments[p.instrument].compact.w))-mapLeft;
 assert.equal(hits,0,`route land hits ${hits}`);
 assert.ok(routeMinX>leftStackRightLocal&&routeMaxX<rightStackLeftLocal,`route horizontal bounds ${routeMinX}..${routeMaxX} cross a stack`);
 assert.ok(routeMinY>12&&routeMaxY<trayTopLocal,`route vertical bounds ${routeMinY}..${routeMaxY} cross the tray`);

 // Measure Portugal height in settled 1486 state
 const ptMainlandNorth=project([-8.2,42.113])!;
 const ptMainlandSouth=project([-7.9,37.002])!;
 const ptEnclaveSouth=project([-5.9,35.32])!;
 const portugalMainlandHeightPx=Number((ptMainlandSouth[1]-ptMainlandNorth[1]).toFixed(2));
 const portugalWithEnclaveHeightPx=Number((ptEnclaveSouth[1]-ptMainlandNorth[1]).toFixed(2));
 assert.ok(Math.max(ptMainlandNorth[1],ptMainlandSouth[1],ptEnclaveSouth[1])<trayTopLocal,'Portugal crosses the tray top edge');
 assert.ok(portugalMainlandHeightPx>=90&&portugalMainlandHeightPx<=110,`mainland Portugal height ${portugalMainlandHeightPx}px outside ±10% of 100.07px`);
 assert.ok(portugalWithEnclaveHeightPx>=126&&portugalWithEnclaveHeightPx<=154,`Portugal mainland+enclave height ${portugalWithEnclaveHeightPx}px outside ±10% of 140px`);

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
  assert.ok(x>leftStackRightLocal&&x+w<rightStackLeftLocal&&y>12&&y+h<trayTopLocal,`${name} label [${x},${y},${w},${h}] not clear of stacks/tray`);
 }

 // 3. Compass widget & removal of map compass rose
 const mapHtml=renderToStaticMarkup(<DashboardMap/>);
 assert.ok(!mapHtml.includes('aria-label="Compass rose"'),'map still contains CompassRose');
 const compassCompact=renderToStaticMarkup(<PanelContent name="Compass" mode="compact"/>);
 const compassExpanded=renderToStaticMarkup(<PanelContent name="Compass" mode="expanded"/>);
 const compassSettings=renderToStaticMarkup(<PanelContent name="Compass" mode="settings"/>);
 const iberiaMetrics=computeCompassMetrics(iberiaCamera);
 assert.ok(compassCompact.includes('data-compass-rose="56"')&&compassCompact.includes(iberiaMetrics.centerText)&&compassCompact.includes(`${iberiaMetrics.compactScale.km} km`));
 assert.ok(compassExpanded.includes('data-compass-rose="148"')&&compassExpanded.includes('Equal Earth')&&compassExpanded.includes(iberiaMetrics.zoomText)&&compassExpanded.includes(`${iberiaMetrics.expandedScale.km} km`));
 assert.ok(compassSettings.includes('Šavrič, Patterson and Jenny, 2018')&&compassSettings.includes('Natural Earth, public domain; Cliopatria, CC BY 4.0, Bennett et al. 2025'));

 // Verify Compass updates during flyTo
 const flyStartHtml=state(6200);
 const flyMidHtml=state(7300);
 const flyEndHtml=state(8400);
 const midCamera=flyTo(7300,[{at:6200,camera:worldCamera},{at:8400,camera:iberiaCamera}],cubicInOut);
 assert.ok(flyStartHtml.includes('data-compass-center="0.0°N 0.0°E"')&&flyStartHtml.includes('data-compass-scale-km="2000"'));
 assert.ok(flyMidHtml.includes(`data-compass-center="${formatCoord(midCamera.center)}"`));
 assert.ok(flyEndHtml.includes(`data-compass-center="${iberiaMetrics.centerText}"`)&&flyEndHtml.includes(`data-compass-scale-km="${iberiaMetrics.compactScale.km}"`));

 // 4. Period polities for 1486 (Cliopatria) & label collision checks
 const geojsonRaw=fs.readFileSync(new URL('../data/polities_1486.geojson',import.meta.url),'utf8');
 assert.ok(geojsonRaw.length<1024*1024,'polities_1486.geojson exceeds 1 MB');
 assert.equal(JSON.parse(geojsonRaw).features.length,75);
 assert.equal(defaultPolities1486.features.length,75);
 const bootHtml=state(500);
 assert.ok(bootHtml.includes('<g data-layer="polities"></g>'),'world boot view must not draw polities');
 const compact1486Html=state(13000);
 assert.ok(compact1486Html.includes('stroke-dasharray="4 3"')&&compact1486Html.includes('PORTUGAL')&&compact1486Html.includes('CASTILE')&&compact1486Html.includes('SONGHAI'));

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
 for(let i=0;i<labels.length;i++){
  for(let j=i+1;j<labels.length;j++) assert.ok(!overlaps(labels[i].box,labels[j].box,2),`${labels[i].name} collides with ${labels[j].name}`);
  for(const pBox of panelBoxesMapLocal) assert.ok(!overlaps(labels[i].box,pBox.box,2),`${labels[i].name} collides with ${pBox.name}`);
 }
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

 // 5. Expanded Wage plane = full Complex Wage Plane artifact view; Settings is secondary & reached only via gear
 assert.deepEqual(WAGE_EXPANDED_BOX,{x:260,y:138,width:1400,height:860});
 assert.deepEqual(states,{
  dash_world_boot:500,
  dash_1486_compact:13000,
  dash_1486_interference_expanded:16000,
  dash_1486_wage_expanded:21000,
  dash_1486_wage_settings:22600,
 });

 const wageTimeline=[
  {at:plan.cues['expand:wage-plane'],mode:'expanded' as const},
  {at:plan.cues['settings:wage-plane'],mode:'settings' as const},
  {at:plan.cues['reexpand:wage-plane'],mode:'expanded' as const},
  {at:plan.cues['collapse:wage-plane'],mode:'compact' as const},
 ];
 assert.equal(plan.cues['expand:wage-plane'],19500);
 assert.equal(plan.cues['settings:wage-plane'],21800);
 assert.equal(plan.cues['reexpand:wage-plane'],23000);
 assert.equal(plan.cues['collapse:wage-plane'],23450);
 assert.equal(resolveMode(states.dash_1486_wage_expanded,wageTimeline).weights.expanded,1);
 assert.equal(resolveMode(states.dash_1486_wage_expanded,wageTimeline).weights.settings,0);
 assert.equal(resolveMode(states.dash_1486_wage_settings,wageTimeline).weights.settings,1);
 assert.equal(resolveMode(states.dash_1486_wage_settings,wageTimeline).weights.expanded,0);
 assert.equal(resolveMode(23420,wageTimeline).weights.expanded,1);
 assert.equal(resolveMode(23900,wageTimeline).weights.compact,1);

 // Verify interactive mode transitions: hover/click on compact open expanded, never settings; only click-gear reaches settings
 const nonGearEvents:WageInteractionEvent[]=['hover-compact','click-compact','click-close'];
 for(const ev of nonGearEvents){
  assert.notEqual(transitionWagePlaneMode('compact',ev),'settings',`event ${ev} from compact must never open settings`);
  assert.notEqual(transitionWagePlaneMode('expanded',ev),'settings',`event ${ev} from expanded must never open settings`);
 }
 assert.equal(transitionWagePlaneMode('compact','hover-compact'),'expanded');
 assert.equal(transitionWagePlaneMode('compact','click-compact'),'expanded');
 assert.equal(transitionWagePlaneMode('compact','click-gear'),'settings');
 assert.equal(transitionWagePlaneMode('expanded','click-gear'),'settings');
 assert.equal(transitionWagePlaneMode('settings','click-gear'),'expanded');
 assert.equal(transitionWagePlaneMode('settings','click-close'),'compact');
 assert.equal(transitionWagePlaneMode('expanded','click-close'),'compact');
 const trayNonGearEvents:TrayInteractionEvent[]=['hover-compact','click-compact','click-close'];
 for(const ev of trayNonGearEvents){
  assert.notEqual(transitionTrayMode('compact',ev),'settings',`tray event ${ev} from compact must never open settings`);
  assert.notEqual(transitionTrayMode('expanded',ev),'settings',`tray event ${ev} from expanded must never open settings`);
 }
 assert.equal(transitionTrayMode('compact','click-gear'),'settings');
 assert.equal(transitionTrayMode('expanded','click-gear'),'settings');
 assert.equal(transitionTrayMode('settings','click-gear'),'expanded');
 assert.deepEqual(TRAY_EXPANDED_BOX,{x:260,y:138,width:1400,height:860});
 for(let i=0;i<TRAY_INSTRUMENTS.length;i++){
  const slug=slugs[9+i],expanded=sectionRect(renderDashboard(0,{[slug]:'expanded'}),slug);
  assert.deepEqual(expanded,TRAY_EXPANDED_BOX,`${slug} expanded box`);
  const start=trayCellRect(i),moving=sectionRect(renderDashboard(300,{}, {[slug]:[{at:0,mode:'expanded'}]}),slug);
  assert.ok(moving.x>Math.min(start.x,260)&&moving.x<Math.max(start.x,260),`${slug} x does not grow centreward`);
  assert.ok(moving.y>138&&moving.y<start.y,`${slug} y does not grow upward`);
  assert.ok(moving.width>start.width&&moving.width<1400,`${slug} width does not expand`);
  assert.ok(moving.height>start.height&&moving.height<860,`${slug} height does not expand`);
 }

 // Verify timeline states & layout restacking
 for(const ms of times){
  const html=state(ms);
  assert.ok(!html.includes('NaN'));
  assert.equal(html,state(ms));
  assert.equal((html.match(/<section/g)??[]).length,18);
  if(ms===13000) assert.ok(html.includes('top:483.8px'));
  if(ms===16000) assert.ok(html.includes('top:816.2px'));
  if(ms===500) assert.ok(html.includes('opacity:0.3'));
 }

 const wageExpandedHtml=state(states.dash_1486_wage_expanded);
 assert.ok(wageExpandedHtml.includes('left:260px;top:138px;width:1400px;height:860px'),'expanded wage card box must be 1400×860 at [260, 138]');
 assert.ok(wageExpandedHtml.includes('data-instrument="wage-plane" data-active-mode="expanded"'));
 assert.ok(wageExpandedHtml.includes('data-artifact="Complex Wage Plane"'));
 assert.ok(wageExpandedHtml.includes('data-plane-size="720"'),'expanded wage card must contain the 720px plane');
 assert.ok(wageExpandedHtml.includes('Wage vector'));
 assert.ok(wageExpandedHtml.includes('data-control="gear" data-action="open-settings"'));
 assert.ok(wageExpandedHtml.includes('data-control="close" data-action="close"'));
 assert.ok(wageExpandedHtml.includes('aria-label="Gauge of M against τ"')&&wageExpandedHtml.includes('data-gauge="M-against-tau"'),'expanded wage card must contain the M-against-τ gauge');
 assert.ok(wageExpandedHtml.includes('Inside the τ limit'));
 assert.ok(wageExpandedHtml.includes('Almost all status. Manuscript: the default operating mode of the extraction kernel (:2939).'));
 assert.ok(wageExpandedHtml.includes('At |W| = 60, the safe arc runs counterclockwise from 7:18 to 2:22.'));
 for(const label of WAGE_STAT_LABELS){
  assert.ok(wageExpandedHtml.includes(`>${label}</dt>`),`expanded wage card missing stat label: ${label}`);
 }

 const wageSettingsHtml=state(states.dash_1486_wage_settings);
 assert.ok(wageSettingsHtml.includes('left:260px;top:138px;width:1400px;height:860px'),'settings wage card must have the same 1400×860 footprint at [260, 138]');
 assert.ok(wageSettingsHtml.includes('data-instrument="wage-plane" data-active-mode="settings"'));
 assert.ok(wageSettingsHtml.includes('data-settings="Wage plane"'));
 assert.ok(wageSettingsHtml.includes('SETTINGS · WAGE PLANE'));
 assert.ok(wageSettingsHtml.includes('data-control="gear" data-action="open-expanded"'));
 assert.ok(wageSettingsHtml.includes('Quadrant names'));
 assert.ok(wageSettingsHtml.includes('What comes from where'));
 assert.ok(wageSettingsHtml.includes('data-chip="τ zone" data-chip-state="on"'));
 assert.ok(wageSettingsHtml.includes('data-chip="Arc at |W|" data-chip-state="on"'));
 assert.ok(wageSettingsHtml.includes('data-chip="Elite optimum" data-chip-state="on"'));

 const r=wageReadings();
 assert.deepEqual([r.theta,r.magnitude,r.clock,r.quadrant,r.M,r.margin,r.elite.s,r.elite.m],[90,60,'3:00',1,18,22,80,-36]);
 assert.deepEqual(r.stats,[
  ['Angle θ','90.0°'],
  ['Size |W|','60.0'],
  ['Clock position','3:00'],
  ['Quadrant','QI · Joint wage'],
  ['Class-coherence risk M','18.0 (τ = 40)'],
  ['Margin to τ','22.0 below τ'],
  ['Material flow','none'],
  ['Safest angle at any |W|','4:50 (θ = 35°)'],
 ]);
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
  routeBounds:{minX:routeMinX,maxX:routeMaxX,minY:routeMinY,maxY:routeMaxY},
  landHits:hits,
  samples,
  labels,
  polityLabels:polityLabelBoxes,
  politiesCount:defaultPolities1486.features.length,
  tray:{...TRAY,cellWidth:TRAY_CELL_WIDTH,mapLocalTop:trayTopLocal},
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
 console.log(`PASS: Equal Earth route ${samples} samples / ${hits} land hits, bounds ${routeMinX.toFixed(2)}..${routeMaxX.toFixed(2)} × ${routeMinY.toFixed(2)}..${routeMaxY.toFixed(2)} above tray y=${trayTopLocal}; Portugal height ${portugalMainlandHeightPx}px mainland (${portugalWithEnclaveHeightPx}px with 1486 Moroccan enclave); ${times.length} deterministic timeline states; right stack + 9-cell tray geometry; all 27 tray modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with ${polityLabelBoxes.length} non-colliding labels.`);
}
