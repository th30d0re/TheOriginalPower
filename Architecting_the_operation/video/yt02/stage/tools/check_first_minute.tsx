import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type StagePlan} from '@stage';
import {TitleOpen} from '../firstminute/TitleOpen';
import {DICTIONARY_LAYOUT, DICTIONARY_LIFT_X, DictionaryEntry} from '../firstminute/DictionaryEntry';
import {WHY_LAYOUT, WhyLadder} from '../firstminute/WhyLadder';
import {LITERATURE_LAYOUT, LiteratureStack} from '../firstminute/LiteratureStack';
import {Disclosure} from '../firstminute/Disclosure';
import {EQUATION_TERMS,equationColor} from '../equations';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const sceneComponents={TitleOpen,DictionaryEntry,WhyLadder,LiteratureStack,Disclosure};
type SceneName=keyof typeof sceneComponents;
const sceneCues:Record<SceneName,string[]>={
  TitleOpen:['title','archives','equations','tests','slam','series','episode','definition','fails'],
  DictionaryEntry:['common','wrong','dictionary','individual','institutional','order','causal','evidence'],
  WhyLadder:['header','why1','why2','why3','virginia','why4','backlash'],
  LiteratureStack:['established','bias','prejudice','discrimination','tripartite','mark','stops'],
  Disclosure:['narration','clone','speech','disclosureEnd'],
};

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in first-minute render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

const sourceFiles=['TitleOpen.tsx','DictionaryEntry.tsx','WhyLadder.tsx','LiteratureStack.tsx','Disclosure.tsx'];
for(const file of sourceFiles){
  const source=fs.readFileSync(new URL(`../firstminute/${file}`,import.meta.url),'utf8');
  assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),`${file} contains a forbidden hook`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

function render(scene:SceneName,ms:number){
  const Scene=sceneComponents[scene],segment=plan.segments.find(s=>s.scene===scene)!;
  return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:plan.fps,interactive:false}}><Scene segment={segment} shots={segment.shots} shotAt={m=>segment.shots.find(s=>m>=s.start_ms&&m<s.end_ms)}/></ClockContext.Provider></PlanContext.Provider>);
}
function plain(html:string){
  return html.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&gt;','>').replaceAll('&lt;','<').replace(/\s+/g,' ').trim();
}
function assertStrings(scene:SceneName,cue:string,strings:string[]){
  const html=render(scene,plan.cues[cue]+800),text=plain(html);
  for(const expected of strings)assert.ok(text.includes(expected),`${scene} at ${cue}+800 ms is missing “${expected}”`);
  return html;
}
const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
const interactionHint=/\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;

const frames:{scene:SceneName;ms:number;kind:string}[]=[];
for(const scene of Object.keys(sceneComponents) as SceneName[]){
  const segment=plan.segments.find(item=>item.scene===scene)!;
  frames.push({scene,ms:segment.start_ms,kind:'start'});
  for(const cue of sceneCues[scene])frames.push({scene,ms:plan.cues[cue]+800,kind:cue});
  frames.push({scene,ms:segment.end_ms-1000/plan.fps,kind:'end'});
}
const rendered=frames.map(frame=>({
  ...frame,
  html:render(frame.scene,frame.ms),
}));

if(process.env.FIRST_MINUTE_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({scene,ms,kind,html})=>({scene,ms,kind,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  for(const {scene,ms,kind,html} of rendered){
    assert.ok(!html.includes('NaN'),`${scene} ${kind} at ${ms} contains NaN`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${scene} ${kind} renders a literal underscore`);
    assert.ok(!interactionHint.test(plain(html)),`${scene} ${kind} renders an interaction hint`);
  }

  assertStrings('TitleOpen','title',['The Original Power','Emmanuel Theodore']);
  assertStrings('TitleOpen','archives',['Archives','ARCHIVE · 1676']);
  const equationHtml=assertStrings('TitleOpen','equations',['Equations','W = ψ']);
  assert.ok(equationHtml.includes('<sub')&&equationHtml.includes('>m</sub>')&&equationHtml.includes('>s</sub>'),'TitleOpen equation lacks real subscripts');
  assertStrings('TitleOpen','tests',['Tests']);
  assertStrings('TitleOpen','episode',['What Racism Actually Is']);
  assertStrings('TitleOpen','slam',['1,158 PAGES']);
  assertStrings('TitleOpen','series',['ARCHITECTING THE OPERATION · SERIES PREMIERE']);
  assertStrings('TitleOpen','definition',['Not What You Were Taught']);
  const titleEnd=assertStrings('TitleOpen','fails',['Not What You Were Taught']);
  assert.ok(/data-fails-underline="true"[^>]*scaleX\(1\)/.test(titleEnd),'TitleOpen underline is not fully drawn');

  assertStrings('DictionaryEntry','common',['The common definition of racism']);
  assertStrings('DictionaryEntry','wrong',['wrong']);
  assertStrings('DictionaryEntry','dictionary',['rac·ism','(noun)','Individual prejudice or discrimination based on race','Belief in racial superiority']);
  const individualEntry=assertStrings('DictionaryEntry','individual',['Individual prejudice or discrimination based on race']);
  assert.ok(individualEntry.includes(`data-term="IndividualPrejudice"`)&&individualEntry.includes(`data-term-color="${equationColor(EQUATION_TERMS.IndividualPrejudice.slot)}"`),'DictionaryEntry individual prejudice does not use the registry colour');
  const institutionalEntry=assertStrings('DictionaryEntry','institutional',['Systemic or institutional discrimination','if present at all']);
  assert.ok(institutionalEntry.includes(`data-term="SystemicOutcomes"`)&&institutionalEntry.includes(`data-term-color="${equationColor(EQUATION_TERMS.SystemicOutcomes.slot)}"`),'DictionaryEntry institutional pattern does not use the registry colour');
  const orderHtml=assertStrings('DictionaryEntry','order',['1','2','3']);
  assert.ok(orderHtml.includes(`translateX(${DICTIONARY_LIFT_X}px)`),'DictionaryEntry sense numbers have not lifted into the gutter column');
  assertStrings('DictionaryEntry','causal',['causal story','Individual Prejudice','Discriminatory Actions','Systemic Outcomes']);
  assertStrings('DictionaryEntry','evidence',['evidence','The Original Power, §Racism as Primary Example · Eq. 2.5']);

  const whySegment=plan.segments.find(item=>item.scene==='WhyLadder')!;
  assert.ok(plain(render('WhyLadder',whySegment.start_ms)).includes('The common definition of racism'),'WhyLadder does not open on DictionaryEntry final state');
  assertStrings('WhyLadder','header',['Why, at every step']);
  assertStrings('WhyLadder','why1',['Why does the dictionary order matter?']);
  assertStrings('WhyLadder','why2',['Why separate bias from racism?','bias','a tendency in judgment','racism','psycho-legal social software']);
  assertStrings('WhyLadder','why3',['Why did Virginia write racial law when solidarity threatened planters?','Virginia · 1676']);
  assertStrings('WhyLadder','virginia',['Virginia · 1676']);
  assertStrings('WhyLadder','why4',['Why does reform produce backlash?','reform → backlash']);
  assertStrings('WhyLadder','backlash',['reform → backlash']);

  assertStrings('LiteratureStack','established',['Established social science']);
  assertStrings('LiteratureStack','bias',['Bias','a tendency to favor or disfavor people because of group membership','Greenwald & Banaji 1995']);
  assertStrings('LiteratureStack','prejudice',['Prejudice','antipathy toward a group, grounded in a rigid, erroneous generalization','Allport 1954, p. 9']);
  assertStrings('LiteratureStack','discrimination',['Discrimination','behavior that treats people differently because of group membership']);
  assertStrings('LiteratureStack','tripartite',['thinking','stereotype','feeling','prejudice','behavior','discrimination','Tripartite model · Fiske 1998']);
  assertStrings('LiteratureStack','mark',['Tripartite model · Fiske 1998']);
  assertStrings('LiteratureStack','stops',['where the literature stops']);

  assertStrings('Disclosure','narration',['This narration uses an artificial intelligence voice clone trained on my speech for long-form exposition.','Narrator: Emmanuel Theodore, author of The Original Power']);
  const cloneHtml=assertStrings('Disclosure','clone',['voice clone']);
  assert.ok(cloneHtml.includes(`color:${'rgba(224,163,60,1)'}`),'Disclosure voice-clone phrase is not gold');
  assertStrings('Disclosure','speech',['trained on my speech']);
  assertStrings('Disclosure','disclosureEnd',['long-form exposition.']);
  assert.equal((render('Disclosure',plan.cues.disclosureEnd).match(/<path/g)??[]).length>=2,true,'Disclosure waveform paths are missing');

  // Fix pass 1: static geometry asserts from the exported layout constants.
  {
    const d=DICTIONARY_LAYOUT;
    const panelRight=d.panelX+d.orderShiftX+d.panelW;
    assert.ok(d.gutterX>panelRight,`DictionaryEntry number gutter (${d.gutterX}) overlaps the shifted panel (right edge ${panelRight})`);
    assert.equal(d.panelX+d.orderShiftX+d.numberInsetX+DICTIONARY_LIFT_X,d.gutterX,'DictionaryEntry lift does not land on the gutter column');
    assert.ok(d.chainX>d.gutterX+20,`DictionaryEntry chain (${d.chainX}) does not draw right of the number gutter (${d.gutterX})`);

    assert.ok(WHY_LAYOUT.headerX===WHY_LAYOUT.columnX&&WHY_LAYOUT.columnX>=120,`WhyLadder header (${WHY_LAYOUT.headerX}) and thumbnail column (${WHY_LAYOUT.columnX}) do not share a left edge ≥ 120`);

    assert.ok(LITERATURE_LAYOUT.boundaryY>=760&&LITERATURE_LAYOUT.boundaryY<=800,`LiteratureStack boundary y ${LITERATURE_LAYOUT.boundaryY} outside 760–800`);
    const textRects=LITERATURE_LAYOUT.blockYs.map(y=>({x:LITERATURE_LAYOUT.definitionColumnX,y,w:LITERATURE_LAYOUT.definitionColumnW,h:LITERATURE_LAYOUT.blockH}));
    const segHitsRect=(seg:readonly number[],rect:{x:number;y:number;w:number;h:number})=>{
      const [x1,y1,x2,y2]=seg;
      if(x1===x2){const lo=Math.min(y1,y2),hi=Math.max(y1,y2);return x1>rect.x&&x1<rect.x+rect.w&&hi>rect.y&&lo<rect.y+rect.h;}
      if(y1===y2){const lo=Math.min(x1,x2),hi=Math.max(x1,x2);return y1>rect.y&&y1<rect.y+rect.h&&hi>rect.x&&lo<rect.x+rect.w;}
      throw new Error('non-orthogonal connector segment');
    };
    for(const connector of LITERATURE_LAYOUT.connectors)
      for(let i=0;i+1<connector.length;i++)
        for(const rect of textRects)
          assert.ok(!segHitsRect([...connector[i],...connector[i+1]],rect),`LiteratureStack connector segment ${connector[i]}→${connector[i+1]} crosses a block text box`);
  }

  console.log(`PASS: ${rendered.length} cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; fix-pass-1 geometry: DictionaryEntry gutter x ${DICTIONARY_LAYOUT.gutterX} clear of panel edge ${DICTIONARY_LAYOUT.panelX+DICTIONARY_LAYOUT.orderShiftX+DICTIONARY_LAYOUT.panelW} with chain at ${DICTIONARY_LAYOUT.chainX}; WhyLadder header/column aligned at x ${WHY_LAYOUT.columnX}; LiteratureStack boundary y ${LITERATURE_LAYOUT.boundaryY} and elbow connectors clear of all block text boxes.`);
}
