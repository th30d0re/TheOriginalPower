import React from 'react';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {renderToStaticMarkup} from 'react-dom/server';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {PredictiveCoding, PREDICTIVE_CODING_TEXT_BOXES} from '../min3_7/d/PredictiveCoding';
import {ComputationalBias, COMPUTATIONAL_BIAS_TEXT_BOXES} from '../min3_7/d/ComputationalBias';
import {InstalledRacialPrior, INSTALLED_PRIOR_TEXT_BOXES, installedPrecision} from '../min3_7/d/InstalledRacialPrior';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const scenes={PredictiveCoding,ComputationalBias,InstalledRacialPrior};
type SceneName=keyof typeof scenes;
const sceneCues:Record<SceneName,string[]>={
  PredictiveCoding:['t30Why','t30Predictive','t30Perception','t30Error','t30Priors','t30Data','t30Updates','t30Plain','t30Guesses','t30Compares','t30Report','t31Architecture','t31Bias','t31Tilt','t31Starting','t31Guessing','t31GeneralPurpose','t31Legally','t31Weight'],
  ComputationalBias:['t32Computer','t32Two','t32Neural','t32BiasTerm','t32Offset','t32Layer','t32Social','t32BiasSocial','t32Weights','t32Repeats'],
  InstalledRacialPrior:['t33Book','t33Installed','t33Prior','t33Pi','t33Stereotypes','t33Bayesian','t33Override','t33Evidence','t33Institutions','t33Weight','t34Bias','t34Sociology','t34Neuroscience','t34Learning','t34Prediction','t34Experience','t34Accurate','t34Outdated','t34History'],
};

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in Package D render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

for(const file of ['PredictiveCoding.tsx','ComputationalBias.tsx','InstalledRacialPrior.tsx','sceneUtils.tsx']){
  const source=fs.readFileSync(new URL(`../min3_7/d/${file}`,import.meta.url),'utf8');
  assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),`${file} contains a forbidden hook`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

function render(scene:SceneName,ms:number){
  const Scene=scenes[scene],segment=plan.segments.find(item=>item.scene===scene)!;
  return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:plan.fps,interactive:false}}><Scene segment={segment} shots={segment.shots} shotAt={time=>segment.shots.find(shot=>time>=shot.start_ms&&time<shot.end_ms)}/></ClockContext.Provider></PlanContext.Provider>);
}

function plain(html:string){
  return html.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&gt;','>').replaceAll('&lt;','<').replace(/\s+/g,' ').trim();
}

const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
const interactionHint=/\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;
const frames:{scene:SceneName;ms:number;kind:string}[]=[];
for(const scene of Object.keys(scenes) as SceneName[]){
  const segment=plan.segments.find(item=>item.scene===scene)!;
  frames.push({scene,ms:segment.start_ms,kind:'start'});
  for(const cue of sceneCues[scene])frames.push({scene,ms:plan.cues[cue]+700,kind:cue});
  frames.push({scene,ms:segment.end_ms-1000/plan.fps,kind:'end'});
}
const rendered=frames.map(frame=>({...frame,html:render(frame.scene,frame.ms)}));
const byScene=(scene:SceneName)=>rendered.filter(frame=>frame.scene===scene);

function beat(scene:SceneName,cue:string,expected:string[],markup:string[]=[]){
  const frame=byScene(scene).find(item=>item.kind===cue)!;
  const text=plain(frame.html);
  for(const value of expected)assert.ok(text.includes(value),`${scene} at ${cue}+700 ms is missing “${value}”`);
  for(const value of markup)assert.ok(frame.html.includes(value),`${scene} at ${cue}+700 ms is missing markup ${value}`);
  for(const earlier of byScene(scene)){
    if(earlier.ms>=plan.cues[cue]-1)continue;
    const earlierText=plain(earlier.html);
    for(const value of expected)assert.ok(!earlierText.includes(value),`${scene} at ${earlier.kind} already shows “${value}” before ${cue}`);
    for(const value of markup)assert.ok(!earlier.html.includes(value),`${scene} at ${earlier.kind} already shows markup ${value} before ${cue}`);
  }
  return frame.html;
}

type Box={x:number;y:number;w:number;h:number};
const overlaps=(a:Box,b:Box)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function assertSeparated(name:string,boxes:readonly Box[]){
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(!overlaps(boxes[i],boxes[j]),`${name} text boxes ${i+1} and ${j+1} overlap`);
}

function curvePath(html:string,name:string){
  const match=html.match(new RegExp(`data-curve="${name}" d="([^"]+)"`));
  assert.ok(match,`missing ${name} curve`);
  return match[1];
}
function numericAttribute(html:string,name:string){
  const match=html.match(new RegExp(`${name}="([0-9.]+)"`));
  assert.ok(match,`missing ${name}`);
  return Number(match[1]);
}

if(process.env.MIN3_7_D_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({scene,ms,kind,html})=>({scene,ms,kind,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  for(const {scene,kind,ms,html} of rendered){
    assert.ok(!html.includes('NaN'),`${scene} ${kind} at ${ms} contains NaN`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${scene} ${kind} renders a literal underscore`);
    assert.ok(!interactionHint.test(plain(html)),`${scene} ${kind} renders an interaction hint`);
  }

  beat('PredictiveCoding','t30Why',['Why does the brain carry bias at all?']);
  beat('PredictiveCoding','t30Predictive',['PREDICTIVE CODING']);
  beat('PredictiveCoding','t30Perception',[],['data-percept-marker="true"']);
  beat('PredictiveCoding','t30Error',['PREDICTION ERROR']);
  beat('PredictiveCoding','t30Priors',['TOP-DOWN PRIOR']);
  beat('PredictiveCoding','t30Data',['INCOMING SENSORY DATA']);
  beat('PredictiveCoding','t30Updates',['UPDATE']);
  beat('PredictiveCoding','t30Plain',[],['data-beat="t30Plain"']);
  beat('PredictiveCoding','t30Guesses',['GUESS']);
  beat('PredictiveCoding','t30Compares',['COMPARE']);
  beat('PredictiveCoding','t30Report',['SENSORY REPORT']);
  beat('PredictiveCoding','t31Architecture',[],['data-loop-persistent="true"']);
  beat('PredictiveCoding','t31Bias',['BIAS']);
  beat('PredictiveCoding','t31Tilt',[],['data-guess-marker="true"']);
  beat('PredictiveCoding','t31Starting',['BIAS = A TILT IN THE STARTING ASSUMPTION']);
  beat('PredictiveCoding','t31GeneralPurpose',['GENERAL-PURPOSE PREDICTION']);
  beat('PredictiveCoding','t31Legally',['LEGAL + SOCIAL REINFORCEMENT','RACIAL PRIOR','PRECISION','HIGH WEIGHT']);
  beat('PredictiveCoding','t31Weight',['Institutional reinforcement gives the racial prior overwhelming weight.']);

  beat('ComputationalBias','t32Computer',['COMPUTER SCIENCE · TWO USES OF BIAS']);
  beat('ComputationalBias','t32Two',[],['data-divider="true"']);
  beat('ComputationalBias','t32Neural',[],['<circle']);
  beat('ComputationalBias','t32BiasTerm',['NEURAL-NETWORK BIAS TERM','CONSTANT INPUT']);
  beat('ComputationalBias','t32Offset',['NUMERICAL OFFSET IN EACH LAYER'],['data-offset-trace="1"','data-offset-trace="4"']);
  beat('ComputationalBias','t32Layer',['LAYER 1','LAYER 2','LAYER 3','LAYER 4']);
  beat('ComputationalBias','t32Social',['SOCIAL BIAS IN LANGUAGE MODELS']);
  beat('ComputationalBias','t32BiasSocial',['PATTERNS IN TRAINING TEXT']);
  beat('ComputationalBias','t32Weights',['WEIGHTS TRAINED ON HUMAN TEXT']);
  beat('ComputationalBias','t32Repeats',['REPEATED PATTERN']);

  beat('InstalledRacialPrior','t33Book',[],['data-prior-plot="true"']);
  beat('InstalledRacialPrior','t33Installed',['INSTITUTIONAL REINFORCEMENT']);
  beat('InstalledRacialPrior','t33Prior',['INSTALLED RACIAL PRIOR']);
  const piHtml=beat('InstalledRacialPrior','t33Pi',[],['<sub style="font-size:0.7em;line-height:0">race</sub>']);
  assert.ok(plain(piHtml).includes('Πrace'),'installed prior cartridge is missing Π with race subscript');
  beat('InstalledRacialPrior','t33Stereotypes',['STEREOTYPES → COMPRESSED PRIORS']);
  const equationHtml=beat('InstalledRacialPrior','t33Bayesian',['POSTERIOR','SENSORY EVIDENCE','RACIAL PRIOR','Eq. 2.8a · Bayesian prior']);
  assert.ok(equationHtml.includes('P<sub')&&equationHtml.includes('Π<sub'),'Eq. 2.8a does not use real subscripts');
  beat('InstalledRacialPrior','t33Override',['α = 0 · EVIDENCE-LED']);
  beat('InstalledRacialPrior','t33Evidence',[],['data-curve="evidence"']);
  beat('InstalledRacialPrior','t33Institutions',['DERIVED · NORMALIZED PRIOR PRECISION α']);
  beat('InstalledRacialPrior','t33Weight',['α = 1 · PRIOR-LED']);
  beat('InstalledRacialPrior','t34Bias',['BIAS']);
  beat('InstalledRacialPrior','t34Sociology',['SOCIOLOGY']);
  beat('InstalledRacialPrior','t34Neuroscience',['NEUROSCIENCE']);
  beat('InstalledRacialPrior','t34Learning',['MACHINE LEARNING']);
  beat('InstalledRacialPrior','t34Prediction',['PREDICTION FROM PRIOR EXPERIENCE']);
  beat('InstalledRacialPrior','t34Experience',[],['data-pattern-key="history-ribbon"']);
  beat('InstalledRacialPrior','t34Accurate',['A STARTING ASSUMPTION CAN BE','ACCURATE']);
  beat('InstalledRacialPrior','t34Outdated',['OUTDATED']);
  beat('InstalledRacialPrior','t34History',['EARNED BY REAL HISTORY']);

  assertSeparated('PredictiveCoding',PREDICTIVE_CODING_TEXT_BOXES);
  assertSeparated('ComputationalBias',COMPUTATIONAL_BIAS_TEXT_BOXES);
  assertSeparated('InstalledRacialPrior turn 33',INSTALLED_PRIOR_TEXT_BOXES.turn33);
  assertSeparated('InstalledRacialPrior turn 34',INSTALLED_PRIOR_TEXT_BOXES.turn34);

  const precisionSamples=['t33Override','t33Evidence','t33Institutions','t33Weight'].map(kind=>byScene('InstalledRacialPrior').find(frame=>frame.kind===kind)!);
  const modes=precisionSamples.map(frame=>numericAttribute(frame.html,'data-posterior-mode'));
  const precisions=precisionSamples.map(frame=>numericAttribute(frame.html,'data-precision'));
  for(let i=1;i<modes.length;i++)assert.ok(modes[i]>modes[i-1],`posterior mode is not monotonic at sample ${i+1}: ${modes.join(' / ')}`);
  for(let i=1;i<precisions.length;i++)assert.ok(precisions[i]>=precisions[i-1],`precision is not monotonic: ${precisions.join(' / ')}`);
  const evidencePaths=precisionSamples.map(frame=>curvePath(frame.html,'evidence'));
  assert.ok(evidencePaths.every(path=>path===evidencePaths[0]),'evidence likelihood geometry changes during the precision sweep');
  assert.equal(installedPrecision(plan.cues.t33Override,plan.cues.t33Override,plan.cues.t33Weight),0);
  assert.equal(installedPrecision(plan.cues.t33Weight,plan.cues.t33Override,plan.cues.t33Weight),1);

  console.log(`PASS: ${rendered.length} Package D cue-derived frames; three scene contracts, exact beat timing, real subscripts, hook policy, underscore policy, interaction-hint policy, non-overlapping text-box constants, fixed evidence likelihood, and monotonic posterior sweep verified. Posterior modes: ${modes.map(value=>value.toFixed(6)).join(' / ')}.`);
}
