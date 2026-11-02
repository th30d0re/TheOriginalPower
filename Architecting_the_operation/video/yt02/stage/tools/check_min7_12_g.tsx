import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {AllportAntipathy} from '../min7_12/g/AllportAntipathy';
import {ExceptionFence} from '../min7_12/g/ExceptionFence';
import {FiskeHandoff} from '../min7_12/g/FiskeHandoff';
import {ThreePartTaxonomy} from '../min7_12/g/ThreePartTaxonomy';
import {SAFE_AREA, auditItems, auditLayout, auditSelfTest} from './layout_audit';

const plan = JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json', import.meta.url), 'utf8')) as StagePlan;
const sceneComponents = {
  AllportAntipathy,
  ExceptionFence,
  FiskeHandoff,
  ThreePartTaxonomy,
};
type SceneName = keyof typeof sceneComponents;

const sceneCues: Record<SceneName, string[]> = {
  AllportAntipathy: [
    't47Defines',
    't47Antipathy',
    't47Faulty',
    't47Inflexible',
    't47Generalization',
    't47Felt',
    't47Expressed',
    't48Hostility',
    't48Whole',
    't48Specifically',
    't48Belongs',
    't49Bias',
    't49Prejudice',
    't49Emotional',
    't49Rigid',
    't49Stereotype',
    't49Resists',
    't49Evidence',
  ],
  ExceptionFence: [
    't50Allport',
    't50Habitual',
    't50Resist',
    't50Correcting',
    't50Strong',
    't50Facts',
    't51Contradicts',
    't51Fences',
    't51Exception',
    't51Keeping',
    't51Stereotype',
    't51Intact',
  ],
  FiskeHandoff: [
    't52Why',
    't52Fiske',
    't52Discrimination',
    't52Stereotyping',
    't52Prejudice',
    't52Third',
    't52Moves',
    't52Action',
    't53Susan',
    't53Model',
    't53NinetyEight',
    't53Fourth',
    't53Handbook',
    't53Volume',
    't53Pages',
  ],
  ThreePartTaxonomy: [
    't54Divides',
    't54Three',
    't54Stereotyping',
    't54Cognitive',
    't54Thinking',
    't54Prejudice',
    't54Affective',
    't54Feeling',
    't54Discrimination',
    't54Behavioral',
    't54Acting',
  ],
};

// Hook policy: only useCue and useStageMs allowed
for (const hook of ['useState', 'useEffect', 'useLayoutEffect', 'useReducer', 'useRef'] as const) {
  (React as any)[hook] = () => {
    throw new Error(`${hook} reached in Package G render`);
  };
  const Probe = () => {
    (React as any)[hook]();
    return null;
  };
  assert.throws(() => renderToStaticMarkup(<Probe />), new RegExp(`${hook} reached`));
}

const sourceFiles = ['AllportAntipathy.tsx', 'ExceptionFence.tsx', 'FiskeHandoff.tsx', 'ThreePartTaxonomy.tsx'];
for (const file of sourceFiles) {
  const source = fs.readFileSync(new URL(`../min7_12/g/${file}`, import.meta.url), 'utf8');
  const hooks = [...source.matchAll(/\b(use[A-Z][A-Za-z0-9]*)\b/g)].map(match => match[1]);
  for (const hook of hooks) {
    assert.ok(['useCue', 'useStageMs'].includes(hook), `${file} contains disallowed hook ${hook}`);
  }
  assert.ok(
    !/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),
    `${file} contains a nondeterministic or measured path`,
  );
}

function render(scene: SceneName, ms: number) {
  const Scene = sceneComponents[scene];
  const segment = plan.segments.find(item => item.scene === scene)!;
  assert.ok(segment, `missing segment for ${scene}`);
  return renderToStaticMarkup(
    <PlanContext.Provider value={plan}>
      <ClockContext.Provider value={{ms, fps: plan.fps, interactive: false}}>
        <Scene
          segment={segment}
          shots={segment.shots}
          shotAt={value => segment.shots.find(shot => value >= shot.start_ms && value < shot.end_ms)}
        />
      </ClockContext.Provider>
    </PlanContext.Provider>,
  );
}

function plain(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replace(/\s+/g, ' ')
    .trim();
}

const renderedUnderscoreText = (html: string) =>
  [...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match => match[1].trim()).filter(Boolean);
const interactionHint = /\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;
const internalTurnPattern = /\bturn \d+\b/i;

const frames: {scene: SceneName; ms: number; kind: string}[] = [];
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const segment = plan.segments.find(item => item.scene === scene)!;
  frames.push({scene, ms: segment.start_ms, kind: 'start'});
  for (const cue of sceneCues[scene]) frames.push({scene, ms: plan.cues[cue] + 700, kind: cue});
  for (let ms = segment.start_ms + 500; ms < segment.end_ms; ms += 500) {
    frames.push({scene, ms, kind: `grid-${ms}`});
  }
  frames.push({scene, ms: segment.end_ms - 1000 / plan.fps, kind: 'end'});
}

const rendered = frames.map(frame => ({...frame, html: render(frame.scene, frame.ms)}));
const byKind = (scene: SceneName) => rendered.filter(frame => frame.scene === scene);

if (process.env.MIN7_12_G_SNAPSHOT) {
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
  assert.deepEqual(
    underscores,
    [],
    `${scene} ${kind} (${ms} ms) renders literal underscore text: ${underscores.join(', ')}`,
  );
  assert.ok(!interactionHint.test(plain(html)), `${scene} ${kind} (${ms} ms) contains interaction hint`);
  assert.ok(!internalTurnPattern.test(plain(html)), `${scene} ${kind} (${ms} ms) contains internal turn label`);
}

function beat(scene: SceneName, cue: string, assertOpts: {text?: string[]; markup?: string[]}) {
  const cueMs = plan.cues[cue];
  const segment = plan.segments.find(item => item.scene === scene)!;
  const beforeMs = Math.max(segment.start_ms, cueMs - 80);
  const afterHtml = render(scene, cueMs + 700);
  const beforeHtml = render(scene, beforeMs);
  const afterText = plain(afterHtml);
  const beforeText = plain(beforeHtml);

  for (const expected of assertOpts.text ?? []) {
    assert.ok(afterText.includes(expected), `${scene} missing expected string "${expected}" at ${cue} + 700 ms`);
    if (cueMs > segment.start_ms) {
      assert.ok(
        !beforeText.includes(expected),
        `${scene} unexpectedly contains "${expected}" before ${cue} (at ${beforeMs} ms)`,
      );
    }
  }

  for (const snippet of assertOpts.markup ?? []) {
    assert.ok(afterHtml.includes(snippet), `${scene} missing expected markup snippet "${snippet}" at ${cue} + 700 ms`);
    if (cueMs > segment.start_ms) {
      assert.ok(
        !beforeHtml.includes(snippet),
        `${scene} unexpectedly contains markup snippet "${snippet}" before ${cue} (at ${beforeMs} ms)`,
      );
    }
  }
}

// Beat assertions: AllportAntipathy (turns 47–49)
beat('AllportAntipathy', 't47Defines', {
  text: [
    'PREJUDICE',
    'antipathy grounded in a faulty and inflexible generalization, felt internally or expressed outwardly',
    'Allport 1954, p. 9',
    '(paraphrased)',
    'Allport 1954, p. 9 · The Nature of Prejudice',
  ],
});
beat('AllportAntipathy', 't47Antipathy', {text: ['ANTIPATHY'], markup: ['data-template-panel="true"']});
beat('AllportAntipathy', 't47Faulty', {
  text: ['ERROR MARKER · FAULTY GROUP BELIEF'],
  markup: ['data-error-marker="true"'],
});
beat('AllportAntipathy', 't47Inflexible', {text: ['INFLEXIBLE · RIGID BRACES LOCKED']});
beat('AllportAntipathy', 't47Generalization', {text: ['FAULTY GENERALIZATION']});
beat('AllportAntipathy', 't47Felt', {text: ['FELT INTERNALLY']});
beat('AllportAntipathy', 't47Expressed', {text: ['EXPRESSED OUTWARDLY'], markup: ['data-target-field="true"']});
beat('AllportAntipathy', 't48Hostility', {text: ['GROUP AS A WHOLE', 'INDIVIDUAL MEMBER']});
beat('AllportAntipathy', 't48Whole', {markup: ['data-whole-boundary="true"']});
beat('AllportAntipathy', 't48Specifically', {markup: ['data-member-arrow="true"']});
beat('AllportAntipathy', 't48Belongs', {text: ['TARGETED BECAUSE OF GROUP MEMBERSHIP']});
beat('AllportAntipathy', 't49Bias', {text: ['BIAS · MENTAL LEAN'], markup: ['data-turn="49"']});
beat('AllportAntipathy', 't49Prejudice', {markup: ['data-turn49-prejudice="true"']});
beat('AllportAntipathy', 't49Emotional', {text: ['PREJUDICE · EMOTIONAL HOSTILITY']});
beat('AllportAntipathy', 't49Rigid', {text: ['RIGID SWEEPING STEREOTYPE'], markup: ['data-stereotype-gate="true"']});
beat('AllportAntipathy', 't49Stereotype', {
  text: ['GROUP TEMPLATE LOCKED IN GATE'],
  markup: ['data-gate-template="true"'],
});
beat('AllportAntipathy', 't49Resists', {
  text: ['Contrary observations stop at the closed stereotype barrier.'],
  markup: ['data-contrary-tokens="true"'],
});
beat('AllportAntipathy', 't49Evidence', {text: ['CONTRARY EVIDENCE RESISTED']});

// Beat assertions: ExceptionFence (turns 50–51)
beat('ExceptionFence', 't50Allport', {
  text: ['ALLPORT 1954', 'Allport 1954, p. 9 · The Nature of Prejudice'],
});
beat('ExceptionFence', 't50Habitual', {text: ['HABITUAL PREJUDICE', 'GROUP STEREOTYPE']});
beat('ExceptionFence', 't50Resist', {text: ['UPDATE GATE CLOSED'], markup: ['data-update-gate="true"']});
beat('ExceptionFence', 't50Correcting', {text: ['CORRECTION ATTEMPT'], markup: ['data-facts-lane="true"']});
beat('ExceptionFence', 't50Strong', {text: ['STRONG CONTRADICTORY FACTS']});
beat('ExceptionFence', 't50Facts', {markup: ['data-gate-holds="true"']});
beat('ExceptionFence', 't51Contradicts', {markup: ['data-departing-member="true"']});
beat('ExceptionFence', 't51Fences', {text: ['EXCEPTION FENCE'], markup: ['data-exception-cell="true"']});
beat('ExceptionFence', 't51Exception', {text: ['LONE EXCEPTION']});
beat('ExceptionFence', 't51Keeping', {markup: ['data-retained-field="true"']});
beat('ExceptionFence', 't51Stereotype', {text: ['STEREOTYPE RETAINED']});
beat('ExceptionFence', 't51Intact', {text: ['INTACT · ZERO REVISION'], markup: ['data-intact-lock="true"']});

// Beat assertions: FiskeHandoff (turns 52–53)
beat('FiskeHandoff', 't52Why', {
  text: ['Why does Fiske treat discrimination as its own category beside stereotyping and prejudice?'],
});
beat('FiskeHandoff', 't52Fiske', {text: ['FISKE · 3-PART'], markup: ['data-fiske-socket="true"']});
beat('FiskeHandoff', 't52Discrimination', {text: ['DISCRIMINATION'], markup: ['data-discrimination-card="true"']});
beat('FiskeHandoff', 't52Stereotyping', {
  text: ['STEREOTYPING · INTERNAL THOUGHT'],
  markup: ['data-thought-card="true"'],
});
beat('FiskeHandoff', 't52Prejudice', {
  text: ['PREJUDICE · INTERNAL FEELING'],
  markup: ['data-feeling-card="true"'],
});
beat('FiskeHandoff', 't52Third', {text: ['3 · DISCRIMINATION']});
beat('FiskeHandoff', 't52Moves', {
  text: ['MOVEMENT ACROSS THE BOUNDARY · INTERNAL STATES TO OUTWARD CONDUCT'],
  markup: ['data-thought-feeling-flow="true"'],
});
beat('FiskeHandoff', 't52Action', {text: ['OBSERVABLE OUTWARD ACTION']});
beat('FiskeHandoff', 't53Susan', {text: ['SUSAN T. FISKE'], markup: ['data-turn="53"']});
beat('FiskeHandoff', 't53Model', {markup: ['data-three-socket-motif="true"']});
beat('FiskeHandoff', 't53NinetyEight', {text: ['1998']});
beat('FiskeHandoff', 't53Fourth', {text: ['The Handbook of Social Psychology · 4th ed.']});
beat('FiskeHandoff', 't53Handbook', {text: ['Stereotyping, Prejudice, and Discrimination']});
beat('FiskeHandoff', 't53Volume', {text: ['The Handbook of Social Psychology · 4th ed. · vol. 2']});
beat('FiskeHandoff', 't53Pages', {
  text: ['The Handbook of Social Psychology · 4th ed. · vol. 2 · pp. 357–411'],
});

// Beat assertions: ThreePartTaxonomy (turn 54)
beat('ThreePartTaxonomy', 't54Divides', {text: ['FISKE’S THREE-PART MODEL', 'Fiske 1998']});
beat('ThreePartTaxonomy', 't54Three', {markup: ['data-taxonomy-bracket="true"']});
beat('ThreePartTaxonomy', 't54Stereotyping', {text: ['STEREOTYPING']});
beat('ThreePartTaxonomy', 't54Cognitive', {text: ['COGNITIVE']});
beat('ThreePartTaxonomy', 't54Thinking', {text: ['THINKING PART']});
beat('ThreePartTaxonomy', 't54Prejudice', {text: ['PREJUDICE']});
beat('ThreePartTaxonomy', 't54Affective', {text: ['AFFECTIVE']});
beat('ThreePartTaxonomy', 't54Feeling', {text: ['FEELING PART']});
beat('ThreePartTaxonomy', 't54Discrimination', {text: ['DISCRIMINATION']});
beat('ThreePartTaxonomy', 't54Behavioral', {text: ['BEHAVIORAL']});
beat('ThreePartTaxonomy', 't54Acting', {text: ['ACTING PART', 'THREE DISTINCT PSYCHOLOGICAL PARTS']});

// Structural & faded-label DOM absence checks:
// 1. AllportAntipathy: Turn 49 replaces Turns 47–48 completely
for (const cue of ['t49Bias', 't49Prejudice', 't49Emotional', 't49Rigid', 't49Stereotype', 't49Resists', 't49Evidence']) {
  const html = byKind('AllportAntipathy').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turns="47-48"'), `AllportAntipathy ${cue} still renders turns 47-48 markup`);
  assert.ok(!plain(html).includes('GROUP AS A WHOLE'), `AllportAntipathy ${cue} leaks GROUP AS A WHOLE`);
  assert.ok(!plain(html).includes('FELT INTERNALLY'), `AllportAntipathy ${cue} leaks FELT INTERNALLY`);
}

// 2. ExceptionFence: Departing member mark is active at t51Contradicts and replaced by fenced exception cell at t51Exception
{
  const htmlContradicts = byKind('ExceptionFence').find(f => f.kind === 't51Contradicts')!.html;
  assert.ok(htmlContradicts.includes('departing-member-mark'), 'ExceptionFence t51Contradicts missing departing-member-mark');
  const htmlException = byKind('ExceptionFence').find(f => f.kind === 't51Exception')!.html;
  assert.ok(!htmlException.includes('departing-member-mark'), 'ExceptionFence t51Exception still renders departing-member-mark');
  assert.ok(htmlException.includes('exception-cell-mark'), 'ExceptionFence t51Exception missing exception-cell-mark');
}

// 3. FiskeHandoff: Turn 53 replaces Turn 52 completely
for (const cue of ['t53Susan', 't53Model', 't53NinetyEight', 't53Fourth', 't53Handbook', 't53Volume', 't53Pages']) {
  const html = byKind('FiskeHandoff').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turn="52"'), `FiskeHandoff ${cue} still renders turn 52 markup`);
  assert.ok(
    !plain(html).includes('Why does Fiske treat discrimination as its own category beside stereotyping and prejudice?'),
    `FiskeHandoff ${cue} leaks turn 52 question`,
  );
}

// 4. ThreePartTaxonomy: Module sockets and initial labels are completely absent once replaced
{
  const htmlS = byKind('ThreePartTaxonomy').find(f => f.kind === 't54Stereotyping')!.html;
  assert.ok(!htmlS.includes('data-module-socket="1"'), 'ThreePartTaxonomy t54Stereotyping still renders socket 1');
  const htmlP = byKind('ThreePartTaxonomy').find(f => f.kind === 't54Prejudice')!.html;
  assert.ok(!htmlP.includes('data-module-socket="2"'), 'ThreePartTaxonomy t54Prejudice still renders socket 2');
  const htmlD = byKind('ThreePartTaxonomy').find(f => f.kind === 't54Discrimination')!.html;
  assert.ok(!htmlD.includes('data-module-socket="3"'), 'ThreePartTaxonomy t54Discrimination still renders socket 3');
  const endText = plain(byKind('ThreePartTaxonomy').find(f => f.kind === 'end')!.html);
  for (const replacedLabel of [
    'MODULE SOCKET',
    'CATEGORY SCHEMA',
    'BELIEF DIMENSION',
    'EMOTIONAL VALENCE',
    'HOSTILITY DIMENSION',
    'OUTWARD CONDUCT',
    'TREATMENT DIMENSION',
    'TRIPARTITE TAXONOMY STRUCTURE',
  ]) {
    assert.ok(!endText.includes(replacedLabel), `ThreePartTaxonomy end frame still contains "${replacedLabel}"`);
  }
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

// Polish rules (enforced across all sampled frames and settled beats):
// 1. Fill-ratio assertion: every active frame contains text and covers >= 18% area OR >= 45% vertical span.
// 2. Card-fit assertion: every active frame is no more than 40 px taller than its text block (f.h - (maxTextY - minTextY) <= 40).
// 3. Size-floor assertion: every text item has size >= 20 px; every body/definition/title/question text item has size >= 28 px.
// 4. Vertical-span assertion: settled compositions span >= 70% of safe-area height (>= 658 px), even excluding source-line.
const MIN_AREA_FILL_RATIO = 0.18;
const MIN_VERTICAL_SPAN_RATIO = 0.45;
const MAX_CARD_SLACK_PX = 40;
const MIN_COMPOSITION_SPAN_PX = Math.floor(0.7 * (SAFE_AREA.y1 - SAFE_AREA.y0)); // 658 px
const BODY_ID_PATTERNS = [
  /body/i,
  /quote/i,
  /question/i,
  /main/i,
  /authors/i,
  /book/i,
  /summary-title/i,
  /def-term/i,
  /cite-author/i,
  /cite-title/i,
  /cite-summary/i,
  /taxonomy-heading/i,
  /stereotyping-title/i,
  /prejudice-title/i,
  /discrimination-title/i,
  /thought-title/i,
  /feeling-title/i,
  /action-title/i,
  /habitual-title/i,
  /bias-block-title/i,
  /prejudice-block-title/i,
  /turn49-header-title/i,
  /t53-banner-title/i,
  /allport-tab-label/i,
  /socket-[123]-title/i,
];

function checkFillAndCardFitAndSizes(html: string, context: string) {
  const audited = auditItems(html);
  const activeFrames = audited.filter(item => item.role === 'frame' && item.opacity >= 0.05);
  const activeTexts = audited.filter(item => item.role === 'text' && item.opacity >= 0.05);

  for (const t of activeTexts) {
    assert.ok(t.fit, `${context}: text "${t.id}" missing data-fit metadata`);
    assert.ok(t.fit.size >= 20, `${context}: text "${t.id}" violates 20 px label floor (size=${t.fit.size})`);
    if (BODY_ID_PATTERNS.some(re => re.test(t.id))) {
      assert.ok(t.fit.size >= 28, `${context}: body text "${t.id}" violates 28 px body floor (size=${t.fit.size})`);
    }
  }

  for (const f of activeFrames) {
    const inside = activeTexts.filter(
      t => t.x >= f.x - 4 && t.y >= f.y - 4 && t.x + t.w <= f.x + f.w + 4 && t.y + t.h <= f.y + f.h + 4,
    );
    assert.ok(
      inside.length > 0,
      `${context}: container "${f.id}" (${f.w}×${f.h} at [${f.x}, ${f.y}]) is empty with 0 text boxes inside`,
    );

    const textArea = inside.reduce((sum, t) => sum + t.w * t.h, 0);
    const frameArea = f.w * f.h;
    const areaFillRatio = textArea / frameArea;

    const minY = Math.min(...inside.map(t => t.y));
    const maxY = Math.max(...inside.map(t => t.y + t.h));
    const textSpan = maxY - minY;
    const verticalSpanRatio = textSpan / f.h;

    assert.ok(
      areaFillRatio >= MIN_AREA_FILL_RATIO || verticalSpanRatio >= MIN_VERTICAL_SPAN_RATIO,
      `${context}: container "${f.id}" (${f.w}×${f.h}) underfilled: area ratio ${areaFillRatio.toFixed(3)} < ${MIN_AREA_FILL_RATIO} and vertical span ratio ${verticalSpanRatio.toFixed(3)} < ${MIN_VERTICAL_SPAN_RATIO}`,
    );

    const slack = f.h - textSpan;
    assert.ok(
      slack <= MAX_CARD_SLACK_PX,
      `${context}: card/frame "${f.id}" (${f.w}×${f.h}) is ${slack.toFixed(1)} px taller than its text span (${textSpan.toFixed(1)} px), exceeding ${MAX_CARD_SLACK_PX} px limit`,
    );
  }
}

function checkCompositionSpan(html: string, context: string) {
  const audited = auditItems(html).filter(item => item.opacity >= 0.05 && item.id !== 'source-line');
  assert.ok(audited.length > 0, `${context}: no visible audited items`);
  const minY = Math.min(...audited.map(i => i.y));
  const maxY = Math.max(...audited.map(i => i.y + i.h));
  const span = maxY - minY;
  assert.ok(
    span >= MIN_COMPOSITION_SPAN_PX,
    `${context}: vertical span (excluding source-line) is ${span} px < ${MIN_COMPOSITION_SPAN_PX} px (70% of safe-area height; y=${minY}..${maxY})`,
  );
}

// Run fill-ratio, card-fit, and font-size checks on EVERY sampled frame
for (const {scene, kind, ms, html} of rendered) {
  checkFillAndCardFitAndSizes(html, `${scene} ${kind} (${ms} ms)`);
}

// Run vertical-span check on every scene's end frame and every cue frame
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const endFrame = byKind(scene).find(f => f.kind === 'end')!;
  checkCompositionSpan(endFrame.html, `${scene} end`);
  for (const cue of sceneCues[scene]) {
    const frame = byKind(scene).find(f => f.kind === cue)!;
    checkCompositionSpan(frame.html, `${scene} ${cue}`);
  }
}

console.log(
  `PASS: audit self-test (${selfTests} rules); ${rendered.length} Package G frames (cues + 500 ms grid); layout audit of ${items} declared boxes (safe area, notch zones, text fit, collisions); fill-ratio, card-fit (<= 40 px slack), vertical-span (>= 658 px), and 28/20 px size-floor asserts verified; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`,
);
