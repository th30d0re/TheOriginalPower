import React from 'react';
import {cubicOut,progress,useCue,useStageMs,type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../shared';
import {Label,lineAttrs,Panel,pathFrom,shapeAttrs,type Point} from './AuditVisuals';

const enter=(ms:number,at:number,duration=520)=>cubicOut(progress(ms,at,at+duration));

export const TAJFEL_LAYOUT={
  plate:{x:300,y:180,w:1280,h:700},names:{x:420,y:270,w:1080,h:70},year:{x:420,y:420,w:220,h:210},
  title:{x:710,y:410,w:760,h:116},theoryTag:{x:710,y:560,w:420,h:34},relations:{x:710,y:620,w:760,h:72},
  connector:{x1:1580,x2:1820,y:555},
} as const;

export function TajfelCitation({segment}:SceneProps){
  const ms=useStageMs();
  const cue={henri:useCue('t22Henri').at,turner:useCue('t22Turner').at,formalized:useCue('t22Formalized').at,seventyNine:useCue('t22SeventyNine').at,social:useCue('t22Social').at,theory:useCue('t22Theory').at,relations:useCue('t22Relations').at};
  const plateP=enter(ms,cue.henri,620),namesP=enter(ms,cue.henri,500),turnerP=enter(ms,cue.turner,500),ruleP=enter(ms,cue.formalized,560),yearP=enter(ms,cue.seventyNine,520),titleStartP=enter(ms,cue.social,500),titleP=enter(ms,cue.theory,520),relationsP=enter(ms,cue.relations,520),connectorP=enter(ms,cue.relations,620),L=TAJFEL_LAYOUT;
  const rule:Point[]=[[L.names.x,L.names.y+96],[L.year.x+L.year.w/2,L.names.y+96],[L.year.x+L.year.w/2,L.year.y]],connector:Point[]=[[L.connector.x1,L.connector.y],[L.connector.x2,L.connector.y]];
  return <StageSceneFrame segment={segment}>
    {ms>=cue.henri&&<div data-citation-plate="true" style={{opacity:plateP}}>
      <Panel id="citation-plate" box={L.plate}/>
      <Label id="tajfel-names" box={L.names} size={46} weight={650} ls={2} sans opacity={namesP}><span data-names-line="true">{ms>=cue.turner?'HENRI TAJFEL · JOHN C. TURNER':'HENRI TAJFEL'}</span></Label>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true">
        {ms>=cue.formalized&&<path data-formalized-rule="true" {...lineAttrs('formalized-rule',rule)} d={pathFrom(rule)} fill="none" stroke={color('color/fill/gold')} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ruleP}/>}
        {ms>=cue.seventyNine&&<circle data-year-medallion="true" {...shapeAttrs('year-medallion',{x:L.year.x+22,y:L.year.y+17,w:176,h:176},'frame')} cx={L.year.x+L.year.w/2} cy={L.year.y+L.year.h/2} r="88" fill={color('color/fill/gold-wash')} stroke={color('color/fill/gold')} strokeWidth="3" opacity={yearP}/>}
      </svg>
      {ms>=cue.seventyNine&&<Label id="tajfel-year" box={{x:L.year.x+30,y:L.year.y+70,w:L.year.w-60,h:62}} size={48} weight={600} align="center" opacity={yearP}>1979</Label>}
      {ms>=cue.social&&<Label id="tajfel-title" box={L.title} size={43} weight={650} ls={1.3} lh={1.24} sans opacity={titleStartP}><span data-title-block="true">{ms>=cue.theory?'AN INTEGRATIVE THEORY OF INTERGROUP CONFLICT':'AN INTEGRATIVE'}</span></Label>}
      {ms>=cue.theory&&<Label id="social-identity-tag" box={L.theoryTag} size={22} weight={500} ls={1.4} opacity={titleP} ink={color('color/fill/gold')}>SOCIAL IDENTITY THEORY</Label>}
      {ms>=cue.relations&&<Label id="relations-source" box={L.relations} size={24} weight={400} lh={1.35} sans opacity={relationsP}>in <em>The Social Psychology of Intergroup Relations</em>, ed. Austin &amp; Worchel</Label>}
      <div data-author-progress={turnerP.toFixed(3)} style={{display:'none'}}/>
    </div>}
    {ms>=cue.relations&&<svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true"><path data-outgoing-connector="true" {...lineAttrs('outgoing-connector',connector)} d={pathFrom(connector)} stroke={color('color/fill/gold')} strokeWidth="4" opacity={connectorP}/><path {...shapeAttrs('connector-arrowhead',{x:L.connector.x2-18,y:L.connector.y-12,w:18,h:24},'mark','connector')} d={`M${L.connector.x2-18} ${L.connector.y-12}L${L.connector.x2} ${L.connector.y}L${L.connector.x2-18} ${L.connector.y+12}Z`} fill={color('color/fill/gold')} opacity={connectorP}/></svg>}
  </StageSceneFrame>;
}
