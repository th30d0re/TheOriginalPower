import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {UnequalTreatment, UNEQUAL_TREATMENT_LAYOUT} from '../min7_12/h/UnequalTreatment';
import {InterpersonalClass, INTERPERSONAL_LAYOUT} from '../min7_12/h/InterpersonalClass';
import {LiteratureBoundary, LITERATURE_BOUNDARY_LAYOUT} from '../min7_12/h/LiteratureBoundary';
import {SAFE_AREA, auditItems, auditLayout, auditSelfTest} from './layout_audit';

const plan = JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json', import.meta.url), 'utf8')) as StagePlan;
const sceneComponents = {UnequalTreatment, InterpersonalClass, LiteratureBoundary};
type SceneName = keyof typeof sceneComponents;

const sceneCues: Record<SceneName, string[]> = {
  UnequalTreatment: [
    't55ThreePart', 't55Stereotype', 't55Belief', 't55Prejudice', 't55Hostility', 't55Discrimination', 't55Unequal', 't55Membership',
    't56Unequal', 't56Verbal', 't56Exclusion', 't56Customer', 't56Grading', 't56Refusing', 't56Apartment', 't56Qualified', 't56Tenant',
  ],
  InterpersonalClass: [
    't57Look', 't57Bias', 't57Prejudice', 't57Discrimination', 't57Fiske',
    't58Three', 't58Mental', 't58Behavioral', 't58Inside', 't58Between', 't58Direction', 't58Two',
    't59Any', 't59Skin', 't59Ancestry', 't59Bias', 't59Hostility', 't59Treat', 't59Unequally',
    't60PersonToPerson', 't60Zero', 't60Legislatures', 't60Courts', 't60Police', 't60Credit', 't60Military',
    't61Original', 't61Assigns', 't61Bias', 't61Prejudice', 't61Discrimination', 't61Interpersonal', 't61Exact', 't61Scientific',
  ],
  LiteratureBoundary: [
    't62Established', 't62Literature', 't62Ends', 't62Bias', 't62Prejudice', 't62Discrimination',
    't62PersonToPerson', 't62Standard', 't62Experimental', 't62Psychology',
  ],
};

for (const hook of ['useState', 'useEffect', 'useLayoutEffect', 'useReducer', 'useRef'] as const) {
  (React as any)[hook] = () => { throw new Error(`${hook} reached in Package H render`); };
  const Probe = () => { (React as any)[hook](); return null; };
  assert.throws(() => renderToStaticMarkup(<Probe />), new RegExp(`${hook} reached`));
}

const sourceFiles = ['UnequalTreatment.tsx', 'InterpersonalClass.tsx', 'LiteratureBoundary.tsx'];
for (const file of sourceFiles) {
  const source = fs.readFileSync(new URL(`../min7_12/h/${file}`, import.meta.url), 'utf8');
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
  return html.replace(/<[^>]+>/g, ' ').replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&#39;', "'").replaceAll('&gt;', '>').replaceAll('&lt;', '<').replace(/\s+/g, ' ').trim();
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

// Include exact review-frame timestamps (e683, e690, e712, e726, e735, e751)
const reviewFrameSpecs: {scene: SceneName; ms: number; kind: string}[] = [
  {scene: 'UnequalTreatment', ms: 683000, kind: 'e683'},
  {scene: 'UnequalTreatment', ms: 690000, kind: 'e690'},
  {scene: 'InterpersonalClass', ms: 712000, kind: 'e712'},
  {scene: 'InterpersonalClass', ms: 726000, kind: 'e726'},
  {scene: 'InterpersonalClass', ms: 735000, kind: 'e735'},
  {scene: 'LiteratureBoundary', ms: 751000, kind: 'e751'},
];
for (const spec of reviewFrameSpecs) frames.push(spec);

const rendered = frames.map(frame => ({...frame, html: render(frame.scene, frame.ms)}));
const byKind = (scene: SceneName) => rendered.filter(frame => frame.scene === scene);

if (process.env.MIN7_12_H_SNAPSHOT) {
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
  assert.deepEqual(underscores, [], `${scene} at ${kind} (${ms} ms) rendered literal subscripts: ${underscores.join(', ')}`);
  assert.ok(!interactionHint.test(plain(html)), `${scene} at ${kind} (${ms} ms) contains an interaction hint`);
  assert.ok(!internalTurnPattern.test(plain(html)), `${scene} at ${kind} (${ms} ms) contains an internal turn label`);
}

function beat(scene: SceneName, cue: string, opts: {text?: string[]; markup?: string[]}, absentBeforeCue?: string) {
  const frame = byKind(scene).find(item => item.kind === cue)!;
  assert.ok(frame, `${scene} missing frame for cue ${cue}`);
  const text = plain(frame.html);
  for (const expected of opts.text ?? []) assert.ok(text.includes(expected), `${scene} at ${cue}+700 ms is missing “${expected}”`);
  for (const expected of opts.markup ?? []) assert.ok(frame.html.includes(expected), `${scene} at ${cue}+700 ms is missing markup ${expected}`);
  const threshold = plan.cues[absentBeforeCue ?? cue];
  for (const earlier of byKind(scene)) {
    if (earlier.ms >= threshold - 1) continue;
    const earlierText = plain(earlier.html);
    for (const expected of opts.text ?? []) {
      const escaped = expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const present = new RegExp(`\\b${escaped}\\b`).test(earlierText);
      assert.ok(!present, `${scene} at ${earlier.kind} already contains “${expected}”`);
    }
  }
  return frame.html;
}

// Beat assertions: UnequalTreatment
beat('UnequalTreatment', 't55ThreePart', {text: ['STEREOTYPE', 'PREJUDICE', 'DISCRIMINATION']});
beat('UnequalTreatment', 't55Stereotype', {text: ['GROUP BELIEF']});
beat('UnequalTreatment', 't55Hostility', {text: ['EMOTIONAL HOSTILITY']});
beat('UnequalTreatment', 't55Unequal', {text: ['UNEQUAL TREATMENT']});
beat('UnequalTreatment', 't55Membership', {text: ['GROUP MEMBERSHIP']});

beat('UnequalTreatment', 't56Unequal', {
  text: ['DISCRIMINATION · OBSERVABLE ACTION', 'PERSON-TO-PERSON UNEQUAL TREATMENT'],
});
beat('UnequalTreatment', 't56Exclusion', {text: ['VERBAL EXCLUSION', 'SPEECH BOUNDARY']});
beat('UnequalTreatment', 't56Customer', {text: ['WORSE CUSTOMER SERVICE', 'SERVICE COUNTER']});
beat('UnequalTreatment', 't56Grading', {text: ['BIASED GRADING', 'GRADING SHEET']});
beat('UnequalTreatment', 't56Refusing', {text: ['RENTAL REFUSAL']});
beat('UnequalTreatment', 't56Qualified', {text: ['QUALIFIED TENANT']});

// Beat assertions: InterpersonalClass
beat('InterpersonalClass', 't57Look', {
  text: ['BIAS', 'PREJUDICE', 'DISCRIMINATION', 'STARTING TENDENCY', 'GROUP ANTIPATHY', 'UNEQUAL TREATMENT'],
});
beat('InterpersonalClass', 't57Bias', {text: ['GREENWALD & BANAJI 1995']});
beat('InterpersonalClass', 't57Prejudice', {text: ['ALLPORT 1954']});
beat('InterpersonalClass', 't57Discrimination', {text: ['FISKE 1998']});

beat('InterpersonalClass', 't58Three', {text: ['INTERPERSONAL CLASS']});
beat('InterpersonalClass', 't58Mental', {text: ['INSIDE AN INDIVIDUAL']});
beat('InterpersonalClass', 't58Behavioral', {text: ['BETWEEN INDIVIDUALS']});
beat('InterpersonalClass', 't58Direction', {text: ['GROUP A', 'GROUP B']});
beat('InterpersonalClass', 't58Two', {text: ['ANY DIRECTION BETWEEN ANY TWO SOCIAL GROUPS']});

beat('InterpersonalClass', 't59Any', {text: ['ANY HUMAN BEING']});
beat('InterpersonalClass', 't59Skin', {text: ['ANY SKIN COLOR']});
beat('InterpersonalClass', 't59Ancestry', {text: ['ANY ANCESTRY']});
beat('InterpersonalClass', 't59Bias', {text: ['MENTAL BIAS']});
beat('InterpersonalClass', 't59Hostility', {text: ['RIGID HOSTILITY']});
beat('InterpersonalClass', 't59Treat', {text: ['UNEQUAL TREATMENT'], markup: ['data-text="unequal-treatment-t59-label"']}, 't57Look');

beat('InterpersonalClass', 't60PersonToPerson', {text: ['PERSON-TO-PERSON ACTIONS']});
beat('InterpersonalClass', 't60Zero', {text: ['REQUIRES ZERO CONTROL OVER']});
beat('InterpersonalClass', 't60Legislatures', {text: ['STATE LEGISLATURES']});
beat('InterpersonalClass', 't60Courts', {text: ['APPELLATE COURTS']});
beat('InterpersonalClass', 't60Police', {text: ['POLICE DEPARTMENTS']});
beat('InterpersonalClass', 't60Credit', {text: ['CREDIT MARKETS']});
beat('InterpersonalClass', 't60Military', {text: ['MILITARY FORCE']});

beat('InterpersonalClass', 't61Original', {text: ['THE ORIGINAL POWER']});
beat('InterpersonalClass', 't61Interpersonal', {text: ['INTERPERSONAL CLASS OF SOCIAL BEHAVIOR']});
beat('InterpersonalClass', 't61Scientific', {text: ['EXACT SCIENTIFIC NAMES']});

// Beat assertions: LiteratureBoundary
beat('LiteratureBoundary', 't62Established', {text: ['ESTABLISHED EXPERIMENTAL PSYCHOLOGY']});
beat('LiteratureBoundary', 't62Literature', {
  text: [
    'BIAS · GREENWALD & BANAJI 1995',
    'PREJUDICE · ALLPORT 1954',
    'DISCRIMINATION · FISKE 1998',
  ],
});
beat('LiteratureBoundary', 't62Ends', {text: ['ESTABLISHED LITERATURE ENDS HERE']});
beat('LiteratureBoundary', 't62PersonToPerson', {text: ['PERSON-TO-PERSON OPERATIONS']});
beat('LiteratureBoundary', 't62Standard', {text: ['STANDARD DEFINITIONS']});
beat('LiteratureBoundary', 't62Psychology', {
  text: [
    'THE ORIGINAL POWER · STRUCTURAL ARGUMENT',
    'RACISM AS AN INSTITUTIONAL EXTRACTION SYSTEM',
    'STATED IN EQUATIONS',
    'TESTED AGAINST HISTORICAL ARCHIVES',
  ],
});

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

const SAFE_AREA_HEIGHT = SAFE_AREA.y1 - SAFE_AREA.y0; // 940 px
const MIN_SCENE_VERTICAL_SPAN = Math.floor(SAFE_AREA_HEIGHT * 0.70); // 658 px (~70% of safe area height)
const MAX_CARD_SLACK_PX = 40;
const MIN_LABEL_FONT_PX = 20;
const MIN_BODY_FONT_PX = 28;
const MIN_AREA_FILL_RATIO = 0.18;
const MIN_VERTICAL_SPAN_RATIO = 0.45;

// Body / heading / title text IDs that must satisfy the >= 28 px floor
const BODY_TEXT_IDS = new Set([
  // UnequalTreatment
  't55-banner-title',
  'pipeline-header-title',
  'stereotype-title',
  'stereotype-body',
  'prejudice-title',
  'prejudice-body',
  'discrimination-title',
  'discrimination-body',
  'pathway-transit-label',
  'membership-token-label',
  't56-banner-title',
  'tray-heading-label',
  'card-1-title',
  'card-1-body',
  'card-2-title',
  'card-2-body',
  'card-3-title',
  'card-3-body',
  'card-4-title',
  'card-4-body',
  // InterpersonalClass
  'interpersonal-triad-title-1',
  'interpersonal-triad-title-2',
  'interpersonal-triad-title-3',
  'locus-banner-title',
  'any-human-label',
  'group-direction-two-label',
  'person-actions-heading',
  'zero-control-heading',
  'book-title-label',
  'strip-term-bias',
  'strip-term-prejudice',
  'strip-term-discrimination',
  // LiteratureBoundary
  't62-banner-title',
  'established-psychology-heading',
  'established-sub-heading',
  'literature-socket-1-body',
  'literature-socket-2-body',
  'literature-socket-3-body',
  'literature-boundary-triad-title-1',
  'literature-boundary-triad-title-2',
  'literature-boundary-triad-title-3',
  'standard-definitions-label',
  'literature-scope-body',
  'structural-handoff-label',
  'structural-subject-title',
  'structural-subject-body',
]);

// Strict text cards whose vertical slack must be <= 40 px based on text bounds alone
const STRICT_TEXT_CARDS = new Set([
  't55-banner-frame',
  'pathway-transit-bar',
  't56-banner-frame',
  'card-1-panel',
  'card-2-panel',
  'card-3-panel',
  'card-4-panel',
  'interpersonal-triad-frame-1',
  'interpersonal-triad-frame-2',
  'interpersonal-triad-frame-3',
  'locus-banner-frame',
  'direction-banner-frame',
  'person-actions-panel',
  'direction-banner-contracted',
  'state-power-rack',
  'rack-item-1',
  'rack-item-2',
  'rack-item-3',
  'rack-item-4',
  'rack-item-5',
  'book-assignment-strip',
  'socket-strip-bias',
  'socket-strip-prejudice',
  'socket-strip-discrimination',
  't62-banner-frame',
  'established-literature-frame',
  'literature-socket-1',
  'literature-socket-2',
  'literature-socket-3',
  'structural-handoff-frame',
  'structural-continuation-socket',
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

// Rule 2 (Card Fit) & Rule 3 (Minimum Font Size Floor) + Fill-Ratio assertion
function checkFillAndCardFitAndSizes(html: string, context: string) {
  const audited = auditItems(html);
  const framesOnScreen = audited.filter(item => item.role === 'frame' && item.opacity >= 0.05);
  const texts = audited.filter(item => item.role === 'text' && item.opacity >= 0.05);
  const allVisible = audited.filter(item => item.opacity >= 0.05);

  // Rule 3: Minimum font size floor on every declared text element
  for (const t of texts) {
    if (t.id === 'terminal-boundary-label') {
      const verticalMatch = html.match(/data-text="terminal-boundary-label"[^>]*data-vertical-font-size="(\d+)"/);
      assert.ok(verticalMatch, `${context}: terminal-boundary-label missing data-vertical-font-size declaration`);
      const vSize = Number(verticalMatch[1]);
      assert.ok(
        vSize >= MIN_LABEL_FONT_PX,
        `${context}: terminal-boundary-label font size ${vSize} px < ${MIN_LABEL_FONT_PX} px label floor`,
      );
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
        `${context}: body/heading text "${t.id}" font size ${t.fit.size} px < ${MIN_BODY_FONT_PX} px body floor`,
      );
    }
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
  checkFillAndCardFitAndSizes(html, `${scene} at ${kind} (${ms} ms)`);
  checkVerticalSpan(html, `${scene} at ${kind} (${ms} ms)`);
}

// Explicit review-frame assertions (e683, e690, e712, e726, e735, e751)
{
  const e683 = rendered.find(f => f.kind === 'e683')!;
  const items683 = auditItems(e683.html);
  const pipe683 = items683.find(i => i.id === 'turn55-pipeline-frame')!;
  const sNode683 = items683.find(i => i.id === 'stereotype-node')!;
  assert.ok(pipe683 && pipe683.h >= 640, 'e683 must render enlarged centered three-stage pipeline frame');
  assert.ok(sNode683 && sNode683.h >= 460, 'e683 must render enlarged three-stage nodes');

  const e712 = rendered.find(f => f.kind === 'e712')!;
  const items712 = auditItems(e712.html);
  const leftBound712 = items712.find(i => i.id === 'group-direction-main-boundary-left')!;
  const dirBanner712 = items712.find(i => i.id === 'direction-banner-frame')!;
  assert.ok(leftBound712 && leftBound712.h >= 300, 'e712 must render scaled-up GroupDirectionField');
  assert.ok(dirBanner712 && dirBanner712.y + dirBanner712.h >= 880, 'e712 must balance the lower third down to y >= 880');

  const e726 = rendered.find(f => f.kind === 'e726')!;
  for (let k = 1; k <= 5; k++) {
    assert.ok(e726.html.includes(`data-rack-item="${k}"`), `e726 must render populated state-power rack slot ${k}`);
  }
}

// Verify layout exports remain well-typed
assert.ok(UNEQUAL_TREATMENT_LAYOUT.pipeline.h >= 640);
assert.ok(INTERPERSONAL_LAYOUT.groupFieldFull.h >= 300);
assert.ok(LITERATURE_BOUNDARY_LAYOUT.literatureField.h >= 640);

// Structural checks:
// Turn 56 clears Turn 55 pipeline: turn 55 markup absent in turn 56.
for (const cue of ['t56Unequal', 't56Verbal', 't56Exclusion', 't56Customer', 't56Grading', 't56Refusing', 't56Apartment', 't56Qualified', 't56Tenant']) {
  const html = byKind('UnequalTreatment').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turn="55"'), `UnequalTreatment ${cue} still renders turn 55 markup`);
}

// Turn 61 clears Turn 60 rack markup.
for (const cue of ['t61Original', 't61Assigns', 't61Bias', 't61Prejudice', 't61Discrimination', 't61Interpersonal', 't61Exact', 't61Scientific']) {
  const html = byKind('InterpersonalClass').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turn="60"'), `InterpersonalClass ${cue} still renders turn 60 markup`);
}

// In LiteratureBoundary: terminal boundary is present at and after t62Ends.
for (const cue of ['t62Ends', 't62Bias', 't62Prejudice', 't62Discrimination', 't62PersonToPerson', 't62Standard', 't62Experimental', 't62Psychology']) {
  const html = byKind('LiteratureBoundary').find(frame => frame.kind === cue)!.html;
  assert.ok(html.includes('data-terminal-boundary="true"'), `LiteratureBoundary ${cue} missing terminal boundary`);
}

console.log(
  `PASS: audit self-test (${selfTests} rules); ${rendered.length} Package H frames (cues + review frames + 500 ms grid); layout audit of ${items} declared boxes (safe area, notch zones, text fit, collisions); vertical span (>= ${MIN_SCENE_VERTICAL_SPAN} px), card fit (<= ${MAX_CARD_SLACK_PX} px slack), and font floors (>= ${MIN_BODY_FONT_PX} px body / >= ${MIN_LABEL_FONT_PX} px labels) verified on all frames; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`,
);
