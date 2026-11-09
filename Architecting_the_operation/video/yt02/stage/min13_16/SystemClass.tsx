import React from 'react';
import {DefinitionCard, DrawLine, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, entered, frame} from './SceneUtils';

export function SystemClass({segment}:SceneProps){
  const ms=useStageMs();
  const c={structure:useCue('t74Structure').at, ism:useCue('t74Ism').at, capitalism:useCue('t74Capitalism').at, feudalism:useCue('t74Feudalism').at, colonialism:useCue('t74Colonialism').at, institutional:useCue('t74Institutional').at, racism:useCue('t75Racism').at, private:useCue('t75Private').at, allport:useCue('t75Allport').at, precision:useCue('t75Precision').at, brain:useCue('t76Brain').at, wiring:useCue('t76Wiring').at, software:useCue('t76Software').at, captured:useCue('t76Captured').at, extraction:useCue('t76Extraction').at, reserves:useCue('t77Reserves').at, separate:useCue('t77Separate').at, multiTier:useCue('t77MultiTier').at, control:useCue('t77Control').at};
  const left={x:120,y:190,w:720,h:750},right={x:1000,y:190,w:800,h:750};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.structure} box={{x:120,y:105,w:1680,h:46}} size={34}>WORD CLASS · SYSTEM CLASS</Copy>
    <Panel box={left} at={c.ism} seed={741}/><Panel box={right} at={c.wiring} accent="color/marker/race" seed={742}/>
    <FitBox text="-ISM" x={160} y={228} size={48} weight={600} tag="WORD ENDING" startFrame={frame(c.ism)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    {[['CAPITALISM',c.capitalism],['FEUDALISM',c.feudalism],['COLONIALISM',c.colonialism]].map(([term,at],i)=><React.Fragment key={String(term)}><Panel box={{x:182,y:345+i*86,w:596,h:64}} at={Number(at)} seed={750+i}/><Copy at={Number(at)} box={{x:210,y:363+i*86,w:540,h:28}} size={24} mono>{term}</Copy></React.Fragment>)}
    <Copy at={c.institutional} box={{x:184,y:630,w:590,h:40}} size={26} tone="color/fill/gold" align="center">LARGE-SCALE INSTITUTIONAL SYSTEM</Copy>
    <Copy at={c.precision} box={{x:184,y:730,w:590,h:40}} size={21} tone="color/text/soft" align="center">PRIVATE PREJUDICE · PRECISELY NAMED IN THE LITERATURE</Copy>

    <FitBox text="MENTAL HABIT" x={1050} y={228} size={24} weight={600} tag="PERSONAL" startFrame={frame(c.wiring)} durationFrames={16} textToken="color/text/primary" strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" accentToken="color/fill/gold"/>
    <StickFigure x={1120} y={340} group="neutral" emphasis={.9} scale={1.3} animate startFrame={frame(c.brain)} durationFrames={18} beat/>
    <DrawLine points={[[1210,340],[1490,340]]} startFrame={frame(c.captured)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <FitBox text="EXTRACTION SYSTEM" x={1510} y={228} size={24} weight={600} tag="STRUCTURAL" startFrame={frame(c.extraction)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race"/>

    <Panel box={{x:1035,y:450,w:730,h:360}} at={c.reserves} accent="color/marker/race" seed={743}/>
    <div style={{position:'absolute',left:1035,top:450,width:730,height:360}}>
      <DefinitionCard term="RACISM" definition="An institutionalized, multi-tier system of group-based extraction and control." source="BOOK SYSTEMS VOCABULARY" paraphrased progress={entered(ms,c.reserves)} accent="color/marker/race"/>
    </div>
  </KitSound></StageSceneFrame>;
}
