import React from 'react';
import {interpolate} from 'remotion';
import {DrawRect, useCue, useStageMs, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, frame} from './shared';

const clampBoth = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Turn 159: the wide shot of the cone restores causal depth. The dashboard's five-tier cone
// opens on the Flat Ceiling (inside O at el −85°, the tiers eclipsed behind I_buffer) and rises
// in elevation / swings azimuth as the narration restores depth, landing on the outside view
// (el 22°, az −28°) that shows all five tiers as it locates them.
export function ConeDepth({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    wide: useCue('t159Wide').at,
    cone: useCue('t159Cone').at,
    restores: useCue('t159Restores').at,
    depth: useCue('t159Depth').at,
    tiers: useCue('t159Tiers').at,
  };
  const rise = [frame(cue.cone), frame(cue.restores), frame(cue.tiers)];
  const el = interpolate(frame(ms), rise, [-85, -85, 22], clampBoth);
  const az = interpolate(frame(ms), rise, [35, 35, -28], clampBoth);
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1000, h: 70}} at={cue.wide}/>
    <Copy at={cue.depth} box={{x: 150, y: 124, w: 900, h: 40}} size={30}>THE WIDE SHOT RESTORES CAUSAL DEPTH</Copy>
    {ms >= cue.cone && <>
      <DrawRect box={{x: 240, y: 186, w: 1440, h: 872}} startFrame={frame(cue.cone)} durationFrames={24} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
      <div style={{position: 'absolute', left: 360, top: 238, width: 1200, height: 760}}>
        <ConeOnly width={1200} height={760} model={{el, az}}/>
      </div>
    </>}
  </Scene>;
}
