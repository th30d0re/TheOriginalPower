import React from 'react';
import {DrawLine, FitBox, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

const eq=[{term:'L' as const},{text:" q'' + "},{term:'R' as const},{text:" q' + (1/"},{term:'C' as const},{text:') q = '},{term:'V' as const}];
export function RlcResponse({segment}:SceneProps) {
  const ms=useStageMs(); const c={equation:useCue('t192Equation').at,rlc:useCue('t192Rlc').at,inertia:useCue('t192Inertia').at,resistance:useCue('t192Resistance').at,capacitance:useCue('t192Capacitance').at,shock:useCue('t193Shock').at,baseline:useCue('t193Baseline').at,damped:useCue('t193Damped').at,raising:useCue('t194Raising').at,inductance:useCue('t195Inductance').at,stores:useCue('t195Stores').at};
  const curve=Array.from({length:61},(_,i)=>{const x=880+i*14; const t=i/60; return [x,655-Math.exp(-3.2*t)*150*Math.sin(t*7*Math.PI)] as [number,number];});
  return <Scene segment={segment}>
    <Panel box={{x:120,y:100,w:1680,h:96}} at={c.equation}/><Copy at={c.equation} box={{x:150,y:124,w:620,h:40}} size={30}>EQ. 2.11 · DYNAMIC RESPONSE</Copy><Copy at={c.rlc} box={{x:1180,y:130,w:580,h:30}} size={21} tone="color/fill/gold" align="right">SERIES RLC MODEL</Copy>
    <Panel box={{x:120,y:250,w:650,h:610}} at={c.rlc}/><FitBox text="REFORM SHOCK" x={160} y={290} size={28} weight={600} tag="INPUT" startFrame={frame(c.shock)} durationFrames={15} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <DrawLine points={[[210,445],[670,445]]} startFrame={frame(c.shock)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={7} end="arrow" beat/>
    <Copy at={c.inertia} box={{x:175,y:535,w:520,h:40}} size={28}>L · CULTURAL INERTIA</Copy><Copy at={c.resistance} box={{x:175,y:610,w:520,h:40}} size={28}>R · CARCERAL RESISTANCE</Copy><Copy at={c.capacitance} box={{x:175,y:685,w:520,h:40}} size={28}>C · REFORM ABSORPTION</Copy>
    <Panel box={{x:820,y:250,w:980,h:610}} at={c.damped}/><EquationTerms equation="Eq. 2.11" ms={ms} box={{x:900,y:315,w:820,h:70}} fontSize={42} align="center" tokens={eq} pulses={{L:[c.inertia,c.inductance],R:[c.resistance,c.raising],C:[c.capacitance,c.stores],V:[c.shock]}}/>
    <Copy at={c.baseline} box={{x:920,y:465,w:760,h:32}} size={22} tone="color/text/soft" align="center">PRE-SHOCK EXTRACTION BASELINE</Copy><DrawLine points={[[880,655],[1740,655]]} startFrame={frame(c.baseline)} durationFrames={14} strokeToken="color/line/wire" strokeWidth={2}/><DrawLine points={curve} startFrame={frame(c.damped)} durationFrames={32} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} beat/>
    <Copy at={c.raising} box={{x:970,y:760,w:680,h:36}} size={26} tone="color/fill/gold" align="center">R SHAPES THE RETURN</Copy>
  </Scene>;
}
