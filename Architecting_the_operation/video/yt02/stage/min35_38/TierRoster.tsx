import React from 'react';
import {DrawLine, DrawRect, FitBox, MathText, useCue, useStageMs, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {Copy, Panel, Scene, enter, frame} from './shared';

// Turns 170–173: the roster descends the cone one tier per turn. A small cone locator holds at
// left; name chips accumulate at their tier heights (under a dim Elite chip from the previous
// scene), and the spotlight card at right carries the current tier's members and function.
export function TierRoster({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    below: useCue('t170Below').at,
    puppet: useCue('t170Puppet').at,
    politicians: useCue('t170Politicians').at,
    media: useCue('t170Media').at,
    translate: useCue('t170Translate').at,
    statutes: useCue('t170Statutes').at,
    next: useCue('t171Next').at,
    enforcement: useCue('t171Enforcement').at,
    patrols: useCue('t171Patrols').at,
    police: useCue('t171Police').at,
    legal: useCue('t171Legal').at,
    force: useCue('t171Force').at,
    beneath: useCue('t172Beneath').at,
    buffer: useCue('t172Buffer').at,
    nonElite: useCue('t172NonElite').at,
    absorb: useCue('t172Absorb').at,
    defend: useCue('t172Defend').at,
    allocation: useCue('t172Allocation').at,
    base: useCue('t173Base').at,
    outgroup: useCue('t173Outgroup').at,
    oRacialized: useCue('t173ORacialized').at,
    adjacent: useCue('t173Adjacent').at,
    extraction: useCue('t173Extraction').at,
    dispossession: useCue('t173Dispossession').at,
    containment: useCue('t173Containment').at,
  };
  const chips: readonly {name: string; at: number; y: number; dim?: boolean}[] = [
    {name: 'ELITE · E', at: cue.below, y: 218, dim: true},
    {name: 'PUPPET CLASS', at: cue.puppet, y: 342},
    {name: 'ENFORCEMENT CLASS', at: cue.enforcement, y: 465},
    {name: 'BUFFER CLASS', at: cue.buffer, y: 588},
    {name: 'OUT-GROUP', at: cue.outgroup, y: 698},
  ];
  // Each turn's spotlight holds from its tier cue until the next turn opens.
  const win = (open: number, close?: number) => enter(ms, open) * (close === undefined ? 1 : 1 - enter(ms, close));
  const puppetWin = win(cue.puppet, cue.next);
  const enforcementWin = win(cue.enforcement, cue.beneath);
  const bufferWin = win(cue.buffer, cue.base);
  const outgroupWin = win(cue.outgroup);
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 170, w: 420, h: 760}} at={cue.below}/>
    {ms >= cue.below && <div style={{position: 'absolute', left: 140, top: 200, width: 380, height: 560}}>
      <ConeOnly width={380} height={560} model={{el: 22, az: -28}}/>
    </div>}
    {chips.map((chip) => <React.Fragment key={chip.name}>
      <Panel box={{x: 660, y: chip.y, w: 460, h: 64}} at={chip.at} accent={chip.dim ? 'color/line/hairline' : 'color/fill/gold'}/>
      <Copy at={chip.at} box={{x: 690, y: chip.y + 16, w: 400, h: 34}} size={24} tone={chip.dim ? 'color/text/dim' : 'color/text/primary'}>{chip.name}</Copy>
      <DrawLine points={[[540, chip.y + 32], [660, chip.y + 32]]} startFrame={frame(chip.at + 200)} durationFrames={12} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
    </React.Fragment>)}
    <Panel box={{x: 1200, y: 170, w: 600, h: 720}} at={cue.puppet}/>
    <div style={{position: 'absolute', inset: 0, opacity: puppetWin}}>
      <FitBox text="PUPPET CLASS" x={1230} y={205} size={28} weight={600} tag="TIER P" startFrame={frame(cue.puppet)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
      <Copy at={cue.politicians} box={{x: 1230, y: 330, w: 540, h: 34}} size={26}>POLITICIANS · JUDGES</Copy>
      <Copy at={cue.media} box={{x: 1230, y: 372, w: 540, h: 34}} size={26}>ADMINISTRATORS · MEDIA</Copy>
      <Copy at={cue.translate} box={{x: 1230, y: 480, w: 540, h: 34}} size={26} tone="color/fill/gold">TRANSLATE PRIORITIES</Copy>
      <Copy at={cue.statutes} box={{x: 1230, y: 522, w: 540, h: 34}} size={24} tone="color/fill/gold">STATUTES · RULINGS · NARRATIVES</Copy>
    </div>
    <div style={{position: 'absolute', inset: 0, opacity: enforcementWin}}>
      <FitBox text="ENFORCEMENT CLASS" x={1230} y={205} size={28} weight={600} tag="TIER F" startFrame={frame(cue.enforcement)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
      <Copy at={cue.patrols} box={{x: 1230, y: 330, w: 540, h: 34}} size={26}>SLAVE PATROLS · MILITIAS</Copy>
      <Copy at={cue.police} box={{x: 1230, y: 372, w: 540, h: 34}} size={26}>POLICE · PROSECUTORS · PRISONS</Copy>
      <Copy at={cue.legal} box={{x: 1230, y: 480, w: 540, h: 34}} size={26} tone="color/fill/gold">THE LEGAL CODE</Copy>
      <Copy at={cue.force} box={{x: 1230, y: 522, w: 540, h: 34}} size={24} tone="color/marker/race">BY PHYSICAL FORCE</Copy>
    </div>
    <div style={{position: 'absolute', inset: 0, opacity: bufferWin}}>
      <FitBox text="BUFFER CLASS" x={1230} y={205} size={28} weight={600} tag="TIER I" startFrame={frame(cue.buffer)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
      <Copy at={cue.nonElite} box={{x: 1230, y: 330, w: 540, h: 34}} size={26}>NON-ELITE IN-GROUP MEMBERS</Copy>
      <Copy at={cue.absorb} box={{x: 1230, y: 440, w: 540, h: 34}} size={26} tone="color/fill/gold">ABSORB FRICTION</Copy>
      <Copy at={cue.defend} box={{x: 1230, y: 482, w: 540, h: 34}} size={26} tone="color/fill/gold">DEFEND THE HIERARCHY</Copy>
      <Copy at={cue.allocation} box={{x: 1230, y: 560, w: 540, h: 34}} size={24}>STATUS + MATERIAL ALLOCATION</Copy>
    </div>
    <div style={{position: 'absolute', inset: 0, opacity: outgroupWin}}>
      <FitBox text="OUT-GROUP" x={1230} y={205} size={28} weight={600} tag="TIER O" startFrame={frame(cue.outgroup)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
      <Copy at={cue.oRacialized} box={{x: 1230, y: 330, w: 540, h: 36}} size={26} mono tone="color/text/soft"><MathText text="O_{racialized}"/></Copy>
      <Copy at={cue.adjacent} box={{x: 1230, y: 374, w: 540, h: 34}} size={24} tone="color/text/dim">+ ADJACENT OUT-GROUPS</Copy>
      <Copy at={cue.extraction} box={{x: 1230, y: 480, w: 540, h: 34}} size={26} tone="color/marker/race">LABOR EXTRACTION</Copy>
      <Copy at={cue.dispossession} box={{x: 1230, y: 522, w: 540, h: 34}} size={26} tone="color/marker/race">LAND DISPOSSESSION</Copy>
      <Copy at={cue.containment} box={{x: 1230, y: 564, w: 540, h: 34}} size={26} tone="color/marker/race">COERCIVE CONTAINMENT</Copy>
    </div>
  </Scene>;
}
