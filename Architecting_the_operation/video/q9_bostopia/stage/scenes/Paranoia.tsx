import React from 'react';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, cornerQr, cornerSource} from './shared/QrMark';

export function Paranoia(_props: SceneProps) {
  const ms = useStageMs();
  const at = useCue('eightyseven').at;
  const t = cubicOut(progress(ms, at, at + 640));
  const full = 800;
  return (
    <>
      <Beat id="stat" cue="eightyseven" box={{x: 60, y: 240, w: 960, h: 520}} title="+87%" body="Black women, gun ownership, 2021." />
      {ms >= at && (
        <div
          data-shape="ownership-bar"
          data-role="mark"
          data-box={`140 560 ${full} 64`}
          style={{position: 'absolute', left: 140, top: 560, width: full * t, height: 64, background: color('color/fill/gold')}}
        />
      )}
      <Beat id="called" cue="paranoia" box={{x: 60, y: 820, w: 960, h: 280}} title="He called that record paranoia." />
      <QrMark id="nssf-qr" cue="eightyseven" url="https://www.kron4.com/hidden-history/black-history-month/gun-ownership-increasing-among-black-women/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="eightyseven" box={cornerSource} text="Source: NSSF via KRON4" />
    </>
  );
}
