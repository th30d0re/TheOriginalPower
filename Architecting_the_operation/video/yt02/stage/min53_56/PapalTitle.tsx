import React from 'react';
import {DrawLine, KitSound, QRCode, StageSceneFrame, color, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';
import {AtlanticMap, CineStill} from './PortugalVisuals';

export function PapalTitle({segment}:SceneProps){
  const ms=useStageMs();
  const cue={fiscal:useCue('t252Fiscal').at,fifth:useCue('t252Fifth').at,crown:useCue('t252Crown').at,title:useCue('t252Title').at,ideological:useCue('t252Ideological').at,why:useCue('t253Why').at,papal:useCue('t253Papal').at,june:useCue('t253June').at,dum:useCue('t253Dum').at,nicholas:useCue('t253Nicholas').at,granted:useCue('t254Granted').at,authority:useCue('t254Authority').at,perpetual:useCue('t254Perpetual').at,three:useCue('t255Three').at,romanus:useCue('t255Romanus').at,monopoly:useCue('t255Monopoly').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.fiscal} until={cue.papal} route="portugal" focus="iberia" labels={['Lisbon','Lagos']}/>
    <AtlanticMap at={cue.papal} until={cue.three} route="rome" focus="rome" labels={['Lisbon','Rome']}/>
    <AtlanticMap at={cue.three} until={cue.monopoly} route="coast" focus="coast" labels={['Lisbon','Bojador','CapeVerde']}/>
    <Panel box={{x:120,y:104,w:1680,h:88}} at={cue.fiscal} beat/><Copy at={cue.fiscal} box={{x:154,y:128,w:1060,h:38}} size={31}>PAPAL TITLE</Copy>
    <Panel box={{x:140,y:270,w:760,h:570}} at={cue.dum} red/><Tag at={cue.dum} x={174} y={300} text="DUM DIVERSAS" tag="1452" red/><Copy at={cue.june} box={{x:174,y:402,w:630,h:34}} size={26}>JUNE 18 · 1452</Copy><Copy at={cue.nicholas} box={{x:174,y:490,w:630,h:37}} size={30}>POPE NICHOLAS V</Copy><Copy at={cue.authority} box={{x:174,y:608,w:630,h:36}} size={27}>ECCLESIASTICAL AUTHORITY</Copy><Copy at={cue.perpetual} box={{x:174,y:690,w:630,h:32}} size={25} tone="color/marker/race">PERPETUAL SERVITUDE</Copy>
    <DrawLine points={[[930,552],[990,552]]} startFrame={frame(cue.three)} durationFrames={15} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <Panel box={{x:1020,y:270,w:760,h:570}} at={cue.romanus}/><Tag at={cue.romanus} x={1054} y={300} text="ROMANUS PONTIFEX" tag="1455"/><Copy at={cue.three} box={{x:1054,y:402,w:630,h:34}} size={26}>JANUARY 8 · 1455</Copy><Copy at={cue.romanus} box={{x:1054,y:490,w:630,h:37}} size={30}>EXCLUSIVE TITLE</Copy><Copy at={cue.monopoly} box={{x:1054,y:608,w:630,h:36}} size={27}>COMMERCIAL + IMPERIAL MONOPOLY</Copy>
    <CineStill name="238-nicholas-v-bulls" at={cue.nicholas} until={cue.granted} caption="ROME · 1452"/>
    {ms >= cue.dum && <div data-shared="SourceLine" style={{position:'absolute',right:116,top:928,display:'flex',alignItems:'center',gap:16,opacity:Math.max(0,Math.min(1,(ms-cue.dum)/267)),pointerEvents:'none'}}>
      <div style={{font:'400 20px "IBM Plex Mono"',lineHeight:1.35,letterSpacing:.35,color:color('color/text/muted'),textAlign:'right',whiteSpace:'nowrap'}}>
        Dum Diversas (1452) · Latin text
      </div>
      <QRCode url="https://sl.wikisource.org/wiki/Dum_diversas" size={112}/>
    </div>}
  </KitSound></StageSceneFrame>;
}
