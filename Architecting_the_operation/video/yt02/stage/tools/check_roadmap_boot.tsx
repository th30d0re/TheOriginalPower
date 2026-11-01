// Static-render check for firstminute/RoadmapBoot.tsx (turn 4, BRIEF_FIRST_MINUTE_T4.md).
// Renders the scene in Node against the compiled ov plan at: shot start, each itemNN+450,
// item11+1300, roadmapEnd+600, and shot end − 1 frame. The .mjs wrapper additionally
// compares a full snapshot of these frames across two fresh Node processes.
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type StagePlan} from '@stage';
import {RoadmapBoot} from '../firstminute/RoadmapBoot';
import {rail} from '../dashboard/Dashboard';
import {instruments} from '../dashboard/PanelContent';
import {TRAY} from '../dashboard/trayLayout';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;

// Fail at the hook call itself: only the engine's useCue/useStageMs/usePlan (useContext)
// may run in the frame path, matching the dashboard's own constraint.
for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
 (React as any)[hook]=()=>{throw new Error(`${hook} reached in RoadmapBoot render`);};
 const Probe=()=>{(React as any)[hook]();return null;};
 assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}
{
 const source=fs.readFileSync(new URL('../firstminute/RoadmapBoot.tsx',import.meta.url),'utf8');
 assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),'RoadmapBoot.tsx contains a forbidden hook');
 assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),'RoadmapBoot.tsx contains a nondeterministic or measured path');
}

const render=(ms:number)=>renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:plan.fps,interactive:false}}><RoadmapBoot/></ClockContext.Provider></PlanContext.Provider>);

const segment=plan.segments.find(s=>s.scene==='RoadmapBoot')!;
const cue=(name:string)=>plan.cues[name];
const ITEM_CUES=Array.from({length:13},(_,i)=>`item${String(i+1).padStart(2,'0')}`);
const frames:{kind:string;ms:number}[]=[{kind:'shot start',ms:segment.start_ms}];
for(const c of ITEM_CUES) frames.push({kind:`${c}+450`,ms:cue(c)+450});
frames.push({kind:'item11+1300',ms:cue('item11')+1300});
frames.push({kind:'roadmapEnd+600',ms:cue('roadmapEnd')+600});
frames.push({kind:'shot end - 1 frame',ms:segment.end_ms-1000/plan.fps});
const rendered=frames.map(frame=>({...frame,html:render(frame.ms)}));

if(process.env.ROADMAP_BOOT_SNAPSHOT==='1'){
 console.log(JSON.stringify({frames:rendered.map(({kind,ms,html})=>({kind,ms,hash:createHash('sha256').update(html).digest('hex')}))}));
}else{
 const at=(kind:string)=>rendered.find(f=>f.kind===kind)!;
 const plain=(html:string)=>html.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&gt;','>').replaceAll('&lt;','<').replace(/\s+/g,' ').trim();
 const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
 const interactionHint=/\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;
 const lineMarkup=(html:string,id:string)=>html.match(new RegExp(`<div data-roadmap-line="${id}"[\\s\\S]*?</div>`))?.[0];
 const consoleStyle=(html:string)=>html.match(/<div data-roadmap-console="box" style="([^"]+)"/)?.[1]??'';
 const consoleOpacity=(html:string)=>Number(consoleStyle(html).match(/opacity:([\d.]+)/)?.[1]);
 const mapOpacity=(html:string)=>{
  const match=html.match(/left:32px;top:84px;width:1856px;height:968px;overflow:hidden;opacity:([\d.]+)/);
  assert.ok(match,'map wrapper opacity missing');
  return Number(match![1]);
 };
 const eraStrip=(html:string)=>{
  const start=html.indexOf('<svg width="1920" height="84"');
  assert.ok(start>=0,'era strip svg missing');
  return html.slice(start,html.indexOf('</svg>',start));
 };
 const sectionOpacities=(html:string)=>(html.match(/<section\b[^>]*>/g)??[]).map(tag=>Number(tag.match(/opacity:([\d.]+)/)?.[1]));

 // Per-frame invariants: no NaN, no literal underscore text, no interaction hints, era
 // strip stays empty for the whole shot.
 for(const {kind,html} of rendered){
  assert.ok(!html.includes('NaN'),`RoadmapBoot ${kind} contains NaN`);
  assert.deepEqual(renderedUnderscoreText(html),[],`RoadmapBoot ${kind} renders a literal underscore`);
  assert.ok(!interactionHint.test(plain(html)),`RoadmapBoot ${kind} renders an interaction hint`);
  assert.ok(!eraStrip(html).includes('<text'),`RoadmapBoot ${kind}: era strip shows a year`);
 }

 // Console geometry: clear of both stacks and the tray, below the era strip.
 const panelRect=(i:number)=>{
  const p:any=rail[i],d=instruments[p.instrument].compact;
  const start=i<5?0:5;
  const y=i<10?96+(rail.slice(start,i) as any[]).reduce((s,item)=>s+instruments[item.instrument].compact.h+8,0):p.y;
  const x=i>=5?p.x+p.w-d.w:p.x;
  return {x,y,w:d.w,h:d.h};
 };
 const leftStackRight=Math.max(...[0,1,2,3,4].map(i=>panelRect(i).x+panelRect(i).w));
 const rightStackLeft=Math.min(...[5,6,7,8,9].map(i=>panelRect(i).x));
 const style=consoleStyle(at('shot start').html);
 const px=(key:string)=>Number(style.match(new RegExp(`(?:^|;)${key}:([-\\d.]+)px`))?.[1]);
 const box={left:px('left'),top:px('top'),width:px('width'),height:px('height')};
 assert.ok(box.left>=leftStackRight,`console left ${box.left} crosses the left stack (right edge ${leftStackRight})`);
 assert.ok(box.left+box.width<=rightStackLeft,`console right ${box.left+box.width} crosses the right stack (left edge ${rightStackLeft})`);
 assert.ok(box.top>=84,`console top ${box.top} crosses the era strip`);
 assert.ok(box.top+box.height<=TRAY.top,`console bottom ${box.top+box.height} crosses the tray (top ${TRAY.top})`);

 // Boot state at shot start.
 const start=at('shot start').html;
 assert.equal(sectionOpacities(start).length,18,'shot start does not render 18 panels');
 for(const [i,opacity] of sectionOpacities(start).entries()) assert.equal(opacity,.15,`panel ${i} not dim at shot start`);
 assert.equal(mapOpacity(start),.3,'map not dimmed at shot start');
 assert.ok(!start.includes('data-roadmap-line'),'a roadmap line renders before its cue');
 assert.ok(!start.includes('data-roadmap-wire="'),'a wire renders before any panel cue');
 assert.ok(consoleStyle(start).length>0,'console missing at shot start');

 // Labels: all thirteen typed by item13+450; none present before its own cue.
 const LABELS=['vector definition','conventional causal model','reversed hypothesis','two-set partition','orthographic illusion','five tiers','set-resolution ladder','three historical tests','complex wage diagnostic','American backlash record','runtime dashboard','Interference Engine','rebuilt hierarchy'];
 const finalRoadmap=at('item13+450').html;
 ITEM_CUES.forEach((c,i)=>{
  const line=lineMarkup(finalRoadmap,c);
  assert.ok(line,`line ${c} missing at item13+450 ms`);
  assert.ok(line!.includes(LABELS[i]),`line ${c} missing label "${LABELS[i]}" at item13+450 ms`);
 });
 assert.ok(lineMarkup(finalRoadmap,'item02')!.includes('rejected'),'item02 missing the red "rejected" tag');
 // Before a cue, its line element is absent. Whole-frame text absence is also asserted
 // for the labels that never appear in dashboard chrome ("Interference Engine" is a
 // data-artifact attribute on the tray and "five tiers" appears in an expanded-view
 // caption source, so those two are covered by the line-element assertion only).
 const chromeFree=LABELS.filter(l=>l!=='Interference Engine'&&l!=='five tiers');
 const beforeFrames=[at('shot start'),...ITEM_CUES.slice(0,12).map(c=>at(`${c}+450`))];
 ITEM_CUES.forEach((c,i)=>{
  const frame=beforeFrames[i];
  assert.ok(frame.ms<cue(c),`pre-cue frame ${frame.kind} is not before ${c}`);
  assert.ok(!lineMarkup(frame.html,c),`line ${c} renders before its cue (seen at ${frame.kind})`);
  if(chromeFree.includes(LABELS[i])) assert.ok(!frame.html.includes(LABELS[i]),`label "${LABELS[i]}" present before its cue (seen at ${frame.kind})`);
 });

 // Named panels light on their items; wires draw only for those items.
 assert.equal(sectionOpacities(at('item06+450').html)[12],1,'Five-Tier Cone (rail 12) not lit at item06+450');
 assert.equal(sectionOpacities(at('item09+450').html)[9],1,'Wage plane (rail 9) not lit at item09+450');
 assert.equal(sectionOpacities(at('item10+450').html)[14],1,'Backlash oscillator (rail 14) not lit at item10+450');
 assert.equal(sectionOpacities(at('item06+450').html)[0],.15,'left stack lit before item11');
 assert.ok(at('item06+450').html.includes('data-roadmap-wire="item06"'),'item06 wire missing');
 assert.ok(at('item09+450').html.includes('data-roadmap-wire="item09"'),'item09 wire missing');
 assert.ok(at('item10+450').html.includes('data-roadmap-wire="item10"'),'item10 wire missing');

 // item11 sweeps the dashboard online in rail order.
 const midSweep=sectionOpacities(at('item11+450').html);
 assert.equal(midSweep[0],1,'sweep has not reached panel 0 by item11+450');
 assert.equal(midSweep[17],.15,'sweep reached the last panel before item11+450');
 const booted=at('item11+1300').html;
 for(const [i,opacity] of sectionOpacities(booted).entries()) assert.equal(opacity,1,`panel ${i} not lit at item11+1300`);
 assert.equal(mapOpacity(booted),1,'map not at full brightness at item11+1300');

 // item12 pulses the Interference Engine tray cell once.
 assert.ok(at('item12+450').html.includes('data-engine-pulse="item12"'),'item12 pulse missing');

 // roadmapEnd collapses the console; the lit dashboard stands alone at the shot end.
 assert.equal(consoleOpacity(at('roadmapEnd+600').html),0,'console still visible at roadmapEnd+600');
 const shotEnd=at('shot end - 1 frame').html;
 assert.equal(consoleOpacity(shotEnd),0,'console still visible at shot end');
 for(const [i,opacity] of sectionOpacities(shotEnd).entries()) assert.equal(opacity,1,`panel ${i} not lit at shot end`);
 assert.equal(mapOpacity(shotEnd),1,'map not at full brightness at shot end');

 console.log(`PASS: RoadmapBoot renders ${rendered.length} deterministic frames; 13 labels land on their cues and are absent before; console box ${box.left}–${box.left+box.width} × ${box.top}–${box.top+box.height} clears stacks (${leftStackRight} / ${rightStackLeft}) and tray (${TRAY.top}); panels 12, 9, 14 light on items 06, 09, 10 with wires; item11 sweep complete by +1300 (map opacity 1); item12 pulse present; console collapsed by roadmapEnd+600; era strip empty throughout; no literal underscores; no interaction hints.`);
}
