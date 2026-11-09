import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {BinaryEndures} from '../min32_35/BinaryEndures';
import {FlatImageEquation} from '../min32_35/FlatImageEquation';
import {OrthogonalDeflection} from '../min32_35/OrthogonalDeflection';
import {ReinforcedCollision} from '../min32_35/ReinforcedCollision';
import {ConeDepth} from '../min32_35/ConeDepth';
import {TierSplits} from '../min32_35/TierSplits';
import {PatrolDeputization} from '../min32_35/PatrolDeputization';
import {ConvictLeasing} from '../min32_35/ConvictLeasing';

const sceneComponents = {BinaryEndures, FlatImageEquation, OrthogonalDeflection, ReinforcedCollision, ConeDepth, TierSplits, PatrolDeputization, ConvictLeasing};
type SceneName = keyof typeof sceneComponents;

// Cue order mirrors the S00-154..S00-167 block in stage_ov.yaml; synthetic ms keep the spoken order.
const sceneCues: Record<SceneName, string[]> = {
  BinaryEndures: ['t154Optical', 't154Binary', 't154Endures', 't154Records', 't154Legal', 't154Boundary', 't154Hiding', 't154Ranking', 't154Protected'],
  FlatImageEquation: ['t155Equation', 't155PointOne', 't155Captures', 't155Flat', 't155Breaking', 't155Reveals', 't155Vertical', 't155Formalize', 't155Separating', 't155Visible', 't155Command', 't155Runs'],
  OrthogonalDeflection: ['t156Orthogonal', 't156Vertical', 't156Momentum', 't156Upward', 't156Elite', 't156Loses', 't156Sideways', 't156Identity', 't156WorkingClass', 't156Collide', 't157Buffer', 't157Kinetic', 't157Absorbing', 't157Pressure', 't157Outgroup', 't157Upward', 't157Apex'],
  ReinforcedCollision: ['t158Projection', 't158Deflection', 't158Reinforce', 't158Each', 't158Nearest', 't158Opposing', 't158Redirected', 't158Energy', 't158Collides', 't158Line', 't158System'],
  ConeDepth: ['t159Wide', 't159Cone', 't159Restores', 't159Depth', 't159Conflict', 't159Boundary', 't159Real', 't159Vertical', 't159Tiers', 't159Rules', 't159Capture', 't159Wealth'],
  TierSplits: ['t160Trace', 't160Splits', 't160Step', 't160Five', 't161TwoTier', 't161Oppressor', 't161Oppressed', 't161Surplus', 't161Predicts', 't161Record', 't162Splitting', 't162ThreeTier', 't162Elite', 't162Beneficiary', 't162Middle', 't162Outgroup', 't162Load', 't163Compresses', 't163Lawmaking', 't163Fourth', 't163Puppet', 't163Salaried', 't163Statutes', 't164Fifth', 't164EnforcementClass', 't164BufferClass', 't164Standing', 't164Defend'],
  PatrolDeputization: ['t165Colonial', 't165Statutes', 't165Conscripted', 't165Ordinary', 't165Patrols', 't165BufferClass', 't165Enforcement', 't165Deputization', 't165Enslavers', 't165Paid', 't165Substitutes', 't165Place'],
  ConvictLeasing: ['t166SixtyFive', 't166Thirteenth', 't166Abolished', 't166Except', 't166Crime', 't166Police', 't166Sheriffs', 't166Vagrancy', 't166Leasing', 't166Extract', 't166Labor', 't166Criminal', 't167Emancipation', 't167Officers', 't167Policing', 't167Citizens', 't167Patrols', 't167Positions', 't167Authority', 't167Protection'],
};

const finalStrings: Record<SceneName, string[]> = {
  BinaryEndures: ['THE SIMPLE BINARY', 'I · IN-GROUP', 'O · OUT-GROUP', 'LEGAL BOUNDARY · REAL', 'INTERNAL RANKING · HIDDEN', 'PROTECTED SIDE'],
  FlatImageEquation: ['FLAT PROJECTED IMAGE', 'VERTICAL ELEVATION', 'NEXT EQUATION FORMALIZES', 'VISIBLE RACIAL BOUNDARY', 'COMMAND STRUCTURE'],
  OrthogonalDeflection: ['CLASS MOMENTUM', 'ELITE APEX', 'FLAT IDENTITY PLANE', 'BUFFER CLASS', 'ANGER + PRESSURE', 'OUT-GROUP'],
  ReinforcedCollision: ['FLAT PROJECTION', 'SIDEWAYS DEFLECTION', 'REINFORCE EACH OTHER', 'NEAREST OPPOSING GROUP', 'REDIRECTED POLITICAL ENERGY', 'THE BOUNDARY LINE', 'INSIDE THE SYSTEM'],
  ConeDepth: ['THE WIDE SHOT RESTORES CAUSAL DEPTH'],
  TierSplits: ['FROM TWO SETS TO FIVE TIERS', 'STEP BY STEP', 'BUFFER PAID IN SOCIAL STANDING'],
  PatrolDeputization: ['EARLY AMERICAN SOUTH', 'LEGAL DEPUTIZATION', 'SLAVE PATROLS', 'ENFORCEMENT FUNCTION', 'WEALTHY ENSLAVER', 'PAID SUBSTITUTE', 'PATROL IN THEIR PLACE'],
  ConvictLeasing: ['ABOLISHES SLAVERY', 'EXCEPT AS PUNISHMENT FOR A CRIME', 'PAID POLICE', 'SHERIFFS', 'VAGRANCY LAWS', 'CONVICT LEASING', 'CRIMINAL SYSTEM', 'EXTRACTED BLACK LABOR', 'COMPULSORY PATROLS', 'PAID OFFICERS', 'STATE AUTHORITY', 'LEGAL PROTECTION'],
};

// FitBox gates its glyphs on document.fonts, which never resolves under renderToStaticMarkup;
// those strings are asserted against the scene source instead of the final-frame markup.
const fitBoxStrings: Record<SceneName, string[]> = {
  BinaryEndures: [],
  FlatImageEquation: ['EQ. 2.1'],
  OrthogonalDeflection: ['ORTHOGONAL DEFLECTION', 'KINETIC DECOY'],
  ReinforcedCollision: [],
  ConeDepth: [],
  TierSplits: [],
  PatrolDeputization: ['COLONIAL STATUTE', 'BUFFER CLASS'],
  ConvictLeasing: ['13TH AMENDMENT'],
};

const cues: Record<string, number> = {};
const segments = (Object.keys(sceneCues) as SceneName[]).map((scene, s) => {
  sceneCues[scene].forEach((name, i) => { cues[name] = 500 + i * 500; });
  const end = 500 + sceneCues[scene].length * 500 + 1500;
  return {instance: scene, scene, start_ms: 0, end_ms: end, shots: []};
});
const plan = {episode: 'YT02v2_ov', fps: 30, width: 1920, height: 1080, duration_ms: 30000, range: {start_ms: 0, end_ms: 30000}, audio: '', cues, segments, warnings: []} as unknown as StagePlan;

const sourceFiles = ['shared.tsx', 'BinaryEndures.tsx', 'FlatImageEquation.tsx', 'OrthogonalDeflection.tsx', 'ReinforcedCollision.tsx', 'ConeDepth.tsx', 'TierSplits.tsx', 'PatrolDeputization.tsx', 'ConvictLeasing.tsx'];
for (const file of sourceFiles) {
  const source = fs.readFileSync(new URL(`../min32_35/${file}`, import.meta.url), 'utf8');
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

if (process.env.MIN32_35_SNAPSHOT) {
  console.log(JSON.stringify(samples.map(({scene, ms, hash}) => ({scene, ms, hash}))));
} else {
  for (const scene of Object.keys(sceneComponents) as SceneName[]) {
    const first = samples.find(s => s.scene === scene)!;
    const end = samples.filter(s => s.scene === scene).at(-1)!;
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
    console.log(`PASS: ${scene} renders ${samples.filter(s => s.scene === scene).length} sampled frames; final frame carries all ${finalStrings[scene].length} key strings, all absent before their beats.`);
  }
}
