import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  QuestionHeader,
  lineAttrs,
  pathFrom,
  shapeAttrs,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const ALLPORT_QUESTION_LAYOUT = {
  header: {x: 150, y: 110, w: 1620, h: 135},

  // First half (Question & Concept Blocks, y: 110..880, span = 770 px)
  biasBlock: {x: 150, y: 310, w: 680, h: 330},
  prejudiceBlock: {x: 1090, y: 310, w: 680, h: 330},
  connectorLine: [[830, 476], [1090, 476]] as const satisfies readonly Point[],
  distinctionPanel: {x: 150, y: 710, w: 1620, h: 170},

  // Second half (Allport Citation Card + Concept Anchors, y: 110..880, span = 770 px)
  citationCard: {x: 330, y: 290, w: 1260, h: 292},
  conceptAnchorLeft: {x: 330, y: 630, w: 600, h: 250},
  conceptAnchorRight: {x: 990, y: 630, w: 600, h: 250},

  source: {x: 116, y: 954, w: 740, h: 30},
} as const;

export function AllportQuestion({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t46Why: useCue('t46Why').at,
    t46Label: useCue('t46Label').at,
    t46Second: useCue('t46Second').at,
    t46Prejudice: useCue('t46Prejudice').at,
    t46Gordon: useCue('t46Gordon').at,
    t46Classic: useCue('t46Classic').at,
    t46FiftyFour: useCue('t46FiftyFour').at,
    t46Nature: useCue('t46Nature').at,
    t46PrejudiceTitle: useCue('t46PrejudiceTitle').at,
    t46Nine: useCue('t46Nine').at,
  };

  const L = ALLPORT_QUESTION_LAYOUT;
  const isCitation = ms >= cue.t46Gordon;

  const whyP = enter(ms, cue.t46Why);
  const labelP = enter(ms, cue.t46Label);
  const secondP = enter(ms, cue.t46Second);

  const gordonP = enter(ms, cue.t46Gordon);
  const classicP = enter(ms, cue.t46Classic);
  const fiftyFourP = enter(ms, cue.t46FiftyFour);
  const natureP = enter(ms, cue.t46Nature);
  const titleP = enter(ms, cue.t46PrejudiceTitle);
  const nineP = enter(ms, cue.t46Nine);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const muted = color('color/text/muted');
  const soft = color('color/text/soft');

  const connectorPoints: Point[] = [[830, 476], [1090, 476]];
  const sourceRule: Point[] = [[374, 368], [1550, 368]];

  const biasOpacity = isCitation ? 0 : ms >= cue.t46Prejudice ? 0.42 : ms >= cue.t46Label ? labelP : whyP;
  const prejudiceOpacity = isCitation ? 0 : ms >= cue.t46Prejudice ? 1 : ms >= cue.t46Label ? labelP : whyP;

  return (
    <StageSceneFrame segment={segment}>
      <QuestionHeader
        id="question-header"
        box={L.header}
        text="Why does prejudice need its own label once bias is defined?"
        progress={whyP}
        accentTerm="prejudice"
        accent="color/marker/race"
      />

      {/* First Half: Bias & Prejudice Question Blocks + Distinction Summary Panel */}
      {!isCitation && ms >= cue.t46Why && (
        <div data-question-blocks="true" style={{opacity: whyP}}>
          {/* Left Block: Bias (height 330, text span 294 -> 36 px slack) */}
          <div data-term-block="bias" style={{opacity: biasOpacity}}>
            <Panel id="bias-block" box={L.biasBlock} accent="color/fill/gold">
              <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
            </Panel>
            <div
              {...shapeAttrs('bias-glyph', {x: 174, y: 332, w: 52, h: 56}, 'mark', 'person')}
              style={{position: 'absolute', left: 174, top: 332, width: 52, height: 56}}
            >
              <PersonMark x={26} y={28} group="ingroup" emphasis={1} scale={1.05} />
            </div>
            <Label id="bias-label" box={{x: 240, y: 328, w: 560, h: 40}} size={30} weight={650} sans ink={gold}>
              {ms >= cue.t46Label ? 'BIAS · STARTING TENDENCY' : 'CONCEPT 1 · BIAS'}
            </Label>
            <Label id="bias-summary" box={{x: 240, y: 376, w: 560, h: 30}} size={22} weight={600} ink={soft}>
              STARTING TENDENCY
            </Label>
            <Label id="bias-body" box={{x: 180, y: 432, w: 590, h: 120}} size={28} weight={400} lh={1.32} sans ink={primary}>
              Prior lean in judgment that updates when new evidence arrives.
            </Label>
            <Label id="bias-footer" box={{x: 180, y: 590, w: 590, h: 32}} size={20} weight={500} ink={muted}>
              FIRST CONCEPT · GREENWALD &amp; BANAJI 1995
            </Label>
            {ms >= cue.t46Label && (
              <div
                {...shapeAttrs('bias-socket', {x: 796, y: 466, w: 20, h: 20}, 'mark', 'socket')}
                style={{
                  position: 'absolute',
                  left: 796,
                  top: 466,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: gold,
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>

          {ms >= cue.t46Label && (
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={labelP}>
              <path {...lineAttrs('question-connector', connectorPoints)} d={pathFrom(connectorPoints)} stroke={gold} strokeWidth="3.5" />
            </svg>
          )}

          {/* Right Block: Prejudice (height 330, text span 294 -> 36 px slack) */}
          <div data-term-block="prejudice" style={{opacity: prejudiceOpacity}}>
            <Panel
              id="prejudice-block"
              box={L.prejudiceBlock}
              accent={ms >= cue.t46Second ? 'color/marker/race' : 'color/line/hairline-strong'}
              style={{borderWidth: ms >= cue.t46Second ? 2 : 1}}
            >
              <span
                aria-hidden="true"
                style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: raceRed}}
              />
            </Panel>

            <div
              {...shapeAttrs('prejudice-glyph', {x: 1114, y: 332, w: 52, h: 52}, 'mark', 'heart')}
              style={{position: 'absolute', left: 1114, top: 332, width: 52, height: 52, color: raceRed}}
            >
              <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>

            <Label
              id="prejudice-label"
              box={{x: 1180, y: 328, w: 560, h: 40}}
              size={30}
              weight={650}
              sans
              ink={ms >= cue.t46Second ? raceRed : color('color/text/accent')}
              opacity={ms >= cue.t46Second ? secondP : 1}
            >
              {ms >= cue.t46Second ? '2 · PREJUDICE' : 'PREJUDICE'}
            </Label>
            <Label
              id="prejudice-summary"
              box={{x: 1180, y: 376, w: 560, h: 30}}
              size={22}
              weight={600}
              ink={ms >= cue.t46Second ? raceRed : soft}
            >
              GROUP ANTIPATHY
            </Label>
            <Label id="prejudice-body" box={{x: 1136, y: 432, w: 590, h: 120}} size={28} weight={400} lh={1.32} sans ink={primary}>
              Affective hostility anchored to a rigid group generalization.
            </Label>
            <Label id="prejudice-footer" box={{x: 1136, y: 590, w: 590, h: 32}} size={20} weight={500} ink={ms >= cue.t46Second ? raceRed : muted}>
              SECOND CONCEPT · REQUIRES SEPARATE LABEL
            </Label>

            {ms >= cue.t46Label && (
              <div
                {...shapeAttrs('prejudice-socket', {x: 1104, y: 466, w: 20, h: 20}, 'mark', 'socket')}
                style={{
                  position: 'absolute',
                  left: 1104,
                  top: 466,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: raceRed,
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>

          {/* Lower Distinction Summary Panel (height 170, text span 134 -> 36 px slack) */}
          <Panel id="distinction-panel" box={L.distinctionPanel} accent="color/line/hairline" />
          <Label id="distinction-title" box={{x: 180, y: 728, w: 1560, h: 40}} size={28} weight={600} sans ink={primary}>
            ANALYTICAL QUESTION · WHY A SECOND CONCEPT IS REQUIRED
          </Label>
          <Label id="distinction-left" box={{x: 180, y: 828, w: 760, h: 34}} size={20} weight={500} ink={gold}>
            CONCEPT ONE · COGNITIVE STARTING LEAN
          </Label>
          <Label id="distinction-right" box={{x: 980, y: 828, w: 760, h: 34}} size={20} weight={600} align="right" ink={raceRed}>
            CONCEPT TWO · RIGID GROUP HOSTILITY
          </Label>
        </div>
      )}

      {/* Second Half: Allport 1954 Citation Card (sized tightly to content, h=292, text span=256 -> 36 px slack) + Two Concept Anchors */}
      {isCitation && (
        <div data-citation-card="true" style={{opacity: gordonP}}>
          <Panel id="citation-card" box={L.citationCard} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: gold}} />
          </Panel>

          <Label id="cite-author" box={{x: 374, y: 308, w: 860, h: 44}} size={36} weight={650} sans ink={primary}>
            GORDON W. ALLPORT
          </Label>

          <Label
            id="cite-year"
            box={{x: 1260, y: 308, w: 290, h: 44}}
            size={32}
            weight={700}
            align="right"
            ink={ms >= cue.t46FiftyFour ? gold : muted}
            opacity={ms >= cue.t46FiftyFour ? fiftyFourP : 1}
          >
            {ms >= cue.t46FiftyFour ? '1954' : 'YEAR'}
          </Label>

          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={Math.max(0.75, classicP)}>
            <path {...lineAttrs('cite-rule', sourceRule)} d={pathFrom(sourceRule)} stroke={gold} strokeWidth="2" />
          </svg>

          <div data-title-bright={ms >= cue.t46PrejudiceTitle ? 'true' : undefined}>
            <Label
              id="cite-title"
              box={{x: 374, y: 386, w: 1176, h: 48}}
              size={36}
              weight={600}
              sans
              ink={ms >= cue.t46PrejudiceTitle ? primary : soft}
              style={{fontStyle: 'italic'}}
              opacity={ms >= cue.t46Nature ? Math.max(0.88, natureP, titleP) : 0.88}
            >
              The Nature of Prejudice
            </Label>
          </div>

          <Label id="cite-body" box={{x: 374, y: 452, w: 1176, h: 44}} size={28} weight={400} sans ink={primary}>
            Classic formulation of group antipathy and rigid generalization.
          </Label>

          <Label
            id="cite-source-detail"
            box={{x: 374, y: 530, w: 1176, h: 34}}
            size={22}
            weight={600}
            ink={gold}
          >
            {ms >= cue.t46FiftyFour ? 'Addison-Wesley · 1954 · p. 9' : 'Addison-Wesley · p. 9'}
          </Label>

          {/* Lower Two-Concept Anchors (y: 630..880, h = 250, text span = 214 -> 36 px slack) */}
          <Panel id="concept-anchor-left" box={L.conceptAnchorLeft} accent="color/line/hairline" />
          <Label id="anchor-left-tag" box={{x: 358, y: 648, w: 544, h: 32}} size={20} weight={600} ink={gold}>
            CONCEPT 1 · BIAS
          </Label>
          <Label id="anchor-left-body" box={{x: 358, y: 702, w: 544, h: 80}} size={28} weight={400} sans ink={soft}>
            Statistical or mental starting lean in individual judgment.
          </Label>
          <Label id="anchor-left-sub" box={{x: 358, y: 830, w: 544, h: 32}} size={20} weight={500} ink={muted}>
            GREENWALD &amp; BANAJI · 1995
          </Label>

          <Panel id="concept-anchor-right" box={L.conceptAnchorRight} accent="color/marker/race" />
          <Label id="anchor-right-tag" box={{x: 1018, y: 648, w: 544, h: 32}} size={20} weight={650} ink={raceRed}>
            CONCEPT 2 · PREJUDICE
          </Label>
          <Label id="anchor-right-body" box={{x: 1018, y: 702, w: 544, h: 80}} size={28} weight={400} sans ink={primary}>
            Faulty and inflexible group antipathy established by Allport.
          </Label>
          <Label id="anchor-right-sub" box={{x: 1018, y: 830, w: 544, h: 32}} size={20} weight={600} ink={gold}>
            ALLPORT · ADDISON-WESLEY · P. 9
          </Label>
        </div>
      )}

      {ms >= cue.t46Why && (
        <Label
          id="source-line"
          box={L.source}
          size={20}
          weight={400}
          ls={0.35}
          lh={1.35}
          ink={muted}
          opacity={ms >= cue.t46Nine ? nineP : 1}
        >
          {ms >= cue.t46Nine
            ? 'Allport 1954, p. 9'
            : isCitation
              ? 'Gordon W. Allport · The Nature of Prejudice · Addison-Wesley'
              : 'The Original Power, Chapter 2 · concept distinction'}
        </Label>
      )}
    </StageSceneFrame>
  );
}
