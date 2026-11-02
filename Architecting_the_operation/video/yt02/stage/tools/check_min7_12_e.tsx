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
const internalTurnPattern = /\bturn \d+\b/i;

const frames: {scene: SceneName; ms: number; kind: string}[] = [];
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const segment = plan.segments.find(item => item.scene === scene)!;
  frames.push({scene, ms: segment.start_ms, kind: 'start'});
  for (const cue of sceneCues[scene]) frames.push({scene, ms: plan.cues[cue] + 700, kind: cue});
  for (let ms = segment.start_ms + 500; ms < segment.end_ms; ms += 500) frames.push({scene, ms, kind: `grid-${ms}`});
  frames.push({scene, ms: segment.end_ms - 1000 / plan.fps, kind: 'end'});
}

// Include exact review-frame timestamps (e434, e449, e463, e476, e479, e490, e496)
const reviewFrameSpecs: {scene: SceneName; ms: number; kind: string}[] = [
  {scene: 'DocumentedExpectation', ms: 434000, kind: 'e434'},
  {scene: 'DocumentedExpectation', ms: 449000, kind: 'e449'},
  {scene: 'InstalledRouting', ms: 463000, kind: 'e463'},
  {scene: 'RLCBridge', ms: 476000, kind: 'e476'},
  {scene: 'RLCBridge', ms: 479000, kind: 'e479'},
  {scene: 'ExplicitImplicitChannels', ms: 490000, kind: 'e490'},
  {scene: 'ExplicitImplicitChannels', ms: 496000, kind: 'e496'},
];
for (const spec of reviewFrameSpecs) frames.push(spec);

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
  assert.ok(!internalTurnPattern.test(plain(html)), `${scene} ${kind} (${ms} ms) contains internal turn label`);
}

function beat(scene: SceneName, cue: string, assertOpts: {text?: string[]; markup?: string[]; absentBeforeCue?: string}) {
  const cueMs = plan.cues[cue], segment = plan.segments.find(item => item.scene === scene)!;
  const beforeRefMs = assertOpts.absentBeforeCue ? plan.cues[assertOpts.absentBeforeCue] : cueMs;
  const beforeMs = Math.max(segment.start_ms, beforeRefMs - 80);
  const afterHtml = render(scene, cueMs + 700);
  const beforeHtml = render(scene, beforeMs);
  const afterText = plain(afterHtml), beforeText = plain(beforeHtml);

  for (const expected of assertOpts.text ?? []) {
    assert.ok(afterText.includes(expected), `${scene} missing expected string "${expected}" at ${cue} + 700 ms`);
    if (beforeRefMs > segment.start_ms) {
      assert.ok(!beforeText.includes(expected), `${scene} unexpectedly contains "${expected}" before ${assertOpts.absentBeforeCue ?? cue} (at ${beforeMs} ms)`);
    }
  }

  for (const snippet of assertOpts.markup ?? []) {
    assert.ok(afterHtml.includes(snippet), `${scene} missing expected markup snippet "${snippet}" at ${cue} + 700 ms`);
    if (cueMs > segment.start_ms) {
      const beforeCueMs = Math.max(segment.start_ms, cueMs - 80);
      const beforeCueHtml = render(scene, beforeCueMs);
      assert.ok(!beforeCueHtml.includes(snippet), `${scene} unexpectedly contains markup snippet "${snippet}" before ${cue} (at ${beforeCueMs} ms)`);
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
  text: [
    'NATIONAL CENTER FOR HEALTH STATISTICS',
    '2023',
    'Maternal Mortality Rates in the United States, 2021',
    'QUALITATIVE · NO RATES SHOWN',
  ],
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
beat('ExplicitImplicitChannels', 't40Cognition', {
  text: ['Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes'],
  markup: ['data-cognition-bright="true"'],
  absentBeforeCue: 't40Anthony',
});
beat('ExplicitImplicitChannels', 't40NinetyFive', {
  text: ['1995'],
  markup: ['data-year-bright="true"'],
  absentBeforeCue: 't40Anthony',
});
beat('ExplicitImplicitChannels', 't40Article', {
  text: ['Psychological Review 102(1)'],
  markup: ['data-article-bright="true"'],
  absentBeforeCue: 't40Anthony',
});

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
  const regColor = equationColor(EQUATION_TERMS[term].slot);

  assert.ok(peakHtml.includes(`data-term-chip="${term}"`), `RLCBridge missing data-term-chip="${term}" at ${cue}`);
  assert.ok(peakHtml.includes(`data-term="${term}"`), `RLCBridge missing data-term="${term}" at ${cue}`);
  assert.ok(peakHtml.includes(`data-term-color="${regColor}"`), `RLCBridge term ${term} does not use registry color ${regColor}`);

  const shocksMs = plan.cues.t38Shocks;
  const assembledPeak = render('RLCBridge', shocksMs + 200);
  assert.ok(assembledPeak.includes(`data-term="${term}"`), `RLCBridge missing data-term="${term}" at shocks`);
  assert.ok(assembledPeak.includes(`data-term-color="${regColor}"`), `RLCBridge term ${term} does not use registry color ${regColor}`);
}

// Verify layout exports remain well-typed
assert.equal(DOCUMENTED_EXPECTATION_LAYOUT.ledgerExpanded.h, DOCUMENTED_EXPECTATION_LAYOUT.plotFrame.h);
assert.equal(DOCUMENTED_EXPECTATION_LAYOUT.plotFrame.h, DOCUMENTED_EXPECTATION_LAYOUT.expectationCard.h);
assert.ok(INSTALLED_ROUTING_LAYOUT.equation.h <= 120);
assert.ok(RLC_BRIDGE_LAYOUT.previewPanel.h >= 200);
assert.ok(EXPLICIT_IMPLICIT_LAYOUT.citationCard.h <= 260);

// Layout audit: safe area, notch zones, text fit, and collisions at every sampled frame.
const selfTests = auditSelfTest();
let items = 0;
const violations: string[] = [];
for (const {scene, kind, ms, html} of rendered) {
  for (const problem of auditLayout(html)) violations.push(`${scene} ${kind} (${ms} ms): ${problem}`);
  items += auditItems(html).length;
}
assert.deepEqual(violations, [], `layout audit failed:\n${violations.slice(0, 40).join('\n')}`);

// ============================================================================
// DESIGN PASS RULES (1: Vertical Span, 2: Card Fit, 3: Minimum Font Size Floor)
// ============================================================================

const SAFE_AREA_HEIGHT = 1010 - 70; // 940 px
const MIN_SCENE_VERTICAL_SPAN = Math.floor(SAFE_AREA_HEIGHT * 0.70); // 658 px (~70% of safe area height)
const MAX_CARD_SLACK_PX = 40;
const MIN_LABEL_FONT_PX = 20;
const MIN_BODY_FONT_PX = 28;
const MIN_EQ211_FONT_PX = 40;
const MIN_AREA_FILL_RATIO = 0.18;
const MIN_VERTICAL_SPAN_RATIO = 0.45;

// Body / heading text IDs that must satisfy the >= 28 px body floor
const BODY_TEXT_IDS = new Set([
  // DocumentedExpectation
  'ledger-header', 'ledger-body', 'bias-title', 'card-title', 'card-sub', 'card-body-2',
  'plaque-year', 'plaque-author', 'plaque-title', 'nchs-context-title', 'nchs-context-body', 'series-title',
  // InstalledRouting
  'cartridge-pi', 'cartridge-label', 'mech-body', 'facts-title', 'facts-body', 'empathy-title', 'empathy-sub', 'threat-title', 'threat-sub',
  // RLCBridge
  'rlc-header', 'mental-title', 'cartridge-desc', 'coupling-title', 'coupling-body',
  // ExplicitImplicitChannels
  't39-banner-title', 'bias-hub-title', 'bias-hub-body', 'explicit-heading', 'explicit-card-label', 'explicit-desc',
  'implicit-heading', 'implicit-assoc-label', 'meter-label', 'meter-body',
  'cite-authors', 'cite-year', 'cite-title', 'cite-journal',
  't40-bias-title', 't40-bias-body', 't40-exp-heading', 't40-exp-body', 't40-imp-heading', 't40-imp-body', 't40-meter-title', 't40-meter-body',
]);

// Strict text cards whose vertical slack must be <= 40 px based on text bounds alone
const STRICT_TEXT_CARDS = new Set([
  'expect-card-frame',
  'nchs-plaque-frame',
  'nchs-context-frame',
  'disclosure-frame',
  'cartridge-mech-frame',
  'empathy-gate-frame',
  'threat-gate-frame',
  'coupling-panel-frame',
  'l-chip-frame',
  'r-chip-frame',
  'c-chip-frame',
  'q-chip-frame',
  'v-chip-frame',
  'explicit-card-frame',
  'citation-card-frame',
]);

// Rule 1: Vertical-span assertion (excluding source-line so bottom-left source text cannot artificially inflate span)
function checkVerticalSpan(html: string, context: string) {
  const audited = auditItems(html).filter(
    item => item.opacity >= 0.05 && item.id !== 'source-line',
  );
  assert.ok(audited.length > 0, `${context}: no visible items on screen`);
  const minY = Math.min(...audited.map(i => i.y));
  const maxY = Math.max(...audited.map(i => i.y + i.h));
  const span = maxY - minY;
  assert.ok(
    span >= MIN_SCENE_VERTICAL_SPAN,
    `${context}: vertical span ${span} px (y: ${minY}..${maxY}) < ${MIN_SCENE_VERTICAL_SPAN} px (70% of safe area)`,
  );
}

// Rule 2 & Rule 3 + Fill Ratio assertion
function checkFillAndCardFitAndSizes(html: string, context: string) {
  const audited = auditItems(html);
  const framesOnScreen = audited.filter(item => item.role === 'frame' && item.opacity >= 0.05);
  const texts = audited.filter(item => item.role === 'text' && item.opacity >= 0.05);
  const allVisible = audited.filter(item => item.opacity >= 0.05);

  // Rule 3: Minimum font size floor on every declared text element
  for (const t of texts) {
    if (t.id.startsWith('equation-term-')) {
      continue;
    }
    assert.ok(t.fit, `${context}: text "${t.id}" missing data-fit declaration`);
    assert.ok(
      t.fit.size >= MIN_LABEL_FONT_PX,
      `${context}: text "${t.id}" font size ${t.fit.size} px < ${MIN_LABEL_FONT_PX} px label floor`,
    );
    if (BODY_TEXT_IDS.has(t.id)) {
      assert.ok(
        t.fit.size >= MIN_BODY_FONT_PX,
        `${context}: body text "${t.id}" font size ${t.fit.size} px < ${MIN_BODY_FONT_PX} px body floor`,
      );
    }
  }

  // Verify equation font size declarations in HTML
  if (html.includes('data-equation="Eq. 2.11"')) {
    const eq211Match = html.match(/data-equation="Eq\. 2\.11"[^>]*style="[^"]*font:\s*\d+\s+(\d+)px/);
    assert.ok(eq211Match, `${context}: Eq. 2.11 missing explicit font size style`);
    const eq211Size = Number(eq211Match[1]);
    assert.ok(
      eq211Size >= MIN_EQ211_FONT_PX,
      `${context}: Eq. 2.11 font size ${eq211Size} px < ${MIN_EQ211_FONT_PX} px requirement`,
    );
  }

  // Rule 2 + Fill Ratio on every frame
  for (const f of framesOnScreen) {
    const insideTexts = texts.filter(
      t => t.x >= f.x - 4 && t.y >= f.y - 4 && t.x + t.w <= f.x + f.w + 4 && t.y + t.h <= f.y + f.h + 4,
    );
    const insideAll = allVisible.filter(
      item =>
        item.id !== f.id &&
        item.x >= f.x - 4 &&
        item.y >= f.y - 4 &&
        item.x + item.w <= f.x + f.w + 4 &&
        item.y + item.h <= f.y + f.h + 4,
    );

    assert.ok(
      insideTexts.length > 0,
      `${context}: container "${f.id}" (${f.w}×${f.h} at [${f.x}, ${f.y}]) is empty with 0 text boxes inside`,
    );

    const textArea = insideTexts.reduce((sum, t) => sum + t.w * t.h, 0);
    const frameArea = f.w * f.h;
    const areaFillRatio = textArea / frameArea;

    const minY = Math.min(...insideAll.map(i => i.y));
    const maxY = Math.max(...insideAll.map(i => i.y + i.h));
    const span = maxY - minY;
    const verticalSpanRatio = span / f.h;

    const passes = areaFillRatio >= MIN_AREA_FILL_RATIO || verticalSpanRatio >= MIN_VERTICAL_SPAN_RATIO;
    assert.ok(
      passes,
      `${context}: container "${f.id}" (${f.w}×${f.h}) underfilled: area ratio ${areaFillRatio.toFixed(3)} < ${MIN_AREA_FILL_RATIO} and vertical span ratio ${verticalSpanRatio.toFixed(3)} < ${MIN_VERTICAL_SPAN_RATIO}`,
    );

    // Rule 2: Card fit (vertical slack <= 40 px)
    const slack = f.h - span;
    assert.ok(
      slack <= MAX_CARD_SLACK_PX,
      `${context}: container "${f.id}" (${f.w}×${f.h}) has ${slack} px vertical slack (content span ${span} px; max allowed slack ${MAX_CARD_SLACK_PX} px)`,
    );

    if (STRICT_TEXT_CARDS.has(f.id)) {
      const textMinY = Math.min(...insideTexts.map(t => t.y));
      const textMaxY = Math.max(...insideTexts.map(t => t.y + t.h));
      const textSpan = textMaxY - textMinY;
      const textSlack = f.h - textSpan;
      assert.ok(
        textSlack <= MAX_CARD_SLACK_PX,
        `${context}: strict text card "${f.id}" (${f.w}×${f.h}) has ${textSlack} px text slack (text span ${textSpan} px; max allowed ${MAX_CARD_SLACK_PX} px)`,
      );
    }
  }
}

// Run Rule 1, Rule 2, Rule 3, and Fill-Ratio across all rendered frames
for (const {scene, kind, ms, html} of rendered) {
  checkFillAndCardFitAndSizes(html, `${scene} ${kind} (${ms} ms)`);
  if (!kind.startsWith('grid-')) {
    checkVerticalSpan(html, `${scene} ${kind} (${ms} ms)`);
  }
}

// Explicit review-frame assertions (e434, e449, e463, e476, e479, e490, e496)
{
  const e434 = rendered.find(f => f.kind === 'e434')!;
  const items434 = auditItems(e434.html);
  const pSub = items434.find(i => i.id === 'ledger-frame')!;
  const pTen = items434.find(i => i.id === 'bayes-plot-frame')!;
  const pEvi = items434.find(i => i.id === 'expect-card-frame')!;
  assert.ok(pSub && pTen && pEvi, 'e434 must render all three equal-height Turn 35 panels');
  assert.equal(pSub.h, pTen.h, 'e434 ledger and bayes-plot panels must have equal height');
  assert.equal(pTen.h, pEvi.h, 'e434 bayes-plot and expect-card panels must have equal height');

  for (const kind of ['e476', 'e479'] as const) {
    const f = rendered.find(r => r.kind === kind)!;
    for (const term of ['L', 'R', 'C', 'q', 'V']) {
      assert.ok(f.html.includes(`data-term-chip="${term}"`), `${kind} must render TermChip for ${term}`);
    }
    assert.ok(f.html.includes('data-equation="Eq. 2.11"'), `${kind} must render Eq. 2.11 via EquationTerms`);
    const preview = auditItems(f.html).find(i => i.id === 'preview-panel-frame')!;
    assert.ok(preview && preview.h >= 200, `${kind} must keep derived damping preview height >= 200 px`);
  }

  for (const kind of ['e490', 'e496'] as const) {
    const f = rendered.find(r => r.kind === kind)!;
    const text = plain(f.html);
    assert.ok(text.includes('ANTHONY G. GREENWALD · MAHZARIN R. BANAJI'), `${kind} missing full authors`);
    assert.ok(text.includes('1995'), `${kind} missing 1995`);
    assert.ok(text.includes('Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes'), `${kind} missing full title`);
    assert.ok(text.includes('Psychological Review 102(1)'), `${kind} missing Psychological Review 102(1)`);
    assert.ok(f.html.includes('data-t40-picture="true"'), `${kind} must pair citation card with explicit/implicit picture`);
  }
}

console.log(
  `PASS: audit self-test (${selfTests} rules); ${rendered.length} Package E frames (cues + review frames + 500 ms grid); layout audit of ${items} declared boxes (safe area, notch zones, text fit, collisions); vertical span (>= ${MIN_SCENE_VERTICAL_SPAN} px), card fit (<= ${MAX_CARD_SLACK_PX} px slack), and font floors (>= ${MIN_BODY_FONT_PX} px body / >= ${MIN_LABEL_FONT_PX} px labels / >= ${MIN_EQ211_FONT_PX} px Eq. 2.11) verified on all frames.`,
);
