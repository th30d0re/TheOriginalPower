import React from 'react';
import {DrawLine, DrawRect, FitBox, color, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Scene, enter, frame} from './shared';

// Turn 181: the decomposition holds the In-group's outer legal boundary in place while four
// subset cells open inside it, and each cell's payoff column rises to a different height.
export function LegalSetIntact({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    decomposition: useCue('t181Decomposition').at,
    ingroup: useCue('t181Ingroup').at,
    intact: useCue('t181Intact').at,
    legal: useCue('t181Legal').at,
    exposing: useCue('t181Exposing').at,
    roles: useCue('t181Roles').at,
    payoffs: useCue('t181Payoffs').at,
    four: useCue('t181Four').at,
    subsets: useCue('t181Subsets').at,
  };
  const cells: readonly [string, string, number][] = [
    ['ELITE', 'color/fill/accent', 260],
    ['PUPPET', 'color/fill/gold', 170],
    ['ENFORCEMENT', 'color/marker/race', 110],
    ['BUFFER', 'color/line/wire', 70],
  ];
  const gauge = {y: 470, h: 280};
  const grow = enter(ms, cue.payoffs, 700);
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 700, h: 70}} at={cue.decomposition}/>
    <Copy at={cue.decomposition} box={{x: 150, y: 124, w: 640, h: 40}} size={30}>THE DECOMPOSITION</Copy>
    <Panel box={{x: 170, y: 220, w: 1580, h: 700}} at={cue.legal}/>
    <FitBox text="IN-GROUP I" x={210} y={250} size={34} weight={600} tag="LEGAL SET" startFrame={frame(cue.ingroup)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.intact} box={{x: 1360, y: 262, w: 340, h: 30}} size={22} tone="color/fill/gold" align="right">BOUNDARY INTACT</Copy>
    {cells.map(([label, accent, maxH], i) => {
      const cx = 230 + i * 380;
      const at = cue.four + i * 150;
      const fillH = Math.round(maxH * grow);
      return <React.Fragment key={label}>
        <DrawRect box={{x: cx, y: 340, w: 330, h: 460}} startFrame={frame(at)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat={i === 0}/>
        <Copy at={at} box={{x: cx + 20, y: 366, w: 290, h: 30}} size={24} tone={accent}>{label}</Copy>
        <DrawRect box={{x: cx + 105, y: gauge.y, w: 120, h: gauge.h}} startFrame={frame(cue.exposing)} durationFrames={14} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" strokeWidth={1}/>
        {fillH > 0 && <div data-shape={`payoff-${label.toLowerCase()}`} data-box={`${cx + 113} ${gauge.y + gauge.h - 8 - fillH} 104 ${fillH}`} style={{position: 'absolute', left: cx + 113, top: gauge.y + gauge.h - 8 - fillH, width: 104, height: fillH, background: color(accent), opacity: .85}}/>}
      </React.Fragment>;
    })}
    <Copy at={cue.roles} box={{x: 230, y: 846, w: 420, h: 30}} size={22}>UNEQUAL ROLES</Copy>
    <Copy at={cue.payoffs} box={{x: 1280, y: 846, w: 420, h: 30}} size={22} align="right" tone="color/fill/gold">UNEQUAL PAYOFFS</Copy>
    <DrawLine points={[[230, 830], [1700, 830]]} startFrame={frame(cue.exposing)} durationFrames={14} strokeToken="color/line/hairline" strokeWidth={1} origin={false} nodes={false}/>
  </Scene>;
}
