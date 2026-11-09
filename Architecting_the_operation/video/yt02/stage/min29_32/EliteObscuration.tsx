import React from 'react';
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
  type SceneProps,
} from '@stage';

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

const Tier = ({
  cx,
  y,
  w,
  label,
  at,
  tone,
  seed,
}: {
  cx: number;
  y: number;
  w: number;
  label: string;
  at: number;
  tone: string;
  seed: number;
}) => {
  const x = cx - w / 2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 52}}>
      <DrawRect
        box={{x: 0, y: 0, w, h: 52}}
        startFrame={frame(at)}
        durationFrames={14}
        strokeToken={tone}
        fillToken="color/fill/panel-render"
        glowToken={tone}
        seed={seed}
        beat
      />
      <Flicker startFrame={frame(at)} durationFrames={14} beat><div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          font: '600 20px "IBM Plex Mono"',
          color: color(tone),
        }}
      >
        {label}
      </div></Flicker>
    </div>
  );
};

export function EliteObscuration({segment}: SceneProps) {
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

        <Tier cx={530} y={330} w={360} label="ELITE" at={cue.top} tone="color/fill/gold" seed={502} />
        <Tier cx={530} y={430} w={440} label="PUPPET CLASS" at={cue.puppet} tone="color/fill/gold" seed={503} />
        <Tier cx={530} y={530} w={520} label="ENFORCEMENT CLASS" at={cue.enforcement} tone="color/fill/gold" seed={504} />
        <DrawLine
          points={[
            [530, 382],
            [530, 430],
          ]}
          startFrame={frame(cue.alignment)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
          beat
        />
        <DrawLine
          points={[
            [530, 482],
            [530, 530],
          ]}
          startFrame={frame(cue.alignment)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
        />
        <DrawLine
          points={[
            [530, 582],
            [530, 640],
          ]}
          startFrame={frame(cue.control)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
          end="arrow"
          beat
        />
        <FitBox
          text="CONTROL NODE"
          x={390}
          y={650}
          size={28}
          weight={600}
          tag="SYSTEM"
          startFrame={frame(cue.control)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <StickFigure
          x={530}
          y={770}
          group="outgroup"
          emphasis={1}
          scale={1.25}
          pose="raise"
          animate
          startFrame={frame(cue.alignment)}
          durationFrames={16}
        />
        <Text at={cue.alignment} box={{x: 590, y: 748, w: 300, h: 30}} size={20} tone="color/fill/gold" weight={600}>
          OBSERVER BELOW
        </Text>

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

        <Tier cx={1410} y={370} w={520} label="MARGINAL IN-GROUP" at={cue.marginal} tone="color/fill/gold" seed={506} />
        <Tier cx={1410} y={490} w={580} label="OUT-GROUP" at={cue.outgroup} tone="color/marker/race" seed={507} />
        <StickFigure
          x={1090}
          y={660}
          group="outgroup"
          emphasis={1}
          scale={1.25}
          animate
          startFrame={frame(cue.bottom)}
          durationFrames={16}
        />
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
