import React from 'react';
import layout from '../handoff/layout.json';
import {color,Tokens} from '../tokens';
export function EraStrip({activeLog=2,empty=false}:{activeLog?:number;empty?:boolean}) {
 const strip=layout.frames['dash 1486 · compact'].eraStrip, index=[2,3,5,9,14,15,17].indexOf(activeLog),cx=strip.labels[index]?.cellCentreX;
 return <svg width={1920} height={84} style={{position:'absolute',inset:0}}><path d={`M60 76 H1860 ${Array.from({length:113},(_,i)=>`M${60+16*i} 71 V76`).join(' ')} ${strip.labels.map(l=>`M${l.cellCentreX} 65 V76`).join(' ')}`} fill="none" stroke={color('color/line/hairline-strong')} strokeWidth={1}/>{!empty&&<>{strip.labels.map((l,i)=><text key={i} x={l.x} y={l.y+15} fontFamily={Tokens.fonts.mono} fontSize={15} letterSpacing={.8} fontWeight={i===index?500:400} fill={color(i===index?'color/text/primary':'color/text/faint')}>{l.text}</text>)}{cx!==undefined&&<><rect x={cx-1.5} y={64} width={3} height={14} fill={color('color/fill/gold')}/><circle cx={cx} cy={77} r={5} fill={color('color/fill/gold')}/></>}</>}</svg>;
}
