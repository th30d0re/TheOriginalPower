import React from 'react';
import {ClipFrames} from './shared/ClipFrames';
import type {SceneProps} from '@stage';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, cornerQr, cornerSource} from './shared/QrMark';

export function TheRight({segment}: SceneProps) {
  return (
    <>
      <ClipFrames clip="bostopia_libertarian" startMs={segment.start_ms} />
      <Beat id="privilege" cue="privilege" box={{x: 60, y: 180, w: 960, h: 240}} title="He calls the right a privilege." />
      <Beat id="word" cue="unalienable" box={{x: 60, y: 460, w: 960, h: 320}} title="Unalienable" body="The Declaration's word. A right the person already holds." />
      <Beat id="locke" cue="locke" bodyCue="prey" box={{x: 60, y: 820, w: 960, h: 420}} title="A worse condition than the state of nature" body="Hand the force to the legislator, and he can make a prey of them when he pleases." />
      <Beat id="animals" cue="animals" box={{x: 60, y: 1280, w: 960, h: 240}} title="Other animals carry that charge." />
      <QrMark id="locke-qr" cue="locke" url="https://press-pubs.uchicago.edu/founders/documents/v1ch17s5.html" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="locke" box={cornerSource} text="Locke, Second Treatise, §137, Founders' Constitution" />
    </>
  );
}
