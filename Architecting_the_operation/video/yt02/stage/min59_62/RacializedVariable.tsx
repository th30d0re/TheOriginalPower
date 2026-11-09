import React from 'react';
import {DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, frame} from './shared';

// Turn 276: the narration's formal vocabulary isolates the constructed mapping as an equation.
export function RacializedVariable({segment}:SceneProps) {
  const ms=useStageMs();
  const c={formal:useCue('t276Formal').at, race:useCue('t276Race').at, variable:useCue('t276Variable').at, racialized:useCue('t276Racialized').at, outgroup:useCue('t276Outgroup').at, function:useCue('t276Function').at, phenotype:useCue('t276Phenotype').at, written:useCue('t276Written').at, equals:useCue('t276Equals').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.formal} beat/>
    <Copy at={c.variable} box={{x:150,y:122,w:980,h:36}} size={30}>RACE AS A SYSTEM VARIABLE</Copy>
    <DrawRect box={{x:230,y:290,w:1460,h:260}} startFrame={frame(c.written)} durationFrames={22} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <FitBox text="FORMAL VOCABULARY" x={280} y={255} size={26} weight={600} tag="SYSTEM" startFrame={frame(c.formal)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold"/>
    <Flicker startFrame={frame(c.written)} durationFrames={16} beat><EquationTerms equation="constructed group variable" ms={ms} box={{x:370,y:375,w:1180,h:70}} fontSize={54} align="center" tokens={[{term:'ORacialized',revealAt:c.racialized},{text:' = f(phenotype)'}]} pulses={{ORacialized:[c.racialized,c.outgroup,c.equals]}}/></Flicker>
    <DrawLine points={[[650,495],[650,635]]} startFrame={frame(c.outgroup)} durationFrames={14} strokeToken="color/marker/race" strokeWidth={3} beat/>
    <DrawLine points={[[1270,495],[1270,635]]} startFrame={frame(c.phenotype)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={3} beat/>
    <Panel box={{x:350,y:650,w:600,h:150}} at={c.outgroup} accent="color/marker/race"/>
    <Copy at={c.outgroup} box={{x:390,y:690,w:520,h:34}} size={28} align="center" tone="color/marker/race">RACIALIZED OUT-GROUP</Copy>
    <Panel box={{x:980,y:650,w:600,h:150}} at={c.phenotype}/>
    <Copy at={c.phenotype} box={{x:1020,y:690,w:520,h:34}} size={28} align="center">VISIBLE PHENOTYPE</Copy>
    <Copy at={c.function} box={{x:500,y:875,w:920,h:28}} size={21} align="center" mono tone="color/text/soft">A SOCIAL MAPPING, LEGALLY CODED</Copy>
  </KitSound></StageSceneFrame>;
}
