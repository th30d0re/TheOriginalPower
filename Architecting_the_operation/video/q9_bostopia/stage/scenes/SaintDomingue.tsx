import React from 'react';
import {ClipFrames} from './shared/ClipFrames';
import type {SceneProps} from '@stage';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, cornerQr, cornerSource} from './shared/QrMark';

export function SaintDomingue({segment}: SceneProps) {
  return (
    <>
      <ClipFrames clip="bostopia_stockpile" startMs={segment.start_ms} />
      <Beat id="source" cue="source" box={{x: 60, y: 180, w: 960, h: 240}} title="No source." body="Useless in a modern conflict. He cites no source." />
      <Beat id="bans" cue="bans" box={{x: 60, y: 440, w: 960, h: 180}} title="The state bans the AR-15" />
      <Beat id="rifles" cue="rifles" box={{x: 60, y: 640, w: 960, h: 280}} title="Rifles, 3%" body="FBI 2024 gun-murder count. 42% of that count names no firearm type." />
      <Beat id="position" cue="privileged" box={{x: 60, y: 940, w: 960, h: 200}} title="A privileged position" />
      <Beat id="protector" cue="protector" box={{x: 60, y: 1160, w: 960, h: 320}} title="Your protector" body="An easy question when this government has been your protector." />
      <QrMark id="pew-qr" cue="rifles" url="https://www.pewresearch.org/short-reads/2025/03/05/what-the-data-says-about-gun-deaths-in-the-us/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="rifles" box={cornerSource} text="Pew Research, FBI gun murders, 2024" />
    </>
  );
}
