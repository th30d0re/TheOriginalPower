import React from 'react';
import {useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame, TrainingTextStrip} from '../shared';
import {Label, MiniNetwork, Panel, SceneSource, enter, lineAttrs, miniNetworkPoints, pathFrom, shapeAttrs, type LayoutBox, type Point} from './sceneUtils';

export const COMPUTATIONAL_BIAS_LAYOUT = {
  header:{x:150,y:108,w:1620,h:48}, left:{x:120,y:235,w:790,h:665}, right:{x:1010,y:235,w:790,h:665},
  leftNetwork:{x:225,y:365,w:580,h:355}, rightText:{x:1040,y:330,w:340,h:300}, rightNetwork:{x:1440,y:330,w:300,h:300},
  outputs:{x:1060,y:700,w:660,h:92},
} as const satisfies Record<string,LayoutBox>;

export const COMPUTATIONAL_BIAS_TEXT = {
  leftTitle:{x:150,y:258,w:730,h:40}, rightTitle:{x:1040,y:258,w:730,h:40},
  constant:{x:140,y:762,w:200,h:28}, offset:{x:150,y:830,w:730,h:34},
  patterns:{x:1040,y:646,w:340,h:28}, weights:{x:1420,y:646,w:350,h:28}, repeated:{x:1040,y:810,w:730,h:34},
} as const satisfies Record<string,LayoutBox>;

/** Screen-space activation offset at full sweep (storyboard: zero to 36 px, same for every layer). */
export const LAYER_OFFSET_PX = 36;
const CONSTANT_NODE = {x:180,y:740,r:12} as const;
const STRIP_TOKENS = [['group','pattern'],['history','pattern'],['pattern','group']] as const;
const STRIP_HEIGHT = 92, STRIP_GAP = 12;
const OUTPUT_STRIPS = [0,1,2].map(index=>({x:1060+index*230,y:700,w:200,h:92}));

export function ComputationalBias({segment}:SceneProps) {
  const ms=useStageMs();
  const cue={computer:useCue('t32Computer'),two:useCue('t32Two'),neural:useCue('t32Neural'),bias:useCue('t32BiasTerm'),offset:useCue('t32Offset'),layer:useCue('t32Layer'),social:useCue('t32Social'),biasSocial:useCue('t32BiasSocial'),weights:useCue('t32Weights'),repeats:useCue('t32Repeats')};
  const L=COMPUTATIONAL_BIAS_LAYOUT, T=COMPUTATIONAL_BIAS_TEXT;
  const networkP=enter(ms,cue.neural.at,600), biasP=enter(ms,cue.bias.at), offsetP=enter(ms,cue.offset.at,600), layerP=enter(ms,cue.layer.at), weightsP=enter(ms,cue.weights.at,650);
  const gold=color('color/fill/gold'), accent=color('color/text/accent'), soft=color('color/text/soft');
  const leftLayers=miniNetworkPoints(L.leftNetwork.x,L.leftNetwork.y,L.leftNetwork.w,L.leftNetwork.h);
  const rightLayers=miniNetworkPoints(L.rightNetwork.x,L.rightNetwork.y,L.rightNetwork.w,L.rightNetwork.h);
  const layerX=leftLayers.map(layer=>layer[0].x);
  const constantBus:Point[]=[[CONSTANT_NODE.x+CONSTANT_NODE.r,CONSTANT_NODE.y],[layerX[3],CONSTANT_NODE.y]];
  const stubs=leftLayers.map(layer=>[[layer[0].x,CONSTANT_NODE.y],[layer[0].x,layer[layer.length-1].y+12]] as Point[]);
  const feeds=[0,1,2].map(index=>[[L.rightText.x+L.rightText.w,L.rightText.y+index*(STRIP_HEIGHT+STRIP_GAP)+STRIP_HEIGHT/2],[rightLayers[0][index].x-12,rightLayers[0][index].y]] as Point[]);
  const lastLayer=rightLayers[rightLayers.length-1];
  const emit:Point[]=[[lastLayer[1].x+12,lastLayer[1].y],[1786,lastLayer[1].y],[1786,686],[OUTPUT_STRIPS[2].x+100,686],[OUTPUT_STRIPS[2].x+100,OUTPUT_STRIPS[2].y]];
  return <StageSceneFrame segment={segment}>
    {ms>=cue.computer.at && <Label id="header" box={L.header} size={36} ls={1.2} align="center" opacity={enter(ms,cue.computer.at)}><span data-beat="t32Computer">COMPUTER SCIENCE · TWO USES OF BIAS</span></Label>}
    {ms>=cue.two.at && <>
      <Panel box={L.left} id="left-panel" dataPanel="numerical-bias" style={{opacity:enter(ms,cue.two.at)}}/>
      <Panel box={L.right} id="right-panel" dataPanel="social-bias" style={{opacity:enter(ms,cue.two.at)}}/>
      <div data-divider="true" {...lineAttrs('divider',[[960,235],[960,900]])} style={{position:'absolute',left:960,top:235,width:1,height:665,background:color('color/line/hairline'),opacity:enter(ms,cue.two.at)}}/>
    </>}

    {ms>=cue.neural.at && <MiniNetwork id="left-network" x={L.leftNetwork.x} y={L.leftNetwork.y} w={L.leftNetwork.w} h={L.leftNetwork.h} progress={networkP} hot={offsetP>.5}/>}
    {ms>=cue.bias.at && <>
      <Label id="left-title" box={T.leftTitle} size={26} weight={700} ls={0} align="center" ink={gold} opacity={biasP}><span data-beat="t32BiasTerm">NEURAL-NETWORK BIAS TERM</span></Label>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={biasP}>
        <path {...lineAttrs('constant-bus',constantBus)} d={pathFrom(constantBus)} fill="none" stroke={accent} strokeWidth="3"/>
        {stubs.map((stub,index)=><path key={index} data-constant-link={index+1} {...lineAttrs(`constant-link-${index+1}`,stub)} d={pathFrom(stub)} fill="none" stroke={accent} strokeWidth="2" strokeDasharray="6 6"/>)}
        <circle data-constant-node="true" {...shapeAttrs('constant-node',{x:CONSTANT_NODE.x-CONSTANT_NODE.r,y:CONSTANT_NODE.y-CONSTANT_NODE.r,w:2*CONSTANT_NODE.r,h:2*CONSTANT_NODE.r},'mark')} cx={CONSTANT_NODE.x} cy={CONSTANT_NODE.y} r={CONSTANT_NODE.r} fill={accent}/>
      </svg>
      <Label id="constant-input" box={T.constant} size={20} ls={0} ink={accent} opacity={biasP}>CONSTANT INPUT</Label>
    </>}
    {ms>=cue.offset.at && <>
      <Label id="offset" box={T.offset} size={24} ls={0} align="center" ink={soft} opacity={offsetP}><span data-beat="t32Offset">NUMERICAL OFFSET IN EACH LAYER</span></Label>
      {layerX.map((x,index)=>{
        const box={x:x+16,y:712-offsetP*LAYER_OFFSET_PX,w:60,h:4};
        return <div key={index} data-offset-trace={index+1} {...shapeAttrs(`offset-trace-${index+1}`,box,'mark','offset')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,background:layerP>0?gold:accent,boxShadow:layerP>0?`0 0 0 ${3*layerP}px ${color('color/fill/gold-wash')}`:undefined,opacity:offsetP}}/>;
      })}
    </>}
    {ms>=cue.layer.at && layerX.map((x,index)=><Label key={index} id={`layer-${index+1}`} box={{x:x-62,y:318,w:124,h:28}} size={20} weight={500} ls={0} align="center" ink={gold} opacity={enter(ms,cue.layer.at+index*80)}><span data-beat={index===0?'t32Layer':undefined}>{`LAYER ${index+1}`}</span></Label>)}

    {ms>=cue.social.at && <Label id="right-title" box={T.rightTitle} size={26} weight={700} ls={0} align="center" ink={gold} opacity={enter(ms,cue.social.at)}><span data-beat="t32Social">SOCIAL BIAS IN LANGUAGE MODELS</span></Label>}
    {ms>=cue.biasSocial.at && <>
      {STRIP_TOKENS.map((tokens,index)=>{
        const box={x:L.rightText.x,y:L.rightText.y+index*(STRIP_HEIGHT+STRIP_GAP),w:L.rightText.w,h:STRIP_HEIGHT};
        return <div key={index} data-input-strip={index+1} {...shapeAttrs(`input-strip-${index+1}`,box,'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h}}><TrainingTextStrip tokens={tokens} patternKey={`human-pattern-${index}`} progress={enter(ms,cue.biasSocial.at+index*150,500)} emphasis="pattern"/></div>;
      })}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={enter(ms,cue.biasSocial.at,550)}>
        {feeds.map((feed,index)=><path key={index} {...lineAttrs(`feed-${index+1}`,feed)} d={pathFrom(feed)} fill="none" stroke={color('color/line/wire')} strokeWidth="2"/>)}
      </svg>
      <MiniNetwork id="right-network" x={L.rightNetwork.x} y={L.rightNetwork.y} w={L.rightNetwork.w} h={L.rightNetwork.h} progress={enter(ms,cue.biasSocial.at,550)} hot={weightsP>.05}/>
      <Label id="patterns" box={T.patterns} size={20} ls={0} align="center" ink={soft} opacity={enter(ms,cue.biasSocial.at)}><span data-beat="t32BiasSocial">PATTERNS IN TRAINING TEXT</span></Label>
    </>}
    {ms>=cue.weights.at && <Label id="weights" box={T.weights} size={20} ls={0} align="center" ink={accent} opacity={weightsP}><span data-beat="t32Weights">WEIGHTS TRAINED ON HUMAN TEXT</span></Label>}
    {ms>=cue.repeats.at && <>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} aria-hidden="true" opacity={enter(ms,cue.repeats.at)}><path {...lineAttrs('emit',emit)} d={pathFrom(emit)} fill="none" stroke={gold} strokeWidth="3"/></svg>
      {OUTPUT_STRIPS.map((box,index)=><div key={index} data-output-strip={index+1} {...shapeAttrs(`output-strip-${index+1}`,box,'frame')} style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h}}><TrainingTextStrip tokens={['pattern']} patternKey={`repeated-pattern-${index}`} progress={enter(ms,cue.repeats.at+index*120,450)} emphasis="pattern"/></div>)}
      <Label id="repeated" box={T.repeated} size={24} weight={700} ls={0} align="center" ink={gold} opacity={enter(ms,cue.repeats.at)}><span data-beat="t32Repeats">REPEATED PATTERN</span></Label>
    </>}
    <SceneSource text="The Original Power · neural systems and learned priors" opacity={enter(ms,segment.start_ms,400)}/>
  </StageSceneFrame>;
}
