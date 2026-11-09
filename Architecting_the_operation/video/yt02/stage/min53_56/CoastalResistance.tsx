import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';
import {AtlanticMap, CineStill} from './PortugalVisuals';

export function CoastalResistance({segment}:SceneProps){
  const cue={raiders:useCue('t244Raiders').at,coastal:useCue('t244Coastal').at,surprise:useCue('t244Surprise').at,kidnapped:useCue('t244Kidnapped').at,wolof:useCue('t244Wolof').at,fought:useCue('t244Fought').at,fortySix:useCue('t245FourteenFortySix').at,canoes:useCue('t245Canoes').at,ambushed:useCue('t245Ambushed').at,arrows:useCue('t245Arrows').at,cost:useCue('t245Cost').at,commerce:useCue('t245Commerce').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.coastal} route="coast" focus="coast" labels={['RioDeOro','Bojador','Senegal']}/>
    <Panel box={{x:120,y:104,w:1680,h:88}} at={cue.raiders} beat/><Copy at={cue.raiders} box={{x:154,y:128,w:950,h:38}} size={31}>COASTAL RESISTANCE · 1444–1446</Copy><Copy at={cue.coastal} box={{x:1220,y:136,w:520,h:25}} size={20} tone="color/fill/gold">WEST AFRICAN COAST</Copy>
    <Panel box={{x:120,y:270,w:700,h:540}} at={cue.surprise} red/><Tag at={cue.surprise} x={154} y={300} text="DIRECT RAID" tag="01" red/><StickFigure x={278} y={570} group="neutral" emphasis={.65} scale={1.65} startFrame={frame(cue.kidnapped)} animate beat/><Copy at={cue.kidnapped} box={{x:154,y:694,w:590,h:34}} size={27}>COASTAL KIDNAPPING</Copy>
    <Panel box={{x:1100,y:270,w:700,h:540}} at={cue.wolof}/><Tag at={cue.wolof} x={1134} y={300} text="DEFENSE" tag="02"/><StickFigure x={1278} y={580} group="neutral" emphasis={1} scale={1.65} startFrame={frame(cue.fought)} animate beat/><StickFigure x={1564} y={580} group="neutral" emphasis={.8} scale={1.35} startFrame={frame(cue.canoes)} animate/><Copy at={cue.wolof} box={{x:1134,y:690,w:570,h:38}} size={27}>COASTAL FORCES FIGHT BACK</Copy>
    <DrawLine points={[[820,540],[1100,540]]} startFrame={frame(cue.ambushed)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
    <Panel box={{x:510,y:862,w:900,h:76}} at={cue.cost} red/><Copy at={cue.commerce} box={{x:540,y:884,w:840,h:30}} size={25} align="center">DIRECT KIDNAPPING BECOMES COSTLIER</Copy>
    <CineStill name="235-poisoned-arrows" at={cue.arrows} caption="SENEGAL COAST · 1446"/>
  </KitSound></StageSceneFrame>;
}
