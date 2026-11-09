import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, Trace, useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, CineStill, Copy, Panel} from './shared';

export function PortugalAuthorship({segment}:SceneProps){
  const ms=useStageMs();
  const cue={portugal:useCue('t221Portugal').at, institutions:useCue('t221Institutions').at, selected:useCue('t221Selected').at, captains:useCue('t222Captains').at, crown:useCue('t222Crown').at, papacy:useCue('t222Papacy').at, chronicler:useCue('t222Chronicler').at, casa:useCue('t222Casa').at, profitable:useCue('t223Profitable').at, zurara:useCue('t223Zurara').at, cover:useCue('t223Cover').at, dubois:useCue('t224Bois').at, propaganda:useCue('t224Propaganda').at, downward:useCue('t224Downward').at};
  const authors=[['CAPTAINS',cue.captains],['CROWN',cue.crown],['PAPACY',cue.papacy],['CHRONICLER',cue.chronicler],['CASA',cue.casa]] as const;
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.institutions} drawAt={cue.selected} coastAt={cue.casa} label="ATLANTIC SYSTEM"/>
    <Panel box={{x:120,y:104,w:1680,h:72}} at={cue.portugal} beat/><Copy at={cue.portugal} box={{x:154,y:124,w:760,h:34}} size={30}>PORTUGAL · INSTITUTIONAL AUTHORS</Copy>
    <Panel box={{x:120,y:252,w:1120,h:520}} at={cue.institutions}/>
    {authors.map(([name,at],i)=>{const x=158+i*212;return <React.Fragment key={name}><Copy at={at} box={{x,y:410,w:170,h:28}} size={21} tone="color/fill/gold">{name}</Copy>{i<4&&<DrawLine points={[[x+168,438],[x+198,438]]} startFrame={Math.round(at*30/1000)} durationFrames={12} strokeToken="color/fill/gold" strokeWidth={3} end="arrow"/>}</React.Fragment>;})}
    <Copy at={cue.casa} box={{x:420,y:570,w:520,h:38}} size={28}>ATLANTIC SYSTEM</Copy><Trace points={[[215,646],[1100,646]]} drawn={Math.max(0,Math.min(1,(ms-cue.selected)/700))} width={5} strokeToken="color/marker/race" glowToken="color/marker/race"/>
    <CineStill at={cue.zurara} name="242-zurara-chronicler" caption="ZURARA · COMMISSIONED CHRONICLE" until={cue.dubois}/>
    <CineStill at={cue.casa} name="248-casa-dos-escravos" caption="LISBON · CASA DOS ESCRAVOS" until={cue.zurara}/>
    <Panel box={{x:1320,y:252,w:480,h:520}} at={cue.zurara} red/><Copy at={cue.profitable} box={{x:1356,y:300,w:400,h:32}} size={24}>PROFITABLE TRADE</Copy><Copy at={cue.zurara} box={{x:1356,y:406,w:390,h:60}} size={30} tone="color/marker/race">MORAL COVER</Copy>
    <Panel box={{x:330,y:850,w:1260,h:72}} at={cue.dubois}/><Copy at={cue.propaganda} box={{x:364,y:870,w:800,h:30}} size={25}>PROPAGANDA OF HISTORY</Copy><Copy at={cue.downward} box={{x:1160,y:872,w:390,h:27}} size={20} tone="color/marker/race">RESPONSIBILITY DOWNWARD</Copy>
  </KitSound></StageSceneFrame>;
}
