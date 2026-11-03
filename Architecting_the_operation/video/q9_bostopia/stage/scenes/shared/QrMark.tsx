import React from 'react';
import qrcode from 'qrcode-generator';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import {color} from '../../../../yt02/stage/tokens';

const boxOf = (x: number, y: number, w: number, h: number) => `${x} ${y} ${w} ${h}`;

export const cornerQr = {x: 848, y: 1616, size: 152};
export const cornerSource = {x: 60, y: 1672, w: 768, h: 36};
export const bookUrl = 'https://github.com/th30d0re/TheOriginalPower/releases';

export function QrMark({
  id, cue, url, x, y, size = 152, until,
}: {
  id: string;
  cue: string;
  url: string;
  x: number;
  y: number;
  size?: number;
  until?: string;
}) {
  const ms = useStageMs();
  const at = useCue(cue).at;
  const hideAt = useCue(until ?? cue).at;
  if (ms < at || (until !== undefined && ms >= hideAt)) return null;
  const qr = qrcode(0, 'L');
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 2;
  let path = '';
  for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) if (qr.isDark(row, col)) path += `M${col + quiet} ${row + quiet}h1v1h-1z`;
  const total = n + quiet * 2;
  const t = cubicOut(progress(ms, at, at + 520));
  return (
    <svg
      data-shape={id}
      data-role="mark"
      data-layer="qr"
      data-box={boxOf(x, y, size, size)}
      data-qr={url}
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      style={{position: 'absolute', left: x, top: y, width: size, height: size, opacity: t, borderRadius: 8}}
    >
      <rect width={total} height={total} fill={color('color/text/primary')} />
      <path d={path} fill={color('color/bg/field')} />
    </svg>
  );
}
