import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, Scene} from './shared';

// Turn 313: the 1619 hemisphere on the Atlantic map — Brazil sugar,
// Spanish America silver ports (Cartagena, Veracruz), Caribbean strongpoints;
// England and France held none of their plantation colonies yet.
export function IberianHemisphere({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    nineteen: useCue('t313Nineteen').at,
    iberian: useCue('t313Iberian').at,
    brazil: useCue('t313Brazil').at,
    sugar: useCue('t313Sugar').at,
    spanish: useCue('t313Spanish').at,
    silver: useCue('t313Silver').at,
    cartagena: useCue('t313Cartagena').at,
    veracruz: useCue('t313Veracruz').at,
    spain: useCue('t313Spain').at,
    england: useCue('t313England').at,
    colonies: useCue('t313Colonies').at,
  };

  const camera = cameraMove(ms, c.cartagena, {center: [-45, 15], zoom: 1.65}, {center: [-65, 18], zoom: 2.1});
  const draw = (at: number) => Math.min(1, Math.max(0, (ms - at) / 900));

  return <Scene segment={segment}>
    <AtlanticMap
      camera={camera}
      at={c.nineteen}
      routes={[
        {waypoints: [[-9, 38], [-25, 12], [-43, -22]], draw: draw(c.brazil), markers: [0, 2]},
        {waypoints: [[-9, 38], [-45, 22], [-75.5, 10.4], [-88, 16], [-96.1, 19.2]], draw: draw(c.spanish), markers: [0, 2, 4]},
      ]}
      labels={[
        {at: c.brazil, point: [-43, -22], text: 'BRAZIL · SUGAR'},
        {at: c.cartagena, point: [-75.5, 10.4], text: 'CARTAGENA'},
        {at: c.veracruz, point: [-96.1, 19.2], text: 'VERACRUZ'},
        {at: c.spain, point: [-70, 19], text: 'CARIBBEAN STRONGPOINTS'},
      ]}
    />
  </Scene>;
}
