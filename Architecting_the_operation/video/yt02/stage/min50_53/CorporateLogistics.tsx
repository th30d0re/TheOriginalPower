import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';

export function CorporateLogistics({segment}:SceneProps){
  const cue={once:useCue('t238Once').at,return:useCue('t238Return').at,crown:useCue('t238Crown').at,chartered:useCue('t238Chartered').at,logistics:useCue('t238Logistics').at,fortyfour:useCue('t239Fourteen').at,henry:useCue('t239Henry').at,companhia:useCue('t239Companhia').at,syndicate:useCue('t239Syndicate').at,finance:useCue('t239Finance').at,fleet:useCue('t240Fleet').at,caravels:useCue('t240Caravels').at,arguin:useCue('t240Arguin').at,packed:useCue('t240Packed').at,captives:useCue('t241Captives').at,lagos:useCue('t241Lagos').at,divided:useCue('t242Divided').at,five:useCue('t242Five').at,parents:useCue('t242Parents').at,townspeople:useCue('t242Townspeople').at,quinto:useCue('t243Quinto').at,knighted:useCue('t243Knighted').at,profitability:useCue('t243Profitability').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:92}} at={cue.once} beat/><Copy at={cue.chartered} box={{x:154,y:127,w:980,h:38}} size={30}>RAIDING BECOMES CORPORATE LOGISTICS</Copy><Tag at={cue.crown} x={1400} y={122} text="CROWN" red/>
    <Panel box={{x:120,y:270,w:500,h:490}} at={cue.companhia}/><Copy at={cue.fortyfour} box={{x:154,y:326,w:270,h:42}} size={34}>1444</Copy><Copy at={cue.companhia} box={{x:154,y:410,w:400,h:44}} size={28}>COMPANHIA DE LAGOS</Copy><Copy at={cue.syndicate} box={{x:154,y:476,w:390,h:30}} size={22} tone="color/text/soft">JOINT-STOCK SYNDICATE</Copy>
    <Panel box={{x:710,y:270,w:500,h:490}} at={cue.fleet} red/><Copy at={cue.caravels} box={{x:744,y:365,w:410,h:38}} size={28}>SIX CARAVELS</Copy><DrawLine points={[[770,490],[1150,490]]} startFrame={frame(cue.arguin)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={7} end="arrow" beat/><Copy at={cue.packed} box={{x:744,y:570,w:400,h:32}} size={25} tone="color/marker/race">235 IN THE HOLDS</Copy>
    <Panel box={{x:1300,y:270,w:500,h:490}} at={cue.lagos}/><Copy at={cue.lagos} box={{x:1334,y:365,w:390,h:38}} size={29}>LAGOS</Copy><StickFigure x={1435} y={548} group="outgroup" emphasis={1} scale={1.15} animate startFrame={frame(cue.captives)} beat/><StickFigure x={1640} y={548} group="neutral" emphasis={.7} scale={1.15} animate startFrame={frame(cue.townspeople)}/>
    <DrawLine points={[[620,515],[710,515]]} startFrame={frame(cue.finance)} durationFrames={10} strokeToken="color/fill/gold" strokeWidth={4} end="arrow"/><DrawLine points={[[1210,515],[1300,515]]} startFrame={frame(cue.divided)} durationFrames={10} strokeToken="color/marker/race" strokeWidth={4} end="arrow"/>
    <Copy at={cue.five} box={{x:300,y:818,w:1320,h:34}} size={25} align="center" tone="color/marker/race">FIVE LOTS · ROYAL QUINTO · PROFITABILITY REWARDED</Copy>
    <Copy at={cue.quinto} box={{x:300,y:872,w:1320,h:30}} size={22} align="center" tone="color/fill/gold">FISCAL SOVEREIGN · ROYAL QUINTO</Copy>
    <Copy at={cue.knighted} box={{x:300,y:914,w:1320,h:26}} size={20} align="center" tone="color/text/soft">LANCAROTE KNIGHTED FOR PROFITABILITY</Copy>
  </KitSound></StageSceneFrame>;
}
