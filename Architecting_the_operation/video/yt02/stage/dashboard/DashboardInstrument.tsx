import React from 'react';
import {Instrument,type InstrumentMode,type ModeKey,type Rect,type InstrumentGrow} from '@stage';
import {PanelContent,instruments} from './PanelContent';
export type DashboardInstrumentProps={anchor:Rect;grow:InstrumentGrow;mode?:InstrumentMode;modeTimeline?:ModeKey[];opacity?:number;onInteractiveModeChange?:(mode:InstrumentMode|null)=>void};
export function DashboardInstrument({name,anchor,grow,mode,modeTimeline,opacity=1,onInteractiveModeChange}:{name:string}&DashboardInstrumentProps) {
 const data=instruments[name];
 return <Instrument onInteractiveModeChange={onInteractiveModeChange} unstyled mode={mode} modeTimeline={modeTimeline} grow={grow} style={{opacity}} anchor={{compact:anchor,expanded:{...anchor,width:data.expanded.w,height:data.expanded.h},settings:{...anchor,width:data.settings.w,height:data.settings.h}}} compact={()=><PanelContent name={name} mode="compact"/>} expanded={()=><PanelContent name={name} mode="expanded"/>} settings={()=><PanelContent name={name} mode="settings"/>}/>;
}
