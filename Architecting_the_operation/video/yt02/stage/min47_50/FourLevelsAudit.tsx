import React from 'react';
import {DrawLine, DrawRect, KitSound, StageSceneFrame, StickFigure, Trace, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Label, Panel, frame} from './shared';

export function FourLevelsAudit({segment}:SceneProps){
  const ms=useStageMs();
  const cue={level3:useCue('t218Level').at, decomposition:useCue('t218Decomposition').at, income:useCue('t218Income').at, extraction:useCue('t218Extraction').at, level4:useCue('t219Level').at, partition:useCue('t219Partition').at, lineage:useCue('t219Lineage').at, intact:useCue('t219Intact').at, holding:useCue('t220Holding').at, table:useCue('t220Table').at, historical:useCue('t220Historical').at, drives:useCue('t220Drives').at};
  const levels=[{y:260,n:'1',at:cue.holding},{y:405,n:'2',at:cue.holding},{y:550,n:'3',at:cue.level3},{y:695,n:'4',at:cue.level4}];
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:72}} at={cue.holding} beat/><Copy at={cue.table} box={{x:154,y:124,w:820,h:34}} size={30}>FOUR LEVELS · CAUSAL AUDIT</Copy>
    <Panel box={{x:120,y:230,w:360,h:620}} at={cue.level3}/>
    {levels.map(({y,n,at})=><React.Fragment key={n}><DrawRect box={{x:154,y,w:290,h:108}} startFrame={frame(at)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/><Copy at={at} box={{x:180,y:y+36,w:230,h:30}} size={26}>{n}</Copy></React.Fragment>)}
    <Panel box={{x:600,y:260,w:500,h:260}} at={cue.decomposition} red/><Label at={cue.decomposition} x={634} y={286} text="Eq. 2.3" tag="LEVEL 3" red/><Copy at={cue.income} box={{x:634,y:380,w:400,h:56}} size={28}>OUT-GROUP DECOMPOSITION</Copy><StickFigure x={1010} y={468} group="outgroup" emphasis={.9} scale={1} startFrame={frame(cue.extraction)} animate beat/>
    <Panel box={{x:600,y:590,w:500,h:260}} at={cue.partition}/><Label at={cue.partition} x={634} y={616} text="Eq. 2.4" tag="LEVEL 4"/><Copy at={cue.lineage} box={{x:634,y:708,w:400,h:56}} size={28}>LOCAL PARTITION · LINEAGE</Copy><DrawLine points={[[810,782],[970,782]]} startFrame={frame(cue.intact)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <Panel box={{x:1260,y:320,w:540,h:460}} at={cue.historical} red/><Copy at={cue.historical} box={{x:1300,y:376,w:460,h:34}} size={26} tone="color/marker/race">HISTORICAL TEST</Copy><Copy at={cue.drives} box={{x:1300,y:472,w:430,h:62}} size={32}>WHICH TIER DRIVES?</Copy><Trace points={[[1300,620],[1730,620]]} drawn={Math.max(0,Math.min(1,(ms-cue.drives)/650))} width={5} strokeToken="color/marker/race" glowToken="color/marker/race"/>
  </KitSound></StageSceneFrame>;
}
