import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, KitSound, StageSceneFrame, color, cubicOut, progress, type SceneProps} from '@stage';

export const frame = (ms: number) => Math.round(ms * 30 / 1000);
export const enter = (ms: number, at: number, duration = 460) => cubicOut(progress(ms, at, at + duration));

export type Box = {x: number; y: number; w: number; h: number};

export const Panel = ({box, at, accent = 'color/fill/gold', children}: {box: Box; at: number; accent?: string; children?: React.ReactNode}) => <>
  <BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat/>
  <DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent}/>{children}
</>;

export const Copy = ({at, box, children, size = 28, tone = 'color/text/primary', mono = false, align = 'left'}: {at: number; box: Box; children: React.ReactNode; size?: number; tone?: string; mono?: boolean; align?: 'left'|'center'|'right'}) => <Flicker startFrame={frame(at)} durationFrames={15} beat><div data-text="min38-41" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px ${mono ? '"IBM Plex Mono"' : '"IBM Plex Sans"'}`, lineHeight: 1.18, color: color(tone), textAlign: align}}>{children}</div></Flicker>;

export const Scene = ({segment, children}: {segment: SceneProps['segment']; children: React.ReactNode}) => <StageSceneFrame segment={segment}><KitSound mode="beats">{children}</KitSound></StageSceneFrame>;

// Resting state of a dashed path, faded in once a Trace has drawn the route. Used where the
// narration itself calls the line dashed (Figure 2.2's maintenance feedback loop).
export const DashPath = ({points, at, ms, stroke = 'color/marker/race', width = 3, dur = 500}: {points: readonly (readonly [number, number])[]; at: number; ms: number; stroke?: string; width?: number; dur?: number}) => {
  const p = enter(ms, at, dur);
  if (p <= 0) return null;
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
  return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-hidden="true">
    <path d={d} fill="none" stroke={color(stroke)} strokeWidth={width} strokeDasharray="14 10" opacity={p}/>
  </svg>;
};

// The five-requirement engineering checklist from turns 121–122, carried as a compact rail of
// numbered slots. Finished slots take a drawn tick; the active slot keeps the gold glow.
export const ChecklistRail = ({x, y, at, done, active, vertical = false, size = 56, gap = 16}: {x: number; y: number; at: number; done: readonly number[]; active: number; vertical?: boolean; size?: number; gap?: number}) => <>
  {[1, 2, 3, 4, 5].map((n, i) => {
    const bx = x + (vertical ? 0 : i * (size + gap));
    const by = y + (vertical ? i * (size + gap) : 0);
    const isDone = done.includes(n);
    const isActive = n === active;
    const stroke = isActive ? 'color/fill/gold' : 'color/line/hairline-strong';
    return <React.Fragment key={n}>
      <DrawRect box={{x: bx, y: by, w: size, h: size}} startFrame={frame(at + i * 90)} durationFrames={12} strokeToken={stroke} fillToken="color/fill/panel-render" glowToken="color/fill/gold" strokeWidth={isActive ? 3 : 2}/>
      <Copy at={at + i * 90} box={{x: bx, y: by + size / 2 - 15, w: size, h: 30}} size={24} mono align="center" tone={isActive ? 'color/fill/gold' : 'color/text/soft'}>{n}</Copy>
      {isDone && <DrawLine points={[[bx + size * .24, by + size * .54], [bx + size * .44, by + size * .72], [bx + size * .78, by + size * .28]]} startFrame={frame(at + 200 + i * 90)} durationFrames={10} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={3} origin={false} nodes={false}/>}
    </React.Fragment>;
  })}
</>;
