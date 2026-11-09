import React from 'react';
import {DrawLine, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, frame} from './SceneUtils';

export function DefinitionCheckpoint({segment}:SceneProps){
  const c={pause:useCue('t78Pause').at, stock:useCue('t78Stock').at, standard:useCue('t79Standard').at, dictionary:useCue('t79Dictionary').at, bias:useCue('t79Bias').at, prejudice:useCue('t79Prejudice').at, discrimination:useCue('t79Discrimination').at, literature:useCue('t79Literature').at, departs:useCue('t79Departs').at, classifying:useCue('t79Classifying').at, reversing:useCue('t79Reversing').at, sociologist:useCue('t80Sociologist').at, psychologist:useCue('t80Psychologist').at, engineer:useCue('t80Engineer').at, departure:useCue('t80Departure').at};
  const left={x:120,y:200,w:760,h:600},right={x:1040,y:200,w:760,h:600};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.pause} box={{x:120,y:105,w:1680,h:46}} size={36} align="center">PAUSE · TAKE STOCK</Copy>
    <Panel box={left} at={c.standard} seed={781}/><Panel box={right} at={c.departs} accent="color/marker/race" seed={782}/>
    <FitBox text="ESTABLISHED TOOLS" x={160} y={236} size={29} weight={600} tag="SEGMENT 1" startFrame={frame(c.standard)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    {[['DICTIONARY SENSES',c.dictionary],['BIAS',c.bias],['PREJUDICE',c.prejudice],['DISCRIMINATION',c.discrimination]].map(([label,at],i)=><React.Fragment key={String(label)}><Panel box={{x:182,y:335+i*74,w:634,h:52}} at={Number(at)} seed={790+i}/><Copy at={Number(at)} box={{x:208,y:349+i*74,w:580,h:24}} size={21} mono>{label}</Copy></React.Fragment>)}
    <Copy at={c.literature} box={{x:182,y:670,w:630,h:32}} size={20} tone="color/text/soft" align="center">GREENWALD AND BANAJI · ALLPORT · FISKE</Copy>
    <FitBox text="TWO CONNECTED POINTS" x={1080} y={236} size={25} weight={600} tag="DEPARTURE" startFrame={frame(c.departs)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <Panel box={{x:1090,y:345,w:660,h:88}} at={c.classifying} accent="color/marker/race" seed={797}/><Copy at={c.classifying} box={{x:1120,y:368,w:600,h:40}} size={25} align="center">RACISM · INSTITUTIONAL SYSTEM</Copy>
    <DrawLine points={[[1420,460],[1420,500]]} startFrame={frame(c.reversing)} durationFrames={14} strokeToken="color/marker/race" strokeWidth={4} end="arrow" beat/>
    <Panel box={{x:1090,y:525,w:660,h:88}} at={c.reversing} accent="color/marker/race" seed={798}/><Copy at={c.reversing} box={{x:1120,y:548,w:600,h:40}} size={25} align="center">PRIMARY CAUSAL ARROW · REVERSED</Copy>
    <Copy at={c.departure} box={{x:1090,y:670,w:660,h:32}} size={20} tone="color/text/soft" align="center">NEW CLAIM DERIVABLE FROM EXISTING LITERATURE</Copy>
    {[['SOCIOLOGIST',c.sociologist,380],['EXPERIMENTAL PSYCHOLOGIST',c.psychologist,960],['SYSTEMS ENGINEER',c.engineer,1540]].map(([label,at,x],i)=><React.Fragment key={String(label)}><StickFigure x={Number(x)} y={860} group="neutral" emphasis={.95} scale={.9} animate startFrame={frame(Number(at))} durationFrames={16} beat/><Copy at={Number(at)} box={{x:Number(x)-190,y:920,w:380,h:26}} size={18} mono align="center">{label}</Copy></React.Fragment>)}
  </KitSound></StageSceneFrame>;
}
