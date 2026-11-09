import React from 'react';
import {DrawLine, DrawRect, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, Scene, enter, frame} from './shared';

// Turns 160–164: the flat two-set picture splits step by step — two tiers fail the historical
// record, then three, four, and five tiers separate Elite, Puppet, Enforcement, Buffer, Out-group.
export function TierSplits({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    trace: useCue('t160Trace').at,
    splits: useCue('t160Splits').at,
    step: useCue('t160Step').at,
    five: useCue('t160Five').at,
    twoTier: useCue('t161TwoTier').at,
    oppressor: useCue('t161Oppressor').at,
    oppressed: useCue('t161Oppressed').at,
    surplus: useCue('t161Surplus').at,
    predicts: useCue('t161Predicts').at,
    record: useCue('t161Record').at,
    splitting: useCue('t162Splitting').at,
    threeTier: useCue('t162ThreeTier').at,
    elite: useCue('t162Elite').at,
    beneficiary: useCue('t162Beneficiary').at,
    middle: useCue('t162Middle').at,
    outgroup: useCue('t162Outgroup').at,
    load: useCue('t162Load').at,
    compresses: useCue('t163Compresses').at,
    lawmaking: useCue('t163Lawmaking').at,
    fourth: useCue('t163Fourth').at,
    puppet: useCue('t163Puppet').at,
    salaried: useCue('t163Salaried').at,
    statutes: useCue('t163Statutes').at,
    fifth: useCue('t164Fifth').at,
    enforcementClass: useCue('t164EnforcementClass').at,
    bufferClass: useCue('t164BufferClass').at,
    standing: useCue('t164Standing').at,
    defend: useCue('t164Defend').at,
  };
  const p2 = enter(ms, cue.twoTier, 500) * (1 - enter(ms, cue.splitting, 400));
  const p3 = enter(ms, cue.splitting, 500) * (1 - enter(ms, cue.fourth, 400));
  const p4 = enter(ms, cue.fourth, 500) * (1 - enter(ms, cue.fifth, 400));
  const p5 = enter(ms, cue.fifth, 500);
  const label = (at: number, y: number, text: string, size = 28, tone = 'color/text/primary') =>
    <Copy key={text} at={at} box={{x: 640, y, w: 640, h: 38}} size={size} align="center" tone={tone}>{text}</Copy>;
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 106, w: 1200, h: 70}} at={cue.splits}/>
    <Copy at={cue.five} box={{x: 150, y: 124, w: 1100, h: 40}} size={32}>FROM TWO SETS TO FIVE TIERS</Copy>
    <Copy at={cue.step} box={{x: 150, y: 190, w: 300, h: 26}} size={20} mono tone="color/text/dim">STEP BY STEP</Copy>
    <DrawLine points={[[212, 240], [212, 760]]} startFrame={frame(cue.trace)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
    {[['2', cue.twoTier], ['3', cue.threeTier], ['4', cue.fourth], ['5', cue.fifth]].map(([n, at], i) => {
      const y = 300 + i * 140;
      return <React.Fragment key={String(n)}>
        <DrawRect box={{x: 180, y, w: 64, h: 64}} startFrame={frame(Number(at))} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
        <Copy at={Number(at)} box={{x: 180, y: y + 14, w: 64, h: 36}} size={30} mono align="center" tone="color/fill/gold">{String(n)}</Copy>
      </React.Fragment>;
    })}
    <DrawRect box={{x: 620, y: 220, w: 680, h: 700}} startFrame={frame(cue.splits)} durationFrames={20} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
    {p2 > 0 && <div style={{position: 'absolute', inset: 0, opacity: p2}}>
      <DrawRect box={{x: 640, y: 240, w: 640, h: 300}} progress={1} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
      <DrawRect box={{x: 640, y: 552, w: 640, h: 300}} progress={1} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race"/>
      {label(cue.oppressor, 370, 'OPPRESSOR', 30)}
      {label(cue.oppressed, 682, 'OPPRESSED', 30)}
      <DrawLine points={[[960, 800], [960, 560]]} startFrame={frame(cue.surplus)} durationFrames={20} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={6} end="arrow" beat/>
      <Copy at={cue.surplus} box={{x: 985, y: 660, w: 280, h: 28}} size={20} tone="color/fill/gold">EXTRACTED SURPLUS</Copy>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - enter(ms, cue.record, 300)}}>
        <Copy at={cue.predicts} box={{x: 660, y: 868, w: 600, h: 30}} size={20} align="center" tone="color/text/soft">PREDICTS SHARED OPPRESSOR WEALTH</Copy>
      </div>
      <Copy at={cue.record} box={{x: 660, y: 868, w: 600, h: 30}} size={20} mono align="center" tone="color/marker/race">RECORD DOES NOT SHOW</Copy>
    </div>}
    {p3 > 0 && <div style={{position: 'absolute', inset: 0, opacity: p3}}>
      <DrawRect box={{x: 640, y: 240, w: 640, h: 160}} progress={1} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
      <DrawRect box={{x: 640, y: 412, w: 640, h: 200}} progress={1} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
      <DrawRect box={{x: 640, y: 624, w: 640, h: 216}} progress={1} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race"/>
      {label(cue.elite, 290, 'ELITE', 30, 'color/fill/gold')}
      {label(cue.beneficiary, 340, 'BENEFICIARY CLASS', 20, 'color/text/soft')}
      {label(cue.middle, 492, 'IN-GROUP', 28)}
      {label(cue.outgroup, 712, 'OUT-GROUP', 28)}
      <DrawRect box={{x: 700, y: 632, w: 520, h: 14}} startFrame={frame(cue.load)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/red-wash" glowToken="color/marker/race" beat/>
      <Copy at={cue.load} box={{x: 660, y: 868, w: 600, h: 30}} size={20} align="center" tone="color/marker/race">BASE CARRIES THE EXTRACTED LOAD</Copy>
      {ms >= cue.compresses && <DrawRect box={{x: 628, y: 400, w: 664, h: 224}} startFrame={frame(cue.compresses)} durationFrames={14} strokeToken="color/line/accent" glowToken="color/fill/gold" strokeWidth={3} beat/>}
      {label(cue.lawmaking, 540, 'LAWMAKING', 20, 'color/text/dim')}
    </div>}
    {p4 > 0 && <div style={{position: 'absolute', inset: 0, opacity: p4}}>
      <DrawRect box={{x: 640, y: 240, w: 640, h: 130}} progress={1} strokeToken="color/fill/gold" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
      <DrawRect box={{x: 640, y: 382, w: 640, h: 130}} progress={1} strokeToken="color/line/accent" fillToken="color/fill/panel-render" glowToken="color/line/accent"/>
      <DrawRect box={{x: 640, y: 524, w: 640, h: 130}} progress={1} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
      <DrawRect box={{x: 640, y: 666, w: 640, h: 150}} progress={1} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race"/>
      {label(cue.fourth, 286, 'ELITE', 28, 'color/fill/gold')}
      {label(cue.puppet, 428, 'PUPPET CLASS', 28)}
      {label(cue.salaried, 468, 'SALARIED OFFICIALS', 18, 'color/text/dim')}
      {label(cue.fourth, 570, 'IN-GROUP', 28)}
      {label(cue.fourth, 722, 'OUT-GROUP', 28)}
      <Copy at={cue.statutes} box={{x: 660, y: 868, w: 600, h: 30}} size={20} align="center" tone="color/text/soft">TRANSLATED INTO STATUTES · RULINGS · POLICY</Copy>
    </div>}
    {p5 > 0 && <div style={{position: 'absolute', inset: 0, opacity: p5}}>
      {([
        [240, 'ELITE', cue.fifth, 'color/fill/gold', 'color/fill/gold-wash', 'color/fill/gold'],
        [372, 'PUPPET CLASS', cue.fifth, 'color/text/primary', 'color/fill/panel-render', 'color/line/accent'],
        [504, 'ENFORCEMENT CLASS', cue.enforcementClass, 'color/text/primary', 'color/fill/panel-render', 'color/marker/race'],
        [636, 'BUFFER CLASS', cue.bufferClass, 'color/text/primary', 'color/fill/panel-render', 'color/fill/gold'],
        [768, 'OUT-GROUP', cue.fifth, 'color/text/primary', 'color/fill/red-faint', 'color/marker/race'],
      ] as const).map(([y, text, at, tone, fill, stroke]) => <React.Fragment key={String(text)}>
        <DrawRect box={{x: 640, y: Number(y), w: 640, h: 120}} progress={1} strokeToken={String(stroke)} fillToken={String(fill)} glowToken={String(stroke)}/>
        {label(Number(at), Number(y) + 41, String(text), 28, String(tone))}
      </React.Fragment>)}
      <DrawLine points={[[640, 762], [1280, 762]]} startFrame={frame(cue.defend)} durationFrames={14} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} beat/>
      <Copy at={cue.standing} box={{x: 620, y: 934, w: 680, h: 30}} size={20} align="center" tone="color/fill/gold">BUFFER PAID IN SOCIAL STANDING</Copy>
    </div>}
  </Scene>;
}
