import React from 'react';
import {MathText, cubicInOut, progress} from '@stage';
import {equationColor} from './palette';
import {EQUATION_TERMS, type EquationTermId} from './terms';

export type EquationBox = {x:number; y:number; w:number; h:number};
export type EquationPulseMap = Partial<Record<EquationTermId, readonly number[]>>;
export type EquationToken =
  | {term:EquationTermId; width?:number; display?:string; math?:string; revealAt?:number}
  | {text:string; width?:number; revealAt?:number};

const round=(value:number)=>Math.round(value*1000)/1000;

// IBM Plex Mono advances every glyph by 0.6 em, and MathText sets subscripts at 0.7 em, so a
// token's width follows from its characters. Hand-set widths drifted and overprinted neighbours.
const MONO_ADVANCE=.6, SUB_SCALE=.7;
function mathEms(math:string) {
  let ems=0;
  for(let i=0;i<math.length;i++){
    if(math[i]!=='_'){ems+=MONO_ADVANCE;continue;}
    // Π falls back to a wider face, so a braced subscript gets 0.3 em of air before the next glyph.
    if(math[i+1]==='{'){const close=math.indexOf('}',i);ems+=(close-i-2)*MONO_ADVANCE*SUB_SCALE+.3;i=close;}
    else{ems+=MONO_ADVANCE*SUB_SCALE;i++;}
  }
  return ems;
}
export function tokenWidth(token:EquationToken,fontSize:number) {
  if('text' in token)return token.text.length*MONO_ADVANCE*fontSize;
  const registry=EQUATION_TERMS[token.term];
  const math=token.math??('math' in registry?registry.math:undefined);
  return (math?mathEms(math):(token.display??registry.show).length*MONO_ADVANCE)*fontSize;
}

// Single symbols swell on their cue. Multi-word terms sit inside running text, so they glow
// without scaling and never grow into the next word.
export const pulseScaleAmplitude=(term:EquationTermId)=>EQUATION_TERMS[term].show.length>6?0:.12;
const boxData=(box:EquationBox)=>`${round(box.x)} ${round(box.y)} ${round(box.w)} ${round(box.h)}`;

export function pulseStrength(ms:number,cues:readonly number[] = []) {
  let strongest=0;
  for(const cue of cues){
    const elapsed=ms-cue;
    if(elapsed<0||elapsed>600)continue;
    const strength=elapsed<=200
      ? cubicInOut(progress(elapsed,0,200))
      : 1-cubicInOut(progress(elapsed,200,600));
    strongest=Math.max(strongest,strength);
  }
  return strongest;
}

export function ColoredTerm({term,ms,pulses=[],box,display,math,style,className}:{
  term:EquationTermId;ms:number;pulses?:readonly number[];box:EquationBox;display?:string;math?:string;
  style?:React.CSSProperties;className?:string;
}) {
  const registry=EQUATION_TERMS[term], pulse=pulseStrength(ms,pulses), ink=equationColor(registry.slot);
  const value=math??('math' in registry?registry.math:undefined);
  const scale=(1+pulseScaleAmplitude(term)*pulse).toFixed(4);
  return <span
    className={className}
    data-term={term}
    data-text={`equation-term-${term}`}
    data-box={boxData(box)}
    data-term-color={ink}
    data-pulse={pulse.toFixed(4)}
    data-scale={scale}
    style={{display:'inline-block',color:ink,transform:`scale(${scale})`,transformOrigin:'center',textShadow:pulse>0?`0 0 ${round(18*pulse)}px ${ink}`:undefined,...style}}
  >{value?<MathText text={value}/>:display??registry.show}</span>;
}

export function EquationTerms({tokens,pulses,ms,box,fontSize=32,lineHeight=1.2,weight=500,align='left',equation,style}:{
  tokens:readonly EquationToken[];pulses:EquationPulseMap;ms:number;box:EquationBox;fontSize?:number;lineHeight?:number;
  weight?:number;align?:'left'|'center'|'right';equation:string;style?:React.CSSProperties;
}) {
  const widths=tokens.map(token=>tokenWidth(token,fontSize));
  const total=widths.reduce((sum,width)=>sum+width,0);
  const start=align==='center'?box.x+(box.w-total)/2:align==='right'?box.x+box.w-total:box.x;
  let x=start;
  return <div data-equation={equation} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,display:'flex',justifyContent:align==='center'?'center':align==='right'?'flex-end':'flex-start',alignItems:'center',font:`${weight} ${fontSize}px "IBM Plex Mono"`,lineHeight,color:'inherit',whiteSpace:'pre',...style}}>
    {tokens.map((token,index)=>{
      const width=widths[index];
      const tokenBox={x,y:box.y,w:width,h:box.h};
      x+=width;
      const opacity=token.revealAt===undefined?1:cubicInOut(progress(ms,token.revealAt,token.revealAt+460));
      if('term' in token)return <ColoredTerm key={`${token.term}-${index}`} term={token.term} ms={ms} pulses={pulses[token.term]} box={tokenBox} display={token.display} math={token.math} style={{width,flex:'none',opacity}}/>;
      return <span key={`plain-${index}`} style={{display:'inline-block',width,flex:'none',opacity}}>{token.text}</span>;
    })}
  </div>;
}
