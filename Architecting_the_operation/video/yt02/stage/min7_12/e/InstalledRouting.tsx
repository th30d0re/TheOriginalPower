import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {EquationTerms, type EquationPulseMap, type EquationToken} from '../../equations';
import {StageSceneFrame} from '../../min3_7/shared';
import {
  EvidenceToken,
  Label,
  Panel,
  clamp01,
  lineAttrs,
  partialPolyline,
  pathFrom,
  shapeAttrs,
  type Box,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const INSTALLED_ROUTING_LAYOUT = {
  // Equation continuity strip
  equation: {x: 120, y: 100, w: 1680, h: 120},
  eqTerms: {x: 120, y: 108, w: 1680, h: 50},
  eqLabel: {x: 120, y: 168, w: 420, h: 32},

  // Cartridge
  cartridge: {x: 120, y: 300, w: 440, h: 330},
  cartridgePi: {x: 150, y: 325, w: 380, h: 60},
  cartridgeLabel: {x: 150, y: 410, w: 380, h: 72},
  cartridgeInput: {x: 150, y: 530, w: 380, h: 36},

  // Direct Facts lane
  factsLane: {x: 660, y: 280, w: 470, h: 540},
  factsTitle: {x: 690, y: 305, w: 410, h: 36},
  tokenFact1: {x: 690, y: 370, w: 410, h: 54},
  tokenFact2: {x: 690, y: 450, w: 410, h: 54},
  tokenFact3: {x: 690, y: 530, w: 410, h: 54},
  factsVisible: {x: 690, y: 740, w: 410, h: 36},

  // Legal Color Line Divider
  divider: {x: 1190, y: 245, w: 70, h: 605},
  dividerLabel: {x: 1192, y: 500, w: 66, h: 90},

  // Output Gates
  empathyGate: {x: 1360, y: 280, w: 420, h: 220},
  empathyTitle: {x: 1390, y: 310, w: 360, h: 36},
  empathySub: {x: 1390, y: 370, w: 360, h: 60},

  threatGate: {x: 1360, y: 610, w: 420, h: 220},
  threatTitle: {x: 1390, y: 640, w: 360, h: 36},
  threatSub: {x: 1390, y: 700, w: 360, h: 60},

  // Source line
  source: {x: 116, y: 946, w: 740, h: 56},
} as const;

const eq28aTokens: readonly EquationToken[] = [
  {text: 'P', width: 32},
  {term: 'i', math: '_i', width: 24},
  {text: '(', width: 18},
  {term: 'T', width: 34},
  {text: ' | ', width: 42},
  {term: 'X', width: 34},
  {text: ', ', width: 30},
  {term: 'PiRace', math: 'Π_{race}', width: 76},
  {text: ')', width: 18},
  {text: ' ∝ ', width: 74},
  {text: 'P(', width: 48},
  {term: 'X', width: 34},
  {text: ' | ', width: 42},
  {term: 'T', width: 34},
  {text: ') · P', width: 88},
  {term: 'i', math: '_i', width: 24},
  {text: '(', width: 18},
  {term: 'T', width: 34},
  {text: ' | ', width: 42},
  {term: 'PiRace', math: 'Π_{race}', width: 76},
  {text: ')', width: 18},
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
  const objP = enter(ms, cue.t37Object);
  const instP = enter(ms, cue.t37Institutionally);
  const installedP = enter(ms, cue.t37Installed);
  const routesP = enter(ms, cue.t37Routes);
  const empathyP = enter(ms, cue.t37Empathy);
  const threatP = enter(ms, cue.t37Threat);
  const legalP = enter(ms, cue.t37Legal);
  const factsP = enter(ms, cue.t37Facts);
  const supportP = enter(ms, cue.t37Support);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  const eqPulses: EquationPulseMap = {
    PiRace: [cue.t37PiRace, cue.t37Routes],
  };

  // Traces from cartridge to gates
  const upperTraceFull: Point[] = [
    [560, 420], [610, 420], [610, 260], [1310, 260], [1310, 390], [1360, 390],
  ];
  const lowerTraceFull: Point[] = [
    [560, 510], [610, 510], [610, 840], [1310, 840], [1310, 720], [1360, 720],
  ];

  const upperDrawn = partialPolyline(upperTraceFull, routesP);
  const lowerDrawn = partialPolyline(lowerTraceFull, routesP);

  const busPoints: Point[] = [[64, 548], [120, 548]];
  const dividerTop: Point[] = [[1225, 255], [1225, 495]];
  const dividerBottom: Point[] = [[1225, 595], [1225, 835]];

  return (
    <StageSceneFrame segment={segment}>
      {/* Continuity Equation Strip */}
      <div data-continuity-strip="true">
        <Panel id="eq-strip-frame" box={L.equation} />
        <EquationTerms
          equation="Eq. 2.8a"
          tokens={eq28aTokens}
          pulses={eqPulses}
          ms={ms}
          box={L.eqTerms}
          fontSize={28}
        />
        <Label id="eq-label" box={L.eqLabel} size={20} weight={500} ink={gold}>
          Eq. 2.8a · installed racial prior
        </Label>
      </div>

      {/* Installed-Prior Cartridge */}
      <div data-cartridge="true">
        <Panel id="cartridge-frame" box={L.cartridge} accent="color/marker/race" />
        {ms >= cue.t37PiRace && (
          <Label id="cartridge-pi" box={L.cartridgePi} size={36} weight={700} ink={raceRed} opacity={piP}>
            Π<sub>race</sub>
          </Label>
        )}

        {ms >= cue.t37Installed && (
          <Label id="cartridge-label" box={L.cartridgeLabel} size={22} weight={600} lh={1.25} ink={primary} opacity={installedP}>
            INSTITUTIONALLY INSTALLED RACIAL ASSUMPTION
          </Label>
        )}

        {ms >= cue.t37Institutionally && (
          <>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <path {...lineAttrs('inst-bus', busPoints)} d={pathFrom(busPoints)} fill="none" stroke={raceRed} strokeWidth="4" opacity={instP} />
            </svg>
            <Label id="cartridge-input" box={L.cartridgeInput} size={20} weight={600} ink={raceRed} opacity={instP}>
              INSTITUTIONAL INPUT
            </Label>
          </>
        )}
      </div>

      {/* Direct Facts Lane */}
      <div data-facts-lane="true">
        <Panel id="facts-lane-frame" box={L.factsLane} accent="color/line/hairline" />

        {ms >= cue.t37Facts && (
          <>
            <Label id="facts-title" box={L.factsTitle} size={24} weight={600} ink={primary} opacity={factsP}>
              DIRECT FACTS
            </Label>
            <EvidenceToken
              id="token-fact-1"
              label="DIRECT EVIDENCE"
              kind="fact"
              progress={factsP}
              emphasis={factsP}
              box={L.tokenFact1}
              size={20}
            />
            <EvidenceToken
              id="token-fact-2"
              label="RECORDED OBSERVATION"
              kind="fact"
              progress={factsP}
              emphasis={factsP}
              box={L.tokenFact2}
              size={20}
            />
            <EvidenceToken
              id="token-fact-3"
              label="MEASURED OUTCOMES"
              kind="fact"
              progress={factsP}
              emphasis={factsP}
              box={L.tokenFact3}
              size={20}
            />
            <Label id="facts-visible" box={L.factsVisible} size={20} weight={600} align="center" ink={gold} opacity={factsP}>
              FACTS REMAIN VISIBLE
            </Label>
          </>
        )}
      </div>

      {/* Legal Color Line Divider */}
      {ms >= cue.t37Legal && (
        <div data-divider="true">
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('divider-rule-top', dividerTop)} d={pathFrom(dividerTop)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={legalP} />
            <path {...lineAttrs('divider-rule-bottom', dividerBottom)} d={pathFrom(dividerBottom)} fill="none" stroke={gold} strokeWidth="3" strokeDasharray="6 4" opacity={legalP} />
          </svg>
          <Label id="divider-label" box={L.dividerLabel} size={20} weight={600} lh={1.25} ink={gold} opacity={legalP}>
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
      <div data-empathy-gate="true">
        <Panel id="empathy-gate-frame" box={L.empathyGate} accent={ms >= cue.t37Empathy ? 'color/fill/gold' : 'color/line/hairline'} />
        {ms >= cue.t37Empathy && (
          <>
            <Label id="empathy-title" box={L.empathyTitle} size={24} weight={600} ink={gold} opacity={empathyP}>
              EMPATHY ROUTING
            </Label>
            <Label id="empathy-sub" box={L.empathySub} size={20} weight={400} lh={1.3} ink={soft} opacity={empathyP}>
              selective identification channel
            </Label>
          </>
        )}
      </div>

      <div data-threat-gate="true">
        <Panel id="threat-gate-frame" box={L.threatGate} accent={ms >= cue.t37Threat ? 'color/marker/race' : 'color/line/hairline'} />
        {ms >= cue.t37Threat && (
          <>
            <Label id="threat-title" box={L.threatTitle} size={24} weight={600} ink={raceRed} opacity={threatP}>
              THREAT DETECTION
            </Label>
            <Label id="threat-sub" box={L.threatSub} size={20} weight={400} lh={1.3} ink={soft} opacity={threatP}>
              heightened vigilance channel
            </Label>
          </>
        )}
      </div>

      {/* Source line */}
      <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
        The Original Power, Chapter 2 · Eq. 2.8a · installed racial prior
      </Label>
    </StageSceneFrame>
  );
}
