import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './Visuals';

// Turns 124–125: recall the Segment-one in-group / out-group baseline, then
// compress it into the coarse Oppressor / Oppressed binary.
export function GroupBaseline({segment}: SceneProps) {
  const c = {
    recall: useCue('t124Recall').at, ingroup: useCue('t124Ingroup').at, membership: useCue('t124Membership').at,
    outgroup: useCue('t124Outgroup').at, boundary: useCue('t124Boundary').at, opposition: useCue('t124Opposition').at,
    first: useCue('t125First').at, photograph: useCue('t125Photograph').at, oppressor: useCue('t125Oppressor').at, binary: useCue('t125Binary').at,
  };
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.recall} box={{x: 120, y: 105, w: 1680, h: 48}} size={34}>SOCIAL GROUPS · PSYCHOLOGICAL BASELINE</Copy>
    <Panel box={{x: 120, y: 230, w: 650, h: 560}} at={c.ingroup} beat />
    <Panel box={{x: 1150, y: 230, w: 650, h: 560}} at={c.outgroup} accent="color/marker/race" beat />
    <Tag at={c.ingroup} text="IN-GROUP" x={158} y={202} />
    <Tag at={c.outgroup} text="OUT-GROUP" x={1188} y={202} accent="color/marker/race" />
    <StickFigure x={420} y={470} group="ingroup" emphasis={1} scale={1.7} animate startFrame={frame(c.membership)} durationFrames={18} beat />
    <StickFigure x={1475} y={470} group="outgroup" emphasis={1} scale={1.7} animate startFrame={frame(c.outgroup)} durationFrames={18} beat />
    <Copy at={c.membership} box={{x: 200, y: 640, w: 490, h: 38}} size={29} align="center">MEMBERSHIP + IDENTIFICATION</Copy>
    <Copy at={c.opposition} box={{x: 1230, y: 630, w: 490, h: 78}} size={27} align="center">DETACHMENT · COMPETITION · OPPOSITION</Copy>
    <DrawLine points={[[810, 510], [1110, 510]]} startFrame={frame(c.boundary)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat />
    <Copy at={c.boundary} box={{x: 820, y: 555, w: 280, h: 32}} size={21} tone="color/marker/race" align="center">BOUNDARY</Copy>
    <Panel box={{x: 390, y: 845, w: 1140, h: 100}} at={c.first} accent="color/line/hairline-strong" beat />
    <Copy at={c.photograph} box={{x: 430, y: 862, w: 1060, h: 32}} size={25} align="center">FIRST CUT · LOW-RESOLUTION PHOTOGRAPH</Copy>
    <Tag at={c.oppressor} text="OPPRESSOR" x={520} y={902} />
    <Tag at={c.binary} text="OPPRESSED · COARSE BINARY" x={1010} y={902} accent="color/marker/race" />
  </KitSound></StageSceneFrame>;
}
