import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame, TrainingTextStrip} from '../shared';
import {FadeIn, MiniNetwork, Panel, enter, type LayoutBox} from './sceneUtils';

export const COMPUTATIONAL_BIAS_LAYOUT = {
  header:{x:150,y:100,w:1620,h:90}, left:{x:120,y:235,w:790,h:665}, right:{x:1010,y:235,w:790,h:665},
  leftNetwork:{x:225,y:365,w:580,h:355}, rightText:{x:1085,y:330,w:275,h:475}, rightNetwork:{x:1420,y:340,w:305,h:450},
} as const satisfies Record<string,LayoutBox>;

export const COMPUTATIONAL_BIAS_TEXT_BOXES = [
  COMPUTATIONAL_BIAS_LAYOUT.header,{x:150,y:258,w:730,h:54},{x:1040,y:258,w:730,h:54},
  {x:150,y:796,w:730,h:56},{x:1040,y:820,w:730,h:56},
] as const;

export function ComputationalBias({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={computer:useCue('t32Computer'),two:useCue('t32Two'),neural:useCue('t32Neural'),bias:useCue('t32BiasTerm'),offset:useCue('t32Offset'),layer:useCue('t32Layer'),social:useCue('t32Social'),biasSocial:useCue('t32BiasSocial'),weights:useCue('t32Weights'),repeats:useCue('t32Repeats')};
  const L=COMPUTATIONAL_BIAS_LAYOUT, networkP=enter(ms,cue.neural.at,600), offsetP=enter(ms,cue.offset.at,600), weightsP=enter(ms,cue.weights.at,650);
  const tokens=['history','group','pattern','history','group','pattern'];
  return <StageSceneFrame segment={segment} source="The Original Power · neural systems and learned priors">
    {ms>=cue.computer.at && <FadeIn ms={ms} at={cue.computer.at} style={{position:'absolute',...L.header,font:'600 40px "IBM Plex Mono"',letterSpacing:1.2}} dataBeat="t32Computer">COMPUTER SCIENCE · TWO USES OF BIAS</FadeIn>}
    {ms>=cue.two.at && <><Panel box={L.left} dataPanel="numerical-bias"/><Panel box={L.right} dataPanel="social-bias"/><div data-divider="true" style={{position:'absolute',left:960,top:235,width:1,height:665,background:color('color/line/hairline'),opacity:enter(ms,cue.two.at)}}/></>}
    {ms>=cue.neural.at && <MiniNetwork x={L.leftNetwork.x} y={L.leftNetwork.y} w={L.leftNetwork.w} h={L.leftNetwork.h} progress={networkP} hot={offsetP>.5}/>} 
    {ms>=cue.bias.at && <>
      <FadeIn ms={ms} at={cue.bias.at} style={{position:'absolute',left:150,top:258,width:730,textAlign:'center',font:'700 26px "IBM Plex Mono"',color:color('color/fill/gold')}} dataBeat="t32BiasTerm">NEURAL-NETWORK BIAS TERM</FadeIn>
      <FadeIn ms={ms} at={cue.bias.at} style={{position:'absolute',left:145,top:520,width:150,textAlign:'center',font:'600 20px "IBM Plex Mono"',color:color('color/text/accent')}}>CONSTANT INPUT</FadeIn>
    </>}
    {ms>=cue.offset.at && <>
      <FadeIn ms={ms} at={cue.offset.at} style={{position:'absolute',left:150,top:796,width:730,textAlign:'center',font:'600 25px "IBM Plex Mono"',color:color('color/text/soft')}} dataBeat="t32Offset">NUMERICAL OFFSET IN EACH LAYER</FadeIn>
      {[0,1,2,3].map((layer)=><div key={layer} data-offset-trace={layer+1} style={{position:'absolute',left:250+layer*170,top:746-offsetP*36,width:88,height:4,background:color('color/text/accent'),opacity:offsetP}}/>)}
    </>}
    {ms>=cue.layer.at && [1,2,3,4].map((layer,index)=><FadeIn key={layer} ms={ms} at={cue.layer.at+index*80} style={{position:'absolute',left:200+index*170,top:328,width:125,textAlign:'center',font:'500 20px "IBM Plex Mono"',color:color('color/fill/gold')}} dataBeat={index===0?'t32Layer':undefined}>{`LAYER ${layer}`}</FadeIn>)}
    {ms>=cue.social.at && <FadeIn ms={ms} at={cue.social.at} style={{position:'absolute',left:1040,top:258,width:730,textAlign:'center',font:'700 26px "IBM Plex Mono"',color:color('color/fill/gold')}} dataBeat="t32Social">SOCIAL BIAS IN LANGUAGE MODELS</FadeIn>}
    {ms>=cue.biasSocial.at && <>
      <div style={{position:'absolute',...L.rightText,display:'grid',gap:14,alignContent:'start'}}>{[0,1,2].map(index=><TrainingTextStrip key={index} tokens={tokens.slice(index,index+4)} patternKey={`human-pattern-${index}`} progress={enter(ms,cue.biasSocial.at+index*150,500)} emphasis="pattern"/>)}</div>
      <MiniNetwork x={L.rightNetwork.x} y={L.rightNetwork.y} w={L.rightNetwork.w} h={L.rightNetwork.h} progress={enter(ms,cue.biasSocial.at,550)} hot={weightsP>.05}/>
      <FadeIn ms={ms} at={cue.biasSocial.at} style={{position:'absolute',left:1040,top:820,width:730,textAlign:'center',font:'600 24px "IBM Plex Mono"',color:color('color/text/soft')}} dataBeat="t32BiasSocial">PATTERNS IN TRAINING TEXT</FadeIn>
    </>}
    {ms>=cue.weights.at && <FadeIn ms={ms} at={cue.weights.at} style={{position:'absolute',left:1410,top:760,width:330,textAlign:'center',font:'600 22px "IBM Plex Mono"',color:color('color/text/accent')}} dataBeat="t32Weights">WEIGHTS TRAINED ON HUMAN TEXT</FadeIn>}
    {ms>=cue.repeats.at && <FadeIn ms={ms} at={cue.repeats.at} style={{position:'absolute',left:1120,top:878,width:570,textAlign:'center',font:'700 24px "IBM Plex Mono"',color:color('color/fill/gold')}} dataBeat="t32Repeats">REPEATED PATTERN</FadeIn>}
  </StageSceneFrame>;
}
