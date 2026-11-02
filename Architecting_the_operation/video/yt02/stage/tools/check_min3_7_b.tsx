import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type StagePlan} from '@stage';
import {LiteratureHandoff,LITERATURE_HANDOFF_LAYOUT} from '../min3_7/b/LiteratureHandoff';
import {APAGroupDefinitions,APA_GROUP_LAYOUT,APA_MARKS} from '../min3_7/b/APAGroupDefinitions';
import {TajfelCitation,TAJFEL_LAYOUT} from '../min3_7/b/TajfelCitation';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const sceneComponents={LiteratureHandoff,APAGroupDefinitions,TajfelCitation};
type SceneName=keyof typeof sceneComponents;
const sceneCues:Record<SceneName,string[]>={
  LiteratureHandoff:['t17Social','t17Three','t17Distinct','t17Definitions','t17Experimental','t17Psychology','t18Preface','t18Chapter','t18Original','t18Established','t18Each','t18Job'],
  APAGroupDefinitions:['t19Baseline','t19Sort','t19American','t19Ingroup','t19Membership','t19Identification','t20Reference','t20Outgroup','t20Outside','t20Detachment','t20Competition','t20Opposition','t21American','t21Bias','t21Tendency','t21Resources','t21Conduct','t21Behavior'],
  TajfelCitation:['t22Henri','t22Turner','t22Formalized','t22SeventyNine','t22Social','t22Theory','t22Relations'],
};

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in Package B render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

const sourceFiles=['LiteratureHandoff.tsx','APAGroupDefinitions.tsx','TajfelCitation.tsx'];
for(const file of sourceFiles){
  const source=fs.readFileSync(new URL(`../min3_7/b/${file}`,import.meta.url),'utf8');
  const hooks=[...source.matchAll(/\b(use[A-Z][A-Za-z0-9]*)\b/g)].map(match=>match[1]);
  for(const hook of hooks)assert.ok(['useCue','useStageMs'].includes(hook),`${file} contains disallowed hook ${hook}`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

function render(scene:SceneName,ms:number){
  const Scene=sceneComponents[scene],segment=plan.segments.find(item=>item.scene===scene)!;
  assert.ok(segment,`missing segment for ${scene}`);
  return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:plan.fps,interactive:false}}><Scene segment={segment} shots={segment.shots} shotAt={value=>segment.shots.find(shot=>value>=shot.start_ms&&value<shot.end_ms)}/></ClockContext.Provider></PlanContext.Provider>);
}
function plain(html:string){
  return html.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&gt;','>').replaceAll('&lt;','<').replace(/\s+/g,' ').trim();
}
const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
const interactionHint=/\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;

const frames:{scene:SceneName;ms:number;kind:string}[]=[];
for(const scene of Object.keys(sceneComponents) as SceneName[]){
  const segment=plan.segments.find(item=>item.scene===scene)!;
  frames.push({scene,ms:segment.start_ms,kind:'start'});
  for(const cue of sceneCues[scene])frames.push({scene,ms:plan.cues[cue]+700,kind:cue});
  frames.push({scene,ms:segment.end_ms-1000/plan.fps,kind:'end'});
}
const rendered=frames.map(frame=>({...frame,html:render(frame.scene,frame.ms)}));
const byKind=(scene:SceneName)=>rendered.filter(frame=>frame.scene===scene);

function beat(scene:SceneName,cue:string,opts:{text?:string[];markup?:string[]},absentBeforeCue?:string){
  const frame=byKind(scene).find(item=>item.kind===cue)!;
  const text=plain(frame.html);
  for(const expected of opts.text??[])assert.ok(text.includes(expected),`${scene} at ${cue}+700 ms is missing “${expected}”`);
  for(const expected of opts.markup??[])assert.ok(frame.html.includes(expected),`${scene} at ${cue}+700 ms is missing markup ${expected}`);
  const threshold=plan.cues[absentBeforeCue??cue];
  for(const earlier of byKind(scene)){
    if(earlier.ms>=threshold-1)continue;
    const earlierText=plain(earlier.html);
    for(const expected of opts.text??[])assert.ok(!earlierText.includes(expected),`${scene} at ${earlier.kind} already shows “${expected}” before ${absentBeforeCue??cue}`);
    for(const expected of opts.markup??[])assert.ok(!earlier.html.includes(expected),`${scene} at ${earlier.kind} already shows markup ${expected} before ${absentBeforeCue??cue}`);
  }
  return frame.html;
}

type Box={x:number;y:number;w:number;h:number;id?:string};
const intersects=(a:Box,b:Box)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function assertDisjoint(boxes:readonly Box[],label:string){
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(!intersects(boxes[i],boxes[j]),`${label}: ${boxes[i].id??i} overlaps ${boxes[j].id??j}`);
}
function assertInside(box:Box,container:Box,label:string){
  assert.ok(box.x>=container.x&&box.y>=container.y&&box.x+box.w<=container.x+container.w&&box.y+box.h<=container.y+container.h,`${label} leaves its container`);
}

if(process.env.MIN3_7_B_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({scene,ms,kind,html})=>({scene,ms,kind,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  for(const {scene,ms,kind,html} of rendered){
    assert.ok(!html.includes('NaN'),`${scene} ${kind} at ${ms} contains NaN`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${scene} ${kind} renders a literal underscore`);
    assert.ok(!interactionHint.test(plain(html)),`${scene} ${kind} renders an interaction hint`);
  }

  beat('LiteratureHandoff','t17Social',{text:['ESTABLISHED SOCIAL PSYCHOLOGY'],markup:['data-source-frame="1"','data-source-frame="2"','data-source-frame="3"']});
  beat('LiteratureHandoff','t17Three',{text:['BIAS','PREJUDICE','DISCRIMINATION'],markup:['data-literature-card="BIAS"','data-literature-card="PREJUDICE"','data-literature-card="DISCRIMINATION"']});
  beat('LiteratureHandoff','t17Distinct',{markup:['data-literature-socket="1"','data-literature-socket="2"','data-literature-socket="3"']});
  beat('LiteratureHandoff','t17Definitions',{text:['a tendency in judgment and evaluation because of group membership','Greenwald & Banaji 1995','group antipathy grounded in a rigid, erroneous generalization','Allport 1954, p. 9','behavior that treats people differently because of group membership','Fiske 1998']});
  beat('LiteratureHandoff','t17Experimental',{text:['EXPERIMENTAL PSYCHOLOGY'],markup:['data-discipline="experimental"']});
  beat('LiteratureHandoff','t17Psychology',{markup:['data-discipline="social-prejudice"','data-discipline="social-discrimination"','data-literature-boundary="true"']});
  beat('LiteratureHandoff','t18Preface',{text:['LITERATURE HANDOFF'],markup:['data-book-dock="true"']});
  beat('LiteratureHandoff','t18Chapter',{text:['PREFACE + CHAPTER 2']});
  beat('LiteratureHandoff','t18Original',{text:['THE ORIGINAL POWER']});
  beat('LiteratureHandoff','t18Established',{markup:['data-literature-channel="1"','data-literature-channel="2"','data-literature-channel="3"']});
  beat('LiteratureHandoff','t18Each',{text:['BIAS · STARTING TENDENCY','PREJUDICE · GROUP ANTIPATHY','DISCRIMINATION · DIFFERENTIAL BEHAVIOR'],markup:['data-job-sockets="true"']});
  beat('LiteratureHandoff','t18Job',{text:['Established definitions enter the book directly.'],markup:['data-lock-trace="true"']});

  beat('APAGroupDefinitions','t19Baseline',{markup:['data-sorting-field="radial"','data-shared="PersonMark"']});
  const sorted=beat('APAGroupDefinitions','t19Sort',{});
  assert.ok(sorted.includes('left:480px;top:395px'), 'APAGroupDefinitions center mark has not reached the specified field center');
  beat('APAGroupDefinitions','t19American',{text:['APA Dictionary of Psychology'],markup:['data-definition-card-wrap="true"']});
  beat('APAGroupDefinitions','t19Ingroup',{text:['INGROUP','a social unit in which a person holds membership or psychological identification','(paraphrased)'],markup:['data-group-boundary="true"']});
  beat('APAGroupDefinitions','t19Membership',{text:['MEMBERSHIP'],markup:['data-membership-token="person-2"']});
  beat('APAGroupDefinitions','t19Identification',{text:['PSYCHOLOGICAL IDENTIFICATION'],markup:['data-identification-ring="true"']});
  beat('APAGroupDefinitions','t20Reference',{text:['OUTGROUP','a social unit outside a person’s own group membership or identification, toward which that person feels detachment, competition, or opposition']});
  beat('APAGroupDefinitions','t20Outgroup',{markup:['data-outgroup-outline="person-10"']});
  beat('APAGroupDefinitions','t20Outside',{text:['OUTSIDE THE PERSON’S GROUP'],markup:['data-exterior-shade="true"']});
  beat('APAGroupDefinitions','t20Detachment',{text:['DETACHMENT']});
  beat('APAGroupDefinitions','t20Competition',{text:['COMPETITION']});
  beat('APAGroupDefinitions','t20Opposition',{text:['OPPOSITION']});
  beat('APAGroupDefinitions','t21American',{text:['INGROUP BIAS','the tendency to favor one’s own group and its members when dividing resources, judging conduct, and explaining behavior']});
  beat('APAGroupDefinitions','t21Bias',{markup:['data-group="ingroup"']});
  beat('APAGroupDefinitions','t21Tendency',{markup:['data-tendency-arrow="true"']});
  const resources=beat('APAGroupDefinitions','t21Resources',{text:['DIVIDING RESOURCES','DERIVED ILLUSTRATION'],markup:['data-allocation-tray="true"']});
  assert.equal((resources.match(/data-resource-route="inward"/g)??[]).length,8,'resource illustration does not route eight tokens inward');
  assert.equal((resources.match(/data-resource-route="outward"/g)??[]).length,4,'resource illustration does not route four tokens outward');
  beat('APAGroupDefinitions','t21Conduct',{text:['JUDGING CONDUCT'],markup:['data-conduct-frame="warm"','data-conduct-frame="cool"']});
  beat('APAGroupDefinitions','t21Behavior',{text:['EXPLAINING BEHAVIOR']});

  beat('TajfelCitation','t22Henri',{text:['HENRI TAJFEL'],markup:['data-citation-plate="true"']});
  beat('TajfelCitation','t22Turner',{text:['HENRI TAJFEL · JOHN C. TURNER']});
  beat('TajfelCitation','t22Formalized',{markup:['data-formalized-rule="true"']});
  beat('TajfelCitation','t22SeventyNine',{text:['1979'],markup:['data-year-medallion="true"']});
  beat('TajfelCitation','t22Social',{text:['AN INTEGRATIVE'],markup:['data-title-block="true"']});
  beat('TajfelCitation','t22Theory',{text:['AN INTEGRATIVE THEORY OF INTERGROUP CONFLICT']});
  beat('TajfelCitation','t22Relations',{markup:['data-outgoing-connector="true"']});

  const canvas={x:0,y:0,w:1920,h:1080};
  assertDisjoint(LITERATURE_HANDOFF_LAYOUT.cards,'LiteratureHandoff source cards');
  for(const card of LITERATURE_HANDOFF_LAYOUT.cards){
    assertInside(card,canvas,'LiteratureHandoff card');
    assert.ok(card.y+card.h<LITERATURE_HANDOFF_LAYOUT.disciplineY,'LiteratureHandoff card overlaps its discipline label');
  }
  assert.ok(LITERATURE_HANDOFF_LAYOUT.disciplineY+28<LITERATURE_HANDOFF_LAYOUT.boundary.y,'LiteratureHandoff discipline labels overlap the literature boundary');
  assert.ok(LITERATURE_HANDOFF_LAYOUT.boundary.y<LITERATURE_HANDOFF_LAYOUT.dock.y,'LiteratureHandoff boundary overlaps the book dock');
  assert.ok(LITERATURE_HANDOFF_LAYOUT.dock.y+LITERATURE_HANDOFF_LAYOUT.dock.h<LITERATURE_HANDOFF_LAYOUT.source.y,'LiteratureHandoff dock overlaps the source line');
  assert.ok(!intersects(APA_GROUP_LAYOUT.definition,APA_GROUP_LAYOUT.field),'APA definition card overlaps the sorting field');
  assertInside(APA_GROUP_LAYOUT.definition,canvas,'APA definition card');
  assertInside(APA_GROUP_LAYOUT.field,canvas,'APA sorting field');
  assertInside(APA_GROUP_LAYOUT.tray,APA_GROUP_LAYOUT.field,'APA allocation tray');
  assertDisjoint(APA_GROUP_LAYOUT.textBoxes,'APAGroupDefinitions text boxes');
  assert.equal(APA_GROUP_LAYOUT.field.cx,480,'APA field center x changed');
  assert.equal(APA_GROUP_LAYOUT.field.cy,395,'APA field center y changed');
  assert.equal(APA_GROUP_LAYOUT.field.r,285,'APA group boundary radius changed');
  assert.equal(APA_MARKS.length,21,'APA field mark count changed');
  assert.ok(!intersects(TAJFEL_LAYOUT.names,TAJFEL_LAYOUT.year),'Tajfel names overlap the year medallion');
  assert.ok(!intersects(TAJFEL_LAYOUT.names,TAJFEL_LAYOUT.title),'Tajfel names overlap the title block');
  assert.ok(!intersects(TAJFEL_LAYOUT.year,TAJFEL_LAYOUT.title),'Tajfel year medallion overlaps the title block');
  assertInside(TAJFEL_LAYOUT.names,TAJFEL_LAYOUT.plate,'Tajfel names line');
  assertInside(TAJFEL_LAYOUT.year,TAJFEL_LAYOUT.plate,'Tajfel year medallion');
  assertInside(TAJFEL_LAYOUT.title,TAJFEL_LAYOUT.plate,'Tajfel title block');

  console.log(`PASS: ${rendered.length} Package B cue-derived frames; storyboard strings, deterministic geometry, 8/4 derived allocation, hook policy, underscore policy, interaction-hint policy, and text-box layout verified.`);
}
