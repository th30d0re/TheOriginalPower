import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';
import {AtlanticMap} from './PortugalVisuals';

export function CommercialProtocol({segment}:SceneProps){
  const cue={between:useCue('t246Between').at,shifted:useCue('t246Shifted').at,raiding:useCue('t246Raiding').at,protocol:useCue('t246Protocol').at,horses:useCue('t246Horses').at,textiles:useCue('t246Textiles').at,intermediaries:useCue('t246Intermediaries').at,captives:useCue('t246Captives').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.between} until={cue.raiding} route="trade" focus="atlantic" labels={['Lisbon','Arguin','Senegal','CapeVerde']}/>
    <Panel box={{x:120,y:104,w:1680,h:88}} at={cue.between} beat/><Copy at={cue.shifted} box={{x:154,y:128,w:1080,h:38}} size={31}>THE COMMERCIAL PROTOCOL</Copy><Copy at={cue.between} box={{x:1330,y:136,w:390,h:25}} size={20} tone="color/fill/gold">1445–1446</Copy>
    <Panel box={{x:140,y:286,w:470,h:480}} at={cue.raiding} red/><Tag at={cue.raiding} x={174} y={316} text="BEFORE" tag="RAID" red/><StickFigure x={345} y={540} group="neutral" emphasis={.7} scale={1.55} startFrame={frame(cue.raiding)} animate beat/><Copy at={cue.raiding} box={{x:174,y:660,w:380,h:35}} size={27}>AMPHIBIOUS RAIDING</Copy>
    <DrawLine points={[[640,526],[840,526]]} startFrame={frame(cue.shifted)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6} end="arrow" beat/>
    <Panel box={{x:870,y:286,w:810,h:480}} at={cue.protocol}/><Tag at={cue.protocol} x={904} y={316} text="AFTER" tag="PROTOCOL"/><Copy at={cue.horses} box={{x:904,y:426,w:690,h:36}} size={30}>HORSES · TEXTILES · GOODS</Copy><DrawLine points={[[930,514],[1598,514]]} startFrame={frame(cue.intermediaries)} durationFrames={16} strokeToken="color/fill/gold" strokeWidth={4} end="arrow"/><Copy at={cue.intermediaries} box={{x:904,y:558,w:690,h:34}} size={27}>COASTAL INTERMEDIARIES</Copy><DrawLine points={[[1598,630],[930,630]]} startFrame={frame(cue.captives)} durationFrames={16} strokeToken="color/marker/race" strokeWidth={4} end="arrow"/><Copy at={cue.captives} box={{x:904,y:664,w:690,h:34}} size={25} tone="color/text/soft">CAPTIVES FROM INTERIOR CONFLICTS</Copy>
  </KitSound></StageSceneFrame>;
}
