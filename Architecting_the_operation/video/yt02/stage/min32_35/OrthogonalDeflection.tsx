import React from 'react';
import {DrawLine, DrawRect, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 156–157: vertical class momentum aimed at the Elite apex bends sideways across the flat
// identity plane, and the Buffer Class sits at the bend as a Kinetic Decoy absorbing the pressure.
export function OrthogonalDeflection({segment}: SceneProps) {
  const cue = {
    orthogonal: useCue('t156Orthogonal').at,
    vertical: useCue('t156Vertical').at,
    momentum: useCue('t156Momentum').at,
    upward: useCue('t156Upward').at,
    elite: useCue('t156Elite').at,
    loses: useCue('t156Loses').at,
    sideways: useCue('t156Sideways').at,
    identity: useCue('t156Identity').at,
    workingClass: useCue('t156WorkingClass').at,
    collide: useCue('t156Collide').at,
    buffer: useCue('t157Buffer').at,
    kinetic: useCue('t157Kinetic').at,
    absorbing: useCue('t157Absorbing').at,
    pressure: useCue('t157Pressure').at,
    outgroup: useCue('t157Outgroup').at,
    upwardGhost: useCue('t157Upward').at,
    apex: useCue('t157Apex').at,
  };
  return <Scene segment={segment}>
    <FitBox text="ORTHOGONAL DEFLECTION" x={120} y={110} size={40} weight={600} tag="NAMED MOTION" startFrame={frame(cue.orthogonal)} durationFrames={20} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Panel box={{x: 200, y: 200, w: 1520, h: 780}} at={cue.vertical}/>
    <DrawLine points={[[300, 620], [1620, 620]]} startFrame={frame(cue.vertical)} durationFrames={18} strokeToken="color/line/hairline-strong" strokeWidth={4}/>
    <DrawLine points={[[700, 880], [700, 596]]} startFrame={frame(cue.upward)} durationFrames={25} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={8} end="arrow" beat/>
    <Copy at={cue.momentum} box={{x: 420, y: 850, w: 260, h: 32}} size={22}>CLASS MOMENTUM</Copy>
    <DrawRect box={{x: 660, y: 250, w: 80, h: 60}} startFrame={frame(cue.elite)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.elite} box={{x: 770, y: 262, w: 220, h: 34}} size={24} tone="color/fill/gold">ELITE APEX</Copy>
    <DrawRect box={{x: 688, y: 584, w: 24, h: 24}} startFrame={frame(cue.loses)} durationFrames={12} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <DrawLine points={[[700, 596], [1210, 596]]} startFrame={frame(cue.sideways)} durationFrames={28} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={8} end="arrow" beat/>
    <Copy at={cue.identity} box={{x: 1200, y: 640, w: 420, h: 30}} size={22} tone="color/text/soft">FLAT IDENTITY PLANE</Copy>
    <StickFigure x={1250} y={576} group="ingroup" emphasis={1} scale={1.5} animate startFrame={frame(cue.workingClass)} durationFrames={20}/>
    <StickFigure x={1380} y={576} group="outgroup" emphasis={1} scale={1.5} animate startFrame={frame(cue.workingClass + 150)} durationFrames={20}/>
    {([[[1295, 545], [1275, 525]], [[1325, 545], [1345, 525]], [[1295, 575], [1275, 595]], [[1325, 575], [1345, 595]]] as const).map((pts, i) => <DrawLine key={i} points={pts} startFrame={frame(cue.collide + i * 60)} durationFrames={10} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={3} beat={i === 0}/>)}
    <DrawRect box={{x: 820, y: 546, w: 260, h: 100}} startFrame={frame(cue.buffer)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/surface/2" glowToken="color/fill/gold" beat/>
    <Copy at={cue.buffer} box={{x: 838, y: 556, w: 224, h: 28}} size={20}>BUFFER CLASS</Copy>
    <FitBox text="KINETIC DECOY" x={800} y={470} size={30} weight={600} tag="TERM" startFrame={frame(cue.kinetic)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawLine points={[[950, 880], [950, 646]]} startFrame={frame(cue.absorbing)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow"/>
    <DrawLine points={[[1010, 850], [1010, 646]]} startFrame={frame(cue.pressure)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
    <Copy at={cue.pressure} box={{x: 1060, y: 790, w: 300, h: 28}} size={20} tone="color/marker/race">ANGER + PRESSURE</Copy>
    <StickFigure x={980} y={920} group="outgroup" emphasis={1} scale={1.5} animate startFrame={frame(cue.outgroup)} durationFrames={18}/>
    <Copy at={cue.outgroup} box={{x: 1090, y: 912, w: 180, h: 28}} size={20} tone="color/text/soft">OUT-GROUP</Copy>
    <div style={{position: 'absolute', inset: 0, opacity: .35}}>
      <DrawLine points={[[700, 560], [700, 320]]} startFrame={frame(cue.upwardGhost)} durationFrames={20} strokeToken="color/line/hatch" strokeWidth={3}/>
    </div>
    <DrawRect box={{x: 652, y: 242, w: 96, h: 76}} startFrame={frame(cue.apex)} durationFrames={14} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={2} beat/>
  </Scene>;
}
