import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  lineAttrs,
  partialPolyline,
  pathFrom,
  shapeAttrs,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const EXPLICIT_IMPLICIT_LAYOUT = {
  // Turn 39 Top Banner (slack: 72 - 40 = 32 px)
  t39Banner: {x: 120, y: 115, w: 1680, h: 72},
  t39BannerTag: {x: 150, y: 133, w: 480, h: 36},
  t39BannerTitle: {x: 680, y: 131, w: 1090, h: 40},

  // Turn 39 Left: Bias Hub (slack: 665 - 629 = 36 px)
  biasHub: {x: 120, y: 220, w: 400, h: 665},
  biasHeader: {x: 148, y: 238, w: 344, h: 32},
  biasTitle: {x: 148, y: 278, w: 344, h: 48},
  biasMark: {x: 280, y: 360, w: 80, h: 120},
  biasBody: {x: 148, y: 520, w: 344, h: 160},
  biasSub: {x: 148, y: 833, w: 344, h: 34},

  // Turn 39 Center Upper: Explicit Channel (slack: 310 - 274 = 36 px)
  explicitChannel: {x: 560, y: 220, w: 880, h: 310},
  explicitTag: {x: 588, y: 238, w: 340, h: 32},
  explicitHeading: {x: 940, y: 236, w: 472, h: 38},
  explicitCard: {x: 660, y: 295, w: 680, h: 80},
  explicitCardTag: {x: 684, y: 303, w: 632, h: 24},
  explicitCardLabel: {x: 684, y: 331, w: 632, h: 36},
  explicitDesc: {x: 588, y: 400, w: 824, h: 52},
  explicitFooter: {x: 588, y: 478, w: 824, h: 34},

  // Turn 39 Center Lower: Implicit Channel (slack: 310 - 274 = 36 px)
  implicitChannel: {x: 560, y: 575, w: 880, h: 310},
  implicitTag: {x: 588, y: 593, w: 420, h: 32},
  implicitHeading: {x: 1020, y: 591, w: 392, h: 38},
  implicitAssocLabel: {x: 588, y: 740, w: 824, h: 42},
  implicitFooter: {x: 588, y: 833, w: 824, h: 34},

  // Turn 39 Right: Individual Judgment Meter (slack: 665 - 629 = 36 px)
  meterPanel: {x: 1480, y: 220, w: 320, h: 665},
  meterHeader: {x: 1506, y: 238, w: 268, h: 32},
  meterLabel: {x: 1506, y: 290, w: 268, h: 90},
  meterBody: {x: 1506, y: 420, w: 268, h: 240},
  meterFooter: {x: 1506, y: 833, w: 268, h: 34},

  // Turn 40 Upper: Greenwald & Banaji Citation Card tightly fit to content (slack: 256 - 220 = 36 px)
  citationCard: {x: 220, y: 115, w: 1480, h: 256},
  citeTag: {x: 264, y: 133, w: 640, h: 28},
  citeAuthors: {x: 264, y: 167, w: 1140, h: 42},
  citeYear: {x: 1430, y: 167, w: 226, h: 42},
  citeTitle: {x: 264, y: 230, w: 1392, h: 44},
  citeJournal: {x: 264, y: 282, w: 1392, h: 36},
  citeFooter: {x: 264, y: 325, w: 1392, h: 28},

  // Turn 40 Lower: Paired Explicit / Implicit Picture (y: 410..885, h: 475)
  t40BiasHub: {x: 120, y: 410, w: 380, h: 475},
  t40BiasHeader: {x: 146, y: 428, w: 328, h: 30},
  t40BiasTitle: {x: 146, y: 468, w: 328, h: 44},
  t40BiasMark: {x: 270, y: 530, w: 80, h: 110},
  t40BiasBody: {x: 146, y: 665, w: 328, h: 150},
  t40BiasSub: {x: 146, y: 835, w: 328, h: 32},

  t40ExplicitChannel: {x: 540, y: 410, w: 900, h: 220},
  t40ExpTag: {x: 568, y: 428, w: 360, h: 30},
  t40ExpHeading: {x: 940, y: 426, w: 472, h: 36},
  t40ExpBody: {x: 568, y: 520, w: 844, h: 42},
  t40ExpFooter: {x: 568, y: 580, w: 844, h: 32},

  t40ImplicitChannel: {x: 540, y: 665, w: 900, h: 220},
  t40ImpTag: {x: 568, y: 683, w: 420, h: 30},
  t40ImpHeading: {x: 1000, y: 681, w: 412, h: 36},
  t40ImpBody: {x: 568, y: 775, w: 844, h: 42},
  t40ImpFooter: {x: 568, y: 835, w: 844, h: 32},

  t40MeterPanel: {x: 1480, y: 410, w: 320, h: 475},
  t40MeterHeader: {x: 1506, y: 428, w: 268, h: 30},
  t40MeterTitle: {x: 1506, y: 472, w: 268, h: 86},
  t40MeterBody: {x: 1506, y: 585, w: 268, h: 210},
  t40MeterFooter: {x: 1506, y: 835, w: 268, h: 32},

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
  const hasCognition = ms >= cue.t40Cognition;
  const hasYear = ms >= cue.t40NinetyFive;
  const hasArticle = ms >= cue.t40Article;

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  // Turn 39 Rails and Leaders
  const hasCard = ms >= cue.t39Consciously;
  const explicitRailInFull: Point[] = [[595, 335], [660, 335]];
  const explicitRailOutFull: Point[] = [[1340, 335], [1405, 335]];
  const explicitRailThrough: Point[] = [[595, 335], [1405, 335]];

  const explicitInDrawn = partialPolyline(explicitRailInFull, explicitP);
  const explicitOutDrawn = partialPolyline(explicitRailOutFull, consciouslyP);
  const explicitThroughDrawn = partialPolyline(explicitRailThrough, explicitP);

  const implicitRailFull: Point[] = [[595, 690], [1405, 690]];
  const implicitDrawn = partialPolyline(implicitRailFull, implicitP);

  const leaderExplicitToMeter: Point[] = [[1440, 375], [1480, 375]];
  const leaderImplicitToMeter: Point[] = [[1440, 730], [1480, 730]];

  // Turn 40 Citation Rule and Lower Picture Rails
  const citeRulePoints: Point[] = [[264, 218], [1656, 218]];
  const t40ExpRail: Point[] = [[575, 492], [1405, 492]];
  const t40ImpRail: Point[] = [[575, 747], [1405, 747]];
  const t40LeadExp: Point[] = [[1440, 520], [1480, 520]];
  const t40LeadImp: Point[] = [[1440, 775], [1480, 775]];

  const authorsText = ms >= cue.t40Banaji
    ? 'ANTHONY G. GREENWALD · MAHZARIN R. BANAJI'
    : 'ANTHONY G. GREENWALD';

  return (
    <StageSceneFrame segment={segment}>
      {/* TURN 39: Balanced Dual-Channel System and Bias Hub */}
      {!isTurn40 && (
        <div data-turn="39">
          {/* Top Banner */}
          <div data-t39-banner="true">
            <Panel id="t39-banner-frame" box={L.t39Banner} accent="color/line/hairline" />
            <Label id="t39-banner-tag" box={L.t39BannerTag} size={20} weight={600} ink={muted}>
              CHAPTER 2 · DUAL-CHANNEL ARCHITECTURE
            </Label>
            <Label id="t39-banner-title" box={L.t39BannerTitle} size={28} weight={700} sans align="right" ink={gold}>
              TWO CHANNELS OF INDIVIDUAL EVALUATION
            </Label>
          </div>

          {/* Bias Hub */}
          <div data-bias-hub="true">
            <Panel id="bias-hub-frame" box={L.biasHub} accent="color/fill/gold" />
            <Label id="bias-hub-header" box={L.biasHeader} size={20} weight={600} align="center" ink={muted} opacity={Math.max(0.85, biasP)}>
              STARTING NODE
            </Label>
            <Label id="bias-hub-title" box={L.biasTitle} size={36} weight={700} sans align="center" ink={gold} opacity={Math.max(0.85, biasP)}>
              BIAS
            </Label>
            <div
              {...shapeAttrs('bias-person-mark', L.biasMark, 'mark', 'bias-person-mark')}
              style={{position: 'absolute', left: L.biasMark.x, top: L.biasMark.y, width: L.biasMark.w, height: L.biasMark.h, opacity: Math.max(0.85, biasP)}}
            >
              <PersonMark x={40} y={60} group="ingroup" emphasis={1} scale={1.55} />
            </div>
            <Label id="bias-hub-body" box={L.biasBody} size={28} weight={500} sans lh={1.3} align="center" ink={soft} opacity={Math.max(0.85, biasP)}>
              Starting mental lean branching into upper and lower pathways
            </Label>
            <Label id="bias-hub-sub" box={L.biasSub} size={22} weight={600} align="center" ink={gold} opacity={Math.max(0.85, biasP)}>
              STARTING MENTAL LEAN
            </Label>
          </div>

          {/* Explicit Channel */}
          <div data-explicit-channel="true">
            <Panel id="explicit-channel-frame" box={L.explicitChannel} accent={ms >= cue.t39Explicit ? 'color/fill/gold' : 'color/line/hairline'} />
            <Label id="explicit-tag" box={L.explicitTag} size={20} weight={600} ink={muted}>
              UPPER CHANNEL · SELF-REPORT
            </Label>
            {ms >= cue.t39Explicit && (
              <Label id="explicit-heading" box={L.explicitHeading} size={30} weight={700} sans align="right" ink={gold} opacity={explicitP}>
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
                <Label id="explicit-card-tag" box={L.explicitCardTag} size={20} weight={600} lh={1.1} ink={gold}>
                  SIGNED STATEMENT CARD
                </Label>
                <Label id="explicit-card-label" box={L.explicitCardLabel} size={28} weight={600} sans lh={1.15} ink={primary}>
                  CONSCIOUSLY ENDORSED JUDGMENT
                </Label>
              </div>
            )}
            <Label id="explicit-desc" box={L.explicitDesc} size={28} weight={500} sans ink={soft}>
              Deliberate propositions reported on direct inquiry
            </Label>
            <Label id="explicit-footer" box={L.explicitFooter} size={20} weight={600} ink={muted}>
              VERBAL ENDORSEMENT PATHWAY
            </Label>
          </div>

          {/* Implicit Channel */}
          <div data-implicit-channel="true">
            <Panel id="implicit-channel-frame" box={L.implicitChannel} accent={ms >= cue.t39Implicit ? 'color/marker/race' : 'color/line/hairline'} />
            <Label id="implicit-tag" box={L.implicitTag} size={20} weight={600} ink={muted}>
              LOWER CHANNEL · TRACE ACTIVATION
            </Label>
            {ms >= cue.t39Implicit && (
              <Label id="implicit-heading" box={L.implicitHeading} size={30} weight={700} sans align="right" ink={raceRed} opacity={implicitP}>
                IMPLICIT
              </Label>
            )}
            {ms >= cue.t39Implicit && implicitDrawn.length >= 2 && (
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('implicit-rail', implicitDrawn)} d={pathFrom(implicitDrawn)} fill="none" stroke={raceRed} strokeWidth="3" opacity={implicitP} />
                {ms >= cue.t39Automatic && (
                  <>
                    <circle cx={1180} cy={690} r={9} fill={raceRed} opacity={automaticP} />
                    <circle cx={1260} cy={690} r={9} fill={raceRed} opacity={automaticP} />
                    <circle cx={1340} cy={690} r={9} fill={raceRed} opacity={automaticP} />
                  </>
                )}
              </svg>
            )}
            <Label
              id="implicit-assoc-label"
              box={L.implicitAssocLabel}
              size={28}
              weight={ms >= cue.t39Automatic ? 600 : 500}
              sans
              ink={ms >= cue.t39Automatic ? primary : soft}
            >
              {ms >= cue.t39Automatic ? 'AUTOMATIC MENTAL ASSOCIATION' : 'Rapid memory trace activated upon cue encounter'}
            </Label>
            <Label id="implicit-footer" box={L.implicitFooter} size={20} weight={600} ink={muted}>
              SPONTANEOUS TRACE PATHWAY
            </Label>
          </div>

          {/* Individual Judgment Meter */}
          {ms >= cue.t39Associations && (
            <div data-judgment-meter="true" style={{opacity: assocP}}>
              <Panel id="meter-panel-frame" box={L.meterPanel} accent="color/line/hairline" />
              <Label id="meter-header" box={L.meterHeader} size={20} weight={600} align="center" ink={muted}>
                CONVERGENCE READOUT
              </Label>
              <Label id="meter-label" box={L.meterLabel} size={28} weight={700} sans lh={1.25} align="center" ink={primary}>
                INDIVIDUAL JUDGMENT
              </Label>
              <Label id="meter-body" box={L.meterBody} size={28} weight={500} sans lh={1.3} align="center" ink={soft}>
                Both channels feed downstream evaluation and action
              </Label>
              <Label id="meter-footer" box={L.meterFooter} size={20} weight={600} align="center" ink={gold}>
                COMBINED OUTPUT STAGE
              </Label>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('meter-lead-explicit', leaderExplicitToMeter)} d={pathFrom(leaderExplicitToMeter)} fill="none" stroke={gold} strokeWidth="2.5" strokeDasharray="4 4" />
                <path {...lineAttrs('meter-lead-implicit', leaderImplicitToMeter)} d={pathFrom(leaderImplicitToMeter)} fill="none" stroke={raceRed} strokeWidth="2.5" strokeDasharray="4 4" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* TURN 40: Greenwald & Banaji Citation Card paired with Explicit / Implicit Picture */}
      {isTurn40 && (
        <div
          data-turn="40"
          data-cognition-bright={hasCognition ? 'true' : 'false'}
          data-year-bright={hasYear ? 'true' : 'false'}
          data-article-bright={hasArticle ? 'true' : 'false'}
          style={{opacity: anthonyP}}
        >
          {/* Tight Citation Card */}
          <div data-citation-card="true">
            <Panel id="citation-card-frame" box={L.citationCard} accent="color/fill/gold">
              <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: gold}} />
            </Panel>

            <Label id="cite-tag" box={L.citeTag} size={20} weight={600} ink={muted}>
              FOUNDATIONAL FORMULATION · CITATION RECORD
            </Label>

            <Label id="cite-authors" box={L.citeAuthors} size={32} weight={700} sans ink={primary}>
              {authorsText}
            </Label>

            <Label
              id="cite-year"
              box={L.citeYear}
              size={32}
              weight={700}
              align="right"
              ink={gold}
              opacity={hasYear ? 1 : 0.85}
            >
              1995
            </Label>

            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path {...lineAttrs('cite-rule', citeRulePoints)} d={pathFrom(citeRulePoints)} fill="none" stroke={gold} strokeWidth="2" />
            </svg>

            <Label
              id="cite-title"
              box={L.citeTitle}
              size={32}
              weight={600}
              sans
              lh={1.2}
              ink={hasCognition ? primary : soft}
              style={{fontStyle: 'italic'}}
            >
              Implicit Social Cognition: Attitudes, Self-Esteem, and Stereotypes
            </Label>

            {/* references.bib 4226: Psychological Review 102(1) */}
            <Label
              id="cite-journal"
              box={L.citeJournal}
              size={28}
              weight={500}
              sans
              ink={hasArticle ? gold : soft}
            >
              Psychological Review 102(1)
            </Label>

            <Label id="cite-footer" box={L.citeFooter} size={20} weight={600} ink={muted}>
              FORMALIZED EXPLICIT AND IMPLICIT SOCIAL COGNITION · BIB 4226
            </Label>
          </div>

          {/* Lower Paired Explicit / Implicit Picture */}
          <div data-t40-picture="true">
            {/* Bias Hub */}
            <Panel id="t40-bias-hub-frame" box={L.t40BiasHub} accent="color/fill/gold" />
            <Label id="t40-bias-header" box={L.t40BiasHeader} size={20} weight={600} align="center" ink={muted}>
              DUAL-CHANNEL SOURCE
            </Label>
            <Label id="t40-bias-title" box={L.t40BiasTitle} size={32} weight={700} sans align="center" ink={gold}>
              BIAS
            </Label>
            <div
              {...shapeAttrs('t40-bias-person-mark', L.t40BiasMark, 'mark', 't40-bias-person-mark')}
              style={{position: 'absolute', left: L.t40BiasMark.x, top: L.t40BiasMark.y, width: L.t40BiasMark.w, height: L.t40BiasMark.h}}
            >
              <PersonMark x={40} y={55} group="ingroup" emphasis={1} scale={1.45} />
            </div>
            <Label id="t40-bias-body" box={L.t40BiasBody} size={28} weight={500} sans lh={1.25} align="center" ink={soft}>
              Single observer split across two cognitive channels
            </Label>
            <Label id="t40-bias-sub" box={L.t40BiasSub} size={20} weight={600} align="center" ink={gold}>
              STARTING MENTAL LEAN
            </Label>

            {/* Explicit Channel */}
            <Panel id="t40-explicit-frame" box={L.t40ExplicitChannel} accent="color/fill/gold" />
            <Label id="t40-exp-tag" box={L.t40ExpTag} size={20} weight={600} ink={muted}>
              UPPER CHANNEL · SELF-REPORT
            </Label>
            <Label id="t40-exp-heading" box={L.t40ExpHeading} size={28} weight={700} sans align="right" ink={gold}>
              EXPLICIT COGNITION
            </Label>
            <Label id="t40-exp-body" box={L.t40ExpBody} size={28} weight={500} sans ink={primary}>
              Consciously endorsed attitude and signed self-report
            </Label>
            <Label id="t40-exp-footer" box={L.t40ExpFooter} size={20} weight={600} ink={muted}>
              INTROSPECTIVELY ACCESSIBLE EVALUATION
            </Label>

            {/* Implicit Channel */}
            <Panel id="t40-implicit-frame" box={L.t40ImplicitChannel} accent="color/marker/race" />
            <Label id="t40-imp-tag" box={L.t40ImpTag} size={20} weight={600} ink={muted}>
              LOWER CHANNEL · TRACE ACTIVATION
            </Label>
            <Label id="t40-imp-heading" box={L.t40ImpHeading} size={28} weight={700} sans align="right" ink={raceRed}>
              IMPLICIT COGNITION
            </Label>
            <Label id="t40-imp-body" box={L.t40ImpBody} size={28} weight={500} sans ink={primary}>
              Automatic mental association triggered by past traces
            </Label>
            <Label id="t40-imp-footer" box={L.t40ImpFooter} size={20} weight={600} ink={muted}>
              UNIDENTIFIED PAST EXPERIENCE TRACE
            </Label>

            {/* Meter Panel */}
            <Panel id="t40-meter-frame" box={L.t40MeterPanel} accent="color/line/hairline" />
            <Label id="t40-meter-header" box={L.t40MeterHeader} size={20} weight={600} align="center" ink={muted}>
              BEHAVIORAL OUTPUT
            </Label>
            <Label id="t40-meter-title" box={L.t40MeterTitle} size={28} weight={700} sans lh={1.25} align="center" ink={primary}>
              INDIVIDUAL JUDGMENT
            </Label>
            <Label id="t40-meter-body" box={L.t40MeterBody} size={28} weight={500} sans lh={1.3} align="center" ink={soft}>
              Dissociated channels jointly shape downstream action
            </Label>
            <Label id="t40-meter-footer" box={L.t40MeterFooter} size={20} weight={600} align="center" ink={gold}>
              PSYCH. REV. 102(1)
            </Label>

            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path {...lineAttrs('t40-exp-rail', t40ExpRail)} d={pathFrom(t40ExpRail)} fill="none" stroke={gold} strokeWidth="3" />
              <path {...lineAttrs('t40-imp-rail', t40ImpRail)} d={pathFrom(t40ImpRail)} fill="none" stroke={raceRed} strokeWidth="3" />
              <circle cx={1180} cy={747} r={8} fill={raceRed} />
              <circle cx={1260} cy={747} r={8} fill={raceRed} />
              <circle cx={1340} cy={747} r={8} fill={raceRed} />
              <path {...lineAttrs('t40-lead-exp', t40LeadExp)} d={pathFrom(t40LeadExp)} fill="none" stroke={gold} strokeWidth="2.5" strokeDasharray="4 4" />
              <path {...lineAttrs('t40-lead-imp', t40LeadImp)} d={pathFrom(t40LeadImp)} fill="none" stroke={raceRed} strokeWidth="2.5" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      )}

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        {!isTurn40
          ? 'The Original Power, Chapter 2 · dual-channel judgment'
          : 'Greenwald & Banaji (1995) · Implicit Social Cognition'}
      </Label>
    </StageSceneFrame>
  );
}
