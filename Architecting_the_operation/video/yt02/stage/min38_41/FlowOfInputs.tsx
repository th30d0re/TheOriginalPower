import React from 'react';
import {DrawLine, DrawRect, FitBox, useCue, type SceneProps} from '@stage';
import {ChecklistRail, Copy, Panel, Scene, frame} from './shared';

// Turn 183: the engineering checklist returns with slot 3 lit — a defined flow of inputs and
// outputs — and the Chapter 0 circuit model shows Out-group labor and Buffer Class capacity
// feeding the system's driving energy.
export function FlowOfInputs({segment}: SceneProps) {
  const cue = {
    complete: useCue('t183Complete').at,
    checklist: useCue('t183Checklist').at,
    requirement: useCue('t183Requirement').at,
    three: useCue('t183Three').at,
    flow: useCue('t183Flow').at,
    inputs: useCue('t183Inputs').at,
    outputs: useCue('t183Outputs').at,
    circuit: useCue('t183Circuit').at,
    figure: useCue('t183FigureZeroThree').at,
    labor: useCue('t183Labor').at,
    capacity: useCue('t183Capacity').at,
    supply: useCue('t183Supply').at,
    driving: useCue('t183Driving').at,
    energy: useCue('t183Energy').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1200, h: 84}} at={cue.complete}/>
    <FitBox text="REQUIREMENT 3" x={150} y={124} size={30} weight={600} tag="SYSTEMS CHECKLIST" startFrame={frame(cue.three)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.flow} box={{x: 620, y: 138, w: 680, h: 34}} size={26}>DEFINED FLOW OF INPUTS + OUTPUTS</Copy>
    <ChecklistRail x={150} y={250} at={cue.checklist} done={[1, 2]} active={3} vertical/>
    <Panel box={{x: 320, y: 250, w: 1480, h: 640}} at={cue.circuit}/>
    <FitBox text="FIGURE 0.3" x={350} y={272} size={26} weight={600} tag="CH. 0 · CIRCUIT MODEL" startFrame={frame(cue.figure)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawRect box={{x: 950, y: 330, w: 500, h: 130}} startFrame={frame(cue.circuit + 300)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
    <Copy at={cue.supply} box={{x: 950, y: 378, w: 500, h: 34}} size={26} align="center">THE SYSTEM</Copy>
    <DrawRect box={{x: 380, y: 690, w: 470, h: 110}} startFrame={frame(cue.labor)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Copy at={cue.labor} box={{x: 400, y: 728, w: 430, h: 30}} size={22}>OUT-GROUP · PHYSICAL LABOR</Copy>
    <DrawRect box={{x: 910, y: 690, w: 480, h: 110}} startFrame={frame(cue.capacity)} durationFrames={16} strokeToken="color/line/wire" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <Copy at={cue.capacity} box={{x: 930, y: 728, w: 440, h: 30}} size={22}>BUFFER CLASS · PRODUCTIVE CAPACITY</Copy>
    <DrawLine points={[[615, 686], [615, 540], [1050, 540], [1050, 466]]} startFrame={frame(cue.supply)} durationFrames={22} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={7} end="arrow" beat/>
    <DrawLine points={[[1150, 686], [1150, 466]]} startFrame={frame(cue.supply + 150)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={7} end="arrow"/>
    <Copy at={cue.driving} box={{x: 680, y: 496, w: 360, h: 30}} size={22} tone="color/fill/gold">DRIVING ENERGY</Copy>
    <DrawRect box={{x: 1041, y: 531, w: 18, h: 18}} startFrame={frame(cue.energy)} durationFrames={10} strokeToken="color/fill/gold" fillToken="color/fill/gold" glowToken="color/fill/gold" beat/>
  </Scene>;
}
