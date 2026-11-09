import React from 'react';
import {DrawLine, FitBox, KitSound, StageSceneFrame, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, frame} from './SceneUtils';

export function VectorCompletion({segment}:SceneProps){
  const ms=useStageMs();
  const c={hat:useCue('t68Hat').at, unit:useCue('t68Unit').at, length:useCue('t68Length').at, magnitude:useCue('t68Magnitude').at, chapter:useCue('t69Chapter').at, equation:useCue('t69Equation').at, vector:useCue('t69Vector').at, equals:useCue('t69Equals').at, force:useCue('t69Force').at, hierarchy:useCue('t69Hierarchy').at, definition:useCue('t70Definition').at, directed:useCue('t70Directed').at, law:useCue('t70Law').at, courts:useCue('t70Courts').at, policing:useCue('t70Policing').at, credit:useCue('t70Credit').at, capital:useCue('t70Capital').at, scalar:useCue('t70Scalar').at};
  const left={x:120,y:190,w:660,h:660}, right={x:880,y:190,w:920,h:660};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.hat} box={{x:120,y:105,w:1680,h:46}} size={34}>UNIT DIRECTION · MAGNITUDE · INSTITUTIONAL FORCE</Copy>
    <Panel box={left} at={c.hat} seed={681}/><Panel box={right} at={c.chapter} accent="color/marker/race" seed={682}/>
    <FitBox text="UNIT DIRECTION" x={160} y={226} size={34} weight={600} tag="TERM" startFrame={frame(c.unit)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <EquationTerms equation="Eq. 3.1 · unit direction" ms={ms} box={{x:250,y:390,w:390,h:82}} fontSize={62} align="center" tokens={[{term:'StateDirection'}]} pulses={{StateDirection:[c.hat,c.unit,c.length]}}/>
    <DrawLine points={[[252,590],[620,590]]} startFrame={frame(c.length)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <Copy at={c.length} box={{x:212,y:662,w:480,h:36}} size={27} align="center">LENGTH = ONE · POINTS THE WAY</Copy>
    <Copy at={c.magnitude} box={{x:214,y:732,w:470,h:54}} size={23} tone="color/text/soft" align="center">MAGNITUDE CARRIES FORCE SIZE</Copy>
    <FitBox text="EQUATION 21.1" x={920} y={226} size={30} weight={600} tag="CHAPTER 21" startFrame={frame(c.chapter)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <EquationTerms equation="Eq. 3.1 · completed object" ms={ms} box={{x:950,y:378,w:780,h:88}} fontSize={52} align="center" tokens={[{term:'RacismVector'},{text:' = '},{term:'Magnitude'},{text:' · '},{term:'StateDirection'}]} pulses={{RacismVector:[c.vector],Magnitude:[c.force],StateDirection:[c.hierarchy]}}/>
    <Copy at={c.equals} box={{x:980,y:508,w:720,h:34}} size={24} tone="color/text/soft" align="center">SYSTEMIC RACISM VECTOR · INSTITUTIONAL FORCE</Copy>
    <DrawLine points={[[1000,626],[1700,626]]} startFrame={frame(c.directed)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    {[['LAW',c.law,1000],['COURTS',c.courts,1135],['POLICING',c.policing,1290],['CREDIT',c.credit,1475],['CAPITAL',c.capital,1610]].map(([label,at,x],i)=><React.Fragment key={String(label)}><Panel box={{x:Number(x),y:690,w:i===4?140:118,h:64}} at={Number(at)} accent="color/line/hairline-strong" seed={690+i}/><Copy at={Number(at)} box={{x:Number(x),y:711,w:i===4?140:118,h:24}} size={19} align="center">{label}</Copy></React.Fragment>)}
    <Copy at={c.scalar} box={{x:935,y:790,w:740,h:30}} size={22} tone="color/marker/race" align="center">PERSONAL PREJUDICE · SCALAR WITHOUT DIRECTION</Copy>
  </KitSound></StageSceneFrame>;
}
