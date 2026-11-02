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
  header: {x: 120, y: 100, w: 1680, h: 75},
  headerLabel: {x: 120, y: 110, w: 1680, h: 48},

  // Mental Half
  mentalPanel: {x: 120, y: 220, w: 450, h: 540},
  mentalTitle: {x: 150, y: 245, w: 390, h: 36},
  cartridge: {x: 150, y: 310, w: 390, h: 260},
  cartridgePi: {x: 170, y: 335, w: 350, h: 60},
  cartridgeLabel: {x: 170, y: 415, w: 350, h: 64},
  mentalFooter: {x: 150, y: 640, w: 390, h: 36},

  // Coupling Bridge
  bridge: {x: 570, y: 400, w: 260, h: 80},

  // Institutional Circuit Panel
  instPanel: {x: 830, y: 220, w: 970, h: 380},
  instTitle: {x: 860, y: 235, w: 400, h: 36},

  // Circuit components (L, R, C, q, V)
  lChip: {x: 860, y: 280, w: 910, h: 56},
  lTitle: {x: 880, y: 292, w: 220, h: 32},
  lMeaning: {x: 1120, y: 292, w: 630, h: 32},

  rChip: {x: 860, y: 344, w: 910, h: 56},
  rTitle: {x: 880, y: 356, w: 220, h: 32},
  rMeaning: {x: 1120, y: 356, w: 630, h: 32},

  cChip: {x: 860, y: 408, w: 910, h: 56},
  cTitle: {x: 880, y: 420, w: 220, h: 32},
  cMeaning: {x: 1120, y: 420, w: 630, h: 32},

  qChip: {x: 860, y: 472, w: 910, h: 56},
  qTitle: {x: 880, y: 484, w: 440, h: 32},

  vChip: {x: 860, y: 536, w: 910, h: 56},
  vTitle: {x: 880, y: 548, w: 520, h: 32},

  // Equation Band
  eqBand: {x: 830, y: 620, w: 970, h: 120},
  eqTerms: {x: 860, y: 630, w: 910, h: 46},
  eqLabel: {x: 860, y: 685, w: 500, h: 30},

  // Damped Response Preview
  previewPanel: {x: 830, y: 760, w: 970, h: 170},
  previewSweepLabel: {x: 860, y: 772, w: 450, h: 28},
  reformShockLabel: {x: 1350, y: 772, w: 200, h: 28},
  dampedResponseLabel: {x: 1570, y: 772, w: 200, h: 28},
  baselineLabel: {x: 860, y: 872, w: 280, h: 54},
  dampedSolutionLabel: {x: 1160, y: 872, w: 280, h: 54},
  figureLabel: {x: 1460, y: 872, w: 310, h: 54},

  // Source line
  source: {x: 116, y: 946, w: 740, h: 56},
} as const;

const eq211Tokens: readonly EquationToken[] = [
  {term: 'L', width: 28},
  {term: 'q', math: 'q̈', display: 'q̈', width: 34},
  {text: ' + ', width: 38},
  {term: 'R', width: 28},
  {term: 'q', math: 'q̇', display: 'q̇', width: 34},
  {text: ' + (1/', width: 68},
  {term: 'C', width: 28},
  {text: ')', width: 16},
  {term: 'q', math: 'q', display: 'q', width: 28},
  {text: ' = ', width: 38},
  {term: 'V', math: 'V(t)', display: 'V(t)', width: 68},
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
  const bridgePoints: Point[] = [[570, 440], [830, 440]];
  const bridgePulseT = clamp01(progress(ms, cue.t38Installed, cue.t38Installed + 800));
  const pulseX = 570 + bridgePulseT * 260;

  // Damped response curve points
  const dampingFactor = 0.003 + dampsP * 0.006;
  const baselineY = 835;
  const baselinePoints: Point[] = [[860, baselineY], [1770, baselineY]];
  const curvePoints: Point[] = Array.from({length: 61}, (_, i) => {
    const px = 860 + i * 15;
    const t = (px - 860);
    const decay = Math.exp(-dampingFactor * t);
    const wave = Math.sin(t * 0.035);
    const py = baselineY - wave * decay * 24;
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
            <circle cx={pulseX} cy={440} r={9} fill={raceRed} stroke={gold} strokeWidth="2" />
          )}
        </svg>
      )}

      {/* Institutional Circuit Panel */}
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
            <Label id="l-title" box={L.lTitle} size={22} weight={600} ink={lColor}>
              L · INDUCTANCE
            </Label>
            <Label id="l-meaning" box={L.lMeaning} size={20} weight={500} ink={soft}>
              CULTURAL INERTIA + INSTITUTIONAL ENTRENCHMENT
            </Label>
          </div>
        )}

        {/* R chip */}
        {ms >= cue.t38Resistance && (
          <div data-chip-r="true" style={{opacity: resP}}>
            <Panel id="r-chip-frame" box={L.rChip} accent="color/line/hairline" />
            <Label id="r-title" box={L.rTitle} size={22} weight={600} ink={rColor}>
              R · RESISTANCE
            </Label>
            <Label id="r-meaning" box={L.rMeaning} size={20} weight={500} ink={soft}>
              BUREAUCRATIC + CARCERAL FRICTION
            </Label>
          </div>
        )}

        {/* C chip */}
        {ms >= cue.t38Capacitance && (
          <div data-chip-c="true" style={{opacity: capP}}>
            <Panel id="c-chip-frame" box={L.cChip} accent="color/line/hairline" />
            <Label id="c-title" box={L.cTitle} size={22} weight={600} ink={cColor}>
              C · CAPACITANCE
            </Label>
            <Label id="c-meaning" box={L.cMeaning} size={20} weight={500} ink={soft}>
              TOKEN-REFORM ABSORPTION CAPACITY
            </Label>
          </div>
        )}

        {/* q chip */}
        {ms >= cue.t38Absorbs && (
          <div data-chip-q="true" style={{opacity: absP}}>
            <Panel id="q-chip-frame" box={L.qChip} accent="color/line/hairline" />
            <Label id="q-title" box={L.qTitle} size={22} weight={600} ink={qColor}>
              q(t) · EQUALITY-SURPLUS CHARGE
            </Label>
          </div>
        )}

        {/* V chip */}
        {ms >= cue.t38Reform && (
          <div data-chip-v="true" style={{opacity: refP}}>
            <Panel id="v-chip-frame" box={L.vChip} accent="color/line/hairline" />
            <Label id="v-title" box={L.vTitle} size={22} weight={600} ink={vColor}>
              V(t) · REFORM-SHOCK DRIVING VOLTAGE
            </Label>
          </div>
        )}
      </div>

      {/* Equation Band */}
      <div data-equation-band="true">
        {ms >= cue.t38Shocks && (
          <div data-assembled-equation="true" style={{opacity: shocksP}}>
            <EquationTerms
              equation="Eq. 2.11"
              tokens={eq211Tokens}
              pulses={eqPulses}
              ms={ms}
              box={L.eqTerms}
              fontSize={30}
            />
            <Label id="eq-211-label" box={L.eqLabel} size={20} weight={500} ink={gold}>
              Eq. 2.11 · RLC governing equation
            </Label>
          </div>
        )}
      </div>

      {/* Damped Response Preview */}
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

        {/* Baseline and curve */}
        {ms >= cue.t38Absorbs && (
          <>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path {...lineAttrs('baseline-rail', baselinePoints)} d={pathFrom(baselinePoints)} fill="none" stroke={hairline} strokeWidth="1.5" strokeDasharray="4 4" opacity={absP} />
              {ms >= cue.t38Damps && (
                <path {...lineAttrs('response-curve', curvePoints)} d={pathFrom(curvePoints)} fill="none" stroke={color('color/text/accent')} strokeWidth="3" opacity={dampsP} />
              )}
            </svg>
            <Label id="baseline-label" box={L.baselineLabel} size={20} weight={500} ink={muted} opacity={absP}>
              EXTRACTION BASELINE · q = 0
            </Label>
          </>
        )}

        {ms >= cue.t38Damps && (
          <Label id="solution-label" box={L.dampedSolutionLabel} size={20} weight={500} ink={soft} opacity={dampsP}>
            Eq. 2.12 · damped solution
          </Label>
        )}

        {ms >= cue.t38Shocks && (
          <Label id="figure-label" box={L.figureLabel} size={20} weight={600} ink={gold} opacity={shocksP}>
            Figure 2.6 · response preview
          </Label>
        )}
      </div>

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        The Original Power, Chapter 2 · Eq. 2.11 · Eq. 2.12 · Figure 2.6
      </Label>
    </StageSceneFrame>
  );
}
