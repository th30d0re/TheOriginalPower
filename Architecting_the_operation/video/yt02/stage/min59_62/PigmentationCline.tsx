import React from 'react';
import {DrawLine, DrawRect, FitBox, KitSound, StageSceneFrame, useCue, type SceneProps} from '@stage';
import {Copy, Panel, frame} from './shared';

// Turns 277–279: a continuous gradient, not bins, carries pigmentation across latitude.
export function PigmentationCline({segment}:SceneProps) {
  const c={biological:useCue('t277Biological').at, binary:useCue('t277Binary').at, huxley:useCue('t277Huxley').at, cline:useCue('t277Cline').at, polygenic:useCue('t277Polygenic').at, ultraviolet:useCue('t277Ultraviolet').at, jablonski:useCue('t278Jablonski').at, folate:useCue('t278Folate').at, vitamin:useCue('t278Vitamin').at, environments:useCue('t278Environments').at, genome:useCue('t279GenomeWide').at, regions:useCue('t279Regions').at, percent:useCue('t279Percent').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.biological} beat/>
    <Copy at={c.binary} box={{x:150,y:122,w:1100,h:36}} size={30}>NO NATURAL BINARY</Copy>
    <Panel box={{x:170,y:240,w:1580,h:490}} at={c.cline}/>
    <FitBox text="CLINE" x={230} y={205} size={32} weight={600} tag="JULIAN HUXLEY" startFrame={frame(c.huxley)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawLine points={[[310,510],[1610,510]]} startFrame={frame(c.cline)} durationFrames={24} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={10} end="arrow" beat/>
    {[0,1,2,3,4,5,6].map(i=><DrawRect key={i} box={{x:400+i*150,y:455-i*22,w:54,h:54}} startFrame={frame(c.polygenic+i*100)} durationFrames={10} strokeToken="color/line/hairline" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>) }
    <Copy at={c.polygenic} box={{x:530,y:265,w:860,h:36}} size={28} align="center">CONTINUOUS POLYGENIC GRADIENT</Copy>
    <Copy at={c.ultraviolet} box={{x:500,y:610,w:920,h:28}} size={21} align="center" mono tone="color/text/soft">PIGMENTATION · UV · LATITUDE</Copy>
    <DrawLine points={[[690,755],[690,830]]} startFrame={frame(c.folate)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={3} beat/>
    <DrawLine points={[[1230,755],[1230,830]]} startFrame={frame(c.vitamin)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={3}/>
    <Panel box={{x:410,y:835,w:560,h:96}} at={c.folate}/><Copy at={c.folate} box={{x:430,y:866,w:520,h:30}} size={22} align="center">FOLATE PROTECTION</Copy>
    <Panel box={{x:950,y:835,w:560,h:96}} at={c.vitamin}/><Copy at={c.vitamin} box={{x:970,y:866,w:520,h:30}} size={22} align="center">VITAMIN D SYNTHESIS</Copy>
    <Copy at={c.regions} box={{x:1350,y:760,w:320,h:26}} size={20} align="center" mono tone="color/text/soft">4 REGIONS</Copy>
    <Copy at={c.percent} box={{x:1350,y:792,w:320,h:24}} size={20} align="center" mono tone="color/text/dim">29 PERCENT</Copy>
  </KitSound></StageSceneFrame>;
}
