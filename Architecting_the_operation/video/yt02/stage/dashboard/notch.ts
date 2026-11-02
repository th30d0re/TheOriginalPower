// The five-tier notch in the card border, and its collapse/expand at map show/hide boundaries.
import {cubicInOut,cubicOut,progress,usePlan,useStageMs,type Segment} from '@stage';

// Scenes that show the world map; the border's notch is collapsed while they are on screen.
export const MAP_SCENES=new Set(['DashboardBoot','Dashboard1486','RoadmapBoot']);
export const NOTCH_MS=900;

// Geometry from tools/svg_to_tsx.mjs: the pre-Stage notch scaled 0.8, wire at y0, dir +1 down / -1 up.
const CX=960,KINK=62.4,APEX=10.7,DEPTH=48,BARS:[number,number][]=[[7.8,40.9],[17.4,32.8],[27,24.9],[36.6,16.9]];
const r=(n:number)=>+n.toFixed(2);

// p = 1 is the full notch; p = 0 is a straight wire. The V dips first, then the bars grow base first.
export function notchPath(y0:number,dir:number,p:number):string {
 const a=cubicInOut(progress(p,0,.55)),y=(d:number)=>r(y0+dir*d*a);
 let d=`M786.059 ${y0}H${r(CX-KINK)}L${r(CX-APEX*a)} ${y(DEPTH)}M${r(CX+APEX*a)} ${y(DEPTH)}L${r(CX+KINK)} ${y0}H1133.94`;
 BARS.forEach(([dy,h],i)=>{const b=cubicOut(progress(p,.44+.12*i,.64+.12*i));if(b>0)d+=`M${r(CX-h*b)} ${y(dy)}H${r(CX+h*b)}`;});
 return d;
}

// Notch state for a segment: animates over its first NOTCH_MS when the previous segment crosses the
// map/no-map boundary, otherwise holds (1 without the map, 0 with it).
export function useNotch(segment:Segment):number {
 const ms=useStageMs(),plan=usePlan();
 const map=MAP_SCENES.has(segment.scene);
 const i=plan.segments.findIndex(s=>s.instance===segment.instance&&s.start_ms===segment.start_ms);
 const prev=i>0?plan.segments[i-1]:undefined;
 if(!prev||MAP_SCENES.has(prev.scene)===map)return map?0:1;
 const t=progress(ms,segment.start_ms,segment.start_ms+NOTCH_MS);
 return map?1-t:t;
}
