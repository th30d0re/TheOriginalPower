import React from 'react';
import {cubicInOut,cubicOut,progress,useCue,useStageMs,type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark,StageSceneFrame} from '../shared';
import {Label,lineAttrs,Panel,pathFrom,shapeAttrs,type Box,type Point} from './AuditVisuals';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=650)=>cubicInOut(progress(ms,at,at+duration));

export const APA_GROUP_LAYOUT={
  definition:{x:110,y:190,w:650,h:430},
  field:{x:830,y:130,w:960,h:520,cx:370,cy:250,r:215},
  tray:{x:830,y:690,w:960,h:220},source:{x:116,y:968,w:740,h:30},
} as const;

type MarkSpec={id:string;initialX:number;initialY:number;finalX:number;finalY:number;own:boolean;center?:boolean};
const TARGETS=[
  [370,250,true,true],[300,180,true],[410,160,true],[485,220,true],[290,290,true],[385,335,true],[490,315,true],[220,235,true],[235,365,true],
  [650,150,false],[745,155,false],[840,150,false],[680,215,false],[780,225,false],[870,230,false],
  [650,335,false],[745,350,false],[840,335,false],[680,420,false],[780,430,false],[870,410,false],
] as const;
export const APA_MARKS:readonly MarkSpec[]=TARGETS.map((target,index)=>({id:`person-${index+1}`,initialX:90+(index%7)*128,initialY:110+Math.floor(index/7)*150,finalX:target[0],finalY:target[1],own:target[2],center:target[3]??false}));

const DEFINITIONS={
  ingroup:{term:'INGROUP',definition:'a social unit in which a person holds membership or psychological identification',height:350,bodyH:120},
  outgroup:{term:'OUTGROUP',definition:'a social unit outside a person’s own group membership or identification, toward which that person feels detachment, competition, or opposition',height:430,bodyH:190},
  bias:{term:'INGROUP BIAS',definition:'the tendency to favor one’s own group and its members when dividing resources, judging conduct, and explaining behavior',height:400,bodyH:155},
} as const;
type DefinitionPhase=keyof typeof DEFINITIONS;

function DefinitionPanel({phase,progress:cardP,sourceOnly=false}:{phase:DefinitionPhase|null;progress:number;sourceOnly?:boolean}){
  const L=APA_GROUP_LAYOUT.definition,item=phase?DEFINITIONS[phase]:null,h=item?.height??220,box={x:L.x,y:L.y,w:L.w,h};
  return <div data-definition-card-wrap="true" style={{opacity:cardP}}>
    <Panel id="definition-card" box={box}/><div {...shapeAttrs('definition-accent',{x:box.x,y:box.y,w:5,h:box.h},'mark','definition-accent')} style={{position:'absolute',left:box.x,top:box.y,width:5,height:box.h,background:color('color/fill/gold')}}/>
    {item&&<><Label id="definition-term" box={{x:box.x+38,y:box.y+34,w:box.w-76,h:48}} size={38} weight={650} sans ink={color('color/fill/gold')}>{item.term}</Label><Label id="definition-body" box={{x:box.x+38,y:box.y+98,w:box.w-76,h:item.bodyH}} size={28} weight={400} lh={1.34} sans>{item.definition}</Label></>}
    <Label id="definition-source" box={{x:box.x+38,y:box.y+h-78,w:box.w-76,h:28}} size={20} weight={400} lh={1.3} ink={color('color/text/muted')}>APA Dictionary of Psychology</Label>
    {!sourceOnly&&item&&<Label id="definition-paraphrased" box={{x:box.x+38,y:box.y+h-40,w:box.w-76,h:28}} size={20} weight={400} lh={1.3} ink={color('color/text/muted')}>(paraphrased)</Label>}
  </div>;
}

function AllocationTray({resourceP,conductP,behaviorP}:{resourceP:number;conductP:number;behaviorP:number}){
  const L=APA_GROUP_LAYOUT.tray,p=Math.max(resourceP,conductP,behaviorP),panelW=304;
  const panels=[{label:'DIVIDING RESOURCES',p:resourceP},{label:'JUDGING CONDUCT',p:conductP},{label:'EXPLAINING BEHAVIOR',p:behaviorP}];
  return <div data-allocation-tray="true" style={{opacity:p}}>
    <Panel id="allocation-tray" box={L}/><Label id="tray-heading" box={{x:L.x+18,y:L.y+10,w:420,h:28}} size={20} weight={500} ls={1.1} ink={color('color/fill/gold')}>DERIVED ILLUSTRATION</Label>
    {panels.map((panel,index)=>{const box={x:L.x+12+index*(panelW+10),y:L.y+44,w:panelW,h:164};if(panel.p<=0)return null;return <div key={panel.label} data-allocation-panel={index+1} style={{opacity:panel.p}}><Panel id={`allocation-panel-${index+1}`} box={box}/><Label id={`allocation-label-${index+1}`} box={{x:box.x+8,y:box.y+9,w:box.w-16,h:48}} size={19} weight={500} lh={1.05} align="center">{panel.label}</Label>
      {index===0&&<>{Array.from({length:12},(_,token)=>{const inward=token<8,x=box.x+(inward?34:190)+(token%(inward?4:2))*27,y=box.y+78+Math.floor(token/(inward?4:2))*28;return <circle key={token} data-resource-route={inward?'inward':'outward'} {...shapeAttrs(`resource-${token+1}`,{x:x-7,y:y-7,w:14,h:14},'mark','resource')} cx={x} cy={y} r="7" fill={inward?color('color/fill/gold'):color('color/text/muted')}/>;})}<Label id="resource-eight" box={{x:box.x+22,y:box.y+132,w:30,h:26}} size={20} weight={500} ink={color('color/fill/gold')}>8</Label><Label id="resource-four" box={{x:box.x+250,y:box.y+132,w:30,h:26}} size={20} weight={500} ink={color('color/text/muted')}>4</Label></>}
      {index===1&&<><div data-conduct-frame="warm" {...shapeAttrs('conduct-warm',{x:box.x+18,y:box.y+78,w:118,h:70},'frame')} style={{position:'absolute',left:box.x+18,top:box.y+78,width:118,height:70,border:`3px solid ${color('color/fill/gold')}`}}/><div data-conduct-frame="cool" {...shapeAttrs('conduct-cool',{x:box.x+168,y:box.y+78,w:118,h:70},'frame')} style={{position:'absolute',left:box.x+168,top:box.y+78,width:118,height:70,border:`1px solid ${color('color/text/muted')}`}}/><Label id="conduct-warm-mark" box={{x:box.x+18,y:box.y+91,w:118,h:42}} size={28} weight={500} align="center">≡</Label><Label id="conduct-cool-mark" box={{x:box.x+168,y:box.y+91,w:118,h:42}} size={28} weight={500} align="center">≡</Label></>}
      {index===2&&<><Label id="behavior-favorable" box={{x:box.x+22,y:box.y+80,w:250,h:28}} size={20} weight={400} ink={color('color/fill/gold')}>→ favorable</Label><Label id="behavior-situational" box={{x:box.x+22,y:box.y+118,w:250,h:28}} size={20} weight={400} ink={color('color/text/muted')}>→ situational</Label></>}
    </div>;})}
  </div>;
}

export function APAGroupDefinitions({segment}:SceneProps){
  const ms=useStageMs();
  const cue={baseline:useCue('t19Baseline').at,sort:useCue('t19Sort').at,american19:useCue('t19American').at,ingroup:useCue('t19Ingroup').at,membership:useCue('t19Membership').at,identification:useCue('t19Identification').at,reference:useCue('t20Reference').at,outgroup:useCue('t20Outgroup').at,outside:useCue('t20Outside').at,detachment:useCue('t20Detachment').at,competition:useCue('t20Competition').at,opposition:useCue('t20Opposition').at,american21:useCue('t21American').at,bias:useCue('t21Bias').at,tendency:useCue('t21Tendency').at,resources:useCue('t21Resources').at,conduct:useCue('t21Conduct').at,behavior:useCue('t21Behavior').at};
  const L=APA_GROUP_LAYOUT,baselineP=enter(ms,cue.baseline,560),sortP=move(ms,cue.sort),boundaryP=enter(ms,cue.ingroup,600),membershipP=enter(ms,cue.membership,520),identificationP=enter(ms,cue.identification,540),outgroupP=enter(ms,cue.outgroup,520),outsideP=enter(ms,cue.outside,560),detachmentP=enter(ms,cue.detachment,500),competitionP=enter(ms,cue.competition,500),oppositionP=enter(ms,cue.opposition,500),biasP=enter(ms,cue.bias,520),tendencyP=enter(ms,cue.tendency,520),resourceP=enter(ms,cue.resources,620),conductP=enter(ms,cue.conduct,520),behaviorP=enter(ms,cue.behavior,520);
  const phase:DefinitionPhase|null=ms>=cue.american21?'bias':ms>=cue.reference?'outgroup':ms>=cue.ingroup?'ingroup':null;
  const cardAt=phase==='bias'?cue.american21:phase==='outgroup'?cue.reference:phase==='ingroup'?cue.ingroup:cue.american19,cardP=enter(ms,cardAt,520),biasPhase=ms>=cue.american21;
  const cx=L.field.x+L.field.cx,cy=L.field.y+L.field.cy;
  const boundaryBox={x:cx-L.field.r,y:cy-L.field.r,w:L.field.r*2,h:L.field.r*2};
  const detachmentLine:Point[]=[[cx+L.field.r-22,cy-100],[L.field.x+620,L.field.y+135]],competitionOne:Point[]=[[cx+L.field.r-10,cy+50],[L.field.x+650,cy+50]],competitionTwo:Point[]=[[L.field.x+650,cy+78],[cx+L.field.r-10,cy+78]],oppositionLine:Point[]=[[cx+L.field.r-10,cy+155],[L.field.x+650,cy+180]];
  return <StageSceneFrame segment={segment}>
    {ms>=cue.american19&&<DefinitionPanel phase={phase} progress={cardP} sourceOnly={!phase}/>}
    {ms>=cue.baseline&&<div data-sorting-field="radial" {...shapeAttrs('apa-field',L.field,'frame')} style={{position:'absolute',left:L.field.x,top:L.field.y,width:L.field.w,height:L.field.h,overflow:'hidden',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`,opacity:baselineP}}>
      <svg width={L.field.w} height={L.field.h} viewBox={`0 0 ${L.field.w} ${L.field.h}`} style={{position:'absolute',inset:0}} aria-hidden="true">
        <defs><mask id="apa-exterior-mask"><rect width={L.field.w} height={L.field.h} fill="white"/><circle cx={L.field.cx} cy={L.field.cy} r={L.field.r} fill="black"/></mask></defs>
        {!biasPhase&&ms>=cue.outside&&<rect data-exterior-shade="true" {...shapeAttrs('exterior-shade',L.field,'frame')} width={L.field.w} height={L.field.h} fill={color('color/surface/well')} opacity={.35*outsideP} mask="url(#apa-exterior-mask)"/>}
        {ms>=cue.ingroup&&<circle data-group-boundary="true" {...shapeAttrs('group-boundary',boundaryBox,'frame')} cx={L.field.cx} cy={L.field.cy} r={L.field.r*boundaryP} fill={color('color/fill/gold-wash')} fillOpacity={.7*boundaryP} stroke={color('color/fill/gold')} strokeWidth="3" opacity={boundaryP}/>}
        {!biasPhase&&ms>=cue.membership&&APA_MARKS.filter(mark=>mark.own&&!mark.center).map(mark=>{const x=mark.initialX+(mark.finalX-mark.initialX)*sortP,y=mark.initialY+(mark.finalY-mark.initialY)*sortP,points:Point[]=[[cx,cy],[L.field.x+x,L.field.y+y]];return <line key={mark.id} data-membership-token={mark.id} {...lineAttrs(`membership-${mark.id}`,points)} x1={L.field.cx} y1={L.field.cy} x2={x} y2={y} stroke={color('color/fill/gold')} strokeWidth="1.5" opacity={.55*membershipP}/>;})}
        {ms>=cue.outgroup&&APA_MARKS.filter(mark=>!mark.own).map(mark=>{const x=mark.initialX+(mark.finalX-mark.initialX)*sortP,y=mark.initialY+(mark.finalY-mark.initialY)*sortP;return <circle key={mark.id} data-outgroup-outline={mark.id} cx={x} cy={y} r="25" fill="none" stroke={color('color/text/primary')} strokeWidth="2" opacity={outgroupP}/>;})}
        {!biasPhase&&ms>=cue.identification&&<circle data-identification-ring="true" {...lineAttrs('identification-ring',[[cx-74,cy],[cx,cy-74],[cx+74,cy],[cx,cy+74],[cx-74,cy]])} cx={L.field.cx} cy={L.field.cy} r={54+20*identificationP} fill="none" stroke={color('color/line/hairline-strong')} strokeWidth="3" opacity={identificationP}/>}
        {!biasPhase&&ms>=cue.detachment&&<path {...lineAttrs('detachment-line',detachmentLine)} d={`M${L.field.cx+L.field.r-22} ${L.field.cy-100}L620 135`} stroke={color('color/text/muted')} strokeWidth="3" opacity={detachmentP}/>}
        {!biasPhase&&ms>=cue.competition&&<><path {...lineAttrs('competition-out',competitionOne)} d={`M${L.field.cx+L.field.r-10} ${L.field.cy+50}H650`} stroke={color('color/marker/race')} strokeWidth="3" opacity={competitionP}/><path {...lineAttrs('competition-in',competitionTwo)} d={`M650 ${L.field.cy+78}H${L.field.cx+L.field.r-10}`} stroke={color('color/marker/race')} strokeWidth="3" opacity={competitionP}/></>}
        {!biasPhase&&ms>=cue.opposition&&<path {...lineAttrs('opposition-line',oppositionLine)} d={`M${L.field.cx+L.field.r-10} ${L.field.cy+155}L650 ${L.field.cy+180}`} stroke={color('color/marker/race')} strokeWidth="4" opacity={oppositionP}/>}
        {biasPhase&&ms>=cue.tendency&&<path data-tendency-arrow="true" {...lineAttrs('tendency-arrow',[[L.field.x+780,L.field.y+80],[L.field.x+620,L.field.y+72],[L.field.x+525,L.field.y+160]])} d="M780 80C675 50 585 72 525 160" fill="none" stroke={color('color/fill/gold')} strokeWidth="6" opacity={tendencyP}/>}
      </svg>
      {APA_MARKS.map(mark=>{const x=mark.initialX+(mark.finalX-mark.initialX)*sortP,y=mark.initialY+(mark.finalY-mark.initialY)*sortP,scale=mark.center?1.3:1,size=44*scale,box={x:L.field.x+x-size/2,y:L.field.y+y-size*1.3/2,w:size,h:size*1.3};return <React.Fragment key={mark.id}><PersonMark x={x} y={y} group={mark.own&&ms>=cue.bias?'ingroup':'neutral'} emphasis={mark.center?1:.72} scale={scale}/><i {...shapeAttrs(`person-mark-${mark.id}`,box,'mark','person')} /></React.Fragment>;})}
    </div>}
    {!biasPhase&&ms>=cue.membership&&<><Label id="membership-label" box={{x:870,y:610,w:170,h:28}} size={20} weight={500} ls={1.2} opacity={membershipP} ink={color('color/fill/gold')}>MEMBERSHIP</Label><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path {...lineAttrs('membership-leader',[[1040,624],[1120,595]])} d="M1040 624L1120 595" stroke={color('color/fill/gold')} strokeWidth="2" opacity={membershipP}/></svg></>}
    {!biasPhase&&ms>=cue.identification&&<><Label id="identification-label" box={{x:1080,y:610,w:380,h:28}} size={20} weight={500} ls={1.2} opacity={identificationP} ink={color('color/fill/gold')}>PSYCHOLOGICAL IDENTIFICATION</Label><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path {...lineAttrs('identification-leader',[[1270,610],[1200,595]])} d="M1270 610L1200 595" stroke={color('color/fill/gold')} strokeWidth="2" opacity={identificationP}/></svg></>}
    {!biasPhase&&ms>=cue.outside&&<Label id="outside-label" box={{x:1430,y:155,w:330,h:28}} size={19} weight={500} ls={.8} opacity={outsideP}>OUTSIDE THE PERSON’S GROUP</Label>}
    {!biasPhase&&ms>=cue.detachment&&<Label id="detachment-label" box={{x:1450,y:210,w:210,h:28}} size={20} weight={500} opacity={detachmentP}>DETACHMENT</Label>}
    {!biasPhase&&ms>=cue.competition&&<Label id="competition-label" box={{x:1500,y:390,w:220,h:28}} size={20} weight={500} opacity={competitionP}>COMPETITION</Label>}
    {!biasPhase&&ms>=cue.opposition&&<Label id="opposition-label" box={{x:1510,y:610,w:220,h:28}} size={20} weight={500} opacity={oppositionP} ink={color('color/marker/race')}>OPPOSITION</Label>}
    {ms>=cue.resources&&<AllocationTray resourceP={resourceP} conductP={conductP} behaviorP={behaviorP}/>}
    <div data-bias-progress={biasP.toFixed(3)} style={{display:'none'}}/>
  </StageSceneFrame>;
}
