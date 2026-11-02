import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {EquationTerms, type EquationPulseMap, type EquationToken} from '../../equations';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  EvidenceToken,
  Label,
  Panel,
  clamp01,
  lineAttrs,
  partialPolyline,
  pathFrom,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const DOCUMENTED_EXPECTATION_LAYOUT = {
  // Continuity equation strip
  equation: {x: 120, y: 100, w: 1680, h: 120},
  eqTerms: {x: 120, y: 112, w: 1680, h: 54},
  eqLabel: {x: 120, y: 172, w: 1680, h: 32},

  // Turn 35: Evidence Ledger (compact before documented harm, expanded after)
  ledgerCompact: {x: 120, y: 285, w: 480, h: 220},
  ledgerExpanded: {x: 120, y: 285, w: 480, h: 495},
  ledgerHeaderMark: {x: 145, y: 305, w: 55, h: 65},
  ledgerHeaderLabel: {x: 215, y: 320, w: 360, h: 36},
  warinessToken: {x: 145, y: 395, w: 430, h: 80},
  harmToken: {x: 145, y: 505, w: 430, h: 52},
  disparityToken: {x: 145, y: 580, w: 430, h: 52},
  updatedCaption: {x: 145, y: 675, w: 430, h: 80},

  // Turn 35: Bayesian Plot
  plotFrame: {x: 680, y: 285, w: 640, h: 590},
  biasMark: {x: 710, y: 310, w: 50, h: 60},
  biasTitle: {x: 775, y: 322, w: 520, h: 36},
  priorLabel: {x: 1010, y: 760, w: 250, h: 28},
  evidenceLabel: {x: 730, y: 760, w: 160, h: 28},
  posteriorLabel: {x: 840, y: 440, w: 180, h: 28},

  // Turn 35: Expectation Card (sized to content)
  expectationCard: {x: 1390, y: 350, w: 400, h: 180},
  cardTitle: {x: 1420, y: 375, w: 340, h: 36},
  cardSub: {x: 1420, y: 425, w: 340, h: 80},

  // Turn 36: NCHS Plaque (sized to content)
  plaque: {x: 120, y: 235, w: 490, h: 260},
  plaqueYear: {x: 150, y: 255, w: 430, h: 38},
  plaqueAuthor: {x: 150, y: 300, w: 430, h: 64},
  plaqueTitle: {x: 150, y: 375, w: 430, h: 80},

  // Turn 36: Qualitative Series Plot (balanced composition)
  seriesFrame: {x: 690, y: 235, w: 1100, h: 580},
  seriesTitle: {x: 720, y: 255, w: 600, h: 36},
  qualitativeBadge: {x: 1340, y: 260, w: 410, h: 28},
  blackPathLabel: {x: 730, y: 340, w: 200, h: 32},
  whitePathLabel: {x: 730, y: 610, w: 200, h: 32},
  surveillanceLabel: {x: 720, y: 690, w: 300, h: 32},
  elevationLabel: {x: 1540, y: 430, w: 170, h: 64},
  tracksLabel: {x: 1040, y: 690, w: 710, h: 32},

  // Turn 36: Disclosure Strip
  disclosure: {x: 1040, y: 840, w: 750, h: 55},
  disclosureLabel: {x: 1060, y: 852, w: 710, h: 32},

  // Source line
  source: {x: 116, y: 946, w: 740, h: 56},
} as const;

// Token definitions without manual width overrides: tokenWidth calculates glyph advances
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
  const axisPoints: Point[] = [[720, axisY], [1280, axisY]];
  const leaderPoints: Point[] = [[1280, 440], [1390, 440]];

  // Prior Gaussian curve (moves from red to gold at t35Statistical)
  const priorColor = ms >= cue.t35Statistical ? gold : raceRed;
  const priorPoints: Point[] = Array.from({length: 31}, (_, i) => {
    const x = 980 + i * 10;
    const norm = (x - 1130) / 45;
    const y = axisY - Math.exp(-0.5 * norm * norm) * 190;
    return [x, y];
  });

  // Evidence curve (centered around x = 810)
  const evidencePoints: Point[] = Array.from({length: 31}, (_, i) => {
    const x = 720 + i * 8;
    const norm = (x - 840) / 40;
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
    [780, 410], [930, 395], [1080, 405], [1230, 385], [1380, 375], [1530, 365],
  ];
  const whitePathFull: Point[] = [
    [780, 560], [930, 550], [1080, 560], [1230, 545], [1380, 535], [1530, 525],
  ];

  const blackDrawn = partialPolyline(blackPathFull, t36BlackP);
  const whiteDrawn = partialPolyline(whitePathFull, whiteP);
  const trackingDrawn = partialPolyline(blackPathFull, tracksP);

  const bracketPoints: Point[] = [
    [1720, 365], [1736, 365], [1736, 530], [1720, 530],
  ];

  const eqPulses: EquationPulseMap = {};

  // Active ledger layout: sized to content
  const currentLedgerBox = ms >= cue.t35Documented ? L.ledgerExpanded : L.ledgerCompact;

  return (
    <StageSceneFrame segment={segment}>
      {/* Continuity equation strip: centered Eq. 2.8a at 34 px */}
      <div data-continuity-strip="true">
        <Panel id="eq-strip-frame" box={L.equation} />
        <EquationTerms
          equation="Eq. 2.8a"
          tokens={eq28aTokens}
          pulses={eqPulses}
          ms={ms}
          box={L.eqTerms}
          fontSize={34}
          align="center"
        />
        <Label id="eq-label" box={L.eqLabel} size={20} weight={500} align="center" ink={gold}>
          Eq. 2.8a · Bayesian prior
        </Label>
      </div>

      {/* TURN 35: Evidence Ledger, Bayesian Plot, Expectation Card */}
      {!isTurn36 && (
        <div data-turn="35">
          {/* Evidence Ledger: sized to content at each beat */}
          <Panel id="ledger-frame" box={currentLedgerBox} accent="color/line/hairline" />

          {ms >= cue.t35Black && (
            <>
              <div
                {...shapeAttrs('ledger-group-mark', L.ledgerHeaderMark, 'mark', 'ledger-group-mark')}
                style={{position: 'absolute', left: L.ledgerHeaderMark.x, top: L.ledgerHeaderMark.y, width: L.ledgerHeaderMark.w, height: L.ledgerHeaderMark.h}}
              >
                <PersonMark x={27} y={32} group="ingroup" emphasis={blackP} scale={1.2} />
              </div>
              <Label id="ledger-header" box={L.ledgerHeaderLabel} size={26} weight={600} ink={gold} opacity={blackP}>
                BLACK WOMEN
              </Label>
              <EvidenceToken
                id="token-wariness"
                label="WARINESS TOWARD THE U.S. MEDICAL SYSTEM"
                kind="experience"
                progress={blackP}
                emphasis={blackP}
                box={L.warinessToken}
                size={20}
              />
            </>
          )}

          {ms >= cue.t35Documented && (
            <>
              <EvidenceToken
                id="token-harm"
                label="DOCUMENTED HARM"
                kind="documented"
                progress={docP}
                emphasis={docP}
                box={L.harmToken}
                sourceSocket={{lock: docP, side: 'left'}}
                size={20}
              />
              <EvidenceToken
                id="token-disparity"
                label="ONGOING DISPARITY"
                kind="documented"
                progress={docP}
                emphasis={docP}
                box={L.disparityToken}
                sourceSocket={{lock: docP, side: 'left'}}
                size={20}
              />
            </>
          )}

          {ms >= cue.t35Disparity && (
            <Label id="updated-caption" box={L.updatedCaption} size={20} weight={600} ink={gold} lh={1.3} opacity={disparityP}>
              EXPECTATION UPDATED ON DOCUMENTED EVIDENCE
            </Label>
          )}

          {/* Bayesian Plot */}
          <Panel id="bayes-plot-frame" box={L.plotFrame} accent="color/line/hairline" />

          {ms >= cue.t35Bias && (
            <>
              <div
                {...shapeAttrs('bias-glyph-mark', L.biasMark, 'mark', 'bias-glyph-mark')}
                style={{position: 'absolute', left: L.biasMark.x, top: L.biasMark.y, width: L.biasMark.w, height: L.biasMark.h}}
              >
                <PersonMark x={25} y={30} group="ingroup" emphasis={biasP} scale={1.1} />
              </div>
              <Label id="bias-title" box={L.biasTitle} size={22} weight={600} ink={gold} opacity={biasP}>
                BIAS · STATISTICAL STARTING TENDENCY
              </Label>
            </>
          )}

          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('bayes-axis', axisPoints)} d={pathFrom(axisPoints)} fill="none" stroke={hairline} strokeWidth="2" />
            <path {...lineAttrs('prior-curve', priorPoints)} d={pathFrom(priorPoints)} fill="none" stroke={priorColor} strokeWidth="3" />
            {ms >= cue.t35Updated && (
              <>
                <path {...lineAttrs('evidence-curve', evidencePoints)} d={pathFrom(evidencePoints)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={updatedP} />
                <path {...lineAttrs('posterior-curve', posteriorPoints)} d={pathFrom(posteriorPoints)} fill="none" stroke={color('color/text/accent')} strokeWidth="4" opacity={updatedP} />
              </>
            )}
            {ms >= cue.t35Starting && (
              <path {...lineAttrs('start-leader', leaderPoints)} d={pathFrom(leaderPoints)} fill="none" stroke={gold} strokeWidth="2" strokeDasharray="4 4" opacity={startingP} />
            )}
          </svg>

          {ms >= cue.t35Statistical && (
            <Label id="prior-label" box={L.priorLabel} size={20} weight={600} ink={gold} opacity={statP}>
              STARTING EXPECTATION
            </Label>
          )}

          {ms >= cue.t35Updated && (
            <>
              <Label id="evidence-label" box={L.evidenceLabel} size={20} weight={500} ink={gold} opacity={updatedP}>
                EVIDENCE
              </Label>
              <Label id="posterior-label" box={L.posteriorLabel} size={20} weight={600} ink={color('color/text/accent')} opacity={updatedP}>
                POSTERIOR
              </Label>
            </>
          )}

          {/* Expectation Card: sized to content */}
          {ms >= cue.t35Starting && (
            <div data-expectation-card="true" style={{opacity: startingP}}>
              <Panel id="expect-card-frame" box={L.expectationCard} accent="color/fill/gold" />
              <Label id="card-title" box={L.cardTitle} size={24} weight={600} ink={gold}>
                STARTING EXPECTATION
              </Label>
              <Label id="card-sub" box={L.cardSub} size={20} weight={400} lh={1.3} ink={soft}>
                baseline probability prior to fresh clinical observation
              </Label>
            </div>
          )}
        </div>
      )}

      {/* TURN 36: NCHS Plaque, Qualitative Series Plot, Disclosure */}
      {isTurn36 && (
        <div data-turn="36">
          {/* NCHS Plaque: sized to content */}
          <Panel id="nchs-plaque-frame" box={L.plaque} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
          </Panel>
          <Label id="plaque-year" box={L.plaqueYear} size={28} weight={600} ink={gold} opacity={nationalP}>
            2023
          </Label>
          <Label id="plaque-author" box={L.plaqueAuthor} size={26} weight={650} sans lh={1.2} ink={primary} opacity={nationalP}>
            NATIONAL CENTER FOR HEALTH STATISTICS
          </Label>
          <Label id="plaque-title" box={L.plaqueTitle} size={22} weight={400} sans lh={1.3} ink={soft} style={{fontStyle: 'italic'}} opacity={nationalP}>
            Maternal Mortality Rates in the United States, 2021
          </Label>

          {/* Qualitative Series Plot: populated from the first frame of NCHS beat */}
          <Panel id="series-plot-frame" box={L.seriesFrame} accent="color/line/hairline" />

          {/* Title rendered at t36Maternal */}
          {ms >= cue.t36Maternal && (
            <Label id="series-title" box={L.seriesTitle} size={24} weight={600} sans ink={primary} opacity={maternalP}>
              MATERNAL MORTALITY · SURVEILLANCE SERIES
            </Label>
          )}

          <Label id="qualitative-badge" box={L.qualitativeBadge} size={20} weight={600} align="right" ink={gold} opacity={nationalP}>
            QUALITATIVE · NO RATES SHOWN
          </Label>

          {/* Surveillance Station Guides: present from first frame of NCHS beat */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={Math.max(0.6 * nationalP, survP)}>
            {stations.map((sx, idx) => (
              <line key={`station-${idx}`} x1={sx} y1={330} x2={sx} y2={660} stroke={hairline} strokeWidth="1.5" strokeDasharray="4 4" />
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
              <path {...lineAttrs('tracking-line', trackingDrawn)} d={pathFrom(trackingDrawn)} fill="none" stroke={gold} strokeWidth="2" strokeDasharray="6 4" opacity={tracksP} />
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

          {ms >= cue.t36Surveillance && (
            <Label id="surveillance-label" box={L.surveillanceLabel} size={20} weight={500} ink={muted} opacity={survP}>
              DOCUMENTED SERIES
            </Label>
          )}

          {ms >= cue.t36Elevated && (
            <Label id="elevation-label" box={L.elevationLabel} size={20} weight={600} lh={1.3} ink={gold} opacity={elevatedP}>
              ELEVATED RELATIVE LEVEL
            </Label>
          )}

          {/* Expectation marker docks beside the upper path: clean marker without ghost text */}
          {ms >= cue.t36Expectation && (
            <div
              data-expectation-marker="true"
              {...shapeAttrs('expectation-marker-pin', {x: 1530, y: 355, w: 20, h: 20}, 'mark', 'marker')}
              style={{position: 'absolute', left: 1530, top: 355, width: 20, height: 20, opacity: expectP}}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="7" fill={gold} stroke={color('color/bg/field')} strokeWidth="2" />
              </svg>
            </div>
          )}

          {ms >= cue.t36Tracks && (
            <Label id="tracks-label" box={L.tracksLabel} size={20} weight={600} ink={gold} opacity={tracksP}>
              EXPECTATION TRACKS THE DOCUMENTED SERIES
            </Label>
          )}

          {/* Disclosure Strip */}
          {ms >= cue.t36Numbers && (
            <div data-disclosure="true" style={{opacity: numbersP}}>
              <Panel id="disclosure-frame" box={L.disclosure} accent="color/line/hairline" />
              <Label id="disclosure-label" box={L.disclosureLabel} size={20} weight={600} ls={1} align="center" ink={primary}>
                QUALITATIVE RELATIONSHIP · RATE VALUES OMITTED
              </Label>
            </div>
          )}
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
