import React from 'react';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {renderToStaticMarkup} from 'react-dom/server';
import {ClockContext,PlanContext,type StagePlan} from '@stage';
import {DictionaryEntry,DICTIONARY_EQ_25} from '../firstminute/DictionaryEntry';
import {SequenceAsTheory,EQ_25} from '../min3_7/a/SequenceAsTheory';
import {HeartsAudit} from '../min3_7/a/HeartsAudit';
import {InstalledRacialPrior,EQ_28A} from '../min3_7/d/InstalledRacialPrior';
import {EQUATION_TERMS,equationColor,pulseScaleAmplitude,type EquationTermId} from '../equations';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const scenes={DictionaryEntry,SequenceAsTheory,HeartsAudit,InstalledRacialPrior};
type SceneName=keyof typeof scenes;

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in equation render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

for(const file of ['EquationTerms.tsx','TermChip.tsx']){
  const source=fs.readFileSync(new URL(`../equations/${file}`,import.meta.url),'utf8');
  assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),`${file} contains a forbidden hook`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

function render(scene:SceneName,ms:number){
  const Scene=scenes[scene],segment=plan.segments.find(item=>item.scene===scene)!;
  return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:plan.fps,interactive:false}}><Scene segment={segment} shots={segment.shots} shotAt={time=>segment.shots.find(shot=>time>=shot.start_ms&&time<shot.end_ms)}/></ClockContext.Provider></PlanContext.Provider>);
}

const decode=(value:string)=>value.replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const attrs=(tag:string)=>Object.fromEntries([...tag.matchAll(/([^\s=/]+)(?:="([^"]*)")?/g)].map(match=>[match[1],decode(match[2]??'')]));
function termElements(html:string){
  return [...html.matchAll(/<[^>]+data-term="[^"]+"[^>]*>/g)].map(match=>attrs(match[0])).map(item=>({
    id:item['data-term'] as EquationTermId,
    colour:item['data-term-color'],
    pulse:Number(item['data-pulse']),
    scale:Number(item['data-scale']),
    style:item.style??'',
  }));
}

const pulseCases:{scene:SceneName;term:EquationTermId;cue:string}[]=[
  {scene:'DictionaryEntry',term:'IndividualPrejudice',cue:'individual'},
  {scene:'DictionaryEntry',term:'SystemicOutcomes',cue:'institutional'},
  {scene:'SequenceAsTheory',term:'IndividualPrejudice',cue:'t12Personal'},
  {scene:'SequenceAsTheory',term:'IndividualPrejudice',cue:'t12Root'},
  {scene:'SequenceAsTheory',term:'SystemicOutcomes',cue:'t12Institutional'},
  {scene:'InstalledRacialPrior',term:'PiRace',cue:'t33Pi'},
  {scene:'InstalledRacialPrior',term:'PiRace',cue:'t33Priors'},
  {scene:'InstalledRacialPrior',term:'T',cue:'t33Priors'},
  {scene:'InstalledRacialPrior',term:'i',cue:'t33Priors'},
  {scene:'InstalledRacialPrior',term:'X',cue:'t33Sensory'},
  {scene:'InstalledRacialPrior',term:'PiRace',cue:'t33Institutions'},
];

const sampleFrames:{scene:SceneName;ms:number;kind:string}[]=[];
for(const [scene,cues] of Object.entries({
  DictionaryEntry:['individual','institutional','causal'],
  SequenceAsTheory:['t11Unstated','t12Personal','t12Root','t12Institutional'],
  HeartsAudit:['t15Formally'],
  InstalledRacialPrior:['t33Pi','t33Priors','t33Sensory','t33Evidence','t33Institutions','t34Bias'],
}) as [SceneName,string[]][]){
  for(const cue of cues)sampleFrames.push({scene,ms:plan.cues[cue]+700,kind:cue});
}
const sampled=sampleFrames.map(frame=>({...frame,html:render(frame.scene,frame.ms)}));

if(process.env.EQUATIONS_SNAPSHOT==='1'){
  console.log(JSON.stringify(sampled.map(({scene,ms,kind,html})=>({scene,ms,kind,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  let coloured=0;
  for(const frame of sampled){
    for(const item of termElements(frame.html)){
      assert.ok(item.id in EQUATION_TERMS,`${frame.scene} ${frame.kind} has unregistered data-term ${item.id}`);
      const expected=equationColor(EQUATION_TERMS[item.id].slot);
      assert.equal(item.colour,expected,`${frame.scene} ${frame.kind} ${item.id} declares ${item.colour}, expected ${expected}`);
      assert.ok(item.style.includes(`color:${expected}`),`${frame.scene} ${frame.kind} ${item.id} does not render in ${expected}`);
      coloured++;
    }
  }
  assert.ok(coloured>80,`too few coloured equation terms were inspected: ${coloured}`);

  const frameMs=1000/plan.fps;
  for(const test of pulseCases){
    const cue=plan.cues[test.cue], offsets=[200-frameMs,200,200+frameMs];
    const peaks=offsets.map(offset=>termElements(render(test.scene,cue+offset)).filter(item=>item.id===test.term));
    assert.ok(peaks[1].length>0,`${test.scene} ${test.term} has no visible instance at ${test.cue}+200 ms`);
    assert.ok(peaks[1].every(item=>Math.abs(item.pulse-1)<1e-4&&Math.abs(item.scale-(1+pulseScaleAmplitude(test.term)))<1e-4),`${test.scene} ${test.term} does not peak at ${test.cue}+200 ms`);
    const maxima=peaks.map(items=>Math.max(...items.map(item=>item.pulse)));
    assert.equal(maxima.indexOf(Math.max(...maxima)),1,`${test.scene} ${test.term} pulse peak falls outside one frame of ${test.cue}+200 ms`);
    const rested=termElements(render(test.scene,cue+700)).filter(item=>item.id===test.term);
    assert.ok(rested.length>0&&rested.every(item=>item.pulse===0&&item.scale===1),`${test.scene} ${test.term} is not at rest after ${test.cue}+600 ms`);
  }

  assert.equal(DICTIONARY_EQ_25,EQ_25,'Eq. 2.5 registries diverge');
  for(const [scene,ms] of [['DictionaryEntry',plan.cues.causal+700],['SequenceAsTheory',plan.cues.t11Unstated+700],['HeartsAudit',plan.cues.t15Formally+700]] as [SceneName,number][]){
    const html=render(scene,ms);
    assert.ok(html.includes(`data-equation="${EQ_25.replaceAll('→','→')}"`),`${scene} does not carry verbatim Eq. 2.5`);
  }
  for(const ms of [plan.cues.t33Evidence+1000,plan.cues.t34Bias+700]){
    const html=render('InstalledRacialPrior',ms);
    assert.ok(html.includes(`data-equation="${EQ_28A}"`),'InstalledRacialPrior does not carry verbatim Eq. 2.8a');
    assert.ok(html.includes('>i</sub>')&&html.includes('>race</sub>'),'Eq. 2.8a subscripts are not rendered through MathText');
  }

  console.log(`PASS: ${sampled.length} equation frames; ${coloured} registered coloured terms; ${pulseCases.length} pulse cues peak at cue + 200 ms and rest after 600 ms; Eq. 2.5 and Eq. 2.8a are verbatim with MathText subscripts.`);
}
