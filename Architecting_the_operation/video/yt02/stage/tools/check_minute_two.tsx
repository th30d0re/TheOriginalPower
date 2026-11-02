import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ClockContext,PlanContext,type StagePlan} from '@stage';
import {EntryOpen, ENTRY_OPEN_LAYOUT} from '../minutetwo/EntryOpen';
import {SenseOne} from '../minutetwo/SenseOne';
import {SenseTwo} from '../minutetwo/SenseTwo';
import {SenseThree, SENSE3_METER} from '../minutetwo/SenseThree';
import {FigureTwoThree, FIGURE_LAYOUT} from '../minutetwo/FigureTwoThree';
import {RAIL, CARD} from '../minutetwo/EntryRail';

const plan=JSON.parse(fs.readFileSync(new URL('../ov/stage_plan.json',import.meta.url),'utf8')) as StagePlan;
const sceneComponents={EntryOpen,SenseOne,SenseTwo,SenseThree,FigureTwoThree};
type SceneName=keyof typeof sceneComponents;
const sceneCues:Record<SceneName,string[]>={
  EntryOpen:['t6Why','t6Open','t6Numbered','t6Begin','t6Individual','t6Systemic','t6Bottom','t6Includes'],
  SenseOne:['t7Sense','t7Prejudice','t7Hostility','t7Discrimination','t7Person','t7Race'],
  SenseTwo:['t8Sense','t8Ideological','t8Doctrine','t8Biological','t8Groups','t8Determine','t8Achievement'],
  SenseThree:['t9Sense','t9Third','t9Institutional','t9Practices','t9Unequal','t9Categories'],
  FigureTwoThree:['t10Figure','t10Chapter','t10Displays','t10Order','t10Column','t10Pyramid','t10End'],
};

for(const hook of ['useState','useEffect','useLayoutEffect','useReducer','useRef'] as const){
  (React as any)[hook]=()=>{throw new Error(`${hook} reached in minute-two render`);};
  const Probe=()=>{(React as any)[hook]();return null;};
  assert.throws(()=>renderToStaticMarkup(<Probe/>),new RegExp(`${hook} reached`));
}

const sourceFiles=['EntryOpen.tsx','SenseOne.tsx','SenseTwo.tsx','SenseThree.tsx','FigureTwoThree.tsx','EntryRail.tsx'];
for(const file of sourceFiles){
  const source=fs.readFileSync(new URL(`../minutetwo/${file}`,import.meta.url),'utf8');
  assert.ok(!/\buse(?:State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback)\b/.test(source),`${file} contains a forbidden hook`);
  assert.ok(!/\b(?:Math\.random|Date\b|getBoundingClientRect|offsetWidth|offsetHeight)\b/.test(source),`${file} contains a nondeterministic or measured path`);
}

function render(scene:SceneName,ms:number){
  const Scene=sceneComponents[scene],segment=plan.segments.find(x=>x.scene===scene)!;
  return renderToStaticMarkup(<PlanContext.Provider value={plan}><ClockContext.Provider value={{ms,fps:plan.fps,interactive:false}}><Scene segment={segment} shots={segment.shots} shotAt={m=>segment.shots.find(x=>m>=x.start_ms&&m<x.end_ms)}/></ClockContext.Provider></PlanContext.Provider>);
}
function plain(html:string){
  return html.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&gt;','>').replaceAll('&lt;','<').replace(/\s+/g,' ').trim();
}
const renderedUnderscoreText=(html:string)=>[...html.matchAll(/>([^<>]*_[A-Za-z{][^<>]*)</g)].map(match=>match[1].trim()).filter(Boolean);
const interactionHint=/\b(?:click|drag|hover|tap|swipe|press|arrow keys)\b/i;

const frames:{scene:SceneName;ms:number;kind:string}[]=[];
for(const scene of Object.keys(sceneComponents) as SceneName[]){
  const segment=plan.segments.find(item=>item.scene===scene)!;
  frames.push({scene,ms:segment.start_ms,kind:'start'});
  for(const cue of sceneCues[scene])frames.push({scene,ms:plan.cues[cue]+700,kind:cue});
  frames.push({scene,ms:segment.end_ms-1000/plan.fps,kind:'end'});
}
const rendered=frames.map(frame=>({...frame,html:render(frame.scene,frame.ms)}));
const byKind=(scene:SceneName)=>rendered.filter(frame=>frame.scene===scene);

// A beat's strings must be present at cue+700 and absent from every sampled frame
// strictly before the cue. `absentBeforeCue` covers beats the brief writes as a pair
// (t10Displays / t10Order): the strings arrive during the flight the first cue starts
// and the second completes, so absence is measured before the first.
function beat(scene:SceneName,cue:string,opts:{text?:string[];markup?:string[]},absentBeforeCue?:string){
  const frame=byKind(scene).find(item=>item.kind===cue)!;
  const text=plain(frame.html);
  for(const expected of opts.text??[])assert.ok(text.includes(expected),`${scene} at ${cue}+700 ms is missing “${expected}”`);
  for(const expected of opts.markup??[])assert.ok(frame.html.includes(expected),`${scene} at ${cue}+700 ms is missing markup ${expected}`);
  const absentBefore=plan.cues[absentBeforeCue??cue];
  for(const earlier of byKind(scene)){
    if(earlier.ms>=absentBefore-1)continue;
    const earlierText=plain(earlier.html);
    for(const expected of opts.text??[])assert.ok(!earlierText.includes(expected),`${scene} at ${earlier.kind} (${earlier.ms} ms) already shows “${expected}” before ${absentBeforeCue??cue}`);
    for(const expected of opts.markup??[])assert.ok(!earlier.html.includes(expected),`${scene} at ${earlier.kind} (${earlier.ms} ms) already shows markup ${expected} before ${absentBeforeCue??cue}`);
  }
  return frame.html;
}

if(process.env.MINUTE_TWO_SNAPSHOT==='1'){
  console.log(JSON.stringify(rendered.map(({scene,ms,kind,html})=>({scene,ms,kind,hash:createHash('sha256').update(html).digest('hex')}))));
}else{
  for(const {scene,ms,kind,html} of rendered){
    assert.ok(!html.includes('NaN'),`${scene} ${kind} at ${ms} contains NaN`);
    assert.deepEqual(renderedUnderscoreText(html),[],`${scene} ${kind} renders a literal underscore`);
    assert.ok(!interactionHint.test(plain(html)),`${scene} ${kind} renders an interaction hint`);
  }

  // Turn 6 · EntryOpen
  beat('EntryOpen','t6Why',{text:['Why does the dictionary list individual prejudice first?']});
  beat('EntryOpen','t6Open',{text:['rac·ism','(noun)','Typical dictionary senses (paraphrased)'],markup:['data-entry-panel="true"']});
  beat('EntryOpen','t6Numbered',{markup:['data-entry-slot="1"','data-entry-slot="2"','data-entry-slot="3"']});
  beat('EntryOpen','t6Begin',{text:['individual prejudice or discrimination']});
  const systemicHtml=beat('EntryOpen','t6Systemic',{text:['systemic racism'],markup:['data-slot3-phase="filled"']});
  beat('EntryOpen','t6Bottom',{markup:['data-slot3-phase="bottom"','data-slot2-placeholder="true"']});
  const includesHtml=beat('EntryOpen','t6Includes',{text:['when included at all'],markup:['data-slot3-phase="included"']});
  assert.ok(includesHtml.includes('border:1px dashed'),'EntryOpen slot 3 border is not dashed after t6Includes');

  // Turn 7 · SenseOne
  beat('SenseOne','t7Sense',{text:['Sense 1','Typical dictionary senses','(paraphrased)'],markup:['data-rail-state="lit"','data-rail-state="placeholder"']});
  beat('SenseOne','t7Prejudice',{markup:['data-phrase="t7Prejudice"','data-arrow-label="prejudice"']});
  beat('SenseOne','t7Hostility',{text:[', hostility,'],markup:['data-phrase="t7Hostility"','data-arrow-label="hostility"']});
  beat('SenseOne','t7Discrimination',{text:['or discrimination'],markup:['data-phrase="t7Discrimination"','data-arrow-label="discrimination"']});
  beat('SenseOne','t7Person',{text:['directed against another person'],markup:['data-arrow="sense1"']});
  beat('SenseOne','t7Race',{text:['on the basis of race or ethnicity','unit: one person'],markup:['data-rail-unit="one person"']});
  {
    const end=byKind('SenseOne').find(frame=>frame.kind==='end')!;
    assert.ok(plain(end.html).includes('individual prejudice, hostility, or discrimination directed against another person on the basis of race or ethnicity.'),'SenseOne end frame does not hold the assembled definition');
  }

  // Turn 8 · SenseTwo
  beat('SenseTwo','t8Sense',{text:['Sense 2','Typical dictionary senses','(paraphrased)'],markup:['data-rail-unit="one person"']});
  beat('SenseTwo','t8Ideological',{text:['an ideological belief'],markup:['data-phrase="t8Ideological"']});
  beat('SenseTwo','t8Doctrine',{text:['or doctrine','doctrine'],markup:['data-phrase="t8Doctrine"','data-thought-bubble="true"']});
  beat('SenseTwo','t8Biological',{text:['built-in biological differences'],markup:['data-phrase="t8Biological"','data-diagram-box="biological differences"']});
  beat('SenseTwo','t8Groups',{text:['among human racial groups'],markup:['data-phrase="t8Groups"','data-diagram-box="racial groups"']});
  beat('SenseTwo','t8Determine',{text:['determine cultural or intellectual achievement','claimed to determine'],markup:['data-phrase="t8Determine"']});
  beat('SenseTwo','t8Achievement',{text:['unit: a belief'],markup:['data-diagram-box="achievement"','data-rail-unit="a belief"']});
  {
    const end=byKind('SenseTwo').find(frame=>frame.kind==='end')!;
    assert.ok(plain(end.html).includes('an ideological belief or doctrine holding that built-in biological differences among human racial groups determine cultural or intellectual achievement.'),'SenseTwo end frame does not hold the assembled definition');
  }

  // Turn 9 · SenseThree
  const senseOpen=beat('SenseThree','t9Sense',{text:['Sense 3','Typical dictionary senses','(paraphrased)'],markup:['data-rail-unit="one person"','data-rail-unit="a belief"']});
  assert.ok(senseOpen.includes('data-card-border="dashed"'),'SenseThree card is not dashed at t9Sense+700');
  assert.ok(senseOpen.includes('data-rail-state="dashed"'),'SenseThree rail slot 3 is not dashed at t9Sense+700');
  const thirdHtml=beat('SenseThree','t9Third',{});
  assert.ok(thirdHtml.includes('data-card-border="solid"'),'SenseThree card is not solid at t9Third+700');
  assert.ok(thirdHtml.includes('data-rail-state="lit"'),'SenseThree rail slot 3 is not lit at t9Third+700');
  beat('SenseThree','t9Institutional',{text:['institutional or systemic practices'],markup:['data-phrase="t9Institutional"']});
  beat('SenseThree','t9Practices',{markup:['data-network="true"','data-institution-node="1"','data-institution-node="5"']});
  beat('SenseThree','t9Unequal',{text:['that produce unequal outcomes','category A','category B','illustrative'],markup:['data-outcome-meter="true"','data-bar="a"','data-bar="b"']});
  beat('SenseThree','t9Categories',{text:['across racial categories','unit: a system'],markup:['data-rail-unit="a system"']});
  {
    const end=byKind('SenseThree').find(frame=>frame.kind==='end')!;
    assert.ok(plain(end.html).includes('institutional or systemic practices that produce unequal outcomes across racial categories.'),'SenseThree end frame does not hold the assembled definition');
    for(const unit of ['one person','a belief','a system'])assert.ok(end.html.includes(`data-rail-unit="${unit}"`),`SenseThree end rail is missing unit tag "${unit}"`);
  }

  // Turn 10 · FigureTwoThree
  const figureOpen=beat('FigureTwoThree','t10Figure',{text:['Figure 2.3 · Inverting the Definitional Hierarchy','Conventional Hierarchy','Correct Hierarchy','1. Systemic Policies','2. Ideological Narratives','3. Interpersonal Prejudice','↑ epiphenomenal, downstream','Must','invert','individual prejudice','ideological belief','systemic practices','one person','a belief','a system'],markup:['data-plate="true"','data-right-column="true"']});
  assert.ok(/data-right-column="true" opacity="0\.25"/.test(figureOpen),'FigureTwoThree right column is not at 25% opacity');
  beat('FigureTwoThree','t10Chapter',{text:['The Original Power, Chapter 2']});
  beat('FigureTwoThree','t10Displays',{});
  const orderHtml=beat('FigureTwoThree','t10Order',{text:['1. Individual Prejudice','2. Belief in Superiority','3. Systemic (if present)']},'t10Displays');
  assert.ok((orderHtml.match(/width:598px/g)??[]).length>=3,'FigureTwoThree layers have not landed at uniform width 598 by t10Order+700');
  const columnHtml=beat('FigureTwoThree','t10Column',{markup:['data-column-bracket="true"']});
  assert.ok(/data-left-header="true"[^>]*opacity="1"/.test(columnHtml),'FigureTwoThree Conventional Hierarchy header is not lit at t10Column+700');
  const pyramidHtml=beat('FigureTwoThree','t10Pyramid',{text:['↑ buried, rarely referenced'],markup:['data-pyramid-outline="true"']});
  for(const width of [598,483,368])assert.ok(pyramidHtml.includes(`width:${width}px`),`FigureTwoThree is missing tapered layer width ${width}px at t10Pyramid+700`);
  {
    const end=byKind('FigureTwoThree').find(frame=>frame.kind==='end')!;
    for(const expected of ['Figure 2.3 · Inverting the Definitional Hierarchy','The Original Power, Chapter 2','Conventional Hierarchy','Correct Hierarchy','1. Individual Prejudice','2. Belief in Superiority','3. Systemic (if present)','↑ buried, rarely referenced','1. Systemic Policies','2. Ideological Narratives','3. Interpersonal Prejudice','↑ epiphenomenal, downstream'])assert.ok(plain(end.html).includes(expected),`FigureTwoThree end frame is missing “${expected}”`);
  }

  // Static geometry: rail and card must not overlap; figure ratio 5.2 : 4.2 : 3.2 within 1%.
  assert.ok(RAIL.x+RAIL.w<=CARD.x,`rail (right edge ${RAIL.x+RAIL.w}) overlaps the card (left edge ${CARD.x})`);
  {
    const [w0,w1,w2]=FIGURE_LAYOUT.layerWidths;
    const k0=w0/5.2,k1=w1/4.2,k2=w2/3.2;
    assert.ok(Math.abs(k1/k0-1)<.01&&Math.abs(k2/k0-1)<.01,`Figure 2.3 layer widths ${w0}/${w1}/${w2} are not in the ratio 5.2 : 4.2 : 3.2 within 1%`);
    assert.ok(FIGURE_LAYOUT.leftCenter-FIGURE_LAYOUT.layerWidths[0]/2>=FIGURE_LAYOUT.plate.x,'Figure 2.3 left column leaves the plate');
    assert.ok(FIGURE_LAYOUT.rightCenter+FIGURE_LAYOUT.layerWidths[0]/2<=FIGURE_LAYOUT.plate.x+FIGURE_LAYOUT.plate.w,'Figure 2.3 right column leaves the plate');
  }
  assert.ok(ENTRY_OPEN_LAYOUT.slot3BottomY>ENTRY_OPEN_LAYOUT.slotY[2]&&ENTRY_OPEN_LAYOUT.slot3BottomY+ENTRY_OPEN_LAYOUT.slotH<=ENTRY_OPEN_LAYOUT.panelH,'EntryOpen slot 3 does not slide to the panel bottom');
  assert.ok(SENSE3_METER.barAH>=2*SENSE3_METER.barBH,'SenseThree outcome bars are not clearly unequal');

  console.log(`PASS: ${rendered.length} cue-derived frames; five minute-two scene contracts, narration strings, manuscript figure strings, hook policy, underscore policy, and interaction-hint policy verified; strings present from their beat and absent before it; rail x ${RAIL.x}–${RAIL.x+RAIL.w} clear of card x ${CARD.x}; Figure 2.3 layer widths ${FIGURE_LAYOUT.layerWidths.join(' / ')} px in the ratio 5.2 : 4.2 : 3.2.`);
}
