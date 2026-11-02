import React from 'react';
import {progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame, PrecisionGauge} from '../shared';
import {CurveLane, FadeIn, Panel, clamp, enter, type LayoutBox} from './sceneUtils';

export const PREDICTIVE_CODING_LAYOUT = {
  header:{x:150,y:95,w:1620,h:90}, loop:{x:170,y:230,w:1040,h:660},
  prior:{x:210,y:275,w:400,h:260}, evidence:{x:210,y:610,w:400,h:240},
  core:{x:700,y:350,w:460,h:410}, output:{x:1270,y:280,w:500,h:520},
  gauge:{x:1320,y:530,w:400,h:250},
} as const satisfies Record<string,LayoutBox>;

export const PREDICTIVE_CODING_TEXT_BOXES = [
  PREDICTIVE_CODING_LAYOUT.header,
  {x:230,y:292,w:350,h:34},{x:230,y:626,w:350,h:34},
  {x:730,y:375,w:400,h:50},{x:730,y:680,w:400,h:42},
  {x:1300,y:305,w:440,h:66},{x:1300,y:718,w:440,h:58},
] as const;

const shiftedPriorMean=(ms:number,tiltAt:number)=>.38-.14*enter(ms,tiltAt,520);

export function PredictiveCoding({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    why:useCue('t30Why'),predictive:useCue('t30Predictive'),perception:useCue('t30Perception'),error:useCue('t30Error'),priors:useCue('t30Priors'),data:useCue('t30Data'),updates:useCue('t30Updates'),plain:useCue('t30Plain'),guesses:useCue('t30Guesses'),compares:useCue('t30Compares'),report:useCue('t30Report'),
    architecture:useCue('t31Architecture'),bias:useCue('t31Bias'),tilt:useCue('t31Tilt'),starting:useCue('t31Starting'),guessing:useCue('t31Guessing'),general:useCue('t31GeneralPurpose'),legally:useCue('t31Legally'),weight:useCue('t31Weight'),
  };
  const L=PREDICTIVE_CODING_LAYOUT, turn31=ms>=cue.architecture.at;
  const frameP=enter(ms,cue.predictive.at,600), priorP=enter(ms,cue.priors.at), evidenceP=enter(ms,cue.data.at);
  const priorMean=turn31?shiftedPriorMean(ms,cue.tilt.at):.38+.14*enter(ms,cue.updates.at,620);
  const updateP=enter(ms,cue.updates.at,650);
  const precision=.25+.6*enter(ms,cue.weight.at,600), outputMean=turn31?.395-(.075*enter(ms,cue.weight.at,600)):.395;
  const guessCycle=turn31?progress(ms,cue.guessing.at,cue.guessing.at+1200):progress(ms,cue.guesses.at,cue.compares.at);
  return <StageSceneFrame segment={segment} source="Friston 2010 · Clark 2013">
    {ms>=cue.why.at && <FadeIn ms={ms} at={cue.why.at} style={{position:'absolute',...L.header,fontSize:46,lineHeight:1.15,fontWeight:500}} dataBeat="t30Why">Why does the brain carry bias at all?</FadeIn>}
    {ms>=cue.predictive.at && <><Panel box={L.loop} dataPanel="prediction-loop" style={{opacity:frameP}}/><FadeIn ms={ms} at={cue.predictive.at} style={{position:'absolute',left:190,top:202,width:560,font:'500 22px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/fill/gold')}} dataBeat="t30Predictive">PREDICTIVE CODING</FadeIn></>}
    {ms>=cue.plain.at && <div data-beat="t30Plain" style={{position:'absolute',left:L.core.x+12,top:L.core.y+12,width:L.core.w-24,height:L.core.h-24,border:`2px solid ${color('color/fill/gold')}`,boxSizing:'border-box',opacity:.32*enter(ms,cue.plain.at)}}/>}
    {ms>=cue.priors.at && <CurveLane box={L.prior} mean={priorMean} label="TOP-DOWN PRIOR" progress={priorP} tone={turn31?'red':'gold'}/>} 
    {ms>=cue.data.at && <CurveLane box={L.evidence} mean={.64} label="INCOMING SENSORY DATA" progress={evidenceP}/>} 
    <Panel box={L.core} dataPanel="comparison-core" style={{opacity:frameP}}>
      {ms>=cue.error.at && <FadeIn ms={ms} at={cue.error.at} style={{position:'absolute',left:28,top:28,right:28,textAlign:'center',font:'600 26px "IBM Plex Mono"',color:color('color/text/accent')}} dataBeat="t30Error">PREDICTION ERROR</FadeIn>}
      <svg width="460" height="410" viewBox="0 0 460 410" aria-hidden="true" style={{position:'absolute',inset:0}}>
        <path d="M24 126 H190 Q230 126 230 176 V224 Q230 274 270 274 H436" fill="none" stroke={color('color/line/wire')} strokeWidth="3" opacity={priorP}/>
        <path d="M24 316 H168 Q230 316 230 254" fill="none" stroke={color('color/fill/gold')} strokeWidth="3" opacity={evidenceP}/>
        {ms>=cue.updates.at && <path d="M230 220 C330 150 350 104 300 76" fill="none" stroke={color('color/text/accent')} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-updateP}/>} 
        {ms>=cue.compares.at && <path d="M182 196 H278 M182 186 V206 M278 186 V206" fill="none" stroke={color('color/fill/gold')} strokeWidth="3" opacity={enter(ms,cue.compares.at)}/>} 
      </svg>
      {ms>=cue.updates.at && <FadeIn ms={ms} at={cue.updates.at} style={{position:'absolute',left:270,top:78,font:'600 24px "IBM Plex Mono"',color:color('color/text/accent')}} dataBeat="t30Updates">UPDATE</FadeIn>}
      {ms>=cue.guesses.at && <FadeIn ms={ms} at={cue.guesses.at} style={{position:'absolute',left:44+130*guessCycle,top:170,font:'600 24px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t30Guesses">GUESS</FadeIn>}
      {ms>=cue.compares.at && <FadeIn ms={ms} at={cue.compares.at} style={{position:'absolute',left:166,top:218,width:128,textAlign:'center',font:'600 24px "IBM Plex Mono"',color:color('color/fill/gold')}} dataBeat="t30Compares">COMPARE</FadeIn>}
    </Panel>
    <Panel box={L.output} dataPanel="percept-output" style={{opacity:frameP}}>
      <div style={{position:'absolute',left:28,top:24,font:'500 20px "IBM Plex Mono"',letterSpacing:1,color:color('color/text/muted')}}>LIVE PERCEPT / OUTPUT</div>
      <svg width="500" height="520" viewBox="0 0 500 520" aria-hidden="true"><line x1="54" y1="360" x2="446" y2="360" stroke={color('color/line/hairline')} strokeWidth="2"/>{ms>=cue.perception.at && <circle data-percept-marker="true" cx={54+392*outputMean} cy="360" r="15" fill={color('color/fill/gold')} opacity={enter(ms,cue.perception.at)}/>} {ms>=cue.tilt.at && <circle data-guess-marker="true" cx={54+392*(priorMean+.08)} cy="300" r="11" fill={color('color/marker/race')} opacity={clamp(guessCycle+.2)}/>}</svg>
      {ms>=cue.report.at && <FadeIn ms={ms} at={cue.report.at} style={{position:'absolute',left:30,right:30,bottom:42,textAlign:'center',font:'600 26px "IBM Plex Mono"',color:color('color/text/primary')}} dataBeat="t30Report">SENSORY REPORT</FadeIn>}
    </Panel>
    {turn31 && <>
      <div data-beat="t31Architecture" data-loop-persistent="true"/>
      {ms>=cue.bias.at && <FadeIn ms={ms} at={cue.bias.at} style={{position:'absolute',left:438,top:326,font:'700 24px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t31Bias">BIAS</FadeIn>}
      {ms>=cue.starting.at && <FadeIn ms={ms} at={cue.starting.at} style={{position:'absolute',left:210,top:238,width:700,font:'700 28px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t31Starting">BIAS = A TILT IN THE STARTING ASSUMPTION</FadeIn>}
      {ms>=cue.general.at && <FadeIn ms={ms} at={cue.general.at} style={{position:'absolute',left:850,top:202,width:350,textAlign:'right',font:'500 20px "IBM Plex Mono"',letterSpacing:1,color:color('color/text/soft')}} dataBeat="t31GeneralPurpose">GENERAL-PURPOSE PREDICTION</FadeIn>}
      {ms>=cue.legally.at && <FadeIn ms={ms} at={cue.legally.at} style={{position:'absolute',left:1240,top:834,width:540,height:72,padding:'18px 22px',boxSizing:'border-box',border:`1px solid ${color('color/marker/race')}`,font:'600 22px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t31Legally">LEGAL + SOCIAL REINFORCEMENT</FadeIn>}
      {ms>=cue.legally.at && <FadeIn ms={ms} at={cue.legally.at+180} style={{position:'absolute',left:1310,top:425,width:380,textAlign:'center',font:'700 24px "IBM Plex Mono"',color:color('color/marker/race')}}>RACIAL PRIOR</FadeIn>}
      {ms>=cue.legally.at && <div style={{position:'absolute',...L.gauge,opacity:enter(ms,cue.legally.at)}}><PrecisionGauge value={precision} derived={false} label="PRECISION" lowLabel="LOW" highLabel="HIGH WEIGHT"/></div>}
      {ms>=cue.weight.at && <FadeIn ms={ms} at={cue.weight.at} style={{position:'absolute',left:230,top:920,width:1460,textAlign:'center',fontSize:28,lineHeight:1.25,color:color('color/text/soft')}} dataBeat="t31Weight">Institutional reinforcement gives the racial prior overwhelming weight.</FadeIn>}
    </>}
  </StageSceneFrame>;
}
