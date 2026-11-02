import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  GroupDirectionField,
  Label,
  Panel,
  TermTriad,
  clamp01,
  lineAttrs,
  shapeAttrs,
  type Box,
  type GroupMarkSpec,
  type Point,
  type TriadSource,
  type TriadTerm,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const INTERPERSONAL_LAYOUT = {
  biasBlock: {x: 140, y: 210, w: 480, h: 180},
  prejudiceBlock: {x: 720, y: 210, w: 480, h: 180},
  discriminationBlock: {x: 1300, y: 210, w: 480, h: 180},
  bracket: {x: 230, y: 445, w: 1460, h: 75},

  groupField: {x: 120, y: 610, w: 1060, h: 220},
  directionLabel: {x: 140, y: 845, w: 1020, h: 34},

  personToPersonLabel: {x: 140, y: 545, w: 420, h: 32},
  stateRack: {x: 1280, y: 535, w: 520, h: 365},
  rackHeading: {x: 1300, y: 550, w: 480, h: 32},

  assignmentStrip: {x: 240, y: 760, w: 1440, h: 160},
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
  const isTurn58 = ms >= cue.t58Mental && ms < cue.t59Any;
  const isTurn59 = ms >= cue.t59Any && ms < cue.t60PersonToPerson;
  const isTurn60 = ms >= cue.t60PersonToPerson && ms < cue.t61Original;
  const isTurn61 = ms >= cue.t61Original;

  // Progress values
  const lookP = enter(ms, cue.t57Look);
  const biasSourceP = enter(ms, cue.t57Bias);
  const prejudiceSourceP = enter(ms, cue.t57Prejudice);
  const discriminationSourceP = enter(ms, cue.t57Discrimination);
  const fiskeP = enter(ms, cue.t57Fiske);

  const threeP = enter(ms, cue.t58Three);
  const mentalP = enter(ms, cue.t58Mental);
  const behavioralP = enter(ms, cue.t58Behavioral);
  const directionP = enter(ms, cue.t58Direction);
  const twoP = enter(ms, cue.t58Two);

  const anyP = enter(ms, cue.t59Any);
  const skinP = enter(ms, cue.t59Skin);
  const ancestryP = enter(ms, cue.t59Ancestry);
  const t59BiasP = enter(ms, cue.t59Bias);
  const hostilityP = enter(ms, cue.t59Hostility);
  const treatP = enter(ms, cue.t59Treat);

  const t60PersonP = enter(ms, cue.t60PersonToPerson);
  const zeroP = enter(ms, cue.t60Zero);
  const legP = enter(ms, cue.t60Legislatures);
  const courtsP = enter(ms, cue.t60Courts);
  const policeP = enter(ms, cue.t60Police);
  const creditP = enter(ms, cue.t60Credit);
  const militaryP = enter(ms, cue.t60Military);

  const origP = enter(ms, cue.t61Original);
  const assignsP = enter(ms, cue.t61Assigns);
  const t61BiasP = enter(ms, cue.t61Bias);
  const t61PrejP = enter(ms, cue.t61Prejudice);
  const t61DiscP = enter(ms, cue.t61Discrimination);
  const interpP = enter(ms, cue.t61Interpersonal);
  const exactP = enter(ms, cue.t61Exact);
  const scientificP = enter(ms, cue.t61Scientific);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const muted = color('color/text/muted');

  // Term triad configuration
  const triadTerms: readonly TriadTerm[] = [
    {kind: 'bias', title: 'BIAS'},
    {kind: 'prejudice', title: 'PREJUDICE'},
    {kind: 'discrimination', title: 'DISCRIMINATION'},
  ];
  const triadSources: readonly TriadSource[] = [
    ms >= cue.t57Bias ? {text: 'GREENWALD & BANAJI 1995', progress: biasSourceP} : null,
    ms >= cue.t57Prejudice ? {text: 'ALLPORT 1954', progress: prejudiceSourceP} : null,
    ms >= cue.t57Discrimination ? {text: 'FISKE 1998', progress: discriminationSourceP} : null,
  ];
  const triadBoxes: readonly Box[] = [L.biasBlock, L.prejudiceBlock, L.discriminationBlock];
  const triadStates = [lookP, lookP, lookP];

  // Group marks
  const groupMarks: GroupMarkSpec[] = [
    {id: 'p1', side: 'left', x: 0.3, y: 0.45, accent: 'ingroup', progress: directionP},
    {id: 'p2', side: 'left', x: 0.7, y: 0.45, accent: 'neutral', progress: directionP},
    {id: 'p3', side: 'right', x: 0.3, y: 0.45, accent: 'neutral', progress: directionP},
    {id: 'p4', side: 'right', x: 0.7, y: 0.45, accent: 'outgroup', progress: directionP},
  ];

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

      {/* Turn 58 / 59 / 60 Group Direction Field */}
      {!isTurn61 && ms >= cue.t58Direction && (
        <div data-turn-field="group-direction">
          <GroupDirectionField
            id="group-direction-main"
            box={L.groupField}
            marks={groupMarks}
            leftLabel="GROUP A"
            rightLabel="GROUP B"
            forwardProgress={twoP}
            reverseProgress={twoP}
            boundaryProgress={directionP}
          />
          {ms >= cue.t58Two && (
            <Label
              id="group-direction-two-label"
              box={L.directionLabel}
              size={22}
              weight={600}
              ink={gold}
              opacity={twoP}
            >
              ANY DIRECTION BETWEEN ANY TWO SOCIAL GROUPS
            </Label>
          )}
        </div>
      )}

      {/* Turn 58 Locus Labels & Sockets (above group field) */}
      {isTurn58 && (
        <div data-turn="58-locus">
          <Label
            id="inside-individual-label"
            box={{x: 140, y: 545, w: 320, h: 30}}
            size={22}
            weight={600}
            ink={gold}
            opacity={mentalP}
          >
            INSIDE AN INDIVIDUAL
          </Label>
          {ms >= cue.t58Behavioral && (
            <Label
              id="between-individuals-label"
              box={{x: 760, y: 545, w: 320, h: 30}}
              size={22}
              weight={600}
              ink={orange}
              opacity={behavioralP}
            >
              BETWEEN INDIVIDUALS
            </Label>
          )}
        </div>
      )}

      {/* Turn 59 Varied Human Marks & Ubiquity (above and inside group field) */}
      {isTurn59 && (
        <div data-turn="59-ubiquity" style={{opacity: anyP}}>
          {/* Top row labels above group field */}
          <Label
            id="any-human-label"
            box={{x: 140, y: 545, w: 260, h: 30}}
            size={20}
            weight={600}
            ink={primary}
          >
            ANY HUMAN BEING
          </Label>
          {ms >= cue.t59Skin && (
            <Label
              id="any-skin-label"
              box={{x: 430, y: 545, w: 220, h: 30}}
              size={20}
              weight={600}
              ink={gold}
              opacity={skinP}
            >
              ANY SKIN COLOR
            </Label>
          )}
          {ms >= cue.t59Ancestry && (
            <Label
              id="any-ancestry-label"
              box={{x: 680, y: 545, w: 200, h: 30}}
              size={20}
              weight={600}
              ink={primary}
              opacity={ancestryP}
            >
              ANY ANCESTRY
            </Label>
          )}

          {/* Lower row labels inside group field */}
          {ms >= cue.t59Bias && (
            <Label
              id="mental-bias-label"
              box={{x: 160, y: 770, w: 200, h: 28}}
              size={20}
              weight={600}
              ink={gold}
              opacity={t59BiasP}
            >
              MENTAL BIAS
            </Label>
          )}
          {ms >= cue.t59Hostility && (
            <Label
              id="rigid-hostility-label"
              box={{x: 800, y: 770, w: 220, h: 28}}
              size={20}
              weight={600}
              ink={raceRed}
              opacity={hostilityP}
            >
              RIGID HOSTILITY
            </Label>
          )}
          {ms >= cue.t59Treat && (
            <Label
              id="unequal-treatment-t59-label"
              box={{x: 548, y: 770, w: 204, h: 28}}
              size={20}
              weight={600}
              ink={orange}
              opacity={treatP}
            >
              UNEQUAL TREATMENT
            </Label>
          )}
        </div>
      )}

      {/* Turn 60 State-Power Rack Separation */}
      {isTurn60 && (
        <div data-turn="60" style={{opacity: t60PersonP}}>
          <Label
            id="person-actions-heading"
            box={L.personToPersonLabel}
            size={24}
            weight={650}
            sans
            ink={primary}
          >
            PERSON-TO-PERSON ACTIONS
          </Label>

          {/* State-Power Rack Frame */}
          <Panel id="state-power-rack" box={L.stateRack} accent="color/line/hairline" />
          {ms >= cue.t60Zero && (
            <Label
              id="zero-control-heading"
              box={L.rackHeading}
              size={20}
              weight={600}
              ink={raceRed}
              opacity={zeroP}
            >
              REQUIRES ZERO CONTROL OVER
            </Label>
          )}

          {/* 1: State Legislatures */}
          {ms >= cue.t60Legislatures && (
            <div data-rack-item="1" style={{opacity: legP}}>
              <Panel id="rack-item-1" box={{x: 1304, y: 595, w: 472, h: 50}} />
              <div
                {...shapeAttrs('icon-leg', {x: 1318, y: 607, w: 26, h: 26}, 'mark', 'icon')}
                style={{position: 'absolute', left: 1318, top: 607, width: 26, height: 26, color: raceRed}}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 21 H21 M4 10 L12 3 L20 10 H4 Z M6 10 V18 M10 10 V18 M14 10 V18 M18 10 V18" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <Label
                id="rack-label-leg"
                box={{x: 1354, y: 608, w: 400, h: 26}}
                size={20}
                weight={500}
                ink={primary}
              >
                STATE LEGISLATURES
              </Label>
            </div>
          )}

          {/* 2: Appellate Courts */}
          {ms >= cue.t60Courts && (
            <div data-rack-item="2" style={{opacity: courtsP}}>
              <Panel id="rack-item-2" box={{x: 1304, y: 652, w: 472, h: 50}} />
              <div
                {...shapeAttrs('icon-courts', {x: 1318, y: 664, w: 26, h: 26}, 'mark', 'icon')}
                style={{position: 'absolute', left: 1318, top: 664, width: 26, height: 26, color: raceRed}}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3 V21 M5 8 L12 6 L19 8 M5 8 L2 14 H8 L5 8 Z M19 8 L16 14 H22 L19 8 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <Label
                id="rack-label-courts"
                box={{x: 1354, y: 665, w: 400, h: 26}}
                size={20}
                weight={500}
                ink={primary}
              >
                APPELLATE COURTS
              </Label>
            </div>
          )}

          {/* 3: Police Departments */}
          {ms >= cue.t60Police && (
            <div data-rack-item="3" style={{opacity: policeP}}>
              <Panel id="rack-item-3" box={{x: 1304, y: 709, w: 472, h: 50}} />
              <div
                {...shapeAttrs('icon-police', {x: 1318, y: 721, w: 26, h: 26}, 'mark', 'icon')}
                style={{position: 'absolute', left: 1318, top: 721, width: 26, height: 26, color: raceRed}}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3 L4 7 V12 C4 17 8 20 12 21 C16 20 20 17 20 12 V7 L12 3 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <Label
                id="rack-label-police"
                box={{x: 1354, y: 722, w: 400, h: 26}}
                size={20}
                weight={500}
                ink={primary}
              >
                POLICE DEPARTMENTS
              </Label>
            </div>
          )}

          {/* 4: Credit Markets */}
          {ms >= cue.t60Credit && (
            <div data-rack-item="4" style={{opacity: creditP}}>
              <Panel id="rack-item-4" box={{x: 1304, y: 766, w: 472, h: 50}} />
              <div
                {...shapeAttrs('icon-credit', {x: 1318, y: 778, w: 26, h: 26}, 'mark', 'icon')}
                style={{position: 'absolute', left: 1318, top: 778, width: 26, height: 26, color: raceRed}}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 6 H21 V18 H3 Z M3 10 H21 M7 15 H9" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <Label
                id="rack-label-credit"
                box={{x: 1354, y: 779, w: 400, h: 26}}
                size={20}
                weight={500}
                ink={primary}
              >
                CREDIT MARKETS
              </Label>
            </div>
          )}

          {/* 5: Military Force */}
          {ms >= cue.t60Military && (
            <div data-rack-item="5" style={{opacity: militaryP}}>
              <Panel id="rack-item-5" box={{x: 1304, y: 823, w: 472, h: 50}} />
              <div
                {...shapeAttrs('icon-military', {x: 1318, y: 835, w: 26, h: 26}, 'mark', 'icon')}
                style={{position: 'absolute', left: 1318, top: 835, width: 26, height: 26, color: raceRed}}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <Label
                id="rack-label-military"
                box={{x: 1354, y: 836, w: 400, h: 26}}
                size={20}
                weight={500}
                ink={primary}
              >
                MILITARY FORCE
              </Label>
            </div>
          )}
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

          {/* Title Header */}
          <Label
            id="book-title-label"
            box={{x: 270, y: 776, w: 340, h: 32}}
            size={24}
            weight={650}
            sans
            ink={gold}
          >
            THE ORIGINAL POWER
          </Label>

          {/* Classification Banner */}
          {ms >= cue.t61Interpersonal && (
            <Label
              id="interpersonal-class-behavior"
              box={{x: 640, y: 776, w: 1000, h: 32}}
              size={26}
              weight={650}
              sans
              ink={primary}
              opacity={interpP}
            >
              INTERPERSONAL CLASS OF SOCIAL BEHAVIOR
            </Label>
          )}

          {/* Sockets for Three Terms */}
          {ms >= cue.t61Assigns && (
            <div data-strip-sockets="true" style={{opacity: assignsP}}>
              {/* Bias Socket */}
              <Panel
                id="socket-strip-bias"
                box={{x: 270, y: 824, w: 380, h: 56}}
                accent={ms >= cue.t61Bias ? 'color/fill/gold' : 'color/line/hairline'}
              />
              <Label
                id="strip-term-bias"
                box={{x: 290, y: 836, w: 340, h: 32}}
                size={24}
                weight={650}
                sans
                ink={gold}
                opacity={t61BiasP}
              >
                BIAS
              </Label>

              {/* Prejudice Socket */}
              <Panel
                id="socket-strip-prejudice"
                box={{x: 690, y: 824, w: 380, h: 56}}
                accent={ms >= cue.t61Prejudice ? 'color/marker/race' : 'color/line/hairline'}
              />
              <Label
                id="strip-term-prejudice"
                box={{x: 710, y: 836, w: 340, h: 32}}
                size={24}
                weight={650}
                sans
                ink={raceRed}
                opacity={t61PrejP}
              >
                PREJUDICE
              </Label>

              {/* Discrimination Socket */}
              <Panel
                id="socket-strip-discrimination"
                box={{x: 1110, y: 824, w: 380, h: 56}}
                accent={ms >= cue.t61Discrimination ? 'color/text/accent' : 'color/line/hairline'}
              />
              <Label
                id="strip-term-discrimination"
                box={{x: 1130, y: 836, w: 340, h: 32}}
                size={24}
                weight={650}
                sans
                ink={orange}
                opacity={t61DiscP}
              >
                DISCRIMINATION
              </Label>
            </div>
          )}

          {/* Exact Scientific Names */}
          {ms >= cue.t61Scientific && (
            <Label
              id="exact-scientific-names"
              box={{x: 270, y: 888, w: 420, h: 26}}
              size={20}
              weight={500}
              ink={gold}
              opacity={scientificP}
            >
              EXACT SCIENTIFIC NAMES
            </Label>
          )}
        </div>
      )}

      {/* Source Line */}
      <Label
        id="interpersonal-source-line"
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
