import React from 'react';
import {DrawLine, DrawRect, useCue, useStageMs, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 168: build the cone from the spoken sequence — five chips land bottom to top beside the
// large cone graphic (Out-group, Buffer, Enforcement, Puppet, Elite at the tip), then the caption
// locks five tiers as the minimum configuration consistent with the historical record.
export function ConeBuild({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    build: useCue('t168Build').at,
    cone: useCue('t168Cone').at,
    outgroup: useCue('t168Outgroup').at,
    base: useCue('t168Base').at,
    buffer: useCue('t168Buffer').at,
    enforcement: useCue('t168Enforcement').at,
    puppet: useCue('t168Puppet').at,
    elite: useCue('t168Elite').at,
    tip: useCue('t168Tip').at,
    five: useCue('t168Five').at,
    consistent: useCue('t168Consistent').at,
  };
  const tiers: readonly {name: string; tag?: string; tagAt?: number; at: number; y: number}[] = [
    {name: '5 · ELITE', tag: 'TIP', tagAt: cue.tip, at: cue.elite, y: 216},
    {name: '4 · PUPPET CLASS', at: cue.puppet, y: 384},
    {name: '3 · ENFORCEMENT CLASS', at: cue.enforcement, y: 551},
    {name: '2 · BUFFER CLASS', at: cue.buffer, y: 718},
    {name: '1 · OUT-GROUP', tag: 'BASE', tagAt: cue.base, at: cue.outgroup, y: 870},
  ];
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 660, h: 70}} at={cue.build}/>
    <Copy at={cue.build} box={{x: 150, y: 124, w: 620, h: 40}} size={30}>BUILD THE CONE FROM THAT SEQUENCE</Copy>
    <DrawRect box={{x: 820, y: 150, w: 980, h: 830}} startFrame={frame(cue.cone)} durationFrames={24} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    {ms >= cue.cone && <div style={{position: 'absolute', left: 860, top: 185, width: 900, height: 760}}>
      <ConeOnly width={900} height={760} model={{el: 22, az: -28}}/>
    </div>}
    {tiers.map((tier) => <React.Fragment key={tier.name}>
      <Panel box={{x: 120, y: tier.y, w: 560, h: 64}} at={tier.at}/>
      <Copy at={tier.at} box={{x: 150, y: tier.y + 16, w: 420, h: 34}} size={24}>{tier.name}</Copy>
      {tier.tag && tier.tagAt !== undefined && <Copy at={tier.tagAt} box={{x: 480, y: tier.y + 20, w: 180, h: 26}} size={19} mono tone="color/text/dim">{tier.tag}</Copy>}
      <DrawLine points={[[680, tier.y + 32], [820, tier.y + 32]]} startFrame={frame(tier.at + 200)} durationFrames={12} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
    </React.Fragment>)}
    <Copy at={cue.five} box={{x: 120, y: 950, w: 660, h: 26}} size={20} mono tone="color/fill/gold">FIVE TIERS · MINIMUM CONFIGURATION</Copy>
    <Copy at={cue.consistent} box={{x: 120, y: 980, w: 660, h: 26}} size={19} mono tone="color/text/dim">CONSISTENT WITH THE HISTORICAL RECORD</Copy>
  </Scene>;
}
