import React from 'react';
import {DrawLine, DrawRect, FitBox, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 169: Chapter 0's figure tags open the turn, then Eq. 2.2's refinement draws as an apex
// zoom — a triangle quartered into the four upper tiers — and the Elite definition card resolves
// at right: capital owners and institutional architects who design the rules and capture the
// net surplus.
export function ApexElite({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    figureTwo: useCue('t169FigureTwo').at,
    figureThree: useCue('t169FigureThree').at,
    refines: useCue('t169Refines').at,
    four: useCue('t169Four').at,
    apex: useCue('t169Apex').at,
    denoted: useCue('t169Denoted').at,
    capital: useCue('t169Capital').at,
    architects: useCue('t169Architects').at,
    design: useCue('t169Design').at,
    capture: useCue('t169Capture').at,
  };
  // Apex zoom triangle: tip (480,420), base (250,880)-(710,880); three dividers quarter it.
  const tip: readonly [number, number] = [480, 420];
  const bands = [535, 650, 765].map((y) => {
    const hw = (y - tip[1]) * 230 / 460;
    return [[480 - hw, y], [480 + hw, y]] as [[number, number], [number, number]];
  });
  return <Scene segment={segment}>
    <FitBox text="FIG. 0.2 · FIVE-TIER CONE" x={120} y={110} size={24} weight={600} tag="CH. 0" startFrame={frame(cue.figureTwo)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <FitBox text="FIG. 0.3 · EXTRACTION CIRCUIT" x={120} y={182} size={24} weight={600} tag="CH. 0" startFrame={frame(cue.figureThree)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Panel box={{x: 120, y: 280, w: 720, h: 680}} at={cue.refines}/>
    <FitBox text="EQ. 2.2" x={150} y={306} size={26} weight={600} tag="REFINES I" startFrame={frame(cue.refines)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawLine points={[tip, [250, 880]]} startFrame={frame(cue.refines + 300)} durationFrames={18} strokeToken="color/line/hairline-strong" strokeWidth={3}/>
    <DrawLine points={[tip, [710, 880]]} startFrame={frame(cue.refines + 420)} durationFrames={18} strokeToken="color/line/hairline-strong" strokeWidth={3}/>
    <DrawLine points={[[250, 880], [710, 880]]} startFrame={frame(cue.refines + 540)} durationFrames={14} strokeToken="color/line/hairline-strong" strokeWidth={3}/>
    {bands.map((points, i) => <DrawLine key={i} points={points} startFrame={frame(cue.four + i * 150)} durationFrames={12} strokeToken="color/line/hairline" strokeWidth={2}/>)}
    {ms >= cue.apex && <>
      <DrawLine points={[tip, [442, 497]]} progress={1} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6}/>
      <DrawLine points={[tip, [518, 497]]} progress={1} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6}/>
    </>}
    <FitBox text="ELITE · E" x={560} y={396} size={26} weight={600} tag="APEX" startFrame={frame(cue.denoted)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Panel box={{x: 900, y: 280, w: 900, h: 560}} at={cue.capital}/>
    <Copy at={cue.architects} box={{x: 940, y: 330, w: 820, h: 84}} size={32}>CAPITAL OWNERS + INSTITUTIONAL ARCHITECTS</Copy>
    <DrawLine points={[[940, 470], [1740, 470]]} startFrame={frame(cue.architects + 200)} durationFrames={12} strokeToken="color/line/hairline" strokeWidth={2}/>
    <Copy at={cue.design} box={{x: 940, y: 510, w: 700, h: 40}} size={28} tone="color/fill/gold">DESIGN THE RULES</Copy>
    <Copy at={cue.capture} box={{x: 940, y: 580, w: 700, h: 40}} size={28} tone="color/fill/gold">CAPTURE THE NET SURPLUS</Copy>
  </Scene>;
}
