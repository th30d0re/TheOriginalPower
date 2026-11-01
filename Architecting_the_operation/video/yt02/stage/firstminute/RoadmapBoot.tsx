// Turn 4 · RoadmapBoot (0:50.1–1:14.0). The dashboard powers up in boot state while a
// glass console over the map types the thirteen-item episode roadmap, one line per
// itemNN cue. Items that name an instrument light its panel and draw a gold wire to it;
// item11 sweeps every panel online and raises the map to full brightness; item12 pulses
// the Interference Engine tray cell; roadmapEnd collapses the console toward the top.
// Brief: BRIEF_FIRST_MINUTE_T4.md. Every frame is a pure function of stage ms and cues.
import React from 'react';
import {useStageMs,usePlan,lookupCue,progress,cubicOut,cubicInOut} from '@stage';
import {color,Tokens} from '../tokens';
import {Dashboard,rail} from '../dashboard/Dashboard';
import {instruments} from '../dashboard/PanelContent';

const DIM=.15,MAP_DIM=.3;
const CONSOLE={x:580,y:150,w:760,h:640};
const PAD=28,HEADER_H=56,LINE_H=38;
const TYPE_MS=300,PANEL_MS=400,SWEEP_MS=950,SWEEP_FADE_MS=250,BOOT_MS=1200;
const WIRE_DRAW_MS=250,WIRE_HOLD_MS=1000,WIRE_FADE_MS=300;
const PULSE_MS=700,COLLAPSE_MS=500;

type Item={cue:string;label:string;tag?:string;panel?:number;pulse?:number};
const ITEMS:Item[]=[
 {cue:'item01',label:'vector definition'},
 {cue:'item02',label:'conventional causal model',tag:'rejected'},
 {cue:'item03',label:'reversed hypothesis'},
 {cue:'item04',label:'two-set partition'},
 {cue:'item05',label:'orthographic illusion'},
 {cue:'item06',label:'five tiers',panel:12},        // Five-Tier Cone, tray cell 2
 {cue:'item07',label:'set-resolution ladder'},
 {cue:'item08',label:'three historical tests'},
 {cue:'item09',label:'complex wage diagnostic',panel:9},   // Wage plane, right stack
 {cue:'item10',label:'American backlash record',panel:14}, // Backlash oscillator, tray cell 4
 {cue:'item11',label:'runtime dashboard'},
 {cue:'item12',label:'Interference Engine',pulse:10},      // Interference Engine, tray cell 0
 {cue:'item13',label:'rebuilt hierarchy'},
];

const round=(v:number)=>Math.round(v*10000)/10000;

// On-canvas rect of every rail panel in compact mode, mirroring DashboardFrame's stacking
// (left stack from index 0, right stack from index 5, tray cells carry their own x/y).
const panelRect=(i:number)=>{
 const p:any=rail[i],d=instruments[p.instrument].compact;
 const start=i<5?0:5;
 const y=i<10?96+(rail.slice(start,i) as any[]).reduce((s,item)=>s+instruments[item.instrument].compact.h+8,0):p.y;
 const x=i>=5?p.x+p.w-d.w:p.x;
 return {x,y,w:d.w,h:d.h};
};
const lineCentreY=(i:number)=>CONSOLE.y+PAD+HEADER_H+i*LINE_H+LINE_H/2;
// Wire endpoints: tray targets get a drop from the console's bottom edge at the cell's
// centre x (a wire from the line text would cross the lines below it); the right-stack
// target gets a wire leaving the console's right edge at the line's centre height.
const wireFor=(item:Item,i:number)=>{
 if(item.panel===undefined) return null;
 const r=panelRect(item.panel);
 if(item.panel>=10){const cx=r.x+r.w/2;return {x1:cx,y1:CONSOLE.y+CONSOLE.h,x2:cx,y2:r.y};}
 return {x1:CONSOLE.x+CONSOLE.w,y1:lineCentreY(i),x2:r.x,y2:r.y+r.h/2};
};

const mono26={fontFamily:Tokens.fonts.mono,fontSize:26,fontWeight:400} as const;

export function RoadmapBoot(){
 const ms=useStageMs(),plan=usePlan();
 const cues=ITEMS.map(item=>lookupCue(plan.cues,item.cue));
 const bootAt=lookupCue(plan.cues,'item11'),endAt=lookupCue(plan.cues,'roadmapEnd');
 const sweepStart=(i:number)=>bootAt+i*(SWEEP_MS/(rail.length-1));
 const lights=(rail as any[]).map((_,i)=>{
  const own=ITEMS.findIndex(item=>item.panel===i);
  const sweep=cubicOut(progress(ms,sweepStart(i),sweepStart(i)+SWEEP_FADE_MS));
  const named=own>=0?cubicOut(progress(ms,cues[own],cues[own]+PANEL_MS)):0;
  return round(DIM+(1-DIM)*Math.max(sweep,named));
 });
 const mapOpacity=round(MAP_DIM+(1-MAP_DIM)*cubicOut(progress(ms,bootAt,bootAt+BOOT_MS)));
 const collapse=cubicInOut(progress(ms,endAt,endAt+COLLAPSE_MS));
 const currentLine=cues.reduce((acc,at,i)=>ms>=at?i:acc,-1);
 return <div style={{position:'absolute',inset:0,width:1920,height:1080,background:color('color/bg/field')}}>
  <Dashboard world empty dim={DIM} lights={lights} mapOpacity={mapOpacity}/>
  <svg data-roadmap-wires="overlay" width={1920} height={1080} style={{position:'absolute',inset:0,pointerEvents:'none'}}>
   {ITEMS.map((item,i)=>{
    const wire=wireFor(item,i);
    if(!wire) return null;
    const start=cues[i]+TYPE_MS,holdEnd=start+WIRE_DRAW_MS+WIRE_HOLD_MS;
    const draw=progress(ms,start,start+WIRE_DRAW_MS),fade=1-progress(ms,holdEnd,holdEnd+WIRE_FADE_MS);
    if(draw<=0||fade<=0) return null;
    return <path key={item.cue} data-roadmap-wire={item.cue} d={`M${round(wire.x1)} ${round(wire.y1)} L${round(wire.x2)} ${round(wire.y2)}`} fill="none" stroke={color('color/fill/gold')} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={round(1-draw)} opacity={round(fade)}/>;
   })}
   {ITEMS.map((item,i)=>{
    if(item.pulse===undefined) return null;
    const p=progress(ms,cues[i]+TYPE_MS,cues[i]+TYPE_MS+PULSE_MS);
    if(p<=0||p>=1) return null;
    const r=panelRect(item.pulse),pad=round(3+5*Math.sin(Math.PI*p));
    return <rect key={item.cue} data-engine-pulse={item.cue} x={r.x-pad} y={r.y-pad} width={r.w+2*pad} height={r.h+2*pad} rx={8} fill="none" stroke={color('color/fill/gold')} strokeWidth={2.5} opacity={round(Math.sin(Math.PI*p))}/>;
   })}
  </svg>
  <div data-roadmap-console="box" style={{position:'absolute',left:CONSOLE.x,top:CONSOLE.y,width:CONSOLE.w,height:CONSOLE.h,background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`,borderRadius:8,padding:PAD,boxSizing:'border-box',pointerEvents:'none',opacity:round(1-collapse),transform:`translateY(${round(-60*collapse)}px) scale(${round(1-.92*collapse)})`,transformOrigin:'50% 0%'}}>
   <div style={{height:HEADER_H,boxSizing:'border-box'}}>
    <div style={{fontFamily:Tokens.fonts.mono,fontSize:22,fontWeight:500,letterSpacing:3,lineHeight:'30px',color:color('color/text/muted')}}>EPISODE 1 · ROADMAP</div>
    <div style={{height:1,marginTop:12,background:color('color/line/hairline')}}/>
   </div>
   {ITEMS.map((item,i)=>{
    if(ms<cues[i]) return null;
    const index=String(i+1).padStart(2,'0'),full=index.length+item.label.length;
    const n=Math.floor(progress(ms,cues[i],cues[i]+TYPE_MS)*full),done=n>=full;
    const colour=i===currentLine?'color/text/primary':'color/text/soft';
    return <div key={item.cue} data-roadmap-line={item.cue} style={{display:'flex',alignItems:'center',height:LINE_H}}>
     <span style={{width:12,height:12,flex:'0 0 auto',border:`1.5px solid ${color('color/line/hairline-strong')}`,borderRadius:2,background:done?color('color/fill/gold'):'transparent',marginRight:16}}/>
     <span style={{...mono26,color:color('color/text/dim'),marginRight:18}}>{index.slice(0,Math.min(n,index.length))}</span>
     <span style={{...mono26,color:color(colour)}}>{n>index.length?item.label.slice(0,n-index.length):''}</span>
     {item.tag&&done&&<span style={{fontFamily:Tokens.fonts.mono,fontSize:16,fontWeight:500,letterSpacing:1.5,color:color('color/marker/race'),border:`1px solid ${color('color/marker/race')}`,borderRadius:3,padding:'1px 7px',marginLeft:14}}>{item.tag}</span>}
    </div>;
   })}
  </div>
 </div>;
}
