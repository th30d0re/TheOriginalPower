import React from 'react';
import {useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {ClipFrames, clipEndMs} from './shared/ClipFrames';
import {Edge, Frame, Phrases, SourceLine, type PhraseSpec} from './shared/layout';
import {QrMark, cornerQr} from './shared/QrMark';

export function TheGovernor({segment}: SceneProps) {
  const ms = useStageMs();
  const done = ms >= clipEndMs('reel_a1_short', segment.start_ms);
  const healeyAt = useCue('healey').at;
  const noneAt = useCue('none').at;
  const incoherentAt = useCue('incoherent').at;
  const lines: PhraseSpec[] = [
    {id: 'ph-healey', at: healeyAt, text: 'That is Governor Healey.'},
    {id: 'ph-none', at: noneAt, text: 'A yes vote funds none of the programs she names.'},
    {id: 'ph-incoherent', at: incoherentAt, text: 'The position is incoherent.'},
  ];
  const show = done && ms >= healeyAt;
  return (
    <>
      <ClipFrames clip="reel_a1_short" startMs={segment.start_ms} />
      {show && (
        <>
          <Frame id="healey-card" x={60} y={160} w={960} h={1424} />
          <Edge id="healey-edge" x={60} y={160} h={1424} />
          <Phrases lines={lines} ms={ms} spread x={96} y={240} w={880} bottom={1460} />
        </>
      )}
      {show && <QrMark id="healey-qr" cue="healey" url="https://www.instagram.com/reel/DdoZBRXIbK5/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />}
      {show && <SourceLine at={healeyAt} text="Source: Gov. Healey, her yes-on-9 reel" />}
    </>
  );
}
