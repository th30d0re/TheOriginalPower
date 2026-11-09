import React from 'react';
import {DrawLine, DrawRect, FitBox, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

export function ControlCases({segment}:SceneProps) {
  const c={why:useCue('t290Why').at,atlantic:useCue('t290Atlantic').at,gradient:useCue('t290Gradient').at,comparative:useCue('t290Comparative').at,chapter:useCue('t290Chapter').at,engineering:useCue('t290Engineering').at,three:useCue('t290Three').at,cases:useCue('t290Cases').at};
  const cases=[['ROMAN SLAVERY','C1'],['RELIGIOUS PARTITION','C2'],['TOLEDO · 1449','C3']] as const;
  return <Scene segment={segment}>
    <Panel box={{x:120,y:104,w:1680,h:104}} at={c.why}/><Copy at={c.why} box={{x:155,y:130,w:1500,h:42}} size={34}>WHY THIS PHENOTYPIC GRADIENT?</Copy>
    <Copy at={c.atlantic} box={{x:155,y:174,w:1500,h:24}} size={20} mono tone="color/text/soft">ATLANTIC SYSTEM · CHAPTER 3</Copy>
    {cases.map(([label,tag],i)=>{const x=170+i*570,at=[c.comparative,c.chapter,c.three][i];return <React.Fragment key={label}><DrawRect box={{x,y:340,w:440,h:330}} startFrame={frame(at)} durationFrames={18} strokeToken={i===2?'color/marker/race':'color/fill/gold'} fillToken="color/fill/panel-render" glowToken={i===2?'color/marker/race':'color/fill/gold'} beat/><FitBox text={tag} x={x+34} y={372} size={22} weight={600} tag="CHAPTER 3" startFrame={frame(at)} durationFrames={14} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold"/><Copy at={at} box={{x:x+38,y:485,w:364,h:58}} size={27} align="center">{label}</Copy></React.Fragment>})}
    <Copy at={c.cases} box={{x:310,y:770,w:1300,h:38}} size={28} align="center" tone="color/fill/gold">THREE CONTROL CASES</Copy>
  </Scene>;
}
