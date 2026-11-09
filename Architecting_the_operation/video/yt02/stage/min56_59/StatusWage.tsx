import React from 'react';
import {DrawLine, DrawRect, FitBox, KitSound, StageSceneFrame, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, frame} from './shared';

export function StatusWage({segment}:SceneProps) {
  const ms=useStageMs();
  const c={equation:useCue('t267Equation').at,status:useCue('t267Status').at,base:useCue('t267Base').at,suppression:useCue('t267Suppression').at,psi:useCue('t267Psi').at,psychological:useCue('t268Psychological').at,material:useCue('t268Material').at,racialized:useCue('t269Racialized').at,outgroup:useCue('t269Outgroup').at,crown:useCue('t269Crown').at,wage:useCue('t269Wage').at,elevated:useCue('t269Elevated').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.equation}/><Copy at={c.equation} box={{x:150,y:122,w:980,h:38}} size={30}>EQ. 3.2 · STATUS ALLOCATION</Copy>
    <DrawRect box={{x:200,y:260,w:1520,h:190}} startFrame={frame(c.status)} durationFrames={22} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <FitBox text="DOMESTIC STATUS" x={240} y={235} size={30} weight={600} tag="EQUATION 3.2" startFrame={frame(c.equation)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <EquationTerms equation="Eq. 3.2 · domestic status" ms={ms} box={{x:290,y:325,w:1340,h:64}} fontSize={48} align="center" tokens={[{term:'StatusInGroup',revealAt:c.status},{text:' = '},{term:'BaseHumanity',revealAt:c.base},{text:' + '},{term:'SuppressionPsi',revealAt:c.suppression}]} pulses={{StatusInGroup:[c.status],BaseHumanity:[c.base],SuppressionPsi:[c.suppression,c.psi]}}/>
    <DrawLine points={[[390,570],[1520,570]]} startFrame={frame(c.psi)} durationFrames={18} strokeToken="color/line/hairline-strong" strokeWidth={3} beat/>
    <DrawRect box={{x:470,y:620,w:390,h:150}} startFrame={frame(c.psychological)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/><FitBox text="STATUS WAGE" x={515} y={650} size={29} weight={600} tag="PSYCHOLOGICAL" startFrame={frame(c.wage)} durationFrames={14} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawRect box={{x:1060,y:620,w:390,h:150}} startFrame={frame(c.material)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/><FitBox text="CONCESSIONS" x={1105} y={650} size={29} weight={600} tag="MATERIAL" startFrame={frame(c.material)} durationFrames={14} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawLine points={[[860,695],[1040,695]]} startFrame={frame(c.material)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <DrawLine points={[[250,890],[420,890]]} startFrame={frame(c.racialized)} durationFrames={12} strokeToken="color/marker/race" strokeWidth={4} beat/>
    <Copy at={c.outgroup} box={{x:250,y:875,w:1420,h:32}} size={24} align="center" tone="color/marker/race">RACIALIZED OUT-GROUP · ATLANTIC BASE</Copy>
    <DrawLine points={[[960,790],[960,850]]} startFrame={frame(c.crown)} durationFrames={12} strokeToken="color/marker/race" strokeWidth={4} beat/>
    <Copy at={c.elevated} box={{x:400,y:925,w:1120,h:28}} size={20} align="center" mono tone="color/text/soft">STATUS WAGE · NO LAND OR REVENUE</Copy>
  </KitSound></StageSceneFrame>;
}
