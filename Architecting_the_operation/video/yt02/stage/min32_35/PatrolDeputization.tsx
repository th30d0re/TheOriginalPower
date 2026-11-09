import React from 'react';
import {DrawLine, DrawRect, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 165: in the early American South, colonial statutes conscripted ordinary white men into
// slave patrols — the Buffer Class performing the Enforcement function through legal deputization —
// while wealthy enslavers paid substitutes to patrol in their place.
export function PatrolDeputization({segment}: SceneProps) {
  const cue = {
    colonial: useCue('t165Colonial').at,
    statutes: useCue('t165Statutes').at,
    conscripted: useCue('t165Conscripted').at,
    ordinary: useCue('t165Ordinary').at,
    patrols: useCue('t165Patrols').at,
    bufferClass: useCue('t165BufferClass').at,
    enforcement: useCue('t165Enforcement').at,
    deputization: useCue('t165Deputization').at,
    enslavers: useCue('t165Enslavers').at,
    paid: useCue('t165Paid').at,
    substitutes: useCue('t165Substitutes').at,
    place: useCue('t165Place').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 800, h: 70}} at={cue.colonial}/>
    <Copy at={cue.colonial} box={{x: 150, y: 124, w: 760, h: 40}} size={32}>EARLY AMERICAN SOUTH</Copy>
    <Panel box={{x: 140, y: 260, w: 400, h: 340}} at={cue.statutes}/>
    <FitBox text="COLONIAL STATUTE" x={170} y={286} size={26} weight={600} tag="LAW" startFrame={frame(cue.statutes)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    {[380, 430, 480, 530].map((y, i) => <DrawLine key={y} points={[[170, y], [510, y]]} startFrame={frame(cue.statutes + 200 + i * 100)} durationFrames={10} strokeToken="color/line/hatch" strokeWidth={2}/>)}
    <DrawLine points={[[540, 430], [700, 430]]} startFrame={frame(cue.conscripted)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <Copy at={cue.deputization} box={{x: 545, y: 385, w: 300, h: 28}} size={20} tone="color/fill/gold">LEGAL DEPUTIZATION</Copy>
    {[760, 860, 960].map((x, i) => <StickFigure key={x} x={x} y={470} group="ingroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.ordinary + i * 150)} durationFrames={18}/>)}
    <DrawLine points={[[720, 600], [1000, 600], [1000, 700], [720, 700], [720, 600]]} startFrame={frame(cue.patrols)} durationFrames={26} strokeToken="color/line/wire" glowToken="color/fill/gold" strokeWidth={3}/>
    <Copy at={cue.patrols} box={{x: 740, y: 720, w: 300, h: 30}} size={22}>SLAVE PATROLS</Copy>
    <FitBox text="BUFFER CLASS" x={720} y={536} size={24} weight={600} tag="TIER" startFrame={frame(cue.bufferClass)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawRect box={{x: 830, y: 396, w: 60, h: 50}} startFrame={frame(cue.enforcement)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Copy at={cue.enforcement} box={{x: 690, y: 310, w: 420, h: 30}} size={22} tone="color/marker/race">ENFORCEMENT FUNCTION</Copy>
    <StickFigure x={1420} y={470} group="neutral" emphasis={1} scale={1.6} animate startFrame={frame(cue.enslavers)} durationFrames={18}/>
    <Copy at={cue.enslavers} box={{x: 1330, y: 540, w: 240, h: 28}} size={20} tone="color/text/soft">WEALTHY ENSLAVER</Copy>
    <DrawLine points={[[1480, 450], [1610, 450]]} startFrame={frame(cue.paid)} durationFrames={14} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={3} end="arrow" beat/>
    <DrawRect box={{x: 1535, y: 440, w: 20, h: 20}} startFrame={frame(cue.paid + 150)} durationFrames={10} strokeToken="color/fill/gold" fillToken="color/fill/gold" glowToken="color/fill/gold"/>
    <StickFigure x={1650} y={470} group="ingroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.substitutes)} durationFrames={18}/>
    <Copy at={cue.substitutes} box={{x: 1560, y: 540, w: 240, h: 28}} size={20} tone="color/text/soft">PAID SUBSTITUTE</Copy>
    <Copy at={cue.place} box={{x: 1330, y: 590, w: 300, h: 28}} size={20} tone="color/text/dim">PATROL IN THEIR PLACE</Copy>
  </Scene>;
}
