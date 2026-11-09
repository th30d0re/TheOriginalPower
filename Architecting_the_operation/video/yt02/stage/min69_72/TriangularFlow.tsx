import React from 'react';
import {DrawLine, DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 309: the circuit in one triangle — manufactured goods out of Europe,
// captives across the Middle Passage, plantation produce back to Europe.
export function TriangularFlow({segment}: SceneProps) {
  const cue = {
    manufactured: useCue('t309Manufactured').at,
    liverpool: useCue('t309Liverpool').at,
    african: useCue('t309African').at,
    captives: useCue('t309Captives').at,
    middle: useCue('t309Middle').at,
    sugar: useCue('t309Sugar').at,
    rum: useCue('t309Rum').at,
    markets: useCue('t309Markets').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1100, h: 70}} at={cue.manufactured}/>
    <Copy at={cue.manufactured} box={{x: 150, y: 124, w: 1000, h: 40}} size={32}>THE ATLANTIC CIRCUIT</Copy>
    <DrawRect box={{x: 710, y: 210, w: 500, h: 130}} startFrame={frame(cue.liverpool)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.liverpool} box={{x: 740, y: 232, w: 440, h: 34}} size={28} align="center">EUROPEAN PORTS</Copy>
    <Copy at={cue.liverpool} box={{x: 740, y: 276, w: 440, h: 26}} size={20} tone="color/text/soft" align="center">LIVERPOOL · BRISTOL · NANTES</Copy>
    <DrawRect box={{x: 180, y: 790, w: 440, h: 130}} startFrame={frame(cue.african)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.african} box={{x: 210, y: 812, w: 380, h: 34}} size={28} align="center">AFRICAN PORTS</Copy>
    <DrawRect box={{x: 1300, y: 790, w: 440, h: 130}} startFrame={frame(cue.captives)} durationFrames={18} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race" beat/>
    <Copy at={cue.captives} box={{x: 1330, y: 812, w: 380, h: 34}} size={28} align="center">AMERICAS</Copy>
    <DrawLine points={[[710, 300], [420, 790]]} startFrame={frame(cue.manufactured)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <Copy at={cue.manufactured} box={{x: 150, y: 520, w: 280, h: 30}} size={22} tone="color/fill/gold">MANUFACTURED GOODS</Copy>
    <DrawLine points={[[620, 855], [1300, 855]]} startFrame={frame(cue.middle)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <Copy at={cue.captives} box={{x: 760, y: 800, w: 400, h: 30}} size={22} tone="color/marker/race" align="center">MIDDLE PASSAGE</Copy>
    <DrawLine points={[[1540, 790], [1180, 340]]} startFrame={frame(cue.sugar)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <Copy at={cue.sugar} box={{x: 1420, y: 520, w: 340, h: 30}} size={22} tone="color/fill/gold">SUGAR · TOBACCO · RUM</Copy>
    <Copy at={cue.markets} box={{x: 1420, y: 560, w: 340, h: 26}} size={20} tone="color/text/soft">TO EUROPEAN MARKETS</Copy>
  </Scene>;
}
