import React from 'react';
import type {SceneProps} from '@stage';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, cornerQr, cornerSource} from './shared/QrMark';

export function TheRepeal(_props: SceneProps) {
  return (
    <>
      <Beat id="grant" cue="jail" until="mini14" well box={{x: 60, y: 180, w: 960, h: 220}} title="He should lose the gun." />
      <Beat id="compare" cue="mini14" box={{x: 60, y: 180, w: 960, h: 460}} title="AR-15 · Mini-14" body="Banned by name. The ban leaves it open. Same round." />
      <Beat id="date" cue="august" bodyCue="tightening" box={{x: 60, y: 680, w: 960, h: 360}} title="August 1, 2024" body="Held that day, the rifle stays. After that date is who the tightening is written against." />
      <Beat id="parts" cue="stock" box={{x: 60, y: 1080, w: 960, h: 400}} title="Stock and grip" body="What lets a smaller or disabled shooter fit and control the rifle." />
      <QrMark id="notice-qr" cue="mini14" url="https://www.mass.gov/enforcing-the-massachusetts-assault-weapons-ban" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="mini14" box={cornerSource} text="Source: Massachusetts Attorney General, 2016 notice" />
    </>
  );
}
