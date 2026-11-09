import React from 'react';
import {BootIn, DrawRect, Flicker, KitSound, StageSceneFrame, color, type SceneProps} from '@stage';

export const frame = (ms: number) => Math.round(ms * 30 / 1000);
export type Box = {x: number; y: number; w: number; h: number};

export function Panel({box, at, accent = 'color/fill/gold'}: {box: Box; at: number; accent?: string}) {
  return <>
    <BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat/>
    <DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent}/>
  </>;
}

export function Copy({at, box, children, size = 28, tone = 'color/text/primary', mono = false, align = 'left'}: React.PropsWithChildren<{at: number; box: Box; size?: number; tone?: string; mono?: boolean; align?: 'left' | 'center' | 'right'}>) {
  return <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="min69-72" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px ${mono ? '"IBM Plex Mono"' : '"IBM Plex Sans"'}`, lineHeight: 1.2, color: color(tone), textAlign: align}}>{children}</div>
  </Flicker>;
}

export function Scene({segment, children}: {segment: SceneProps['segment']; children: React.ReactNode}) {
  return <StageSceneFrame segment={segment}><KitSound mode="beats">{children}</KitSound></StageSceneFrame>;
}
