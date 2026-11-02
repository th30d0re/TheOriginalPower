import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {EquationTerms, type EquationPulseMap, type EquationToken} from '../../equations';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  EvidenceToken,
  Label,
  Panel,
  lineAttrs,
  partialPolyline,
  pathFrom,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const INSTALLED_ROUTING_LAYOUT = {
  // Equation continuity strip: centered Eq. 2.8a at 36 px (slack: 120 - 90 = 30 px)
  equation: {x: 120, y: 100, w: 1680, h: 120},
  eqTerms: {x: 120, y: 115, w: 1680, h: 52},
  eqLabel: {x: 120, y: 173, w: 1680, h: 32},

  // Left column upper: Installed-Prior Cartridge (slack: 350 - 314 = 36 px)
  cartridge: {x: 120, y: 260, w: 440, h: 350},
  cartridgeHeader: {x: 148, y: 278, w: 384, h: 32},
  cartridgePi: {x: 148, y: 316, w: 384, h: 52},
  cartridgeLabel: {x: 148, y: 376, w: 384, h: 112},
  cartridgeInput: {x: 148, y: 498, w: 384, h: 48},
  cartridgeFooter: {x: 148, y: 558, w: 384, h: 34},

  // Left column lower: Routing Mechanism card (slack: 245 - 209 = 36 px)
  cartridgeMech: {x: 120, y: 635, w: 440, h: 245},
  mechHeader: {x: 148, y: 653, w: 384, h: 32},
  mechBody: {x: 148, y: 695, w: 384, h: 120},
  mechFooter: {x: 148, y: 828, w: 384, h: 34},

  // Center column: Direct Facts lane (slack: 620 - 584 = 36 px)
  factsLane: {x: 640, y: 260, w: 490, h: 620},
  factsHeader: {x: 670, y: 278, w: 430, h: 32},
  factsTitle: {x: 670, y: 318, w: 430, h: 42},
  tokenFact1: {x: 670, y: 378, w: 430, h: 58},
  tokenFact2: {x: 670, y: 454, w: 430, h: 58},
  tokenFact3: {x: 670, y: 530, w: 430, h: 58},
  factsBody: {x: 670, y: 610, w: 430, h: 190},
  factsVisible: {x: 670, y: 822, w: 430, h: 40},

  // Legal Color Line Divider
  dividerLabel: {x: 1175, y: 515, w: 120, h: 110},

  // Right column Output Gates (slack: 270 - 234 = 36 px each)
  empathyGate: {x: 1340, y: 260, w: 460, h: 270},
  empathyHeader: {x: 1368, y: 278, w: 404, h: 32},
  empathyTitle: {x: 1368, y: 318, w: 404, h: 42},
  empathySub: {x: 1368, y: 370, w: 404, h: 86},
  empathyFooter: {x: 1368, y: 478, w: 404, h: 34},

  threatGate: {x: 1340, y: 610, w: 460, h: 270},
  threatHeader: {x: 1368, y: 628, w: 404, h: 32},
  threatTitle: {x: 1368, y: 668, w: 404, h: 42},
  threatSub: {x: 1368, y: 720, w: 404, h: 86},
  threatFooter: {x: 1368, y: 828, w: 404, h: 34},

  // Source line
  source: {x: 116, y: 946, w: 740, h: 56},
} as const;

// Token definitions without manual width overrides: tokenWidth calculates glyph advances
const eq28aTokens: readonly EquationToken[] = [
  {text: 'P'},
  {term: 'i', math: '_i'},
  {text: '('},
  {term: 'T'},
  {text: ' | '},
  {term: 'X'},
  {text: ', '},
  {term: 'PiRace', math: 'Π_{race}'},
  {text: ')'},
  {text: ' ∝ '},
  {text: 'P('},
  {term: 'X'},
  {text: ' | '},
  {term: 'T'},
  {text: ') · P'},
  {term: 'i', math: '_i'},
  {text: '('},
  {term: 'T'},
  {text: ' | '},
  {term: 'PiRace', math: 'Π_{race}'},
  {text: ')'},
];

export function InstalledRouting({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t37PiRace: useCue('t37PiRace').at,
    t37Object: useCue('t37Object').at,
    t37Institutionally: useCue('t37Institutionally').at,
    t37Installed: useCue('t37Installed').at,
    t37Routes: useCue('t37Routes').at,
    t37Empathy: useCue('t37Empathy').at,
    t37Threat: useCue('t37Threat').at,
    t37Legal: useCue('t37Legal').at,
    t37Facts: useCue('t37Facts').at,
    t37Support: useCue('t37Support').at,
  };

  const L = INSTALLED_ROUTING_LAYOUT;

  const piP = enter(ms, cue.t37PiRace);
  const instP = enter(ms, cue.t37Institutionally);
  const installedP = enter(ms, cue.t37Installed);
  const routesP = enter(ms, cue.t37Routes);
  const empathyP = enter(ms, cue.t37Empathy);
  const threatP = enter(ms, cue.t37Threat);
  const legalP = enter(ms, cue.t37Legal);
  const factsP = enter(ms, cue.t37Facts);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  const eqPulses: EquationPulseMap = {
    PiRace: [cue.t37PiRace, cue.t37Routes],
  };

  // Traces from cartridge to gates routed around the center facts lane
  const upperTraceFull: Point[] = [
    [560, 410], [600, 410], [600, 240], [1300, 240], [1300, 395], [1340, 395],
  ];
  const lowerTraceFull: Point[] = [
    [560, 500], [600, 500], [600, 900], [1300, 900], [1300, 745], [1340, 745],
  ];

  const upperDrawn = partialPolyline(upperTraceFull, routesP);
  const lowerDrawn = partialPolyline(lowerTraceFull, routesP);

  const busPoints: Point[] = [[64, 522], [120, 522]];
  const dividerTop: Point[] = [[1235, 260], [1235, 505]];
  const dividerBottom: Point[] = [[1235, 635], [1235, 880]];

  return (
    <StageSceneFrame segment={segment}>
      {/* Continuity Equation Strip: centered Eq. 2.8a at 36 px */}
      <div data-continuity-strip="true">
        <Panel id="eq-strip-frame" box={L.equation} />
        <EquationTerms
          equation="Eq. 2.8a"
          tokens={eq28aTokens}
          pulses={eqPulses}
          ms={ms}
          box={L.eqTerms}
          fontSize={36}
          align="center"
        />
        <Label id="eq-label" box={L.eqLabel} size={20} weight={500} align="center" ink={gold}>
          Eq. 2.8a · installed racial prior
        </Label>
      </div>

      {/* Installed-Prior Cartridge: sized to content */}
      <div data-cartridge="true">
        <Panel id="cartridge-frame" box={L.cartridge} accent="color/marker/race" />
        <Label id="cartridge-header" box={L.cartridgeHeader} size={20} weight={600} ink={muted}>
          INSTALLED PRIOR MODULE
        </Label>
        {ms >= cue.t37PiRace && (
          <Label id="cartridge-pi" box={L.cartridgePi} size={38} weight={700} ink={raceRed} opacity={piP}>
            Π<sub>race</sub>
          </Label>
        )}

        {ms >= cue.t37Installed && (
          <Label id="cartridge-label" box={L.cartridgeLabel} size={28} weight={600} sans lh={1.25} ink={primary} opacity={installedP}>
            INSTITUTIONALLY INSTALLED RACIAL ASSUMPTION
          </Label>
        )}

        {ms >= cue.t37Institutionally && (
          <>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path {...lineAttrs('inst-bus', busPoints)} d={pathFrom(busPoints)} fill="none" stroke={raceRed} strokeWidth="4" opacity={instP} />
            </svg>
            <Label id="cartridge-input" box={L.cartridgeInput} size={22} weight={600} ink={raceRed} opacity={instP}>
              INSTITUTIONAL INPUT
            </Label>
          </>
        )}
        <Label id="cartridge-footer" box={L.cartridgeFooter} size={20} weight={600} ink={gold}>
          PRIOR ROUTING STAGE · CH. 2
        </Label>
      </div>

      {/* Lower Left Routing Mechanism Card */}
      <div data-cartridge-mech="true">
        <Panel id="cartridge-mech-frame" box={L.cartridgeMech} accent="color/line/hairline" />
        <Label id="mech-header" box={L.mechHeader} size={20} weight={600} ink={gold}>
          ROUTING MECHANISM
        </Label>
        <Label id="mech-body" box={L.mechBody} size={28} weight={500} sans lh={1.25} ink={soft}>
          Steers identification and vigilance before evidence
        </Label>
        <Label id="mech-footer" box={L.mechFooter} size={20} weight={600} ink={muted}>
          AUTOMATIC GATEWAY SELECTION
        </Label>
      </div>

      {/* Direct Facts Lane */}
      {ms >= cue.t37Facts && (
        <div data-facts-lane="true" style={{opacity: factsP}}>
          <Panel id="facts-lane-frame" box={L.factsLane} accent="color/line/hairline" />
          <Label id="facts-header" box={L.factsHeader} size={20} weight={600} ink={muted}>
            EVIDENCE STREAM
          </Label>
          <Label id="facts-title" box={L.factsTitle} size={28} weight={700} sans ink={primary}>
            DIRECT FACTS
          </Label>
          <EvidenceToken
            id="token-fact-1"
            label="DIRECT EVIDENCE"
            kind="fact"
            progress={1}
            emphasis={factsP}
            box={L.tokenFact1}
            size={20}
          />
          <EvidenceToken
            id="token-fact-2"
            label="RECORDED OBSERVATION"
            kind="fact"
            progress={1}
            emphasis={factsP}
            box={L.tokenFact2}
            size={20}
          />
          <EvidenceToken
            id="token-fact-3"
            label="MEASURED OUTCOMES"
            kind="fact"
            progress={1}
            emphasis={factsP}
            box={L.tokenFact3}
            size={20}
          />
          <Label id="facts-body" box={L.factsBody} size={28} weight={500} sans lh={1.3} ink={soft}>
            Observable facts remain on the table while the prior routes the reading
          </Label>
          <Label id="facts-visible" box={L.factsVisible} size={22} weight={600} align="center" ink={gold}>
            FACTS REMAIN VISIBLE
          </Label>
        </div>
      )}

      {/* Legal Color Line Divider */}
      {ms >= cue.t37Legal && (
        <div data-divider="true">
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('divider-rule-top', dividerTop)} d={pathFrom(dividerTop)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={legalP} />
            <path {...lineAttrs('divider-rule-bottom', dividerBottom)} d={pathFrom(dividerBottom)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={legalP} />
          </svg>
          <Label id="divider-label" box={L.dividerLabel} size={20} weight={600} lh={1.25} align="center" ink={gold} opacity={legalP}>
            LEGAL COLOR LINE
          </Label>
        </div>
      )}

      {/* Routing Traces */}
      {ms >= cue.t37Routes && (
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
          {upperDrawn.length >= 2 && (
            <path {...lineAttrs('route-empathy', upperDrawn)} d={pathFrom(upperDrawn)} fill="none" stroke={gold} strokeWidth="3.5" opacity={routesP} />
          )}
          {lowerDrawn.length >= 2 && (
            <path {...lineAttrs('route-threat', lowerDrawn)} d={pathFrom(lowerDrawn)} fill="none" stroke={raceRed} strokeWidth="3.5" opacity={routesP} />
          )}
        </svg>
      )}

      {/* Output Gates */}
      {ms >= cue.t37Empathy && (
        <div data-empathy-gate="true" style={{opacity: empathyP}}>
          <Panel id="empathy-gate-frame" box={L.empathyGate} accent="color/fill/gold" />
          <Label id="empathy-header" box={L.empathyHeader} size={20} weight={600} ink={muted}>
            UPPER OUTPUT GATE
          </Label>
          <Label id="empathy-title" box={L.empathyTitle} size={28} weight={700} sans ink={gold}>
            EMPATHY ROUTING
          </Label>
          <Label id="empathy-sub" box={L.empathySub} size={28} weight={500} sans lh={1.25} ink={soft}>
            Selective identification channel
          </Label>
          <Label id="empathy-footer" box={L.empathyFooter} size={20} weight={600} ink={gold}>
            INGROUP SOLIDARITY GRANT
          </Label>
        </div>
      )}

      {ms >= cue.t37Threat && (
        <div data-threat-gate="true" style={{opacity: threatP}}>
          <Panel id="threat-gate-frame" box={L.threatGate} accent="color/marker/race" />
          <Label id="threat-header" box={L.threatHeader} size={20} weight={600} ink={muted}>
            LOWER OUTPUT GATE
          </Label>
          <Label id="threat-title" box={L.threatTitle} size={28} weight={700} sans ink={raceRed}>
            THREAT DETECTION
          </Label>
          <Label id="threat-sub" box={L.threatSub} size={28} weight={500} sans lh={1.25} ink={soft}>
            Heightened vigilance channel
          </Label>
          <Label id="threat-footer" box={L.threatFooter} size={20} weight={600} ink={raceRed}>
            OUTGROUP SUSPICION TRIGGER
          </Label>
        </div>
      )}

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        The Original Power, Chapter 2 · Eq. 2.8a · installed racial prior
      </Label>
    </StageSceneFrame>
  );
}
