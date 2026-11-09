import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {LegalSetIntact} from '../min38_41/LegalSetIntact';
import {BoundaryAct1691} from '../min38_41/BoundaryAct1691';
import {FlowOfInputs} from '../min38_41/FlowOfInputs';
import {ControlGateExtraction} from '../min38_41/ControlGateExtraction';
import {DeltaMaxCeiling} from '../min38_41/DeltaMaxCeiling';
import {PurposeFromBehavior} from '../min38_41/PurposeFromBehavior';
import {KernelObjective} from '../min38_41/KernelObjective';
import {MaintenanceFeedback} from '../min38_41/MaintenanceFeedback';

const sceneComponents = {LegalSetIntact, BoundaryAct1691, FlowOfInputs, ControlGateExtraction, DeltaMaxCeiling, PurposeFromBehavior, KernelObjective, MaintenanceFeedback};
type SceneName = keyof typeof sceneComponents;

// Cue order mirrors the S00-181..S00-191 block in stage_ov.yaml; synthetic ms keep the spoken order.
const sceneCues: Record<SceneName, string[]> = {
  LegalSetIntact: ['t181Decomposition', 't181Ingroup', 't181Intact', 't181Legal', 't181Exposing', 't181Roles', 't181Payoffs', 't181Four', 't181Subsets'],
  BoundaryAct1691: ['t182BufferDefined', 't182OutgroupDefined', 't182Law', 't182Polices', 't182Virginia', 't182NinetyOne', 't182Act', 't182FourPointTwo', 't182Criminalized', 't182Marriage', 't182Reproduction', 't182Intersection', 't182BufferClass', 't182OutGroup', 't182EmptySet'],
  FlowOfInputs: ['t183Complete', 't183Checklist', 't183Requirement', 't183Three', 't183Flow', 't183Inputs', 't183Outputs', 't183Circuit', 't183FigureZeroThree', 't183Labor', 't183Capacity', 't183Supply', 't183Driving', 't183Energy'],
  ControlGateExtraction: ['t184Elite', 't184Parasitic', 't184Gate', 't184Directs', 't184HighCurrent', 't184Upward', 't184Drawing', 't184ControlCurrent', 't184Puppet', 't184Enforcement', 't185Output', 't185Extraction', 't185Captured', 't185Downward', 't185Suppression', 't185Allocation', 't185Paid', 't185Status', 't185Concessions'],
  DeltaMaxCeiling: ['t186DeltaMax', 't186Change', 't186Maximum', 't186Policy', 't186Reform', 't186Zero', 't186Ceiling', 't186Unchanged', 't187Concession', 't187Theorem', 't187DeltaMaxZero', 't187Redistribute', 't187Status', 't187Benefits', 't187Below', 't187Apex', 't187Lowering', 't187Ceiling'],
  PurposeFromBehavior: ['t188How', 't188Four', 't188Objective', 't188Function', 't188OrPurpose', 't188Theory', 't188Machine', 't188Stable', 't188Runtime', 't188Maximizes'],
  KernelObjective: ['t189Equation', 't189TwoPointSeven', 't189Kernel', 't189Maximize', 't189Extraction', 't189Output', 't189EofT', 't189Subject', 't189Coherence', 't189MofT', 't189Stays', 't189Below', 't189Critical', 't189Threshold', 't189Tau', 't189Plain', 't190Code', 't190Payment', 't190Campaign', 't190Chosen', 't190EofT', 't190High', 't190Holding', 't190MofT', 't190Tau'],
  MaintenanceFeedback: ['t191Five', 't191Regulation', 't191Figure', 't191TwoPointTwo', 't191Displays', 't191Dashed', 't191Loop', 't191Prejudice', 't191Reenters', 't191Machine', 't191Voters', 't191Juries', 't191Lenders', 't191Hiring'],
};

const finalStrings: Record<SceneName, string[]> = {
  LegalSetIntact: ['THE DECOMPOSITION', 'BOUNDARY INTACT', 'ELITE', 'PUPPET', 'ENFORCEMENT', 'BUFFER', 'UNEQUAL ROLES', 'UNEQUAL PAYOFFS'],
  BoundaryAct1691: ['LAW POLICES THE LINE', 'CRIMINALIZES CROSS-RACIAL MARRIAGE', 'AND REPRODUCTION', 'EQ. 4.2', 'THE INTERSECTION STAYS EMPTY'],
  FlowOfInputs: ['DEFINED FLOW OF INPUTS + OUTPUTS', 'THE SYSTEM', 'OUT-GROUP · PHYSICAL LABOR', 'BUFFER CLASS · PRODUCTIVE CAPACITY', 'DRIVING ENERGY'],
  ControlGateExtraction: ['HIGH-CURRENT LABOR FLOW UPWARD', 'CONTROL CURRENT', 'UPWARD WEALTH EXTRACTION', 'CAPTURED BY THE ELITE', 'DOWNWARD SUPPRESSION ALLOCATION', 'STATUS + MATERIAL CONCESSIONS'],
  DeltaMaxCeiling: ['CHANGE IN MAXIMUM EXTRACTION SHARE', 'CONCESSION THEOREM · CHAPTER 15', 'ELITE', 'POLICY REFORM', 'EXTRACTION CEILING', 'STAYS UNCHANGED', 'SYMBOLIC STATUS', 'MINOR MATERIAL BENEFITS', 'BELOW THE APEX'],
  PurposeFromBehavior: ["HOW IS A SYSTEM'S PURPOSE READ FROM ITS BEHAVIOR?", 'EXPLICIT OBJECTIVE FUNCTION', 'OR PURPOSE', 'THE MACHINE', 'STABLE RUNTIME BEHAVIOR', 'CONSISTENTLY MAXIMIZES'],
  KernelObjective: ['KERNEL OPTIMIZATION OBJECTIVE', 'EXTRACTION OUTPUT', 'REVOLUTIONARY THRESHOLD', 'CLASS COHERENCE', 'MAXIMUM EXTRACTION · SOLIDARITY BELOW THRESHOLD', 'RACIAL CODE', 'STATUS PAYMENT', 'ENFORCEMENT CAMPAIGN'],
  MaintenanceFeedback: ['FEEDBACK REGULATION', 'THE MACHINE', 'SYSTEM-CULTIVATED PREJUDICE', 'RE-ENTERS', 'VOTERS', 'JURIES', 'LENDERS', 'HIRING MANAGERS'],
};

// FitBox gates its glyphs on document.fonts, which never resolves under renderToStaticMarkup;
// those strings are asserted against the scene source instead of the final-frame markup.
const fitBoxStrings: Record<SceneName, string[]> = {
  LegalSetIntact: ['IN-GROUP I'],
  BoundaryAct1691: ['BOUNDARY ENFORCEMENT ACT', 'BUFFER CLASS', 'OUT-GROUP O'],
  FlowOfInputs: ['REQUIREMENT 3', 'FIGURE 0.3'],
  ControlGateExtraction: ['PARASITIC CONTROL GATE'],
  DeltaMaxCeiling: [],
  PurposeFromBehavior: ['REQUIREMENT 4'],
  KernelObjective: ['EQ. 2.7'],
  MaintenanceFeedback: ['REQUIREMENT 5', 'FIGURE 2.2'],
};

// Registry terms and operator glyphs that must appear in the final-frame markup.
const equationMarkup: Record<SceneName, string[]> = {
  LegalSetIntact: [],
  BoundaryAct1691: ['data-term="BufferClassSet"', 'data-term="OutGroupSet"', '∩', '∅'],
  FlowOfInputs: [],
  ControlGateExtraction: [],
  DeltaMaxCeiling: ['data-term="DeltaMax"', ' = 0'],
  PurposeFromBehavior: [],
  KernelObjective: ['data-term="ExtractionE"', 'data-term="CoherenceM"', 'data-term="Tau"', 'subject to'],
  MaintenanceFeedback: [],
};

const cues: Record<string, number> = {};
const segments = (Object.keys(sceneCues) as SceneName[]).map((scene) => {
  sceneCues[scene].forEach((name, i) => { cues[name] = 500 + i * 500; });
  const end = 500 + sceneCues[scene].length * 500 + 1500;
  return {instance: scene, scene, start_ms: 0, end_ms: end, shots: []};
});
const plan = {episode: 'YT02v2_ov', fps: 30, width: 1920, height: 1080, duration_ms: 30000, range: {start_ms: 0, end_ms: 30000}, audio: '', cues, segments, warnings: []} as unknown as StagePlan;

const sourceFiles = ['shared.tsx', 'LegalSetIntact.tsx', 'BoundaryAct1691.tsx', 'FlowOfInputs.tsx', 'ControlGateExtraction.tsx', 'DeltaMaxCeiling.tsx', 'PurposeFromBehavior.tsx', 'KernelObjective.tsx', 'MaintenanceFeedback.tsx'];
for (const file of sourceFiles) {
  const source = fs.readFileSync(new URL(`../min38_41/${file}`, import.meta.url), 'utf8');
  const hooks = [...source.matchAll(/\b(use[A-Z][A-Za-z0-9]*)\b/g)].map(match => match[1]);
  for (const hook of hooks) assert.ok(['useCue', 'useStageMs'].includes(hook), `${file} contains disallowed hook ${hook}`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source), `${file} contains a nondeterministic or measured path`);
  assert.ok(!/>[^<>{}]*_[^<>{}]*</.test(source), `${file} renders a literal underscore in JSX text`);
  const scene = file.replace(/\.tsx$/, '');
  if (scene in fitBoxStrings) for (const text of fitBoxStrings[scene as SceneName]) assert.ok(source.includes(text), `${file} source missing FitBox string "${text}"`);
}

function render(scene: SceneName, ms: number) {
  const Scene = sceneComponents[scene], segment = plan.segments.find(item => item.scene === scene)!;
  return renderToStaticMarkup(
    <PlanContext.Provider value={plan}>
      <ClockContext.Provider value={{ms, fps: plan.fps, interactive: false}}>
        <Scene segment={segment} shots={segment.shots} shotAt={() => undefined} />
      </ClockContext.Provider>
    </PlanContext.Provider>,
  );
}

const samples: {scene: SceneName; ms: number; hash: string; html: string}[] = [];
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const list = sceneCues[scene];
  const times = [250, ...list.map((_, i) => 500 + i * 500 + 700), 500 + list.length * 500 + 1499];
  for (const ms of times) {
    const html = render(scene, ms);
    samples.push({scene, ms, hash: createHash('sha256').update(html).digest('hex'), html});
  }
}

if (process.env.MIN38_41_SNAPSHOT) {
  console.log(JSON.stringify(samples.map(({scene, ms, hash}) => ({scene, ms, hash}))));
} else {
  for (const scene of Object.keys(sceneComponents) as SceneName[]) {
    const first = samples.find(s => s.scene === scene)!;
    const end = samples.filter(s => s.scene === scene).at(-1)!;
    assert.ok(first.hash !== end.hash, `${scene}: markup never changes across the segment`);
    const plainEnd = end.html.replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
    for (const text of finalStrings[scene]) {
      const at = first.html.indexOf(text);
      if (at >= 0) {
        const before = first.html.slice(0, at);
        const match = /opacity:([0-9.]+)(?!.*opacity:[0-9.]+)/s.exec(before);
        const level = match ? Number(match[1]) : 1;
        assert.ok(level < 0.15, `${scene}: "${text}" visible (opacity ${level}) before its beat`);
      }
      assert.ok(plainEnd.includes(text), `${scene}: "${text}" missing at the final frame`);
    }
    for (const marker of equationMarkup[scene]) {
      assert.ok(end.html.includes(marker), `${scene}: equation markup "${marker}" missing at the final frame`);
    }
    console.log(`PASS: ${scene} renders ${samples.filter(s => s.scene === scene).length} sampled frames; final frame carries all ${finalStrings[scene].length} key strings, all absent before their beats.`);
  }
}
