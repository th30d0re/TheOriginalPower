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
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));

export const EXCEPTION_FENCE_LAYOUT = {
  // Top source header tab
  allportTab: {x: 120, y: 115, w: 570, h: 68},

  // Left: Habitual-stereotype template
  habitualTemplate: {x: 120, y: 210, w: 570, h: 650},

  // Center-left: Contradictory-facts lane
  factsLane: {x: 740, y: 260, w: 380, h: 540},

  // Center-right: Update gate
  updateGate: {x: 1160, y: 290, w: 160, h: 510},

  // Right upper: Lone-exception cell
  exceptionCell: {x: 1390, y: 210, w: 400, h: 300},

  // Right lower: Retained stereotype field
  retainedField: {x: 1390, y: 560, w: 400, h: 300},

  // Source line (clear of bottom notch x 880–1040, y >= 990)
  source: {x: 116, y: 960, w: 740, h: 28},
} as const;

const TEMPLATE_GRID: readonly [number, number][] = [
  [120, 100],
  [245, 100],
  [370, 100],
  [120, 235],
  [245, 235],
  [370, 235],
];

export function ExceptionFence({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t50Allport: useCue('t50Allport').at,
    t50Habitual: useCue('t50Habitual').at,
    t50Resist: useCue('t50Resist').at,
    t50Correcting: useCue('t50Correcting').at,
    t50Strong: useCue('t50Strong').at,
    t50Facts: useCue('t50Facts').at,

    t51Contradicts: useCue('t51Contradicts').at,
    t51Fences: useCue('t51Fences').at,
    t51Exception: useCue('t51Exception').at,
    t51Keeping: useCue('t51Keeping').at,
    t51Stereotype: useCue('t51Stereotype').at,
    t51Intact: useCue('t51Intact').at,
  };

  const L = EXCEPTION_FENCE_LAYOUT;

  const allportP = enter(ms, cue.t50Allport);
  const habitualP = enter(ms, cue.t50Habitual);
  const resistP = enter(ms, cue.t50Resist);
  const correctingP = enter(ms, cue.t50Correcting);
  const strongP = enter(ms, cue.t50Strong);
  const factsP = enter(ms, cue.t50Facts);

  const contradictsP = enter(ms, cue.t51Contradicts);
  const fencesP = enter(ms, cue.t51Fences);
  const exceptionP = enter(ms, cue.t51Exception);
  const keepingP = enter(ms, cue.t51Keeping);
  const stereotypeP = enter(ms, cue.t51Stereotype);
  const intactP = enter(ms, cue.t51Intact);

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const orange = color('color/text/accent');
  const primary = color('color/text/primary');
  const soft = color('color/text/soft');
  const muted = color('color/text/muted');

  // Correction arrow from factsLane right edge (1120) to updateGate left edge (1160)
  const correctionArrow: Point[] = [[1120, 530], [1160, 530]];
  // Exception routing line from updateGate right edge (1320) to exceptionCell left edge (1390)
  const exceptionRouteLine: Point[] = [[1320, 360], [1390, 360]];
  // Retained path line from updateGate right edge (1320) to retainedField left edge (1390)
  const retainedRouteLine: Point[] = [[1320, 710], [1390, 710]];

  return (
    <StageSceneFrame segment={segment}>
      {ms >= cue.t50Allport && (
        <div data-scene-content="exception-fence" style={{opacity: allportP}}>
          {/* Top Source Tab (height 68, text span 36 -> 32 px margin) */}
          <Panel id="allport-tab" box={L.allportTab} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
          </Panel>
          <Label id="allport-tab-label" box={{x: 148, y: 131, w: 520, h: 36}} size={28} weight={650} sans ink={gold}>
            ALLPORT 1954
          </Label>

          {/* Left Panel: Habitual-Stereotype Template (height 650, text span 614 -> 36 px margin) */}
          <Panel
            id="habitual-template"
            box={L.habitualTemplate}
            accent={ms >= cue.t50Habitual ? 'color/marker/race' : 'color/line/hairline'}
          />
          <Label
            id="habitual-title"
            box={{x: 150, y: 228, w: 510, h: 38}}
            size={28}
            weight={650}
            sans
            ink={ms >= cue.t50Habitual ? raceRed : primary}
          >
            {ms >= cue.t50Habitual ? 'HABITUAL PREJUDICE' : 'PREJUDICE TEMPLATE'}
          </Label>
          <Label
            id="habitual-subtitle"
            box={{x: 150, y: 274, w: 510, h: 32}}
            size={22}
            weight={600}
            ink={ms >= cue.t50Habitual ? gold : soft}
          >
            {ms >= cue.t50Habitual ? 'GROUP STEREOTYPE' : 'FIXED CATEGORY BOUNDARY'}
          </Label>

          {/* Group Template Loop Mark */}
          <div
            {...shapeAttrs('habitual-loop-mark', {x: 150, y: 324, w: 510, h: 336}, 'mark', 'habitual-loop')}
            style={{
              position: 'absolute',
              left: 150,
              top: 324,
              width: 510,
              height: 336,
              border: `2px solid ${raceRed}`,
              borderRadius: 12,
              background: color('color/fill/red-wash'),
            }}
          >
            <svg width="510" height="336" viewBox="0 0 510 336" style={{position: 'absolute', inset: 0}} aria-hidden="true">
              <rect
                x="24"
                y="24"
                width="462"
                height="288"
                rx="16"
                fill="none"
                stroke={gold}
                strokeWidth="2.5"
                strokeDasharray="10 6"
                opacity={ms >= cue.t50Habitual ? habitualP : 0.35}
              />
            </svg>
            {TEMPLATE_GRID.map(([gx, gy], idx) => {
              // At t51Contradicts, the 6th member departs toward the gate
              if (idx === 5 && ms >= cue.t51Contradicts) return null;
              return <PersonMark key={idx} x={gx} y={gy} group="outgroup" emphasis={1} scale={1.05} />;
            })}
          </div>

          <Label
            id="habitual-body"
            box={{x: 150, y: 680, w: 510, h: 112}}
            size={28}
            weight={400}
            lh={1.34}
            sans
            ink={primary}
          >
            Closed generalization loops across the group and resists revision.
          </Label>

          <Label
            id="habitual-footer"
            box={{x: 150, y: 810, w: 510, h: 32}}
            size={20}
            weight={600}
            ink={ms >= cue.t51Stereotype ? raceRed : muted}
          >
            {ms >= cue.t51Stereotype ? 'STEREOTYPE RETAINED' : 'REPEATED TEMPLATE LOOP'}
          </Label>

          {/* Center-Right: Update Gate (opens at t50Resist, height 510, text span 474 -> 36 px margin) */}
          {ms >= cue.t50Resist && (
            <div data-update-gate="true" data-gate-holds={ms >= cue.t50Facts ? 'true' : undefined} style={{opacity: resistP}}>
              <Panel id="update-gate" box={L.updateGate} accent="color/marker/race" />
              <Label
                id="update-gate-title"
                box={{x: 1172, y: 308, w: 136, h: 84}}
                size={20}
                weight={650}
                align="center"
                ink={raceRed}
              >
                UPDATE GATE CLOSED
              </Label>

              <div
                {...shapeAttrs('update-gate-barrier', {x: 1188, y: 412, w: 104, h: 256}, 'mark', 'gate-barrier')}
                style={{
                  position: 'absolute',
                  left: 1188,
                  top: 412,
                  width: 104,
                  height: 256,
                  border: `2px solid ${raceRed}`,
                  borderRadius: 8,
                  background: color('color/fill/red-wash'),
                }}
              >
                <svg width="104" height="256" viewBox="0 0 104 256" aria-hidden="true">
                  <line x1="52" y1="18" x2="52" y2="238" stroke={raceRed} strokeWidth="6" />
                  <circle cx="52" cy="128" r="22" fill={color('color/bg/field')} stroke={gold} strokeWidth="3" />
                  <path d="M42 118 L62 138 M62 118 L42 138" stroke={raceRed} strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <Label
                id="update-gate-footer"
                box={{x: 1172, y: 700, w: 136, h: 82}}
                size={20}
                weight={500}
                align="center"
                ink={ms >= cue.t50Facts ? gold : soft}
                opacity={ms >= cue.t50Facts ? factsP : 1}
              >
                BLOCKS REVISION
              </Label>
            </div>
          )}

          {/* Center-Left: Contradictory-Facts Lane (opens at t50Correcting, height 540, text span 504 -> 36 px margin) */}
          {ms >= cue.t50Correcting && (
            <div data-facts-lane="true" style={{opacity: correctingP}}>
              <Panel
                id="facts-lane"
                box={L.factsLane}
                accent={ms >= cue.t50Strong ? 'color/text/accent' : 'color/fill/gold'}
              />
              <Label id="facts-lane-title" box={{x: 764, y: 278, w: 332, h: 36}} size={24} weight={650} ink={gold}>
                CORRECTION ATTEMPT
              </Label>
              <Label
                id="facts-lane-strong"
                box={{x: 764, y: 324, w: 332, h: 60}}
                size={22}
                weight={650}
                ink={ms >= cue.t50Strong ? orange : soft}
              >
                {ms >= cue.t50Strong ? 'STRONG CONTRADICTORY FACTS' : 'INCOMING OBSERVATION STREAM'}
              </Label>

              {/* Fact chips mark cluster */}
              <div
                {...shapeAttrs('facts-tokens-mark', {x: 764, y: 396, w: 332, h: 210}, 'mark', 'facts-tokens')}
                style={{
                  position: 'absolute',
                  left: 764,
                  top: 396,
                  width: 332,
                  height: 210,
                  border: `1px solid ${ms >= cue.t50Strong ? orange : color('color/line/hairline')}`,
                  borderRadius: 10,
                }}
              >
                <svg width="332" height="210" viewBox="0 0 332 210" aria-hidden="true">
                  {[26, 88, 150].map((ry, i) => (
                    <g key={i}>
                      <rect
                        x="18"
                        y={ry}
                        width="250"
                        height="38"
                        rx="6"
                        fill={ms >= cue.t50Strong ? color('color/fill/gold-wash') : 'none'}
                        stroke={ms >= cue.t50Strong ? orange : gold}
                        strokeWidth={ms >= cue.t50Strong ? 2.5 : 1.5}
                      />
                      <path d={`M276 ${ry + 19} H314`} stroke={orange} strokeWidth="3" />
                    </g>
                  ))}
                </svg>
              </div>

              <Label
                id="facts-lane-body"
                box={{x: 764, y: 618, w: 332, h: 120}}
                size={28}
                weight={400}
                lh={1.32}
                sans
                ink={primary}
              >
                Direct evidence presses against the closed update gate.
              </Label>
              <Label id="facts-lane-footer" box={{x: 764, y: 750, w: 332, h: 32}} size={20} weight={500} ink={muted}>
                EVIDENCE BLOCKED AT GATE
              </Label>

              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('correction-arrow', correctionArrow)} d={pathFrom(correctionArrow)} fill="none" stroke={orange} strokeWidth="4" />
              </svg>
            </div>
          )}

          {/* Turn 51: Departing contradicting member mark above the gate (strictly outside all frames) */}
          {ms >= cue.t51Contradicts && ms < cue.t51Exception && (
            <div
              data-departing-member="true"
              {...shapeAttrs('departing-member-mark', {x: 1216, y: 210, w: 48, h: 62}, 'mark', 'departing-member')}
              style={{position: 'absolute', left: 1216, top: 210, width: 48, height: 62, opacity: contradictsP}}
            >
              <PersonMark x={24} y={32} group="ingroup" emphasis={1} scale={1.05} />
            </div>
          )}
          {ms >= cue.t51Exception && (
            <div data-departing-member="true" style={{display: 'none'}} />
          )}

          {/* Turn 51 Upper Right: Lone-Exception Cell (opens at t51Fences, height 300, text span 264 -> 36 px margin) */}
          {ms >= cue.t51Fences && (
            <div data-exception-cell="true" style={{opacity: fencesP}}>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('exception-route-line', exceptionRouteLine)} d={pathFrom(exceptionRouteLine)} fill="none" stroke={orange} strokeWidth="4" strokeDasharray="6 4" />
              </svg>

              <Panel id="exception-cell" box={L.exceptionCell} accent="color/text/accent" />
              <Label id="exception-fence-title" box={{x: 1414, y: 228, w: 352, h: 34}} size={24} weight={650} ink={orange}>
                EXCEPTION FENCE
              </Label>
              <Label
                id="exception-lone-subtitle"
                box={{x: 1414, y: 266, w: 352, h: 32}}
                size={22}
                weight={650}
                ink={ms >= cue.t51Exception ? gold : soft}
              >
                {ms >= cue.t51Exception ? 'LONE EXCEPTION' : 'SIDE CONTAINMENT CELL'}
              </Label>

              <div
                {...shapeAttrs('exception-cell-mark', {x: 1414, y: 304, w: 352, h: 110}, 'mark', 'exception-enclosure')}
                style={{
                  position: 'absolute',
                  left: 1414,
                  top: 304,
                  width: 352,
                  height: 110,
                  border: `2px ${ms >= cue.t51Exception ? 'solid' : 'dashed'} ${orange}`,
                  borderRadius: 10,
                }}
              >
                <svg width="352" height="110" viewBox="0 0 352 110" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                  {[36, 76, 116, 236, 276, 316].map(fx => (
                    <line key={fx} x1={fx} y1="12" x2={fx} y2="98" stroke={orange} strokeWidth="2.5" strokeDasharray="4 4" />
                  ))}
                </svg>
                {ms >= cue.t51Exception && (
                  <div style={{opacity: exceptionP}}>
                    <PersonMark x={176} y={56} group="ingroup" emphasis={1} scale={1.0} />
                  </div>
                )}
              </div>

              <Label id="exception-cell-body" box={{x: 1414, y: 422, w: 352, h: 72}} size={28} weight={400} sans ink={primary}>
                Fenced off from the group.
              </Label>
            </div>
          )}

          {/* Turn 51 Lower Right: Retained Stereotype Field (opens at t51Keeping, height 300, text span 264 -> 36 px margin) */}
          {ms >= cue.t51Keeping && (
            <div
              data-retained-field="true"
              data-intact-lock={ms >= cue.t51Intact ? 'true' : undefined}
              style={{opacity: keepingP}}
            >
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('retained-route-line', retainedRouteLine)} d={pathFrom(retainedRouteLine)} fill="none" stroke={raceRed} strokeWidth="3.5" />
              </svg>

              <Panel id="retained-field" box={L.retainedField} accent="color/marker/race" />
              <Label
                id="retained-title"
                box={{x: 1414, y: 578, w: 352, h: 34}}
                size={24}
                weight={650}
                ink={raceRed}
                opacity={ms >= cue.t51Stereotype ? stereotypeP : 1}
              >
                {ms >= cue.t51Stereotype ? 'STEREOTYPED GROUP' : 'GROUP TEMPLATE KEPT'}
              </Label>

              <div
                {...shapeAttrs('retained-group-mark', {x: 1414, y: 618, w: 352, h: 104}, 'mark', 'retained-group')}
                style={{
                  position: 'absolute',
                  left: 1414,
                  top: 618,
                  width: 352,
                  height: 104,
                  border: `2px solid ${raceRed}`,
                  borderRadius: 10,
                  background: color('color/fill/red-wash'),
                }}
              >
                {[66, 138, 210, 282].map((rx, idx) => (
                  <PersonMark key={idx} x={rx} y={54} group="outgroup" emphasis={1} scale={0.9} />
                ))}
              </div>

              <Label id="retained-body" box={{x: 1414, y: 730, w: 352, h: 72}} size={28} weight={400} sans ink={primary}>
                Group rule stays intact.
              </Label>
              <Label
                id="retained-footer"
                box={{x: 1414, y: 810, w: 352, h: 32}}
                size={20}
                weight={600}
                ink={ms >= cue.t51Intact ? gold : soft}
                opacity={ms >= cue.t51Intact ? intactP : 1}
              >
                {ms >= cue.t51Intact ? 'INTACT · ZERO REVISION' : 'UNCHANGED TEMPLATE'}
              </Label>
            </div>
          )}
        </div>
      )}

      {/* Source Line */}
      {ms >= cue.t50Allport && (
        <Label id="source-line" box={L.source} size={20} weight={400} ink={muted}>
          Allport 1954, p. 9 · The Nature of Prejudice
        </Label>
      )}
    </StageSceneFrame>
  );
}
