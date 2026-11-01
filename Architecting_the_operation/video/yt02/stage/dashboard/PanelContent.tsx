import React,{useContext,type JSX} from 'react';
import {ClockContext, GlassPanel, MathText, createProjection, type Camera, type InstrumentMode} from '@stage';
import spec from '../handoff/spec.json';
import map from '../handoff/map.json';
import eras from '../../dashboard_eras.json';
import {color, Tokens} from '../tokens';
import {iberiaCamera} from './mapGeometry';
import {ComplexWagePlane, WagePlaneSettings, WAGE_EXPANDED_BOX} from './ComplexWagePlane';
import {Graphic} from './Graphics';
import {TRAY_CELL_WIDTH, TRAY} from './trayLayout';
import {InterferenceEngineView} from './artifacts/InterferenceEngineView';
import {PhaseCoherenceView} from './artifacts/PhaseCoherenceView';
import {FiveTierConeView} from './artifacts/FiveTierConeView';
import {CompoundingLedgerView} from './artifacts/CompoundingLedgerView';
import {BacklashOscillatorView} from './artifacts/BacklashOscillatorView';
import {ThyristorLatchView} from './artifacts/ThyristorLatchView';
import {AcExtractionMeterView} from './artifacts/AcExtractionMeterView';
import {SnubberCircuitView} from './artifacts/SnubberCircuitView';

export const CameraContext = React.createContext<Camera>(iberiaCamera);

// When a Dashboard sets `eraClockStandby`, the Era clock's compact panel shows a standby
// state (a dash for the year, "STANDBY" for the place, no log chip) instead of the log-2
// 1486 state, and the Policy ticker's compact result line (whose log-2 entry names the
// year 1486) shows a dash. Default false: every existing render is unchanged.
export const EraClockStandbyContext = React.createContext(false);

function EraClockCompactStandby() {
 return <>
  <div style={{position:'absolute',left:11,top:9,width:96,height:52,fontFamily:Tokens.fonts.sans,fontSize:40,fontWeight:700,lineHeight:'52px',color:color('color/text/primary'),whiteSpace:'pre-wrap'}}>—</div>
  <div style={{position:'absolute',left:11,top:63.5,width:119,height:16,fontFamily:Tokens.fonts.sans,fontSize:12,fontWeight:500,letterSpacing:0.5,lineHeight:'16px',color:color('color/text/muted'),whiteSpace:'pre-wrap'}}>STANDBY</div>
 </>;
}

// The gear in an expanded tray card switches to the artifact's settings view (and back).
// The control state lives in the tray instrument frame; PanelContent only renders the chrome.
export const TrayModeControlContext = React.createContext<((mode: InstrumentMode | null) => void) | null>(null);

export type EraEntry = {log: number; title?: string; fields: Record<string, unknown>};
export const eraLog2: EraEntry = (eras as unknown as {log: number; title: string; fields: Record<string, unknown>}[]).find(e => e.log === 2)!;

// The eight ported artifact views (tray instruments). The Complex Wage Plane keeps its own
// fix-pass-3 implementation and is handled separately.
type ArtifactViewComponent = (props: {mode: InstrumentMode; width: number; height: number; interactive: boolean; era?: EraEntry}) => JSX.Element;
export const ARTIFACT_VIEWS: Record<string, ArtifactViewComponent> = {
  'Interference Engine': InterferenceEngineView,
  'Phase Coherence': PhaseCoherenceView,
  'Five-Tier Cone': FiveTierConeView,
  'Compounding Ledger': CompoundingLedgerView,
  'Backlash oscillator': BacklashOscillatorView,
  'Thyristor Latch': ThyristorLatchView,
  'AC Extraction Meter': AcExtractionMeterView,
  'Snubber Circuit': SnubberCircuitView,
};

// Tray cells share the dashboard's panel recipe; content boxes follow the port contract:
// compact 177×80 centred in the cell, expanded/settings 1368×828 inside the 1400×860 card.
const TRAY_COMPACT_CONTENT = {w: 177, h: 80};
const TRAY_EXPANDED_CONTENT = {w: 1368, h: 828};
export const TRAY_VIEW_LAYOUT_HEIGHTS: Record<string,{expanded:number;settings:number}> = {
  'Wage plane': {expanded: 828, settings: 828}, 'Interference Engine': {expanded: 828, settings: 828},
  'Phase Coherence': {expanded: 828, settings: 828}, 'Five-Tier Cone': {expanded: 828, settings: 828},
  'Compounding Ledger': {expanded: 828, settings: 828}, 'Backlash oscillator': {expanded: 828, settings: 828},
  'Thyristor Latch': {expanded: 779, settings: 828}, 'AC Extraction Meter': {expanded: 816, settings: 828},
  'Snubber Circuit': {expanded: 828, settings: 828},
};

const trayArtifactSpec = {
  compact: {w: TRAY_CELL_WIDTH, h: TRAY.height},
  expanded: {w: WAGE_EXPANDED_BOX.width, h: WAGE_EXPANDED_BOX.height},
  settings: {w: WAGE_EXPANDED_BOX.width, h: WAGE_EXPANDED_BOX.height},
};

const compassSpec = {
 compact: {w: 196, h: 96, children: []},
 expanded: {w: 640, h: 312, children: []},
 settings: {
  w: 560,
  h: 345.2,
  template: 'settingsTemplate',
  content: {
   title: 'SETTINGS · COMPASS',
   source: 'Natural Earth, public domain; Cliopatria, CC BY 4.0, Bennett et al. 2025',
   units: 'centre / extent: degrees (°N/°S, °E/°W) · scale bar: kilometres (km) at camera centre latitude φ₀ · zoom: Equal Earth world-scale multiplier',
   log: 'Equal Earth projection (equal-area; Šavrič, Patterson and Jenny, 2018)',
  },
 },
};

const wagePlaneSpec = {
 ...spec.instruments['Wage plane'],
 compact: {
  ...spec.instruments['Wage plane'].compact,
  children: spec.instruments['Wage plane'].compact.children.map((child:any,index:number)=>index===0?{
   ...child,
   text: 'Buffer Class Wage',
   box: [11,9,165,14],
  }:child),
 },
 expanded: {
  ...spec.instruments['Wage plane'].expanded,
  w: WAGE_EXPANDED_BOX.width,
  h: WAGE_EXPANDED_BOX.height,
 },
 settings: {
  ...spec.instruments['Wage plane'].settings,
  w: WAGE_EXPANDED_BOX.width,
  h: WAGE_EXPANDED_BOX.height,
  content: {
   ...spec.instruments['Wage plane'].settings.content,
   title: 'SETTINGS · BUFFER CLASS WAGE',
  },
 },
};

// Right-stack compact panels (one line each), replacing the removed bottom strips.
const executingFunctionSpec = {
 ...spec.instruments['Executing Function'],
 compact: {...spec.instruments['Executing Function'].compact, w: 211, h: 40},
};
const policyTickerSpec = {
 ...spec.instruments['Policy ticker'],
 compact: {...spec.instruments['Policy ticker'].compact, w: 211, h: 40},
};

export const instruments: Record<string,any> = {
 ...spec.instruments,
 'Wage plane': wagePlaneSpec,
 'Backlash oscillator': trayArtifactSpec,
 'Executing Function': executingFunctionSpec,
 'Policy ticker': policyTickerSpec,
 Compass: compassSpec,
 'Interference Engine': trayArtifactSpec,
 'Phase Coherence': trayArtifactSpec,
 'Five-Tier Cone': trayArtifactSpec,
 'Compounding Ledger': trayArtifactSpec,
 'Thyristor Latch': trayArtifactSpec,
 'AC Extraction Meter': trayArtifactSpec,
 'Snubber Circuit': trayArtifactSpec,
};

const fontStyle=(f:any):React.CSSProperties=>({fontFamily:f.family,fontSize:f.size,fontWeight:f.style==='Bold'?700:f.style==='Medium'?500:400,fontStyle:f.style==='Italic'?'italic':'normal',letterSpacing:f.letterSpacing_px??0,lineHeight:`${f.lineHeight_px??Math.round(f.size*1.3)}px`});
const pos=(b:number[]):React.CSSProperties=>({position:'absolute',left:b[0],top:b[1],width:b[2],height:b[3]});

function formatLat(lat:number):string {
 const v=Math.abs(lat)<1e-4?0:lat;
 return `${Math.abs(v).toFixed(1)}°${v>=0?'N':'S'}`;
}
function formatLon(lon:number):string {
 const v=Math.abs(lon)<1e-4?0:lon;
 return `${Math.abs(v).toFixed(1)}°${v>=0?'E':'W'}`;
}
export function formatCoord([lon,lat]:[number,number]):string {
 return `${formatLat(lat)} ${formatLon(lon)}`;
}

export function computeCompassMetrics(camera:Camera) {
 const proj=createProjection(camera,'equalEarth',1856,968);
 const [lon0,lat0]=camera.center;
 const clampedLat=Math.max(-85,Math.min(85,lat0));
 const pW=proj([lon0-0.5,clampedLat])!;
 const pE=proj([lon0+0.5,clampedLat])!;
 const pxPerDegLon=Math.hypot(pE[0]-pW[0],pE[1]-pW[1]);
 const kmPerDegLon=(Math.PI/180)*6371.0088*Math.cos((clampedLat*Math.PI)/180);
 const pxPerKm=pxPerDegLon/kmPerDegLon;

 const chooseScale=(minPx:number,maxPx:number)=>{
  const steps=[50,100,200,250,500,1000,2000,2500,5000,10000];
  const valid=steps.filter(km=>km*pxPerKm>=minPx&&km*pxPerKm<=maxPx);
  const target=0.72*maxPx;
  const chosen=valid.length>0
   ?valid.reduce((a,b)=>Math.abs(a*pxPerKm-target)<Math.abs(b*pxPerKm-target)?a:b)
   :steps.reduce((a,b)=>Math.abs(a*pxPerKm-target)<Math.abs(b*pxPerKm-target)?a:b);
  return {km:chosen,px:Number((chosen*pxPerKm).toFixed(2))};
 };

 const compactScale=chooseScale(38,96);
 const expandedScale=chooseScale(100,250);

 const invW=proj.invert?.([0,484]);
 const invE=proj.invert?.([1856,484]);
 const invN=proj.invert?.([928,0]);
 const invS=proj.invert?.([928,968]);
 const west=invW&&Number.isFinite(invW[0])?Math.max(-180,Math.min(180,invW[0])):-180;
 const east=invE&&Number.isFinite(invE[0])?Math.max(-180,Math.min(180,invE[0])):180;
 const north=invN&&Number.isFinite(invN[1])?Math.max(-90,Math.min(90,invN[1])):90;
 const south=invS&&Number.isFinite(invS[1])?Math.max(-90,Math.min(90,invS[1])):-90;

 return {
  lon0,
  lat0,
  centerText:formatCoord([lon0,lat0]),
  zoomText:`${camera.zoom.toFixed(2)}×`,
  scaleValue:proj.scale(),
  pxPerDegLon,
  pxPerKm,
  compactScale,
  expandedScale,
  extentText:`${formatLat(south)}–${formatLat(north)} · ${formatLon(west)}–${formatLon(east)}`,
  spanText:`Δφ ${Math.abs(north-south).toFixed(1)}° × Δλ ${Math.abs(east-west).toFixed(1)}°`,
 };
}

function RoseSvg({size,compact}:{size:number;compact:boolean}) {
 const cx=size/2,cy=size/2+(compact?3:4);
 const r=compact?19:50;
 const rOuter=Number((r*82/70).toFixed(2));
 const rInner=Number((r*66/70).toFixed(2));
 const pts=Array.from({length:32},(_,i)=>{
  const a=-Math.PI/2+i*Math.PI/16;
  const rad=i%8===0?r:i%4===0?r*0.72:i%2===0?r*0.5:r*0.2;
  return `${(cx+Math.cos(a)*rad).toFixed(2)},${(cy+Math.sin(a)*rad).toFixed(2)}`;
 }).join(' ');
 const line=color('color/line/hairline-strong');
 const starStroke=color(map.iberia.compassRose.star.stroke);
 const starFill=color(map.iberia.compassRose.star.fill);
 return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} data-compass-rose={size} style={{display:'block',overflow:'visible'}}>
  <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke={line} strokeWidth={1}/>
  <circle cx={cx} cy={cy} r={rInner} fill="none" stroke={line} strokeWidth={1}/>
  <polygon points={pts} fill={starFill} stroke={starStroke} strokeWidth={1}/>
  <text x={cx} y={Number((cy-rOuter-(compact?3:5)).toFixed(2))} textAnchor="middle" fill={color('color/text/primary')} fontFamily={Tokens.fonts.mono} fontSize={compact?10:12} fontWeight={500}>N</text>
  {!compact&&<>
   <text x={cx} y={Number((cy+rOuter+13).toFixed(2))} textAnchor="middle" fill={color('color/text/muted')} fontFamily={Tokens.fonts.mono} fontSize={10}>S</text>
   <text x={Number((cx+rOuter+9).toFixed(2))} y={cy+3.5} textAnchor="middle" fill={color('color/text/muted')} fontFamily={Tokens.fonts.mono} fontSize={10}>E</text>
   <text x={Number((cx-rOuter-9).toFixed(2))} y={cy+3.5} textAnchor="middle" fill={color('color/text/muted')} fontFamily={Tokens.fonts.mono} fontSize={10}>W</text>
  </>}
 </svg>;
}

function CompassWidget({mode}:{mode:'compact'|'expanded'}) {
 const camera=useContext(CameraContext);
 const m=computeCompassMetrics(camera);
 if(mode==='compact') {
  return <>
   <div style={{position:'absolute',left:11,top:8,right:11,height:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span style={{fontFamily:Tokens.fonts.mono,fontSize:10,fontWeight:500,letterSpacing:0.6,color:color('color/text/muted')}}>COMPASS</span>
    <span style={{fontFamily:Tokens.fonts.mono,fontSize:9,letterSpacing:0.4,color:color('color/text/faint')}}>EQUAL EARTH</span>
   </div>
   <div style={{position:'absolute',left:11,top:28,width:56,height:56}}>
    <RoseSvg size={56} compact/>
   </div>
   <div style={{position:'absolute',left:75,top:27,right:11,display:'flex',flexDirection:'column',gap:3}}>
    <div data-compass-center={m.centerText} style={{fontFamily:Tokens.fonts.mono,fontSize:11.5,fontWeight:500,lineHeight:'15px',color:color('color/text/primary'),whiteSpace:'nowrap'}}>{m.centerText}</div>
    <div style={{fontFamily:Tokens.fonts.mono,fontSize:9.5,lineHeight:'13px',color:color('color/text/muted'),whiteSpace:'nowrap'}}>{`φ₀ ${formatLat(m.lat0)} · ${m.zoomText}`}</div>
    <div style={{marginTop:3,display:'flex',flexDirection:'column',gap:2}}>
     <div data-compass-scale-km={m.compactScale.km} style={{fontFamily:Tokens.fonts.mono,fontSize:9.5,lineHeight:'12px',color:color('color/text/primary'),whiteSpace:'nowrap'}}>{`${m.compactScale.km} km`}</div>
     <svg width={104} height={8} viewBox="0 0 104 8" style={{display:'block',overflow:'visible'}}>
      <line x1={0} y1={4} x2={m.compactScale.px} y2={4} stroke={color('color/text/accent')} strokeWidth={1.6}/>
      <line x1={0} y1={1} x2={0} y2={7} stroke={color('color/text/primary')} strokeWidth={1.2}/>
      <line x1={Number((m.compactScale.px/2).toFixed(2))} y1={2} x2={Number((m.compactScale.px/2).toFixed(2))} y2={6} stroke={color('color/text/muted')} strokeWidth={1}/>
      <line x1={m.compactScale.px} y1={1} x2={m.compactScale.px} y2={7} stroke={color('color/text/primary')} strokeWidth={1.2}/>
     </svg>
    </div>
   </div>
  </>;
 }
 return <>
  <div style={{position:'absolute',left:17.6,top:16,right:17.6,height:26,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div style={{fontFamily:Tokens.fonts.mono,fontSize:13,fontWeight:500,letterSpacing:0.8,color:color('color/text/primary')}}>COMPASS · PROJECTION &amp; SCALE TELEMETRY</div>
   <div style={{background:color('color/fill/accent-wash'),border:`1px solid ${color('color/line/hairline-strong')}`,borderRadius:4,padding:'2px 8px',fontFamily:Tokens.fonts.mono,fontSize:11,fontWeight:500,color:color('color/text/accent')}}>Equal Earth</div>
  </div>
  <div style={{position:'absolute',left:17.6,top:52,width:188,height:242,background:color('color/surface/well'),borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
   <RoseSvg size={148} compact={false}/>
   <div style={{fontFamily:Tokens.fonts.mono,fontSize:10,letterSpacing:0.6,color:color('color/text/muted')}}>TRUE NORTH · EQUAL-AREA</div>
  </div>
  <div style={{position:'absolute',left:218,top:52,right:17.6,height:242,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
    <div style={{background:color('color/surface/well'),borderRadius:6,padding:'8px 10px'}}>
     <div style={{fontFamily:Tokens.fonts.mono,fontSize:10,letterSpacing:0.6,color:color('color/text/muted'),marginBottom:4}}>CAMERA CENTRE</div>
     <div data-compass-center={m.centerText} style={{fontFamily:Tokens.fonts.mono,fontSize:14,fontWeight:500,color:color('color/text/primary')}}>{m.centerText}</div>
     <div style={{fontFamily:Tokens.fonts.mono,fontSize:10.5,color:color('color/text/muted'),marginTop:2}}>{`λ₀ ${formatLon(m.lon0)} · φ₀ ${formatLat(m.lat0)}`}</div>
    </div>
    <div style={{background:color('color/surface/well'),borderRadius:6,padding:'8px 10px'}}>
     <div style={{fontFamily:Tokens.fonts.mono,fontSize:10,letterSpacing:0.6,color:color('color/text/muted'),marginBottom:4}}>ZOOM &amp; PROJECTION</div>
     <div data-compass-zoom={m.zoomText} style={{fontFamily:Tokens.fonts.mono,fontSize:14,fontWeight:500,color:color('color/text/primary')}}>{`${m.zoomText} · Equal Earth`}</div>
     <div style={{fontFamily:Tokens.fonts.mono,fontSize:10.5,color:color('color/text/muted'),marginTop:2}}>{`scale ${m.scaleValue.toFixed(1)} px/rad`}</div>
    </div>
   </div>
   <div style={{background:color('color/surface/well'),borderRadius:6,padding:'8px 10px'}}>
    <div style={{fontFamily:Tokens.fonts.mono,fontSize:10,letterSpacing:0.6,color:color('color/text/muted'),marginBottom:4}}>VIEW EXTENT (DEGREES)</div>
    <div data-compass-extent={m.extentText} style={{fontFamily:Tokens.fonts.mono,fontSize:13,fontWeight:500,color:color('color/text/primary')}}>{m.extentText}</div>
    <div style={{fontFamily:Tokens.fonts.mono,fontSize:10.5,color:color('color/text/muted'),marginTop:2}}>{m.spanText}</div>
   </div>
   <div style={{background:color('color/surface/well'),borderRadius:6,padding:'8px 10px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
     <span style={{fontFamily:Tokens.fonts.mono,fontSize:10,letterSpacing:0.6,color:color('color/text/muted')}}>{`SCALE BAR AT φ₀ (${formatLat(m.lat0)})`}</span>
     <span data-compass-scale-km={m.expandedScale.km} style={{fontFamily:Tokens.fonts.mono,fontSize:12,fontWeight:500,color:color('color/text/primary')}}>{`${m.expandedScale.km} km (${m.expandedScale.px.toFixed(0)} px)`}</span>
    </div>
    <svg width={360} height={18} viewBox="0 0 360 18" style={{display:'block',overflow:'visible'}}>
     <rect x={0} y={5} width={Number((m.expandedScale.px/2).toFixed(2))} height={5} fill={color('color/text/accent')}/>
     <rect x={Number((m.expandedScale.px/2).toFixed(2))} y={5} width={Number((m.expandedScale.px/2).toFixed(2))} height={5} fill="none" stroke={color('color/text/accent')} strokeWidth={1.2}/>
     <line x1={0} y1={2} x2={0} y2={13} stroke={color('color/text/primary')} strokeWidth={1.4}/>
     <line x1={Number((m.expandedScale.px/2).toFixed(2))} y1={2} x2={Number((m.expandedScale.px/2).toFixed(2))} y2={13} stroke={color('color/text/primary')} strokeWidth={1.2}/>
     <line x1={m.expandedScale.px} y1={2} x2={m.expandedScale.px} y2={13} stroke={color('color/text/primary')} strokeWidth={1.4}/>
     <text x={0} y={18} fontFamily={Tokens.fonts.mono} fontSize={9.5} fill={color('color/text/muted')}>0</text>
     <text x={Number((m.expandedScale.px/2).toFixed(2))} y={18} textAnchor="middle" fontFamily={Tokens.fonts.mono} fontSize={9.5} fill={color('color/text/muted')}>{`${m.expandedScale.km/2}`}</text>
     <text x={m.expandedScale.px} y={18} textAnchor="end" fontFamily={Tokens.fonts.mono} fontSize={9.5} fill={color('color/text/primary')}>{`${m.expandedScale.km} km`}</text>
    </svg>
   </div>
  </div>
 </>;
}

// Right-stack compact one-liners (replacing the removed bottom strips). Verbatim era values;
// the strip truncates with an ellipsis and the expanded mode shows the full text.
function ExecutingFunctionCompact() {
 const text=String(eraLog2.fields.executing_function??'');
 return <>
  <div style={{position:'absolute',left:10,top:6,right:10,fontFamily:Tokens.fonts.mono,fontSize:9.5,letterSpacing:0.6,color:color('color/text/dim'),whiteSpace:'nowrap'}}>EXECUTING FUNCTION</div>
  <div style={{position:'absolute',left:10,top:20,right:10,fontFamily:Tokens.fonts.sans,fontSize:12,lineHeight:'15px',color:color('color/text/primary'),whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{text}</div>
 </>;
}
function PolicyTickerCompact() {
 const standby=useContext(EraClockStandbyContext);
 const results=(eraLog2.fields.results as string[]|undefined)??[];
 const latest=standby?'—':(results[results.length-1]??'');
 return <>
  <div style={{position:'absolute',left:10,top:6,right:10,fontFamily:Tokens.fonts.mono,fontSize:9.5,letterSpacing:0.6,color:color('color/text/dim'),whiteSpace:'nowrap'}}>RESULT</div>
  <div style={{position:'absolute',left:10,top:21,width:3,height:13,background:color('color/fill/accent'),borderRadius:1}}/>
  <div style={{position:'absolute',left:19,top:20,right:10,fontFamily:Tokens.fonts.sans,fontSize:12,lineHeight:'15px',color:color(standby?'color/text/muted':'color/text/primary'),whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{latest}</div>
 </>;
}

function Nodes({nodes,compact}:{nodes:any[];compact:boolean}) {
 return <>{nodes.map((n,i)=>{
  let own:React.ReactNode;
  if(n.k==='graphic') own=<Graphic node={n} compact={compact}/>;
  else if(n.k==='richText') {
   // Keep authored word positions, while MathText handles each base/subscript group.
   const groups:any[]=[];
   for(const r of n.runs??[]) {const prev=groups[groups.length-1];if(prev&&(r.sub||Math.abs(r.box[0]-(prev.end))<.15&&Math.abs(r.box[1]-prev.box[1])<.15)){prev.text+=r.sub?`_{${r.t}}`:r.t;prev.end=r.box[0]+r.box[2];}else groups.push({box:r.box,text:r.t,end:r.box[0]+r.box[2]});}
   own=<>{groups.map((r,j)=><span key={j} style={{...pos(r.box),...fontStyle(n.font),color:color(n.colour),whiteSpace:'nowrap',width:'max-content'}}><MathText>{r.text}</MathText></span>)}</>;
  } else if(n.k==='text') own=<div style={{...pos(n.box),...fontStyle(n.font),color:color(n.colour),whiteSpace:'pre-wrap'}}>{n.text}</div>;
  else own=<div style={{...pos(n.box),boxSizing:'border-box',background:n.fill?color(typeof n.fill==='string'?n.fill:n.fill.token):undefined,border:n.stroke?`${n.stroke.width}px solid ${color(n.stroke.token)}`:undefined,borderRadius:n.k==='ellipse'?'50%':n.radius??0}}/>;
  return <React.Fragment key={i}>{own}{n.children&&<Nodes nodes={n.children} compact={compact}/>}{n.parts&&<Nodes nodes={n.parts} compact={compact}/>}</React.Fragment>;
 })}</>;
}
function Settings({name,data}:{name:string;data:any}) {
 const camera=useContext(CameraContext);
 const t=spec.settingsTemplate;
 const content=name==='Compass'?{
  ...data.content,
  log:`${data.content.log} · centre ${ computeCompassMetrics(camera).centerText } · zoom ${ computeCompassMetrics(camera).zoomText }`,
 }:data.content;
 return <><div style={{position:'absolute',left:17.6,top:17.6,width:490,height:28,display:'flex',alignItems:'center',...fontStyle(t.header.title.font),color:color(t.header.title.colour)}}>{content.title}</div><div style={{position:'absolute',...pos(t.header.close.box),border:`1.6px solid ${color('color/line/hairline-strong')}`,borderRadius:6,boxSizing:'border-box',textAlign:'center',fontFamily:Tokens.fonts.mono,fontSize:20,lineHeight:'24px'}}>×</div><div style={{position:'absolute',left:17.6,right:17.6,top:61.6,display:'flex',flexDirection:'column',gap:16}}>{t.rows.map((r,i)=>{const key=['source','units','log'][i],text=content[key];return <div key={key}><div style={{fontFamily:Tokens.fonts.mono,fontSize:12,letterSpacing:.6,lineHeight:'16px',color:color('color/text/muted'),marginBottom:8}}>{r.label}</div><div style={{background:color('color/surface/well'),borderRadius:6,padding:'8px 10px',...fontStyle(r.valueFont),color:color(r.valueColour)}}>{text.includes('_{')?<MathText>{text}</MathText>:text}</div></div>;})}</div></>;
}

// Gear / close chrome for expanded and settings tray cards. Static divs in the rendered
// path, buttons on the interactive site; the mode switch goes to TrayModeControlContext.
export function TrayHeaderControls({mode}:{mode:'expanded'|'settings'}) {
 const {interactive}=useContext(ClockContext);
 const select=useContext(TrayModeControlContext);
 const gearTarget:InstrumentMode=mode==='settings'?'expanded':'settings';
 const gearAction=mode==='settings'?'open-expanded':'open-settings';
 const gearLabel=mode==='settings'?'Back to the expanded view':'Open settings';
 const closeLabel=mode==='settings'?'Close settings':'Close expanded view';
 const boxStyle:React.CSSProperties={
  width:30,
  height:30,
  borderRadius:6,
  border:`1.6px solid ${color('color/line/hairline-strong')}`,
  background:color('color/surface/1'),
  color:color('color/text/primary'),
  fontFamily:Tokens.fonts.mono,
  fontSize:17,
  lineHeight:'26px',
  textAlign:'center',
  boxSizing:'border-box',
  cursor:interactive?'pointer':'default',
  padding:0,
  display:'inline-flex',
  alignItems:'center',
  justifyContent:'center',
 };
 const wrapStyle:React.CSSProperties={position:'absolute',top:14,right:18,display:'flex',gap:8,alignItems:'center',zIndex:5};
 if(interactive) {
  return <div style={wrapStyle}>
   <button type="button" data-control="gear" data-action={gearAction} aria-label={gearLabel} onClick={e=>{e.stopPropagation();select?.(gearTarget);}} style={{...boxStyle,borderColor:mode==='settings'?color('color/fill/accent'):color('color/line/hairline-strong'),color:mode==='settings'?color('color/fill/accent'):color('color/text/primary')}}>⚙</button>
   <button type="button" data-control="close" data-action="close" aria-label={closeLabel} onClick={e=>{e.stopPropagation();select?.('compact');}} style={boxStyle}>×</button>
  </div>;
 }
 return <div style={wrapStyle}>
  <div data-control="gear" data-action={gearAction} aria-label={gearLabel} style={{...boxStyle,borderColor:mode==='settings'?color('color/fill/accent'):color('color/line/hairline-strong'),color:mode==='settings'?color('color/fill/accent'):color('color/text/primary')}}>⚙</div>
  <div data-control="close" data-action="close" aria-label={closeLabel} style={boxStyle}>×</div>
 </div>;
}

function ArtifactContent({name,mode,interactive}:{name:string;mode:InstrumentMode;interactive:boolean}) {
 const View=ARTIFACT_VIEWS[name];
 if(mode==='compact') {
  const left=(TRAY_CELL_WIDTH-TRAY_COMPACT_CONTENT.w)/2;
  const top=(TRAY.height-TRAY_COMPACT_CONTENT.h)/2;
  return <div data-artifact={name} style={{position:'absolute',left,top,width:TRAY_COMPACT_CONTENT.w,height:TRAY_COMPACT_CONTENT.h}}>
   <View mode="compact" width={TRAY_COMPACT_CONTENT.w} height={TRAY_COMPACT_CONTENT.h} interactive={interactive} era={eraLog2}/>
  </div>;
 }
 return <div data-artifact={name} style={{position:'absolute',left:16,top:16,width:TRAY_EXPANDED_CONTENT.w,height:TRAY_EXPANDED_CONTENT.h}}>
  <View mode={mode} width={TRAY_EXPANDED_CONTENT.w} height={TRAY_EXPANDED_CONTENT.h} interactive={interactive} era={eraLog2}/>
 </div>;
}

export function PanelContent({name,mode}:{name:string;mode:InstrumentMode}) {
 const {interactive}=useContext(ClockContext);
 const eraClockStandby=useContext(EraClockStandbyContext);
 const data=instruments[name][mode],compact=mode==='compact';
 const renderFill=`linear-gradient(${color('color/fill/panel-wash')}, ${color('color/fill/panel-wash')}), ${color('color/fill/panel-render')}`;
 const fill=interactive?color(compact?'color/fill/panel-wash':'color/fill/glass'):renderFill;
 const isArtifact=name in ARTIFACT_VIEWS;
 return <GlassPanel fill={fill} blur={interactive&&compact?6:0} padding={0} radius={compact?8:10} style={{backdropFilter:interactive&&compact?'blur(6px)':'none',WebkitBackdropFilter:interactive&&compact?'blur(6px)':'none',position:'relative',width:data.w,height:data.h,border:'none',boxShadow:`inset 0 0 0 ${compact?1:1.6}px ${color('color/line/hairline')}`,color:color('color/text/primary')}}>{
 isArtifact?<ArtifactContent name={name} mode={mode} interactive={interactive}/>
 :name==='Era clock'&&compact&&eraClockStandby?<EraClockCompactStandby/>
 :name==='Wage plane'&&mode==='compact'?<div data-artifact="Complex Wage Plane" data-compact-padding-x="11"><Nodes nodes={data.children} compact/></div>
 :name==='Wage plane'&&mode==='expanded'?<ComplexWagePlane/>
 :name==='Wage plane'&&mode==='settings'?<WagePlaneSettings data={data}/>
 :name==='Compass'&&(mode==='compact'||mode==='expanded')?<CompassWidget mode={mode}/>
 :name==='Executing Function'&&mode==='compact'?<ExecutingFunctionCompact/>
 :name==='Policy ticker'&&mode==='compact'?<PolicyTickerCompact/>
 :mode==='settings'?<Settings name={name} data={data}/>
 :<Nodes nodes={data.children} compact={compact}/>
 }{isArtifact&&mode!=='compact'&&<TrayHeaderControls mode={mode}/>}</GlassPanel>;
}
