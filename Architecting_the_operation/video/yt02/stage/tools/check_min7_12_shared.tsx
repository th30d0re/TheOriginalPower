import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type Segment,type StagePlan} from '@stage';
import {
  EquationTerms,
  ColoredTerm,
  EQUATION_PALETTE,
  EQUATION_TERMS,
  equationColor,
} from '../equations';
import {
  EvidenceToken,
  GroupDirectionField,
  QuestionHeader,
  SignalLane,
  TermTriad,
  evidenceTokenSize,
  laneGeometry,
  partialPolyline,
  questionHeaderFit,
  triadBlockLayout,
  type GroupMarkSpec,
  type TriadTerm,
} from '../min7_12/shared';
import {auditItems,auditLayout,auditSelfTest} from './layout_audit';

const segment:Segment={instance:'foundation-check',scene:'FoundationCheck',start_ms:0,end_ms:10000,shots:[]};
const plan:StagePlan={episode:'foundation-check',fps:30,width:1920,height:1080,duration_ms:10000,range:{start_ms:0,end_ms:10000},audio:'',cues:{},segments:[segment],warnings:[]};

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef','useMemo','useCallback'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in min7_12 shared render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

const sharedDirectory=new URL('../min7_12/shared/',import.meta.url);
const sourceFiles=fs.readdirSync(sharedDirectory).filter(file=>file.endsWith('.tsx'));
assert.equal(sourceFiles.length,5+1,'min7_12/shared must hold five component files and the audit helper');
for(const file of sourceFiles){
  const source=fs.readFileSync(new URL(file,sharedDirectory),'utf8');
  assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),`${file} contains a forbidden React hook`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

// ---- Storyboard geometry used as test boxes -------------------------------------------------------
const QUESTION_ALLPORT='Why does prejudice need its own label once bias is defined?';
const QUESTION_FISKE='Why does Fiske treat discrimination as its own category beside stereotyping and prejudice?';
const triad=(kinds:readonly TriadTerm[])=>kinds;

const interpersonalBoxes=[{x:140,y:210,w:480,h:180},{x:720,y:210,w:480,h:180},{x:1300,y:210,w:480,h:180}] as const;
const interpersonalTerms=triad([{kind:'bias',title:'BIAS'},{kind:'prejudice',title:'PREJUDICE'},{kind:'discrimination',title:'DISCRIMINATION'}]);
const taxonomyBoxes=[{x:160,y:270,w:500,h:470},{x:710,y:270,w:500,h:470},{x:1260,y:270,w:500,h:470}] as const;
const taxonomyTerms=(cognitive:number,thinking:number,affective:number,feeling:number,behavioral:number,acting:number):TriadTerm[]=>[
  {kind:'stereotype',title:'STEREOTYPING',lines:[{text:'COGNITIVE',progress:cognitive,tone:'accent'},{text:'THINKING PART',progress:thinking}]},
  {kind:'prejudice',title:'PREJUDICE',lines:[{text:'AFFECTIVE',progress:affective,tone:'accent'},{text:'FEELING PART',progress:feeling}]},
  {kind:'discrimination',title:'DISCRIMINATION',lines:[{text:'BEHAVIORAL',progress:behavioral,tone:'accent'},{text:'ACTING PART',progress:acting}]},
];
const literatureBoxes=[{x:160,y:310,w:340,h:250},{x:520,y:310,w:340,h:250},{x:880,y:310,w:340,h:250}] as const;
const fiskeBoxes=[{x:150,y:360,w:420,h:290},{x:750,y:360,w:420,h:290},{x:1350,y:360,w:420,h:290}] as const;
const fiskeTerms=triad([{kind:'stereotype',title:'STEREOTYPING · INTERNAL THOUGHT'},{kind:'prejudice',title:'PREJUDICE · INTERNAL FEELING'},{kind:'discrimination',title:'OBSERVABLE OUTWARD ACTION'}]);

const groupMarks=(progress:number):GroupMarkSpec[]=>[
  {id:'a1',side:'left',x:.15,y:.2,accent:'ingroup',progress},{id:'a2',side:'left',x:.8,y:.45,accent:'ingroup',scale:1.2,progress},{id:'a3',side:'left',x:.4,y:.9,accent:'neutral',progress},
  {id:'b1',side:'right',x:.2,y:.5,accent:'outgroup',progress},{id:'b2',side:'right',x:.75,y:.15,accent:'outgroup',progress},{id:'b3',side:'right',x:.6,y:.9,accent:'neutral',emphasis:1,progress},
];

const equationBox={x:830,y:650,w:970,h:110};
const equationTokens=[
  {term:'L'},{text:'q̈ + '},{term:'R'},{text:'q̇ + (1/'},{term:'C'},{text:')q = '},{term:'V'},
] as const;

const frame=(...children:React.ReactNode[])=>React.createElement('div',{style:{position:'relative',width:1920,height:1080}},...children);
type Case={name:string;node:React.ReactNode;shared:string;expect?:string[];absent?:string[];empty?:boolean};
const cases:Case[]=[
  // EvidenceToken: ledger rows with locked sockets, an entering state, kind variety, and a wrapped label.
  {name:'EvidenceToken-ledger-locked',shared:'EvidenceToken',expect:['DOCUMENTED HARM','ONGOING DISPARITY'],node:frame(
    <EvidenceToken id="harm" label="DOCUMENTED HARM" kind="documented" progress={1} emphasis={1} box={{x:120,y:320,w:480,h:56}} sourceSocket={{lock:1}}/>,
    <EvidenceToken id="disparity" label="ONGOING DISPARITY" kind="documented" progress={1} emphasis={.6} box={{x:120,y:400,w:480,h:56}} sourceSocket={{lock:1}}/>)},
  {name:'EvidenceToken-ledger-entering',shared:'EvidenceToken',expect:['DOCUMENTED HARM'],node:frame(
    <EvidenceToken id="harm" label="DOCUMENTED HARM" kind="documented" progress={.5} emphasis={0} box={{x:120,y:320,w:480,h:56}} sourceSocket={{lock:.3}}/>,
    <EvidenceToken id="wary" label="WARINESS TOWARD THE U.S. MEDICAL SYSTEM" kind="fact" progress={1} emphasis={.2} box={{x:120,y:400,w:480,h:84}}/>)},
  {name:'EvidenceToken-kinds',shared:'EvidenceToken',expect:['DIRECT FACT','PAST EXPERIENCE','CONTRARY EVIDENCE','SURROUNDINGS'],node:frame(
    <EvidenceToken id="t1" label="DIRECT FACT" kind="fact" progress={1} emphasis={0} box={{x:660,y:300,w:evidenceTokenSize('DIRECT FACT',{kind:'fact'}).w,h:46}}/>,
    <EvidenceToken id="t2" label="PAST EXPERIENCE" kind="experience" progress={1} emphasis={.5} box={{x:660,y:370,w:evidenceTokenSize('PAST EXPERIENCE',{kind:'experience'}).w,h:46}}/>,
    <EvidenceToken id="t3" label="CONTRARY EVIDENCE" kind="contrary" progress={1} emphasis={1} box={{x:660,y:440,w:evidenceTokenSize('CONTRARY EVIDENCE',{kind:'contrary'}).w,h:46}}/>,
    <EvidenceToken id="t4" label="SURROUNDINGS" kind="surroundings" progress={1} emphasis={0} box={{x:660,y:510,w:evidenceTokenSize('SURROUNDINGS',{kind:'surroundings'}).w,h:46}}/>,
    <EvidenceToken id="t5" label="" kind="fact" progress={1} emphasis={1} box={{x:660,y:580,w:60,h:36}}/>)},
  {name:'EvidenceToken-hidden',shared:'EvidenceToken',empty:true,absent:['DOCUMENTED HARM'],node:frame(
    <EvidenceToken label="DOCUMENTED HARM" kind="documented" progress={0} emphasis={1} box={{x:120,y:320,w:480,h:56}} sourceSocket={{lock:1}}/>)},

  // SignalLane: vertical facts lane, horizontal solid and dashed channels, a lane just opening, and a hidden lane.
  {name:'SignalLane-down',shared:'SignalLane',expect:['DIRECT FACTS'],node:frame(
    <SignalLane id="facts" box={{x:660,y:280,w:470,h:540}} label="DIRECT FACTS" progress={1} accent="color/text/primary" direction="down" tokens={[{id:'1',at:.15},{id:'2',at:.4,emphasis:.5},{id:'3',at:.7,shape:'card'}]}/>)},
  {name:'SignalLane-right-and-dashed',shared:'SignalLane',expect:['EXPLICIT','IMPLICIT'],node:frame(
    <SignalLane id="explicit" box={{x:620,y:230,w:1160,h:230}} label="EXPLICIT" progress={1} accent="color/fill/gold" direction="right" tokens={[{id:'1',at:.3,shape:'card'},{id:'2',at:.8}]}/>,
    <SignalLane id="implicit" box={{x:620,y:590,w:1160,h:230}} label="IMPLICIT" progress={.6} accent="color/marker/race" direction="right" dashed tokens={[{id:'1',at:.1},{id:'2',at:.25},{id:'3',at:.4}]}/>)},
  {name:'SignalLane-left-opening',shared:'SignalLane',expect:['THREAT DETECTION'],node:frame(
    <SignalLane id="threat" box={{x:1360,y:610,w:420,h:220}} label="THREAT DETECTION" progress={.2} accent="color/marker/race" direction="left" tokens={[]}/>,
    <SignalLane id="up" box={{x:200,y:300,w:150,h:520}} label="" progress={1} accent="color/fill/gold" direction="up" tokens={[{id:'1',at:.5}]} bare/>)},
  {name:'SignalLane-hidden',shared:'SignalLane',empty:true,absent:['EXPLICIT'],node:frame(
    <SignalLane box={{x:620,y:230,w:1160,h:230}} label="EXPLICIT" progress={0} accent="color/fill/gold" direction="right" tokens={[{id:'1',at:.3}]}/>)},

  // QuestionHeader: the two spoken questions, one mid-entrance, one hidden.
  {name:'QuestionHeader-allport',shared:'QuestionHeader',expect:[QUESTION_ALLPORT],node:frame(
    <QuestionHeader id="q" box={{x:150,y:110,w:1620,h:135}} text={QUESTION_ALLPORT} progress={1} accentTerm="prejudice"/>)},
  {name:'QuestionHeader-fiske-entering',shared:'QuestionHeader',expect:[QUESTION_FISKE],node:frame(
    <QuestionHeader id="q" box={{x:150,y:105,w:1620,h:140}} text={QUESTION_FISKE} progress={.5} accentTerm="discrimination" accent="color/text/accent"/>)},
  {name:'QuestionHeader-plain',shared:'QuestionHeader',expect:[QUESTION_FISKE],node:frame(
    <QuestionHeader id="q" box={{x:150,y:105,w:1620,h:140}} text={QUESTION_FISKE} progress={1}/>)},
  {name:'QuestionHeader-hidden',shared:'QuestionHeader',empty:true,absent:[QUESTION_ALLPORT],node:frame(
    <QuestionHeader box={{x:150,y:110,w:1620,h:135}} text={QUESTION_ALLPORT} progress={0}/>)},

  // TermTriad: interpersonal rail, taxonomy modules, compact literature sockets, Fiske cards.
  {name:'TermTriad-interpersonal-complete',shared:'TermTriad',expect:['BIAS','GREENWALD & BANAJI 1995','ALLPORT 1954','FISKE 1998','INTERPERSONAL CLASS'],node:frame(
    <TermTriad id="rail" boxes={interpersonalBoxes} terms={interpersonalTerms} states={['active','selected',1]} progress={1} bracketLabel="INTERPERSONAL CLASS" bracketBox={{x:230,y:445,w:1460,h:75}}
      sources={[{text:'GREENWALD & BANAJI 1995',progress:1},{text:'ALLPORT 1954',progress:1},{text:'FISKE 1998',progress:1}]} pulses={[0,.6,0]}/>)},
  {name:'TermTriad-interpersonal-entering',shared:'TermTriad',expect:['BIAS','GREENWALD & BANAJI 1995'],absent:['ALLPORT 1954','FISKE 1998','INTERPERSONAL CLASS','DISCRIMINATION'],node:frame(
    <TermTriad id="rail" boxes={interpersonalBoxes} terms={interpersonalTerms} states={[1,.6,'hidden']} progress={.4} bracketLabel="INTERPERSONAL CLASS"
      sources={[{text:'GREENWALD & BANAJI 1995',progress:.5},null,undefined]}/>)},
  {name:'TermTriad-taxonomy-partial',shared:'TermTriad',expect:['STEREOTYPING','COGNITIVE','THINKING PART','PREJUDICE','AFFECTIVE'],absent:['FEELING PART','DISCRIMINATION','BEHAVIORAL','ACTING PART','THREE DISTINCT PSYCHOLOGICAL PARTS'],node:frame(
    <TermTriad id="tax" boxes={taxonomyBoxes} terms={taxonomyTerms(1,1,1,0,0,0)} states={[1,1,'hidden']} progress={.5} bracketLabel="THREE DISTINCT PSYCHOLOGICAL PARTS" bracketBox={{x:350,y:800,w:1220,h:75}} socketProgress={1}/>)},
  {name:'TermTriad-taxonomy-complete',shared:'TermTriad',expect:['STEREOTYPING','COGNITIVE','THINKING PART','PREJUDICE','AFFECTIVE','FEELING PART','DISCRIMINATION','BEHAVIORAL','ACTING PART','THREE DISTINCT PSYCHOLOGICAL PARTS'],node:frame(
    <TermTriad id="tax" boxes={taxonomyBoxes} terms={taxonomyTerms(1,1,1,1,1,1)} states={[1,1,1]} progress={1} bracketLabel="THREE DISTINCT PSYCHOLOGICAL PARTS" bracketBox={{x:350,y:800,w:1220,h:75}}/>)},
  {name:'TermTriad-literature-compact',shared:'TermTriad',expect:['BIAS · GREENWALD & BANAJI 1995','PREJUDICE'],node:frame(
    <TermTriad id="lit" boxes={literatureBoxes} terms={triad([{kind:'bias',title:'BIAS · GREENWALD & BANAJI 1995'},{kind:'prejudice',title:'PREJUDICE · ALLPORT 1954'},{kind:'discrimination',title:'DISCRIMINATION · FISKE 1998'}])} states={[1,.6,0]} progress={0} socketProgress={.8}/>)},
  {name:'TermTriad-fiske-cards',shared:'TermTriad',expect:['STEREOTYPING · INTERNAL THOUGHT','PREJUDICE · INTERNAL FEELING','OBSERVABLE OUTWARD ACTION'],node:frame(
    <TermTriad id="fiske" boxes={fiskeBoxes} terms={fiskeTerms} states={['dim','active','selected']} progress={0}/>)},
  {name:'TermTriad-hidden',shared:'TermTriad',empty:true,absent:['BIAS','PREJUDICE'],node:frame(
    <TermTriad boxes={interpersonalBoxes} terms={interpersonalTerms} states={['hidden','hidden',0]} progress={0}/>)},

  // GroupDirectionField: boundaries only, forward arrow drawing, both arrows with captions, contracted left.
  {name:'GroupDirectionField-boundaries',shared:'GroupDirectionField',expect:['GROUP A','GROUP B'],node:frame(
    <GroupDirectionField id="field" box={{x:120,y:545,w:1060,h:355}} marks={groupMarks(1)} leftLabel="GROUP A" rightLabel="GROUP B" forwardProgress={0} reverseProgress={0} boundaryProgress={.7}/>)},
  {name:'GroupDirectionField-forward',shared:'GroupDirectionField',expect:['GROUP A'],node:frame(
    <GroupDirectionField id="field" box={{x:120,y:545,w:1060,h:355}} marks={groupMarks(1)} leftLabel="GROUP A" rightLabel="GROUP B" forwardProgress={.55} reverseProgress={0}/>)},
  {name:'GroupDirectionField-bidirectional',shared:'GroupDirectionField',expect:['GROUP A','GROUP B','MENTAL BIAS','UNEQUAL TREATMENT'],node:frame(
    <GroupDirectionField id="field" box={{x:120,y:545,w:1060,h:355}} marks={groupMarks(1)} leftLabel="GROUP A" rightLabel="GROUP B" forwardProgress={1} reverseProgress={1} insideLabels={{left:'MENTAL BIAS',right:'UNEQUAL TREATMENT'}}/>)},
  {name:'GroupDirectionField-contracted',shared:'GroupDirectionField',expect:['GROUP A'],node:frame(
    <GroupDirectionField id="field" box={{x:120,y:545,w:700,h:355}} marks={groupMarks(.8)} leftLabel="GROUP A" rightLabel="GROUP B" forwardProgress={1} reverseProgress={.4}/>)},
  {name:'GroupDirectionField-hidden',shared:'GroupDirectionField',empty:true,absent:['GROUP A'],node:frame(
    <GroupDirectionField box={{x:120,y:545,w:1060,h:355}} marks={groupMarks(1)} leftLabel="GROUP A" rightLabel="GROUP B" forwardProgress={0} reverseProgress={0} boundaryProgress={0}/>)},

  // Equation registry additions: Eq. 2.11 tokens rendered through EquationTerms.
  {name:'EquationTerms-eq-2-11',shared:'',node:frame(
    <EquationTerms equation="2.11" ms={5000} pulses={{}} box={equationBox} fontSize={32} tokens={[...equationTokens]}/>)},
];

const rendered=cases.map(item=>({...item,html:renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms:5000,fps:30,interactive:false}}>{item.node}</ClockContext.Provider></PlanContext.Provider>)}));

const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
const visibleText=(html:string)=>auditItems(html).filter(item=>item.opacity>.05&&item.role==='text').map(item=>item.text).join('\n');

if(process.env.MIN7_12_SHARED_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({name,html})=>({name,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  const selfTests=auditSelfTest();
  let boxes=0;
  const violations:string[]=[];
  for(const {name,html,expect,absent,empty,shared} of rendered){
    assert.ok(!html.includes('NaN')&&!html.includes('undefined'),`${name} contains NaN or undefined`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${name} renders a literal underscore`);
    assert.ok(!/\b(?:click|tap|hover|drag|swipe|press)\b/i.test(visibleText(html)),`${name} renders an interaction hint`);
    for(const problem of auditLayout(html))violations.push(`${name}: ${problem}`);
    const items=auditItems(html);
    boxes+=items.length;
    if(empty)assert.equal(items.length,0,`${name} must declare no audited element while hidden`);
    if(shared&&!empty)assert.ok(html.includes(`data-shared="${shared}"`),`${name} lacks data-shared="${shared}"`);
    const text=visibleText(html);
    for(const phrase of expect??[])assert.ok(text.includes(phrase),`${name} omits "${phrase}"`);
    for(const phrase of absent??[])assert.ok(!html.includes(phrase),`${name} renders "${phrase}" before its beat`);
  }
  assert.deepEqual(violations,[],`layout audit failed:\n${violations.slice(0,40).join('\n')}`);

  // The audit is sensitive to these components: an undersized token and a crowded header are caught.
  const tight=renderToStaticMarkup(frame(<EvidenceToken id="tight" label="ONGOING DISPARITY" kind="documented" progress={1} emphasis={0} box={{x:120,y:320,w:140,h:56}} sourceSocket={{lock:1}}/>));
  assert.ok(auditLayout(tight).some(problem=>/needs about/.test(problem)),'an undersized EvidenceToken passes the layout audit');
  const crowded=renderToStaticMarkup(frame(<TermTriad id="c" boxes={[{x:160,y:310,w:200,h:120}]} terms={[{kind:'discrimination',title:'DISCRIMINATION'}]} states={['active']} progress={0}/>));
  assert.ok(auditLayout(crowded).length>0,'an undersized TermTriad block passes the layout audit');

  // Geometry contracts.
  const eight=evidenceTokenSize('ONGOING DISPARITY',{socket:true,kind:'documented'});
  assert.ok(eight.w>=14+4+28+Math.ceil(17*(12+.6))+12-1&&eight.h===46,'evidenceTokenSize does not follow the glyph advance');
  const tokenFit=renderToStaticMarkup(frame(<EvidenceToken id="fit" label="ONGOING DISPARITY" kind="documented" progress={1} emphasis={0} box={{x:120,y:320,...eight}} sourceSocket={{lock:1}}/>));
  assert.deepEqual(auditLayout(tokenFit),[],'evidenceTokenSize yields a box the audit rejects');
  const lane=laneGeometry({x:620,y:230,w:1160,h:230},'right');
  assert.deepEqual([lane.start,lane.end],[[644,359],[1756,359]],'laneGeometry horizontal rail changed');
  assert.equal(laneGeometry({x:660,y:280,w:470,h:540},'down').start[0],895,'laneGeometry vertical rail is not centred');
  const half=partialPolyline([[0,0],[100,0],[100,100]],.5);
  assert.deepEqual(half,[[0,0],[100,0],[100,0]],'partialPolyline midpoint is wrong');
  assert.equal(questionHeaderFit(QUESTION_FISKE,{x:150,y:105,w:1620,h:140}).lines<=2,true,'the Fiske question does not fit two lines');
  const row=triadBlockLayout({x:140,y:210,w:480,h:180},interpersonalTerms[2]);
  assert.equal(row.mode,'row','a 480 px block must use the row layout');
  assert.equal(triadBlockLayout({x:160,y:310,w:340,h:250},interpersonalTerms[2]).mode,'stack','a 340 px block must use the stack layout');

  // Arrow symmetry: both group arrows use the same stroke weight.
  const bidirectional=rendered.find(item=>item.name==='GroupDirectionField-bidirectional')!.html;
  const strokes=[...bidirectional.matchAll(/<path data-shape="field-(forward|reverse)"[^>]*?stroke-width="(\d+)"/g)].map(match=>`${match[1]}:${match[2]}`);
  assert.deepEqual(strokes,['forward:5','reverse:5'],`group arrows differ in weight: ${strokes.join(' ')}`);

  // Registry additions: palette slots, colours and spoken-word pulses at cue + 200 ms.
  const additions={L:{slot:3,hex:'#86efac'},R:{slot:6,hex:'#f9a8d4'},C:{slot:7,hex:'#a5f3fc'},q:{slot:8,hex:'#d9f99d'},V:{slot:10,hex:'#93c5fd'}} as const;
  const slots=Object.values(EQUATION_TERMS).map(term=>term.slot);
  assert.equal(new Set(slots).size,slots.length,'two registry terms share a palette slot');
  const cue=1000;
  for(const [term,expected] of Object.entries(additions) as [keyof typeof additions,{slot:number;hex:string}][]){
    assert.equal(EQUATION_TERMS[term].slot,expected.slot,`${term} slot`);
    assert.equal(EQUATION_PALETTE[expected.slot],expected.hex,`${term} palette hex`);
    assert.equal(equationColor(EQUATION_TERMS[term].slot),expected.hex);
    const at=(ms:number)=>renderToStaticMarkup(<ColoredTerm term={term} ms={ms} pulses={[cue]} box={{x:100,y:100,w:60,h:40}}/>);
    const peak=at(cue+200),rest=at(cue+800);
    assert.ok(peak.includes(`data-term="${term}"`)&&peak.includes(`data-term-color="${expected.hex}"`),`${term} peak lacks its registry colour`);
    assert.ok(peak.includes('data-pulse="1.0000"'),`${term} does not peak at cue + 200 ms`);
    assert.ok(rest.includes('data-pulse="0.0000"')&&rest.includes('data-scale="1.0000"'),`${term} is not at rest after cue + 600 ms`);
  }
  const eq=rendered.find(item=>item.name==='EquationTerms-eq-2-11')!.html;
  for(const term of Object.keys(additions).filter(term=>term!=='q'))assert.ok(eq.includes(`data-term="${term}"`),`Eq. 2.11 sample omits ${term}`);

  console.log(`PASS: audit self-test (${selfTests} rules); ${rendered.length} min7_12 shared-component states; layout audit of ${boxes} declared boxes (safe area, notch zones, text fit, collisions); hook, underscore and interaction-hint policies; hidden states render nothing; five registry additions (L, R, C, q, V) keep their palette colours and peak at cue + 200 ms.`);
}
