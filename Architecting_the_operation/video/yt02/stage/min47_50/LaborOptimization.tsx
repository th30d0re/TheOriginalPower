import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {AtlanticMap, Copy, Label, Panel} from './shared';

export function LaborOptimization({segment}:SceneProps){
  const cue={why:useCue('t227Why').at,crown:useCue('t227Crown').at,labor:useCue('t227Labor').at,material:useCue('t227Material').at,optimization:useCue('t227Optimization').at,nobility:useCue('t227Nobility').at,wealth:useCue('t227Wealth').at,resistance:useCue('t227Resistance').at,black:useCue('t228Black').at,wars:useCue('t228Wars').at,scarcity:useCue('t228Scarcity').at,elite:useCue('t228Elite').at,capital:useCue('t228Capital').at,maritime:useCue('t228Maritime').at,madeira:useCue('t228Madeira').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.maritime} until={cue.madeira+3000} drawAt={cue.madeira} label="MADEIRA · ATLANTIC ISLANDS"/>
    <Panel box={{x:120,y:104,w:1680,h:92}} at={cue.why} beat/><Copy at={cue.why} box={{x:154,y:126,w:980,h:36}} size={30}>WHY A NEW LABOR SUPPLY?</Copy><Copy at={cue.crown} box={{x:1220,y:138,w:540,h:24}} size={20} tone="color/fill/gold">PORTUGUESE CROWN · 1440s</Copy>
    <Panel box={{x:160,y:286,w:580,h:474}} at={cue.scarcity} red/><Label at={cue.black} x={196} y={316} text="CONSTRAINT" tag="MATERIAL" red/><Copy at={cue.scarcity} box={{x:196,y:438,w:470,h:42}} size={32}>LABOR SCARCITY</Copy><StickFigure x={456} y={610} group="neutral" emphasis={.7} scale={1.6} startFrame={Math.round(cue.wars*30/1000)} animate beat/>
    <Panel box={{x:1180,y:286,w:580,h:474}} at={cue.elite}/><Label at={cue.elite} x={1216} y={316} text="OBJECTIVE" tag="NOBILITY"/><Copy at={cue.capital} box={{x:1216,y:438,w:470,h:42}} size={32}>ELITE ACCUMULATION</Copy><Copy at={cue.madeira} box={{x:1216,y:552,w:440,h:32}} size={25}>MARITIME TRADE · MADEIRA</Copy>
    <DrawLine points={[[770,522],[1150,522]]} startFrame={Math.round(cue.optimization*30/1000)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6} end="arrow" beat/>
    <Panel box={{x:585,y:818,w:750,h:88}} at={cue.material}/><Copy at={cue.wealth} box={{x:618,y:845,w:680,h:32}} size={26}>MAXIMUM WEALTH · MINIMUM RESISTANCE</Copy>
  </KitSound></StageSceneFrame>;
}
