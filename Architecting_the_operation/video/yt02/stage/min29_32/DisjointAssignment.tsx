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
      data-text="disjoint-assignment"
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

export function DisjointAssignment({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    disjointness: useCue('t141Disjointness').at,
    legal: useCue('t141Legal').at,
    administrative: useCue('t141Administrative').at,
    census: useCue('t141Census').at,
    slave: useCue('t141Slave').at,
    blood: useCue('t141Blood').at,
    immigration: useCue('t141Immigration').at,
  };

  const defCard = {x: 120, y: 175, w: 720, h: 530};
  const setI = {x: 880, y: 175, w: 420, h: 530};
  const setO = {x: 1380, y: 175, w: 420, h: 530};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        {/* Title */}
        <Text at={cue.disjointness} box={{x: 120, y: 96, w: 1680, h: 48}} size={34}>
          DISJOINTNESS IS A LEGAL AND ADMINISTRATIVE ASSIGNMENT
        </Text>

        {/* Left Side: DefinitionCard pattern */}
        <div style={{position: 'absolute', left: defCard.x, top: defCard.y, width: defCard.w, height: defCard.h}}>
          <BootIn
            box={{x: 0, y: 0, w: defCard.w, h: defCard.h}}
            startFrame={frame(cue.disjointness)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: defCard.w, h: defCard.h}}
            startFrame={frame(cue.disjointness)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={141}
          />
          <FitBox
            text="dis·joint·ness"
            x={28}
            y={24}
            size={34}
            weight={600}
            tag="DEFINITION"
            startFrame={frame(cue.disjointness)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
          <Flicker startFrame={frame(cue.disjointness)} durationFrames={14}>
            <em
              style={{
                position: 'absolute',
                left: 310,
                top: 40,
                fontSize: 24,
                fontFamily: 'IBM Plex Sans',
                color: color('color/text/muted'),
              }}
            >
              (noun)
            </em>
          </Flicker>

          {/* Definition Sense */}
          <Flicker startFrame={frame(cue.legal)} durationFrames={14} beat>
            <div
              data-text="disjoint-sense"
              data-box={`${defCard.x + 28} ${defCard.y + 115} ${defCard.w - 56} 120`}
              style={{
                position: 'absolute',
                left: 28,
                top: 115,
                width: defCard.w - 56,
                font: '400 25px "IBM Plex Sans"',
                lineHeight: 1.35,
                color: color('color/text/primary'),
              }}
            >
              <span style={{fontFamily: 'IBM Plex Mono', fontWeight: 600, color: color('color/fill/gold'), marginRight: 12}}>
                1.
              </span>
              A state-mandated partition separating the population universe into mutually exclusive categories with zero overlap.
            </div>
          </Flicker>

          {/* Set Equation Badge */}
          <div style={{position: 'absolute', left: 28, top: 275, width: defCard.w - 56, height: 110}}>
            <DrawRect
              box={{x: 0, y: 0, w: defCard.w - 56, h: 110}}
              startFrame={frame(cue.administrative)}
              durationFrames={16}
              strokeToken="color/line/hairline-strong"
              fillToken="color/fill/gold-wash"
              glowToken="color/fill/gold"
              seed={142}
              beat
            />
          </div>

          {/* Source Citation */}
          <Flicker startFrame={frame(cue.administrative)} durationFrames={14}>
            <div
              data-text="disjoint-citation"
              data-box={`${defCard.x + 28} ${defCard.y + 440} ${defCard.w - 56} 40`}
              style={{
                position: 'absolute',
                left: 28,
                top: 440,
                width: defCard.w - 56,
                font: '400 20px "IBM Plex Mono"',
                color: color('color/text/muted'),
                letterSpacing: 0.5,
              }}
            >
              The Original Power, Chapter 2 · Eq. 2.1
            </div>
          </Flicker>
        </div>

        <Flicker startFrame={frame(cue.administrative)} durationFrames={16} beat>
          <EquationTerms
            equation="Eq. 2.1 · disjoint partition"
            ms={ms}
            box={{x: defCard.x + 28, y: defCard.y + 283, w: defCard.w - 56, h: 52}}
            fontSize={36}
            align="center"
            tokens={[{term: 'InGroupSet'}, {text: ' ∩ '}, {term: 'OutGroupSet'}, {text: ' = ∅'}]}
            pulses={{InGroupSet: [cue.administrative], OutGroupSet: [cue.administrative]}}
          />
        </Flicker>
        <Text at={cue.administrative} box={{x: defCard.x + 28, y: defCard.y + 342, w: defCard.w - 56, h: 28}} size={20} tone="color/text/soft" align="center" weight={500}>
          MUTUALLY EXCLUSIVE · DISJOINT PARTITION
        </Text>

        {/* Right Side: Set I Panel */}
        <div style={{position: 'absolute', left: setI.x, top: setI.y, width: setI.w, height: setI.h}}>
          <BootIn
            box={{x: 0, y: 0, w: setI.w, h: setI.h}}
            startFrame={frame(cue.legal)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: setI.w, h: setI.h}}
            startFrame={frame(cue.legal)}
            durationFrames={18}
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            glowToken="color/fill/gold"
            seed={143}
          />
          <FitBox
            text="IN-GROUP I"
            x={24}
            y={24}
            size={28}
            weight={600}
            tag="SET"
            startFrame={frame(cue.legal)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
          <StickFigure
            x={120}
            y={240}
            group="ingroup"
            emphasis={0.9}
            scale={1.3}
            animate
            startFrame={frame(cue.legal)}
            durationFrames={16}
          />
          <StickFigure
            x={300}
            y={240}
            group="ingroup"
            emphasis={0.9}
            scale={1.3}
            animate
            startFrame={frame(cue.legal)}
            durationFrames={16}
          />
          <Flicker startFrame={frame(cue.legal)} durationFrames={14} beat><div
            data-text="ingroup-label"
            data-box={`${setI.x + 20} ${setI.y + 360} ${setI.w - 40} 40`}
            style={{
              position: 'absolute',
              left: 20,
              top: 360,
              width: setI.w - 40,
              font: '600 24px "IBM Plex Sans"',
              textAlign: 'center',
              color: color('color/fill/gold'),
            }}
          >
            DOMINANT SET
          </div></Flicker>
          <Flicker startFrame={frame(cue.legal)} durationFrames={14}><div
            data-text="ingroup-sub"
            data-box={`${setI.x + 20} ${setI.y + 410} ${setI.w - 40} 30`}
            style={{
              position: 'absolute',
              left: 20,
              top: 410,
              width: setI.w - 40,
              font: '400 20px "IBM Plex Mono"',
              textAlign: 'center',
              color: color('color/text/soft'),
            }}
          >
            ASSIGNED ENTITLEMENT
          </div></Flicker>
        </div>

        {/* Boundary Barrier Between Sets */}
        <DrawLine
          points={[
            [1340, 230],
            [1340, 650],
          ]}
          startFrame={frame(cue.administrative)}
          durationFrames={18}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={4}
          end="terminal"
          origin
          beat
        />
        <Text
          at={cue.administrative}
          box={{x: 1290, y: 130, w: 100, h: 36}}
          size={20}
          tone="color/marker/race"
          align="center"
          weight={600}
        >
          WALL
        </Text>

        {/* Right Side: Set O Panel */}
        <div style={{position: 'absolute', left: setO.x, top: setO.y, width: setO.w, height: setO.h}}>
          <BootIn
            box={{x: 0, y: 0, w: setO.w, h: setO.h}}
            startFrame={frame(cue.legal)}
            durationFrames={18}
            mode="scan"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            beat
          />
          <DrawRect
            box={{x: 0, y: 0, w: setO.w, h: setO.h}}
            startFrame={frame(cue.legal)}
            durationFrames={18}
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            glowToken="color/marker/race"
            seed={144}
          />
          <FitBox
            text="OUT-GROUP O"
            x={24}
            y={24}
            size={28}
            weight={600}
            tag="SET"
            startFrame={frame(cue.legal)}
            durationFrames={16}
            textToken="color/marker/race"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            accentToken="color/marker/race"
            beat
          />
          <StickFigure
            x={120}
            y={240}
            group="outgroup"
            emphasis={0.9}
            scale={1.3}
            animate
            startFrame={frame(cue.legal)}
            durationFrames={16}
          />
          <StickFigure
            x={300}
            y={240}
            group="outgroup"
            emphasis={0.9}
            scale={1.3}
            animate
            startFrame={frame(cue.legal)}
            durationFrames={16}
          />
          <Flicker startFrame={frame(cue.legal)} durationFrames={14} beat><div
            data-text="outgroup-label"
            data-box={`${setO.x + 20} ${setO.y + 360} ${setO.w - 40} 40`}
            style={{
              position: 'absolute',
              left: 20,
              top: 360,
              width: setO.w - 40,
              font: '600 24px "IBM Plex Sans"',
              textAlign: 'center',
              color: color('color/marker/race'),
            }}
          >
            EXCLUDED SET
          </div></Flicker>
          <Flicker startFrame={frame(cue.legal)} durationFrames={14}><div
            data-text="outgroup-sub"
            data-box={`${setO.x + 20} ${setO.y + 410} ${setO.w - 40} 30`}
            style={{
              position: 'absolute',
              left: 20,
              top: 410,
              width: setO.w - 40,
              font: '400 20px "IBM Plex Mono"',
              textAlign: 'center',
              color: color('color/text/soft'),
            }}
          >
            EXTRACTIVE SURFACE
          </div></Flicker>
        </div>

        {/* Lower Instrument Rail: Legal Statues */}
        {[
          ['CENSUS CATEGORIES', cue.census, 120, 750, 390],
          ['SLAVE CODES', cue.slave, 550, 750, 370],
          ['BLOOD-QUANTUM RULES', cue.blood, 960, 750, 420],
          ['IMMIGRATION STATUTES', cue.immigration, 1420, 750, 380],
        ].map(([label, at, x, y, w]) => {
          const bx = Number(x);
          const by = Number(y);
          const bw = Number(w);
          return (
            <React.Fragment key={String(label)}>
              <div style={{position: 'absolute', left: bx, top: by, width: bw, height: 68}}>
                <DrawRect
                  box={{x: 0, y: 0, w: bw, h: 68}}
                  startFrame={frame(Number(at))}
                  durationFrames={14}
                  strokeToken="color/line/hairline-strong"
                  fillToken="color/fill/panel-render"
                  glowToken="color/fill/gold"
                  seed={bx}
                  beat
                />
                <Text
                  at={Number(at)}
                  box={{x: 16, y: 20, w: bw - 32, h: 28}}
                  size={20}
                  align="center"
                  weight={600}
                  tone="color/text/soft"
                >
                  {String(label)}
                </Text>
              </div>
            </React.Fragment>
          );
        })}
      </KitSound>
    </StageSceneFrame>
  );
}
