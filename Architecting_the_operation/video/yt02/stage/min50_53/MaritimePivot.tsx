import React from 'react';
import {KitSound, StageSceneFrame, useCue, type SceneProps} from '@stage';
import {AtlanticMap, Copy} from './shared';

export function MaritimePivot({segment}:SceneProps){
  const cue={now:useCue('t234Now').at,track:useCue('t234Track').at,chronological:useCue('t234Chronological').at,portuguese:useCue('t234Portuguese').at,maritime:useCue('t234Maritime').at,pivot:useCue('t234Pivot').at,west:useCue('t234West').at,coast:useCue('t234Coast').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <AtlanticMap at={cue.now} drawAt={cue.pivot} coastAt={cue.west} label="PORTUGAL → WEST AFRICAN COAST"/>
    <Copy at={cue.track} box={{x:116,y:110,w:900,h:34}} size={27}>PORTUGUESE MARITIME PIVOT</Copy>
    <Copy at={cue.coast} box={{x:116,y:152,w:620,h:28}} size={20} tone="color/fill/gold">ROUTE DRAWN WITH THE CHRONOLOGY</Copy>
  </KitSound></StageSceneFrame>;
}
