import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../shared';
import {Label, SceneSource, leave, lineAttrs, mix, pathFrom, shapeAttrs, type LayoutBox, type Point} from '../d/sceneUtils';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=680)=>cubicInOut(progress(ms,at,at+duration));

export const BIAS_LAYOUT={
  heading:{x:150,y:112,w:650,h:40},
  stack:{x:190,y:250,w:420,h:406},
  terms:[
    {id:'bias',x:190,y:250,w:420,h:96},
    {id:'prejudice',x:190,y:376,w:420,h:96},
    {id:'discrimination',x:190,y:560,w:420,h:96},
  ],
  interpersonal:{x:150,y:676,w:460,h:30},
  process:{x:760,y:286,w:280,h:32},
  input:{x:760,y:330,w:280,h:64},
  act:{x:880,y:576,w:200,h:64},
  baseline:{x:1240,y:270,w:520,h:380},
  definition:{x:130,y:250,w:790,h:360},
  definitionCollapsedH:120,
  meters:[
    {id:'perception',x:1030,y:250,w:730,h:130},
    {id:'evaluation',x:1030,y:400,w:730,h:130},
    {id:'explanation',x:1030,y:550,w:730,h:130},
  ],
  starting:{x:1130,y:712,w:530,h:32},
  source:{x:116,y:968,w:740,h:30},
} as const;

export const BIAS_TILT={travel:180,fraction:.18} as const;
const DEFINITION='a tendency or lean that favors or disfavors individuals or groups in perception, evaluation, and explanation because of group membership';
const TERMS=[['BIAS','bias','color/fill/gold'],['PREJUDICE','prejudice','color/text/accent'],['DISCRIMINATION','discrimination','color/marker/race']] as const;

function TermGlyph({kind}:{kind:'bias'|'prejudice'|'discrimination'|'act'}){
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    {kind==='bias'&&<><line x1="7" y1="28" x2="41" y2="18" stroke="currentColor" strokeWidth="4"/><circle cx="24" cy="24" r="6" fill="currentColor"/></>}
    {kind==='prejudice'&&<><circle cx="15" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="33" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="3"/><line x1="23" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="4"/></>}
    {kind==='discrimination'&&<><path d="M7 24H36" fill="none" stroke="currentColor" strokeWidth="4"/><path d="M31 16l10 8-10 8z" fill="currentColor"/></>}
    {kind==='act'&&<><path d="M4 24H30" fill="none" stroke="currentColor" strokeWidth="4"/><path d="M26 15l10 9-10 9z" fill="currentColor"/><rect x="38" y="8" width="6" height="32" fill="currentColor"/></>}
  </svg>;
}

/** A turn-28 processing module sized to its content: accent bar, glyph and term. */
function ModuleCard({box,term,kind,accent,opacity}:{box:LayoutBox;term:string;kind:'bias'|'prejudice'|'discrimination';accent:string;opacity:number}){
  const ink=color(accent), glyph={x:box.x+24,y:box.y+24,w:48,h:48};
  return <div data-term-module={kind} data-term={term} style={{opacity}}>
    <div {...shapeAttrs(`module-${kind}`,box,'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`}}>
      <span aria-hidden="true" style={{position:'absolute',left:0,top:12,bottom:12,width:4,background:ink}}/>
    </div>
    <div {...shapeAttrs(`glyph-${kind}`,glyph,'mark','glyph')} style={{position:'absolute',left:glyph.x,top:glyph.y,width:glyph.w,height:glyph.h,color:ink}}><TermGlyph kind={kind}/></div>
    <Label id={`term-${kind}`} box={{x:box.x+96,y:box.y+30,w:300,h:38}} size={30} weight={600} ls={0} lh={1.2} sans>{term}</Label>
  </div>;
}

function TiltMeter({id,label,box,visible,labelVisible,favorProgress}:{id:string;label:string;box:LayoutBox;visible:number;labelVisible:number;favorProgress:number}){
  const center=box.x+box.w/2, trackY=box.y+90, offset=BIAS_TILT.travel*BIAS_TILT.fraction*favorProgress, track:Point[]=[[center-BIAS_TILT.travel,trackY],[center+BIAS_TILT.travel,trackY]];
  return <div data-tilt-meter={id} style={{opacity:visible}}>
    <div {...shapeAttrs(`meter-${id}`,box,'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`}}/>
    {labelVisible>0&&<Label id={`meter-${id}-label`} box={{x:box.x+24,y:box.y+18,w:300,h:28}} size={22} ls={1.3} lh={1.2} opacity={labelVisible}><span data-meter-label={id}>{label}</span></Label>}
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      {favorProgress>0&&<rect data-favored-side="true" {...shapeAttrs(`meter-${id}-favored`,{x:center,y:trackY-12,w:BIAS_TILT.travel,h:24},'mark',`meter-${id}`)} x={center} y={trackY-12} width={BIAS_TILT.travel} height="24" fill={color('color/fill/gold-wash')} opacity={favorProgress}/>}
      <path {...lineAttrs(`meter-${id}-track`,track)} d={pathFrom(track)} stroke={color('color/line/hairline-strong')} strokeWidth="4"/>
      <path {...lineAttrs(`meter-${id}-center`,[[center,trackY-16],[center,trackY+16]])} d={`M${center} ${trackY-16}V${trackY+16}`} stroke={color('color/text/muted')} strokeWidth="3"/>
      <circle data-meter-indicator="true" {...shapeAttrs(`meter-${id}-indicator`,{x:center+offset-13,y:trackY-13,w:26,h:26},'mark',`meter-${id}`)} cx={center+offset} cy={trackY} r="13" fill={color('color/fill/gold')} stroke={color('color/bg/field')} strokeWidth="3"/>
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
  // Turn 29 replaces the turn-28 picture: it fades out fully before the definition card enters.
  const turn28Opacity=leave(ms,cue.concept,320), turn28Shown=ms<cue.concept+320;
  const definitionP=enter(ms,cue.concept+300,500),biasP=enter(ms,cue.bias),tendencyP=enter(ms,cue.tendency),favorP=move(ms,cue.favors,620);
  const perceptionP=enter(ms,cue.perception),evaluationP=enter(ms,cue.evaluation),explanationP=enter(ms,cue.explanation),growP=move(ms,cue.explanation,300),definitionTextP=enter(ms,cue.explanation+280,400);
  const L=BIAS_LAYOUT, gold=color('color/fill/gold'), red=color('color/marker/race');
  const card={...L.definition,h:mix(L.definitionCollapsedH,L.definition.h,growP)};
  const biasChannel:Point[]=[[L.input.x,350],[700,350],[700,298],[610,298]];
  const prejudiceChannel:Point[]=[[L.input.x,376],[660,376],[660,424],[610,424]];
  const actChannel:Point[]=[[610,608],[L.act.x,608]];
  const bracket:Point[]=[[190,250],[160,250],[160,656],[190,656]];
  const B=L.baseline, busCards=[0,1,2].map(index=>({x:B.x+120,y:B.y+20+index*125,w:300,h:90}));
  const busSpine:Point[]=[[B.x+60,busCards[0].y+45],[B.x+60,busCards[2].y+45]];
  return <StageSceneFrame segment={segment}>
    {turn28Shown&&<div data-turn-28-field="true" style={{opacity:turn28Opacity}}>
      {ms>=cue.baseline&&<div data-host-bus-baseline="true" style={{opacity:.3*baselineP}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
          <path {...lineAttrs('baseline-spine',busSpine)} d={pathFrom(busSpine)} stroke={gold} strokeWidth="4"/>
          {busCards.map((box,index)=><React.Fragment key={index}>
            <path {...lineAttrs(`baseline-channel-${index+1}`,[[B.x+60,box.y+45],[box.x,box.y+45]])} d={`M${B.x+60} ${box.y+45}H${box.x}`} stroke={gold} strokeWidth="3"/>
            <rect {...shapeAttrs(`baseline-card-${index+1}`,box,'frame')} x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={color('color/line/hairline-strong')} strokeWidth="2"/>
          </React.Fragment>)}
        </svg>
      </div>}
      {ms>=cue.experimental&&<Label id="experimental" box={L.heading} size={24} ls={1.5} opacity={experimentalP}>EXPERIMENTAL PSYCHOLOGY</Label>}
      {ms>=cue.three&&TERMS.map(([term,kind,accent],index)=><ModuleCard key={term} box={L.terms[index]} term={term} kind={kind} accent={accent} opacity={termsP}/>)}
      {ms>=cue.interpersonal&&<>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path data-interpersonal-bracket="true" {...lineAttrs('interpersonal-bracket',bracket)} d={pathFrom(bracket)} fill="none" stroke={gold} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-interpersonalP}/></svg>
        <Label id="interpersonal" box={L.interpersonal} size={20} weight={500} ls={1.1} align="center" ink={gold} opacity={interpersonalP}>INTERPERSONAL CONCEPTS</Label>
      </>}
      {ms>=cue.process&&<>
        <Label id="process" box={L.process} size={22} ls={1.2} align="center" ink={gold} opacity={processP}>PROCESS</Label>
        <div data-group-token="true" {...shapeAttrs('group-token',L.input,'frame')} style={{position:'absolute',left:L.input.x,top:L.input.y,width:L.input.w,height:L.input.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`2px solid ${gold}`,opacity:processP}}/>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
          <path data-process-channel="bias" {...lineAttrs('channel-bias',biasChannel)} d={pathFrom(biasChannel)} fill="none" stroke={gold} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-processP}/>
          <path data-process-channel="prejudice" {...lineAttrs('channel-prejudice',prejudiceChannel)} d={pathFrom(prejudiceChannel)} fill="none" stroke={color('color/text/accent')} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-processP}/>
        </svg>
      </>}
      {ms>=cue.act&&<div style={{opacity:actP}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path data-act-channel="true" {...lineAttrs('channel-act',actChannel)} d={pathFrom(actChannel)} fill="none" stroke={red} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-actP}/></svg>
        <div {...shapeAttrs('act-box',L.act,'frame')} style={{position:'absolute',left:L.act.x,top:L.act.y,width:L.act.w,height:L.act.h,boxSizing:'border-box',border:`2px solid ${red}`}}/>
        <Label id="act" box={{x:L.act.x+16,y:L.act.y+16,w:80,h:32}} size={22} ls={1.2} ink={red}>ACT</Label>
        <div {...shapeAttrs('act-glyph',{x:L.act.x+120,y:L.act.y+8,w:48,h:48},'mark','glyph')} style={{position:'absolute',left:L.act.x+120,top:L.act.y+8,width:48,height:48,color:red}}><TermGlyph kind="act"/></div>
      </div>}
      {ms>=cue.categories&&<Label id="group-category" box={{x:L.input.x+12,y:L.input.y+17,w:L.input.w-24,h:30}} size={22} ls={1.2} align="center" opacity={categoryP}>GROUP CATEGORY</Label>}
    </div>}

    {ms>=cue.concept&&<>
      <div data-definition-wrap="true" data-definition-term={ms>=cue.bias?'BIAS':''} style={{opacity:definitionP}}>
        <div {...shapeAttrs('definition-card',card,'frame')} style={{position:'absolute',left:card.x,top:card.y,width:card.w,height:card.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`}}>
          <span aria-hidden="true" style={{position:'absolute',left:0,top:0,bottom:0,width:5,background:gold}}/>
        </div>
        {ms>=cue.bias&&<Label id="definition-title" box={{x:168,y:280,w:300,h:46}} size={38} weight={600} ls={0} lh={1.1} sans ink={gold} opacity={biasP}>BIAS</Label>}
        {ms>=cue.explanation&&<div style={{opacity:definitionTextP}}>
          <Label id="definition-text" box={{x:168,y:344,w:714,h:160}} size={28} weight={400} ls={0} lh={1.34} sans>{DEFINITION}</Label>
          <Label id="definition-source" box={{x:168,y:520,w:400,h:28}} size={20} weight={400} ls={0} lh={1.3} ink={color('color/text/muted')}>{'Greenwald & Banaji 1995'}</Label>
          <Label id="definition-paraphrased" box={{x:168,y:554,w:300,h:28}} size={20} weight={400} ls={0} lh={1.3} ink={color('color/text/muted')}><span data-paraphrased="true">(paraphrased)</span></Label>
        </div>}
      </div>
      {ms>=cue.tendency&&<>
        <TiltMeter id="perception" label="PERCEPTION" box={L.meters[0]} visible={tendencyP} labelVisible={ms>=cue.perception?perceptionP:0} favorProgress={favorP}/>
        <TiltMeter id="evaluation" label="EVALUATION" box={L.meters[1]} visible={tendencyP} labelVisible={ms>=cue.evaluation?evaluationP:0} favorProgress={favorP}/>
        <TiltMeter id="explanation" label="EXPLANATION" box={L.meters[2]} visible={tendencyP} labelVisible={ms>=cue.explanation?explanationP:0} favorProgress={favorP}/>
        <Label id="starting" box={L.starting} size={22} ls={1.5} align="center" ink={gold} opacity={tendencyP}>STARTING TENDENCY</Label>
      </>}
      {ms>=cue.explanation&&<SceneSource text="Greenwald & Banaji 1995" opacity={explanationP}/>}
    </>}
  </StageSceneFrame>;
}
