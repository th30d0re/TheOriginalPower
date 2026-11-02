import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  SignalLane,
  lineAttrs,
  pathFrom,
  shapeAttrs,
  type LaneToken,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const IMPLICIT_TRACE_LAYOUT = {
  // Turn 41: Full-canvas 4-region composition (y: 115..880, span = 765 px)
  t41Banner: {x: 120, y: 115, w: 1670, h: 72},
  definitionCard: {x: 120, y: 215, w: 690, h: 310},
  plainPanel: {x: 120, y: 555, w: 690, h: 325},
  stream: {x: 845, y: 215, w: 300, h: 665},
  traceStore: {x: 1185, y: 215, w: 300, h: 665},
  reactionRail: {x: 1525, y: 215, w: 265, h: 665},

  // Turn 42: Centered convergence composition (y: 115..885, span = 770 px)
  t42Banner: {x: 140, y: 115, w: 1640, h: 72},
  beliefLane: {x: 140, y: 230, w: 620, h: 300},
  personHub: {x: 830, y: 230, w: 260, h: 300},
  automaticLane: {x: 1160, y: 230, w: 620, h: 300},
  responseNode: {x: 360, y: 620, w: 1200, h: 265},

  source: {x: 116, y: 954, w: 740, h: 30},
} as const;

export function ImplicitTrace({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t41Define: useCue('t41Define').at,
    t41Unidentified: useCue('t41Unidentified').at,
    t41Past: useCue('t41Past').at,
    t41Favorable: useCue('t41Favorable').at,
    t41Unfavorable: useCue('t41Unfavorable').at,
    t41Action: useCue('t41Action').at,
    t41Plain: useCue('t41Plain').at,
    t41Experiences: useCue('t41Experiences').at,
    t41Shortcuts: useCue('t41Shortcuts').at,
    t41Steer: useCue('t41Steer').at,
    t41Noticing: useCue('t41Noticing').at,
    t42Precision: useCue('t42Precision').at,
    t42Automatically: useCue('t42Automatically').at,
    t42Accumulated: useCue('t42Accumulated').at,
    t42Sincerely: useCue('t42Sincerely').at,
    t42Equal: useCue('t42Equal').at,
    t42Treatment: useCue('t42Treatment').at,
  };

  const L = IMPLICIT_TRACE_LAYOUT;
  const isTurn42 = ms >= cue.t42Precision;

  const defP = enter(ms, cue.t41Define);
  const unidentP = enter(ms, cue.t41Unidentified);
  const pastP = enter(ms, cue.t41Past);
  const favP = enter(ms, cue.t41Favorable);
  const unfavP = enter(ms, cue.t41Unfavorable);
  const actionP = enter(ms, cue.t41Action);
  const plainP = enter(ms, cue.t41Plain);
  const expP = enter(ms, cue.t41Experiences);
  const shortcutsP = enter(ms, cue.t41Shortcuts);
  const steerP = enter(ms, cue.t41Steer);

  const precisionP = enter(ms, cue.t42Precision);
  const autoP = enter(ms, cue.t42Automatically);
  const accumP = enter(ms, cue.t42Accumulated);
  const sincereP = enter(ms, cue.t42Sincerely);
  const equalP = enter(ms, cue.t42Equal);
  const treatP = enter(ms, cue.t42Treatment);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const muted = color('color/text/muted');
  const soft = color('color/text/soft');
  const primary = color('color/text/primary');

  // Turn 41 connectors & steering geometry
  const streamToStore: Point[] = [[1145, 535], [1185, 535]];
  const shortcutStroke: Point[] = [[1485, 535], [1525, 535]];
  const traceFaintPath: Point[] = [
    [1215, 620],
    [1275, 620],
    [1305, 642],
    [1365, 642],
    [1395, 620],
    [1455, 620],
  ];

  // Turn 41 reaction scale & steered needle inside reactionRail (x: 1525..1790, y: 330..480)
  const scaleSpine: Point[] = [[1658, 336], [1658, 476]];
  const scaleTickTop: Point[] = [[1642, 346], [1674, 346]];
  const scaleTickMid: Point[] = [[1646, 406], [1670, 406]];
  const scaleTickBot: Point[] = [[1642, 466], [1674, 466]];
  // Needle pivots from (1600, 406) toward the lower steered branch on the scale
  const steerAngle = (16 + steerP * 14) * (Math.PI / 180);
  const needleTipX = Math.round(1600 + Math.cos(steerAngle) * 76);
  const needleTipY = Math.round(406 + Math.sin(steerAngle) * 76);
  const reactionNeedle: Point[] = [[1600, 406], [needleTipX, needleTipY]];
  const traceToNeedleLeader: Point[] = [[1525, 406], [1586, 406]];

  // Turn 42 tokens & convergence leaders
  const beliefTokens: LaneToken[] = [
    {id: 'b1', at: 0.32, emphasis: Math.max(0.65, sincereP), accent: 'color/fill/gold', shape: 'card'},
    {id: 'b2', at: 0.72, emphasis: Math.max(0.65, equalP), accent: 'color/fill/gold', shape: 'card'},
  ];

  const autoTokens: LaneToken[] = [
    {id: 'a1', at: 0.25, emphasis: Math.max(0.65, autoP), accent: 'color/marker/race', shape: 'dot'},
    {id: 'a2', at: 0.55, emphasis: Math.max(0.65, accumP), accent: 'color/marker/race', shape: 'dot'},
    {id: 'a3', at: 0.85, emphasis: Math.max(0.65, autoP), accent: 'color/marker/race', shape: 'dot'},
  ];

  const leaderBeliefToPerson: Point[] = [[760, 394], [828, 394]];
  const leaderAutoToPerson: Point[] = [[1160, 394], [1092, 394]];
  const leaderPersonToReaction: Point[] = [[960, 532], [960, 618]];
  const leaderBeliefToReaction: Point[] = [[450, 532], [450, 576], [720, 576], [720, 618]];
  const leaderAutoToReaction: Point[] = [[1470, 532], [1470, 576], [1200, 576], [1200, 618]];

  const t42BalanceNeedle: Point[] = [[960, 792], [984, 744]];

  return (
    <StageSceneFrame segment={segment}>
      {!isTurn42 && ms >= cue.t41Define && (
        <div data-turn="41" style={{opacity: defP}}>
          {/* Top Header Banner (height 72, text span 36 -> 36 px slack) */}
          <Panel id="t41-banner" box={L.t41Banner} accent="color/fill/gold" />
          <Label id="t41-banner-title" box={{x: 148, y: 133, w: 980, h: 36}} size={28} weight={650} sans ink={gold}>
            IMPLICIT ATTITUDE · TRACE &amp; SHORTCUT MECHANISM
          </Label>
          <Label id="t41-banner-sub" box={{x: 1150, y: 136, w: 612, h: 30}} size={20} weight={500} align="right" ink={soft}>
            AUTOMATIC TRACE PATHWAY
          </Label>

          {/* Left Top: Definition Card (height 310, text span 273 -> 37 px slack) */}
          <Panel id="def-card" box={L.definitionCard} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
          </Panel>
          <Label id="def-term" box={{x: 150, y: 233, w: 630, h: 42}} size={34} weight={650} sans ink={gold}>
            {ms >= cue.t41Define ? 'IMPLICIT ATTITUDE' : 'CONCEPT DEFINITION'}
          </Label>
          <Label id="def-body" box={{x: 150, y: 288, w: 630, h: 160}} size={28} weight={400} lh={1.32} sans ink={primary}>
            {ms >= cue.t41Define
              ? 'traces of past experience that shape favorable or unfavorable feeling, thought, or action toward social objects'
              : 'Prior social exposures leave stored traces that guide subsequent evaluations and responses.'}
          </Label>
          <Label id="def-source" box={{x: 150, y: 476, w: 360, h: 30}} size={20} weight={500} ink={muted}>
            {ms >= cue.t41Define ? 'Greenwald & Banaji 1995' : 'Foundational formulation'}
          </Label>
          <Label id="def-paraphrased" box={{x: 510, y: 476, w: 270, h: 30}} size={20} weight={400} align="right" ink={muted}>
            {ms >= cue.t41Define ? '(paraphrased)' : 'definition card'}
          </Label>

          {/* Left Bottom: Plain-Language Process Panel (height 325, text span 289 -> 36 px slack) */}
          <div data-plain-panel={ms >= cue.t41Plain ? 'true' : undefined}>
            <Panel id="plain-panel" box={L.plainPanel} accent={ms >= cue.t41Plain ? 'color/fill/gold' : 'color/line/hairline'} />
            <Label
              id="plain-heading"
              box={{x: 150, y: 573, w: 630, h: 38}}
              size={28}
              weight={650}
              sans
              ink={gold}
              opacity={ms >= cue.t41Plain ? plainP : 1}
            >
              {ms >= cue.t41Plain ? 'IN PLAIN WORDS' : 'OPERATIONAL MECHANISM'}
            </Label>
            <Label id="plain-body" box={{x: 150, y: 626, w: 630, h: 165}} size={28} weight={400} lh={1.32} sans ink={primary}>
              {ms >= cue.t41Plain
                ? 'Past experiences leave mental shortcuts that steer reactions without the person noticing where those reactions came from.'
                : 'Stored experiential traces route through an unexamined shortcut to tilt feeling, thought, and action.'}
            </Label>
            <Label id="plain-footer" box={{x: 150, y: 832, w: 630, h: 30}} size={20} weight={500} ink={ms >= cue.t41Plain ? gold : muted}>
              TRACE STREAM → SHORTCUT BYPASS → STEERED REACTION
            </Label>
          </div>

          {/* Column 2: Past-Experience Stream (x: 845, y: 215, w: 300, h: 665, text span 629 -> 36 px slack) */}
          {ms >= cue.t41Past && (
            <div data-stream="true" style={{opacity: pastP}}>
              <Panel id="stream-panel" box={L.stream} />
              <Label id="stream-label" box={{x: 863, y: 233, w: 264, h: 32}} size={22} weight={650} ls={0.6} align="center" ink={gold}>
                PAST EXPERIENCE
              </Label>
              <Label id="stream-sub" box={{x: 863, y: 273, w: 264, h: 28}} size={20} weight={500} align="center" ink={soft}>
                TRACE INPUT STREAM
              </Label>

              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('stream-to-store', streamToStore)} d={pathFrom(streamToStore)} stroke={gold} strokeWidth="3" strokeDasharray="4 4" />
              </svg>

              {/* Chip 1: accumulated surroundings (height 112, text span 82 -> 30 px slack) */}
              <Panel id="exp-card-1" box={{x: 863, y: 325, w: 264, h: 112}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="exp-card-1-tag" box={{x: 879, y: 341, w: 232, h: 26}} size={20} weight={600} ink={gold}>
                TRACE 01
              </Label>
              <Label id="exp-card-1-label" box={{x: 879, y: 371, w: 232, h: 52}} size={20} weight={500} ink={primary}>
                accumulated surroundings
              </Label>

              {/* Chip 2: repeated exposure (height 112, text span 82 -> 30 px slack) */}
              <Panel id="exp-card-2" box={{x: 863, y: 460, w: 264, h: 112}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="exp-card-2-tag" box={{x: 879, y: 476, w: 232, h: 26}} size={20} weight={600} ink={gold}>
                TRACE 02
              </Label>
              <Label id="exp-card-2-label" box={{x: 879, y: 506, w: 232, h: 52}} size={20} weight={500} ink={primary}>
                repeated exposure
              </Label>

              {/* Chip 3: stored association (height 112, text span 82 -> 30 px slack) */}
              <Panel id="exp-card-3" box={{x: 863, y: 595, w: 264, h: 112}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="exp-card-3-tag" box={{x: 879, y: 611, w: 232, h: 26}} size={20} weight={600} ink={gold}>
                TRACE 03
              </Label>
              <Label id="exp-card-3-label" box={{x: 879, y: 641, w: 232, h: 52}} size={20} weight={500} ink={primary}>
                stored association
              </Label>

              <Label id="stream-route-note" box={{x: 863, y: 732, w: 264, h: 54}} size={20} weight={500} align="center" ink={soft}>
                FEEDS TRACE STORE
              </Label>
              <Label
                id="stream-experiences"
                box={{x: 863, y: 806, w: 264, h: 56}}
                size={20}
                weight={600}
                align="center"
                ink={ms >= cue.t41Experiences ? gold : muted}
                opacity={ms >= cue.t41Experiences ? expP : 1}
              >
                {ms >= cue.t41Experiences ? 'EVERYDAY PAST EXPERIENCES' : 'EXPERIENTIAL LOG'}
              </Label>
            </div>
          )}

          {/* Column 3: Introspectively Unidentified Trace Store (x: 1185, y: 215, w: 300, h: 665, text span 629 -> 36 px slack) */}
          {ms >= cue.t41Unidentified && (
            <div data-trace-store="true" style={{opacity: unidentP}}>
              <Panel id="trace-panel" box={L.traceStore} />
              <Label id="trace-title" box={{x: 1201, y: 233, w: 268, h: 80}} size={20} weight={650} ls={0.4} align="center" ink={gold}>
                INTROSPECTIVELY UNIDENTIFIED TRACE
              </Label>

              {/* Translucent Inspection Screen (height 382, text span 349 -> 33 px slack) */}
              <Panel id="inspection-screen" box={{x: 1203, y: 325, w: 264, h: 382}}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(38, 56, 89, 0.45)',
                    opacity: ms >= cue.t41Noticing ? 0.35 : 0.72,
                  }}
                />
              </Panel>
              <Label id="screen-heading" box={{x: 1217, y: 341, w: 236, h: 28}} size={20} weight={600} align="center" ink={soft}>
                INSPECTION SCREEN
              </Label>

              <Panel id="trace-stored-1" box={{x: 1217, y: 385, w: 236, h: 90}} accent="color/line/hairline">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="trace-stored-1-label" box={{x: 1229, y: 401, w: 212, h: 58}} size={20} weight={500} align="center" ink={gold}>
                UNIDENTIFIED TRACE
              </Label>

              <Panel id="trace-stored-2" box={{x: 1217, y: 495, w: 236, h: 90}} accent="color/line/hairline">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="trace-stored-2-label" box={{x: 1229, y: 511, w: 212, h: 58}} size={20} weight={500} align="center" ink={primary}>
                STORED SHORTCUT
              </Label>

              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path
                  {...lineAttrs('faint-path', traceFaintPath)}
                  d="M1215 620H1275C1305 620 1305 642 1335 642C1365 642 1365 620 1395 620H1455"
                  fill="none"
                  stroke={gold}
                  strokeWidth={ms >= cue.t41Steer ? 3.5 : 2.5}
                  strokeDasharray="5 4"
                  opacity={ms >= cue.t41Steer ? 0.92 : 0.65}
                />
              </svg>

              <Label id="screen-footer" box={{x: 1217, y: 656, w: 236, h: 34}} size={20} weight={500} align="center" ink={muted}>
                OUTSIDE AWARENESS
              </Label>

              {/* Shortcut label & connector below inspection screen */}
              <div data-shortcut={ms >= cue.t41Shortcuts ? 'true' : undefined}>
                <Label
                  id="shortcut-label"
                  box={{x: 1201, y: 730, w: 268, h: 56}}
                  size={20}
                  weight={650}
                  ls={0.5}
                  align="center"
                  ink={ms >= cue.t41Shortcuts ? gold : soft}
                  opacity={ms >= cue.t41Shortcuts ? shortcutsP : 1}
                >
                  {ms >= cue.t41Shortcuts ? 'MENTAL SHORTCUT' : 'BYPASS ROUTE'}
                </Label>
                <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                  <path
                    {...lineAttrs('shortcut-path', shortcutStroke)}
                    d={pathFrom(shortcutStroke)}
                    stroke={gold}
                    strokeWidth={ms >= cue.t41Steer ? 4 : 2.5}
                  />
                </svg>
              </div>

              <Label id="trace-footer" box={{x: 1201, y: 806, w: 268, h: 56}} size={20} weight={500} align="center" ink={muted}>
                STEERS REACTION
              </Label>
            </div>
          )}

          {/* Column 4: Reaction Rail with Steered Scale & Needle (x: 1525, y: 215, w: 265, h: 665, text span 629 -> 36 px slack) */}
          <div data-reaction-rail="true" style={{opacity: Math.max(0.85, favP, unfavP, actionP)}}>
            <Panel id="rail-panel" box={L.reactionRail} />
            <Label id="rail-label" box={{x: 1541, y: 233, w: 233, h: 34}} size={24} weight={650} ls={0.8} align="center" ink={gold}>
              REACTION
            </Label>

            <Label
              id="valence-pos"
              box={{x: 1541, y: 282, w: 233, h: 32}}
              size={20}
              weight={650}
              ls={0.6}
              align="center"
              ink={ms >= cue.t41Favorable ? gold : muted}
              opacity={ms >= cue.t41Favorable ? favP : 1}
            >
              {ms >= cue.t41Favorable ? '+ FAVORABLE' : '+ POSITIVE POLE'}
            </Label>

            {/* Reaction Scale & Needle steered by the trace (y: 330..480) */}
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              {/* Incoming steering trace from trace-store edge to needle pivot */}
              <path
                {...lineAttrs('trace-to-needle', traceToNeedleLeader)}
                d={pathFrom(traceToNeedleLeader)}
                fill="none"
                stroke={gold}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              {/* Vertical valence scale spine & ticks */}
              <path {...lineAttrs('reaction-scale-spine', scaleSpine)} d={pathFrom(scaleSpine)} fill="none" stroke={soft} strokeWidth="3" />
              <path {...lineAttrs('reaction-scale-top', scaleTickTop)} d={pathFrom(scaleTickTop)} fill="none" stroke={gold} strokeWidth="3" />
              <path {...lineAttrs('reaction-scale-mid', scaleTickMid)} d={pathFrom(scaleTickMid)} fill="none" stroke={muted} strokeWidth="2" />
              <path {...lineAttrs('reaction-scale-bot', scaleTickBot)} d={pathFrom(scaleTickBot)} fill="none" stroke={raceRed} strokeWidth="3" />
              {/* Steered reaction needle */}
              <path
                {...lineAttrs('reaction-needle', reactionNeedle)}
                d={pathFrom(reactionNeedle)}
                fill="none"
                stroke={ms >= cue.t41Steer ? raceRed : gold}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div
              {...shapeAttrs('reaction-needle-pivot', {x: 1591, y: 397, w: 18, h: 18}, 'mark', 'reaction-pivot')}
              style={{
                position: 'absolute',
                left: 1591,
                top: 397,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: gold,
                border: `2px solid ${color('color/bg/field')}`,
                boxSizing: 'border-box',
              }}
            />

            <Label id="reaction-scale-caption" box={{x: 1541, y: 492, w: 233, h: 56}} size={20} weight={600} align="center" ink={gold}>
              STEERED BY TRACE
            </Label>

            {/* Feeling, Thought, Action Modality Sockets */}
            <div data-action-sockets={ms >= cue.t41Action ? 'true' : undefined}>
              <Label
                id="socket-feeling"
                box={{x: 1541, y: 568, w: 233, h: 32}}
                size={20}
                weight={600}
                align="center"
                ink={ms >= cue.t41Action ? primary : soft}
                opacity={ms >= cue.t41Action ? actionP : 1}
              >
                {ms >= cue.t41Action ? 'FEELING' : 'AFFECTIVE CHANNEL'}
              </Label>
              <Label
                id="socket-thought"
                box={{x: 1541, y: 616, w: 233, h: 32}}
                size={20}
                weight={600}
                align="center"
                ink={ms >= cue.t41Action ? primary : soft}
                opacity={ms >= cue.t41Action ? actionP : 1}
              >
                {ms >= cue.t41Action ? 'THOUGHT' : 'COGNITIVE CHANNEL'}
              </Label>
              <Label
                id={ms >= cue.t41Action ? 'socket-action' : 'socket-action-pre'}
                box={{x: 1541, y: 664, w: 233, h: 32}}
                size={20}
                weight={600}
                align="center"
                ink={ms >= cue.t41Action ? gold : soft}
                opacity={ms >= cue.t41Action ? actionP : 1}
              >
                {ms >= cue.t41Action ? 'ACTION' : 'BEHAVIORAL CHANNEL'}
              </Label>
            </div>

            <Label
              id="valence-neg"
              box={{x: 1541, y: 732, w: 233, h: 32}}
              size={20}
              weight={650}
              ls={0.6}
              align="center"
              ink={ms >= cue.t41Unfavorable ? raceRed : muted}
              opacity={ms >= cue.t41Unfavorable ? unfavP : 1}
            >
              {ms >= cue.t41Unfavorable ? '− UNFAVORABLE' : '− NEGATIVE POLE'}
            </Label>

            <Label id="rail-footer" box={{x: 1541, y: 806, w: 233, h: 56}} size={20} weight={500} align="center" ink={muted}>
              VALENCE SCALE
            </Label>
          </div>
        </div>
      )}

      {/* TURN 42: Centered Convergence Composition (y: 115..885, span = 770 px) */}
      {isTurn42 && (
        <div data-turn="42" style={{opacity: precisionP}}>
          {/* Top Title Banner (height 72, text span 36 -> 36 px slack) */}
          <Panel id="t42-banner" box={L.t42Banner} accent="color/fill/gold" />
          <Label id="t42-banner-title" box={{x: 170, y: 133, w: 1020, h: 36}} size={28} weight={650} sans ink={gold}>
            SIMULTANEOUS DUAL INPUTS · BELIEF &amp; AUTOMATIC TRACE
          </Label>
          <Label id="t42-banner-sub" box={{x: 1210, y: 136, w: 540, h: 30}} size={20} weight={500} align="right" ink={soft}>
            COEXISTING CHANNELS IN ONE PERSON
          </Label>

          {/* Left: Belief Lane (x: 140, y: 230, w: 620, h: 300, text span 270 -> 30 px slack) */}
          <SignalLane
            id="belief-lane"
            box={L.beliefLane}
            label="SINCERE EQUAL-TREATMENT BELIEF"
            progress={precisionP}
            accent="color/fill/gold"
            direction="right"
            tokens={beliefTokens}
          />
          <Label id="belief-desc" box={{x: 164, y: 288, w: 572, h: 72}} size={28} weight={500} sans ink={primary}>
            Consciously endorsed principle of equal treatment.
          </Label>
          <Label
            id={ms >= cue.t42Equal ? 'equal-treatment' : 'equal-treatment-pre'}
            box={{x: 164, y: 428, w: 520, h: 36}}
            size={24}
            weight={650}
            sans
            ink={gold}
            opacity={ms >= cue.t42Equal ? equalP : 1}
          >
            {ms >= cue.t42Equal ? 'EQUAL TREATMENT' : 'ENDORSED PRINCIPLE'}
          </Label>
          <Label id="belief-footer" box={{x: 164, y: 478, w: 572, h: 32}} size={20} weight={500} ink={soft}>
            EXPLICIT CHANNEL · CONSCIOUS COMMITMENT
          </Label>
          {ms >= cue.t42Sincerely && (
            <div
              {...shapeAttrs('sincere-ring', {x: 706, y: 430, w: 28, h: 28}, 'mark', 'ring')}
              style={{
                position: 'absolute',
                left: 706,
                top: 430,
                width: 28,
                height: 28,
                borderRadius: 14,
                border: `2.5px solid ${gold}`,
                boxSizing: 'border-box',
                opacity: sincereP,
              }}
            />
          )}

          {/* Center: One Person Hub (x: 830, y: 230, w: 260, h: 300, text span 264 -> 36 px slack) */}
          <Panel id="person-hub" box={L.personHub} accent="color/fill/gold" />
          <Label id="person-label" box={{x: 846, y: 248, w: 228, h: 34}} size={24} weight={650} ls={0.8} align="center" ink={gold}>
            ONE PERSON
          </Label>
          <div
            {...shapeAttrs('person-mark-frame', {x: 900, y: 305, w: 120, h: 135}, 'mark', 'person')}
            style={{position: 'absolute', left: 900, top: 305, width: 120, height: 135}}
          >
            <PersonMark x={60} y={68} group="neutral" emphasis={1} scale={1.65} />
          </div>
          <Label id="person-hub-sub" box={{x: 846, y: 458, w: 228, h: 54}} size={20} weight={500} align="center" ink={soft}>
            HOLDS BOTH CHANNELS
          </Label>

          {/* Right: Automatic Association Lane (x: 1160, y: 230, w: 620, h: 300, text span 270 -> 30 px slack) */}
          <SignalLane
            id="automatic-lane"
            box={L.automaticLane}
            label="AUTOMATIC ASSOCIATION"
            progress={precisionP}
            accent="color/marker/race"
            direction="left"
            tokens={autoTokens}
          />
          <Label id="auto-desc" box={{x: 1184, y: 288, w: 572, h: 72}} size={28} weight={500} sans ink={primary}>
            Habitual trace acquired from repeated exposure.
          </Label>
          <Label
            id="accumulated-surroundings"
            box={{x: 1184, y: 428, w: 572, h: 36}}
            size={24}
            weight={650}
            sans
            ink={raceRed}
            opacity={ms >= cue.t42Automatically ? autoP : 1}
          >
            {ms >= cue.t42Automatically ? 'ACCUMULATED SURROUNDINGS' : 'STORED TRACE ACTIVATION'}
          </Label>
          <Label id="auto-footer" box={{x: 1184, y: 478, w: 572, h: 32}} size={20} weight={500} ink={soft}>
            {ms >= cue.t42Accumulated ? 'HIDDEN-TRACE STORE FILLED · AUTOMATIC' : 'IMPLICIT CHANNEL · AUTOMATIC SHORTCUT'}
          </Label>

          {/* Convergence Leaders (visible throughout Turn 42 so e524 and e531 show full convergence) */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('leader-belief-person', leaderBeliefToPerson)} d={pathFrom(leaderBeliefToPerson)} fill="none" stroke={gold} strokeWidth="4" />
            <path {...lineAttrs('leader-auto-person', leaderAutoToPerson)} d={pathFrom(leaderAutoToPerson)} fill="none" stroke={raceRed} strokeWidth="4" />
            <path
              {...lineAttrs('leader-person-reaction', leaderPersonToReaction)}
              d={pathFrom(leaderPersonToReaction)}
              fill="none"
              stroke={gold}
              strokeWidth={ms >= cue.t42Treatment ? 4 : 3}
              strokeDasharray="6 4"
            />
            <path
              {...lineAttrs('leader-belief-reaction', leaderBeliefToReaction)}
              d={pathFrom(leaderBeliefToReaction)}
              fill="none"
              stroke={gold}
              strokeWidth="2.5"
              strokeDasharray="5 4"
            />
            <path
              {...lineAttrs('leader-auto-reaction', leaderAutoToReaction)}
              d={pathFrom(leaderAutoToReaction)}
              fill="none"
              stroke={raceRed}
              strokeWidth="2.5"
              strokeDasharray="5 4"
            />
          </svg>

          {/* Lower Reaction Panel (x: 360, y: 620, w: 1200, h: 265, text span 229 -> 36 px slack) */}
          <Panel
            id="response-node"
            box={L.responseNode}
            accent={ms >= cue.t42Treatment ? 'color/fill/gold' : 'color/line/hairline-strong'}
          >
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
          </Panel>
          <Label
            id={ms >= cue.t42Treatment ? 'response-title' : 'response-title-pre'}
            box={{x: 396, y: 638, w: 1128, h: 40}}
            size={32}
            weight={650}
            ls={0.8}
            sans
            align="center"
            ink={gold}
            opacity={ms >= cue.t42Treatment ? treatP : 1}
          >
            REACTION
          </Label>
          <Label id="response-body" box={{x: 396, y: 690, w: 1128, h: 42}} size={28} weight={400} sans align="center" ink={primary}>
            Sincere belief and automatic trace converge on one response.
          </Label>
          <Label id="response-left-tag" box={{x: 396, y: 752, w: 500, h: 34}} size={20} weight={600} ink={gold}>
            INPUT 1 · SINCERE BELIEF
          </Label>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('t42-balance-needle', t42BalanceNeedle)} d={pathFrom(t42BalanceNeedle)} fill="none" stroke={raceRed} strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div
            {...shapeAttrs('t42-balance-pivot', {x: 951, y: 783, w: 18, h: 18}, 'mark', 't42-pivot')}
            style={{
              position: 'absolute',
              left: 951,
              top: 783,
              width: 18,
              height: 18,
              borderRadius: 9,
              background: gold,
              boxSizing: 'border-box',
            }}
          />
          <Label id="response-right-tag" box={{x: 1024, y: 752, w: 500, h: 34}} size={20} weight={600} align="right" ink={raceRed}>
            INPUT 2 · AUTOMATIC TRACE
          </Label>
          <Label id="response-sub" box={{x: 396, y: 835, w: 1128, h: 32}} size={20} weight={500} align="center" ink={soft}>
            INDIVIDUAL RESPONSE NODE · SIMULTANEOUS CHANNEL OUTPUT
          </Label>
        </div>
      )}

      {ms >= cue.t41Define && (
        <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
          Greenwald &amp; Banaji 1995 · Psychological Review 102(1)
        </Label>
      )}
    </StageSceneFrame>
  );
}
