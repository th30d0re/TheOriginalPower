import React from 'react';
import {DrawLine, Flicker, useCue, useStageMs, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, Term, frame} from './shared';

export function RecursivePartitions({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={apply:useCue('t207Apply').at,gender:useCue('t207Gender').at,buffer:useCue('t208Buffer').at,split:useCue('t208Splits').at,second:useCue('t209Second').at,compartments:useCue('t209Compartments').at,inside:useCue('t210Inside').at,token:useCue('t210Token').at,containment:useCue('t210Containment').at};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:104,w:1680,h:100}} at={cue.apply}/>
    <Copy at={cue.apply} box={{x:156,y:135,w:620,h:38}} size={30}>EQ. 2.4 · RECURSIVE LOCAL PARTITION</Copy>
    <Flicker startFrame={frame(cue.apply)} durationFrames={14} beat><EquationTerms equation="Eq. 2.4" ms={ms} box={{x:1080,y:120,w:610,h:56}} fontSize={34} align="right" tokens={[{text:'X -> X + alpha / X - alpha'}]} pulses={{}}/></Flicker>
    <Panel box={{x:120,y:270,w:710,h:650}} at={cue.gender}/>
    <Term text="ALPHA = GENDER" x={160} y={310} at={cue.gender}/>
    <Copy at={cue.buffer} box={{x:160,y:414,w:600,h:45}} size={30}>BUFFER CLASS</Copy>
    <DrawLine points={[[475,500],[475,720]]} startFrame={frame(cue.split)} durationFrames={18} strokeToken="color/fill/gold" strokeWidth={4} beat/>
    <Copy at={cue.split} box={{x:192,y:760,w:255,h:42}} size={28} align="center">MEN</Copy>
    <Copy at={cue.split} box={{x:502,y:760,w:255,h:42}} size={28} align="center">WOMEN</Copy>
    <Panel box={{x:930,y:270,w:870,h:650}} at={cue.inside} accent="color/marker/race"/>
    <div style={{position:'absolute',left:990,top:300,width:750,height:500}}><ConeOnly width={750} height={500} model={{el:22,az:-28,al:1}}/></div>
    <Copy at={cue.compartments} box={{x:1010,y:800,w:700,h:34}} size={24} align="center">LOCAL COMPARTMENTS</Copy>
    <Term text="O RACIALIZED" x={1010} y={846} at={cue.inside} accent="color/marker/race"/>
    <Copy at={cue.token} box={{x:1300,y:852,w:410,h:30}} size={22}>TOKEN REPRESENTATION</Copy>
    <Copy at={cue.containment} box={{x:1130,y:892,w:500,h:28}} size={21} tone="color/marker/race" align="center">MASS CONTAINMENT INTACT</Copy>
  </Scene>;
}
