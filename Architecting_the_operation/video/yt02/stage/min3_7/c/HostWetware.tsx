import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {NeuralField, PersonMark, SourceLine, StageSceneFrame} from '../shared';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=680)=>cubicInOut(progress(ms,at,at+duration));

export const HOST_WETWARE_LAYOUT={
  ribbon:{x:125,y:90,w:1670,h:85},
  neural:{x:130,y:220,w:920,h:460},
  input:{x:170,y:290,w:530,h:500},
  output:{x:1180,y:270,w:580,h:520},
  bandwidth:{x:230,y:190,w:720,h:42},
  fastLane:{x:1070,y:820,w:690,h:42},
  deliberateLane:{x:1070,y:880,w:690,h:42},
  band:{x:160,y:250,w:1600,h:600},
  source:{x:116,y:994,w:1688,h:30},
  outputCards:[
    {id:'ally',x:1180,y:300,w:580,h:126},
    {id:'stranger',x:1180,y:455,w:580,h:126},
    {id:'unknown',x:1180,y:610,w:580,h:126},
  ],
} as const;

type InputMark={id:string;x:number;y:number;scale:number};
export const HOST_INPUT_MARKS:readonly InputMark[]=Array.from({length:24},(_,index)=>({
  id:`input-${index+1}`,
  x:70+(index%6)*76+((index*17)%23),
  y:82+Math.floor(index/6)*94+((index*29)%19),
  scale:.42+(index%4)*.08,
}));

const OUTPUTS=['ALLY','STRANGER','UNKNOWN'] as const;

function OutputCards({progressValue,labelsProgress}:{progressValue:number;labelsProgress:number}){
  const L=HOST_WETWARE_LAYOUT;
  return <div data-output-bus="true" style={{position:'absolute',left:L.output.x,top:L.output.y,width:L.output.w,height:L.output.h,opacity:progressValue}}>
    <svg width={L.output.w} height={L.output.h} viewBox={`0 0 ${L.output.w} ${L.output.h}`} style={{position:'absolute',inset:0}} aria-hidden="true">
      <path d="M0 260H70M70 54V466" fill="none" stroke={color('color/fill/gold')} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progressValue}/>
      {[93,248,403].map((y,index)=><path key={y} data-output-channel={index+1} d={`M70 ${y}H145`} stroke={color('color/fill/gold')} strokeWidth="4" opacity={labelsProgress}/>) }
    </svg>
    {labelsProgress>0&&OUTPUTS.map((label,index)=><div key={label} data-output-card={label.toLowerCase()} style={{position:'absolute',left:145,top:30+index*155,width:410,height:126,boxSizing:'border-box',display:'grid',placeItems:'center',font:'600 28px "IBM Plex Mono"',letterSpacing:1.5,color:index===0?color('color/fill/gold'):index===1?color('color/marker/race'):color('color/text/soft'),background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline-strong')}`,opacity:labelsProgress}}>{label}</div>)}
  </div>;
}

export function HostWetware({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    terminology:useCue('t25Terminology').at,brain:useCue('t25Brain').at,biological:useCue('t25Biological').at,
    wetware:useCue('t25Wetware').at,predictive:useCue('t25Predictive').at,pattern:useCue('t25Pattern').at,categorization:useCue('t25Categorization').at,
    bandwidth:useCue('t26Bandwidth').at,compresses:useCue('t26Compresses').at,variation:useCue('t26Variation').at,
    labels:useCue('t26Labels').at,deliberate:useCue('t26Deliberate').at,reasoning:useCue('t26Reasoning').at,
    pattern27:useCue('t27Pattern').at,survival:useCue('t27Survival').at,bands:useCue('t27Bands').at,
    allies:useCue('t27Allies').at,strangers:useCue('t27Strangers').at,consequences:useCue('t27Consequences').at,
  };
  const ribbonP=enter(ms,cue.terminology,560),brainP=enter(ms,cue.brain,600),bioP=enter(ms,cue.biological);
  const wetwareP=enter(ms,cue.wetware),predictiveP=enter(ms,cue.predictive),patternP=enter(ms,cue.pattern,620),categorizationP=enter(ms,cue.categorization,560);
  const bandwidthP=enter(ms,cue.bandwidth),compressP=move(ms,cue.compresses,720),variationP=enter(ms,cue.variation),labelsP=enter(ms,cue.labels);
  const deliberateP=enter(ms,cue.deliberate),reasoningP=enter(ms,cue.reasoning,700);
  const bandP=move(ms,cue.pattern27,700),survivalP=enter(ms,cue.survival),bandsP=enter(ms,cue.bands),alliesP=enter(ms,cue.allies),strangersP=enter(ms,cue.strangers),consequenceP=enter(ms,cue.consequences,580);
  const preBandOpacity=1-.82*bandP;
  const L=HOST_WETWARE_LAYOUT;
  return <StageSceneFrame segment={segment}>
    {ms>=cue.terminology&&<>
      <div data-book-ribbon="true" style={{position:'absolute',left:L.ribbon.x,top:L.ribbon.y,width:L.ribbon.w,height:L.ribbon.h,boxSizing:'border-box',display:'grid',placeItems:'center',font:'600 24px "IBM Plex Mono"',letterSpacing:2,color:color('color/fill/gold'),background:color('color/fill/gold-wash'),border:`1px solid ${color('color/fill/gold')}`,opacity:ribbonP}}>THE ORIGINAL POWER · BOOK MATERIAL</div>
      <SourceLine text="THE ORIGINAL POWER · BOOK MATERIAL"/>
    </>}

    <div data-pre-band-field="true" style={{opacity:preBandOpacity}}>
      {ms>=cue.brain&&<div data-neural-field-wrap="true" style={{position:'absolute',left:L.neural.x,top:L.neural.y,width:L.neural.w,height:L.neural.h,opacity:brainP}}>
        <NeuralField layers={[4,7,5,3]} inputs={['IN 1','IN 2','IN 3','IN 4']} weights={[.9,.5,-.35,.72,.28]} activationProgress={brainP} compressionProgress={patternP} labels={[]}/>
      </div>}
      {ms>=cue.brain&&<div data-text-box="network" style={{position:'absolute',left:150,top:700,width:400,height:38,font:'600 22px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/soft'),opacity:brainP}}>NEURAL NETWORK</div>}
      {ms>=cue.biological&&<div data-text-box="biological" style={{position:'absolute',left:580,top:700,width:470,height:38,textAlign:'right',font:'600 22px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/fill/gold'),opacity:bioP}}>BIOLOGICAL HOST WETWARE</div>}
      {ms>=cue.wetware&&<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
        {[0,1,2,3].map(index=><circle key={index} data-input-socket={index+1} cx="144" cy={292+index*88} r="12" fill={color('color/bg/field')} stroke={color('color/fill/gold')} strokeWidth="4" opacity={wetwareP}/>) }
        <path data-compressed-bus="true" d="M1015 420H1160V680" fill="none" stroke={color('color/fill/gold')} strokeWidth="5" opacity={wetwareP}/>
      </svg>}
      {ms>=cue.predictive&&<div data-text-box="predictive" style={{position:'absolute',left:150,top:755,width:270,height:38,font:'600 22px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/accent'),opacity:predictiveP}}>PREDICTIVE</div>}
      {ms>=cue.predictive&&[0,1,2,3].map(index=><PersonMark key={index} x={760+index*64} y={315+index*76} group="neutral" emphasis={predictiveP*.55} scale={.46}/>) }
      {ms>=cue.pattern&&<div data-text-box="compressing" style={{position:'absolute',left:430,top:755,width:430,height:38,font:'600 22px "IBM Plex Mono"',letterSpacing:1.5,color:color('color/text/accent'),opacity:patternP}}>PATTERN-COMPRESSING</div>}
      {ms>=cue.pattern&&<OutputCards progressValue={patternP} labelsProgress={categorizationP}/>} 
      {ms>=cue.categorization&&<div data-text-box="fast" style={{position:'absolute',left:1180,top:805,width:580,height:38,textAlign:'center',font:'600 23px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/fill/gold'),opacity:categorizationP}}>FAST CATEGORIZATION</div>}

      {ms>=cue.bandwidth&&<div data-bandwidth-meter="true" style={{position:'absolute',left:L.bandwidth.x,top:L.bandwidth.y,width:L.bandwidth.w,height:L.bandwidth.h,boxSizing:'border-box',border:`1px solid ${color('color/line/hairline-strong')}`,opacity:bandwidthP}}>
        <div style={{position:'absolute',inset:4,right:`${52+48*compressP}%`,background:color('color/fill/gold-wash'),borderRight:`4px solid ${color('color/fill/gold')}`}}/>
        <div style={{position:'absolute',left:16,top:7,font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/text/primary')}}>FINITE MENTAL BANDWIDTH</div>
      </div>}
      {ms>=cue.compresses&&<div data-input-variation="true" style={{position:'absolute',left:L.input.x,top:L.input.y,width:L.input.w,height:L.input.h,opacity:.35+.65*compressP}}>
        {HOST_INPUT_MARKS.map(mark=><PersonMark key={mark.id} x={mark.x*(1-.22*compressP)} y={mark.y} group="neutral" emphasis={.35+.45*variationP} scale={mark.scale}/>) }
      </div>}
      {ms>=cue.variation&&<div data-text-box="variation" style={{position:'absolute',left:170,top:815,width:530,height:38,textAlign:'center',font:'600 21px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/soft'),opacity:variationP}}>COMPLEX SOCIAL VARIATION</div>}
      {ms>=cue.labels&&<div data-text-box="labels" style={{position:'absolute',left:1180,top:760,width:580,height:38,textAlign:'center',font:'600 21px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/soft'),opacity:labelsP}}>SIMPLE GROUP LABELS</div>}
      {ms>=cue.labels&&<div data-text-box="compression-statement" style={{position:'absolute',left:720,top:935,width:880,height:38,textAlign:'center',fontSize:28,lineHeight:1.2,color:color('color/text/primary'),opacity:labelsP}}>Compression reduces the active representation.</div>}
      {ms>=cue.deliberate&&<div data-processing-lane="deliberate" style={{position:'absolute',left:L.deliberateLane.x,top:L.deliberateLane.y,width:L.deliberateLane.w,height:L.deliberateLane.h,boxSizing:'border-box',font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/text/soft'),borderBottom:`3px solid ${color('color/line/hairline')}`,opacity:deliberateP}}>DELIBERATE REASONING<div style={{position:'absolute',left:250,top:30,width:400*reasoningP,height:5,background:color('color/text/soft')}}/></div>}
    </div>

    {ms>=cue.pattern27&&<div data-band-diagram="true" style={{position:'absolute',left:L.band.x,top:L.band.y,width:L.band.w,height:L.band.h,opacity:bandP}}>
      <svg width={L.band.w} height={L.band.h} viewBox={`0 0 ${L.band.w} ${L.band.h}`} style={{position:'absolute',inset:0}} aria-hidden="true">
        {ms>=cue.survival&&<circle data-survival-ring="true" cx="800" cy="300" r={235*survivalP} fill={color('color/fill/gold-wash')} stroke={color('color/fill/gold')} strokeWidth="5" opacity={survivalP}/>} 
        {ms>=cue.consequences&&<g data-consequence-pulse="true" opacity={consequenceP}><path d="M1450 300H1050" stroke={color('color/marker/race')} strokeWidth="7"/><path d="M1050 300l24-16v32z" fill={color('color/marker/race')}/><path d="M1030 190V410" stroke={color('color/fill/gold')} strokeWidth="6"/></g>}
      </svg>
      {ms>=cue.bands&&<>
        {[[700,245],[900,245],[700,365],[900,365]].map(([x,y],index)=><PersonMark key={index} x={x} y={y} group={ms>=cue.allies&&index<2?'ingroup':'neutral'} emphasis={bandsP} scale={1.15}/>) }
        <div data-text-box="ancestral" style={{position:'absolute',left:600,top:40,width:400,height:44,textAlign:'center',font:'600 24px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/text/primary'),opacity:bandsP}}>ANCESTRAL BAND</div>
      </>}
      {ms>=cue.allies&&<div data-band-allies="true" style={{position:'absolute',left:555,top:490,width:300,height:40,textAlign:'center',font:'600 22px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:alliesP}}>ALLY</div>}
      {ms>=cue.strangers&&<>
        <PersonMark x={1230} y={215} group="outgroup" emphasis={strangersP} scale={1.1}/><PersonMark x={1325} y={390} group="outgroup" emphasis={strangersP} scale={1.1}/>
        <div data-band-strangers="true" style={{position:'absolute',left:1130,top:490,width:330,height:40,textAlign:'center',font:'600 22px "IBM Plex Mono"',color:color('color/marker/race'),opacity:strangersP}}>STRANGER</div>
      </>}
      {ms>=cue.survival&&<div data-text-box="survival" style={{position:'absolute',left:500,top:540,width:600,height:42,textAlign:'center',font:'600 21px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/fill/gold'),opacity:survivalP}}>SURVIVAL-RELEVANT CATEGORIZATION</div>}
      {ms>=cue.consequences&&<div data-text-box="consequence" style={{position:'absolute',left:1110,top:110,width:440,height:50,textAlign:'center',font:'600 21px "IBM Plex Mono"',lineHeight:1.1,letterSpacing:1,color:color('color/marker/race'),opacity:consequenceP}}>IMMEDIATE PHYSICAL CONSEQUENCE</div>}
    </div>}
  </StageSceneFrame>;
}
