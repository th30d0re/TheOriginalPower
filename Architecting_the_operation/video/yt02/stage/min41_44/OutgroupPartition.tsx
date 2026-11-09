import React from 'react';
import {DrawLine, FitBox, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

export function OutgroupPartition({segment}:SceneProps) {
  const ms=useStageMs(); const c={states:useCue('t198States').at,disjoint:useCue('t198Disjoint').at,racialized:useCue('t199Racialized').at,black:useCue('t199Black').at,adjacent:useCue('t200Adjacent').at,indigenous:useCue('t200Indigenous').at,splitting:useCue('t201Splitting').at,border:useCue('t201Border').at};
  return <Scene segment={segment}><Panel box={{x:120,y:105,w:1680,h:140}} at={c.states}/><EquationTerms equation="Eq. 2.3" ms={ms} box={{x:200,y:145,w:1520,h:55}} fontSize={34} align="center" tokens={[{term:'O'},{text:' = '},{term:'ORacialized'},{text:' + '},{term:'OAdjacent'}]} pulses={{O:[c.states],ORacialized:[c.racialized],OAdjacent:[c.adjacent]}}/>
    <Panel box={{x:150,y:330,w:660,h:400}} at={c.racialized} accent="color/marker/race"/><FitBox text="O RACIALIZED" x={190} y={365} size={28} weight={600} tag="TARGET" startFrame={frame(c.racialized)} durationFrames={15} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/><StickFigure x={285} y={540} group="outgroup" emphasis={1} scale={1.7} animate startFrame={frame(c.black)} durationFrames={18} beat/><Copy at={c.black} box={{x:385,y:520,w:360,h:46}} size={30}>BLACK AMERICANS</Copy>
    <Panel box={{x:1110,y:330,w:660,h:400}} at={c.adjacent}/><FitBox text="O ADJACENT" x={1150} y={365} size={28} weight={600} tag="SUBSETS" startFrame={frame(c.adjacent)} durationFrames={15} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/><Copy at={c.indigenous} box={{x:1160,y:500,w:560,h:40}} size={28}>INDIGENOUS · LATINO · ASIAN</Copy><Copy at={c.indigenous} box={{x:1160,y:560,w:540,h:70}} size={23} tone="color/text/soft">LAND · IMMIGRATION · LABOR</Copy>
    <DrawLine points={[[810,530],[1110,530]]} startFrame={frame(c.splitting)} durationFrames={18} strokeToken="color/fill/gold" strokeWidth={5} end="arrow" beat/><Copy at={c.border} box={{x:480,y:820,w:960,h:40}} size={28} tone="color/marker/race" align="center">UNEQUAL CONCESSIONS · BORDER POLICING</Copy>
  </Scene>;
}
