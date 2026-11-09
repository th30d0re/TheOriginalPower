import React from 'react';
import {DrawLine, FitBox, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

export function BloodPurityLock({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {statute: useCue('t297Statute').at, Toledo: useCue('t297Toledo').at, converts: useCue('t297Converts').at, blood: useCue('t297Blood').at, defect: useCue('t297Defect').at, baptism: useCue('t297Baptism').at, equation: useCue('t298Equation').at, lock: useCue('t298Lock').at, Iberian: useCue('t298Iberian').at, slavery: useCue('t298Slavery').at, racialized: useCue('t298ORacialized').at, phenotype: useCue('t298Phenotype').at, solved: useCue('t299Phenotype').at, capital: useCue('t299Capital').at, surveillance: useCue('t299Surveillance').at, tier: useCue('t299Tier').at, skin: useCue('t299Skin').at};
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 104, w: 1680, h: 76}} at={c.statute}/>
    <Copy at={c.Toledo} box={{x: 152, y: 124, w: 920, h: 38}} size={30}>TOLEDO · 1449 · BLOOD PURITY STATUTE</Copy>
    <FitBox text="ANCESTRY" x={1390} y={116} size={26} weight={600} tag="LEGAL KEY" startFrame={frame(c.blood)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <Panel box={{x: 150, y: 265, w: 570, h: 540}} at={c.converts}/>
    <StickFigure x={348} y={480} group="neutral" emphasis={1} scale={1.55} animate startFrame={frame(c.converts)} durationFrames={16} beat/>
    <Copy at={c.converts} box={{x: 205, y: 655, w: 460, h: 34}} size={27} align="center">CONVERSO</Copy>
    <DrawLine points={[[720, 532], [920, 532]]} startFrame={frame(c.blood)} durationFrames={16} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
    <Panel box={{x: 960, y: 265, w: 690, h: 540}} at={c.defect} accent="color/marker/race"/>
    <Copy at={c.blood} box={{x: 1010, y: 350, w: 590, h: 42}} size={31} align="center">ANCESTRAL BLOOD</Copy>
    <Copy at={c.defect} box={{x: 1010, y: 460, w: 590, h: 38}} size={30} align="center" tone="color/marker/race">PERMANENT DEFECT</Copy>
    <Panel box={{x: 180, y: 860, w: 1560, h: 106}} at={c.equation} accent="color/marker/race"/>
    <EquationTerms equation="Eq. 3.10 · racial lock" ms={ms} box={{x: 350, y: 885, w: 1220, h: 52}} fontSize={42} align="center" tokens={[{term: 'ORacialized'}, {text: ' = visible phenotype'}]} pulses={{ORacialized: [c.racialized, c.phenotype]}}/>
    <Copy at={c.lock} box={{x: 180, y: 824, w: 1560, h: 26}} size={20} align="center" mono tone="color/text/dim">AMERICAN RACIAL LOCK</Copy>
    <Copy at={c.skin} box={{x: 1010, y: 575, w: 590, h: 28}} size={21} align="center" tone="color/fill/gold">LEGAL TIER</Copy>
  </Scene>;
}
