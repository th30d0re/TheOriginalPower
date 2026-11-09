import React from 'react';
import {DrawLine, DrawRect, FitBox, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';
import {AtlanticMap} from '../min53_56/PortugalVisuals';

export function ZuraranIdeology({segment}:SceneProps) {
  const c={step:useCue('t262Step').at,ideology:useCue('t262Ideology').at,running:useCue('t262Running').at,modern:useCue('t263Modern').at,firearm:useCue('t263Firearm').at,repeats:useCue('t263Repeats').at,check:useCue('t264Check').at,prediction:useCue('t264Prediction').at,kidnapping:useCue('t264Kidnapping').at,dum:useCue('t264Dum').at};
  const dates=[['1441 RAID',c.kidnapping],['1444 LAGOS',c.check],['1452 DUM',c.dum],['1453 IDEOLOGY',c.ideology]] as const;
  return <Scene segment={segment}>
    <AtlanticMap at={c.check} route="coast" focus="atlantic" labels={['Lisbon','RioDeOro','Bojador','Senegal']}/>
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.step}/><Copy at={c.ideology} box={{x:150,y:122,w:980,h:38}} size={30}>IDEOLOGY · STILL RUNNING</Copy>
    <DrawRect box={{x:170,y:250,w:640,h:400}} startFrame={frame(c.ideology)} durationFrames={20} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <FitBox text="1453 NARRATIVE" x={210} y={285} size={34} weight={600} tag="IDEA" startFrame={frame(c.ideology)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <Copy at={c.running} box={{x:230,y:420,w:510,h:62}} size={28}>INFERIOR · SUBHUMAN · BACKWARD</Copy>
    <DrawLine points={[[830,450],[1080,450]]} startFrame={frame(c.running)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6} end="arrow" beat/>
    <DrawRect box={{x:1100,y:250,w:620,h:400}} startFrame={frame(c.modern)} durationFrames={20} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <FitBox text="MODERN CLAIM" x={1140} y={285} size={34} weight={600} tag="REPEAT" startFrame={frame(c.modern)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={c.firearm} box={{x:1160,y:420,w:500,h:62}} size={27}>FIREARM ADVANTAGE</Copy>
    <Copy at={c.repeats} box={{x:1160,y:535,w:500,h:28}} size={20} mono tone="color/marker/race">NARRATIVE REPEATED</Copy>
    <FitBox text="PREDICTION 1" x={220} y={718} size={22} weight={600} tag="DATES" startFrame={frame(c.check)} durationFrames={14} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawLine points={[[190,805],[1730,805]]} startFrame={frame(c.prediction)} durationFrames={20} strokeToken="color/line/hairline-strong" strokeWidth={3} beat/>
    {dates.map(([label,at],i)=><React.Fragment key={label}><DrawRect box={{x:220+i*390,y:765,w:290,h:80}} startFrame={frame(at)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/><Copy at={at} box={{x:235+i*390,y:790,w:260,h:27}} size={19} align="center" mono>{label}</Copy></React.Fragment>)}
  </Scene>;
}
