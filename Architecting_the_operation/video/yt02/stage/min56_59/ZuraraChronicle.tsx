import React from 'react';
import {DefinitionCard, DrawLine, DrawRect, FitBox, QRCode, StickFigure, color, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';
import {AtlanticMap, CineStill} from '../min53_56/PortugalVisuals';

export function ZuraraChronicle({segment}:SceneProps) {
  const ms=useStageMs();
  const c={right:useCue('t256Right').at,ideological:useCue('t256Ideological').at,compiled:useCue('t256Compiled').at,king:useCue('t257King').at,commissioned:useCue('t257Commissioned').at,zurara:useCue('t257Zurara').at,chronicle:useCue('t257Chronicle').at,kendi:useCue('t258Kendi').at,first:useCue('t258First').at,category:useCue('t258Category').at};
  const left={x:120,y:210,w:580,h:620}, right={x:850,y:210,w:830,h:620};
  return <Scene segment={segment}>
    <AtlanticMap at={c.compiled} until={c.zurara} route="atlantic" focus="atlantic" labels={['Lisbon','CapeVerde','Elmina']}/>
    <Panel box={{x:120,y:104,w:1560,h:72}} at={c.right}/><Copy at={c.ideological} box={{x:150,y:122,w:1120,h:38}} size={30}>1453 · RACIAL TEXT</Copy>
    <Panel box={left} at={c.king}/><FitBox text="COMMISSION" x={left.x+32} y={left.y+28} size={34} weight={600} tag="1453" startFrame={frame(c.king)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <StickFigure x={280} y={490} group="ingroup" emphasis={1} scale={1.6} animate startFrame={frame(c.king)} durationFrames={18} beat/><StickFigure x={520} y={490} group="neutral" emphasis={1} scale={1.6} animate startFrame={frame(c.commissioned)} durationFrames={18} beat/>
    <DrawLine points={[[350,490],[452,490]]} startFrame={frame(c.commissioned)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <Copy at={c.king} box={{x:170,y:650,w:220,h:34}} size={23} align="center">CROWN</Copy><Copy at={c.zurara} box={{x:420,y:650,w:220,h:34}} size={23} align="center">ZURARA</Copy>
    <DrawRect box={right} startFrame={frame(c.chronicle)} durationFrames={20} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <div style={{position:'absolute',left:right.x,top:right.y,width:right.w,height:right.h}}><DefinitionCard term="CHRONICLE" definition="A royal racial category." source="KENDI" paraphrased progress={ms>=c.kendi?Math.min(1,(ms-c.kendi)/500):0} accent="color/marker/race"/></div>
    <Copy at={c.first} box={{x:930,y:670,w:660,h:36}} size={25} align="center" tone="color/marker/race">FIRST RACIAL CATEGORY</Copy>
    <Copy at={c.category} box={{x:930,y:720,w:660,h:28}} size={20} align="center" mono tone="color/text/soft">PEOPLES → ONE CATEGORY</Copy>
    <CineStill name="242-zurara-chronicler" at={c.zurara} until={c.chronicle} caption="PORTUGAL · 1453"/>
    {ms >= c.chronicle && <div data-shared="SourceLine" style={{position:'absolute',right:116,top:928,display:'flex',alignItems:'center',gap:16,opacity:Math.max(0,Math.min(1,(ms-c.chronicle)/267)),pointerEvents:'none'}}>
      <div style={{font:'400 20px "IBM Plex Mono"',lineHeight:1.35,letterSpacing:.35,color:color('color/text/muted'),textAlign:'right',whiteSpace:'nowrap'}}>
        Zurara · Chronicle of Guinea (Hakluyt 1896)
      </div>
      <QRCode url="https://archive.org/details/chronicleofdisco01zura" size={112}/>
    </div>}
  </Scene>;
}
