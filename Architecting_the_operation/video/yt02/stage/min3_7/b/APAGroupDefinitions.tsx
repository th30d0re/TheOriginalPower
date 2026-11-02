import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {DefinitionCard, PersonMark, StageSceneFrame} from '../shared';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=650)=>cubicInOut(progress(ms,at,at+duration));

export const APA_GROUP_LAYOUT={
  definition:{x:110,y:130,w:650,h:790},
  field:{x:830,y:130,w:960,h:790,cx:480,cy:395,r:285},
  tray:{x:900,y:650,w:810,h:205},
  source:{x:116,y:994,w:1688,h:30},
  textBoxes:[
    {id:'definition',x:148,y:168,w:574,h:330},
    {id:'outside',x:1430,y:174,w:310,h:34},
    {id:'detachment',x:1440,y:300,w:250,h:34},
    {id:'competition',x:1425,y:420,w:270,h:34},
    {id:'opposition',x:1425,y:540,w:270,h:34},
    {id:'tray-heading',x:920,y:664,w:770,h:26},
  ],
} as const;

type MarkSpec={id:string;initialX:number;initialY:number;finalX:number;finalY:number;own:boolean;center?:boolean};
const TARGETS=[
  [480,395,true,true],[400,315,true],[500,295,true],[570,355,true],[390,425,true],[470,485,true],[565,475,true],[325,365,true],[345,510,true],
  [735,205,false],[805,245,false],[755,315,false],[850,335,false],[700,285,false],[870,225,false],
  [715,535,false],[790,570,false],[855,525,false],[745,650,false],[835,640,false],[885,590,false],
] as const;
export const APA_MARKS:readonly MarkSpec[]=TARGETS.map((target,index)=>({
  id:`person-${index+1}`,
  initialX:90+(index%7)*128,
  initialY:170+Math.floor(index/7)*205,
  finalX:target[0],
  finalY:target[1],
  own:target[2],
  center:target[3]??false,
}));

const DEFINITIONS={
  ingroup:{
    term:'INGROUP',
    definition:'a social unit in which a person holds membership or psychological identification',
  },
  outgroup:{
    term:'OUTGROUP',
    definition:'a social unit outside a person’s own group membership or identification, toward which that person feels detachment, competition, or opposition',
  },
  bias:{
    term:'INGROUP BIAS',
    definition:'the tendency to favor one’s own group and its members when dividing resources, judging conduct, and explaining behavior',
  },
} as const;

function AllocationTray({resourceP,conductP,behaviorP}:{resourceP:number;conductP:number;behaviorP:number}){
  const L=APA_GROUP_LAYOUT.tray;
  const panels=[
    {label:'DIVIDING RESOURCES',p:resourceP},
    {label:'JUDGING CONDUCT',p:conductP},
    {label:'EXPLAINING BEHAVIOR',p:behaviorP},
  ];
  return <div data-allocation-tray="true" style={{position:'absolute',left:L.x,top:L.y,width:L.w,height:L.h,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,boxSizing:'border-box',padding:'38px 12px 12px',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline-strong')}`,opacity:Math.max(resourceP,conductP,behaviorP)}}>
    <div style={{position:'absolute',left:16,top:10,font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/fill/gold')}}>DERIVED ILLUSTRATION</div>
    {panels.map((panel,index)=>panel.p>0?<div key={panel.label} data-allocation-panel={index+1} style={{position:'relative',overflow:'hidden',border:`1px solid ${color('color/line/hairline')}`,opacity:panel.p}}>
      <div style={{position:'absolute',left:8,right:8,top:8,textAlign:'center',font:'500 20px "IBM Plex Mono"',lineHeight:1.05,color:color('color/text/primary')}}>{panel.label}</div>
      {index===0&&<>
        {Array.from({length:12},(_,token)=>{
          const inward=token<8;
          const x=(inward?26:150)+(token%(inward?4:2))*27;
          const y=70+Math.floor(token/(inward?4:2))*28;
          return <circle key={token} data-resource-route={inward?'inward':'outward'} cx={x} cy={y} r="7" fill={inward?color('color/fill/gold'):color('color/text/muted')}/>;
        })}
        <div style={{position:'absolute',left:22,bottom:8,font:'500 20px "IBM Plex Mono"',color:color('color/fill/gold')}}>8</div>
        <div style={{position:'absolute',right:24,bottom:8,font:'500 20px "IBM Plex Mono"',color:color('color/text/muted')}}>4</div>
      </>}
      {index===1&&<div style={{position:'absolute',left:14,right:14,top:62,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div data-conduct-frame="warm" style={{height:70,display:'grid',placeItems:'center',fontSize:28,color:color('color/text/primary'),border:`3px solid ${color('color/fill/gold')}`}}>≡</div>
        <div data-conduct-frame="cool" style={{height:70,display:'grid',placeItems:'center',fontSize:28,color:color('color/text/primary'),border:`1px solid ${color('color/text/muted')}`}}>≡</div>
      </div>}
      {index===2&&<div style={{position:'absolute',left:14,right:14,top:64,font:'400 20px "IBM Plex Mono"',lineHeight:1.7,color:color('color/text/soft')}}>
        <div><span style={{color:color('color/fill/gold')}}>→</span> favorable</div>
        <div><span style={{color:color('color/text/muted')}}>→</span> situational</div>
      </div>}
    </div>:<div key={panel.label}/>)}
  </div>;
}

export function APAGroupDefinitions({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    baseline:useCue('t19Baseline').at,sort:useCue('t19Sort').at,american19:useCue('t19American').at,
    ingroup:useCue('t19Ingroup').at,membership:useCue('t19Membership').at,identification:useCue('t19Identification').at,
    reference:useCue('t20Reference').at,outgroup:useCue('t20Outgroup').at,outside:useCue('t20Outside').at,
    detachment:useCue('t20Detachment').at,competition:useCue('t20Competition').at,opposition:useCue('t20Opposition').at,
    american21:useCue('t21American').at,bias:useCue('t21Bias').at,tendency:useCue('t21Tendency').at,
    resources:useCue('t21Resources').at,conduct:useCue('t21Conduct').at,behavior:useCue('t21Behavior').at,
  };
  const L=APA_GROUP_LAYOUT;
  const baselineP=enter(ms,cue.baseline,560);
  const sortP=move(ms,cue.sort);
  const boundaryP=enter(ms,cue.ingroup,600);
  const membershipP=enter(ms,cue.membership,520);
  const identificationP=enter(ms,cue.identification,540);
  const outgroupP=enter(ms,cue.outgroup,520);
  const outsideP=enter(ms,cue.outside,560);
  const detachmentP=enter(ms,cue.detachment,500);
  const competitionP=enter(ms,cue.competition,500);
  const oppositionP=enter(ms,cue.opposition,500);
  const biasP=enter(ms,cue.bias,520);
  const tendencyP=enter(ms,cue.tendency,520);
  const resourceP=enter(ms,cue.resources,620);
  const conductP=enter(ms,cue.conduct,520);
  const behaviorP=enter(ms,cue.behavior,520);
  const definitionPhase=ms>=cue.american21?'bias':ms>=cue.reference?'outgroup':ms>=cue.ingroup?'ingroup':null;
  const definition=definitionPhase?DEFINITIONS[definitionPhase]:null;
  const cardAt=definitionPhase==='bias'?cue.american21:definitionPhase==='outgroup'?cue.reference:definitionPhase==='ingroup'?cue.ingroup:cue.american19;
  const cardP=enter(ms,cardAt,520);
  const sourceOn=ms>=cue.american19;
  const ownMarksGold=ms>=cue.bias;
  const outgroupOn=ms>=cue.outgroup;

  return <StageSceneFrame segment={segment}>
    {sourceOn&&<div data-definition-card-wrap="true" style={{position:'absolute',left:L.definition.x,top:L.definition.y,width:L.definition.w,height:L.definition.h}}>
      <DefinitionCard term={definition?.term??''} definition={definition?.definition??''} source="APA Dictionary of Psychology" paraphrased={false} progress={cardP} accent="color/fill/gold"/>
      {definition&&<div data-paraphrased="true" style={{position:'absolute',left:38,top:definitionPhase==='outgroup'?306:252,font:'400 20px "IBM Plex Mono"',color:color('color/text/muted'),opacity:cardP}}>(paraphrased)</div>}
    </div>}

    {ms>=cue.baseline&&<div data-sorting-field="radial" style={{position:'absolute',left:L.field.x,top:L.field.y,width:L.field.w,height:L.field.h,overflow:'hidden',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`,opacity:baselineP}}>
      <svg width={L.field.w} height={L.field.h} viewBox={`0 0 ${L.field.w} ${L.field.h}`} style={{position:'absolute',inset:0}} aria-hidden="true">
        <defs>
          <mask id="apa-exterior-mask"><rect width={L.field.w} height={L.field.h} fill="white"/><circle cx={L.field.cx} cy={L.field.cy} r={L.field.r} fill="black"/></mask>
        </defs>
        {ms>=cue.outside&&<rect data-exterior-shade="true" width={L.field.w} height={L.field.h} fill={color('color/surface/well')} opacity={.5*outsideP} mask="url(#apa-exterior-mask)"/>}
        {ms>=cue.ingroup&&<circle data-group-boundary="true" cx={L.field.cx} cy={L.field.cy} r={L.field.r*boundaryP} fill={color('color/fill/gold-wash')} fillOpacity={.7*boundaryP} stroke={color('color/fill/gold')} strokeWidth="3" opacity={boundaryP}/>}
        {ms>=cue.membership&&APA_MARKS.filter(mark=>mark.own&&!mark.center).map(mark=>{
          const x=mark.initialX+(mark.finalX-mark.initialX)*sortP;
          const y=mark.initialY+(mark.finalY-mark.initialY)*sortP;
          return <line key={`member-${mark.id}`} data-membership-token={mark.id} x1={L.field.cx} y1={L.field.cy} x2={x} y2={y} stroke={color('color/fill/gold')} strokeWidth="1.5" opacity={.55*membershipP}/>;
        })}
        {outgroupOn&&APA_MARKS.filter(mark=>!mark.own).map(mark=>{
          const x=mark.initialX+(mark.finalX-mark.initialX)*sortP;
          const y=mark.initialY+(mark.finalY-mark.initialY)*sortP;
          return <circle key={`outside-${mark.id}`} data-outgroup-outline={mark.id} cx={x} cy={y} r="25" fill="none" stroke={color('color/text/primary')} strokeWidth="2" opacity={outgroupP}/>;
        })}
        {ms>=cue.identification&&<circle data-identification-ring="true" cx={L.field.cx} cy={L.field.cy} r={54+20*identificationP} fill="none" stroke={color('color/line/hairline-strong')} strokeWidth="3" opacity={identificationP}/>}
        {ms>=cue.detachment&&<g opacity={detachmentP}><line x1={L.field.cx+L.field.r} y1={L.field.cy-80} x2="742" y2="278" stroke={color('color/text/muted')} strokeWidth="3"/><path d="M742 278l-16-5 8 15z" fill={color('color/text/muted')}/></g>}
        {ms>=cue.competition&&<g opacity={competitionP} stroke={color('color/marker/race')} strokeWidth="3"><path d="M690 398H830l-14-10m14 10-14 10"/><path d="M830 426H690l14-10m-14 10 14 10"/></g>}
        {ms>=cue.opposition&&<g opacity={oppositionP}><line x1="690" y1="530" x2="850" y2="560" stroke={color('color/marker/race')} strokeWidth="4"/><path d="M690 530l18-8-4 18zM850 560l-18 8 4-18z" fill={color('color/marker/race')}/></g>}
        {ms>=cue.tendency&&<g data-tendency-arrow="true" opacity={tendencyP}><path d="M760 120C675 92 590 110 535 190" fill="none" stroke={color('color/fill/gold')} strokeWidth="6"/><path d="M535 190l1-20 17 10z" fill={color('color/fill/gold')}/></g>}
      </svg>
      {APA_MARKS.map(mark=>{
        const x=mark.initialX+(mark.finalX-mark.initialX)*sortP;
        const y=mark.initialY+(mark.finalY-mark.initialY)*sortP;
        const group=mark.own&&ownMarksGold?'ingroup':'neutral';
        return <PersonMark key={mark.id} x={x} y={y} group={group} emphasis={mark.center?1:.72} scale={mark.center?1.3:1}/>;
      })}
      {ms>=cue.membership&&<div style={{position:'absolute',left:70,top:600,font:'500 20px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/fill/gold'),opacity:membershipP}}>MEMBERSHIP</div>}
      {ms>=cue.identification&&<div style={{position:'absolute',left:70,top:638,font:'500 20px "IBM Plex Mono"',letterSpacing:1.2,color:color('color/fill/gold'),opacity:identificationP}}>PSYCHOLOGICAL IDENTIFICATION</div>}
      {ms>=cue.outside&&<div style={{position:'absolute',right:50,top:44,font:'500 20px "IBM Plex Mono"',letterSpacing:1.1,color:color('color/text/primary'),opacity:outsideP}}>OUTSIDE THE PERSON’S GROUP</div>}
      {ms>=cue.detachment&&<div style={{position:'absolute',right:74,top:165,font:'500 20px "IBM Plex Mono"',color:color('color/text/primary'),opacity:detachmentP}}>DETACHMENT</div>}
      {ms>=cue.competition&&<div style={{position:'absolute',right:68,top:286,font:'500 20px "IBM Plex Mono"',color:color('color/text/primary'),opacity:competitionP}}>COMPETITION</div>}
      {ms>=cue.opposition&&<div style={{position:'absolute',right:78,top:406,font:'500 20px "IBM Plex Mono"',color:color('color/marker/race'),opacity:oppositionP}}>OPPOSITION</div>}
    </div>}

    {ms>=cue.resources&&<AllocationTray resourceP={resourceP} conductP={conductP} behaviorP={behaviorP}/>}
  </StageSceneFrame>;
}
