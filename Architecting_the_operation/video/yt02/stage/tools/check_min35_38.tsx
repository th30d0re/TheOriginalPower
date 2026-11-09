import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {ConeBuild} from '../min35_38/ConeBuild';
import {ApexElite} from '../min35_38/ApexElite';
import {TierRoster} from '../min35_38/TierRoster';
import {OperationalModules} from '../min35_38/OperationalModules';
import {RefinementEquation} from '../min35_38/RefinementEquation';
import {AdmissionPrice} from '../min35_38/AdmissionPrice';
import {StructuralPayoffs} from '../min35_38/StructuralPayoffs';

const sceneComponents = {ConeBuild, ApexElite, TierRoster, OperationalModules, RefinementEquation, AdmissionPrice, StructuralPayoffs};
type SceneName = keyof typeof sceneComponents;

// Cue order mirrors the S00-168..S00-180 block in stage_ov.yaml; synthetic ms keep the spoken order.
const sceneCues: Record<SceneName, string[]> = {
  ConeBuild: ['t168Build', 't168Cone', 't168Outgroup', 't168Base', 't168Buffer', 't168Enforcement', 't168Puppet', 't168Elite', 't168Tip', 't168Five', 't168Consistent'],
  ApexElite: ['t169FigureTwo', 't169FigureThree', 't169Refines', 't169Four', 't169Apex', 't169Denoted', 't169Capital', 't169Architects', 't169Design', 't169Capture'],
  TierRoster: ['t170Below', 't170Puppet', 't170Politicians', 't170Media', 't170Translate', 't170Statutes', 't171Next', 't171Enforcement', 't171Patrols', 't171Police', 't171Legal', 't171Force', 't172Beneath', 't172Buffer', 't172NonElite', 't172Absorb', 't172Defend', 't172Allocation', 't173Base', 't173Outgroup', 't173ORacialized', 't173Adjacent', 't173Extraction', 't173Dispossession', 't173Containment'],
  OperationalModules: ['t174Alongside', 't174Modules', 't174Across', 't174Asymmetric', 't174Selective', 't174Ideological', 't174Resistance', 't175Limits', 't175Outgroup', 't175Urgent', 't175Dismisses'],
  RefinementEquation: ['t176Equation', 't176Vertical', 't176Notation', 't176Operator', 't176I', 't176Dominant', 't177Splits', 't177InGroup', 't177Disjoint', 't177Union', 't177Named', 't177Elite', 't177Puppet', 't177Enforcement', 't177Buffer'],
  AdmissionPrice: ['t178Lincoln', 't178Speed', 't178FiftyFive', 't178Admission', 't178KnowNothings', 't178Control', 't178Declaration', 't178Equal', 't178Except', 't178Foreigners', 't178Catholics'],
  StructuralPayoffs: ['t179Labels', 't179Structural', 't179Names', 't179Design', 't179Administer', 't179Enforce', 't179Defend', 't179Boundary', 't180Payoffs', 't180Chapter', 't180Vastly', 't180Puppet', 't180Enforcement', 't180Buffer'],
};

const finalStrings: Record<SceneName, string[]> = {
  ConeBuild: ['BUILD THE CONE FROM THAT SEQUENCE', '5 · ELITE', '4 · PUPPET CLASS', '3 · ENFORCEMENT CLASS', '2 · BUFFER CLASS', '1 · OUT-GROUP', 'TIP', 'BASE', 'FIVE TIERS · MINIMUM CONFIGURATION', 'CONSISTENT WITH THE HISTORICAL RECORD'],
  ApexElite: ['CAPITAL OWNERS + INSTITUTIONAL ARCHITECTS', 'DESIGN THE RULES', 'CAPTURE THE NET SURPLUS'],
  TierRoster: ['ELITE · E', 'PUPPET CLASS', 'ENFORCEMENT CLASS', 'BUFFER CLASS', '+ ADJACENT OUT-GROUPS', 'LABOR EXTRACTION', 'LAND DISPOSSESSION', 'COERCIVE CONTAINMENT'],
  OperationalModules: ['FOUR OPERATIONAL MODULES', 'RUN ACROSS THE COMPONENTS', 'ASYMMETRIC AUTONOMY RESTRICTION', 'SELECTIVE EMPATHY', 'IDEOLOGICAL JUSTIFICATION', 'RESISTANCE TO STRUCTURAL CRITIQUE', 'LIMITS MOVEMENT · PROPERTY · REPRODUCTION', 'IN-GROUP GRIEVANCES · URGENT', 'OUT-GROUP PAIN · DISMISSED'],
  RefinementEquation: ['EQ. 2.2 · VERTICAL REFINEMENT', 'SET NOTATION', 'Refine(', 'DISJOINT UNION · FOUR FUNCTIONAL TIERS', 'ELITE', 'PUPPET', 'ENFORCEMENT', 'BUFFER'],
  AdmissionPrice: ['TO JOSHUA F. SPEED', 'AUGUST 24, 1855', 'KNOW-NOTHINGS', 'IF THEY GOT CONTROL', 'THE DECLARATION WOULD READ', 'ALL MEN ARE CREATED EQUAL', 'EXCEPT NEGROES', 'AND FOREIGNERS', 'AND CATHOLICS'],
  StructuralPayoffs: ['STRUCTURAL POSITIONS · EXTRACTION CIRCUIT', 'EQ. 2.2 · FOUR FUNCTIONAL SUBSETS', 'DESIGN', 'ADMINISTER', 'ENFORCE', 'DEFEND', 'THE BOUNDARY', 'MATERIAL PAYOFFS', 'EQ. 0.3 · CHAPTER 0'],
};

// FitBox gates its glyphs on document.fonts, which never resolves under renderToStaticMarkup;
// those strings are asserted against the scene source instead of the final-frame markup.
const fitBoxStrings: Record<SceneName, string[]> = {
  ConeBuild: [],
  ApexElite: ['FIG. 0.2 · FIVE-TIER CONE', 'FIG. 0.3 · EXTRACTION CIRCUIT', 'EQ. 2.2', 'ELITE · E'],
  TierRoster: ['TIER P', 'TIER F', 'TIER I', 'TIER O'],
  OperationalModules: [],
  RefinementEquation: [],
  AdmissionPrice: ['ABRAHAM LINCOLN', 'ADMISSION PRICE'],
  StructuralPayoffs: [],
};

const dataEquations: Record<SceneName, string[]> = {
  ConeBuild: [],
  ApexElite: [],
  TierRoster: [],
  OperationalModules: [],
  RefinementEquation: ['Eq. 2.2 · refinement operator', 'Eq. 2.2 · disjoint union of four tiers'],
  AdmissionPrice: [],
  StructuralPayoffs: ['Eq. 0.3 · benefit ordering'],
};

const cues: Record<string, number> = {};
const segments = (Object.keys(sceneCues) as SceneName[]).map((scene, s) => {
  sceneCues[scene].forEach((name, i) => { cues[name] = 500 + i * 500; });
  const end = 500 + sceneCues[scene].length * 500 + 1500;
  return {instance: scene, scene, start_ms: 0, end_ms: end, shots: []};
});
const plan = {episode: 'YT02v2_ov', fps: 30, width: 1920, height: 1080, duration_ms: 30000, range: {start_ms: 0, end_ms: 30000}, audio: '', cues, segments, warnings: []} as unknown as StagePlan;

const sourceFiles = ['shared.tsx', 'ConeBuild.tsx', 'ApexElite.tsx', 'TierRoster.tsx', 'OperationalModules.tsx', 'RefinementEquation.tsx', 'AdmissionPrice.tsx', 'StructuralPayoffs.tsx'];
for (const file of sourceFiles) {
  const source = fs.readFileSync(new URL(`../min35_38/${file}`, import.meta.url), 'utf8');
  const hooks = [...source.matchAll(/\b(use[A-Z][A-Za-z0-9]*)\b/g)].map(match => match[1]);
  for (const hook of hooks) assert.ok(['useCue', 'useStageMs'].includes(hook), `${file} contains disallowed hook ${hook}`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source), `${file} contains a nondeterministic or measured path`);
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

if (process.env.MIN35_38_SNAPSHOT) {
  console.log(JSON.stringify(samples.map(({scene, ms, hash}) => ({scene, ms, hash}))));
} else {
  for (const scene of Object.keys(sceneComponents) as SceneName[]) {
    const first = samples.find(s => s.scene === scene)!;
    const sceneSamples = samples.filter(s => s.scene === scene);
    const end = sceneSamples[sceneSamples.length - 1];
    assert.ok(first.hash !== end.hash, `${scene}: markup never changes across the segment`);
    const plainEnd = end.html.replace(/<[^>]+>/g, '');
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
    for (const eq of dataEquations[scene]) {
      assert.ok(end.html.includes(`data-equation="${eq}"`), `${scene}: data-equation "${eq}" missing at the final frame`);
    }
    console.log(`PASS: ${scene} renders ${samples.filter(s => s.scene === scene).length} sampled frames; final frame carries all ${finalStrings[scene].length} key strings, all absent before their beats.`);
  }
}
