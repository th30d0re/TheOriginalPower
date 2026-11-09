import React from 'react';
import {DrawLine, useCue, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, Term, frame} from './shared';

export function ResolutionLadder({segment}:SceneProps) {
  const cue={table:useCue('t211Table').at,ladder:useCue('t211Ladder').at,figure:useCue('t211Figure').at,levels:useCue('t212Levels').at,one:useCue('t212One').at,two:useCue('t212Two').at,three:useCue('t213Three').at,four:useCue('t213Four').at,zooming:useCue('t214Zooming').at,focus:useCue('t214Focus').at,confusion:useCue('t215Confusion').at};
  const rows=[['LEVEL 1','COARSE BINARY',cue.one],['LEVEL 2','IN-GROUP TIERS',cue.two],['LEVEL 3','OUT-GROUP DECOMPOSITION',cue.three],['LEVEL 4','LOCAL PARTITION',cue.four]] as const;
  return <Scene segment={segment}>
    <Panel box={{x:120,y:104,w:780,h:104}} at={cue.table}/>
    <Term text="TABLE 2.1" x={154} y={132} at={cue.table}/>
    <Copy at={cue.ladder} box={{x:415,y:140,w:440,h:32}} size={27}>SET-RESOLUTION LADDER</Copy>
    <Panel box={{x:120,y:270,w:780,h:630}} at={cue.levels}/>
    {rows.map(([level,label,at],i)=><React.Fragment key={level}><Panel box={{x:160,y:320+i*135,w:700,h:96}} at={at}/><Copy at={at} box={{x:190,y:352+i*135,w:160,h:30}} size={24} tone="color/fill/gold">{level}</Copy><Copy at={at} box={{x:380,y:350+i*135,w:440,h:34}} size={27}>{label}</Copy></React.Fragment>)}
    <Panel box={{x:1010,y:104,w:790,h:796}} at={cue.figure} accent="color/marker/race"/>
    <div style={{position:'absolute',left:1040,top:230,width:730,height:500}}><ConeOnly width={730} height={500} model={{el:22,az:-28,al:1}}/></div>
    <DrawLine points={[[1060,780],[1730,780]]} startFrame={frame(cue.zooming)} durationFrames={18} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <Copy at={cue.focus} box={{x:1060,y:820,w:670,h:34}} size={25} align="center">FIVE TIERS</Copy>
    <Copy at={cue.confusion} box={{x:120,y:942,w:1680,h:34}} size={25} tone="color/text/soft" align="center">MISSING RESOLUTION?</Copy>
  </Scene>;
}
