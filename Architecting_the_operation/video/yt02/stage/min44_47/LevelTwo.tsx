import React from 'react';
import {DrawLine, StickFigure, useCue, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, Term, frame} from './shared';

export function LevelTwo({segment}:SceneProps) {
  const cue={level:useCue('t217Level').at,ingroup:useCue('t217Ingroup').at,rebuttal:useCue('t217Rebuttal').at,poverty:useCue('t217Poverty').at,exploitation:useCue('t217Exploitation').at,elite:useCue('t217Elite').at,boundary:useCue('t217Boundary').at,inside:useCue('t217Inside').at};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:108,w:1680,h:110}} at={cue.level}/><Term text="LEVEL 2" x={154} y={138} at={cue.level}/>
    <Copy at={cue.ingroup} box={{x:420,y:146,w:1230,h:34}} size={30}>IN-GROUP TIER REFINEMENT · EQ. 2.2</Copy>
    <Panel box={{x:120,y:288,w:790,h:610}} at={cue.rebuttal}/>
    <StickFigure x={360} y={600} group="ingroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.poverty)} durationFrames={18} beat/>
    <StickFigure x={670} y={500} group="ingroup" emphasis={1} scale={1.3} animate startFrame={frame(cue.elite)} durationFrames={18} beat/>
    <DrawLine points={[[610,530],[425,590]]} startFrame={frame(cue.exploitation)} durationFrames={18} strokeToken="color/marker/race" strokeWidth={5} end="arrow" beat/>
    <Copy at={cue.exploitation} box={{x:200,y:744,w:630,h:34}} size={25} align="center">REAL EXPLOITATION BY ELITE</Copy>
    <Panel box={{x:1010,y:288,w:790,h:610}} at={cue.boundary} accent="color/marker/race"/>
    <div style={{position:'absolute',left:1040,top:310,width:730,height:480}}><ConeOnly width={730} height={480} model={{el:22,az:-28,al:1}}/></div>
    <DrawLine points={[[1050,802],[1760,802]]} startFrame={frame(cue.boundary)} durationFrames={18} strokeToken="color/marker/race" strokeWidth={5} beat/>
    <Copy at={cue.inside} box={{x:1080,y:840,w:650,h:32}} size={25} align="center">RACIAL BOUNDARY · STILL INSIDE I</Copy>
  </Scene>;
}
