import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, useStageMs, color, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';

const frame = (ms: number) => Math.round(ms * 30 / 1000);
const Text = ({at, box, children, size = 26, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="magnitude-direction" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px \"IBM Plex Sans\"`, lineHeight: 1.2, color: color(tone)}}>{children}</div></Flicker>;
const Field = ({box, at, accent = 'color/fill/gold'}: {box: {x: number; y: number; w: number; h: number}; at: number; accent?: string}) => <><BootIn box={box} startFrame={frame(at)} durationFrames={20} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent} beat/><DrawRect box={box} startFrame={frame(at)} durationFrames={20} strokeToken={accent} fillToken="color/fill/panel-render" glowToken={accent}/></>;

export function MagnitudeDirection({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {magnitude: useCue('t67Magnitude').at, amount: useCue('t67Amount').at, force: useCue('t67Force').at, racism: useCue('t67Racism').at, vector: useCue('t67Vector').at, state: useCue('t67State').at, institutional: useCue('t67Institutional').at, direction: useCue('t67Direction').at, where: useCue('t67Where').at, travels: useCue('t67Travels').at, law: useCue('t67Law').at, courts: useCue('t67Courts').at, policing: useCue('t67Policing').at, credit: useCue('t67Credit').at, capital: useCue('t67Capital').at, allocation: useCue('t67Allocation').at};
  const left = {x: 120, y: 212, w: 610, h: 650}, right = {x: 910, y: 212, w: 890, h: 650};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Text at={cue.magnitude} box={{x: 120, y: 106, w: 1680, h: 50}} size={34}>THE RACISM VECTOR · COMPONENTS</Text>
    <Field box={left} at={cue.magnitude}/><Field box={right} at={cue.direction} accent="color/marker/race"/>
    <FitBox text="MAGNITUDE" x={left.x + 34} y={left.y + 34} size={36} weight={600} tag="TERM" startFrame={frame(cue.magnitude)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Flicker startFrame={frame(cue.force)} durationFrames={16} beat><EquationTerms equation="Eq. 3.1 · magnitude" ms={ms} box={{x: 210, y: 430, w: 430, h: 78}} fontSize={58} align="center" tokens={[{term: 'Magnitude'}]} pulses={{Magnitude: [cue.magnitude, cue.force]}}/></Flicker>
    <Text at={cue.amount} box={{x: 186, y: 575, w: 480, h: 42}} size={30}>AMOUNT OF FORCE</Text>
    <Text at={cue.racism} box={{x: 186, y: 638, w: 480, h: 32}} size={22} tone="color/text/soft">IN THE RACISM VECTOR</Text>
    <FitBox text="DIRECTION" x={right.x + 34} y={right.y + 34} size={36} weight={600} tag="TERM" startFrame={frame(cue.direction)} durationFrames={18} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <Flicker startFrame={frame(cue.state)} durationFrames={16} beat><EquationTerms equation="Eq. 3.1 · state direction" ms={ms} box={{x: 980, y: 360, w: 300, h: 70}} fontSize={52} align="center" tokens={[{term: 'StateDirection'}]} pulses={{StateDirection: [cue.direction, cue.state, cue.institutional]}}/></Flicker>
    <Text at={cue.where} box={{x: 1320, y: 380, w: 400, h: 36}} size={26} tone="color/text/soft">WHERE FORCE TRAVELS</Text>
    <DrawLine points={[[1030, 510], [1660, 510]]} startFrame={frame(cue.travels)} durationFrames={22} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    {[['LAW', cue.law, 1020], ['COURTS', cue.courts, 1196], ['POLICING', cue.policing, 1372], ['CREDIT', cue.credit, 1548], ['CAPITAL ALLOCATION', cue.allocation, 1020]].map(([label, at, x], index) => {
      const y = index === 4 ? 665 : 575;
      const w = index === 4 ? 656 : 128;
      return <React.Fragment key={String(label)}><DrawRect box={{x: Number(x), y, w, h: 58}} startFrame={frame(Number(at))} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race" beat/><Text at={Number(at)} box={{x: Number(x) + 14, y: y + 17, w: w - 28, h: 24}} size={20} tone="color/text/primary">{label}</Text></React.Fragment>;
    })}
    <Text at={cue.capital} box={{x: 1020, y: 748, w: 650, h: 30}} size={22} tone="color/marker/race">STATE &amp; INSTITUTIONAL DIRECTION</Text>
  </KitSound></StageSceneFrame>;
}
