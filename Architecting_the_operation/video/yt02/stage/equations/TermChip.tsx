import React from 'react';
import {ColoredTerm, type EquationBox} from './EquationTerms';
import {EQUATION_TERMS, type EquationTermId} from './terms';

export function TermChip({term,ms,pulses=[],box,opacity=1}:{term:EquationTermId;ms:number;pulses?:readonly number[];box:EquationBox;opacity?:number}) {
  const symbolBox={x:box.x+14,y:box.y+8,w:Math.min(116,box.w*.34),h:box.h-16};
  const meaningBox={x:symbolBox.x+symbolBox.w+12,y:box.y+9,w:box.w-symbolBox.w-40,h:box.h-18};
  const registry=EQUATION_TERMS[term];
  return <div data-term-chip={term} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',border:'1px solid rgba(129,142,154,0.38)',background:'rgba(11,24,38,0.72)',opacity}}>
    {/* The chip names the symbol itself, so the subscript i shows at full size. */}
    <ColoredTerm term={term} ms={ms} pulses={pulses} box={symbolBox} math={term==='i'?'i':undefined} style={{position:'absolute',left:14,top:8,width:symbolBox.w,height:symbolBox.h,display:'grid',placeItems:'center',font:'600 23px "IBM Plex Mono"'}}/>
    <span data-text={`term-chip-meaning-${term}`} data-box={`${meaningBox.x} ${meaningBox.y} ${meaningBox.w} ${meaningBox.h}`} style={{position:'absolute',left:symbolBox.w+26,top:9,width:meaningBox.w,height:meaningBox.h,display:'flex',alignItems:'center',font:'400 18px "IBM Plex Sans"',lineHeight:1.15,color:'rgba(220,226,232,0.82)'}}>{registry.meaning}</span>
  </div>;
}
