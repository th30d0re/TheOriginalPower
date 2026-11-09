import React from 'react';
import {DrawLine, DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 154: the flat binary endures because it records a real legal boundary while hiding the
// internal ranking stacked on the protected (In-group) side.
export function BinaryEndures({segment}: SceneProps) {
  const cue = {
    optical: useCue('t154Optical').at,
    binary: useCue('t154Binary').at,
    endures: useCue('t154Endures').at,
    records: useCue('t154Records').at,
    legal: useCue('t154Legal').at,
    boundary: useCue('t154Boundary').at,
    hiding: useCue('t154Hiding').at,
    ranking: useCue('t154Ranking').at,
    protected_: useCue('t154Protected').at,
  };
  const top = {x: 480, y: 260, w: 960, h: 250}, band = {x: 480, y: 510, w: 960, h: 44}, bottom = {x: 480, y: 554, w: 960, h: 250};
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 900, h: 70}} at={cue.optical}/>
    <Copy at={cue.optical} box={{x: 150, y: 124, w: 840, h: 40}} size={34}>THE SIMPLE BINARY</Copy>
    <DrawRect box={top} startFrame={frame(cue.binary)} durationFrames={20} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.binary} box={{x: 510, y: 282, w: 300, h: 36}} size={26}>I · IN-GROUP</Copy>
    <DrawRect box={bottom} startFrame={frame(cue.endures)} durationFrames={20} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Copy at={cue.endures} box={{x: 510, y: 776, w: 320, h: 36}} size={26}>O · OUT-GROUP</Copy>
    <DrawRect box={band} startFrame={frame(cue.records)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <DrawLine points={[[480, 532], [1440, 532]]} startFrame={frame(cue.legal)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} beat/>
    <Copy at={cue.boundary} box={{x: 1470, y: 518, w: 330, h: 30}} size={22} tone="color/fill/gold">LEGAL BOUNDARY · REAL</Copy>
    <div style={{position: 'absolute', inset: 0, opacity: .5}}>
      {[320, 390, 460].map((y, i) => <DrawLine key={y} points={[[900, y], [1400, y]]} startFrame={frame(cue.hiding + i * 120)} durationFrames={14} strokeToken="color/line/hatch" strokeWidth={3}/>)}
    </div>
    <Copy at={cue.ranking} box={{x: 960, y: 200, w: 480, h: 28}} size={20} tone="color/text/dim">INTERNAL RANKING · HIDDEN</Copy>
    <DrawLine points={[[1440, 312], [1466, 302]]} startFrame={frame(cue.protected_)} durationFrames={10} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
    <Copy at={cue.protected_} box={{x: 1470, y: 284, w: 330, h: 30}} size={22}>PROTECTED SIDE</Copy>
  </Scene>;
}
