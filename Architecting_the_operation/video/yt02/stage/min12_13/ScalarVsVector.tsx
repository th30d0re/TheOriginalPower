import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);
const Label = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="scalar-vector" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px \"IBM Plex Sans\"`, lineHeight: 1.2, color: color(tone)}}>{children}</div></Flicker>;
const Field = ({box, at}: {box: {x: number; y: number; w: number; h: number}; at: number}) => <><BootIn box={box} startFrame={frame(at)} durationFrames={20} mode="scan" strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/><DrawRect box={box} startFrame={frame(at)} durationFrames={20} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/></>;

export function ScalarVsVector({segment}: SceneProps) {
  const cue = {why: useCue('t64Why').at, racism: useCue('t64Racism').at, personal: useCue('t64Personal').at, hostility: useCue('t64Hostility').at, separates: useCue('t64Separates').at, scalar: useCue('t64Scalar').at, interpersonal: useCue('t64Interpersonal').at, harm: useCue('t64Harm').at, vector: useCue('t64Vector').at, institutional: useCue('t64Institutional').at, force: useCue('t64Force').at};
  const left = {x: 120, y: 230, w: 720, h: 610}, right = {x: 1080, y: 230, w: 720, h: 610};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Flicker startFrame={frame(cue.why)} durationFrames={16} beat><div data-text="scalar-vector-question" data-box="120 110 1680 58" style={{position: 'absolute', left: 120, top: 110, width: 1680, height: 58, font: '500 38px "IBM Plex Sans"', color: color('color/text/primary')}}>WHAT DOES “RACISM” NAME?</div></Flicker>
    <Field box={left} at={cue.scalar}/><Field box={right} at={cue.vector}/>
    <FitBox text="SCALAR" x={left.x + 42} y={left.y + 42} size={40} weight={600} tag="TERM" startFrame={frame(cue.scalar)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <FitBox text="VECTOR" x={right.x + 42} y={right.y + 42} size={40} weight={600} tag="TERM" startFrame={frame(cue.vector)} durationFrames={18} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <StickFigure x={430} y={485} group="neutral" emphasis={1} scale={2.1} animate startFrame={frame(cue.personal)} durationFrames={22} beat/>
    <Label at={cue.personal} box={{x: 220, y: 675, w: 420, h: 42}} size={30}>PERSONAL HOSTILITY</Label>
    <Label at={cue.interpersonal} box={{x: 220, y: 730, w: 420, h: 34}} size={24} tone="color/text/soft">INTERPERSONAL HARM</Label>
    <DrawLine points={[[1250, 520], [1615, 520]]} startFrame={frame(cue.institutional)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={12} end="arrow" beat/>
    <StickFigure x={1225} y={520} group="outgroup" emphasis={1} scale={1.25} pose="raise" animate startFrame={frame(cue.institutional)} durationFrames={18}/>
    <Label at={cue.institutional} box={{x: 1180, y: 675, w: 520, h: 42}} size={30}>INSTITUTIONAL FORCE</Label>
    <Label at={cue.force} box={{x: 1180, y: 730, w: 520, h: 34}} size={24} tone="color/text/soft">DIRECTIONAL CAPACITY</Label>
    <DrawLine points={[[840, 535], [1080, 535]]} startFrame={frame(cue.separates)} durationFrames={14} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={3} end="arrow" beat/>
    <Label at={cue.harm} box={{x: 805, y: 860, w: 310, h: 32}} size={22} tone="color/fill/gold">SEPARATE TERMS</Label>
  </KitSound></StageSceneFrame>;
}
