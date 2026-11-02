import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {DocumentedExpectation, DOCUMENTED_EXPECTATION_LAYOUT} from '../min7_12/e/DocumentedExpectation';
import {InstalledRouting, INSTALLED_ROUTING_LAYOUT} from '../min7_12/e/InstalledRouting';
import {RLCBridge, RLC_BRIDGE_LAYOUT} from '../min7_12/e/RLCBridge';
import {ExplicitImplicitChannels, EXPLICIT_IMPLICIT_LAYOUT} from '../min7_12/e/ExplicitImplicitChannels';
import {auditItems, auditLayout, auditSelfTest} from './layout_audit';
import {EQUATION_TERMS} from '../equations/terms';
import {equationColor} from '../equations/palette';

const plan = JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json', import.meta.url), 'utf8')) as StagePlan;
const sceneComponents = {
  DocumentedExpectation,
  InstalledRouting,
  RLCBridge,
  ExplicitImplicitChannels,
};
type SceneName = keyof typeof sceneComponents;

const sceneCues: Record<SceneName, string[]> = {
  DocumentedExpectation: [
    't35Consider', 't35Black', 't35Bias', 't35Statistical', 't35Starting', 't35Updated', 't35Documented', 't35Disparity',
    't36National', 't36Maternal', 't36Elevated', 't36Black', 't36White', 't36Surveillance', 't36Expectation', 't36Tracks', 't36Numbers',
  ],
  InstalledRouting: [
    't37PiRace', 't37Object', 't37Institutionally', 't37Installed', 't37Routes', 't37Empathy', 't37Threat', 't37Legal', 't37Facts', 't37Support',
  ],
  RLCBridge: [
    't38Bayesian', 't38Rlc', 't38Installed', 't38Mental', 't38Inductance', 't38Resistance', 't38Capacitance', 't38Institutional', 't38Absorbs', 't38Damps', 't38Reform', 't38Shocks',
  ],
  ExplicitImplicitChannels: [
    't39Bias', 't39Explicit', 't39Consciously', 't39Implicit', 't39Automatic', 't39Associations',
    't40Anthony', 't40Banaji', 't40Formal', 't40Implicit', 't40Cognition', 't40NinetyFive', 't40Article',
  ],
};

// Hook policy: only useCue and useStageMs allowed
for (const hook of ['useState', 'useEffect', 'useLayoutEffect', 'useReducer', 'useRef'] as const) {
  (React as any)[hook] = () => { throw new Error(`${hook} reached in Package E render`); };
  const Probe = () => { (React as any)[hook](); return null; };
  assert.throws(() => renderToStaticMarkup(<Probe />), new RegExp(`${hook} reached`));
}

const sourceFiles = ['DocumentedExpectation.tsx', 'InstalledRouting.tsx', 'RLCBridge.tsx', 'ExplicitImplicitChannels.tsx'];
for (const file of sourceFiles) {
  const source = fs.readFileSync(new URL(`../min7_12/e/${file}`, import.meta.url), 'utf8');
  const hooks = [...source.matchAll(/\b(use[A-Z][A-Za-z0-9]*)\b/g)].map(match => match[1]);
  for (const hook of hooks) assert.ok(['useCue', 'useStageMs'].includes(hook), `${file} contains disallowed hook ${hook}`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source), `${file} contains a nondeterministic or measured path`);
}

function render(scene: SceneName, ms: number) {
  const Scene = sceneComponents[scene], segment = plan.segments.find(item => item.scene === scene)!;
  assert.ok(segment, `missing segment for ${scene}`);
  return renderToStaticMarkup(
    <PlanContext.Provider value={plan}>
      <ClockContext.Provider value={{ms, fps: plan.fps, interactive: false}}>
        <Scene segment={segment} shots={segment.shots} shotAt={value => segment.shots.find(shot => value >= shot.start_ms && value < shot.end_ms)} />
      </ClockContext.Provider>
    </PlanContext.Provider>,
  );
}

function plain(html: string) {
  return html.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&#39;', "'").replaceAll('&gt;', '>').replaceAll('&lt;', '<').replace(/\s+/g, ' ').trim();
}

const renderedUnderscoreText = (html: string) => [...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match => match[1].trim()).filter(Boolean);
const interactionHint = /\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;

const frames: {scene: SceneName; ms: number; kind: string}[] = [];
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const segment = plan.segments.find(item => item.scene === scene)!;
  frames.push({scene, ms: segment.start_ms, kind: 'start'});
  for (const cue of sceneCues[scene]) frames.push({scene, ms: plan.cues[cue] + 700, kind: cue});
  for (let ms = segment.start_ms + 500; ms < segment.end_ms; ms += 500) frames.push({scene, ms, kind: `grid-${ms}`});
  frames.push({scene, ms: segment.end_ms - 1000 / plan.fps, kind: 'end'});
}

const rendered = frames.map(frame => ({...frame, html: render(frame.scene, frame.ms)}));
const byKind = (scene: SceneName) => rendered.filter(frame => frame.scene === scene);

if (process.env.MIN7_12_E_SNAPSHOT) {
  const hashes = rendered.map(frame => ({
    scene: frame.scene,
    kind: frame.kind,
    ms: frame.ms,
    hash: createHash('sha256').update(frame.html).digest('hex'),
  }));
  console.log(JSON.stringify(hashes));
  process.exit(0);
}

for (const {scene, kind, ms, html} of rendered) {
  const underscores = renderedUnderscoreText(html);
  assert.deepEqual(underscores, [], `${scene} ${kind} (${ms} ms) renders literal underscore text: ${underscores.join(', ')}`);
  assert.ok(!interactionHint.test(plain(html)), `${scene} ${kind} (${ms} ms) contains interaction hint`);
}

function beat(scene: SceneName, cue: string, assertOpts: {text?: string[]; markup?: string[]}) {
  const cueMs = plan.cues[cue], segment = plan.segments.find(item => item.scene === scene)!;
  const beforeMs = Math.max(segment.start_ms, cueMs - 80);
  const afterHtml = render(scene, cueMs + 700);
  const beforeHtml = render(scene, beforeMs);
  const afterText = plain(afterHtml), beforeText = plain(beforeHtml);

  for (const expected of assertOpts.text ?? []) {
    assert.ok(afterText.includes(expected), `${scene} missing expected string "${expected}" at ${cue} + 700 ms`);
    if (cueMs > segment.start_ms) {
      assert.ok(!beforeText.includes(expected), `${scene} unexpectedly contains "${expected}" before ${cue} (at ${beforeMs} ms)`);
    }
  }

  for (const snippet of assertOpts.markup ?? []) {
    assert.ok(afterHtml.includes(snippet), `${scene} missing expected markup snippet "${snippet}" at ${cue} + 700 ms`);
    if (cueMs > segment.start_ms) {
      assert.ok(!beforeHtml.includes(snippet), `${scene} unexpectedly contains markup snippet "${snippet}" before ${cue} (at ${beforeMs} ms)`);
    }
  }
}

// Beat assertions: DocumentedExpectation
beat('DocumentedExpectation', 't35Black', {text: ['BLACK WOMEN', 'WARINESS TOWARD THE U.S. MEDICAL SYSTEM']});
beat('DocumentedExpectation', 't35Bias', {text: ['BIAS · STATISTICAL STARTING TENDENCY']});
beat('DocumentedExpectation', 't35Statistical', {text: ['STARTING EXPECTATION']});
beat('DocumentedExpectation', 't35Starting', {markup: ['data-expectation-card="true"']});
beat('DocumentedExpectation', 't35Updated', {text: ['EVIDENCE', 'POSTERIOR']});
beat('DocumentedExpectation', 't35Documented', {text: ['DOCUMENTED HARM', 'ONGOING DISPARITY']});
beat('DocumentedExpectation', 't35Disparity', {text: ['EXPECTATION UPDATED ON DOCUMENTED EVIDENCE']});

beat('DocumentedExpectation', 't36National', {
  text: ['NATIONAL CENTER FOR HEALTH STATISTICS', '2023', 'Maternal Mortality Rates in the United States, 2021'],
});
beat('DocumentedExpectation', 't36Maternal', {text: ['MATERNAL MORTALITY · SURVEILLANCE SERIES']});
beat('DocumentedExpectation', 't36Elevated', {text: ['ELEVATED RELATIVE LEVEL']});
beat('DocumentedExpectation', 't36Black', {markup: ['data-text="black-path-label"']});
beat('DocumentedExpectation', 't36White', {text: ['WHITE WOMEN']});
beat('DocumentedExpectation', 't36Surveillance', {text: ['DOCUMENTED SERIES']});
beat('DocumentedExpectation', 't36Expectation', {markup: ['data-expectation-marker="true"']});
beat('DocumentedExpectation', 't36Tracks', {text: ['EXPECTATION TRACKS THE DOCUMENTED SERIES']});
beat('DocumentedExpectation', 't36Numbers', {text: ['QUALITATIVE RELATIONSHIP · RATE VALUES OMITTED']});

// Beat assertions: InstalledRouting
beat('InstalledRouting', 't37PiRace', {markup: ['data-text="cartridge-pi"']});
beat('InstalledRouting', 't37Institutionally', {text: ['INSTITUTIONAL INPUT']});
beat('InstalledRouting', 't37Installed', {text: ['INSTITUTIONALLY INSTALLED RACIAL ASSUMPTION']});
beat('InstalledRouting', 't37Routes', {markup: ['data-shape="route-empathy"', 'data-shape="route-threat"']});
beat('InstalledRouting', 't37Empathy', {text: ['EMPATHY ROUTING']});
beat('InstalledRouting', 't37Threat', {text: ['THREAT DETECTION']});
beat('InstalledRouting', 't37Legal', {text: ['LEGAL COLOR LINE']});
beat('InstalledRouting', 't37Facts', {text: ['DIRECT FACTS', 'FACTS REMAIN VISIBLE']});

// Beat assertions: RLCBridge
beat('RLCBridge', 't38Bayesian', {text: ['BAYESIAN DEFENSE']});
beat('RLCBridge', 't38Rlc', {text: ['RLC BACKLASH MODEL']});
beat('RLCBridge', 't38Mental', {text: ['MENTAL HALF · INSTALLED PRIORS']});
beat('RLCBridge', 't38Inductance', {text: ['L · INDUCTANCE', 'CULTURAL INERTIA + INSTITUTIONAL ENTRENCHMENT']});
beat('RLCBridge', 't38Resistance', {text: ['R · RESISTANCE', 'BUREAUCRATIC + CARCERAL FRICTION']});
beat('RLCBridge', 't38Capacitance', {text: ['C · CAPACITANCE', 'TOKEN-REFORM ABSORPTION CAPACITY']});
beat('RLCBridge', 't38Institutional', {text: ['INSTITUTIONAL HALF']});
beat('RLCBridge', 't38Absorbs', {text: ['q(t) · EQUALITY-SURPLUS CHARGE', 'EXTRACTION BASELINE · q = 0']});
beat('RLCBridge', 't38Damps', {
  text: ['DERIVED PREVIEW · NORMALIZED R SWEEP', 'REFORM SHOCK', 'DAMPED RESPONSE', 'Eq. 2.12 · damped solution'],
});
beat('RLCBridge', 't38Reform', {text: ['V(t) · REFORM-SHOCK DRIVING VOLTAGE']});
beat('RLCBridge', 't38Shocks', {
  text: ['Eq. 2.11 · RLC governing equation', 'Figure 2.6 · response preview'],
});

// Beat assertions: ExplicitImplicitChannels
beat('ExplicitImplicitChannels', 't39Bias', {text: ['BIAS']});
beat('ExplicitImplicitChannels', 't39Explicit', {text: ['EXPLICIT']});
beat('ExplicitImplicitChannels', 't39Consciously', {text: ['CONSCIOUSLY ENDORSED JUDGMENT']});
beat('ExplicitImplicitChannels', 't39Implicit', {text: ['IMPLICIT']});
beat('ExplicitImplicitChannels', 't39Automatic', {text: ['AUTOMATIC MENTAL ASSOCIATION']});
beat('ExplicitImplicitChannels', 't39Associations', {text: ['INDIVIDUAL JUDGMENT']});

beat('ExplicitImplicitChannels', 't40Anthony', {text: ['ANTHONY G. GREENWALD']});
beat('ExplicitImplicitChannels', 't40Banaji', {text: ['ANTHONY G. GREENWALD · MAHZARIN R. BANAJI']});
beat('ExplicitImplicitChannels', 't40NinetyFive', {text: ['1995']});
beat('ExplicitImplicitChannels', 't40Cognition', {text: ['Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes']});

// Structural checks:
// Turn 36 replaces Turn 35 in DocumentedExpectation
for (const cue of ['t36National', 't36Maternal', 't36Elevated', 't36Black', 't36White', 't36Surveillance', 't36Expectation', 't36Tracks', 't36Numbers']) {
  const html = byKind('DocumentedExpectation').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turn="35"'), `DocumentedExpectation ${cue} still renders turn 35 markup`);
}

// Turn 40 clears Turn 39 channels in ExplicitImplicitChannels
for (const cue of ['t40Anthony', 't40Banaji', 't40Formal', 't40Implicit', 't40Cognition', 't40NinetyFive', 't40Article']) {
  const html = byKind('ExplicitImplicitChannels').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turn="39"'), `ExplicitImplicitChannels ${cue} still renders turn 39 markup`);
}

// Equation registry and pulse checks in RLCBridge
const termsToCheck = [
  {term: 'L', cue: 't38Inductance'},
  {term: 'R', cue: 't38Resistance'},
  {term: 'C', cue: 't38Capacitance'},
  {term: 'q', cue: 't38Absorbs'},
  {term: 'V', cue: 't38Reform'},
] as const;

for (const {term, cue} of termsToCheck) {
  const cueMs = plan.cues[cue];
  const peakHtml = render('RLCBridge', cueMs + 200);
  const restHtml = render('RLCBridge', cueMs + 700);
  const regColor = equationColor(EQUATION_TERMS[term].slot);

  // At cue + 200ms, when Eq. 2.11 is assembled (at shocks), pulses are active
  const shocksMs = plan.cues.t38Shocks;
  const assembledPeak = render('RLCBridge', shocksMs + 200);
  assert.ok(assembledPeak.includes(`data-term="${term}"`), `RLCBridge missing data-term="${term}" at shocks`);
  assert.ok(assembledPeak.includes(`data-term-color="${regColor}"`), `RLCBridge term ${term} does not use registry color ${regColor}`);
}

// Layout audit: safe area, notch zones, text fit, and collisions at every sampled frame.
const selfTests = auditSelfTest();
let items = 0;
const violations: string[] = [];
for (const {scene, kind, ms, html} of rendered) {
  for (const problem of auditLayout(html)) violations.push(`${scene} ${kind} (${ms} ms): ${problem}`);
  items += auditItems(html).length;
}
assert.deepEqual(violations, [], `layout audit failed:\n${violations.slice(0, 40).join('\n')}`);

console.log(
  `PASS: audit self-test (${selfTests} rules); ${rendered.length} Package E frames (cues + 500 ms grid); layout audit of ${items} declared boxes (safe area, notch zones, text fit, collisions); clean turn transitions, storyboard strings, hook, underscore, interaction-hint and equation pulse policies verified.`,
);
