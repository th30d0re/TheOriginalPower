import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  TermTriad,
  clamp01,
  lineAttrs,
  shapeAttrs,
  textAttrs,
  type Box,
  type Point,
  type TriadTerm,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));
const pulseAmount = (ms: number, at: number) => Math.max(0, 1 - Math.abs(ms - (at + 200)) / 300);

export const LITERATURE_BOUNDARY_LAYOUT = {
  literatureField: {x: 120, y: 170, w: 1140, h: 560},
  fieldHeading: {x: 160, y: 200, w: 900, h: 44},
  blocks: [
    {x: 160, y: 270, w: 340, h: 230},
    {x: 520, y: 270, w: 340, h: 230},
    {x: 880, y: 270, w: 340, h: 230},
  ] as const satisfies readonly Box[],
  bracket: {x: 200, y: 535, w: 980, h: 65},
  standardDefinitions: {x: 450, y: 645, w: 480, h: 36},

  terminalColumn: {x: 1300, y: 170, w: 60, h: 560},
  terminalLeftLine: [[1300, 170], [1300, 730]] as const satisfies readonly Point[],
  terminalRightLine: [[1360, 170], [1360, 730]] as const satisfies readonly Point[],
  terminalLabelBox: {x: 1305, y: 200, w: 50, h: 500},

  turn63Field: {x: 1400, y: 170, w: 420, h: 560},
  turn63Label: {x: 1420, y: 196, w: 380, h: 64},
  turn63Socket: {x: 1420, y: 280, w: 380, h: 420},

  source: {x: 116, y: 964, w: 740, h: 26},
} as const;

export function LiteratureBoundary({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t62Established: useCue('t62Established').at,
    t62Literature: useCue('t62Literature').at,
    t62Ends: useCue('t62Ends').at,
    t62Bias: useCue('t62Bias').at,
    t62Prejudice: useCue('t62Prejudice').at,
    t62Discrimination: useCue('t62Discrimination').at,
    t62PersonToPerson: useCue('t62PersonToPerson').at,
    t62Standard: useCue('t62Standard').at,
    t62Experimental: useCue('t62Experimental').at,
    t62Psychology: useCue('t62Psychology').at,
  };

  const L = LITERATURE_BOUNDARY_LAYOUT;

  const establishedP = enter(ms, cue.t62Established);
  const literatureP = enter(ms, cue.t62Literature);
  const endsP = enter(ms, cue.t62Ends, 600);
  const personP = enter(ms, cue.t62PersonToPerson);
  const standardP = enter(ms, cue.t62Standard);
  const experimentalP = enter(ms, cue.t62Experimental);
  const psychologyP = enter(ms, cue.t62Psychology);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const muted = color('color/text/muted');

  const terms: readonly TriadTerm[] = [
    {kind: 'bias', title: 'BIAS · GREENWALD & BANAJI 1995'},
    {kind: 'prejudice', title: 'PREJUDICE · ALLPORT 1954'},
    {kind: 'discrimination', title: 'DISCRIMINATION · FISKE 1998'},
  ];

  const states = [
    ms >= cue.t62Literature ? literatureP : 0,
    ms >= cue.t62Literature ? literatureP : 0,
    ms >= cue.t62Literature ? literatureP : 0,
  ];

  const pulses = [
    pulseAmount(ms, cue.t62Bias),
    pulseAmount(ms, cue.t62Prejudice),
    pulseAmount(ms, cue.t62Discrimination),
  ];

  const fieldEmphasis = ms >= cue.t62Experimental ? 1 : 0.78;

  return (
    <StageSceneFrame segment={segment}>
      {/* Established Literature Field */}
      {ms >= cue.t62Established && (
        <div data-field="established-literature" style={{opacity: establishedP}}>
          <Panel
            id="established-literature-frame"
            box={L.literatureField}
            accent={ms >= cue.t62Experimental ? 'color/line/hairline-strong' : 'color/line/hairline'}
            style={{opacity: fieldEmphasis}}
          />

          <Label
            id="established-psychology-heading"
            box={L.fieldHeading}
            size={32}
            weight={650}
            sans
            ink={primary}
          >
            ESTABLISHED EXPERIMENTAL PSYCHOLOGY
          </Label>

          {/* Three Compact Term Blocks */}
          <TermTriad
            id="literature-boundary-triad"
            boxes={L.blocks}
            terms={terms}
            states={states}
            layout="stack"
            pulses={pulses}
            socketProgress={ms >= cue.t62Established && ms < cue.t62Literature ? 1 : 0}
            bracketBox={L.bracket}
            progress={personP}
            bracketLabel={ms >= cue.t62PersonToPerson ? 'PERSON-TO-PERSON OPERATIONS' : undefined}
          />

          {/* Standard Definitions */}
          {ms >= cue.t62Standard && (
            <Label
              id="standard-definitions-label"
              box={L.standardDefinitions}
              size={24}
              weight={600}
              ink={primary}
              opacity={standardP}
              align="center"
            >
              STANDARD DEFINITIONS
            </Label>
          )}
        </div>
      )}

      {/* Terminal Boundary Column */}
      {ms >= cue.t62Ends && (
        <div data-terminal-boundary="true" style={{opacity: endsP}}>
          <Panel
            id="terminal-boundary-column"
            box={L.terminalColumn}
            accent="color/marker/race"
            style={{background: color('color/fill/panel-wash'), borderWidth: 1}}
          />
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
            <path
              {...lineAttrs('terminal-boundary-line-left', L.terminalLeftLine)}
              d="M1300 170 L1300 730"
              fill="none"
              stroke={raceRed}
              strokeWidth="2"
            />
            <path
              {...lineAttrs('terminal-boundary-line-right', L.terminalRightLine)}
              d="M1360 170 L1360 730"
              fill="none"
              stroke={raceRed}
              strokeWidth="2"
            />
          </svg>
          <div
            {...textAttrs('terminal-boundary-label', L.terminalLabelBox)}
            style={{
              position: 'absolute',
              left: L.terminalLabelBox.x,
              top: L.terminalLabelBox.y,
              width: L.terminalLabelBox.w,
              height: L.terminalLabelBox.h,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              letterSpacing: 2,
              font: '600 20px "IBM Plex Mono"',
              color: raceRed,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ESTABLISHED LITERATURE ENDS HERE
          </div>
        </div>
      )}

      {/* Structural Argument Handoff Field */}
      {ms >= cue.t62Psychology && (
        <div data-field="structural-handoff" style={{opacity: psychologyP}}>
          <Panel id="structural-handoff-frame" box={L.turn63Field} accent="color/line/hairline" />
          <Label
            id="structural-handoff-label"
            box={L.turn63Label}
            size={22}
            weight={650}
            sans
            ink={gold}
          >
            THE ORIGINAL POWER · STRUCTURAL ARGUMENT
          </Label>
          <Panel
            id="structural-continuation-socket"
            box={L.turn63Socket}
            style={{borderStyle: 'solid', borderWidth: 1, background: color('color/fill/panel-wash')}}
            accent="color/fill/gold"
          />
          <Label
            id="structural-subject-title"
            box={{x: 1440, y: 304, w: 340, h: 104}}
            size={24}
            weight={650}
            sans
            ink={primary}
          >
            RACISM AS AN INSTITUTIONAL EXTRACTION SYSTEM
          </Label>
          <Label
            id="structural-equation-label"
            box={{x: 1440, y: 430, w: 340, h: 40}}
            size={20}
            weight={600}
            ink={gold}
          >
            STATED IN EQUATIONS
          </Label>
          <Label
            id="structural-archives-label"
            box={{x: 1440, y: 510, w: 340, h: 56}}
            size={20}
            weight={500}
            ink={color('color/text/soft')}
          >
            TESTED AGAINST HISTORICAL ARCHIVES
          </Label>
        </div>
      )}

      {/* Source Line */}
      <Label
        id="literature-source-line"
        box={L.source}
        size={20}
        weight={400}
        ink={muted}
      >
        Greenwald & Banaji 1995 · Allport 1954 · Fiske 1998
      </Label>
    </StageSceneFrame>
  );
}
