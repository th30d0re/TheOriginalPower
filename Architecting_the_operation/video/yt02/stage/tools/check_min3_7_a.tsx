import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type StagePlan} from '@stage';
import {SequenceAsTheory,SEQUENCE_LAYOUT,numberRailWirePoints,sequenceNodeBoxes} from '../min3_7/a/SequenceAsTheory';
import {HeartsAudit,HEARTS_LAYOUT} from '../min3_7/a/HeartsAudit';
import {TermsInOneBucket,TERMS_LAYOUT} from '../min3_7/a/TermsInOneBucket';
import {auditItems,auditLayout,auditSelfTest} from './layout_audit';
import {EQUATION_TERMS,equationColor} from '../equations';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const sceneComponents={SequenceAsTheory,HeartsAudit,TermsInOneBucket};
type SceneName=keyof typeof sceneComponents;
const sceneCues:Record<SceneName,string[]>={
  SequenceAsTheory:['t11Numbered','t11Analytical','t11Unstated','t11Cause','t11Order','t11Caused','t12Personal','t12First','t12Root','t12Institutional','t12Effects'],
  HeartsAudit:['t13Ordering','t13Public','t13Audit','t13Hearts','t13Vocabulary','t13Intentions','t14Public','t14Court','t14Workplace','t14Disparity','t14Default','t14Malice','t14Thoughts','t15Original','t15Causal','t15Testable','t15Formally','t15Checked','t15Centuries','t15Records'],
  TermsInOneBucket:['t16Why','t16Bias','t16Prejudice','t16Discrimination','t16Racism','t16Exact','t16Conversation','t16Distinct','t16Terms','t16Bucket'],
};

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in Package A render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

const sourceFiles=['SequenceAsTheory.tsx','HeartsAudit.tsx','TermsInOneBucket.tsx','PackageAVisuals.tsx'];
for(const file of sourceFiles){
  const source=fs.readFileSync(new URL(`../min3_7/a/${file}`,import.meta.url),'utf8');
  assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),`${file} contains a forbidden hook`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

function render(scene:SceneName,ms:number){
  const Scene=sceneComponents[scene],segment=plan.segments.find(item=>item.scene===scene)!;
  return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:plan.fps,interactive:false}}><Scene segment={segment} shots={segment.shots} shotAt={value=>segment.shots.find(shot=>value>=shot.start_ms&&value<shot.end_ms)}/></ClockContext.Provider></PlanContext.Provider>);
}

function plain(html:string){
  return html.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&gt;','>').replaceAll('&lt;','<').replace(/\s+/g,' ').trim();
}

const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
const interactionHint=/\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;
type Box={x:number;y:number;w:number;h:number};
const boxesIntersect=(a:Box,b:Box)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const assertPairwiseClear=(boxes:readonly Box[],label:string)=>{
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(!boxesIntersect(boxes[i],boxes[j]),`${label} boxes ${i+1} and ${j+1} overlap`);
};

const frames:{scene:SceneName;ms:number;kind:string}[]=[];
for(const scene of Object.keys(sceneComponents) as SceneName[]){
  const segment=plan.segments.find(item=>item.scene===scene)!;
  frames.push({scene,ms:segment.start_ms,kind:'start'});
  for(const cue of sceneCues[scene])frames.push({scene,ms:plan.cues[cue]+700,kind:cue});
  frames.push({scene,ms:segment.end_ms-1000/plan.fps,kind:'end'});
}
const rendered=frames.map(frame=>({...frame,html:render(frame.scene,frame.ms)}));
const byKind=(scene:SceneName)=>rendered.filter(frame=>frame.scene===scene);

function beat(scene:SceneName,cue:string,opts:{text?:string[];markup?:string[]},absentBeforeCue?:string){
  const frame=byKind(scene).find(item=>item.kind===cue)!;
  const text=plain(frame.html);
  for(const expected of opts.text??[])assert.ok(text.includes(expected),`${scene} at ${cue}+700 ms is missing “${expected}”`);
  for(const expected of opts.markup??[])assert.ok(frame.html.includes(expected),`${scene} at ${cue}+700 ms is missing markup ${expected}`);
  const absentBefore=plan.cues[absentBeforeCue??cue];
  for(const earlier of byKind(scene)){
    if(earlier.ms>=absentBefore-1)continue;
    const earlierText=plain(earlier.html);
    for(const expected of opts.text??[])assert.ok(!earlierText.includes(expected),`${scene} at ${earlier.kind} already shows “${expected}” before ${absentBeforeCue??cue}`);
    for(const expected of opts.markup??[])assert.ok(!earlier.html.includes(expected),`${scene} at ${earlier.kind} already shows markup ${expected} before ${absentBeforeCue??cue}`);
  }
  return frame.html;
}

if(process.env.MIN3_7_A_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({scene,ms,kind,html})=>({scene,ms,kind,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  for(const {scene,ms,kind,html} of rendered){
    assert.ok(!html.includes('NaN'),`${scene} ${kind} at ${ms} contains NaN`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${scene} ${kind} renders a literal underscore`);
    assert.ok(!interactionHint.test(plain(html)),`${scene} ${kind} renders an interaction hint`);
  }

  const selfTests=auditSelfTest();
  let auditedItems=0;
  const violations:string[]=[];
  for(const {scene,kind,ms,html} of rendered){
    for(const problem of auditLayout(html))violations.push(`${scene} ${kind} (${ms} ms): ${problem}`);
    auditedItems+=auditItems(html).length;
  }
  assert.deepEqual(violations,[],`Package A layout audit failed:\n${violations.slice(0,60).join('\n')}`);

  const sequenceStart=plain(byKind('SequenceAsTheory').find(frame=>frame.kind==='start')!.html);
  for(const expected of ['Figure 2.3 · Inverting the Definitional Hierarchy','Conventional Hierarchy','1. Individual Prejudice','2. Belief in Superiority','3. Systemic (if present)','The Original Power, Chapter 2'])assert.ok(sequenceStart.includes(expected),`SequenceAsTheory opening continuity is missing “${expected}”`);
  assert.ok(byKind('SequenceAsTheory').find(frame=>frame.kind==='start')!.html.includes('opacity:0.25'),`SequenceAsTheory opening does not preserve the 25% secondary column`);
  beat('SequenceAsTheory','t11Numbered',{markup:['data-number-rail="true"']});
  beat('SequenceAsTheory','t11Analytical',{text:['NUMBERED ORDER']});
  beat('SequenceAsTheory','t11Unstated',{text:['Discriminatory Actions','Systemic Outcomes'],markup:['data-causal-graph="true"']});
  beat('SequenceAsTheory','t11Cause',{text:['CAUSAL CLAIM'],markup:['data-causal-arrow="one-two"','data-causal-arrow="two-three"']});
  beat('SequenceAsTheory','t11Order',{text:['1 → 2 → 3','Eq. 2.5 · conventional causal arrow']});
  beat('SequenceAsTheory','t11Caused',{text:['ROOT','EFFECT']});
  const personalHtml=beat('SequenceAsTheory','t12Personal',{text:['PRIVATE HOSTILITY']});
  assert.ok(personalHtml.includes(`data-term-color="${equationColor(EQUATION_TERMS.IndividualPrejudice.slot)}"`),'SequenceAsTheory individual-prejudice node does not use the registry colour');
  const firstHtml=beat('SequenceAsTheory','t12First',{text:['ROOT CAUSE']});
  assert.ok(firstHtml.includes('data-scale="1.180"'),'SequenceAsTheory first node does not reach the specified 1.18 scale state');
  beat('SequenceAsTheory','t12Root',{markup:['data-root-pulse="true"']});
  const institutionalHtml=beat('SequenceAsTheory','t12Institutional',{text:['INSTITUTIONAL PATTERNS']});
  assert.ok(institutionalHtml.includes(`data-term-color="${equationColor(EQUATION_TERMS.SystemicOutcomes.slot)}"`),'SequenceAsTheory systemic-outcomes node does not use the registry colour');
  const effectsHtml=beat('SequenceAsTheory','t12Effects',{text:['SIDE EFFECT','The first slot assigns the cause.'],markup:['data-effect-pulse="1"','data-effect-pulse="2"','data-effect-pulse="3"']});
  assert.ok(effectsHtml.includes('data-scale="0.880"'),'SequenceAsTheory third node does not reach the specified 0.88 scale state');

  beat('HeartsAudit','t13Ordering',{text:['DEFAULT DEFINITION']});
  beat('HeartsAudit','t13Public',{text:['PUBLIC DEBATE']});
  beat('HeartsAudit','t13Audit',{text:['INDIVIDUAL AUDIT']});
  beat('HeartsAudit','t13Hearts',{text:['HEART']});
  beat('HeartsAudit','t13Vocabulary',{text:['VOCABULARY']});
  beat('HeartsAudit','t13Intentions',{text:['MORAL INTENTION','The ordering directs attention.']});
  beat('HeartsAudit','t14Public',{text:['PUBLIC FIGURE']});
  beat('HeartsAudit','t14Court',{text:['COURT']});
  beat('HeartsAudit','t14Workplace',{text:['WORKPLACE']});
  beat('HeartsAudit','t14Disparity',{text:['RACIAL DISPARITY']});
  beat('HeartsAudit','t14Default',{markup:['data-definition-router="true"']});
  beat('HeartsAudit','t14Malice',{text:['MALICE AUDIT']});
  beat('HeartsAudit','t14Thoughts',{text:['PRIVATE THOUGHTS']});
  beat('HeartsAudit','t15Original',{text:['THE ORIGINAL POWER']});
  beat('HeartsAudit','t15Causal',{text:['CLAIM']});
  beat('HeartsAudit','t15Testable',{text:['TESTABLE HISTORICAL CLAIM']});
  beat('HeartsAudit','t15Formally',{text:['FORMAL STATEMENT','Individual Prejudice → Discriminatory Actions → Systemic Outcomes','Eq. 2.5 · Tier 3 structural claim'],markup:['data-term="IndividualPrejudice"','data-term="DiscriminatoryActions"','data-term="SystemicOutcomes"']});
  beat('HeartsAudit','t15Checked',{text:['PRIMARY RECORDS']});
  beat('HeartsAudit','t15Centuries',{text:['FIVE CENTURIES']});
  beat('HeartsAudit','t15Records',{text:['HISTORICAL TEST']});

  beat('TermsInOneBucket','t16Why',{text:['Why separate bias, prejudice, and discrimination before naming racism?']});
  beat('TermsInOneBucket','t16Bias',{text:['BIAS']});
  beat('TermsInOneBucket','t16Prejudice',{text:['PREJUDICE']});
  beat('TermsInOneBucket','t16Discrimination',{text:['DISCRIMINATION']});
  beat('TermsInOneBucket','t16Racism',{text:['RACISM']});
  beat('TermsInOneBucket','t16Exact',{text:['EXACT WORDS']});
  beat('TermsInOneBucket','t16Conversation',{text:['EVERYDAY CONVERSATION']});
  beat('TermsInOneBucket','t16Distinct',{text:['FOUR ANALYTICAL TERMS']});
  const restoredTerms=beat('TermsInOneBucket','t16Terms',{text:['Exact words support formal analysis.']});
  for(const term of ['BIAS','PREJUDICE','DISCRIMINATION','RACISM'])assert.ok(plain(restoredTerms).includes(term),`TermsInOneBucket restored rail is missing “${term}”`);
  beat('TermsInOneBucket','t16Bucket',{text:['ONE SHARED BUCKET'],markup:['data-bucket-seal="true"']});

  for(const summary of ['STARTING TENDENCY','GROUP ANTIPATHY','DIFFERENTIAL BEHAVIOR','SYSTEMIC STRUCTURE'])assert.ok(plain(restoredTerms).includes(summary),`TermsInOneBucket restored rail is missing “${summary}”`);
  assert.ok(!byKind('HeartsAudit').find(frame=>frame.kind==='t13Intentions')!.html.includes('border:1px dashed'),'HeartsAudit retains the empty outlined rectangle below the funnel');

  assertPairwiseClear([SEQUENCE_LAYOUT.caption,SEQUENCE_LAYOUT.claim,SEQUENCE_LAYOUT.footer,SEQUENCE_LAYOUT.source],'SequenceAsTheory vertical text bands');
  assert.ok(SEQUENCE_LAYOUT.numberRail.x+SEQUENCE_LAYOUT.numberRail.w<=SEQUENCE_LAYOUT.graph.x,'SequenceAsTheory number rail overlaps the causal graph');
  for(let sample=0;sample<=10;sample++){
    const nodes=sequenceNodeBoxes(sample/10);
    assertPairwiseClear(nodes,`SequenceAsTheory causal nodes at sample ${sample}`);
    for(let index=0;index<3;index++)assert.ok(numberRailWirePoints(index,nodes)[0][0]-(SEQUENCE_LAYOUT.numberRail.x+SEQUENCE_LAYOUT.numberRail.w)>=12,`SequenceAsTheory rail wire ${index+1} lacks a 12 px label gap at sample ${sample}`);
  }
  assertPairwiseClear([HEARTS_LAYOUT.debate,HEARTS_LAYOUT.targets],'HeartsAudit turn 13');
  assertPairwiseClear([HEARTS_LAYOUT.inputs,HEARTS_LAYOUT.router,HEARTS_LAYOUT.thoughts],'HeartsAudit turn 14');
  assertPairwiseClear([HEARTS_LAYOUT.claim,HEARTS_LAYOUT.formal,HEARTS_LAYOUT.archive],'HeartsAudit turn 15');
  assertPairwiseClear(TERMS_LAYOUT.blocks,'TermsInOneBucket initial term blocks');
  for(const frame of byKind('TermsInOneBucket')){
    const boxes=[...frame.html.matchAll(/data-flight-box="([\d.]+),([\d.]+),([\d.]+),([\d.]+)"/g)].map(match=>({x:Number(match[1]),y:Number(match[2]),w:Number(match[3]),h:Number(match[4])}));
    assertPairwiseClear(boxes,`TermsInOneBucket ${frame.kind}`);
  }
  const finalTerms=TERMS_LAYOUT.blocks.map(block=>({...block,y:TERMS_LAYOUT.rail.y,h:TERMS_LAYOUT.rail.h}));
  assertPairwiseClear(finalTerms,'TermsInOneBucket restored analytical rail');
  assert.ok(finalTerms.every(box=>box.y+box.h+40<=TERMS_LAYOUT.bucket.y),'TermsInOneBucket restored terms do not clear the bucket rim');

  for(const scene of Object.keys(sceneComponents) as SceneName[]){
    const end=byKind(scene).find(frame=>frame.kind==='end')!;
    assert.ok(plain(end.html).length>100,`${scene} end frame is incomplete`);
  }
  console.log(`PASS: audit self-test (${selfTests} rules); ${rendered.length} Package A cue-derived frames; ${auditedItems} audited boxes; safe area, notch zones, text fit, text/shape collisions, 12 px list-wire gaps, populated analytical blocks, separated bucket geometry, storyboard beats, determinism, hook, underscore, and interaction-hint policies verified.`);
}
