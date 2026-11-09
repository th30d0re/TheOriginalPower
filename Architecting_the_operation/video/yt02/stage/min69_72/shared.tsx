import React from 'react';
import {BootIn, DrawRect, Flicker, KitSound, MapStage, Route, StageSceneFrame, color, useProject, useStageMs, type Camera, type SceneProps} from '@stage';
import {Img, interpolate, staticFile} from 'remotion';

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

export type RouteBeat = {waypoints: [number, number][]; draw: number; color?: string; markers?: number[]; width?: number};
export type LabelBeat = {at: number; point: [number, number]; text: string};

function MapLabels({labels}: {labels: LabelBeat[]}) {
  const project = useProject(), ms = useStageMs();
  return <>{labels.map(label => {
    const [x, y] = project(label.point);
    return <g key={label.text} opacity={ms >= label.at ? 1 : 0}>
      <circle cx={x} cy={y} r={5} fill={color('color/fill/gold')}/>
      <text x={x + 12} y={y - 8} fill={color('color/text/primary')} stroke={color('color/bg/field')} strokeWidth={3} paintOrder="stroke" fontFamily="IBM Plex Mono" fontSize={14} letterSpacing={1}>{label.text}</text>
    </g>;
  })}</>;
}

/** Engraved world map used for narrated Atlantic geography. Fast fade in/out (~8 frames). */
export function AtlanticMap({camera, routes = [], labels = [], at, until}: {camera: Camera; routes?: RouteBeat[]; labels?: LabelBeat[]; at?: number; until?: number}) {
  const ms = useStageMs();
  const startMs = at ?? 0;
  const endMs = until ?? Infinity;
  if (ms < startMs || ms > endMs) return null;
  const fadeMs = (8 * 1000) / 30;
  const fadeIn = at !== undefined ? Math.min(1, Math.max(0, (ms - startMs) / fadeMs)) : 1;
  const fadeOut = until !== undefined ? Math.min(1, Math.max(0, (endMs - ms) / fadeMs)) : 1;
  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity <= 0) return null;

  return <div style={{position: 'absolute', inset: 0, opacity}}><MapStage camera={camera} projection="equalEarth" engraved width={1920} height={1080}
    land={{fill: color('color/surface/1'), stroke: color('color/line/wire'), strokeWidth: 1.1}}
    borders={{stroke: color('color/line/border'), strokeWidth: .7, opacity: .8}}
    graticule={{step: 10, stroke: color('color/line/graticule'), strokeWidth: .8, opacity: .8}}>
    {routes.map((route, i) => <Route key={i} waypoints={route.waypoints} draw={route.draw} markers={route.markers} tension={.35} convention="handoff" stroke={color(route.color ?? 'color/fill/gold')} strokeWidth={route.width ?? 4} dashOverlay={{stroke: color('color/line/hairline-strong'), strokeWidth: 1, dasharray: [2, 7]}}/>)}
    <MapLabels labels={labels}/>
  </MapStage></div>;
}

export function cameraMove(ms: number, at: number, from: Camera, to: Camera, durationMs = 1200): Camera {
  const t = interpolate(ms, [at, at + durationMs], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {center: [from.center[0] + (to.center[0] - from.center[0]) * t, from.center[1] + (to.center[1] - from.center[1]) * t], zoom: from.zoom + (to.zoom - from.zoom) * t};
}

/** Full-frame, aspect-ratio-safe Nano Banana illustration with a restrained push-in. */
export function CinematicStill({name, at, until, caption}: {name: string; at: number; until: number; caption: string}) {
  const ms = useStageMs();
  if (ms < at || ms > until) return null;
  const fadeMs = (8 * 1000) / 30;
  const fadeIn = Math.min(1, Math.max(0, (ms - at) / fadeMs));
  const fadeOut = Math.min(1, Math.max(0, (until - ms) / fadeMs));
  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity <= 0) return null;

  const p = interpolate(ms, [at, Math.max(at + 1, until)], [1, 1.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}><Img src={staticFile(`stage/YT02v2_ov/cine/${name}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${p})`}}/><div style={{position: 'absolute', left: 80, bottom: 58, font: '500 18px "IBM Plex Mono"', letterSpacing: 1.2, color: color('color/text/primary'), background: color('color/bg/field'), padding: '10px 14px'}}>{caption}</div></div>;
}
