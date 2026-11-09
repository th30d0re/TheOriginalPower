import React from 'react';
import {interpolate} from 'remotion';
import {DrawLine, DrawRect, useCue, useStageMs, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, frame} from './shared';

const clampBoth = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const CONE_PANEL = {x: 290, y: 220, w: 1410, h: 770};
const CONE_INNER = {x: CONE_PANEL.x + 22, y: CONE_PANEL.y + 22, w: CONE_PANEL.w - 44, h: CONE_PANEL.h - 44};

// Turns 160–164: the flat two-set picture is the collapsed cone seen from inside O (al = 1, E
// hidden behind the lower tiers). Each numbered step of the narration pulls the tiers further
// off their common axis — three-tier, fourth, fifth — until all five stand apart.
export function TierSplits({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    trace: useCue('t160Trace').at,
    splits: useCue('t160Splits').at,
    step: useCue('t160Step').at,
    five: useCue('t160Five').at,
    twoTier: useCue('t161TwoTier').at,
    predicts: useCue('t161Predicts').at,
    record: useCue('t161Record').at,
    threeTier: useCue('t162ThreeTier').at,
    load: useCue('t162Load').at,
    fourth: useCue('t163Fourth').at,
    statutes: useCue('t163Statutes').at,
    fifth: useCue('t164Fifth').at,
    standing: useCue('t164Standing').at,
  };
  // Hold each alignment, then swing to the next across the beat that names it.
  const swing = (at: number) => [frame(at) - 12, frame(at) + 26];
  const al = interpolate(
    frame(ms),
    [frame(cue.twoTier), ...swing(cue.threeTier), ...swing(cue.fourth), ...swing(cue.fifth)],
    [1, 1, 0.62, 0.62, 0.3, 0.3, 0.05],
    clampBoth,
  );
  const steps: [string, number][] = [['1', cue.splits], ['2', cue.twoTier], ['3', cue.threeTier], ['4', cue.fourth], ['5', cue.fifth]];
  const captions: [number, string, string][] = [
    [cue.predicts, 'PREDICTS SHARED OPPRESSOR WEALTH', 'color/text/soft'],
    [cue.record, 'RECORD DOES NOT SHOW', 'color/marker/race'],
    [cue.load, 'BASE CARRIES THE EXTRACTED LOAD', 'color/marker/race'],
    [cue.statutes, 'TRANSLATED INTO STATUTES · RULINGS · POLICY', 'color/text/soft'],
    [cue.standing, 'BUFFER PAID IN SOCIAL STANDING', 'color/fill/gold'],
  ];
  const shown = captions.filter(([at]) => ms >= at);
  const caption = shown.length > 0 ? shown[shown.length-1] : undefined;
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1200, h: 70}} at={cue.splits}/>
    <Copy at={cue.five} box={{x: 150, y: 124, w: 1100, h: 40}} size={32}>FROM TWO SETS TO FIVE TIERS</Copy>
    <Copy at={cue.step} box={{x: 150, y: 190, w: 300, h: 26}} size={20} mono tone="color/text/dim">STEP BY STEP</Copy>
    <DrawLine points={[[212, 240], [212, 860]]} startFrame={frame(cue.trace)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
    {steps.map(([n, at], i) => {
      const y = 280 + i * 130;
      return <React.Fragment key={n}>
        <DrawRect box={{x: 180, y, w: 64, h: 64}} startFrame={frame(at)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
        <Copy at={at} box={{x: 180, y: y + 14, w: 64, h: 36}} size={30} mono align="center" tone="color/fill/gold">{n}</Copy>
      </React.Fragment>;
    })}
    <DrawRect box={CONE_PANEL} startFrame={frame(cue.splits)} durationFrames={20} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    {ms >= cue.splits && <div style={{position: 'absolute', left: CONE_INNER.x + 28, top: CONE_INNER.y + 10, width: CONE_INNER.w - 56, height: CONE_INNER.h - 20}}>
      <ConeOnly width={CONE_INNER.w - 56} height={CONE_INNER.h - 20} model={{el: 20, az: -28, al}}/>
    </div>}
    {caption && <Copy at={caption[0]} box={{x: 350, y: 1006, w: 1300, h: 30}} size={20} align="center" tone={caption[2]}>{caption[1]}</Copy>}
  </Scene>;
}
