import React from 'react';
import {progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {ColoredTerm, EquationTerms, TermChip, type EquationPulseMap, type EquationToken} from '../../equations';
import {PrecisionGauge, StageSceneFrame, UsThemSortingField} from '../shared';
import type {SortingMark} from '../shared';
import {Label, MiniNetwork, Panel, SceneSource, clamp, enter, gaussianPoints, leave, lineAttrs, mix, pathFrom, shapeAttrs, type LayoutBox, type Point} from './sceneUtils';

export const INSTALLED_PRIOR_LAYOUT = {
  equation:{x:120,y:105,w:1680,h:155}, plot:{x:120,y:310,w:1200,h:570}, gauge:{x:1390,y:320,w:370,h:380},
  socket:{x:1040,y:372,w:260,h:108}, reinforcement:{x:1390,y:800,w:370,h:64},
  rail:{x:150,y:175,w:1620,h:195}, ribbon:{x:520,y:512,w:640,h:56}, cartridge34:{x:1180,y:496,w:220,h:88},
  cards:{x:300,y:700,w:1320,h:150},
} as const satisfies Record<string,LayoutBox>;

export const INSTALLED_PRIOR_TEXT = {
  posteriorKey:{x:150,y:326,w:330,h:34}, evidenceKey:{x:490,y:326,w:280,h:34}, priorKey:{x:790,y:326,w:360,h:34},
  cartridge:{x:1052,y:380,w:236,h:52}, pi:{x:1052,y:436,w:236,h:38}, reinforcement:{x:1404,y:816,w:342,h:32},
  stereotypes:{x:150,y:826,w:600,h:32}, alphaLow:{x:1390,y:712,w:300,h:28}, alphaHigh:{x:1460,y:746,w:300,h:28},
  strip:{x:150,y:96,w:1620,h:40}, bias:{x:860,y:136,w:200,h:34}, prediction:{x:430,y:400,w:1060,h:40},
  pi34:{x:1192,y:520,w:196,h:40}, starting:{x:300,y:632,w:1320,h:36},
} as const satisfies Record<string,LayoutBox>;

export const EQ_28A = 'P_i(T | X, Π_race) ∝ P(X | T) · P_i(T | Π_race)' as const;
const equationTokens=(at:number):readonly EquationToken[]=>[
  {text:'P',width:32,revealAt:at},{term:'i',math:'_i',width:24,revealAt:at+35},{text:'(',width:18,revealAt:at+70},
  {term:'T',width:34,revealAt:at+105},{text:' | ',width:42,revealAt:at+140},{term:'X',width:34,revealAt:at+175},
  {text:', ',width:30,revealAt:at+210},{term:'PiRace',math:'Π_{race}',width:76,revealAt:at+245},{text:')',width:18,revealAt:at+280},
  {text:' ∝ ',width:74,revealAt:at+315},{text:'P(',width:48,revealAt:at+350},{term:'X',width:34,revealAt:at+385},
  {text:' | ',width:42,revealAt:at+420},{term:'T',width:34,revealAt:at+455},{text:') · P',width:88,revealAt:at+490},
  {term:'i',math:'_i',width:24,revealAt:at+525},{text:'(',width:18,revealAt:at+560},{term:'T',width:34,revealAt:at+595},
  {text:' | ',width:42,revealAt:at+630},{term:'PiRace',math:'Π_{race}',width:76,revealAt:at+665},{text:')',width:18,revealAt:at+700},
];
const posteriorTokens:readonly EquationToken[]=[{text:'POSTERIOR · P',width:154},{term:'i',math:'_i',width:18},{text:'(',width:12},{term:'T',width:22},{text:' | ',width:26},{term:'X',width:22},{text:',',width:10},{term:'PiRace',math:'Π_{race}',width:54},{text:')',width:12}];
const evidenceTokens:readonly EquationToken[]=[{text:'EVIDENCE · P(',width:146},{term:'X',width:22},{text:' | ',width:26},{term:'T',width:22},{text:')',width:12}];
const priorTokens:readonly EquationToken[]=[{text:'PRIOR · P',width:106},{term:'i',math:'_i',width:18},{text:'(',width:12},{term:'T',width:22},{text:' | ',width:26},{term:'PiRace',math:'Π_{race}',width:54},{text:')',width:12}];

/**
 * Power-prior sweep (derived display model). The prior keeps its Gaussian shape N(μp, 1/τ0);
 * α ∈ [0, 1] scales its precision inside the posterior: τpost = τe + α·τ0,
 * μpost = (τe·μe + α·τ0·μp) / τpost. α = 0 gives the evidence; α = 1 lands near the prior.
 */
export const BAYES = {evidenceMean:.28, priorMean:.72, evidencePrecision:18, genericPriorPrecision:34, installedPriorPrecision:160} as const;
export function installedPosterior(alpha:number) {
  const a=clamp(alpha), priorWeight=a*BAYES.installedPriorPrecision, precision=BAYES.evidencePrecision+priorWeight;
  return {mean:(BAYES.evidencePrecision*BAYES.evidenceMean+priorWeight*BAYES.priorMean)/precision, precision};
}
/** α holds at 0 from t33Override, rises with the institutional pulses from t33Institutions, and reaches 1 at t33Weight. */
export function installedPrecision(ms:number, institutionsAt:number, weightAt:number) {
  return clamp(progress(ms,institutionsAt,weightAt));
}

const AXIS = {left:200,right:1240,y:790} as const;
const PEAK = 300, PEAK_PRECISION = BAYES.evidencePrecision+BAYES.installedPriorPrecision;
const heightFor=(precision:number)=>PEAK*Math.sqrt(precision/PEAK_PRECISION);
const xFor=(u:number)=>AXIS.left+u*(AXIS.right-AXIS.left);

const SORTING_MARKS:readonly SortingMark[]=[
  {id:1,x:.16,y:.30,group:'ingroup'},{id:2,x:.30,y:.62,group:'ingroup'},{id:3,x:.40,y:.34,group:'ingroup'},
  {id:4,x:.62,y:.32,group:'outgroup'},{id:5,x:.74,y:.64,group:'outgroup'},{id:6,x:.86,y:.40,group:'outgroup'},
] as const;
const SOCIOLOGY_GLYPH = {x:304,y:234,scale:.28} as const;
const RAIL_COLUMNS = [170,720,1270] as const;

function Curve({id, points, ink, width, opacity=1, dataCurve}:{id:string;points:Point[];ink:string;width:number;opacity?:number;dataCurve?:string}) {
  return <path data-curve={dataCurve} {...lineAttrs(id,points)} d={pathFrom(points)} fill="none" stroke={ink} strokeWidth={width} opacity={opacity}/>;
}

export function InstalledRacialPrior({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={book:useCue('t33Book'),installed:useCue('t33Installed'),prior:useCue('t33Prior'),pi:useCue('t33Pi'),stereotypes:useCue('t33Stereotypes'),bayesian:useCue('t33Bayesian'),priors:useCue('t33Priors'),override:useCue('t33Override'),sensory:useCue('t33Sensory'),evidence:useCue('t33Evidence'),institutions:useCue('t33Institutions'),weight:useCue('t33Weight'),bias:useCue('t34Bias'),sociology:useCue('t34Sociology'),neuroscience:useCue('t34Neuroscience'),learning:useCue('t34Learning'),prediction:useCue('t34Prediction'),experience:useCue('t34Experience'),accurate:useCue('t34Accurate'),outdated:useCue('t34Outdated'),history:useCue('t34History')};
  const L=INSTALLED_PRIOR_LAYOUT, T=INSTALLED_PRIOR_TEXT;
  const gold=color('color/fill/gold'), red=color('color/marker/race'), accent=color('color/text/accent'), soft=color('color/text/soft');
  const alpha=installedPrecision(ms,cue.institutions.at,cue.weight.at), posterior=installedPosterior(alpha);
  const turn33=ms<cue.bias.at+320, turn33Opacity=leave(ms,cue.bias.at,300), turn34=ms>=cue.bias.at, turn34Opacity=enter(ms,cue.bias.at+260,440);
  const bookP=enter(ms,cue.book.at), compressP=enter(ms,cue.stereotypes.at,700);
  const priorPrecision=mix(BAYES.genericPriorPrecision,BAYES.installedPriorPrecision,compressP);
  const highlight:'posterior'|'evidence'|'prior'|'gauge'|'none'=ms>=cue.weight.at?'posterior':ms>=cue.institutions.at?'gauge':ms>=cue.sensory.at?'evidence':ms>=cue.priors.at?'prior':'none';
  const termPulses:EquationPulseMap={PiRace:[cue.pi.at,cue.priors.at,cue.institutions.at],T:[cue.priors.at],i:[cue.priors.at],X:[cue.sensory.at]};

  const evidencePoints=gaussianPoints(AXIS.left,AXIS.right,AXIS.y,heightFor(BAYES.evidencePrecision),BAYES.evidenceMean,BAYES.evidencePrecision,90);
  const priorPoints=gaussianPoints(AXIS.left,AXIS.right,AXIS.y,heightFor(priorPrecision),BAYES.priorMean,priorPrecision,90);
  const posteriorPoints=gaussianPoints(AXIS.left,AXIS.right,AXIS.y,heightFor(posterior.precision),posterior.mean,posterior.precision,90);
  const posteriorX=xFor(posterior.mean), posteriorTop=AXIS.y-heightFor(posterior.precision)-18;
  const bus:Point[]=[[L.reinforcement.x,832],[1350,832],[1350,426],[L.socket.x+L.socket.w,426]];
  const pulsePath:Point[]=[[L.reinforcement.x+L.reinforcement.w,832],[1800,832],[1800,510],[L.gauge.x+L.gauge.w,510]];
  const pulseOn=ms>=cue.institutions.at&&ms<cue.weight.at+600;
  const pulses=pulseOn?[0,1,2].map(index=>{
    const phase=(((ms-cue.institutions.at)/900)+index/3)%1, total=40+322+40, d=phase*total;
    const [x,y]=d<40?[1760+d,832]:d<362?[1800,832-(d-40)]:[1800-(d-362),510];
    return {x,y};
  }):[];
  const cartridgeP=enter(ms,cue.installed.at,600), cartridgeX=L.socket.x+40*(1-cartridgeP);
  const tokens=ms>=cue.stereotypes.at?[0,1,2,3].map(index=>{
    const t=enter(ms,cue.stereotypes.at+index*120,600);
    return {x:mix(1030,xFor(BAYES.priorMean)+(index-1.5)*14,t), y:mix(400+index*18,AXIS.y-heightFor(priorPrecision)+10,t), opacity:1-t};
  }):[];

  return <StageSceneFrame segment={segment}>
    {turn33 && <div data-turn="33" style={{opacity:turn33Opacity}}>
      <Panel box={L.equation} id="equation-band" dataPanel="equation-band" style={{opacity:bookP}}/>
      {ms>=cue.evidence.at&&<EquationTerms tokens={equationTokens(cue.evidence.at)} pulses={termPulses} ms={ms} box={{x:150,y:116,w:1620,h:52}} fontSize={34} align="center" equation={EQ_28A} style={{opacity:bookP}}/>}
      {ms>=cue.pi.at&&<TermChip term="PiRace" ms={ms} pulses={termPulses.PiRace} box={{x:150,y:190,w:410,h:54}} opacity={enter(ms,cue.pi.at)}/>}
      {ms>=cue.priors.at&&<TermChip term="T" ms={ms} pulses={termPulses.T} box={{x:580,y:190,w:410,h:54}} opacity={enter(ms,cue.priors.at)}/>}
      {ms>=cue.priors.at&&<TermChip term="i" ms={ms} pulses={termPulses.i} box={{x:1010,y:190,w:300,h:54}} opacity={enter(ms,cue.priors.at)}/>}
      {ms>=cue.sensory.at&&<TermChip term="X" ms={ms} pulses={termPulses.X} box={{x:1330,y:190,w:440,h:54}} opacity={enter(ms,cue.sensory.at)}/>}

      <div data-prior-plot="true" data-precision={alpha.toFixed(3)} data-posterior-mode={posterior.mean.toFixed(6)} data-posterior-precision={posterior.precision.toFixed(6)} style={{opacity:bookP}}>
        <Panel box={L.plot} id="plot" dataPanel="prior-plot"/>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
          <path {...lineAttrs('axis',[[AXIS.left,AXIS.y],[AXIS.right,AXIS.y]])} d={`M${AXIS.left} ${AXIS.y}H${AXIS.right}`} stroke={color('color/line/hairline')} strokeWidth="2"/>
          <Curve id="evidence-curve" dataCurve="evidence" points={evidencePoints} ink={gold} width={highlight==='evidence'?6:3}/>
          <path {...lineAttrs('evidence-tick',[[xFor(BAYES.evidenceMean),AXIS.y],[xFor(BAYES.evidenceMean),AXIS.y+14]])} d={`M${xFor(BAYES.evidenceMean)} ${AXIS.y}V${AXIS.y+14}`} stroke={gold} strokeWidth="4"/>
          <Curve id="prior-curve" dataCurve="prior" points={priorPoints} ink={red} width={highlight==='prior'?6:3}/>
          {ms>=cue.bayesian.at && <Curve id="posterior-curve" dataCurve="posterior" points={posteriorPoints} ink={accent} width={highlight==='posterior'?6:4} opacity={enter(ms,cue.bayesian.at)}/>}
          {ms>=cue.override.at && <path data-posterior-marker="true" {...lineAttrs('posterior-marker',[[posteriorX,AXIS.y+14],[posteriorX,posteriorTop]])} d={`M${posteriorX} ${AXIS.y+14}V${posteriorTop}`} stroke={accent} strokeWidth="2" strokeDasharray="5 5" opacity={enter(ms,cue.override.at)}/>}
        </svg>
      </div>

      <div data-prior-socket="true" {...shapeAttrs('socket',L.socket,'frame')} style={{position:'absolute',left:L.socket.x,top:L.socket.y,width:L.socket.w,height:L.socket.h,boxSizing:'border-box',border:`2px dashed ${color('color/line/hairline-strong')}`,opacity:bookP*(1-cartridgeP)}}/>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={bookP}>
        <path {...lineAttrs('socket-leader',[[L.socket.x+20,L.socket.y+L.socket.h],[xFor(BAYES.priorMean)+12,AXIS.y-heightFor(priorPrecision)-8]])} d={pathFrom([[L.socket.x+20,L.socket.y+L.socket.h],[xFor(BAYES.priorMean)+12,AXIS.y-heightFor(priorPrecision)-8]])} stroke={red} strokeWidth="2" strokeDasharray="4 6"/>
      </svg>
      {ms>=cue.installed.at && <>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={cartridgeP}><path {...lineAttrs('legal-bus',bus)} d={pathFrom(bus)} fill="none" stroke={red} strokeWidth="5"/></svg>
        <div data-cartridge="true" {...shapeAttrs('cartridge',{...L.socket,x:cartridgeX},'frame')} style={{position:'absolute',left:cartridgeX,top:L.socket.y,width:L.socket.w,height:L.socket.h,boxSizing:'border-box',background:color('color/fill/red-wash'),border:`2px solid ${red}`,opacity:cartridgeP}}/>
        <div {...shapeAttrs('reinforcement-box',L.reinforcement,'frame')} style={{position:'absolute',left:L.reinforcement.x,top:L.reinforcement.y,width:L.reinforcement.w,height:L.reinforcement.h,boxSizing:'border-box',border:`2px solid ${red}`,opacity:cartridgeP}}/>
        <Label id="reinforcement" box={T.reinforcement} size={20} ls={0} align="center" ink={red} opacity={cartridgeP}><span data-beat="t33Installed">INSTITUTIONAL REINFORCEMENT</span></Label>
      </>}
      {ms>=cue.prior.at && <Label id="cartridge-label" box={T.cartridge} size={20} weight={700} ls={0} align="center" ink={red} opacity={enter(ms,cue.prior.at)}><span data-beat="t33Prior">INSTALLED RACIAL PRIOR</span></Label>}
      {ms>=cue.pi.at && <ColoredTerm term="PiRace" ms={ms} pulses={termPulses.PiRace} box={T.pi} style={{position:'absolute',left:T.pi.x,top:T.pi.y,width:T.pi.w,height:T.pi.h,display:'grid',placeItems:'center',font:'700 30px "IBM Plex Mono"',opacity:enter(ms,cue.pi.at)}}/>}
      {ms>=cue.stereotypes.at && <>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
          {tokens.map((token,index)=><rect key={index} data-stereotype-token={index+1} {...shapeAttrs(`stereotype-token-${index+1}`,{x:token.x-6,y:token.y-6,w:12,h:12},'mark','token')} x={token.x-6} y={token.y-6} width="12" height="12" fill={red} opacity={token.opacity}/>)}
        </svg>
        <Label id="stereotypes" box={T.stereotypes} size={22} ls={0} ink={soft} opacity={enter(ms,cue.stereotypes.at)}><span data-beat="t33Stereotypes">STEREOTYPES → COMPRESSED PRIORS</span></Label>
      </>}
      {ms>=cue.priors.at&&<EquationTerms tokens={priorTokens} pulses={termPulses} ms={ms} box={T.priorKey} fontSize={18} align="left" equation="P_i(T | Π_race)" style={{opacity:enter(ms,cue.priors.at),color:soft}}/>}
      {ms>=cue.sensory.at&&<EquationTerms tokens={evidenceTokens} pulses={termPulses} ms={ms} box={T.evidenceKey} fontSize={18} align="left" equation="P(X | T)" style={{opacity:enter(ms,cue.sensory.at),color:soft}}/>}
      {ms>=cue.evidence.at&&<>
        <EquationTerms tokens={posteriorTokens} pulses={termPulses} ms={ms} box={T.posteriorKey} fontSize={18} align="left" equation="P_i(T | X, Π_race)" style={{opacity:enter(ms,cue.evidence.at),color:soft}}/>
        <SceneSource text="Eq. 2.8a · Bayesian prior" opacity={enter(ms,cue.evidence.at)}/>
      </>}
      {ms>=cue.override.at && <>
        <div data-beat="t33Override" data-gauge-box="true" {...shapeAttrs('precision-gauge',L.gauge,'frame')} style={{position:'absolute',left:L.gauge.x,top:L.gauge.y,width:L.gauge.w,height:L.gauge.h,boxShadow:ms>=cue.institutions.at?`0 0 0 ${3*enter(ms,cue.institutions.at)}px ${gold}`:undefined,opacity:enter(ms,cue.override.at)}}>
          <PrecisionGauge value={alpha} derived={false} label="DERIVED · NORMALIZED PRIOR PRECISION α" lowLabel="EVIDENCE" highLabel="PRIOR"/>
        </div>
        <Label id="alpha-low" box={T.alphaLow} size={20} ls={0} ink={gold} opacity={enter(ms,cue.override.at)}>α = 0 · EVIDENCE-LED</Label>
      </>}
      {pulses.length>0 && <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={enter(ms,cue.institutions.at)}>
        <path data-beat="t33Institutions" {...lineAttrs('pulse-path',pulsePath)} d={pathFrom(pulsePath)} fill="none" stroke={red} strokeWidth="2" strokeDasharray="4 6"/>
        {pulses.map((pulse,index)=><circle key={index} data-institution-pulse={index+1} {...shapeAttrs(`pulse-${index+1}`,{x:pulse.x-7,y:pulse.y-7,w:14,h:14},'mark','pulse')} cx={pulse.x} cy={pulse.y} r="7" fill={red}/>)}
      </svg>}
      {ms>=cue.weight.at && <Label id="alpha-high" box={T.alphaHigh} size={20} weight={700} ls={0} align="right" ink={red} opacity={enter(ms,cue.weight.at)}><span data-beat="t33Weight">α = 1 · PRIOR-LED</span></Label>}
    </div>}

    {turn34 && <div data-turn="34" style={{opacity:turn34Opacity}}>
      <EquationTerms tokens={equationTokens(cue.bias.at-1000)} pulses={termPulses} ms={ms} box={T.strip} fontSize={26} align="center" equation={EQ_28A} style={{color:soft}}/>
      <Label id="bias" box={T.bias} size={28} weight={700} ls={2} lh={1.15} align="center" ink={gold}><span data-beat="t34Bias">BIAS</span></Label>
      <Panel box={L.rail} id="rail" dataPanel="three-field-rail"/>
      {ms>=cue.sociology.at && <>
        <Label id="sociology" box={{x:RAIL_COLUMNS[0],y:188,w:480,h:30}} size={23} weight={700} ls={0} align="center" opacity={enter(ms,cue.sociology.at)}><span data-beat="t34Sociology">SOCIOLOGY</span></Label>
        <div data-sociology-glyph="true" {...shapeAttrs('sociology-glyph',{x:SOCIOLOGY_GLYPH.x,y:SOCIOLOGY_GLYPH.y,w:760*SOCIOLOGY_GLYPH.scale,h:430*SOCIOLOGY_GLYPH.scale},'mark','glyph')} style={{position:'absolute',left:SOCIOLOGY_GLYPH.x,top:SOCIOLOGY_GLYPH.y,width:760,height:430,transform:`scale(${SOCIOLOGY_GLYPH.scale})`,transformOrigin:'left top',opacity:enter(ms,cue.sociology.at)}}>
          <UsThemSortingField marks={SORTING_MARKS} partitionProgress={1} ingroupProgress={1} outgroupProgress={1} labels={{ingroup:'',outgroup:''}} mode="partition"/>
        </div>
      </>}
      {ms>=cue.neuroscience.at && <>
        <Label id="neuroscience" box={{x:RAIL_COLUMNS[1],y:188,w:480,h:30}} size={23} weight={700} ls={0} align="center" opacity={enter(ms,cue.neuroscience.at)}><span data-beat="t34Neuroscience">NEUROSCIENCE</span></Label>
        <svg data-neuroscience-glyph="true" {...shapeAttrs('neuroscience-glyph',{x:840,y:234,w:240,h:120},'mark','glyph')} width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={enter(ms,cue.neuroscience.at)}>
          <path d={pathFrom(gaussianPoints(850,1070,344,70,.38,30,40))} fill="none" stroke={red} strokeWidth="3"/>
          <path d={pathFrom(gaussianPoints(850,1070,344,70,.64,30,40))} fill="none" stroke={gold} strokeWidth="3"/>
          <path d="M850 344H1070" stroke={color('color/line/hairline')} strokeWidth="2"/>
          <path d="M1010 262 C1040 240 1000 236 960 246" fill="none" stroke={accent} strokeWidth="3"/>
          <path d="M960 246l12 -9v18z" fill={accent}/>
        </svg>
      </>}
      {ms>=cue.learning.at && <>
        <Label id="machine-learning" box={{x:RAIL_COLUMNS[2],y:188,w:480,h:30}} size={23} weight={700} ls={0} align="center" opacity={enter(ms,cue.learning.at)}><span data-beat="t34Learning">MACHINE LEARNING</span></Label>
        <MiniNetwork id="ml-glyph" x={1380} y={232} w={260} h={124} progress={1} hot opacity={enter(ms,cue.learning.at)}/>
      </>}
      {ms>=cue.prediction.at && <>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={enter(ms,cue.prediction.at)}>
          {[410,960,1510].map(x=><path key={x} {...lineAttrs(`rail-link-${x}`,[[x,L.rail.y+L.rail.h],[x,386]])} d={`M${x} ${L.rail.y+L.rail.h}V386`} stroke={accent} strokeWidth="3"/>)}
          <path {...lineAttrs('rail-bus',[[410,386],[1510,386]])} d="M410 386H1510" stroke={accent} strokeWidth="3"/>
          <path {...lineAttrs('rail-stem',[[960,386],[960,T.prediction.y]])} d={`M960 386V${T.prediction.y}`} stroke={accent} strokeWidth="3"/>
        </svg>
        <Label id="prediction" box={T.prediction} size={30} weight={700} ls={0} align="center" ink={accent} opacity={enter(ms,cue.prediction.at)}><span data-beat="t34Prediction">PREDICTION FROM PRIOR EXPERIENCE</span></Label>
      </>}
      <div data-cartridge-34="true" {...shapeAttrs('cartridge-34',L.cartridge34,'frame')} style={{position:'absolute',left:L.cartridge34.x,top:L.cartridge34.y,width:L.cartridge34.w,height:L.cartridge34.h,boxSizing:'border-box',background:color('color/fill/red-wash'),border:`2px solid ${red}`}}/>
      <ColoredTerm term="PiRace" ms={ms} pulses={termPulses.PiRace} box={T.pi34} style={{position:'absolute',left:T.pi34.x,top:T.pi34.y,width:T.pi34.w,height:T.pi34.h,display:'grid',placeItems:'center',font:'700 30px "IBM Plex Mono"'}}/>
      {ms>=cue.experience.at && (()=>{
        const p=enter(ms,cue.experience.at,650), shift=((ms-cue.experience.at)/40)%64;
        return <svg data-beat="t34Experience" data-history-ribbon="true" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={p}>
          <rect {...shapeAttrs('history-ribbon',L.ribbon,'frame')} x={L.ribbon.x} y={L.ribbon.y} width={L.ribbon.w*p} height={L.ribbon.h} fill={color('color/fill/gold-wash')} stroke={color('color/line/hairline-strong')}/>
          {Array.from({length:10},(_,index)=>{const x=L.ribbon.x+12+((index*64+shift)%(L.ribbon.w-40)); return x<L.ribbon.x+L.ribbon.w*p-24?<rect key={index} x={x} y={L.ribbon.y+16} width="24" height="24" fill={index%3===0?red:gold} opacity={.35+.06*index}/>:null;})}
          <path {...lineAttrs('ribbon-feed',[[L.ribbon.x+L.ribbon.w,540],[L.cartridge34.x,540]])} d={`M${L.ribbon.x+L.ribbon.w} 540H${L.cartridge34.x}`} stroke={gold} strokeWidth="4"/>
        </svg>;
      })()}
      {ms>=cue.accurate.at && <Label id="starting" box={T.starting} size={26} ls={0} align="center" ink={soft} opacity={enter(ms,cue.accurate.at)}>A STARTING ASSUMPTION CAN BE</Label>}
      {([['accurate',cue.accurate.at,'ACCURATE',gold,'t34Accurate'],['outdated',cue.outdated.at,'OUTDATED',red,'t34Outdated'],['history',cue.history.at,'EARNED BY REAL HISTORY',color('color/text/primary'),'t34History']] as const).map(([id,at,text,ink,beat],index)=>{
        if(ms<at) return null;
        const box={x:L.cards.x+index*450,y:L.cards.y,w:420,h:L.cards.h}, p=enter(ms,at);
        return <React.Fragment key={id}>
          <div data-final-card={id} {...shapeAttrs(`card-${id}`,box,'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`2px solid ${ink}`,opacity:p}}/>
          <Label id={`card-${id}-text`} box={{x:box.x+20,y:box.y+56,w:380,h:38}} size={index===2?25:27} weight={700} ls={0} align="center" ink={ink} opacity={p}><span data-beat={beat}>{text}</span></Label>
        </React.Fragment>;
      })}
    </div>}
  </StageSceneFrame>;
}
