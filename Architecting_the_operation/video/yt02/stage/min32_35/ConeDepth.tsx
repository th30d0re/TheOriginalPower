import React from 'react';
import {DrawLine, DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 159: the wide shot of the cone restores causal depth — conflict across the boundary is
// real, and the vertical cone locates the tiers that set the rules and capture the wealth.
export function ConeDepth({segment}: SceneProps) {
  const cue = {
    wide: useCue('t159Wide').at,
    cone: useCue('t159Cone').at,
    restores: useCue('t159Restores').at,
    depth: useCue('t159Depth').at,
    conflict: useCue('t159Conflict').at,
    boundary: useCue('t159Boundary').at,
    real: useCue('t159Real').at,
    vertical: useCue('t159Vertical').at,
    tiers: useCue('t159Tiers').at,
    rules: useCue('t159Rules').at,
    capture: useCue('t159Capture').at,
    wealth: useCue('t159Wealth').at,
  };
  const tierLines = [[[880, 344], [1040, 344]], [[799, 468], [1121, 468]], [[719, 592], [1201, 592]], [[639, 716], [1281, 716]]] as const;
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1000, h: 70}} at={cue.wide}/>
    <Copy at={cue.depth} box={{x: 150, y: 124, w: 900, h: 40}} size={30}>THE WIDE SHOT RESTORES CAUSAL DEPTH</Copy>
    <DrawLine points={[[960, 220], [560, 840]]} startFrame={frame(cue.cone)} durationFrames={24} strokeToken="color/line/hairline-strong" glowToken="color/fill/gold" strokeWidth={4} beat/>
    <DrawLine points={[[960, 220], [1360, 840]]} startFrame={frame(cue.cone + 150)} durationFrames={24} strokeToken="color/line/hairline-strong" glowToken="color/fill/gold" strokeWidth={4}/>
    <DrawLine points={[[560, 840], [1360, 840]]} startFrame={frame(cue.cone + 300)} durationFrames={18} strokeToken="color/line/hairline-strong" strokeWidth={4}/>
    <DrawLine points={[[480, 840], [480, 240]]} startFrame={frame(cue.restores)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={3} end="arrow" beat/>
    {[344, 468, 592, 716].map((y) => <DrawLine key={y} points={[[466, y], [494, y]]} startFrame={frame(cue.vertical)} durationFrames={8} strokeToken="color/fill/gold" strokeWidth={3}/>)}
    <Copy at={cue.vertical} box={{x: 330, y: 864, w: 300, h: 30}} size={22} align="center" tone="color/fill/gold">CAUSAL DEPTH</Copy>
    {tierLines.map((pts, i) => <DrawLine key={i} points={pts} startFrame={frame(cue.tiers + i * 120)} durationFrames={12} strokeToken="color/line/hairline-strong" strokeWidth={3}/>)}
    {([[[940, 696], [920, 676]], [[980, 696], [1000, 676]], [[940, 736], [920, 756]], [[980, 736], [1000, 756]]] as const).map((pts, i) => <DrawLine key={i} points={pts} startFrame={frame(cue.conflict + i * 60)} durationFrames={10} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={3} beat={i === 0}/>)}
    <DrawLine points={[[639, 716], [1281, 716]]} startFrame={frame(cue.boundary)} durationFrames={14} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} beat/>
    <Copy at={cue.real} box={{x: 1310, y: 700, w: 220, h: 30}} size={22} tone="color/marker/race">REAL CONFLICT</Copy>
    <DrawLine points={[[1400, 220], [1400, 592]]} startFrame={frame(cue.rules)} durationFrames={16} strokeToken="color/fill/gold" strokeWidth={3}/>
    <DrawLine points={[[1400, 220], [1384, 220]]} startFrame={frame(cue.rules)} durationFrames={8} strokeToken="color/fill/gold" strokeWidth={3}/>
    <DrawLine points={[[1400, 592], [1384, 592]]} startFrame={frame(cue.rules)} durationFrames={8} strokeToken="color/fill/gold" strokeWidth={3}/>
    <Copy at={cue.rules} box={{x: 1430, y: 386, w: 300, h: 32}} size={22} tone="color/fill/gold">SET THE RULES</Copy>
    <DrawRect box={{x: 948, y: 208, w: 24, h: 24}} startFrame={frame(cue.capture)} durationFrames={12} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.wealth} box={{x: 1000, y: 230, w: 340, h: 32}} size={22} tone="color/fill/gold">CAPTURE THE WEALTH</Copy>
  </Scene>;
}
