import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {AtlanticMap, Copy, Panel, Tag, frame, WorldMap} from './shared';

export function TemplateArchive({segment}:SceneProps){
  const cue={two:useCue('t231Two').at,templates:useCue('t231Templates').at,mediterranean:useCue('t231Mediterranean').at,crown:useCue('t231Crown').at,chapter8:useCue('t232Chapter').at,women:useCue('t232Women').at,coverture:useCue('t232Coverture').at,witch:useCue('t232Witch').at,chapter3:useCue('t233Chapter').at,external:useCue('t233External').at,routes:useCue('t233Routes').at,captives:useCue('t233Captives').at,curse:useCue('t233Curse').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <WorldMap at={cue.mediterranean} label="MEDITERRANEAN ARCHIVE"/>
    <AtlanticMap at={cue.routes} drawAt={cue.routes} coastAt={cue.captives} label="COMMERCIAL ROUTES → ATLANTIC"/>
    <Panel box={{x:120,y:104,w:1680,h:92}} at={cue.two} beat/><Copy at={cue.templates} box={{x:154,y:127,w:980,h:38}} size={30}>TWO INSTITUTIONAL TEMPLATES</Copy><Copy at={cue.mediterranean} box={{x:1220,y:136,w:500,h:25}} size={20} tone="color/fill/gold">MEDITERRANEAN ARCHIVE</Copy>
    <Panel box={{x:120,y:270,w:710,h:510}} at={cue.chapter8} red/><Tag at={cue.chapter8} x={154} y={298} text="INTERNAL TEMPLATE" red/><StickFigure x={396} y={520} group="neutral" emphasis={1} scale={1.7} animate startFrame={frame(cue.women)} beat/><Copy at={cue.coverture} box={{x:166,y:672,w:600,h:36}} size={28}>FEUDAL COVERTURE</Copy><Copy at={cue.witch} box={{x:166,y:724,w:580,h:30}} size={22} tone="color/marker/race">HEALING AUTONOMY TARGETED</Copy>
    <Panel box={{x:1090,y:270,w:710,h:510}} at={cue.chapter3}/><Tag at={cue.external} x={1124} y={298} text="EXTERNAL TEMPLATE"/><DrawLine points={[[1160,510],[1720,510]]} startFrame={frame(cue.routes)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={7} end="arrow" beat/><StickFigure x={1210} y={590} group="outgroup" emphasis={1} scale={1.05} animate startFrame={frame(cue.captives)}/><Copy at={cue.routes} box={{x:1138,y:670,w:600,h:36}} size={28}>COMMERCIAL SLAVE ROUTES</Copy><Copy at={cue.curse} box={{x:1138,y:724,w:600,h:30}} size={22} tone="color/text/soft">RELIGIOUS RATIONALES ADAPTED</Copy>
    <DrawLine points={[[830,522],[1060,522]]} startFrame={frame(cue.crown)} durationFrames={16} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
  </KitSound></StageSceneFrame>;
}
