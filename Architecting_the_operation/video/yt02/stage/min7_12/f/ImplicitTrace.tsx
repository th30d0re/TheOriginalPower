import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../../tokens';
import {PersonMark, StageSceneFrame} from '../../min3_7/shared';
import {
  Label,
  Panel,
  SignalLane,
  clamp01,
  lineAttrs,
  shapeAttrs,
  type Box,
  type LaneToken,
  type Point,
} from '../shared';

const enter = (ms: number, at: number, duration = 520) => cubicOut(progress(ms, at, at + duration));
const move = (ms: number, at: number, duration = 650) => cubicInOut(progress(ms, at, at + duration));

export const IMPLICIT_TRACE_LAYOUT = {
  definitionExpanded: {x: 120, y: 170, w: 710, h: 380},
  definitionContracted: {x: 120, y: 170, w: 710, h: 125},
  plainPanel: {x: 120, y: 310, w: 710, h: 250},
  stream: {x: 930, y: 240, w: 230, h: 350},
  traceStore: {x: 1220, y: 240, w: 270, h: 350},
  reactionRail: {x: 1540, y: 240, w: 250, h: 540},
  shortcutLabel: {x: 1230, y: 205, w: 250, h: 28},

  personMark: {x: 880, y: 330, w: 160, h: 180},
  beliefLane: {x: 140, y: 330, w: 660, h: 170},
  automaticLane: {x: 1120, y: 330, w: 660, h: 170},
  responseNode: {x: 780, y: 640, w: 360, h: 160},

  source: {x: 116, y: 964, w: 740, h: 26},
} as const;

export function ImplicitTrace({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    t41Define: useCue('t41Define').at,
    t41Unidentified: useCue('t41Unidentified').at,
    t41Past: useCue('t41Past').at,
    t41Favorable: useCue('t41Favorable').at,
    t41Unfavorable: useCue('t41Unfavorable').at,
    t41Action: useCue('t41Action').at,
    t41Plain: useCue('t41Plain').at,
    t41Experiences: useCue('t41Experiences').at,
    t41Shortcuts: useCue('t41Shortcuts').at,
    t41Steer: useCue('t41Steer').at,
    t41Noticing: useCue('t41Noticing').at,
    t42Precision: useCue('t42Precision').at,
    t42Automatically: useCue('t42Automatically').at,
    t42Accumulated: useCue('t42Accumulated').at,
    t42Sincerely: useCue('t42Sincerely').at,
    t42Equal: useCue('t42Equal').at,
    t42Treatment: useCue('t42Treatment').at,
  };

  const L = IMPLICIT_TRACE_LAYOUT;
  const isTurn42 = ms >= cue.t42Precision;

  const defP = enter(ms, cue.t41Define);
  const unidentP = enter(ms, cue.t41Unidentified);
  const pastP = enter(ms, cue.t41Past);
  const favP = enter(ms, cue.t41Favorable);
  const unfavP = enter(ms, cue.t41Unfavorable);
  const actionP = enter(ms, cue.t41Action);
  const plainP = enter(ms, cue.t41Plain);
  const expP = enter(ms, cue.t41Experiences);
  const shortcutsP = enter(ms, cue.t41Shortcuts);
  const steerP = enter(ms, cue.t41Steer);
  const noticingP = enter(ms, cue.t41Noticing);

  const precisionP = enter(ms, cue.t42Precision);
  const autoP = enter(ms, cue.t42Automatically);
  const accumP = enter(ms, cue.t42Accumulated);
  const sincereP = enter(ms, cue.t42Sincerely);
  const equalP = enter(ms, cue.t42Equal);
  const treatP = enter(ms, cue.t42Treatment);

  const contracted = ms >= cue.t41Plain;
  const defBox = contracted ? L.definitionContracted : L.definitionExpanded;

  const shortcutStroke: Point[] = [[1490, 520], [1540, 520]];
  const streamToStore: Point[] = [[1160, 520], [1220, 520]];
  const traceFaintPath: Point[] = [
    [1235, 520],
    [1300, 520],
    [1320, 550],
    [1370, 550],
    [1420, 520],
    [1490, 520],
  ];

  const beliefTokens: LaneToken[] = [
    {id: 'b1', at: 0.35, emphasis: sincereP, accent: 'color/fill/gold', shape: 'card'},
    {id: 'b2', at: 0.75, emphasis: equalP, accent: 'color/fill/gold', shape: 'card'},
  ];

  const autoTokens: LaneToken[] = [
    {id: 'a1', at: 0.25, emphasis: autoP, accent: 'color/marker/race', shape: 'dot'},
    {id: 'a2', at: 0.55, emphasis: accumP, accent: 'color/marker/race', shape: 'dot'},
    {id: 'a3', at: 0.85, emphasis: autoP, accent: 'color/marker/race', shape: 'dot'},
  ];

  const gold = color('color/fill/gold');
  const raceRed = color('color/marker/race');
  const muted = color('color/text/muted');
  const primary = color('color/text/primary');

  const leaderBelief: Point[] = [[800, 429], [878, 429]];
  const leaderAuto: Point[] = [[1120, 429], [1042, 429]];
  const leaderReaction: Point[] = [[960, 550], [960, 638]];

  return (
    <StageSceneFrame segment={segment}>
      {!isTurn42 && ms >= cue.t41Define && (
        <div data-turn="41" style={{opacity: defP}}>
          <Panel id="def-card" box={defBox} accent="color/fill/gold">
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: gold}} />
          </Panel>

          {!contracted ? (
            <>
              <Label id="def-term" box={{x: 158, y: 198, w: 634, h: 48}} size={36} weight={600} sans ink={gold}>
                IMPLICIT ATTITUDE
              </Label>
              <Label id="def-body" box={{x: 158, y: 260, w: 634, h: 180}} size={28} weight={400} lh={1.34} sans>
                traces of past experience that shape favorable or unfavorable feeling, thought, or action toward social objects
              </Label>
              <Label id="def-source" box={{x: 158, y: 470, w: 340, h: 28}} size={20} weight={400} ink={muted}>
                Greenwald & Banaji 1995
              </Label>
              <Label id="def-paraphrased" box={{x: 530, y: 470, w: 260, h: 28}} size={20} weight={400} align="right" ink={muted}>
                (paraphrased)
              </Label>
            </>
          ) : (
            <>
              <Label id="def-term-contracted" box={{x: 158, y: 190, w: 634, h: 42}} size={32} weight={600} sans ink={gold}>
                IMPLICIT ATTITUDE
              </Label>
              <Label id="def-source-contracted" box={{x: 158, y: 242, w: 340, h: 28}} size={20} weight={400} ink={muted}>
                Greenwald & Banaji 1995
              </Label>
              <Label id="def-paraphrased-contracted" box={{x: 530, y: 242, w: 260, h: 28}} size={20} weight={400} align="right" ink={muted}>
                (paraphrased)
              </Label>
            </>
          )}

          {ms >= cue.t41Plain && (
            <div data-plain-panel="true" style={{opacity: plainP}}>
              <Panel id="plain-panel" box={L.plainPanel} />
              <Label id="plain-heading" box={{x: 158, y: 330, w: 634, h: 36}} size={24} weight={650} sans ink={gold}>
                IN PLAIN WORDS
              </Label>
              <Label id="plain-body" box={{x: 158, y: 380, w: 634, h: 150}} size={26} weight={400} lh={1.32} sans ink={primary}>
                Past experiences leave mental shortcuts that steer reactions without the person noticing where those reactions came from.
              </Label>
            </div>
          )}

          {ms >= cue.t41Past && (
            <div data-stream="true" style={{opacity: pastP}}>
              <Panel id="stream-panel" box={L.stream} />
              <Label id="stream-label" box={{x: 940, y: 260, w: 210, h: 32}} size={20} weight={600} ls={0.8} align="center" ink={gold}>
                PAST EXPERIENCE
              </Label>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('stream-to-store', streamToStore)} d="M1160 530H1220" stroke={gold} strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              <Panel id="exp-card-1" box={{x: 945, y: 310, w: 200, h: 54}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="exp-card-1-label" box={{x: 955, y: 325, w: 180, h: 26}} size={18} weight={500} align="center" ink={primary}>
                PAST EXPERIENCE
              </Label>

              <Panel id="exp-card-2" box={{x: 945, y: 375, w: 200, h: 54}} accent="color/fill/gold">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="exp-card-2-label" box={{x: 955, y: 390, w: 180, h: 26}} size={18} weight={500} align="center" ink={primary}>
                PAST EXPERIENCE
              </Label>

              {ms >= cue.t41Experiences && (
                <>
                  <Panel id="exp-card-3" box={{x: 945, y: 440, w: 200, h: 54}} accent="color/fill/gold">
                    <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
                  </Panel>
                  <Label
                    id="stream-experiences"
                    box={{x: 955, y: 455, w: 180, h: 26}}
                    size={18}
                    weight={500}
                    align="center"
                    ink={primary}
                    opacity={expP}
                  >
                    PAST EXPERIENCES
                  </Label>
                </>
              )}
            </div>
          )}

          {ms >= cue.t41Unidentified && (
            <div data-trace-store="true" style={{opacity: unidentP}}>
              <Panel id="trace-panel" box={L.traceStore} />
              <Label id="trace-title" box={{x: 1230, y: 260, w: 250, h: 56}} size={20} weight={600} ls={0.5} align="center" ink={gold}>
                INTROSPECTIVELY UNIDENTIFIED TRACE
              </Label>

              <Panel id="inspection-screen" box={{x: 1235, y: 325, w: 240, h: 210}}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(38, 56, 89, 0.45)',
                    opacity: ms >= cue.t41Noticing ? 0.35 : 0.75,
                  }}
                />
              </Panel>

              <Panel id="trace-stored-1" box={{x: 1245, y: 340, w: 220, h: 54}} accent="color/line/hairline">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="trace-stored-1-label" box={{x: 1255, y: 354, w: 200, h: 26}} size={18} weight={500} align="center" ink={gold}>
                UNIDENTIFIED TRACE
              </Label>

              <Panel id="trace-stored-2" box={{x: 1245, y: 410, w: 220, h: 54}} accent="color/line/hairline">
                <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: gold}} />
              </Panel>
              <Label id="trace-stored-2-label" box={{x: 1255, y: 424, w: 200, h: 26}} size={18} weight={500} align="center" ink={primary}>
                STORED SHORTCUT
              </Label>

              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path
                  {...lineAttrs('faint-path', traceFaintPath)}
                  d="M1235 520H1300C1320 520 1320 550 1370 550C1420 550 1420 520 1490 520"
                  fill="none"
                  stroke={gold}
                  strokeWidth={ms >= cue.t41Steer ? 3 : 2}
                  strokeDasharray="4 4"
                  opacity={ms >= cue.t41Steer ? 0.85 : 0.45}
                />
              </svg>
            </div>
          )}

          {ms >= cue.t41Shortcuts && (
            <div data-shortcut="true" style={{opacity: shortcutsP}}>
              <Label id="shortcut-label" box={L.shortcutLabel} size={18} weight={600} ls={0.8} align="center" ink={gold}>
                MENTAL SHORTCUT
              </Label>
              <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                <path {...lineAttrs('shortcut-path', shortcutStroke)} d="M1490 530H1540" stroke={gold} strokeWidth={ms >= cue.t41Steer ? 4 : 2} />
              </svg>
            </div>
          )}

          <div data-reaction-rail="true" style={{opacity: Math.max(favP, unfavP, actionP)}}>
            <Panel id="rail-panel" box={L.reactionRail} />
            <Label id="rail-label" box={{x: 1550, y: 260, w: 230, h: 32}} size={22} weight={600} ls={1} align="center" ink={gold}>
              REACTION
            </Label>

            {ms >= cue.t41Favorable && (
              <Label id="valence-pos" box={{x: 1550, y: 310, w: 230, h: 28}} size={20} weight={600} ls={1} align="center" ink={gold} opacity={favP}>
                + FAVORABLE
              </Label>
            )}

            {ms >= cue.t41Action && (
              <div data-action-sockets="true" style={{opacity: actionP}}>
                <Label id="socket-feeling" box={{x: 1560, y: 370, w: 210, h: 32}} size={20} weight={500} align="center">
                  FEELING
                </Label>
                <Label id="socket-thought" box={{x: 1560, y: 440, w: 210, h: 32}} size={20} weight={500} align="center">
                  THOUGHT
                </Label>
                <Label id="socket-action" box={{x: 1560, y: 610, w: 210, h: 32}} size={20} weight={500} align="center">
                  ACTION
                </Label>
              </div>
            )}

            {ms >= cue.t41Unfavorable && (
              <Label id="valence-neg" box={{x: 1550, y: 700, w: 230, h: 28}} size={20} weight={600} ls={1} align="center" ink={raceRed} opacity={unfavP}>
                − UNFAVORABLE
              </Label>
            )}
          </div>
        </div>
      )}

      {isTurn42 && (
        <div data-turn="42" style={{opacity: precisionP}}>
          <SignalLane
            id="belief-lane"
            box={L.beliefLane}
            label="SINCERE EQUAL-TREATMENT BELIEF"
            progress={precisionP}
            accent="color/fill/gold"
            direction="right"
            tokens={beliefTokens}
          />
          {ms >= cue.t42Equal && (
            <Label id="equal-treatment" box={{x: 170, y: 450, w: 260, h: 28}} size={20} weight={600} ls={1} ink={gold} opacity={equalP}>
              EQUAL TREATMENT
            </Label>
          )}
          {ms >= cue.t42Sincerely && (
            <div
              {...shapeAttrs('sincere-ring', {x: 440, y: 448, w: 28, h: 28}, 'mark', 'ring')}
              style={{
                position: 'absolute',
                left: 440,
                top: 448,
                width: 28,
                height: 28,
                borderRadius: 14,
                border: `2px solid ${gold}`,
                boxSizing: 'border-box',
                opacity: sincereP,
              }}
            />
          )}

          <div
            {...shapeAttrs('person-mark-frame', L.personMark, 'mark', 'person')}
            style={{position: 'absolute', left: L.personMark.x, top: L.personMark.y, width: L.personMark.w, height: L.personMark.h}}
          >
            <PersonMark x={80} y={85} group="neutral" emphasis={1} scale={1.8} />
          </div>
          <Label id="person-label" box={{x: 880, y: 520, w: 160, h: 30}} size={20} weight={600} ls={1} align="center" ink={gold}>
            ONE PERSON
          </Label>

          <SignalLane
            id="automatic-lane"
            box={L.automaticLane}
            label="AUTOMATIC ASSOCIATION"
            progress={precisionP}
            accent="color/marker/race"
            direction="left"
            tokens={autoTokens}
          />
          {ms >= cue.t42Automatically && (
            <Label id="accumulated-surroundings" box={{x: 1150, y: 450, w: 360, h: 28}} size={20} weight={500} ink={color('color/text/soft')} opacity={autoP}>
              ACCUMULATED SURROUNDINGS
            </Label>
          )}

          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} aria-hidden="true">
            <path {...lineAttrs('leader-belief', leaderBelief)} d="M800 429H878" fill="none" stroke={gold} strokeWidth="3" opacity={treatP} />
            <path {...lineAttrs('leader-auto', leaderAuto)} d="M1120 429H1042" fill="none" stroke={raceRed} strokeWidth="3" opacity={treatP} />
            <path {...lineAttrs('leader-reaction', leaderReaction)} d="M960 550V638" fill="none" stroke={gold} strokeWidth="3" strokeDasharray="4 4" opacity={treatP} />
          </svg>

          <Panel id="response-node" box={L.responseNode} accent={treatP > 0 ? 'color/fill/gold' : 'color/line/hairline'}>
            <span aria-hidden="true" style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: gold}} />
          </Panel>
          <Label id="response-title" box={{x: 790, y: 675, w: 340, h: 36}} size={24} weight={600} ls={1} align="center" ink={gold}>
            REACTION
          </Label>
          <Label id="response-sub" box={{x: 790, y: 725, w: 340, h: 48}} size={20} weight={400} align="center" ink={color('color/text/soft')}>
            INDIVIDUAL RESPONSE NODE
          </Label>
        </div>
      )}

      {ms >= cue.t41Define && (
        <Label id="source-line" box={L.source} size={20} weight={400} ls={0.35} lh={1.35} ink={muted}>
          Greenwald & Banaji 1995 · Psychological Review 102(1)
        </Label>
      )}
    </StageSceneFrame>
  );
}
