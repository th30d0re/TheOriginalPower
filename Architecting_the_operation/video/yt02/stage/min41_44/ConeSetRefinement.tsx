import React from 'react';
import {DrawRect, Flicker, color, useCue, type SceneProps} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';
import {frame, Scene} from './shared';

export function ConeSetRefinement({segment}:SceneProps) {
  const c={extend:useCue('t197Extend').at,five:useCue('t197Five').at,equation:useCue('t197Equation').at,outgroup:useCue('t197Outgroup').at,disjoint:useCue('t198Disjoint').at};
  return <Scene segment={segment}><DrawRect box={{x:190,y:75,w:1540,h:930}} startFrame={frame(c.extend)} durationFrames={22} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Flicker startFrame={frame(c.five)} durationFrames={16} beat><div data-text="cone-set-refinement" data-box="260 105 1400 45" style={{position:'absolute',left:260,top:105,width:1400,height:45,font:'500 30px "IBM Plex Sans"',color:color('color/text/primary'),textAlign:'center'}}>SET REFINEMENT ACROSS FIVE TIERS</div></Flicker>
    <div style={{position:'absolute',left:330,top:170,width:1260,height:760}}><ConeOnly width={1260} height={760} model={{el:22,az:-28}}/></div>
    <Flicker startFrame={frame(c.outgroup)} durationFrames={15} beat><div data-text="cone-outgroup" data-box="610 926 700 32" style={{position:'absolute',left:610,top:926,width:700,height:32,font:'500 22px "IBM Plex Mono"',color:'#d6ac4b',textAlign:'center'}}>Eq. 2.3 · O AT THE BASE</div></Flicker>
  </Scene>;
}
