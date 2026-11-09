import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {AtlanticMap, CineStill, Copy, Panel, Tag, frame} from './shared';

export function RaidToChronicle({segment}:SceneProps){
  const cue={why:useCue('t235Why').at,prediction:useCue('t235Prediction').at,night:useCue('t235Night').at,fortyone:useCue('t235Fourteen').at,antao:useCue('t235Antao').at,goncalves:useCue('t235Goncalves').at,rio:useCue('t235Rio').at,orders:useCue('t235Orders').at,seeking:useCue('t236Seeking').at,return:useCue('t236Return').at,exceeded:useCue('t236Exceeded').at,raiding:useCue('t236Raiding').at,seized:useCue('t236Seized').at,captives:useCue('t236Captives').at,lisbon:useCue('t236Lisbon').at,notice:useCue('t237Notice').at,twelve:useCue('t237Twelve').at,chronicle:useCue('t237Chronicle').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <CineStill at={cue.antao} name="225-antao-1441-raid" caption="RIO D'OURO · 1441" until={cue.return}/>
    <AtlanticMap at={cue.return} drawAt={cue.lisbon} coastAt={cue.lisbon} label="RIO D'OURO → LISBON"/>
    <Panel box={{x:120,y:104,w:1680,h:92}} at={cue.why} beat/><Copy at={cue.prediction} box={{x:154,y:127,w:920,h:38}} size={30}>PREDICTION ONE · 1441</Copy><Tag at={cue.night} x={1398} y={122} text="NIGHT RAID" red/>
    <Panel box={{x:150,y:274,w:610,h:480}} at={cue.antao} red/><Copy at={cue.fortyone} box={{x:190,y:336,w:320,h:48}} size={40}>1441</Copy><Copy at={cue.goncalves} box={{x:190,y:414,w:500,h:34}} size={27}>ANTAO GONCALVES</Copy><Copy at={cue.rio} box={{x:190,y:474,w:500,h:30}} size={23} tone="color/text/soft">RIO D'OURO COAST</Copy><StickFigure x={470} y={610} group="neutral" emphasis={1} scale={1.35} animate startFrame={frame(cue.raiding)} beat/>
    <Panel box={{x:1160,y:274,w:610,h:480}} at={cue.chronicle}/><Copy at={cue.chronicle} box={{x:1200,y:336,w:480,h:46}} size={34}>RACIAL CHRONICLE</Copy><Copy at={cue.twelve} box={{x:1200,y:416,w:460,h:34}} size={28} tone="color/fill/gold">TWELVE YEARS LATER</Copy>
    <DrawLine points={[[790,514],[1125,514]]} startFrame={frame(cue.notice)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <Copy at={cue.seeking} box={{x:180,y:816,w:1500,h:32}} size={24} align="center" tone="color/text/soft">PROMOTION · COMMERCIAL RETURN · CAPTIVES CARRIED TO LISBON</Copy>
  </KitSound></StageSceneFrame>;
}
