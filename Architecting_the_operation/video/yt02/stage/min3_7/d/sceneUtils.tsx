import React from 'react';
import {cubicOut, progress} from '@stage';
import {color} from '../../tokens';

export type LayoutBox = {x:number;y:number;w:number;h:number};
export type Point = readonly [number, number];

export const clamp = (value:number) => Math.max(0, Math.min(1, value));
export const enter = (ms:number, at:number, duration=500) => cubicOut(progress(ms, at, at+duration));
/** Fade out over [at, at+duration]: 1 before, 0 after. */
export const leave = (ms:number, at:number, duration=320) => 1-cubicOut(progress(ms, at, at+duration));
export const mix = (a:number, b:number, t:number) => a+(b-a)*t;
export const mixBox = (a:LayoutBox, b:LayoutBox, t:number):LayoutBox => ({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),w:mix(a.w,b.w,t),h:mix(a.h,b.h,t)});

// ----- layout-audit annotations (see tools/layout_audit.ts) -----
const round = (value:number) => Math.round(value*10)/10;
export const boxData = (box:LayoutBox) => `${round(box.x)} ${round(box.y)} ${round(box.w)} ${round(box.h)}`;
export const boundsOf = (points:readonly Point[]):LayoutBox => {
  const xs=points.map(point=>point[0]), ys=points.map(point=>point[1]);
  const x=Math.min(...xs), y=Math.min(...ys);
  return {x, y, w:Math.max(...xs)-x, h:Math.max(...ys)-y};
};
export type Fit = {size:number;ls?:number;lh?:number;sans?:boolean};
export const textAttrs = (id:string, box:LayoutBox, fit?:Fit) => ({
  'data-text':id, 'data-box':boxData(box),
  ...(fit?{'data-fit':`${fit.sans?'sans':'mono'} ${fit.size} ${fit.ls??0} ${fit.lh??1.25}`}:{}),
});
export const shapeAttrs = (id:string, box:LayoutBox, role:'frame'|'mark'='mark', layer?:string) => ({
  'data-shape':id, 'data-role':role, 'data-box':boxData(box), ...(layer?{'data-layer':layer}:{}),
});
export const lineAttrs = (id:string, points:readonly Point[], pad=2) => {
  const bounds=boundsOf(points);
  return {'data-shape':id, 'data-role':'line', 'data-box':boxData({x:bounds.x-pad,y:bounds.y-pad,w:bounds.w+2*pad,h:bounds.h+2*pad}), 'data-points':points.map(([x,y])=>`${round(x)},${round(y)}`).join(' ')};
};
export const pathFrom = (points:readonly Point[]) => points.map(([x,y],index)=>`${index?'L':'M'}${round(x)} ${round(y)}`).join(' ');

/** An absolutely positioned text box whose audit box and fit estimate come from the same values that style it. */
export function Label({id, box, children, size=20, weight=600, ls=1, lh=1.25, sans=false, align='left', ink, opacity=1, style}:{
  id:string; box:LayoutBox; children:React.ReactNode; size?:number; weight?:number; ls?:number; lh?:number; sans?:boolean;
  align?:'left'|'center'|'right'; ink?:string; opacity?:number; style?:React.CSSProperties;
}) {
  return <div {...textAttrs(id, box, {size, ls, lh, sans})} style={{position:'absolute', left:box.x, top:box.y, width:box.w, height:box.h, boxSizing:'border-box', font:`${weight} ${size}px "${sans?'IBM Plex Sans':'IBM Plex Mono'}"`, letterSpacing:ls, lineHeight:lh, textAlign:align, color:ink??color('color/text/primary'), opacity, ...style}}>{children}</div>;
}

export function FadeIn({ms, at, duration=500, children, style, dataBeat}:{ms:number;at:number;duration?:number;children:React.ReactNode;style?:React.CSSProperties;dataBeat?:string}) {
  if (ms < at) return null;
  const p=enter(ms,at,duration);
  return <div data-beat={dataBeat} style={{opacity:p,...style}}>{children}</div>;
}

export function Panel({box, id, children, accent=false, style, dataPanel}:{box:LayoutBox;id?:string;children?:React.ReactNode;accent?:boolean;style?:React.CSSProperties;dataPanel?:string}) {
  return <div data-panel={dataPanel} {...shapeAttrs(id??dataPanel??'panel', box, 'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',overflow:'hidden',background:color('color/fill/panel-render'),border:`1px solid ${accent?color('color/line/hairline-strong'):color('color/line/hairline')}`,...style}}>{children}</div>;
}

export const MINI_NETWORK_LAYERS = [3,4,4,3] as const;
export function miniNetworkPoints(x:number,y:number,w:number,h:number) {
  return MINI_NETWORK_LAYERS.map((count,layer)=>Array.from({length:count},(_,index)=>({x:x+layer*w/(MINI_NETWORK_LAYERS.length-1),y:y+(index+1)*h/(count+1)})));
}
/** Line-art network. Its audit box is the node hull plus the node radius. */
export function MiniNetwork({id='network',x,y,w,h,progress:rawProgress=1,hot=false,opacity=1}:{id?:string;x:number;y:number;w:number;h:number;progress?:number;hot?:boolean;opacity?:number}) {
  const p=clamp(rawProgress), points=miniNetworkPoints(x,y,w,h), r=7+3*p;
  const ys=points.flat().map(point=>point.y);
  const hull={x:x-r-2,y:Math.min(...ys)-r-2,w:w+2*r+4,h:Math.max(...ys)-Math.min(...ys)+2*r+4};
  return <svg {...shapeAttrs(id, hull, 'mark', 'network')} width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none',opacity}} aria-hidden="true">
    {points.slice(0,-1).flatMap((layer,li)=>layer.flatMap((a,ai)=>points[li+1].map((b,bi)=><line key={`${li}-${ai}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hot?color('color/fill/gold'):color('color/line/wire')} strokeWidth={hot?2.6:1.5} strokeOpacity={p*(hot?.72:.4)}/>)))}
    {points.flatMap((layer,li)=>layer.map((point,index)=><circle key={`${li}-${index}`} cx={point.x} cy={point.y} r={r} fill={color('color/bg/field')} stroke={li/(MINI_NETWORK_LAYERS.length-1)<p?color('color/fill/gold'):color('color/line/hairline')} strokeWidth="2"/>))}
  </svg>;
}

/** Gaussian curve points on a lane: `height` px tall at the mean, `precision` in unit-interval coordinates. */
export function gaussianPoints(left:number,right:number,axisY:number,height:number,mean:number,precision:number,samples=60):Point[] {
  return Array.from({length:samples+1},(_,index)=>{
    const u=index/samples;
    return [left+u*(right-left), axisY-Math.exp(-.5*precision*(u-mean)*(u-mean))*height] as const;
  });
}

export const CURVE_LANE = {precision:34, labelHeight:30} as const;
/** Prior or evidence lane: label row on top, Gaussian curve below it. */
export function CurveLane({id, box, mean, label, labelW, progress:rawProgress, tone='gold', opacity=1}:{id:string;box:LayoutBox;mean:number;label:string;labelW?:number;progress:number;tone?:'gold'|'red';opacity?:number}) {
  const p=clamp(rawProgress), axisY=box.y+box.h-24, left=box.x+24, right=box.x+box.w-24;
  const top=box.y+CURVE_LANE.labelHeight+20, points=gaussianPoints(left,right,axisY,axisY-top,mean,CURVE_LANE.precision);
  const ink=tone==='red'?color('color/marker/race'):color('color/fill/gold');
  return <div data-curve-lane={id} style={{opacity}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}} aria-hidden="true">
      <line {...lineAttrs(`${id}-axis`,[[left,axisY],[right,axisY]])} x1={left} y1={axisY} x2={right} y2={axisY} stroke={color('color/line/hairline')} strokeWidth="1.5" opacity={p}/>
      <path {...lineAttrs(`${id}-curve`,points)} data-lane-mean={mean.toFixed(4)} d={pathFrom(points)} fill="none" stroke={ink} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
    </svg>
    <Label id={`${id}-label`} box={{x:box.x+24,y:box.y,w:labelW??box.w-48,h:CURVE_LANE.labelHeight}} size={20} weight={500} ls={1} ink={ink} opacity={p}>{label}</Label>
  </div>;
}

/** The source line at its audited position: inside the safe area and clear of the bottom notch. */
export const SOURCE_BOX = {x:116,y:968,w:740,h:30} as const;
export function SceneSource({text, opacity=1}:{text:string;opacity?:number}) {
  return <Label id="source" box={SOURCE_BOX} size={20} weight={400} ls={.35} lh={1.35} ink={color('color/text/muted')} opacity={opacity}>{text}</Label>;
}
