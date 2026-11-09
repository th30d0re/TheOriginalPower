import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';
import {AtlanticMap} from './PortugalVisuals';

export function ArmsPressure({segment}:SceneProps){
  const cue={pause:useCue('t247Pause').at,claims:useCue('t247Claims').at,technology:useCue('t247Technology').at,iron:useCue('t248Iron').at,steel:useCue('t248Steel').at,gunpowder:useCue('t248Gunpowder').at,barrel:useCue('t248Barrel').at,advantage:useCue('t249Advantage').at,firearms:useCue('t249Firearms').at,armsRace:useCue('t249ArmsRace').at,rulers:useCue('t250Rulers').at,pressure:useCue('t250Pressure').at,cycle:useCue('t250Cycle').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.technology} route="trade" focus="coast" labels={['Arguin','Senegal','CapeVerde']}/>
    <Panel box={{x:120,y:104,w:1680,h:88}} at={cue.pause} beat/><Copy at={cue.pause} box={{x:154,y:128,w:1120,h:38}} size={31}>TECHNOLOGY IS NOT A SINGLE MEASURE</Copy>
    <Panel box={{x:120,y:268,w:580,h:430}} at={cue.iron}/><Tag at={cue.iron} x={154} y={298} text="METALLURGY" tag="01"/><Copy at={cue.steel} box={{x:154,y:418,w:500,h:40}} size={31}>IRON + STEEL</Copy><Copy at={cue.technology} box={{x:154,y:508,w:500,h:35}} size={25} tone="color/text/soft">ADVANCED KNOWLEDGE</Copy>
    <Panel box={{x:760,y:268,w:580,h:430}} at={cue.gunpowder} red/><Tag at={cue.gunpowder} x={794} y={298} text="SPECIALIZATION" tag="02" red/><Copy at={cue.gunpowder} box={{x:794,y:418,w:500,h:40}} size={29}>GUNPOWDER</Copy><Copy at={cue.barrel} box={{x:794,y:508,w:500,h:35}} size={25}>PRECISION BARREL BORING</Copy>
    <Panel box={{x:1400,y:268,w:400,h:430}} at={cue.advantage}/><Tag at={cue.advantage} x={1434} y={298} text="TRADE" tag="03"/><Copy at={cue.firearms} box={{x:1434,y:430,w:300,h:72}} size={30}>IMPORTED<br/>FIREARMS</Copy>
    <DrawLine points={[[580,802],[1340,802],[1340,744],[1620,744]]} startFrame={frame(cue.armsRace)} durationFrames={22} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
    <StickFigure x={520} y={886} group="neutral" emphasis={.75} scale={.9} startFrame={frame(cue.rulers)} animate/><StickFigure x={1040} y={886} group="neutral" emphasis={.75} scale={.9} startFrame={frame(cue.pressure)} animate/><Copy at={cue.cycle} box={{x:590,y:864,w:760,h:32}} size={26} align="center" tone="color/marker/race">GUN-FOR-CAPTIVES CYCLE · REGIONAL ARMS RACE</Copy>
  </KitSound></StageSceneFrame>;
}
