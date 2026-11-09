import React from 'react';
import {DrawLine, DrawRect, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 270–272: a minimal-group partition is made actionable when law and doctrine fence an
// Out-group beyond the moral community; the field at Lagos holds as the consequence.
export function MoralCommunity({segment}:SceneProps) {
  const c={connect:useCue('t270Connect').at, tajfel:useCue('t270Tajfel').at, baseline:useCue('t270Baseline').at, outgroup:useCue('t270Outgroup').at, law:useCue('t270Law').at, doctrine:useCue('t270Doctrine').at, exclude:useCue('t270Exclude').at, lagos:useCue('t271Lagos').at, parents:useCue('t271Parents').at, divided:useCue('t271Division').at, salvation:useCue('t271Salvation').at, moral:useCue('t272Moral').at, wage:useCue('t272Wage').at, ranks:useCue('t272Ranks').at};
  const left={x:120,y:220,w:720,h:620}, right={x:1020,y:220,w:780,h:620};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.connect} beat/>
    <Copy at={c.baseline} box={{x:150,y:122,w:880,h:36}} size={30}>MINIMAL GROUP BASELINE</Copy>
    <Panel box={left} at={c.tajfel}/>
    <FitBox text="IN-GROUP" x={190} y={270} size={30} weight={600} tag="TAJFEL" startFrame={frame(c.tajfel)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <StickFigure x={360} y={465} group="ingroup" emphasis={1} scale={1.7} animate startFrame={frame(c.baseline)} durationFrames={18}/>
    <DrawLine points={[[500,465],[650,465]]} startFrame={frame(c.outgroup)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={3} end="arrow" beat/>
    <StickFigure x={710} y={465} group="outgroup" emphasis={1} scale={1.7} animate startFrame={frame(c.outgroup)} durationFrames={18}/>
    <Copy at={c.outgroup} box={{x:530,y:585,w:230,h:30}} size={22} align="center" tone="color/marker/race">OUT-GROUP</Copy>
    <Panel box={right} at={c.law} accent="color/marker/race"/>
    <FitBox text="MORAL COMMUNITY" x={1080} y={270} size={30} weight={600} tag="BOUNDARY" startFrame={frame(c.exclude)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <DrawLine points={[[1400,350],[1400,720]]} startFrame={frame(c.exclude)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5}/>
    <Copy at={c.law} box={{x:1090,y:420,w:250,h:34}} size={24}>ROYAL LAW</Copy>
    <Copy at={c.doctrine} box={{x:1090,y:480,w:250,h:34}} size={24}>CHURCH DOCTRINE</Copy>
    <StickFigure x={1580} y={520} group="outgroup" emphasis={1} scale={1.8} animate startFrame={frame(c.exclude)} durationFrames={18} beat/>
    <Copy at={c.exclude} box={{x:1470,y:650,w:240,h:30}} size={21} align="center" tone="color/marker/race">EXCLUDED</Copy>
    <DrawRect box={{x:390,y:890,w:1140,h:66}} startFrame={frame(c.lagos)} durationFrames={16} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={c.parents} box={{x:430,y:907,w:1060,h:30}} size={21} align="center">LAGOS FIELD</Copy>
    <Copy at={c.divided} box={{x:1250,y:780,w:450,h:30}} size={20} align="center" mono tone="color/text/soft">DIVISION CARRIED THROUGH</Copy>
    <Copy at={c.salvation} box={{x:1250,y:815,w:450,h:26}} size={19} align="center" mono tone="color/marker/race">SALVATION OF SOULS</Copy>
    <Copy at={c.wage} box={{x:180,y:780,w:560,h:28}} size={20} tone="color/fill/gold">PSYCHOLOGICAL WAGE</Copy>
    <Copy at={c.ranks} box={{x:180,y:815,w:560,h:26}} size={19} mono tone="color/text/soft">SPECTATORS HOLD RANKS</Copy>
  </Scene>;
}
