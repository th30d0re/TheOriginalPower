import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {Tokens, color} from '../../tokens';
import {
  ColoredTerm,
  EQUATION_TERMS,
  EquationTerms,
  equationColor,
  type EquationPulseMap,
  type EquationTermId,
  type EquationToken,
} from '../../equations';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  clamp01,
  lineAttrs,
  pathFrom,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const RLC_BRIDGE_LAYOUT = {
  // Top Banner (slack: 68 - 44 = 24 px)
  header: {x: 120, y: 100, w: 1680, h: 68},
  headerTag: {x: 148, y: 117, w: 460, h: 34},
  headerLabel: {x: 640, y: 112, w: 1132, h: 44},

  // Left Column Upper: Mental Half (slack: 380 - 344 = 36 px)
  mentalPanel: {x: 120, y: 184, w: 460, h: 380},
  mentalHeader: {x: 146, y: 202, w: 408, h: 34},
  mentalTitle: {x: 146, y: 242, w: 408, h: 40},
  cartridge: {x: 146, y: 292, w: 408, h: 200},
  cartridgePi: {x: 170, y: 310, w: 360, h: 48},
  cartridgeLabel: {x: 170, y: 366, w: 360, h: 108},
  mentalFooter: {x: 146, y: 512, w: 408, h: 34},

  // Left Column Lower: Cross-Tier Coupling Panel (slack: 332 - 296 = 36 px)
  couplingPanel: {x: 120, y: 588, w: 460, h: 332},
  couplingHeader: {x: 146, y: 606, w: 408, h: 34},
  couplingTitle: {x: 146, y: 650, w: 408, h: 42},
  couplingBody: {x: 146, y: 704, w: 408, h: 150},
  couplingFooter: {x: 146, y: 868, w: 408, h: 34},

  // Right Column Upper: Institutional Panel with 5 TermChips (slack: 356 - 322 = 34 px)
  instPanel: {x: 640, y: 184, w: 1160, h: 356},
  instHeader: {x: 664, y: 198, w: 540, h: 32},
  instTitle: {x: 1220, y: 198, w: 556, h: 32},

  // Five TermChip boxes at floor sizes (L, R, C, q: h = 92, slack = 16 px; V: h = 82, slack = 18 px)
  lChip: {x: 664, y: 238, w: 546, h: 92},
  rChip: {x: 1230, y: 238, w: 546, h: 92},
  cChip: {x: 664, y: 338, w: 546, h: 92},
  qChip: {x: 1230, y: 338, w: 546, h: 92},
  vChip: {x: 664, y: 438, w: 1112, h: 82},

  // Equation Band: centered Eq. 2.11 at 42 px (slack: 112 - 86 = 26 px)
  eqBand: {x: 640, y: 550, w: 1160, h: 112},
  eqTerms: {x: 640, y: 562, w: 1160, h: 54},
  eqLabel: {x: 640, y: 620, w: 1160, h: 28},

  // Derived Damping Response Preview (height 248 px >= 200 px, slack: 248 - 216 = 32 px)
  previewPanel: {x: 640, y: 672, w: 1160, h: 248},
  previewSweepLabel: {x: 668, y: 688, w: 500, h: 30},
  reformShockLabel: {x: 1190, y: 688, w: 260, h: 30},
  dampedResponseLabel: {x: 1470, y: 688, w: 300, h: 30},
  baselineLabel: {x: 668, y: 872, w: 340, h: 32},
  dampedSolutionLabel: {x: 1030, y: 872, w: 340, h: 32},
  figureLabel: {x: 1390, y: 872, w: 380, h: 32},

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

interface RlcTermChipProps {
  idPrefix: string;
  term: EquationTermId;
  symbolDisplay: string;
  title: string;
  meaning: string;
  box: Box;
  ms: number;
  pulses?: EquationPulseMap;
  active: boolean;
  singleLineMeaning?: boolean;
}

function RlcTermChip({
  idPrefix,
  term,
  symbolDisplay,
  title,
  meaning,
  box,
  ms,
  pulses,
  active,
  singleLineMeaning = false,
}: RlcTermChipProps) {
  const entry = EQUATION_TERMS[term];
  const termHex = equationColor(entry.slot);
  const primary = color('color/text/primary');
  const muted = color('color/text/muted');

  const symbolW = singleLineMeaning ? 76 : 66;
  const symbolBox: Box = {
    x: box.x + 14,
    y: box.y + (singleLineMeaning ? 14 : 16),
    w: symbolW,
    h: box.h - (singleLineMeaning ? 28 : 32),
  };
  const textX = box.x + symbolW + 26;
  const textW = box.w - (symbolW + 38);
  const titleBox: Box = {
    x: textX,
    y: box.y + 10,
    w: textW,
    h: 28,
  };
  const meaningBox: Box = {
    x: textX,
    y: box.y + (singleLineMeaning ? 42 : 40),
    w: textW,
    h: singleLineMeaning ? 32 : 46,
  };

  return (
    <div data-term-chip={term} data-chip-active={active ? 'true' : 'false'}>
      <Panel
        id={`${idPrefix}-chip-frame`}
        box={box}
        accent={active ? 'color/fill/gold' : 'color/line/hairline'}
      />
      <ColoredTerm
        term={term}
        math={symbolDisplay}
        display={symbolDisplay}
        ms={ms}
        pulses={pulses?.[term]}
        box={symbolBox}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: Tokens.fonts.mono,
          fontSize: '24px',
          fontWeight: 700,
          borderRadius: '8px',
          border: `1px solid ${termHex}55`,
          background: 'rgba(11, 15, 22, 0.78)',
        }}
      />
      <Label
        id={`${idPrefix}-title`}
        box={titleBox}
        size={22}
        weight={700}
        sans
        lh={1.15}
        ink={termHex}
      >
        {title}
      </Label>
      <Label
        id={`${idPrefix}-meaning`}
        box={meaningBox}
        size={20}
        weight={500}
        sans
        lh={1.12}
        ink={active ? primary : muted}
      >
        {meaning}
      </Label>
    </div>
  );
}

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
  const instP = enter(ms, cue.t38Institutional);
  const dampsP = enter(ms, cue.t38Damps);
  const shocksP = enter(ms, cue.t38Shocks);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');
  const hairline = color('color/line/hairline');

  const eqPulses: EquationPulseMap = {
    L: [cue.t38Inductance, cue.t38Shocks],
    R: [cue.t38Resistance, cue.t38Shocks],
    C: [cue.t38Capacitance, cue.t38Shocks],
    q: [cue.t38Absorbs, cue.t38Shocks],
    V: [cue.t38Reform, cue.t38Shocks],
  };

  // Coupling bridge between mental-panel-frame (x = 580) and inst-panel-frame (x = 640)
  const bridgePoints: Point[] = [[580, 374], [640, 374]];
  const bridgePulseT = clamp01(progress(ms, cue.t38Installed, cue.t38Installed + 800));
  const pulseX = 580 + bridgePulseT * 60;

  // Underdamped response curve inside previewPanel (y: 672..920)
  const baselineY = 796;
  const baselinePoints: Point[] = [[672, baselineY], [1768, baselineY]];

  const dampingRate = 0.0035 + dampsP * 0.005;
  const omega = 0.024;
  const curvePoints: Point[] = Array.from({length: 71}, (_, i) => {
    const px = 680 + i * 15;
    const t = px - 680;
    const decay = Math.exp(-dampingRate * t);
    const wave = Math.sin(omega * t);
    const py = baselineY - 62 * wave * decay;
    return [px, py];
  });

  const hasL = ms >= cue.t38Inductance;
  const hasR = ms >= cue.t38Resistance;
  const hasC = ms >= cue.t38Capacitance;
  const hasQ = ms >= cue.t38Absorbs;
  const hasV = ms >= cue.t38Reform;

  return (
    <StageSceneFrame segment={segment}>
      {/* Top Banner */}
      <div data-rlc-banner="true">
        <Panel id="rlc-banner-frame" box={L.header} accent="color/line/hairline" />
        <Label id="rlc-banner-tag" box={L.headerTag} size={20} weight={600} ink={muted}>
          CHAPTER 2 · SYSTEM COUPLING
        </Label>
        {ms >= cue.t38Rlc && (
          <Label id="rlc-header" box={L.headerLabel} size={34} weight={700} sans align="right" ink={gold} opacity={rlcP}>
            RLC BACKLASH MODEL
          </Label>
        )}
      </div>

      {/* Left Column Upper: Mental Half */}
      <div data-mental-half="true">
        <Panel id="mental-panel-frame" box={L.mentalPanel} accent="color/line/hairline" />
        <Label id="mental-header" box={L.mentalHeader} size={20} weight={600} ink={muted}>
          PRIOR ROUTING STAGE
        </Label>
        {ms >= cue.t38Bayesian && (
          <Label id="mental-title" box={L.mentalTitle} size={28} weight={700} sans ink={gold} opacity={bayesianP}>
            BAYESIAN DEFENSE
          </Label>
        )}

        <div data-cartridge="true">
          <Panel id="cartridge-frame" box={L.cartridge} accent="color/marker/race" />
          <Label id="cartridge-pi" box={L.cartridgePi} size={36} weight={700} ink={raceRed}>
            Π<sub>race</sub>
          </Label>
          <Label id="cartridge-desc" box={L.cartridgeLabel} size={28} weight={600} sans lh={1.25} ink={primary}>
            INSTITUTIONALLY INSTALLED RACIAL ASSUMPTION
          </Label>
        </div>

        <Label
          id="mental-footer"
          box={L.mentalFooter}
          size={20}
          weight={600}
          ink={ms >= cue.t38Mental ? primary : muted}
        >
          {ms >= cue.t38Mental ? 'MENTAL HALF · INSTALLED PRIORS' : 'COGNITIVE PRIOR CHANNEL'}
        </Label>
      </div>

      {/* Left Column Lower: Cross-Tier Coupling */}
      <div data-coupling-panel="true">
        <Panel id="coupling-panel-frame" box={L.couplingPanel} accent="color/line/hairline" />
        <Label id="coupling-header" box={L.couplingHeader} size={20} weight={600} ink={gold}>
          CROSS-TIER COUPLING
        </Label>
        <Label id="coupling-title" box={L.couplingTitle} size={28} weight={700} sans ink={primary}>
          PRIOR TO CIRCUIT LINK
        </Label>
        <Label id="coupling-body" box={L.couplingBody} size={28} weight={500} sans lh={1.3} ink={soft}>
          Installed racial priors feed the institutional backlash circuit under reform pressure
        </Label>
        <Label id="coupling-footer" box={L.couplingFooter} size={20} weight={600} ink={muted}>
          STATE FEEDBACK · CH. 2
        </Label>
      </div>

      {/* Coupling Bridge */}
      {ms >= cue.t38Installed && (
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
          <path {...lineAttrs('bridge-rail', bridgePoints)} d={pathFrom(bridgePoints)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={installedP} />
          {bridgePulseT > 0 && bridgePulseT < 1 && (
            <circle cx={pulseX} cy={374} r={9} fill={raceRed} stroke={gold} strokeWidth="2" />
          )}
        </svg>
      )}

      {/* Right Column Upper: Institutional Circuit Panel with 5 TermChips */}
      <div data-institutional-half="true">
        <Panel id="inst-panel-frame" box={L.instPanel} accent="color/line/hairline" />
        <Label id="inst-header" box={L.instHeader} size={22} weight={600} ink={muted}>
          CIRCUIT PARAMETERS · FIVE TERM CHIPS
        </Label>
        {ms >= cue.t38Institutional && (
          <Label id="inst-title" box={L.instTitle} size={24} weight={700} sans align="right" ink={gold} opacity={instP}>
            INSTITUTIONAL HALF
          </Label>
        )}

        <RlcTermChip
          idPrefix="l"
          term="L"
          symbolDisplay="L"
          title={hasL ? 'L · INDUCTANCE' : 'TERM L · INERTIA SLOT'}
          meaning={hasL ? 'CULTURAL INERTIA + INSTITUTIONAL ENTRENCHMENT' : 'AWAITING PARAMETER'}
          box={L.lChip}
          ms={ms}
          pulses={eqPulses}
          active={hasL}
        />

        <RlcTermChip
          idPrefix="r"
          term="R"
          symbolDisplay="R"
          title={hasR ? 'R · RESISTANCE' : 'TERM R · DAMPING SLOT'}
          meaning={hasR ? 'BUREAUCRATIC + CARCERAL FRICTION' : 'AWAITING PARAMETER'}
          box={L.rChip}
          ms={ms}
          pulses={eqPulses}
          active={hasR}
        />

        <RlcTermChip
          idPrefix="c"
          term="C"
          symbolDisplay="C"
          title={hasC ? 'C · CAPACITANCE' : 'TERM C · BUFFER SLOT'}
          meaning={hasC ? 'TOKEN-REFORM ABSORPTION CAPACITY' : 'AWAITING PARAMETER'}
          box={L.cChip}
          ms={ms}
          pulses={eqPulses}
          active={hasC}
        />

        <RlcTermChip
          idPrefix="q"
          term="q"
          symbolDisplay="q(t)"
          title={hasQ ? 'q(t) · EQUALITY-SURPLUS CHARGE' : 'TERM q(t) · CHARGE SLOT'}
          meaning={hasQ ? 'REFORM DISPLACEMENT FROM BASELINE' : 'STATE DISPLACEMENT VARIABLE'}
          box={L.qChip}
          ms={ms}
          pulses={eqPulses}
          active={hasQ}
        />

        <RlcTermChip
          idPrefix="v"
          term="V"
          symbolDisplay="V(t)"
          title={hasV ? 'V(t) · REFORM-SHOCK DRIVING VOLTAGE' : 'TERM V(t) · FORCING SLOT'}
          meaning={hasV ? 'CIVIL RIGHTS AND RECONSTRUCTION FORCING' : 'EXTERNAL REFORM INPUT'}
          box={L.vChip}
          ms={ms}
          pulses={eqPulses}
          active={hasV}
          singleLineMeaning
        />
      </div>

      {/* Equation Band: centered Eq. 2.11 at 42 px (>= 40 px requirement) */}
      <div data-equation-band="true">
        <Panel id="eq-band-frame" box={L.eqBand} accent="color/line/hairline" />
        <EquationTerms
          equation="Eq. 2.11"
          tokens={eq211Tokens}
          pulses={eqPulses}
          ms={ms}
          box={L.eqTerms}
          fontSize={42}
          align="center"
        />
        <Label
          id="eq-211-label"
          box={L.eqLabel}
          size={20}
          weight={500}
          align="center"
          ink={ms >= cue.t38Shocks ? gold : muted}
        >
          {ms >= cue.t38Shocks ? 'Eq. 2.11 · RLC governing equation' : 'GOVERNING CIRCUIT EQUATION · CH. 2'}
        </Label>
      </div>

      {/* Derived Damping Response Preview */}
      <div data-response-preview="true">
        <Panel id="preview-panel-frame" box={L.previewPanel} accent="color/line/hairline" />

        <Label
          id="sweep-label"
          box={L.previewSweepLabel}
          size={20}
          weight={600}
          ink={ms >= cue.t38Damps ? gold : muted}
        >
          {ms >= cue.t38Damps ? 'DERIVED PREVIEW · NORMALIZED R SWEEP' : 'RESPONSE TRAJECTORY PREVIEW'}
        </Label>
        <Label
          id="reform-label"
          box={L.reformShockLabel}
          size={20}
          weight={600}
          ink={ms >= cue.t38Damps ? raceRed : muted}
        >
          {ms >= cue.t38Damps ? 'REFORM SHOCK' : 'FORCING IMPULSE'}
        </Label>
        <Label
          id="damped-label"
          box={L.dampedResponseLabel}
          size={20}
          weight={600}
          align="right"
          ink={ms >= cue.t38Damps ? primary : muted}
        >
          {ms >= cue.t38Damps ? 'DAMPED RESPONSE' : 'OSCILLATION ENVELOPE'}
        </Label>

        {/* Baseline rail and underdamped response curve */}
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
          <path {...lineAttrs('baseline-rail', baselinePoints)} d={pathFrom(baselinePoints)} fill="none" stroke={hairline} strokeWidth="2" strokeDasharray="6 4" />
          <path {...lineAttrs('response-curve', curvePoints)} d={pathFrom(curvePoints)} fill="none" stroke={color('color/text/accent')} strokeWidth="4" />
        </svg>

        <Label
          id="baseline-label"
          box={L.baselineLabel}
          size={20}
          weight={500}
          ink={ms >= cue.t38Absorbs ? primary : muted}
        >
          {ms >= cue.t38Absorbs ? 'EXTRACTION BASELINE · q = 0' : 'EQUILIBRIUM REFERENCE AXIS'}
        </Label>

        <Label
          id="solution-label"
          box={L.dampedSolutionLabel}
          size={20}
          weight={500}
          align="center"
          ink={ms >= cue.t38Damps ? soft : muted}
        >
          {ms >= cue.t38Damps ? 'Eq. 2.12 · damped solution' : 'UNDERDAMPED TRAJECTORY'}
        </Label>

        <Label
          id="figure-label"
          box={L.figureLabel}
          size={20}
          weight={600}
          align="right"
          ink={ms >= cue.t38Shocks ? gold : muted}
        >
          {ms >= cue.t38Shocks ? 'Figure 2.6 · response preview' : 'CHAPTER 2 PREVIEW TRACE'}
        </Label>
      </div>

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        The Original Power, Chapter 2 · Eq. 2.11 · Eq. 2.12 · Figure 2.6
      </Label>
    </StageSceneFrame>
  );
}
