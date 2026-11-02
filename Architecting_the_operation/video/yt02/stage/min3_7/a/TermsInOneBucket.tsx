import React from 'react';
import {cubicInOut,progress,useCue,useStageMs,type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../shared';
import {ActionIcon,AuditedTermBlock,enter,HeartIcon,Label,lineAttrs,pathFrom,PersonIcon,SceneSource,shapeAttrs,SystemIcon,type Box,type Point} from './PackageAVisuals';

export const TERMS_LAYOUT={
  header:{x:160,y:110,w:1600,h:100},
  blocks:[{x:150,y:300,w:390,h:160},{x:560,y:300,w:390,h:160},{x:970,y:300,w:390,h:160},{x:1380,y:300,w:390,h:160}],
  bucket:{x:420,y:545,w:1080,h:205},rail:{x:150,y:330,w:1620,h:160},source:{x:116,y:968,w:740,h:30},
} as const;

export const TERM_BLOCKS=[
  {cue:'t16Bias',term:'BIAS',summary:'STARTING TENDENCY',accent:'color/fill/gold',glyph:<PersonIcon/>},
  {cue:'t16Prejudice',term:'PREJUDICE',summary:'GROUP ANTIPATHY',accent:'color/marker/race',glyph:<HeartIcon/>},
  {cue:'t16Discrimination',term:'DISCRIMINATION',summary:'DIFFERENTIAL BEHAVIOR',accent:'color/text/accent',glyph:<ActionIcon/>},
  {cue:'t16Racism',term:'RACISM',summary:'SYSTEMIC STRUCTURE',accent:'color/text/primary',glyph:<SystemIcon/>},
] as const;

type CueMap=Record<string,{at:number}>;
const mix=(from:number,to:number,p:number)=>from+(to-from)*p;

export function termBoxAt(index:number,ms:number,cue:{conversation:number;terms:number}):Box{
  const initial=TERMS_LAYOUT.blocks[index];
  const bucketTargets=[{x:650,y:595,w:300,h:130},{x:760,y:605,w:300,h:130},{x:870,y:615,w:300,h:130},{x:980,y:625,w:300,h:130}][index];
  const final={x:150+index*410,y:330,w:390,h:160};
  const into=cubicInOut(progress(ms,cue.conversation,cue.conversation+700));
  const out=cubicInOut(progress(ms,cue.terms,cue.terms+280));
  if(ms>=cue.terms)return {x:final.x,y:mix(520,final.y,out),w:final.w,h:final.h};
  return {x:mix(initial.x,bucketTargets.x,into),y:mix(initial.y,bucketTargets.y,into),w:mix(initial.w,bucketTargets.w,into),h:mix(initial.h,bucketTargets.h,into)};
}

export function TermsInOneBucket({segment}:SceneProps){
  const ms=useStageMs();
  const cue:CueMap={
    t16Why:useCue('t16Why'),t16Bias:useCue('t16Bias'),t16Prejudice:useCue('t16Prejudice'),t16Discrimination:useCue('t16Discrimination'),t16Racism:useCue('t16Racism'),
    t16Exact:useCue('t16Exact'),t16Conversation:useCue('t16Conversation'),t16Bucket:useCue('t16Bucket'),t16Distinct:useCue('t16Distinct'),t16Terms:useCue('t16Terms'),
  };
  const whyP=enter(ms,cue.t16Why.at,550),exactP=ms>=cue.t16Exact.at?enter(ms,cue.t16Exact.at,500):0;
  const conversationP=ms>=cue.t16Conversation.at?enter(ms,cue.t16Conversation.at,650):0;
  const distinctP=ms>=cue.t16Distinct.at?enter(ms,cue.t16Distinct.at,520):0,termsP=ms>=cue.t16Terms.at?enter(ms,cue.t16Terms.at,650):0;
  const bucketP=ms>=cue.t16Bucket.at?enter(ms,cue.t16Bucket.at,450):0;
  const bucketPoints:Point[]=[[420,545],[1500,545],[1425,750],[495,750],[420,545]];
  return <StageSceneFrame segment={segment}>
    {ms>=cue.t16Why.at&&<Label id="terms-question" box={TERMS_LAYOUT.header} size={38} weight={500} lh={1.28} sans align="center" opacity={whyP}>Why separate bias, prejudice, and discrimination before naming racism?</Label>}
    {ms>=cue.t16Exact.at&&<Label id="exact-words" box={{x:180,y:245,w:1560,h:30}} size={22} weight={500} ls={2} align="center" opacity={exactP*(1-distinctP)} ink={color('color/fill/gold')}>EXACT WORDS</Label>}
    {ms>=cue.t16Distinct.at&&<Label id="analytical-terms" box={{x:600,y:250,w:720,h:32}} size={22} weight={500} ls={2} align="center" opacity={distinctP} ink={color('color/fill/gold')}>FOUR ANALYTICAL TERMS</Label>}
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      {ms>=cue.t16Exact.at&&TERMS_LAYOUT.blocks.map((block,index)=><g key={block.x} opacity={exactP*(1-distinctP)}>{Array.from({length:9},(_,tick)=>{const x=block.x+tick*block.w/8;const points:Point[]=[[x,480],[x,tick%4===0?500:491]];return <line key={tick} {...lineAttrs(`term-tick-${index+1}-${tick+1}`,points)} x1={x} y1="480" x2={x} y2={tick%4===0?500:491} stroke={color('color/fill/gold')} strokeWidth={tick%4===0?2:1}/>;})}</g>)}
      {ms>=cue.t16Conversation.at&&<path data-bucket="true" {...shapeAttrs('shared-bucket',TERMS_LAYOUT.bucket,'frame')} d={pathFrom(bucketPoints)} fill={color('color/surface/well')} stroke={color('color/line/hairline-strong')} strokeWidth="2" opacity={conversationP}/>}
      {ms>=cue.t16Distinct.at&&TERMS_LAYOUT.blocks.map((block,index)=>{const start:[number,number]=[block.x+block.w/2,490],end:[number,number]=[620+index*225,545],points:Point[]=[start,[start[0],520],end];return <path key={index} {...lineAttrs(`output-channel-${index+1}`,points)} d={pathFrom(points)} fill="none" stroke={color('color/fill/gold')} strokeWidth="2" strokeDasharray="8 8" opacity={distinctP}/>;})}
    </svg>
    {ms>=cue.t16Conversation.at&&ms<cue.t16Distinct.at&&<Label id="everyday-conversation" box={{x:650,y:580,w:620,h:30}} size={20} weight={500} ls={1.4} align="center" opacity={conversationP} ink={color('color/text/muted')}>EVERYDAY CONVERSATION</Label>}
    {TERM_BLOCKS.map((item,index)=>{const at=cue[item.cue].at;if(ms<at)return null;if(ms>=cue.t16Conversation.at+500&&ms<cue.t16Terms.at)return null;const box=termBoxAt(index,ms,{conversation:cue.t16Conversation.at,terms:cue.t16Terms.at});const opacity=ms>=cue.t16Terms.at?termsP:enter(ms,at,420);return <div key={item.term} data-term-flight={item.term} data-flight-box={`${box.x.toFixed(1)},${box.y.toFixed(1)},${box.w.toFixed(1)},${box.h.toFixed(1)}`}><AuditedTermBlock id={`term-${index+1}`} box={box} term={item.term} summary={item.summary} glyph={item.glyph} selected={ms>=cue.t16Terms.at} accent={item.accent} opacity={opacity} titleSize={27} summarySize={19}/></div>;})}
    {ms>=cue.t16Bucket.at&&<Label id="bucket-seal" box={{x:720,y:650,w:480,h:52}} size={22} weight={500} ls={1.5} align="center" opacity={bucketP} ink={color('color/marker/race')} style={{paddingTop:11,background:color('color/fill/panel-render'),border:`1px solid ${color('color/marker/race')}`}}><span data-bucket-seal="true">ONE SHARED BUCKET</span></Label>}
    {ms>=cue.t16Terms.at&&<Label id="terms-closing" box={{x:180,y:820,w:1560,h:42}} size={30} weight={400} sans align="center" opacity={termsP}>Exact words support formal analysis.</Label>}
    <SceneSource text="The Original Power, Chapter 2"/>
  </StageSceneFrame>;
}
