import React from 'react';
import {DrawLine, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

export function BilateralShuttle({segment}: SceneProps) {
  const c = {traffic: useCue('t307Traffic').at, Brazil: useCue('t307Brazil').at, Angola: useCue('t307Angola').at, ships: useCue('t307Ships').at, cachaça: useCue('t307Cachaca').at, east: useCue('t307East').at, captives: useCue('t307Captives').at, west: useCue('t307West').at, bilateral: useCue('t307Bilateral').at, European: useCue('t307European').at, triangle: useCue('t307Triangle').at, oversimplifies: useCue('t307Oversimplifies').at, share: useCue('t307Share').at, territories: useCue('t307Territories').at};
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 104, w: 1680, h: 76}} at={c.traffic}/>
    <Copy at={c.traffic} box={{x: 152, y: 124, w: 1020, h: 36}} size={30}>SOUTH ATLANTIC · BILATERAL SHUTTLE</Copy>
    <FitBox text="NO EUROPEAN LEG" x={1374} y={116} size={22} weight={600} tag="ROUTE" startFrame={frame(c.European)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <Panel box={{x: 150, y: 300, w: 490, h: 410}} at={c.Brazil}/><Panel box={{x: 1280, y: 300, w: 490, h: 410}} at={c.Angola}/>
    <Copy at={c.Brazil} box={{x: 185, y: 338, w: 420, h: 42}} size={34} align="center">BRAZIL</Copy><Copy at={c.Angola} box={{x: 1315, y: 338, w: 420, h: 42}} size={34} align="center">ANGOLA</Copy>
    <StickFigure x={385} y={510} group="neutral" emphasis={.8} scale={1.2} animate startFrame={frame(c.Brazil)} durationFrames={16} beat/><StickFigure x={1515} y={510} group="outgroup" emphasis={1} scale={1.2} animate startFrame={frame(c.Angola)} durationFrames={16} beat/>
    <DrawLine points={[[635, 470], [1275, 470]]} startFrame={frame(c.east)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={7} end="arrow" beat/>
    <Copy at={c.cachaça} box={{x: 700, y: 415, w: 510, h: 28}} size={21} align="center">CACHAÇA · TOBACCO · PROVISIONS</Copy>
    <Copy at={c.east} box={{x: 845, y: 510, w: 230, h: 27}} size={20} mono align="center" tone="color/fill/gold">EAST</Copy>
    <DrawLine points={[[1275, 580], [635, 580]]} startFrame={frame(c.west)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={7} end="arrow" beat/>
    <Copy at={c.captives} box={{x: 725, y: 625, w: 460, h: 28}} size={22} align="center" tone="color/marker/race">CAPTIVES TO PLANTATIONS</Copy>
    <Copy at={c.west} box={{x: 845, y: 545, w: 230, h: 27}} size={20} mono align="center" tone="color/marker/race">WEST</Copy>
    <Panel box={{x: 350, y: 805, w: 1220, h: 88}} at={c.bilateral}/>
    <Copy at={c.triangle} box={{x: 380, y: 830, w: 1160, h: 34}} size={27} align="center">SINGLE TRIANGLE OVERSIMPLIFIES</Copy>
  </Scene>;
}
