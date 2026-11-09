import React from 'react';
import {DefinitionCard, DrawLine, Flicker, KitSound, StageSceneFrame, useCue, useStageMs, color, cubicOut, progress, type SceneProps} from '@stage';
import {Copy, Panel, frame} from './Visuals';

function Circle({at, cx, cy, r, tone = 'color/fill/gold', fill = false}: {at: number; cx: number; cy: number; r: number; tone?: string; fill?: boolean}) {
  return <Flicker startFrame={frame(at)} durationFrames={15} beat>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill={fill ? color(tone) : 'none'} fillOpacity={fill ? 0.12 : 0} stroke={color(tone)} strokeWidth="4" />
    </svg>
  </Flicker>;
}
function Lens({at, cx1, cx2, cy, r}: {at: number; cx1: number; cx2: number; cy: number; r: number}) {
  // Overlap lens of two equal circles, filled so intersection reads at a glance.
  const d = Math.abs(cx2 - cx1), mx = (cx1 + cx2) / 2;
  const ry = Math.sqrt(Math.max(0, r * r - (d / 2) * (d / 2))), rx = Math.max(8, r - d / 2);
  return <Flicker startFrame={frame(at)} durationFrames={15} beat>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
      <ellipse cx={mx} cy={cy} rx={rx} ry={ry} fill={color('color/fill/gold')} fillOpacity={0.35} stroke="none" />
    </svg>
  </Flicker>;
}
function Dot({at, cx, cy, tone = 'color/fill/gold'}: {at: number; cx: number; cy: number; tone?: string}) {
  return <Flicker startFrame={frame(at)} durationFrames={12} beat>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
      <circle cx={cx} cy={cy} r={11} fill={color(tone)} stroke={color('color/bg/field')} strokeWidth="3" />
    </svg>
  </Flicker>;
}
function Definition({at, box, term, definition, accent = 'color/fill/gold'}: {at: number; box: {x: number; y: number; w: number; h: number}; term: string; definition: string; accent?: string}) {
  const ms = useStageMs();
  const reveal = cubicOut(progress(ms, at, at + 460));
  return <Flicker startFrame={frame(at)} durationFrames={15} beat>
    <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h}}>
      <DefinitionCard term={term} definition={definition} source="Elementary set theory" paraphrased progress={reveal} accent={accent} />
    </div>
  </Flicker>;
}

// Turns 133–136: the four operations in plain words — set/subset, union,
// intersection — ending in separated circles whose intersection is empty.
export function SetOperations({segment}: SceneProps) {
  const c = {
    four: useCue('t133Four').at, operations: useCue('t133Operations').at, plain: useCue('t133Plain').at, transparent: useCue('t133Transparent').at,
    set: useCue('t134Set').at, collection: useCue('t134Collection').at, circle: useCue('t134Circle').at, subset: useCue('t134Subset').at,
    union: useCue('t135Union').at, joins: useCue('t135Joins').at, intersection: useCue('t135Intersection').at, belong: useCue('t135Belong').at,
    zero: useCue('t136Zero').at, overlap: useCue('t136Overlap').at, empty: useCue('t136Empty').at, partition: useCue('t136Partition').at,
    legal: useCue('t136Legal').at, line: useCue('t136Line').at,
  };
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.four} box={{x: 120, y: 105, w: 1680, h: 48}} size={34}>SET THEORY · FOUR STANDARD OPERATIONS</Copy>
    <Copy at={c.operations} box={{x: 120, y: 162, w: 540, h: 28}} size={20} tone="color/fill/gold">ELEMENTARY SET THEORY</Copy>
    <Copy at={c.plain} box={{x: 700, y: 162, w: 480, h: 28}} size={20} tone="color/text/soft" align="center">SPOKEN IN PLAIN WORDS</Copy>
    <Copy at={c.transparent} box={{x: 1220, y: 162, w: 580, h: 28}} size={20} tone="color/text/soft" align="center">EVERY SYMBOL TRANSPARENT</Copy>
    <Panel box={{x: 120, y: 225, w: 520, h: 490}} at={c.set} beat />
    <Definition at={c.set} box={{x: 120, y: 225, w: 520, h: 490}} term="SET + SUBSET" definition="A defined collection; a subset stays entirely inside the larger set." />
    <Circle at={c.circle} cx={380} cy={460} r={150} />
    <Circle at={c.subset} cx={380} cy={460} r={68} tone="color/marker/race" />
    <Dot at={c.collection} cx={380} cy={460} />
    <Panel box={{x: 700, y: 225, w: 520, h: 490}} at={c.union} beat />
    <Definition at={c.union} box={{x: 700, y: 225, w: 520, h: 490}} term="UNION" definition="All members of both groups, joined in one set." />
    <Circle at={c.union} cx={885} cy={460} r={118} fill />
    <Circle at={c.union} cx={1035} cy={460} r={118} tone="color/marker/race" fill />
    <Dot at={c.joins} cx={845} cy={460} />
    <Dot at={c.joins} cx={960} cy={430} />
    <Dot at={c.joins} cx={1075} cy={460} tone="color/marker/race" />
    <Panel box={{x: 1280, y: 225, w: 520, h: 490}} at={c.intersection} accent="color/marker/race" beat />
    <Definition at={c.intersection} box={{x: 1280, y: 225, w: 520, h: 490}} term="INTERSECTION" definition="Only members shared by both circles at the same time." accent="color/marker/race" />
    <Circle at={c.intersection} cx={1465} cy={460} r={118} />
    <Circle at={c.intersection} cx={1615} cy={460} r={118} tone="color/marker/race" />
    <Lens at={c.intersection} cx1={1465} cx2={1615} cy={460} r={118} />
    <Dot at={c.belong} cx={1540} cy={460} />
    <Dot at={c.belong} cx={1540} cy={430} />
    <DrawLine points={[[270, 762], [1650, 762]]} startFrame={frame(c.zero)} durationFrames={18} strokeToken="color/line/hairline-strong" strokeWidth={2} />
    <Circle at={c.overlap} cx={430} cy={875} r={52} />
    <Circle at={c.overlap} cx={640} cy={875} r={52} tone="color/marker/race" />
    <DrawLine points={[[535, 815], [535, 935]]} startFrame={frame(c.legal)} durationFrames={16} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} beat />
    <Copy at={c.empty} box={{x: 800, y: 812, w: 1000, h: 32}} size={23}>ZERO COMMON MEMBERS · INTERSECTION = EMPTY SET</Copy>
    <Copy at={c.partition} box={{x: 800, y: 858, w: 1000, h: 30}} size={21} tone="color/text/soft">I AND O PARTITION U · NON-OVERLAPPING LEGAL BOXES</Copy>
    <Copy at={c.line} box={{x: 800, y: 904, w: 1000, h: 30}} size={21} tone="color/marker/race">WHO DRAWS THE LINE?</Copy>
  </KitSound></StageSceneFrame>;
}
