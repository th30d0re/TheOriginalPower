import React from 'react';
import {DrawLine, DrawRect, FitBox, useCue, type SceneProps} from '@stage';
import {ChecklistRail, Copy, Panel, Scene, frame} from './shared';

// Turn 188: requirement four — a system's purpose is read off its stable runtime behavior. The
// machine's behavior trace rises and locks into the plateau it consistently maximizes.
export function PurposeFromBehavior({segment}: SceneProps) {
  const cue = {
    how: useCue('t188How').at,
    four: useCue('t188Four').at,
    objective: useCue('t188Objective').at,
    function_: useCue('t188Function').at,
    orPurpose: useCue('t188OrPurpose').at,
    theory: useCue('t188Theory').at,
    machine: useCue('t188Machine').at,
    stable: useCue('t188Stable').at,
    runtime: useCue('t188Runtime').at,
    maximizes: useCue('t188Maximizes').at,
  };
  return <Scene segment={segment}>
    <Copy at={cue.how} box={{x: 150, y: 118, w: 1620, h: 88}} size={40}>HOW IS A SYSTEM'S PURPOSE READ FROM ITS BEHAVIOR?</Copy>
    <Panel box={{x: 120, y: 280, w: 580, h: 400}} at={cue.four}/>
    <FitBox text="REQUIREMENT 4" x={150} y={310} size={30} weight={600} tag="SYSTEMS CHECKLIST" startFrame={frame(cue.four)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.function_} box={{x: 150, y: 424, w: 510, h: 36}} size={28}>EXPLICIT OBJECTIVE FUNCTION</Copy>
    <Copy at={cue.orPurpose} box={{x: 150, y: 470, w: 300, h: 30}} size={22} tone="color/text/soft">OR PURPOSE</Copy>
    <ChecklistRail x={150} y={560} at={cue.four + 200} done={[1, 2, 3]} active={4}/>
    <Panel box={{x: 780, y: 280, w: 1020, h: 600}} at={cue.theory}/>
    <DrawRect box={{x: 830, y: 430, w: 300, h: 140}} startFrame={frame(cue.machine)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.machine} box={{x: 830, y: 486, w: 300, h: 30}} size={24} align="center">THE MACHINE</Copy>
    <DrawLine points={[[1210, 720], [1360, 660], [1500, 540], [1720, 540]]} startFrame={frame(cue.runtime)} durationFrames={24} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} nodes={false} beat/>
    <Copy at={cue.stable} box={{x: 1260, y: 752, w: 420, h: 28}} size={20} tone="color/text/soft">STABLE RUNTIME BEHAVIOR</Copy>
    <DrawLine points={[[1660, 532], [1660, 470]]} startFrame={frame(cue.maximizes)} durationFrames={10} strokeToken="color/fill/gold" strokeWidth={3} end="arrow" origin={false} nodes={false}/>
    <Copy at={cue.maximizes} box={{x: 1360, y: 424, w: 400, h: 32}} size={24} tone="color/fill/gold">CONSISTENTLY MAXIMIZES</Copy>
  </Scene>;
}
