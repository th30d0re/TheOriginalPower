import React from 'react';
import {DefinitionCard, DrawLine, DrawRect, FitBox, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 314–316: a marginal tobacco colony becomes the second historical
// test — the move from Lisbon to Virginia — and Prediction 2 is stated:
// codification follows solidarity threats.
export function VirginiaPrediction({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    virginia314: useCue('t314Virginia').at,
    marginal: useCue('t314Marginal').at,
    tobacco: useCue('t314Tobacco').at,
    company: useCue('t314Company').at,
    settlers: useCue('t314Settlers').at,
    indentured: useCue('t314Indentured').at,
    why: useCue('t315Why').at,
    virginia315: useCue('t315Virginia').at,
    prediction315: useCue('t315Prediction').at,
    portugal: useCue('t315Portugal').at,
    lisbon: useCue('t315Lisbon').at,
    arrival: useCue('t315VirginiaArrival').at,
    chapter: useCue('t315Chapter').at,
    prediction: useCue('t316Prediction').at,
    codification: useCue('t316Codification').at,
    solidarity: useCue('t316Solidarity').at,
    statutory: useCue('t316Statutory').at,
    buffer: useCue('t316Buffer').at,
    privileges: useCue('t316Privileges').at,
    coalitions: useCue('t316Coalitions').at,
    crossRacial: useCue('t316CrossRacial').at,
  };
  const left = {x: 120, y: 210, w: 500, h: 640};
  const mid = {x: 660, y: 210, w: 560, h: 640};
  const right = {x: 1260, y: 210, w: 540, h: 640};
  const defProgress = ms >= cue.codification ? Math.min(1, (ms - cue.codification) / 520) : 0;
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1100, h: 70}} at={cue.virginia314}/>
    <Copy at={cue.virginia314} box={{x: 150, y: 124, w: 1000, h: 40}} size={32}>THE SECOND TEST</Copy>
    <Panel box={left} at={cue.virginia314}/>
    <FitBox text="VIRGINIA" x={left.x + 30} y={left.y + 30} size={32} weight={600} tag="1619" startFrame={frame(cue.virginia314)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.marginal} box={{x: left.x + 30, y: left.y + 110, w: 440, h: 32}} size={26}>MARGINAL COLONY</Copy>
    <Copy at={cue.tobacco} box={{x: left.x + 30, y: left.y + 150, w: 440, h: 30}} size={24} tone="color/fill/gold">TOBACCO</Copy>
    <Copy at={cue.company} box={{x: left.x + 30, y: left.y + 196, w: 440, h: 28}} size={22} tone="color/text/soft">VIRGINIA COMPANY</Copy>
    <Copy at={cue.settlers} box={{x: left.x + 30, y: left.y + 260, w: 440, h: 34}} size={28}>1,000–1,500 SETTLERS</Copy>
    <StickFigure x={left.x + 110} y={left.y + 400} group="neutral" emphasis={1} scale={1.4} animate startFrame={frame(cue.indentured)} durationFrames={16}/>
    <StickFigure x={left.x + 230} y={left.y + 400} group="neutral" emphasis={1} scale={1.4} animate startFrame={frame(cue.indentured + 140)} durationFrames={16}/>
    <StickFigure x={left.x + 350} y={left.y + 400} group="neutral" emphasis={1} scale={1.4} animate startFrame={frame(cue.indentured + 280)} durationFrames={16}/>
    <Copy at={cue.indentured} box={{x: left.x + 30, y: left.y + 470, w: 440, h: 30}} size={22} tone="color/text/soft" align="center">INDENTURED LABOR</Copy>
    <Panel box={mid} at={cue.why}/>
    <Copy at={cue.portugal} box={{x: mid.x + 30, y: mid.y + 36, w: 500, h: 32}} size={26} tone="color/text/soft">LISBON · 15TH CENTURY</Copy>
    <DrawRect box={{x: mid.x + 30, y: mid.y + 84, w: 500, h: 78}} startFrame={frame(cue.prediction315)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <Copy at={cue.prediction315} box={{x: mid.x + 50, y: mid.y + 102, w: 460, h: 30}} size={24} align="center">PREDICTION 1</Copy>
    <DrawLine points={[[mid.x + 280, mid.y + 178], [mid.x + 280, mid.y + 330]]} startFrame={frame(cue.lisbon)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <DrawRect box={{x: mid.x + 30, y: mid.y + 346, w: 500, h: 78}} startFrame={frame(cue.arrival)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold" beat/>
    <Copy at={cue.arrival} box={{x: mid.x + 50, y: mid.y + 364, w: 460, h: 30}} size={24} align="center">VIRGINIA · 1619–1705</Copy>
    <Copy at={cue.chapter} box={{x: mid.x + 30, y: mid.y + 452, w: 500, h: 28}} size={20} mono tone="color/text/dim" align="center">CHAPTER 4</Copy>
    <Panel box={right} at={cue.prediction}/>
    <div style={{position: 'absolute', left: right.x, top: right.y, width: right.w, height: 300}}>
      <DefinitionCard term="PREDICTION 2" definition="Codification follows solidarity threats." source="ORIGINAL POWER" paraphrased={false} progress={defProgress} accent="color/fill/gold"/>
    </div>
    <StickFigure x={right.x + 150} y={right.y + 400} group="ingroup" emphasis={1} scale={1.4} animate startFrame={frame(cue.coalitions)} durationFrames={16}/>
    <StickFigure x={right.x + 290} y={right.y + 400} group="outgroup" emphasis={1} scale={1.4} animate startFrame={frame(cue.crossRacial)} durationFrames={16}/>
    <Copy at={cue.coalitions} box={{x: right.x + 30, y: right.y + 458, w: 480, h: 28}} size={20} align="center" tone="color/text/soft">CROSS-RACIAL COALITION</Copy>
    <DrawLine points={[[right.x + 220, right.y + 492], [right.x + 220, right.y + 540]]} startFrame={frame(cue.solidarity)} durationFrames={12} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <DrawRect box={{x: right.x + 30, y: right.y + 548, w: 230, h: 70}} startFrame={frame(cue.statutory)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race" beat/>
    <Copy at={cue.statutory} box={{x: right.x + 40, y: right.y + 566, w: 210, h: 28}} size={20} align="center">RACE CODES</Copy>
    <DrawRect box={{x: right.x + 280, y: right.y + 548, w: 230, h: 70}} startFrame={frame(cue.buffer)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <EquationTerms equation="Eq. 2.2 · Buffer Class" ms={ms} box={{x: right.x + 280, y: right.y + 548, w: 230, h: 70}} fontSize={20} align="center" tokens={[{term: 'IBuffer', revealAt: cue.buffer}, {text: ' PRIVILEGES', revealAt: cue.privileges}]} pulses={{IBuffer: [cue.buffer, cue.privileges]}}/>
  </Scene>;
}
