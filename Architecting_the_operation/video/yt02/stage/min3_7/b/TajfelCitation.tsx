import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {CitationCard, StageSceneFrame} from '../shared';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));

export const TAJFEL_LAYOUT={
  plate:{x:330,y:190,w:1260,h:660},
  names:{x:440,y:290,w:1040,h:80},
  year:{x:440,y:440,w:220,h:210},
  title:{x:720,y:430,w:750,h:250},
  connector:{x1:1470,x2:1780,y:555},
} as const;

export function TajfelCitation({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={
    henri:useCue('t22Henri').at,
    turner:useCue('t22Turner').at,
    formalized:useCue('t22Formalized').at,
    seventyNine:useCue('t22SeventyNine').at,
    social:useCue('t22Social').at,
    theory:useCue('t22Theory').at,
    relations:useCue('t22Relations').at,
  };
  const plateP=enter(ms,cue.henri,620);
  const namesP=enter(ms,cue.henri,500);
  const turnerP=enter(ms,cue.turner,500);
  const ruleP=enter(ms,cue.formalized,560);
  const yearP=enter(ms,cue.seventyNine,520);
  const titleStartP=enter(ms,cue.social,500);
  const titleP=enter(ms,cue.theory,520);
  const connectorP=enter(ms,cue.relations,620);
  const L=TAJFEL_LAYOUT;
  return <StageSceneFrame segment={segment}>
    {ms>=cue.henri&&<div data-citation-plate="true" style={{position:'absolute',left:L.plate.x,top:L.plate.y,width:L.plate.w,height:L.plate.h,opacity:plateP}}>
      <CitationCard authors="" year="" title="" progress={plateP}/>
      <div data-names-line="true" style={{position:'absolute',left:L.names.x-L.plate.x,top:L.names.y-L.plate.y,width:L.names.w,height:L.names.h,fontSize:46,lineHeight:1.2,fontWeight:650,letterSpacing:2,color:color('color/text/primary'),opacity:namesP}}>
        {ms>=cue.turner?'HENRI TAJFEL · JOHN C. TURNER':'HENRI TAJFEL'}
      </div>
      <svg width={L.plate.w} height={L.plate.h} viewBox={`0 0 ${L.plate.w} ${L.plate.h}`} style={{position:'absolute',inset:0}} aria-hidden="true">
        {ms>=cue.formalized&&<path data-formalized-rule="true" d={`M${L.names.x-L.plate.x} ${L.names.y-L.plate.y+96}H${L.year.x-L.plate.x+L.year.w/2}V${L.year.y-L.plate.y}`} fill="none" stroke={color('color/fill/gold')} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ruleP}/>}
        {ms>=cue.seventyNine&&<circle data-year-medallion="true" cx={L.year.x-L.plate.x+L.year.w/2} cy={L.year.y-L.plate.y+L.year.h/2} r="88" fill={color('color/fill/gold-wash')} stroke={color('color/fill/gold')} strokeWidth="3" opacity={yearP}/>}
      </svg>
      {ms>=cue.seventyNine&&<div style={{position:'absolute',left:L.year.x-L.plate.x,top:L.year.y-L.plate.y+70,width:L.year.w,textAlign:'center',font:'600 48px "IBM Plex Mono"',color:color('color/text/primary'),opacity:yearP}}>1979</div>}
      {ms>=cue.social&&<div data-title-block="true" style={{position:'absolute',left:L.title.x-L.plate.x,top:L.title.y-L.plate.y,width:L.title.w,height:L.title.h,display:'flex',alignItems:'center',fontSize:43,lineHeight:1.24,fontWeight:650,letterSpacing:1.3,color:color('color/text/primary'),opacity:titleStartP}}>
        {ms>=cue.theory?'AN INTEGRATIVE THEORY OF INTERGROUP CONFLICT':'AN INTEGRATIVE'}
      </div>}
      <div data-author-progress={turnerP.toFixed(3)} style={{display:'none'}}/>
    </div>}
    {ms>=cue.relations&&<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
      <path data-outgoing-connector="true" d={`M${L.connector.x1} ${L.connector.y}H${L.connector.x2}`} stroke={color('color/fill/gold')} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-connectorP}/>
      <path d={`M${L.connector.x2} ${L.connector.y}l-18-12v24z`} fill={color('color/fill/gold')} opacity={connectorP}/>
    </svg>}
  </StageSceneFrame>;
}
