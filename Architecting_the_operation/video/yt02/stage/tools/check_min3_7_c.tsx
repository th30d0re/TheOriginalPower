import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type StagePlan} from '@stage';
import {UsThemSorting,US_THEM_LAYOUT,US_THEM_MARKS} from '../min3_7/c/UsThemSorting';
import {HostWetware,HOST_WETWARE_LAYOUT,HOST_INPUT_MARKS} from '../min3_7/c/HostWetware';
import {BiasDefinition,BIAS_LAYOUT,BIAS_TILT} from '../min3_7/c/BiasDefinition';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const sceneComponents={UsThemSorting,HostWetware,BiasDefinition};
type SceneName=keyof typeof sceneComponents;
const sceneCues:Record<SceneName,string[]>={
  UsThemSorting:['t23Social','t23Demonstrates','t23Sort','t23Us','t23Them','t23Speed','t23Prompting','t24Sorting','t24Bands','t24Trust','t24Threat','t24Reciprocity','t24Belonging','t24SelfConcept'],
  HostWetware:['t25Terminology','t25Brain','t25Biological','t25Wetware','t25Predictive','t25Pattern','t25Categorization','t26Bandwidth','t26Compresses','t26Variation','t26Labels','t26Deliberate','t26Reasoning','t27Pattern','t27Survival','t27Bands','t27Allies','t27Strangers','t27Consequences'],
  BiasDefinition:['t28Baseline','t28Experimental','t28Three','t28Interpersonal','t28Process','t28Act','t28Categories','t29Concept','t29Bias','t29Tendency','t29Favors','t29Perception','t29Evaluation','t29Explanation'],
};

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in Package C render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

const sourceFiles=['UsThemSorting.tsx','HostWetware.tsx','BiasDefinition.tsx'];
for(const file of sourceFiles){
  const source=fs.readFileSync(new URL(`../min3_7/c/${file}`,import.meta.url),'utf8');
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

if(process.env.MIN3_7_C_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({scene,ms,kind,html})=>({scene,ms,kind,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  for(const {scene,ms,kind,html} of rendered){
    assert.ok(!html.includes('NaN'),`${scene} ${kind} at ${ms} contains NaN`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${scene} ${kind} renders a literal underscore`);
    assert.ok(!interactionHint.test(plain(html)),`${scene} ${kind} renders an interaction hint`);
  }

  beat('UsThemSorting','t23Social',{text:['SOCIAL IDENTITY THEORY','Tajfel & Turner 1979'],markup:['data-sorting-field-wrap="true"']});
  beat('UsThemSorting','t23Demonstrates',{markup:['data-categorization-pulse="true"']});
  beat('UsThemSorting','t23Sort',{markup:['data-sort-motion="true"']});
  beat('UsThemSorting','t23Us',{text:['US']});
  beat('UsThemSorting','t23Them',{text:['THEM']});
  beat('UsThemSorting','t23Speed',{text:['RAPID SORTING'],markup:['data-rapid-trace="true"']});
  beat('UsThemSorting','t23Prompting',{text:['MINIMAL PROMPTING']});
  beat('UsThemSorting','t24Sorting',{text:['BOUNDED GROUPS'],markup:['data-band="1"','data-band="2"','data-band="3"']});
  beat('UsThemSorting','t24Bands',{text:['SMALL BANDS + ALLIANCES']});
  beat('UsThemSorting','t24Trust',{text:['TRUST'],markup:['data-trust-bridge="true"']});
  beat('UsThemSorting','t24Threat',{text:['THREAT DETECTION'],markup:['data-threat-arc="true"']});
  beat('UsThemSorting','t24Reciprocity',{text:['RECIPROCITY'],markup:['data-reciprocity-pair="true"']});
  beat('UsThemSorting','t24Belonging',{text:['BELONGING'],markup:['data-belonging-wrap="true"']});
  beat('UsThemSorting','t24SelfConcept',{text:['SELF-CONCEPT'],markup:['data-self-ring="true"']});

  beat('HostWetware','t25Terminology',{text:['THE ORIGINAL POWER · BOOK MATERIAL'],markup:['data-book-ribbon="true"']});
  beat('HostWetware','t25Brain',{text:['NEURAL NETWORK'],markup:['data-shared="NeuralField"']});
  beat('HostWetware','t25Biological',{text:['BIOLOGICAL HOST WETWARE']});
  beat('HostWetware','t25Wetware',{markup:['data-input-socket="1"','data-input-socket="4"','data-compressed-bus="true"']});
  beat('HostWetware','t25Predictive',{text:['PREDICTIVE']});
  beat('HostWetware','t25Pattern',{text:['PATTERN-COMPRESSING'],markup:['data-output-bus="true"']});
  beat('HostWetware','t25Categorization',{text:['FAST CATEGORIZATION','ALLY','STRANGER','UNKNOWN'],markup:['data-output-card="ally"','data-output-card="stranger"','data-output-card="unknown"']});
  beat('HostWetware','t26Bandwidth',{text:['FINITE MENTAL BANDWIDTH'],markup:['data-bandwidth-meter="true"']});
  const compressed=beat('HostWetware','t26Compresses',{markup:['data-input-variation="true"']});
  assert.equal((compressed.match(/data-shared="PersonMark"/g)??[]).length,28,'HostWetware does not show 24 varied marks plus four predictive ghost marks');
  beat('HostWetware','t26Variation',{text:['COMPLEX SOCIAL VARIATION']});
  beat('HostWetware','t26Labels',{text:['SIMPLE GROUP LABELS','Compression reduces the active representation.']});
  beat('HostWetware','t26Deliberate',{text:['DELIBERATE REASONING'],markup:['data-processing-lane="deliberate"']});
  const reasoning=beat('HostWetware','t26Reasoning',{});
  assert.ok(reasoning.includes('width:400px'),'HostWetware deliberate lane has not reached the labels at t26Reasoning+700 ms');
  beat('HostWetware','t27Pattern',{markup:['data-band-diagram="true"']});
  beat('HostWetware','t27Survival',{text:['SURVIVAL-RELEVANT CATEGORIZATION'],markup:['data-survival-ring="true"']});
  beat('HostWetware','t27Bands',{text:['ANCESTRAL BAND']});
  beat('HostWetware','t27Allies',{markup:['data-band-allies="true"']});
  beat('HostWetware','t27Strangers',{markup:['data-band-strangers="true"']});
  beat('HostWetware','t27Consequences',{text:['IMMEDIATE PHYSICAL CONSEQUENCE'],markup:['data-consequence-pulse="true"']});

  beat('BiasDefinition','t28Baseline',{markup:['data-host-bus-baseline="true"']});
  beat('BiasDefinition','t28Experimental',{text:['EXPERIMENTAL PSYCHOLOGY']});
  beat('BiasDefinition','t28Three',{text:['BIAS','PREJUDICE','DISCRIMINATION'],markup:['data-term="BIAS"','data-term="PREJUDICE"','data-term="DISCRIMINATION"']});
  beat('BiasDefinition','t28Interpersonal',{text:['INTERPERSONAL CONCEPTS'],markup:['data-interpersonal-bracket="true"']});
  beat('BiasDefinition','t28Process',{text:['PROCESS'],markup:['data-process-channel="bias"','data-process-channel="prejudice"']});
  beat('BiasDefinition','t28Act',{text:['ACT'],markup:['data-act-channel="true"']});
  beat('BiasDefinition','t28Categories',{text:['GROUP CATEGORY']});
  beat('BiasDefinition','t29Concept',{markup:['data-definition-wrap="true"']});
  beat('BiasDefinition','t29Bias',{markup:['data-definition-term="BIAS"']});
  beat('BiasDefinition','t29Tendency',{text:['STARTING TENDENCY'],markup:['data-tilt-meter="perception"','data-tilt-meter="evaluation"','data-tilt-meter="explanation"']});
  const favored=beat('BiasDefinition','t29Favors',{markup:['data-favored-side="true"']});
  assert.equal((favored.match(/data-favored-side="true"/g)??[]).length,3,'BiasDefinition does not emphasize the favored side of all three meters');
  beat('BiasDefinition','t29Perception',{text:['PERCEPTION']});
  beat('BiasDefinition','t29Evaluation',{text:['EVALUATION']});
  beat('BiasDefinition','t29Explanation',{text:['EXPLANATION','a tendency or lean that favors or disfavors individuals or groups in perception, evaluation, and explanation because of group membership','(paraphrased)','Greenwald & Banaji 1995']});

  const canvas={x:0,y:0,w:1920,h:1080};
  assert.equal(US_THEM_MARKS.length,48,'UsThemSorting mark count changed');
  assertDisjoint([US_THEM_LAYOUT.title,US_THEM_LAYOUT.rapid,US_THEM_LAYOUT.prompt],'UsThemSorting upper text boxes');
  assertDisjoint(US_THEM_LAYOUT.functions,'UsThemSorting function labels');
  assert.ok(!intersects(US_THEM_LAYOUT.bands,US_THEM_LAYOUT.functions[4]),'UsThemSorting bands label overlaps self-concept');
  assert.ok(!intersects(US_THEM_LAYOUT.bounded,US_THEM_LAYOUT.functions[2])&&!intersects(US_THEM_LAYOUT.bounded,US_THEM_LAYOUT.functions[3]),'UsThemSorting bounded label overlaps lower function labels');
  for(const box of [US_THEM_LAYOUT.title,US_THEM_LAYOUT.rapid,US_THEM_LAYOUT.prompt,US_THEM_LAYOUT.bands,US_THEM_LAYOUT.bounded,...US_THEM_LAYOUT.functions,US_THEM_LAYOUT.source])assertInside(box,canvas,'UsThemSorting text box');

  assert.equal(HOST_INPUT_MARKS.length,24,'HostWetware input mark count changed');
  assertDisjoint(HOST_WETWARE_LAYOUT.outputCards,'HostWetware output cards');
  assert.ok(HOST_WETWARE_LAYOUT.ribbon.y+HOST_WETWARE_LAYOUT.ribbon.h<HOST_WETWARE_LAYOUT.neural.y,'HostWetware ribbon overlaps neural field');
  assert.ok(HOST_WETWARE_LAYOUT.neural.x+HOST_WETWARE_LAYOUT.neural.w<HOST_WETWARE_LAYOUT.output.x,'HostWetware neural field overlaps output bus');
  assert.ok(HOST_WETWARE_LAYOUT.fastLane.y+HOST_WETWARE_LAYOUT.fastLane.h<=HOST_WETWARE_LAYOUT.deliberateLane.y,'HostWetware processing lanes overlap');
  assert.ok(HOST_WETWARE_LAYOUT.deliberateLane.y+HOST_WETWARE_LAYOUT.deliberateLane.h<HOST_WETWARE_LAYOUT.source.y,'HostWetware deliberate lane overlaps source');
  for(const box of [HOST_WETWARE_LAYOUT.ribbon,HOST_WETWARE_LAYOUT.neural,HOST_WETWARE_LAYOUT.input,HOST_WETWARE_LAYOUT.output,HOST_WETWARE_LAYOUT.bandwidth,HOST_WETWARE_LAYOUT.fastLane,HOST_WETWARE_LAYOUT.deliberateLane,HOST_WETWARE_LAYOUT.band,HOST_WETWARE_LAYOUT.source,...HOST_WETWARE_LAYOUT.outputCards])assertInside(box,canvas,'HostWetware layout box');

  assertDisjoint(BIAS_LAYOUT.terms,'BiasDefinition turn-28 term cards');
  assertDisjoint(BIAS_LAYOUT.meters,'BiasDefinition tilt meters');
  assert.ok(!intersects(BIAS_LAYOUT.definition,BIAS_LAYOUT.meters[0])&&!intersects(BIAS_LAYOUT.definition,BIAS_LAYOUT.meters[1])&&!intersects(BIAS_LAYOUT.definition,BIAS_LAYOUT.meters[2]),'BiasDefinition definition card overlaps tilt meters');
  assert.ok(BIAS_LAYOUT.stack.x+BIAS_LAYOUT.stack.w<BIAS_LAYOUT.input.x,'BiasDefinition term stack overlaps group-category input');
  assert.ok(BIAS_LAYOUT.input.x+BIAS_LAYOUT.input.w<BIAS_LAYOUT.lanes.x,'BiasDefinition group-category input overlaps processing lanes');
  assert.ok(BIAS_LAYOUT.meters[2].y+BIAS_LAYOUT.meters[2].h<BIAS_LAYOUT.starting.y,'BiasDefinition final meter overlaps starting-tendency label');
  assert.equal(BIAS_TILT.fraction,.18,'BiasDefinition tilt changed from the storyboard 18%');
  for(const box of [BIAS_LAYOUT.heading,BIAS_LAYOUT.stack,BIAS_LAYOUT.bracket,BIAS_LAYOUT.input,BIAS_LAYOUT.lanes,BIAS_LAYOUT.definition,BIAS_LAYOUT.starting,BIAS_LAYOUT.source,...BIAS_LAYOUT.terms,...BIAS_LAYOUT.meters])assertInside(box,canvas,'BiasDefinition layout box');

  console.log(`PASS: ${rendered.length} Package C cue-derived frames; 48 deterministic sorting marks, 24-to-3 compression, 18% tilt geometry, storyboard strings, hook policy, underscore policy, interaction-hint policy, and text-box layout verified.`);
}
