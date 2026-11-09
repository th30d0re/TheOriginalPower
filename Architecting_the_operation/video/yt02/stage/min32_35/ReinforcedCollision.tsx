import React from 'react';
import {DrawLine, DrawRect, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 158: the flat projection and the sideways deflection reinforce each other; each group faces
// the nearest opposing group across the boundary while redirected energy collides on the line.
export function ReinforcedCollision({segment}: SceneProps) {
  const cue = {
    projection: useCue('t158Projection').at,
    deflection: useCue('t158Deflection').at,
    reinforce: useCue('t158Reinforce').at,
    each: useCue('t158Each').at,
    nearest: useCue('t158Nearest').at,
    opposing: useCue('t158Opposing').at,
    redirected: useCue('t158Redirected').at,
    energy: useCue('t158Energy').at,
    collides: useCue('t158Collides').at,
    line: useCue('t158Line').at,
    system: useCue('t158System').at,
  };
  const chipA = {x: 220, y: 140, w: 520, h: 170}, chipB = {x: 1180, y: 140, w: 520, h: 170};
  return <Scene segment={segment}>
    <Panel box={chipA} at={cue.projection}/>
    <Copy at={cue.projection} box={{x: 250, y: 158, w: 460, h: 34}} size={26}>FLAT PROJECTION</Copy>
    <DrawRect box={{x: 250, y: 210, w: 120, h: 40}} startFrame={frame(cue.projection + 200)} durationFrames={12} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
    <DrawRect box={{x: 250, y: 254, w: 120, h: 40}} startFrame={frame(cue.projection + 300)} durationFrames={12} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race"/>
    <DrawLine points={[[250, 252], [370, 252]]} startFrame={frame(cue.projection + 350)} durationFrames={10} strokeToken="color/fill/gold" strokeWidth={2}/>
    <Panel box={chipB} at={cue.deflection} accent="color/marker/race"/>
    <Copy at={cue.deflection} box={{x: 1210, y: 158, w: 460, h: 34}} size={26}>SIDEWAYS DEFLECTION</Copy>
    <DrawLine points={[[1220, 292], [1220, 230], [1330, 230]]} startFrame={frame(cue.deflection + 200)} durationFrames={14} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={3} end="arrow"/>
    <DrawLine points={[[740, 190], [1180, 190]]} startFrame={frame(cue.reinforce)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={3} end="arrow" beat/>
    <DrawLine points={[[1180, 262], [740, 262]]} startFrame={frame(cue.reinforce + 200)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={3} end="arrow"/>
    <Copy at={cue.reinforce} box={{x: 800, y: 218, w: 320, h: 26}} size={20} align="center" tone="color/fill/gold">REINFORCE EACH OTHER</Copy>
    <Panel box={{x: 220, y: 380, w: 1480, h: 560}} at={cue.each}/>
    <DrawLine points={[[320, 640], [1600, 640]]} startFrame={frame(cue.each)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4}/>
    <StickFigure x={700} y={556} group="ingroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.each + 150)} durationFrames={20}/>
    <StickFigure x={700} y={740} group="outgroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.each + 300)} durationFrames={20}/>
    <DrawLine points={[[700, 610], [700, 636]]} startFrame={frame(cue.nearest)} durationFrames={10} strokeToken="color/line/hairline-strong" strokeWidth={2} end="arrow" beat/>
    <DrawLine points={[[700, 692], [700, 646]]} startFrame={frame(cue.opposing)} durationFrames={10} strokeToken="color/line/hairline-strong" strokeWidth={2} end="arrow"/>
    <Copy at={cue.opposing} box={{x: 760, y: 556, w: 380, h: 28}} size={20} tone="color/text/soft">NEAREST OPPOSING GROUP</Copy>
    <DrawLine points={[[980, 624], [1130, 624]]} startFrame={frame(cue.redirected)} durationFrames={14} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
    <DrawLine points={[[1360, 624], [1210, 624]]} startFrame={frame(cue.energy)} durationFrames={14} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
    <Copy at={cue.energy} box={{x: 1260, y: 660, w: 420, h: 28}} size={20} tone="color/marker/race">REDIRECTED POLITICAL ENERGY</Copy>
    {([[[1150, 600], [1130, 580]], [[1190, 600], [1210, 580]], [[1150, 648], [1130, 668]], [[1190, 648], [1210, 668]]] as const).map((pts, i) => <DrawLine key={i} points={pts} startFrame={frame(cue.collides + i * 60)} durationFrames={10} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={3} beat={i === 0}/>)}
    <Copy at={cue.line} box={{x: 320, y: 660, w: 300, h: 28}} size={20} tone="color/text/dim">THE BOUNDARY LINE</Copy>
    <Copy at={cue.system} box={{x: 1250, y: 884, w: 420, h: 28}} size={20} mono tone="color/text/dim">INSIDE THE SYSTEM</Copy>
  </Scene>;
}
