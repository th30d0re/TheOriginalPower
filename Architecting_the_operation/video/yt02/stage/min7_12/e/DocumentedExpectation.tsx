import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {EquationTerms, type EquationPulseMap, type EquationToken} from '../../equations';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  EvidenceToken,
  Label,
  Panel,
  lineAttrs,
  partialPolyline,
  pathFrom,
  shapeAttrs,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const DOCUMENTED_EXPECTATION_LAYOUT = {
  // Continuity equation strip (h: 120, text span 90 -> 30 px slack)
  equation: {x: 120, y: 100, w: 1680, h: 120},
  eqTerms: {x: 120, y: 112, w: 1680, h: 54},
  eqLabel: {x: 120, y: 174, w: 1680, h: 28},

  // Turn 35: Three matched-height panels (y: 255..880, h: 625, text span 589 -> 36 px slack)
  ledgerExpanded: {x: 120, y: 255, w: 480, h: 625},
  ledgerCompact: {x: 120, y: 255, w: 480, h: 625},
  ledgerHeaderMark: {x: 145, y: 273, w: 54, h: 60},
  ledgerHeaderLabel: {x: 212, y: 273, w: 364, h: 38},
  ledgerSubLabel: {x: 212, y: 315, w: 364, h: 28},
  ledgerBody: {x: 145, y: 362, w: 430, h: 80},
  warinessToken: {x: 145, y: 462, w: 430, h: 78},
  harmToken: {x: 145, y: 558, w: 430, h: 56},
  disparityToken: {x: 145, y: 632, w: 430, h: 56},
  updatedCaption: {x: 145, y: 710, w: 430, h: 64},
  ledgerFooter: {x: 145, y: 830, w: 430, h: 32},

  // Turn 35: Center Bayesian Plot (y: 255..880, h: 625, text span 589 -> 36 px slack)
  plotFrame: {x: 635, y: 255, w: 690, h: 625},
  biasMark: {x: 660, y: 273, w: 50, h: 58},
  biasTitle: {x: 722, y: 273, w: 580, h: 38},
  biasSub: {x: 722, y: 315, w: 580, h: 28},
  posteriorLabel: {x: 840, y: 376, w: 260, h: 30},
  evidenceLabel: {x: 675, y: 748, w: 260, h: 32},
  priorLabel: {x: 985, y: 748, w: 300, h: 32},
  plotFooter: {x: 665, y: 830, w: 630, h: 32},

  // Turn 35: Right Expectation Card (y: 255..880, h: 625, text span 589 -> 36 px slack)
  expectationCard: {x: 1360, y: 255, w: 440, h: 625},
  cardTitle: {x: 1388, y: 273, w: 384, h: 38},
  cardTag: {x: 1388, y: 315, w: 384, h: 28},
  cardSub: {x: 1388, y: 368, w: 384, h: 120},
  cardRuleLabel: {x: 1388, y: 520, w: 384, h: 30},
  cardBody2: {x: 1388, y: 562, w: 384, h: 120},
  cardStatus: {x: 1388, y: 716, w: 384, h: 64},
  cardFooter: {x: 1388, y: 830, w: 384, h: 32},

  // Turn 36: Left Column (NCHS Plaque + Empirical Grounding Card, y: 250..895)
  plaque: {x: 120, y: 250, w: 490, h: 310},
  plaqueYear: {x: 150, y: 268, w: 430, h: 38},
  plaqueAuthor: {x: 150, y: 314, w: 430, h: 76},
  plaqueTitle: {x: 150, y: 400, w: 430, h: 80},
  plaqueFooter: {x: 150, y: 510, w: 430, h: 32},

  nchsContext: {x: 120, y: 585, w: 490, h: 310},
  nchsContextTitle: {x: 150, y: 603, w: 430, h: 38},
  nchsContextBody: {x: 150, y: 655, w: 430, h: 150},
  nchsContextFooter: {x: 150, y: 845, w: 430, h: 32},

  // Turn 36: Right Column (Qualitative Series Plot + Disclosure Strip, y: 250..895)
  seriesFrame: {x: 650, y: 250, w: 1150, h: 550},
  seriesTitle: {x: 680, y: 268, w: 650, h: 38},
  qualitativeBadge: {x: 1350, y: 272, w: 420, h: 32},
  blackPathLabel: {x: 680, y: 345, w: 220, h: 32},
  whitePathLabel: {x: 680, y: 610, w: 220, h: 32},
  elevationLabel: {x: 1555, y: 425, w: 170, h: 64},
  surveillanceLabel: {x: 680, y: 750, w: 360, h: 32},
  tracksLabel: {x: 1060, y: 750, w: 710, h: 32},

  // Turn 36: Disclosure Strip (h: 70, text span 34 -> 36 px slack)
  disclosure: {x: 650, y: 825, w: 1150, h: 70},
  disclosureLabel: {x: 680, y: 843, w: 1090, h: 34},

  // Source line
  source: {x: 116, y: 946, w: 740, h: 56},
} as const;

const eq28aTokens: readonly EquationToken[] = [
  {text: 'P'},
  {term: 'i', math: '_i'},
  {text: '('},
  {term: 'T'},
  {text: ' | '},
  {term: 'X'},
  {text: ', '},
  {term: 'PiRace', math: 'Π_{race}'},
  {text: ')'},
  {text: ' ∝ '},
  {text: 'P('},
  {term: 'X'},
  {text: ' | '},
  {term: 'T'},
  {text: ') · P'},
  {term: 'i', math: '_i'},
  {text: '('},
  {term: 'T'},
  {text: ' | '},
  {term: 'PiRace', math: 'Π_{race}'},
  {text: ')'},
];

export function DocumentedExpectation({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t35Consider: useCue('t35Consider').at,
    t35Black: useCue('t35Black').at,
    t35Bias: useCue('t35Bias').at,
    t35Statistical: useCue('t35Statistical').at,
    t35Starting: useCue('t35Starting').at,
    t35Updated: useCue('t35Updated').at,
    t35Documented: useCue('t35Documented').at,
    t35Disparity: useCue('t35Disparity').at,
    t36National: useCue('t36National').at,
    t36Maternal: useCue('t36Maternal').at,
    t36Elevated: useCue('t36Elevated').at,
    t36Black: useCue('t36Black').at,
    t36White: useCue('t36White').at,
    t36Surveillance: useCue('t36Surveillance').at,
    t36Expectation: useCue('t36Expectation').at,
    t36Tracks: useCue('t36Tracks').at,
    t36Numbers: useCue('t36Numbers').at,
  };

  const L = DOCUMENTED_EXPECTATION_LAYOUT;
  const isTurn36 = ms >= cue.t36National;

  // Turn 35 entrance progresses
  const considerP = enter(ms, cue.t35Consider);
  const blackP = enter(ms, cue.t35Black);
  const biasP = enter(ms, cue.t35Bias);
  const statP = enter(ms, cue.t35Statistical);
  const startingP = enter(ms, cue.t35Starting);
  const updatedP = enter(ms, cue.t35Updated);
  const docP = enter(ms, cue.t35Documented);
  const disparityP = enter(ms, cue.t35Disparity);

  // Turn 36 entrance progresses
  const nationalP = enter(ms, cue.t36National);
  const maternalP = enter(ms, cue.t36Maternal);
  const elevatedP = enter(ms, cue.t36Elevated);
  const t36BlackP = enter(ms, cue.t36Black);
  const whiteP = enter(ms, cue.t36White);
  const survP = enter(ms, cue.t36Surveillance);
  const expectP = enter(ms, cue.t36Expectation);
  const tracksP = enter(ms, cue.t36Tracks);
  const numbersP = enter(ms, cue.t36Numbers);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');
  const hairline = color('color/line/hairline');

  // Curve data for Turn 35 plot
  const axisY = 730;
  const axisPoints: Point[] = [[675, axisY], [1285, axisY]];
  const leaderPoints: Point[] = [[1325, 520], [1360, 520]];

  // Prior Gaussian curve (moves from red to gold at t35Statistical)
  const priorColor = ms >= cue.t35Statistical ? gold : raceRed;
  const priorPoints: Point[] = Array.from({length: 31}, (_, i) => {
    const x = 980 + i * 10;
    const norm = (x - 1130) / 45;
    const y = axisY - Math.exp(-0.5 * norm * norm) * 190;
    return [x, y];
  });

  // Evidence curve (centered around x = 830)
  const evidencePoints: Point[] = Array.from({length: 31}, (_, i) => {
    const x = 710 + i * 8;
    const norm = (x - 830) / 40;
    const y = axisY - Math.exp(-0.5 * norm * norm) * 160;
    return [x, y];
  });

  // Posterior curve (shifts toward evidence on t35Updated)
  const postShift = move(ms, cue.t35Updated, 750);
  const postCenter = 1130 - postShift * 190;
  const posteriorPoints: Point[] = Array.from({length: 31}, (_, i) => {
    const x = (postCenter - 140) + i * 9;
    const norm = (x - postCenter) / 42;
    const y = axisY - Math.exp(-0.5 * norm * norm) * 210;
    return [x, y];
  });

  // Turn 36 qualitative surveillance stations and paths
  const stations = [780, 930, 1080, 1230, 1380, 1530];
  const blackPathFull: Point[] = [
    [780, 415], [930, 400], [1080, 410], [1230, 390], [1380, 380], [1530, 370],
  ];
  const whitePathFull: Point[] = [
    [780, 560], [930, 550], [1080, 560], [1230, 545], [1380, 535], [1530, 525],
  ];

  const blackDrawn = partialPolyline(blackPathFull, t36BlackP);
  const whiteDrawn = partialPolyline(whitePathFull, whiteP);
  const trackingDrawn = partialPolyline(blackPathFull, tracksP);

  const bracketPoints: Point[] = [
    [1734, 370], [1750, 370], [1750, 530], [1734, 530],
  ];

  const eqPulses: EquationPulseMap = {};

  return (
    <StageSceneFrame segment={segment}>
      {/* Continuity equation strip: centered Eq. 2.8a at 36 px */}
      <div data-continuity-strip="true">
        <Panel id="eq-strip-frame" box={L.equation} />
        <EquationTerms
          equation="Eq. 2.8a"
          tokens={eq28aTokens}
          pulses={eqPulses}
          ms={ms}
          box={L.eqTerms}
          fontSize={36}
          align="center"
        />
        <Label id="eq-label" box={L.eqLabel} size={20} weight={500} align="center" ink={gold}>
          Eq. 2.8a · Bayesian prior
        </Label>
      </div>

      {/* TURN 35: Three Equal-Height Panels (Evidence Ledger, Bayesian Plot, Expectation Card) */}
      {!isTurn36 && (
        <div data-turn="35">
          {/* Panel 1 (Left): Evidence Ledger */}
          <Panel id="ledger-frame" box={L.ledgerExpanded} accent={ms >= cue.t35Black ? 'color/fill/gold' : 'color/line/hairline'} />
          <div
            {...shapeAttrs('ledger-group-mark', L.ledgerHeaderMark, 'mark', 'ledger-group-mark')}
            style={{position: 'absolute', left: L.ledgerHeaderMark.x, top: L.ledgerHeaderMark.y, width: L.ledgerHeaderMark.w, height: L.ledgerHeaderMark.h}}
          >
            <PersonMark x={27} y={30} group="ingroup" emphasis={ms >= cue.t35Black ? blackP : 0.7} scale={1.15} />
          </div>
          <Label
            id="ledger-header"
            box={L.ledgerHeaderLabel}
            size={28}
            weight={650}
            sans
            ink={gold}
          >
            {ms >= cue.t35Black ? 'BLACK WOMEN' : 'PATIENT GROUP'}
          </Label>
          <Label id="ledger-sub" box={L.ledgerSubLabel} size={20} weight={500} ink={soft}>
            CLINICAL RECORD LEDGER
          </Label>
          <Label id="ledger-body" box={L.ledgerBody} size={28} weight={400} sans lh={1.28} ink={primary}>
            Recorded clinical history shapes baseline caution.
          </Label>

          <EvidenceToken
            id="token-wariness"
            label={ms >= cue.t35Black ? 'WARINESS TOWARD THE U.S. MEDICAL SYSTEM' : 'BASELINE CLINICAL CAUTION'}
            kind="experience"
            progress={1}
            emphasis={ms >= cue.t35Black ? blackP : 0.65}
            box={L.warinessToken}
            size={20}
          />

          <EvidenceToken
            id="token-harm"
            label={ms >= cue.t35Documented ? 'DOCUMENTED HARM' : 'MATERNAL CARE RECORD'}
            kind="documented"
            progress={1}
            emphasis={ms >= cue.t35Documented ? docP : 0.65}
            box={L.harmToken}
            sourceSocket={{lock: ms >= cue.t35Documented ? docP : 0.35, side: 'left'}}
            size={20}
          />

          <EvidenceToken
            id="token-disparity"
            label={ms >= cue.t35Documented ? 'ONGOING DISPARITY' : 'OUTCOME DIFFERENTIAL'}
            kind="documented"
            progress={1}
            emphasis={ms >= cue.t35Documented ? docP : 0.65}
            box={L.disparityToken}
            sourceSocket={{lock: ms >= cue.t35Documented ? docP : 0.35, side: 'left'}}
            size={20}
          />

          <Label
            id="updated-caption"
            box={L.updatedCaption}
            size={20}
            weight={600}
            ink={ms >= cue.t35Disparity ? gold : soft}
            lh={1.3}
          >
            {ms >= cue.t35Disparity
              ? 'EXPECTATION UPDATED ON DOCUMENTED EVIDENCE'
              : 'OBSERVED STREAM FEEDS LIKELIHOOD P(X | T)'}
          </Label>

          <Label id="ledger-footer" box={L.ledgerFooter} size={20} weight={500} ink={muted}>
            SOURCE-BACKED BAYESIAN UPDATE
          </Label>

          {/* Panel 2 (Center): Bayesian Plot */}
          <Panel id="bayes-plot-frame" box={L.plotFrame} accent="color/line/hairline" />
          <div
            {...shapeAttrs('bias-glyph-mark', L.biasMark, 'mark', 'bias-glyph-mark')}
            style={{position: 'absolute', left: L.biasMark.x, top: L.biasMark.y, width: L.biasMark.w, height: L.biasMark.h}}
          >
            <PersonMark x={25} y={29} group="ingroup" emphasis={ms >= cue.t35Bias ? biasP : 0.7} scale={1.1} />
          </div>
          <Label
            id="bias-title"
            box={L.biasTitle}
            size={28}
            weight={650}
            sans
            ink={gold}
          >
            {ms >= cue.t35Bias ? 'BIAS · STATISTICAL STARTING TENDENCY' : 'BAYESIAN PREDICTIVE UPDATE'}
          </Label>
          <Label id="bias-sub" box={L.biasSub} size={20} weight={500} ink={soft}>
            LIKELIHOOD &amp; PRIOR DISTRIBUTION SHIFT
          </Label>

          <Label
            id="posterior-label"
            box={L.posteriorLabel}
            size={20}
            weight={600}
            align="center"
            ink={ms >= cue.t35Updated ? color('color/text/accent') : soft}
          >
            {ms >= cue.t35Updated ? 'POSTERIOR' : 'PREDICTIVE DENSITY'}
          </Label>

          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('bayes-axis', axisPoints)} d={pathFrom(axisPoints)} fill="none" stroke={hairline} strokeWidth="2" />
            <path {...lineAttrs('prior-curve', priorPoints)} d={pathFrom(priorPoints)} fill="none" stroke={priorColor} strokeWidth="3.5" />
            {ms >= cue.t35Updated && (
              <>
                <path {...lineAttrs('evidence-curve', evidencePoints)} d={pathFrom(evidencePoints)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={updatedP} />
                <path {...lineAttrs('posterior-curve', posteriorPoints)} d={pathFrom(posteriorPoints)} fill="none" stroke={color('color/text/accent')} strokeWidth="4" opacity={updatedP} />
              </>
            )}
            {ms >= cue.t35Starting && (
              <path {...lineAttrs('start-leader', leaderPoints)} d={pathFrom(leaderPoints)} fill="none" stroke={gold} strokeWidth="2.5" strokeDasharray="4 4" opacity={startingP} />
            )}
          </svg>

          <Label
            id="evidence-label"
            box={L.evidenceLabel}
            size={20}
            weight={500}
            ink={ms >= cue.t35Updated ? gold : muted}
          >
            {ms >= cue.t35Updated ? 'EVIDENCE' : 'OBSERVED DATA X'}
          </Label>

          <Label
            id="prior-label"
            box={L.priorLabel}
            size={20}
            weight={600}
            align="right"
            ink={ms >= cue.t35Statistical ? gold : soft}
          >
            {ms >= cue.t35Statistical ? 'STARTING EXPECTATION' : 'PRIOR DISTRIBUTION'}
          </Label>

          <Label id="plot-footer" box={L.plotFooter} size={20} weight={500} ink={muted}>
            OBSERVED RECORD SHIFTS THE STARTING DENSITY
          </Label>

          {/* Panel 3 (Right): Expectation Card */}
          <div data-expectation-card={ms >= cue.t35Starting ? 'true' : undefined}>
            <Panel
              id="expect-card-frame"
              box={L.expectationCard}
              accent={ms >= cue.t35Starting ? 'color/fill/gold' : 'color/line/hairline'}
            />
            <Label id="card-title" box={L.cardTitle} size={28} weight={650} sans ink={gold}>
              {ms >= cue.t35Statistical ? 'STARTING EXPECTATION' : 'PRIOR SPECIFICATION'}
            </Label>
            <Label id="card-tag" box={L.cardTag} size={20} weight={500} ink={soft}>
              BAYESIAN PRIOR TERM
            </Label>
            <Label id="card-sub" box={L.cardSub} size={28} weight={400} sans lh={1.28} ink={primary}>
              Baseline probability prior to fresh clinical observation.
            </Label>
            <Label id="card-rule-label" box={L.cardRuleLabel} size={20} weight={600} ink={gold}>
              EMPIRICAL REVISION RULE
            </Label>
            <Label id="card-body-2" box={L.cardBody2} size={28} weight={400} sans lh={1.28} ink={soft}>
              Shifts toward recorded history as clinical data arrives.
            </Label>
            <Label id="card-status" box={L.cardStatus} size={20} weight={600} lh={1.3} ink={gold}>
              CALIBRATED TO EMPIRICAL RECORD
            </Label>
            <Label id="card-footer" box={L.cardFooter} size={20} weight={500} ink={muted}>
              BAYESIAN EMPIRICAL REVISION
            </Label>
          </div>
        </div>
      )}

      {/* TURN 36: Balanced Two-Column Layout (NCHS Plaque + Context Card on Left, Series Plot + Disclosure on Right) */}
      {isTurn36 && (
        <div data-turn="36" style={{opacity: nationalP}}>
          {/* Left Upper: NCHS Plaque */}
          <Panel id="nchs-plaque-frame" box={L.plaque} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
          </Panel>
          <Label id="plaque-year" box={L.plaqueYear} size={28} weight={700} ink={gold}>
            2023
          </Label>
          <Label id="plaque-author" box={L.plaqueAuthor} size={28} weight={650} sans lh={1.25} ink={primary}>
            NATIONAL CENTER FOR HEALTH STATISTICS
          </Label>
          <Label id="plaque-title" box={L.plaqueTitle} size={28} weight={400} sans lh={1.28} ink={soft} style={{fontStyle: 'italic'}}>
            Maternal Mortality Rates in the United States, 2021
          </Label>
          <Label id="plaque-footer" box={L.plaqueFooter} size={20} weight={500} ink={muted}>
            VITAL STATISTICS SURVEILLANCE
          </Label>

          {/* Left Lower: Empirical Grounding Card */}
          <Panel id="nchs-context-frame" box={L.nchsContext} accent="color/line/hairline" />
          <Label id="nchs-context-title" box={L.nchsContextTitle} size={28} weight={650} sans ink={gold}>
            EMPIRICAL GROUNDING
          </Label>
          <Label id="nchs-context-body" box={L.nchsContextBody} size={28} weight={400} sans lh={1.28} ink={primary}>
            Documented disparity grounds the starting expectation in recorded clinical reality.
          </Label>
          <Label id="nchs-context-footer" box={L.nchsContextFooter} size={20} weight={500} ink={muted}>
            QUALITATIVE SERIES COMPARISON
          </Label>

          {/* Right Upper: Qualitative Series Plot */}
          <Panel id="series-plot-frame" box={L.seriesFrame} accent="color/line/hairline" />
          <Label
            id="series-title"
            box={L.seriesTitle}
            size={28}
            weight={650}
            sans
            ink={primary}
          >
            {ms >= cue.t36Maternal
              ? 'MATERNAL MORTALITY · SURVEILLANCE SERIES'
              : 'VITAL STATISTICS SURVEILLANCE SERIES'}
          </Label>
          <Label id="qualitative-badge" box={L.qualitativeBadge} size={20} weight={600} align="right" ink={gold}>
            QUALITATIVE · NO RATES SHOWN
          </Label>

          {/* Surveillance Station Guides */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={Math.max(0.6 * nationalP, survP)}>
            {stations.map((sx, idx) => (
              <line key={`station-${idx}`} x1={sx} y1={335} x2={sx} y2={665} stroke={hairline} strokeWidth="1.5" strokeDasharray="4 4" />
            ))}
          </svg>

          {/* Qualitative paths and relation bracket */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            {blackDrawn.length >= 2 && (
              <path {...lineAttrs('black-path', blackDrawn)} d={pathFrom(blackDrawn)} fill="none" stroke={gold} strokeWidth="4" opacity={t36BlackP} />
            )}
            {whiteDrawn.length >= 2 && (
              <path {...lineAttrs('white-path', whiteDrawn)} d={pathFrom(whiteDrawn)} fill="none" stroke={soft} strokeWidth="3" opacity={whiteP} />
            )}
            {tracksP > 0 && trackingDrawn.length >= 2 && (
              <path {...lineAttrs('tracking-line', trackingDrawn)} d={pathFrom(trackingDrawn)} fill="none" stroke={gold} strokeWidth="2.5" strokeDasharray="6 4" opacity={tracksP} />
            )}
            {ms >= cue.t36Elevated && (
              <path {...lineAttrs('elevated-bracket', bracketPoints)} d={pathFrom(bracketPoints)} fill="none" stroke={gold} strokeWidth="2.5" opacity={elevatedP} />
            )}
          </svg>

          {ms >= cue.t36Black && (
            <Label id="black-path-label" box={L.blackPathLabel} size={22} weight={600} ink={gold} opacity={t36BlackP}>
              BLACK WOMEN
            </Label>
          )}

          {ms >= cue.t36White && (
            <Label id="white-path-label" box={L.whitePathLabel} size={22} weight={600} ink={soft} opacity={whiteP}>
              WHITE WOMEN
            </Label>
          )}

          {ms >= cue.t36Elevated && (
            <Label id="elevation-label" box={L.elevationLabel} size={20} weight={600} lh={1.3} ink={gold} opacity={elevatedP}>
              ELEVATED RELATIVE LEVEL
            </Label>
          )}

          {ms >= cue.t36Expectation && (
            <div
              data-expectation-marker="true"
              {...shapeAttrs('expectation-marker-pin', {x: 1530, y: 360, w: 20, h: 20}, 'mark', 'marker')}
              style={{position: 'absolute', left: 1530, top: 360, width: 20, height: 20, opacity: expectP}}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="7" fill={gold} stroke={color('color/bg/field')} strokeWidth="2" />
              </svg>
            </div>
          )}

          <Label
            id="surveillance-label"
            box={L.surveillanceLabel}
            size={20}
            weight={500}
            ink={ms >= cue.t36Surveillance ? primary : muted}
          >
            {ms >= cue.t36Surveillance ? 'DOCUMENTED SERIES' : 'SURVEILLANCE STATIONS'}
          </Label>

          <Label
            id="tracks-label"
            box={L.tracksLabel}
            size={20}
            weight={600}
            align="right"
            ink={ms >= cue.t36Tracks ? gold : soft}
          >
            {ms >= cue.t36Tracks
              ? 'EXPECTATION TRACKS THE DOCUMENTED SERIES'
              : 'DIRECTIONAL SURVEILLANCE COMPARISON'}
          </Label>

          {/* Right Lower: Disclosure Strip */}
          <div data-disclosure={ms >= cue.t36Numbers ? 'true' : undefined}>
            <Panel id="disclosure-frame" box={L.disclosure} accent={ms >= cue.t36Numbers ? 'color/fill/gold' : 'color/line/hairline'} />
            <Label
              id="disclosure-label"
              box={L.disclosureLabel}
              size={20}
              weight={600}
              ls={0.8}
              align="center"
              ink={ms >= cue.t36Numbers ? primary : soft}
            >
              {ms >= cue.t36Numbers
                ? 'QUALITATIVE RELATIONSHIP · RATE VALUES OMITTED'
                : 'ORDINAL COMPARISON · NO NUMERICAL AXES OR RATES'}
            </Label>
          </div>
        </div>
      )}

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        {!isTurn36
          ? 'The Original Power, Chapter 2 · Eq. 2.8a · Bayesian prior'
          : 'National Center for Health Statistics (2023) · Maternal Mortality Rates in the United States, 2021'}
      </Label>
    </StageSceneFrame>
  );
}
