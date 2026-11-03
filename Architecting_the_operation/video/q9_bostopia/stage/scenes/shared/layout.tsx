import React from 'react';
import {cubicOut, progress, useStageMs} from '@stage';
import {color} from '../../../../yt02/stage/tokens';

export const LH = 1.08;
export const FLOOR = 1584;

const boxOf = (x: number, y: number, w: number, h: number) =>
  `${Math.round(x)} ${Math.round(y)} ${Math.round(w)} ${Math.round(h)}`;

export function lineCount(text: string, width: number, size: number) {
  const advance = 0.56 * size;
  const maxChars = Math.max(1, Math.floor((width + 1) / advance));
  let lines = 1;
  let current = 0;
  for (const word of text.split(' ').filter(Boolean)) {
    const length = [...word].length;
    if (current === 0) current = length;
    else if (current + 1 + length <= maxChars) current += 1 + length;
    else {
      lines += 1;
      current = length;
    }
  }
  return lines;
}

export function blockHeight(text: string, width: number, size: number, lh = LH) {
  return Math.ceil(lineCount(text, width, size) * size * lh);
}

export function Text({
  id, text, x, y, w, size, kind, weight = 500, ink, opacity = 1, lh = LH, beat,
}: {
  id: string;
  text: string;
  x: number;
  y: number;
  w: number;
  size: number;
  kind: 'phrase' | 'headline' | 'body' | 'source';
  weight?: number;
  ink?: string;
  opacity?: number;
  lh?: number;
  beat?: string;
}) {
  const h = blockHeight(text, w, size, lh);
  return (
    <div
      data-text={id}
      data-kind={kind}
      data-fit={`sans ${size} 0 ${lh}`}
      data-box={boxOf(x, y, w, h)}
      {...(beat ? {'data-beat': beat} : {})}
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, opacity,
        font: `${weight} ${size}px "IBM Plex Sans"`,
        lineHeight: lh,
        color: ink ?? color('color/text/primary'),
      }}
    >
      {text}
    </div>
  );
}

export type PhraseSpec = {id: string; at: number; until?: number; text: string};

export function layoutPhrases(
  lines: PhraseSpec[],
  ms: number,
  opts?: {x?: number; y?: number; w?: number; spread?: boolean; bottom?: number},
) {
  const x = opts?.x ?? 60;
  const w = opts?.w ?? 960;
  const shown = lines.filter(line => ms >= line.at && (line.until === undefined || ms < line.until)).slice(-3);
  const sizes = shown.length <= 1 ? [84] : shown.length === 2 ? [72, 84] : [60, 72, 84];
  const opacities = shown.length <= 1 ? [1] : shown.length === 2 ? [0.78, 1] : [0.55, 0.78, 1];
  const heights = shown.map((line, index) => blockHeight(line.text, w, sizes[index]));
  const ys: number[] = [];
  if (opts?.spread && shown.length) {
    const top = opts.y ?? 200;
    const bottom = opts.bottom ?? 1480;
    const sum = heights.reduce((total, height) => total + height, 0);
    const gap = (bottom - top - sum) / (shown.length + 1);
    let cursor = top + gap;
    for (const height of heights) {
      ys.push(cursor);
      cursor += height + gap;
    }
  } else {
    let cursor = opts?.y ?? 148;
    for (const height of heights) {
      ys.push(cursor);
      cursor += height + 14;
    }
  }
  const placed = shown.map((line, index) => ({
    ...line,
    x, y: ys[index], w, h: heights[index], size: sizes[index], opacity: opacities[index],
  }));
  const bottom = placed.length ? placed[placed.length - 1].y + placed[placed.length - 1].h : (opts?.y ?? 148);
  return {placed, bottom};
}

export function Phrases({lines, ms, spread, x, y, w, bottom}: {
  lines: PhraseSpec[];
  ms: number;
  spread?: boolean;
  x?: number;
  y?: number;
  w?: number;
  bottom?: number;
}) {
  const laid = layoutPhrases(lines, ms, {spread, x, y, w, bottom});
  return (
    <>
      {laid.placed.map((line, index) => {
        const hot = index === laid.placed.length - 1;
        const t = cubicOut(progress(ms, line.at, line.at + 480));
        return (
          <Text
            key={line.id}
            id={line.id}
            text={line.text}
            x={line.x}
            y={line.y}
            w={line.w}
            size={line.size}
            kind="phrase"
            weight={hot ? 600 : 500}
            ink={hot ? color('color/fill/gold') : color('color/text/primary')}
            opacity={line.opacity * t}
          />
        );
      })}
    </>
  );
}

export function phraseBottom(lines: PhraseSpec[], ms: number, opts?: {x?: number; y?: number; w?: number}) {
  return layoutPhrases(lines, ms, opts).bottom;
}

export function Frame({id, x, y, w, h, opacity = 1}: {id: string; x: number; y: number; w: number; h: number; opacity?: number}) {
  return (
    <div
      data-shape={id}
      data-role="frame"
      data-box={boxOf(x, y, w, h)}
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, opacity, boxSizing: 'border-box',
        background: color('color/surface/1'),
        border: `1px solid ${color('color/line/hairline')}`,
        borderRadius: 8,
      }}
    />
  );
}

export function Edge({id, x, y, h, opacity = 1}: {id: string; x: number; y: number; h: number; opacity?: number}) {
  return (
    <div
      data-shape={id}
      data-role="mark"
      data-layer={id}
      data-box={boxOf(x, y, 8, h)}
      style={{position: 'absolute', left: x, top: y, width: 8, height: h, opacity, background: color('color/fill/gold')}}
    />
  );
}

export function VBar({id, x, baseline, w, h, fill, layer = 'bars'}: {
  id: string; x: number; baseline: number; w: number; h: number; fill: string; layer?: string;
}) {
  if (h < 1) return null;
  const y = baseline - h;
  return (
    <div
      data-shape={id}
      data-role="mark"
      data-layer={layer}
      data-box={boxOf(x, y, w, h)}
      style={{position: 'absolute', left: x, top: y, width: w, height: h, background: fill, borderRadius: 6}}
    />
  );
}

export function HBar({id, x, y, w, h, fill, layer = 'bars'}: {
  id: string; x: number; y: number; w: number; h: number; fill: string; layer?: string;
}) {
  if (w < 1) return null;
  return (
    <div
      data-shape={id}
      data-role="mark"
      data-layer={layer}
      data-box={boxOf(x, y, w, h)}
      style={{position: 'absolute', left: x, top: y, width: w, height: h, background: fill, borderRadius: 6}}
    />
  );
}

export function HRule({id, x1, x2, y, opacity = 1}: {id: string; x1: number; x2: number; y: number; opacity?: number}) {
  const left = Math.min(x1, x2);
  const width = Math.abs(x2 - x1);
  return (
    <svg
      data-shape={id}
      data-role="line"
      data-box={boxOf(left, y - 2, width, 4)}
      data-points={`${x1},${y} ${x2},${y}`}
      width={width}
      height={4}
      style={{position: 'absolute', left, top: y - 2, width, height: 4, opacity}}
    >
      <line x1={x1 - left} y1={2} x2={x2 - left} y2={2} stroke={color('color/fill/gold')} strokeWidth={4} />
    </svg>
  );
}

export function SourceLine({at, text, id = 'source', x = 60, y = 1696, w = 760, until}: {
  at: number; text: string; id?: string; x?: number; y?: number; w?: number; until?: number;
}) {
  const ms = useStageMs();
  if (ms < at || (until !== undefined && ms >= until)) return null;
  const t = cubicOut(progress(ms, at, at + 420));
  return (
    <Text
      id={id}
      text={text}
      x={x}
      y={y}
      w={w}
      size={24}
      lh={1.2}
      kind="source"
      weight={400}
      ink={color('color/text/dim')}
      opacity={t}
      beat="source"
    />
  );
}

export function Poster({id, show}: {id: string; show: boolean}) {
  if (!show) return null;
  return (
    <>
      <Frame id={id} x={60} y={160} w={960} h={1424} />
      <Edge id={`${id}-edge`} x={60} y={160} h={1424} />
    </>
  );
}
