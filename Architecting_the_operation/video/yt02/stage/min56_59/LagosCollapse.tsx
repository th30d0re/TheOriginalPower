import React from 'react';
import {DrawLine, DrawRect, FitBox, Flicker, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';
import {AtlanticMap} from '../min53_56/PortugalVisuals';

export function LagosCollapse({segment}:SceneProps) {
  const c={auction:useCue('t259Auction').at,lagos:useCue('t259Lagos').at,varied:useCue('t259Varied').at,skin:useCue('t259Skin').at,collapsed:useCue('t260Collapsed').at,degraded:useCue('t260Degraded').at,beasts:useCue('t260Beasts').at,enslavement:useCue('t261Enslavement').at,separation:useCue('t261Separation').at,rescue:useCue('t261Rescue').at};
  const people=[{x:290,group:'neutral' as const},{x:510,group:'ingroup' as const},{x:730,group:'outgroup' as const}];
  return <Scene segment={segment}>
    <AtlanticMap at={c.lagos} route="portugal" focus="iberia" labels={['Lisbon','Lagos']}/>
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.auction}/><Copy at={c.lagos} box={{x:150,y:122,w:820,h:38}} size={30}>LAGOS · 1444 AUCTION</Copy>
    <FitBox text="DISTINCT CAPTIVES" x={175} y={242} size={34} weight={600} tag="OBSERVED" startFrame={frame(c.varied)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    {people.map((p,i)=><React.Fragment key={p.x}><StickFigure x={p.x} y={495} group={p.group} emphasis={1} scale={1.6} animate startFrame={frame(c.skin+i*80)} durationFrames={16} beat/><Copy at={c.skin+i*80} box={{x:p.x-85,y:650,w:170,h:28}} size={20} align="center" tone="color/text/soft">PERSON {i+1}</Copy></React.Fragment>)}
    <DrawLine points={[[870,495],[1120,495]]} startFrame={frame(c.collapsed)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={8} end="arrow" beat/>
    <DrawRect box={{x:1210,y:290,w:470,h:410}} startFrame={frame(c.degraded)} durationFrames={20} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Flicker startFrame={frame(c.collapsed)} durationFrames={16} beat><FitBox text="ONE DEGRADED CATEGORY" x={1250} y={340} size={28} weight={600} tag="NARRATIVE" startFrame={frame(c.collapsed)} durationFrames={14} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race"/></Flicker>
    <Copy at={c.beasts} box={{x:1250,y:470,w:360,h:62}} size={25} align="center" tone="color/marker/race">BEASTLY · WITHOUT LAW</Copy>
    <Copy at={c.enslavement} box={{x:210,y:810,w:650,h:36}} size={26}>VIOLENT ENSLAVEMENT + SEPARATION</Copy>
    <DrawLine points={[[860,828],[1110,828]]} startFrame={frame(c.separation)} durationFrames={16} strokeToken="color/marker/race" strokeWidth={4} end="arrow" beat/>
    <Copy at={c.rescue} box={{x:1140,y:810,w:520,h:36}} size={26} tone="color/fill/gold">PRESENTED AS “RESCUE”</Copy>
  </Scene>;
}
