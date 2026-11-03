import React from 'react';
import {staticFile} from 'remotion';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark} from './shared/QrMark';

export function TheReturn(_props: SceneProps) {
  const ms = useStageMs();
  const povertyAt = useCue('poverty').at;
  const zeroAt = useCue('zero').at;
  const grow = cubicOut(progress(ms, povertyAt, povertyAt + 640));
  const collapse = cubicOut(progress(ms, zeroAt, zeroAt + 640));
  const povertyW = Math.round(760 * grow);
  const gunW = Math.round(760 * (0.29 / 0.72) * grow * (1 - collapse) + 24 * collapse);
  return (
    <>
      <Beat id="plot" cue="poverty" bodyCue="zero" box={{x: 60, y: 150, w: 960, h: 820}} title="Poverty r = +0.72" body="Gun-law rank r = +0.29 alone. About zero once poverty and inequality are in." />
      {ms >= povertyAt && (
        <div
          data-shape="poverty-bar"
          data-role="mark"
          data-layer="plot"
          data-box={`160 372 ${povertyW} 40`}
          style={{position: 'absolute', left: 160, top: 372, width: povertyW, height: 40, background: color('color/fill/gold')}}
        />
      )}
      {ms >= povertyAt && (
        <div
          data-shape="gunlaw-bar"
          data-role="mark"
          data-layer="plot"
          data-box={`160 428 ${gunW} 40`}
          style={{position: 'absolute', left: 160, top: 428, width: gunW, height: 40, background: color('color/fill/accent')}}
        />
      )}
      {ms >= povertyAt && (
        <img
          data-shape="state-scatter"
          data-role="mark"
          data-layer="scatter"
          data-box="343 488 394 470"
          src={staticFile('assets/frames/gunlaws_poverty_portrait.png')}
          alt=""
          style={{position: 'absolute', left: 343, top: 488, width: 394, height: 470, objectFit: 'contain'}}
        />
      )}
      <Beat id="laws" cue="storage" box={{x: 60, y: 990, w: 960, h: 240}} title="Safe storage and background checks" body="The laws RAND finds work." />
      <Beat id="vote" cue="tomorrow" bodyCue="systemic" box={{x: 60, y: 1250, w: 960, h: 200}} title="Today is voting day. Vote no." body="Racism, sexism, and systemic ableism." />
      <SourceLine cue="poverty" box={{x: 60, y: 1516, w: 960, h: 36}} text="Sources: CDC · Census · RAND Gun Policy in America" />
      <QrMark id="cdc-qr" cue="poverty" url="https://data.cdc.gov/d/fpsi-y8tj" x={680} y={1572} size={152} />
      <QrMark id="rand-qr" cue="storage" url="https://www.rand.org/research/gun-policy/analysis.html" x={852} y={1572} size={152} />
    </>
  );
}
