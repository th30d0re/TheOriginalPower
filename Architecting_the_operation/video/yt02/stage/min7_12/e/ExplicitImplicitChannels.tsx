import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
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

export const EXPLICIT_IMPLICIT_LAYOUT = {
  // Turn 39: Bias Hub (vertically centered across both channels, filling frame)
  biasHub: {x: 120, y: 280, w: 420, h: 500},
  biasTitle: {x: 150, y: 310, w: 360, h: 48},
  biasMark: {x: 290, y: 430, w: 80, h: 100},
  biasSub: {x: 150, y: 700, w: 360, h: 36},

  // Turn 39: Explicit Channel (present from start of turn 39, filling upper lane)
  explicitChannel: {x: 620, y: 240, w: 1160, h: 220},
  explicitHeading: {x: 650, y: 260, w: 300, h: 36},
  explicitCard: {x: 750, y: 350, w: 480, h: 64},
  explicitCardLabel: {x: 760, y: 365, w: 460, h: 34},

  // Turn 39: Implicit Channel (present from start of turn 39, filling lower lane)
  implicitChannel: {x: 620, y: 560, w: 1160, h: 220},
  implicitHeading: {x: 650, y: 580, w: 300, h: 36},
  implicitAssocLabel: {x: 750, y: 715, w: 480, h: 34},

  // Turn 39: Individual Judgment Meter
  meterPanel: {x: 1540, y: 460, w: 240, h: 100},
  meterLabel: {x: 1550, y: 475, w: 220, h: 56},

  // Turn 40: Citation Card (built to final size, h: 480)
  citationCard: {x: 330, y: 240, w: 1260, h: 480},
  citeAuthors: {x: 390, y: 275, w: 1140, h: 50},
  citeYear: {x: 390, y: 370, w: 200, h: 44},
  citeTitle: {x: 390, y: 440, w: 1140, h: 96},
  citeJournal: {x: 390, y: 565, w: 1140, h: 44},

  // Source line
  source: {x: 116, y: 946, w: 740, h: 56},
} as const;

export function ExplicitImplicitChannels({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t39Bias: useCue('t39Bias').at,
    t39Explicit: useCue('t39Explicit').at,
    t39Consciously: useCue('t39Consciously').at,
    t39Implicit: useCue('t39Implicit').at,
    t39Automatic: useCue('t39Automatic').at,
    t39Associations: useCue('t39Associations').at,
    t40Anthony: useCue('t40Anthony').at,
    t40Banaji: useCue('t40Banaji').at,
    t40Formal: useCue('t40Formal').at,
    t40Implicit: useCue('t40Implicit').at,
    t40Cognition: useCue('t40Cognition').at,
    t40NinetyFive: useCue('t40NinetyFive').at,
    t40Article: useCue('t40Article').at,
  };

  const L = EXPLICIT_IMPLICIT_LAYOUT;
  const isTurn40 = ms >= cue.t40Anthony;

  // Turn 39 progresses
  const biasP = enter(ms, cue.t39Bias);
  const explicitP = enter(ms, cue.t39Explicit);
  const consciouslyP = enter(ms, cue.t39Consciously);
  const implicitP = enter(ms, cue.t39Implicit);
  const automaticP = enter(ms, cue.t39Automatic);
  const assocP = enter(ms, cue.t39Associations);

  // Turn 40 progresses
  const anthonyP = enter(ms, cue.t40Anthony);
  const banajiP = enter(ms, cue.t40Banaji);
  const formalP = enter(ms, cue.t40Formal);
  const titleP = enter(ms, cue.t40Implicit);
  const cognitionP = enter(ms, cue.t40Cognition);
  const ninetyFiveP = enter(ms, cue.t40NinetyFive);
  const articleP = enter(ms, cue.t40Article);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  // Turn 39 Rails and Leaders
  const hasCard = ms >= cue.t39Consciously;
  const explicitRailInFull: Point[] = [[650, 382], [750, 382]];
  const explicitRailOutFull: Point[] = [[1230, 382], [1500, 382]];
  const explicitRailThrough: Point[] = [[650, 382], [1500, 382]];

  const explicitInDrawn = partialPolyline(explicitRailInFull, explicitP);
  const explicitOutDrawn = partialPolyline(explicitRailOutFull, consciouslyP);
  const explicitThroughDrawn = partialPolyline(explicitRailThrough, explicitP);

  // Implicit rail passes at y = 650, completely clear of heading (ends at 616) and label (starts at 715)
  const implicitRailFull: Point[] = [[650, 650], [1500, 650]];
  const implicitDrawn = partialPolyline(implicitRailFull, implicitP);

  const leaderExplicitToMeter: Point[] = [[1500, 382], [1540, 480]];
  const leaderImplicitToMeter: Point[] = [[1500, 650], [1540, 520]];

  // Turn 40 Source Rule
  const citeRulePoints: Point[] = [[390, 345], [1530, 345]];

  const authorsText = ms >= cue.t40Banaji
    ? 'ANTHONY G. GREENWALD · MAHZARIN R. BANAJI'
    : 'ANTHONY G. GREENWALD';

  return (
    <StageSceneFrame segment={segment}>
      {/* TURN 39: Balanced Dual-Channel System and Bias Hub */}
      {!isTurn40 && (
        <div data-turn="39">
          {/* Bias Hub */}
          <div data-bias-hub="true">
            <Panel id="bias-hub-frame" box={L.biasHub} accent="color/fill/gold" />
            <Label id="bias-hub-title" box={L.biasTitle} size={36} weight={700} sans align="center" ink={gold} opacity={biasP}>
              BIAS
            </Label>
            <div
              {...shapeAttrs('bias-person-mark', L.biasMark, 'mark', 'bias-person-mark')}
              style={{position: 'absolute', left: L.biasMark.x, top: L.biasMark.y, width: L.biasMark.w, height: L.biasMark.h, opacity: biasP}}
            >
              <PersonMark x={40} y={50} group="ingroup" emphasis={1} scale={1.5} />
            </div>
            <Label id="bias-hub-sub" box={L.biasSub} size={20} weight={400} align="center" ink={soft} opacity={biasP}>
              starting mental lean
            </Label>
          </div>

          {/* Explicit Channel: frame present from start of Turn 39, filling upper lane */}
          <div data-explicit-channel="true">
            <Panel id="explicit-channel-frame" box={L.explicitChannel} accent={ms >= cue.t39Explicit ? 'color/fill/gold' : 'color/line/hairline'} />
            {ms >= cue.t39Explicit && (
              <Label id="explicit-heading" box={L.explicitHeading} size={26} weight={600} ink={gold} opacity={explicitP}>
                EXPLICIT
              </Label>
            )}
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              {!hasCard && explicitThroughDrawn.length >= 2 && (
                <path {...lineAttrs('explicit-rail-through', explicitThroughDrawn)} d={pathFrom(explicitThroughDrawn)} fill="none" stroke={gold} strokeWidth="3" opacity={explicitP} />
              )}
              {hasCard && explicitInDrawn.length >= 2 && (
                <path {...lineAttrs('explicit-rail-in', explicitInDrawn)} d={pathFrom(explicitInDrawn)} fill="none" stroke={gold} strokeWidth="3" opacity={consciouslyP} />
              )}
              {hasCard && explicitOutDrawn.length >= 2 && (
                <path {...lineAttrs('explicit-rail-out', explicitOutDrawn)} d={pathFrom(explicitOutDrawn)} fill="none" stroke={gold} strokeWidth="3" opacity={consciouslyP} />
              )}
            </svg>
            {ms >= cue.t39Consciously && (
              <div data-signed-card="true" style={{opacity: consciouslyP}}>
                <Panel id="explicit-card-frame" box={L.explicitCard} accent="color/fill/gold" />
                <Label id="explicit-card-label" box={L.explicitCardLabel} size={20} weight={600} ink={primary}>
                  CONSCIOUSLY ENDORSED JUDGMENT
                </Label>
              </div>
            )}
          </div>

          {/* Implicit Channel: frame present from start of Turn 39, filling lower lane */}
          <div data-implicit-channel="true">
            <Panel id="implicit-channel-frame" box={L.implicitChannel} accent={ms >= cue.t39Implicit ? 'color/marker/race' : 'color/line/hairline'} />
            {ms >= cue.t39Implicit && (
              <Label id="implicit-heading" box={L.implicitHeading} size={26} weight={600} ink={raceRed} opacity={implicitP}>
                IMPLICIT
              </Label>
            )}
            {ms >= cue.t39Implicit && implicitDrawn.length >= 2 && (
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('implicit-rail', implicitDrawn)} d={pathFrom(implicitDrawn)} fill="none" stroke={raceRed} strokeWidth="3" opacity={implicitP} />
                {ms >= cue.t39Automatic && (
                  <>
                    <circle cx={1260} cy={650} r={9} fill={raceRed} opacity={automaticP} />
                    <circle cx={1340} cy={650} r={9} fill={raceRed} opacity={automaticP} />
                    <circle cx={1420} cy={650} r={9} fill={raceRed} opacity={automaticP} />
                  </>
                )}
              </svg>
            )}
            {ms >= cue.t39Automatic && (
              <Label id="implicit-assoc-label" box={L.implicitAssocLabel} size={20} weight={600} ink={primary} opacity={automaticP}>
                AUTOMATIC MENTAL ASSOCIATION
              </Label>
            )}
          </div>

          {/* Individual Judgment Meter */}
          {ms >= cue.t39Associations && (
            <div data-judgment-meter="true" style={{opacity: assocP}}>
              <Panel id="meter-panel-frame" box={L.meterPanel} accent="color/line/hairline" />
              <Label id="meter-label" box={L.meterLabel} size={20} weight={600} lh={1.3} align="center" ink={primary}>
                INDIVIDUAL JUDGMENT
              </Label>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('meter-lead-explicit', leaderExplicitToMeter)} d={pathFrom(leaderExplicitToMeter)} fill="none" stroke={gold} strokeWidth="2.5" strokeDasharray="4 4" />
                <path {...lineAttrs('meter-lead-implicit', leaderImplicitToMeter)} d={pathFrom(leaderImplicitToMeter)} fill="none" stroke={raceRed} strokeWidth="2.5" strokeDasharray="4 4" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* TURN 40: Greenwald & Banaji Citation Card (built to final size, populated in step) */}
      {isTurn40 && (
        <div data-turn="40">
          <Panel id="citation-card-frame" box={L.citationCard} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: gold}} />
          </Panel>

          {ms >= cue.t40Anthony && (
            <Label id="cite-authors" box={L.citeAuthors} size={34} weight={650} sans ink={primary} opacity={anthonyP}>
              {authorsText}
            </Label>
          )}

          {ms >= cue.t40Formal && (
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path {...lineAttrs('cite-rule', citeRulePoints)} d={pathFrom(citeRulePoints)} fill="none" stroke={gold} strokeWidth="2" opacity={formalP} />
            </svg>
          )}

          {ms >= cue.t40NinetyFive && (
            <Label id="cite-year" box={L.citeYear} size={32} weight={700} ink={gold} opacity={ninetyFiveP}>
              1995
            </Label>
          )}

          {ms >= cue.t40Implicit && (
            <Label
              id="cite-title"
              box={L.citeTitle}
              size={32}
              weight={500}
              sans
              lh={1.3}
              ink={soft}
              style={{fontStyle: 'italic'}}
              opacity={ms >= cue.t40Cognition ? cognitionP : 0.65 * titleP}
            >
              {ms >= cue.t40Cognition
                ? 'Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes'
                : 'Implicit Social Cognition…'}
            </Label>
          )}

          {/* references.bib 4226: Psychological Review 102(1) */}
          {ms >= cue.t40Article && (
            <Label id="cite-journal" box={L.citeJournal} size={24} weight={500} sans ink={primary} opacity={articleP}>
              Psychological Review 102(1)
            </Label>
          )}
        </div>
      )}

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        {!isTurn40
          ? 'The Original Power, Chapter 2 · dual-channel judgment'
          : ms >= cue.t40NinetyFive
          ? 'Greenwald & Banaji (1995) · Implicit Social Cognition'
          : 'Greenwald & Banaji · Implicit Social Cognition'}
      </Label>
    </StageSceneFrame>
  );
}
