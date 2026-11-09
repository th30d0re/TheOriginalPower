import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './Visuals';

// Turns 131–132: carry the automatic group split into Chapter 2's set-theory
// model, then open the brief refresher. Turn 133 belongs to SetOperations.
export function SetTheoryBridge({segment}: SceneProps) {
  const c = {
    political: useCue('t131Political').at, automatic: useCue('t131Automatic').at, section: useCue('t131Section').at,
    models: useCue('t131Models').at, set: useCue('t131Set').at,
    before: useCue('t132Before').at, refresher: useCue('t132Refresher').at, useful: useCue('t132Useful').at,
    venn: useCue('t132Venn').at, ingroup: useCue('t132Ingroup').at,
  };
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.political} box={{x: 120, y: 106, w: 1680, h: 48}} size={34}>FROM GROUP SPLIT TO SET THEORY</Copy>
    <Panel box={{x: 120, y: 235, w: 600, h: 500}} at={c.automatic} beat />
    <Tag at={c.automatic} text="AUTOMATIC SPLIT" x={158} y={210} />
    <Copy at={c.automatic} box={{x: 185, y: 400, w: 470, h: 84}} size={34} align="center">IN-GROUP<br />OUT-GROUP</Copy>
    <Copy at={c.political} box={{x: 185, y: 540, w: 470, h: 62}} size={23} tone="color/text/soft" align="center">POLITICAL + ECONOMIC SYSTEM CAPTURES THE SPLIT</Copy>
    <DrawLine points={[[750, 480], [1130, 480]]} startFrame={frame(c.section)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat />
    <Copy at={c.section} box={{x: 760, y: 525, w: 360, h: 32}} size={20} tone="color/fill/gold" align="center">SECTION 2.1 · CHAPTER 2</Copy>
    <Panel box={{x: 1200, y: 235, w: 600, h: 500}} at={c.set} accent="color/marker/race" beat />
    <Tag at={c.set} text="ELEMENTARY SET THEORY" x={1238} y={210} accent="color/marker/race" />
    <Copy at={c.models} box={{x: 1260, y: 412, w: 480, h: 38}} size={31} align="center">MODELS SOCIAL GROUPS</Copy>
    <Panel box={{x: 245, y: 800, w: 1430, h: 155}} at={c.before} beat />
    <Copy at={c.refresher} box={{x: 280, y: 822, w: 1360, h: 30}} size={24} align="center">BRIEF SET-THEORY REFRESHER · BEFORE ANY SET EQUATION</Copy>
    <Tag at={c.useful} text="WHY SETS ARE USEFUL" x={300} y={882} />
    <Tag at={c.venn} text="VENN DIAGRAMS DRAW SETS" x={760} y={882} />
    <Tag at={c.ingroup} text="IN-GROUP / OUT-GROUP AS SETS" x={1240} y={882} accent="color/marker/race" />
  </KitSound></StageSceneFrame>;
}
