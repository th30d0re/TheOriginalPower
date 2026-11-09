import React from 'react';
import {DefinitionCard, DrawLine, DrawRect, FitBox, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

export function GeneticGradient({segment}:SceneProps) {
  const ms=useStageMs();
  const c={africa:useCue('t284Africa').at,genetic:useCue('t284Genetic').at,diversity:useCue('t284Diversity').at,collapse:useCue('t284Collapse').at,false:useCue('t284False').at,legal:useCue('t285Legal').at,binary:useCue('t285Binary').at,continuous:useCue('t285Continuous').at,statutes:useCue('t285Statutes').at,boxes:useCue('t285Boxes').at,religious:useCue('t286Religious').at,surveillance:useCue('t286Surveillance').at,conversion:useCue('t286Conversion').at,phenotype:useCue('t286Phenotype').at,marker:useCue('t286Marker').at,mobility:useCue('t286Mobility').at};
  const field={x:120,y:218,w:810,h:570}, card={x:1090,y:218,w:610,h:470};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.africa}/><Copy at={c.genetic} box={{x:150,y:122,w:1000,h:38}} size={30}>CONTINUOUS HUMAN VARIATION</Copy>
    <Panel box={field} at={c.diversity}/><FitBox text="AFRICA" x={field.x+34} y={field.y+32} size={34} weight={600} tag="DIVERSITY" startFrame={frame(c.africa)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawLine points={[[210,500],[835,500]]} startFrame={frame(c.genetic)} durationFrames={22} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6} beat/>
    {[250,380,510,640,770].map((x,i)=><StickFigure key={x} x={x} y={500} group={i%2?'neutral':'outgroup'} emphasis={.9} scale={1.15} animate startFrame={frame(c.diversity+i*80)} durationFrames={14}/>) }
    <Copy at={c.collapse} box={{x:245,y:655,w:560,h:38}} size={24} align="center" tone="color/text/soft">ONE BIOLOGICAL TYPE</Copy>
    <DrawLine points={[[525,535],[525,625]]} startFrame={frame(c.false)} durationFrames={12} strokeToken="color/marker/race" strokeWidth={5} beat/>
    <Panel box={card} at={c.legal} accent="color/marker/race"/><FitBox text="LEGAL BINARY" x={card.x+34} y={card.y+32} size={34} weight={600} tag="STATUTES" startFrame={frame(c.binary)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    {[0,1].map(i=><DrawRect key={i} box={{x:1170+i*255,y:420,w:210,h:190}} startFrame={frame(c.boxes+i*120)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>) }
    <Copy at={c.statutes} box={{x:1170,y:450,w:465,h:32}} size={24} align="center">COMPULSORY IDENTITY</Copy>
    <Copy at={c.continuous} box={{x:1170,y:655,w:465,h:32}} size={22} align="center" mono tone="color/marker/race">CONTINUUM → BOXES</Copy>
    <DrawLine points={[[1210,640],[1580,640]]} startFrame={frame(c.surveillance)} durationFrames={14} strokeToken="color/marker/race" strokeWidth={4} end="arrow" beat/>
    <Copy at={c.religious} box={{x:1150,y:600,w:500,h:28}} size={20} align="center" mono tone="color/text/soft">SURVEILLANCE</Copy>
    <div style={{position:'absolute',left:1090,top:730,width:610,height:220}}><DefinitionCard term="PHENOTYPE" definition="A persistent visible marker for mobility and inherited status." source="TURN 286" paraphrased progress={ms>=c.phenotype?Math.min(1,(ms-c.phenotype)/500):0} accent="color/marker/race"/></div>
  </Scene>;
}
