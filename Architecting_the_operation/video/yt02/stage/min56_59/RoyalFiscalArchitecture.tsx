import React from 'react';
import {DrawLine, DrawRect, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

export function RoyalFiscalArchitecture({segment}:SceneProps) {
  const c={commissioned:useCue('t265Commissioned').at,author:useCue('t265Author').at,order:useCue('t265Order').at,henry:useCue('t265Henry').at,beneficiary:useCue('t265Beneficiary').at,joao:useCue('t266Joao').at,fiscal:useCue('t266Fiscal').at,casa:useCue('t266Casa').at,registered:useCue('t266Registered').at,taxed:useCue('t266Taxed').at,licensed:useCue('t266Licensed').at};
  const house={x:1020,y:230,w:650,h:550};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:104,w:1560,h:72}} at={c.commissioned}/><Copy at={c.author} box={{x:150,y:122,w:1080,h:38}} size={30}>AUTHORSHIP AND FISCAL POWER</Copy>
    <DrawRect box={{x:160,y:245,w:610,h:520}} startFrame={frame(c.order)} durationFrames={20} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <FitBox text="MILITARY ORDER OF CHRIST" x={195} y={280} size={28} weight={600} tag="OFFICE" startFrame={frame(c.order)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <StickFigure x={330} y={520} group="neutral" emphasis={1} scale={1.8} animate startFrame={frame(c.author)} durationFrames={16} beat/><StickFigure x={590} y={520} group="ingroup" emphasis={1} scale={1.8} animate startFrame={frame(c.henry)} durationFrames={16} beat/>
    <Copy at={c.author} box={{x:220,y:670,w:220,h:30}} size={21} align="center">AUTHOR</Copy><Copy at={c.beneficiary} box={{x:470,y:670,w:240,h:52}} size={21} align="center">FINANCIAL BENEFICIARY</Copy>
    <DrawLine points={[[790,510],[980,510]]} startFrame={frame(c.fiscal)} durationFrames={18} strokeToken="color/fill/gold" strokeWidth={6} end="arrow" beat/>
    <DrawRect box={house} startFrame={frame(c.joao)} durationFrames={22} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <FitBox text="CASA DOS ESCRAVOS" x={1060} y={275} size={34} weight={600} tag="LISBON · 1486" startFrame={frame(c.casa)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    {[['REGISTER',c.registered],['TAX',c.taxed],['LICENSE',c.licensed]].map(([label,at],i)=><React.Fragment key={String(label)}><DrawRect box={{x:1090+i*180,y:520,w:150,h:64}} startFrame={frame(Number(at))} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race" beat/><Copy at={Number(at)} box={{x:1100+i*180,y:540,w:130,h:24}} size={19} align="center" mono>{String(label)}</Copy></React.Fragment>)}
  </Scene>;
}
