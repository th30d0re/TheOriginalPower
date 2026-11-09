import React from 'react';
import {DrawLine, DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 174–175: Chapter 2's four operational modules draw as horizontal lanes running across a
// five-band tier column, then the first two resolve their mechanics — autonomy restriction limits
// movement, property, and reproduction in the Out-group band, and selective empathy splits into
// a gold In-group "urgent" tag and a red Out-group "dismissed" tag.
const BANDS = ['E', 'P', 'F', 'B', 'O'] as const;
const BAND_Y = [240, 368, 496, 622, 748] as const;

export function OperationalModules({segment}: SceneProps) {
  const cue = {
    alongside: useCue('t174Alongside').at,
    modules: useCue('t174Modules').at,
    across: useCue('t174Across').at,
    asymmetric: useCue('t174Asymmetric').at,
    selective: useCue('t174Selective').at,
    ideological: useCue('t174Ideological').at,
    resistance: useCue('t174Resistance').at,
    limits: useCue('t175Limits').at,
    outgroup: useCue('t175Outgroup').at,
    urgent: useCue('t175Urgent').at,
    dismisses: useCue('t175Dismisses').at,
  };
  const lanes: readonly {name: string; at: number; y: number}[] = [
    {name: 'ASYMMETRIC AUTONOMY RESTRICTION', at: cue.asymmetric, y: 240},
    {name: 'SELECTIVE EMPATHY', at: cue.selective, y: 420},
    {name: 'IDEOLOGICAL JUSTIFICATION', at: cue.ideological, y: 600},
    {name: 'RESISTANCE TO STRUCTURAL CRITIQUE', at: cue.resistance, y: 780},
  ];
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 760, h: 70}} at={cue.modules}/>
    <Copy at={cue.modules} box={{x: 150, y: 124, w: 720, h: 40}} size={30}>FOUR OPERATIONAL MODULES</Copy>
    <Copy at={cue.across} box={{x: 920, y: 130, w: 500, h: 28}} size={20} mono tone="color/text/dim">RUN ACROSS THE COMPONENTS</Copy>
    {BANDS.map((band, i) => <React.Fragment key={band}>
      <DrawRect box={{x: 140, y: BAND_Y[i], w: 160, h: 100}} startFrame={frame(cue.alongside + i * 120)} durationFrames={14} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
      <Copy at={cue.alongside + i * 120} box={{x: 140, y: BAND_Y[i] + 32, w: 160, h: 36}} size={26} mono align="center" tone="color/text/soft">{band}</Copy>
    </React.Fragment>)}
    <DrawLine points={[[320, 240], [320, 848]]} startFrame={frame(cue.across)} durationFrames={20} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
    {lanes.map((lane) => <React.Fragment key={lane.name}>
      <DrawRect box={{x: 340, y: lane.y, w: 1440, h: 84}} startFrame={frame(lane.at)} durationFrames={18} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
      <Copy at={lane.at} box={{x: 370, y: lane.y + 26, w: 640, h: 36}} size={24}>{lane.name}</Copy>
    </React.Fragment>)}
    <Copy at={cue.limits} box={{x: 1040, y: 258, w: 720, h: 32}} size={22}>LIMITS MOVEMENT · PROPERTY · REPRODUCTION</Copy>
    <DrawLine points={[[320, 282], [320, 798]]} startFrame={frame(cue.outgroup)} durationFrames={16} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={4} end="arrow" beat/>
    <DrawRect box={{x: 140, y: 748, w: 160, h: 100}} startFrame={frame(cue.outgroup)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race"/>
    <Copy at={cue.urgent} box={{x: 1020, y: 446, w: 360, h: 30}} size={20} tone="color/fill/gold">IN-GROUP GRIEVANCES · URGENT</Copy>
    <Copy at={cue.dismisses} box={{x: 1430, y: 446, w: 340, h: 30}} size={20} tone="color/marker/race">OUT-GROUP PAIN · DISMISSED</Copy>
  </Scene>;
}
