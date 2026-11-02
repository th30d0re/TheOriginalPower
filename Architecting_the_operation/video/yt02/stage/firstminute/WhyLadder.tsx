import React from 'react';
import {cubicOut, progress, useCue, usePlan, useStageMs} from '@stage';
import {color} from '../tokens';
import {CardBorder} from '../dashboard/CardBorder';
import {BacklashOscillatorView} from '../dashboard/artifacts/BacklashOscillatorView';
import {DefinitionSceneContent, finalDefinitionState} from './DictionaryEntry';
import chesapeake from './data/chesapeake_coastline.json';

const reveal=(ms:number,at:number,duration=500)=>cubicOut(progress(ms,at,at+duration));

// Shared left edge for the header and the thumbnail column; the shrunken turn-1 entry
// lands on slot 1 at (columnX, rowYs[0]). Exported for tools/check_first_minute.tsx.
export const WHY_LAYOUT = {
  columnX: 240,
  headerX: 240,
  rowYs: [224, 416, 608, 800],
  rowW: 1540,
} as const;

function ThumbFrame({children}:React.PropsWithChildren) {
  return <div style={{position:'absolute',left:0,top:0,width:320,height:180,overflow:'hidden',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`}}>{children}</div>;
}

function BiasRacismThumb() {
  return <ThumbFrame><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,height:'100%',padding:'0 12px'}}>
    {[['bias','a tendency in judgment'],['racism','psycho-legal social software']].map(([name,desc])=><div key={name} style={{width:132,minHeight:112,padding:'10px 8px',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',border:`1px solid ${color('color/line/hairline')}`}}>
      <strong style={{font:'500 22px "IBM Plex Mono"',color:color('color/fill/gold')}}>{name}</strong>
      <span style={{marginTop:9,fontSize:20,lineHeight:1.2,color:color('color/text/soft')}}>{desc}</span>
    </div>)}
  </div></ThumbFrame>;
}

function VirginiaThumb({zoom}: {zoom:number}) {
  const scale=.78+.22*zoom;
  return <ThumbFrame><svg width="320" height="180" viewBox="0 0 320 180" aria-label="Chesapeake coastline">
    <g style={{transform:`translate(${160*(1-scale)}px,${90*(1-scale)}px) scale(${scale})`,transformOrigin:'0 0'}}>
      <path d={chesapeake.path} fill={color('color/surface/1')} stroke={color('color/line/hairline-strong')} strokeWidth="1.6"/>
    </g>
    <circle cx="156" cy="85" r="5" fill={color('color/fill/gold')}/>
    <rect x="8" y="140" width="196" height="30" rx="4" fill={color('color/fill/panel-render')} stroke={color('color/line/hairline')} strokeWidth="1"/>
    <text x="16" y="161" fill={color('color/text/primary')} fontFamily="IBM Plex Mono" fontSize="20">Virginia · 1676</text>
  </svg></ThumbFrame>;
}

function BacklashThumb() {
  return <ThumbFrame><div style={{position:'absolute',left:16,top:12,width:288,height:122}}><BacklashOscillatorView mode="compact" width={288} height={122} interactive={false}/></div><div style={{position:'absolute',left:16,bottom:9,font:'500 20px "IBM Plex Mono"',color:color('color/text/primary')}}>reform → backlash</div></ThumbFrame>;
}

const questions=[
  'Why does the dictionary order matter?',
  'Why separate bias from racism?',
  'Why did Virginia write racial law when solidarity threatened planters?',
  'Why does reform produce backlash?',
] as const;

function WhyRow({index,y,at,active,children,ms}:{index:number;y:number;at:number;active:boolean;children:React.ReactNode;ms:number}) {
  const amount=reveal(ms,at,520);
  return <div data-why-row={index+1} style={{position:'absolute',left:WHY_LAYOUT.columnX,top:y,width:WHY_LAYOUT.rowW,height:180,opacity:amount*(active?1:.48),transform:`translateY(${20*(1-amount)}px)`}}>
    <div style={{position:'absolute',left:0,top:0,width:320,height:180}}>{children}</div>
    <div style={{position:'absolute',left:365,top:0,width:1120,height:180,display:'flex',alignItems:'center',borderTop:`1px solid ${color('color/line/graticule')}`}}>
      <span style={{font:'500 22px "IBM Plex Mono"',color:color('color/fill/gold'),marginRight:24}}>0{index+1}</span>
      <span style={{fontSize:index===2?34:38,lineHeight:1.25,fontWeight:500,color:color('color/text/primary')}}>{questions[index]}</span>
    </div>
  </div>;
}

export function WhyLadder() {
  const ms=useStageMs(),plan=usePlan();
  const header=useCue('header'),why1=useCue('why1'),why2=useCue('why2'),why3=useCue('why3'),virginia=useCue('virginia'),why4=useCue('why4');
  const sceneStart=plan.segments.find(segment=>segment.scene==='WhyLadder')?.start_ms??header.at;
  const shrink=cubicOut(progress(ms,sceneStart,sceneStart+1500));
  const headerIn=reveal(ms,header.at,500);
  const cues=[why1.at,why2.at,why3.at,why4.at];
  const active=Math.max(0,cues.filter(at=>ms>=at).length-1);
  const zoom=cubicOut(progress(ms,why3.at,virginia.at+2000));
  const scale=1+(.1667-1)*shrink;
  const x=WHY_LAYOUT.columnX*shrink,y=WHY_LAYOUT.rowYs[0]*shrink;
  const slotOneCaption=reveal(ms,why1.at,520)*(active===0?1:.48);
  return <div data-scene="WhyLadder" style={{position:'absolute',inset:0,width:1920,height:1080,overflow:'hidden',background:color('color/bg/field'),fontFamily:'IBM Plex Sans'}}>
    <CardBorder/>
    <div data-continuity-entry="true" style={{position:'absolute',inset:0,transform:`translate(${x}px,${y}px) scale(${scale})`,transformOrigin:'top left',zIndex:2}}><DefinitionSceneContent state={finalDefinitionState}/></div>
    {ms>=header.at&&<div style={{position:'absolute',left:WHY_LAYOUT.headerX,top:78,fontSize:64,fontWeight:500,color:color('color/text/primary'),opacity:headerIn,transform:`translateY(${18*(1-headerIn)}px)`}}>Why, at every step</div>}
    {ms>=why1.at&&<WhyRow index={0} y={WHY_LAYOUT.rowYs[0]} at={why1.at} active={active===0} ms={ms}><ThumbFrame/></WhyRow>}
    {ms>=why2.at&&<WhyRow index={1} y={WHY_LAYOUT.rowYs[1]} at={why2.at} active={active===1} ms={ms}><BiasRacismThumb/></WhyRow>}
    {ms>=why3.at&&<WhyRow index={2} y={WHY_LAYOUT.rowYs[2]} at={why3.at} active={active===2} ms={ms}><VirginiaThumb zoom={zoom}/></WhyRow>}
    {ms>=why4.at&&<WhyRow index={3} y={WHY_LAYOUT.rowYs[3]} at={why4.at} active={active===3} ms={ms}><BacklashThumb/></WhyRow>}
    {ms>=why1.at&&<div data-thumb-caption="1" style={{position:'absolute',left:WHY_LAYOUT.columnX,top:WHY_LAYOUT.rowYs[0],width:320,height:180,zIndex:3,opacity:slotOneCaption,pointerEvents:'none'}}>
      <div style={{position:'absolute',left:16,bottom:9,font:'500 20px "IBM Plex Mono"',color:color('color/text/primary')}}>rac·ism · senses 1–3</div>
    </div>}
  </div>;
}
