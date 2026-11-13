import React from 'react';
import {DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 311: the full crossing in one bar — embarked against landed, with
// the dead at sea as the red remainder and the mortality rate as its label.
export function CrossingLoss({segment}: SceneProps) {
  const cue = {
    across: useCue('t311Across').at,
    embarked: useCue('t311Embarked').at,
    landed: useCue('t311Landed').at,
    died: useCue('t311Died').at,
    mortality: useCue('t311Mortality').at,
    fourteen: useCue('t311Fourteen').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1100, h: 70}} at={cue.across}/>
    <Copy at={cue.across} box={{x: 150, y: 124, w: 1000, h: 40}} size={32}>ACROSS THE FULL TRADE</Copy>
    <Copy at={cue.embarked} box={{x: 240, y: 280, w: 500, h: 36}} size={28}>TRAFFICKED · 12.5M</Copy>
    <DrawRect box={{x: 240, y: 340, w: 1440, h: 110}} startFrame={frame(cue.embarked)} durationFrames={20} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <DrawRect box={{x: 240, y: 340, w: 1231, h: 110}} startFrame={frame(cue.landed)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <DrawRect box={{x: 1471, y: 340, w: 209, h: 110}} startFrame={frame(cue.died)} durationFrames={18} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Copy at={cue.landed} box={{x: 240, y: 480, w: 500, h: 34}} size={26} tone="color/fill/gold">LANDED · 10.7M</Copy>
    <Copy at={cue.died} box={{x: 1180, y: 480, w: 500, h: 34}} size={26} tone="color/marker/race" align="right">DIED AT SEA · 1.8M</Copy>
    <DrawRect box={{x: 1230, y: 600, w: 450, h: 92}} startFrame={frame(cue.mortality)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race" beat/>
    <Copy at={cue.fourteen} box={{x: 1250, y: 618, w: 410, h: 34}} size={28} align="center" tone="color/marker/race">MORTALITY · 14.5%</Copy>
  </Scene>;
}
