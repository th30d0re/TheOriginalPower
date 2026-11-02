import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {SORTING_FIELD, StageSceneFrame, UsThemSortingField, type SortingMark} from '../shared';
import {Label, SceneSource, lineAttrs, pathFrom, shapeAttrs, type LayoutBox, type Point} from '../d/sceneUtils';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));
const move=(ms:number,at:number,duration=680)=>cubicInOut(progress(ms,at,at+duration));

const FIELD_SCALE=1080/SORTING_FIELD.width;
export const US_THEM_LAYOUT={
  field:{x:420,y:190,w:1080,h:SORTING_FIELD.height*FIELD_SCALE},
  title:{x:120,y:100,w:560,h:40},
  rapid:{x:800,y:100,w:320,h:40},
  prompt:{x:1340,y:100,w:460,h:40},
  bands:{x:720,y:818,w:480,h:40},
  bounded:{x:810,y:866,w:300,h:32},
  chips:{
    trust:{x:120,y:257,w:110,h:40},
    self:{x:100,y:350,w:190,h:40},
    belonging:{x:110,y:480,w:150,h:40},
    reciprocity:{x:100,y:610,w:176,h:40},
    threat:{x:1580,y:480,w:240,h:40},
  },
  source:{x:116,y:968,w:740,h:30},
} as const;

/** Final sorted geometry in frame coordinates. Rows 0–1 and 2–3 of "US" contract into two allied bands; "THEM" forms the third. */
export const US_THEM_GRID={usX:520,themX:1090,columnStep:62,rows:[330,440,560,670],contract:15,markScale:.72} as const;
const MARK_W=44*US_THEM_GRID.markScale*FIELD_SCALE, MARK_H=MARK_W*1.3;

type MarkPath={id:string;group:'ingroup'|'outgroup';column:number;row:number;initialX:number;initialY:number};
const makeMarks=():readonly MarkPath[]=>{
  let seed=231979;
  const next=()=>{
    seed=(seed*48271)%2147483647;
    return seed/2147483647;
  };
  const cells=Array.from({length:48},(_,index)=>index);
  for(let index=cells.length-1;index>0;index--){const swap=Math.floor(next()*(index+1));[cells[index],cells[swap]]=[cells[swap],cells[index]];}
  return Array.from({length:48},(_,index)=>{
    const cell=cells[index];
    return {
      id:`mark-${index+1}`,
      group:index<24?'ingroup':'outgroup',
      column:index%6,row:Math.floor((index%24)/6),
      initialX:500+(cell%8)*131.4+(next()-.5)*16,
      initialY:300+Math.floor(cell/8)*80+(next()-.5)*10,
    };
  });
};
export const US_THEM_MARKS=makeMarks();

const rowY=(row:number,contract:number)=>US_THEM_GRID.rows[row]+(row<2?-1:1)*US_THEM_GRID.contract*contract;
const finalX=(mark:MarkPath)=>(mark.group==='ingroup'?US_THEM_GRID.usX:US_THEM_GRID.themX)+mark.column*US_THEM_GRID.columnStep;
const markCenter=(mark:MarkPath,sort:number,contract:number):Point=>[mark.initialX+(finalX(mark)-mark.initialX)*sort, mark.initialY+(rowY(mark.row,contract)-mark.initialY)*sort];
const markBox=([x,y]:Point):LayoutBox=>({x:x-MARK_W/2,y:y-MARK_H/2,w:MARK_W,h:MARK_H});
const pad=(box:LayoutBox,by:number):LayoutBox=>({x:box.x-by,y:box.y-by,w:box.w+2*by,h:box.h+2*by});
const hull=(boxes:LayoutBox[]):LayoutBox=>{
  const x=Math.min(...boxes.map(box=>box.x)), y=Math.min(...boxes.map(box=>box.y));
  return {x,y,w:Math.max(...boxes.map(box=>box.x+box.w))-x,h:Math.max(...boxes.map(box=>box.y+box.h))-y};
};
/** Converts a frame-coordinate centre into the shared field's fractional mark coordinates (mode "partition"). */
function toFieldMark(mark:MarkPath,[x,y]:Point,partition:number,emphasis:number):SortingMark{
  const direction=mark.group==='ingroup'?-1:1;
  const internalX=(x-US_THEM_LAYOUT.field.x)/FIELD_SCALE-direction*32*partition, internalY=(y-US_THEM_LAYOUT.field.y)/FIELD_SCALE;
  return {id:mark.id,group:mark.group,x:internalX/SORTING_FIELD.width,y:internalY/SORTING_FIELD.height,emphasis,scale:US_THEM_GRID.markScale};
}

function Chip({id,box,text,tone,opacity,leader}:{id:string;box:LayoutBox;text:string;tone:'gold'|'race';opacity:number;leader:Point[]}){
  const ink=tone==='gold'?color('color/fill/gold'):color('color/marker/race');
  return <div data-function-label={id} style={{opacity}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path {...lineAttrs(`${id}-leader`,leader)} d={pathFrom(leader)} fill="none" stroke={ink} strokeWidth="2"/></svg>
    <div {...shapeAttrs(`${id}-chip`,box,'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,boxSizing:'border-box',background:color('color/fill/panel-render'),border:`1px solid ${ink}`}}/>
    <Label id={`${id}-text`} box={{x:box.x+12,y:box.y+7,w:box.w-24,h:box.h-14}} size={20} weight={500} ls={1.1} lh={1.3} align="center" ink={ink}>{text}</Label>
  </div>;
}

export function UsThemSorting({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    social:useCue('t23Social').at,demonstrates:useCue('t23Demonstrates').at,sort:useCue('t23Sort').at,
    us:useCue('t23Us').at,them:useCue('t23Them').at,speed:useCue('t23Speed').at,prompting:useCue('t23Prompting').at,
    sorting:useCue('t24Sorting').at,bands:useCue('t24Bands').at,trust:useCue('t24Trust').at,
    threat:useCue('t24Threat').at,reciprocity:useCue('t24Reciprocity').at,belonging:useCue('t24Belonging').at,selfConcept:useCue('t24SelfConcept').at,
  };
  const fieldP=enter(ms,cue.social,560),pulseP=enter(ms,cue.demonstrates,620),sortP=move(ms,cue.sort,900);
  const usP=enter(ms,cue.us),themP=enter(ms,cue.them),speedP=enter(ms,cue.speed,500),promptP=enter(ms,cue.prompting);
  const contractP=move(ms,cue.sorting),bandsP=enter(ms,cue.bands),trustP=enter(ms,cue.trust,500),threatP=enter(ms,cue.threat,500);
  const reciprocityP=enter(ms,cue.reciprocity,500),belongingP=enter(ms,cue.belonging,540),selfP=enter(ms,cue.selfConcept,540);
  const L=US_THEM_LAYOUT, F=L.field, gold=color('color/fill/gold'), red=color('color/marker/race');
  const centers=US_THEM_MARKS.map(mark=>markCenter(mark,sortP,contractP));
  const boxes=centers.map(markBox);
  const marks=US_THEM_MARKS.map((mark,index)=>toFieldMark(mark,centers[index],sortP,.55+.35*sortP));
  const at=(group:'ingroup'|'outgroup',row:number,column:number)=>centers[US_THEM_MARKS.findIndex(mark=>mark.group===group&&mark.row===row&&mark.column===column)];
  const groupBoxes=(group:'ingroup'|'outgroup',rows:number[])=>boxes.filter((_,index)=>US_THEM_MARKS[index].group===group&&rows.includes(US_THEM_MARKS[index].row));
  const bandFrames=[pad(hull(groupBoxes('ingroup',[0,1])),14),pad(hull(groupBoxes('ingroup',[2,3])),14),pad(hull(groupBoxes('outgroup',[0,1,2,3])),14)];
  const wrap=pad(hull(groupBoxes('ingroup',[0,1,2,3])),21);
  const partitionTop=F.y+(26+180*(1-sortP))*FIELD_SCALE, partitionBottom=F.y+F.h-(26+180*(1-sortP))*FIELD_SCALE;
  const usLabel={x:F.x+34*FIELD_SCALE,y:F.y+24*FIELD_SCALE,w:2*(12+1.2)*FIELD_SCALE+2,h:38};
  const themW=4*(12+1.2)*FIELD_SCALE+2, themLabel={x:F.x+F.w-34*FIELD_SCALE-themW,y:F.y+24*FIELD_SCALE,w:themW,h:38};
  const trustA=at('ingroup',0,0), trustB=at('ingroup',0,1), self=at('ingroup',1,2), recipA=at('ingroup',2,1), recipB=at('ingroup',2,4);
  const trustY=trustA[1]-MARK_H/2+2, ring={x:self[0]-31,y:self[1]-40,w:62,h:80};
  const recipY=[(recipA[1]+MARK_H/2+at('ingroup',3,1)[1]-MARK_H/2)/2-10,(recipA[1]+MARK_H/2+at('ingroup',3,1)[1]-MARK_H/2)/2+10];
  const threat:Point[]=[[1446,290],[1471,395],[1478,500],[1471,605],[1446,710]];
  const allianceX=760, alliance:Point[]=[[allianceX,bandFrames[0].y+bandFrames[0].h],[allianceX,bandFrames[1].y]];
  const C=L.chips;
  return <StageSceneFrame segment={segment}>
    {ms>=cue.social&&<>
      <Label id="social-title" box={L.title} size={24} ls={1.5} opacity={fieldP}>SOCIAL IDENTITY THEORY</Label>
      <div data-sorting-field-wrap="true" {...shapeAttrs('sorting-field',F,'frame')} style={{position:'absolute',left:F.x,top:F.y,width:SORTING_FIELD.width,height:SORTING_FIELD.height,transform:`scale(${FIELD_SCALE})`,transformOrigin:'left top',opacity:fieldP}}>
        <UsThemSortingField marks={marks} partitionProgress={sortP} ingroupProgress={usP} outgroupProgress={themP} labels={{ingroup:'US',outgroup:'THEM'}} mode="partition"/>
        {boxes.map((box,index)=><i key={index} data-mark-box={index+1} {...shapeAttrs(`person-${index+1}`,box,'mark','person')} style={{position:'absolute',left:0,top:0}}/>)}
        {usP>0&&<i {...textAttrsFor('us-title',usLabel)} style={{position:'absolute',left:0,top:0,opacity:usP}}/>}
        {themP>0&&<i {...textAttrsFor('them-title',themLabel)} style={{position:'absolute',left:0,top:0,opacity:themP}}/>}
        {sortP>0&&<i {...lineAttrs('partition',[[960,partitionTop],[960,partitionBottom]])} style={{position:'absolute',left:0,top:0,opacity:sortP}}/>}
      </div>
      {ms>=cue.sort&&<div data-sort-motion="true" style={{display:'none'}}/>}
      <SceneSource text="Tajfel & Turner 1979" opacity={fieldP}/>
    </>}

    {ms>=cue.demonstrates&&<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      <path data-categorization-pulse="true" {...lineAttrs('pulse',[[440,500],[1480,500]])} d="M440 500H1480" stroke={gold} strokeWidth="5" pathLength="1" strokeDasharray=".08 .92" strokeDashoffset={1-pulseP} opacity={pulseP*(1-contractP)}/>
      {ms>=cue.speed&&<path data-rapid-trace="true" {...lineAttrs('rapid-trace',[[800,150],[1120,150]])} d="M800 150H1120" stroke={gold} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-speedP}/>}
      {ms>=cue.sorting&&bandFrames.map((band,index)=><rect key={index} data-band={index+1} {...shapeAttrs(`band-${index+1}`,band,'frame')} x={band.x} y={band.y} width={band.w} height={band.h} rx="34" fill={color('color/fill/gold-wash')} fillOpacity=".35" stroke={index<2?gold:red} strokeWidth="3" opacity={contractP}/>)}
      {ms>=cue.sorting&&<path data-alliance-link="true" {...lineAttrs('alliance',alliance)} d={pathFrom(alliance)} stroke={gold} strokeWidth="5" strokeDasharray="8 6" opacity={contractP}/>}
      {ms>=cue.trust&&<path data-trust-bridge="true" {...lineAttrs('trust-bridge',[[trustA[0],trustY],[(trustA[0]+trustB[0])/2,trustY-10],[trustB[0],trustY]])} d={`M${trustA[0]} ${trustY}Q${(trustA[0]+trustB[0])/2} ${trustY-20} ${trustB[0]} ${trustY}`} fill="none" stroke={gold} strokeWidth="5" opacity={trustP}/>}
      {ms>=cue.threat&&<path data-threat-arc="true" {...lineAttrs('threat-arc',threat)} d="M1446 290Q1496 500 1446 710" fill="none" stroke={red} strokeWidth="5" pathLength="1" strokeDasharray=".12 .08" strokeDashoffset={1-threatP} opacity={threatP}/>}
      {ms>=cue.reciprocity&&<g data-reciprocity-pair="true" opacity={reciprocityP}>
        <path {...lineAttrs('reciprocity-left',[[recipB[0],recipY[0]],[recipA[0],recipY[0]]])} d={`M${recipB[0]} ${recipY[0]}H${recipA[0]}l14 -9m-14 9 14 9`} fill="none" stroke={gold} strokeWidth="4"/>
        <path {...lineAttrs('reciprocity-right',[[recipA[0],recipY[1]],[recipB[0],recipY[1]]])} d={`M${recipA[0]} ${recipY[1]}H${recipB[0]}l-14 -9m14 9 -14 9`} fill="none" stroke={gold} strokeWidth="4"/>
      </g>}
      {ms>=cue.belonging&&<rect data-belonging-wrap="true" {...shapeAttrs('belonging-wrap',wrap,'frame')} x={wrap.x} y={wrap.y} width={wrap.w} height={wrap.h} rx="44" fill="none" stroke={gold} strokeWidth="6" opacity={belongingP}/>}
      {ms>=cue.selfConcept&&<g data-self-ring="true" opacity={selfP}><ellipse {...shapeAttrs('self-ring',ring,'frame')} cx={self[0]} cy={self[1]} rx="31" ry="40" fill="none" stroke={gold} strokeWidth="4"/></g>}
    </svg>}

    {ms>=cue.speed&&<Label id="rapid" box={L.rapid} size={22} ls={1.4} align="center" ink={gold} opacity={speedP}>RAPID SORTING</Label>}
    {ms>=cue.prompting&&<Label id="prompt" box={L.prompt} size={20} weight={500} ls={1.2} align="right" ink={color('color/text/soft')} opacity={promptP}>MINIMAL PROMPTING</Label>}
    {ms>=cue.bands&&<Label id="bands" box={L.bands} size={28} weight={650} ls={1.2} align="center" opacity={bandsP}>SMALL BANDS + ALLIANCES</Label>}
    {ms>=cue.sorting&&<Label id="bounded" box={L.bounded} size={20} weight={500} ls={1.2} align="center" ink={color('color/text/soft')} opacity={contractP}>BOUNDED GROUPS</Label>}
    {ms>=cue.trust&&<Chip id="trust" box={C.trust} text="TRUST" tone="gold" opacity={trustP} leader={[[C.trust.x+C.trust.w,277],[500,277],[trustA[0]-4,trustY-2]]}/>}
    {ms>=cue.threat&&<Chip id="threat" box={C.threat} text="THREAT DETECTION" tone="race" opacity={threatP} leader={[[C.threat.x,500],[1480,500]]}/>}
    {ms>=cue.reciprocity&&<Chip id="reciprocity" box={C.reciprocity} text="RECIPROCITY" tone="gold" opacity={reciprocityP} leader={[[C.reciprocity.x+C.reciprocity.w,630],[recipA[0]-14,630]]}/>}
    {ms>=cue.belonging&&<Chip id="belonging" box={C.belonging} text="BELONGING" tone="gold" opacity={belongingP} leader={[[C.belonging.x+C.belonging.w,500],[wrap.x,500]]}/>}
    {ms>=cue.selfConcept&&<Chip id="self-concept" box={C.self} text="SELF-CONCEPT" tone="gold" opacity={selfP} leader={[[C.self.x+C.self.w,370],[self[0],370],[self[0],ring.y]]}/>}
  </StageSceneFrame>;
}

/** Audit annotation for text drawn inside the shared field (the "US" and "THEM" titles). */
function textAttrsFor(id:string,box:LayoutBox){
  return {'data-text':id,'data-box':`${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.w.toFixed(1)} ${box.h.toFixed(1)}`};
}
