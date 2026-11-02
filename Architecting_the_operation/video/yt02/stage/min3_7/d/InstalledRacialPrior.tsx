import React from 'react';
import {MathText, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PredictiveUpdatePlot, PrecisionGauge, StageSceneFrame, TrainingTextStrip, UsThemSortingField} from '../shared';
import type {SortingMark} from '../shared';
import {FadeIn, MiniNetwork, Panel, clamp, enter, type LayoutBox} from './sceneUtils';

export const INSTALLED_PRIOR_LAYOUT = {
  equation:{x:120,y:105,w:1680,h:155}, plot:{x:120,y:310,w:1200,h:570}, gauge:{x:1390,y:320,w:370,h:380},
  rail:{x:150,y:175,w:1620,h:195}, history:{x:450,y:510,w:1020,h:104}, cards:{x:300,y:690,w:1320,h:190},
} as const satisfies Record<string,LayoutBox>;

export const INSTALLED_PRIOR_TEXT_BOXES = {
  turn33:[INSTALLED_PRIOR_LAYOUT.equation,{x:148,y:278,w:930,h:34},{x:1400,y:280,w:350,h:34}],
  turn34:[{x:150,y:82,w:1620,h:36},{x:150,y:130,w:1620,h:44},{x:150,y:390,w:1620,h:54},{x:300,y:640,w:1320,h:42}],
} as const;

export function installedPrecision(ms:number, overrideAt:number, weightAt:number) {
  return clamp(progress(ms,overrideAt,weightAt));
}

const SORTING_MARKS:readonly SortingMark[]=[
  {id:1,x:.18,y:.28,group:'ingroup'},{id:2,x:.30,y:.58,group:'ingroup'},{id:3,x:.42,y:.40,group:'ingroup'},
  {id:4,x:.61,y:.30,group:'outgroup'},{id:5,x:.74,y:.61,group:'outgroup'},{id:6,x:.84,y:.42,group:'outgroup'},
] as const;

export function InstalledRacialPrior({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={book:useCue('t33Book'),installed:useCue('t33Installed'),prior:useCue('t33Prior'),pi:useCue('t33Pi'),stereotypes:useCue('t33Stereotypes'),bayesian:useCue('t33Bayesian'),override:useCue('t33Override'),evidence:useCue('t33Evidence'),institutions:useCue('t33Institutions'),weight:useCue('t33Weight'),bias:useCue('t34Bias'),sociology:useCue('t34Sociology'),neuroscience:useCue('t34Neuroscience'),learning:useCue('t34Learning'),prediction:useCue('t34Prediction'),experience:useCue('t34Experience'),accurate:useCue('t34Accurate'),outdated:useCue('t34Outdated'),history:useCue('t34History')};
  const L=INSTALLED_PRIOR_LAYOUT, turn34=ms>=cue.bias.at, alpha=installedPrecision(ms,cue.override.at,cue.weight.at);
  const highlight=ms>=cue.weight.at?'posterior':ms>=cue.evidence.at?'evidence':ms>=cue.override.at?'prior':ms>=cue.bayesian.at?'equation':'none';
  const equation=<MathText text="P_i(T | X, Π_{race}) ∝ P(X | T) · P_i(T | Π_{race})"/>;
  return <StageSceneFrame segment={segment}>
    {!turn34 && <>
      <Panel box={L.equation} dataPanel="equation-band" style={{opacity:enter(ms,cue.book.at)}}>{ms>=cue.bayesian.at && <FadeIn ms={ms} at={cue.bayesian.at} style={{position:'absolute',inset:'36px 30px 0',textAlign:'center',fontSize:38,lineHeight:1.25,fontFamily:'IBM Plex Mono',color:color('color/text/primary')}} dataBeat="t33Bayesian">{equation}</FadeIn>}</Panel>
      <div data-prior-plot="true" style={{position:'absolute',left:L.plot.x,top:L.plot.y,width:1040,height:470,opacity:enter(ms,cue.book.at)}}><PredictiveUpdatePlot evidenceMean={.28} priorMean={.72} precision={alpha} showEquation={false} termHighlight={highlight} posteriorProgress={ms>=cue.override.at?1:0}/></div>
      {ms>=cue.installed.at && <FadeIn ms={ms} at={cue.installed.at} style={{position:'absolute',left:1120,top:475,width:220,height:90,padding:'18px',boxSizing:'border-box',border:`2px solid ${color('color/marker/race')}`,font:'600 20px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t33Installed">INSTITUTIONAL REINFORCEMENT</FadeIn>}
      {ms>=cue.prior.at && <FadeIn ms={ms} at={cue.prior.at} style={{position:'absolute',left:1040,top:610,width:300,height:110,padding:'18px',boxSizing:'border-box',background:color('color/fill/red-wash'),border:`1px solid ${color('color/marker/race')}`,textAlign:'center',font:'700 22px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t33Prior">INSTALLED RACIAL PRIOR</FadeIn>}
      {ms>=cue.pi.at && <FadeIn ms={ms} at={cue.pi.at} style={{position:'absolute',left:1120,top:675,width:140,textAlign:'center',font:'700 32px "IBM Plex Mono"',color:color('color/text/primary')}} dataBeat="t33Pi"><MathText text="Π_{race}"/></FadeIn>}
      {ms>=cue.stereotypes.at && <FadeIn ms={ms} at={cue.stereotypes.at} style={{position:'absolute',left:165,top:790,width:900,font:'600 24px "IBM Plex Mono"',color:color('color/text/soft')}} dataBeat="t33Stereotypes">STEREOTYPES → COMPRESSED PRIORS</FadeIn>}
      {ms>=cue.bayesian.at && <><FadeIn ms={ms} at={cue.bayesian.at} style={{position:'absolute',left:180,top:270,font:'600 20px "IBM Plex Mono"',color:color('color/text/accent')}}>POSTERIOR</FadeIn><FadeIn ms={ms} at={cue.bayesian.at} style={{position:'absolute',left:510,top:270,font:'600 20px "IBM Plex Mono"',color:color('color/fill/gold')}}>SENSORY EVIDENCE</FadeIn><FadeIn ms={ms} at={cue.bayesian.at} style={{position:'absolute',left:900,top:270,font:'600 20px "IBM Plex Mono"',color:color('color/marker/race')}}>RACIAL PRIOR</FadeIn></>}
      {ms>=cue.override.at && <FadeIn ms={ms} at={cue.override.at} style={{position:'absolute',left:170,top:850,width:420,font:'600 22px "IBM Plex Mono"',color:color('color/fill/gold')}} dataBeat="t33Override">α = 0 · EVIDENCE-LED</FadeIn>}
      {ms>=cue.institutions.at && <div style={{position:'absolute',...L.gauge,opacity:enter(ms,cue.institutions.at)}} data-beat="t33Institutions"><PrecisionGauge value={alpha} derived={false} label="DERIVED · NORMALIZED PRIOR PRECISION α" lowLabel="EVIDENCE" highLabel="PRIOR"/></div>}
      {ms>=cue.weight.at && <FadeIn ms={ms} at={cue.weight.at} style={{position:'absolute',left:1390,top:730,width:370,textAlign:'center',font:'700 22px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t33Weight">α = 1 · PRIOR-LED</FadeIn>}
      {ms>=cue.bayesian.at && <FadeIn ms={ms} at={cue.bayesian.at} style={{position:'absolute',left:116,top:994,right:116,font:'400 20px "IBM Plex Mono"',color:color('color/text/muted')}}>Eq. 2.8a · Bayesian prior</FadeIn>}
    </>}
    {turn34 && <>
      <div style={{position:'absolute',left:150,top:82,width:1620,textAlign:'center',font:'600 25px "IBM Plex Mono"',color:color('color/text/soft')}}>{equation}</div>
      <FadeIn ms={ms} at={cue.bias.at} style={{position:'absolute',left:150,top:130,width:1620,textAlign:'center',font:'700 38px "IBM Plex Mono"',letterSpacing:2,color:color('color/fill/gold')}} dataBeat="t34Bias">BIAS</FadeIn>
      <Panel box={L.rail} dataPanel="three-field-rail"/>
      {ms>=cue.sociology.at && <><FadeIn ms={ms} at={cue.sociology.at} style={{position:'absolute',left:170,top:194,width:480,textAlign:'center',font:'700 23px "IBM Plex Mono"'}} dataBeat="t34Sociology">SOCIOLOGY</FadeIn><div style={{position:'absolute',left:300,top:230,width:228,height:129,overflow:'hidden',transform:'scale(.3)',transformOrigin:'top left'}}><UsThemSortingField marks={SORTING_MARKS} partitionProgress={1} ingroupProgress={1} outgroupProgress={1} labels={{ingroup:'',outgroup:''}} mode="partition"/></div></>}
      {ms>=cue.neuroscience.at && <><FadeIn ms={ms} at={cue.neuroscience.at} style={{position:'absolute',left:720,top:194,width:480,textAlign:'center',font:'700 23px "IBM Plex Mono"'}} dataBeat="t34Neuroscience">NEUROSCIENCE</FadeIn><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path d="M790 316 C850 244 966 250 1010 306 C1054 362 1120 316 1130 258" fill="none" stroke={color('color/fill/gold')} strokeWidth="4"/><path d="M790 316 C880 355 1040 358 1130 258" fill="none" stroke={color('color/text/accent')} strokeWidth="3"/></svg></>}
      {ms>=cue.learning.at && <><FadeIn ms={ms} at={cue.learning.at} style={{position:'absolute',left:1270,top:194,width:480,textAlign:'center',font:'700 23px "IBM Plex Mono"'}} dataBeat="t34Learning">MACHINE LEARNING</FadeIn><MiniNetwork x={1360} y={240} w={300} h={120} progress={1} hot/></>}
      {ms>=cue.prediction.at && <FadeIn ms={ms} at={cue.prediction.at} style={{position:'absolute',left:430,top:405,width:1060,textAlign:'center',font:'700 30px "IBM Plex Mono"',color:color('color/text/accent')}} dataBeat="t34Prediction">PREDICTION FROM PRIOR EXPERIENCE</FadeIn>}
      {ms>=cue.experience.at && <div style={{position:'absolute',...L.history}} data-beat="t34Experience"><TrainingTextStrip tokens={['PAST','PATTERNS','SHARED','EXPERIENCE','PRIOR']} patternKey="history-ribbon" progress={enter(ms,cue.experience.at,650)} emphasis={['EXPERIENCE','PRIOR']}/></div>}
      {ms>=cue.accurate.at && <FadeIn ms={ms} at={cue.accurate.at} style={{position:'absolute',left:300,top:640,width:1320,textAlign:'center',font:'600 26px "IBM Plex Mono"',color:color('color/text/soft')}} dataBeat="t34Accurate">A STARTING ASSUMPTION CAN BE</FadeIn>}
      <div style={{position:'absolute',...L.cards,display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:24}}>
        {ms>=cue.accurate.at && <FadeIn ms={ms} at={cue.accurate.at} style={{display:'grid',placeItems:'center',height:150,border:`1px solid ${color('color/fill/gold')}`,font:'700 27px "IBM Plex Mono"',color:color('color/fill/gold')}}>ACCURATE</FadeIn>}
        {ms>=cue.outdated.at && <FadeIn ms={ms} at={cue.outdated.at} style={{display:'grid',placeItems:'center',height:150,border:`1px solid ${color('color/marker/race')}`,font:'700 27px "IBM Plex Mono"',color:color('color/marker/race')}} dataBeat="t34Outdated">OUTDATED</FadeIn>}
        {ms>=cue.history.at && <FadeIn ms={ms} at={cue.history.at} style={{display:'grid',placeItems:'center',height:150,padding:'0 24px',textAlign:'center',border:`1px solid ${color('color/line/hairline-strong')}`,font:'700 25px "IBM Plex Mono"',color:color('color/text/primary')}} dataBeat="t34History">EARNED BY REAL HISTORY</FadeIn>}
      </div>
    </>}
  </StageSceneFrame>;
}
