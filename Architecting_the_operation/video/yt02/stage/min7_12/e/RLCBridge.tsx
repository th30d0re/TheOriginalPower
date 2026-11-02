import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {EquationTerms, type EquationPulseMap, type EquationToken} from '../../equations';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  clamp01,
  lineAttrs,
  pathFrom,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const RLC_BRIDGE_LAYOUT = {
  // Header
  header: {x: 120, y: 100, w: 1680, h: 60},
  headerLabel: {x: 120, y: 108, w: 1680, h: 48},

  // Mental Half (spans vertical safe area)
  mentalPanel: {x: 120, y: 180, w: 460, h: 742},
  mentalTitle: {x: 150, y: 205, w: 400, h: 36},
  cartridge: {x: 155, y: 290, w: 390, h: 260},
  cartridgePi: {x: 175, y: 315, w: 350, h: 60},
  cartridgeLabel: {x: 175, y: 395, w: 350, h: 64},
  mentalFooter: {x: 150, y: 840, w: 400, h: 36},

  // Coupling Bridge
  bridge: {x: 580, y: 420, w: 70, h: 4},

  // Institutional Panel: compact component chips (y: 180 to 400, h: 220)
  instPanel: {x: 650, y: 180, w: 1150, h: 220},
  instTitle: {x: 680, y: 195, w: 400, h: 32},

  // Component chips: L, R, C, q, V
  lChip: {x: 670, y: 232, w: 1110, h: 32},
  lTitle: {x: 680, y: 232, w: 220, h: 30},
  lMeaning: {x: 920, y: 232, w: 840, h: 30},

  rChip: {x: 670, y: 266, w: 1110, h: 32},
  rTitle: {x: 680, y: 266, w: 220, h: 30},
  rMeaning: {x: 920, y: 266, w: 840, h: 30},

  cChip: {x: 670, y: 300, w: 1110, h: 32},
  cTitle: {x: 680, y: 300, w: 220, h: 30},
  cMeaning: {x: 920, y: 300, w: 840, h: 30},

  qChip: {x: 670, y: 334, w: 1110, h: 32},
  qTitle: {x: 680, y: 334, w: 500, h: 30},

  vChip: {x: 670, y: 368, w: 1110, h: 32},
  vTitle: {x: 680, y: 368, w: 550, h: 30},

  // Equation Band: large and centered Eq. 2.11 at 36 px (y: 412 to 522, h: 110)
  eqBand: {x: 650, y: 412, w: 1150, h: 110},
  eqTerms: {x: 650, y: 420, w: 1150, h: 56},
  eqLabel: {x: 650, y: 482, w: 1150, h: 30},

  // Damped Response Preview (height 390 px >= 200 px requirement, y: 532 to 922)
  previewPanel: {x: 650, y: 532, w: 1150, h: 390},
  previewSweepLabel: {x: 680, y: 548, w: 460, h: 32},
  reformShockLabel: {x: 1220, y: 548, w: 220, h: 32},
  dampedResponseLabel: {x: 1480, y: 548, w: 280, h: 32},
  baselineLabel: {x: 680, y: 865, w: 350, h: 36},
  dampedSolutionLabel: {x: 1070, y: 865, w: 340, h: 36},
  figureLabel: {x: 1440, y: 865, w: 340, h: 36},

  // Source line
  source: {x: 116, y: 946, w: 740, h: 56},
} as const;

// Token definitions without manual width overrides: tokenWidth calculates glyph advances
const eq211Tokens: readonly EquationToken[] = [
  {term: 'L'},
  {term: 'q', math: 'q̈', display: 'q̈'},
  {text: ' + '},
  {term: 'R'},
  {term: 'q', math: 'q̇', display: 'q̇'},
  {text: ' + (1/'},
  {term: 'C'},
  {text: ')'},
  {term: 'q', math: 'q', display: 'q'},
  {text: ' = '},
  {term: 'V', math: 'V(t)', display: 'V(t)'},
];

export function RLCBridge({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t38Bayesian: useCue('t38Bayesian').at,
    t38Rlc: useCue('t38Rlc').at,
    t38Installed: useCue('t38Installed').at,
    t38Mental: useCue('t38Mental').at,
    t38Inductance: useCue('t38Inductance').at,
    t38Resistance: useCue('t38Resistance').at,
    t38Capacitance: useCue('t38Capacitance').at,
    t38Institutional: useCue('t38Institutional').at,
    t38Absorbs: useCue('t38Absorbs').at,
    t38Damps: useCue('t38Damps').at,
    t38Reform: useCue('t38Reform').at,
    t38Shocks: useCue('t38Shocks').at,
  };

  const L = RLC_BRIDGE_LAYOUT;

  const bayesianP = enter(ms, cue.t38Bayesian);
  const rlcP = enter(ms, cue.t38Rlc);
  const installedP = enter(ms, cue.t38Installed);
  const mentalP = enter(ms, cue.t38Mental);
  const indP = enter(ms, cue.t38Inductance);
  const resP = enter(ms, cue.t38Resistance);
  const capP = enter(ms, cue.t38Capacitance);
  const instP = enter(ms, cue.t38Institutional);
  const absP = enter(ms, cue.t38Absorbs);
  const dampsP = enter(ms, cue.t38Damps);
  const refP = enter(ms, cue.t38Reform);
  const shocksP = enter(ms, cue.t38Shocks);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');
  const hairline = color('color/line/hairline');

  // Term hex tokens
  const lColor = '#86efac';
  const rColor = '#f9a8d4';
  const cColor = '#a5f3fc';
  const qColor = '#d9f99d';
  const vColor = '#93c5fd';

  const eqPulses: EquationPulseMap = {
    L: [cue.t38Inductance],
    R: [cue.t38Resistance],
    C: [cue.t38Capacitance],
    q: [cue.t38Absorbs],
    V: [cue.t38Reform],
  };

  // Coupling bridge
  const bridgePoints: Point[] = [[580, 420], [650, 420]];
  const bridgePulseT = clamp01(progress(ms, cue.t38Installed, cue.t38Installed + 800));
  const pulseX = 580 + bridgePulseT * 70;

  // Underdamped response curve: visible shock, overshoot, decay
  // Baseline at y = 710, curve reaches 120 px overshoot peak above baseline and 65 px below
  const baselineY = 710;
  const baselinePoints: Point[] = [[680, baselineY], [1760, baselineY]];

  // Damping parameter sweeps from 0.0035 to 0.0085 with dampsP
  const dampingRate = 0.0035 + dampsP * 0.005;
  const omega = 0.024;
  const curvePoints: Point[] = Array.from({length: 71}, (_, i) => {
    const px = 700 + i * 15;
    const t = px - 700;
    const decay = Math.exp(-dampingRate * t);
    const wave = Math.sin(omega * t);
    const py = baselineY - 145 * wave * decay;
    return [px, py];
  });

  return (
    <StageSceneFrame segment={segment}>
      {/* Section Header */}
      {ms >= cue.t38Rlc && (
        <Label id="rlc-header" box={L.headerLabel} size={36} weight={600} sans ink={gold} opacity={rlcP}>
          RLC BACKLASH MODEL
        </Label>
      )}

      {/* Mental Half */}
      <div data-mental-half="true">
        <Panel id="mental-panel-frame" box={L.mentalPanel} accent="color/line/hairline" />
        {ms >= cue.t38Bayesian && (
          <>
            <Label id="mental-title" box={L.mentalTitle} size={24} weight={600} ink={gold} opacity={bayesianP}>
              BAYESIAN DEFENSE
            </Label>

            {/* Installed-prior cartridge */}
            <div data-cartridge="true" style={{opacity: bayesianP}}>
              <Panel id="cartridge-frame" box={L.cartridge} accent="color/marker/race" />
              <Label id="cartridge-pi" box={L.cartridgePi} size={36} weight={700} ink={raceRed}>
                Π<sub>race</sub>
              </Label>
              <Label id="cartridge-desc" box={L.cartridgeLabel} size={20} weight={600} lh={1.25} ink={primary}>
                INSTITUTIONALLY INSTALLED RACIAL ASSUMPTION
              </Label>
            </div>
          </>
        )}

        {ms >= cue.t38Mental && (
          <Label id="mental-footer" box={L.mentalFooter} size={20} weight={600} ink={primary} opacity={mentalP}>
            MENTAL HALF · INSTALLED PRIORS
          </Label>
        )}
      </div>

      {/* Coupling Bridge */}
      {ms >= cue.t38Installed && (
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
          <path {...lineAttrs('bridge-rail', bridgePoints)} d={pathFrom(bridgePoints)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={installedP} />
          {bridgePulseT > 0 && bridgePulseT < 1 && (
            <circle cx={pulseX} cy={420} r={9} fill={raceRed} stroke={gold} strokeWidth="2" />
          )}
        </svg>
      )}

      {/* Institutional Circuit Panel: components introduced and compressed to chips */}
      <div data-institutional-half="true">
        <Panel id="inst-panel-frame" box={L.instPanel} accent="color/line/hairline" />

        {ms >= cue.t38Institutional && (
          <Label id="inst-title" box={L.instTitle} size={24} weight={600} ink={gold} opacity={instP}>
            INSTITUTIONAL HALF
          </Label>
        )}

        {/* L chip */}
        {ms >= cue.t38Inductance && (
          <div data-chip-l="true" style={{opacity: indP}}>
            <Panel id="l-chip-frame" box={L.lChip} accent="color/line/hairline" />
            <Label id="l-title" box={L.lTitle} size={20} weight={600} ink={lColor}>
              L · INDUCTANCE
            </Label>
            <Label id="l-meaning" box={L.lMeaning} size={18} weight={500} sans ink={soft}>
              CULTURAL INERTIA + INSTITUTIONAL ENTRENCHMENT
            </Label>
          </div>
        )}

        {/* R chip */}
        {ms >= cue.t38Resistance && (
          <div data-chip-r="true" style={{opacity: resP}}>
            <Panel id="r-chip-frame" box={L.rChip} accent="color/line/hairline" />
            <Label id="r-title" box={L.rTitle} size={20} weight={600} ink={rColor}>
              R · RESISTANCE
            </Label>
            <Label id="r-meaning" box={L.rMeaning} size={18} weight={500} sans ink={soft}>
              BUREAUCRATIC + CARCERAL FRICTION
            </Label>
          </div>
        )}

        {/* C chip */}
        {ms >= cue.t38Capacitance && (
          <div data-chip-c="true" style={{opacity: capP}}>
            <Panel id="c-chip-frame" box={L.cChip} accent="color/line/hairline" />
            <Label id="c-title" box={L.cTitle} size={20} weight={600} ink={cColor}>
              C · CAPACITANCE
            </Label>
            <Label id="c-meaning" box={L.cMeaning} size={18} weight={500} sans ink={soft}>
              TOKEN-REFORM ABSORPTION CAPACITY
            </Label>
          </div>
        )}

        {/* q chip */}
        {ms >= cue.t38Absorbs && (
          <div data-chip-q="true" style={{opacity: absP}}>
            <Panel id="q-chip-frame" box={L.qChip} accent="color/line/hairline" />
            <Label id="q-title" box={L.qTitle} size={20} weight={600} ink={qColor}>
              q(t) · EQUALITY-SURPLUS CHARGE
            </Label>
          </div>
        )}

        {/* V chip */}
        {ms >= cue.t38Reform && (
          <div data-chip-v="true" style={{opacity: refP}}>
            <Panel id="v-chip-frame" box={L.vChip} accent="color/line/hairline" />
            <Label id="v-title" box={L.vTitle} size={20} weight={600} ink={vColor}>
              V(t) · REFORM-SHOCK DRIVING VOLTAGE
            </Label>
          </div>
        )}
      </div>

      {/* Equation Band: assembled at t38Shocks, centered Eq. 2.11 at 36 px */}
      {ms >= cue.t38Shocks && (
        <div data-equation-band="true" style={{opacity: shocksP}}>
          <Panel id="eq-band-frame" box={L.eqBand} accent="color/line/hairline" />
          <EquationTerms
            equation="Eq. 2.11"
            tokens={eq211Tokens}
            pulses={eqPulses}
            ms={ms}
            box={L.eqTerms}
            fontSize={36}
            align="center"
          />
          <Label id="eq-211-label" box={L.eqLabel} size={20} weight={500} align="center" ink={gold}>
            Eq. 2.11 · RLC governing equation
          </Label>
        </div>
      )}

      {/* Damped Response Preview: rendered ONLY when content arrives (from t38Absorbs) */}
      {ms >= cue.t38Absorbs && (
        <div data-response-preview="true">
          <Panel id="preview-panel-frame" box={L.previewPanel} accent="color/line/hairline" />

          {ms >= cue.t38Damps && (
            <>
              <Label id="sweep-label" box={L.previewSweepLabel} size={20} weight={600} ink={gold} opacity={dampsP}>
                DERIVED PREVIEW · NORMALIZED R SWEEP
              </Label>
              <Label id="reform-label" box={L.reformShockLabel} size={20} weight={600} ink={raceRed} opacity={dampsP}>
                REFORM SHOCK
              </Label>
              <Label id="damped-label" box={L.dampedResponseLabel} size={20} weight={600} ink={primary} opacity={dampsP}>
                DAMPED RESPONSE
              </Label>
            </>
          )}

          {/* Baseline rail */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('baseline-rail', baselinePoints)} d={pathFrom(baselinePoints)} fill="none" stroke={hairline} strokeWidth="2" strokeDasharray="6 4" opacity={absP} />
            {ms >= cue.t38Damps && (
              <path {...lineAttrs('response-curve', curvePoints)} d={pathFrom(curvePoints)} fill="none" stroke={color('color/text/accent')} strokeWidth="4" opacity={dampsP} />
            )}
          </svg>

          <Label id="baseline-label" box={L.baselineLabel} size={18} weight={500} ink={muted} opacity={absP}>
            EXTRACTION BASELINE · q = 0
          </Label>

          {ms >= cue.t38Damps && (
            <Label id="solution-label" box={L.dampedSolutionLabel} size={18} weight={500} ink={soft} opacity={dampsP}>
              Eq. 2.12 · damped solution
            </Label>
          )}

          {ms >= cue.t38Shocks && (
            <Label id="figure-label" box={L.figureLabel} size={18} weight={600} ink={gold} opacity={shocksP}>
              Figure 2.6 · response preview
            </Label>
          )}
        </div>
      )}

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        The Original Power, Chapter 2 · Eq. 2.11 · Eq. 2.12 · Figure 2.6
      </Label>
    </StageSceneFrame>
  );
}
