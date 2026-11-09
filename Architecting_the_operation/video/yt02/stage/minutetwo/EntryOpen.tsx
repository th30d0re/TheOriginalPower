import React from 'react';
import {DrawRect, FitBox, Flicker, KitSound, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));
const cueFrame = (ms:number) => Math.round(ms * 30 / 1000);
const frames = (ms:number) => Math.round(ms * 30 / 1000);

// Entry panel geometry, panel-relative slot rows. Exported for tools/check_minute_two.tsx.
export const ENTRY_OPEN_LAYOUT = {
  headerX:150, headerY:120,
  panelX:330, panelY:295, panelW:1260, panelH:640,
  slotX:32, slotW:1196, slotH:96,
  slotY:[118,232,346],
  slot3BottomY:512,
} as const;
const SLOT3_SLIDE = ENTRY_OPEN_LAYOUT.slot3BottomY - ENTRY_OPEN_LAYOUT.slotY[2];

function EntrySlot({index, enterP, startFrame, children}: React.PropsWithChildren<{index:number; enterP:number; startFrame:number; children?:React.ReactNode}>) {
  const L = ENTRY_OPEN_LAYOUT;
  return <div data-entry-slot={index+1} style={{position:'absolute', left:L.slotX, top:L.slotY[index], width:L.slotW, height:L.slotH, opacity:enterP, transform:`translateY(${-16*(1-enterP)}px)`, background:color('color/fill/panel-wash')}}>
    <DrawRect box={{x:0, y:0, w:L.slotW, h:L.slotH}} startFrame={startFrame} durationFrames={frames(380)} strokeToken="color/line/hairline" fillToken="color/fill/panel-wash" glowToken="color/fill/gold" seed={61+index}/>
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
  return <KitSound mode="beats"><div data-scene="EntryOpen" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    {ms >= t6Why.at && <Flicker startFrame={cueFrame(t6Why.at)} durationFrames={15}><div style={{position:'absolute', left:L.headerX, top:L.headerY, opacity:whyP, transform:`translateY(${18*(1-whyP)}px)`, fontSize:46, fontWeight:500}}>Why does the dictionary list individual prejudice first?</div></Flicker>}
    {ms >= t6Open.at && <>
      <DrawRect box={{x:L.panelX, y:L.panelY, w:L.panelW, h:L.panelH}} startFrame={cueFrame(t6Open.at)} durationFrames={frames(500)} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" seed={47}/>
      <div data-entry-panel="true" style={{position:'absolute', left:L.panelX, top:L.panelY, width:L.panelW, height:L.panelH, opacity:openP, transform:`translateY(${20*(1-openP)}px)`}}>
      <FitBox text="rac·ism" x={32} y={28} size={48} weight={600} lineHeight={1.1} padX="spacing/md" padY="spacing/sm" textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" tag="TERM" corners="tl-br" seed={17} intensity={.8} startFrame={cueFrame(t6Open.at)+frames(500)} durationFrames={frames(420)}/>
      <Flicker startFrame={cueFrame(t6Open.at)+frames(500)} durationFrames={frames(300)} intensity={.5} style={{position:'absolute', inset:0}}><em style={{position:'absolute', left:268, top:58, fontSize:25, color:color('color/text/muted')}}>(noun)</em></Flicker>
      <div style={{position:'absolute', left:32, right:32, top:28, height:80}}>
        <span style={{position:'absolute', right:0, top:9, font:'400 20px "IBM Plex Mono"', color:color('color/text/muted')}}>Typical dictionary senses (paraphrased)</span>
      </div>
      {slotEnter[0]>0 && <EntrySlot index={0} enterP={slotEnter[0]} startFrame={cueFrame(t6Numbered.at)}>
        {ms >= t6Begin.at && <span style={{position:'absolute', left:76, top:32, fontSize:30, opacity:fill1}}>individual prejudice or discrimination</span>}
        <span aria-hidden="true" style={{position:'absolute', left:0, top:8, bottom:8, width:4, background:color('color/fill/gold'), transform:`scaleY(${gold1})`, transformOrigin:'center top'}}/>
        <span style={{position:'absolute', left:24, top:31, font:'500 28px "IBM Plex Mono"', color:color('color/fill/gold'), opacity:gold1}}>1</span>
      </EntrySlot>}
      {slotEnter[1]>0 && <EntrySlot index={1} enterP={slotEnter[1]} startFrame={cueFrame(t6Numbered.at+130)}>
        {bottomP>0 && <span data-slot2-placeholder="true" aria-hidden="true" style={{position:'absolute', left:76, top:47, width:420, height:3, background:color('color/line/chart-faint'), opacity:bottomP}}/>}
      </EntrySlot>}
      {slotEnter[2]>0 && <div data-entry-slot="3" data-slot3-phase={slot3Phase} style={{position:'absolute', left:L.slotX, top:L.slotY[2], width:L.slotW, height:L.slotH, opacity:slotEnter[2]*(1 - bottomP*.38 - includesP*.22), transform:`translateY(${-16*(1-slotEnter[2]) + SLOT3_SLIDE*bottomP}px)`, background:color('color/fill/panel-wash')}}>
        <div aria-hidden="true" style={{position:'absolute', inset:0, opacity:1-includesP}}><DrawRect box={{x:0, y:0, w:L.slotW, h:L.slotH}} startFrame={cueFrame(t6Numbered.at+260)} durationFrames={frames(380)} strokeToken="color/line/hairline" fillToken="color/fill/panel-wash" glowToken="color/fill/gold" seed={63}/></div>
        {includesP>0 && <span aria-hidden="true" style={{position:'absolute', inset:0, opacity:includesP, backgroundImage:`repeating-linear-gradient(90deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px), repeating-linear-gradient(90deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px), repeating-linear-gradient(0deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px), repeating-linear-gradient(0deg, ${color('color/line/hairline')} 0 6px, transparent 6px 11px)`, backgroundSize:'100% 1px, 100% 1px, 1px 100%, 1px 100%', backgroundPosition:'top, bottom, left, right', backgroundRepeat:'no-repeat'}}/>}
        <span style={{position:'absolute', left:24, top:31, font:'500 28px "IBM Plex Mono"', color:color('color/text/dim')}}>3</span>
        {ms >= t6Systemic.at && <span style={{position:'absolute', left:76, top:32, fontSize:30, opacity:fill3}}>systemic racism
          {ms >= t6Includes.at && <span style={{marginLeft:12, padding:'4px 9px', border:`1px solid ${color('color/line/hairline')}`, font:'500 20px "IBM Plex Mono"', color:color('color/text/muted'), whiteSpace:'nowrap', opacity:includesP}}>when included at all</span>}
        </span>}
      </div>}
    </div></>}
  </div></KitSound>;
}
