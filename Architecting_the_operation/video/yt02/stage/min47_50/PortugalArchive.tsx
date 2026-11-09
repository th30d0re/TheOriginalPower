import React from 'react';
import {DrawLine, KitSound, StageSceneFrame, useCue, type SceneProps} from '@stage';
import {AtlanticMap, Copy, Label, Panel} from './shared';

export function PortugalArchive({segment}:SceneProps){
  const cue={why:useCue('t225Why').at, portugal:useCue('t225Portugal').at, virginia:useCue('t225Virginia').at, historical:useCue('t225Historical').at, fourteen:useCue('t225Fourteen').at, version:useCue('t225Version').at, vector:useCue('t225Vector').at, prediction:useCue('t226Prediction').at, institutional:useCue('t226Institutional').at, refutation:useCue('t226Refutation').at, dates:useCue('t226Dates').at, raids:useCue('t226Raids').at, royal:useCue('t226Royal').at, papal:useCue('t226Papal').at, chronicles:useCue('t226Chronicles').at};
  const events=[['RAIDS',cue.raids],['ROYAL TAX',cue.royal],['PAPAL BULLS',cue.papal],['CHRONICLES',cue.chronicles]] as const;
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.portugal} drawAt={cue.historical} coastAt={cue.raids} label="PORTUGAL → WEST AFRICAN COAST"/>
    <Panel box={{x:120,y:104,w:1680,h:104}} at={cue.why} beat/><Copy at={cue.why} box={{x:154,y:126,w:1060,h:38}} size={32}>PORTUGAL ARCHIVE</Copy>
    <Panel box={{x:120,y:278,w:650,h:500}} at={cue.portugal}/><Copy at={cue.portugal} box={{x:158,y:330,w:300,h:32}} size={28}>PORTUGAL</Copy><Copy at={cue.fourteen} box={{x:158,y:436,w:520,h:44}} size={36}>1441 — 1486</Copy>
    <Panel box={{x:910,y:278,w:890,h:500}} at={cue.prediction} red/><Label at={cue.prediction} x={948} y={306} text="PREDICTION 1" tag="TEST"/><Copy at={cue.institutional} box={{x:948,y:402,w:500,h:35}} size={29}>INSTITUTIONAL PRODUCTION</Copy><Label at={cue.refutation} x={948} y={488} text="REFUTATION 1" tag="CHECK" red/><Copy at={cue.dates} box={{x:948,y:590,w:440,h:30}} size={24}>EXACT CALENDAR DATES</Copy>
    {events.map(([name,at],i)=>{const x=948+i*202;return <React.Fragment key={name}><Label at={at} x={x} y={682} text={name} tag={`0${i+1}`}/>{i<3&&<DrawLine points={[[x+160,730],[x+188,730]]} startFrame={Math.round(at*30/1000)} durationFrames={10} strokeToken="color/marker/race" strokeWidth={3} end="arrow"/>}</React.Fragment>;})}
  </KitSound></StageSceneFrame>;
}
