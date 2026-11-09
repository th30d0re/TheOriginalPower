import React from 'react';
import {DrawLine, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms, tokenWidth, type EquationToken} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 176–177: Eq. 2.2 written in set notation — the Refine operator applies to the dominant
// In-group I, then the split assembles term by term as spoken: I = E + P_uppet + F_enforce +
// I_buffer, with the disjoint-union caption and the four tier names under their symbols.
const SPLIT_BOX = {x: 300, y: 540, w: 1320, h: 70};
const SPLIT_SIZE = 52;
const SPLIT_TOKENS: readonly {token: EquationToken; name?: string}[] = [
  {token: {term: 'I'}},
  {token: {text: ' = '}},
  {token: {term: 'Elite'}, name: 'ELITE'},
  {token: {text: ' + '}},
  {token: {term: 'Puppet'}, name: 'PUPPET'},
  {token: {text: ' + '}},
  {token: {term: 'Enforce'}, name: 'ENFORCEMENT'},
  {token: {text: ' + '}},
  {token: {term: 'IBuffer'}, name: 'BUFFER'},
];

export function RefinementEquation({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    equation: useCue('t176Equation').at,
    vertical: useCue('t176Vertical').at,
    notation: useCue('t176Notation').at,
    operator: useCue('t176Operator').at,
    i: useCue('t176I').at,
    dominant: useCue('t176Dominant').at,
    splits: useCue('t177Splits').at,
    inGroup: useCue('t177InGroup').at,
    disjoint: useCue('t177Disjoint').at,
    union: useCue('t177Union').at,
    named: useCue('t177Named').at,
    elite: useCue('t177Elite').at,
    puppet: useCue('t177Puppet').at,
    enforcement: useCue('t177Enforcement').at,
    buffer: useCue('t177Buffer').at,
  };
  const total = SPLIT_TOKENS.reduce((sum, item) => sum + tokenWidth(item.token, SPLIT_SIZE), 0);
  let cursor = SPLIT_BOX.x + (SPLIT_BOX.w - total) / 2;
  const centers: number[] = [];
  for (const item of SPLIT_TOKENS) {
    const w = tokenWidth(item.token, SPLIT_SIZE);
    if (item.name) centers.push(cursor + w / 2);
    cursor += w;
  }
  const names = SPLIT_TOKENS.filter((item) => item.name).map((item) => item.name as string);
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 760, h: 70}} at={cue.vertical}/>
    <Copy at={cue.vertical} box={{x: 150, y: 124, w: 720, h: 40}} size={30}>EQ. 2.2 · VERTICAL REFINEMENT</Copy>
    <Copy at={cue.notation} box={{x: 920, y: 130, w: 400, h: 28}} size={20} mono tone="color/text/dim">SET NOTATION</Copy>
    <Panel box={{x: 160, y: 230, w: 1600, h: 200}} at={cue.equation}/>
    <EquationTerms equation="Eq. 2.2 · refinement operator" ms={ms} box={{x: 300, y: 290, w: 1320, h: 70}} fontSize={52} align="center"
      tokens={[{text: 'Refine(', revealAt: cue.operator}, {term: 'I', revealAt: cue.i}, {text: ')', revealAt: cue.i}]}
      pulses={{I: [cue.i, cue.dominant, cue.inGroup]}}/>
    <DrawLine points={[[960, 440], [960, 530]]} startFrame={frame(cue.splits)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <EquationTerms equation="Eq. 2.2 · disjoint union of four tiers" ms={ms} box={SPLIT_BOX} fontSize={SPLIT_SIZE} align="center"
      tokens={[
        {term: 'I', revealAt: cue.inGroup},
        {text: ' = ', revealAt: cue.disjoint},
        {term: 'Elite', revealAt: cue.elite},
        {text: ' + ', revealAt: cue.elite},
        {term: 'Puppet', revealAt: cue.puppet},
        {text: ' + ', revealAt: cue.puppet},
        {term: 'Enforce', revealAt: cue.enforcement},
        {text: ' + ', revealAt: cue.enforcement},
        {term: 'IBuffer', revealAt: cue.buffer},
      ]}
      pulses={{I: [cue.inGroup], Elite: [cue.elite], Puppet: [cue.puppet], Enforce: [cue.enforcement], IBuffer: [cue.buffer]}}/>
    <Copy at={cue.union} box={{x: 300, y: 640, w: 1320, h: 30}} size={22} align="center" tone="color/fill/gold">DISJOINT UNION · FOUR FUNCTIONAL TIERS</Copy>
    {names.map((name, i) =>
      <Copy key={name} at={cue.named + i * 140} box={{x: centers[i] - 110, y: 700, w: 220, h: 28}} size={20} align="center" tone="color/text/dim">{name}</Copy>)}
  </Scene>;
}
