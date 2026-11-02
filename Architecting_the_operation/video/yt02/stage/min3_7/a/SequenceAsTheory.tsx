import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame, TermBlock} from '../shared';
import {ActionIcon, CausalArrow, enter, NumberBadge, PersonIcon, SystemIcon, type Box} from './PackageAVisuals';

export const SEQUENCE_LAYOUT = {
  caption:{x:116,y:92,w:1688,h:64},
  continuity:{x:92,y:174,w:1736,h:742},
  numberRail:{x:150,y:288,w:180,h:472},
  graph:{x:390,y:314,w:1300,h:470},
  claim:{x:610,y:188,w:1080,h:78},
  footer:{x:116,y:878,w:1688,h:84},
  source:{x:116,y:994,w:1688,h:30},
} satisfies Record<string,Box>;

const CONTINUITY_LAYERS = [
  {label:'1. Individual Prejudice',w:598,y:352},
  {label:'2. Belief in Superiority',w:483,y:466},
  {label:'3. Systemic (if present)',w:368,y:580},
] as const;
const CORRECT_LAYERS = [
  {label:'1. Systemic Policies',w:598,y:352},
  {label:'2. Ideological Narratives',w:483,y:466},
  {label:'3. Interpersonal Prejudice',w:368,y:580},
] as const;

export function sequenceNodeBoxes(firstProgress:number):Box[] {
  return [
    {x:410-20*firstProgress,y:380,w:350+150*firstProgress,h:180},
    {x:900,y:380,w:340,h:180},
    {x:1330-70*firstProgress,y:380,w:360+70*firstProgress,h:180},
  ];
}

function ContinuityPlate({opacity}:{opacity:number}) {
  return <div data-continuity-plate="true" style={{position:'absolute',left:SEQUENCE_LAYOUT.continuity.x,top:SEQUENCE_LAYOUT.continuity.y,width:SEQUENCE_LAYOUT.continuity.w,height:SEQUENCE_LAYOUT.continuity.h,opacity}}>
    <div style={{position:'absolute',left:280,top:70,width:598,textAlign:'center',fontSize:26,fontWeight:700}}>Conventional Hierarchy</div>
    <div style={{position:'absolute',left:1120,top:70,width:520,textAlign:'center',fontSize:26,fontWeight:700,opacity:.25}}>Correct Hierarchy</div>
    {CONTINUITY_LAYERS.map((layer,index)=><div key={layer.label} style={{position:'absolute',left:579-layer.w/2,top:layer.y-220,width:layer.w,height:92,display:'grid',placeItems:'center',fontSize:24,fontWeight:600,background:color(index===0?'color/fill/red-wash':'color/fill/red-faint'),border:`1px solid ${color('color/line/hairline-strong')}`}}>{layer.label}</div>)}
    <div style={{position:'absolute',left:915,top:334,width:150,textAlign:'center',font:'700 22px "IBM Plex Mono"',lineHeight:1.3,color:color('color/text/dim'),opacity:.25}}>MUST<br/>INVERT</div>
    {CORRECT_LAYERS.map((layer,index)=><div key={layer.label} style={{position:'absolute',left:1378-layer.w/2,top:layer.y-220,width:layer.w,height:92,display:'grid',placeItems:'center',fontSize:24,fontWeight:600,opacity:.25,background:color('color/fill/gold-wash'),border:`1px solid ${color('color/line/hairline-strong')}`}}>{layer.label}</div>)}
  </div>;
}

function NumberRail({ms, numberedAt, analyticalAt, orderAt}:{ms:number;numberedAt:number;analyticalAt:number;orderAt:number}) {
  const p=enter(ms,numberedAt,500);
  const current=enter(ms,analyticalAt,600);
  const labels=['1. Individual Prejudice','2. Belief in Superiority','3. Systemic (if present)'];
  return <div data-number-rail="true" style={{position:'absolute',left:SEQUENCE_LAYOUT.numberRail.x,top:SEQUENCE_LAYOUT.numberRail.y,width:SEQUENCE_LAYOUT.numberRail.w,height:SEQUENCE_LAYOUT.numberRail.h,opacity:p}}>
    {ms>=analyticalAt&&<div style={{position:'absolute',left:0,top:-64,width:180,textAlign:'center',font:'500 20px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:current}}>NUMBERED ORDER</div>}
    {labels.map((label,index)=><div key={label} style={{position:'absolute',left:0,top:index*144,width:180,height:116,opacity:p}}>
      <NumberBadge value={String(index+1)} active={.65+.35*current}/>
      <div style={{position:'absolute',left:0,top:58,width:180,fontSize:20,lineHeight:1.2,color:color('color/text/soft')}}>{label}</div>
    </div>)}
    {ms>=orderAt&&<svg width="180" height="472" viewBox="0 0 180 472" style={{position:'absolute',inset:0}} aria-hidden="true">
      {[54,198,342].map((y,index)=><line key={y} x1="54" y1={y} x2="178" y2={188+index*80} stroke={color('color/fill/gold')} strokeWidth="1.5" opacity={enter(ms,orderAt+index*90,430)}/>) }
    </svg>}
  </div>;
}

export function SequenceAsTheory({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    t11Numbered:useCue('t11Numbered'),t11Analytical:useCue('t11Analytical'),t11Unstated:useCue('t11Unstated'),
    t11Cause:useCue('t11Cause'),t11Order:useCue('t11Order'),t11Caused:useCue('t11Caused'),
    t12Personal:useCue('t12Personal'),t12First:useCue('t12First'),t12Root:useCue('t12Root'),
    t12Institutional:useCue('t12Institutional'),t12Effects:useCue('t12Effects'),
  };
  const transformP=enter(ms,cue.t11Unstated.at,600);
  const continuityOpacity=1-transformP;
  const graphP=transformP;
  const arrowP=ms>=cue.t11Cause.at?enter(ms,cue.t11Cause.at,650):0;
  const firstP=ms>=cue.t12First.at?enter(ms,cue.t12First.at,600):0;
  const rootP=ms>=cue.t12Root.at?enter(ms,cue.t12Root.at,500):0;
  const firstLabel=ms>=cue.t12Personal.at?'PRIVATE HOSTILITY':'Individual Prejudice';
  const thirdLabel=ms>=cue.t12Institutional.at?'INSTITUTIONAL PATTERNS':'Systemic Outcomes';
  const nodeY=380;
  const [firstBox,secondBox,thirdBox]=sequenceNodeBoxes(firstP);
  const first={x:firstBox.x,w:firstBox.w};
  const second={x:secondBox.x,w:secondBox.w};
  const third={x:thirdBox.x,w:thirdBox.w};
  return <StageSceneFrame segment={segment} source="The Original Power, Chapter 2">
    <div data-sequence-caption="true" style={{position:'absolute',left:SEQUENCE_LAYOUT.caption.x,top:SEQUENCE_LAYOUT.caption.y,width:SEQUENCE_LAYOUT.caption.w,textAlign:'center',font:'500 28px "IBM Plex Mono"',letterSpacing:1.4}}>Figure 2.3 · Inverting the Definitional Hierarchy</div>
    <ContinuityPlate opacity={continuityOpacity}/>
    {ms>=cue.t11Numbered.at&&<NumberRail ms={ms} numberedAt={cue.t11Numbered.at} analyticalAt={cue.t11Analytical.at} orderAt={cue.t11Order.at}/>}
    {ms>=cue.t11Unstated.at&&<div data-causal-graph="true" style={{position:'absolute',left:0,top:0,width:1920,height:940,opacity:graphP}}>
      {ms>=cue.t11Cause.at&&<div style={{position:'absolute',left:SEQUENCE_LAYOUT.claim.x,top:SEQUENCE_LAYOUT.claim.y,width:SEQUENCE_LAYOUT.claim.w,textAlign:'center',font:'500 24px "IBM Plex Mono"',letterSpacing:2,color:color('color/marker/race'),opacity:enter(ms,cue.t11Cause.at,440)}}>CAUSAL CLAIM</div>}
      <div data-node="one" data-scale={(1+.18*firstP).toFixed(3)} style={{position:'absolute',left:first.x,top:nodeY,width:first.w,height:180}}><TermBlock term={firstLabel} summary={ms>=cue.t12First.at?'assigned first':'causal node 1'} glyph={<PersonIcon/>} state={ms>=cue.t12First.at?'selected':'active'} accent={ms>=cue.t12First.at?'color/marker/race':'color/fill/gold'} unit="slot 1"/></div>
      <div data-node="two" style={{position:'absolute',left:second.x,top:nodeY,width:second.w,height:180}}><TermBlock term="Discriminatory Actions" summary="causal node 2" glyph={<ActionIcon/>} state="active" accent="color/fill/gold" unit="slot 2"/></div>
      <div data-node="three" data-scale={(1-.12*firstP).toFixed(3)} style={{position:'absolute',left:third.x,top:nodeY,width:third.w,height:180}}><TermBlock term={thirdLabel} summary="causal node 3" glyph={<SystemIcon/>} state="active" accent="color/fill/gold" unit="slot 3"/></div>
      {ms>=cue.t11Cause.at&&<svg width="1920" height="940" viewBox="0 0 1920 940" style={{position:'absolute',inset:0,pointerEvents:'none'}} aria-hidden="true">
        <CausalArrow id="one-two" x1={first.x+first.w+18} x2={second.x-22} y={nodeY+90} p={arrowP} width={3+5*rootP} accent={rootP>.01?'color/marker/race':'color/fill/gold'}/>
        <CausalArrow id="two-three" x1={second.x+second.w+18} x2={third.x-22} y={nodeY+90} p={arrowP} width={3}/>
        {ms>=cue.t12Root.at&&<circle data-root-pulse="true" cx={first.x+first.w+30+((ms-cue.t12Root.at)%900)/900*(second.x-first.x-first.w-70)} cy={nodeY+90} r="7" fill={color('color/marker/race')} opacity={rootP}/>}
        {ms>=cue.t12Effects.at&&[0,1,2].map(index=><circle key={index} data-effect-pulse={index+1} cx={second.x+second.w+36+enter(ms,cue.t12Effects.at+index*130,620)*(third.x-second.x-second.w-76)} cy={nodeY+90} r="6" fill={color('color/fill/gold')} opacity={enter(ms,cue.t12Effects.at+index*130,300)}/>)}
      </svg>}
      {ms>=cue.t11Order.at&&<div style={{position:'absolute',left:720,top:650,width:640,textAlign:'center',font:'500 24px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:enter(ms,cue.t11Order.at,450)}}>1 → 2 → 3</div>}
      {ms>=cue.t11Order.at&&<div style={{position:'absolute',left:720,top:692,width:640,textAlign:'center',font:'400 20px "IBM Plex Mono"',color:color('color/text/muted'),opacity:enter(ms,cue.t11Order.at+100,450)}}>Eq. 2.5 · conventional causal arrow</div>}
      {ms>=cue.t11Caused.at&&<>
        <div style={{position:'absolute',left:first.x,top:nodeY+210,width:first.w,textAlign:'center',font:'500 22px "IBM Plex Mono"',color:color('color/marker/race'),opacity:enter(ms,cue.t11Caused.at,400)}}>{ms>=cue.t12First.at?'ROOT CAUSE':'ROOT'}</div>
        <div style={{position:'absolute',left:third.x,top:nodeY+210,width:third.w,textAlign:'center',font:'500 22px "IBM Plex Mono"',color:color('color/text/muted'),opacity:enter(ms,cue.t11Caused.at+90,400)}}>{ms>=cue.t12Effects.at?'SIDE EFFECT':'EFFECT'}</div>
      </>}
      {ms>=cue.t12Effects.at&&<div style={{position:'absolute',left:SEQUENCE_LAYOUT.footer.x,top:SEQUENCE_LAYOUT.footer.y,width:SEQUENCE_LAYOUT.footer.w,textAlign:'center',fontSize:30,color:color('color/text/primary'),opacity:enter(ms,cue.t12Effects.at,500)}}>The first slot assigns the cause.</div>}
    </div>}
  </StageSceneFrame>;
}
