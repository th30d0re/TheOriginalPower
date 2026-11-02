import React from 'react';
import {cubicInOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame, TermBlock} from '../shared';
import {ActionIcon, enter, HeartIcon, PersonIcon, SystemIcon, type Box} from './PackageAVisuals';

export const TERMS_LAYOUT = {
  header:{x:160,y:110,w:1600,h:110},
  blocks:[
    {x:150,y:300,w:390,h:170},
    {x:560,y:300,w:390,h:170},
    {x:970,y:300,w:390,h:170},
    {x:1380,y:300,w:390,h:170},
  ],
  bucket:{x:610,y:525,w:700,h:345},
  rail:{x:180,y:570,w:1560,h:290},
  source:{x:116,y:994,w:1688,h:30},
} as const;

export const TERM_BLOCKS = [
  {cue:'t16Bias',term:'BIAS',accent:'color/fill/gold',glyph:<PersonIcon/>},
  {cue:'t16Prejudice',term:'PREJUDICE',accent:'color/marker/race',glyph:<HeartIcon/>},
  {cue:'t16Discrimination',term:'DISCRIMINATION',accent:'color/text/accent',glyph:<ActionIcon/>},
  {cue:'t16Racism',term:'RACISM',accent:'color/text/primary',glyph:<SystemIcon/>},
] as const;

type CueMap=Record<string,{at:number}>;

function mix(from:number,to:number,p:number){return from+(to-from)*p;}

export function termBoxAt(index:number,ms:number,cue:{conversation:number;terms:number}):Box {
  const initial=TERMS_LAYOUT.blocks[index];
  const bucketTargets=[
    {x:700,y:610,w:250,h:120},{x:785,y:650,w:250,h:120},{x:870,y:690,w:250,h:120},{x:955,y:730,w:250,h:120},
  ][index];
  const final={x:180+index*400,y:625,w:360,h:190};
  const into=cubicInOut(progress(ms,cue.conversation,cue.conversation+700));
  const out=cubicInOut(progress(ms,cue.terms,cue.terms+650));
  const middle={x:mix(initial.x,bucketTargets.x,into),y:mix(initial.y,bucketTargets.y,into),w:mix(initial.w,bucketTargets.w,into),h:mix(initial.h,bucketTargets.h,into)};
  if(ms>=cue.terms)return {x:final.x,y:mix(740,final.y,out),w:final.w,h:final.h};
  return middle;
}

export function TermsInOneBucket({segment}:SceneProps) {
  const ms=useStageMs();
  const cue:CueMap={
    t16Why:useCue('t16Why'),t16Bias:useCue('t16Bias'),t16Prejudice:useCue('t16Prejudice'),
    t16Discrimination:useCue('t16Discrimination'),t16Racism:useCue('t16Racism'),t16Exact:useCue('t16Exact'),
    t16Conversation:useCue('t16Conversation'),t16Bucket:useCue('t16Bucket'),t16Distinct:useCue('t16Distinct'),t16Terms:useCue('t16Terms'),
  };
  const whyP=enter(ms,cue.t16Why.at,550);
  const exactP=ms>=cue.t16Exact.at?enter(ms,cue.t16Exact.at,500):0;
  const conversationP=ms>=cue.t16Conversation.at?enter(ms,cue.t16Conversation.at,650):0;
  const distinctP=ms>=cue.t16Distinct.at?enter(ms,cue.t16Distinct.at,520):0;
  const termsP=ms>=cue.t16Terms.at?enter(ms,cue.t16Terms.at,650):0;
  const bucketP=ms>=cue.t16Bucket.at?enter(ms,cue.t16Bucket.at,450):0;
  return <StageSceneFrame segment={segment} source="The Original Power, Chapter 2">
    {ms>=cue.t16Why.at&&<div data-terms-question="true" style={{position:'absolute',left:TERMS_LAYOUT.header.x,top:TERMS_LAYOUT.header.y,width:TERMS_LAYOUT.header.w,textAlign:'center',fontSize:38,lineHeight:1.28,fontWeight:500,opacity:whyP}}>Why separate bias, prejudice, and discrimination before naming racism?</div>}
    {ms>=cue.t16Exact.at&&<div style={{position:'absolute',left:180,top:500,width:1560,textAlign:'center',font:'500 22px "IBM Plex Mono"',letterSpacing:2,color:color('color/fill/gold'),opacity:exactP}}>EXACT WORDS</div>}
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      {ms>=cue.t16Exact.at&&TERMS_LAYOUT.blocks.map((block,index)=><g key={block.x} opacity={exactP}>
        {Array.from({length:9},(_,tick)=><line key={tick} x1={block.x+tick*block.w/8} y1="480" x2={block.x+tick*block.w/8} y2={tick%4===0?500:491} stroke={color('color/fill/gold')} strokeWidth={tick%4===0?2:1}/>) }
      </g>)}
      {ms>=cue.t16Conversation.at&&<path d="M 625 565 H 1295 L 1230 840 H 690 Z" fill={color('color/surface/well')} stroke={color('color/line/hairline-strong')} strokeWidth="2" opacity={conversationP}/>}
      {ms>=cue.t16Distinct.at&&TERMS_LAYOUT.blocks.map((_,index)=>{
        const x=360+index*400;
        return <path key={x} d={`M 960 780 C 960 850 ${x} 540 ${x} 610`} fill="none" stroke={color('color/fill/gold')} strokeWidth="2" strokeDasharray="8 8" opacity={distinctP}/>;
      })}
    </svg>
    {ms>=cue.t16Conversation.at&&ms<cue.t16Distinct.at&&<div style={{position:'absolute',left:690,top:555,width:540,textAlign:'center',font:'500 20px "IBM Plex Mono"',color:color('color/text/muted'),opacity:conversationP}}>EVERYDAY CONVERSATION</div>}
    {ms>=cue.t16Conversation.at&&<div aria-hidden="true" style={{position:'absolute',left:735,top:735,width:450,height:52,background:color('color/fill/red-wash'),filter:`blur(${8*(1-termsP)}px)`,opacity:conversationP*(1-.65*termsP)}}/>}
    {ms>=cue.t16Distinct.at&&<div style={{position:'absolute',left:600,top:550,width:720,textAlign:'center',font:'500 22px "IBM Plex Mono"',letterSpacing:2,color:color('color/fill/gold'),opacity:distinctP}}>FOUR ANALYTICAL TERMS</div>}
    {TERM_BLOCKS.map((item,index)=>{
      const at=cue[item.cue].at;
      if(ms<at)return null;
      if(ms>=cue.t16Conversation.at+500&&ms<cue.t16Terms.at)return null;
      const box=termBoxAt(index,ms,{conversation:cue.t16Conversation.at,terms:cue.t16Terms.at});
      const state=ms>=cue.t16Terms.at?'selected':conversationP>.85?'dim':'active';
      return <div key={item.term} data-term-flight={item.term} data-box={`${box.x.toFixed(1)},${box.y.toFixed(1)},${box.w.toFixed(1)},${box.h.toFixed(1)}`} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,overflow:'hidden',opacity:ms>=cue.t16Terms.at?termsP:enter(ms,at,420),zIndex:10+index}}>
        <TermBlock term={item.term} glyph={item.glyph} state={state} accent={item.accent}/>
      </div>;
    })}
    {ms>=cue.t16Bucket.at&&<div data-bucket-seal="true" style={{position:'absolute',left:720,top:820,width:480,height:52,display:'grid',placeItems:'center',font:'500 22px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/marker/race'),background:color('color/fill/panel-render'),border:`1px solid ${color('color/marker/race')}`,opacity:bucketP,zIndex:20}}>ONE SHARED BUCKET</div>}
    {ms>=cue.t16Terms.at&&<div style={{position:'absolute',left:180,top:900,width:1560,textAlign:'center',fontSize:30,color:color('color/text/primary'),opacity:termsP}}>Exact words support formal analysis.</div>}
  </StageSceneFrame>;
}
