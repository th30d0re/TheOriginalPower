import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);
const Text = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="speed-velocity" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px \"IBM Plex Sans\"`, lineHeight: 1.16, color: color(tone)}}>{children}</div></Flicker>;
const Panel = ({box, at}: {box: {x: number; y: number; w: number; h: number}; at: number}) => <><BootIn box={box} startFrame={frame(at)} durationFrames={20} mode="scan" strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/><DrawRect box={box} startFrame={frame(at)} durationFrames={20} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/></>;

export function SpeedVsVelocity({segment}: SceneProps) {
  const cue = {physics: useCue('t65Physics').at, scalar: useCue('t65Scalar').at, size: useCue('t65Size').at, speed: useCue('t65Speed').at, speedometer: useCue('t65Speedometer').at, vector: useCue('t65Vector').at, both: useCue('t65Both').at, direction: useCue('t65Direction').at, velocity: useCue('t65Velocity').at, road: useCue('t65Road').at};
  const left = {x: 120, y: 210, w: 700, h: 650}, right = {x: 1100, y: 210, w: 700, h: 650};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Text at={cue.physics} box={{x: 120, y: 106, w: 1680, h: 48}} size={34}>PHYSICS &amp; LINEAR ALGEBRA</Text>
    <Panel box={left} at={cue.scalar}/><Panel box={right} at={cue.vector}/>
    <FitBox text="SCALAR" x={left.x + 38} y={left.y + 34} size={38} weight={600} tag="TERM" startFrame={frame(cue.scalar)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Text at={cue.size} box={{x: 162, y: 362, w: 330, h: 40}} size={28}>SIZE ALONE</Text>
    <DrawLine points={[[226, 680], [470, 500], [714, 680]]} startFrame={frame(cue.speed)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} beat/>
    <DrawLine points={[[470, 500], [470, 705]]} startFrame={frame(cue.speed)} durationFrames={16} strokeToken="color/line/wire" glowToken="color/fill/gold" strokeWidth={3}/>
    <Text at={cue.speedometer} box={{x: 264, y: 732, w: 420, h: 38}} size={26} tone="color/text/soft">SPEEDOMETER · SPEED</Text>
    <FitBox text="VECTOR" x={right.x + 38} y={right.y + 34} size={38} weight={600} tag="TERM" startFrame={frame(cue.vector)} durationFrames={18} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <Text at={cue.both} box={{x: 1142, y: 362, w: 420, h: 40}} size={28}>SIZE + DIRECTION</Text>
    <DrawLine points={[[1165, 670], [1360, 510], [1515, 610], [1730, 405]]} startFrame={frame(cue.road)} durationFrames={25} strokeToken="color/line/wire" glowToken="color/fill/gold" strokeWidth={12}/>
    <DrawLine points={[[1260, 645], [1675, 455]]} startFrame={frame(cue.velocity)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <Text at={cue.direction} box={{x: 1274, y: 732, w: 380, h: 38}} size={26} tone="color/text/soft">VELOCITY · SPECIFIC ROAD</Text>
  </KitSound></StageSceneFrame>;
}
