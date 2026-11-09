import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Tag, frame} from './Visuals';

// Turns 137–140: assemble Equation 2.1 in two rows (operators are words —
// IBM Plex Mono has no union/intersection glyphs), name I and O, then hold
// on the policed boundary and the one-box-only rule.
export function PartitionEquation({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    equation: useCue('t137Equation').at, partition: useCue('t137Partition').at, population: useCue('t137Population').at,
    equals: useCue('t137Equals').at, disjoint: useCue('t137Disjoint').at, intersection: useCue('t137Intersection').at, empty: useCue('t137Empty').at,
    capitalI: useCue('t138CapitalI').at, dominant: useCue('t138Dominant').at, capitalO: useCue('t138CapitalO').at, marginalized: useCue('t138Marginalized').at,
    requirement: useCue('t139Requirement').at, policed: useCue('t139Policed').at, gradient: useCue('t139Gradient').at,
    inside: useCue('t139Inside').at, outside: useCue('t139Outside').at,
    rule: useCue('t140Rule').at, law: useCue('t140Law').at, forbids: useCue('t140Forbids').at, both: useCue('t140Both').at,
  };
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.equation} box={{x: 120, y: 105, w: 1680, h: 48}} size={34}>EQUATION 2.1 · COARSE BINARY PARTITION</Copy>
    <Copy at={c.partition} box={{x: 120, y: 158, w: 1680, h: 28}} size={20} tone="color/fill/gold" align="center">TOTAL POPULATION U · DISJOINT UNION · EMPTY INTERSECTION</Copy>
    <Panel box={{x: 210, y: 215, w: 1500, h: 205}} at={c.equals} beat />
    <EquationTerms equation="Eq. 2.1 · binary partition (row 1)" ms={ms} box={{x: 280, y: 248, w: 1360, h: 62}} fontSize={44} align="center"
      tokens={[{term: 'U', revealAt: c.population}, {text: ' = ', revealAt: c.equals}, {term: 'I', revealAt: c.disjoint}, {text: ' disjoint union ', revealAt: c.disjoint}, {term: 'O', revealAt: c.disjoint}]}
      pulses={{U: [c.population], I: [c.disjoint, c.capitalI], O: [c.disjoint, c.capitalO]}} />
    <EquationTerms equation="Eq. 2.1 · binary partition (row 2)" ms={ms} box={{x: 280, y: 322, w: 1360, h: 62}} fontSize={40} align="center"
      tokens={[{term: 'I', revealAt: c.intersection}, {text: ' intersection ', revealAt: c.intersection}, {term: 'O', revealAt: c.intersection}, {text: ' = empty set', revealAt: c.empty}]}
      pulses={{I: [c.intersection, c.capitalI], O: [c.intersection, c.capitalO]}} />
    <Panel box={{x: 120, y: 505, w: 720, h: 300}} at={c.capitalI} beat />
    <Tag at={c.capitalI} text="I" x={158} y={480} />
    <Copy at={c.dominant} box={{x: 180, y: 600, w: 600, h: 40}} size={31} align="center">DOMINANT RACIAL IN-GROUP</Copy>
    <Tag at={c.inside} text="INSIDE · PROTECTED" x={180} y={700} />
    <Panel box={{x: 1080, y: 505, w: 720, h: 300}} at={c.capitalO} accent="color/marker/race" beat />
    <Tag at={c.capitalO} text="O" x={1118} y={480} accent="color/marker/race" />
    <Copy at={c.marginalized} box={{x: 1140, y: 600, w: 600, h: 40}} size={31} align="center">MARGINALIZED OUT-GROUP</Copy>
    <Tag at={c.outside} text="OUTSIDE" x={1140} y={700} accent="color/marker/race" />
    <DrawLine points={[[870, 580], [1050, 580]]} startFrame={frame(c.policed)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={7} beat />
    <Copy at={c.policed} box={{x: 850, y: 625, w: 220, h: 28}} size={20} tone="color/marker/race" align="center">POLICED BOUNDARY</Copy>
    <Copy at={c.rule} box={{x: 255, y: 818, w: 560, h: 26}} size={19} tone="color/marker/race">RULE · INTERSECTION = EMPTY SET</Copy>
    <Tag at={c.law} text="ONE BOX ONLY" x={855} y={812} accent="color/marker/race" />
    <Panel box={{x: 255, y: 855, w: 1410, h: 100}} at={c.requirement} accent="color/marker/race" beat />
    <Copy at={c.gradient} box={{x: 285, y: 872, w: 1350, h: 28}} size={23} align="center">REQUIREMENT 2 · PROTECTED PARTITION MAINTAINS ITS INTERNAL GRADIENT</Copy>
    <Copy at={c.forbids} box={{x: 285, y: 908, w: 1350, h: 24}} size={19} tone="color/text/soft" align="center">EMPTY INTERSECTION · LAW FORBIDS OCCUPYING BOTH BOXES AT ONCE</Copy>
    <DrawLine points={[[600, 942], [1320, 942]]} startFrame={frame(c.both)} durationFrames={16} strokeToken="color/marker/race" strokeWidth={3} beat />
  </KitSound></StageSceneFrame>;
}
