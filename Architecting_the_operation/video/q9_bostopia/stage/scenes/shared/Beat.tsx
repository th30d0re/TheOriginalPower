import React from 'react';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import {color} from '../../../../yt02/stage/tokens';

export type Box = {x: number; y: number; w: number; h: number};

const boxOf = (x: number, y: number, w: number, h: number) => `${x} ${y} ${w} ${h}`;

function lineCount(text: string, width: number, size: number) {
  const advance = 0.56 * size;
  const maxChars = Math.max(1, Math.floor((width + 1) / advance));
  let lines = 1;
  let current = 0;
  for (const word of text.split(' ').filter(Boolean)) {
    const length = [...word].length;
    if (current === 0) current = length;
    else if (current + 1 + length <= maxChars) current += 1 + length;
    else { lines += 1; current = length; }
  }
  return lines;
}

export function Beat({
  id, cue, box, title, body, bodyCue, well, until,
}: {
  id: string;
  cue: string;
  box: Box;
  title: string;
  body?: string;
  bodyCue?: string;
  well?: boolean;
  until?: string;
}) {
  const ms = useStageMs();
  const at = useCue(cue).at;
  const bodyAt = useCue(bodyCue ?? cue).at;
  const hideAt = useCue(until ?? cue).at;
  if (ms < at || (until !== undefined && ms >= hideAt)) return null;
  const t = cubicOut(progress(ms, at, at + 520));
  const bodyT = cubicOut(progress(ms, bodyAt, bodyAt + 520));
  const innerW = box.w - 48;
  const titleLines = lineCount(title, innerW, 56);
  const titleH = titleLines * 56 * 1.15;
  const bodyTop = 28 + titleH + 16;
  const bodyH = body ? lineCount(body, innerW, 36) * 36 * 1.25 : 0;
  return (
    <div
      data-shape={id}
      data-role="frame"
      data-box={boxOf(box.x, box.y, box.w, box.h)}
      style={{
        position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, opacity: t,
        background: color(well ? 'color/surface/well' : 'color/surface/1'),
        border: `1px solid ${color('color/text/primary')}`, borderRadius: 8, boxSizing: 'border-box',
      }}
    >
      <div
        data-text={`${id}-title`}
        data-beat={cue}
        data-box={boxOf(box.x + 24, box.y + 28, box.w - 48, titleH)}
        data-fit={`sans 56 0 1.15`}
        style={{position: 'absolute', left: 24, top: 28, width: box.w - 48, font: '500 56px "IBM Plex Sans"', color: color('color/fill/gold'), lineHeight: 1.15}}
      >
        {title}
      </div>
      {body && ms >= bodyAt && (
        <div
          data-text={`${id}-body`}
          data-beat={bodyCue ?? cue}
          data-box={boxOf(box.x + 24, box.y + bodyTop, innerW, bodyH)}
          data-fit="sans 36 0 1.25"
          style={{position: 'absolute', left: 24, top: bodyTop, width: innerW, height: bodyH, opacity: bodyT, font: '400 36px "IBM Plex Sans"', color: color('color/text/dim'), lineHeight: 1.25}}
        >
          {body}
        </div>
      )}
    </div>
  );
}

export function SourceLine({cue, text, box = {x: 60, y: 1728, w: 960, h: 36}}: {cue: string; text: string; box?: Box}) {
  const ms = useStageMs();
  const at = useCue(cue).at;
  if (ms < at) return null;
  const t = cubicOut(progress(ms, at, at + 420));
  return (
    <div
      data-text="source"
      data-beat="source"
      data-box={boxOf(box.x, box.y, box.w, box.h)}
      data-fit="sans 24 0 1.2"
      style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, opacity: t, font: '400 24px "IBM Plex Sans"', color: color('color/text/dim')}}
    >
      {text}
    </div>
  );
}
