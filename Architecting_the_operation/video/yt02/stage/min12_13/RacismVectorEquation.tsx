import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, useStageMs, color, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';

const frame = (ms: number) => Math.round(ms * 30 / 1000);
const Label = ({at, box, children, size = 26, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="racism-vector-equation" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px \"IBM Plex Sans\"`, lineHeight: 1.2, color: color(tone)}}>{children}</div></Flicker>;

export function RacismVectorEquation({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {drawing: useCue('t66Drawing').at, susan: useCue('t66Susan').at, aboolHawa: useCue('t66AboolHawa').at, institutional: useCue('t66Institutional').at, equation: useCue('t66Equation').at, three: useCue('t66Three').at, writes: useCue('t66Writes').at, conceptual: useCue('t66Conceptual').at, racism: useCue('t66Racism').at, vector: useCue('t66Vector').at, equals: useCue('t66Equals').at, emotional: useCue('t66Emotional').at, material: useCue('t66Material').at, magnitude: useCue('t66Magnitude').at, multiplied: useCue('t66Multiplied').at, unit: useCue('t66Unit').at, direction: useCue('t66Direction').at, state: useCue('t66State').at, enforcement: useCue('t66Enforcement').at};
  const equationBox = {x: 220, y: 352, w: 1480, h: 210};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <BootIn box={{x: 120, y: 110, w: 1680, h: 86}} startFrame={frame(cue.drawing)} durationFrames={20} mode="scan" strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <DrawRect box={{x: 120, y: 110, w: 1680, h: 86}} startFrame={frame(cue.drawing)} durationFrames={20} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <Label at={cue.susan} box={{x: 150, y: 132, w: 980, h: 34}} size={28}>SUSAN ABOOL-HAWA · INSTITUTIONAL POWER</Label>
    <Label at={cue.aboolHawa} box={{x: 1210, y: 136, w: 550, h: 28}} size={20} tone="color/fill/gold">CONCEPTUAL FORMULATION</Label>
    <BootIn box={equationBox} startFrame={frame(cue.equation)} durationFrames={24} mode="scan" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <DrawRect box={equationBox} startFrame={frame(cue.equation)} durationFrames={24} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <FitBox text="EQUATION 3.1" x={equationBox.x + 34} y={equationBox.y - 24} size={24} weight={600} tag="CHAPTER 3" startFrame={frame(cue.three)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Flicker startFrame={frame(cue.writes)} durationFrames={18} beat><EquationTerms equation="Eq. 3.1 · conceptual racism vector" ms={ms} box={{x: 380, y: 405, w: 1160, h: 70}} fontSize={54} align="center" tokens={[{term: 'RacismVector'}, {text: ' = '}, {term: 'Magnitude'}, {text: ' · '}, {term: 'StateDirection'}]} pulses={{RacismVector: [cue.racism, cue.vector], Magnitude: [cue.magnitude], StateDirection: [cue.direction, cue.state]}}/></Flicker>
    <Label at={cue.conceptual} box={{x: 300, y: 602, w: 380, h: 34}} size={22} tone="color/text/soft">RACISM VECTOR</Label>
    <Label at={cue.emotional} box={{x: 745, y: 602, w: 360, h: 34}} size={22} tone="color/text/soft">EMOTIONAL + MATERIAL</Label>
    <Label at={cue.direction} box={{x: 1230, y: 602, w: 390, h: 34}} size={22} tone="color/text/soft">UNIT DIRECTION</Label>
    <DrawLine points={[[488, 548], [488, 574], [490, 574]]} startFrame={frame(cue.vector)} durationFrames={12} strokeToken="color/fill/gold" strokeWidth={3} beat/>
    <DrawLine points={[[930, 548], [930, 574], [925, 574]]} startFrame={frame(cue.magnitude)} durationFrames={12} strokeToken="color/fill/gold" strokeWidth={3} beat/>
    <DrawLine points={[[1390, 548], [1390, 574], [1400, 574]]} startFrame={frame(cue.enforcement)} durationFrames={12} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={3} beat/>
    <Label at={cue.state} box={{x: 460, y: 760, w: 1000, h: 40}} size={30} tone="color/marker/race">STATE &amp; INSTITUTIONAL ENFORCEMENT</Label>
  </KitSound></StageSceneFrame>;
}
