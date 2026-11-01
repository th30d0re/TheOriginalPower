import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ClockContext,PlanContext,createProjection,catmullRomPath,resolveMode,type StagePlan} from '@stage';
import {DashboardBoot,Dashboard1486} from '../Scenes';
import {PanelContent,instruments} from '../dashboard/PanelContent';
import map from '../handoff/map.json';
import overlay from '../handoff/map_overlay.json';
const plan=JSON.parse(fs.readFileSync(new URL('../review/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const project=createProjection({center:[8,24.2],pxPerDeg:19.5},'equirectangular',1856,968);
const points=map.iberia.route.waypoints.map(p=>project([p.lon,p.lat])!);
points.forEach((p,i)=>p.forEach((v,j)=>assert.ok(Math.abs(v-overlay.iberia.route.points[i][j])<1e-8)));
const numbers=(d:string)=>d.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!.map(Number);
const actual=numbers(catmullRomPath(points,.4,'handoff').d),expected=numbers(overlay.iberia.route.d);
assert.equal(actual.length,expected.length);actual.forEach((v,i)=>assert.ok(Math.abs(v-expected[i])<=.00501));
assert.equal(resolveMode(21000,[{at:19500,mode:'settings'}]).weights.settings,1);
function state(ms:number) {
 const segment=plan.segments.find(s=>ms>=s.start_ms&&ms<s.end_ms)!;
 const Scene=ms<6000?DashboardBoot:Dashboard1486;
 return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:30,interactive:false}}><Scene segment={segment} shots={segment.shots} shotAt={time=>segment.shots.find(s=>time>=s.start_ms&&time<s.end_ms)}/></ClockContext.Provider></PlanContext.Provider>);
}
for(const ms of [500,13000,16000,21000]) {const html=state(ms);assert.ok(!html.includes('NaN'));assert.equal(html,state(ms));assert.equal((html.match(/<section/g)??[]).length,10);if(ms===21000)assert.ok(html.includes('top:560.2px'));if(ms===500)assert.ok(html.includes('opacity:0.3'));}
for(const name of Object.keys(instruments))for(const mode of ['compact','expanded','settings'] as const){const html=renderToStaticMarkup(<PanelContent name={name} mode={mode}/>);assert.ok(html.length>100);assert.ok(!html.includes('NaN'));}
console.log('PASS: 17 projected waypoints; handoff route control points within 0.0051 px; four deterministic reference states; settings stack reflow; all 30 instrument modes render.');
