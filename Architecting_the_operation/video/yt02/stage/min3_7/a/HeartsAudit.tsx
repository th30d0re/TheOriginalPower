import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame, TermBlock} from '../shared';
import {enter, HeartIcon, PANEL_STYLE, PersonIcon, ScanLines, WordIcon, type Box} from './PackageAVisuals';

export const HEARTS_LAYOUT = {
  header:{x:130,y:100,w:1660,h:90},
  debate:{x:160,y:250,w:880,h:590},
  targets:{x:1160,y:268,w:580,h:552},
  inputs:{x:140,y:260,w:520,h:530},
  router:{x:750,y:310,w:370,h:420},
  thoughts:{x:1210,y:230,w:550,h:620},
  claim:{x:130,y:250,w:490,h:530},
  formal:{x:690,y:250,w:570,h:530},
  archive:{x:1330,y:220,w:440,h:600},
  source:{x:116,y:994,w:1688,h:30},
} satisfies Record<string,Box>;

type CueMap=Record<string,{at:number}>;

function Header({text,p}:{text:string;p:number}) {
  return <div data-audit-header="true" style={{position:'absolute',left:HEARTS_LAYOUT.header.x,top:HEARTS_LAYOUT.header.y,width:HEARTS_LAYOUT.header.w,height:HEARTS_LAYOUT.header.h,textAlign:'center',font:'500 28px "IBM Plex Mono"',letterSpacing:1.8,color:color('color/fill/gold'),opacity:p}}>{text}</div>;
}

function TurnThirteen({ms,cue}:{ms:number;cue:CueMap}) {
  const ordering=enter(ms,cue.t13Ordering.at,480);
  const publicP=enter(ms,cue.t13Public.at,500);
  const auditP=enter(ms,cue.t13Audit.at,520);
  const targets=[
    {cue:'t13Hearts',label:'HEART',glyph:<HeartIcon/>},
    {cue:'t13Vocabulary',label:'VOCABULARY',glyph:<WordIcon/>},
    {cue:'t13Intentions',label:'MORAL INTENTION',glyph:<PersonIcon tone="color/marker/race"/>},
  ] as const;
  return <div data-audit-turn="13">
    {ms>=cue.t13Ordering.at&&<Header text="DEFAULT DEFINITION" p={ordering}/>}
    <div style={{...PANEL_STYLE,left:HEARTS_LAYOUT.debate.x,top:HEARTS_LAYOUT.debate.y,width:HEARTS_LAYOUT.debate.w,height:HEARTS_LAYOUT.debate.h,opacity:ordering}}>
      {ms>=cue.t13Public.at&&<div style={{position:'absolute',left:48,top:54,width:260,font:'500 25px "IBM Plex Mono"',color:color('color/text/primary'),opacity:publicP}}>PUBLIC DEBATE</div>}
      <svg width="880" height="590" viewBox="0 0 880 590" style={{position:'absolute',inset:0}} aria-hidden="true">
        {ms>=cue.t13Public.at&&<path d="M 70 145 H 550 L 680 280 L 550 415 H 70" fill={color('color/fill/gold-wash')} stroke={color('color/line/hairline-strong')} strokeWidth="2" opacity={publicP}/>}
        {ms>=cue.t13Audit.at&&<>
          <path d="M 680 280 L 860 245 L 860 315 Z" fill={color('color/fill/red-faint')} opacity={auditP}/>
          <ScanLines x={690} y={245} w={170} h={70} progress={auditP}/>
        </>}
        {[190,270,350].map((y,index)=><path key={y} d={`M 80 ${y} H ${390-index*18}`} stroke={color('color/text/muted')} strokeWidth="8" opacity={.22*ordering}/>) }
      </svg>
      {ms>=cue.t13Audit.at&&<div style={{position:'absolute',right:22,top:196,width:220,textAlign:'center',font:'500 20px "IBM Plex Mono"',color:color('color/marker/race'),opacity:auditP}}>INDIVIDUAL AUDIT</div>}
      <div aria-hidden="true" style={{position:'absolute',left:72,bottom:72,width:330,height:90,border:`1px dashed ${color('color/line/hairline')}`,opacity:.55*ordering}}/>
    </div>
    <div style={{position:'absolute',left:HEARTS_LAYOUT.targets.x,top:HEARTS_LAYOUT.targets.y,width:HEARTS_LAYOUT.targets.w,height:HEARTS_LAYOUT.targets.h}}>
      {targets.map((target,index)=>ms>=cue[target.cue].at&&<div key={target.label} style={{position:'absolute',left:0,top:index*174,width:580,height:142,opacity:enter(ms,cue[target.cue].at,430)}}><TermBlock term={target.label} glyph={target.glyph} state="selected" accent="color/marker/race" unit={`audit ${index+1}`}/></div>)}
    </div>
    {ms>=cue.t13Intentions.at&&<div style={{position:'absolute',left:160,top:872,width:1580,textAlign:'center',fontSize:30,opacity:enter(ms,cue.t13Intentions.at,500)}}>The ordering directs attention.</div>}
  </div>;
}

function DisparityGlyph({kind}:{kind:'figure'|'court'|'workplace'}) {
  if(kind==='figure')return <PersonIcon/>;
  if(kind==='court')return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true"><path d="M5 17 L24 6 L43 17 Z M9 21 V38 M19 21 V38 M29 21 V38 M39 21 V38 M5 42 H43" fill="none" stroke={color('color/text/soft')} strokeWidth="2.3"/></svg>;
  return <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="7" width="34" height="34" fill="none" stroke={color('color/text/soft')} strokeWidth="2"/>{[16,25,34].flatMap(x=>[16,25,34].map(y=><rect key={`${x}-${y}`} x={x-2} y={y-2} width="4" height="4" fill={color('color/fill/gold')}/>))}</svg>;
}

function TurnFourteen({ms,cue}:{ms:number;cue:CueMap}) {
  const rows=[
    {cue:'t14Public',label:'PUBLIC FIGURE',kind:'figure' as const},
    {cue:'t14Court',label:'COURT',kind:'court' as const},
    {cue:'t14Workplace',label:'WORKPLACE',kind:'workplace' as const},
  ];
  const disparity=enter(ms,cue.t14Disparity.at,520);
  const route=enter(ms,cue.t14Default.at,600);
  const malice=enter(ms,cue.t14Malice.at,500);
  return <div data-audit-turn="14">
    {ms>=cue.t14Disparity.at&&<Header text="RACIAL DISPARITY" p={disparity}/>}
    <div style={{position:'absolute',left:HEARTS_LAYOUT.inputs.x,top:HEARTS_LAYOUT.inputs.y,width:HEARTS_LAYOUT.inputs.w,height:HEARTS_LAYOUT.inputs.h}}>
      {rows.map((row,index)=>ms>=cue[row.cue].at&&<div key={row.label} style={{...PANEL_STYLE,left:0,top:index*176,width:520,height:140,opacity:enter(ms,cue[row.cue].at,450)}}>
        <div style={{position:'absolute',left:22,top:20}}><DisparityGlyph kind={row.kind}/></div>
        <div style={{position:'absolute',left:90,top:22,font:'500 22px "IBM Plex Mono"'}}>{row.label}</div>
        <div aria-hidden="true" style={{position:'absolute',left:92,top:76,width:290,height:12,background:color('color/fill/gold-wash')}}/>
        <div aria-hidden="true" style={{position:'absolute',left:92,top:102,width:180-index*22,height:12,background:color('color/fill/red-wash')}}/>
        {ms>=cue.t14Disparity.at&&<div aria-hidden="true" style={{position:'absolute',left:390,top:70,width:18,height:56,borderTop:`2px solid ${color('color/marker/race')}`,borderBottom:`2px solid ${color('color/marker/race')}`,borderRight:`2px solid ${color('color/marker/race')}`,opacity:disparity}}/>}
      </div>)}
    </div>
    {ms>=cue.t14Default.at&&<div data-definition-router="true" style={{...PANEL_STYLE,left:HEARTS_LAYOUT.router.x,top:HEARTS_LAYOUT.router.y,width:HEARTS_LAYOUT.router.w,height:HEARTS_LAYOUT.router.h,opacity:route}}>
      <div style={{position:'absolute',left:30,top:35,width:310,textAlign:'center',font:'500 22px "IBM Plex Mono"',color:color('color/fill/gold')}}>DEFAULT DEFINITION</div>
      <svg width="370" height="420" viewBox="0 0 370 420" aria-hidden="true">
        {[120,210,300].map((y,index)=><path key={y} d={`M 18 ${y} H 166 Q 225 ${y} 225 210 H 348`} fill="none" stroke={color('color/fill/gold')} strokeWidth="2" opacity={enter(ms,cue.t14Default.at+index*90,500)}/>) }
      </svg>
    </div>}
    {ms>=cue.t14Malice.at&&<div style={{...PANEL_STYLE,left:HEARTS_LAYOUT.thoughts.x,top:HEARTS_LAYOUT.thoughts.y,width:HEARTS_LAYOUT.thoughts.w,height:HEARTS_LAYOUT.thoughts.h,opacity:malice}}>
      <div style={{position:'absolute',left:0,top:42,width:550,textAlign:'center',font:'500 24px "IBM Plex Mono"',color:color('color/marker/race')}}>MALICE AUDIT</div>
      <svg width="550" height="620" viewBox="0 0 550 620" aria-hidden="true">
        <circle cx="275" cy="255" r="112" fill="none" stroke={color('color/line/hairline-strong')} strokeWidth="3"/>
        <path d="M 205 370 Q 275 430 345 370" fill="none" stroke={color('color/line/hairline-strong')} strokeWidth="3"/>
        <line x1="480" y1="105" x2={300+(1-malice)*160} y2={230+(1-malice)*-100} stroke={color('color/marker/race')} strokeWidth="4"/>
        <circle cx={300+(1-malice)*160} cy={230+(1-malice)*-100} r="12" fill={color('color/marker/race')}/>
      </svg>
      {ms>=cue.t14Thoughts.at&&<div style={{position:'absolute',left:75,top:500,width:400,textAlign:'center',fontSize:28,opacity:enter(ms,cue.t14Thoughts.at,450)}}>PRIVATE THOUGHTS</div>}
    </div>}
  </div>;
}

function TurnFifteen({ms,cue}:{ms:number;cue:CueMap}) {
  const original=enter(ms,cue.t15Original.at,500);
  const causal=enter(ms,cue.t15Causal.at,450);
  const testable=enter(ms,cue.t15Testable.at,500);
  const formal=enter(ms,cue.t15Formally.at,650);
  const checked=enter(ms,cue.t15Checked.at,500);
  const centuries=enter(ms,cue.t15Centuries.at,600);
  const records=enter(ms,cue.t15Records.at,450);
  return <div data-audit-turn="15">
    {ms>=cue.t15Original.at&&<Header text="THE ORIGINAL POWER" p={original}/>}
    <div style={{...PANEL_STYLE,left:HEARTS_LAYOUT.claim.x,top:HEARTS_LAYOUT.claim.y,width:HEARTS_LAYOUT.claim.w,height:HEARTS_LAYOUT.claim.h,opacity:original}}>
      {ms>=cue.t15Causal.at&&<div style={{position:'absolute',left:32,top:38,width:426,textAlign:'center',font:'500 22px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:causal}}>CLAIM</div>}
      {ms>=cue.t15Testable.at&&<div style={{position:'absolute',left:38,top:130,width:414,textAlign:'center',fontSize:34,lineHeight:1.25,fontWeight:600,opacity:testable}}>TESTABLE HISTORICAL CLAIM</div>}
      <svg width="490" height="530" viewBox="0 0 490 530" aria-hidden="true">
        {ms>=cue.t15Testable.at&&<path d="M245 260 V430 H470" fill="none" stroke={color('color/fill/gold')} strokeWidth="3" strokeDasharray="10 9" opacity={testable}/>}
      </svg>
    </div>
    <div style={{...PANEL_STYLE,left:HEARTS_LAYOUT.formal.x,top:HEARTS_LAYOUT.formal.y,width:HEARTS_LAYOUT.formal.w,height:HEARTS_LAYOUT.formal.h,opacity:testable}}>
      {ms>=cue.t15Formally.at&&<>
        <div style={{position:'absolute',left:24,top:34,width:522,textAlign:'center',font:'500 22px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:formal}}>FORMAL STATEMENT</div>
        <div style={{position:'absolute',left:42,top:130,width:486,textAlign:'center',fontSize:28,lineHeight:1.55,opacity:formal}}>Individual Prejudice → {' '}<br/>Discriminatory Actions → {' '}<br/>Systemic Outcomes</div>
        <div style={{position:'absolute',left:50,top:390,width:470,textAlign:'center',font:'400 20px "IBM Plex Mono"',color:color('color/text/muted'),opacity:formal}}>Eq. 2.5 · Tier 3 structural claim</div>
      </>}
    </div>
    <div style={{...PANEL_STYLE,left:HEARTS_LAYOUT.archive.x,top:HEARTS_LAYOUT.archive.y,width:HEARTS_LAYOUT.archive.w,height:HEARTS_LAYOUT.archive.h,opacity:checked}}>
      {ms>=cue.t15Checked.at&&<div style={{position:'absolute',left:20,top:30,width:400,textAlign:'center',font:'500 22px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:checked}}>PRIMARY RECORDS</div>}
      <svg width="440" height="600" viewBox="0 0 440 600" aria-hidden="true">
        {ms>=cue.t15Checked.at&&Array.from({length:6},(_,index)=><g key={index} opacity={enter(ms,cue.t15Checked.at+index*80,420)}>
          <rect x={56+(index%2)*190} y={110+Math.floor(index/2)*116} width="150" height="86" fill={color('color/surface/1')} stroke={color('color/line/hairline')}/>
          <path d={`M ${74+(index%2)*190} ${137+Math.floor(index/2)*116} H ${184+(index%2)*190} M ${74+(index%2)*190} ${160+Math.floor(index/2)*116} H ${164+(index%2)*190}`} stroke={color('color/text/muted')} strokeWidth="2"/>
        </g>)}
        {ms>=cue.t15Centuries.at&&<line x1="26" y1="100" x2="26" y2={100+410*centuries} stroke={color('color/fill/gold')} strokeWidth="4"/>}
        {ms>=cue.t15Records.at&&<rect x="78" y="480" width="284" height="72" fill={color('color/fill/red-faint')} stroke={color('color/marker/race')} strokeWidth="2" opacity={records}/>}
      </svg>
      {ms>=cue.t15Centuries.at&&<div style={{position:'absolute',left:-52,top:288,width:150,transform:'rotate(-90deg)',textAlign:'center',font:'500 20px "IBM Plex Mono"',color:color('color/fill/gold'),opacity:centuries}}>FIVE CENTURIES</div>}
      {ms>=cue.t15Records.at&&<div style={{position:'absolute',left:78,top:500,width:284,textAlign:'center',font:'500 22px "IBM Plex Mono"',color:color('color/marker/race'),opacity:records}}>HISTORICAL TEST</div>}
    </div>
  </div>;
}

export function HeartsAudit({segment}:SceneProps) {
  const ms=useStageMs();
  const cue:CueMap={
    t13Ordering:useCue('t13Ordering'),t13Public:useCue('t13Public'),t13Audit:useCue('t13Audit'),t13Hearts:useCue('t13Hearts'),t13Vocabulary:useCue('t13Vocabulary'),t13Intentions:useCue('t13Intentions'),
    t14Public:useCue('t14Public'),t14Court:useCue('t14Court'),t14Workplace:useCue('t14Workplace'),t14Disparity:useCue('t14Disparity'),t14Default:useCue('t14Default'),t14Malice:useCue('t14Malice'),t14Thoughts:useCue('t14Thoughts'),
    t15Original:useCue('t15Original'),t15Causal:useCue('t15Causal'),t15Testable:useCue('t15Testable'),t15Formally:useCue('t15Formally'),t15Checked:useCue('t15Checked'),t15Centuries:useCue('t15Centuries'),t15Records:useCue('t15Records'),
  };
  const phase=ms<cue.t14Public.at?13:ms<cue.t15Original.at?14:15;
  return <StageSceneFrame segment={segment} source="The Original Power, Chapter 2">
    {phase===13&&<TurnThirteen ms={ms} cue={cue}/>}
    {phase===14&&<TurnFourteen ms={ms} cue={cue}/>}
    {phase===15&&<TurnFifteen ms={ms} cue={cue}/>}
  </StageSceneFrame>;
}
