import React from 'react';
import {
  BootIn,
  DrawLine,
  DrawRect,
  FitBox,
  Flicker,
  KitSound,
  StageSceneFrame,
  color,
  useCue,
  type SceneProps,
} from '@stage';
import {ConeOnly} from '../dashboard/artifacts/FiveTierConeView';

const frame = (ms: number) => Math.round((ms * 30) / 1000);

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
      data-text="projection-geometry"
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

export function ProjectionGeometry({segment}: SceneProps) {
  const cue = {
    why: useCue('t144Why').at,
    optical: useCue('t144Optical').at,
    geometry: useCue('t144Geometry').at,
    binary: useCue('t144Binary').at,
    chapter: useCue('t145Chapter').at,
    cone: useCue('t145Cone').at,
    debate: useCue('t145Debate').at,
    orthographic: useCue('t146Orthographic').at,
    plane: useCue('t146Plane').at,
    sight: useCue('t146Sight').at,
    depth: useCue('t146Depth').at,
    overlap: useCue('t146Overlap').at,
  };

  const leftPanel = {x: 120, y: 175, w: 720, h: 650};
  const rightPanel = {x: 1080, y: 175, w: 720, h: 650};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        {/* Header Question */}
        <Text at={cue.why} box={{x: 120, y: 96, w: 1680, h: 48}} size={34}>
          WHY DOES PUBLIC DEBATE STAY STUCK IN THE FLAT BINARY?
        </Text>

        {/* Left Panel: 3D Hierarchy Cone */}
        <div style={{position: 'absolute', left: leftPanel.x, top: leftPanel.y, width: leftPanel.w, height: leftPanel.h}}>
          <BootIn
            box={{x: 0, y: 0, w: leftPanel.w, h: leftPanel.h}}
            startFrame={frame(cue.chapter)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: leftPanel.w, h: leftPanel.h}}
            startFrame={frame(cue.chapter)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={301}
          />
          <FitBox
            text="3D HIERARCHY CONE"
            x={24}
            y={24}
            size={28}
            weight={600}
            tag="CHAPTER 0"
            startFrame={frame(cue.chapter)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />

          {/** The shared projected cone keeps the five real tiers rather than a diagrammatic pyramid. */}
          <Flicker startFrame={frame(cue.cone)} durationFrames={16} beat>
            <div style={{position: 'absolute', left: 30, top: 88, width: 660, height: 430}}>
              <ConeOnly width={660} height={430} model={{el: 20, az: -28, al: 1}} />
            </div>
          </Flicker>

          <Flicker startFrame={frame(cue.cone)} durationFrames={14} beat><div
            data-text="cone-depth-note"
            data-box={`${leftPanel.x + 30} ${leftPanel.y + 540} ${leftPanel.w - 60} 36`}
            style={{
              position: 'absolute',
              left: 30,
              top: 540,
              width: leftPanel.w - 60,
              font: '500 22px "IBM Plex Sans"',
              textAlign: 'center',
              color: color('color/fill/gold'),
            }}
          >
            REAL SOCIAL HIERARCHY · FIVE STRATIFIED TIERS
          </div></Flicker>
          <Flicker startFrame={frame(cue.cone)} durationFrames={14}><div
            data-text="cone-depth-sub"
            data-box={`${leftPanel.x + 30} ${leftPanel.y + 585} ${leftPanel.w - 60} 30`}
            style={{
              position: 'absolute',
              left: 30,
              top: 585,
              width: leftPanel.w - 60,
              font: '400 20px "IBM Plex Mono"',
              textAlign: 'center',
              color: color('color/text/soft'),
            }}
          >
            VERTICAL EXTRACTION AXIS CONCEALED FROM BASE
          </div></Flicker>
        </div>

        {/* Center: Orthographic Projection Rays */}
        <DrawLine
          points={[
            [840, 310],
            [1080, 360],
          ]}
          startFrame={frame(cue.orthographic)}
          durationFrames={18}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={4}
          end="arrow"
          beat
        />
        <DrawLine
          points={[
            [840, 500],
            [1080, 500],
          ]}
          startFrame={frame(cue.orthographic)}
          durationFrames={18}
          strokeToken="color/line/hairline-strong"
          strokeWidth={3}
          end="arrow"
        />
        <DrawLine
          points={[
            [840, 680],
            [1080, 640],
          ]}
          startFrame={frame(cue.orthographic)}
          durationFrames={18}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={4}
          end="arrow"
          beat
        />

        {/* Center Line of Sight Badge */}
        <div style={{position: 'absolute', left: 865, top: 460, width: 190, height: 76}}>
          <DrawRect
            box={{x: 0, y: 0, w: 190, h: 76}}
            startFrame={frame(cue.sight)}
            durationFrames={14}
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={302}
            beat
          />
          <Flicker startFrame={frame(cue.sight)} durationFrames={14} beat><div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{font: '600 20px "IBM Plex Mono"', color: color('color/fill/gold')}}>
              FIXED LINE
            </span>
            <span style={{font: '600 20px "IBM Plex Mono"', color: color('color/fill/gold')}}>
              OF SIGHT
            </span>
          </div></Flicker>
        </div>

        {/* Right Panel: 2D Projection Plane */}
        <div style={{position: 'absolute', left: rightPanel.x, top: rightPanel.y, width: rightPanel.w, height: rightPanel.h}}>
          <BootIn
            box={{x: 0, y: 0, w: rightPanel.w, h: rightPanel.h}}
            startFrame={frame(cue.debate)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: rightPanel.w, h: rightPanel.h}}
            startFrame={frame(cue.debate)}
            durationFrames={18}
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            seed={303}
          />
          <FitBox
            text="2D PROJECTION PLANE"
            x={24}
            y={24}
            size={28}
            weight={600}
            tag="PUBLIC DEBATE"
            startFrame={frame(cue.debate)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            accentToken="color/marker/race"
            beat
          />

          {/* Flat 2D Collapse Screen */}
          <div style={{position: 'absolute', left: 60, top: 110, width: 600, height: 360}}>
            {/* Top Half: In-group */}
            <div style={{position: 'absolute', left: 0, top: 0, width: 600, height: 180}}>
              <DrawRect
                box={{x: 0, y: 0, w: 600, h: 180}}
                startFrame={frame(cue.plane)}
                durationFrames={16}
                strokeToken="color/fill/gold"
                fillToken="color/fill/gold-wash"
                glowToken="color/fill/gold"
                seed={304}
              />
              <FitBox
                text="IN-GROUP I"
                x={20}
                y={18}
                size={24}
                weight={600}
                tag="DOMINANT"
                startFrame={frame(cue.plane)}
                durationFrames={14}
                textToken="color/text/primary"
                strokeToken="color/fill/gold"
                fillToken="color/fill/panel-render"
                accentToken="color/fill/gold"
              />
              <Flicker startFrame={frame(cue.plane)} durationFrames={14} beat><div
                style={{
                  position: 'absolute',
                  right: 24,
                  top: 70,
                  font: '500 22px "IBM Plex Sans"',
                  color: color('color/fill/gold'),
                }}
              >
                APEX &amp; INTERMEDIATE TIERS OCCLUDED
              </div></Flicker>
            </div>

            {/* Bottom Half: Out-group */}
            <div style={{position: 'absolute', left: 0, top: 180, width: 600, height: 180}}>
              <DrawRect
                box={{x: 0, y: 0, w: 600, h: 180}}
                startFrame={frame(cue.plane)}
                durationFrames={16}
                strokeToken="color/marker/race"
                fillToken="color/fill/red-faint"
                glowToken="color/marker/race"
                seed={305}
              />
              <FitBox
                text="OUT-GROUP O"
                x={20}
                y={18}
                size={24}
                weight={600}
                tag="EXCLUDED"
                startFrame={frame(cue.plane)}
                durationFrames={14}
                textToken="color/marker/race"
                strokeToken="color/marker/race"
                fillToken="color/fill/panel-render"
                accentToken="color/marker/race"
              />
              <Flicker startFrame={frame(cue.plane)} durationFrames={14} beat><div
                style={{
                  position: 'absolute',
                  right: 24,
                  top: 70,
                  font: '500 22px "IBM Plex Sans"',
                  color: color('color/marker/race'),
                }}
              >
                PERCEIVED AS SOLE ANTAGONIST
              </div></Flicker>
            </div>
          </div>

          <Text
            at={cue.depth}
            box={{x: rightPanel.x + 30, y: rightPanel.y + 510, w: rightPanel.w - 60, h: 36}}
            size={22}
            tone="color/marker/race"
            align="center"
            weight={600}
          >
            DEPTH COLLAPSES TO ZERO · z-AXIS ELIMINATED
          </Text>
          <Text
            at={cue.overlap}
            box={{x: rightPanel.x + 30, y: rightPanel.y + 560, w: rightPanel.w - 60, h: 36}}
            size={22}
            tone="color/text/soft"
            align="center"
            weight={500}
          >
            LAYERS STACKED ALONG SIGHTLINE OVERLAP INTO FLAT SURFACE
          </Text>
        </div>

        {/* Bottom Banner */}
        <Text
          at={cue.optical}
          box={{x: 120, y: 860, w: 1680, h: 42}}
          size={26}
          tone="color/fill/gold"
          align="center"
          weight={600}
        >
          AN OPTICAL ILLUSION FROM GEOMETRY EXPLAINS THE DOMINANT COARSE BINARY
        </Text>
        <DrawLine
          points={[
            [560, 908],
            [1360, 908],
          ]}
          startFrame={frame(cue.geometry)}
          durationFrames={16}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={3}
          beat
        />
        <Text at={cue.binary} box={{x: 120, y: 918, w: 1680, h: 32}} size={22} tone="color/text/soft" align="center" weight={600}>
          COARSE BINARY · DOMINANT PUBLIC VIEW
        </Text>
      </KitSound>
    </StageSceneFrame>
  );
}
