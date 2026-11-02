import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {DefinitionCard, SourceLine, StageSceneFrame, TermBlock} from '../shared';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=680)=>cubicInOut(progress(ms,at,at+duration));

export const BIAS_LAYOUT={
  heading:{x:150,y:112,w:650,h:48},
  stack:{x:150,y:230,w:460,h:620},
  terms:[
    {id:'bias',x:150,y:230,w:460,h:170},
    {id:'prejudice',x:150,y:425,w:460,h:170},
    {id:'discrimination',x:150,y:620,w:460,h:170},
  ],
  bracket:{x:120,y:205,w:520,h:625},
  input:{x:730,y:360,w:280,h:340},
  lanes:{x:1080,y:220,w:680,h:660},
  definition:{x:130,y:170,w:790,h:730},
  meters:[
    {id:'perception',x:1030,y:250,w:730,h:150},
    {id:'evaluation',x:1030,y:455,w:730,h:150},
    {id:'explanation',x:1030,y:660,w:730,h:150},
  ],
  starting:{x:1130,y:855,w:530,h:46},
  source:{x:116,y:994,w:1688,h:30},
} as const;

export const BIAS_TILT={travel:180,fraction:.18} as const;
const DEFINITION='a tendency or lean that favors or disfavors individuals or groups in perception, evaluation, and explanation because of group membership';

function TermGlyph({kind}:{kind:'bias'|'prejudice'|'discrimination'}){
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    {kind==='bias'&&<><line x1="7" y1="28" x2="41" y2="18" stroke="currentColor" strokeWidth="4"/><circle cx="24" cy="24" r="6" fill="currentColor"/></>}
    {kind==='prejudice'&&<><circle cx="15" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="33" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="3"/><line x1="23" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="4"/></>}
    {kind==='discrimination'&&<><path d="M7 24H36" fill="none" stroke="currentColor" strokeWidth="4"/><path d="M31 16l10 8-10 8z" fill="currentColor"/></>}
  </svg>;
}

function TiltMeter({label,box,visible,labelVisible,favorProgress}:{label:string;box:{x:number;y:number;w:number;h:number};visible:number;labelVisible:number;favorProgress:number}){
  const center=box.w/2,offset=BIAS_TILT.travel*BIAS_TILT.fraction*favorProgress;
  return <div data-tilt-meter={label.toLowerCase()} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`,opacity:visible}}>
    {labelVisible>0&&<div style={{position:'absolute',left:24,top:20,font:'600 22px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/primary'),opacity:labelVisible}}>{label}</div>}
    {labelVisible>0&&<div data-meter-label={label.toLowerCase()} style={{position:'absolute',left:24,top:18,font:'600 22px "IBM Plex Mono"',letterSpacing:1.3,color:color('color/text/primary'),opacity:labelVisible}}>{label}</div>}
    <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{position:'absolute',inset:0}} aria-hidden="true">
      <line x1={center-BIAS_TILT.travel} y1="104" x2={center+BIAS_TILT.travel} y2="104" stroke={color('color/line/hairline-strong')} strokeWidth="4"/>
      <line x1={center} y1="88" x2={center} y2="120" stroke={color('color/text/muted')} strokeWidth="3"/>
      {favorProgress>0&&<rect data-favored-side="true" x={center} y="92" width={BIAS_TILT.travel} height="24" fill={color('color/fill/gold-wash')} opacity={favorProgress}/>} 
      <circle data-meter-indicator="true" cx={center+offset} cy="104" r="13" fill={color('color/fill/gold')} stroke={color('color/bg/field')} strokeWidth="3"/>
    </svg>
  </div>;
}

export function BiasDefinition({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    baseline:useCue('t28Baseline').at,experimental:useCue('t28Experimental').at,three:useCue('t28Three').at,
    interpersonal:useCue('t28Interpersonal').at,process:useCue('t28Process').at,act:useCue('t28Act').at,categories:useCue('t28Categories').at,
    concept:useCue('t29Concept').at,bias:useCue('t29Bias').at,tendency:useCue('t29Tendency').at,favors:useCue('t29Favors').at,
    perception:useCue('t29Perception').at,evaluation:useCue('t29Evaluation').at,explanation:useCue('t29Explanation').at,
  };
  const baselineP=enter(ms,cue.baseline),experimentalP=enter(ms,cue.experimental),termsP=enter(ms,cue.three,600);
  const interpersonalP=enter(ms,cue.interpersonal),processP=enter(ms,cue.process,620),actP=enter(ms,cue.act),categoryP=enter(ms,cue.categories);
  const definitionP=move(ms,cue.concept,700),biasP=enter(ms,cue.bias),tendencyP=enter(ms,cue.tendency),favorP=move(ms,cue.favors,620);
  const perceptionP=enter(ms,cue.perception),evaluationP=enter(ms,cue.evaluation),explanationP=enter(ms,cue.explanation);
  const turn28Opacity=1-definitionP;
  const L=BIAS_LAYOUT;
  return <StageSceneFrame segment={segment}>
    {ms>=cue.baseline&&<div data-host-bus-baseline="true" style={{position:'absolute',left:705,top:390,width:1070,height:260,background:`linear-gradient(90deg, ${color('color/fill/gold-wash')}, transparent)`,borderTop:`1px solid ${color('color/line/hairline')}`,borderBottom:`1px solid ${color('color/line/hairline')}`,opacity:.18*baselineP}}/>}

    <div data-turn-28-field="true" style={{opacity:turn28Opacity}}>
      {ms>=cue.experimental&&<div data-text-box="experimental" style={{position:'absolute',left:L.heading.x,top:L.heading.y,width:L.heading.w,height:L.heading.h,font:'600 24px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/primary'),opacity:experimentalP}}>EXPERIMENTAL PSYCHOLOGY</div>}
      {ms>=cue.three&&L.terms.map((box,index)=>{
        const term=['BIAS','PREJUDICE','DISCRIMINATION'][index];
        const kind=(['bias','prejudice','discrimination'] as const)[index];
        return <div key={term} data-term-module={kind} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h}}><TermBlock term={term} glyph={<TermGlyph kind={kind}/>} state={termsP} accent={index===0?'color/fill/gold':index===1?'color/text/accent':'color/marker/race'}/></div>;
      })}
      {ms>=cue.interpersonal&&<>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path data-interpersonal-bracket="true" d={`M${L.bracket.x+38} ${L.bracket.y}H${L.bracket.x}V${L.bracket.y+L.bracket.h}H${L.bracket.x+38}`} fill="none" stroke={color('color/fill/gold')} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-interpersonalP}/></svg>
        <div data-text-box="interpersonal" style={{position:'absolute',left:160,top:820,width:440,height:38,textAlign:'center',font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/fill/gold'),opacity:interpersonalP}}>INTERPERSONAL CONCEPTS</div>
      </>}
      {ms>=cue.process&&<>
        <div data-group-token="true" style={{position:'absolute',left:L.input.x,top:500,width:L.input.w,height:86,boxSizing:'border-box',display:'grid',placeItems:'center',font:'600 22px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/primary'),background:color('color/fill/panel-render'),border:`2px solid ${color('color/fill/gold')}`,opacity:processP}}>{ms>=cue.categories?'GROUP CATEGORY':''}</div>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
          <path data-process-channel="bias" d="M730 526H650V315H610" fill="none" stroke={color('color/fill/gold')} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-processP}/>
          <path data-process-channel="prejudice" d="M730 560H660V510H610" fill="none" stroke={color('color/text/accent')} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-processP}/>
          {ms>=cue.act&&<path data-act-channel="true" d="M610 705H1260" fill="none" stroke={color('color/marker/race')} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-actP}/>} 
        </svg>
        <div data-text-box="process" style={{position:'absolute',left:1080,top:430,width:260,height:44,textAlign:'center',font:'600 22px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:processP}}>PROCESS</div>
      </>}
      {ms>=cue.act&&<div data-text-box="act" style={{position:'absolute',left:1360,top:682,width:260,height:70,display:'grid',placeItems:'center',font:'600 22px "IBM Plex Mono"',color:color('color/marker/race'),border:`2px solid ${color('color/marker/race')}`,opacity:actP}}>ACT</div>}
    </div>

    {ms>=cue.concept&&<>
      <div data-definition-wrap="true" style={{position:'absolute',left:L.definition.x,top:L.definition.y,width:L.definition.w,height:L.definition.h}}>
        <DefinitionCard term={ms>=cue.bias?'BIAS':''} definition={ms>=cue.explanation?DEFINITION:''} source={ms>=cue.explanation?'Greenwald & Banaji 1995':''} paraphrased={false} progress={definitionP} accent="color/fill/gold"/>
        {ms>=cue.explanation&&<div data-paraphrased="true" style={{position:'absolute',left:38,bottom:36,font:'400 20px "IBM Plex Mono"',color:color('color/text/muted'),opacity:explanationP}}>(paraphrased)</div>}
      </div>
      {ms>=cue.tendency&&<>
        <TiltMeter label="PERCEPTION" box={L.meters[0]} visible={tendencyP} labelVisible={perceptionP} favorProgress={favorP}/>
        <TiltMeter label="EVALUATION" box={L.meters[1]} visible={tendencyP} labelVisible={evaluationP} favorProgress={favorP}/>
        <TiltMeter label="EXPLANATION" box={L.meters[2]} visible={tendencyP} labelVisible={explanationP} favorProgress={favorP}/>
        <div data-text-box="starting" style={{position:'absolute',left:L.starting.x,top:L.starting.y,width:L.starting.w,height:L.starting.h,textAlign:'center',font:'600 22px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/fill/gold'),opacity:tendencyP}}>STARTING TENDENCY</div>
      </>}
      <div data-bias-title-progress={biasP.toFixed(3)} style={{display:'none'}}/>
      {ms>=cue.explanation&&<SourceLine text="Greenwald & Banaji 1995"/>}
    </>}
  </StageSceneFrame>;
}
