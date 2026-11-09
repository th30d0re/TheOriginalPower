import React from 'react';
import {DrawLine, DrawRect, Flicker, FitBox, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 189–190: Eq. 2.7 assembles as the kernel optimization objective — maximize extraction
// E(t) while cross-group coherence M(t) stays under the revolutionary threshold τ — and the
// plot shows both traces holding that relation while codes, payments, and campaigns feed in.
export function KernelObjective({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    equation: useCue('t189Equation').at,
    twoPointSeven: useCue('t189TwoPointSeven').at,
    kernel: useCue('t189Kernel').at,
    maximize: useCue('t189Maximize').at,
    extraction: useCue('t189Extraction').at,
    output: useCue('t189Output').at,
    eOfT: useCue('t189EofT').at,
    subject: useCue('t189Subject').at,
    coherence: useCue('t189Coherence').at,
    mOfT: useCue('t189MofT').at,
    stays: useCue('t189Stays').at,
    below: useCue('t189Below').at,
    critical: useCue('t189Critical').at,
    threshold: useCue('t189Threshold').at,
    tau: useCue('t189Tau').at,
    plain: useCue('t189Plain').at,
    code: useCue('t190Code').at,
    payment: useCue('t190Payment').at,
    campaign: useCue('t190Campaign').at,
    chosen: useCue('t190Chosen').at,
    eOfT190: useCue('t190EofT').at,
    high: useCue('t190High').at,
    holding: useCue('t190Holding').at,
    mOfT190: useCue('t190MofT').at,
    tau190: useCue('t190Tau').at,
  };
  const chips: readonly [string, number][] = [
    ['RACIAL CODE', cue.code],
    ['STATUS PAYMENT', cue.payment],
    ['ENFORCEMENT CAMPAIGN', cue.campaign],
  ];
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1680, h: 224}} at={cue.equation}/>
    <FitBox text="EQ. 2.7" x={150} y={132} size={32} weight={600} tag="CHAPTER 2" startFrame={frame(cue.twoPointSeven)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.kernel} box={{x: 150, y: 268, w: 620, h: 30}} size={22} tone="color/text/dim">KERNEL OPTIMIZATION OBJECTIVE</Copy>
    <Flicker startFrame={frame(cue.maximize)} durationFrames={16} beat>
      <EquationTerms equation="Eq. 2.7 · kernel optimization objective" ms={ms} box={{x: 700, y: 140, w: 1060, h: 90}} fontSize={44} align="center" tokens={[{text: 'max ', revealAt: cue.maximize}, {term: 'ExtractionE', revealAt: cue.extraction}, {text: '  subject to  ', revealAt: cue.subject}, {term: 'CoherenceM', revealAt: cue.mOfT}, {text: ' < ', revealAt: cue.below}, {term: 'Tau', revealAt: cue.tau}]} pulses={{ExtractionE: [cue.extraction, cue.eOfT, cue.eOfT190, cue.high], CoherenceM: [cue.coherence, cue.mOfT, cue.mOfT190], Tau: [cue.tau, cue.tau190]}}/>
    </Flicker>
    <Panel box={{x: 120, y: 380, w: 1060, h: 500}} at={cue.maximize}/>
    <DrawLine points={[[200, 830], [200, 430]]} startFrame={frame(cue.maximize)} durationFrames={14} strokeToken="color/line/hairline-strong" strokeWidth={2} origin={false} nodes={false}/>
    <DrawLine points={[[200, 830], [1120, 830]]} startFrame={frame(cue.maximize + 100)} durationFrames={14} strokeToken="color/line/hairline-strong" strokeWidth={2} origin={false} nodes={false}/>
    <DrawLine points={[[240, 800], [500, 700], [760, 580], [1080, 470]]} startFrame={frame(cue.extraction)} durationFrames={24} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} nodes={false} beat/>
    <Copy at={cue.output} box={{x: 760, y: 430, w: 300, h: 28}} size={20} tone="color/fill/gold">EXTRACTION OUTPUT</Copy>
    <DrawLine points={[[200, 620], [1120, 620]]} startFrame={frame(cue.critical)} durationFrames={18} strokeToken="color/marker/race" strokeWidth={3} origin={false} nodes={false}/>
    <Copy at={cue.threshold} box={{x: 220, y: 584, w: 400, h: 28}} size={20} tone="color/marker/race">REVOLUTIONARY THRESHOLD</Copy>
    <DrawLine points={[[240, 810], [560, 770], [900, 730], [1080, 710]]} startFrame={frame(cue.coherence)} durationFrames={24} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={4} nodes={false}/>
    <Copy at={cue.stays} box={{x: 250, y: 700, w: 300, h: 28}} size={20} tone="color/marker/race">CLASS COHERENCE</Copy>
    <Copy at={cue.plain} box={{x: 1240, y: 400, w: 560, h: 66}} size={22} tone="color/text/soft">MAXIMUM EXTRACTION · SOLIDARITY BELOW THRESHOLD</Copy>
    {chips.map(([label, at], i) => {
      const y = 620 + i * 84;
      return <React.Fragment key={label}>
        <DrawRect box={{x: 1280, y, w: 500, h: 64}} startFrame={frame(at)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat={i === 0}/>
        <Copy at={at} box={{x: 1280, y: y + 18, w: 500, h: 28}} size={22} align="center">{label}</Copy>
      </React.Fragment>;
    })}
    <DrawLine points={[[1276, 720], [1186, 720]]} startFrame={frame(cue.chosen)} durationFrames={12} strokeToken="color/line/hairline" strokeWidth={2} origin={false} nodes={false}/>
    <DrawRect box={{x: 1072, y: 702, w: 16, h: 16}} startFrame={frame(cue.holding)} durationFrames={10} strokeToken="color/marker/race" fillToken="color/marker/race" beat/>
  </Scene>;
}
