import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, Scene} from './shared';

// Turn 312: destinations on the Atlantic map — Brazil flow drawn thick (45%),
// mainland North America drawn thin (3.6%, 390K), giving geographic scale.
export function DestinationShare({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    brazil: useCue('t312Brazil').at,
    fortyFive: useCue('t312FortyFive').at,
    mainland: useCue('t312Mainland').at,
    three: useCue('t312Three').at,
    thousand: useCue('t312Thousand').at,
  };

  const camera = cameraMove(ms, c.mainland, {center: [-35, 6], zoom: 1.6}, {center: [-42, 12], zoom: 1.75});
  const draw = (at: number) => Math.min(1, Math.max(0, (ms - at) / 1000));

  return <Scene segment={segment}>
    <AtlanticMap
      camera={camera}
      at={c.brazil}
      routes={[
        {waypoints: [[-1.35, 5.08], [-25, -8], [-43.2, -22.9]], draw: draw(c.brazil), markers: [0, 2], width: 10},
        {waypoints: [[-17.5, 14.7], [-45, 28], [-76.3, 37.1]], draw: draw(c.mainland), color: 'color/marker/race', markers: [0, 2], width: 3},
      ]}
      labels={[
        {at: c.fortyFive, point: [-43.2, -22.9], text: 'BRAZIL · 45%'},
        {at: c.three, point: [-76.3, 37.1], text: 'MAINLAND N. AMERICA · 3.6% (390K)'},
      ]}
    />
  </Scene>;
}
