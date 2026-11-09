import React from 'react';
import {DrawLine, DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 312: of everyone landed, Brazil takes nearly half while mainland
// North America takes a sliver — the contrast is the picture.
export function DestinationShare({segment}: SceneProps) {
  const cue = {
    brazil: useCue('t312Brazil').at,
    fortyFive: useCue('t312FortyFive').at,
    mainland: useCue('t312Mainland').at,
    three: useCue('t312Three').at,
    thousand: useCue('t312Thousand').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1100, h: 70}} at={cue.brazil}/>
    <Copy at={cue.brazil} box={{x: 150, y: 124, w: 1000, h: 40}} size={32}>WHERE LANDED PEOPLE WENT</Copy>
    <Copy at={cue.brazil} box={{x: 220, y: 300, w: 400, h: 34}} size={28}>BRAZIL</Copy>
    <DrawRect box={{x: 220, y: 350, w: 1440, h: 96}} startFrame={frame(cue.brazil)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <DrawRect box={{x: 220, y: 350, w: 648, h: 96}} startFrame={frame(cue.fortyFive)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.fortyFive} box={{x: 900, y: 376, w: 300, h: 36}} size={32} tone="color/fill/gold">45%</Copy>
    <Copy at={cue.mainland} box={{x: 220, y: 540, w: 560, h: 34}} size={28}>MAINLAND NORTH AMERICA</Copy>
    <DrawRect box={{x: 220, y: 590, w: 1440, h: 96}} startFrame={frame(cue.mainland)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <DrawRect box={{x: 220, y: 590, w: 52, h: 96}} startFrame={frame(cue.three)} durationFrames={18} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <DrawLine points={[[246, 686], [420, 790]]} startFrame={frame(cue.three)} durationFrames={14} strokeToken="color/marker/race" strokeWidth={3} end="arrow"/>
    <DrawRect box={{x: 420, y: 790, w: 520, h: 92}} startFrame={frame(cue.thousand)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race" beat/>
    <Copy at={cue.three} box={{x: 440, y: 802, w: 480, h: 32}} size={26} align="center" tone="color/marker/race">3.6% · 390K PEOPLE</Copy>
  </Scene>;
}
