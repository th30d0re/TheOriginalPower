import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, Scene} from './shared';

// Turn 308: new Atlantic entrants placed on the map as they are named —
// Dutch to Brazil and Elmina, England to Barbados, France to Saint-Domingue.
export function PowersTimeline({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    dutch: useCue('t308Dutch').at,
    chartered: useCue('t308Chartered').at,
    brazil: useCue('t308Brazil').at,
    elmina: useCue('t308Elmina').at,
    england: useCue('t308England').at,
    barbados: useCue('t308Barbados').at,
    sugar: useCue('t308Sugar').at,
    monopoly: useCue('t308Monopoly').at,
    france: useCue('t308France').at,
    domingue: useCue('t308Domingue').at,
  };

  const camera = cameraMove(ms, c.england, {center: [-30, 22], zoom: 1.5}, {center: [-38, 20], zoom: 1.65});
  const draw = (at: number) => Math.min(1, Math.max(0, (ms - at) / 1000));

  return <Scene segment={segment}>
    <AtlanticMap
      camera={camera}
      at={c.dutch}
      routes={[
        {waypoints: [[4.9, 52.4], [-20, 28], [-43.2, -22.9]], draw: draw(c.brazil), markers: [0, 2]},
        {waypoints: [[4.9, 52.4], [-10, 30], [-1.35, 5.08]], draw: draw(c.elmina), markers: [0, 2]},
        {waypoints: [[-0.1, 51.5], [-30, 32], [-59.6, 13.2]], draw: draw(c.barbados), color: 'color/marker/race', markers: [0, 2]},
        {waypoints: [[-1.6, 47.2], [-35, 30], [-72.3, 19.9]], draw: draw(c.domingue), markers: [0, 2]},
      ]}
      labels={[
        {at: c.brazil, point: [-43.2, -22.9], text: 'BRAZIL · 1630'},
        {at: c.elmina, point: [-1.35, 5.08], text: 'ELMINA · 1637'},
        {at: c.barbados, point: [-59.6, 13.2], text: 'BARBADOS · 1627'},
        {at: c.domingue, point: [-72.3, 19.9], text: 'SAINT-DOMINGUE · 1697'},
      ]}
    />
  </Scene>;
}
