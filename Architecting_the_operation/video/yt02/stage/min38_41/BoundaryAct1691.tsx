import React from 'react';
import {DrawLine, DrawRect, Flicker, FitBox, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, enter, frame} from './shared';

// Turn 182: Virginia's 1691 Boundary Enforcement Act polices the line between the Buffer Class
// and the Out-group — the marriage link across the wall is cut, and Eq. 4.2 holds their
// intersection at the empty set.
export function BoundaryAct1691({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    bufferDefined: useCue('t182BufferDefined').at,
    outgroupDefined: useCue('t182OutgroupDefined').at,
    law: useCue('t182Law').at,
    polices: useCue('t182Polices').at,
    virginia: useCue('t182Virginia').at,
    ninetyOne: useCue('t182NinetyOne').at,
    act: useCue('t182Act').at,
    fourPointTwo: useCue('t182FourPointTwo').at,
    criminalized: useCue('t182Criminalized').at,
    marriage: useCue('t182Marriage').at,
    reproduction: useCue('t182Reproduction').at,
    intersection: useCue('t182Intersection').at,
    bufferClass: useCue('t182BufferClass').at,
    outGroup: useCue('t182OutGroup').at,
    emptySet: useCue('t182EmptySet').at,
  };
  const cut = enter(ms, cue.criminalized, 400);
  return <Scene segment={segment}>
    <Panel box={{x: 790, y: 260, w: 460, h: 460}} at={cue.bufferDefined}/>
    <FitBox text="BUFFER CLASS" x={814} y={288} size={26} weight={600} tag="SET" startFrame={frame(cue.bufferDefined)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <StickFigure x={990} y={520} group="ingroup" emphasis={.9} scale={1.4} animate startFrame={frame(cue.bufferDefined + 150)} durationFrames={18}/>
    <Panel box={{x: 1350, y: 260, w: 460, h: 460}} at={cue.outgroupDefined} accent="color/marker/race"/>
    <FitBox text="OUT-GROUP O" x={1374} y={288} size={26} weight={600} tag="SET" startFrame={frame(cue.outgroupDefined)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race"/>
    <StickFigure x={1610} y={520} group="outgroup" emphasis={.9} scale={1.4} animate startFrame={frame(cue.outgroupDefined + 150)} durationFrames={18}/>
    <Panel box={{x: 120, y: 106, w: 760, h: 70}} at={cue.law}/>
    <Copy at={cue.law} box={{x: 150, y: 124, w: 700, h: 40}} size={30}>LAW POLICES THE LINE</Copy>
    <div style={{position: 'absolute', inset: 0, opacity: 1 - .7 * cut}}>
      <DrawLine points={[[1030, 480], [1570, 480]]} startFrame={frame(cue.outgroupDefined + 500)} durationFrames={16} strokeToken="color/line/wire" strokeWidth={3} origin={false} nodes={false}/>
    </div>
    <DrawLine points={[[1310, 240], [1310, 740]]} startFrame={frame(cue.polices)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} origin={false} nodes={false} beat/>
    <Panel box={{x: 120, y: 210, w: 560, h: 420}} at={cue.virginia}/>
    <FitBox text="BOUNDARY ENFORCEMENT ACT" x={152} y={240} size={28} weight={600} tag="VIRGINIA · 1691" startFrame={frame(cue.ninetyOne)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.criminalized} box={{x: 152, y: 360, w: 500, h: 32}} size={24}>CRIMINALIZES CROSS-RACIAL MARRIAGE</Copy>
    <Copy at={cue.reproduction} box={{x: 152, y: 402, w: 400, h: 30}} size={22} tone="color/text/soft">AND REPRODUCTION</Copy>
    <DrawRect box={{x: 152, y: 480, w: 190, h: 64}} startFrame={frame(cue.fourPointTwo)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.fourPointTwo} box={{x: 168, y: 498, w: 160, h: 30}} size={26} mono tone="color/fill/gold">EQ. 4.2</Copy>
    <DrawLine points={[[1294, 458], [1326, 502]]} startFrame={frame(cue.criminalized)} durationFrames={8} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} origin={false} nodes={false} beat/>
    <DrawLine points={[[1294, 502], [1326, 458]]} startFrame={frame(cue.criminalized + 90)} durationFrames={8} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} origin={false} nodes={false}/>
    <Panel box={{x: 790, y: 790, w: 1020, h: 110}} at={cue.intersection}/>
    <Flicker startFrame={frame(cue.intersection)} durationFrames={16} beat>
      <EquationTerms equation="Eq. 4.2 · empty-set boundary" ms={ms} box={{x: 830, y: 810, w: 940, h: 60}} fontSize={40} align="center" tokens={[{term: 'BufferClassSet', revealAt: cue.intersection}, {text: ' ∩ ', revealAt: cue.intersection}, {term: 'OutGroupSet', revealAt: cue.intersection}, {text: ' = ∅', revealAt: cue.emptySet}]} pulses={{BufferClassSet: [cue.bufferClass, cue.intersection], OutGroupSet: [cue.outGroup, cue.intersection]}}/>
    </Flicker>
    <Copy at={cue.emptySet} box={{x: 830, y: 912, w: 940, h: 28}} size={20} mono tone="color/text/dim" align="center">THE INTERSECTION STAYS EMPTY</Copy>
  </Scene>;
}
