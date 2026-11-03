import React from 'react';
import {staticFile} from 'remotion';
import {useStageMs} from '@stage';
import {color} from '../../../../yt02/stage/tokens';

// A clip turn plays the source reel. The episode audio already carries the excerpt from its
// in-point at the turn's start, so the picture is the same excerpt's frames, extracted at 30 fps
// from that in-point (assets/clips/<id>/f0001.jpg …): frame = (ms − turn start) × 30 / 1000.
// tools/extract_clips.sh writes the frames; its in-points carry the measured audio offsets.
export const CLIPS = {
  bostopia_psychopaths: {frames: 217, label: 'Evan George · @bostopianews · Instagram · Nov. 2, 2026'},
  bostopia_stockpile: {frames: 383, label: 'Evan George · @bostopianews · Instagram · Nov. 2, 2026'},
  bostopia_smith: {frames: 209, label: 'Evan George · @bostopianews · Instagram · Nov. 2, 2026'},
  bostopia_abusers: {frames: 308, label: 'Evan George · @bostopianews · Instagram · Nov. 2, 2026'},
  bostopia_libertarian: {frames: 430, label: 'Evan George · @bostopianews · Instagram · Nov. 2, 2026'},
  reel_a1_short: {frames: 443, label: 'Gov. Maura Healey · via @harvardseye · Instagram'},
} as const;
export type ClipId = keyof typeof CLIPS;

const FPS = 30;
const LABEL = {x: 60, y: 1700, w: 960, h: 56};

export function ClipFrames({clip, startMs}: {clip: ClipId; startMs: number}) {
  const ms = useStageMs();
  const {frames, label} = CLIPS[clip];
  const index = Math.floor(((ms - startMs) * FPS) / 1000) + 1;
  if (index < 1 || index > frames) return null;
  return (
    <div data-clip={clip} style={{position: 'absolute', inset: 0}}>
      <img
        src={staticFile(`assets/clips/${clip}/f${String(index).padStart(4, '0')}.jpg`)}
        style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover'}}
      />
      <div
        data-text={`clip-label-${clip}`}
        data-box={`${LABEL.x} ${LABEL.y} ${LABEL.w} ${LABEL.h}`}
        style={{
          position: 'absolute', left: LABEL.x, top: LABEL.y, width: LABEL.w, height: LABEL.h,
          display: 'flex', alignItems: 'center', padding: '0 20px', boxSizing: 'border-box',
          background: 'rgba(13,27,42,0.82)', borderLeft: `4px solid ${color('color/fill/gold')}`,
          font: '500 26px "IBM Plex Mono"', color: color('color/text/primary'),
        }}
      >
        {label}
      </div>
    </div>
  );
}

// True while the clip is on screen, so a scene can hold its own beats until the clip ends.
export function clipEndMs(clip: ClipId, startMs: number) {
  return startMs + (CLIPS[clip].frames * 1000) / FPS;
}
