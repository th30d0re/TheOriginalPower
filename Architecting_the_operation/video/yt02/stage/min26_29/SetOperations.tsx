import React from 'react';
import {DefinitionCard, DrawLine, DrawRect, Flicker, KitSound, StageSceneFrame, useCue, useStageMs, color, cubicOut, progress, type SceneProps} from '@stage';
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
// intersection — ending in separated circles whose intersection is empty,
// and extended with the access control computing vocabulary (whitelist/blacklist).
export function SetOperations({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    four: useCue('t133Four').at, operations: useCue('t133Operations').at, plain: useCue('t133Plain').at, transparent: useCue('t133Transparent').at,
    set: useCue('t134Set').at, collection: useCue('t134Collection').at, circle: useCue('t134Circle').at, subset: useCue('t134Subset').at,
    union: useCue('t135Union').at, joins: useCue('t135Joins').at, intersection: useCue('t135Intersection').at, belong: useCue('t135Belong').at,
    zero: useCue('t136Zero').at, overlap: useCue('t136Overlap').at, empty: useCue('t136Empty').at, partition: useCue('t136Partition').at,
    legal: useCue('t136Legal').at, line: useCue('t136Line').at,
    computing: useCue('t136Computing').at,
    whitelist: useCue('t136Whitelist').at,
    blacklist: useCue('t136Blacklist').at,
    box: useCue('t136Box').at,
    white: useCue('t136White').at,
    controls: useCue('t136Controls').at,
  };

  const FADE_MS = Math.round(8 * 1000 / 30);
  const upperOpacity = 1 - progress(ms, c.computing, c.computing + FADE_MS);
  const lineFade = progress(ms, c.controls, c.controls + FADE_MS);

  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    {/* Header row */}
    <Copy at={c.four} box={{x: 120, y: 105, w: 1680, h: 48}} size={34}>SET THEORY · FOUR STANDARD OPERATIONS</Copy>
    <Copy at={c.operations} box={{x: 120, y: 162, w: 540, h: 28}} size={20} tone="color/fill/gold">ELEMENTARY SET THEORY</Copy>
    <Copy at={c.plain} box={{x: 700, y: 162, w: 480, h: 28}} size={20} tone="color/text/soft" align="center">SPOKEN IN PLAIN WORDS</Copy>
    <Copy at={c.transparent} box={{x: 1220, y: 162, w: 580, h: 28}} size={20} tone="color/text/soft" align="center">EVERY SYMBOL TRANSPARENT</Copy>

    {/* Upper operation panels: fade out over 8 frames starting at t136Computing */}
    {upperOpacity > 0 && <div style={{opacity: upperOpacity, pointerEvents: upperOpacity <= 0 ? 'none' : 'auto'}}>
      <Panel box={{x: 120, y: 225, w: 520, h: 490}} at={c.set} beat />
      <Definition at={c.set} box={{x: 120, y: 225, w: 520, h: 490}} term="SET + SUBSET" definition="One collection inside another." />
      <Circle at={c.circle} cx={380} cy={555} r={120} />
      <Circle at={c.subset} cx={380} cy={555} r={54} tone="color/marker/race" />
      <Dot at={c.collection} cx={380} cy={555} />
      <Panel box={{x: 700, y: 225, w: 520, h: 490}} at={c.union} beat />
      <Definition at={c.union} box={{x: 700, y: 225, w: 520, h: 490}} term="UNION" definition="All members, together." />
      <Circle at={c.union} cx={885} cy={555} r={105} fill />
      <Circle at={c.union} cx={1035} cy={555} r={105} tone="color/marker/race" fill />
      <Dot at={c.joins} cx={845} cy={555} />
      <Dot at={c.joins} cx={960} cy={530} />
      <Dot at={c.joins} cx={1075} cy={555} tone="color/marker/race" />
      <Panel box={{x: 1280, y: 225, w: 520, h: 490}} at={c.intersection} accent="color/marker/race" beat />
      <Definition at={c.intersection} box={{x: 1280, y: 225, w: 520, h: 490}} term="INTERSECTION" definition="Members both groups share." accent="color/marker/race" />
      <Circle at={c.intersection} cx={1465} cy={555} r={105} />
      <Circle at={c.intersection} cx={1615} cy={555} r={105} tone="color/marker/race" />
      <Lens at={c.intersection} cx1={1465} cx2={1615} cy={555} r={105} />
      <Dot at={c.belong} cx={1540} cy={555} />
      <Dot at={c.belong} cx={1540} cy={530} />
    </div>}

    {/* Computing Access Control extension beat */}
    {ms >= c.computing && (
      <Copy at={c.computing} box={{x: 120, y: 228, w: 1680, h: 32}} size={22} tone="color/fill/gold" align="center">COMPUTING VOCABULARY · ACCESS CONTROL</Copy>
    )}

    {/* Whitelist Card (SET I · ACCESS GRANTED) */}
    {ms >= c.whitelist && <>
      <DrawRect box={{x: 200, y: 275, w: 540, h: 375}} startFrame={frame(c.whitelist)} durationFrames={18} strokeToken="color/text/primary" fillToken="color/fill/panel-render" glowToken="color/text/primary" strokeWidth={2} beat />
      <Copy at={c.whitelist} box={{x: 235, y: 300, w: 470, h: 42}} size={32} tone="color/text/primary">WHITELIST</Copy>
      <Copy at={c.whitelist} box={{x: 235, y: 350, w: 470, h: 28}} size={21} tone="color/text/primary">SET I · ACCESS GRANTED</Copy>
      <Flicker startFrame={frame(c.whitelist)} durationFrames={15}>
        <div style={{position: 'absolute', left: 235, top: 410, width: 470, display: 'flex', flexDirection: 'column', gap: 16}}>
          {[280, 350, 230].map((barW, i) => (
            <div key={i} style={{height: 46, background: 'rgba(232, 201, 155, 0.08)', border: '1px solid rgba(232, 201, 155, 0.22)', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14}}>
              <div style={{width: 8, height: 8, borderRadius: '50%', background: color('color/text/primary'), flexShrink: 0}} />
              <div style={{width: barW, height: 10, background: 'rgba(232, 201, 155, 0.32)', borderRadius: 2}} />
            </div>
          ))}
        </div>
      </Flicker>
    </>}

    {/* Blacklist Card (SET O · ACCESS DENIED) */}
    {ms >= c.blacklist && <>
      <DrawRect box={{x: 1180, y: 275, w: 540, h: 375}} startFrame={frame(c.blacklist)} durationFrames={18} strokeToken="color/line/hairline" fillToken="#0B0B0B" strokeWidth={1.5} glowToken="color/marker/race" beat />
      <Copy at={c.blacklist} box={{x: 1215, y: 300, w: 470, h: 42}} size={32} tone="color/text/primary">BLACKLIST</Copy>
      <Copy at={c.blacklist} box={{x: 1215, y: 350, w: 470, h: 28}} size={21} tone="color/text/primary">
        SET O · ACCESS <span style={{color: color('color/marker/race'), fontWeight: 700}}>DENIED</span>
      </Copy>
      <Flicker startFrame={frame(c.blacklist)} durationFrames={15}>
        <div style={{position: 'absolute', left: 1215, top: 410, width: 470, display: 'flex', flexDirection: 'column', gap: 16}}>
          {[250, 320, 200].map((barW, i) => (
            <div key={i} style={{height: 46, background: 'rgba(224, 82, 82, 0.08)', border: '1px solid rgba(224, 82, 82, 0.28)', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14}}>
              <div style={{width: 8, height: 8, borderRadius: '50%', background: color('color/marker/race'), flexShrink: 0}} />
              <div style={{width: barW, height: 10, background: 'rgba(224, 82, 82, 0.32)', borderRadius: 2}} />
            </div>
          ))}
        </div>
      </Flicker>
    </>}

    {/* Centre Gate: square CHECK box with arrows to each card */}
    {ms >= c.box && <>
      <DrawRect box={{x: 880, y: 360, w: 160, h: 160}} startFrame={frame(c.box)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" strokeWidth={2.2} beat />
      <Copy at={c.box} box={{x: 880, y: 422, w: 160, h: 36}} size={28} tone="color/fill/gold" align="center">CHECK</Copy>
      <DrawLine points={[[870, 440], [750, 440]]} startFrame={frame(c.box)} durationFrames={16} strokeToken="color/text/primary" glowToken="color/text/primary" strokeWidth={3} end="arrow" beat />
      <DrawLine points={[[1050, 440], [1170, 440]]} startFrame={frame(c.box)} durationFrames={16} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={3} end="arrow" beat />
      <Copy at={c.box} box={{x: 760, y: 540, w: 400, h: 32}} size={21} tone="color/fill/gold" align="center">WHICH BOX ARE YOU IN?</Copy>
    </>}

    {/* Under-card summary caption */}
    {ms >= c.white && (
      <Copy at={c.white} box={{x: 120, y: 685, w: 1680, h: 32}} size={24} tone="color/text/primary" align="center">WHITE = ADMISSION · BLACK = EXCLUSION</Copy>
    )}

    {/* Bottom partition row: rule, circles, vertical divider, captions */}
    <DrawLine points={[[270, 762], [1650, 762]]} startFrame={frame(c.zero)} durationFrames={18} strokeToken="color/line/hairline-strong" strokeWidth={2} />
    <Circle at={c.overlap} cx={430} cy={875} r={52} />
    <Circle at={c.overlap} cx={640} cy={875} r={52} tone="color/marker/race" />
    <DrawLine points={[[535, 815], [535, 935]]} startFrame={frame(c.legal)} durationFrames={16} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={5} beat />
    {ms >= c.controls && (
      <DrawLine points={[[535, 815], [535, 935]]} startFrame={frame(c.controls)} durationFrames={14} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={7} beat />
    )}
    <Copy at={c.empty} box={{x: 800, y: 812, w: 1000, h: 32}} size={23}>ZERO COMMON MEMBERS · INTERSECTION = EMPTY SET</Copy>
    <Copy at={c.partition} box={{x: 800, y: 858, w: 1000, h: 30}} size={21} tone="color/text/soft">I AND O PARTITION U · NON-OVERLAPPING LEGAL BOXES</Copy>
    {lineFade < 1 && (
      <div style={{opacity: 1 - lineFade, pointerEvents: 'none'}}>
        <Copy at={c.line} box={{x: 800, y: 904, w: 1000, h: 30}} size={21} tone="color/marker/race">WHO DRAWS THE LINE?</Copy>
      </div>
    )}
    {ms >= c.controls && (
      <Copy at={c.controls} box={{x: 800, y: 904, w: 1000, h: 30}} size={21} tone="color/fill/gold">ONE LINE · DRAWN BY WHOEVER CONTROLS THE LIST</Copy>
    )}
  </KitSound></StageSceneFrame>;
}
