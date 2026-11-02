import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {DefinitionCard, SourceLine, StageSceneFrame} from '../shared';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));

export const LITERATURE_HANDOFF_LAYOUT={
  header:{x:150,y:105,w:1620,h:85},
  cards:[
    {x:160,y:265,w:410,h:385},
    {x:755,y:265,w:410,h:385},
    {x:1350,y:265,w:410,h:385},
  ],
  disciplineY:658,
  boundary:{x:135,y:710,w:1650},
  dock:{x:400,y:770,w:1120,h:170},
  source:{x:116,y:994,w:1688,h:30},
} as const;

const TERMS=[
  {
    term:'BIAS',
    definition:'a tendency in judgment and evaluation because of group membership',
    source:'Greenwald & Banaji 1995',
    discipline:'EXPERIMENTAL PSYCHOLOGY',
    accent:'color/fill/gold',
  },
  {
    term:'PREJUDICE',
    definition:'group antipathy grounded in a rigid, erroneous generalization',
    source:'Allport 1954, p. 9',
    discipline:'SOCIAL PSYCHOLOGY',
    accent:'color/fill/gold',
  },
  {
    term:'DISCRIMINATION',
    definition:'behavior that treats people differently because of group membership',
    source:'Fiske 1998',
    discipline:'SOCIAL PSYCHOLOGY',
    accent:'color/fill/gold',
  },
] as const;

const JOBS=[
  'BIAS · STARTING TENDENCY',
  'PREJUDICE · GROUP ANTIPATHY',
  'DISCRIMINATION · DIFFERENTIAL BEHAVIOR',
] as const;

export function LiteratureHandoff({segment}:SceneProps){
  const ms=useStageMs();
  const cue={
    social:useCue('t17Social').at,
    three:useCue('t17Three').at,
    distinct:useCue('t17Distinct').at,
    definitions:useCue('t17Definitions').at,
    experimental:useCue('t17Experimental').at,
    psychology:useCue('t17Psychology').at,
    preface:useCue('t18Preface').at,
    chapter:useCue('t18Chapter').at,
    original:useCue('t18Original').at,
    established:useCue('t18Established').at,
    each:useCue('t18Each').at,
    job:useCue('t18Job').at,
  };
  const headerP=enter(ms,cue.social);
  const cardsP=enter(ms,cue.three,600);
  const socketsP=enter(ms,cue.distinct,500);
  const definitionsOn=ms>=cue.definitions;
  const experimentalP=enter(ms,cue.experimental,440);
  const psychologyP=enter(ms,cue.psychology,560);
  const dockP=enter(ms,cue.preface,560);
  const channelsP=enter(ms,cue.established,620);
  const socketsDockP=enter(ms,cue.each,560);
  const lockP=enter(ms,cue.job,520);
  const L=LITERATURE_HANDOFF_LAYOUT;
  return <StageSceneFrame segment={segment}>
    {ms>=cue.social&&<div data-literature-header="true" style={{position:'absolute',left:L.header.x,top:L.header.y,width:L.header.w,height:L.header.h,fontSize:52,lineHeight:1.1,fontWeight:600,letterSpacing:1.2,color:color('color/text/primary'),opacity:headerP,transform:`translateY(${16*(1-headerP)}px)`}}>ESTABLISHED SOCIAL PSYCHOLOGY</div>}

    {ms>=cue.social&&<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      {L.cards.map((box,index)=><rect key={box.x} data-source-frame={index+1} x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={color('color/line/hairline')} strokeWidth="1" opacity={headerP}/>) }
      {ms>=cue.psychology&&<line data-literature-boundary="true" x1={L.boundary.x} y1={L.boundary.y} x2={L.boundary.x+L.boundary.w*psychologyP} y2={L.boundary.y} stroke={color('color/fill/gold')} strokeWidth="4"/>}
      {L.cards.map((box,index)=>{
        const center=box.x+box.w/2;
        const socketY=box.y+box.h;
        const dockCenter=L.dock.x+(index+.5)*L.dock.w/3;
        return <g key={`channel-${box.x}`}>
          {ms>=cue.distinct&&<circle data-literature-socket={index+1} cx={center} cy={socketY} r={8*socketsP} fill={color('color/fill/gold')} opacity={socketsP}/>}
          {ms>=cue.established&&<path data-literature-channel={index+1} d={`M${center} ${socketY+10}V${L.boundary.y}L${dockCenter} ${L.dock.y}`} fill="none" stroke={color('color/line/hairline-strong')} strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1-channelsP} opacity={channelsP}/>}
        </g>;
      })}
      {ms>=cue.job&&<path data-lock-trace="true" d={`M${L.dock.x+24} ${L.dock.y+L.dock.h-18}H${L.dock.x+L.dock.w-24}`} fill="none" stroke={color('color/fill/gold')} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-lockP}/>}
    </svg>}

    {L.cards.map((box,index)=>ms>=cue.three?<div key={box.x} data-literature-card={TERMS[index].term} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,opacity:cardsP,transform:`translateY(${18*(1-cardsP)}px)`}}>
      <DefinitionCard
        term={TERMS[index].term}
        definition={definitionsOn?TERMS[index].definition:''}
        source={definitionsOn?TERMS[index].source:''}
        paraphrased={false}
        progress={cardsP}
        accent={TERMS[index].accent}
      />
    </div>:null)}

    {ms>=cue.experimental&&<div data-discipline="experimental" style={{position:'absolute',left:L.cards[0].x,top:L.disciplineY,width:L.cards[0].w,textAlign:'center',font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/fill/gold'),opacity:experimentalP}}>EXPERIMENTAL PSYCHOLOGY</div>}
    {ms>=cue.psychology&&<>
      <div data-discipline="social-prejudice" style={{position:'absolute',left:L.cards[1].x,top:L.disciplineY,width:L.cards[1].w,textAlign:'center',font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/fill/gold'),opacity:psychologyP}}>SOCIAL PSYCHOLOGY</div>
      <div data-discipline="social-discrimination" style={{position:'absolute',left:L.cards[2].x,top:L.disciplineY,width:L.cards[2].w,textAlign:'center',font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/fill/gold'),opacity:psychologyP}}>SOCIAL PSYCHOLOGY</div>
    </>}

    {ms>=cue.preface&&<div data-book-dock="true" style={{position:'absolute',left:L.dock.x,top:L.dock.y,width:L.dock.w,height:L.dock.h,boxSizing:'border-box',padding:'15px 22px',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline-strong')}`,opacity:dockP,transform:`translateY(${22*(1-dockP)}px)`}}>
      <div style={{position:'absolute',left:20,top:15,font:'500 20px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/fill/gold')}}>LITERATURE HANDOFF</div>
      {ms>=cue.chapter&&<div style={{position:'absolute',right:22,top:15,font:'500 20px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/text/muted'),opacity:enter(ms,cue.chapter,420)}}>PREFACE + CHAPTER 2</div>}
      {ms>=cue.original&&<div style={{position:'absolute',left:22,right:22,top:46,textAlign:'center',fontSize:32,fontWeight:650,letterSpacing:2,color:color('color/text/primary'),opacity:enter(ms,cue.original,500)}}>THE ORIGINAL POWER</div>}
      {ms>=cue.each&&<div data-job-sockets="true" style={{position:'absolute',left:18,right:18,bottom:24,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,opacity:socketsDockP}}>
        {JOBS.map(job=><div key={job} style={{height:42,display:'grid',placeItems:'center',font:'500 20px "IBM Plex Mono"',lineHeight:1.05,textAlign:'center',color:color('color/text/primary'),background:color('color/fill/gold-wash'),border:`1px solid ${color('color/line/hairline')}`}}>{job}</div>)}
      </div>}
    </div>}
    {ms>=cue.job&&<SourceLine text="Established definitions enter the book directly." x={L.source.x} y={L.source.y} tone="muted"/>}
  </StageSceneFrame>;
}
