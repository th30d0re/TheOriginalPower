import React from 'react';
import {color} from '../../tokens';

export type Box={x:number;y:number;w:number;h:number};
export type Point=readonly [number,number];
const round=(value:number)=>Math.round(value*10)/10;
export const boxData=(box:Box)=>`${round(box.x)} ${round(box.y)} ${round(box.w)} ${round(box.h)}`;
export const textAttrs=(id:string,box:Box,fit?:{size:number;ls?:number;lh?:number;sans?:boolean})=>({'data-text':id,'data-box':boxData(box),...(fit?{'data-fit':`${fit.sans?'sans':'mono'} ${fit.size} ${fit.ls??0} ${fit.lh??1.25}`}: {})});
export const shapeAttrs=(id:string,box:Box,role:'frame'|'mark'='mark',layer?:string)=>({'data-shape':id,'data-role':role,'data-box':boxData(box),...(layer?{'data-layer':layer}: {})});
export const lineAttrs=(id:string,points:readonly Point[],pad=2)=>{const xs=points.map(([x])=>x),ys=points.map(([,y])=>y);const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;return {'data-shape':id,'data-role':'line','data-box':boxData({x:x-pad,y:y-pad,w:w+2*pad,h:h+2*pad}),'data-points':points.map(([px,py])=>`${round(px)},${round(py)}`).join(' ')};};
export const pathFrom=(points:readonly Point[])=>points.map(([x,y],index)=>`${index?'L':'M'}${round(x)} ${round(y)}`).join(' ');

export function Label({id,box,children,size=20,weight=500,ls=0,lh=1.25,sans=false,align='left',ink,opacity=1,style}:{id:string;box:Box;children:React.ReactNode;size?:number;weight?:number;ls?:number;lh?:number;sans?:boolean;align?:'left'|'center'|'right';ink?:string;opacity?:number;style?:React.CSSProperties}){
  return <div {...textAttrs(id,box,{size,ls,lh,sans})} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',font:`${weight} ${size}px "${sans?'IBM Plex Sans':'IBM Plex Mono'}"`,letterSpacing:ls,lineHeight:lh,textAlign:align,color:ink??color('color/text/primary'),opacity,...style}}>{children}</div>;
}
export function Panel({id,box,opacity=1,accent='color/line/hairline',style}:{id:string;box:Box;opacity?:number;accent?:string;style?:React.CSSProperties}){
  return <div {...shapeAttrs(id,box,'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',overflow:'hidden',background:color('color/fill/panel-render'),border:`1px solid ${color(accent)}`,opacity,...style}}/>;
}
export function SceneSource({text,opacity=1}:{text:string;opacity?:number}){
  return <Label id="source" box={{x:116,y:968,w:740,h:30}} size={20} weight={400} ls={.35} lh={1.35} opacity={opacity} ink={color('color/text/muted')}>{text}</Label>;
}
