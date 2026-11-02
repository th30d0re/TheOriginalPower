import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  QuestionHeader,
  lineAttrs,
  pathFrom,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const FISKE_HANDOFF_LAYOUT = {
  // Turn 52: Question Header + Fiske Source Socket + Three-Card Flow + Locus Summary Band
  header: {x: 150, y: 105, w: 1360, h: 140},
  fiskeSocket: {x: 1540, y: 120, w: 230, h: 110},

  thoughtCard: {x: 150, y: 310, w: 420, h: 340},
  feelingCard: {x: 750, y: 310, w: 420, h: 340},
  actionCard: {x: 1350, y: 310, w: 420, h: 340},

  locusSummaryPanel: {x: 150, y: 710, w: 1620, h: 165},

  // Turn 53: Banner + Citation Card + Three-Socket Motif
  t53Banner: {x: 330, y: 120, w: 1260, h: 74},
  citationCard: {x: 330, y: 230, w: 1260, h: 336},
  motifSockets: [
    {x: 330, y: 610, w: 390, h: 260},
    {x: 765, y: 610, w: 390, h: 260},
    {x: 1200, y: 610, w: 390, h: 260},
  ] as const satisfies readonly Box[],

  // Source line (clear of bottom notch x 880–1040, y >= 990)
  source: {x: 116, y: 944, w: 750, h: 52},
} as const;

export function FiskeHandoff({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t52Why: useCue('t52Why').at,
    t52Fiske: useCue('t52Fiske').at,
    t52Discrimination: useCue('t52Discrimination').at,
    t52Stereotyping: useCue('t52Stereotyping').at,
    t52Prejudice: useCue('t52Prejudice').at,
    t52Third: useCue('t52Third').at,
    t52Moves: useCue('t52Moves').at,
    t52Action: useCue('t52Action').at,

    t53Susan: useCue('t53Susan').at,
    t53Model: useCue('t53Model').at,
    t53NinetyEight: useCue('t53NinetyEight').at,
    t53Fourth: useCue('t53Fourth').at,
    t53Handbook: useCue('t53Handbook').at,
    t53Volume: useCue('t53Volume').at,
    t53Pages: useCue('t53Pages').at,
  };

  const L = FISKE_HANDOFF_LAYOUT;
  const isTurn53 = ms >= cue.t53Susan;

  // Turn 52 progresses
  const whyP = enter(ms, cue.t52Why);
  const fiskeP = enter(ms, cue.t52Fiske);
  const discriminationP = enter(ms, cue.t52Discrimination);
  const stereotypingP = enter(ms, cue.t52Stereotyping);
  const prejudiceP = enter(ms, cue.t52Prejudice);
  const thirdP = enter(ms, cue.t52Third);
  const movesP = enter(ms, cue.t52Moves);
  const actionP = enter(ms, cue.t52Action);

  // Turn 53 progresses
  const susanP = enter(ms, cue.t53Susan);
  const modelP = enter(ms, cue.t53Model);
  const ninetyEightP = enter(ms, cue.t53NinetyEight);
  const fourthP = enter(ms, cue.t53Fourth);
  const handbookP = enter(ms, cue.t53Handbook);
  const volumeP = enter(ms, cue.t53Volume);
  const pagesP = enter(ms, cue.t53Pages);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  const flowArrow1: Point[] = [[570, 480], [750, 480]];
  const flowArrow2: Point[] = [[1170, 480], [1350, 480]];
  const citeRule: Point[] = [[374, 312], [1550, 312]];

  const t53EditionLine = ms >= cue.t53Pages
    ? 'The Handbook of Social Psychology · 4th ed. · vol. 2 · pp. 357–411'
    : ms >= cue.t53Volume
    ? 'The Handbook of Social Psychology · 4th ed. · vol. 2'
    : ms >= cue.t53Fourth
    ? 'The Handbook of Social Psychology · 4th ed.'
    : 'THREE-COMPONENT TAXONOMY REFERENCE';

  const sourceLineText = !isTurn53
    ? 'The Original Power, Chapter 2 · tripartite taxonomy question'
    : ms >= cue.t53Pages
    ? 'Fiske · The Handbook of Social Psychology · 4th ed. · vol. 2 · pp. 357–411'
    : ms >= cue.t53Volume
    ? 'Fiske · The Handbook of Social Psychology · 4th ed. · vol. 2'
    : ms >= cue.t53Fourth
    ? 'Fiske · The Handbook of Social Psychology · 4th ed.'
    : 'Susan T. Fiske · tripartite taxonomy';

  return (
    <StageSceneFrame segment={segment}>
      {/* TURN 52: Question Header, Source Socket, and Thought -> Feeling -> Action Flow */}
      {!isTurn53 && ms >= cue.t52Why && (
        <div data-turn="52" style={{opacity: whyP}}>
          <QuestionHeader
            id="fiske-question-header"
            box={L.header}
            text="Why does Fiske treat discrimination as its own category beside stereotyping and prejudice?"
            progress={whyP}
            accentTerm="discrimination"
            accent="color/text/accent"
          />

          {/* Small Source Socket beside Question (height 110, text span 78 -> 32 px margin) */}
          {ms >= cue.t52Fiske && (
            <div data-fiske-socket="true" style={{opacity: fiskeP}}>
              <Panel id="fiske-socket" box={L.fiskeSocket} accent="color/fill/gold" style={{borderStyle: 'dashed'}} />
              <Label id="fiske-socket-top" box={{x: 1554, y: 136, w: 202, h: 28}} size={20} weight={500} align="center" ink={gold}>
                SOURCE SOCKET
              </Label>
              <Label id="fiske-socket-bottom" box={{x: 1554, y: 184, w: 202, h: 30}} size={22} weight={650} align="center" ink={primary}>
                FISKE · 3-PART
              </Label>
            </div>
          )}

          {/* Card 1: Internal Thought (height 340, text span 304 -> 36 px margin) */}
          {ms >= cue.t52Stereotyping && (
            <div data-thought-card="true" style={{opacity: stereotypingP}}>
              <Panel id="thought-card" box={L.thoughtCard} accent="color/line/hairline-strong">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: primary}} />
              </Panel>
              <div
                {...shapeAttrs('thought-glyph', {x: 170, y: 328, w: 48, h: 48}, 'mark', 'thought-glyph')}
                style={{position: 'absolute', left: 170, top: 328, width: 48, height: 48, color: primary}}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                  {[0, 1, 2].flatMap(row =>
                    [0, 1, 2].map(col => (
                      <rect
                        key={`${row}${col}`}
                        x={7 + col * 13}
                        y={7 + row * 13}
                        width="9"
                        height="9"
                        rx="1.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                    )),
                  )}
                </svg>
              </div>
              <Label id="thought-title" box={{x: 230, y: 328, w: 320, h: 72}} size={28} weight={650} lh={1.2} sans ink={primary}>
                STEREOTYPING · INTERNAL THOUGHT
              </Label>
              <Label id="thought-body" box={{x: 174, y: 422, w: 372, h: 120}} size={28} weight={400} lh={1.32} sans ink={soft}>
                Cognitive category belief held inside the observer.
              </Label>
              <Label id="thought-footer" box={{x: 174, y: 600, w: 372, h: 32}} size={20} weight={600} ink={gold}>
                1 · COGNITIVE COMPONENT
              </Label>
            </div>
          )}

          {/* Card 2: Internal Feeling (height 340, text span 304 -> 36 px margin) */}
          {ms >= cue.t52Prejudice && (
            <div data-feeling-card="true" style={{opacity: prejudiceP}}>
              <Panel id="feeling-card" box={L.feelingCard} accent="color/marker/race">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: raceRed}} />
              </Panel>
              <div
                {...shapeAttrs('feeling-glyph', {x: 770, y: 328, w: 48, h: 48}, 'mark', 'feeling-glyph')}
                style={{position: 'absolute', left: 770, top: 328, width: 48, height: 48, color: raceRed}}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z"
                    fill={raceRed}
                    fillOpacity="0.28"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <Label id="feeling-title" box={{x: 830, y: 328, w: 320, h: 72}} size={28} weight={650} lh={1.2} sans ink={raceRed}>
                PREJUDICE · INTERNAL FEELING
              </Label>
              <Label id="feeling-body" box={{x: 774, y: 422, w: 372, h: 120}} size={28} weight={400} lh={1.32} sans ink={soft}>
                Affective antipathy felt inside the individual.
              </Label>
              <Label id="feeling-footer" box={{x: 774, y: 600, w: 372, h: 32}} size={20} weight={600} ink={raceRed}>
                2 · AFFECTIVE COMPONENT
              </Label>
            </div>
          )}

          {/* Flow Arrows from Thought and Feeling toward Action */}
          {ms >= cue.t52Moves && (
            <svg
              data-thought-feeling-flow="true"
              width="1920"
              height="1080"
              viewBox="0 0 1920 1080"
              style={{position: 'absolute', inset: 0}}
              aria-hidden="true"
              opacity={movesP}
            >
              <path {...lineAttrs('flow-arrow-1', flowArrow1)} d={pathFrom(flowArrow1)} fill="none" stroke={gold} strokeWidth="4" strokeDasharray="6 4" />
              <path {...lineAttrs('flow-arrow-2', flowArrow2)} d={pathFrom(flowArrow2)} fill="none" stroke={orange} strokeWidth="4" />
            </svg>
          )}

          {/* Card 3: Observable Outward Action (height 340, text span 304 -> 36 px margin) */}
          {ms >= cue.t52Discrimination && (
            <div data-discrimination-card="true" style={{opacity: discriminationP}}>
              <Panel
                id="action-card"
                box={L.actionCard}
                accent="color/text/accent"
                style={{borderWidth: ms >= cue.t52Third ? 2 : 1}}
              >
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: orange}} />
              </Panel>
              <div
                {...shapeAttrs('action-glyph', {x: 1370, y: 328, w: 48, h: 48}, 'mark', 'action-glyph')}
                style={{position: 'absolute', left: 1370, top: 328, width: 48, height: 48, color: orange}}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M7 24 H38 M28 13 L39 24 L28 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={ms >= cue.t52Action ? 3.5 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Label
                id="action-title"
                box={{x: 1430, y: 328, w: 320, h: 72}}
                size={28}
                weight={650}
                lh={1.2}
                sans
                ink={orange}
                opacity={ms >= cue.t52Third ? thirdP : 1}
              >
                {ms >= cue.t52Third ? '3 · DISCRIMINATION' : 'DISCRIMINATION'}
              </Label>
              <Label id="action-body" box={{x: 1374, y: 422, w: 372, h: 120}} size={28} weight={400} lh={1.32} sans ink={primary}>
                Differential treatment directed outward toward group members.
              </Label>
              <Label
                id="action-footer"
                box={{x: 1374, y: 600, w: 372, h: 32}}
                size={20}
                weight={650}
                ink={ms >= cue.t52Action ? orange : soft}
                opacity={ms >= cue.t52Action ? actionP : 1}
              >
                {ms >= cue.t52Action ? 'OBSERVABLE OUTWARD ACTION' : 'BEHAVIORAL CATEGORY'}
              </Label>
            </div>
          )}

          {/* Lower Locus Summary Band (height 165, text span 129 -> 36 px margin) */}
          <Panel id="locus-summary-panel" box={L.locusSummaryPanel} accent="color/line/hairline" />
          <Label id="locus-summary-title" box={{x: 180, y: 728, w: 1560, h: 38}} size={28} weight={600} sans ink={primary}>
            {ms >= cue.t52Moves
              ? 'MOVEMENT ACROSS THE BOUNDARY · INTERNAL STATES TO OUTWARD CONDUCT'
              : 'CATEGORY BOUNDARY · INTERNAL ORIENTATION TO EXTERNAL CONDUCT'}
          </Label>
          <Label id="locus-summary-left" box={{x: 180, y: 825, w: 760, h: 32}} size={20} weight={500} ink={soft}>
            INTERNAL LOCUS: THOUGHT + FEELING
          </Label>
          <Label id="locus-summary-right" box={{x: 980, y: 825, w: 760, h: 32}} size={20} weight={600} align="right" ink={orange}>
            OUTWARD LOCUS: OBSERVABLE TREATMENT
          </Label>
        </div>
      )}

      {/* TURN 53: Fiske 1998 Citation Card + Three-Socket Motif */}
      {isTurn53 && (
        <div data-turn="53" style={{opacity: susanP}}>
          {/* Top Section Banner (height 74, text span 38 -> 36 px margin) */}
          <Panel id="t53-banner" box={L.t53Banner} accent="color/fill/gold" />
          <Label id="t53-banner-title" box={{x: 360, y: 138, w: 1200, h: 38}} size={28} weight={650} sans align="center" ink={gold}>
            ESTABLISHED TAXONOMY SOURCE · SOCIAL PSYCHOLOGY LITERATURE
          </Label>

          {/* Citation Card (built to final size 1260×336 from t53Susan, text span 300 -> 36 px margin) */}
          <Panel id="citation-card" box={L.citationCard} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: gold}} />
          </Panel>
          <Label id="cite-author" box={{x: 374, y: 248, w: 820, h: 46}} size={36} weight={650} sans ink={primary}>
            SUSAN T. FISKE
          </Label>
          <Label
            id="cite-year"
            box={{x: 1340, y: 248, w: 210, h: 46}}
            size={32}
            weight={700}
            align="right"
            ink={ms >= cue.t53NinetyEight ? gold : muted}
            opacity={ms >= cue.t53NinetyEight ? ninetyEightP : 1}
          >
            {ms >= cue.t53NinetyEight ? '1998' : 'YEAR'}
          </Label>

          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('cite-rule', citeRule)} d={pathFrom(citeRule)} fill="none" stroke={gold} strokeWidth="2" />
          </svg>

          <Label
            id="cite-title"
            box={{x: 374, y: 332, w: 1176, h: 52}}
            size={34}
            weight={500}
            sans
            ink={primary}
            style={{fontStyle: 'italic'}}
            opacity={ms >= cue.t53Handbook ? handbookP : 0.85}
          >
            {ms >= cue.t53Handbook ? 'Stereotyping, Prejudice, and Discrimination' : 'Tripartite Model Chapter'}
          </Label>

          <Label id="cite-summary" box={{x: 374, y: 412, w: 1176, h: 74}} size={28} weight={400} sans ink={soft}>
            Separates cognitive stereotyping, affective prejudice, and behavioral discrimination.
          </Label>

          <Label
            id="cite-edition"
            box={{x: 374, y: 516, w: 1176, h: 32}}
            size={20}
            weight={600}
            ink={ms >= cue.t53Pages ? gold : soft}
            opacity={ms >= cue.t53Fourth ? Math.max(fourthP, volumeP, pagesP) : 1}
          >
            {t53EditionLine}
          </Label>

          {/* Three-Socket Motif beneath Citation Card (each 390×260, text span 224 -> 36 px margin) */}
          <div data-three-socket-motif={ms >= cue.t53Model ? 'true' : undefined} style={{opacity: ms >= cue.t53Model ? modelP : 0.75}}>
            {/* Socket 1 */}
            <Panel
              id="motif-socket-1"
              box={L.motifSockets[0]}
              accent={ms >= cue.t53Model ? 'color/line/hairline-strong' : 'color/line/hairline'}
              style={{borderStyle: ms >= cue.t53Model ? 'solid' : 'dashed'}}
            />
            <Label id="motif-socket-1-top" box={{x: 354, y: 628, w: 342, h: 32}} size={20} weight={600} align="center" ink={gold}>
              SOCKET 1 · COGNITIVE
            </Label>
            <div
              {...shapeAttrs('motif-glyph-1', {x: 499, y: 672, w: 52, h: 52}, 'mark', 'motif-1')}
              style={{position: 'absolute', left: 499, top: 672, width: 52, height: 52, color: primary}}
            >
              <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
                {[0, 1, 2].flatMap(row =>
                  [0, 1, 2].map(col => (
                    <rect key={`${row}${col}`} x={7 + col * 13} y={7 + row * 13} width="9" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  )),
                )}
              </svg>
            </div>
            <Label id="motif-socket-1-body" box={{x: 354, y: 738, w: 342, h: 72}} size={28} weight={500} sans align="center" ink={primary}>
              Internal belief schema
            </Label>
            <Label id="motif-socket-1-bottom" box={{x: 354, y: 822, w: 342, h: 30}} size={20} weight={500} align="center" ink={muted}>
              PART 1 OF 3
            </Label>

            {/* Socket 2 */}
            <Panel
              id="motif-socket-2"
              box={L.motifSockets[1]}
              accent={ms >= cue.t53Model ? 'color/marker/race' : 'color/line/hairline'}
              style={{borderStyle: ms >= cue.t53Model ? 'solid' : 'dashed'}}
            />
            <Label id="motif-socket-2-top" box={{x: 789, y: 628, w: 342, h: 32}} size={20} weight={600} align="center" ink={raceRed}>
              SOCKET 2 · AFFECTIVE
            </Label>
            <div
              {...shapeAttrs('motif-glyph-2', {x: 934, y: 672, w: 52, h: 52}, 'mark', 'motif-2')}
              style={{position: 'absolute', left: 934, top: 672, width: 52, height: 52, color: raceRed}}
            >
              <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <Label id="motif-socket-2-body" box={{x: 789, y: 738, w: 342, h: 72}} size={28} weight={500} sans align="center" ink={primary}>
              Internal hostility state
            </Label>
            <Label id="motif-socket-2-bottom" box={{x: 789, y: 822, w: 342, h: 30}} size={20} weight={500} align="center" ink={muted}>
              PART 2 OF 3
            </Label>

            {/* Socket 3 */}
            <Panel
              id="motif-socket-3"
              box={L.motifSockets[2]}
              accent={ms >= cue.t53Model ? 'color/text/accent' : 'color/line/hairline'}
              style={{borderStyle: ms >= cue.t53Model ? 'solid' : 'dashed'}}
            />
            <Label id="motif-socket-3-top" box={{x: 1224, y: 628, w: 342, h: 32}} size={20} weight={600} align="center" ink={orange}>
              SOCKET 3 · BEHAVIORAL
            </Label>
            <div
              {...shapeAttrs('motif-glyph-3', {x: 1369, y: 672, w: 52, h: 52}, 'mark', 'motif-3')}
              style={{position: 'absolute', left: 1369, top: 672, width: 52, height: 52, color: orange}}
            >
              <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M7 24 H38 M28 13 L39 24 L28 35" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <Label id="motif-socket-3-body" box={{x: 1224, y: 738, w: 342, h: 72}} size={28} weight={500} sans align="center" ink={primary}>
              Outward treatment action
            </Label>
            <Label id="motif-socket-3-bottom" box={{x: 1224, y: 822, w: 342, h: 30}} size={20} weight={500} align="center" ink={muted}>
              PART 3 OF 3
            </Label>
          </div>
        </div>
      )}

      {/* Source Line */}
      {ms >= cue.t52Why && (
        <Label id="source-line" box={L.source} size={20} weight={400} ink={muted}>
          {sourceLineText}
        </Label>
      )}
    </StageSceneFrame>
  );
}
