import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {NEURAL_FIELD, NeuralField, PersonMark, StageSceneFrame} from '../shared';
import {Label, SceneSource, leave, lineAttrs, pathFrom, shapeAttrs, type LayoutBox, type Point} from '../d/sceneUtils';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=680)=>cubicInOut(progress(ms,at,at+duration));

const NEURAL_SCALE=.7;
export const HOST_WETWARE_LAYOUT={
  ribbon:{x:125,y:96,w:1670,h:72},
  bandwidth:{x:506,y:190,w:644,h:40},
  neural:{x:506,y:250,w:NEURAL_FIELD.width*NEURAL_SCALE,h:NEURAL_FIELD.height*NEURAL_SCALE},
  input:{x:70,y:250,w:270,h:420},
  output:{x:1180,y:270,w:580,h:520},
  deliberateLane:{x:1180,y:800,w:580,h:56},
  band:{x:160,y:250,w:1600,h:600},
  source:{x:116,y:968,w:740,h:30},
  outputCards:[
    {id:'ally',x:1325,y:300,w:410,h:126},
    {id:'stranger',x:1325,y:455,w:410,h:126},
    {id:'unknown',x:1325,y:610,w:410,h:126},
  ],
} as const;

export const HOST_WETWARE_TEXT={
  network:{x:506,y:592,w:260,h:30}, biological:{x:790,y:592,w:360,h:30},
  predictive:{x:506,y:636,w:200,h:30}, compressing:{x:740,y:636,w:410,h:30},
  variation:{x:66,y:686,w:340,h:30}, fast:{x:1250,y:248,w:510,h:32}, labels:{x:1250,y:752,w:510,h:30},
  deliberate:{x:1180,y:800,w:300,h:28}, statement:{x:300,y:900,w:820,h:40},
  ancestral:{x:560,y:262,w:400,h:40}, ally:{x:300,y:462,w:120,h:36}, stranger:{x:1065,y:700,w:130,h:32},
  survival:{x:440,y:784,w:640,h:32}, consequence:{x:1040,y:486,w:460,h:32},
} as const;

type InputMark={id:string;x:number;y:number;scale:number};
/** 24 varied input marks on a jittered 4 × 6 grid inside the input region (frame coordinates). */
export const HOST_INPUT_MARKS:readonly InputMark[]=Array.from({length:24},(_,index)=>({
  id:`input-${index+1}`,
  x:100+(index%4)*70+(((index*17)%7)-3)*2.4,
  y:280+Math.floor(index/4)*72+(((index*29)%5)-2)*3,
  scale:.42+(index%4)*.08,
}));
const INPUT_CENTER_Y=460;

const LAYERS=[4,7,5,3] as const;
function neuralNode(layer:number,index:number,compression:number):Point{
  const count=LAYERS[layer], span=LAYERS.length-1;
  const x=NEURAL_FIELD.padX+layer*(NEURAL_FIELD.width-2*NEURAL_FIELD.padX)/span-40*compression*(layer/span);
  const y0=NEURAL_FIELD.padY+index*(NEURAL_FIELD.height-2*NEURAL_FIELD.padY)/(count-1);
  const y=y0+(NEURAL_FIELD.height/2-y0)*.22*compression;
  return [HOST_WETWARE_LAYOUT.neural.x+x*NEURAL_SCALE,HOST_WETWARE_LAYOUT.neural.y+y*NEURAL_SCALE];
}
const SOCKETS=[0,1,2,3].map(index=>neuralNode(0,index,0));
const SOCKET_X=484, GHOST_X=380;
const personBox=(x:number,y:number,scale:number):LayoutBox=>{const w=44*Math.max(.2,scale);return {x:x-w/2,y:y-w*1.3/2,w,h:w*1.3};};

const OUTPUTS=['ALLY','STRANGER','UNKNOWN'] as const;
const BAND={cx:760,cy:540,r:220} as const;
const BAND_MARKS:readonly Point[]=[[690,480],[830,480],[690,600],[830,600]];
const STRANGER_MARKS:readonly Point[]=[[1130,430],[1130,650]];

function OutputCards({progressValue,labelsProgress}:{progressValue:number;labelsProgress:number}){
  const L=HOST_WETWARE_LAYOUT, spine:Point[]=[[1180,530],[1250,530]], vertical:Point[]=[[1250,324],[1250,736]];
  return <div data-output-bus="true" style={{opacity:progressValue}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      <path {...lineAttrs('bus-spine',spine)} d={pathFrom(spine)} fill="none" stroke={color('color/fill/gold')} strokeWidth="5"/>
      <path {...lineAttrs('bus-vertical',vertical)} d={pathFrom(vertical)} fill="none" stroke={color('color/fill/gold')} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progressValue}/>
      {L.outputCards.map((card,index)=>{const y=card.y+card.h/2;return <path key={card.id} data-output-channel={index+1} {...lineAttrs(`channel-${card.id}`,[[1250,y],[card.x,y]])} d={`M1250 ${y}H${card.x}`} stroke={color('color/fill/gold')} strokeWidth="4" opacity={labelsProgress}/>;})}
    </svg>
    {labelsProgress>0&&L.outputCards.map((card,index)=><div key={card.id} style={{opacity:labelsProgress}}>
      <div data-output-card={card.id} {...shapeAttrs(`card-${card.id}`,card,'frame')} style={{position:'absolute',left:card.x,top:card.y,width:card.w,height:card.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline-strong')}`}}/>
      <Label id={`card-${card.id}-text`} box={{x:card.x+20,y:card.y+45,w:card.w-40,h:36}} size={28} ls={1.5} lh={1.2} align="center" ink={index===0?color('color/fill/gold'):index===1?color('color/marker/race'):color('color/text/soft')}>{OUTPUTS[index]}</Label>
    </div>)}
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
  // Turn 27 replaces the picture: the old state fades out completely before the band diagram fades in.
  const preBandOpacity=leave(ms,cue.pattern27,320), preBandShown=ms<cue.pattern27+320;
  const bandP=enter(ms,cue.pattern27+300,500),survivalP=enter(ms,cue.survival),bandsP=enter(ms,cue.bands),alliesP=enter(ms,cue.allies),strangersP=enter(ms,cue.strangers),consequenceP=enter(ms,cue.consequences,580);
  const L=HOST_WETWARE_LAYOUT, T=HOST_WETWARE_TEXT, gold=color('color/fill/gold'), red=color('color/marker/race'), soft=color('color/text/soft');
  const nodes=LAYERS.flatMap((count,layer)=>Array.from({length:count},(_,index)=>neuralNode(layer,index,patternP)));
  const nodeHull={x:Math.min(...nodes.map(p=>p[0]))-11,y:Math.min(...nodes.map(p=>p[1]))-11,w:Math.max(...nodes.map(p=>p[0]))-Math.min(...nodes.map(p=>p[0]))+22,h:Math.max(...nodes.map(p=>p[1]))-Math.min(...nodes.map(p=>p[1]))+22};
  const compressedBus:Point[]=[[L.neural.x+L.neural.w,411],[1165,411],[1165,530],[1180,530]];
  const allyLeader:Point[]=[[T.ally.x+T.ally.w,480],[BAND.cx-Math.sqrt(BAND.r*BAND.r-60*60),480]];
  return <StageSceneFrame segment={segment}>
    {ms>=cue.terminology&&<>
      <div data-book-ribbon="true" {...shapeAttrs('ribbon',L.ribbon,'frame')} style={{position:'absolute',left:L.ribbon.x,top:L.ribbon.y,width:L.ribbon.w,height:L.ribbon.h,boxSizing:'border-box',background:color('color/fill/gold-wash'),border:`1px solid ${gold}`,opacity:ribbonP}}/>
      <Label id="ribbon-text" box={{x:L.ribbon.x+20,y:L.ribbon.y+18,w:L.ribbon.w-40,h:36}} size={24} ls={2} align="center" ink={gold} opacity={ribbonP}>THE ORIGINAL POWER · CHAPTER 2 · §2.3.4 · HOST WETWARE</Label>
      <SceneSource text="The Original Power, Chapter 2, §2.3.4 · Host wetware" opacity={ribbonP}/>
    </>}

    {preBandShown&&<div data-pre-band-field="true" style={{opacity:preBandOpacity}}>
      {ms>=cue.brain&&<div data-neural-field-wrap="true" {...shapeAttrs('neural-field',L.neural,'frame')} style={{position:'absolute',left:L.neural.x,top:L.neural.y,width:NEURAL_FIELD.width,height:NEURAL_FIELD.height,transform:`scale(${NEURAL_SCALE})`,transformOrigin:'left top',opacity:brainP}}>
        <NeuralField layers={LAYERS} inputs={[]} weights={[.9,.5,-.35,.72,.28]} activationProgress={brainP} compressionProgress={patternP} labels={[]}/>
        <i {...shapeAttrs('neural-nodes',nodeHull,'mark','network')} style={{position:'absolute',left:0,top:0}}/>
      </div>}
      {ms>=cue.brain&&<Label id="network" box={T.network} size={22} ls={1.5} ink={soft} opacity={brainP}>NEURAL NETWORK</Label>}
      {ms>=cue.biological&&<Label id="biological" box={T.biological} size={22} ls={1.2} align="right" ink={gold} opacity={bioP}>BIOLOGICAL HOST WETWARE</Label>}
      {ms>=cue.wetware&&<>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={wetwareP}>
          {SOCKETS.map(([,y],index)=><circle key={index} data-input-socket={index+1} {...shapeAttrs(`socket-${index+1}`,{x:SOCKET_X-12,y:y-12,w:24,h:24},'mark','socket')} cx={SOCKET_X} cy={y} r="10" fill={color('color/bg/field')} stroke={gold} strokeWidth="4"/>)}
          <path data-compressed-bus="true" {...lineAttrs('compressed-bus',compressedBus)} d={pathFrom(compressedBus)} fill="none" stroke={gold} strokeWidth="5"/>
        </svg>
        {SOCKETS.map(([,y],index)=><Label key={index} id={`in-${index+1}`} box={{x:418,y:y-14,w:50,h:28}} size={20} weight={400} ls={0} ink={color('color/text/muted')} opacity={wetwareP}>{`IN ${index+1}`}</Label>)}
      </>}
      {ms>=cue.predictive&&<Label id="predictive" box={T.predictive} size={22} ls={1.5} ink={color('color/text/accent')} opacity={predictiveP}>PREDICTIVE</Label>}
      {ms>=cue.predictive&&SOCKETS.map(([,y],index)=><div key={index} data-ghost-mark={index+1} {...shapeAttrs(`ghost-${index+1}`,personBox(GHOST_X,y,.46),'mark','ghost')}><PersonMark x={GHOST_X} y={y} group="neutral" emphasis={predictiveP*.55} scale={.46}/></div>)}
      {ms>=cue.pattern&&<Label id="compressing" box={T.compressing} size={22} ls={1.5} ink={color('color/text/accent')} opacity={patternP}>PATTERN-COMPRESSING</Label>}
      {ms>=cue.pattern&&<OutputCards progressValue={patternP} labelsProgress={categorizationP}/>}
      {ms>=cue.categorization&&<Label id="fast" box={T.fast} size={23} ls={1.4} align="center" ink={gold} opacity={categorizationP}>FAST CATEGORIZATION</Label>}

      {ms>=cue.bandwidth&&<div data-bandwidth-meter="true" {...shapeAttrs('bandwidth-meter',L.bandwidth,'frame')} style={{position:'absolute',left:L.bandwidth.x,top:L.bandwidth.y,width:L.bandwidth.w,height:L.bandwidth.h,boxSizing:'border-box',border:`1px solid ${color('color/line/hairline-strong')}`,opacity:bandwidthP}}>
        <div style={{position:'absolute',inset:4,right:`${52+40*compressP}%`,background:color('color/fill/gold-wash'),borderRight:`4px solid ${gold}`}}/>
      </div>}
      {ms>=cue.bandwidth&&<Label id="bandwidth" box={{x:L.bandwidth.x+16,y:L.bandwidth.y+7,w:400,h:26}} size={20} weight={500} ls={1.1} lh={1.25} opacity={bandwidthP}>FINITE MENTAL BANDWIDTH</Label>}
      {ms>=cue.compresses&&<div data-input-variation="true" style={{opacity:.35+.65*compressP}}>
        {HOST_INPUT_MARKS.map(mark=>{
          const y=INPUT_CENTER_Y+(mark.y-INPUT_CENTER_Y)*(1-.35*compressP);
          return <div key={mark.id} {...shapeAttrs(mark.id,personBox(mark.x,y,mark.scale),'mark','input')}><PersonMark x={mark.x} y={y} group="neutral" emphasis={.35+.45*variationP} scale={mark.scale}/></div>;
        })}
      </div>}
      {ms>=cue.variation&&<Label id="variation" box={T.variation} size={20} ls={1} align="center" ink={soft} opacity={variationP}>COMPLEX SOCIAL VARIATION</Label>}
      {ms>=cue.labels&&<Label id="labels" box={T.labels} size={21} ls={1.2} align="center" ink={soft} opacity={labelsP}>SIMPLE GROUP LABELS</Label>}
      {ms>=cue.labels&&<Label id="compression-statement" box={T.statement} size={28} weight={400} ls={0} lh={1.2} sans align="center" opacity={labelsP}>Compression reduces the active representation.</Label>}
      {ms>=cue.deliberate&&<div data-processing-lane="deliberate" style={{opacity:deliberateP}}>
        <Label id="deliberate" box={T.deliberate} size={20} weight={500} ls={1.1} ink={soft}>DELIBERATE REASONING</Label>
        <div {...lineAttrs('deliberate-track',[[L.deliberateLane.x,846],[L.deliberateLane.x+L.deliberateLane.w,846]])} style={{position:'absolute',left:L.deliberateLane.x,top:845,width:L.deliberateLane.w,height:2,background:color('color/line/hairline')}}/>
        <div {...shapeAttrs('deliberate-fill',{x:1360,y:842,w:400*reasoningP,h:8},'mark','lane')} style={{position:'absolute',left:1360,top:842,width:400*reasoningP,height:8,background:soft}}/>
      </div>}
    </div>}

    {ms>=cue.pattern27&&<div data-band-diagram="true" style={{opacity:bandP}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
        {ms>=cue.survival&&<circle data-survival-ring="true" {...shapeAttrs('survival-ring',{x:BAND.cx-BAND.r,y:BAND.cy-BAND.r,w:2*BAND.r,h:2*BAND.r},'frame')} cx={BAND.cx} cy={BAND.cy} r={BAND.r*(.6+.4*survivalP)} fill={color('color/fill/gold-wash')} stroke={gold} strokeWidth="5" opacity={survivalP}/>}
        {ms>=cue.allies&&<path {...lineAttrs('ally-leader',allyLeader)} d={pathFrom(allyLeader)} stroke={gold} strokeWidth="2" opacity={alliesP}/>}
        {ms>=cue.consequences&&<g data-consequence-pulse="true" opacity={consequenceP}>
          <path {...lineAttrs('threat-pulse',[[1500,540],[1000,540]])} d="M1500 540H1000" stroke={red} strokeWidth="7"/>
          <path d="M996 540l24-16v32z" fill={red}/>
          <path {...lineAttrs('fast-path',[[990,450],[990,630]])} d="M990 450V630" stroke={gold} strokeWidth="6"/>
        </g>}
      </svg>
      {ms>=cue.bands&&<>
        {BAND_MARKS.map(([x,y],index)=><div key={index} {...shapeAttrs(`band-mark-${index+1}`,personBox(x,y,1.15),'mark','band')}><PersonMark x={x} y={y} group={ms>=cue.allies&&index<2?'ingroup':'neutral'} emphasis={bandsP} scale={1.15}/></div>)}
        <Label id="ancestral" box={T.ancestral} size={24} ls={1.4} align="center" opacity={bandsP}>ANCESTRAL BAND</Label>
      </>}
      {ms>=cue.allies&&<Label id="ally" box={T.ally} size={22} ls={0} ink={gold} opacity={alliesP}><span data-band-allies="true">ALLY</span></Label>}
      {ms>=cue.strangers&&<>
        {STRANGER_MARKS.map(([x,y],index)=><div key={index} {...shapeAttrs(`stranger-mark-${index+1}`,personBox(x,y,1.1),'mark','band')}><PersonMark x={x} y={y} group="outgroup" emphasis={strangersP} scale={1.1}/></div>)}
        <Label id="stranger" box={T.stranger} size={22} ls={0} align="center" ink={red} opacity={strangersP}><span data-band-strangers="true">STRANGER</span></Label>
      </>}
      {ms>=cue.survival&&<Label id="survival" box={T.survival} size={21} ls={1.2} align="center" ink={gold} opacity={survivalP}>SURVIVAL-RELEVANT CATEGORIZATION</Label>}
      {ms>=cue.consequences&&<Label id="consequence" box={T.consequence} size={21} ls={1} align="center" ink={red} opacity={consequenceP}>IMMEDIATE PHYSICAL CONSEQUENCE</Label>}
    </div>}
  </StageSceneFrame>;
}
