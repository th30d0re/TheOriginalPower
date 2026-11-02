import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));

// Entry panel geometry, panel-relative slot rows. Exported for tools/check_minute_two.tsx.
export const ENTRY_OPEN_LAYOUT = {
  headerX:150, headerY:120,
  panelX:330, panelY:295, panelW:1260, panelH:640,
  slotX:32, slotW:1196, slotH:96,
  slotY:[118,232,346],
  slot3BottomY:512,
} as const;
const SLOT3_SLIDE = ENTRY_OPEN_LAYOUT.slot3BottomY - ENTRY_OPEN_LAYOUT.slotY[2];

function EntrySlot({index, enterP, children}: React.PropsWithChildren<{index:number; enterP:number; children?:React.ReactNode}>) {
  const L = ENTRY_OPEN_LAYOUT;
  return <div data-entry-slot={index+1} style={{position:'absolute', left:L.slotX, top:L.slotY[index], width:L.slotW, height:L.slotH, opacity:enterP, transform:`translateY(${-16*(1-enterP)}px)`, background:color('color/fill/panel-wash')}}>
    <span aria-hidden="true" style={{position:'absolute', inset:0, border:`1px solid ${color('color/line/hairline')}`}}/>
    <span style={{position:'absolute', left:24, top:31, font:'500 28px "IBM Plex Mono"', color:color('color/text/dim')}}>{index+1}</span>
    {children}
  </div>;
}

export function EntryOpen({segment}:SceneProps) {
  const ms = useStageMs();
  const t6Why = useCue('t6Why'), t6Open = useCue('t6Open'), t6Numbered = useCue('t6Numbered'), t6Begin = useCue('t6Begin');
  const t6Individual = useCue('t6Individual'), t6Systemic = useCue('t6Systemic'), t6Bottom = useCue('t6Bottom'), t6Includes = useCue('t6Includes');
  const whyP = enter(ms, t6Why.at, 500);
  const openP = enter(ms, t6Open.at, 500);
  const slotEnter = [0,1,2].map(i => enter(ms, t6Numbered.at + i*130, 380));
  const fill1 = enter(ms, t6Begin.at, 380);
  const gold1 = enter(ms, t6Individual.at, 420);
  const fill3 = enter(ms, t6Systemic.at, 380);
  const bottomP = enter(ms, t6Bottom.at, 500);
  const includesP = enter(ms, t6Includes.at, 400);
  const slot3Phase = includesP>0 ? 'included' : bottomP>0 ? 'bottom' : fill3>0 ? 'filled' : 'empty';
  const L = ENTRY_OPEN_LAYOUT;
  return <div data-scene="EntryOpen" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    {ms >= t6Why.at && <div style={{position:'absolute', left:L.headerX, top:L.headerY, opacity:whyP, transform:`translateY(${18*(1-whyP)}px)`, fontSize:46, fontWeight:500}}>Why does the dictionary list individual prejudice first?</div>}
    {ms >= t6Open.at && <div data-entry-panel="true" style={{position:'absolute', left:L.panelX, top:L.panelY, width:L.panelW, height:L.panelH, background:color('color/fill/panel-render'), border:`1px solid ${color('color/line/hairline')}`, boxShadow:`inset 0 0 0 1px ${color('color/fill/panel-wash')}`, transform:`scaleX(${openP})`, transformOrigin:'left center'}}>
      <div style={{position:'absolute', left:32, right:32, top:28, display:'flex', alignItems:'baseline'}}>
        <strong style={{fontSize:48, letterSpacing:.5}}>rac·ism</strong>
        <em style={{marginLeft:18, fontSize:25, color:color('color/text/muted')}}>(noun)</em>
        <span style={{marginLeft:'auto', font:'400 20px "IBM Plex Mono"', color:color('color/text/muted')}}>Typical dictionary senses (paraphrased)</span>
      </div>
      {slotEnter[0]>0 && <EntrySlot index={0} enterP={slotEnter[0]}>
        {ms >= t6Begin.at && <span style={{position:'absolute', left:76, top:32, fontSize:30, opacity:fill1}}>individual prejudice or discrimination</span>}
        <span aria-hidden="true" style={{position:'absolute', left:0, top:8, bottom:8, width:4, background:color('color/fill/gold'), transform:`scaleY(${gold1})`, transformOrigin:'center top'}}/>
        <span style={{position:'absolute', left:24, top:31, font:'500 28px "IBM Plex Mono"', color:color('color/fill/gold'), opacity:gold1}}>1</span>
      </EntrySlot>}
      {slotEnter[1]>0 && <EntrySlot index={1} enterP={slotEnter[1]}>
        {bottomP>0 && <span data-slot2-placeholder="true" aria-hidden="true" style={{position:'absolute', left:76, top:47, width:420, height:3, background:color('color/line/chart-faint'), opacity:bottomP}}/>}
      </EntrySlot>}
      {slotEnter[2]>0 && <div data-entry-slot="3" data-slot3-phase={slot3Phase} style={{position:'absolute', left:L.slotX, top:L.slotY[2], width:L.slotW, height:L.slotH, opacity:slotEnter[2]*(1 - bottomP*.38 - includesP*.22), transform:`translateY(${-16*(1-slotEnter[2]) + SLOT3_SLIDE*bottomP}px)`, background:color('color/fill/panel-wash')}}>
        <span aria-hidden="true" style={{position:'absolute', inset:0, border:`1px solid ${color('color/line/hairline')}`, opacity:1-includesP}}/>
        <span aria-hidden="true" style={{position:'absolute', inset:0, border:`1px dashed ${color('color/line/hairline')}`, opacity:includesP}}/>
        <span style={{position:'absolute', left:24, top:31, font:'500 28px "IBM Plex Mono"', color:color('color/text/dim')}}>3</span>
        {ms >= t6Systemic.at && <span style={{position:'absolute', left:76, top:32, fontSize:30, opacity:fill3}}>systemic racism
          {ms >= t6Includes.at && <span style={{marginLeft:12, padding:'4px 9px', border:`1px solid ${color('color/line/hairline')}`, font:'500 20px "IBM Plex Mono"', color:color('color/text/muted'), whiteSpace:'nowrap', opacity:includesP}}>when included at all</span>}
        </span>}
      </div>}
    </div>}
  </div>;
}
