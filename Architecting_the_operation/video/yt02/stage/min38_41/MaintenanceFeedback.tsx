import React from 'react';
import {DrawLine, DrawRect, FitBox, Trace, useCue, useStageMs, type SceneProps} from '@stage';
import {ChecklistRail, Copy, DashPath, Panel, Scene, enter, frame} from './shared';

const LOOP = [[1180, 600], [1180, 760], [380, 760], [380, 640]] as const;

// Turn 191: requirement five closes the checklist — Figure 2.2's dashed maintenance feedback
// loop carries system-cultivated prejudice back into the machine through four everyday gates.
export function MaintenanceFeedback({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    five: useCue('t191Five').at,
    regulation: useCue('t191Regulation').at,
    figure: useCue('t191Figure').at,
    twoPointTwo: useCue('t191TwoPointTwo').at,
    displays: useCue('t191Displays').at,
    dashed: useCue('t191Dashed').at,
    loop: useCue('t191Loop').at,
    prejudice: useCue('t191Prejudice').at,
    reenters: useCue('t191Reenters').at,
    machine: useCue('t191Machine').at,
    voters: useCue('t191Voters').at,
    juries: useCue('t191Juries').at,
    lenders: useCue('t191Lenders').at,
    hiring: useCue('t191Hiring').at,
  };
  const drawn = enter(ms, cue.loop, 900);
  const dash = enter(ms, cue.loop + 600, 600);
  const heat = 1 - enter(ms, cue.loop + 800, 400);
  const gates: readonly [string, number, number, number][] = [
    ['VOTERS', cue.voters, 990, 120],
    ['JURIES', cue.juries, 830, 120],
    ['LENDERS', cue.lenders, 660, 140],
    ['HIRING MANAGERS', cue.hiring, 400, 230],
  ];
  return <Scene segment={segment}>
    <FitBox text="REQUIREMENT 5" x={120} y={110} size={32} weight={600} tag="SYSTEMS CHECKLIST" startFrame={frame(cue.five)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.regulation} box={{x: 500, y: 126, w: 420, h: 34}} size={26}>FEEDBACK REGULATION</Copy>
    <ChecklistRail x={120} y={206} at={cue.five + 200} done={[1, 2, 3, 4]} active={5}/>
    <Panel box={{x: 120, y: 320, w: 1680, h: 580}} at={cue.figure}/>
    <FitBox text="FIGURE 2.2" x={150} y={344} size={26} weight={600} tag="MAINTENANCE FEEDBACK LOOP" startFrame={frame(cue.twoPointTwo)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawRect box={{x: 300, y: 480, w: 340, h: 160}} startFrame={frame(cue.displays + 200)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <Copy at={cue.machine} box={{x: 300, y: 544, w: 340, h: 30}} size={24} align="center">THE MACHINE</Copy>
    <DrawLine points={[[640, 560], [934, 560]]} startFrame={frame(cue.displays + 400)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow"/>
    <DrawRect box={{x: 940, y: 520, w: 480, h: 80}} startFrame={frame(cue.prejudice)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Copy at={cue.prejudice} box={{x: 940, y: 546, w: 480, h: 30}} size={22} align="center" tone="color/marker/race">SYSTEM-CULTIVATED PREJUDICE</Copy>
    <DashPath points={LOOP} at={cue.loop + 600} ms={ms}/>
    {drawn > 0 && <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-hidden="true">
      <Trace points={LOOP} drawn={drawn} heat={heat} cool={.78 * (1 - dash)} strokeToken="color/marker/race" glowToken="color/marker/race" width={3} tail={80}/>
    </svg>}
    {gates.map(([label, at, x, w]) => <React.Fragment key={label}>
      <DrawRect box={{x, y: 732, w, h: 56}} startFrame={frame(at)} durationFrames={12} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
      <Copy at={at} box={{x, y: 746, w, h: 28}} size={20} align="center">{label}</Copy>
    </React.Fragment>)}
    <Copy at={cue.reenters} box={{x: 130, y: 676, w: 230, h: 28}} size={20} align="right" tone="color/marker/race">RE-ENTERS</Copy>
  </Scene>;
}
