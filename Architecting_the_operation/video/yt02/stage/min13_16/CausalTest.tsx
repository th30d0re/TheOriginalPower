import React from 'react';
import {DrawLine, FitBox, KitSound, StageSceneFrame, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, frame} from './SceneUtils';

export function CausalTest({segment}:SceneProps){
  const ms=useStageMs();
  const c={remains:useCue('t81Remains').at, time:useCue('t81Time').at, attitudes:useCue('t81Attitudes').at, acts:useCue('t81Acts').at, rules:useCue('t81Rules').at, interests:useCue('t81Interests').at, equation:useCue('t82Equation').at, section:useCue('t82Section').at, conventional:useCue('t82Conventional').at, dictionary:useCue('t82Dictionary').at, policy:useCue('t82Policy').at};
  const nodes=[{label:'INDIVIDUAL\nATTITUDES',at:c.attitudes,x:130,term:'IndividualPrejudice' as const},{label:'DISCRIMINATORY\nACTS',at:c.acts,x:570,term:'DiscriminatoryActions' as const},{label:'INSTITUTIONAL\nRULES',at:c.rules,x:1010,term:'SystemicOutcomes' as const},{label:'ECONOMIC\nINTERESTS',at:c.interests,x:1450,term:'Magnitude' as const}];
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.remains} box={{x:120,y:105,w:1680,h:46}} size={34}>WHAT REMAINS TO TEST · TIME ORDER</Copy>
    {nodes.map((node,i)=><React.Fragment key={node.label}><Panel box={{x:node.x,y:260,w:340,h:160}} at={node.at} accent={i===3?'color/marker/race':'color/fill/gold'} seed={810+i}/><Copy at={node.at} box={{x:node.x+24,y:308,w:292,h:62}} size={25} align="center">{node.label}</Copy>{i<nodes.length-1&&<DrawLine points={[[node.x+340,340],[node.x+440,340]]} startFrame={frame(nodes[i+1].at)} durationFrames={14} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>}</React.Fragment>)}
    <Copy at={c.time} box={{x:400,y:465,w:1120,h:34}} size={24} tone="color/fill/gold" align="center">ORDER CONNECTING ATTITUDES · ACTS · RULES · INTERESTS</Copy>
    <Panel box={{x:240,y:540,w:1440,h:300}} at={c.equation} accent="color/marker/race" seed={821}/>
    <FitBox text="EQUATION 2.5" x={280} y={570} size={28} weight={600} tag="SECTION 2.2" startFrame={frame(c.section)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <EquationTerms equation="Eq. 2.5 · conventional causal model" ms={ms} box={{x:260,y:660,w:1400,h:56}} fontSize={30} align="center" tokens={[{term:'IndividualPrejudice'},{text:' → '},{term:'DiscriminatoryActions'},{text:' → '},{term:'SystemicOutcomes'}]} pulses={{IndividualPrejudice:[c.attitudes],DiscriminatoryActions:[c.acts],SystemicOutcomes:[c.rules]}}/>
    <Copy at={c.conventional} box={{x:340,y:750,w:1240,h:26}} size={19} tone="color/text/soft" align="center">CONVENTIONAL CAUSAL MODEL · DICTIONARY DEFINITIONS · PUBLIC POLICY</Copy>
  </KitSound></StageSceneFrame>;
}
