import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  arrowBarbs,
  clamp01,
  lineAttrs,
  pathFrom,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const UNEQUAL_TREATMENT_LAYOUT = {
  t55Banner: {x: 120, y: 115, w: 1680, h: 72},
  pipeline: {x: 120, y: 215, w: 1680, h: 660},
  stereotypeNode: {x: 150, y: 290, w: 460, h: 490},
  prejudiceNode: {x: 730, y: 290, w: 460, h: 490},
  discriminationNode: {x: 1310, y: 290, w: 460, h: 490},
  pipelineArrow1: [[614, 535], [726, 535]] as const satisfies readonly Point[],
  pipelineArrow2: [[1194, 535], [1306, 535]] as const satisfies readonly Point[],
  transitBar: {x: 150, y: 795, w: 1620, h: 64},

  t56Banner: {x: 110, y: 115, w: 1700, h: 72},
  treatmentTray: {x: 110, y: 215, w: 1700, h: 660},
  trayHeading: {x: 140, y: 233, w: 1050, h: 40},
  traySubheading: {x: 1220, y: 239, w: 560, h: 28},
  cards: [
    {x: 140, y: 295, w: 380, h: 562},
    {x: 560, y: 295, w: 380, h: 562},
    {x: 980, y: 295, w: 380, h: 562},
    {x: 1400, y: 295, w: 380, h: 562},
  ] as const satisfies readonly Box[],
  source: {x: 116, y: 964, w: 740, h: 26},
} as const;

export function UnequalTreatment({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t55ThreePart: useCue('t55ThreePart').at,
    t55Stereotype: useCue('t55Stereotype').at,
    t55Belief: useCue('t55Belief').at,
    t55Prejudice: useCue('t55Prejudice').at,
    t55Hostility: useCue('t55Hostility').at,
    t55Discrimination: useCue('t55Discrimination').at,
    t55Unequal: useCue('t55Unequal').at,
    t55Membership: useCue('t55Membership').at,

    t56Unequal: useCue('t56Unequal').at,
    t56Verbal: useCue('t56Verbal').at,
    t56Exclusion: useCue('t56Exclusion').at,
    t56Customer: useCue('t56Customer').at,
    t56Grading: useCue('t56Grading').at,
    t56Refusing: useCue('t56Refusing').at,
    t56Apartment: useCue('t56Apartment').at,
    t56Qualified: useCue('t56Qualified').at,
    t56Tenant: useCue('t56Tenant').at,
  };

  const L = UNEQUAL_TREATMENT_LAYOUT;
  const isTurn56 = ms >= cue.t56Unequal;
  const hasThreePart = ms >= cue.t55ThreePart;

  const turn55P = Math.max(0.25, enter(ms, cue.t55ThreePart));
  const beliefP = enter(ms, cue.t55Belief);
  const prejudiceP = enter(ms, cue.t55Prejudice);
  const hostilityP = enter(ms, cue.t55Hostility);
  const discriminationP = enter(ms, cue.t55Discrimination);
  const unequalP = enter(ms, cue.t55Unequal);

  const t56UnequalP = Math.max(0.25, enter(ms, cue.t56Unequal));
  const verbalP = enter(ms, cue.t56Verbal);
  const customerP = enter(ms, cue.t56Customer);
  const gradingP = enter(ms, cue.t56Grading);
  const refusingP = enter(ms, cue.t56Refusing);
  const apartmentP = enter(ms, cue.t56Apartment);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');
  const hairline = color('color/line/hairline');

  const arrow1Head = arrowBarbs(L.pipelineArrow1[1], 1, 0, 14, 8);
  const arrow2Head = arrowBarbs(L.pipelineArrow2[1], 1, 0, 14, 8);

  const tokenProgress = clamp01(progress(ms, cue.t55Membership, cue.t56Unequal));
  const tokenDotX = Math.round(380 + tokenProgress * (1540 - 380));

  return (
    <StageSceneFrame segment={segment}>
      {/* Turn 55 Centered Full-Frame Three-Stage Path */}
      {!isTurn56 && (
        <div data-turn="55" style={{opacity: turn55P}}>
          {/* Top Context Banner */}
          <Panel id="t55-banner-frame" box={L.t55Banner} accent="color/line/hairline" />
          <Label
            id="t55-banner-title"
            box={{x: 148, y: 133, w: 1020, h: 36}}
            size={28}
            weight={650}
            sans
            ink={primary}
          >
            THREE-PART TAXONOMY · DIRECTIONAL PATHWAY
          </Label>
          <Label
            id="t55-banner-tag"
            box={{x: 1190, y: 137, w: 580, h: 28}}
            size={20}
            weight={500}
            align="right"
            ink={gold}
          >
            FISKE 1998 · COGNITIVE → AFFECTIVE → BEHAVIORAL
          </Label>

          {/* Main Pipeline Frame */}
          <Panel id="turn55-pipeline-frame" box={L.pipeline} accent="color/line/hairline" />
          <Label
            id="pipeline-header-title"
            box={{x: 150, y: 233, w: 980, h: 36}}
            size={28}
            weight={650}
            sans
            ink={primary}
          >
            SEQUENTIAL INTERPERSONAL PIPELINE
          </Label>
          <Label
            id="pipeline-header-tag"
            box={{x: 1160, y: 237, w: 610, h: 28}}
            size={20}
            weight={500}
            align="right"
            ink={muted}
          >
            STAGE 01 → STAGE 02 → STAGE 03
          </Label>

          {/* Node 1: Stereotype */}
          <Panel id="stereotype-node" box={L.stereotypeNode} accent="color/fill/gold" />
          <div
            {...shapeAttrs('glyph-stereotype', {x: 174, y: 308, w: 52, h: 52}, 'mark', 'glyph-stereotype')}
            style={{position: 'absolute', left: 174, top: 308, width: 52, height: 52, color: primary}}
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
                    fill={ms >= cue.t55Belief ? gold : 'none'}
                    fillOpacity={ms >= cue.t55Belief ? 0.85 : 0}
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                )),
              )}
            </svg>
          </div>
          <Label
            id="stereotype-title"
            box={{x: 242, y: 312, w: 344, h: 42}}
            size={32}
            weight={650}
            sans
            ink={primary}
          >
            {hasThreePart ? 'STEREOTYPE' : 'COGNITIVE NODE'}
          </Label>
          <Label
            id="stereotype-sublabel"
            box={{x: 174, y: 374, w: 412, h: 34}}
            size={22}
            weight={600}
            ink={ms >= cue.t55Stereotype ? gold : muted}
          >
            {ms >= cue.t55Stereotype ? 'GROUP BELIEF' : 'STAGE 01 · COGNITIVE SCHEMA'}
          </Label>
          <div
            {...shapeAttrs('belief-grid-frame', {x: 174, y: 424, w: 412, h: 190}, 'mark', 'belief-grid-frame')}
            style={{
              position: 'absolute',
              left: 174,
              top: 424,
              width: 412,
              height: 190,
              border: `1px dashed ${ms >= cue.t55Belief ? gold : hairline}`,
              borderRadius: 10,
              background: color('color/fill/panel-wash'),
            }}
          >
            <svg width="412" height="190" viewBox="0 0 412 190" aria-hidden="true">
              {[0, 1, 2].flatMap(row =>
                [0, 1, 2].map(col => {
                  const cx = 86 + col * 120;
                  const cy = 40 + row * 55;
                  const active = ms >= cue.t55Belief;
                  return (
                    <g key={`cell-${row}-${col}`}>
                      <rect
                        x={cx - 34}
                        y={cy - 16}
                        width="68"
                        height="32"
                        rx="6"
                        fill={active ? gold : 'none'}
                        fillOpacity={active ? 0.18 * beliefP : 0}
                        stroke={active ? gold : muted}
                        strokeWidth="2"
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={active ? 8 : 5}
                        fill={active ? gold : muted}
                        opacity={active ? 0.4 + 0.6 * beliefP : 0.4}
                      />
                    </g>
                  );
                }),
              )}
            </svg>
          </div>
          <Label
            id="stereotype-body"
            box={{x: 174, y: 630, w: 412, h: 80}}
            size={28}
            weight={500}
            lh={1.22}
            sans
            ink={soft}
          >
            Internal cognitive schema assigning category traits.
          </Label>
          <Label
            id="stereotype-footer"
            box={{x: 174, y: 732, w: 412, h: 30}}
            size={20}
            weight={500}
            ink={muted}
          >
            LOCUS · INTERNAL COGNITION
          </Label>

          {/* Pipeline Arrows 1 & 2 */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path
              {...lineAttrs('pipeline-arrow-1', L.pipelineArrow1)}
              d={pathFrom(L.pipelineArrow1)}
              fill="none"
              stroke={gold}
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <path
              {...lineAttrs('pipeline-arrow-1-head', arrow1Head)}
              d={pathFrom(arrow1Head)}
              fill="none"
              stroke={gold}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              {...lineAttrs('pipeline-arrow-2', L.pipelineArrow2)}
              d={pathFrom(L.pipelineArrow2)}
              fill="none"
              stroke={orange}
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <path
              {...lineAttrs('pipeline-arrow-2-head', arrow2Head)}
              d={pathFrom(arrow2Head)}
              fill="none"
              stroke={orange}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Node 2: Prejudice */}
          <Panel
            id="prejudice-node"
            box={L.prejudiceNode}
            accent={ms >= cue.t55Prejudice ? 'color/marker/race' : 'color/line/hairline'}
          />
          <div
            {...shapeAttrs('glyph-prejudice', {x: 754, y: 308, w: 52, h: 52}, 'mark', 'glyph-prejudice')}
            style={{
              position: 'absolute',
              left: 754,
              top: 308,
              width: 52,
              height: 52,
              color: ms >= cue.t55Prejudice ? raceRed : muted,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
              <path
                d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z"
                fill={ms >= cue.t55Prejudice ? raceRed : 'none'}
                fillOpacity={ms >= cue.t55Prejudice ? 0.3 * prejudiceP : 0}
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <Label
            id="prejudice-title"
            box={{x: 822, y: 312, w: 344, h: 42}}
            size={32}
            weight={650}
            sans
            ink={ms >= cue.t55Prejudice ? raceRed : primary}
          >
            {hasThreePart ? 'PREJUDICE' : 'AFFECTIVE NODE'}
          </Label>
          <Label
            id="prejudice-sublabel"
            box={{x: 754, y: 374, w: 412, h: 34}}
            size={22}
            weight={600}
            ink={ms >= cue.t55Hostility ? raceRed : muted}
          >
            {ms >= cue.t55Hostility ? 'EMOTIONAL HOSTILITY' : 'STAGE 02 · AFFECTIVE TONE'}
          </Label>
          <div
            {...shapeAttrs('hostility-field-frame', {x: 754, y: 424, w: 412, h: 190}, 'mark', 'hostility-field-frame')}
            style={{
              position: 'absolute',
              left: 754,
              top: 424,
              width: 412,
              height: 190,
              border: `1px solid ${ms >= cue.t55Hostility ? raceRed : hairline}`,
              borderRadius: 10,
              background: color('color/fill/panel-wash'),
            }}
          >
            <svg width="412" height="190" viewBox="0 0 412 190" aria-hidden="true">
              <circle
                cx="206"
                cy="95"
                r="68"
                fill="none"
                stroke={ms >= cue.t55Prejudice ? raceRed : muted}
                strokeWidth="2"
                strokeDasharray="6 5"
                opacity={ms >= cue.t55Prejudice ? 0.5 + 0.5 * hostilityP : 0.35}
              />
              <circle
                cx="206"
                cy="95"
                r="44"
                fill="none"
                stroke={ms >= cue.t55Prejudice ? raceRed : muted}
                strokeWidth="2.5"
                opacity={ms >= cue.t55Prejudice ? 0.65 + 0.35 * hostilityP : 0.4}
              />
              <circle
                cx="206"
                cy="95"
                r="22"
                fill={ms >= cue.t55Prejudice ? raceRed : muted}
                opacity={ms >= cue.t55Hostility ? 0.65 : 0.28}
              />
              <line x1="40" y1="95" x2="122" y2="95" stroke={raceRed} strokeWidth="2" opacity={0.55} />
              <line x1="290" y1="95" x2="372" y2="95" stroke={raceRed} strokeWidth="2" opacity={0.55} />
            </svg>
          </div>
          <Label
            id="prejudice-body"
            box={{x: 754, y: 630, w: 412, h: 80}}
            size={28}
            weight={500}
            lh={1.22}
            sans
            ink={soft}
          >
            Internal affective stance directed at the category.
          </Label>
          <Label
            id="prejudice-footer"
            box={{x: 754, y: 732, w: 412, h: 30}}
            size={20}
            weight={500}
            ink={muted}
          >
            LOCUS · INTERNAL AFFECT
          </Label>

          {/* Node 3: Discrimination */}
          <Panel
            id="discrimination-node"
            box={L.discriminationNode}
            accent={ms >= cue.t55Discrimination ? 'color/text/accent' : 'color/line/hairline'}
          />
          <div
            {...shapeAttrs('glyph-discrimination', {x: 1334, y: 308, w: 52, h: 52}, 'mark', 'glyph-discrimination')}
            style={{
              position: 'absolute',
              left: 1334,
              top: 308,
              width: 52,
              height: 52,
              color: ms >= cue.t55Discrimination ? orange : muted,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
              <path
                d="M7 24 H38 M28 13 L39 24 L28 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Label
            id="discrimination-title"
            box={{x: 1402, y: 312, w: 344, h: 42}}
            size={32}
            weight={650}
            sans
            ink={ms >= cue.t55Discrimination ? orange : primary}
          >
            {hasThreePart ? 'DISCRIMINATION' : 'BEHAVIORAL NODE'}
          </Label>
          <Label
            id="discrimination-sublabel"
            box={{x: 1334, y: 374, w: 412, h: 34}}
            size={22}
            weight={600}
            ink={ms >= cue.t55Unequal ? orange : muted}
          >
            {ms >= cue.t55Unequal ? 'UNEQUAL TREATMENT' : 'STAGE 03 · OUTWARD CONDUCT'}
          </Label>
          <div
            {...shapeAttrs('action-vector-frame', {x: 1334, y: 424, w: 412, h: 190}, 'mark', 'action-vector-frame')}
            style={{
              position: 'absolute',
              left: 1334,
              top: 424,
              width: 412,
              height: 190,
              border: `1px solid ${ms >= cue.t55Unequal ? orange : hairline}`,
              borderRadius: 10,
              background: color('color/fill/panel-wash'),
            }}
          >
            <svg width="412" height="190" viewBox="0 0 412 190" aria-hidden="true">
              <rect
                x="48"
                y="45"
                width="316"
                height="100"
                rx="8"
                fill="none"
                stroke={ms >= cue.t55Discrimination ? orange : muted}
                strokeWidth="2"
                opacity={ms >= cue.t55Discrimination ? 0.5 + 0.5 * discriminationP : 0.35}
              />
              <path
                d="M88 95 H312 M284 71 L316 95 L284 119"
                fill="none"
                stroke={ms >= cue.t55Discrimination ? orange : muted}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={ms >= cue.t55Unequal ? 0.6 + 0.4 * unequalP : 0.45}
              />
            </svg>
          </div>
          <Label
            id="discrimination-body"
            box={{x: 1334, y: 630, w: 412, h: 80}}
            size={28}
            weight={500}
            lh={1.22}
            sans
            ink={soft}
          >
            Outward differential act toward category members.
          </Label>
          <Label
            id="discrimination-footer"
            box={{x: 1334, y: 732, w: 412, h: 30}}
            size={20}
            weight={500}
            ink={muted}
          >
            LOCUS · OBSERVABLE BEHAVIOR
          </Label>

          {/* Bottom Pathway Transit Bar */}
          <Panel
            id="pathway-transit-bar"
            box={L.transitBar}
            accent={ms >= cue.t55Membership ? 'color/fill/gold' : 'color/line/hairline'}
          />
          <Label
            id="pathway-transit-label"
            box={{x: 178, y: 809, w: 940, h: 36}}
            size={28}
            weight={650}
            sans
            ink={primary}
          >
            PATHWAY SIGNAL · COGNITION TO AFFECT TO CONDUCT
          </Label>
          <Label
            id="membership-token-label"
            box={{x: 1140, y: 809, w: 600, h: 36}}
            size={28}
            weight={650}
            sans
            align="right"
            ink={ms >= cue.t55Membership ? gold : muted}
          >
            {ms >= cue.t55Membership ? 'GROUP MEMBERSHIP' : 'THREE-STAGE TRANSMISSION'}
          </Label>
          {ms >= cue.t55Membership && (
            <div
              data-membership-token="true"
              {...shapeAttrs('membership-token-dot', {x: tokenDotX - 6, y: 782, w: 12, h: 12}, 'mark', 'membership-token-dot')}
              style={{
                position: 'absolute',
                left: tokenDotX - 6,
                top: 782,
                width: 12,
                height: 12,
                borderRadius: 6,
                background: gold,
              }}
            />
          )}
        </div>
      )}

      {/* Turn 56 Full-Frame Treatment Tray */}
      {isTurn56 && (
        <div data-turn="56" style={{opacity: t56UnequalP}}>
          {/* Top Context Banner */}
          <Panel id="t56-banner-frame" box={L.t56Banner} accent="color/text/accent" />
          <Label
            id="t56-banner-title"
            box={{x: 140, y: 133, w: 920, h: 36}}
            size={28}
            weight={650}
            sans
            ink={orange}
          >
            DISCRIMINATION · OBSERVABLE ACTION
          </Label>
          <Label
            id="t56-banner-tag"
            box={{x: 1100, y: 137, w: 680, h: 28}}
            size={20}
            weight={500}
            align="right"
            ink={muted}
          >
            FISKE 1998 · BEHAVIORAL COMPONENT IN EVERYDAY LIFE
          </Label>

          {/* Treatment Tray Container */}
          <Panel id="treatment-tray" box={L.treatmentTray} />
          <Label
            id="tray-heading-label"
            box={L.trayHeading}
            size={32}
            weight={650}
            sans
            ink={primary}
          >
            PERSON-TO-PERSON UNEQUAL TREATMENT
          </Label>
          <Label
            id="tray-sub-label"
            box={L.traySubheading}
            size={20}
            weight={500}
            align="right"
            ink={gold}
          >
            FOUR OBSERVABLE INTERPERSONAL CASES
          </Label>

          {/* Card 1: Verbal Exclusion */}
          <Panel id="card-1-panel" box={L.cards[0]} accent={ms >= cue.t56Verbal ? 'color/text/accent' : 'color/line/hairline'} />
          <div data-card="1">
            <Label
              id="card-1-slot"
              box={{x: L.cards[0].x + 24, y: 313, w: 332, h: 28}}
              size={20}
              weight={500}
              ink={muted}
            >
              CASE 01 · SPEECH
            </Label>
            <Label
              id="card-1-title"
              box={{x: L.cards[0].x + 24, y: 350, w: 332, h: 72}}
              size={28}
              weight={650}
              lh={1.2}
              sans
              ink={ms >= cue.t56Exclusion ? primary : soft}
            >
              {ms >= cue.t56Exclusion ? 'VERBAL EXCLUSION' : 'INTERPERSONAL CASE 01'}
            </Label>
            <div
              {...shapeAttrs('speech-boundary-graphic', {x: L.cards[0].x + 24, y: 436, w: 332, h: 220}, 'mark', 'speech-boundary-graphic')}
              style={{
                position: 'absolute',
                left: L.cards[0].x + 24,
                top: 436,
                width: 332,
                height: 220,
                border: `1px solid ${ms >= cue.t56Verbal ? orange : hairline}`,
                borderRadius: 12,
                background: color('color/fill/panel-wash'),
              }}
            >
              <svg width="332" height="220" viewBox="0 0 332 220" aria-hidden="true">
                <path
                  d="M42 42 H250 C266 42 280 56 280 72 V136 C280 152 266 166 250 166 H124 L74 198 V166 H42 C26 166 12 152 12 136 V72 C12 56 26 42 42 42 Z"
                  fill="none"
                  stroke={ms >= cue.t56Verbal ? orange : muted}
                  strokeWidth="2.5"
                />
                <line x1="54" y1="86" x2="226" y2="86" stroke={muted} strokeWidth="3" strokeDasharray="6 6" />
                <line x1="54" y1="116" x2="186" y2="116" stroke={muted} strokeWidth="3" strokeDasharray="6 6" />
                <line
                  x1="166"
                  y1="30"
                  x2="166"
                  y2="178"
                  stroke={raceRed}
                  strokeWidth="3.5"
                  opacity={ms >= cue.t56Verbal ? 0.5 + 0.5 * verbalP : 0.35}
                />
              </svg>
            </div>
            <Label
              id="card-1-body"
              box={{x: L.cards[0].x + 24, y: 672, w: 332, h: 112}}
              size={28}
              weight={500}
              lh={1.22}
              sans
              ink={soft}
            >
              Direct barrier in face-to-face group talk.
            </Label>
            <Label
              id="card-1-tag"
              box={{x: L.cards[0].x + 24, y: 807, w: 332, h: 32}}
              size={20}
              weight={600}
              ink={ms >= cue.t56Exclusion ? gold : muted}
              align="center"
            >
              {ms >= cue.t56Exclusion ? 'SPEECH BOUNDARY' : 'INTERACTION DOMAIN'}
            </Label>
          </div>

          {/* Card 2: Worse Customer Service */}
          <Panel id="card-2-panel" box={L.cards[1]} accent={ms >= cue.t56Customer ? 'color/text/accent' : 'color/line/hairline'} />
          <div data-card="2">
            <Label
              id="card-2-slot"
              box={{x: L.cards[1].x + 24, y: 313, w: 332, h: 28}}
              size={20}
              weight={500}
              ink={muted}
            >
              CASE 02 · COMMERCE
            </Label>
            <Label
              id="card-2-title"
              box={{x: L.cards[1].x + 24, y: 350, w: 332, h: 72}}
              size={28}
              weight={650}
              lh={1.2}
              sans
              ink={ms >= cue.t56Customer ? primary : soft}
            >
              {ms >= cue.t56Customer ? 'WORSE CUSTOMER SERVICE' : 'INTERPERSONAL CASE 02'}
            </Label>
            <div
              {...shapeAttrs('service-counter-graphic', {x: L.cards[1].x + 24, y: 436, w: 332, h: 220}, 'mark', 'service-counter-graphic')}
              style={{
                position: 'absolute',
                left: L.cards[1].x + 24,
                top: 436,
                width: 332,
                height: 220,
                border: `1px solid ${ms >= cue.t56Customer ? orange : hairline}`,
                borderRadius: 12,
                background: color('color/fill/panel-wash'),
              }}
            >
              <svg width="332" height="220" viewBox="0 0 332 220" aria-hidden="true">
                <line x1="24" y1="134" x2="308" y2="134" stroke={primary} strokeWidth="3" />
                <path
                  d="M126 134 C126 94 206 94 206 134 Z"
                  fill="none"
                  stroke={ms >= cue.t56Customer ? gold : muted}
                  strokeWidth="2.5"
                />
                <line x1="166" y1="82" x2="166" y2="94" stroke={gold} strokeWidth="3" />
                <rect
                  x="44"
                  y="158"
                  width="104"
                  height="26"
                  rx="4"
                  fill={gold}
                  fillOpacity={ms >= cue.t56Customer ? 0.45 * customerP : 0.2}
                />
                <rect
                  x="184"
                  y="158"
                  width="104"
                  height="26"
                  rx="4"
                  fill={orange}
                  fillOpacity={ms >= cue.t56Customer ? 0.45 * customerP : 0.2}
                />
              </svg>
            </div>
            <Label
              id="card-2-body"
              box={{x: L.cards[1].x + 24, y: 672, w: 332, h: 112}}
              size={28}
              weight={500}
              lh={1.22}
              sans
              ink={soft}
            >
              Unequal treatment at a retail counter.
            </Label>
            <Label
              id="card-2-tag"
              box={{x: L.cards[1].x + 24, y: 807, w: 332, h: 32}}
              size={20}
              weight={600}
              ink={ms >= cue.t56Customer ? gold : muted}
              align="center"
            >
              {ms >= cue.t56Customer ? 'SERVICE COUNTER' : 'COMMERCE DOMAIN'}
            </Label>
          </div>

          {/* Card 3: Biased Grading */}
          <Panel id="card-3-panel" box={L.cards[2]} accent={ms >= cue.t56Grading ? 'color/text/accent' : 'color/line/hairline'} />
          <div data-card="3">
            <Label
              id="card-3-slot"
              box={{x: L.cards[2].x + 24, y: 313, w: 332, h: 28}}
              size={20}
              weight={500}
              ink={muted}
            >
              CASE 03 · EVALUATION
            </Label>
            <Label
              id="card-3-title"
              box={{x: L.cards[2].x + 24, y: 350, w: 332, h: 72}}
              size={28}
              weight={650}
              lh={1.2}
              sans
              ink={ms >= cue.t56Grading ? primary : soft}
            >
              {ms >= cue.t56Grading ? 'BIASED GRADING' : 'INTERPERSONAL CASE 03'}
            </Label>
            <div
              {...shapeAttrs('grading-sheet-graphic', {x: L.cards[2].x + 24, y: 436, w: 332, h: 220}, 'mark', 'grading-sheet-graphic')}
              style={{
                position: 'absolute',
                left: L.cards[2].x + 24,
                top: 436,
                width: 332,
                height: 220,
                border: `1px solid ${ms >= cue.t56Grading ? orange : hairline}`,
                borderRadius: 12,
                background: color('color/fill/panel-wash'),
              }}
            >
              <svg width="332" height="220" viewBox="0 0 332 220" aria-hidden="true">
                <rect x="56" y="24" width="220" height="172" rx="6" fill="none" stroke={primary} strokeWidth="2" />
                <line x1="86" y1="64" x2="236" y2="64" stroke={muted} strokeWidth="2" />
                <line x1="86" y1="98" x2="236" y2="98" stroke={muted} strokeWidth="2" />
                <line x1="86" y1="132" x2="236" y2="132" stroke={muted} strokeWidth="2" />
                <circle
                  cx="216"
                  cy="64"
                  r="16"
                  fill="none"
                  stroke={raceRed}
                  strokeWidth="2.5"
                  opacity={ms >= cue.t56Grading ? 0.5 + 0.5 * gradingP : 0.35}
                />
                <line
                  x1="204"
                  y1="64"
                  x2="228"
                  y2="64"
                  stroke={raceRed}
                  strokeWidth="2.5"
                  opacity={ms >= cue.t56Grading ? 0.5 + 0.5 * gradingP : 0.35}
                />
              </svg>
            </div>
            <Label
              id="card-3-body"
              box={{x: L.cards[2].x + 24, y: 672, w: 332, h: 112}}
              size={28}
              weight={500}
              lh={1.22}
              sans
              ink={soft}
            >
              Skewed marks on identical student work.
            </Label>
            <Label
              id="card-3-tag"
              box={{x: L.cards[2].x + 24, y: 807, w: 332, h: 32}}
              size={20}
              weight={600}
              ink={ms >= cue.t56Grading ? gold : muted}
              align="center"
            >
              {ms >= cue.t56Grading ? 'GRADING SHEET' : 'EVALUATION DOMAIN'}
            </Label>
          </div>

          {/* Card 4: Rental Refusal */}
          <Panel id="card-4-panel" box={L.cards[3]} accent={ms >= cue.t56Refusing ? 'color/text/accent' : 'color/line/hairline'} />
          <div data-card="4">
            <Label
              id="card-4-slot"
              box={{x: L.cards[3].x + 24, y: 313, w: 332, h: 28}}
              size={20}
              weight={500}
              ink={muted}
            >
              CASE 04 · HOUSING
            </Label>
            <Label
              id="card-4-title"
              box={{x: L.cards[3].x + 24, y: 350, w: 332, h: 72}}
              size={28}
              weight={650}
              lh={1.2}
              sans
              ink={ms >= cue.t56Refusing ? primary : soft}
            >
              {ms >= cue.t56Refusing ? 'RENTAL REFUSAL' : 'INTERPERSONAL CASE 04'}
            </Label>
            <div
              {...shapeAttrs('rental-refusal-graphic', {x: L.cards[3].x + 24, y: 436, w: 332, h: 220}, 'mark', 'rental-refusal-graphic')}
              style={{
                position: 'absolute',
                left: L.cards[3].x + 24,
                top: 436,
                width: 332,
                height: 220,
                border: `1px solid ${ms >= cue.t56Refusing ? orange : hairline}`,
                borderRadius: 12,
                background: color('color/fill/panel-wash'),
              }}
            >
              <svg width="332" height="220" viewBox="0 0 332 220" aria-hidden="true">
                <g opacity={ms >= cue.t56Apartment ? 0.55 + 0.45 * apartmentP : 0.3}>
                  <rect x="34" y="28" width="130" height="120" rx="4" fill="none" stroke={gold} strokeWidth="2.5" />
                  <line x1="79" y1="28" x2="79" y2="148" stroke={gold} strokeWidth="2" strokeDasharray="4 4" />
                  <rect x="49" y="53" width="20" height="30" rx="2" fill="none" stroke={gold} strokeWidth="1.5" />
                  <rect x="99" y="53" width="20" height="30" rx="2" fill="none" stroke={gold} strokeWidth="1.5" />
                  <rect x="89" y="103" width="30" height="45" rx="2" fill="none" stroke={gold} strokeWidth="2" />
                </g>
                <circle
                  cx="236"
                  cy="68"
                  r="24"
                  fill="none"
                  stroke={ms >= cue.t56Refusing ? orange : muted}
                  strokeWidth="3"
                />
                <path
                  d="M236 92 V138 M236 113 H254 M236 128 H250"
                  stroke={ms >= cue.t56Refusing ? orange : muted}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="206"
                  y1="38"
                  x2="266"
                  y2="98"
                  stroke={raceRed}
                  strokeWidth="3.5"
                  opacity={ms >= cue.t56Refusing ? 0.5 + 0.5 * refusingP : 0.35}
                />
              </svg>
            </div>
            <Label
              id="card-4-body"
              box={{x: L.cards[3].x + 24, y: 672, w: 332, h: 112}}
              size={28}
              weight={500}
              lh={1.22}
              sans
              ink={soft}
            >
              Denying housing to a screened applicant.
            </Label>
            <Label
              id="card-4-tag"
              box={{x: L.cards[3].x + 24, y: 807, w: 332, h: 32}}
              size={20}
              weight={600}
              ink={ms >= cue.t56Qualified ? gold : muted}
              align="center"
            >
              {ms >= cue.t56Qualified ? 'QUALIFIED TENANT' : 'HOUSING DOMAIN'}
            </Label>
          </div>
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
        Fiske 1998 · Observable Unequal Treatment
      </Label>
    </StageSceneFrame>
  );
}
