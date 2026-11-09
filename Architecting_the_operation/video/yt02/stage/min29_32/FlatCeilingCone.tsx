import React from 'react';
import {interpolate} from 'remotion';
import {
  BootIn,
  DrawLine,
  DrawRect,
  FitBox,
  Flicker,
  KitSound,
  StageSceneFrame,
  StickFigure,
  color,
  useCue,
  useStageMs,
  type SceneProps,
} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';

const frame = (ms: number) => Math.round((ms * 30) / 1000);
const clampBoth = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Text = ({
  at,
  box,
  children,
  size = 26,
  tone = 'color/text/primary',
  align = 'left',
  weight = 500,
}: React.PropsWithChildren<{
  at: number;
  box: {x: number; y: number; w: number; h: number};
  size?: number;
  tone?: string;
  align?: 'left' | 'center' | 'right';
  weight?: number;
}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div
      data-text="flat-ceiling-cone"
      data-box={`${box.x} ${box.y} ${box.w} ${box.h}`}
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        font: `${weight} ${size}px "IBM Plex Sans"`,
        lineHeight: 1.2,
        textAlign: align,
        color: color(tone),
      }}
    >
      {children}
    </div>
  </Flicker>
);

export function FlatCeilingCone({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    up: useCue('t147Up').at,
    line: useCue('t147Line').at,
    white: useCue('t147White').at,
    black: useCue('t147Black').at,
    coarse: useCue('t147Coarse').at,
    farther: useCue('t148Farther').at,
    tiers: useCue('t148Tiers').at,
    elite: useCue('t148Elite').at,
    observer: useCue('t149Observer').at,
    base: useCue('t149Base').at,
    pressing: useCue('t149Pressing').at,
    ceiling: useCue('t150Flat').at,
    enforcement: useCue('t150Enforcement').at,
    buffer: useCue('t150Buffer').at,
    rotate: useCue('t150Rotate').at,
    down: useCue('t151Down').at,
    pressure: useCue('t151Pressure').at,
    wide: useCue('t152Wide').at,
    machine: useCue('t152Machine').at,
  };

  const leftBox = {x: 120, y: 175, w: 520, h: 660};
  const rightBox = {x: 680, y: 175, w: 1120, h: 660};
  // The observer begins directly beneath I, then the camera pulls outside the cone.
  const coneEl = interpolate(frame(ms), [frame(cue.ceiling), frame(cue.rotate)], [-90, 20], clampBoth);
  const coneAz = interpolate(frame(ms), [frame(cue.ceiling), frame(cue.rotate)], [0, -28], clampBoth);

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        {/* Header Title */}
        <Text at={cue.up} box={{x: 120, y: 96, w: 1680, h: 48}} size={34}>
          THE FLAT CEILING · PERSPECTIVE ILLUSION IN THE 3D CONE
        </Text>

        {/* Left Side: Close-Up View (2D Binary) */}
        <div style={{position: 'absolute', left: leftBox.x, top: leftBox.y, width: leftBox.w, height: leftBox.h}}>
          <BootIn
            box={{x: 0, y: 0, w: leftBox.w, h: leftBox.h}}
            startFrame={frame(cue.line)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/line/hairline-strong"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: leftBox.w, h: leftBox.h}}
            startFrame={frame(cue.line)}
            durationFrames={18}
            strokeToken="color/line/hairline-strong"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={401}
          />
          <FitBox
            text="CLOSE-UP VIEW"
            x={24}
            y={24}
            size={26}
            weight={600}
            tag="2D BINARY"
            startFrame={frame(cue.line)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/line/hairline-strong"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />

          {/* Close-Up Horizontal Split Box */}
          <div style={{position: 'absolute', left: 40, top: 110, width: 440, height: 360}}>
            {/* Top Half: White / In-group */}
            <div style={{position: 'absolute', left: 0, top: 0, width: 440, height: 180}}>
              <DrawRect
                box={{x: 0, y: 0, w: 440, h: 180}}
                startFrame={frame(cue.white)}
                durationFrames={16}
                strokeToken="color/fill/gold"
                fillToken="color/fill/gold-wash"
                glowToken="color/fill/gold"
                seed={402}
                beat
              />
              <FitBox
                text="IN-GROUP I"
                x={20}
                y={18}
                size={24}
                weight={600}
                tag="TOP"
                startFrame={frame(cue.white)}
                durationFrames={14}
                textToken="color/text/primary"
                strokeToken="color/fill/gold"
                fillToken="color/fill/panel-render"
                accentToken="color/fill/gold"
              />
              <StickFigure
                x={360}
                y={90}
                group="ingroup"
                emphasis={0.9}
                scale={1.2}
                animate
                startFrame={frame(cue.white)}
                durationFrames={14}
              />
              <Flicker startFrame={frame(cue.white)} durationFrames={14} beat><div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 110,
                  font: '500 20px "IBM Plex Sans"',
                  color: color('color/fill/gold'),
                }}
              >
                WHITE FILLS TOP HALF
              </div></Flicker>
            </div>

            {/* Bottom Half: Black / Out-group */}
            <div style={{position: 'absolute', left: 0, top: 180, width: 440, height: 180}}>
              <DrawRect
                box={{x: 0, y: 0, w: 440, h: 180}}
                startFrame={frame(cue.black)}
                durationFrames={16}
                strokeToken="color/marker/race"
                fillToken="color/fill/red-faint"
                glowToken="color/marker/race"
                seed={403}
                beat
              />
              <FitBox
                text="OUT-GROUP O"
                x={20}
                y={18}
                size={24}
                weight={600}
                tag="BOTTOM"
                startFrame={frame(cue.black)}
                durationFrames={14}
                textToken="color/marker/race"
                strokeToken="color/marker/race"
                fillToken="color/fill/panel-render"
                accentToken="color/marker/race"
              />
              <StickFigure
                x={360}
                y={90}
                group="outgroup"
                emphasis={0.9}
                scale={1.2}
                animate
                startFrame={frame(cue.black)}
                durationFrames={14}
              />
              <Flicker startFrame={frame(cue.black)} durationFrames={14} beat><div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 110,
                  font: '500 20px "IBM Plex Sans"',
                  color: color('color/marker/race'),
                }}
              >
                BLACK FILLS BOTTOM HALF
              </div></Flicker>
            </div>
          </div>

          <Text
            at={cue.coarse}
            box={{x: leftBox.x + 30, y: leftBox.y + 510, w: leftBox.w - 60, h: 36}}
            size={22}
            tone="color/text/soft"
            align="center"
            weight={600}
          >
            COARSE BINARY PROJECTION
          </Text>
          <Text
            at={cue.coarse}
            box={{x: leftBox.x + 30, y: leftBox.y + 560, w: leftBox.w - 60, h: 54}}
            size={20}
            tone="color/marker/race"
            align="center"
            weight={500}
          >
            HIDES VERTICAL COMMAND STRUCTURE COMPLETELY
          </Text>
        </div>

        {/* Right Side: Farther Back (The 5-Tier Cone) */}
        <div style={{position: 'absolute', left: rightBox.x, top: rightBox.y, width: rightBox.w, height: rightBox.h}}>
          <BootIn
            box={{x: 0, y: 0, w: rightBox.w, h: rightBox.h}}
            startFrame={frame(cue.farther)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: rightBox.w, h: rightBox.h}}
            startFrame={frame(cue.farther)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={404}
          />
          <FitBox
            text="FARTHER BACK · 3D CONE"
            x={24}
            y={24}
            size={26}
            weight={600}
            tag="5 TIERS"
            startFrame={frame(cue.farther)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />

          {ms >= cue.farther && <div style={{position: 'absolute', left: 60, top: 72, width: 1000, height: 440}}>
            <ConeOnly width={1000} height={440} model={{el: coneEl, az: coneAz, al: 1}} />
          </div>}

          {/* Perspective 1: Out-group Observer Looking UP */}
          <StickFigure
            x={240}
            y={480}
            group="outgroup"
            emphasis={1}
            scale={1.2}
            pose="raise"
            animate
            startFrame={frame(cue.observer)}
            durationFrames={15}
            beat
          />
          <DrawLine
            points={[
              [240, 440],
              [240, 345],
            ]}
            startFrame={frame(cue.pressing)}
            durationFrames={16}
            strokeToken="color/fill/gold"
            glowToken="color/fill/gold"
            strokeWidth={4}
            end="arrow"
            beat
          />
          <div style={{position: 'absolute', left: 30, top: 540, width: 480, height: 64}}>
            <DrawRect
              box={{x: 0, y: 0, w: 480, h: 64}}
              startFrame={frame(cue.pressing)}
              durationFrames={14}
              strokeToken="color/fill/gold"
              fillToken="color/fill/panel-render"
              glowToken="color/fill/gold"
              seed={405}
              beat
            />
            <Flicker startFrame={frame(cue.pressing)} durationFrames={14} beat><div
              data-text="flat-ceiling-banner"
              data-box={`${rightBox.x + 30} ${rightBox.y + 540} 480 64`}
              style={{position: 'absolute', inset: 0, padding: '8px 14px', boxSizing: 'border-box'}}
            >
              <div style={{font: '600 20px "IBM Plex Sans"', color: color('color/fill/gold')}}>
                LOOKING UP: THE FLAT CEILING
              </div>
              <div style={{font: '400 20px "IBM Plex Sans"', color: color('color/text/soft')}}>
                Sees only white underside pressing downward
              </div>
            </div></Flicker>
          </div>

          {/* Perspective 2: In-group Observer Looking DOWN */}
          <StickFigure
            x={880}
            y={320}
            group="ingroup"
            emphasis={1}
            scale={1.2}
            pose="stand"
            animate
            startFrame={frame(cue.down)}
            durationFrames={15}
            beat
          />
          <DrawLine
            points={[
              [880, 350],
              [880, 430],
            ]}
            startFrame={frame(cue.pressure)}
            durationFrames={16}
            strokeToken="color/marker/race"
            glowToken="color/marker/race"
            strokeWidth={4}
            end="arrow"
            beat
          />
          <DrawLine
            points={[
              [900, 290],
              [900, 140],
            ]}
            startFrame={frame(cue.pressure)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            glowToken="color/fill/gold"
            strokeWidth={4}
            end="arrow"
          />
          <div style={{position: 'absolute', left: 610, top: 540, width: 480, height: 64}}>
            <DrawRect
              box={{x: 0, y: 0, w: 480, h: 64}}
              startFrame={frame(cue.pressure)}
              durationFrames={14}
              strokeToken="color/marker/race"
              fillToken="color/fill/panel-render"
              glowToken="color/marker/race"
              seed={406}
              beat
            />
            <Flicker startFrame={frame(cue.pressure)} durationFrames={14} beat><div
              data-text="in-group-perspective"
              data-box={`${rightBox.x + 610} ${rightBox.y + 540} 480 64`}
              style={{position: 'absolute', inset: 0, padding: '8px 14px', boxSizing: 'border-box'}}
            >
              <div style={{font: '600 20px "IBM Plex Sans"', color: color('color/marker/race')}}>
                LOOKING DOWN: DISORDER &amp; PRESSURE
              </div>
              <div style={{font: '400 20px "IBM Plex Sans"', color: color('color/text/soft')}}>
                Wealth extraction upward stays out of view
              </div>
            </div></Flicker>
          </div>

          {/* Turn 152: Connected Extraction Machine Flow */}
          <DrawLine
            points={[
              [140, 390],
              [80, 390],
              [80, 110],
              [440, 110],
            ]}
            startFrame={frame(cue.wide)}
            durationFrames={22}
            strokeToken="color/fill/gold"
            strokeWidth={3}
            end="arrow"
          />
          <DrawLine
            points={[
              [980, 390],
              [1040, 390],
              [1040, 110],
              [680, 110],
            ]}
            startFrame={frame(cue.wide)}
            durationFrames={22}
            strokeToken="color/fill/gold"
            strokeWidth={3}
            end="arrow"
          />
        </div>

        {/* Single footer, clear of the two in-panel projection captions. */}
        <Text
          at={cue.machine}
          box={{x: 120, y: 960, w: 1680, h: 28}}
          size={21}
          tone="color/text/soft"
          align="center"
          weight={500}
        >
          ONE CONNECTED EXTRACTION MACHINE HOLDS THE DISJOINT STRUCTURAL SETS TOGETHER
        </Text>
      </KitSound>
    </StageSceneFrame>
  );
}
