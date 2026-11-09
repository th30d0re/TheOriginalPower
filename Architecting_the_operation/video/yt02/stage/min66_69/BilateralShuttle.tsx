import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, Copy, Scene} from './shared';

// Turn 307: South Atlantic bilateral shuttle on the engraved map.
// Eastbound provisions / cachaça and westbound captives offset across the ocean,
// with the standard triangle oversimplification rejected in a lower caption.
export function BilateralShuttle({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    traffic: useCue('t307Traffic').at,
    Brazil: useCue('t307Brazil').at,
    Angola: useCue('t307Angola').at,
    ships: useCue('t307Ships').at,
    cachaça: useCue('t307Cachaca').at,
    east: useCue('t307East').at,
    captives: useCue('t307Captives').at,
    west: useCue('t307West').at,
    bilateral: useCue('t307Bilateral').at,
    European: useCue('t307European').at,
    triangle: useCue('t307Triangle').at,
    oversimplifies: useCue('t307Oversimplifies').at,
    share: useCue('t307Share').at,
    territories: useCue('t307Territories').at,
  };

  const camera = cameraMove(ms, c.Angola, {center: [-18, -15], zoom: 2.15}, {center: [-15, -16], zoom: 2.2});
  const east = Math.min(1, Math.max(0, (ms - c.east) / 1200));
  const west = Math.min(1, Math.max(0, (ms - c.west) / 1200));

  return <Scene segment={segment}>
    <AtlanticMap
      camera={camera}
      at={c.traffic}
      routes={[
        {waypoints: [[-43.2, -22.9], [-25, -18], [13.2, -8.8]], draw: east, markers: [0, 2]},
        {waypoints: [[13.2, -8.8], [-20, -11], [-43.2, -22.9]], draw: west, color: 'color/marker/race', markers: [0, 2]},
      ]}
      labels={[
        {at: c.Brazil, point: [-43.2, -22.9], text: 'BRAZIL'},
        {at: c.Angola, point: [13.2, -8.8], text: 'ANGOLA · LUANDA'},
        {at: c.cachaça, point: [-16, -21], text: 'EAST · CACHAÇA & PROVISIONS'},
        {at: c.captives, point: [-11, -9], text: 'WEST · CAPTIVES'},
      ]}
    />
    <Copy at={c.triangle} box={{x: 360, y: 920, w: 1200, h: 40}} size={22} mono align="center" tone="color/text/soft">
      BILATERAL SHUTTLE · NO EUROPEAN LEG
    </Copy>
  </Scene>;
}
