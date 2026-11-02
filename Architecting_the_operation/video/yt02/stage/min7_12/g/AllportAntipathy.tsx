import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  lineAttrs,
  pathFrom,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const ALLPORT_ANTIPATHY_LAYOUT = {
  // Turns 47–48: Left column (Definition card + Observer locus card)
  definitionCard: {x: 110, y: 150, w: 690, h: 356},
  observerPanel: {x: 110, y: 560, w: 690, h: 320},

  // Turns 47–48: Right column (Generalization template + Target field)
  templatePanel: {x: 900, y: 150, w: 880, h: 356},
  targetField: {x: 900, y: 560, w: 880, h: 320},

  // Turn 49: Full-frame comparison (Header + Bias & Prejudice blocks + Baseline & Stereotype Gate)
  turn49Header: {x: 170, y: 115, w: 1580, h: 72},
  biasBlock: {x: 170, y: 215, w: 680, h: 356},
  prejudiceBlock: {x: 1070, y: 215, w: 680, h: 356},
  biasBaselineCard: {x: 170, y: 605, w: 440, h: 270},
  stereotypeGate: {x: 650, y: 605, w: 1100, h: 270},

  // Source line (clear of bottom notch x 880–1040, y >= 990)
  source: {x: 116, y: 960, w: 740, h: 28},
} as const;

const TEMPLATE_PERSON_XS = [1040, 1220, 1400, 1580] as const;
const GROUP_WHOLE_XS = [1000, 1110, 1220] as const;

export function AllportAntipathy({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t47Defines: useCue('t47Defines').at,
    t47Antipathy: useCue('t47Antipathy').at,
    t47Faulty: useCue('t47Faulty').at,
    t47Inflexible: useCue('t47Inflexible').at,
    t47Generalization: useCue('t47Generalization').at,
    t47Felt: useCue('t47Felt').at,
    t47Expressed: useCue('t47Expressed').at,

    t48Hostility: useCue('t48Hostility').at,
    t48Whole: useCue('t48Whole').at,
    t48Specifically: useCue('t48Specifically').at,
    t48Belongs: useCue('t48Belongs').at,

    t49Bias: useCue('t49Bias').at,
    t49Prejudice: useCue('t49Prejudice').at,
    t49Emotional: useCue('t49Emotional').at,
    t49Rigid: useCue('t49Rigid').at,
    t49Stereotype: useCue('t49Stereotype').at,
    t49Resists: useCue('t49Resists').at,
    t49Evidence: useCue('t49Evidence').at,
  };

  const L = ALLPORT_ANTIPATHY_LAYOUT;
  const isTurn49 = ms >= cue.t49Bias;

  // Turn 47–48 progresses
  const definesP = enter(ms, cue.t47Defines);
  const antipathyP = enter(ms, cue.t47Antipathy);
  const faultyP = enter(ms, cue.t47Faulty);
  const inflexibleP = enter(ms, cue.t47Inflexible);
  const generalizationP = enter(ms, cue.t47Generalization);
  const feltP = enter(ms, cue.t47Felt);
  const expressedP = enter(ms, cue.t47Expressed);

  const hostilityP = enter(ms, cue.t48Hostility);
  const wholeP = enter(ms, cue.t48Whole);
  const specificallyP = enter(ms, cue.t48Specifically);
  const belongsP = enter(ms, cue.t48Belongs);

  // Turn 49 progresses
  const t49BiasP = enter(ms, cue.t49Bias);
  const t49PrejudiceP = enter(ms, cue.t49Prejudice);
  const t49EmotionalP = enter(ms, cue.t49Emotional);
  const t49RigidP = enter(ms, cue.t49Rigid);
  const t49StereotypeP = enter(ms, cue.t49Stereotype);
  const t49ResistsP = enter(ms, cue.t49Resists);
  const t49EvidenceP = enter(ms, cue.t49Evidence);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  // Outward expression arrow from observer panel right edge (800) to target field left edge (900)
  const outwardArrow: Point[] = [[800, 720], [900, 720]];
  // Membership line inside target field connecting group boundary right edge (1270) to individual member left edge (1490)
  const membershipLine: Point[] = [[1270, 682], [1490, 682]];
  // Turn 49 connector between Bias and Prejudice blocks
  const turn49Bridge: Point[] = [[850, 393], [1070, 393]];

  return (
    <StageSceneFrame segment={segment}>
      {/* TURNS 47–48: Allport Definition, Generalization Template, Observer Locus, and Target Field */}
      {!isTurn49 && ms >= cue.t47Defines && (
        <div data-turns="47-48" style={{opacity: definesP}}>
          {/* Left Upper: Prejudice Definition Card (height 356, text span 320 -> 36 px margin) */}
          <Panel id="definition-card" box={L.definitionCard} accent="color/marker/race">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: raceRed}} />
          </Panel>
          <Label id="def-term" box={{x: 144, y: 168, w: 622, h: 46}} size={36} weight={650} sans ink={raceRed}>
            PREJUDICE
          </Label>
          <Label id="def-body" box={{x: 144, y: 228, w: 622, h: 196}} size={30} weight={400} lh={1.34} sans ink={primary}>
            antipathy grounded in a faulty and inflexible generalization, felt internally or expressed outwardly
          </Label>
          <Label id="def-source" box={{x: 144, y: 460, w: 320, h: 28}} size={20} weight={500} ink={muted}>
            Allport 1954, p. 9
          </Label>
          <Label id="def-paraphrased" box={{x: 486, y: 460, w: 280, h: 28}} size={20} weight={500} align="right" ink={muted}>
            (paraphrased)
          </Label>

          {/* Left Lower: Observer & Expression Panel (height 320, text span 284 -> 36 px margin) */}
          <Panel
            id="observer-panel"
            box={L.observerPanel}
            accent={ms >= cue.t47Felt ? 'color/marker/race' : 'color/line/hairline'}
          />
          <Label id="observer-header" box={{x: 144, y: 578, w: 622, h: 32}} size={22} weight={600} ink={gold}>
            OBSERVER · ATTITUDE LOCUS
          </Label>

          {/* Observer PersonMark and internal heart socket */}
          <div
            {...shapeAttrs('observer-mark', {x: 154, y: 635, w: 120, h: 160}, 'mark', 'observer')}
            style={{
              position: 'absolute',
              left: 154,
              top: 635,
              width: 120,
              height: 160,
              border: `1px solid ${ms >= cue.t47Felt ? raceRed : color('color/line/hairline')}`,
              borderRadius: 10,
            }}
          >
            <PersonMark x={60} y={76} group="ingroup" emphasis={1} scale={1.35} />
            {ms >= cue.t47Felt && (
              <svg width="120" height="160" viewBox="0 0 120 160" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <circle cx="60" cy="96" r="18" fill={raceRed} fillOpacity={0.28 * feltP} stroke={raceRed} strokeWidth="2.5" opacity={feltP} />
                <path
                  d="M60 106 C56 102 49 97 49 91 C49 85 56 84 60 89 C64 84 71 85 71 91 C71 97 64 102 60 106 Z"
                  fill={raceRed}
                  opacity={feltP}
                />
              </svg>
            )}
          </div>

          <Label
            id="observer-felt-label"
            box={{x: 300, y: 635, w: 466, h: 36}}
            size={24}
            weight={650}
            ink={ms >= cue.t47Felt ? raceRed : soft}
          >
            {ms >= cue.t47Felt ? 'FELT INTERNALLY' : 'INTERNAL AFFECTIVE STATE'}
          </Label>
          <Label
            id="observer-expressed-label"
            box={{x: 300, y: 685, w: 466, h: 36}}
            size={24}
            weight={650}
            ink={ms >= cue.t47Expressed ? orange : soft}
          >
            {ms >= cue.t47Expressed ? 'EXPRESSED OUTWARDLY' : 'OUTWARD ORIENTATION CHANNEL'}
          </Label>
          <Label
            id="observer-body"
            box={{x: 300, y: 735, w: 466, h: 76}}
            size={28}
            weight={400}
            lh={1.3}
            sans
            ink={primary}
          >
            Held within the observer or directed toward targets.
          </Label>
          <Label id="observer-footer" box={{x: 144, y: 832, w: 622, h: 30}} size={20} weight={500} ink={muted}>
            ALLPORT (1954) · DUAL EXPRESSION MODES
          </Label>

          {/* Right Upper: Generalization Template (opens at t47Antipathy, height 356, text span 320 -> 36 px margin) */}
          {ms >= cue.t47Antipathy && (
            <div data-template-panel="true" style={{opacity: antipathyP}}>
              <Panel id="template-panel" box={L.templatePanel} accent="color/marker/race" />
              <Label id="template-antipathy" box={{x: 932, y: 168, w: 260, h: 38}} size={28} weight={650} sans ink={raceRed}>
                ANTIPATHY
              </Label>
              <Label
                id="template-faulty-badge"
                box={{x: 1204, y: 168, w: 544, h: 38}}
                size={22}
                weight={600}
                align="right"
                ink={ms >= cue.t47Faulty ? orange : soft}
              >
                {ms >= cue.t47Faulty ? 'ERROR MARKER · FAULTY GROUP BELIEF' : 'AFFECTIVE ORIENTATION FIELD'}
              </Label>

              <Label
                id="template-inflexible"
                box={{x: 932, y: 214, w: 816, h: 32}}
                size={22}
                weight={600}
                ink={ms >= cue.t47Inflexible ? raceRed : soft}
              >
                {ms >= cue.t47Inflexible ? 'INFLEXIBLE · RIGID BRACES LOCKED' : 'CATEGORY TEMPLATE STRUCTURE'}
              </Label>

              {/* Template visual mark with braces, error badge, and 4 PersonMarks */}
              <div
                data-error-marker={ms >= cue.t47Faulty ? 'true' : undefined}
                {...shapeAttrs('template-visual-mark', {x: 932, y: 254, w: 816, h: 116}, 'mark', 'template-visual')}
                style={{
                  position: 'absolute',
                  left: 932,
                  top: 254,
                  width: 816,
                  height: 116,
                  border: `2px ${ms >= cue.t47Inflexible ? 'solid' : 'dashed'} ${raceRed}`,
                  borderRadius: 10,
                  background: color('color/fill/red-wash'),
                }}
              >
                <svg width="816" height="116" viewBox="0 0 816 116" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                  {ms >= cue.t47Inflexible && (
                    <g opacity={inflexibleP} stroke={gold} strokeWidth="4" fill="none">
                      <path d="M28 12 H12 V104 H28" />
                      <path d="M788 12 H804 V104 H788" />
                    </g>
                  )}
                  {ms >= cue.t47Faulty && (
                    <g opacity={faultyP}>
                      <circle cx="56" cy="58" r="18" fill="none" stroke={orange} strokeWidth="3" />
                      <line x1="56" y1="46" x2="56" y2="61" stroke={orange} strokeWidth="3" strokeLinecap="round" />
                      <circle cx="56" cy="68" r="2" fill={orange} />
                    </g>
                  )}
                  {ms >= cue.t47Generalization &&
                    TEMPLATE_PERSON_XS.map(px => (
                      <rect
                        key={px}
                        x={px - 932 - 34}
                        y={12}
                        width="68"
                        height="92"
                        rx="6"
                        fill="none"
                        stroke={raceRed}
                        strokeWidth="2"
                        opacity={generalizationP}
                      />
                    ))}
                </svg>
                {TEMPLATE_PERSON_XS.map((px, idx) => (
                  <PersonMark key={idx} x={px - 932} y={60} group="outgroup" emphasis={1} scale={0.95} />
                ))}
              </div>

              <Label
                id="template-body"
                box={{x: 932, y: 378, w: 816, h: 72}}
                size={28}
                weight={400}
                sans
                ink={primary}
              >
                Uniform negative template stamped across all members.
              </Label>

              <Label
                id="template-generalization"
                box={{x: 932, y: 458, w: 816, h: 30}}
                size={22}
                weight={650}
                ink={ms >= cue.t47Generalization ? gold : soft}
              >
                {ms >= cue.t47Generalization ? 'FAULTY GENERALIZATION' : 'UNVERIFIED GROUP TEMPLATE'}
              </Label>
            </div>
          )}

          {/* Outward arrow connecting Observer Panel to Target Field at t47Expressed */}
          {ms >= cue.t47Expressed && (
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={expressedP}>
              <path {...lineAttrs('outward-arrow', outwardArrow)} d={pathFrom(outwardArrow)} fill="none" stroke={raceRed} strokeWidth="4" />
            </svg>
          )}

          {/* Right Lower: Target Field (opens at t47Expressed, height 320, text span 284 -> 36 px margin) */}
          {ms >= cue.t47Expressed && (
            <div data-target-field="true" style={{opacity: expressedP}}>
              <Panel id="target-field" box={L.targetField} accent="color/marker/race" />
              <Label id="target-header-left" box={{x: 932, y: 578, w: 400, h: 32}} size={22} weight={650} ink={ms >= cue.t48Hostility ? raceRed : gold}>
                {ms >= cue.t48Hostility ? 'GROUP AS A WHOLE' : 'OUTWARD TARGET FIELD'}
              </Label>
              <Label
                id="target-header-right"
                box={{x: 1360, y: 578, w: 388, h: 32}}
                size={22}
                weight={650}
                align="right"
                ink={ms >= cue.t48Hostility ? orange : soft}
              >
                {ms >= cue.t48Hostility ? 'INDIVIDUAL MEMBER' : 'DIRECTED TARGET ZONE'}
              </Label>

              {/* Left target cluster: Group as a Whole */}
              <div
                data-whole-boundary={ms >= cue.t48Whole ? 'true' : undefined}
                {...shapeAttrs('target-whole-cluster', {x: 932, y: 620, w: 336, h: 124}, 'mark', 'target-whole')}
                style={{
                  position: 'absolute',
                  left: 932,
                  top: 620,
                  width: 336,
                  height: 124,
                  border: `2px ${ms >= cue.t48Whole ? 'solid' : 'dashed'} ${raceRed}`,
                  borderRadius: 12,
                  background: ms >= cue.t48Whole ? color('color/fill/red-wash') : 'transparent',
                }}
              >
                {GROUP_WHOLE_XS.map((gx, i) => (
                  <PersonMark key={i} x={gx - 932} y={64} group="outgroup" emphasis={1} scale={0.95} />
                ))}
              </div>

              {/* Right target cluster: Individual Member */}
              <div
                data-member-arrow={ms >= cue.t48Specifically ? 'true' : undefined}
                {...shapeAttrs('target-member-cluster', {x: 1492, y: 620, w: 256, h: 124}, 'mark', 'target-member')}
                style={{
                  position: 'absolute',
                  left: 1492,
                  top: 620,
                  width: 256,
                  height: 124,
                  border: `2px ${ms >= cue.t48Specifically ? 'solid' : 'dashed'} ${orange}`,
                  borderRadius: 12,
                }}
              >
                <PersonMark x={128} y={64} group="outgroup" emphasis={1} scale={1.05} />
              </div>

              {/* Membership line connecting selected member back to group boundary */}
              {ms >= cue.t48Belongs && (
                <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={belongsP}>
                  <path {...lineAttrs('membership-line', membershipLine)} d={pathFrom(membershipLine)} fill="none" stroke={gold} strokeWidth="3.5" strokeDasharray="6 4" />
                </svg>
              )}

              <Label id="target-body" box={{x: 932, y: 752, w: 816, h: 72}} size={28} weight={400} sans ink={primary}>
                Antipathy targets the entire group or one member for belonging to it.
              </Label>

              <Label
                id="target-belongs-footer"
                box={{x: 932, y: 832, w: 816, h: 30}}
                size={20}
                weight={600}
                ink={ms >= cue.t48Belongs ? gold : muted}
              >
                {ms >= cue.t48Belongs ? 'TARGETED BECAUSE OF GROUP MEMBERSHIP' : 'ALLPORT (1954) · GROUP AND MEMBER TARGETS'}
              </Label>
            </div>
          )}
        </div>
      )}

      {/* TURN 49: Bias Lean vs. Prejudice Emotional Hostility and Rigid Stereotype Gate */}
      {isTurn49 && (
        <div data-turn="49" style={{opacity: t49BiasP}}>
          {/* Top Comparison Banner (height 72, text span 38 -> 34 px margin) */}
          <Panel id="turn49-header-panel" box={L.turn49Header} accent="color/fill/gold" />
          <Label id="turn49-header-title" box={{x: 200, y: 132, w: 1520, h: 38}} size={28} weight={650} sans align="center" ink={primary}>
            CONCEPT DISTINCTION · DIRECTIONAL LEAN VS. RIGID AFFECTIVE ANTIPATHY
          </Label>

          {/* Left Block: Bias · Mental Lean (height 356, text span 320 -> 36 px margin) */}
          <Panel id="bias-block" box={L.biasBlock} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
          </Panel>
          <div
            {...shapeAttrs('bias-block-glyph', {x: 200, y: 233, w: 48, h: 56}, 'mark', 'bias-glyph')}
            style={{position: 'absolute', left: 200, top: 233, width: 48, height: 56}}
          >
            <PersonMark x={24} y={28} group="ingroup" emphasis={1} scale={0.95} />
          </div>
          <Label id="bias-block-title" box={{x: 264, y: 233, w: 556, h: 42}} size={30} weight={650} sans ink={gold}>
            BIAS · MENTAL LEAN
          </Label>
          <Label id="bias-block-body" box={{x: 200, y: 292, w: 620, h: 80}} size={28} weight={400} lh={1.32} sans ink={primary}>
            Directional starting tendency in judgment and evaluation.
          </Label>
          <div
            {...shapeAttrs('bias-tilt-meter', {x: 200, y: 386, w: 620, h: 118}, 'mark', 'bias-meter')}
            style={{
              position: 'absolute',
              left: 200,
              top: 386,
              width: 620,
              height: 118,
              border: `1px solid ${color('color/line/hairline')}`,
              borderRadius: 8,
            }}
          >
            <svg width="620" height="118" viewBox="0 0 620 118" aria-hidden="true">
              <line x1="80" y1="88" x2="540" y2="88" stroke={muted} strokeWidth="2" />
              <path d="M210 88 A100 100 0 0 1 410 88" fill="none" stroke={gold} strokeWidth="3" />
              <line x1="310" y1="88" x2="375" y2="32" stroke={gold} strokeWidth="4" strokeLinecap="round" />
              <circle cx="310" cy="88" r="6" fill={gold} />
            </svg>
          </div>
          <Label id="bias-block-footer" box={{x: 200, y: 523, w: 620, h: 30}} size={20} weight={500} ink={muted}>
            STARTING TENDENCY · PROBABILITY WEIGHTING
          </Label>

          {/* Center Connector Bridge */}
          {ms >= cue.t49Prejudice && (
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true" opacity={t49PrejudiceP}>
              <path {...lineAttrs('turn49-bridge', turn49Bridge)} d={pathFrom(turn49Bridge)} fill="none" stroke={raceRed} strokeWidth="3" strokeDasharray="6 4" />
            </svg>
          )}

          {/* Right Block: Prejudice · Emotional Hostility (height 356, text span 320 -> 36 px margin) */}
          {ms >= cue.t49Prejudice && (
            <div data-turn49-prejudice="true" style={{opacity: t49PrejudiceP}}>
              <Panel id="prejudice-block" box={L.prejudiceBlock} accent="color/marker/race">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: raceRed}} />
              </Panel>
              <div
                {...shapeAttrs('prejudice-block-glyph', {x: 1100, y: 233, w: 48, h: 48}, 'mark', 'prejudice-glyph')}
                style={{position: 'absolute', left: 1100, top: 233, width: 48, height: 48, color: raceRed}}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M24 40 C18 34 7 27 7 17 C7 7 19 5 24 13 C29 5 41 7 41 17 C41 27 30 34 24 40 Z" fill={raceRed} fillOpacity="0.28" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </div>
              <Label id="prejudice-block-title" box={{x: 1164, y: 233, w: 556, h: 42}} size={28} weight={650} sans ink={raceRed}>
                {ms >= cue.t49Emotional ? 'PREJUDICE · EMOTIONAL HOSTILITY' : 'PREJUDICE'}
              </Label>
              <Label id="prejudice-block-body" box={{x: 1100, y: 292, w: 620, h: 80}} size={28} weight={400} lh={1.32} sans ink={primary}>
                {ms >= cue.t49Emotional
                  ? 'Active emotional hostility bound to a sweeping group stereotype.'
                  : 'Antipathy anchored to a fixed group generalization.'}
              </Label>
              <div
                {...shapeAttrs('prejudice-hostility-mark', {x: 1100, y: 386, w: 620, h: 118}, 'mark', 'prejudice-meter')}
                style={{
                  position: 'absolute',
                  left: 1100,
                  top: 386,
                  width: 620,
                  height: 118,
                  border: `1px solid ${raceRed}`,
                  borderRadius: 8,
                  background: color('color/fill/red-wash'),
                }}
              >
                <svg width="620" height="118" viewBox="0 0 620 118" aria-hidden="true">
                  <circle cx="310" cy="59" r="42" fill="none" stroke={raceRed} strokeWidth="2.5" strokeDasharray="5 4" />
                  <path d="M310 78 C298 66 276 52 276 36 C276 20 298 16 310 30 C322 16 344 20 344 36 C344 52 322 66 310 78 Z" fill={raceRed} opacity="0.7" />
                </svg>
              </div>
              <Label id="prejudice-block-footer" box={{x: 1100, y: 523, w: 620, h: 30}} size={20} weight={500} ink={raceRed} opacity={ms >= cue.t49Emotional ? t49EmotionalP : 1}>
                ALLPORT 1954 · AFFECTIVE ANTIPATHY
              </Label>
            </div>
          )}

          {/* Lower Left: Bias Baseline Card (height 270, text span 234 -> 36 px margin) */}
          <Panel id="bias-baseline-card" box={L.biasBaselineCard} accent="color/line/hairline" />
          <Label id="bias-baseline-title" box={{x: 196, y: 623, w: 388, h: 32}} size={22} weight={600} ink={gold}>
            STARTING EXPECTATION
          </Label>
          <Label id="bias-baseline-body" box={{x: 196, y: 672, w: 388, h: 120}} size={28} weight={400} lh={1.32} sans ink={primary}>
            Shifts toward new evidence when the prior is open to revision.
          </Label>
          <Label id="bias-baseline-footer" box={{x: 196, y: 827, w: 388, h: 30}} size={20} weight={500} ink={soft}>
            EVIDENCE-RESPONSIVE CHANNEL
          </Label>

          {/* Lower Right: Rigid Stereotype Gate (opens at t49Rigid, height 270, text span 234 -> 36 px margin) */}
          {ms >= cue.t49Rigid && (
            <div data-stereotype-gate="true" style={{opacity: t49RigidP}}>
              <Panel id="stereotype-gate" box={L.stereotypeGate} accent="color/marker/race" />
              <Label id="gate-title" box={{x: 682, y: 623, w: 560, h: 34}} size={24} weight={650} ink={raceRed}>
                RIGID SWEEPING STEREOTYPE
              </Label>
              <Label id="gate-status-right" box={{x: 1260, y: 623, w: 458, h: 34}} size={20} weight={600} align="right" ink={gold}>
                {ms >= cue.t49Stereotype ? 'GROUP TEMPLATE LOCKED IN GATE' : 'INFLEXIBLE BOUNDARY'}
              </Label>

              <Label id="gate-body" box={{x: 682, y: 672, w: 520, h: 120}} size={28} weight={400} lh={1.32} sans ink={primary}>
                {ms >= cue.t49Resists
                  ? 'Contrary observations stop at the closed stereotype barrier.'
                  : 'Fixed group template locks against incoming correction.'}
              </Label>

              {/* Visual gate barrier, locked group template, and stopped contrary-evidence tokens */}
              <div
                data-gate-template={ms >= cue.t49Stereotype ? 'true' : undefined}
                data-contrary-tokens={ms >= cue.t49Resists ? 'true' : undefined}
                {...shapeAttrs('gate-visual-mark', {x: 1230, y: 670, w: 488, h: 136}, 'mark', 'gate-visual')}
                style={{
                  position: 'absolute',
                  left: 1230,
                  top: 670,
                  width: 488,
                  height: 136,
                  border: `2px solid ${raceRed}`,
                  borderRadius: 8,
                  background: color('color/fill/red-wash'),
                }}
              >
                <svg width="488" height="136" viewBox="0 0 488 136" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                  {/* Gate vertical barrier */}
                  <line x1="170" y1="12" x2="170" y2="124" stroke={raceRed} strokeWidth="6" />
                  {ms >= cue.t49Resists && (
                    <g opacity={t49ResistsP}>
                      <rect x="20" y="24" width="118" height="36" rx="4" fill="none" stroke={orange} strokeWidth="2.5" />
                      <rect x="20" y="76" width="118" height="36" rx="4" fill="none" stroke={orange} strokeWidth="2.5" />
                      <path d="M138 42 H162 M138 94 H162" stroke={orange} strokeWidth="3" />
                    </g>
                  )}
                </svg>
                {ms >= cue.t49Stereotype && (
                  <div style={{opacity: t49StereotypeP}}>
                    <PersonMark x={250} y={70} group="outgroup" emphasis={1} scale={0.85} />
                    <PersonMark x={340} y={70} group="outgroup" emphasis={1} scale={0.85} />
                    <PersonMark x={430} y={70} group="outgroup" emphasis={1} scale={0.85} />
                  </div>
                )}
              </div>

              <Label
                id="gate-evidence-footer"
                box={{x: 682, y: 827, w: 1036, h: 30}}
                size={22}
                weight={650}
                ink={ms >= cue.t49Evidence ? orange : soft}
                opacity={ms >= cue.t49Evidence ? t49EvidenceP : 1}
              >
                {ms >= cue.t49Evidence ? 'CONTRARY EVIDENCE RESISTED' : 'STEREOTYPE GATE LOCKED'}
              </Label>
            </div>
          )}
        </div>
      )}

      {/* Source Line */}
      {ms >= cue.t47Defines && (
        <Label id="source-line" box={L.source} size={20} weight={400} ink={muted}>
          Allport 1954, p. 9 · The Nature of Prejudice
        </Label>
      )}
    </StageSceneFrame>
  );
}
