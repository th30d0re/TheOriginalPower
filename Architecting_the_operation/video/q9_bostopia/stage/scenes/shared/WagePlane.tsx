import React from 'react';
import {color} from '../../../../yt02/stage/tokens';
import {Frame, Text, blockHeight} from './layout';

const box = (x: number, y: number, w: number, h: number) =>
  `${Math.round(x)} ${Math.round(y)} ${Math.round(w)} ${Math.round(h)}`;

export function WagePlane({x, y, w, h}: {x: number; y: number; w: number; h: number}) {
  const eq = 'W = ψ_m + jψ_s';
  const eqH = blockHeight(eq, w, 56);
  const side = Math.min(w - 8, h - eqH - 20);
  const ox = x + (w - side) / 2;
  const oy = y + eqH + 16;
  const pad = 64;
  const cx = ox + side / 2;
  const cy = oy + side / 2;
  const reach = side / 2 - pad;
  const px = cx + reach * 0.75;
  const py = cy;
  const x1 = cx - reach;
  const x2 = cx + reach;
  const y1 = cy - reach;
  const y2 = cy + reach;
  return (
    <>
      <Text id="wage-eq" text={eq} x={x} y={y} w={w} size={56} kind="headline" weight={600} ink={color('color/fill/gold')} />
      <Frame id="wage-plane" x={ox} y={oy} w={side} h={side} />
      <svg
        data-shape="wage-axes"
        data-role="line"
        data-box={box(x1, y1, x2 - x1, y2 - y1)}
        data-points={`${x1},${cy} ${x2},${cy} ${cx},${cy} ${cx},${y1} ${cx},${y2}`}
        width={side}
        height={side}
        style={{position: 'absolute', left: ox, top: oy, width: side, height: side}}
      >
        <line x1={x1 - ox} y1={cy - oy} x2={x2 - ox} y2={cy - oy} stroke={color('color/line/hairline-strong')} strokeWidth={3} />
        <line x1={cx - ox} y1={y1 - oy} x2={cx - ox} y2={y2 - oy} stroke={color('color/line/hairline-strong')} strokeWidth={3} />
      </svg>
      <div
        data-shape="wage-point"
        data-role="mark"
        data-layer="wage-point"
        data-box={box(px - 16, py - 16, 32, 32)}
        style={{position: 'absolute', left: px - 16, top: py - 16, width: 32, height: 32, borderRadius: 16, background: color('color/fill/gold')}}
      />
      <Text id="wage-label" text="wage" x={px - 180} y={py - 78} w={140} size={40} kind="body" weight={600} ink={color('color/fill/gold')} />
      <Text id="psi-s" text="ψ_s" x={ox + side - 132} y={oy + 28} w={96} size={40} kind="body" />
      <Text id="psi-m" text="ψ_m" x={cx - 160} y={y2 - 52} w={96} size={40} kind="body" />
    </>
  );
}
