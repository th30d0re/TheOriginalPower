import React from 'react';
import {DrawRect} from '@stage';
import {color} from '../tokens';

// Shared minute-two geometry: the slim numbered entry rail on the left (turns 7–9, and the
// opening state of turn 10) and the main sense card on the right. Exported so
// tools/check_minute_two.tsx asserts the same geometry the scenes render.
export const RAIL = {x:120, w:300, labelY:148, slotY:[296,440,584], slotH:118} as const;
export const CARD = {x:480, y:210, w:1320, h:730} as const;

export const RAIL_LABEL_LINES = ['Typical dictionary senses', '(paraphrased)'] as const;

export const SLOT_CONTENT = [
  {num:1, label:'individual prejudice', unit:'one person'},
  {num:2, label:'ideological belief', unit:'a belief'},
  {num:3, label:'systemic practices', unit:'a system'},
] as const;

export type RailSlotSpec = {
  state:'placeholder'|'dashed'|'dim'|'lit';
  unitP?:number;     // unit-tag entrance progress 0..1; undefined = hidden
  solidify?:number;  // dashed → lit blend 0..1 (turn 9 slot 3); default follows state
};

const STATE_OPACITY = {placeholder:.45, dashed:.45, dim:.75, lit:1} as const;

export function RailSlotContent({index, unitP=0}: {index:number; unitP?:number}) {
  const slot = SLOT_CONTENT[index];
  return <>
    <span style={{position:'absolute', left:18, top:13, font:'500 24px "IBM Plex Mono"', color:'inherit'}}>{slot.num}</span>
    <span style={{position:'absolute', left:18, top:47, fontSize:26, color:color('color/text/primary')}}>{slot.label}</span>
    {unitP>0 && <span data-rail-unit={slot.unit} style={{position:'absolute', left:18, bottom:11, font:'400 20px "IBM Plex Mono"', color:color('color/text/muted'), opacity:unitP}}>{slot.unit}</span>}
  </>;
}

export function RailSlot({index, spec}: {index:number; spec:RailSlotSpec}) {
  const s = spec.solidify ?? (spec.state==='dashed' ? 0 : 1);
  const op = spec.solidify!==undefined ? .45+.55*spec.solidify : STATE_OPACITY[spec.state];
  const gold = spec.state==='lit' || spec.state==='dim' || s>.5;
  const rule = (spec.state==='placeholder' ? 0 : 1) * s;
  return <div data-rail-slot={index+1} data-rail-state={spec.state} style={{position:'absolute', inset:0, opacity:op, background:color('color/fill/panel-render'), color:gold?color('color/fill/gold'):color('color/text/dim')}}>
    <div aria-hidden="true" style={{position:'absolute', inset:0, opacity:s}}><DrawRect box={{x:0,y:0,w:RAIL.w,h:RAIL.slotH}} progress={s} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" strokeWidth={1} seed={31+index}/></div>
    {s<1 && <div aria-hidden="true" style={{position:'absolute', inset:0, opacity:1-s, backgroundImage:`repeating-linear-gradient(90deg, ${color('color/line/hairline')} 0 5px, transparent 5px 9px), repeating-linear-gradient(90deg, ${color('color/line/hairline')} 0 5px, transparent 5px 9px), repeating-linear-gradient(0deg, ${color('color/line/hairline')} 0 5px, transparent 5px 9px), repeating-linear-gradient(0deg, ${color('color/line/hairline')} 0 5px, transparent 5px 9px)`, backgroundSize:'100% 1px, 100% 1px, 1px 100%, 1px 100%', backgroundPosition:'top, bottom, left, right', backgroundRepeat:'no-repeat'}}/>}
    {rule>0 && <span aria-hidden="true" style={{position:'absolute', left:0, top:8, bottom:8, width:4, background:color('color/fill/gold'), transform:`scaleY(${rule})`, transformOrigin:'center top'}}/>}
    {spec.state==='placeholder'
      ? <>
          <span style={{position:'absolute', left:18, top:13, font:'500 24px "IBM Plex Mono"'}}>{SLOT_CONTENT[index].num}</span>
          <span data-rail-placeholder={index+1} aria-hidden="true" style={{position:'absolute', left:18, top:58, width:150, height:3, background:color('color/line/chart-faint')}}/>
        </>
      : <RailSlotContent index={index} unitP={spec.unitP}/>}
  </div>;
}

export function EntryRail({slots, enter}: {slots:[RailSlotSpec,RailSlotSpec,RailSlotSpec]; enter:number}) {
  return <div data-entry-rail="true" style={{position:'absolute', left:RAIL.x, top:0, width:RAIL.w, height:1080, opacity:enter, transform:`translateY(${16*(1-enter)}px)`}}>
    <div style={{position:'absolute', left:0, top:RAIL.labelY, font:'400 20px "IBM Plex Mono"', lineHeight:1.4, color:color('color/text/muted')}}>
      {RAIL_LABEL_LINES.map(line => <div key={line}>{line}</div>)}
    </div>
    {slots.map((spec, i) => <div key={i} style={{position:'absolute', left:0, top:RAIL.slotY[i], width:RAIL.w, height:RAIL.slotH}}>
      <RailSlot index={i} spec={spec}/>
    </div>)}
  </div>;
}

// Main card frame for turns 7–9. `dashed` blends the border and contents-holding frame
// from the dashed "when included at all" state (turn 9 opening) to the solid lit state.
export function SenseCard({title, enter, dashed=0, children}: React.PropsWithChildren<{title:string; enter:number; dashed?:number}>) {
  return <div data-sense-card={title} data-card-border={dashed>.5?'dashed':'solid'} style={{position:'absolute', left:CARD.x, top:CARD.y, width:CARD.w, height:CARD.h, opacity:enter, background:color('color/fill/panel-render'), boxShadow:`inset 0 0 0 1px ${color('color/fill/panel-wash')}`}}>
    <div aria-hidden="true" style={{position:'absolute', inset:0, opacity:1-dashed}}><DrawRect box={{x:0,y:0,w:CARD.w,h:CARD.h}} progress={enter} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" strokeWidth={1} seed={71}/></div>
    {dashed>0 && <div aria-hidden="true" style={{position:'absolute', inset:0, opacity:dashed, backgroundImage:`repeating-linear-gradient(90deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px), repeating-linear-gradient(90deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px), repeating-linear-gradient(0deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px), repeating-linear-gradient(0deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px)`, backgroundSize:'100% 1px, 100% 1px, 1px 100%, 1px 100%', backgroundPosition:'top, bottom, left, right', backgroundRepeat:'no-repeat'}}/>}
    <div style={{position:'absolute', left:40, top:32, fontSize:48, fontWeight:500, color:color('color/text/primary'), zIndex:1}}>{title}</div>
    {children}
  </div>;
}
