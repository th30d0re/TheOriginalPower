import React from 'react';
import type {SceneProps} from '@stage';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, cornerQr, cornerSource} from './shared/QrMark';

export function HisClose(_props: SceneProps) {
  return (
    <>
      <Beat id="politics" cue="libertarianism" box={{x: 60, y: 220, w: 960, h: 280}} title="Libertarianism" body="The only politics he names." />
      <Beat id="left" cue="left" box={{x: 60, y: 540, w: 960, h: 280}} title="From the left" body="This answer comes from the left." />
      <QrMark id="reel-qr" cue="libertarianism" url="https://www.instagram.com/reel/DfQS-mmArwS/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="libertarianism" box={cornerSource} text="Source: @bostopianews, Question 9 reel, Nov. 2, 2026" />
    </>
  );
}
