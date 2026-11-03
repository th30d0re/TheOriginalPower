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

const DRAFT: Record<string, string> = {
  b9dbf73a0ee1def9: "That's Evan George, Bostopia News, closing his case for a yes on Question 9. A no vote, in his mouth, makes you a psychopath, of one of four kinds.",
  f1308549789ee5b1: 'The only politics he names is libertarianism. This answer comes from the left.',
  fe1ee0121f8ffbe8: "He cites no source for that. The state bans the AR-15. Rifles were 3 percent of the gun murders in the FBI's 2024 count.",
  e17058b56b3d1acd: 'Why would anyone want arms against this government. That question comes from a privileged position. It is an easy question when this government has been your protector.',
  '00569698b6d5aa6c': 'Here in Boston, the areas a federal map graded C and D in 1938 have about seven times the shooting rate of A and B. The map is the government\'s. I call that state-sponsored democide.',
  b3def8e665405eb1: 'Gun ownership among Black women jumped eighty-seven percent in 2021. He took that record and called it paranoia.',
  '2b6f08bdbf08b868': "He names Smith and Wesson. The check is dated September 25th, 2024. Fifty thousand dollars, from Smith and Wesson Brands, to The Civil Rights Coalition, the committee for a no vote. That is one receipt. The committee's file holds three thousand three hundred twenty-four receipts, and two thousand four hundred ninety-nine of them are a hundred dollars or less. I had been on the repeal from the time Chapter 135 was still a bill, through the revisions and the listening tours.",
  '059c7a0e0824a461': "A first license runs two hundred dollars or more. Virginia's poll tax was about fifteen dollars a year in today's money, and the Supreme Court struck it down. Median net wealth in Massachusetts is about five hundred fifty thousand dollars for white families and seventy-eight hundred for Black families. The household it keeps out is the one still arriving.",
  '3771e77a712a1de8': 'A man who abuses his family should lose the gun. and the ability to bear any arm. They should be put in jail for abuse.',
  '0d199cd59fc2d6df': 'He took that provision and made it a description of everyone who votes no.',
  c9f407fbbc18940f: 'A no vote repeals the 2024 act. Massachusetts goes back to the gun law it already had, and that law was already strict. The AR-15 was already banned by name. In 2016 the Attorney General issued a notice that told owners and dealers which guns counted as copies, and that notice functioned as the line. A Ruger Mini-14 fires the same round, and the Attorney General lists it as a gun the ban leaves open. People with counsel could fight a classification. People without counsel lived under the notice. If you legally held one of these rifles on August 1st, 2024, you can register it and keep it. Anyone after that date is who the tightening is written against.',
  '5814f3374efbb843': 'The parts that definition still targets, an adjustable stock, a grip, are what let a smaller or disabled shooter fit and control a rifle. Tightening them lands on women and on disabled people protecting themselves. He is describing those people as alcoholic men hiding abuse from a school.',
  '077b55e6ef1bbf7f': "He calls the right a privilege, billed to everyone else's safety.",
  '7205f00a5f085108': 'The right to defend yourself is unalienable. The Declaration uses that word. It belongs to a person before any government recognizes it. Any politics that takes autonomy seriously inherits the right, because autonomy someone else can override is a permission.',
  '2688c25d92fa76cc': 'John Locke wrote the account that word comes from. He called the condition before government the state of nature. In it, a person has the liberty to defend their right, and the power to maintain it on equal terms with whoever comes against them. Defending the life is part of having the life. other animals carry that same charge, in teeth, in speed, in venom, in the herd. Human beings built the firearm. It is the most effective tool we have made for it. A government that disarms the people and arms itself puts them in a worse condition than the state of nature. Hand the force to the legislator, and he can make a prey of them when he pleases.',
  a6dd8735def362a8: 'That asymmetry is part of why so many Black people are on this side of the Atlantic. European traders sold firearms to coastal African kingdoms, and the price they took was enslaved people. A kingdom without the guns became the next supply. The planters here held the enslaved population with that same gap in force.',
  c3633a567d1b89c4: 'The guns went to the White buffer class, as a wage. In the Southern states the militias that received them were the slave patrols. The deal was parity for the white men who policed the boundary, and the proof that the boundary would stay off them. George Mason said the method in Virginia in 1788. To disarm the people is the best and most effective way to enslave them. He said to do it gradually. Weaken them, and let them sink. That is the date in this law.',
  '0ebd26be7ea87b7f': "Massachusetts already drew this line in Lexington, April 1775. The British marched on Lexington and Concord to take the colony's arms, and the people met them with muskets, which today would be the equivalent of an AR-15.",
  '5f26e76ebf926953': 'That is Governor Healey. A yes vote funds none of the programs she names. The position is incoherent.',
  '05f776724a9cea20': 'Across the fifty states, poverty tracks gun homicide at about point seven. Once you account for poverty and inequality, the link between gun laws and gun homicide is essentially zero. Massachusetts already has the laws RAND finds work best: safe storage and background checks.',
  ebcc516af8577d2c: 'Today is voting day. Vote no on Question 9. This law upholds racism, sexism, and systemic ableism in the same statute. A no vote returns the state to the restrictions it already had, and it leaves safe storage and background checks standing. The yes campaign is describing a larger change than that return contains.',
};

const SOURCED = [
  'Rifles, 3%', '42%', '42% of that count names no firearm type.', 'Pew Research, FBI gun murders, 2024',
  '1938 Boston map', '3.14', '3.12', '0.43', 'Shootings per 10,000 residents per year.',
  'Sources: Mapping Inequality · Analyze Boston · ACS 2024',
  '+87%', 'Black women, gun ownership, 2021.', 'He called that record paranoia.', 'Source: NSSF via KRON4',
  '$50,000', '3,324', '2,499', 'Source: OCPF report 960537, receipt 17220407', '$200 or more',
  '+50% and +32.7%', 'Basic $80 to $150', 'Live fire $120 to $199', 'LTC fee $100',
  'Boston, Weymouth, Quincy, Rockland, and Braintree already required it.',
  'Loretta Green · EOPSS live-fire report', '$550,000', '$7,800',
  'He should lose the gun.', 'August 1, 2024', 'Stock and grip',
  'Source: Massachusetts Attorney General, 2016 notice',
  'Other animals carry that charge.', "Locke, Second Treatise, §137, Founders' Constitution",
  'Arms for captives', 'The Original Power, Ch. 9, §9.3.6 Arms as a Wage',
  'W = ψ_m + jψ_s', 'ψ_m', 'ψ_s',
  'Source: Gov. Healey, her yes-on-9 reel',
  'Poverty r = +0.72', 'r = +0.29', 'About zero', 'Sources: CDC · Census · RAND Gun Policy in America',
  'Source: @bostopianews, Question 9 reel, Nov. 2, 2026',
  'Evan George · @bostopianews · Instagram · Nov. 2, 2026',
  'Gov. Maura Healey · via @harvardseye · Instagram',
];

function norm(value: string) {
  return value.toLowerCase().replace(/-/g, ' ').replace(/&/g, ' and ').replace(/(\d)\.(\d)/g, '$1\u0000$2').replace(/[^\p{L}\p{N}+\u0000\s]/gu, '').replace(/\u0000/g, '.').replace(/\s+/g, ' ').trim();
}
const sourcedNorm = new Set(SOURCED.map(norm));
const shotList = plan.segments.flatMap(segment => segment.shots.map(shot => ({...shot, scene: segment.scene})));
function draftsAt(ms: number) {
  const index = shotList.findIndex(shot => ms >= shot.start_ms && ms < shot.end_ms);
  if (index < 0) return '';
  let text = DRAFT[shotList[index].turn_id] ?? '';
  const previous = shotList[index - 1];
  if (previous && previous.scene === shotList[index].scene && ms < previous.end_ms + 700) text += ` ${DRAFT[previous.turn_id] ?? ''}`;
  return norm(text);
}

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
  for (const shot of segment.shots) frames.push({scene, ms: shot.end_ms - 1000 / plan.fps, kind: `shot-end ${shot.shot_id}`});
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
    if (html.includes('data-clip')) {
      for (const item of auditItems(html).filter(item => item.opacity > 0.05)) {
        if (item.role !== 'text' || !item.id.startsWith('clip-label-')) fail(`${scene} ${kind} mounts ${item.role} “${item.id}” over a clip`);
      }
    }
    const visible = auditItems(html).filter(item => item.opacity > 0.05);
    const spoken = draftsAt(ms);
    let phrases = 0;
    for (const tag of html.matchAll(/<[^>]*\bdata-text="([^"]+)"[^>]*>/g)) {
      const id = tag[1];
      const source = tag[0];
      const item = visible.find(entry => entry.role === 'text' && entry.id === id);
      if (!item) continue;
      const kindName = source.match(/\bdata-kind="([^"]+)"/)?.[1];
      const fitted = source.match(/\bdata-fit="sans (\d+(?:\.\d+)?)/)?.[1];
      const fontPx = Number(source.match(/(\d+)px/)?.[1] ?? NaN);
      if (id.startsWith('clip-label-')) {
        if (!(fontPx >= 24)) fail(`${scene} ${kind} clip label “${id}” is below 24 px`);
      } else if (kindName === 'phrase') {
        phrases += 1;
        const size = Number(fitted);
        if (!(size >= 60 && size <= 84)) fail(`${scene} ${kind} phrase “${item.text}” is ${size} px`);
      } else if (kindName === 'headline') {
        const size = Number(fitted);
        if (!(size >= 56)) fail(`${scene} ${kind} headline “${item.text}” is ${size} px`);
      } else if (kindName === 'body') {
        const size = Number(fitted);
        if (!(size >= 40)) fail(`${scene} ${kind} body “${item.text}” is ${size} px`);
      } else if (kindName === 'source') {
        const size = Number(fitted);
        if (!(size >= 24)) fail(`${scene} ${kind} source “${item.text}” is ${size} px`);
      } else fail(`${scene} ${kind} text “${item.text}” has no type role`);
      const normalized = norm(item.text);
      if (normalized && !sourcedNorm.has(normalized) && !spoken.includes(normalized)) fail(`${scene} ${kind} shows “${item.text}” outside the speaker's turn and the source list`);
    }
    if (phrases > 3) fail(`${scene} ${kind} keeps ${phrases} phrase lines`);
    if (kind.startsWith('shot-end') && !html.includes('data-clip')) {
      if (!visible.length) fail(`${scene} ${kind} is empty`);
      else {
        const top = Math.min(...visible.map(item => item.y));
        const bottom = Math.max(...visible.map(item => item.y + item.h));
        const span = bottom - top;
        if (span < 0.7 * (1780 - 140)) fail(`${scene} ${kind} spans ${Math.round(span)} px, under 70% of the safe height`);
      }
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
    ['TheCheck', 'wealth', ['$550,000', '$7,800', 'white families']],
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

  const green = byKind('TheCheck').find(frame => frame.kind === 'green');
  if (green && (green.html.includes('data-text') || green.html.includes('data-shape'))) fail('TheCheck green frame still mounts a beat');
  const repeal = plain(byKind('TheRepeal').find(frame => frame.kind === 'mini14')!.html);
  if (repeal.includes('He should lose the gun.')) fail('TheRepeal still shows the grant after the Mini-14 cue');
  const selfTests = auditSelfTest();
  if (failures.length) {
    console.error(failures.slice(0, 60).join('\n'));
    throw new Error(`check_q9: ${failures.length} failure(s)`);
  }
  console.log(`PASS: audit self-test (${selfTests} rules); ${rendered.length} Q9 frames; layout, cues, numbers, word budget, hook policy.`);
}
