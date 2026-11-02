import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {StageSceneFrame} from '../../min3_7/shared';
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

export const UNEQUAL_TREATMENT_LAYOUT = {
  pipeline: {x: 120, y: 260, w: 1680, h: 420},
  stereotypeNode: {x: 140, y: 280, w: 460, h: 310},
  prejudiceNode: {x: 730, y: 280, w: 460, h: 310},
  discriminationNode: {x: 1320, y: 280, w: 460, h: 310},
  pipelineArrow1: [[600, 435], [730, 435]] as const satisfies readonly Point[],
  pipelineArrow2: [[1190, 435], [1320, 435]] as const satisfies readonly Point[],

  treatmentTray: {x: 110, y: 230, w: 1700, h: 540},
  trayHeading: {x: 140, y: 254, w: 1000, h: 38},
  cards: [
    {x: 140, y: 310, w: 380, h: 430},
    {x: 560, y: 310, w: 380, h: 430},
    {x: 980, y: 310, w: 380, h: 430},
    {x: 1400, y: 310, w: 380, h: 430},
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

  // Turn 55 progresses
  const threePartP = enter(ms, cue.t55ThreePart);
  const stereotypeP = enter(ms, cue.t55Stereotype);
  const beliefP = enter(ms, cue.t55Belief);
  const prejudiceP = enter(ms, cue.t55Prejudice);
  const hostilityP = enter(ms, cue.t55Hostility);
  const discriminationP = enter(ms, cue.t55Discrimination);
  const unequalP = enter(ms, cue.t55Unequal);
  const membershipP = enter(ms, cue.t55Membership, 700);

  // Turn 56 progresses
  const t56UnequalP = enter(ms, cue.t56Unequal);
  const verbalP = enter(ms, cue.t56Verbal);
  const exclusionP = enter(ms, cue.t56Exclusion);
  const customerP = enter(ms, cue.t56Customer);
  const gradingP = enter(ms, cue.t56Grading);
  const refusingP = enter(ms, cue.t56Refusing);
  const apartmentP = enter(ms, cue.t56Apartment);
  const qualifiedP = enter(ms, cue.t56Qualified);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const muted = color('color/text/muted');

  // Token interpolation across the pipeline
  const tokenProgress = clamp01(progress(ms, cue.t55Membership, cue.t56Unequal));
  const tokenX = 230 + tokenProgress * (1410 - 230);
  const tokenBox: Box = {x: tokenX, y: 610, w: 260, h: 46};

  return (
    <StageSceneFrame segment={segment}>
      {/* Turn 55 Pipeline */}
      {!isTurn56 && ms >= cue.t55ThreePart && (
        <div data-turn="55" style={{opacity: threePartP}}>
          <Panel id="turn55-pipeline-frame" box={L.pipeline} accent="color/line/hairline" />

          {/* Node 1: Stereotype */}
          <Panel id="stereotype-node" box={L.stereotypeNode} />
          <div
            {...shapeAttrs('glyph-stereotype', {x: 164, y: 300, w: 52, h: 52}, 'mark', 'glyph')}
            style={{position: 'absolute', left: 164, top: 300, width: 52, height: 52, color: primary}}
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
            box={{x: 232, y: 304, w: 340, h: 42}}
            size={32}
            weight={650}
            sans
            ink={primary}
          >
            STEREOTYPE
          </Label>
          {ms >= cue.t55Stereotype && (
            <Label
              id="stereotype-sublabel"
              box={{x: 164, y: 366, w: 412, h: 34}}
              size={22}
              weight={500}
              ink={gold}
              opacity={stereotypeP}
            >
              GROUP BELIEF
            </Label>
          )}

          {/* Belief grid visual inside node 1 */}
          <div
            {...shapeAttrs('belief-grid-frame', {x: 230, y: 420, w: 120, h: 90}, 'mark')}
            style={{
              position: 'absolute',
              left: 230,
              top: 420,
              width: 120,
              height: 90,
              border: `1px dashed ${color('color/line/hairline')}`,
              borderRadius: 6,
            }}
          >
            <svg width="120" height="90" viewBox="0 0 120 90" aria-hidden="true">
              {[0, 1, 2].flatMap(row =>
                [0, 1, 2].map(col => (
                  <circle
                    key={`dot-${row}-${col}`}
                    cx={24 + col * 36}
                    cy={18 + row * 27}
                    r={ms >= cue.t55Belief ? 7 : 4}
                    fill={ms >= cue.t55Belief ? gold : muted}
                    opacity={ms >= cue.t55Belief ? beliefP : 0.35}
                  />
                )),
              )}
            </svg>
          </div>

          {/* Pipeline Arrow 1 */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
            <path
              {...lineAttrs('pipeline-arrow-1', L.pipelineArrow1)}
              d="M600 435 L730 435"
              fill="none"
              stroke={gold}
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Node 2: Prejudice */}
          <Panel
            id="prejudice-node"
            box={L.prejudiceNode}
            accent={ms >= cue.t55Prejudice ? 'color/marker/race' : undefined}
          />
          <div
            {...shapeAttrs('glyph-prejudice', {x: 754, y: 300, w: 52, h: 52}, 'mark', 'glyph')}
            style={{
              position: 'absolute',
              left: 754,
              top: 300,
              width: 52,
              height: 52,
              color: ms >= cue.t55Prejudice ? raceRed : muted,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true">
              <path
                d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z"
                fill={ms >= cue.t55Prejudice ? raceRed : 'none'}
                fillOpacity={ms >= cue.t55Prejudice ? 0.3 : 0}
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <Label
            id="prejudice-title"
            box={{x: 822, y: 304, w: 340, h: 42}}
            size={32}
            weight={650}
            sans
            ink={ms >= cue.t55Prejudice ? raceRed : primary}
          >
            PREJUDICE
          </Label>
          {ms >= cue.t55Hostility && (
            <Label
              id="prejudice-sublabel"
              box={{x: 754, y: 366, w: 412, h: 34}}
              size={22}
              weight={500}
              ink={raceRed}
              opacity={hostilityP}
            >
              EMOTIONAL HOSTILITY
            </Label>
          )}

          {/* Heart field visual inside node 2 */}
          {ms >= cue.t55Hostility && (
            <div
              {...shapeAttrs('hostility-field-frame', {x: 820, y: 420, w: 100, h: 90}, 'mark')}
              style={{
                position: 'absolute',
                left: 820,
                top: 420,
                width: 100,
                height: 90,
                border: `1px solid ${raceRed}`,
                borderRadius: 8,
                background: color('color/fill/panel-wash'),
                opacity: hostilityP,
              }}
            >
              <svg width="100" height="90" viewBox="0 0 100 90" aria-hidden="true">
                <circle
                  cx="50"
                  cy="45"
                  r="30"
                  fill="none"
                  stroke={raceRed}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle cx="50" cy="45" r="16" fill={raceRed} opacity={0.45} />
              </svg>
            </div>
          )}

          {/* Pipeline Arrow 2 */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
            <path
              {...lineAttrs('pipeline-arrow-2', L.pipelineArrow2)}
              d="M1190 435 L1320 435"
              fill="none"
              stroke={orange}
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Node 3: Discrimination */}
          <Panel
            id="discrimination-node"
            box={L.discriminationNode}
            accent={ms >= cue.t55Discrimination ? 'color/text/accent' : undefined}
          />
          <div
            {...shapeAttrs('glyph-discrimination', {x: 1344, y: 300, w: 52, h: 52}, 'mark', 'glyph')}
            style={{
              position: 'absolute',
              left: 1344,
              top: 300,
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
            box={{x: 1412, y: 304, w: 340, h: 42}}
            size={32}
            weight={650}
            sans
            ink={ms >= cue.t55Discrimination ? orange : primary}
          >
            DISCRIMINATION
          </Label>
          {ms >= cue.t55Unequal && (
            <Label
              id="discrimination-sublabel"
              box={{x: 1344, y: 366, w: 412, h: 34}}
              size={22}
              weight={500}
              ink={orange}
              opacity={unequalP}
            >
              UNEQUAL TREATMENT
            </Label>
          )}

          {/* Action glyph visual inside node 3 */}
          {ms >= cue.t55Unequal && (
            <div
              {...shapeAttrs('action-vector-frame', {x: 1410, y: 435, w: 120, h: 60}, 'mark')}
              style={{
                position: 'absolute',
                left: 1410,
                top: 435,
                width: 120,
                height: 60,
                border: `1px solid ${orange}`,
                borderRadius: 6,
                opacity: unequalP,
              }}
            >
              <svg width="120" height="60" viewBox="0 0 120 60" aria-hidden="true">
                <path
                  d="M16 30 H100 M82 18 L102 30 L82 42"
                  fill="none"
                  stroke={orange}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* Group Membership Token */}
          {ms >= cue.t55Membership && (
            <div data-membership-token="true" style={{opacity: membershipP}}>
              <Panel id="membership-token-panel" box={tokenBox} accent="color/fill/gold" />
              <Label
                id="membership-token-label"
                box={{x: tokenBox.x + 12, y: tokenBox.y + 10, w: tokenBox.w - 24, h: 26}}
                size={20}
                weight={500}
                ink={gold}
                align="center"
              >
                GROUP MEMBERSHIP
              </Label>
            </div>
          )}
        </div>
      )}

      {/* Turn 56 Treatment Tray */}
      {isTurn56 && (
        <div data-turn="56" style={{opacity: t56UnequalP}}>
          {/* Treatment Tray Container */}
          <Panel id="treatment-tray" box={L.treatmentTray} />
          <Label
            id="tray-heading-label"
            box={L.trayHeading}
            size={28}
            weight={650}
            sans
            ink={primary}
          >
            PERSON-TO-PERSON UNEQUAL TREATMENT
          </Label>

          {/* All 4 Card Panels Laid Out From the Start */}
          <Panel id="card-1-panel" box={L.cards[0]} />
          <Panel id="card-2-panel" box={L.cards[1]} />
          <Panel id="card-3-panel" box={L.cards[2]} />
          <Panel id="card-4-panel" box={L.cards[3]} />

          {/* Card 1: Verbal Exclusion */}
          <div data-card="1">
            {ms >= cue.t56Exclusion && (
              <Label
                id="card-1-title"
                box={{x: L.cards[0].x + 20, y: L.cards[0].y + 24, w: L.cards[0].w - 40, h: 36}}
                size={22}
                weight={500}
                ink={primary}
                opacity={exclusionP}
              >
                VERBAL EXCLUSION
              </Label>
            )}
            {ms >= cue.t56Verbal && (
              <div
                {...shapeAttrs('speech-boundary-graphic', {x: L.cards[0].x + 30, y: L.cards[0].y + 75, w: 320, h: 250}, 'mark')}
                style={{
                  position: 'absolute',
                  left: L.cards[0].x + 30,
                  top: L.cards[0].y + 75,
                  width: 320,
                  height: 250,
                  border: `1px solid ${color('color/line/hairline')}`,
                  borderRadius: 12,
                  opacity: verbalP,
                }}
              >
                <svg width="320" height="250" viewBox="0 0 320 250" aria-hidden="true">
                  <path
                    d="M40 50 H240 C256 50 270 64 270 80 V150 C270 166 256 180 240 180 H120 L70 215 V180 H40 C24 180 10 166 10 150 V80 C10 64 24 50 40 50 Z"
                    fill="none"
                    stroke={orange}
                    strokeWidth="2.5"
                  />
                  <line x1="50" y1="95" x2="220" y2="95" stroke={muted} strokeWidth="3" strokeDasharray="6 6" />
                  <line x1="50" y1="125" x2="180" y2="125" stroke={muted} strokeWidth="3" strokeDasharray="6 6" />
                  <line x1="160" y1="40" x2="160" y2="190" stroke={raceRed} strokeWidth="3" />
                </svg>
              </div>
            )}
            {ms >= cue.t56Exclusion && (
              <Label
                id="card-1-tag"
                box={{x: L.cards[0].x + 20, y: L.cards[0].y + 345, w: L.cards[0].w - 40, h: 32}}
                size={20}
                weight={500}
                ink={gold}
                opacity={exclusionP}
                align="center"
              >
                SPEECH BOUNDARY
              </Label>
            )}
          </div>

          {/* Card 2: Worse Customer Service */}
          <div data-card="2">
            {ms >= cue.t56Customer && (
              <>
                <Label
                  id="card-2-title"
                  box={{x: L.cards[1].x + 20, y: L.cards[1].y + 24, w: L.cards[1].w - 40, h: 36}}
                  size={22}
                  weight={500}
                  ink={primary}
                  opacity={customerP}
                >
                  WORSE CUSTOMER SERVICE
                </Label>
                <div
                  {...shapeAttrs('service-counter-graphic', {x: L.cards[1].x + 30, y: L.cards[1].y + 75, w: 320, h: 250}, 'mark')}
                  style={{
                    position: 'absolute',
                    left: L.cards[1].x + 30,
                    top: L.cards[1].y + 75,
                    width: 320,
                    height: 250,
                    border: `1px solid ${color('color/line/hairline')}`,
                    borderRadius: 12,
                    opacity: customerP,
                  }}
                >
                  <svg width="320" height="250" viewBox="0 0 320 250" aria-hidden="true">
                    <line x1="20" y1="150" x2="300" y2="150" stroke={primary} strokeWidth="3" />
                    <path d="M120 150 C120 110 200 110 200 150 Z" fill="none" stroke={gold} strokeWidth="2.5" />
                    <line x1="160" y1="100" x2="160" y2="110" stroke={gold} strokeWidth="3" />
                    <rect x="40" y="180" width="100" height="24" rx="4" fill={gold} fillOpacity="0.4" />
                    <rect x="180" y="180" width="100" height="24" rx="4" fill={orange} fillOpacity="0.4" />
                  </svg>
                </div>
                <Label
                  id="card-2-tag"
                  box={{x: L.cards[1].x + 20, y: L.cards[1].y + 345, w: L.cards[1].w - 40, h: 32}}
                  size={20}
                  weight={500}
                  ink={gold}
                  opacity={customerP}
                  align="center"
                >
                  SERVICE COUNTER
                </Label>
              </>
            )}
          </div>

          {/* Card 3: Biased Grading */}
          <div data-card="3">
            {ms >= cue.t56Grading && (
              <>
                <Label
                  id="card-3-title"
                  box={{x: L.cards[2].x + 20, y: L.cards[2].y + 24, w: L.cards[2].w - 40, h: 36}}
                  size={22}
                  weight={500}
                  ink={primary}
                  opacity={gradingP}
                >
                  BIASED GRADING
                </Label>
                <div
                  {...shapeAttrs('grading-sheet-graphic', {x: L.cards[2].x + 30, y: L.cards[2].y + 75, w: 320, h: 250}, 'mark')}
                  style={{
                    position: 'absolute',
                    left: L.cards[2].x + 30,
                    top: L.cards[2].y + 75,
                    width: 320,
                    height: 250,
                    border: `1px solid ${color('color/line/hairline')}`,
                    borderRadius: 12,
                    opacity: gradingP,
                  }}
                >
                  <svg width="320" height="250" viewBox="0 0 320 250" aria-hidden="true">
                    <rect x="50" y="30" width="220" height="190" rx="6" fill="none" stroke={primary} strokeWidth="2" />
                    <line x1="80" y1="70" x2="230" y2="70" stroke={muted} strokeWidth="2" />
                    <line x1="80" y1="105" x2="230" y2="105" stroke={muted} strokeWidth="2" />
                    <line x1="80" y1="140" x2="230" y2="140" stroke={muted} strokeWidth="2" />
                    <circle cx="210" cy="70" r="16" fill="none" stroke={raceRed} strokeWidth="2.5" />
                    <line x1="198" y1="70" x2="222" y2="70" stroke={raceRed} strokeWidth="2.5" />
                  </svg>
                </div>
                <Label
                  id="card-3-tag"
                  box={{x: L.cards[2].x + 20, y: L.cards[2].y + 345, w: L.cards[2].w - 40, h: 32}}
                  size={20}
                  weight={500}
                  ink={gold}
                  opacity={gradingP}
                  align="center"
                >
                  GRADING SHEET
                </Label>
              </>
            )}
          </div>

          {/* Card 4: Rental Refusal */}
          <div data-card="4">
            {ms >= cue.t56Refusing && (
              <>
                <Label
                  id="card-4-title"
                  box={{x: L.cards[3].x + 20, y: L.cards[3].y + 24, w: L.cards[3].w - 40, h: 36}}
                  size={22}
                  weight={500}
                  ink={primary}
                  opacity={refusingP}
                >
                  RENTAL REFUSAL
                </Label>
                <div
                  {...shapeAttrs('rental-refusal-graphic', {x: L.cards[3].x + 30, y: L.cards[3].y + 75, w: 320, h: 230}, 'mark')}
                  style={{
                    position: 'absolute',
                    left: L.cards[3].x + 30,
                    top: L.cards[3].y + 75,
                    width: 320,
                    height: 230,
                    border: `1px solid ${color('color/line/hairline')}`,
                    borderRadius: 12,
                    opacity: refusingP,
                  }}
                >
                  <svg width="320" height="230" viewBox="0 0 320 230" aria-hidden="true">
                    {ms >= cue.t56Apartment && (
                      <g opacity={apartmentP}>
                        <rect x="30" y="30" width="130" height="120" rx="4" fill="none" stroke={gold} strokeWidth="2.5" />
                        <line x1="75" y1="30" x2="75" y2="150" stroke={gold} strokeWidth="2" strokeDasharray="4 4" />
                        <rect x="45" y="55" width="20" height="30" rx="2" fill="none" stroke={gold} strokeWidth="1.5" />
                        <rect x="95" y="55" width="20" height="30" rx="2" fill="none" stroke={gold} strokeWidth="1.5" />
                        <rect x="85" y="105" width="30" height="45" rx="2" fill="none" stroke={gold} strokeWidth="2" />
                      </g>
                    )}
                    <circle cx="230" cy="70" r="24" fill="none" stroke={orange} strokeWidth="3" />
                    <path d="M230 94 V140 M230 115 H248 M230 130 H244" stroke={orange} strokeWidth="3" strokeLinecap="round" />
                    <line x1="200" y1="40" x2="260" y2="100" stroke={raceRed} strokeWidth="3.5" />
                  </svg>
                </div>
              </>
            )}

            {/* Qualified Tenant Badge */}
            {ms >= cue.t56Qualified && (
              <div data-qualified="true" style={{opacity: qualifiedP}}>
                <Panel
                  id="qualified-tenant-badge"
                  box={{x: L.cards[3].x + 30, y: L.cards[3].y + 325, w: 320, h: 72}}
                  accent="color/fill/gold"
                  style={{borderRadius: 8}}
                />
                <div
                  {...shapeAttrs('qualified-check-mark', {x: L.cards[3].x + 46, y: L.cards[3].y + 346, w: 30, h: 30}, 'mark', 'icon')}
                  style={{position: 'absolute', left: L.cards[3].x + 46, top: L.cards[3].y + 346, width: 30, height: 30, color: gold}}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12 L9 17 L20 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <Label
                  id="qualified-tenant-label"
                  box={{x: L.cards[3].x + 86, y: L.cards[3].y + 346, w: 250, h: 30}}
                  size={20}
                  weight={600}
                  ink={gold}
                >
                  QUALIFIED TENANT
                </Label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Source Line */}
      <Label
        id="unequal-source-line"
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
