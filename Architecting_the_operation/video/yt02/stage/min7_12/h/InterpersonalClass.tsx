import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  GroupDirectionField,
  Label,
  Panel,
  TermTriad,
  shapeAttrs,
  type Box,
  type GroupMarkSpec,
  type TriadSource,
  type TriadTerm,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const INTERPERSONAL_LAYOUT = {
  biasBlock: {x: 120, y: 120, w: 520, h: 180},
  prejudiceBlock: {x: 700, y: 120, w: 520, h: 180},
  discriminationBlock: {x: 1280, y: 120, w: 520, h: 180},
  bracket: {x: 210, y: 314, w: 1500, h: 68},

  locusBanner: {x: 120, y: 400, w: 1680, h: 68},
  groupFieldFull: {x: 120, y: 484, w: 1680, h: 320},
  directionBannerFull: {x: 120, y: 820, w: 1680, h: 68},

  personActionsPanel: {x: 120, y: 400, w: 1060, h: 68},
  groupFieldContracted: {x: 120, y: 484, w: 1060, h: 320},
  directionBannerContracted: {x: 120, y: 820, w: 1060, h: 68},

  stateRack: {x: 1280, y: 400, w: 520, h: 488},
  rackHeading: {x: 1304, y: 416, w: 472, h: 36},
  rackItems: [
    {x: 1304, y: 466, w: 472, h: 64},
    {x: 1304, y: 540, w: 472, h: 64},
    {x: 1304, y: 614, w: 472, h: 64},
    {x: 1304, y: 688, w: 472, h: 64},
    {x: 1304, y: 762, w: 472, h: 64},
  ] as const satisfies readonly Box[],

  groupFieldTurn61: {x: 120, y: 400, w: 1680, h: 280},
  assignmentStrip: {x: 120, y: 700, w: 1680, h: 188},
  source: {x: 116, y: 964, w: 740, h: 26},
} as const;

export function InterpersonalClass({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t57Look: useCue('t57Look').at,
    t57Bias: useCue('t57Bias').at,
    t57Prejudice: useCue('t57Prejudice').at,
    t57Discrimination: useCue('t57Discrimination').at,
    t57Fiske: useCue('t57Fiske').at,

    t58Three: useCue('t58Three').at,
    t58Mental: useCue('t58Mental').at,
    t58Behavioral: useCue('t58Behavioral').at,
    t58Inside: useCue('t58Inside').at,
    t58Between: useCue('t58Between').at,
    t58Direction: useCue('t58Direction').at,
    t58Two: useCue('t58Two').at,

    t59Any: useCue('t59Any').at,
    t59Skin: useCue('t59Skin').at,
    t59Ancestry: useCue('t59Ancestry').at,
    t59Bias: useCue('t59Bias').at,
    t59Hostility: useCue('t59Hostility').at,
    t59Treat: useCue('t59Treat').at,
    t59Unequally: useCue('t59Unequally').at,

    t60PersonToPerson: useCue('t60PersonToPerson').at,
    t60Zero: useCue('t60Zero').at,
    t60Legislatures: useCue('t60Legislatures').at,
    t60Courts: useCue('t60Courts').at,
    t60Police: useCue('t60Police').at,
    t60Credit: useCue('t60Credit').at,
    t60Military: useCue('t60Military').at,

    t61Original: useCue('t61Original').at,
    t61Assigns: useCue('t61Assigns').at,
    t61Bias: useCue('t61Bias').at,
    t61Prejudice: useCue('t61Prejudice').at,
    t61Discrimination: useCue('t61Discrimination').at,
    t61Interpersonal: useCue('t61Interpersonal').at,
    t61Exact: useCue('t61Exact').at,
    t61Scientific: useCue('t61Scientific').at,
  };

  const L = INTERPERSONAL_LAYOUT;
  const isTurn59 = ms >= cue.t59Any && ms < cue.t60PersonToPerson;
  const isTurn60 = ms >= cue.t60PersonToPerson && ms < cue.t61Original;
  const isTurn61 = ms >= cue.t61Original;

  const lookP = Math.max(0.25, enter(ms, cue.t57Look));
  const fiskeP = enter(ms, cue.t57Fiske);
  const directionP = enter(ms, cue.t58Direction);
  const twoP = enter(ms, cue.t58Two);
  const t60PersonP = Math.max(0.25, enter(ms, cue.t60PersonToPerson));
  const origP = Math.max(0.25, enter(ms, cue.t61Original));

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  const triadTerms: readonly TriadTerm[] = [
    {
      kind: 'bias',
      title: 'BIAS',
      lines: [{text: 'STARTING TENDENCY', progress: 1, tone: 'accent'}],
    },
    {
      kind: 'prejudice',
      title: 'PREJUDICE',
      lines: [{text: 'GROUP ANTIPATHY', progress: 1, tone: 'accent'}],
    },
    {
      kind: 'discrimination',
      title: 'DISCRIMINATION',
      lines: [{text: 'UNEQUAL TREATMENT', progress: 1, tone: 'accent'}],
    },
  ];
  const triadSources: readonly TriadSource[] = [
    {text: ms >= cue.t57Bias ? 'GREENWALD & BANAJI 1995' : 'CITATION · ATTITUDE & STEREOTYPE', progress: 1},
    {text: ms >= cue.t57Prejudice ? 'ALLPORT 1954' : 'CITATION · ANTIPATHY & RIGIDITY', progress: 1},
    {text: ms >= cue.t57Discrimination ? 'FISKE 1998' : 'CITATION · HANDBOOK TAXONOMY', progress: 1},
  ];
  const triadBoxes: readonly Box[] = [L.biasBlock, L.prejudiceBlock, L.discriminationBlock];
  const triadStates = [lookP, lookP, lookP];

  const groupMarksFull: GroupMarkSpec[] = [
    {id: 'p1', side: 'left', x: 0.22, y: 0.5, accent: 'ingroup', scale: 1.05, progress: 1},
    {id: 'p2', side: 'left', x: 0.5, y: 0.5, accent: 'neutral', scale: 1.05, progress: 1},
    {id: 'p3', side: 'left', x: 0.78, y: 0.5, accent: 'ingroup', scale: 1.05, progress: 1},
    {id: 'p4', side: 'right', x: 0.22, y: 0.5, accent: 'neutral', scale: 1.05, progress: 1},
    {id: 'p5', side: 'right', x: 0.5, y: 0.5, accent: 'outgroup', scale: 1.05, progress: 1},
    {id: 'p6', side: 'right', x: 0.78, y: 0.5, accent: 'outgroup', scale: 1.05, progress: 1},
  ];

  const groupMarksContracted: GroupMarkSpec[] = [
    {id: 'p1', side: 'left', x: 0.3, y: 0.5, accent: 'ingroup', scale: 1.0, progress: 1},
    {id: 'p2', side: 'left', x: 0.7, y: 0.5, accent: 'neutral', scale: 1.0, progress: 1},
    {id: 'p3', side: 'right', x: 0.3, y: 0.5, accent: 'neutral', scale: 1.0, progress: 1},
    {id: 'p4', side: 'right', x: 0.7, y: 0.5, accent: 'outgroup', scale: 1.0, progress: 1},
  ];

  const currentGroupBox = isTurn61
    ? L.groupFieldTurn61
    : isTurn60
      ? L.groupFieldContracted
      : L.groupFieldFull;

  const currentInsideLabels = {
    left: ms >= cue.t59Bias
      ? 'MENTAL BIAS'
      : ms >= cue.t58Mental
        ? 'INSIDE AN INDIVIDUAL'
        : 'INTERNAL COGNITIVE & AFFECTIVE LOCUS',
    right: ms >= cue.t59Hostility
      ? 'RIGID HOSTILITY'
      : ms >= cue.t58Behavioral
        ? 'BETWEEN INDIVIDUALS'
        : 'DYADIC BEHAVIORAL LOCUS',
    progress: 1,
  };

  const forwardP = Math.max(directionP * 0.55, twoP);
  const reverseP = twoP;

  return (
    <StageSceneFrame segment={segment}>
      {/* Top Rail: TermTriad */}
      <TermTriad
        id="interpersonal-triad"
        boxes={triadBoxes}
        terms={triadTerms}
        states={triadStates}
        sources={triadSources}
        bracketBox={L.bracket}
        progress={fiskeP}
        bracketLabel={ms >= cue.t58Three ? 'INTERPERSONAL CLASS' : undefined}
      />

      {/* Turns 57–59 Locus & Ubiquity Header Banner */}
      {!isTurn60 && !isTurn61 && (
        <div data-locus-banner="true" style={{opacity: lookP}}>
          <Panel id="locus-banner-frame" box={L.locusBanner} accent="color/line/hairline" />
          {!isTurn59 ? (
            <>
              <Label
                id="locus-banner-title"
                box={{x: 148, y: 416, w: 980, h: 36}}
                size={28}
                weight={650}
                sans
                ink={primary}
              >
                OPERATIONAL LOCUS · INDIVIDUAL & DYADIC INTERACTION
              </Label>
              <Label
                id="locus-banner-tag"
                box={{x: 1160, y: 420, w: 610, h: 28}}
                size={20}
                weight={500}
                align="right"
                ink={gold}
              >
                SYMMETRICAL INTERGROUP CAPABILITY
              </Label>
            </>
          ) : (
            <div data-turn="59-ubiquity">
              <Label
                id="any-human-label"
                box={{x: 148, y: 416, w: 340, h: 36}}
                size={28}
                weight={650}
                sans
                ink={primary}
              >
                ANY HUMAN BEING
              </Label>
              <Label
                id="any-skin-label"
                box={{x: 510, y: 418, w: 280, h: 32}}
                size={22}
                weight={600}
                ink={ms >= cue.t59Skin ? gold : muted}
              >
                {ms >= cue.t59Skin ? 'ANY SKIN COLOR' : 'UNIVERSAL TRAIT'}
              </Label>
              <Label
                id="any-ancestry-label"
                box={{x: 820, y: 418, w: 280, h: 32}}
                size={22}
                weight={600}
                ink={ms >= cue.t59Ancestry ? primary : muted}
              >
                {ms >= cue.t59Ancestry ? 'ANY ANCESTRY' : 'UNIVERSAL ORIGIN'}
              </Label>
              {ms >= cue.t59Treat ? (
                <Label
                  id="unequal-treatment-t59-label"
                  box={{x: 1130, y: 418, w: 640, h: 32}}
                  size={22}
                  weight={600}
                  align="right"
                  ink={orange}
                >
                  UNEQUAL TREATMENT
                </Label>
              ) : (
                <Label
                  id="ubiquity-status-label"
                  box={{x: 1130, y: 418, w: 640, h: 32}}
                  size={22}
                  weight={500}
                  align="right"
                  ink={muted}
                >
                  INTERPERSONAL UBIQUITY
                </Label>
              )}
            </div>
          )}
        </div>
      )}

      {/* Group Direction Field: Enlarged and present across all 5 turns */}
      <div data-turn-field="group-direction">
        <GroupDirectionField
          id="group-direction-main"
          box={currentGroupBox}
          marks={isTurn60 ? groupMarksContracted : groupMarksFull}
          leftLabel={ms >= cue.t58Direction ? 'GROUP A' : 'SOCIAL COHORT 01'}
          rightLabel={ms >= cue.t58Direction ? 'GROUP B' : 'SOCIAL COHORT 02'}
          forwardProgress={forwardP}
          reverseProgress={reverseP}
          boundaryProgress={lookP}
          insideLabels={currentInsideLabels}
        />
      </div>

      {/* Turns 57–59 Bottom Direction Banner */}
      {!isTurn60 && !isTurn61 && (
        <div data-direction-banner="full" style={{opacity: lookP}}>
          <Panel
            id="direction-banner-frame"
            box={L.directionBannerFull}
            accent={ms >= cue.t58Two ? 'color/fill/gold' : 'color/line/hairline'}
          />
          <Label
            id="group-direction-two-label"
            box={{x: 148, y: 836, w: 1120, h: 36}}
            size={28}
            weight={650}
            sans
            ink={ms >= cue.t58Two ? gold : soft}
          >
            {ms >= cue.t58Two
              ? 'ANY DIRECTION BETWEEN ANY TWO SOCIAL GROUPS'
              : 'BILATERAL INTERPERSONAL CAPABILITY ACROSS GROUPS'}
          </Label>
          <Label
            id="direction-banner-tag"
            box={{x: 1300, y: 840, w: 472, h: 28}}
            size={20}
            weight={500}
            align="right"
            ink={muted}
          >
            SYMMETRICAL DYADIC GRAPH
          </Label>
        </div>
      )}

      {/* Turn 60 State-Power Rack Separation */}
      {isTurn60 && (
        <div data-turn="60" style={{opacity: t60PersonP}}>
          {/* Left Column Header Panel */}
          <Panel id="person-actions-panel" box={L.personActionsPanel} accent="color/line/hairline" />
          <Label
            id="person-actions-heading"
            box={{x: 148, y: 416, w: 620, h: 36}}
            size={28}
            weight={650}
            sans
            ink={primary}
          >
            PERSON-TO-PERSON ACTIONS
          </Label>
          <Label
            id="person-actions-tag"
            box={{x: 780, y: 420, w: 372, h: 28}}
            size={20}
            weight={500}
            align="right"
            ink={gold}
          >
            DYADIC INTERACTION FIELD
          </Label>

          {/* Left Column Bottom Direction Banner */}
          <Panel id="direction-banner-contracted" box={L.directionBannerContracted} accent="color/fill/gold" />
          <Label
            id="group-direction-two-label"
            box={{x: 148, y: 836, w: 1004, h: 36}}
            size={28}
            weight={650}
            sans
            ink={gold}
          >
            ANY DIRECTION BETWEEN ANY TWO SOCIAL GROUPS
          </Label>

          {/* Right Column: State-Power Rack Frame (all 5 slots present from turn 60 start) */}
          <Panel id="state-power-rack" box={L.stateRack} accent="color/marker/race" />
          <Label
            id="zero-control-heading"
            box={L.rackHeading}
            size={28}
            weight={650}
            sans
            ink={raceRed}
          >
            {ms >= cue.t60Zero ? 'REQUIRES ZERO CONTROL OVER' : 'INSTITUTIONAL STATE APPARATUS'}
          </Label>

          {/* 1: State Legislatures */}
          <div data-rack-item="1">
            <Panel
              id="rack-item-1"
              box={L.rackItems[0]}
              accent={ms >= cue.t60Legislatures ? 'color/marker/race' : 'color/line/hairline'}
            />
            <div
              {...shapeAttrs('icon-leg', {x: 1320, y: 484, w: 28, h: 28}, 'mark', 'icon-leg')}
              style={{position: 'absolute', left: 1320, top: 484, width: 28, height: 28, color: raceRed}}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 21 H21 M4 10 L12 3 L20 10 H4 Z M6 10 V18 M10 10 V18 M14 10 V18 M18 10 V18" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Label
              id="rack-label-leg"
              box={{x: 1362, y: 482, w: 394, h: 32}}
              size={22}
              weight={600}
              ink={ms >= cue.t60Legislatures ? primary : soft}
            >
              {ms >= cue.t60Legislatures ? 'STATE LEGISLATURES' : 'STATUTORY LAWMAKING'}
            </Label>
          </div>

          {/* 2: Appellate Courts */}
          <div data-rack-item="2">
            <Panel
              id="rack-item-2"
              box={L.rackItems[1]}
              accent={ms >= cue.t60Courts ? 'color/marker/race' : 'color/line/hairline'}
            />
            <div
              {...shapeAttrs('icon-courts', {x: 1320, y: 558, w: 28, h: 28}, 'mark', 'icon-courts')}
              style={{position: 'absolute', left: 1320, top: 558, width: 28, height: 28, color: raceRed}}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 V21 M5 8 L12 6 L19 8 M5 8 L2 14 H8 L5 8 Z M19 8 L16 14 H22 L19 8 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Label
              id="rack-label-courts"
              box={{x: 1362, y: 556, w: 394, h: 32}}
              size={22}
              weight={600}
              ink={ms >= cue.t60Courts ? primary : soft}
            >
              {ms >= cue.t60Courts ? 'APPELLATE COURTS' : 'JUDICIAL REVIEW'}
            </Label>
          </div>

          {/* 3: Police Departments */}
          <div data-rack-item="3">
            <Panel
              id="rack-item-3"
              box={L.rackItems[2]}
              accent={ms >= cue.t60Police ? 'color/marker/race' : 'color/line/hairline'}
            />
            <div
              {...shapeAttrs('icon-police', {x: 1320, y: 632, w: 28, h: 28}, 'mark', 'icon-police')}
              style={{position: 'absolute', left: 1320, top: 632, width: 28, height: 28, color: raceRed}}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 L4 7 V12 C4 17 8 20 12 21 C16 20 20 17 20 12 V7 L12 3 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Label
              id="rack-label-police"
              box={{x: 1362, y: 630, w: 394, h: 32}}
              size={22}
              weight={600}
              ink={ms >= cue.t60Police ? primary : soft}
            >
              {ms >= cue.t60Police ? 'POLICE DEPARTMENTS' : 'COERCIVE POLICING'}
            </Label>
          </div>

          {/* 4: Credit Markets */}
          <div data-rack-item="4">
            <Panel
              id="rack-item-4"
              box={L.rackItems[3]}
              accent={ms >= cue.t60Credit ? 'color/marker/race' : 'color/line/hairline'}
            />
            <div
              {...shapeAttrs('icon-credit', {x: 1320, y: 706, w: 28, h: 28}, 'mark', 'icon-credit')}
              style={{position: 'absolute', left: 1320, top: 706, width: 28, height: 28, color: raceRed}}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6 H21 V18 H3 Z M3 10 H21 M7 15 H9" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Label
              id="rack-label-credit"
              box={{x: 1362, y: 704, w: 394, h: 32}}
              size={22}
              weight={600}
              ink={ms >= cue.t60Credit ? primary : soft}
            >
              {ms >= cue.t60Credit ? 'CREDIT MARKETS' : 'CAPITAL ALLOCATION'}
            </Label>
          </div>

          {/* 5: Military Force */}
          <div data-rack-item="5">
            <Panel
              id="rack-item-5"
              box={L.rackItems[4]}
              accent={ms >= cue.t60Military ? 'color/marker/race' : 'color/line/hairline'}
            />
            <div
              {...shapeAttrs('icon-military', {x: 1320, y: 780, w: 28, h: 28}, 'mark', 'icon-military')}
              style={{position: 'absolute', left: 1320, top: 780, width: 28, height: 28, color: raceRed}}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Label
              id="rack-label-military"
              box={{x: 1362, y: 778, w: 394, h: 32}}
              size={22}
              weight={600}
              ink={ms >= cue.t60Military ? primary : soft}
            >
              {ms >= cue.t60Military ? 'MILITARY FORCE' : 'ARMED SOVEREIGNTY'}
            </Label>
          </div>

          <Label
            id="rack-footer-label"
            box={{x: 1304, y: 840, w: 472, h: 28}}
            size={20}
            weight={500}
            ink={muted}
          >
            STRUCTURAL LEVERS OUTSIDE DYADIC SCOPE
          </Label>
        </div>
      )}

      {/* Turn 61 Book-Shaped Assignment Strip */}
      {isTurn61 && (
        <div data-turn="61" style={{opacity: origP}}>
          <Panel
            id="book-assignment-strip"
            box={L.assignmentStrip}
            accent="color/fill/gold"
            style={{borderWidth: 2, background: color('color/fill/panel-wash')}}
          />
          <Label
            id="book-title-label"
            box={{x: 150, y: 716, w: 1620, h: 36}}
            size={28}
            weight={650}
            sans
            ink={gold}
          >
            {ms >= cue.t61Interpersonal
              ? 'THE ORIGINAL POWER · INTERPERSONAL CLASS OF SOCIAL BEHAVIOR'
              : 'THE ORIGINAL POWER · TAXONOMIC CLASSIFICATION'}
          </Label>

          {/* Sockets for Three Terms */}
          <div data-strip-sockets="true">
            <Panel
              id="socket-strip-bias"
              box={{x: 150, y: 764, w: 510, h: 64}}
              accent={ms >= cue.t61Bias ? 'color/fill/gold' : 'color/line/hairline'}
            />
            <Label
              id="strip-term-bias"
              box={{x: 174, y: 778, w: 462, h: 36}}
              size={28}
              weight={650}
              sans
              ink={ms >= cue.t61Bias ? gold : soft}
            >
              BIAS
            </Label>

            <Panel
              id="socket-strip-prejudice"
              box={{x: 685, y: 764, w: 510, h: 64}}
              accent={ms >= cue.t61Prejudice ? 'color/marker/race' : 'color/line/hairline'}
            />
            <Label
              id="strip-term-prejudice"
              box={{x: 709, y: 778, w: 462, h: 36}}
              size={28}
              weight={650}
              sans
              ink={ms >= cue.t61Prejudice ? raceRed : soft}
            >
              PREJUDICE
            </Label>

            <Panel
              id="socket-strip-discrimination"
              box={{x: 1220, y: 764, w: 550, h: 64}}
              accent={ms >= cue.t61Discrimination ? 'color/text/accent' : 'color/line/hairline'}
            />
            <Label
              id="strip-term-discrimination"
              box={{x: 1244, y: 778, w: 502, h: 36}}
              size={28}
              weight={650}
              sans
              ink={ms >= cue.t61Discrimination ? orange : soft}
            >
              DISCRIMINATION
            </Label>
          </div>

          <Label
            id="exact-scientific-names"
            box={{x: 150, y: 840, w: 860, h: 30}}
            size={20}
            weight={600}
            ink={ms >= cue.t61Scientific ? gold : muted}
          >
            {ms >= cue.t61Scientific
              ? 'EXACT SCIENTIFIC NAMES · CALIBRATED TAXONOMY'
              : 'TAXONOMIC CALIBRATION · THREE INTERPERSONAL TERMS'}
          </Label>
          <Label
            id="strip-chapter-tag"
            box={{x: 1080, y: 840, w: 690, h: 30}}
            size={20}
            weight={500}
            align="right"
            ink={muted}
          >
            CHAPTER 2 · NOMENCLATURE SPECIFICATION
          </Label>
        </div>
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
    </StageSceneFrame>
  );
}
