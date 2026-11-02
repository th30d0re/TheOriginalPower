import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type Segment,type StagePlan} from '@stage';
import {
  CitationCard,
  DefinitionCard,
  NeuralField,
  PersonMark,
  PrecisionGauge,
  PredictiveUpdatePlot,
  SourceLine,
  StageSceneFrame,
  TermBlock,
  TrainingTextStrip,
  UsThemSortingField,
  calculatePredictivePosterior,
  priorPrecisionFor,
} from '../min3_7/shared';

const segment:Segment={instance:'foundation-check',scene:'FoundationCheck',start_ms:0,end_ms:10000,shots:[]};
const plan:StagePlan={episode:'foundation-check',fps:30,width:1920,height:1080,duration_ms:10000,range:{start_ms:0,end_ms:10000},audio:'',cues:{},segments:[segment],warnings:[]};
const marks=[
  {id:'a',x:.16,y:.28,group:'ingroup' as const},
  {id:'b',x:.32,y:.66,group:'ingroup' as const,scale:1.1},
  {id:'c',x:.68,y:.34,group:'outgroup' as const},
  {id:'d',x:.84,y:.72,group:'outgroup' as const,emphasis:1},
] as const;

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef','useMemo','useCallback'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in shared foundation render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

const sharedDirectory=new URL('../min3_7/shared/',import.meta.url);
const sourceFiles=fs.readdirSync(sharedDirectory).filter(file=>file.endsWith('.tsx'));
assert.equal(sourceFiles.length,11,'shared foundation must contain eleven TSX component files');
for(const file of sourceFiles){
  const source=fs.readFileSync(new URL(file,sharedDirectory),'utf8');
  assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),`${file} contains a forbidden React hook`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

const cases:[string,React.ReactNode][]=[
  ['StageSceneFrame-basic',<StageSceneFrame segment={segment} title="FOUNDATION FRAME" source="The Original Power, Chapter 2"><div style={{position:'absolute',left:200,top:280,fontSize:32}}>Deterministic content</div></StageSceneFrame>],
  ['StageSceneFrame-bare',<StageSceneFrame segment={segment}><div>Canvas</div></StageSceneFrame>],
  ['SourceLine-muted',<SourceLine text="American Psychological Association Dictionary of Psychology"/>],
  ['SourceLine-accent',<SourceLine text="Tajfel & Turner · 1979" x={180} y={920} tone="accent"/>],
  ['TermBlock-dim',<div style={{width:390,height:170}}><TermBlock term="BIAS" summary="a tendency in judgment" glyph={<span>β</span>} state="dim" accent="color/fill/gold" unit="a tendency"/></div>],
  ['TermBlock-selected',<div style={{width:390,height:170}}><TermBlock term="RACISM" summary="psycho-legal social software" glyph={<span>R</span>} state="selected" accent="color/marker/race" unit="a system"/></div>],
  ['TermBlock-progress',<div style={{width:390,height:170}}><TermBlock term="PREJUDICE" glyph={<span>P</span>} state={.65} accent="color/text/accent"/></div>],
  ['DefinitionCard-entering',<div style={{width:680,height:260}}><DefinitionCard term="INGROUP" definition="a group with which a person identifies" source="APA Dictionary of Psychology" paraphrased={false} progress={.45} accent="color/fill/gold"/></div>],
  ['DefinitionCard-complete',<div style={{width:680,height:260}}><DefinitionCard term="BIAS" definition="a tendency to favor or disfavor people because of group membership" source="Greenwald & Banaji 1995" paraphrased progress={1} accent="color/text/accent"/></div>],
  ['CitationCard-full',<div style={{width:760,height:230}}><CitationCard authors="Henri Tajfel and John Turner" year={1979} title="An Integrative Theory of Intergroup Conflict" progress={1}/></div>],
  ['CitationCard-compact',<div style={{width:620,height:150}}><CitationCard authors="American Psychological Association" year="Dictionary" title="Ingroup, outgroup, and ingroup bias" progress={.6} compact/></div>],
  ['PersonMark-neutral',<div style={{position:'relative',width:180,height:180}}><PersonMark x={90} y={90} group="neutral" emphasis={.35} scale={1}/></div>],
  ['PersonMark-groups',<div style={{position:'relative',width:220,height:180}}><PersonMark x={70} y={90} group="ingroup" emphasis={1} scale={1.2}/><PersonMark x={150} y={90} group="outgroup" emphasis={.8} scale={.9}/></div>],
  ['UsThem-neutral',<UsThemSortingField marks={marks} partitionProgress={0} ingroupProgress={0} outgroupProgress={0} labels={{ingroup:'US',outgroup:'THEM',boundary:'GROUP BOUNDARY'}} mode="neutral"/>],
  ['UsThem-partition',<UsThemSortingField marks={marks} partitionProgress={.7} ingroupProgress={.8} outgroupProgress={.65} labels={{ingroup:'INGROUP',outgroup:'OUTGROUP',boundary:'MEMBERSHIP'}} mode="partition"/>],
  ['UsThem-allocation',<UsThemSortingField marks={marks} partitionProgress={1} ingroupProgress={1} outgroupProgress={1} labels={{ingroup:'US',outgroup:'THEM'}} mode="allocation"/>],
  ['NeuralField-open',<NeuralField layers={[4,5,3]} inputs={['face','voice','context','history']} weights={[.2,.7,-.4,.9]} activationProgress={.3} compressionProgress={0} labels={['label A','label B','label C']}/>],
  ['NeuralField-compressed',<NeuralField layers={4} inputs={['signals','memory','setting']} weights={[[.8,.3],[-.2,.9]]} activationProgress={1} compressionProgress={.85} labels={['fast group label','prediction']}/>],
  ['PredictiveUpdatePlot-zero',<PredictiveUpdatePlot evidenceMean={.28} priorMean={.74} precision={0} showEquation={false} termHighlight="evidence" posteriorProgress={1}/>],
  ['PredictiveUpdatePlot-mid',<PredictiveUpdatePlot evidenceMean={.28} priorMean={.74} precision={.5} showEquation termHighlight="equation" posteriorProgress={1}/>],
  ['PredictiveUpdatePlot-one',<PredictiveUpdatePlot evidenceMean={.28} priorMean={.74} precision={1} showEquation termHighlight="posterior" posteriorProgress={1}/>],
  ['PrecisionGauge-low',<div style={{width:370,height:280}}><PrecisionGauge value={0} derived label="NORMALIZED PRIOR PRECISION α" lowLabel="EVIDENCE-LED" highLabel="PRIOR-LED"/></div>],
  ['PrecisionGauge-high',<div style={{width:370,height:280}}><PrecisionGauge value={1} derived label="NORMALIZED PRIOR PRECISION α" lowLabel="EVIDENCE-LED" highLabel="PRIOR-LED"/></div>],
  ['TrainingTextStrip-partial',<div style={{width:900}}><TrainingTextStrip tokens={['archive','pattern','archive','decision']} patternKey="archive-pattern" progress={.5} emphasis="archive"/></div>],
  ['TrainingTextStrip-complete',<div style={{width:900}}><TrainingTextStrip tokens={['group','threat','group','trust','group']} patternKey="group-pattern" progress={1} emphasis={['group','trust']}/></div>],
];

const rendered=cases.map(([name,node])=>{
  const html=renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms:5000,fps:30,interactive:false}}>{node}</ClockContext.Provider></PlanContext.Provider>);
  return {name,html};
});

const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);

if(process.env.MIN3_7_SHARED_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({name,html})=>({name,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  for(const {name,html} of rendered){
    assert.ok(!html.includes('NaN'),`${name} contains NaN`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${name} renders a literal underscore`);
  }

  for(const sharedName of ['StageSceneFrame','SourceLine','TermBlock','DefinitionCard','CitationCard','UsThemSortingField','PersonMark','NeuralField','PredictiveUpdatePlot','PrecisionGauge','TrainingTextStrip']){
    assert.ok(rendered.some(item=>item.html.includes(`data-shared=\"${sharedName}\"`)),`${sharedName} has no representative render`);
  }

  const evidence=.28,prior=.74,alphas=[0,.5,1];
  const states=alphas.map(alpha=>calculatePredictivePosterior(evidence,prior,alpha));
  assert.ok(Math.abs(states[0].mean-evidence)<=.02,'posterior mode at alpha 0 exceeds the 2% evidence bound');
  const midpointFraction=(states[1].mean-evidence)/(prior-evidence);
  assert.ok(midpointFraction>=.44&&midpointFraction<=.52,`posterior mode at alpha 0.5 has an unexpected fraction ${midpointFraction}`);
  assert.ok(Math.abs(states[2].mean-prior)<=.05,'posterior mode at alpha 1 exceeds the 5% prior bound');
  assert.ok(states[0].mean<states[1].mean&&states[1].mean<states[2].mean,'posterior mode fails to move monotonically toward the prior');
  assert.ok(states[0].precision<states[1].precision&&states[1].precision<states[2].precision,'posterior precision fails to rise monotonically');
  for(const [index,alpha] of alphas.entries()){
    const expectedPrior=18*(.001+alpha/(1.05-alpha));
    assert.ok(Math.abs(priorPrecisionFor(alpha)-expectedPrior)<1e-10,`prior precision mapping differs at alpha ${alpha}`);
    const expectedMean=(evidence*18+prior*expectedPrior)/(18+expectedPrior);
    assert.ok(Math.abs(states[index].mean-expectedMean)<1e-10,`posterior weighted mean differs at alpha ${alpha}`);
    const plot=rendered.find(item=>item.name===['PredictiveUpdatePlot-zero','PredictiveUpdatePlot-mid','PredictiveUpdatePlot-one'][index])!;
    assert.ok(plot.html.includes(`data-posterior-mode=\"${states[index].mean.toFixed(6)}\"`),`plot markup omits the posterior mode at alpha ${alpha}`);
    for(const curve of ['evidence','prior','posterior'])assert.ok(plot.html.includes(`data-curve=\"${curve}\"`),`plot at alpha ${alpha} omits the ${curve} Gaussian`);
  }

  console.log(`PASS: ${rendered.length} representative shared-component states; eleven component contracts, hook policy, underscore policy, Gaussian curves, posterior weighted-product formula, endpoint bounds, midpoint bound, and monotonic precision sweep verified. Posterior modes: ${states.map(state=>state.mean.toFixed(6)).join(' / ')}.`);
}

