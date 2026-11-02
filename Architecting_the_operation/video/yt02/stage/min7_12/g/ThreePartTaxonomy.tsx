import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  lineAttrs,
  partialPolyline,
  pathFrom,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const THREE_PART_TAXONOMY_LAYOUT = {
  taxonomyFrame: {x: 120, y: 130, w: 1680, h: 660},
  modules: [
    {x: 160, y: 234, w: 500, h: 484},
    {x: 710, y: 234, w: 500, h: 484},
    {x: 1260, y: 234, w: 500, h: 484},
  ] as const satisfies readonly Box[],
  bracketBox: {x: 350, y: 806, w: 1220, h: 80},
  source: {x: 116, y: 944, w: 750, h: 52},
} as const;

export function ThreePartTaxonomy({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t54Divides: useCue('t54Divides').at,
    t54Three: useCue('t54Three').at,
    t54Stereotyping: useCue('t54Stereotyping').at,
    t54Cognitive: useCue('t54Cognitive').at,
    t54Thinking: useCue('t54Thinking').at,
    t54Prejudice: useCue('t54Prejudice').at,
    t54Affective: useCue('t54Affective').at,
    t54Feeling: useCue('t54Feeling').at,
    t54Discrimination: useCue('t54Discrimination').at,
    t54Behavioral: useCue('t54Behavioral').at,
    t54Acting: useCue('t54Acting').at,
  };

  const L = THREE_PART_TAXONOMY_LAYOUT;

  const dividesP = enter(ms, cue.t54Divides);
  const threeP = enter(ms, cue.t54Three);
  const stereotypingP = enter(ms, cue.t54Stereotyping);
  const cognitiveP = enter(ms, cue.t54Cognitive);
  const thinkingP = enter(ms, cue.t54Thinking);
  const prejudiceP = enter(ms, cue.t54Prejudice);
  const affectiveP = enter(ms, cue.t54Affective);
  const feelingP = enter(ms, cue.t54Feeling);
  const discriminationP = enter(ms, cue.t54Discrimination);
  const behavioralP = enter(ms, cue.t54Behavioral);
  const actingP = enter(ms, cue.t54Acting);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  const bracketFull: Point[] = [
    [L.bracketBox.x, L.bracketBox.y],
    [L.bracketBox.x, L.bracketBox.y + 26],
    [L.bracketBox.x + L.bracketBox.w, L.bracketBox.y + 26],
    [L.bracketBox.x + L.bracketBox.w, L.bracketBox.y],
  ];
  const bracketDrawn = partialPolyline(bracketFull, threeP);

  return (
    <StageSceneFrame segment={segment}>
      {ms >= cue.t54Divides && (
        <div data-taxonomy-scene="true" style={{opacity: dividesP}}>
          {/* Outer Taxonomy Frame (height 660, text span 624 -> 36 px margin) */}
          <Panel id="taxonomy-frame" box={L.taxonomyFrame} accent="color/line/hairline" />
          <Label id="taxonomy-heading" box={{x: 160, y: 148, w: 920, h: 42}} size={32} weight={650} sans ink={gold}>
            FISKE’S THREE-PART MODEL
          </Label>
          <Label id="taxonomy-citation" box={{x: 1360, y: 152, w: 400, h: 34}} size={24} weight={600} align="right" ink={soft}>
            Fiske 1998
          </Label>
          <Label id="taxonomy-footer" box={{x: 160, y: 744, w: 1600, h: 28}} size={20} weight={500} align="center" ink={muted}>
            SOCIAL PSYCHOLOGY TAXONOMY · THREE COMPONENT SLOTS
          </Label>

          {/* MODULE 1: Stereotyping (x: 160–660, y: 240–724, h: 484, text span 448 -> 36 px margin) */}
          {ms < cue.t54Stereotyping ? (
            <div data-module-socket="1">
              <Panel id="module-socket-1" box={L.modules[0]} accent="color/line/hairline-strong" style={{borderStyle: 'dashed'}} />
              <Label id="socket-1-title" box={{x: 184, y: 258, w: 452, h: 38}} size={28} weight={600} sans ink={soft}>
                MODULE SOCKET 1
              </Label>
              <div
                {...shapeAttrs('socket-1-mark', {x: 184, y: 318, w: 452, h: 180}, 'mark', 'socket-1-mark')}
                style={{
                  position: 'absolute',
                  left: 184,
                  top: 318,
                  width: 452,
                  height: 180,
                  border: `1px dashed ${color('color/line/hairline')}`,
                  borderRadius: 10,
                }}
              />
              <Label id="socket-1-body" box={{x: 184, y: 520, w: 452, h: 120}} size={28} weight={400} lh={1.32} sans ink={muted}>
                First psychological component slot in Fiske’s taxonomy.
              </Label>
              <Label id="socket-1-footer" box={{x: 184, y: 676, w: 452, h: 30}} size={20} weight={500} ink={muted}>
                SLOT 1 OF 3 · FISKE 1998
              </Label>
            </div>
          ) : (
            <div data-module="stereotyping" style={{opacity: stereotypingP}}>
              <Panel id="stereotyping-module" box={L.modules[0]} accent="color/text/primary">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: primary}} />
              </Panel>
              <div
                {...shapeAttrs('stereotyping-glyph', {x: 184, y: 258, w: 52, h: 52}, 'mark', 'stereotyping-glyph')}
                style={{position: 'absolute', left: 184, top: 258, width: 52, height: 52, color: primary}}
              >
                <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
                  {[0, 1, 2].flatMap(row =>
                    [0, 1, 2].map(col => (
                      <rect
                        key={`${row}${col}`}
                        x={7 + col * 13}
                        y={7 + row * 13}
                        width="9"
                        height="9"
                        rx="1.5"
                        fill={ms >= cue.t54Cognitive ? gold : 'none'}
                        fillOpacity={ms >= cue.t54Cognitive ? 0.35 : 0}
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                    )),
                  )}
                </svg>
              </div>
              <Label id="stereotyping-title" box={{x: 252, y: 258, w: 384, h: 44}} size={32} weight={650} sans ink={primary}>
                STEREOTYPING
              </Label>
              <Label
                id="stereotyping-cognitive"
                box={{x: 184, y: 326, w: 452, h: 34}}
                size={24}
                weight={650}
                ink={ms >= cue.t54Cognitive ? gold : soft}
                opacity={ms >= cue.t54Cognitive ? cognitiveP : 1}
              >
                {ms >= cue.t54Cognitive ? 'COGNITIVE' : 'CATEGORY SCHEMA'}
              </Label>
              <Label
                id="stereotyping-thinking"
                box={{x: 184, y: 368, w: 452, h: 34}}
                size={22}
                weight={600}
                ink={ms >= cue.t54Thinking ? primary : muted}
                opacity={ms >= cue.t54Thinking ? thinkingP : 1}
              >
                {ms >= cue.t54Thinking ? 'THINKING PART' : 'BELIEF DIMENSION'}
              </Label>
              <div
                {...shapeAttrs('stereotyping-diagram', {x: 184, y: 412, w: 452, h: 122}, 'mark', 'stereotyping-diagram')}
                style={{
                  position: 'absolute',
                  left: 184,
                  top: 412,
                  width: 452,
                  height: 122,
                  border: `1px solid ${color('color/line/hairline')}`,
                  borderRadius: 10,
                }}
              >
                <svg width="452" height="122" viewBox="0 0 452 122" aria-hidden="true">
                  {[0, 1, 2].map(col => (
                    <rect
                      key={col}
                      x={46 + col * 130}
                      y={24}
                      width="100"
                      height="74"
                      rx="8"
                      fill="none"
                      stroke={gold}
                      strokeWidth="2"
                    />
                  ))}
                  <line x1="146" y1="61" x2="176" y2="61" stroke={muted} strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="276" y1="61" x2="306" y2="61" stroke={muted} strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
              <Label id="stereotyping-body" box={{x: 184, y: 546, w: 452, h: 118}} size={28} weight={400} lh={1.32} sans ink={primary}>
                Beliefs and expectations applied across a social group.
              </Label>
              <Label id="stereotyping-footer" box={{x: 184, y: 676, w: 452, h: 30}} size={20} weight={500} ink={muted}>
                1 · INTERNAL BELIEF STRUCTURE
              </Label>
            </div>
          )}

          {/* MODULE 2: Prejudice (x: 710–1210, y: 234–718, h: 484, text span 448 -> 36 px margin) */}
          {ms < cue.t54Prejudice ? (
            <div data-module-socket="2">
              <Panel id="module-socket-2" box={L.modules[1]} accent="color/line/hairline-strong" style={{borderStyle: 'dashed'}} />
              <Label id="socket-2-title" box={{x: 734, y: 258, w: 452, h: 38}} size={28} weight={600} sans ink={soft}>
                MODULE SOCKET 2
              </Label>
              <div
                {...shapeAttrs('socket-2-mark', {x: 734, y: 318, w: 452, h: 180}, 'mark', 'socket-2-mark')}
                style={{
                  position: 'absolute',
                  left: 734,
                  top: 318,
                  width: 452,
                  height: 180,
                  border: `1px dashed ${color('color/line/hairline')}`,
                  borderRadius: 10,
                }}
              />
              <Label id="socket-2-body" box={{x: 734, y: 520, w: 452, h: 120}} size={28} weight={400} lh={1.32} sans ink={muted}>
                Second psychological component slot in Fiske’s taxonomy.
              </Label>
              <Label id="socket-2-footer" box={{x: 734, y: 676, w: 452, h: 30}} size={20} weight={500} ink={muted}>
                SLOT 2 OF 3 · FISKE 1998
              </Label>
            </div>
          ) : (
            <div data-module="prejudice" style={{opacity: prejudiceP}}>
              <Panel id="prejudice-module" box={L.modules[1]} accent="color/marker/race">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: raceRed}} />
              </Panel>
              <div
                {...shapeAttrs('prejudice-glyph', {x: 734, y: 258, w: 52, h: 52}, 'mark', 'prejudice-glyph')}
                style={{position: 'absolute', left: 734, top: 258, width: 52, height: 52, color: raceRed}}
              >
                <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z"
                    fill={raceRed}
                    fillOpacity="0.3"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <Label id="prejudice-title" box={{x: 802, y: 258, w: 384, h: 44}} size={32} weight={650} sans ink={raceRed}>
                PREJUDICE
              </Label>
              <Label
                id="prejudice-affective"
                box={{x: 734, y: 326, w: 452, h: 34}}
                size={24}
                weight={650}
                ink={ms >= cue.t54Affective ? raceRed : soft}
                opacity={ms >= cue.t54Affective ? affectiveP : 1}
              >
                {ms >= cue.t54Affective ? 'AFFECTIVE' : 'EMOTIONAL VALENCE'}
              </Label>
              <Label
                id="prejudice-feeling"
                box={{x: 734, y: 368, w: 452, h: 34}}
                size={22}
                weight={600}
                ink={ms >= cue.t54Feeling ? primary : muted}
                opacity={ms >= cue.t54Feeling ? feelingP : 1}
              >
                {ms >= cue.t54Feeling ? 'FEELING PART' : 'HOSTILITY DIMENSION'}
              </Label>
              <div
                {...shapeAttrs('prejudice-diagram', {x: 734, y: 412, w: 452, h: 122}, 'mark', 'prejudice-diagram')}
                style={{
                  position: 'absolute',
                  left: 734,
                  top: 412,
                  width: 452,
                  height: 122,
                  border: `1px solid ${raceRed}`,
                  borderRadius: 10,
                  background: color('color/fill/red-wash'),
                }}
              >
                <svg width="452" height="122" viewBox="0 0 452 122" aria-hidden="true">
                  <circle cx="226" cy="61" r="42" fill="none" stroke={raceRed} strokeWidth="2.5" strokeDasharray="6 4" />
                  <circle cx="226" cy="61" r="22" fill={raceRed} fillOpacity="0.4" />
                </svg>
              </div>
              <Label id="prejudice-body" box={{x: 734, y: 546, w: 452, h: 118}} size={28} weight={400} lh={1.32} sans ink={primary}>
                Emotional antipathy and hostility directed at the group.
              </Label>
              <Label id="prejudice-footer" box={{x: 734, y: 676, w: 452, h: 30}} size={20} weight={500} ink={muted}>
                2 · INTERNAL HOSTILITY STATE
              </Label>
            </div>
          )}

          {/* MODULE 3: Discrimination (x: 1260–1760, y: 234–718, h: 484, text span 448 -> 36 px margin) */}
          {ms < cue.t54Discrimination ? (
            <div data-module-socket="3">
              <Panel id="module-socket-3" box={L.modules[2]} accent="color/line/hairline-strong" style={{borderStyle: 'dashed'}} />
              <Label id="socket-3-title" box={{x: 1284, y: 258, w: 452, h: 38}} size={28} weight={600} sans ink={soft}>
                MODULE SOCKET 3
              </Label>
              <div
                {...shapeAttrs('socket-3-mark', {x: 1284, y: 318, w: 452, h: 180}, 'mark', 'socket-3-mark')}
                style={{
                  position: 'absolute',
                  left: 1284,
                  top: 318,
                  width: 452,
                  height: 180,
                  border: `1px dashed ${color('color/line/hairline')}`,
                  borderRadius: 10,
                }}
              />
              <Label id="socket-3-body" box={{x: 1284, y: 520, w: 452, h: 120}} size={28} weight={400} lh={1.32} sans ink={muted}>
                Third psychological component slot in Fiske’s taxonomy.
              </Label>
              <Label id="socket-3-footer" box={{x: 1284, y: 676, w: 452, h: 30}} size={20} weight={500} ink={muted}>
                SLOT 3 OF 3 · FISKE 1998
              </Label>
            </div>
          ) : (
            <div data-module="discrimination" style={{opacity: discriminationP}}>
              <Panel id="discrimination-module" box={L.modules[2]} accent="color/text/accent">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: orange}} />
              </Panel>
              <div
                {...shapeAttrs('discrimination-glyph', {x: 1284, y: 258, w: 52, h: 52}, 'mark', 'discrimination-glyph')}
                style={{position: 'absolute', left: 1284, top: 258, width: 52, height: 52, color: orange}}
              >
                <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M7 24 H38 M28 13 L39 24 L28 35" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Label id="discrimination-title" box={{x: 1352, y: 258, w: 384, h: 44}} size={32} weight={650} sans ink={orange}>
                DISCRIMINATION
              </Label>
              <Label
                id="discrimination-behavioral"
                box={{x: 1284, y: 326, w: 452, h: 34}}
                size={24}
                weight={650}
                ink={ms >= cue.t54Behavioral ? orange : soft}
                opacity={ms >= cue.t54Behavioral ? behavioralP : 1}
              >
                {ms >= cue.t54Behavioral ? 'BEHAVIORAL' : 'OUTWARD CONDUCT'}
              </Label>
              <Label
                id="discrimination-acting"
                box={{x: 1284, y: 368, w: 452, h: 34}}
                size={22}
                weight={600}
                ink={ms >= cue.t54Acting ? primary : muted}
                opacity={ms >= cue.t54Acting ? actingP : 1}
              >
                {ms >= cue.t54Acting ? 'ACTING PART' : 'TREATMENT DIMENSION'}
              </Label>
              <div
                {...shapeAttrs('discrimination-diagram', {x: 1284, y: 412, w: 452, h: 122}, 'mark', 'discrimination-diagram')}
                style={{
                  position: 'absolute',
                  left: 1284,
                  top: 412,
                  width: 452,
                  height: 122,
                  border: `1px solid ${orange}`,
                  borderRadius: 10,
                }}
              >
                <svg width="452" height="122" viewBox="0 0 452 122" aria-hidden="true">
                  <line x1="70" y1="61" x2="360" y2="61" stroke={orange} strokeWidth="4" strokeLinecap="round" />
                  <path d="M336 41 L368 61 L336 81" fill="none" stroke={orange} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="226" y1="22" x2="226" y2="100" stroke={gold} strokeWidth="2.5" strokeDasharray="6 4" />
                </svg>
              </div>
              <Label id="discrimination-body" box={{x: 1284, y: 546, w: 452, h: 118}} size={28} weight={400} lh={1.32} sans ink={primary}>
                Observable unequal treatment toward group members.
              </Label>
              <Label id="discrimination-footer" box={{x: 1284, y: 676, w: 452, h: 30}} size={20} weight={500} ink={muted}>
                3 · OUTWARD ACTION CHANNEL
              </Label>
            </div>
          )}

          {/* Distinct-Parts Bracket below Taxonomy Frame */}
          {ms >= cue.t54Three && (
            <div data-taxonomy-bracket="true" style={{opacity: threeP}}>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                {bracketDrawn.length >= 2 && (
                  <path
                    {...lineAttrs('taxonomy-bracket-line', bracketDrawn)}
                    d={pathFrom(bracketDrawn)}
                    fill="none"
                    stroke={gold}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
              <Label
                id="taxonomy-bracket-label"
                box={{x: 350, y: 846, w: 1220, h: 38}}
                size={24}
                weight={650}
                align="center"
                ink={ms >= cue.t54Acting ? gold : soft}
                opacity={ms >= cue.t54Acting ? actingP : 1}
              >
                {ms >= cue.t54Acting ? 'THREE DISTINCT PSYCHOLOGICAL PARTS' : 'TRIPARTITE TAXONOMY STRUCTURE'}
              </Label>
            </div>
          )}
        </div>
      )}

      {/* Source Line */}
      {ms >= cue.t54Divides && (
        <Label id="source-line" box={L.source} size={20} weight={400} ink={muted}>
          Fiske 1998 · The Handbook of Social Psychology, 4th ed., vol. 2, pp. 357–411
        </Label>
      )}
    </StageSceneFrame>
  );
}
