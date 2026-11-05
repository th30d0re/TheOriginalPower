import React from 'react';
import {useCue,useStageMs,type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../shared';
import {ActionIcon,AuditedTermBlock,enter,Label,lineAttrs,Panel,pathFrom,PersonIcon,SceneSource,shapeAttrs,SystemIcon,type Box,type Point} from './PackageAVisuals';

export const SEQUENCE_LAYOUT={
  caption:{x:116,y:92,w:1688,h:64},continuity:{x:92,y:174,w:1736,h:742},
  numberRail:{x:150,y:288,w:180,h:472},graph:{x:390,y:314,w:1350,h:470},
  claim:{x:610,y:188,w:1080,h:40},footer:{x:116,y:850,w:1688,h:44},source:{x:116,y:968,w:740,h:30},
} satisfies Record<string,Box>;

export const EQ_25 = 'Individual Prejudice → Discriminatory Actions → Systemic Outcomes' as const;

const CONTINUITY_LAYERS=[
  {label:'1. Individual Prejudice',w:598,y:352},
  {label:'2. Belief in Superiority',w:483,y:466},
  {label:'3. Systemic (if present)',w:368,y:580},
] as const;
const CORRECT_LAYERS=[
  {label:'1. Systemic Policies',w:598,y:352},
  {label:'2. Ideological Narratives',w:483,y:466},
  {label:'3. Interpersonal Prejudice',w:368,y:580},
] as const;

export function sequenceNodeBoxes(firstProgress:number):Box[]{
  return [
    {x:390,y:380,w:450+60*firstProgress,h:200},
    {x:940,y:380,w:360,h:200},
    {x:1390-50*firstProgress,y:380,w:370+30*firstProgress,h:200},
  ];
}

function ContinuityPlate({opacity}:{opacity:number}){
  const C=SEQUENCE_LAYOUT.continuity;
  return <div data-continuity-plate="true" style={{opacity}}>
    <Label id="continuity-conventional-title" box={{x:C.x+280,y:C.y+70,w:598,h:38}} size={26} weight={700} sans align="center">Conventional Hierarchy</Label>
    <Label id="continuity-correct-title" box={{x:C.x+1120,y:C.y+70,w:520,h:38}} size={26} weight={700} sans align="center" opacity={.25}>Correct Hierarchy</Label>
    {CONTINUITY_LAYERS.map((layer,index)=>{const box={x:C.x+579-layer.w/2,y:C.y+layer.y-220,w:layer.w,h:92};return <React.Fragment key={layer.label}><Panel id={`continuity-conventional-${index+1}`} box={box} style={{background:color(index===0?'color/fill/red-wash':'color/fill/red-faint')}}/><Label id={`continuity-conventional-label-${index+1}`} box={{x:box.x+20,y:box.y+27,w:box.w-40,h:38}} size={24} weight={600} sans align="center">{layer.label}</Label></React.Fragment>;})}
    <Label id="continuity-invert" box={{x:C.x+915,y:C.y+334,w:150,h:58}} size={22} weight={700} lh={1.3} align="center" opacity={.25}>MUST<br/>INVERT</Label>
    {CORRECT_LAYERS.map((layer,index)=>{const box={x:C.x+1378-layer.w/2,y:C.y+layer.y-220,w:layer.w,h:92};return <React.Fragment key={layer.label}><Panel id={`continuity-correct-${index+1}`} box={box} opacity={.25} style={{background:color('color/fill/gold-wash')}}/><Label id={`continuity-correct-label-${index+1}`} box={{x:box.x+20,y:box.y+16,w:box.w-40,h:60}} size={24} weight={600} sans align="center" opacity={.25}>{layer.label}</Label></React.Fragment>;})}
  </div>;
}

const RAIL_LABELS=['1. Individual Prejudice','2. Belief in Superiority','3. Systemic (if present)'] as const;
const railLabelBox=(index:number):Box=>({x:150,y:346+index*144,w:180,h:54});
/** Numbered badge that sits just above the top-left corner of each causal node and repeats its rail number. */
export const nodeBadgeBox=(node:Box):Box=>({x:node.x,y:node.y-62,w:48,h:48});

function NumberRail({ms,numberedAt,analyticalAt,orderAt,nodes}:{ms:number;numberedAt:number;analyticalAt:number;orderAt:number;nodes:Box[]}){
  const p=enter(ms,numberedAt,500),current=enter(ms,analyticalAt,600);
  return <div data-number-rail="true" style={{opacity:p}}>
    {ms>=analyticalAt&&<Label id="numbered-order" box={{x:150,y:224,w:180,h:30}} size={20} weight={500} align="center" opacity={current} ink={color('color/fill/gold')}>NUMBERED ORDER</Label>}
    {RAIL_LABELS.map((label,index)=>{const badge={x:150,y:288+index*144,w:48,h:48},text=railLabelBox(index);return <React.Fragment key={label}><div {...shapeAttrs(`rail-badge-${index+1}`,badge,'frame')} style={{position:'absolute',left:badge.x,top:badge.y,width:badge.w,height:badge.h,borderRadius:24,border:`2px solid ${color('color/fill/gold')}`,boxSizing:'border-box',opacity:.65+.35*current}}/><Label id={`rail-number-${index+1}`} box={badge} size={24} weight={500} align="center" opacity={.65+.35*current} style={{paddingTop:7}} ink={color('color/fill/gold')}>{index+1}</Label><Label id={`rail-label-${index+1}`} box={text} size={20} weight={400} lh={1.2} sans ink={color('color/text/soft')}>{label}</Label></React.Fragment>;})}
    {ms>=orderAt&&nodes.map((node,index)=>{const badge=nodeBadgeBox(node),at=enter(ms,orderAt+index*160,430);return <React.Fragment key={index}>
      <div {...shapeAttrs(`node-badge-${index+1}`,badge,'frame')} style={{position:'absolute',left:badge.x,top:badge.y,width:badge.w,height:badge.h,borderRadius:24,border:`2px solid ${color('color/fill/gold')}`,background:color('color/bg/field'),boxSizing:'border-box',opacity:at}}/>
      <Label id={`node-badge-number-${index+1}`} box={badge} size={24} weight={500} align="center" opacity={at} style={{paddingTop:7}} ink={color('color/fill/gold')}>{index+1}</Label>
    </React.Fragment>;})}
  </div>;
}

export function SequenceAsTheory({segment}:SceneProps){
  const ms=useStageMs();
  const cue={
    t11Numbered:useCue('t11Numbered'),t11Analytical:useCue('t11Analytical'),t11Unstated:useCue('t11Unstated'),
    t11Cause:useCue('t11Cause'),t11Order:useCue('t11Order'),t11Caused:useCue('t11Caused'),
    t12Personal:useCue('t12Personal'),t12First:useCue('t12First'),t12Root:useCue('t12Root'),
    t12Institutional:useCue('t12Institutional'),t12Effects:useCue('t12Effects'),
  };
  const transformP=enter(ms,cue.t11Unstated.at,600),continuityOpacity=1-transformP,graphP=transformP;
  const arrowP=ms>=cue.t11Cause.at?enter(ms,cue.t11Cause.at,650):0;
  const firstP=ms>=cue.t12First.at?enter(ms,cue.t12First.at,600):0,rootP=ms>=cue.t12Root.at?enter(ms,cue.t12Root.at,500):0;
  const nodes=sequenceNodeBoxes(firstP),[first,second,third]=nodes;
  const firstLabel=ms>=cue.t12Personal.at?'PRIVATE HOSTILITY':'Individual Prejudice';
  const thirdLabel=ms>=cue.t12Institutional.at?'INSTITUTIONAL PATTERNS':'Systemic Outcomes';
  const arrowOne:Point[]=[[first.x+first.w+8,480],[second.x-8,480]],arrowTwo:Point[]=[[second.x+second.w+8,480],[third.x-8,480]];
  return <StageSceneFrame segment={segment}>
    <Label id="sequence-caption" box={SEQUENCE_LAYOUT.caption} size={28} weight={500} ls={1.4} align="center">Figure 2.3 · Inverting the Definitional Hierarchy</Label>
    <ContinuityPlate opacity={continuityOpacity}/>
    {ms>=cue.t11Numbered.at&&<NumberRail ms={ms} numberedAt={cue.t11Numbered.at} analyticalAt={cue.t11Analytical.at} orderAt={cue.t11Order.at} nodes={nodes}/>}
    {ms>=cue.t11Unstated.at&&<div data-causal-graph="true" data-equation={EQ_25} style={{opacity:graphP}}>
      {ms>=cue.t11Cause.at&&<Label id="causal-claim" box={SEQUENCE_LAYOUT.claim} size={24} weight={500} ls={2} align="center" opacity={enter(ms,cue.t11Cause.at,440)} ink={color('color/marker/race')}>CAUSAL CLAIM</Label>}
      <AuditedTermBlock id="node-one" box={first} term={firstLabel} termId="IndividualPrejudice" ms={ms} pulses={[cue.t12Personal.at,cue.t12Root.at]} summary={ms>=cue.t12First.at?'assigned first':'causal node 1'} glyph={<PersonIcon/>} selected={ms>=cue.t12First.at} accent={ms>=cue.t12First.at?'color/marker/race':'color/fill/gold'} unit="slot 1" opacity={graphP}/>
      <AuditedTermBlock id="node-two" box={second} term="Discriminatory Actions" termId="DiscriminatoryActions" ms={ms} summary="causal node 2" glyph={<ActionIcon/>} accent="color/fill/gold" framed unit="slot 2" opacity={graphP}/>
      <AuditedTermBlock id="node-three" box={third} term={thirdLabel} termId="SystemicOutcomes" ms={ms} pulses={[cue.t12Institutional.at]} summary="causal node 3" glyph={<SystemIcon/>} accent="color/fill/gold" framed unit="slot 3" opacity={graphP}/>
      {ms>=cue.t11Cause.at&&<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
        <path data-causal-arrow="one-two" {...lineAttrs('causal-arrow-one-two',arrowOne)} d={pathFrom(arrowOne)} stroke={color(rootP>.01?'color/marker/race':'color/fill/gold')} strokeWidth={3+5*rootP} opacity={arrowP}/>
        <path data-causal-arrow="two-three" {...lineAttrs('causal-arrow-two-three',arrowTwo)} d={pathFrom(arrowTwo)} stroke={color('color/fill/gold')} strokeWidth="3" opacity={arrowP}/>
        {ms>=cue.t12Root.at&&<circle data-root-pulse="true" {...shapeAttrs('root-pulse',{x:first.x+first.w+8,y:473,w:14,h:14},'mark','pulse')} cx={first.x+first.w+15} cy="480" r="7" fill={color('color/marker/race')} opacity={rootP}/>}
        {ms>=cue.t12Effects.at&&[0,1,2].map(index=>{const x=second.x+second.w+8+enter(ms,cue.t12Effects.at+index*130,620)*Math.max(0,third.x-second.x-second.w-16);return <circle key={index} data-effect-pulse={index+1} {...shapeAttrs(`effect-pulse-${index+1}`,{x:x-6,y:474,w:12,h:12},'mark','pulse')} cx={x} cy="480" r="6" fill={color('color/fill/gold')} opacity={enter(ms,cue.t12Effects.at+index*130,300)}/>;})}
      </svg>}
      {ms>=cue.t11Order.at&&<><Label id="causal-order" box={{x:720,y:650,w:640,h:34}} size={24} weight={500} align="center" opacity={enter(ms,cue.t11Order.at,450)} ink={color('color/fill/gold')}>1 → 2 → 3</Label><Label id="causal-equation" box={{x:720,y:692,w:640,h:30}} size={20} weight={400} align="center" opacity={enter(ms,cue.t11Order.at+100,450)} ink={color('color/text/muted')}>Eq. 2.5 · conventional causal arrow</Label></>}
      {ms>=cue.t11Caused.at&&<><Label id="root-label" box={{x:first.x,y:600,w:first.w,h:32}} size={22} weight={500} align="center" opacity={enter(ms,cue.t11Caused.at,400)} ink={color('color/marker/race')}>{ms>=cue.t12First.at?'ROOT CAUSE':'ROOT'}</Label><Label id="effect-label" box={{x:third.x,y:600,w:third.w,h:32}} size={22} weight={500} align="center" opacity={enter(ms,cue.t11Caused.at+90,400)} ink={color('color/text/muted')}>{ms>=cue.t12Effects.at?'SIDE EFFECT':'EFFECT'}</Label></>}
      {ms>=cue.t12Effects.at&&<Label id="sequence-footer" box={SEQUENCE_LAYOUT.footer} size={30} weight={400} sans align="center" opacity={enter(ms,cue.t12Effects.at,500)}>The first slot assigns the cause.</Label>}
      <div data-node="one" data-scale={(1+.18*firstP).toFixed(3)} style={{display:'none'}}/><div data-node="three" data-scale={(1-.12*firstP).toFixed(3)} style={{display:'none'}}/>
    </div>}
    <SceneSource text="The Original Power, Chapter 2"/>
  </StageSceneFrame>;
}
