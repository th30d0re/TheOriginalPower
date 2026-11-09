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
      data-text="elite-obscuration"
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

export function EliteObscuration({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    elite: useCue('t153Elite').at,
    obscuration: useCue('t153Obscuration').at,
    alignment: useCue('t153Alignment').at,
    top: useCue('t153Top').at,
    puppet: useCue('t153Puppet').at,
    enforcement: useCue('t153Enforcement').at,
    control: useCue('t153Control').at,
    bottom: useCue('t153Bottom').at,
    marginal: useCue('t153Marginal').at,
    outgroup: useCue('t153Outgroup').at,
    blends: useCue('t153Blends').at,
  };

  const leftBox = {x: 120, y: 230, w: 820, h: 600};
  const rightBox = {x: 1000, y: 230, w: 820, h: 600};
  // Separation resolves the layers; alignment returns them to the observer's sightline.
  const al = interpolate(frame(ms), [frame(cue.alignment), frame(cue.blends)], [0, 1], clampBoth);

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Text at={cue.elite} box={{x: 120, y: 96, w: 1680, h: 52}} size={40} align="center" weight={600}>
          ELITE OBSCURATION
        </Text>
        <Text at={cue.obscuration} box={{x: 220, y: 162, w: 1480, h: 36}} size={24} tone="color/text/soft" align="center">
          UPPER TIERS ALIGN ALONG THE OBSERVER SIGHTLINE
        </Text>

        <div style={{position: 'absolute', left: leftBox.x, top: leftBox.y, width: leftBox.w, height: leftBox.h}}>
          <BootIn
            box={{x: 0, y: 0, w: leftBox.w, h: leftBox.h}}
            startFrame={frame(cue.alignment)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: leftBox.w, h: leftBox.h}}
            startFrame={frame(cue.alignment)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={501}
          />
          <FitBox
            text="SIGHTLINE ALIGNMENT"
            x={24}
            y={24}
            size={26}
            weight={600}
            tag="CONTROL"
            startFrame={frame(cue.alignment)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
        </div>

        {ms >= cue.alignment && <div style={{position: 'absolute', left: 205, top: 305, width: 650, height: 460}}>
          <ConeOnly width={650} height={460} model={{el: -90, az: 0, al}} />
        </div>}
        <Text at={cue.top} box={{x: 140, y: 350, w: 145, h: 28}} size={18} tone="color/fill/gold" align="right" weight={600}>E · APEX →</Text>
        <Text at={cue.control} box={{x: 140, y: 590, w: 145, h: 28}} size={18} tone="color/fill/gold" align="right" weight={600}>I · BUFFER →</Text>

        <div style={{position: 'absolute', left: rightBox.x, top: rightBox.y, width: rightBox.w, height: rightBox.h}}>
          <BootIn
            box={{x: 0, y: 0, w: rightBox.w, h: rightBox.h}}
            startFrame={frame(cue.bottom)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: rightBox.w, h: rightBox.h}}
            startFrame={frame(cue.bottom)}
            durationFrames={18}
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            seed={505}
          />
          <FitBox
            text="LOWER LAYERS"
            x={24}
            y={24}
            size={26}
            weight={600}
            tag="BELOW"
            startFrame={frame(cue.bottom)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            accentToken="color/marker/race"
            beat
          />
        </div>

        <Text at={cue.outgroup} box={{x: 1040, y: 390, w: 700, h: 32}} size={22} tone="color/marker/race" align="center" weight={600}>
          O · OUT-GROUP BASE
        </Text>
        <DrawLine
          points={[
            [940, 556],
            [1000, 556],
          ]}
          startFrame={frame(cue.blends)}
          durationFrames={16}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={4}
          end="arrow"
          beat
        />
        <Text at={cue.blends} box={{x: 1060, y: 590, w: 700, h: 64}} size={22} tone="color/marker/race" align="center" weight={600}>
          ELITE BLENDS INTO OFFICIALS AND ENFORCERS BELOW
        </Text>
        <Text at={cue.bottom} box={{x: 1060, y: 710, w: 700, h: 32}} size={20} tone="color/text/soft" align="center">
          CONTROL STRUCTURE OUT OF VIEW FROM BELOW
        </Text>
      </KitSound>
    </StageSceneFrame>
  );
}
