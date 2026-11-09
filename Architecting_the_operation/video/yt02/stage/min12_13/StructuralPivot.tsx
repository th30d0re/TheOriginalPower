import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, useStageMs, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);
const Panel = ({box, at, children, beat = false}: React.PropsWithChildren<{box: {x: number; y: number; w: number; h: number}; at: number; beat?: boolean}>) => <>
  <BootIn box={box} startFrame={frame(at)} durationFrames={18} mode="scan" strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat={beat}/>
  <DrawRect box={box} startFrame={frame(at)} durationFrames={18} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
  {children}
</>;
const Copy = ({at, box, children, size = 28, ink = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; ink?: string}>) => <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="structural-pivot" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px \"IBM Plex Sans\"`, lineHeight: 1.18, color: color(ink)}}>{children}</div></Flicker>;

export function StructuralPivot({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {everything: useCue('t63Everything').at, structural: useCue('t63Structural').at, racism: useCue('t63Racism').at, institutional: useCue('t63Institutional').at, extraction: useCue('t63Extraction').at, equations: useCue('t63Equations').at, historical: useCue('t63Historical').at, archives: useCue('t63Archives').at};
  const header = {x: 120, y: 114, w: 1680, h: 74};
  const cards = [{x: 120, y: 280, w: 460, h: 488}, {x: 730, y: 280, w: 460, h: 488}, {x: 1340, y: 280, w: 460, h: 488}];
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={header} at={cue.everything} beat/>
    <Copy at={cue.structural} box={{x: 150, y: 134, w: 980, h: 38}} size={30}>STRUCTURAL ARGUMENT · THE ORIGINAL POWER</Copy>
    <Copy at={cue.everything} box={{x: 1210, y: 138, w: 550, h: 28}} size={20} ink="color/fill/gold">CHAPTER THREE · FORMAL ENTRY</Copy>
    <Panel box={cards[0]} at={cue.racism}/>
    <Panel box={cards[1]} at={cue.institutional}/>
    <Panel box={cards[2]} at={cue.equations}/>
    <FitBox text="RACISM" x={cards[0].x + 34} y={cards[0].y + 36} size={38} weight={600} tag="TERM" startFrame={frame(cue.racism)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.racism} box={{x: 154, y: 410, w: 390, h: 88}} size={34}>INSTITUTIONAL</Copy>
    <Copy at={cue.institutional} box={{x: 154, y: 502, w: 390, h: 88}} size={34}>EXTRACTION SYSTEM</Copy>
    <FitBox text="METHOD" x={cards[1].x + 34} y={cards[1].y + 36} size={30} weight={600} tag="SYSTEM" startFrame={frame(cue.extraction)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold"/>
    <Copy at={cue.extraction} box={{x: 764, y: 420, w: 392, h: 62}} size={30}>STRUCTURE → FORCE</Copy>
    <Copy at={cue.equations} box={{x: 764, y: 525, w: 392, h: 88}} size={28} ink="color/text/soft">STATED IN EQUATIONS</Copy>
    <FitBox text="TEST" x={cards[2].x + 34} y={cards[2].y + 36} size={30} weight={600} tag="ARCHIVE" startFrame={frame(cue.historical)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold"/>
    <Copy at={cue.historical} box={{x: 1374, y: 420, w: 392, h: 62}} size={30}>HISTORICAL RECORD</Copy>
    <Copy at={cue.archives} box={{x: 1374, y: 525, w: 392, h: 88}} size={28} ink="color/text/soft">TESTED AGAINST ARCHIVES</Copy>
    <DrawLine points={[[580, 524], [730, 524]]} startFrame={frame(cue.extraction)} durationFrames={15} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <DrawLine points={[[1190, 524], [1340, 524]]} startFrame={frame(cue.historical)} durationFrames={15} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <Copy at={cue.archives} box={{x: 430, y: 850, w: 1060, h: 38}} size={26} ink="color/fill/gold">STRUCTURE · EQUATIONS · HISTORICAL ARCHIVES</Copy>
  </KitSound></StageSceneFrame>;
}
