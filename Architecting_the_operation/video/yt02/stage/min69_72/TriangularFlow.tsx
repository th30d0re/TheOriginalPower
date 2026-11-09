import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, Scene} from './shared';

// Turn 309: standard triangular trade circuit drawn leg by leg on the engraved map:
// European manufactures → West Africa, Middle Passage captives → Americas,
// plantation commodities (sugar, rum, tobacco) → European markets.
export function TriangularFlow({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    manufactured: useCue('t309Manufactured').at,
    liverpool: useCue('t309Liverpool').at,
    african: useCue('t309African').at,
    captives: useCue('t309Captives').at,
    middle: useCue('t309Middle').at,
    sugar: useCue('t309Sugar').at,
    rum: useCue('t309Rum').at,
    markets: useCue('t309Markets').at,
  };

  const camera = cameraMove(ms, c.middle, {center: [-32, 28], zoom: 1.5}, {center: [-36, 24], zoom: 1.65});
  const draw = (at: number) => Math.min(1, Math.max(0, (ms - at) / 1000));

  return <Scene segment={segment}>
    <AtlanticMap
      camera={camera}
      at={c.manufactured}
      routes={[
        {waypoints: [[-3, 53], [-16, 22], [-1.4, 5.1]], draw: draw(c.manufactured), markers: [0, 2]},
        {waypoints: [[-1.4, 5.1], [-38, 12], [-61, 14]], draw: draw(c.middle), color: 'color/marker/race', markers: [0, 2]},
        {waypoints: [[-61, 14], [-35, 35], [-3, 53]], draw: draw(c.sugar), markers: [0, 2]},
      ]}
      labels={[
        {at: c.liverpool, point: [-3, 53], text: 'EUROPE · MANUFACTURES'},
        {at: c.african, point: [-1.4, 5.1], text: 'WEST AFRICA'},
        {at: c.captives, point: [-61, 14], text: 'AMERICAS · MIDDLE PASSAGE'},
      ]}
    />
  </Scene>;
}
