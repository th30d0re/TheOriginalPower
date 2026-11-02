import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  lineAttrs,
  pathFrom,
  shapeAttrs,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const IAT_LATENCY_LAYOUT = {
  // Turn 43: Full-height milestone composition (y: 115..880, span = 765 px)
  t43Banner: {x: 330, y: 115, w: 1260, h: 72},
  sourcePlaque: {x: 330, y: 225, w: 1260, h: 290},
  iatInstrumentCard: {x: 330, y: 560, w: 1260, h: 320},

  // Turn 44: Sorting monitor (y: 120..880, span = 760 px) + tight 2-bar latency panel (y: 290..710, h = 420)
  sortingMonitor: {x: 120, y: 120, w: 1140, h: 760},
  promptCard: {x: 350, y: 245, w: 680, h: 254},
  faceCard: {x: 374, y: 305, w: 296, h: 130},
  wordCard: {x: 710, y: 305, w: 296, h: 130},
  wordChip: {x: 738, y: 365, w: 240, h: 60},
  keyLeft: {x: 165, y: 660, w: 440, h: 136},
  keyRight: {x: 775, y: 660, w: 440, h: 136},
  timerTrace: {x: 380, y: 568, w: 290, h: 34},
  latencyInstrument: {x: 1310, y: 290, w: 490, h: 420},

  // Turn 45: Three-column convergent measurement (y: 115..887, span = 772 px)
  t45Banner: {x: 130, y: 115, w: 1660, h: 72},
  reactionInstrument: {x: 130, y: 225, w: 530, h: 560},
  fieldAuditInstrument: {x: 705, y: 225, w: 530, h: 560},
  judgmentMeter: {x: 1280, y: 225, w: 510, h: 560},
  t45Bus: {x: 130, y: 815, w: 1660, h: 72},

  source: {x: 116, y: 954, w: 1300, h: 30},
} as const;

export function IATLatency({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    // Turn 43
    t43Three: useCue('t43Three').at,
    t43NinetyEight: useCue('t43NinetyEight').at,
    t43Anthony: useCue('t43Anthony').at,
    t43McGhee: useCue('t43McGhee').at,
    t43Schwartz: useCue('t43Schwartz').at,
    t43Introduced: useCue('t43Introduced').at,
    t43Journal: useCue('t43Journal').at,
    t43Psychology: useCue('t43Psychology').at,
    // Turn 44
    t44Test: useCue('t44Test').at,
    t44Automatic: useCue('t44Automatic').at,
    t44ResponseLatency: useCue('t44ResponseLatency').at,
    t44Sorting: useCue('t44Sorting').at,
    t44SplitSecond: useCue('t44SplitSecond').at,
    t44Fast: useCue('t44Fast').at,
    t44Pairs: useCue('t44Pairs').at,
    t44Faces: useCue('t44Faces').at,
    t44Words: useCue('t44Words').at,
    t44Screen: useCue('t44Screen').at,
    // Turn 45
    t45Reaction: useCue('t45Reaction').at,
    t45Audits: useCue('t45Audits').at,
    t45Bias: useCue('t45Bias').at,
    t45Mental: useCue('t45Mental').at,
    t45Weighting: useCue('t45Weighting').at,
    t45Judgment: useCue('t45Judgment').at,
  };

  const L = IAT_LATENCY_LAYOUT;
  const isTurn45 = ms >= cue.t45Reaction;
  const isTurn44 = ms >= cue.t44Test && !isTurn45;
  const isTurn43 = !isTurn44 && !isTurn45;

  const plaqueP = enter(ms, cue.t43Three);
  const yearP = enter(ms, cue.t43NinetyEight);
  const anthonyP = enter(ms, cue.t43Anthony);
  const introP = enter(ms, cue.t43Introduced);
  const journalP = enter(ms, cue.t43Journal);

  const testP = enter(ms, cue.t44Test);
  const autoP = enter(ms, cue.t44Automatic);
  const latencyP = enter(ms, cue.t44ResponseLatency);
  const sortingP = enter(ms, cue.t44Sorting);
  const splitP = enter(ms, cue.t44SplitSecond);
  const fastP = enter(ms, cue.t44Fast);
  const facesP = enter(ms, cue.t44Faces);
  const wordsP = enter(ms, cue.t44Words);
  const screenP = enter(ms, cue.t44Screen);

  const rtP = enter(ms, cue.t45Reaction);
  const auditP = enter(ms, cue.t45Audits);
  const biasP = enter(ms, cue.t45Bias);
  const mentalP = enter(ms, cue.t45Mental);
  const weightP = enter(ms, cue.t45Weighting);
  const judgmentP = enter(ms, cue.t45Judgment);

  const gold = color('color/fill/gold');
  const muted = color('color/text/muted');
  const soft = color('color/text/soft');
  const primary = color('color/text/primary');
  const raceRed = color('color/marker/race');

  const authorsText =
    ms >= cue.t43Schwartz
      ? 'ANTHONY GREENWALD · DEBBIE MCGHEE · JORDAN SCHWARTZ'
      : ms >= cue.t43McGhee
        ? 'ANTHONY GREENWALD · DEBBIE MCGHEE'
        : ms >= cue.t43Anthony
          ? 'ANTHONY GREENWALD'
          : 'THREE RESEARCHERS · AUTHOR LINE';

  const plaqueRule: Point[] = [[370, 382], [1550, 382]];
  const timerLine: Point[] = [[690, 501], [690, 658]];
  const meterNeedlePoints: Point[] = [
    [1535, 515],
    [
      Math.round(1535 + Math.sin((14 + weightP * 18) * (Math.PI / 180)) * 84),
      Math.round(515 - Math.cos((14 + weightP * 18) * (Math.PI / 180)) * 84),
    ],
  ];
  const leaderLeftToBus: Point[] = [[395, 785], [395, 813]];
  const leaderCenterToBus: Point[] = [[970, 785], [970, 813]];
  const leaderBusToMeter: Point[] = [[1535, 813], [1535, 785]];

  return (
    <StageSceneFrame segment={segment}>
      {/* TURN 43: Source Plaque + Instrument Overview (y: 115..880, span = 765 px) */}
      {isTurn43 && ms >= cue.t43Three && (
        <div data-turn="43" style={{opacity: plaqueP}}>
          {/* Top Context Banner (height 72, text span 36 -> 36 px slack) */}
          <Panel id="t43-banner" box={L.t43Banner} accent="color/fill/gold" />
          <Label id="t43-banner-title" box={{x: 360, y: 133, w: 1200, h: 36}} size={28} weight={650} sans align="center" ink={gold}>
            EXPERIMENTAL MEASUREMENT MILESTONE · SORTING TIMING
          </Label>

          {/* Source Plaque (height 290, text span 254 -> 36 px slack) */}
          <Panel id="source-plaque" box={L.sourcePlaque} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: gold}} />
          </Panel>
          <Label id="plaque-tag" box={{x: 370, y: 243, w: 720, h: 34}} size={22} weight={600} ink={gold}>
            FOUNDATIONAL SOURCE RECORD
          </Label>
          <Label
            id="plaque-year"
            box={{x: 1350, y: 243, w: 200, h: 40}}
            size={32}
            weight={700}
            align="right"
            ink={ms >= cue.t43NinetyEight ? gold : muted}
            opacity={ms >= cue.t43NinetyEight ? yearP : 1}
          >
            {ms >= cue.t43NinetyEight ? '1998' : 'YEAR'}
          </Label>

          <Label
            id="plaque-authors"
            box={{x: 370, y: 305, w: 1180, h: 52}}
            size={34}
            weight={650}
            sans
            ink={ms >= cue.t43Anthony ? primary : soft}
            opacity={ms >= cue.t43Anthony ? anthonyP : 1}
          >
            {authorsText}
          </Label>

          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('plaque-rule', plaqueRule)} d={pathFrom(plaqueRule)} stroke={gold} strokeWidth="2" />
          </svg>

          <Label
            id="plaque-journal"
            box={{x: 370, y: 404, w: 1180, h: 44}}
            size={30}
            weight={400}
            sans
            ink={ms >= cue.t43Journal ? soft : muted}
            style={{fontStyle: 'italic'}}
            opacity={ms >= cue.t43Journal ? journalP : 1}
          >
            {ms >= cue.t43Journal ? 'Journal of Personality and Social Psychology' : 'Peer-Reviewed Empirical Publication'}
          </Label>

          <Label id="plaque-footer" box={{x: 370, y: 465, w: 1180, h: 32}} size={20} weight={500} ink={muted}>
            AUTOMATIC ASSOCIATION MEASUREMENT PARADIGM
          </Label>

          {/* Lower Instrument Card (height 320, text span 284 -> 36 px slack) */}
          <Panel id="iat-instrument-card" box={L.iatInstrumentCard} accent="color/line/hairline-strong" />
          <Label id="iat-card-tag" box={{x: 370, y: 578, w: 1180, h: 32}} size={20} weight={600} align="center" ink={gold}>
            INTRODUCED EXPERIMENTAL INSTRUMENT
          </Label>
          <Label
            id="iat-title"
            box={{x: 370, y: 626, w: 1180, h: 52}}
            size={40}
            weight={650}
            sans
            align="center"
            ink={ms >= cue.t43Introduced ? gold : soft}
            opacity={ms >= cue.t43Introduced ? introP : 1}
          >
            {ms >= cue.t43Introduced ? 'IMPLICIT ASSOCIATION TEST' : 'PAIRED SORTING LATENCY INSTRUMENT'}
          </Label>
          <Label id="iat-card-body" box={{x: 370, y: 700, w: 1180, h: 80}} size={28} weight={400} sans align="center" ink={primary}>
            Measures split-second response latency when sorting paired social categories and descriptive words.
          </Label>
          <Label id="iat-card-footer" box={{x: 370, y: 828, w: 1180, h: 34}} size={20} weight={500} align="center" ink={muted}>
            PAIRED CATEGORIZATION · AUTOMATIC ASSOCIATION STRENGTH
          </Label>
        </div>
      )}

      {/* TURN 44: Derived Face + Word Sorting Task & Tight 2-Bar Latency Panel */}
      {isTurn44 && (
        <div data-turn="44" style={{opacity: testP}}>
          {/* Sorting Monitor (x: 120, y: 120, w: 1140, h: 760, text span 724 -> 36 px slack) */}
          <Panel id="sorting-monitor" box={L.sortingMonitor} />
          <Label id="monitor-heading" box={{x: 156, y: 138, w: 1068, h: 40}} size={30} weight={650} sans ink={gold}>
            DERIVED FACE + WORD SORTING TASK
          </Label>
          <Label id="monitor-notice" box={{x: 156, y: 184, w: 1068, h: 30}} size={20} weight={500} ink={muted}>
            DERIVED ILLUSTRATION · NO TEST SCORE
          </Label>

          {/* Stimulus Window (x: 350, y: 245, w: 680, h: 270, text span 234 -> 36 px slack) */}
          <div data-prompt-card="true" style={{opacity: Math.max(0.85, autoP)}}>
            <Panel id="prompt-card" box={L.promptCard} accent="color/fill/gold" />
            <Label id="prompt-header" box={{x: 374, y: 263, w: 632, h: 30}} size={20} weight={600} align="center" ink={gold}>
              SORTING TRIAL STIMULI
            </Label>

            {/* Face Card: only FACE heading and PersonMark (no TARGET GLYPH) */}
            <div data-face-card={ms >= cue.t44Faces ? 'true' : undefined} style={{opacity: Math.max(0.85, autoP, facesP)}}>
              <Panel id="face-card" box={L.faceCard} />
              <Label id="prompt-face" box={{x: 390, y: 319, w: 264, h: 32}} size={22} weight={650} align="center" ink={gold}>
                FACE
              </Label>
              <div
                {...shapeAttrs('face-mark', {x: 492, y: 355, w: 60, h: 66}, 'mark', 'person')}
                style={{position: 'absolute', left: 492, top: 355, width: 60, height: 66}}
              >
                <PersonMark x={30} y={35} group="neutral" emphasis={ms >= cue.t44Faces ? 1 : 0.8} scale={1.1} />
              </div>
            </div>

            {/* Word Card: only WORD heading and neutral example word chip "pleasant" (no STIMULUS, no VALENCE WORD) */}
            <div data-word-card={ms >= cue.t44Words ? 'true' : undefined} style={{opacity: Math.max(0.85, autoP, wordsP)}}>
              <Panel id="word-card" box={L.wordCard} />
              <Label id="prompt-word" box={{x: 726, y: 319, w: 264, h: 32}} size={22} weight={650} align="center" ink={gold}>
                WORD
              </Label>
              <Panel id="word-chip" box={L.wordChip} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="word-chip-label" box={{x: 750, y: 375, w: 216, h: 42}} size={28} weight={600} sans align="center" ink={primary}>
                pleasant
              </Label>
            </div>

            <Label id="prompt-trial-sub" box={{x: 374, y: 453, w: 632, h: 28}} size={20} weight={500} align="center" ink={soft}>
              PAIRED CATEGORIZATION TRIAL
            </Label>
          </div>

          {/* Timer Trace between Prompt Card and Keys */}
          <div data-timer-trace={ms >= cue.t44ResponseLatency ? 'true' : undefined} style={{opacity: Math.max(0.85, latencyP)}}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path {...lineAttrs('timer-line', timerLine)} d={pathFrom(timerLine)} stroke={raceRed} strokeWidth="3.5" strokeDasharray="5 4" />
            </svg>
            <Label
              id="timer-label"
              box={L.timerTrace}
              size={20}
              weight={600}
              align="right"
              ink={ms >= cue.t44ResponseLatency ? raceRed : soft}
              opacity={ms >= cue.t44ResponseLatency ? latencyP : 1}
            >
              {ms >= cue.t44ResponseLatency ? 'RESPONSE LATENCY' : 'TRIAL CLOCK'}
            </Label>
          </div>

          {/* Left & Right Response Keys (height 136, text span 100 -> 36 px slack) */}
          <div data-response-keys={ms >= cue.t44Sorting ? 'true' : undefined} style={{opacity: Math.max(0.85, sortingP)}}>
            <Panel id="key-left" box={L.keyLeft} accent="color/fill/gold">
              <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
            </Panel>
            <Label id="key-left-label" box={{x: 185, y: 678, w: 400, h: 36}} size={28} weight={650} sans align="center" ink={gold}>
              {ms >= cue.t44Sorting ? 'LEFT KEY' : 'KEY A'}
            </Label>
            <Label id="key-left-pairing" box={{x: 185, y: 742, w: 400, h: 36}} size={20} weight={500} align="center" ink={soft}>
              PAIRING: FACE A + pleasant
            </Label>

            <Panel id="key-right" box={L.keyRight} accent="color/fill/gold">
              <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
            </Panel>
            <Label id="key-right-label" box={{x: 795, y: 678, w: 400, h: 36}} size={28} weight={650} sans align="center" ink={gold}>
              {ms >= cue.t44Sorting ? 'RIGHT KEY' : 'KEY B'}
            </Label>
            <Label id="key-right-pairing" box={{x: 795, y: 742, w: 400, h: 36}} size={20} weight={500} align="center" ink={soft}>
              PAIRING: FACE B + unpleasant
            </Label>
          </div>

          <Label id="monitor-footer" box={{x: 156, y: 830, w: 1068, h: 32}} size={20} weight={500} align="center" ink={muted}>
            AUTOMATIC SORTING TASK · SPLIT-SECOND KEY TIMING
          </Label>

          {/* Right Column: Latency Difference Panel sized tightly to its two bars (x: 1310, y: 290, w: 490, h: 420, text span 384 -> 36 px slack) */}
          <div data-latency-instrument={ms >= cue.t44SplitSecond ? 'true' : undefined} style={{opacity: Math.max(0.85, splitP)}}>
            <Panel id="latency-instrument" box={L.latencyInstrument} />
            <Label id="latency-heading" box={{x: 1338, y: 308, w: 434, h: 38}} size={28} weight={650} sans ink={gold}>
              {ms >= cue.t44SplitSecond ? 'LATENCY DIFFERENCE' : 'TIMING COMPARISON'}
            </Label>
            <Label
              id="latency-banner"
              box={{x: 1338, y: 354, w: 434, h: 54}}
              size={20}
              weight={500}
              ink={ms >= cue.t44Screen ? gold : muted}
              opacity={ms >= cue.t44Screen ? screenP : 1}
            >
              {ms >= cue.t44Screen ? 'DERIVED SORTING TASK · LATENCY DIFFERENCE' : 'SPLIT-SECOND DIFFERENTIAL'}
            </Label>

            <div
              {...shapeAttrs('bar-fast', {x: 1338, y: 428, w: 230, h: 46}, 'mark', 'bar')}
              style={{position: 'absolute', left: 1338, top: 428, width: 230, height: 46, background: gold, borderRadius: 4}}
            />
            <Label
              id="bar-fast-label"
              box={{x: 1338, y: 486, w: 434, h: 30}}
              size={22}
              weight={650}
              ink={gold}
              opacity={ms >= cue.t44Fast ? fastP : 1}
            >
              {ms >= cue.t44Fast ? 'FASTER RESPONSE' : 'SHORT LATENCY TRIAL'}
            </Label>

            <div
              {...shapeAttrs('bar-slow', {x: 1338, y: 544, w: 390, h: 46}, 'mark', 'bar')}
              style={{position: 'absolute', left: 1338, top: 544, width: 390, height: 46, background: muted, borderRadius: 4}}
            />
            <Label
              id="bar-slow-label"
              box={{x: 1338, y: 602, w: 434, h: 30}}
              size={22}
              weight={650}
              ink={soft}
              opacity={ms >= cue.t44Fast ? fastP : 1}
            >
              {ms >= cue.t44Fast ? 'SLOWER RESPONSE' : 'LONG LATENCY TRIAL'}
            </Label>

            <Label id="latency-footer" box={{x: 1338, y: 660, w: 434, h: 32}} size={20} weight={500} ink={muted}>
              UNEQUAL SORTING SPEEDS
            </Label>
          </div>
        </div>
      )}

      {/* TURN 45: Convergent Reaction-Time & Field-Audit Measures -> Individual Judgment Meter (y: 115..887, span = 772 px) */}
      {isTurn45 && (
        <div data-turn="45" style={{opacity: rtP}}>
          {/* Top Banner (height 72, text span 36 -> 36 px slack) */}
          <Panel id="t45-banner" box={L.t45Banner} accent="color/fill/gold" />
          <Label id="t45-banner-title" box={{x: 160, y: 133, w: 1600, h: 36}} size={28} weight={650} sans align="center" ink={gold}>
            CONVERGENT MEASUREMENT · REACTION TIME &amp; FIELD AUDITS
          </Label>

          {/* Column 1: Reaction-Time Measure (height 560, text span 524 -> 36 px slack) */}
          <div data-reaction-instrument="true" style={{opacity: rtP}}>
            <Panel id="rt-instrument" box={L.reactionInstrument} />
            <Label id="rt-heading" box={{x: 158, y: 243, w: 474, h: 38}} size={28} weight={650} sans ink={gold}>
              REACTION-TIME MEASURE
            </Label>
            <Label id="rt-sub" box={{x: 158, y: 290, w: 474, h: 30}} size={20} weight={500} ink={muted}>
              LABORATORY SORTING TASK
            </Label>

            <div
              {...shapeAttrs('rt-bar-1', {x: 158, y: 350, w: 220, h: 48}, 'mark', 'rt-bar')}
              style={{position: 'absolute', left: 158, top: 350, width: 220, height: 48, background: gold, borderRadius: 4}}
            />
            <Label id="rt-bar-1-label" box={{x: 158, y: 410, w: 474, h: 30}} size={20} weight={600} ink={gold}>
              FASTER LATENCY · CONGRUENT PAIR
            </Label>

            <div
              {...shapeAttrs('rt-bar-2', {x: 158, y: 470, w: 380, h: 48}, 'mark', 'rt-bar')}
              style={{position: 'absolute', left: 158, top: 470, width: 380, height: 48, background: muted, borderRadius: 4}}
            />
            <Label id="rt-bar-2-label" box={{x: 158, y: 530, w: 474, h: 30}} size={20} weight={600} ink={soft}>
              SLOWER LATENCY · INCONGRUENT PAIR
            </Label>

            <Label id="rt-body" box={{x: 158, y: 590, w: 474, h: 112}} size={28} weight={400} sans ink={primary}>
              Split-second sorting gap inside one person.
            </Label>

            <Label id="rt-delta-label" box={{x: 158, y: 735, w: 474, h: 32}} size={20} weight={600} ink={gold}>
              TIMING DIFFERENTIAL Δt
            </Label>
          </div>

          {/* Column 2: Field-Audit Measure (height 560, text span 524 -> 36 px slack) */}
          {ms >= cue.t45Audits && (
            <div data-field-audit="true" style={{opacity: auditP}}>
              <Panel id="fa-instrument" box={L.fieldAuditInstrument} />
              <Label id="fa-heading" box={{x: 733, y: 243, w: 474, h: 38}} size={28} weight={650} sans ink={gold}>
                FIELD-AUDIT MEASURE
              </Label>
              <Label id="fa-sub" box={{x: 733, y: 290, w: 474, h: 30}} size={20} weight={500} ink={muted}>
                MATCHED-PAIR EXPERIMENTAL DESIGN
              </Label>

              <Panel id="fa-card-1" box={{x: 733, y: 345, w: 474, h: 112}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="fa-card-1-title" box={{x: 753, y: 361, w: 434, h: 30}} size={22} weight={650} ink={gold}>
                MATCHED CASE PAIR A
              </Label>
              <Label id="fa-card-1-sub" box={{x: 753, y: 401, w: 434, h: 40}} size={20} weight={500} ink={primary}>
                IDENTICAL RESUME · QUALIFICATIONS
              </Label>

              <Panel id="fa-card-2" box={{x: 733, y: 475, w: 474, h: 112}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="fa-card-2-title" box={{x: 753, y: 491, w: 434, h: 30}} size={22} weight={650} ink={gold}>
                MATCHED CASE PAIR B
              </Label>
              <Label id="fa-card-2-sub" box={{x: 753, y: 531, w: 434, h: 40}} size={20} weight={500} ink={soft}>
                DIFFERENTIAL EVALUATION OUTCOME
              </Label>

              <Label id="fa-body" box={{x: 733, y: 610, w: 474, h: 80}} size={28} weight={400} sans ink={primary}>
                Controlled decision comparison across matched candidates.
              </Label>

              <Label id="fa-notice" box={{x: 733, y: 735, w: 474, h: 32}} size={20} weight={500} ink={muted}>
                DERIVED AUDIT · NO RESULT VALUES
              </Label>
            </div>
          )}

          {/* Column 3: Judgment Meter (height 560, text span 524 -> 36 px slack) */}
          {ms >= cue.t45Bias && (
            <div data-judgment-meter="true" style={{opacity: biasP}}>
              <Panel id="judgment-meter" box={L.judgmentMeter} />
              <Label id="meter-bias" box={{x: 1308, y: 243, w: 454, h: 38}} size={28} weight={650} sans align="center" ink={gold}>
                BIAS
              </Label>
              <Label
                id="meter-title"
                box={{x: 1308, y: 292, w: 454, h: 36}}
                size={28}
                weight={600}
                sans
                align="center"
                ink={primary}
                opacity={ms >= cue.t45Judgment ? judgmentP : 1}
              >
                {ms >= cue.t45Judgment ? 'INDIVIDUAL JUDGMENT' : 'EVALUATION CONSTRUCT'}
              </Label>

              <Label
                id="meter-mental"
                box={{x: 1308, y: 344, w: 454, h: 32}}
                size={22}
                weight={600}
                align="center"
                ink={ms >= cue.t45Mental ? gold : soft}
                opacity={ms >= cue.t45Mental ? mentalP : 1}
              >
                {ms >= cue.t45Mental ? 'MENTAL LEAN' : 'STARTING TILT'}
              </Label>

              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path d="M1455 515 A 80 80 0 0 1 1615 515" fill="none" stroke={muted} strokeWidth="3" />
                <path d="M1495 455 L1500 465 M1535 435 L1535 445 M1575 455 L1570 465" stroke={gold} strokeWidth="2.5" />
                <path
                  {...lineAttrs('meter-needle-line', meterNeedlePoints)}
                  d={pathFrom(meterNeedlePoints)}
                  stroke={gold}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              <div
                {...shapeAttrs('meter-pivot', {x: 1525, y: 505, w: 20, h: 20}, 'mark', 'pivot')}
                style={{
                  position: 'absolute',
                  left: 1525,
                  top: 505,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: gold,
                }}
              />

              <Label
                id="meter-weighting"
                box={{x: 1308, y: 565, w: 454, h: 36}}
                size={24}
                weight={650}
                align="center"
                ink={ms >= cue.t45Weighting ? gold : soft}
                opacity={ms >= cue.t45Weighting ? weightP : 1}
              >
                {ms >= cue.t45Weighting ? 'JUDGMENT WEIGHTING' : 'EVALUATION SCALE'}
              </Label>

              <Label id="meter-body" box={{x: 1308, y: 618, w: 454, h: 80}} size={28} weight={400} sans align="center" ink={primary}>
                Starting tilt in how an individual weighs evidence.
              </Label>

              <Label id="meter-joined" box={{x: 1308, y: 735, w: 454, h: 32}} size={20} weight={500} align="center" ink={soft}>
                JOINED MEASUREMENT READING
              </Label>
            </div>
          )}

          {/* Bottom Convergence Bus (height 72, text span 36 -> 36 px slack) */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('leader-left-bus', leaderLeftToBus)} d={pathFrom(leaderLeftToBus)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="4 4" />
            {ms >= cue.t45Audits && (
              <path {...lineAttrs('leader-center-bus', leaderCenterToBus)} d={pathFrom(leaderCenterToBus)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="4 4" />
            )}
            {ms >= cue.t45Bias && (
              <path {...lineAttrs('leader-bus-meter', leaderBusToMeter)} d={pathFrom(leaderBusToMeter)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="4 4" />
            )}
          </svg>
          <Panel id="t45-bus" box={L.t45Bus} accent="color/line/hairline-strong" />
          <Label id="t45-bus-title" box={{x: 160, y: 833, w: 1020, h: 36}} size={28} weight={600} sans ink={primary}>
            Both instruments measure the same individual-level judgment lean.
          </Label>
          <Label id="t45-bus-tag" box={{x: 1200, y: 836, w: 560, h: 30}} size={20} weight={600} align="right" ink={gold}>
            CONVERGENT CONSTRUCT VALIDATION
          </Label>
        </div>
      )}

      {ms >= cue.t44Test && (
        <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
          Greenwald, McGhee &amp; Schwartz 1998 · Journal of Personality and Social Psychology
        </Label>
      )}
    </StageSceneFrame>
  );
}
