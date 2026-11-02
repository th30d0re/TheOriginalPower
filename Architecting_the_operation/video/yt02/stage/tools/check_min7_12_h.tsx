import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {UnequalTreatment, UNEQUAL_TREATMENT_LAYOUT} from '../min7_12/h/UnequalTreatment';
import {InterpersonalClass, INTERPERSONAL_LAYOUT} from '../min7_12/h/InterpersonalClass';
import {LiteratureBoundary, LITERATURE_BOUNDARY_LAYOUT} from '../min7_12/h/LiteratureBoundary';
import {auditItems, auditLayout, auditSelfTest} from './layout_audit';

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
      // Use word-boundary lookahead to prevent e.g. "GROUP A" matching inside "GROUP ANTIPATHY"
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
  text: ['PERSON-TO-PERSON UNEQUAL TREATMENT'],
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

// Assert fill ratio at every scene's last frame
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const lastFrame = rendered.find(frame => frame.scene === scene && frame.kind === 'end')!;
  assert.ok(lastFrame, `missing end frame for ${scene}`);
  checkFillRatio(lastFrame.html, `${scene} at end frame`);
}

// Also assert fill ratio at major beat settled states
checkFillRatio(byKind('UnequalTreatment').find(f => f.kind === 't55Membership')!.html, 'UnequalTreatment at t55Membership');
checkFillRatio(byKind('InterpersonalClass').find(f => f.kind === 't60Military')!.html, 'InterpersonalClass at t60Military');

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
  `PASS: audit self-test (${selfTests} rules); ${rendered.length} Package H frames (cues + 500 ms grid); layout audit of ${items} declared boxes (safe area, notch zones, text fit, collisions); fill-ratio assert verified on all scene end frames; clean turn transitions, storyboard strings, hook, underscore, internal-turn and interaction-hint policies verified.`,
);
