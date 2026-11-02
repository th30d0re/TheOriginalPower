import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {SourceLine, StageSceneFrame, UsThemSortingField, type SortingMark} from '../shared';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=680)=>cubicInOut(progress(ms,at,at+duration));

export const US_THEM_LAYOUT={
  field:{x:257,y:155,w:1406,h:796,scale:1.85},
  title:{x:120,y:90,w:650,h:48},
  rapid:{x:790,y:90,w:340,h:48},
  prompt:{x:1290,y:90,w:470,h:48},
  bands:{x:670,y:492,w:580,h:52},
  bounded:{x:726,y:848,w:468,h:44},
  functions:[
    {id:'trust',x:310,y:183,w:220,h:42},
    {id:'threat',x:1290,y:183,w:330,h:42},
    {id:'reciprocity',x:310,y:850,w:270,h:42},
    {id:'belonging',x:1310,y:850,w:250,h:42},
    {id:'self',x:810,y:780,w:300,h:42},
  ],
  source:{x:116,y:994,w:1688,h:30},
} as const;

type MarkPath={id:string;group:'ingroup'|'outgroup';initialX:number;initialY:number;finalX:number;finalY:number};
const makeMarks=():readonly MarkPath[]=>{
  let seed=231979;
  const next=()=>{
    seed=(seed*48271)%2147483647;
    return seed/2147483647;
  };
  return Array.from({length:48},(_,index)=>{
    const group=index<24?'ingroup':'outgroup';
    const column=index%6,row=Math.floor((index%24)/6);
    return {
      id:`mark-${index+1}`,
      group,
      initialX:.22+next()*.56,
      initialY:.17+next()*.66,
      finalX:(group==='ingroup'?.12:.58)+column*.054+(next()-.5)*.018,
      finalY:.19+row*.19+(next()-.5)*.045,
    };
  });
};
export const US_THEM_MARKS=makeMarks();

function SceneLabel({text,box,opacity,tone='primary',attribute}:{text:string;box:{x:number;y:number;w:number;h:number};opacity:number;tone?:'primary'|'gold'|'race';attribute:string}){
  const ink=tone==='gold'?color('color/fill/gold'):tone==='race'?color('color/marker/race'):color('color/text/primary');
  return <div data-function-label={attribute} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',padding:'7px 12px',textAlign:'center',font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:ink,background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`,opacity}}>{text}</div>;
}

export function UsThemSorting({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    social:useCue('t23Social').at,demonstrates:useCue('t23Demonstrates').at,sort:useCue('t23Sort').at,
    us:useCue('t23Us').at,them:useCue('t23Them').at,speed:useCue('t23Speed').at,prompting:useCue('t23Prompting').at,
    sorting:useCue('t24Sorting').at,bands:useCue('t24Bands').at,trust:useCue('t24Trust').at,
    threat:useCue('t24Threat').at,reciprocity:useCue('t24Reciprocity').at,belonging:useCue('t24Belonging').at,selfConcept:useCue('t24SelfConcept').at,
  };
  const fieldP=enter(ms,cue.social,560),pulseP=enter(ms,cue.demonstrates,620),sortP=move(ms,cue.sort,900);
  const usP=enter(ms,cue.us),themP=enter(ms,cue.them),speedP=enter(ms,cue.speed,500),promptP=enter(ms,cue.prompting);
  const contractP=move(ms,cue.sorting),bandsP=enter(ms,cue.bands),trustP=enter(ms,cue.trust,500),threatP=enter(ms,cue.threat,500);
  const reciprocityP=enter(ms,cue.reciprocity,500),belongingP=enter(ms,cue.belonging,540),selfP=enter(ms,cue.selfConcept,540);
  const marks:readonly SortingMark[]=US_THEM_MARKS.map(mark=>({
    id:mark.id,
    group:mark.group,
    x:mark.initialX+(mark.finalX-mark.initialX)*sortP,
    y:mark.initialY+(mark.finalY-mark.initialY)*sortP,
    emphasis:.55+.35*sortP,
    scale:.84-.08*contractP,
  }));
  const L=US_THEM_LAYOUT;
  return <StageSceneFrame segment={segment}>
    {ms>=cue.social&&<>
      <div data-text-box="social-title" style={{position:'absolute',left:L.title.x,top:L.title.y,width:L.title.w,height:L.title.h,font:'600 24px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/primary'),opacity:fieldP}}>SOCIAL IDENTITY THEORY</div>
      <div data-sorting-field-wrap="true" style={{position:'absolute',left:L.field.x,top:L.field.y,width:760,height:430,transform:`scale(${L.field.scale})`,transformOrigin:'left top',opacity:fieldP}}>
        <UsThemSortingField marks={marks} partitionProgress={sortP} ingroupProgress={usP} outgroupProgress={themP} labels={{ingroup:'US',outgroup:'THEM'}} mode={contractP>.05?'compressed':'partition'}/>
      </div>
      {ms>=cue.sort&&<div data-sort-motion="true" style={{display:'none'}}/>}
      <SourceLine text="Tajfel & Turner 1979"/>
    </>}

    {ms>=cue.demonstrates&&<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      <path data-categorization-pulse="true" d="M330 540H1580" stroke={color('color/fill/gold')} strokeWidth="5" pathLength="1" strokeDasharray=".08 .92" strokeDashoffset={1-pulseP} opacity={pulseP}/>
      {ms>=cue.speed&&<path data-rapid-trace="true" d="M780 137H1140" stroke={color('color/fill/gold')} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-speedP}/>} 
      {ms>=cue.sorting&&[0,1,2].map((band)=><rect key={band} data-band={band+1} x={340+band*435} y={350+band%2*160} width="280" height="210" rx="105" fill={color('color/fill/gold-wash')} stroke={color('color/line/hairline-strong')} strokeWidth="3" opacity={contractP}/>) }
      {ms>=cue.trust&&<path data-trust-bridge="true" d="M430 332Q510 265 590 332" fill="none" stroke={color('color/fill/gold')} strokeWidth="6" opacity={trustP}/>} 
      {ms>=cue.threat&&<path data-threat-arc="true" d="M1430 280Q1665 520 1430 760" fill="none" stroke={color('color/marker/race')} strokeWidth="5" pathLength="1" strokeDasharray=".12 .08" strokeDashoffset={1-threatP} opacity={threatP}/>} 
      {ms>=cue.reciprocity&&<g data-reciprocity-pair="true" opacity={reciprocityP}><path d="M610 735H430l18-12m-18 12 18 12" fill="none" stroke={color('color/fill/gold')} strokeWidth="4"/><path d="M430 770H610l-18-12m18 12-18 12" fill="none" stroke={color('color/fill/gold')} strokeWidth="4"/></g>}
      {ms>=cue.belonging&&<rect data-belonging-wrap="true" x="275" y="235" width="615" height="570" rx="285" fill="none" stroke={color('color/fill/gold')} strokeWidth="7" opacity={belongingP}/>} 
      {ms>=cue.selfConcept&&<g data-self-ring="true" opacity={selfP}><circle cx="960" cy="655" r="54" fill="none" stroke={color('color/fill/gold')} strokeWidth="5"/><circle cx="960" cy="655" r="19" fill={color('color/fill/gold-wash')} stroke={color('color/fill/gold')} strokeWidth="3"/></g>}
    </svg>}

    {ms>=cue.speed&&<div data-text-box="rapid" style={{position:'absolute',left:L.rapid.x,top:L.rapid.y,width:L.rapid.w,height:L.rapid.h,textAlign:'center',font:'600 22px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/fill/gold'),opacity:speedP}}>RAPID SORTING</div>}
    {ms>=cue.prompting&&<div data-text-box="prompt" style={{position:'absolute',left:L.prompt.x,top:L.prompt.y,width:L.prompt.w,height:L.prompt.h,textAlign:'right',font:'500 20px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/soft'),opacity:promptP}}>MINIMAL PROMPTING</div>}
    {ms>=cue.bands&&<div data-text-box="bands" style={{position:'absolute',left:L.bands.x,top:L.bands.y,width:L.bands.w,height:L.bands.h,textAlign:'center',font:'650 28px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/primary'),background:color('color/bg/field'),opacity:bandsP}}>SMALL BANDS + ALLIANCES</div>}
    {ms>=cue.sorting&&<div data-text-box="bounded" style={{position:'absolute',left:L.bounded.x,top:L.bounded.y,width:L.bounded.w,height:L.bounded.h,textAlign:'center',font:'500 20px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/soft'),opacity:contractP}}>BOUNDED GROUPS</div>}
    {ms>=cue.trust&&<SceneLabel text="TRUST" box={L.functions[0]} opacity={trustP} tone="gold" attribute="trust"/>}
    {ms>=cue.threat&&<SceneLabel text="THREAT DETECTION" box={L.functions[1]} opacity={threatP} tone="race" attribute="threat"/>}
    {ms>=cue.reciprocity&&<SceneLabel text="RECIPROCITY" box={L.functions[2]} opacity={reciprocityP} tone="gold" attribute="reciprocity"/>}
    {ms>=cue.belonging&&<SceneLabel text="BELONGING" box={L.functions[3]} opacity={belongingP} tone="gold" attribute="belonging"/>}
    {ms>=cue.selfConcept&&<SceneLabel text="SELF-CONCEPT" box={L.functions[4]} opacity={selfP} tone="gold" attribute="self-concept"/>}
  </StageSceneFrame>;
}
