import React from 'react';
import {DrawLine, Flicker, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, Term, frame} from './shared';

export function AlphaAxis({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={alpha:useCue('t205Alpha').at,secondary:useCue('t205Secondary').at,axis:useCue('t205Axis').at,inside:useCue('t206Inside').at,advantaged:useCue('t206Advantaged').at,subordinated:useCue('t206Subordinated').at};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:118,w:1680,h:118}} at={cue.alpha}/>
    <Term text="ALPHA" x={154} y={146} at={cue.alpha}/>
    <Copy at={cue.secondary} box={{x:405,y:158,w:1300,h:38}} size={32}>SECONDARY SORTING AXIS</Copy>
    <Panel box={{x:120,y:300,w:560,h:500}} at={cue.axis}/>
    <Copy at={cue.axis} box={{x:166,y:350,w:468,h:68}} size={34}>ANY CHOSEN GROUP</Copy>
    <Copy at={cue.axis} box={{x:166,y:438,w:468,h:36}} size={24} tone="color/text/soft">gender · wealth · credentials</Copy>
    <Panel box={{x:790,y:300,w:450,h:500}} at={cue.inside}/>
    <Panel box={{x:1350,y:300,w:450,h:500}} at={cue.inside} accent="color/marker/race"/>
    <Flicker startFrame={frame(cue.advantaged)} durationFrames={14} beat><EquationTerms equation="Eq. 2.4 · local partition" ms={ms} box={{x:850,y:385,w:330,h:70}} fontSize={44} align="center" tokens={[{text:'X + alpha'}]} pulses={{}}/></Flicker>
    <Flicker startFrame={frame(cue.subordinated)} durationFrames={14} beat><EquationTerms equation="Eq. 2.4 · local partition" ms={ms} box={{x:1410,y:385,w:330,h:70}} fontSize={44} align="center" tokens={[{text:'X - alpha'}]} pulses={{}}/></Flicker>
    <StickFigure x={1015} y={565} group="ingroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.advantaged)} durationFrames={18} beat/>
    <StickFigure x={1575} y={565} group="outgroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.subordinated)} durationFrames={18} beat/>
    <Copy at={cue.advantaged} box={{x:832,y:670,w:366,h:58}} size={27} align="center">LOCAL ADVANTAGE</Copy>
    <Copy at={cue.subordinated} box={{x:1392,y:670,w:366,h:58}} size={27} align="center">LOCAL SUBORDINATION</Copy>
    <DrawLine points={[[680,550],[790,550]]} startFrame={frame(cue.inside)} durationFrames={16} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <DrawLine points={[[1240,550],[1350,550]]} startFrame={frame(cue.inside)} durationFrames={16} strokeToken="color/marker/race" strokeWidth={4} end="arrow" beat/>
  </Scene>;
}
