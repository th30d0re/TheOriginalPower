import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './shared';

export function FeudalFriction({segment}:SceneProps){
  const cue={inside:useCue('t229Inside').at,extraction:useCue('t229Extraction').at,friction:useCue('t229Friction').at,religious:useCue('t229Religious').at,legal:useCue('t229Legal').at,solidarity:useCue('t229Solidarity').at,revolt:useCue('t229Revolt').at,scale:useCue('t230Scale').at,portuguese:useCue('t230Portuguese').at,elite:useCue('t230Elite').at,labor:useCue('t230Labor').at,stripped:useCue('t230Stripped').at,kin:useCue('t230Kin').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:92}} at={cue.inside} beat/><Copy at={cue.inside} box={{x:154,y:127,w:900,h:38}} size={30}>EXTRACTION MEETS STRUCTURAL FRICTION</Copy>
    <Panel box={{x:120,y:278,w:700,h:510}} at={cue.extraction} red/><Tag at={cue.extraction} x={154} y={306} text="FEUDAL EUROPE" red/><StickFigure x={300} y={538} group="neutral" emphasis={1} scale={1.45} animate startFrame={frame(cue.religious)} beat/><StickFigure x={570} y={538} group="neutral" emphasis={.8} scale={1.45} animate startFrame={frame(cue.solidarity)}/><Copy at={cue.friction} box={{x:168,y:670,w:600,h:42}} size={30}>DOMESTIC CONSTRAINTS</Copy>
    <Panel box={{x:1100,y:278,w:700,h:510}} at={cue.scale}/><Tag at={cue.portuguese} x={1134} y={306} text="PORTUGUESE ELITE"/><Copy at={cue.labor} box={{x:1148,y:475,w:600,h:42}} size={32}>LABOR SUPPLY</Copy><Copy at={cue.stripped} box={{x:1148,y:540,w:560,h:32}} size={24} tone="color/marker/race">LEGAL STANDING REMOVED</Copy><Copy at={cue.kin} box={{x:1148,y:592,w:560,h:32}} size={24} tone="color/marker/race">KIN NETWORKS SEVERED</Copy>
    <DrawLine points={[[850,532],[1060,532]]} startFrame={frame(cue.elite)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6} end="arrow" beat/>
    <Copy at={cue.religious} box={{x:154,y:830,w:1560,h:32}} size={24} align="center" tone="color/text/soft">MEMBERSHIP · CUSTOM · SOLIDARITY · FLIGHT OR REVOLT</Copy>
  </KitSound></StageSceneFrame>;
}
