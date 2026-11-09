import React from 'react';
import {DrawLine, FitBox, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

export function ChecklistComplete({segment}:SceneProps) {
  const c={all:useCue('t196All').at,five:useCue('t196Five').at,satisfied:useCue('t196Satisfied').at,mathematical:useCue('t196Mathematical').at,institutional:useCue('t196Institutional').at};
  const labels=['BOUNDARY','COMPONENTS','DYNAMICS','VARIABLES','PREDICTIONS'];
  return <Scene segment={segment}><Panel box={{x:120,y:105,w:1680,h:100}} at={c.all}/><Copy at={c.all} box={{x:156,y:132,w:1120,h:40}} size={32}>ENGINEERING SYSTEMS CHECKLIST</Copy><FitBox text="SATISFIED" x={1460} y={124} size={24} weight={600} tag="STATUS" startFrame={frame(c.satisfied)} durationFrames={15} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    {labels.map((label,i)=>{const x=150+i*340;return <React.Fragment key={label}><Panel box={{x,y:360,w:260,h:220}} at={c.five+i*90}/><Copy at={c.five+i*90} box={{x:x+25,y:408,w:210,h:34}} size={21} tone="color/text/soft" align="center">{label}</Copy><Copy at={c.satisfied+i*90} box={{x:x+50,y:475,w:160,h:48}} size={40} tone="color/fill/gold" align="center">✓</Copy>{i<4&&<DrawLine points={[[x+260,470],[x+330,470]]} startFrame={frame(c.five+i*90)} durationFrames={10} strokeToken="color/fill/gold" strokeWidth={3} end="arrow"/>}</React.Fragment>;})}
    <Copy at={c.mathematical} box={{x:310,y:720,w:610,h:42}} size={28} align="center">MATHEMATICAL VARIABLES</Copy><Copy at={c.institutional} box={{x:1000,y:720,w:610,h:42}} size={28} align="center">INSTITUTIONAL VARIABLES</Copy>
  </Scene>;
}
