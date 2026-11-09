import React from 'react';
import {DrawRect, useCue, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, Term, frame} from './shared';

export function LevelOne({segment}:SceneProps) {
  const cue={level:useCue('t216Level').at,binary:useCue('t216Binary').at,claim:useCue('t216Claim').at,uniform:useCue('t216Uniform').at,elite:useCue('t216Elite').at,unresolved:useCue('t216Unresolved').at};
  return <Scene segment={segment}>
    <Panel box={{x:120,y:108,w:1680,h:110}} at={cue.level}/><Term text="LEVEL 1" x={154} y={138} at={cue.level}/>
    <Copy at={cue.binary} box={{x:420,y:146,w:1230,h:34}} size={30}>COARSE BINARY · EQ. 2.1</Copy>
    <Panel box={{x:120,y:288,w:670,h:610}} at={cue.claim}/>
    <Copy at={cue.claim} box={{x:170,y:354,w:570,h:76}} size={32}>ONE UNIFORM IN-GROUP BLOCK</Copy>
    <DrawRect box={{x:180,y:500,w:550,h:220}} startFrame={frame(cue.uniform)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.uniform} box={{x:180,y:578,w:550,h:44}} size={38} align="center">I</Copy>
    <Panel box={{x:910,y:288,w:890,h:610}} at={cue.elite} accent="color/marker/race"/>
    <div style={{position:'absolute',left:980,top:315,width:750,height:500,opacity:.66}}><ConeOnly width={750} height={500} model={{el:22,az:-28,al:1}}/></div>
    <Copy at={cue.elite} box={{x:1010,y:806,w:700,h:32}} size={25} align="center">ELITE · PUPPET · ENFORCEMENT · BUFFER</Copy>
    <Copy at={cue.unresolved} box={{x:1060,y:852,w:600,h:30}} size={23} tone="color/marker/race" align="center">TIERS UNRESOLVED</Copy>
  </Scene>;
}
