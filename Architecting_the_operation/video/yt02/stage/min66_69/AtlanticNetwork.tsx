import React from 'react';
import {DrawLine, useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, CinematicStill, Copy, Panel, Scene, frame} from './shared';

// Turns 304–306: Casa dos Escravos still (1486), cuts to the engraved Atlantic map
// (Lisbon → São Tomé → Kongo/Luanda, Hispaniola asiento, São Vicente), then
// resolves on the economic driver / labor demand causal diagram.
export function AtlanticNetwork({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    casa: useCue('t304Casa').at,
    registration: useCue('t304Registration').at,
    taxation: useCue('t304Taxation').at,
    authority: useCue('t304Authority').at,
    sao: useCue('t304Sao').at,
    sugar: useCue('t304Sugar').at,
    colonization: useCue('t304Colonization').at,
    kongo: useCue('t304Kongo').at,
    luanda: useCue('t304Luanda').at,
    port: useCue('t304Port').at,
    spanish: useCue('t305Spanish').at,
    hispaniola: useCue('t305Hispaniola').at,
    asiento: useCue('t305Asiento').at,
    shipment: useCue('t305Shipment').at,
    licence: useCue('t305Licence').at,
    engenho: useCue('t306Engenho').at,
    vicente: useCue('t306Vicente').at,
    expansion: useCue('t306Expansion').at,
    driver: useCue('t306Driver').at,
    stressor: useCue('t306Stressor').at,
  };

  const draw = (at: number, dur = 1400) => Math.min(1, Math.max(0, (ms - at) / dur));
  const wide = {center: [-38, 22] as [number, number], zoom: 1.6};
  const camera = ms < c.hispaniola
    ? cameraMove(ms, c.sao, {center: [-14, 22], zoom: 2.2}, {center: [-6, 8], zoom: 2.3})
    : ms < c.vicente
      ? cameraMove(ms, c.hispaniola, {center: [-6, 8], zoom: 2.3}, wide)
      : cameraMove(ms, c.vicente, wide, {center: [-25, -14], zoom: 1.85});

  return <Scene segment={segment}>
    {ms < c.sao ? (
      <CinematicStill name="248-casa-dos-escravos" at={c.casa} until={c.sao} caption="LISBON · 1486" />
    ) : ms < c.engenho ? (
      <AtlanticMap
        camera={camera}
        at={c.sao}
        until={c.engenho}
        routes={[
          {waypoints: [[-9.14, 38.72], [-17.5, 14.7], [-8, 4.5], [6.6, 0.3]], draw: draw(c.sao, 1600), markers: [0, 3]},
          {waypoints: [[6.6, 0.3], [10, -3], [13.2, -8.8]], draw: draw(c.kongo, 1400), markers: [0, 2]},
          {waypoints: [[-17.5, 14.7], [-45, 20], [-69.9, 18.8]], draw: draw(c.hispaniola, 1400), markers: [0, 2]},
          {waypoints: [[13.2, -8.8], [-25, -16], [-46.4, -24.0]], draw: draw(c.vicente, 1400), color: 'color/marker/race', markers: [0, 2]},
        ]}
        labels={[
          {at: c.casa, point: [-9.14, 38.72], text: 'LISBON'},
          {at: c.sao, point: [6.6, 0.3], text: 'SÃO TOMÉ'},
          {at: c.kongo, point: [12.4, -5.8], text: 'KONGO'},
          {at: c.luanda, point: [13.2, -8.8], text: 'LUANDA'},
          {at: c.hispaniola, point: [-69.9, 18.8], text: 'HISPANIOLA'},
          {at: c.vicente, point: [-46.4, -24.0], text: 'SÃO VICENTE'},
        ]}
      />
    ) : (
      <>
        <Panel box={{x: 180, y: 320, w: 1560, h: 440}} at={c.engenho} />
        <Copy at={c.engenho} box={{x: 220, y: 380, w: 460, h: 36}} size={32}>COMMERCIAL ENGENHO</Copy>
        <Copy at={c.vicente} box={{x: 220, y: 426, w: 460, h: 26}} size={20} mono tone="color/text/soft">SÃO VICENTE · 1532</Copy>
        <DrawLine points={[[680, 480], [860, 480]]} startFrame={frame(c.expansion)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={5} end="arrow" beat />
        <Copy at={c.expansion} box={{x: 880, y: 380, w: 420, h: 36}} size={32} align="center">SUGAR EXPANSION</Copy>
        <Copy at={c.expansion} box={{x: 880, y: 426, w: 420, h: 26}} size={20} mono tone="color/text/soft" align="center">ECONOMIC DRIVER</Copy>
        <DrawLine points={[[1320, 480], [1460, 480]]} startFrame={frame(c.stressor)} durationFrames={14} strokeToken="color/marker/race" strokeWidth={5} end="arrow" beat />
        <Copy at={c.stressor} box={{x: 1400, y: 380, w: 320, h: 36}} size={32} tone="color/marker/race">LABOR DEMAND</Copy>
        <Copy at={c.stressor} box={{x: 1400, y: 426, w: 320, h: 26}} size={20} mono tone="color/marker/race">SYSTEM STRESSOR</Copy>
      </>
    )}
  </Scene>;
}
