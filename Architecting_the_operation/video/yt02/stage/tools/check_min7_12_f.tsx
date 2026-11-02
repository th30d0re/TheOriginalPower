import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {ImplicitTrace, IMPLICIT_TRACE_LAYOUT} from '../min7_12/f/ImplicitTrace';
import {IATLatency, IAT_LATENCY_LAYOUT} from '../min7_12/f/IATLatency';
import {AllportQuestion, ALLPORT_QUESTION_LAYOUT} from '../min7_12/f/AllportQuestion';
import {auditItems, auditLayout, auditSelfTest} from './layout_audit';

const plan = JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json', import.meta.url), 'utf8')) as StagePlan;
const sceneComponents = {ImplicitTrace, IATLatency, AllportQuestion};
type SceneName = keyof typeof sceneComponents;

const sceneCues: Record<SceneName, string[]> = {
  ImplicitTrace: [
    't41Define', 't41Unidentified', 't41Past', 't41Favorable', 't41Unfavorable', 't41Action',
    't41Plain', 't41Experiences', 't41Shortcuts', 't41Steer', 't41Noticing',
    't42Precision', 't42Automatically', 't42Accumulated', 't42Sincerely', 't42Equal', 't42Treatment',
  ],
  IATLatency: [
    't43Three', 't43NinetyEight', 't43Anthony', 't43McGhee', 't43Schwartz', 't43Introduced',
    't43Journal', 't43Psychology',
    't44Test', 't44Automatic', 't44ResponseLatency', 't44Sorting', 't44SplitSecond',
    't44Fast', 't44Pairs', 't44Faces', 't44Words', 't44Screen',
    't45Reaction', 't45Audits', 't45Bias', 't45Mental', 't45Weighting', 't45Judgment',
  ],
  AllportQuestion: [
    't46Why', 't46Label', 't46Second', 't46Prejudice',
    't46Gordon', 't46Classic', 't46FiftyFour', 't46Nature', 't46PrejudiceTitle', 't46Nine',
  ],
};

for (const hook of ['useState', 'useEffect', 'useLayoutEffect', 'useReducer', 'useRef'] as const) {
  (React as any)[hook] = () => { throw new Error(`${hook} reached in Package F render`); };
  const Probe = () => { (React as any)[hook](); return null; };
  assert.throws(() => renderToStaticMarkup(<Probe />), new RegExp(`${hook} reached`));
}

const sourceFiles = ['ImplicitTrace.tsx', 'IATLatency.tsx', 'AllportQuestion.tsx'];
for (const file of sourceFiles) {
  const source = fs.readFileSync(new URL(`../min7_12/f/${file}`, import.meta.url), 'utf8');
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

if (process.env.MIN7_12_F_SNAPSHOT) {
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
    for (const expected of opts.text ?? []) assert.ok(!earlierText.includes(expected), `${scene} at ${earlier.kind} already contains “${expected}”`);
  }
  return frame.html;
}

// Beat assertions: ImplicitTrace
beat('ImplicitTrace', 't41Define', {
  text: [
    'IMPLICIT ATTITUDE',
    'traces of past experience that shape favorable or unfavorable feeling, thought, or action toward social objects',
    '(paraphrased)',
    'Greenwald & Banaji 1995',
  ],
});
beat('ImplicitTrace', 't41Unidentified', {text: ['INTROSPECTIVELY UNIDENTIFIED TRACE']});
beat('ImplicitTrace', 't41Past', {text: ['PAST EXPERIENCE']});
beat('ImplicitTrace', 't41Favorable', {text: ['+ FAVORABLE']});
beat('ImplicitTrace', 't41Unfavorable', {text: ['− UNFAVORABLE']});
beat('ImplicitTrace', 't41Action', {text: ['FEELING', 'THOUGHT'], markup: ['socket-action']});
beat('ImplicitTrace', 't41Plain', {text: ['IN PLAIN WORDS']});
beat('ImplicitTrace', 't41Experiences', {text: ['PAST EXPERIENCES']});
beat('ImplicitTrace', 't41Shortcuts', {text: ['MENTAL SHORTCUT']});
beat('ImplicitTrace', 't41Steer', {markup: ['data-shortcut="true"']});
beat('ImplicitTrace', 't41Noticing', {markup: ['data-reaction-rail="true"']});

beat('ImplicitTrace', 't42Precision', {
  text: ['AUTOMATIC ASSOCIATION', 'SINCERE EQUAL-TREATMENT BELIEF', 'ONE PERSON'],
});
beat('ImplicitTrace', 't42Automatically', {text: ['ACCUMULATED SURROUNDINGS']});
beat('ImplicitTrace', 't42Equal', {markup: ['equal-treatment']});
beat('ImplicitTrace', 't42Treatment', {markup: ['response-node', 'response-title']});

// Beat assertions: IATLatency
beat('IATLatency', 't43NinetyEight', {text: ['1998']});
beat('IATLatency', 't43Anthony', {text: ['ANTHONY GREENWALD']});
beat('IATLatency', 't43McGhee', {text: ['DEBBIE MCGHEE']});
beat('IATLatency', 't43Schwartz', {text: ['ANTHONY GREENWALD · DEBBIE MCGHEE · JORDAN SCHWARTZ']});
beat('IATLatency', 't43Introduced', {text: ['IMPLICIT ASSOCIATION TEST']});
beat('IATLatency', 't43Journal', {text: ['Journal of Personality and Social Psychology']});

beat('IATLatency', 't44Test', {
  text: ['DERIVED FACE + WORD SORTING TASK', 'DERIVED ILLUSTRATION · NO TEST SCORE'],
});
beat('IATLatency', 't44ResponseLatency', {text: ['RESPONSE LATENCY']});
beat('IATLatency', 't44Sorting', {text: ['LEFT KEY', 'RIGHT KEY']});
beat('IATLatency', 't44Fast', {text: ['FASTER RESPONSE', 'SLOWER RESPONSE']});
beat('IATLatency', 't44Faces', {markup: ['data-face-card="true"']});
beat('IATLatency', 't44Words', {markup: ['data-word-card="true"']});
beat('IATLatency', 't44SplitSecond', {text: ['LATENCY DIFFERENCE']});
beat('IATLatency', 't44Screen', {text: ['DERIVED SORTING TASK · LATENCY DIFFERENCE']});

beat('IATLatency', 't45Reaction', {text: ['REACTION-TIME MEASURE']});
beat('IATLatency', 't45Audits', {text: ['FIELD-AUDIT MEASURE']});
beat('IATLatency', 't45Bias', {text: ['BIAS']});
beat('IATLatency', 't45Mental', {text: ['MENTAL LEAN']});
beat('IATLatency', 't45Weighting', {text: ['JUDGMENT WEIGHTING']});
beat('IATLatency', 't45Judgment', {text: ['INDIVIDUAL JUDGMENT']});

// Beat assertions: AllportQuestion
beat('AllportQuestion', 't46Why', {text: ['Why does prejudice need its own label once bias is defined?']});
beat('AllportQuestion', 't46Label', {text: ['BIAS · STARTING TENDENCY']});
beat('AllportQuestion', 't46Second', {text: ['2 · PREJUDICE']});
beat('AllportQuestion', 't46Gordon', {text: ['GORDON W. ALLPORT']});
beat('AllportQuestion', 't46FiftyFour', {text: ['1954']});
beat('AllportQuestion', 't46PrejudiceTitle', {text: ['The Nature of Prejudice']});
beat('AllportQuestion', 't46Nine', {text: ['Allport 1954, p. 9']});

// Layout audit: safe area, notch zones, text fit, and collisions at every sampled frame.
const selfTests = auditSelfTest();
let items = 0;
const violations: string[] = [];
for (const {scene, kind, ms, html} of rendered) {
  for (const problem of auditLayout(html)) violations.push(`${scene} ${kind} (${ms} ms): ${problem}`);
  items += auditItems(html).length;
}
assert.deepEqual(violations, [], `layout audit failed:\n${violations.slice(0, 40).join('\n')}`);

// Fill-ratio assertion:
// Every box on screen holds its content at its last beat. All panels, cards, and windows are populated.
// At each scene's last frame, every declared data-shape frame (with effective opacity >= 0.05) must contain
// declared text boxes that cover enough of its geometry.
// Documented thresholds:
//   - An empty container (0 text boxes) is a defect.
//   - Either area fill ratio >= 0.18 (18% of frame area covered by declared text boxes),
//   - OR vertical span ratio >= 0.45 (declared text bounds cover at least 45% of the frame's height),
// ensuring every container is sized to its content and holds its storyboard content.
const MIN_AREA_FILL_RATIO = 0.18;
const MIN_VERTICAL_SPAN_RATIO = 0.45;

function checkFillRatio(html: string, context: string) {
  const audited = auditItems(html);
  const frames = audited.filter(item => item.role === 'frame' && item.opacity >= 0.05);
  const texts = audited.filter(item => item.role === 'text' && item.opacity >= 0.05);

  for (const f of frames) {
    const inside = texts.filter(
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
    const verticalSpanRatio = (maxY - minY) / f.h;

    const passes = areaFillRatio >= MIN_AREA_FILL_RATIO || verticalSpanRatio >= MIN_VERTICAL_SPAN_RATIO;
    assert.ok(
      passes,
      `${context}: container "${f.id}" (${f.w}×${f.h}) underfilled: area ratio ${areaFillRatio.toFixed(3)} < ${MIN_AREA_FILL_RATIO} and vertical span ratio ${verticalSpanRatio.toFixed(3)} < ${MIN_VERTICAL_SPAN_RATIO}`,
    );
  }
}

// Assert fill ratio at every scene's last frame (per brief specification)
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const lastFrame = rendered.find(frame => frame.scene === scene && frame.kind === 'end')!;
  assert.ok(lastFrame, `missing end frame for ${scene}`);
  checkFillRatio(lastFrame.html, `${scene} at end frame`);
}

// Also assert fill ratio at major beat settled states (Turn 41 final beat, Turn 44 final beat, Turn 46 question blocks)
checkFillRatio(byKind('ImplicitTrace').find(f => f.kind === 't41Noticing')!.html, 'ImplicitTrace at t41Noticing');
checkFillRatio(byKind('IATLatency').find(f => f.kind === 't44Screen')!.html, 'IATLatency at t44Screen');
checkFillRatio(byKind('AllportQuestion').find(f => f.kind === 't46Second')!.html, 'AllportQuestion at t46Second');

// Structural checks:
// Turn 42 replaces Turn 41: turn 41 definition and stream are absent in turn 42.
for (const cue of ['t42Precision', 't42Automatically', 't42Accumulated', 't42Sincerely', 't42Equal', 't42Treatment']) {
  const html = byKind('ImplicitTrace').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turn="41"'), `ImplicitTrace ${cue} still renders turn 41 markup`);
}

// Turn 45 clears Turn 44 prompt and key geometry.
for (const cue of ['t45Reaction', 't45Audits', 't45Bias', 't45Mental', 't45Weighting', 't45Judgment']) {
  const html = byKind('IATLatency').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-turn="44"'), `IATLatency ${cue} still renders turn 44 markup`);
}

// In AllportQuestion: question blocks clear when citation card enters.
for (const cue of ['t46Gordon', 't46Classic', 't46FiftyFour', 't46Nature', 't46PrejudiceTitle', 't46Nine']) {
  const html = byKind('AllportQuestion').find(frame => frame.kind === cue)!.html;
  assert.ok(!html.includes('data-question-blocks="true"'), `AllportQuestion ${cue} still renders question blocks`);
}

console.log(
  `PASS: audit self-test (${selfTests} rules); ${rendered.length} Package F frames (cues + 500 ms grid); layout audit of ${items} declared boxes (safe area, notch zones, text fit, collisions); fill-ratio assert verified on all scene end frames; clean turn transitions, storyboard strings, hook, underscore and interaction-hint policies verified.`,
);
