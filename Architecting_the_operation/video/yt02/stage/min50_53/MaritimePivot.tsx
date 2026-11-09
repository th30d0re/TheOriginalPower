import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';

export function MaritimePivot({segment}:SceneProps){
  const cue={now:useCue('t234Now').at,track:useCue('t234Track').at,chronological:useCue('t234Chronological').at,portuguese:useCue('t234Portuguese').at,maritime:useCue('t234Maritime').at,pivot:useCue('t234Pivot').at,west:useCue('t234West').at,coast:useCue('t234Coast').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:92}} at={cue.now} beat/><Copy at={cue.track} box={{x:154,y:127,w:1100,h:38}} size={30}>PORTUGUESE MARITIME PIVOT</Copy><Tag at={cue.chronological} x={1430} y={122} text="CHRONOLOGY"/>
    <Panel box={{x:220,y:300,w:1480,h:440}} at={cue.maritime}/><Copy at={cue.portuguese} box={{x:290,y:355,w:520,h:38}} size={30}>PORTUGAL</Copy><Copy at={cue.west} box={{x:1240,y:630,w:390,h:34}} size={26}>WEST AFRICAN COAST</Copy>
    <DrawLine points={[[480,575],[850,575],[1140,455],[1490,455]]} startFrame={frame(cue.pivot)} durationFrames={28} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={8} end="arrow" beat/>
    <Copy at={cue.coast} box={{x:554,y:810,w:810,h:34}} size={26} align="center" tone="color/text/soft">TRACK THE SEQUENCE</Copy>
  </KitSound></StageSceneFrame>;
}
