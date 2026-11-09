import React from 'react';
import {DrawLine, useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, cameraMove, CinematicStill, Copy, Panel, Scene, frame} from './shared';

// Turns 314–316: Chesapeake tobacco-field still (shared indentured & African labor),
// cuts to the Lisbon → Virginia map move for the second historical test, then lands
// Prediction 2: codification follows solidarity threats.
export function VirginiaPrediction({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    virginia314: useCue('t314Virginia').at,
    marginal: useCue('t314Marginal').at,
    tobacco: useCue('t314Tobacco').at,
    company: useCue('t314Company').at,
    settlers: useCue('t314Settlers').at,
    indentured: useCue('t314Indentured').at,
    why: useCue('t315Why').at,
    virginia315: useCue('t315Virginia').at,
    prediction315: useCue('t315Prediction').at,
    portugal: useCue('t315Portugal').at,
    lisbon: useCue('t315Lisbon').at,
    arrival: useCue('t315VirginiaArrival').at,
    chapter: useCue('t315Chapter').at,
    prediction: useCue('t316Prediction').at,
    codification: useCue('t316Codification').at,
    solidarity: useCue('t316Solidarity').at,
    statutory: useCue('t316Statutory').at,
    buffer: useCue('t316Buffer').at,
    privileges: useCue('t316Privileges').at,
    coalitions: useCue('t316Coalitions').at,
    crossRacial: useCue('t316CrossRacial').at,
  };

  const camera = cameraMove(ms, c.lisbon, {center: [-38, 35], zoom: 1.55}, {center: [-55, 36], zoom: 2.2});
  const draw = Math.min(1, Math.max(0, (ms - c.lisbon) / 1500));

  return <Scene segment={segment}>
    {ms < c.why ? (
      <CinematicStill name="294-chesapeake-bottom" at={c.virginia314} until={c.why} caption="VIRGINIA · TOBACCO COLONY" />
    ) : ms < c.prediction ? (
      <AtlanticMap
        camera={camera}
        at={c.why}
        until={c.prediction}
        routes={[{waypoints: [[-9.14, 38.72], [-28, 40], [-55, 39], [-76.3, 37.1]], draw, markers: [0, 3]}]}
        labels={[
          {at: c.lisbon, point: [-9.14, 38.72], text: 'LISBON · 15TH CENTURY'},
          {at: c.arrival, point: [-76.3, 37.1], text: 'VIRGINIA · POINT COMFORT'},
        ]}
      />
    ) : (
      <>
        <Panel box={{x: 180, y: 160, w: 1560, h: 740}} at={c.prediction} />
        <Copy at={c.prediction} box={{x: 230, y: 200, w: 1460, h: 42}} size={34}>PREDICTION 2 · HISTORICAL TEST</Copy>
        <Panel box={{x: 230, y: 270, w: 1460, h: 140}} at={c.codification} accent="color/fill/gold" />
        <Copy at={c.codification} box={{x: 260, y: 300, w: 1400, h: 36}} size={30} tone="color/fill/gold">CODIFICATION FOLLOWS SOLIDARITY THREATS</Copy>
        <Copy at={c.solidarity} box={{x: 260, y: 350, w: 1400, h: 26}} size={20} mono tone="color/text/soft">CROSS-RACIAL LABOR COALITIONS</Copy>
        <DrawLine points={[[960, 430], [960, 510]]} startFrame={frame(c.statutory)} durationFrames={14} strokeToken="color/marker/race" strokeWidth={5} end="arrow" beat />
        <Panel box={{x: 230, y: 530, w: 700, h: 210}} at={c.statutory} accent="color/marker/race" />
        <Copy at={c.statutory} box={{x: 270, y: 570, w: 620, h: 36}} size={28} tone="color/marker/race">STATUTORY RACE CODES</Copy>
        <Copy at={c.statutory} box={{x: 270, y: 620, w: 620, h: 24}} size={18} mono tone="color/text/soft">RIGID LEGAL PARTITION</Copy>
        <Panel box={{x: 990, y: 530, w: 700, h: 210}} at={c.buffer} accent="color/fill/gold" />
        <Copy at={c.buffer} box={{x: 1030, y: 570, w: 620, h: 36}} size={28} tone="color/fill/gold">BUFFER CLASS PRIVILEGES</Copy>
        <Copy at={c.privileges} box={{x: 1030, y: 620, w: 620, h: 24}} size={18} mono tone="color/text/soft">STATUS CONCESSIONS</Copy>
      </>
    )}
  </Scene>;
}
