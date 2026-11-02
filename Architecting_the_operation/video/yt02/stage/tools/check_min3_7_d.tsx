import React from 'react';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {renderToStaticMarkup} from 'react-dom/server';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {PredictiveCoding, PREDICTIVE_MEANS} from '../min3_7/d/PredictiveCoding';
import {ComputationalBias, LAYER_OFFSET_PX} from '../min3_7/d/ComputationalBias';
import {InstalledRacialPrior, BAYES, installedPosterior, installedPrecision} from '../min3_7/d/InstalledRacialPrior';
import {auditItems, auditLayout, auditSelfTest} from './layout_audit';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const scenes={PredictiveCoding,ComputationalBias,InstalledRacialPrior};
type SceneName=keyof typeof scenes;
const sceneCues:Record<SceneName,string[]>={
  PredictiveCoding:['t30Why','t30Predictive','t30Perception','t30Error','t30Priors','t30Data','t30Updates','t30Plain','t30Guesses','t30Compares','t30Report','t31Architecture','t31Bias','t31Tilt','t31Starting','t31Guessing','t31GeneralPurpose','t31Legally','t31Weight'],
  ComputationalBias:['t32Computer','t32Two','t32Neural','t32BiasTerm','t32Offset','t32Layer','t32Social','t32BiasSocial','t32Weights','t32Repeats'],
  InstalledRacialPrior:['t33Book','t33Installed','t33Prior','t33Pi','t33Stereotypes','t33Bayesian','t33Override','t33Evidence','t33Institutions','t33Weight','t34Bias','t34Sociology','t34Neuroscience','t34Learning','t34Prediction','t34Experience','t34Accurate','t34Outdated','t34History'],
};
const GRID_MS=500;

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
  for(let ms=segment.start_ms+GRID_MS;ms<segment.end_ms;ms+=GRID_MS)frames.push({scene,ms,kind:`grid-${ms}`});
  frames.push({scene,ms:segment.end_ms-1000/plan.fps,kind:'end'});
}
const rendered=frames.map(frame=>({...frame,html:render(frame.scene,frame.ms)}));
const byScene=(scene:SceneName)=>rendered.filter(frame=>frame.scene===scene);
const cueFrame=(scene:SceneName,cue:string)=>byScene(scene).find(item=>item.kind===cue)!;

/** `text` and `markup` must be present at cue+700 ms; `absent` (default: all of `text` and `markup`) must be missing from every earlier frame. */
function beat(scene:SceneName,cue:string,opts:{text?:string[];markup?:string[];absent?:string[]}){
  const frame=cueFrame(scene,cue), text=plain(frame.html);
  for(const value of opts.text??[])assert.ok(text.includes(value),`${scene} at ${cue}+700 ms is missing “${value}”`);
  for(const value of opts.markup??[])assert.ok(frame.html.includes(value),`${scene} at ${cue}+700 ms is missing markup ${value}`);
  const absent=opts.absent??[...(opts.text??[]),...(opts.markup??[])];
  for(const earlier of byScene(scene)){
    if(earlier.ms>=plan.cues[cue]-1)continue;
    for(const value of absent)assert.ok(!plain(earlier.html).includes(value)&&!earlier.html.includes(value),`${scene} at ${earlier.kind} already shows “${value}” before ${cue}`);
  }
  return frame.html;
}

function curvePoints(html:string,name:string){
  const match=html.match(new RegExp(`data-curve="${name}"[^>]*data-points="([^"]+)"`));
  assert.ok(match,`missing ${name} curve`);
  return match[1].split(' ').map(pair=>pair.split(',').map(Number) as [number,number]);
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

  const selfTests=auditSelfTest();
  // Layout audit: safe area, notch zones, text fit, and no text/shape collisions at every sampled frame.
  let audited=0, items=0;
  const violations:string[]=[];
  for(const {scene,kind,ms,html} of rendered){
    const found=auditLayout(html);
    for(const problem of found)violations.push(`${scene} ${kind} (${ms} ms): ${problem}`);
    audited++; items+=auditItems(html).length;
  }
  assert.deepEqual(violations,[],`layout audit failed:\n${violations.slice(0,40).join('\n')}`);
  for(const scene of Object.keys(scenes) as SceneName[]){
    const last=byScene(scene).find(frame=>frame.kind==='end')!;
    assert.ok(auditItems(last.html).filter(item=>item.role==='text'&&item.opacity>.05).length>=6,`${scene} final frame declares too few audited text boxes`);
  }

  beat('PredictiveCoding','t30Why',{text:['Why does the brain carry bias at all?']});
  beat('PredictiveCoding','t30Predictive',{text:['PREDICTIVE CODING']});
  beat('PredictiveCoding','t30Perception',{markup:['data-percept-marker="true"']});
  beat('PredictiveCoding','t30Error',{text:['PREDICTION ERROR']});
  beat('PredictiveCoding','t30Priors',{text:['TOP-DOWN PRIOR']});
  beat('PredictiveCoding','t30Data',{text:['INCOMING SENSORY DATA']});
  beat('PredictiveCoding','t30Updates',{text:['UPDATE']});
  beat('PredictiveCoding','t30Plain',{markup:['data-beat="t30Plain"']});
  beat('PredictiveCoding','t30Guesses',{text:['GUESS']});
  beat('PredictiveCoding','t30Compares',{text:['COMPARE']});
  beat('PredictiveCoding','t30Report',{text:['SENSORY REPORT']});
  beat('PredictiveCoding','t31Architecture',{markup:['data-loop-persistent="true"']});
  beat('PredictiveCoding','t31Bias',{text:['BIAS']});
  beat('PredictiveCoding','t31Tilt',{markup:['data-guess-marker="true"']});
  beat('PredictiveCoding','t31Starting',{text:['BIAS = A TILT IN THE STARTING ASSUMPTION']});
  beat('PredictiveCoding','t31GeneralPurpose',{text:['GENERAL-PURPOSE PREDICTION']});
  beat('PredictiveCoding','t31Legally',{text:['LEGAL + SOCIAL REINFORCEMENT','RACIAL PRIOR','PRECISION','HIGH WEIGHT']});
  beat('PredictiveCoding','t31Weight',{text:['Institutional reinforcement gives the racial prior overwhelming weight.']});
  const laneMean=(html:string,id:string)=>numericAttribute(html.slice(html.indexOf(`data-shape="${id}-curve"`)),'data-lane-mean');
  const tiltFrames=['t31Architecture','t31Starting'].map(cue=>cueFrame('PredictiveCoding',cue).html);
  assert.ok(Math.abs(laneMean(tiltFrames[0],'prior')-PREDICTIVE_MEANS.priorUpdated)<1e-4,'turn 31 does not start from the updated turn-30 prior');
  assert.ok(Math.abs(laneMean(tiltFrames[1],'prior')-PREDICTIVE_MEANS.priorTilted)<1e-4,'turn 31 prior does not tilt left');
  assert.ok(tiltFrames.every(html=>Math.abs(laneMean(html,'evidence')-PREDICTIVE_MEANS.evidence)<1e-4),'sensory evidence moves during the tilt');

  beat('ComputationalBias','t32Computer',{text:['COMPUTER SCIENCE · TWO USES OF BIAS']});
  beat('ComputationalBias','t32Two',{markup:['data-divider="true"']});
  beat('ComputationalBias','t32Neural',{markup:['data-shape="left-network"']});
  beat('ComputationalBias','t32BiasTerm',{text:['NEURAL-NETWORK BIAS TERM','CONSTANT INPUT'],markup:['data-constant-node="true"','data-constant-link="4"']});
  beat('ComputationalBias','t32Offset',{text:['NUMERICAL OFFSET IN EACH LAYER'],markup:['data-offset-trace="1"','data-offset-trace="4"']});
  beat('ComputationalBias','t32Layer',{text:['LAYER 1','LAYER 2','LAYER 3','LAYER 4']});
  beat('ComputationalBias','t32Social',{text:['SOCIAL BIAS IN LANGUAGE MODELS']});
  beat('ComputationalBias','t32BiasSocial',{text:['PATTERNS IN TRAINING TEXT'],markup:['data-input-strip="3"']});
  beat('ComputationalBias','t32Weights',{text:['WEIGHTS TRAINED ON HUMAN TEXT']});
  beat('ComputationalBias','t32Repeats',{text:['REPEATED PATTERN'],markup:['data-output-strip="3"']});
  const offsetTops=(html:string)=>[...html.matchAll(/data-offset-trace="\d"[^>]*data-box="[0-9.]+ ([0-9.]+)/g)].map(match=>Number(match[1]));
  const before=offsetTops(byScene('ComputationalBias').find(frame=>frame.ms>=plan.cues.t32Offset&&frame.ms<plan.cues.t32Offset+40)?.html??render('ComputationalBias',plan.cues.t32Offset));
  const after=offsetTops(cueFrame('ComputationalBias','t32Layer').html);
  assert.equal(after.length,4,'four offset traces expected');
  assert.ok(after.every((top,index)=>Math.abs((before[index]-top)-LAYER_OFFSET_PX)<.2),`every layer trace must shift by the same ${LAYER_OFFSET_PX} px: ${before.join('/')} → ${after.join('/')}`);

  beat('InstalledRacialPrior','t33Book',{markup:['data-prior-plot="true"','data-prior-socket="true"','data-term="likelihood"']});
  beat('InstalledRacialPrior','t33Installed',{text:['INSTITUTIONAL REINFORCEMENT'],markup:['data-cartridge="true"']});
  beat('InstalledRacialPrior','t33Prior',{text:['INSTALLED RACIAL PRIOR']});
  const piHtml=beat('InstalledRacialPrior','t33Pi',{markup:['<sub style="font-size:0.7em;line-height:0">race</sub>','data-term="prior"']});
  assert.ok(plain(piHtml).includes('Πrace'),'installed prior cartridge is missing Π with race subscript');
  beat('InstalledRacialPrior','t33Stereotypes',{text:['STEREOTYPES → COMPRESSED PRIORS']});
  // The storyboard brings the plot back at t33Book; only the strings that the Bayesian beat introduces are held back.
  const equationHtml=beat('InstalledRacialPrior','t33Bayesian',{text:['POSTERIOR','SENSORY EVIDENCE','RACIAL PRIOR','Eq. 2.8a · Bayesian prior'],markup:['data-term="posterior"'],absent:['SENSORY EVIDENCE','Eq. 2.8a · Bayesian prior','data-term="posterior"','data-curve="posterior"']});
  assert.ok(equationHtml.includes('P<sub')&&equationHtml.includes('Π<sub'),'Eq. 2.8a does not use real subscripts');
  assert.ok(plain(equationHtml).includes('Pi(T | X, Πrace)∝P(X | T)·Pi(T | Πrace)'),'Eq. 2.8a is not complete and in term order at t33Bayesian');
  beat('InstalledRacialPrior','t33Override',{text:['α = 0 · EVIDENCE-LED','DERIVED · NORMALIZED PRIOR PRECISION α'],markup:['data-posterior-marker="true"']});
  beat('InstalledRacialPrior','t33Evidence',{markup:['data-curve="evidence"'],absent:[]});
  beat('InstalledRacialPrior','t33Institutions',{markup:['data-beat="t33Institutions"','data-institution-pulse="1"']});
  beat('InstalledRacialPrior','t33Weight',{text:['α = 1 · PRIOR-LED']});
  beat('InstalledRacialPrior','t34Bias',{text:['BIAS']});
  beat('InstalledRacialPrior','t34Sociology',{text:['SOCIOLOGY'],markup:['data-sociology-glyph="true"','data-shared="UsThemSortingField"']});
  beat('InstalledRacialPrior','t34Neuroscience',{text:['NEUROSCIENCE'],markup:['data-neuroscience-glyph="true"']});
  beat('InstalledRacialPrior','t34Learning',{text:['MACHINE LEARNING'],markup:['data-shape="ml-glyph"']});
  beat('InstalledRacialPrior','t34Prediction',{text:['PREDICTION FROM PRIOR EXPERIENCE']});
  beat('InstalledRacialPrior','t34Experience',{markup:['data-history-ribbon="true"']});
  beat('InstalledRacialPrior','t34Accurate',{text:['A STARTING ASSUMPTION CAN BE','ACCURATE']});
  beat('InstalledRacialPrior','t34Outdated',{text:['OUTDATED']});
  beat('InstalledRacialPrior','t34History',{text:['EARNED BY REAL HISTORY']});
  const finalHtml=byScene('InstalledRacialPrior').find(frame=>frame.kind==='end')!.html;
  for(const value of ['SOCIOLOGY','NEUROSCIENCE','MACHINE LEARNING','ACCURATE','OUTDATED','EARNED BY REAL HISTORY','PREDICTION FROM PRIOR EXPERIENCE'])assert.ok(plain(finalHtml).includes(value),`final frame is missing ${value}`);
  assert.ok(finalHtml.includes('Π<sub'),'final frame is missing the equation and cartridge');

  // The sweep (derived display model): fixed evidence, Gaussian prior on its mean, posterior from evidence toward prior.
  const sweep=byScene('InstalledRacialPrior').filter(frame=>frame.ms>=plan.cues.t33Override&&frame.ms<plan.cues.t34Bias).sort((a,b)=>a.ms-b.ms);
  const modes=sweep.map(frame=>numericAttribute(frame.html,'data-posterior-mode'));
  const alphas=sweep.map(frame=>numericAttribute(frame.html,'data-precision'));
  for(let i=1;i<modes.length;i++){
    assert.ok(modes[i]>=modes[i-1]-1e-9,`posterior mode moves back toward the evidence: ${modes.join(' / ')}`);
    assert.ok(alphas[i]>=alphas[i-1],`α is not monotonic: ${alphas.join(' / ')}`);
  }
  const evidencePaths=byScene('InstalledRacialPrior').filter(frame=>frame.ms>=plan.cues.t33Book+600&&frame.ms<plan.cues.t34Bias).map(frame=>JSON.stringify(curvePoints(frame.html,'evidence')));
  assert.ok(evidencePaths.length>10&&evidencePaths.every(path=>path===evidencePaths[0]),'evidence likelihood geometry changes during the sweep');
  const start=installedPosterior(0), end=installedPosterior(1);
  assert.ok(Math.abs(start.mean-BAYES.evidenceMean)<1e-9,'α = 0 posterior mode is not at the evidence');
  assert.ok(Math.abs(end.mean-BAYES.priorMean)<.25*Math.abs(end.mean-BAYES.evidenceMean),'α = 1 posterior mode is not near the prior');
  assert.ok(Math.abs(modes[0]-BAYES.evidenceMean)<1e-6&&Math.abs(modes[modes.length-1]-end.mean)<1e-6,`sampled sweep does not run from α = 0 to α = 1: ${modes[0]} → ${modes[modes.length-1]}`);
  const weightHtml=cueFrame('InstalledRacialPrior','t33Weight').html;
  const prior=curvePoints(weightHtml,'prior'), axisY=Math.max(...prior.map(point=>point[1]));
  const peak=prior.reduce((best,point)=>point[1]<best[1]?point:best);
  const peakU=(peak[0]-prior[0][0])/(prior[prior.length-1][0]-prior[0][0]);
  assert.ok(Math.abs(peakU-BAYES.priorMean)<.012,`prior curve peaks at ${peakU.toFixed(3)}, away from the prior mean`);
  assert.ok(axisY-peak[1]>150&&axisY-prior[0][1]<.05*(axisY-peak[1]),'prior curve is not a Gaussian bump on the axis');
  assert.ok(cueFrame('InstalledRacialPrior','t33Weight').html.includes('DERIVED · NORMALIZED PRIOR PRECISION α'),'the α sweep loses its DERIVED label');
  assert.equal(installedPrecision(plan.cues.t33Institutions,plan.cues.t33Institutions,plan.cues.t33Weight),0);
  assert.equal(installedPrecision(plan.cues.t33Weight,plan.cues.t33Institutions,plan.cues.t33Weight),1);

  console.log(`PASS: audit self-test (${selfTests} rules); ${rendered.length} Package D frames (cues + ${GRID_MS} ms grid); layout audit of ${items} declared boxes over ${audited} frames (safe area, notch zones, text fit, text/shape collisions); exact beat timing, real subscripts, hook and string policies; fixed evidence, Gaussian prior, monotonic posterior sweep ${modes[0].toFixed(4)} → ${modes[modes.length-1].toFixed(4)} (prior ${BAYES.priorMean}).`);
}
