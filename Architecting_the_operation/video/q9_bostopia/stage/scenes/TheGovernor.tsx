import React from 'react';
import type {SceneProps} from '@stage';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, cornerQr, cornerSource} from './shared/QrMark';

export function TheGovernor(_props: SceneProps) {
  return (
    <>
      <Beat id="name" cue="healey" box={{x: 60, y: 220, w: 960, h: 240}} title="Governor Healey" />
      <Beat id="programs" cue="none" box={{x: 60, y: 520, w: 960, h: 360}} title="A yes vote funds none of the programs she names." />
      <Beat id="position" cue="incoherent" box={{x: 60, y: 940, w: 960, h: 280}} title="The position is incoherent." />
      <QrMark id="healey-qr" cue="healey" url="https://www.instagram.com/reel/DdoZBRXIbK5/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="healey" box={cornerSource} text="Source: Gov. Healey, her yes-on-9 reel" />
    </>
  );
}
