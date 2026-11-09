import React from 'react';
import {BootIn, DrawLine, DrawRect, FitBox, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Scene, enter, frame} from './shared';

// Turn 155: Eq. 2.1 captures the flat projected image; breaking the illusion lifts the image and
// separates the visible racial boundary from the vertical command structure that runs it.
export function FlatImageEquation({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    equation: useCue('t155Equation').at,
    pointOne: useCue('t155PointOne').at,
    captures: useCue('t155Captures').at,
    flat: useCue('t155Flat').at,
    breaking: useCue('t155Breaking').at,
    reveals: useCue('t155Reveals').at,
    vertical: useCue('t155Vertical').at,
    formalize: useCue('t155Formalize').at,
    separating: useCue('t155Separating').at,
    visible: useCue('t155Visible').at,
    command: useCue('t155Command').at,
    runs: useCue('t155Runs').at,
  };
  const lift = enter(ms, cue.reveals, 900);
  const dim = 1 - .55 * enter(ms, cue.breaking, 500);
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 110, w: 560, h: 120}} at={cue.equation}/>
    <FitBox text="EQ. 2.1" x={150} y={140} size={38} weight={600} tag="CHAPTER 2" startFrame={frame(cue.equation)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.pointOne} box={{x: 150, y: 246, w: 500, h: 26}} size={20} mono tone="color/text/dim">EQ. 2.1 · FLAT PROJECTION</Copy>
    <div style={{position: 'absolute', inset: 0, opacity: dim}}>
      <Panel box={{x: 160, y: 300, w: 680, h: 520}} at={cue.captures}/>
      <DrawRect box={{x: 184, y: 352, w: 632, h: 382}} startFrame={frame(cue.captures)} durationFrames={16} strokeToken="color/line/accent" glowToken="color/fill/gold" strokeWidth={2} beat/>
      <DrawRect box={{x: 200, y: 370, w: 600, h: 160}} startFrame={frame(cue.flat)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
      <DrawLine points={[[200, 543], [800, 543]]} startFrame={frame(cue.flat + 150)} durationFrames={12} strokeToken="color/fill/gold" strokeWidth={4}/>
      <DrawRect box={{x: 200, y: 556, w: 600, h: 160}} startFrame={frame(cue.flat + 300)} durationFrames={18} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race"/>
      <Copy at={cue.captures} box={{x: 190, y: 762, w: 620, h: 28}} size={20} tone="color/text/soft">FLAT PROJECTED IMAGE</Copy>
    </div>
    <BootIn box={{x: 1020, y: 180, w: 780, h: 700}} startFrame={frame(cue.breaking)} durationFrames={24} mode="glitch" strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <DrawRect box={{x: 1020, y: 180, w: 780, h: 700}} startFrame={frame(cue.breaking)} durationFrames={24} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <div style={{position: 'absolute', inset: 0, opacity: lift, transform: `translateY(${-240 * lift}px)`}}>
      <DrawRect box={{x: 1200, y: 620, w: 300, h: 120}} progress={1} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
    </div>
    <DrawLine points={[[1370, 740], [1370, 340]]} startFrame={frame(cue.reveals)} durationFrames={20} strokeToken="color/line/hatch" strokeWidth={3}/>
    <Copy at={cue.vertical} box={{x: 1530, y: 420, w: 260, h: 64}} size={20} tone="color/text/soft">VERTICAL ELEVATION</Copy>
    <Copy at={cue.formalize} box={{x: 1040, y: 196, w: 400, h: 26}} size={20} mono tone="color/text/dim">NEXT EQUATION FORMALIZES</Copy>
    <DrawLine points={[[1080, 760], [1740, 760]]} startFrame={frame(cue.separating)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} beat/>
    <Copy at={cue.visible} box={{x: 1120, y: 782, w: 620, h: 30}} size={22}>VISIBLE RACIAL BOUNDARY</Copy>
    <Copy at={cue.command} box={{x: 1400, y: 300, w: 300, h: 34}} size={24} tone="color/marker/race">COMMAND STRUCTURE</Copy>
    <DrawLine points={[[1370, 740], [1370, 340]]} startFrame={frame(cue.runs)} durationFrames={22} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
  </Scene>;
}
