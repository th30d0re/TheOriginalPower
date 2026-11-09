import React from 'react';
import {interpolate} from 'remotion';
import {
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

  // Start outside the cone, where E is visible; then enter from below as the tiers align.
  const al = interpolate(frame(ms), [frame(cue.alignment), frame(cue.blends)], [0.6, 1], clampBoth);
  const el = interpolate(frame(ms), [frame(cue.alignment), frame(cue.blends)], [20, -80], clampBoth);
  const az = interpolate(frame(ms), [frame(cue.alignment), frame(cue.blends)], [-28, 0], clampBoth);

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Text at={cue.elite} box={{x: 120, y: 96, w: 1680, h: 52}} size={40} align="center" weight={600}>
          ELITE OBSCURATION
        </Text>
        <Text at={cue.obscuration} box={{x: 220, y: 162, w: 1480, h: 36}} size={24} tone="color/text/soft" align="center">
          UPPER TIERS ALIGN ALONG THE OBSERVER SIGHTLINE
        </Text>

        {ms >= cue.elite && <div style={{position: 'absolute', left: 410, top: 190, width: 1100, height: 720}}>
          <ConeOnly width={1100} height={720} model={{el, az, al}} />
        </div>}
        <Text at={cue.blends} box={{x: 520, y: 940, w: 880, h: 32}} size={24} tone="color/marker/race" align="center" weight={600}>
          E HIDDEN FROM BELOW
        </Text>
      </KitSound>
    </StageSceneFrame>
  );
}
