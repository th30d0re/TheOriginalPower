import React from 'react';
import {DrawLine, FitBox, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

export function LocalPartition({segment}:SceneProps) {
  const ms=useStageMs(); const c={splitting:useCue('t202Splitting').at,divisions:useCue('t202Divisions').at,equation:useCue('t203Equation').at,recursive:useCue('t203Recursive').at,axis:useCue('t203Alpha').at,writes:useCue('t204Writes').at,intersection:useCue('t204Intersection').at,gender:useCue('t204Gender').at};
  return <Scene segment={segment}><Panel box={{x:120,y:100,w:1680,h:112}} at={c.splitting}/><Copy at={c.divisions} box={{x:155,y:132,w:1610,h:42}} size={31} align="center">EVERY BLOCK CONTAINS INTERNAL DIVISIONS</Copy>
    <Panel box={{x:250,y:300,w:1420,h:460}} at={c.equation}/><FitBox text="RECURSIVE LOCAL PARTITION" x={300} y={335} size={27} weight={600} tag="EQ. 2.4" startFrame={frame(c.recursive)} durationFrames={15} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <EquationTerms equation="Eq. 2.4" ms={ms} box={{x:380,y:455,w:1160,h:72}} fontSize={42} align="center" tokens={[{term:'X'},{text:' = '},{term:'XPlusAlpha'},{text:' + '},{term:'XMinusAlpha'}]} pulses={{X:[c.writes],XPlusAlpha:[c.axis],XMinusAlpha:[c.axis]}}/>
    <DrawLine points={[[940,560],[940,690]]} startFrame={frame(c.intersection)} durationFrames={16} strokeToken="color/fill/gold" strokeWidth={4}/><Copy at={c.intersection} box={{x:560,y:640,w:760,h:32}} size={23} mono align="center">X + alpha INTERSECT X - alpha = EMPTY SET</Copy>
    <Copy at={c.gender} box={{x:420,y:845,w:1080,h:40}} size={28} tone="color/fill/gold" align="center">LOCAL AXIS · GENDER OR WEALTH</Copy>
  </Scene>;
}
