import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  clamp01,
  lineAttrs,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const IAT_LATENCY_LAYOUT = {
  // Turn 43
  sourcePlaque: {x: 330, y: 260, w: 1260, h: 350},
  plaqueYear: {x: 380, y: 290, w: 200, h: 44},
  plaqueAuthors: {x: 380, y: 355, w: 1160, h: 56},
  plaqueJournal: {x: 380, y: 450, w: 1160, h: 48},
  iatTitle: {x: 380, y: 650, w: 1160, h: 60},

  // Turn 44
  sourceTab: {x: 120, y: 115, w: 600, h: 48},
  sortingMonitor: {x: 120, y: 170, w: 1140, h: 700},
  promptCard: {x: 450, y: 290, w: 480, h: 240},
  faceCard: {x: 465, y: 335, w: 210, h: 140},
  wordCard: {x: 705, y: 335, w: 210, h: 140},
  keyLeft: {x: 200, y: 670, w: 340, h: 130},
  keyRight: {x: 840, y: 670, w: 340, h: 130},
  timerTrace: {x: 440, y: 605, w: 230, h: 30},
  latencyInstrument: {x: 1320, y: 220, w: 470, h: 580},

  // Turn 45
  reactionInstrument: {x: 130, y: 260, w: 550, h: 530},
  fieldAuditInstrument: {x: 740, y: 260, w: 510, h: 530},
  judgmentMeter: {x: 1330, y: 260, w: 460, h: 530},

  source: {x: 116, y: 964, w: 1300, h: 26},
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
  const mcgheeP = enter(ms, cue.t43McGhee);
  const schwartzP = enter(ms, cue.t43Schwartz);
  const introP = enter(ms, cue.t43Introduced);
  const journalP = enter(ms, cue.t43Journal);

  const testP = enter(ms, cue.t44Test);
  const autoP = enter(ms, cue.t44Automatic);
  const latencyP = enter(ms, cue.t44ResponseLatency);
  const sortingP = enter(ms, cue.t44Sorting);
  const splitP = enter(ms, cue.t44SplitSecond);
  const fastP = enter(ms, cue.t44Fast);
  const pairsP = enter(ms, cue.t44Pairs);
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
        : 'ANTHONY GREENWALD';

  const plaqueRule: Point[] = [[380, 430], [1540, 430]];
  const timerLine: Point[] = [[690, 530], [690, 668]];
  const meterNeedlePoints: Point[] = [
    [1560, 500],
    [1560 + Math.sin((12 + weightP * 18) * (Math.PI / 180)) * 90, 500 - Math.cos((12 + weightP * 18) * (Math.PI / 180)) * 90],
  ];
  const leaderLeft: Point[] = [[405, 790], [405, 818], [1560, 818], [1560, 790]];
  const leaderCenter: Point[] = [[995, 790], [995, 818], [1560, 818], [1560, 790]];

  return (
    <StageSceneFrame segment={segment}>
      {isTurn43 && ms >= cue.t43Three && (
        <div data-turn="43" style={{opacity: plaqueP}}>
          <Panel id="source-plaque" box={L.sourcePlaque} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: gold}} />
          </Panel>

          {ms >= cue.t43NinetyEight && (
            <Label id="plaque-year" box={L.plaqueYear} size={32} weight={600} ink={gold} opacity={yearP}>
              1998
            </Label>
          )}

          {ms >= cue.t43Anthony && (
            <Label id="plaque-authors" box={L.plaqueAuthors} size={36} weight={650} sans ink={primary} opacity={anthonyP}>
              {authorsText}
            </Label>
          )}

          {ms >= cue.t43Journal && (
            <>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('plaque-rule', plaqueRule)} d="M380 430H1540" stroke={gold} strokeWidth="1" opacity={journalP} />
              </svg>
              <Label id="plaque-journal" box={L.plaqueJournal} size={28} weight={400} sans ink={soft} style={{fontStyle: 'italic'}} opacity={journalP}>
                Journal of Personality and Social Psychology
              </Label>
            </>
          )}

          {ms >= cue.t43Introduced && (
            <Label id="iat-title" box={L.iatTitle} size={40} weight={650} sans align="center" ink={gold} opacity={introP}>
              IMPLICIT ASSOCIATION TEST
            </Label>
          )}
        </div>
      )}

      {isTurn44 && (
        <div data-turn="44" style={{opacity: testP}}>
          <Panel id="sorting-monitor" box={L.sortingMonitor} />
          <Label id="monitor-heading" box={{x: 150, y: 195, w: 720, h: 36}} size={28} weight={600} sans ink={gold}>
            DERIVED FACE + WORD SORTING TASK
          </Label>
          <Label id="monitor-notice" box={{x: 150, y: 238, w: 720, h: 30}} size={20} weight={500} ink={muted}>
            DERIVED ILLUSTRATION · NO TEST SCORE
          </Label>

          {ms >= cue.t44Automatic && (
            <div data-prompt-card="true" style={{opacity: autoP}}>
              <Panel id="prompt-card" box={L.promptCard} accent="color/fill/gold" />
              <Label id="prompt-header" box={{x: 460, y: 302, w: 460, h: 26}} size={18} weight={600} align="center" ink={gold}>
                SORTING TRIAL STIMULI
              </Label>

              <div data-face-card="true" style={{opacity: Math.max(autoP, facesP)}}>
                <Panel id="face-card" box={L.faceCard} />
                <Label id="prompt-face" box={{x: 475, y: 345, w: 190, h: 26}} size={20} weight={600} align="center" ink={gold}>
                  FACE
                </Label>
                <div
                  {...shapeAttrs('face-mark', {x: 540, y: 375, w: 60, h: 60}, 'mark', 'person')}
                  style={{position: 'absolute', left: 540, top: 375, width: 60, height: 60}}
                >
                  <PersonMark x={30} y={30} group="neutral" emphasis={ms >= cue.t44Faces ? 1 : 0.65} scale={1.0} />
                </div>
                <Label id="face-target-label" box={{x: 475, y: 440, w: 190, h: 22}} size={16} weight={500} align="center" ink={soft}>
                  TARGET GLYPH
                </Label>
              </div>

              <div data-word-card="true" style={{opacity: Math.max(autoP, wordsP)}}>
                <Panel id="word-card" box={L.wordCard} />
                <Label id="prompt-word" box={{x: 715, y: 345, w: 190, h: 26}} size={20} weight={600} align="center" ink={gold}>
                  WORD
                </Label>
                <Panel id="word-chip" box={{x: 725, y: 378, w: 170, h: 50}} accent="color/fill/gold">
                  <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
                </Panel>
                <Label id="word-chip-label" box={{x: 735, y: 391, w: 150, h: 24}} size={18} weight={500} align="center" ink={primary}>
                  STIMULUS
                </Label>
                <Label id="word-category-label" box={{x: 715, y: 440, w: 190, h: 22}} size={16} weight={500} align="center" ink={soft}>
                  VALENCE WORD
                </Label>
              </div>

              <Label id="prompt-trial-sub" box={{x: 460, y: 490, w: 460, h: 26}} size={16} weight={500} align="center" ink={soft}>
                CONGRUENT / INCONGRUENT PAIR
              </Label>
            </div>
          )}

          {ms >= cue.t44ResponseLatency && (
            <div data-timer-trace="true" style={{opacity: latencyP}}>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('timer-line', timerLine)} d="M690 530V668" stroke={raceRed} strokeWidth="3" strokeDasharray="4 4" />
              </svg>
              <Label id="timer-label" box={L.timerTrace} size={20} weight={500} align="center" ink={raceRed}>
                RESPONSE LATENCY
              </Label>
            </div>
          )}

          {ms >= cue.t44Sorting && (
            <div data-response-keys="true" style={{opacity: sortingP}}>
              <Panel id="key-left" box={L.keyLeft} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="key-left-label" box={{x: 210, y: 685, w: 320, h: 34}} size={24} weight={600} align="center" ink={gold}>
                LEFT KEY
              </Label>
              <Label id="key-left-pairing" box={{x: 210, y: 730, w: 320, h: 28}} size={18} weight={500} align="center" ink={soft}>
                PAIRING: FACE A + WORD A
              </Label>

              <Panel id="key-right" box={L.keyRight} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
              </Panel>
              <Label id="key-right-label" box={{x: 850, y: 685, w: 320, h: 34}} size={24} weight={600} align="center" ink={gold}>
                RIGHT KEY
              </Label>
              <Label id="key-right-pairing" box={{x: 850, y: 730, w: 320, h: 28}} size={18} weight={500} align="center" ink={soft}>
                PAIRING: FACE B + WORD B
              </Label>
            </div>
          )}

          {ms >= cue.t44SplitSecond && (
            <div data-latency-instrument="true" style={{opacity: splitP}}>
              <Panel id="latency-instrument" box={L.latencyInstrument} />
              <Label id="latency-heading" box={{x: 1340, y: 250, w: 430, h: 36}} size={22} weight={600} sans ink={gold}>
                LATENCY DIFFERENCE
              </Label>

              {ms >= cue.t44Screen && (
                <Label id="latency-banner" box={{x: 1340, y: 295, w: 430, h: 56}} size={18} weight={500} ink={muted} opacity={screenP}>
                  DERIVED SORTING TASK · LATENCY DIFFERENCE
                </Label>
              )}

              <div
                {...shapeAttrs('bar-fast', {x: 1350, y: 380, w: 220, h: 44}, 'mark', 'bar')}
                style={{position: 'absolute', left: 1350, top: 380, width: 220, height: 44, background: gold, borderRadius: 4}}
              />
              {ms >= cue.t44Fast && (
                <Label id="bar-fast-label" box={{x: 1350, y: 435, w: 300, h: 30}} size={20} weight={600} ink={gold} opacity={fastP}>
                  FASTER RESPONSE
                </Label>
              )}

              <div
                {...shapeAttrs('bar-slow', {x: 1350, y: 505, w: 360, h: 44}, 'mark', 'bar')}
                style={{position: 'absolute', left: 1350, top: 505, width: 360, height: 44, background: muted, borderRadius: 4}}
              />
              {ms >= cue.t44Fast && (
                <Label id="bar-slow-label" box={{x: 1350, y: 560, w: 300, h: 30}} size={20} weight={600} ink={soft} opacity={fastP}>
                  SLOWER RESPONSE
                </Label>
              )}
            </div>
          )}
        </div>
      )}

      {isTurn45 && (
        <div data-turn="45" style={{opacity: rtP}}>
          <div data-reaction-instrument="true" style={{opacity: rtP}}>
            <Panel id="rt-instrument" box={L.reactionInstrument} />
            <Label id="rt-heading" box={{x: 150, y: 285, w: 510, h: 38}} size={26} weight={600} sans ink={gold}>
              REACTION-TIME MEASURE
            </Label>
            <div
              {...shapeAttrs('rt-bar-1', {x: 170, y: 380, w: 200, h: 40}, 'mark', 'rt-bar')}
              style={{position: 'absolute', left: 170, top: 380, width: 200, height: 40, background: gold, borderRadius: 4}}
            />
            <Label id="rt-bar-1-label" box={{x: 170, y: 430, w: 300, h: 28}} size={18} weight={600} ink={gold}>
              FASTER LATENCY
            </Label>

            <div
              {...shapeAttrs('rt-bar-2', {x: 170, y: 490, w: 320, h: 40}, 'mark', 'rt-bar')}
              style={{position: 'absolute', left: 170, top: 490, width: 320, height: 40, background: muted, borderRadius: 4}}
            />
            <Label id="rt-bar-2-label" box={{x: 170, y: 540, w: 300, h: 28}} size={18} weight={600} ink={soft}>
              SLOWER LATENCY
            </Label>

            <Label id="rt-delta-label" box={{x: 170, y: 640, w: 460, h: 32}} size={20} weight={500} align="center" ink={primary}>
              LATENCY DIFFERENCE Δt
            </Label>
          </div>

          {ms >= cue.t45Audits && (
            <div data-field-audit="true" style={{opacity: auditP}}>
              <Panel id="fa-instrument" box={L.fieldAuditInstrument} />
              <Label id="fa-heading" box={{x: 760, y: 285, w: 470, h: 38}} size={26} weight={600} sans ink={gold}>
                FIELD-AUDIT MEASURE
              </Label>

              <Panel id="fa-card-1" box={{x: 765, y: 350, w: 460, h: 84}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="fa-card-1-title" box={{x: 780, y: 362, w: 430, h: 28}} size={20} weight={600} ink={gold}>
                MATCHED CASE PAIR A
              </Label>
              <Label id="fa-card-1-sub" box={{x: 780, y: 395, w: 430, h: 26}} size={18} weight={400} ink={soft}>
                IDENTICAL RESUME · EQUAL QUALIFICATIONS
              </Label>

              <Panel id="fa-card-2" box={{x: 765, y: 454, w: 460, h: 84}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="fa-card-2-title" box={{x: 780, y: 466, w: 430, h: 28}} size={20} weight={600} ink={gold}>
                MATCHED CASE PAIR B
              </Label>
              <Label id="fa-card-2-sub" box={{x: 780, y: 499, w: 430, h: 26}} size={18} weight={400} ink={soft}>
                SYSTEMATIC DIFFERENTIAL OUTCOME
              </Label>

              <Label id="fa-notice" box={{x: 765, y: 575, w: 460, h: 30}} size={18} weight={500} ink={muted} align="center">
                DERIVED AUDIT · NO RESULT VALUES
              </Label>
            </div>
          )}

          {ms >= cue.t45Bias && (
            <div data-judgment-meter="true" style={{opacity: biasP}}>
              <Panel id="judgment-meter" box={L.judgmentMeter} />
              <Label id="meter-bias" box={{x: 1350, y: 285, w: 420, h: 34}} size={26} weight={650} align="center" ink={gold}>
                BIAS
              </Label>
              {ms >= cue.t45Judgment && (
                <Label id="meter-title" box={{x: 1350, y: 325, w: 420, h: 32}} size={20} weight={600} sans align="center" ink={primary} opacity={judgmentP}>
                  INDIVIDUAL JUDGMENT
                </Label>
              )}

              {ms >= cue.t45Mental && (
                <Label id="meter-mental" box={{x: 1350, y: 375, w: 420, h: 30}} size={20} weight={600} align="center" ink={primary} opacity={mentalP}>
                  MENTAL LEAN
                </Label>
              )}

              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path d="M1480 500 A 80 80 0 0 1 1640 500" fill="none" stroke={muted} strokeWidth="3" />
                <path d="M1520 440 L1525 450 M1560 420 L1560 430 M1600 440 L1595 450" stroke={gold} strokeWidth="2" />
                <path
                  {...lineAttrs('meter-needle-line', meterNeedlePoints)}
                  d={`M1560 500 L${meterNeedlePoints[1][0]} ${meterNeedlePoints[1][1]}`}
                  stroke={gold}
                  strokeWidth="4"
                />
              </svg>

              <div
                {...shapeAttrs('meter-pivot', {x: 1550, y: 490, w: 20, h: 20}, 'mark', 'pivot')}
                style={{
                  position: 'absolute',
                  left: 1550,
                  top: 490,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: gold,
                }}
              />

              {ms >= cue.t45Weighting && (
                <Label id="meter-weighting" box={{x: 1350, y: 640, w: 420, h: 32}} size={22} weight={600} align="center" ink={gold} opacity={weightP}>
                  JUDGMENT WEIGHTING
                </Label>
              )}

              {ms >= cue.t45Judgment && (
                <Label id="meter-joined" box={{x: 1350, y: 685, w: 420, h: 26}} size={18} weight={500} align="center" ink={soft} opacity={judgmentP}>
                  JOINED MEASUREMENT READING
                </Label>
              )}
            </div>
          )}

          {ms >= cue.t45Judgment && (
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={judgmentP}>
              <path {...lineAttrs('leader-left', leaderLeft)} d="M405 790V818H1560V790" fill="none" stroke={gold} strokeWidth="2" strokeDasharray="3 3" />
              <path {...lineAttrs('leader-center', leaderCenter)} d="M995 790V818H1560V790" fill="none" stroke={gold} strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          )}
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
