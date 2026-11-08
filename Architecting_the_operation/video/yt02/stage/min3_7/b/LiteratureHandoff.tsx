import React from 'react';
import {DrawLine, KitSound, useCue,useStageMs,type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../shared';
import {BootPanel,FlickerLabel,Label,lineAttrs,Panel,pathFrom,SceneSource,shapeAttrs,type Box,type Point} from './AuditVisuals';

export const LITERATURE_HANDOFF_LAYOUT={
  header:{x:150,y:95,w:1620,h:70},
  cards:[{x:160,y:240,w:410,h:380},{x:755,y:240,w:410,h:380},{x:1350,y:240,w:410,h:380}],
  socketY:642,disciplineY:665,boundary:{x:135,y:720,w:1650,h:4},dock:{x:300,y:770,w:1320,h:170},source:{x:116,y:968,w:740,h:30},
} as const;

const TERMS=[
  {term:'BIAS',definition:'a tendency in judgment and evaluation because of group membership',source:'Greenwald & Banaji 1995',discipline:'EXPERIMENTAL PSYCHOLOGY'},
  {term:'PREJUDICE',definition:'group antipathy grounded in a rigid, erroneous generalization',source:'Allport 1954, p. 9',discipline:'SOCIAL PSYCHOLOGY'},
  {term:'DISCRIMINATION',definition:'behavior that treats people differently because of group membership',source:'Fiske 1998',discipline:'SOCIAL PSYCHOLOGY'},
] as const;
const JOBS=[
  {text:'BIAS · STARTING TENDENCY',w:300},
  {text:'PREJUDICE · GROUP ANTIPATHY',w:390},
  {text:'DISCRIMINATION · DIFFERENTIAL BEHAVIOR',w:570},
] as const;

function LiteratureCard({index,box,startMs,definitionsOn}:{index:number;box:Box;startMs:number;definitionsOn:boolean}){
  const item=TERMS[index],term={x:box.x+38,y:box.y+38,w:box.w-76,h:48},definition={x:box.x+38,y:box.y+100,w:box.w-76,h:160},source={x:box.x+38,y:box.y+276,w:box.w-76,h:30};
  return <div data-literature-card={item.term}>
    <BootPanel id={`literature-card-${index+1}`} box={box} startMs={startMs} durationMs={600}/>
    <div {...shapeAttrs(`literature-card-accent-${index+1}`,{x:box.x,y:box.y,w:5,h:box.h},'mark',`accent-${index+1}`)} style={{position:'absolute',left:box.x,top:box.y,width:5,height:box.h,background:color('color/fill/gold')}}/>
    <FlickerLabel startMs={startMs} id={`literature-term-${index+1}`} box={term} size={38} weight={650} sans ink={color('color/fill/gold')}>{item.term}</FlickerLabel>
    {definitionsOn&&<><FlickerLabel startMs={startMs} id={`literature-definition-${index+1}`} box={definition} size={28} weight={400} lh={1.34} sans>{item.definition}</FlickerLabel><FlickerLabel startMs={startMs} id={`literature-source-${index+1}`} box={source} size={20} weight={400} lh={1.3} ink={color('color/text/muted')}>{item.source}</FlickerLabel></>}
  </div>;
}

export function LiteratureHandoff({segment}:SceneProps){
  const ms=useStageMs();
  const cue={social:useCue('t17Social').at,three:useCue('t17Three').at,distinct:useCue('t17Distinct').at,definitions:useCue('t17Definitions').at,experimental:useCue('t17Experimental').at,psychology:useCue('t17Psychology').at,preface:useCue('t18Preface').at,chapter:useCue('t18Chapter').at,original:useCue('t18Original').at,established:useCue('t18Established').at,each:useCue('t18Each').at,job:useCue('t18Job').at};
  const L=LITERATURE_HANDOFF_LAYOUT;
  return <KitSound mode="beats"><StageSceneFrame segment={segment}>
    {ms>=cue.social&&<FlickerLabel startMs={cue.social} id="literature-header" box={L.header} size={52} weight={600} ls={1.2} sans>ESTABLISHED SOCIAL PSYCHOLOGY</FlickerLabel>}
    {ms>=cue.social&&<>{L.cards.map((box,index)=>ms>=cue.three?<LiteratureCard key={box.x} index={index} box={box} startMs={cue.three} definitionsOn={ms>=cue.definitions}/>:<div key={box.x} data-source-frame={index+1}><BootPanel id={`source-frame-${index+1}`} box={box} startMs={cue.social}/></div>)}<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      {L.cards.map((box,index)=>{const center=box.x+box.w/2,side=box.x+box.w-8,dockCenter=L.dock.x+[150,495,975][index];const socketPoints:Point[]=[[center,L.socketY],[side,L.socketY],[side,L.boundary.y]],channelPoints:Point[]=[[side,L.boundary.y],[dockCenter,L.dock.y]];return <g key={box.x}>
        {ms>=cue.distinct&&<circle data-literature-socket={index+1} {...shapeAttrs(`literature-socket-${index+1}`,{x:center-8,y:L.socketY-8,w:16,h:16},'mark',`socket-${index+1}`)} cx={center} cy={L.socketY} r="8" fill={color('color/fill/gold')}/>}
        {ms>=cue.distinct&&<DrawLine points={socketPoints} startFrame={Math.round(cue.distinct*30/1000)} durationFrames={15} strokeToken="color/line/hairline-strong" strokeWidth={2}/>}
        {ms>=cue.established&&<DrawLine points={channelPoints} startFrame={Math.round(cue.established*30/1000)} durationFrames={19} strokeToken="color/line/hairline-strong" strokeWidth={2}/>}
      </g>;})}
      {ms>=cue.psychology&&<DrawLine points={[[L.boundary.x,L.boundary.y],[L.boundary.x+L.boundary.w,L.boundary.y]]} startFrame={Math.round(cue.psychology*30/1000)} durationFrames={17} strokeToken="color/fill/gold" strokeWidth={4}/>}
      {ms>=cue.job&&<DrawLine beat points={[[L.dock.x+24,L.dock.y+L.dock.h-18],[L.dock.x+L.dock.w-24,L.dock.y+L.dock.h-18]]} startFrame={Math.round(cue.job*30/1000)} durationFrames={16} strokeToken="color/fill/gold" strokeWidth={3}/>}
    </svg></>}
    {ms>=cue.experimental&&<FlickerLabel startMs={cue.experimental} id="discipline-experimental" box={{x:190,y:L.disciplineY,w:340,h:28}} size={20} weight={500} ls={1.1} align="center" ink={color('color/fill/gold')}><span data-discipline="experimental">EXPERIMENTAL PSYCHOLOGY</span></FlickerLabel>}
    {ms>=cue.psychology&&<><FlickerLabel startMs={cue.psychology} id="discipline-social-prejudice" box={{x:790,y:L.disciplineY,w:330,h:28}} size={20} weight={500} ls={1.1} align="center" ink={color('color/fill/gold')}><span data-discipline="social-prejudice">SOCIAL PSYCHOLOGY</span></FlickerLabel><FlickerLabel startMs={cue.psychology} id="discipline-social-discrimination" box={{x:1390,y:L.disciplineY,w:330,h:28}} size={20} weight={500} ls={1.1} align="center" ink={color('color/fill/gold')}><span data-discipline="social-discrimination">SOCIAL PSYCHOLOGY</span></FlickerLabel></>}
    {ms>=cue.preface&&<div data-book-dock="true">
      <BootPanel id="book-dock" box={L.dock} startMs={cue.preface} durationMs={560} beat/>
      <FlickerLabel startMs={cue.preface} id="handoff-label" box={{x:L.dock.x+20,y:L.dock.y+15,w:360,h:28}} size={20} weight={500} ls={1.4} ink={color('color/fill/gold')}>LITERATURE HANDOFF</FlickerLabel>
      {ms>=cue.chapter&&<FlickerLabel startMs={cue.chapter} id="handoff-chapter" box={{x:L.dock.x+880,y:L.dock.y+15,w:390,h:28}} size={20} weight={500} ls={1.2} align="right" ink={color('color/text/muted')}>PREFACE + CHAPTER 2</FlickerLabel>}
      {ms>=cue.original&&<FlickerLabel startMs={cue.original} id="handoff-book-title" box={{x:L.dock.x+22,y:L.dock.y+48,w:L.dock.w-44,h:40}} size={32} weight={650} ls={2} sans align="center">THE ORIGINAL POWER</FlickerLabel>}
      {ms>=cue.each&&<div data-job-sockets="true">{JOBS.map((job,index)=>{const x=L.dock.x+18+JOBS.slice(0,index).reduce((sum,item)=>sum+item.w,0)+index*12,box={x,y:L.dock.y+102,w:job.w,h:44};return <React.Fragment key={job.text}><BootPanel id={`job-chip-${index+1}`} box={box} startMs={cue.each} style={{background:color('color/fill/gold-wash')}}/><FlickerLabel startMs={cue.each} id={`job-chip-text-${index+1}`} box={{x:box.x+10,y:box.y+9,w:box.w-20,h:26}} size={18} weight={500} lh={1.2} align="center">{job.text}</FlickerLabel></React.Fragment>;})}</div>}
    </div>}
    {ms>=cue.job&&<SceneSource text="Established definitions enter the book directly."/>}
  </StageSceneFrame></KitSound>;
}
