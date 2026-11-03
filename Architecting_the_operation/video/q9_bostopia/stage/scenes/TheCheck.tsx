import React from 'react';
import {ClipFrames} from './shared/ClipFrames';
import {staticFile} from 'remotion';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark} from './shared/QrMark';

const GREEN_FRAMES = 386;

const SMALL = Array.from({length: 72}, (_, index) => {
  const column = index % 18;
  const row = Math.floor(index / 18);
  return {id: `receipt-${index}`, x: 108 + column * 36, y: 500 + row * 28};
});

export function TheCheck({segment}: SceneProps) {
  const ms = useStageMs();
  const at = useCue('receipt').at;
  const greenAt = useCue('green').at;
  const backAt = useCue('virginia').at;
  const t = cubicOut(progress(ms, at, at + 520));
  // 30 fps frames from the excerpt's in-point; the mix carries her audio from greenAt with no offset (measured).
  const greenFrame = Math.min(GREEN_FRAMES, Math.max(1, Math.floor(((ms - greenAt) * 30) / 1000) + 1));
  const showGreen = ms >= greenAt && ms < backAt;
  return (
    <>
      <ClipFrames clip="bostopia_smith" startMs={segment.start_ms} />
      <Beat id="receipt" cue="receipt" box={{x: 60, y: 180, w: 960, h: 640}} title="$50,000" body="Smith & Wesson Brands. September 25, 2024. One receipt among 3,324. 2,499 are $100 or less." />
      {ms >= at && SMALL.map(mark => (
        <div
          key={mark.id}
          data-shape={mark.id}
          data-role="mark"
          data-layer="receipts"
          data-box={`${mark.x} ${mark.y} 22 16`}
          style={{position: 'absolute', left: mark.x, top: mark.y, width: 22, height: 16, opacity: t, background: color('color/text/dim')}}
        />
      ))}
      {ms >= at && (
        <div
          data-shape="receipt-large"
          data-role="mark"
          data-layer="receipts"
          data-box="760 640 180 100"
          style={{position: 'absolute', left: 760, top: 640, width: 180, height: 100, opacity: t, background: color('color/fill/gold')}}
        />
      )}
      <Beat id="livefire" cue="fifteen" box={{x: 60, y: 840, w: 960, h: 280}} title="+50% and +32.7%" body="Basic $80 to $150. Live fire $120 to $199. LTC fee $100. Boston, Weymouth, Quincy, Rockland, and Braintree already required it." />
      <Beat id="fee" cue="license" bodyCue="arriving" box={{x: 60, y: 1140, w: 960, h: 320}} title="$200 or more" body="Poll tax about $15 a year. White median about $550,000. Black about $7,800. The household still arriving." />
      <SourceLine cue="receipt" text="Source: OCPF report 960537, receipt 17220407" />
      <SourceLine cue="fifteen" box={{x: 60, y: 1672, w: 768, h: 36}} text="Loretta Green · EOPSS live-fire report" />
      <QrMark id="report-qr" cue="fifteen" url="https://www.mass.gov/doc/section-152-live-firearms-report/download" x={676} y={1500} size={152} />
      <QrMark id="green-qr" cue="fifteen" url="https://www.instagram.com/reel/DfQYuKCBZGH/" x={848} y={1500} size={152} />
      {showGreen && (
        <img
          src={staticFile(`assets/clips/green/f${String(greenFrame).padStart(3, '0')}.jpg`)}
          alt=""
          style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, objectFit: 'cover'}}
        />
      )}
    </>
  );
}
