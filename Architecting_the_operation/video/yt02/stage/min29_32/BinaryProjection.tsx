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
  useStageMs,
  type SceneProps,
} from '@stage';
import {EquationTerms} from '../equations';

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
      data-text="binary-projection"
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

export function BinaryProjection({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    what: useCue('t142What').at,
    equation: useCue('t142Equation').at,
    visible: useCue('t142Visible').at,
    conceal: useCue('t142Conceal').at,
    flattens: useCue('t143Flattens').at,
    dominant: useCue('t143Dominant').at,
    ingroup: useCue('t143Ingroup').at,
    outgroup: useCue('t143Outgroup').at,
    uniform: useCue('t143Uniform').at,
    mass: useCue('t143Mass').at,
  };

  const eqCard = {x: 180, y: 165, w: 1560, h: 110};
  const ingroupBox = {x: 180, y: 300, w: 1560, h: 195};
  const outgroupBox = {x: 180, y: 520, w: 1560, h: 195};
  const warningBox = {x: 180, y: 740, w: 1560, h: 120};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        {/* Header Question */}
        <Text at={cue.what} box={{x: 120, y: 96, w: 1680, h: 48}} size={34}>
          WHAT DOES EQUATION 2.1 MAKE VISIBLE, AND WHAT DOES IT CONCEAL?
        </Text>

        {/* Equation 2.1 Card */}
        <div style={{position: 'absolute', left: eqCard.x, top: eqCard.y, width: eqCard.w, height: eqCard.h}}>
          <BootIn
            box={{x: 0, y: 0, w: eqCard.w, h: eqCard.h}}
            startFrame={frame(cue.equation)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: eqCard.w, h: eqCard.h}}
            startFrame={frame(cue.equation)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={201}
          />
          <FitBox
            text="EQUATION 2.1"
            x={24}
            y={22}
            size={26}
            weight={600}
            tag="CHAPTER 2"
            startFrame={frame(cue.equation)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
        </div>

        <Flicker startFrame={frame(cue.equation)} durationFrames={16} beat>
          <EquationTerms
            equation="Eq. 2.1 · disjoint partition"
            ms={ms}
            box={{x: 520, y: 190, w: 880, h: 60}}
            fontSize={40}
            align="center"
            tokens={[
              {term: 'Universe'},
              {text: ' = '},
              {term: 'InGroupSet'},
              {text: ' ∪ '},
              {term: 'OutGroupSet'},
              {text: '  ·  '},
              {term: 'InGroupSet'},
              {text: ' ∩ '},
              {term: 'OutGroupSet'},
              {text: ' = ∅'},
            ]}
            pulses={{Universe: [cue.equation], InGroupSet: [cue.equation, cue.visible], OutGroupSet: [cue.equation, cue.visible]}}
          />
        </Flicker>
        <Text at={cue.equation} box={{x: 1420, y: 205, w: 290, h: 28}} size={20} tone="color/text/soft" align="right" weight={500}>
          COARSE BINARY
        </Text>

        {/* Top Block: In-Group I */}
        <div style={{position: 'absolute', left: ingroupBox.x, top: ingroupBox.y, width: ingroupBox.w, height: ingroupBox.h}}>
          <DrawRect
            box={{x: 0, y: 0, w: ingroupBox.w, h: ingroupBox.h}}
            startFrame={frame(cue.visible)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            fillToken="color/fill/gold-wash"
            glowToken="color/fill/gold"
            seed={202}
            beat
          />
          <FitBox
            text="IN-GROUP I"
            x={24}
            y={24}
            size={28}
            weight={600}
            tag="DOMINANT"
            startFrame={frame(cue.visible)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
          />
          {/* Row of In-group StickFigures */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <StickFigure
              key={i}
              x={340 + i * 160}
              y={95}
              group="ingroup"
              emphasis={0.85}
              scale={1.2}
              animate
              startFrame={frame(cue.visible)}
              durationFrames={14}
            />
          ))}
          <Text
            at={cue.uniform}
            box={{x: ingroupBox.x + 1150, y: ingroupBox.y + 24, w: 380, h: 40}}
            size={22}
            tone="color/fill/gold"
            align="right"
            weight={600}
          >
            ONE UNIFORM BLOCK
          </Text>
        </div>

        {/* The Dividing Primary Color Line */}
        <DrawLine
          points={[
            [160, 507],
            [1760, 507],
          ]}
          startFrame={frame(cue.visible)}
          durationFrames={20}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={6}
          end="terminal"
          origin
          beat
        />
        <div style={{position: 'absolute', left: 680, top: 488, width: 560, height: 38}}>
          <DrawRect
            box={{x: 0, y: 0, w: 560, h: 38}}
            startFrame={frame(cue.visible)}
            durationFrames={14}
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            seed={205}
            beat
          />
          <Flicker startFrame={frame(cue.visible)} durationFrames={14} beat><div
            data-text="color-line-badge"
            data-box="680 488 560 38"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              font: '600 20px "IBM Plex Mono"',
              color: color('color/marker/race'),
              letterSpacing: 2,
            }}
          >
            PRIMARY COLOR LINE · VISIBLE AT A GLANCE
          </div></Flicker>
        </div>

        {/* Bottom Block: Out-Group O */}
        <div style={{position: 'absolute', left: outgroupBox.x, top: outgroupBox.y, width: outgroupBox.w, height: outgroupBox.h}}>
          <DrawRect
            box={{x: 0, y: 0, w: outgroupBox.w, h: outgroupBox.h}}
            startFrame={frame(cue.visible)}
            durationFrames={18}
            strokeToken="color/marker/race"
            fillToken="color/fill/red-faint"
            glowToken="color/marker/race"
            seed={203}
            beat
          />
          <FitBox
            text="OUT-GROUP O"
            x={24}
            y={24}
            size={28}
            weight={600}
            tag="EXCLUDED"
            startFrame={frame(cue.visible)}
            durationFrames={16}
            textToken="color/marker/race"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            accentToken="color/marker/race"
          />
          {/* Row of Out-group StickFigures */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <StickFigure
              key={i}
              x={340 + i * 160}
              y={95}
              group="outgroup"
              emphasis={0.85}
              scale={1.2}
              animate
              startFrame={frame(cue.visible)}
              durationFrames={14}
            />
          ))}
          <Text
            at={cue.mass}
            box={{x: 1100, y: 24, w: 430, h: 40}}
            size={22}
            tone="color/marker/race"
            align="right"
            weight={600}
          >
            UNDIFFERENTIATED MASS
          </Text>
        </div>

        {/* Warning / Critique Footer */}
        <div style={{position: 'absolute', left: warningBox.x, top: warningBox.y, width: warningBox.w, height: warningBox.h}}>
          <BootIn
            box={{x: 0, y: 0, w: warningBox.w, h: warningBox.h}}
            startFrame={frame(cue.conceal)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: warningBox.w, h: warningBox.h}}
            startFrame={frame(cue.conceal)}
            durationFrames={18}
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            seed={204}
          />
          <FitBox
            text="THE PROJECTION FALLACY"
            x={24}
            y={18}
            size={22}
            weight={600}
            tag="WARNING"
            startFrame={frame(cue.conceal)}
            durationFrames={16}
            textToken="color/marker/race"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            accentToken="color/marker/race"
            beat
          />
          <Text
            at={cue.conceal}
            box={{x: warningBox.x + 28, y: warningBox.y + 66, w: warningBox.w - 56, h: 36}}
            size={24}
            tone="color/marker/race"
            weight={600}
          >
            CONCEALS VERTICAL COMMAND STRUCTURE · STOPS AT HORIZONTAL OPPOSITION
          </Text>
        </div>

        <Text at={cue.dominant} box={{x: 204, y: 448, w: 700, h: 28}} size={20} tone="color/fill/gold" weight={600}>
          ENTIRE DOMINANT SET · SINGLE BLOCK
        </Text>
        <Text at={cue.ingroup} box={{x: 950, y: 448, w: 700, h: 28}} size={20} tone="color/fill/gold" align="right" weight={600}>
          IN-GROUP I · NO INTERNAL TIERS
        </Text>
        <Text at={cue.outgroup} box={{x: 204, y: 668, w: 700, h: 28}} size={20} tone="color/marker/race" weight={600}>
          ENTIRE OUT-GROUP SET · SINGLE MASS
        </Text>
        <Text at={cue.flattens} box={{x: 480, y: 885, w: 960, h: 32}} size={22} tone="color/marker/race" align="center" weight={600}>
          FLATTENED INTO TWO BLOCKS · VERTICAL TIERS REMOVED
        </Text>
      </KitSound>
    </StageSceneFrame>
  );
}
