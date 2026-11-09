import React from 'react';
import {DefinitionCard, DrawLine, DrawRect, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

export function RomanMobility({segment}:SceneProps) {
  const ms=useStageMs();
  const c={first:useCue('t291First').at,roman:useCue('t291Roman').at,equation:useCue('t291Equation').at,slave:useCue('t291Slave').at,conquest:useCue('t291Conquest').at,debt:useCue('t291Debt').at,sentence:useCue('t291Sentence').at,birth:useCue('t291Birth').at,captives:useCue('t291Captives').at,keith:useCue('t292Keith').at,peculium:useCue('t292Peculium').at,manumission:useCue('t292Manumission').at,blend:useCue('t292Blend').at,citizenry:useCue('t292Citizenry').at,marker:useCue('t292Marker').at};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.first}/><Copy at={c.roman} box={{x:150,y:122,w:1100,h:38}} size={30}>ROMAN SLAVERY</Copy>
    <Panel box={{x:180,y:250,w:1560,h:190}} at={c.equation}/><FitBox text="EQUATION 3.9" x={220} y={220} size={25} weight={600} tag="ROME" startFrame={frame(c.equation)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <EquationTerms equation="Eq. 3.9 · Roman status" ms={ms} box={{x:300,y:305,w:1320,h:62}} fontSize={44} align="center" tokens={[{term:'O',math:'O_{slave}',revealAt:c.slave},{text:' = '},{text:'conquest',revealAt:c.conquest},{text:' + debt',revealAt:c.debt},{text:' + sentence',revealAt:c.sentence},{text:' + birth',revealAt:c.birth}]} pulses={{O:[c.slave]}}/>
    <Panel box={{x:180,y:580,w:570,h:340}} at={c.peculium}/>
    <div style={{position:'absolute',left:215,top:695,width:500,height:220}}><DefinitionCard term="PECULIUM" definition="A fund held by an enslaved person." source="BRADLEY" paraphrased progress={ms>=c.peculium?Math.min(1,(ms-c.peculium)/450):0} accent="color/fill/gold"/></div>
    <DrawLine points={[[780,720],[1080,720]]} startFrame={frame(c.manumission)} durationFrames={18} strokeToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <StickFigure x={860} y={720} group="outgroup" emphasis={1} scale={1.45} animate startFrame={frame(c.manumission)} durationFrames={16}/><StickFigure x={1190} y={720} group="neutral" emphasis={1} scale={1.45} animate startFrame={frame(c.blend)} durationFrames={16}/>
    <Copy at={c.manumission} box={{x:775,y:810,w:190,h:28}} size={20} align="center">MANUMISSION</Copy><Copy at={c.citizenry} box={{x:1080,y:810,w:245,h:28}} size={20} align="center">FREE CITIZENRY</Copy>
    <DrawRect box={{x:1415,y:665,w:260,h:106}} startFrame={frame(c.marker)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/><Copy at={c.marker} box={{x:1430,y:700,w:230,h:36}} size={23} align="center" tone="color/marker/race">ZERO PERMANENT MARKER</Copy>
  </Scene>;
}
