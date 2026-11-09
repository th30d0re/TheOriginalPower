import React from 'react';
import {DrawLine, DrawRect, FitBox, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 308: three Atlantic entrants take dated positions on one timeline — Dutch
// chartered and seizing Brazil and Elmina, England planting Barbados and
// monopolizing the African trade, France taking Saint-Domingue.
export function PowersTimeline({segment}: SceneProps) {
  const cue = {
    dutch: useCue('t308Dutch').at,
    chartered: useCue('t308Chartered').at,
    brazil: useCue('t308Brazil').at,
    elmina: useCue('t308Elmina').at,
    england: useCue('t308England').at,
    barbados: useCue('t308Barbados').at,
    sugar: useCue('t308Sugar').at,
    monopoly: useCue('t308Monopoly').at,
    france: useCue('t308France').at,
    domingue: useCue('t308Domingue').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1200, h: 70}} at={cue.dutch}/>
    <Copy at={cue.dutch} box={{x: 150, y: 124, w: 1100, h: 40}} size={32}>ATLANTIC POWERS · 1621–1697</Copy>
    <DrawLine points={[[150, 560], [1770, 560]]} startFrame={frame(cue.dutch)} durationFrames={20} strokeToken="color/line/hairline-strong" strokeWidth={3}/>
    {[1621, 1650, 1680].map((yr, i) => (
      <Copy key={yr} at={cue.dutch} box={{x: 170 + i * 700, y: 578, w: 120, h: 24}} size={20} mono tone="color/text/dim">{yr}</Copy>
    ))}
    <FitBox text="DUTCH" x={150} y={220} size={30} weight={600} tag="W INDIA CO" startFrame={frame(cue.dutch)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawRect box={{x: 190, y: 330, w: 220, h: 84}} startFrame={frame(cue.chartered)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.chartered} box={{x: 206, y: 342, w: 190, h: 28}} size={22}>1621 · CHARTERED</Copy>
    <DrawRect box={{x: 480, y: 330, w: 210, h: 84}} startFrame={frame(cue.brazil)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.brazil} box={{x: 496, y: 342, w: 180, h: 28}} size={22}>1630 · BRAZIL</Copy>
    <DrawRect box={{x: 760, y: 330, w: 220, h: 84}} startFrame={frame(cue.elmina)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.elmina} box={{x: 776, y: 342, w: 190, h: 28}} size={22}>1637 · ELMINA</Copy>
    <FitBox text="ENGLAND" x={150} y={640} size={30} weight={600} tag="AMERICAS" startFrame={frame(cue.england)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawRect box={{x: 380, y: 730, w: 230, h: 84}} startFrame={frame(cue.barbados)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.barbados} box={{x: 396, y: 742, w: 200, h: 28}} size={22}>1627 · BARBADOS</Copy>
    <DrawRect box={{x: 680, y: 730, w: 210, h: 84}} startFrame={frame(cue.sugar)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.sugar} box={{x: 696, y: 742, w: 180, h: 28}} size={22}>1640s · SUGAR</Copy>
    <DrawRect box={{x: 960, y: 730, w: 240, h: 84}} startFrame={frame(cue.monopoly)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race" beat/>
    <Copy at={cue.monopoly} box={{x: 976, y: 742, w: 210, h: 28}} size={22}>1672 · MONOPOLY</Copy>
    <FitBox text="FRANCE" x={1380} y={640} size={30} weight={600} tag="CARIBBEAN" startFrame={frame(cue.france)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawRect box={{x: 1380, y: 730, w: 300, h: 84}} startFrame={frame(cue.domingue)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <Copy at={cue.domingue} box={{x: 1396, y: 742, w: 270, h: 28}} size={22}>1697 · SAINT-DOMINGUE</Copy>
  </Scene>;
}
