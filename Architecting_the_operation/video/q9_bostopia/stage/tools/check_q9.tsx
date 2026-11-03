import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {HisClose} from '../scenes/HisClose';
import {SaintDomingue} from '../scenes/SaintDomingue';
import {BostonMap} from '../scenes/BostonMap';
import {Paranoia} from '../scenes/Paranoia';
import {TheCheck} from '../scenes/TheCheck';
import {TheRepeal} from '../scenes/TheRepeal';
import {TheRight} from '../scenes/TheRight';
import {TheWage} from '../scenes/TheWage';
import {TheGovernor} from '../scenes/TheGovernor';
import {TheReturn} from '../scenes/TheReturn';
import {auditItems, auditLayout, auditSelfTest} from './layout_audit';

const plan = JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json', import.meta.url), 'utf8')) as StagePlan;
const sceneComponents = {HisClose, SaintDomingue, BostonMap, Paranoia, TheCheck, TheRepeal, TheRight, TheWage, TheGovernor, TheReturn};
type SceneName = keyof typeof sceneComponents;

const ALLOWED_NUMBERS = new Set([
  '1', '2', '3', '4', '6', '9', '14', '15', '25', '32.7', '42', '50', '80', '87', '100', '120', '135', '137', '150', '199', '200', // 3 and 42 are the FBI 2024 gun-murder shares; 4 is KRON4
  '9.3',
  '1775', '1788', '1938', '2016', '2021', '2024', '2026',
  '2499', '3324', '7800', '10000', '50000', '550000',
  '960537', '17220407',
  '0.29', '0.43', '0.72', '3.12', '3.14',
]);

const BANNED = [/Tulsa/i, /Madison/, /\b2004\b/, /machine[- ]gun/i, /forced[- ]reset/i, /\+58%/, /Article 17/];

for (const hook of ['useState', 'useEffect', 'useLayoutEffect', 'useReducer', 'useRef'] as const) {
  (React as any)[hook] = () => { throw new Error(`${hook} reached in Q9 render`); };
  const Probe = () => { (React as any)[hook](); return null; };
  assert.throws(() => renderToStaticMarkup(<Probe />), new RegExp(`${hook} reached`));
}

const sceneDir = new URL('../scenes/', import.meta.url);
for (const file of fs.readdirSync(sceneDir, {recursive: true}) as string[]) {
  if (!file.endsWith('.tsx')) continue;
  const source = fs.readFileSync(new URL(file, sceneDir), 'utf8');
  const hooks = [...source.matchAll(/\b(use[A-Z][A-Za-z0-9]*)\b/g)].map(match => match[1]);
  for (const hook of hooks) assert.ok(['useCue', 'useStageMs'].includes(hook), `${file} contains disallowed hook ${hook}`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source), `${file} contains a nondeterministic or measured path`);
}

function render(scene: SceneName, ms: number) {
  const Scene = sceneComponents[scene];
  const segment = plan.segments.find(item => item.scene === scene)!;
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

const bareCues = (scene: SceneName) => {
  const segment = plan.segments.find(item => item.scene === scene)!;
  return Object.entries(plan.cues)
    .filter(([name, ms]) => !name.includes('.') && ms >= segment.start_ms && ms < segment.end_ms)
    .map(([name]) => name);
};

const frames: {scene: SceneName; ms: number; kind: string}[] = [];
for (const scene of Object.keys(sceneComponents) as SceneName[]) {
  const segment = plan.segments.find(item => item.scene === scene)!;
  frames.push({scene, ms: segment.start_ms, kind: 'start'});
  for (const cue of bareCues(scene)) {
    const at = Math.min(plan.cues[cue] + 700, segment.end_ms - 1000 / plan.fps);
    frames.push({scene, ms: at, kind: cue});
  }
  frames.push({scene, ms: segment.end_ms - 1000 / plan.fps, kind: 'end'});
}
const rendered = frames.map(frame => ({...frame, html: render(frame.scene, frame.ms)}));
const byKind = (scene: SceneName) => rendered.filter(frame => frame.scene === scene);

function beat(scene: SceneName, cue: string, text: string[]) {
  const frame = byKind(scene).find(item => item.kind === cue);
  assert.ok(frame, `${scene} has no ${cue} frame`);
  const visible = plain(frame.html);
  for (const expected of text) assert.ok(visible.includes(expected), `${scene} at ${cue}+700 ms is missing “${expected}”`);
  const threshold = plan.cues[cue];
  for (const earlier of byKind(scene)) {
    if (earlier.ms >= threshold - 1) continue;
    const earlierText = plain(earlier.html);
    for (const expected of text) assert.ok(!earlierText.includes(expected), `${scene} at ${earlier.kind} already shows “${expected}” before ${cue}`);
  }
}

if (process.env.Q9_SNAPSHOT === '1') {
  console.log(JSON.stringify(rendered.map(({scene, ms, kind, html}) => ({scene, ms, kind, hash: createHash('sha256').update(html).digest('hex')}))));
} else {
  const failures: string[] = [];
  const fail = (message: string) => failures.push(message);
  for (const {scene, ms, kind, html} of rendered) {
    if (html.includes('NaN')) fail(`${scene} ${kind} at ${ms} contains NaN`);
    const text = plain(html);
    if (/\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i.test(text)) fail(`${scene} ${kind} renders an interaction hint`);
    if (/\bR-\d+\b/.test(text) || /\bturn \d+\b/i.test(text)) fail(`${scene} ${kind} renders a shot id or turn number`);
    if (/\b(?:socket|slot|module|node|store)\b/i.test(text)) fail(`${scene} ${kind} renders an internal label`);
    for (const banned of BANNED) if (banned.test(text)) fail(`${scene} ${kind} renders cut material ${banned}`);
    for (const problem of auditLayout(html)) fail(`${scene} ${kind} (${ms} ms): ${problem}`);
    const beats = new Map<string, string[]>();
    for (const match of html.matchAll(/data-beat="([^"]*)"[^>]*>([^<]*)</g)) {
      const [id, value] = [match[1], match[2].replace(/\s+/g, ' ').trim()];
      if (!value || id === 'source') continue;
      beats.set(id, [...(beats.get(id) ?? []), value]);
    }
    for (const [id, parts] of beats) {
      const count = parts.join(' ').split(/\s+/).filter(Boolean).length;
      if (count > 30) fail(`${scene} ${kind} beat “${id}” has ${count} words`);
    }
    for (const match of text.matchAll(/[$+]?\d{1,3}(?:,\d{3})+(?:\.\d+)?|[$+]?\d+\.\d+|[$+]?\d+/g)) {
      const number = match[0].replace(/[$+,]/g, '');
      if (!ALLOWED_NUMBERS.has(number)) fail(`${scene} ${kind} shows number ${match[0]} with no source in this cut`);
    }
  }

  const expect: [SceneName, string, string[]][] = [
    ['HisClose', 'libertarianism', ['Libertarianism', 'The only politics he names.']],
    ['HisClose', 'left', ['From the left', 'This answer comes from the left.']],
    ['SaintDomingue', 'source', ['No source.', 'He cites no source.']],
    ['SaintDomingue', 'bans', ['The state bans the AR-15']],
    ['SaintDomingue', 'rifles', ['Rifles, 3%', '42%', 'Pew Research']],
    ['SaintDomingue', 'privileged', ['A privileged position']],
    ['SaintDomingue', 'protector', ['Your protector']],
    ['BostonMap', 'boston', ['1938 Boston map']],
    ['BostonMap', 'seven', ['3.14', '3.12', '0.43', 'per 10,000']],
    ['BostonMap', 'democide', ['State-sponsored democide']],
    ['Paranoia', 'eightyseven', ['+87%', 'Black women, gun ownership, 2021.']],
    ['Paranoia', 'paranoia', ['He called that record paranoia.']],
    ['TheCheck', 'receipt', ['$50,000', '3,324', '2,499']],
    ['TheCheck', 'license', ['$200 or more']],
    ['TheCheck', 'fifteen', ['Loretta Green', '+50% and +32.7%', 'already required it']],
    ['TheCheck', 'arriving', ['$550,000', '$7,800']],
    ['TheRepeal', 'jail', ['He should lose the gun.']],
    ['TheRepeal', 'mini14', ['AR-15', 'Mini-14', 'Same round.']],
    ['TheRepeal', 'august', ['August 1, 2024']],
    ['TheRepeal', 'tightening', ['the tightening is written against.']],
    ['TheRepeal', 'stock', ['Stock and grip']],
    ['TheRight', 'privilege', ['He calls the right a privilege.']],
    ['TheRight', 'unalienable', ['Unalienable']],
    ['TheRight', 'locke', ['state of nature', 'Founders\' Constitution']],
    ['TheRight', 'prey', ['make a prey of them when he pleases.']],
    ['TheRight', 'animals', ['Other animals carry that charge.']],
    ['TheWage', 'planters', ['Arms for captives', 'The Original Power', 'Arms as a Wage']],
    ['TheWage', 'wage', ['White buffer class, as a wage']],
    ['TheWage', 'sink', ['let them sink.']],
    ['TheWage', 'date', ['1788', 'August 1, 2024']],
    ['TheWage', 'lexington', ['Massachusetts already drew this line']],
    ['TheWage', 'muskets', ['the equivalent of an AR-15']],
    ['TheGovernor', 'healey', ['Governor Healey']],
    ['TheGovernor', 'none', ['none of the programs she names.']],
    ['TheGovernor', 'incoherent', ['The position is incoherent.']],
    ['TheReturn', 'poverty', ['Poverty r = +0.72']],
    ['TheReturn', 'zero', ['r = +0.29', 'About zero']],
    ['TheReturn', 'storage', ['Safe storage and background checks']],
    ['TheReturn', 'tomorrow', ['Today is voting day. Vote no.']],
    ['TheReturn', 'systemic', ['systemic ableism']],
  ];
  for (const [scene, cue, text] of expect) {
    try { beat(scene, cue, text); }
    catch (error) { fail(error instanceof Error ? error.message : String(error)); }
  }

  const codes: [SceneName, string, string][] = [
    ['HisClose', 'libertarianism', 'https://www.instagram.com/reel/DfQS-mmArwS/'],
    ['SaintDomingue', 'rifles', 'https://www.pewresearch.org/short-reads/2025/03/05/what-the-data-says-about-gun-deaths-in-the-us/'],
    ['TheWage', 'planters', 'https://github.com/th30d0re/TheOriginalPower/releases'],
    ['BostonMap', 'boston', 'https://dsl.richmond.edu/panorama/redlining/map/MA/Boston/context'],
    ['Paranoia', 'eightyseven', 'https://www.kron4.com/hidden-history/black-history-month/gun-ownership-increasing-among-black-women/'],
    ['TheCheck', 'fifteen', 'https://www.instagram.com/reel/DfQYuKCBZGH/'],
    ['TheCheck', 'fifteen', 'https://www.mass.gov/doc/section-152-live-firearms-report/download'],
    ['TheRight', 'locke', 'https://press-pubs.uchicago.edu/founders/documents/v1ch17s5.html'],
    ['TheRepeal', 'mini14', 'https://www.mass.gov/enforcing-the-massachusetts-assault-weapons-ban'],
    ['TheGovernor', 'healey', 'https://www.instagram.com/reel/DdoZBRXIbK5/'],
    ['TheReturn', 'poverty', 'https://data.cdc.gov/d/fpsi-y8tj'],
    ['TheReturn', 'storage', 'https://www.rand.org/research/gun-policy/analysis.html'],
  ];
  for (const [scene, cue, url] of codes) {
    const marker = `data-qr="${url}"`;
    const frame = byKind(scene).find(item => item.kind === cue);
    if (!frame?.html.includes(marker)) fail(`${scene} at ${cue}+700 ms is missing the QR for ${url}`);
    for (const earlier of byKind(scene)) {
      if (earlier.ms >= plan.cues[cue] - 1) continue;
      if (earlier.html.includes(marker)) fail(`${scene} at ${earlier.kind} shows the QR for ${url} before ${cue}`);
    }
  }

  const repeal = plain(byKind('TheRepeal').find(frame => frame.kind === 'mini14')!.html);
  if (repeal.includes('He should lose the gun.')) fail('TheRepeal still shows the grant after the Mini-14 cue');
  const selfTests = auditSelfTest();
  if (failures.length) {
    console.error(failures.slice(0, 60).join('\n'));
    throw new Error(`check_q9: ${failures.length} failure(s)`);
  }
  console.log(`PASS: audit self-test (${selfTests} rules); ${rendered.length} Q9 frames; layout, cues, numbers, word budget, hook policy.`);
}
