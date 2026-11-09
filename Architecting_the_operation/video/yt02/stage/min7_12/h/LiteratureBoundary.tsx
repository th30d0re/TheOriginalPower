import React from 'react';
import {BootIn, DrawLine, Flicker, KitSound, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  TermTriad,
  lineAttrs,
  shapeAttrs,
  textAttrs,
  type Box,
  type Point,
  type TriadSource,
  type TriadTerm,
} from '../shared';

const pulseAmount = (ms: number, at: number) => Math.max(0, 1 - Math.abs(ms - (at + 200)) / 300);
const cueFrame = (ms: number) => Math.round(ms * 30 / 1000);

export const LITERATURE_BOUNDARY_LAYOUT = {
  t62Banner: {x: 120, y: 115, w: 1680, h: 72},
  literatureField: {x: 120, y: 215, w: 1140, h: 665},
  fieldHeading: {x: 160, y: 233, w: 1060, h: 40},
  fieldSubheading: {x: 160, y: 280, w: 1060, h: 36},
  blocks: [
    {x: 160, y: 332, w: 340, h: 290},
    {x: 520, y: 332, w: 340, h: 290},
    {x: 880, y: 332, w: 340, h: 290},
  ] as const satisfies readonly Box[],
  bracket: {x: 200, y: 636, w: 980, h: 68},
  standardDefinitions: {x: 160, y: 724, w: 1060, h: 36},
  scopeBody: {x: 160, y: 770, w: 1060, h: 40},
  scopeFooter: {x: 160, y: 832, w: 1060, h: 30},

  terminalColumn: {x: 1290, y: 215, w: 60, h: 665},
  terminalLeftLine: [[1290, 215], [1290, 880]] as const satisfies readonly Point[],
  terminalRightLine: [[1350, 215], [1350, 880]] as const satisfies readonly Point[],
  terminalLabelBox: {x: 1295, y: 233, w: 50, h: 629},

  turn63Field: {x: 1380, y: 215, w: 420, h: 665},
  turn63Label: {x: 1400, y: 229, w: 380, h: 72},
  turn63Socket: {x: 1400, y: 316, w: 380, h: 550},

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
  const hasEstablished = ms >= cue.t62Established;
  const hasLiterature = ms >= cue.t62Literature;

  const personP = ms >= cue.t62PersonToPerson ? 1 : 0;

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');
  const hairline = color('color/line/hairline');

  const terms: readonly TriadTerm[] = [
    {
      kind: 'bias',
      title: 'BIAS · GREENWALD & BANAJI 1995',
      lines: [{text: 'STARTING TENDENCY', progress: 1, tone: 'accent'}],
    },
    {
      kind: 'prejudice',
      title: 'PREJUDICE · ALLPORT 1954',
      lines: [{text: 'GROUP ANTIPATHY', progress: 1, tone: 'accent'}],
    },
    {
      kind: 'discrimination',
      title: 'DISCRIMINATION · FISKE 1998',
      lines: [{text: 'UNEQUAL TREATMENT', progress: 1, tone: 'accent'}],
    },
  ];
  const sources: readonly TriadSource[] = [
    {text: 'ATTITUDE RECORD', progress: 1},
    {text: 'ANTIPATHY RECORD', progress: 1},
    {text: 'BEHAVIORAL RECORD', progress: 1},
  ];

  const pulses = [
    pulseAmount(ms, cue.t62Bias),
    pulseAmount(ms, cue.t62Prejudice),
    pulseAmount(ms, cue.t62Discrimination),
  ];

  const socketConfigs = [
    {num: '01', role: 'COGNITIVE CONSTRUCT', accent: 'color/fill/gold'},
    {num: '02', role: 'AFFECTIVE CONSTRUCT', accent: 'color/marker/race'},
    {num: '03', role: 'BEHAVIORAL CONSTRUCT', accent: 'color/text/accent'},
  ] as const;

  return (
    <StageSceneFrame segment={segment}><KitSound mode="beats">
      {/* Top Banner */}
      <Flicker startFrame={cueFrame(cue.t62Established)} durationFrames={16} beat><div data-t62-banner="true">
        <Panel startMs={cue.t62Established} id="t62-banner-frame" box={L.t62Banner} accent="color/line/hairline" />
        <Label
          id="t62-banner-title"
          box={{x: 148, y: 133, w: 1080, h: 36}}
          size={28}
          weight={650}
          sans
          ink={primary}
        >
          LITERATURE BOUNDARY · INTERPERSONAL TO STRUCTURAL HANDOFF
        </Label>
        <Label
          id="t62-banner-tag"
          box={{x: 1260, y: 137, w: 512, h: 28}}
          size={20}
          weight={500}
          align="right"
          ink={gold}
        >
          CHAPTER 2 · SECTION TRANSITION
        </Label>
      </div></Flicker>

      {/* Established Literature Field */}
      <Flicker startFrame={cueFrame(cue.t62Established)} durationFrames={16}><div data-field="established-literature">
        <BootIn box={L.literatureField} startFrame={cueFrame(cue.t62Established)} durationFrames={28} mode="scan" />
        <Panel startMs={cue.t62Established}
          id="established-literature-frame"
          box={L.literatureField}
          accent={ms >= cue.t62Experimental ? 'color/line/hairline-strong' : 'color/line/hairline'}
        />

        <Label
          id="established-psychology-heading"
          box={L.fieldHeading}
          size={32}
          weight={650}
          sans
          ink={primary}
        >
          {hasEstablished ? 'ESTABLISHED EXPERIMENTAL PSYCHOLOGY' : 'EXPERIMENTAL SOCIAL PSYCHOLOGY'}
        </Label>
        <Label
          id="established-sub-heading"
          box={L.fieldSubheading}
          size={28}
          weight={500}
          sans
          ink={soft}
        >
          Three canonical constructs of individual and dyadic behavior.
        </Label>

        {/* Pre-dock populated sockets before t62Literature, replaced by TermTriad at t62Literature */}
        {!hasLiterature ? (
          <div data-literature-sockets="true">
            {L.blocks.map((b, idx) => {
              const cfg = socketConfigs[idx];
              return (
                <div key={cfg.num} data-literature-socket={idx + 1}>
                  <Panel startMs={cue.t62Established}
                    id={`literature-socket-${idx + 1}`}
                    box={b}
                    accent={cfg.accent}
                    style={{borderStyle: 'dashed'}}
                  />
                  <Label
                    id={`literature-socket-${idx + 1}-slot`}
                    box={{x: b.x + 22, y: b.y + 18, w: b.w - 44, h: 28}}
                    size={20}
                    weight={500}
                    ink={muted}
                  >
                    {`CANONICAL SLOT ${cfg.num}`}
                  </Label>
                  <Label
                    id={`literature-socket-${idx + 1}-body`}
                    box={{x: b.x + 22, y: b.y + 84, w: b.w - 44, h: 76}}
                    size={28}
                    weight={650}
                    lh={1.2}
                    sans
                    ink={primary}
                  >
                    {cfg.role}
                  </Label>
                  <Label
                    id={`literature-socket-${idx + 1}-footer`}
                    box={{x: b.x + 22, y: b.y + 244, w: b.w - 44, h: 28}}
                    size={20}
                    weight={500}
                    ink={muted}
                  >
                    CITATION RECORD READY
                  </Label>
                </div>
              );
            })}
          </div>
        ) : (
          <TermTriad
            id="literature-boundary-triad"
            boxes={L.blocks}
            terms={terms}
            states={[1, 1, 1]}
            sources={sources}
            layout="stack"
            pulses={pulses}
            bracketBox={L.bracket}
            progress={personP}
            bracketLabel={ms >= cue.t62PersonToPerson ? 'PERSON-TO-PERSON OPERATIONS' : undefined}
          />
        )}

        {/* Bottom Summary Band */}
        <Label
          id="standard-definitions-label"
          box={L.standardDefinitions}
          size={28}
          weight={650}
          sans
          ink={ms >= cue.t62Standard ? gold : primary}
          align="center"
        >
          {ms >= cue.t62Standard ? 'STANDARD DEFINITIONS' : 'INTERPERSONAL LITERATURE SCOPE'}
        </Label>
        <Label
          id="literature-scope-body"
          box={L.scopeBody}
          size={28}
          weight={500}
          sans
          ink={soft}
          align="center"
        >
          Complete specification of individual and dyadic social behavior.
        </Label>
        <Label
          id="literature-scope-footer"
          box={L.scopeFooter}
          size={20}
          weight={500}
          ink={muted}
          align="center"
        >
          GREENWALD & BANAJI 1995 · ALLPORT 1954 · FISKE 1998
        </Label>
      </div></Flicker>

      {/* Terminal Boundary Column */}
      {ms >= cue.t62Ends && (
        <Flicker startFrame={cueFrame(cue.t62Ends)} durationFrames={18} beat><div data-terminal-boundary="true">
          <BootIn box={L.terminalColumn} startFrame={cueFrame(cue.t62Ends)} durationFrames={24} mode="snap" />
          <Panel startMs={cue.t62Ends}
            id="terminal-boundary-column"
            box={L.terminalColumn}
            accent="color/marker/race"
            fillToken="color/fill/panel-wash"
            style={{background: color('color/fill/panel-wash'), borderWidth: 1}}
          />
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path
              {...lineAttrs('terminal-boundary-line-left', L.terminalLeftLine)}
              d="M1290 215 L1290 880"
              fill="none"
              stroke={raceRed}
              strokeWidth="2"
              pathLength={1}
              strokeDasharray="1"
            />
            <path
              {...lineAttrs('terminal-boundary-line-right', L.terminalRightLine)}
              d="M1350 215 L1350 880"
              fill="none"
              stroke={raceRed}
              strokeWidth="2"
              pathLength={1}
              strokeDasharray="1"
            />
          </svg>
          <div
            {...textAttrs('terminal-boundary-label', L.terminalLabelBox)}
            data-vertical-font-size="20"
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
          <DrawLine points={L.terminalLeftLine} startFrame={cueFrame(cue.t62Ends)} durationFrames={18} strokeToken="color/marker/race" strokeWidth={2} />
          <DrawLine points={L.terminalRightLine} startFrame={cueFrame(cue.t62Ends)} durationFrames={18} strokeToken="color/marker/race" strokeWidth={2} />
        </div></Flicker>
      )}

      {/* Structural Argument Handoff Field */}
      {ms >= cue.t62Psychology && (
        <Flicker startFrame={cueFrame(cue.t62Psychology)} durationFrames={16} beat><div data-field="structural-handoff">
          <BootIn box={L.turn63Field} startFrame={cueFrame(cue.t62Psychology)} durationFrames={28} mode="scan" />
          <Panel startMs={cue.t62Psychology} id="structural-handoff-frame" box={L.turn63Field} accent="color/line/hairline" />
          <Label
            id="structural-handoff-label"
            box={L.turn63Label}
            size={28}
            weight={650}
            lh={1.2}
            sans
            ink={gold}
          >
            THE ORIGINAL POWER · STRUCTURAL ARGUMENT
          </Label>
          <Panel startMs={cue.t62Psychology}
            id="structural-continuation-socket"
            box={L.turn63Socket}
            fillToken="color/fill/panel-wash"
            style={{borderStyle: 'solid', borderWidth: 1, background: color('color/fill/panel-wash')}}
            accent="color/fill/gold"
          />
          <Label
            id="structural-part-tag"
            box={{x: 1420, y: 332, w: 340, h: 28}}
            size={20}
            weight={600}
            ink={gold}
          >
            PART I · FORMAL MODEL
          </Label>
          <Label
            id="structural-subject-title"
            box={{x: 1420, y: 374, w: 340, h: 112}}
            size={28}
            weight={650}
            lh={1.2}
            sans
            ink={primary}
          >
            RACISM AS AN INSTITUTIONAL EXTRACTION SYSTEM
          </Label>
          <Label
            id="structural-subject-body"
            box={{x: 1420, y: 500, w: 340, h: 112}}
            size={28}
            weight={500}
            lh={1.22}
            sans
            ink={soft}
          >
            Macro-level control over law, courts, policing, and credit.
          </Label>
          <Label
            id="structural-equation-label"
            box={{x: 1420, y: 630, w: 340, h: 32}}
            size={22}
            weight={600}
            ink={gold}
          >
            STATED IN EQUATIONS
          </Label>
          <Label
            id="structural-archives-label"
            box={{x: 1420, y: 678, w: 340, h: 60}}
            size={22}
            weight={500}
            lh={1.25}
            ink={primary}
          >
            TESTED AGAINST HISTORICAL ARCHIVES
          </Label>
          <div
            {...shapeAttrs('structural-socket-mark', {x: 1420, y: 756, w: 340, h: 52}, 'mark', 'structural-socket-mark')}
            style={{
              position: 'absolute',
              left: 1420,
              top: 756,
              width: 340,
              height: 52,
              border: `1px solid ${hairline}`,
              borderRadius: 6,
            }}
          >
            <svg width="340" height="52" viewBox="0 0 340 52" aria-hidden="true">
              <rect x="16" y="14" width="84" height="24" rx="4" fill="none" stroke={gold} strokeWidth="2" />
              <line x1="100" y1="26" x2="128" y2="26" stroke={gold} strokeWidth="2" />
              <rect x="128" y="14" width="84" height="24" rx="4" fill="none" stroke={orange} strokeWidth="2" />
              <line x1="212" y1="26" x2="240" y2="26" stroke={orange} strokeWidth="2" />
              <rect x="240" y="14" width="84" height="24" rx="4" fill="none" stroke={raceRed} strokeWidth="2" />
            </svg>
          </div>
          <Label
            id="structural-socket-footer"
            box={{x: 1420, y: 824, w: 340, h: 30}}
            size={20}
            weight={500}
            ink={muted}
          >
            FORMAL MODEL · CHAPTERS 2–21
          </Label>
        </div></Flicker>
      )}

      {/* Source Line */}
      <Label
        id="source-line"
        box={L.source}
        size={20}
        weight={400}
        ink={muted}
      >
        Greenwald & Banaji 1995 · Allport 1954 · Fiske 1998
      </Label>
    </KitSound></StageSceneFrame>
  );
}
