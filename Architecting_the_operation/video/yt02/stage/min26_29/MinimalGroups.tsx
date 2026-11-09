import React from 'react';
import {DrawLine, KitSound, QRCode, StageSceneFrame, StickFigure, color, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Tag, frame} from './Visuals';

// Turns 126–130: Tajfel's minimal-group apparatus in three panels —
// arbitrary assignment, zero prior stake, and the observed reward gap.
export function MinimalGroups({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    henri: useCue('t126Henri').at, minimal: useCue('t126Minimal').at, theory: useCue('t126Theory').at, evidence: useCue('t126Evidence').at,
    tajfel: useCue('t127Tajfel').at, arbitrary: useCue('t127Arbitrary').at, klee: useCue('t127Klee').at, dots: useCue('t127Dots').at,
    zero: useCue('t128Zero').at, history: useCue('t128History').at, stake: useCue('t128Stake').at,
    stripped: useCue('t129Stripped').at, favored: useCue('t129Favored').at, gap: useCue('t129Gap').at,
    finding: useCue('t130Finding').at, automatic: useCue('t130Automatically').at, boundary: useCue('t130Boundary').at,
  };
  const cards = [['PAINTING PREFERENCE', c.klee], ['DOT ESTIMATE', c.dots]] as const;
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.henri} box={{x: 120, y: 104, w: 1680, h: 48}} size={34}>TAJFEL · MINIMAL-GROUP EXPERIMENTS</Copy>
    <Copy at={c.minimal} box={{x: 120, y: 160, w: 1680, h: 30}} size={22} tone="color/fill/gold" align="center">EARLY 1970S · MINIMAL-GROUP EXPERIMENTS</Copy>
    <Copy at={c.theory} box={{x: 120, y: 198, w: 1680, h: 30}} size={22} tone="color/text/soft" align="center">SOCIAL IDENTITY THEORY</Copy>
    <DrawLine points={[[740, 238], [1180, 238]]} startFrame={frame(c.evidence)} durationFrames={16} strokeToken="color/fill/gold" strokeWidth={3} beat />
    <Panel box={{x: 120, y: 285, w: 520, h: 500}} at={c.tajfel} beat />
    <Tag at={c.arbitrary} text="ARBITRARY GROUPS" x={158} y={260} />
    {cards.map(([label, at], i) => <React.Fragment key={label}>
      <Panel box={{x: 160, y: 375 + i * 180, w: 440, h: 118}} at={at} accent="color/line/hairline-strong" />
      <Copy at={at} box={{x: 184, y: 415 + i * 180, w: 390, h: 31}} size={24} align="center">{label}</Copy>
    </React.Fragment>)}
    <Panel box={{x: 730, y: 285, w: 470, h: 500}} at={c.zero} accent="color/line/hairline-strong" beat />
    <Copy at={c.zero} box={{x: 775, y: 350, w: 380, h: 35}} size={28} align="center">ZERO CONTACT</Copy>
    <Copy at={c.history} box={{x: 775, y: 480, w: 380, h: 35}} size={28} align="center">ZERO SHARED HISTORY</Copy>
    <Copy at={c.stake} box={{x: 775, y: 610, w: 380, h: 65}} size={28} align="center">ZERO MATERIAL STAKE</Copy>
    <Panel box={{x: 1290, y: 285, w: 510, h: 500}} at={c.stripped} accent="color/marker/race" beat />
    <StickFigure x={1400} y={480} group="ingroup" emphasis={1} scale={1.2} animate startFrame={frame(c.favored)} durationFrames={16} beat />
    <StickFigure x={1650} y={480} group="outgroup" emphasis={1} scale={1.2} animate startFrame={frame(c.gap)} durationFrames={16} beat />
    <DrawLine points={[[1485, 505], [1605, 505]]} startFrame={frame(c.gap)} durationFrames={16} strokeToken="color/marker/race" strokeWidth={5} end="arrow" beat />
    <Copy at={c.favored} box={{x: 1335, y: 650, w: 420, h: 32}} size={25} align="center">FAVOR ASSIGNED IN-GROUP</Copy>
    <Copy at={c.gap} box={{x: 1335, y: 700, w: 420, h: 32}} size={22} tone="color/marker/race" align="center">MAXIMIZE RELATIVE GAP</Copy>
    <Panel box={{x: 360, y: 845, w: 1200, h: 92}} at={c.finding} beat />
    <Copy at={c.automatic} box={{x: 400, y: 868, w: 1120, h: 28}} size={24} align="center">GROUP BOUNDARY → AUTOMATIC COGNITION</Copy>
    <DrawLine points={[[620, 908], [1300, 908]]} startFrame={frame(c.boundary)} durationFrames={16} strokeToken="color/fill/gold" strokeWidth={3} beat />
    {ms >= c.henri && <div data-shared="SourceLine" style={{position:'absolute',right:116,top:940,display:'flex',alignItems:'center',gap:16,opacity:Math.max(0,Math.min(1,(ms-c.henri)/267)),pointerEvents:'none'}}>
      <div style={{font:'400 20px "IBM Plex Mono"',lineHeight:1.35,letterSpacing:.35,color:color('color/text/muted'),textAlign:'right',whiteSpace:'nowrap'}}>
        Tajfel · Scientific American · 1970
      </div>
      <QRCode url="https://doi.org/10.1038/scientificamerican1170-96" size={100}/>
    </div>}
  </KitSound></StageSceneFrame>;
}
