import React from 'react';
import {DrawLine, DrawRect, Flicker, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 186–187: Delta-max gauges the Elite's extraction ceiling across a policy reform. The
// Concession Theorem holds the ceiling line pinned at Δmax = 0 while concessions circulate
// status and minor benefits below the apex.
export function DeltaMaxCeiling({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    deltaMax: useCue('t186DeltaMax').at,
    change: useCue('t186Change').at,
    maximum: useCue('t186Maximum').at,
    policy: useCue('t186Policy').at,
    reform: useCue('t186Reform').at,
    zero: useCue('t186Zero').at,
    ceiling: useCue('t186Ceiling').at,
    unchanged: useCue('t186Unchanged').at,
    concession: useCue('t187Concession').at,
    theorem: useCue('t187Theorem').at,
    deltaMaxZero: useCue('t187DeltaMaxZero').at,
    redistribute: useCue('t187Redistribute').at,
    status: useCue('t187Status').at,
    benefits: useCue('t187Benefits').at,
    below: useCue('t187Below').at,
    apex: useCue('t187Apex').at,
    lowering: useCue('t187Lowering').at,
    ceilingHeld: useCue('t187Ceiling').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1680, h: 90}} at={cue.deltaMax}/>
    <Flicker startFrame={frame(cue.deltaMax)} durationFrames={16} beat>
      <EquationTerms equation="Concession Theorem · delta-max rule" ms={ms} box={{x: 150, y: 124, w: 340, h: 56}} fontSize={40} tokens={[{term: 'DeltaMax'}, {text: ' = 0', revealAt: cue.zero}]} pulses={{DeltaMax: [cue.deltaMax, cue.deltaMaxZero]}}/>
    </Flicker>
    <Copy at={cue.maximum} box={{x: 540, y: 138, w: 660, h: 34}} size={24}>CHANGE IN MAXIMUM EXTRACTION SHARE</Copy>
    <Copy at={cue.theorem} box={{x: 1300, y: 140, w: 470, h: 30}} size={22} tone="color/fill/gold" align="right">CONCESSION THEOREM · CHAPTER 15</Copy>
    <Panel box={{x: 120, y: 240, w: 740, h: 640}} at={cue.change}/>
    <DrawLine points={[[220, 820], [220, 300]]} startFrame={frame(cue.change)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2} origin={false} nodes={false}/>
    <DrawRect box={{x: 300, y: 280, w: 260, h: 80}} startFrame={frame(cue.maximum)} durationFrames={14} strokeToken="color/fill/accent" fillToken="color/fill/accent-wash" glowToken="color/fill/accent"/>
    <Copy at={cue.maximum} box={{x: 300, y: 308, w: 260, h: 28}} size={22} align="center">ELITE</Copy>
    <DrawLine points={[[520, 700], [520, 436]]} startFrame={frame(cue.reform)} durationFrames={18} strokeToken="color/line/wire" strokeWidth={4} end="arrow"/>
    <Copy at={cue.policy} box={{x: 560, y: 650, w: 240, h: 28}} size={20} tone="color/text/soft">POLICY REFORM</Copy>
    <DrawLine points={[[180, 420], [820, 420]]} startFrame={frame(cue.ceiling)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6} origin={false} nodes={false} beat/>
    <Copy at={cue.ceiling} box={{x: 470, y: 380, w: 350, h: 28}} size={22} tone="color/fill/gold">EXTRACTION CEILING</Copy>
    <DrawRect box={{x: 600, y: 480, w: 230, h: 50}} startFrame={frame(cue.unchanged)} durationFrames={12} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Copy at={cue.unchanged} box={{x: 600, y: 492, w: 230, h: 26}} size={20} align="center" tone="color/marker/race">STAYS UNCHANGED</Copy>
    <DrawRect box={{x: 700, y: 412, w: 16, h: 16}} startFrame={frame(cue.lowering)} durationFrames={10} strokeToken="color/fill/gold" fillToken="color/fill/gold" glowToken="color/fill/gold"/>
    <DrawLine points={[[640, 420], [760, 420]]} startFrame={frame(cue.ceilingHeld)} durationFrames={12} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={8} origin={false} nodes={false}/>
    <Panel box={{x: 940, y: 240, w: 860, h: 640}} at={cue.concession}/>
    <DrawRect box={{x: 1000, y: 420, w: 320, h: 60}} startFrame={frame(cue.status)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.status} box={{x: 1000, y: 436, w: 320, h: 28}} size={22} align="center">SYMBOLIC STATUS</Copy>
    <DrawRect box={{x: 1400, y: 420, w: 360, h: 60}} startFrame={frame(cue.benefits)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
    <Copy at={cue.benefits} box={{x: 1400, y: 436, w: 360, h: 28}} size={22} align="center">MINOR MATERIAL BENEFITS</Copy>
    <DrawRect box={{x: 1000, y: 640, w: 320, h: 120}} startFrame={frame(cue.below)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render"/>
    <DrawRect box={{x: 1400, y: 640, w: 360, h: 120}} startFrame={frame(cue.below + 120)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render"/>
    <DrawLine points={[[1160, 484], [1160, 634]]} startFrame={frame(cue.redistribute)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={3} end="arrow"/>
    <DrawLine points={[[1580, 484], [1580, 634]]} startFrame={frame(cue.redistribute + 120)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={3} end="arrow"/>
    <DrawLine points={[[1326, 688], [1394, 688]]} startFrame={frame(cue.redistribute + 200)} durationFrames={10} strokeToken="color/fill/gold" strokeWidth={3} end="arrow"/>
    <DrawLine points={[[1394, 724], [1326, 724]]} startFrame={frame(cue.redistribute + 260)} durationFrames={10} strokeToken="color/fill/gold" strokeWidth={3} end="arrow"/>
    <Copy at={cue.apex} box={{x: 1150, y: 790, w: 480, h: 28}} size={20} tone="color/text/dim" align="center">BELOW THE APEX</Copy>
  </Scene>;
}
