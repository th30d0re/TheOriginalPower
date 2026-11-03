import React from 'react';
import {color} from '../../../../yt02/stage/tokens';
import {Frame, Text, blockHeight} from './layout';

export function WagePlane({x, y, w, h}: {x: number; y: number; w: number; h: number}) {
  const eq = 'W = ψₘ + jψₛ';
  const eqH = blockHeight(eq, w, 56);
  const side = Math.min(w - 8, h - eqH - 20);
  const ox = x + (w - side) / 2;
  const oy = y + eqH + 16;
  const pad = 64;
  const cx = side / 2;
  const cy = side / 2;
  const reach = side / 2 - pad;
  const vecLen = reach * 0.72;
  const px = cx + vecLen * 0.7071;
  const py = cy + vecLen * 0.7071;
  const x1 = cx - reach;
  const x2 = cx + reach;
  const y1 = cy - reach;
  const y2 = cy + reach;

  return (
    <>
      <Text id="wage-eq" text={eq} x={x} y={y} w={w} size={56} kind="headline" weight={600} ink={color('color/fill/gold')} />
      <Frame id="wage-plane" x={ox} y={oy} w={side} h={side} />
      <svg
        width={side}
        height={side}
        style={{position: 'absolute', left: ox, top: oy, width: side, height: side}}
      >
        <defs>
          <marker id="gold-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={color('color/fill/gold')} />
          </marker>
        </defs>

        {/* Axes */}
        <line x1={x1} y1={cy} x2={x2} y2={cy} stroke={color('color/line/hairline-strong')} strokeWidth={3} />
        <line x1={cx} y1={y1} x2={cx} y2={y2} stroke={color('color/line/hairline-strong')} strokeWidth={3} />

        {/* Projections from phaser tip to axes */}
        <line
          x1={px}
          y1={cy}
          x2={px}
          y2={py}
          stroke={color('color/fill/gold')}
          strokeWidth={2.5}
          strokeDasharray="6 6"
          opacity={0.75}
        />
        <line
          x1={cx}
          y1={py}
          x2={px}
          y2={py}
          stroke={color('color/fill/gold')}
          strokeWidth={2.5}
          strokeDasharray="6 6"
          opacity={0.75}
        />

        {/* Component projection markers */}
        <circle cx={px} cy={cy} r={6} fill={color('color/fill/gold')} />
        <circle cx={cx} cy={py} r={6} fill={color('color/fill/gold')} />

        {/* The Phaser Vector (45° into bottom right quadrant) */}
        <line
          x1={cx}
          y1={cy}
          x2={px}
          y2={py}
          stroke={color('color/fill/gold')}
          strokeWidth={4.5}
          markerEnd="url(#gold-arrow)"
        />

        {/* Tip point */}
        <circle cx={px} cy={py} r={7} fill={color('color/fill/gold')} />

        {/* Axis & Vector Labels */}
        <text
          x={x2 - 12}
          y={cy - 16}
          textAnchor="end"
          fill={color('color/fill/gold')}
          fontSize={26}
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
        >
          ψₘ (firearm / kinetic guarantee)
        </text>
        <text
          x={cx + 16}
          y={y2 - 16}
          textAnchor="start"
          fill={color('color/fill/gold')}
          fontSize={26}
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
        >
          ψₛ (status / slave patrols)
        </text>
        <text
          x={px + 16}
          y={py + 32}
          textAnchor="start"
          fill={color('color/fill/gold')}
          fontSize={32}
          fontFamily="system-ui, sans-serif"
          fontWeight={700}
        >
          W (buffer wage)
        </text>
      </svg>
    </>
  );
}
