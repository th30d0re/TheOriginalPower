import React from 'react';
import {DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 313: in 1619 the hemisphere belongs to Iberia — Brazilian sugar,
// Spanish American silver and ports, Caribbean strongpoints — while
// England and France hold nothing yet.
export function IberianHemisphere({segment}: SceneProps) {
  const cue = {
    nineteen: useCue('t313Nineteen').at,
    iberian: useCue('t313Iberian').at,
    brazil: useCue('t313Brazil').at,
    sugar: useCue('t313Sugar').at,
    spanish: useCue('t313Spanish').at,
    silver: useCue('t313Silver').at,
    cartagena: useCue('t313Cartagena').at,
    veracruz: useCue('t313Veracruz').at,
    spain: useCue('t313Spain').at,
    england: useCue('t313England').at,
    colonies: useCue('t313Colonies').at,
  };
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1100, h: 70}} at={cue.nineteen}/>
    <Copy at={cue.nineteen} box={{x: 150, y: 124, w: 1000, h: 40}} size={32}>1619 · IBERIAN HEMISPHERE</Copy>
    <Panel box={{x: 120, y: 220, w: 500, h: 420}} at={cue.brazil}/>
    <Copy at={cue.brazil} box={{x: 150, y: 246, w: 440, h: 36}} size={30}>BRAZIL</Copy>
    <Copy at={cue.sugar} box={{x: 150, y: 296, w: 440, h: 30}} size={24} tone="color/fill/gold">SUGAR CENTER</Copy>
    <DrawRect box={{x: 150, y: 360, w: 440, h: 10}} startFrame={frame(cue.sugar)} durationFrames={12} strokeToken="color/fill/gold" fillToken="color/fill/gold" glowToken="color/fill/gold"/>
    <Panel box={{x: 660, y: 220, w: 580, h: 420}} at={cue.spanish}/>
    <Copy at={cue.spanish} box={{x: 690, y: 246, w: 520, h: 36}} size={30}>SPANISH AMERICA</Copy>
    <Copy at={cue.silver} box={{x: 690, y: 296, w: 520, h: 30}} size={24} tone="color/text/soft">SILVER · AGRICULTURE · CRAFTS</Copy>
    <Copy at={cue.cartagena} box={{x: 690, y: 360, w: 250, h: 30}} size={22}>CARTAGENA</Copy>
    <Copy at={cue.veracruz} box={{x: 970, y: 360, w: 240, h: 30}} size={22}>VERACRUZ</Copy>
    <Panel box={{x: 1280, y: 220, w: 520, h: 420}} at={cue.spain}/>
    <Copy at={cue.spain} box={{x: 1310, y: 246, w: 460, h: 36}} size={30}>CARIBBEAN</Copy>
    <Copy at={cue.spain} box={{x: 1310, y: 296, w: 460, h: 30}} size={24} tone="color/fill/gold">SPANISH STRONGPOINTS</Copy>
    <DrawRect box={{x: 120, y: 700, w: 1680, h: 170}} startFrame={frame(cue.england)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    <Copy at={cue.england} box={{x: 150, y: 730, w: 700, h: 34}} size={26} tone="color/text/dim">ENGLAND · FRANCE</Copy>
    <Copy at={cue.colonies} box={{x: 150, y: 778, w: 900, h: 32}} size={24} tone="color/text/dim">NO PLANTATION COLONIES YET</Copy>
  </Scene>;
}
