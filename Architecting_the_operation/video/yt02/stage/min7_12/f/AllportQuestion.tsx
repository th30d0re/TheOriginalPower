import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  QuestionHeader,
  clamp01,
  lineAttrs,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const ALLPORT_QUESTION_LAYOUT = {
  header: {x: 150, y: 110, w: 1620, h: 135},
  biasBlock: {x: 240, y: 350, w: 460, h: 180},
  prejudiceBlock: {x: 780, y: 350, w: 460, h: 180},
  connectorLine: [[695, 444], [785, 444]] as const satisfies readonly Point[],
  citationCard: {x: 380, y: 340, w: 1160, h: 340},
  source: {x: 116, y: 964, w: 740, h: 26},
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
  const prejudiceP = enter(ms, cue.t46Prejudice);

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

  const connectorPoints: Point[] = [[690, 444], [790, 444]];
  const sourceRule: Point[] = [[430, 495], [1490, 495]];

  const biasOpacity = isCitation ? 0 : ms >= cue.t46Prejudice ? 0.42 : labelP;
  const prejudiceOpacity = isCitation ? 0 : ms >= cue.t46Prejudice ? 1 : labelP;

  const titleText = ms >= cue.t46PrejudiceTitle ? 'The Nature of Prejudice' : 'The Nature of';

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

      {!isCitation && ms >= cue.t46Label && (
        <div data-question-blocks="true" style={{opacity: labelP}}>
          <div data-term-block="bias" style={{opacity: biasOpacity}}>
            <Panel id="bias-block" box={L.biasBlock} accent="color/fill/gold">
              <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
            </Panel>
            <div
              {...shapeAttrs('bias-glyph', {x: 270, y: 455, w: 48, h: 56}, 'mark', 'person')}
              style={{position: 'absolute', left: 270, top: 455, width: 48, height: 56}}
            >
              <PersonMark x={24} y={28} group="ingroup" emphasis={1} scale={1} />
            </div>
            <Label id="bias-label" box={{x: 270, y: 375, w: 400, h: 36}} size={24} weight={600} sans ink={gold}>
              BIAS · STARTING TENDENCY
            </Label>
            <Label id="bias-summary" box={{x: 270, y: 415, w: 400, h: 28}} size={20} weight={500} sans ink={soft}>
              STARTING TENDENCY
            </Label>
            <div
              {...shapeAttrs('bias-socket', {x: 672, y: 435, w: 18, h: 18}, 'mark', 'socket')}
              style={{
                position: 'absolute',
                left: 672,
                top: 435,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: gold,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('question-connector', connectorPoints)} d="M690 444H790" stroke={gold} strokeWidth="3" />
          </svg>

          <div data-term-block="prejudice" style={{opacity: prejudiceOpacity}}>
            <Panel
              id="prejudice-block"
              box={L.prejudiceBlock}
              accent={ms >= cue.t46Second ? 'color/marker/race' : 'color/line/hairline'}
              style={{borderWidth: ms >= cue.t46Second ? 2 : 1}}
            >
              <span
                aria-hidden="true"
                style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: raceRed}}
              />
            </Panel>

            <div
              {...shapeAttrs('prejudice-glyph', {x: 810, y: 455, w: 48, h: 48}, 'mark', 'heart')}
              style={{position: 'absolute', left: 810, top: 455, width: 48, height: 48, color: raceRed}}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>

            <Label
              id="prejudice-label"
              box={{x: 810, y: 375, w: 400, h: 36}}
              size={24}
              weight={600}
              sans
              ink={ms >= cue.t46Second ? raceRed : color('color/text/accent')}
            >
              {ms >= cue.t46Second ? '2 · PREJUDICE' : 'PREJUDICE'}
            </Label>
            <Label
              id="prejudice-summary"
              box={{x: 810, y: 415, w: 400, h: 28}}
              size={20}
              weight={500}
              sans
              ink={ms >= cue.t46Second ? raceRed : soft}
            >
              GROUP ANTIPATHY
            </Label>

            <div
              {...shapeAttrs('prejudice-socket', {x: 790, y: 435, w: 18, h: 18}, 'mark', 'socket')}
              style={{
                position: 'absolute',
                left: 790,
                top: 435,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: raceRed,
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      )}

      {isCitation && (
        <div data-citation-card="true" style={{opacity: gordonP}}>
          <Panel id="citation-card" box={L.citationCard} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: gold}} />
          </Panel>

          {ms >= cue.t46FiftyFour && (
            <Label id="cite-year" box={{x: 430, y: 375, w: 180, h: 40}} size={32} weight={600} ink={gold} opacity={fiftyFourP}>
              1954
            </Label>
          )}

          <Label id="cite-author" box={{x: 430, y: 425, w: 1060, h: 52}} size={38} weight={650} sans ink={primary} opacity={gordonP}>
            GORDON W. ALLPORT
          </Label>

          {ms >= cue.t46Classic && (
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={classicP}>
              <path {...lineAttrs('cite-rule', sourceRule)} d="M430 495H1490" stroke={gold} strokeWidth="2" />
            </svg>
          )}

          {ms >= cue.t46Nature && (
            <Label id="cite-title" box={{x: 430, y: 515, w: 1060, h: 48}} size={36} sans ink={primary} style={{fontStyle: 'italic'}} opacity={titleP}>
              {titleText}
            </Label>
          )}

          {ms >= cue.t46Nine && (
            <Label id="cite-source-detail" box={{x: 430, y: 580, w: 1060, h: 32}} size={22} weight={500} ink={soft} opacity={nineP}>
              Allport 1954, p. 9
            </Label>
          )}
        </div>
      )}

      {ms >= cue.t46Nine && (
        <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted} opacity={nineP}>
          Allport 1954, p. 9
        </Label>
      )}
    </StageSceneFrame>
  );
}
