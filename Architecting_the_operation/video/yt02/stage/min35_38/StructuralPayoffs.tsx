import React from 'react';
import {DrawRect, Flicker, useCue, useStageMs, type SceneProps} from '@stage';
import {ColoredTerm, EquationTerms, type EquationPulseMap, type EquationTermId} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 179–180: the tier labels read as structural positions — four rows pair each Eq. 2.2
// subset with its function verb (design, administer, enforce, defend the boundary) — then
// Eq. 0.3's material payoffs draw as descending benefit bars, closing on E >> P > F > B.
const ROWS: readonly {term: EquationTermId; name: string; verb: string; y: number; bar: number}[] = [
  {term: 'Elite', name: 'ELITE', verb: 'DESIGN', y: 280, bar: 740},
  {term: 'Puppet', name: 'PUPPET', verb: 'ADMINISTER', y: 420, bar: 400},
  {term: 'Enforce', name: 'ENFORCEMENT', verb: 'ENFORCE', y: 560, bar: 260},
  {term: 'IBuffer', name: 'BUFFER', verb: 'DEFEND', y: 700, bar: 180},
];

export function StructuralPayoffs({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    labels: useCue('t179Labels').at,
    structural: useCue('t179Structural').at,
    names: useCue('t179Names').at,
    design: useCue('t179Design').at,
    administer: useCue('t179Administer').at,
    enforce: useCue('t179Enforce').at,
    defend: useCue('t179Defend').at,
    boundary: useCue('t179Boundary').at,
    payoffs: useCue('t180Payoffs').at,
    chapter: useCue('t180Chapter').at,
    vastly: useCue('t180Vastly').at,
    puppet: useCue('t180Puppet').at,
    enforcement: useCue('t180Enforcement').at,
    buffer: useCue('t180Buffer').at,
  };
  const verbAt = [cue.design, cue.administer, cue.enforce, cue.defend];
  const barAt = [cue.vastly, cue.puppet, cue.enforcement, cue.buffer];
  const pulses: EquationPulseMap = {
    Elite: [cue.design, cue.vastly], Puppet: [cue.administer, cue.puppet],
    Enforce: [cue.enforce, cue.enforcement], IBuffer: [cue.defend, cue.buffer],
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 900, h: 70}} at={cue.structural}/>
    <Copy at={cue.structural} box={{x: 150, y: 124, w: 860, h: 40}} size={30}>STRUCTURAL POSITIONS · EXTRACTION CIRCUIT</Copy>
    <Copy at={cue.names} box={{x: 120, y: 196, w: 700, h: 26}} size={20} mono tone="color/text/dim">EQ. 2.2 · FOUR FUNCTIONAL SUBSETS</Copy>
    {ROWS.map((row, i) => <React.Fragment key={row.term}>
      <DrawRect box={{x: 120, y: row.y, w: 900, h: 96}} startFrame={frame(cue.labels + i * 120)} durationFrames={14} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
      <Flicker startFrame={frame(cue.names + i * 140)} durationFrames={14} beat={i === 0}>
        <div style={{position: 'absolute', left: 150, top: row.y + 22, width: 170, height: 48, font: `500 34px "IBM Plex Mono"`}}>
          <ColoredTerm term={row.term} ms={ms} pulses={pulses[row.term]} box={{x: 150, y: row.y + 22, w: 170, h: 48}}/>
        </div>
      </Flicker>
      <Copy at={cue.names + i * 140} box={{x: 350, y: row.y + 28, w: 320, h: 36}} size={26}>{row.name}</Copy>
      <Copy at={verbAt[i]} box={{x: 740, y: row.y + 30, w: 260, h: 34}} size={24} tone="color/fill/gold">{row.verb}</Copy>
      <DrawRect box={{x: 1040, y: row.y + 24, w: row.bar, h: 48}} startFrame={frame(barAt[i])} durationFrames={16} strokeToken={i === 0 ? 'color/fill/accent' : 'color/fill/gold'} fillToken={i === 0 ? 'color/fill/accent-wash' : 'color/fill/gold-wash'} glowToken={i === 0 ? 'color/fill/accent' : 'color/fill/gold'} beat/>
    </React.Fragment>)}
    <Copy at={cue.boundary} box={{x: 740, y: 748, w: 280, h: 26}} size={19} tone="color/text/dim">THE BOUNDARY</Copy>
    <Copy at={cue.payoffs} box={{x: 1040, y: 226, w: 500, h: 28}} size={20} mono tone="color/text/dim">MATERIAL PAYOFFS</Copy>
    <Copy at={cue.chapter} box={{x: 150, y: 830, w: 400, h: 26}} size={20} mono tone="color/text/dim">EQ. 0.3 · CHAPTER 0</Copy>
    <EquationTerms equation="Eq. 0.3 · benefit ordering" ms={ms} box={{x: 150, y: 870, w: 900, h: 56}} fontSize={36}
      tokens={[
        {term: 'Elite', revealAt: cue.vastly}, {text: ' >> ', revealAt: cue.vastly},
        {term: 'Puppet', revealAt: cue.puppet}, {text: ' > ', revealAt: cue.puppet},
        {term: 'Enforce', revealAt: cue.enforcement}, {text: ' > ', revealAt: cue.enforcement},
        {term: 'IBuffer', revealAt: cue.buffer},
      ]}
      pulses={{Elite: [cue.vastly], Puppet: [cue.puppet], Enforce: [cue.enforcement], IBuffer: [cue.buffer]}}/>
  </Scene>;
}
