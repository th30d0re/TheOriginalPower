import React from 'react';
import {DrawLine, DrawRect, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 310: five quarter-centuries of embarkations climb from thirteen
// thousand to three hundred fifty-three thousand.
export function EmbarkationGrowth({segment}: SceneProps) {
  const cue = {
    thirteen: useCue('t310Thirteen').at,
    fiftyOne: useCue('t310FiftyOne').at,
    sixtyOne: useCue('t310SixtyOne').at,
    fiftyTwo: useCue('t310FiftyTwo').at,
    fiftyThree: useCue('t310FiftyThree').at,
  };
  const bars: {at: number; label: string; span: string; h: number}[] = [
    {at: cue.thirteen, label: '13K', span: '1501–25', h: 102},
    {at: cue.fiftyOne, label: '51K', span: '1526–50', h: 200},
    {at: cue.sixtyOne, label: '61K', span: '1551–75', h: 219},
    {at: cue.fiftyTwo, label: '152K', span: '1576–1600', h: 346},
    {at: cue.fiftyThree, label: '353K', span: '1601–25', h: 527},
  ];
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1280, h: 70}} at={cue.thirteen}/>
    <Copy at={cue.thirteen} box={{x: 150, y: 124, w: 1200, h: 40}} size={32}>TRAFFICKED PER QUARTER-CENTURY</Copy>
    <DrawLine points={[[170, 860], [1750, 860]]} startFrame={frame(cue.thirteen)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={3}/>
    {bars.map((b, i) => {
      const x = 220 + i * 310;
      return <React.Fragment key={b.label}>
        <DrawRect box={{x, y: 860 - b.h, w: 190, h: b.h}} startFrame={frame(b.at)} durationFrames={18} strokeToken={i === 4 ? 'color/marker/race' : 'color/fill/gold'} fillToken={i === 4 ? 'color/fill/red-faint' : 'color/fill/gold-wash'} glowToken={i === 4 ? 'color/marker/race' : 'color/fill/gold'} beat/>
        <Copy at={b.at} box={{x: x - 10, y: 860 - b.h - 44, w: 210, h: 32}} size={28} align="center" tone={i === 4 ? 'color/marker/race' : 'color/fill/gold'}>{b.label}</Copy>
        <Copy at={b.at} box={{x: x - 10, y: 876, w: 210, h: 26}} size={20} mono tone="color/text/soft" align="center">{b.span}</Copy>
      </React.Fragment>;
    })}
  </Scene>;
}
