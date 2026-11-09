import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';
import {AtlanticMap} from './PortugalVisuals';

export function SovereignPeoples({segment}:SceneProps){
  const cue={phrase:useCue('t251Phrase').at,modern:useCue('t251Modern').at,sovereign:useCue('t251Sovereign').at,peoples:useCue('t251Peoples').at,demand:useCue('t251Demand').at,capital:useCue('t251Capital').at,armsRace:useCue('t251ArmsRace').at,conflicts:useCue('t251Conflicts').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.phrase} route="atlantic" focus="atlantic" labels={['Lisbon','Senegal','CapeVerde','Elmina']}/>
    <Panel box={{x:120,y:104,w:1680,h:94}} at={cue.phrase} red beat/><Copy at={cue.phrase} box={{x:154,y:128,w:1280,h:38}} size={30}>SOVEREIGN PEOPLES · SEPARATE POLITIES</Copy>
    <Panel box={{x:160,y:304,w:500,h:420}} at={cue.sovereign}/><Tag at={cue.sovereign} x={194} y={334} text="PEOPLE" tag="01"/><StickFigure x={410} y={536} group="neutral" emphasis={1} scale={1.55} startFrame={frame(cue.peoples)} animate beat/><Copy at={cue.peoples} box={{x:194,y:650,w:400,h:32}} size={27} align="center">SOVEREIGN PEOPLES</Copy>
    <Panel box={{x:1260,y:304,w:500,h:420}} at={cue.demand} red/><Tag at={cue.demand} x={1294} y={334} text="PRESSURE" tag="02" red/><Copy at={cue.demand} box={{x:1294,y:472,w:400,h:36}} size={30} align="center">EUROPEAN DEMAND</Copy><Copy at={cue.capital} box={{x:1294,y:564,w:400,h:32}} size={25} align="center">MERCHANT CAPITAL</Copy>
    <DrawLine points={[[660,514],[1260,514]]} startFrame={frame(cue.conflicts)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <Panel box={{x:520,y:824,w:880,h:82}} at={cue.armsRace}/><Copy at={cue.armsRace} box={{x:550,y:848,w:820,h:31}} size={25} align="center">ARMS RACE RESHAPES CONFLICTS</Copy>
  </KitSound></StageSceneFrame>;
}
