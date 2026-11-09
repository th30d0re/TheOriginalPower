import React from 'react';
import {DrawLine, DrawRect, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 317–318: the record opens with twenty and odd captives traded at
// Point Comfort, and the statute book beside it is empty — no slave codes,
// no white tier.
export function PointComfort({segment}: SceneProps) {
  const cue = {
    virginia: useCue('t317Virginia').at,
    august: useCue('t317August').at,
    point: useCue('t317Point').at,
    white: useCue('t317White').at,
    lion: useCue('t317Lion').at,
    traded: useCue('t317Traded').at,
    twenty: useCue('t317Twenty').at,
    angola: useCue('t317Angola').at,
    bautista: useCue('t317Bautista').at,
    why: useCue('t318Why').at,
    statutory: useCue('t318Statutory').at,
    zero: useCue('t318Zero').at,
    codes: useCue('t318Codes').at,
    zeroSecond: useCue('t318ZeroSecond').at,
    tier: useCue('t318Tier').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1100, h: 70}} at={cue.virginia}/>
    <Copy at={cue.august} box={{x: 150, y: 124, w: 1000, h: 40}} size={32}>POINT COMFORT · AUG 1619</Copy>
    <Panel box={{x: 120, y: 220, w: 1680, h: 300}} at={cue.august}/>
    <DrawRect box={{x: 170, y: 300, w: 400, h: 110}} startFrame={frame(cue.bautista)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <Copy at={cue.bautista} box={{x: 190, y: 322, w: 360, h: 30}} size={24} align="center">SAO JOAO BAUTISTA</Copy>
    <Copy at={cue.angola} box={{x: 190, y: 360, w: 360, h: 26}} size={20} tone="color/text/soft" align="center">FROM ANGOLA</Copy>
    <DrawLine points={[[570, 355], [730, 355]]} startFrame={frame(cue.traded)} durationFrames={14} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <DrawRect box={{x: 730, y: 300, w: 400, h: 110}} startFrame={frame(cue.white)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.lion} box={{x: 750, y: 322, w: 360, h: 30}} size={26} align="center">WHITE LION</Copy>
    <StickFigure x={850} y={385} group="outgroup" emphasis={1} scale={1.0} animate startFrame={frame(cue.twenty)} durationFrames={14}/>
    <StickFigure x={930} y={385} group="outgroup" emphasis={1} scale={1.0} animate startFrame={frame(cue.twenty + 120)} durationFrames={14}/>
    <Copy at={cue.twenty} box={{x: 750, y: 430, w: 360, h: 28}} size={22} align="center" tone="color/fill/gold">20 AND ODD CAPTIVES</Copy>
    <DrawLine points={[[1130, 355], [1290, 355]]} startFrame={frame(cue.traded + 200)} durationFrames={14} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow"/>
    <DrawRect box={{x: 1290, y: 300, w: 400, h: 110}} startFrame={frame(cue.point)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <Copy at={cue.point} box={{x: 1310, y: 322, w: 360, h: 30}} size={24} align="center">POINT COMFORT</Copy>
    <Panel box={{x: 120, y: 580, w: 1680, h: 360}} at={cue.why}/>
    <Copy at={cue.why} box={{x: 150, y: 606, w: 900, h: 36}} size={30}>WHY NO WHITE TIER?</Copy>
    <DrawRect box={{x: 220, y: 680, w: 640, h: 190}} startFrame={frame(cue.zero)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.zero} box={{x: 240, y: 700, w: 600, h: 72}} size={64} align="center" tone="color/fill/gold">0</Copy>
    <Copy at={cue.codes} box={{x: 240, y: 786, w: 600, h: 30}} size={24} align="center">SLAVE CODES</Copy>
    <DrawRect box={{x: 1060, y: 680, w: 640, h: 190}} startFrame={frame(cue.zeroSecond)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.zeroSecond} box={{x: 1080, y: 700, w: 600, h: 72}} size={64} align="center" tone="color/fill/gold">0</Copy>
    <Copy at={cue.tier} box={{x: 1080, y: 786, w: 600, h: 30}} size={24} align="center">WHITE TIER</Copy>
    <Copy at={cue.statutory} box={{x: 220, y: 890, w: 1480, h: 26}} size={20} mono tone="color/text/dim" align="center">STATUTE LAW</Copy>
  </Scene>;
}
