import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div
      data-text="pred4-copy"
      data-box={`${box.x} ${box.y} ${box.w} ${box.h}`}
      style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}
    >
      {children}
    </div>
  </Flicker>
);

const Panel = ({box, at, accent = 'color/line/hairline-strong', beat = false}: {box: {x: number; y: number; w: number; h: number}; at: number; accent?: string; beat?: boolean}) => (
  <>
    <BootIn box={box} startFrame={frame(at)} durationFrames={20} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat={beat}/>
    <DrawRect box={box} startFrame={frame(at)} durationFrames={20} strokeToken={accent} fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
  </>
);

export function PredictionFour({segment}: SceneProps) {
  const cue = {
    prediction: useCue('t114Prediction').at,
    suppression: useCue('t114Suppression').at,
    scales: useCue('t114Scales').at,
    extraction: useCue('t114Extraction').at,
    spending: useCue('t114Spending').at,
    physical: useCue('t114Physical').at,
    enforcement: useCue('t114Enforcement').at,
    rises: useCue('t114Rises').at,
    falls: useCue('t114Falls').at,
    lockstep: useCue('t114Lockstep').at,
    dollar: useCue('t114Dollar').at,
    value: useCue('t114Value').at,
    commodity: useCue('t114Commodity').at,
    stable: useCue('t114Stable').at,
    ratio: useCue('t114Ratio').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const leftCard = {x: 120, y: 204, w: 580, h: 140};
  const rightCard = {x: 1220, y: 204, w: 580, h: 140};
  const chartBox = {x: 120, y: 374, w: 1680, h: 450};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.prediction} beat/>
        <Copy at={cue.prediction} box={{x: 154, y: 124, w: 1040, h: 36}} size={30}>
          PREDICTION 4 · SUPPRESSION SCALES WITH EXTRACTION
        </Copy>
        <Copy at={cue.suppression} box={{x: 1220, y: 128, w: 540, h: 28}} size={22} tone="color/fill/gold">
          LOCKSTEP COVARIATION MODEL
        </Copy>

        <Panel box={leftCard} at={cue.dollar} beat/>
        <FitBox
          text="COMMODITY VALUE ($)"
          x={leftCard.x + 28}
          y={leftCard.y + 24}
          size={28}
          weight={600}
          tag="EXTRACTION REVENUE"
          startFrame={frame(cue.dollar)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
        />
        <Copy at={cue.commodity} box={{x: leftCard.x + 28, y: leftCard.y + 88, w: 520, h: 32}} size={24}>
          DOLLAR VALUE OF EXTRACTED COMMODITY
        </Copy>

        <Panel box={rightCard} at={cue.spending} accent="color/marker/race" beat/>
        <FitBox
          text="ENFORCEMENT SPENDING ($)"
          x={rightCard.x + 28}
          y={rightCard.y + 24}
          size={28}
          weight={600}
          tag="PHYSICAL SUPPRESSION"
          startFrame={frame(cue.spending)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
        />
        <Copy at={cue.enforcement} box={{x: rightCard.x + 28, y: rightCard.y + 88, w: 520, h: 32}} size={24}>
          SLAVE-PATROL &amp; POLICE BUDGETS
        </Copy>

        <Panel box={chartBox} at={cue.scales} beat/>

        <Copy at={cue.scales} box={{x: 156, y: 396, w: 380, h: 28}} size={22} tone="color/fill/gold">
          COMMODITY VALUE ($)
        </Copy>
        <Copy at={cue.enforcement} box={{x: 1400, y: 396, w: 360, h: 28}} size={22} tone="color/marker/race">
          ENFORCEMENT SPENDING ($)
        </Copy>

        <DrawLine
          points={[[180, 760], [1740, 760]]}
          startFrame={frame(cue.scales)}
          durationFrames={14}
          strokeToken="color/line/hairline-strong"
          strokeWidth={2}
        />
        <DrawLine
          points={[[180, 440], [180, 760]]}
          startFrame={frame(cue.scales)}
          durationFrames={14}
          strokeToken="color/line/hairline-strong"
          strokeWidth={2}
        />
        <DrawLine
          points={[[1740, 440], [1740, 760]]}
          startFrame={frame(cue.scales)}
          durationFrames={14}
          strokeToken="color/line/hairline-strong"
          strokeWidth={2}
        />

        <DrawLine
          points={[
            [220, 720],
            [440, 560],
            [680, 670],
            [980, 510],
            [1300, 620],
            [1660, 480],
          ]}
          startFrame={frame(cue.rises)}
          durationFrames={24}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
          beat
        />

        <DrawLine
          points={[
            [220, 736],
            [440, 576],
            [680, 686],
            [980, 526],
            [1300, 636],
            [1660, 496],
          ]}
          startFrame={frame(cue.lockstep)}
          durationFrames={24}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={5}
          beat
        />

        <div style={{position: 'absolute', left: 740, top: 410, width: 440, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 440, h: 72}} startFrame={frame(cue.stable)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <FitBox
            text="STABLE RATIO"
            x={18}
            y={16}
            size={24}
            weight={600}
            tag="CONSTANT"
            startFrame={frame(cue.stable)}
            durationFrames={14}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
        </div>
        <Copy at={cue.ratio} box={{x: 740, y: 494, w: 440, h: 20}} size={15} tone="color/fill/gold">
          ENFORCEMENT / VALUE
        </Copy>

        <Copy at={cue.rises} box={{x: 460, y: 520, w: 180, h: 26}} size={20} tone="color/text/soft">
          EXPANSION ↑
        </Copy>
        <Copy at={cue.falls} box={{x: 700, y: 706, w: 180, h: 26}} size={20} tone="color/text/soft">
          CONTRACTION ↓
        </Copy>
        <Copy at={cue.lockstep} box={{x: 1220, y: 510, w: 360, h: 26}} size={20} tone="color/fill/gold">
          LOCKSTEP RATIO MAINTAINED
        </Copy>

        <Copy at={cue.lockstep} box={{x: 200, y: 864, w: 1520, h: 36}} size={26} tone="color/fill/gold">
          ENFORCEMENT SPENDING TRACKS COMMODITY REVENUE AT A STABLE RATIO
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
