import React from 'react';
import {DrawRect, FitBox, Flicker, KitSound, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';
import {ColoredTerm, type EquationPulseMap, type EquationTermId} from '../equations';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));
const cueFrame=(ms:number)=>Math.round(ms*30/1000);
const frames=(ms:number)=>Math.round(ms*30/1000);

// Canvas geometry for the entry panel, the number gutter the sense numbers lift into on
// `order`, and the causal chain that draws right of the gutter on `causal`. Exported for
// the static geometry asserts in tools/check_first_minute.tsx.
export const DICTIONARY_LAYOUT = {
  panelX: 170, panelY: 325, panelW: 850, panelH: 430,
  orderShiftX: -55,
  numberInsetX: 20,
  gutterX: 985,
  chainX: 1050, chainY: 363, chainW: 770,
} as const;
export const DICTIONARY_LIFT_X = DICTIONARY_LAYOUT.gutterX - (DICTIONARY_LAYOUT.panelX + DICTIONARY_LAYOUT.orderShiftX + DICTIONARY_LAYOUT.numberInsetX);
export const DICTIONARY_EQ_25 = 'Individual Prejudice → Discriminatory Actions → Systemic Outcomes' as const;

export type DefinitionHierarchyState = {
  header:number;
  wrong:number;
  entry:number;
  individual:number;
  institutional:number;
  order:number;
  causal:number;
  evidence:number;
};

export const finalDefinitionState: DefinitionHierarchyState = {
  header:1, wrong:1, entry:1, individual:1, institutional:1, order:1, causal:1, evidence:1,
};

function Sense({number, children, bright=1, tertiary=false, lift=0}: React.PropsWithChildren<{number:number; bright?:number; tertiary?:boolean; lift?:number}>) {
  return <div style={{position:'relative', display:'grid', gridTemplateColumns:'58px 1fr', alignItems:'start', minHeight:tertiary?78:92, padding:'18px 24px 12px 20px', borderTop:`1px solid ${color('color/line/graticule')}`, opacity:(tertiary?.48:.68)+bright*(tertiary?.30:.32)}}>
    <span style={{font:'500 28px "IBM Plex Mono"', color:bright>.5?color('color/fill/gold'):color('color/text/dim'), transform:`translateX(${lift*DICTIONARY_LIFT_X}px)`, transition:'none'}}>{number}</span>
    <span style={{fontSize:30, lineHeight:1.35, color:color('color/text/primary')}}>{children}</span>
    {number===1 && <span aria-hidden="true" style={{position:'absolute', left:0, top:8, bottom:8, width:4, background:color('color/fill/gold'), transform:`scaleY(${bright})`, transformOrigin:'center top'}}/>}
  </div>;
}

export function DefinitionHierarchy({state,ms=0,pulses={},dictionaryCueMs=0}: {state:DefinitionHierarchyState;ms?:number;pulses?:EquationPulseMap;dictionaryCueMs?:number}) {
  // The panel shifts left while the numbers lift, so the lifted digits always rest in the
  // gutter clear of the shifted panel's right edge (965) and the chain (1050).
  const entryShift = state.order * DICTIONARY_LAYOUT.orderShiftX;
  const panelX = DICTIONARY_LAYOUT.panelX + entryShift;
  const dictionaryFrame = cueFrame(dictionaryCueMs);
  const panelFrames = frames(560);
  const headerFrame = dictionaryFrame + panelFrames;
  const firstSenseFrame = headerFrame + frames(420);
  const secondSenseFrame = firstSenseFrame + frames(260);
  return <>
    {state.entry>0 && <div data-definition-entry="true" style={{position:'absolute', inset:0, opacity:state.entry, transform:`translateY(${20*(1-state.entry)}px)`, pointerEvents:'none'}}>
      <DrawRect box={{x:panelX, y:DICTIONARY_LAYOUT.panelY, w:DICTIONARY_LAYOUT.panelW, h:DICTIONARY_LAYOUT.panelH}} startFrame={dictionaryFrame} durationFrames={panelFrames} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" seed={47}/>
      <div style={{position:'absolute', left:panelX, top:DICTIONARY_LAYOUT.panelY, width:DICTIONARY_LAYOUT.panelW, height:DICTIONARY_LAYOUT.panelH}}>
        <FitBox text="rac·ism" x={22} y={18} size={38} weight={600} lineHeight={1.1} padX="spacing/md" padY="spacing/sm" textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" tag="TERM" corners="tl-br" seed={17} intensity={.8} startFrame={headerFrame} durationFrames={frames(420)}/>
        <Flicker startFrame={headerFrame} durationFrames={frames(300)} intensity={.5} style={{position:'absolute', inset:0}}><em style={{position:'absolute', left:226, top:37, fontSize:25, color:color('color/text/muted')}}>(noun)</em></Flicker>
        <div style={{position:'absolute', left:0, top:105, width:'100%'}}>
          <Flicker startFrame={firstSenseFrame} durationFrames={frames(260)} intensity={.55} style={{position:'relative', inset:'auto'}}><Sense number={1} bright={state.individual} lift={state.order}><ColoredTerm term="IndividualPrejudice" ms={ms} pulses={pulses.IndividualPrejudice} display="Individual prejudice" box={{x:DICTIONARY_LAYOUT.panelX+entryShift+102,y:438,w:280,h:42}}/> or discrimination based on race</Sense></Flicker>
          <Flicker startFrame={secondSenseFrame} durationFrames={frames(260)} intensity={.45} style={{position:'relative', inset:'auto'}}><Sense number={2} bright={0} lift={state.order}>Belief in racial superiority</Sense></Flicker>
          {state.institutional>0 && <div style={{opacity:state.institutional, transform:`translateY(${12*(1-state.institutional)}px)`}}><Sense number={3} bright={0} tertiary lift={state.order}><ColoredTerm term="SystemicOutcomes" ms={ms} pulses={pulses.SystemicOutcomes} display="Systemic or institutional discrimination" box={{x:DICTIONARY_LAYOUT.panelX+entryShift+102,y:620,w:470,h:42}}/> <span style={{marginLeft:12, padding:'4px 9px', border:`1px solid ${color('color/line/hairline')}`, font:'500 20px "IBM Plex Mono"', color:color('color/text/muted'), whiteSpace:'nowrap'}}>if present at all</span></Sense></div>}
        </div>
      </div>
    </div>}
    {state.causal>0 && <div data-causal-chain="true" data-equation={DICTIONARY_EQ_25} style={{position:'absolute', left:DICTIONARY_LAYOUT.chainX, top:DICTIONARY_LAYOUT.chainY, width:DICTIONARY_LAYOUT.chainW, opacity:state.causal, transform:`translateX(${24*(1-state.causal)}px)`}}>
      <div style={{font:'500 21px "IBM Plex Mono"', letterSpacing:2.4, color:color('color/fill/gold'), marginBottom:18, textTransform:'uppercase'}}>causal story</div>
      <div style={{display:'flex', alignItems:'stretch', gap:12}}>
        {([['IndividualPrejudice','Individual Prejudice'],['DiscriminatoryActions','Discriminatory Actions'],['SystemicOutcomes','Systemic Outcomes']] as const).map(([termId,label],i)=><React.Fragment key={label}>
          <div style={{width:210, minHeight:108, padding:'18px 15px', display:'grid', placeItems:'center', textAlign:'center', fontSize:27, lineHeight:1.25, background:color('color/fill/panel-render'), border:`1px solid ${color('color/line/hairline')}`}}><ColoredTerm term={termId as EquationTermId} ms={ms} pulses={pulses[termId]} box={{x:DICTIONARY_LAYOUT.chainX+i*255,y:421,w:210,h:68}} display={label}/></div>
          {i<2 && <div style={{display:'grid', placeItems:'center', font:'500 35px "IBM Plex Mono"', color:color('color/fill/gold')}}>→</div>}
        </React.Fragment>)}
      </div>
      {state.evidence>0 && <div style={{marginTop:44, height:118, display:'grid', placeItems:'center', opacity:state.evidence, border:`2px dashed ${color('color/line/chart')}`, color:color('color/text/dim'), font:'500 23px "IBM Plex Mono"', letterSpacing:2, textTransform:'uppercase'}}>evidence</div>}
    </div>}
  </>;
}

export function DefinitionSceneContent({state,ms=0,pulses={},dictionaryCueMs=0}: {state:DefinitionHierarchyState;ms?:number;pulses?:EquationPulseMap;dictionaryCueMs?:number}) {
  return <div style={{position:'absolute', inset:0, width:1920, height:1080, color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    {state.header>0 && <div style={{position:'absolute', left:150, top:105, opacity:state.header, transform:`translateY(${18*(1-state.header)}px)`, fontSize:68, fontWeight:500}}>The common definition of racism</div>}
    {state.wrong>0 && <div style={{position:'absolute', left:1375, top:118, opacity:state.wrong, transform:`translateY(${12*(1-state.wrong)}px) rotate(-2deg)`, padding:'9px 18px', border:`2px solid ${color('color/marker/race')}`, background:color('color/fill/red-faint'), font:'500 25px "IBM Plex Mono"', letterSpacing:3, textTransform:'uppercase', color:color('color/marker/race')}}>wrong</div>}
    <DefinitionHierarchy state={state} ms={ms} pulses={pulses} dictionaryCueMs={dictionaryCueMs}/>
    {state.evidence>0 && <div style={{position:'absolute', left:150, bottom:78, opacity:state.evidence, font:'400 20px "IBM Plex Mono"', letterSpacing:.4, color:color('color/text/muted')}}>The Original Power, §Racism as Primary Example · Eq. 2.5</div>}
  </div>;
}

export function DictionaryEntry({segment}:SceneProps) {
  const ms=useStageMs();
  const common=useCue('common'), wrong=useCue('wrong'), dictionary=useCue('dictionary'), individual=useCue('individual');
  const institutional=useCue('institutional'), order=useCue('order'), causal=useCue('causal'), evidence=useCue('evidence');
  const state:DefinitionHierarchyState={
    header:enter(ms,common.at),
    wrong:enter(ms,wrong.at,380),
    entry:enter(ms,dictionary.at,560),
    individual:enter(ms,individual.at,420),
    institutional:enter(ms,institutional.at,520),
    order:enter(ms,order.at,500),
    causal:enter(ms,causal.at,560),
    evidence:enter(ms,evidence.at,430),
  };
  return <div data-scene="DictionaryEntry" style={{position:'absolute',inset:0,width:1920,height:1080,overflow:'hidden',background:color('color/bg/field')}}>
    <SceneBorder segment={segment}/>
    <KitSound mode="beats"><Flicker startFrame={cueFrame(common.at)} durationFrames={frames(460)} beat><DefinitionSceneContent state={state} ms={ms} pulses={{IndividualPrejudice:[individual.at],SystemicOutcomes:[institutional.at]}} dictionaryCueMs={dictionary.at}/></Flicker></KitSound>
  </div>;
}
