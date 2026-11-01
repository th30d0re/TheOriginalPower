import React,{useState,useContext} from 'react';
import {ClockContext,TokensContext,useStageMs,resolveMode,type InstrumentMode,type ModeKey,type Camera,type InstrumentGrow} from '@stage';
import layout from '../handoff/layout.json';
import {Tokens} from '../tokens';
import {CompactBorder} from './CompactBorder';
import {EraStrip} from './EraStrip';
import {DashboardMap} from './DashboardMap';
import {worldCamera,iberiaCamera} from './mapGeometry';
import {CameraContext,instruments} from './PanelContent';
import {EraClock} from './instruments/era-clock';
import {SystemStress} from './instruments/system-stress';
import {Capital} from './instruments/capital';
import {Interference} from './instruments/interference';
import {Compass} from './instruments/compass';
import {ActivePatch} from './instruments/active-patch';
import {Variables} from './instruments/variables';
import {WagePlane} from './instruments/wage-plane';
import {BacklashOscillator} from './instruments/backlash-oscillator';
import {ExecutingFunction} from './instruments/executing-function';
import {PolicyTicker} from './instruments/policy-ticker';
const frame=layout.frames['dash 1486 · compact'];
const compassRailItem={name:'compass',instrument:'Compass',mode:'compact',x:36,y:483.8,w:196,h:96};
export const rail=[...frame.leftStack.panels,compassRailItem,...frame.rightStack.panels,...frame.bottomStrips];
export const slugs=rail.map(p=>p.instrument.toLowerCase().replaceAll(' ','-'));
const components=[EraClock,SystemStress,Capital,Interference,Compass,ActivePatch,Variables,WagePlane,BacklashOscillator,ExecutingFunction,PolicyTicker];
export type DashboardProps={era?:number;world?:boolean;camera?:Camera;worldOpacity?:number;routeDraw?:number;dim?:number;lights?:number[];empty?:boolean;modes?:Record<string,InstrumentMode>;modeTimelines?:Record<string,ModeKey[]>};
type InteractiveState={interactiveModes?:Record<string,InstrumentMode|null>;onModeChange?:(slug:string,mode:InstrumentMode|null)=>void};
export function Dashboard(props:DashboardProps) {
 const {interactive}=useContext(ClockContext);
 return interactive?<InteractiveDashboard {...props}/>:<DashboardFrame {...props}/>;
}
function InteractiveDashboard(props:DashboardProps) {
 const [interactiveModes,setInteractiveModes]=useState<Record<string,InstrumentMode|null>>({});
 return <DashboardFrame {...props} interactiveModes={interactiveModes} onModeChange={(slug,mode)=>setInteractiveModes(previous=>({...previous,[slug]:mode}))}/>;
}
function DashboardFrame({era=2,world=false,camera,worldOpacity=0,routeDraw=1,dim=1,lights=[],empty=false,modes={},modeTimelines={},interactiveModes={},onModeChange}:DashboardProps & InteractiveState) {
 const ms=useStageMs();
 if(era!==2) throw new Error(`YT02 handoff supplies instrument content for log 2; received ${era}`);
 const activeCamera=camera??(world?worldCamera:iberiaCamera);
 const heights=rail.map((p,i)=>{const d=instruments[p.instrument];if(p.instrument==='Wage plane')return d.compact.h;const forced=interactiveModes[slugs[i]]??modes[slugs[i]],weights=resolveMode(ms,modeTimelines[slugs[i]]??[]).weights;return forced?d[forced].h:weights.compact*d.compact.h+weights.expanded*d.expanded.h+weights.settings*d.settings.h;});
 return <TokensContext.Provider value={Tokens}><CameraContext.Provider value={activeCamera}><div className="yt02-dashboard" style={{position:'absolute',inset:0,width:1920,height:1080,background:Tokens.colours.background,overflow:'hidden'}}><style>{'.yt02-dashboard sub { vertical-align: baseline; position: relative; top: .2em; }'}</style><EraStrip activeLog={era} empty={empty}/><DashboardMap world={world} camera={camera} worldOpacity={worldOpacity} draw={routeDraw}/>{rail.map((p,i)=>{
 const Component=components[i],start=i<5?0:5;
 const y=i<9?96+heights.slice(start,i).reduce((sum,h)=>sum+h+8,0):p.y;
 const grow:InstrumentGrow=i<5?'right-down':i<9?'left-down':i===9?'right-up':'left-up';
 return <Component onInteractiveModeChange={onModeChange?mode=>onModeChange(slugs[i],mode):undefined} key={slugs[i]} anchor={{x:i>=5?p.x+p.w-instruments[p.instrument].compact.w:p.x,y,width:instruments[p.instrument].compact.w,height:instruments[p.instrument].compact.h}} grow={grow} mode={modes[slugs[i]]} modeTimeline={modeTimelines[slugs[i]]} opacity={lights[i]??dim}/>;
 })}<CompactBorder/></div></CameraContext.Provider></TokensContext.Provider>;
}
