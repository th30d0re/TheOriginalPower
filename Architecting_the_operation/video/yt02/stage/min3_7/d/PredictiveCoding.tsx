import React from 'react';
import {progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame, PrecisionGauge} from '../shared';
import {CurveLane, Label, Panel, SceneSource, clamp, enter, lineAttrs, mix, mixBox, pathFrom, shapeAttrs, type LayoutBox, type Point} from './sceneUtils';

// Storyboard boxes. The percept plot keeps its storyboard x span and ends at y 620 so that the
// racial-prior precision gauge (no storyboard box in this scene) has its own box under it.
export const PREDICTIVE_CODING_LAYOUT = {
  header:{x:150,y:96,w:1620,h:64}, headerStrip:{x:150,y:96,w:1620,h:44},
  loop:{x:170,y:230,w:1040,h:660},
  prior:{x:210,y:275,w:400,h:260}, evidence:{x:210,y:610,w:400,h:240},
  core:{x:700,y:350,w:460,h:410}, output:{x:1270,y:280,w:500,h:340},
  gauge:{x:1270,y:640,w:500,h:250}, bus:{x:1270,y:904,w:500,h:56},
} as const satisfies Record<string,LayoutBox>;

export const PREDICTIVE_CODING_TEXT = {
  predictive:{x:170,y:186,w:520,h:32}, general:{x:830,y:190,w:380,h:28}, starting:{x:200,y:240,w:640,h:30},
  bias:{x:460,y:275,w:80,h:30}, error:{x:720,y:372,w:420,h:34}, update:{x:1000,y:440,w:110,h:30},
  compare:{x:934,y:588,w:140,h:30}, percept:{x:1294,y:296,w:300,h:28}, racial:{x:1294,y:340,w:220,h:30},
  report:{x:1294,y:560,w:452,h:34}, legal:{x:1290,y:916,w:460,h:32}, weight:{x:120,y:902,w:1130,h:40},
} as const satisfies Record<string,LayoutBox>;

/** Unit-interval means. Evidence stays fixed; the prior updates toward it in turn 30 and tilts left in turn 31. */
export const PREDICTIVE_MEANS = {evidence:.64, priorStart:.40, priorUpdated:.52, priorTilted:.36, outputStart:.60, outputWeighted:.40} as const;

const COMPARATOR = {x:880,y:570,r:26} as const;
const PREDICTION_WIRE:Point[] = [[610,480],[860,480],[880,500],[880,COMPARATOR.y-COMPARATOR.r]];
const EVIDENCE_WIRE:Point[] = [[610,700],[860,700],[880,680],[880,COMPARATOR.y+COMPARATOR.r]];
const OUTPUT_WIRE:Point[] = [[COMPARATOR.x+COMPARATOR.r,570],[1270,570]];
const UPDATE_PATH:Point[] = [[900,551],[960,520],[990,470],[970,430],[610,430]];
const BRACKET_LEFT:Point[] = [[846,532],[838,532],[838,608],[846,608]];
const BRACKET_RIGHT:Point[] = [[914,532],[922,532],[922,608],[914,608]];
const PERCEPT = {left:1324,right:1716,y:500,guessY:450} as const;
const SENSORY_MARK = {from:732,to:830,y:700,r:9} as const;
const perceptX=(mean:number)=>PERCEPT.left+(PERCEPT.right-PERCEPT.left)*mean;

export function PredictiveCoding({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    why:useCue('t30Why'),predictive:useCue('t30Predictive'),perception:useCue('t30Perception'),error:useCue('t30Error'),priors:useCue('t30Priors'),data:useCue('t30Data'),updates:useCue('t30Updates'),plain:useCue('t30Plain'),guesses:useCue('t30Guesses'),compares:useCue('t30Compares'),report:useCue('t30Report'),
    architecture:useCue('t31Architecture'),bias:useCue('t31Bias'),tilt:useCue('t31Tilt'),starting:useCue('t31Starting'),guessing:useCue('t31Guessing'),general:useCue('t31GeneralPurpose'),legally:useCue('t31Legally'),weight:useCue('t31Weight'),
  };
  const L=PREDICTIVE_CODING_LAYOUT, T=PREDICTIVE_CODING_TEXT, M=PREDICTIVE_MEANS, turn31=ms>=cue.architecture.at;
  const whyP=enter(ms,cue.why.at), stripP=enter(ms,cue.predictive.at,600), frameP=enter(ms,cue.predictive.at,600);
  const priorP=enter(ms,cue.priors.at), evidenceP=enter(ms,cue.data.at), updateP=enter(ms,cue.updates.at,650);
  const priorMean=turn31?mix(M.priorUpdated,M.priorTilted,enter(ms,cue.tilt.at,520)):mix(M.priorStart,M.priorUpdated,updateP);
  const weightP=enter(ms,cue.weight.at,600), precision=.25+.6*weightP, outputMean=mix(M.outputStart,M.outputWeighted,weightP);
  const guessCycle=turn31?progress(ms,cue.guessing.at,cue.guessing.at+1200):progress(ms,cue.guesses.at,cue.compares.at);
  const markX=mix(SENSORY_MARK.from,SENSORY_MARK.to,ms>=cue.compares.at&&!turn31?1:guessCycle);
  const header=mixBox(L.header,L.headerStrip,stripP), headerSize=Math.round(mix(46,30,stripP));
  const red=color('color/marker/race'), gold=color('color/fill/gold'), accent=color('color/text/accent');
  return <StageSceneFrame segment={segment}>
    {ms>=cue.why.at && <Label id="question" box={header} size={headerSize} weight={500} ls={0} lh={1.2} sans opacity={whyP} style={{fontFamily:'IBM Plex Sans'}}>
      <span data-beat="t30Why">Why does the brain carry bias at all?</span>
    </Label>}

    {ms>=cue.predictive.at && <>
      <Panel box={L.loop} id="loop" dataPanel="prediction-loop" style={{opacity:frameP}}/>
      <Label id="predictive-coding" box={T.predictive} size={22} weight={500} ls={1.4} ink={gold} opacity={frameP}><span data-beat="t30Predictive">PREDICTIVE CODING</span></Label>
      <Panel box={L.core} id="core" dataPanel="comparison-core" style={{opacity:frameP}}/>
      <Panel box={L.output} id="output" dataPanel="percept-output" style={{opacity:frameP}}/>
      <Label id="percept-title" box={T.percept} size={20} weight={500} ls={1} ink={color('color/text/muted')} opacity={frameP}>LIVE PERCEPT / OUTPUT</Label>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
        <path {...lineAttrs('percept-axis',[[PERCEPT.left,PERCEPT.y],[PERCEPT.right,PERCEPT.y]])} d={`M${PERCEPT.left} ${PERCEPT.y}H${PERCEPT.right}`} stroke={color('color/line/hairline')} strokeWidth="2" opacity={frameP}/>
        <circle {...shapeAttrs('comparator',{x:COMPARATOR.x-COMPARATOR.r,y:COMPARATOR.y-COMPARATOR.r,w:2*COMPARATOR.r,h:2*COMPARATOR.r},'mark')} cx={COMPARATOR.x} cy={COMPARATOR.y} r={COMPARATOR.r} fill={color('color/bg/field')} stroke={accent} strokeWidth="3" opacity={frameP}/>
        <path {...lineAttrs('output-wire',OUTPUT_WIRE)} d={pathFrom(OUTPUT_WIRE)} fill="none" stroke={color('color/line/wire')} strokeWidth="3" opacity={frameP}/>
      </svg>
    </>}

    {ms>=cue.perception.at && <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      <circle data-percept-marker="true" {...shapeAttrs('percept-marker',{x:perceptX(outputMean)-15,y:PERCEPT.y-15,w:30,h:30},'mark')} cx={perceptX(outputMean)} cy={PERCEPT.y} r="15" fill={gold} opacity={enter(ms,cue.perception.at)}/>
    </svg>}

    {ms>=cue.error.at && <Label id="prediction-error" box={T.error} size={26} align="center" ink={accent} opacity={enter(ms,cue.error.at)}><span data-beat="t30Error">PREDICTION ERROR</span></Label>}

    {ms>=cue.priors.at && <>
      <CurveLane id="prior" box={L.prior} labelW={200} mean={priorMean} label="TOP-DOWN PRIOR" progress={priorP} tone={turn31?'red':'gold'}/>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path {...lineAttrs('prediction-wire',PREDICTION_WIRE)} d={pathFrom(PREDICTION_WIRE)} fill="none" stroke={color('color/line/wire')} strokeWidth="3" opacity={priorP}/></svg>
    </>}
    {ms>=cue.data.at && <>
      <CurveLane id="evidence" box={L.evidence} labelW={290} mean={M.evidence} label="INCOMING SENSORY DATA" progress={evidenceP}/>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path {...lineAttrs('evidence-wire',EVIDENCE_WIRE)} d={pathFrom(EVIDENCE_WIRE)} fill="none" stroke={gold} strokeWidth="3" opacity={evidenceP}/></svg>
    </>}

    {ms>=cue.updates.at && <>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path {...lineAttrs('update-path',UPDATE_PATH)} d={pathFrom(UPDATE_PATH)} fill="none" stroke={accent} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-updateP}/></svg>
      <Label id="update" box={T.update} size={24} ls={0} lh={1.2} ink={accent} opacity={updateP}><span data-beat="t30Updates">UPDATE</span></Label>
    </>}

    {ms>=cue.plain.at && <div data-beat="t30Plain" {...shapeAttrs('plain-loop',{x:L.core.x+12,y:L.core.y+12,w:L.core.w-24,h:L.core.h-24},'frame')} style={{position:'absolute',left:L.core.x+12,top:L.core.y+12,width:L.core.w-24,height:L.core.h-24,border:`2px solid ${gold}`,boxSizing:'border-box',opacity:.32*enter(ms,cue.plain.at)}}/>}

    {ms>=cue.guesses.at && <>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><circle data-sensory-mark="true" {...shapeAttrs('sensory-mark',{x:markX-SENSORY_MARK.r,y:SENSORY_MARK.y-SENSORY_MARK.r,w:2*SENSORY_MARK.r,h:2*SENSORY_MARK.r},'mark')} cx={markX} cy={SENSORY_MARK.y} r={SENSORY_MARK.r} fill={gold} opacity={enter(ms,cue.guesses.at)}/></svg>
      <Label id="guess" box={{x:markX+30,y:712,w:80,h:30}} size={24} ls={0} lh={1.2} ink={red} opacity={enter(ms,cue.guesses.at)}><span data-beat="t30Guesses">GUESS</span></Label>
    </>}
    {ms>=cue.compares.at && <>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={enter(ms,cue.compares.at)}>
        <path {...lineAttrs('bracket-left',BRACKET_LEFT)} d={pathFrom(BRACKET_LEFT)} fill="none" stroke={gold} strokeWidth="3"/>
        <path {...lineAttrs('bracket-right',BRACKET_RIGHT)} d={pathFrom(BRACKET_RIGHT)} fill="none" stroke={gold} strokeWidth="3"/>
      </svg>
      <Label id="compare" box={T.compare} size={24} ls={0} lh={1.2} ink={gold} opacity={enter(ms,cue.compares.at)}><span data-beat="t30Compares">COMPARE</span></Label>
    </>}
    {ms>=cue.report.at && <Label id="sensory-report" box={T.report} size={26} align="center" opacity={enter(ms,cue.report.at)}><span data-beat="t30Report">SENSORY REPORT</span></Label>}

    {turn31 && <>
      <div data-beat="t31Architecture" data-loop-persistent="true"/>
      {ms>=cue.bias.at && <Label id="bias" box={T.bias} size={22} weight={700} ls={0} ink={red} opacity={enter(ms,cue.bias.at)}><span data-beat="t31Bias">BIAS</span></Label>}
      {ms>=cue.tilt.at && <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><circle data-guess-marker="true" {...shapeAttrs('guess-marker',{x:perceptX(priorMean)-11,y:PERCEPT.guessY-11,w:22,h:22},'mark')} cx={perceptX(priorMean)} cy={PERCEPT.guessY} r="11" fill={red} opacity={clamp(.2+guessCycle)*enter(ms,cue.tilt.at)}/></svg>}
      {ms>=cue.starting.at && <Label id="starting" box={T.starting} size={24} weight={700} ls={0} lh={1.2} ink={red} opacity={enter(ms,cue.starting.at)}><span data-beat="t31Starting">BIAS = A TILT IN THE STARTING ASSUMPTION</span></Label>}
      {ms>=cue.general.at && <Label id="general" box={T.general} size={20} weight={500} ls={1} align="right" ink={color('color/text/soft')} opacity={enter(ms,cue.general.at)}><span data-beat="t31GeneralPurpose">GENERAL-PURPOSE PREDICTION</span></Label>}
      {ms>=cue.legally.at && <>
        <div {...shapeAttrs('legal-bus',L.bus,'frame')} style={{position:'absolute',left:L.bus.x,top:L.bus.y,width:L.bus.w,height:L.bus.h,boxSizing:'border-box',border:`1px solid ${red}`,opacity:enter(ms,cue.legally.at)}}/>
        <Label id="legal" box={T.legal} size={22} ls={0} ink={red} opacity={enter(ms,cue.legally.at)}><span data-beat="t31Legally">LEGAL + SOCIAL REINFORCEMENT</span></Label>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path {...lineAttrs('legal-link',[[1520,L.bus.y],[1520,L.gauge.y+L.gauge.h]])} d={`M1520 ${L.bus.y}V${L.gauge.y+L.gauge.h}`} stroke={red} strokeWidth="4" opacity={enter(ms,cue.legally.at)}/></svg>
        <Label id="racial-prior" box={T.racial} size={24} weight={700} ls={0} lh={1.2} ink={red} opacity={enter(ms,cue.legally.at+180)}>RACIAL PRIOR</Label>
        <div data-gauge-box="true" {...shapeAttrs('precision-gauge',L.gauge,'frame')} style={{position:'absolute',left:L.gauge.x,top:L.gauge.y,width:L.gauge.w,height:L.gauge.h,opacity:enter(ms,cue.legally.at)}}><PrecisionGauge value={precision} derived={false} label="PRECISION" lowLabel="LOW" highLabel="HIGH WEIGHT"/></div>
      </>}
      {ms>=cue.weight.at && <Label id="weight-sentence" box={T.weight} size={28} weight={400} ls={0} lh={1.2} sans align="center" ink={color('color/text/soft')} opacity={enter(ms,cue.weight.at)}><span data-beat="t31Weight">Institutional reinforcement gives the racial prior overwhelming weight.</span></Label>}
    </>}
    <SceneSource text="Friston 2010 · Clark 2013" opacity={enter(ms,segment.start_ms,400)}/>
  </StageSceneFrame>;
}
