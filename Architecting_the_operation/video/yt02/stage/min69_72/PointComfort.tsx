import React from 'react';
import {DrawRect, useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, CinematicStill, Copy, Panel, Scene, frame} from './shared';

// Turns 317–318: White Lion piracy still, then the custody route Angola →
// White Lion interception → Point Comfort on the Atlantic map; 318 cuts to
// the empty early statute book: 0 slave codes, 0 statutory white tier.
export function PointComfort({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    virginia: useCue('t317Virginia').at,
    august: useCue('t317August').at,
    point: useCue('t317Point').at,
    white: useCue('t317White').at,
    lion: useCue('t317Lion').at,
    traded: useCue('t317Traded').at,
    twenty: useCue('t317Twenty').at,
    angola: useCue('t317Angola').at,
    bautista: useCue('t317Bautista').at,
    why: useCue('t318Why').at,
    statutory: useCue('t318Statutory').at,
    zero: useCue('t318Zero').at,
    codes: useCue('t318Codes').at,
    zeroSecond: useCue('t318ZeroSecond').at,
    tier: useCue('t318Tier').at,
  };

  const camera = cameraMove(ms, c.traded, {center: [-38, 20], zoom: 1.55}, {center: [-55, 30], zoom: 2.1});
  const draw = Math.min(1, Math.max(0, (ms - c.traded) / 2000));

  return <Scene segment={segment}>
    {ms < c.white ? (
      <CinematicStill name="284-chesapeake-piracy" at={c.virginia} until={c.white} caption="HIGH SEAS · 1619" />
    ) : ms < c.why ? (
      <AtlanticMap
        camera={camera}
        at={c.white}
        until={c.why}
        routes={[
          {waypoints: [[13.2, -8.8], [-15, 8], [-45, 26], [-76.3, 37.1]], draw, markers: [0, 2, 3]},
        ]}
        labels={[
          {at: c.angola, point: [13.2, -8.8], text: 'ANGOLA · SÃO JOÃO BAUTISTA'},
          {at: c.white, point: [-45, 26], text: 'WHITE LION (SEIZURE)'},
          {at: c.point, point: [-76.3, 37.1], text: 'POINT COMFORT · 20+ CAPTIVES'},
        ]}
      />
    ) : (
      <>
        <Panel box={{x: 120, y: 106, w: 1100, h: 70}} at={c.why} />
        <Copy at={c.why} box={{x: 150, y: 124, w: 900, h: 36}} size={30}>WHY NO WHITE TIER?</Copy>
        <DrawRect box={{x: 220, y: 300, w: 640, h: 240}} startFrame={frame(c.zero)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat />
        <Copy at={c.zero} box={{x: 240, y: 330, w: 600, h: 72}} size={64} align="center" tone="color/fill/gold">0</Copy>
        <Copy at={c.codes} box={{x: 240, y: 420, w: 600, h: 30}} size={24} align="center">SLAVE CODES</Copy>
        <DrawRect box={{x: 1060, y: 300, w: 640, h: 240}} startFrame={frame(c.zeroSecond)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat />
        <Copy at={c.zeroSecond} box={{x: 1080, y: 330, w: 600, h: 72}} size={64} align="center" tone="color/fill/gold">0</Copy>
        <Copy at={c.tier} box={{x: 1080, y: 420, w: 600, h: 30}} size={24} align="center">WHITE TIER</Copy>
        <Copy at={c.statutory} box={{x: 220, y: 580, w: 1480, h: 26}} size={20} mono tone="color/text/dim" align="center">ENGLISH STATUTE LAW · FIRST DECADES</Copy>
      </>
    )}
  </Scene>;
}
