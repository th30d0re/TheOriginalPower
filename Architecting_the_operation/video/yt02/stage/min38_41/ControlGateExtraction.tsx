import React from 'react';
import {DrawLine, DrawRect, FitBox, useCue, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 184–185: the five-tier cone holds still while the Elite tier works as a parasitic
// control gate — a thick labor current runs up the axis to the apex, a thin control current
// returns through the Puppet and Enforcement discs, and a small suppression allocation is
// paid back down to the Buffer tier.
// Cone div is x 170 y 230 w 860 h 640 (viewBox 720 × 560, bare stretch): the shared axis lands
// on screen x 600; apex y ≈ 416, P y ≈ 506, F y ≈ 570, I_buffer y ≈ 634, base bottom y ≈ 790.
export function ControlGateExtraction({segment}: SceneProps) {
  const cue = {
    elite: useCue('t184Elite').at,
    parasitic: useCue('t184Parasitic').at,
    gate: useCue('t184Gate').at,
    directs: useCue('t184Directs').at,
    highCurrent: useCue('t184HighCurrent').at,
    upward: useCue('t184Upward').at,
    drawing: useCue('t184Drawing').at,
    controlCurrent: useCue('t184ControlCurrent').at,
    puppet: useCue('t184Puppet').at,
    enforcement: useCue('t184Enforcement').at,
    output: useCue('t185Output').at,
    extraction: useCue('t185Extraction').at,
    captured: useCue('t185Captured').at,
    downward: useCue('t185Downward').at,
    suppression: useCue('t185Suppression').at,
    allocation: useCue('t185Allocation').at,
    paid: useCue('t185Paid').at,
    status: useCue('t185Status').at,
    concessions: useCue('t185Concessions').at,
  };
  return <Scene segment={segment}>
    <FitBox text="PARASITIC CONTROL GATE" x={120} y={110} size={34} weight={600} tag="ELITE TIER" startFrame={frame(cue.parasitic)} durationFrames={20} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Panel box={{x: 120, y: 200, w: 960, h: 700}} at={cue.gate}/>
    <div style={{position: 'absolute', left: 170, top: 230, width: 860, height: 640}}>
      <ConeOnly width={860} height={640} model={{el: 20, az: -28, al: 1}}/>
    </div>
    <DrawLine points={[[600, 790], [600, 425]]} startFrame={frame(cue.directs)} durationFrames={26} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={10} end="arrow" beat/>
    <Copy at={cue.upward} box={{x: 1120, y: 560, w: 440, h: 30}} size={22}>HIGH-CURRENT LABOR FLOW UPWARD</Copy>
    <DrawLine points={[[1108, 575], [614, 600]]} startFrame={frame(cue.upward)} durationFrames={12} strokeToken="color/line/hairline" strokeWidth={2} origin={false} nodes={false}/>
    <DrawLine points={[[656, 440], [716, 506], [716, 570], [660, 600]]} startFrame={frame(cue.drawing)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={3} nodes={false}/>
    <Copy at={cue.controlCurrent} box={{x: 1120, y: 470, w: 340, h: 30}} size={22} tone="color/marker/race">CONTROL CURRENT</Copy>
    <DrawLine points={[[1108, 482], [724, 540]]} startFrame={frame(cue.controlCurrent)} durationFrames={12} strokeToken="color/line/hairline" strokeWidth={2} origin={false} nodes={false}/>
    <DrawRect box={{x: 708, y: 498, w: 16, h: 16}} startFrame={frame(cue.puppet)} durationFrames={10} strokeToken="color/marker/race" fillToken="color/marker/race" beat/>
    <DrawRect box={{x: 708, y: 562, w: 16, h: 16}} startFrame={frame(cue.enforcement)} durationFrames={10} strokeToken="color/marker/race" fillToken="color/marker/race"/>
    <Copy at={cue.extraction} box={{x: 1120, y: 320, w: 440, h: 34}} size={24} tone="color/fill/gold">UPWARD WEALTH EXTRACTION</Copy>
    <DrawLine points={[[1108, 332], [648, 420]]} startFrame={frame(cue.extraction)} durationFrames={12} strokeToken="color/line/hairline" strokeWidth={2} origin={false} nodes={false}/>
    <Copy at={cue.captured} box={{x: 1120, y: 360, w: 420, h: 28}} size={20} tone="color/text/soft">CAPTURED BY THE ELITE</Copy>
    <DrawLine points={[[548, 450], [548, 630]]} startFrame={frame(cue.downward)} durationFrames={18} strokeToken="color/line/wire" strokeWidth={4} end="arrow" beat/>
    <Copy at={cue.suppression} box={{x: 1120, y: 690, w: 470, h: 30}} size={22}>DOWNWARD SUPPRESSION ALLOCATION</Copy>
    <DrawLine points={[[1108, 700], [560, 645]]} startFrame={frame(cue.allocation)} durationFrames={12} strokeToken="color/line/hairline" strokeWidth={2} origin={false} nodes={false}/>
    <Copy at={cue.concessions} box={{x: 1120, y: 726, w: 470, h: 28}} size={20} tone="color/text/soft">STATUS + MATERIAL CONCESSIONS</Copy>
    <DrawRect box={{x: 540, y: 622, w: 16, h: 16}} startFrame={frame(cue.paid)} durationFrames={10} strokeToken="color/line/wire" fillToken="color/line/wire"/>
  </Scene>;
}
