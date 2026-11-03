import React from 'react';
import {staticFile} from 'remotion';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, cornerQr, cornerSource} from './shared/QrMark';

const RATES = [
  {id: 'bar-d', label: 'D', value: 3.14},
  {id: 'bar-c', label: 'C', value: 3.12},
  {id: 'bar-ab', label: 'A and B', value: 0.43},
];

export function BostonMap(_props: SceneProps) {
  const ms = useStageMs();
  const mapAt = useCue('boston').at;
  const at = useCue('seven').at;
  const t = cubicOut(progress(ms, at, at + 640));
  const mapT = cubicOut(progress(ms, mapAt, mapAt + 520));
  return (
    <>
      <Beat id="map" cue="boston" box={{x: 60, y: 180, w: 960, h: 620}} title="1938 Boston map" />
      {ms >= mapAt && (
        <img
          data-shape="holc-map"
          data-role="mark"
          data-box="96 292 888 488"
          src={staticFile('assets/frames/boston_holc_shootings_map.png')}
          alt=""
          style={{position: 'absolute', left: 96, top: 292, width: 888, height: 488, objectFit: 'contain', opacity: mapT}}
        />
      )}
      <Beat id="rates" cue="seven" box={{x: 60, y: 840, w: 960, h: 300}} title="D 3.14 · C 3.12 · A and B 0.43" body="Shootings per 10,000 residents per year." />
      {ms >= at && RATES.map((rate, index) => {
        const full = Math.round(760 * rate.value / 3.14);
        const y = 1180 + index * 52;
        return (
          <div
            key={rate.id}
            data-shape={rate.id}
            data-role="mark"
            data-layer="bars"
            data-box={`160 ${y} ${full} 36`}
            style={{position: 'absolute', left: 160, top: y, width: full * t, height: 36, background: color('color/fill/gold')}}
          />
        );
      })}
      <Beat id="label" cue="democide" box={{x: 60, y: 1360, w: 960, h: 220}} title="State-sponsored democide" />
      <QrMark id="map-qr" cue="boston" url="https://dsl.richmond.edu/panorama/redlining/map/MA/Boston/context" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="boston" box={cornerSource} text="Sources: Mapping Inequality · Analyze Boston · ACS 2024" />
    </>
  );
}
