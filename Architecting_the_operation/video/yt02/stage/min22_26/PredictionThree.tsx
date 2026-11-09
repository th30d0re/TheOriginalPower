import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div
      data-text="pred3-copy"
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

export function PredictionThree({segment}: SceneProps) {
  const cue = {
    prediction: useCue('t113Prediction').at,
    maintenance: useCue('t113Maintenance').at,
    cultivation: useCue('t113Cultivation').at,
    visible: useCue('t113Visible').at,
    control: useCue('t113Control').at,
    struck: useCue('t113Struck').at,
    discredited: useCue('t113Discredited').at,
    system: useCue('t113System').at,
    swaps: useCue('t113Swaps').at,
    proxy: useCue('t113Proxy').at,
    extraction: useCue('t113Extraction').at,
    running: useCue('t113Running').at,
    cultivating: useCue('t113Cultivating').at,
    stereotypes: useCue('t113Stereotypes').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const left = {x: 120, y: 220, w: 480, h: 600};
  const middle = {x: 660, y: 220, w: 560, h: 600};
  const right = {x: 1280, y: 220, w: 520, h: 600};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.prediction} beat/>
        <Copy at={cue.prediction} box={{x: 154, y: 124, w: 1020, h: 36}} size={30}>
          PREDICTION 3 · MAINTENANCE BY CULTIVATION
        </Copy>
        <Copy at={cue.maintenance} box={{x: 1200, y: 128, w: 560, h: 28}} size={22} tone="color/fill/gold">
          SYSTEM ADAPTATION &amp; PROXY SWAP
        </Copy>

        <Panel box={left} at={cue.visible} beat/>
        <FitBox
          text="VISIBLE TOOL"
          x={left.x + 32}
          y={left.y + 32}
          size={32}
          weight={600}
          tag="EXPLICIT"
          startFrame={frame(cue.visible)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.control} box={{x: left.x + 32, y: left.y + 116, w: 416, h: 64}} size={24}>
          EXPLICIT STATUTORY RACIAL CONTROL
        </Copy>
        <Copy at={cue.control} box={{x: left.x + 32, y: left.y + 196, w: 416, h: 96}} size={22} tone="color/text/soft">
          DE JURE DISFRANCHISEMENT, BLACK CODES, EXPLICIT SLAVERY STATUTES
        </Copy>

        <DrawLine
          points={[[left.x + 30, left.y + 350], [left.x + 450, left.y + 350]]}
          startFrame={frame(cue.struck)}
          durationFrames={16}
          strokeToken="color/marker/race"
          strokeWidth={6}
          beat
        />
        <DrawLine
          points={[[left.x + 30, left.y + 320], [left.x + 450, left.y + 380]]}
          startFrame={frame(cue.discredited)}
          durationFrames={16}
          strokeToken="color/marker/race"
          strokeWidth={4}
        />

        <div style={{position: 'absolute', left: left.x + 32, top: left.y + 440, width: 416, height: 80}}>
          <DrawRect box={{x: 0, y: 0, w: 416, h: 80}} startFrame={frame(cue.struck)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.struck} box={{x: left.x + 48, y: left.y + 466, w: 384, h: 28}} size={22} tone="color/marker/race">
            STRUCK DOWN / DISCREDITED
          </Copy>
        </div>

        <DrawLine
          points={[[600, 480], [660, 480]]}
          startFrame={frame(cue.swaps)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          strokeWidth={5}
          end="arrow"
          beat
        />

        <Panel box={middle} at={cue.proxy} accent="color/fill/gold" beat/>
        <FitBox
          text="LEGAL PROXY"
          x={middle.x + 32}
          y={middle.y + 32}
          size={32}
          weight={600}
          tag="SUBSTITUTE"
          startFrame={frame(cue.proxy)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.proxy} box={{x: middle.x + 32, y: middle.y + 116, w: 496, h: 32}} size={26}>
          RACE-NEUTRAL FACIAL STATUTE
        </Copy>
        <Copy at={cue.proxy} box={{x: middle.x + 32, y: middle.y + 164, w: 496, h: 100}} size={22} tone="color/text/soft">
          VAGRANCY, CONVICT LEASING, ZONING CODES, FELONY RECORDS, CREDIT SCORES
        </Copy>

        <div style={{position: 'absolute', left: middle.x + 32, top: middle.y + 320, width: 496, height: 210}}>
          <DrawRect box={{x: 0, y: 0, w: 496, h: 210}} startFrame={frame(cue.extraction)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <FitBox
            text="CONTINUOUS FLOW"
            x={20}
            y={20}
            size={24}
            weight={600}
            tag="THROUGHPUT"
            startFrame={frame(cue.extraction)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
          />
          <Copy at={cue.extraction} box={{x: middle.x + 52, y: middle.y + 400, w: 456, h: 32}} size={24}>
            EXTRACTION RUNNING UNBROKEN
          </Copy>
          <Copy at={cue.running} box={{x: middle.x + 52, y: middle.y + 444, w: 456, h: 60}} size={20} tone="color/fill/gold">
            MATERIAL FLOW CONTINUES UNDER A REVISED LEGAL DESIGNATION
          </Copy>
        </div>

        <DrawLine
          points={[[1220, 360], [1280, 360]]}
          startFrame={frame(cue.cultivating)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          strokeWidth={4}
          end="arrow"
          beat
        />

        <Panel box={right} at={cue.cultivating} accent="color/fill/gold" beat/>
        <FitBox
          text="STEREOTYPES"
          x={right.x + 32}
          y={right.y + 32}
          size={32}
          weight={600}
          tag="CULTIVATION"
          startFrame={frame(cue.cultivating)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.cultivating} box={{x: right.x + 32, y: right.y + 116, w: 456, h: 32}} size={26}>
          UPDATED PUBLIC STEREOTYPES
        </Copy>
        <Copy at={cue.stereotypes} box={{x: right.x + 32, y: right.y + 164, w: 456, h: 140}} size={22} tone="color/text/soft">
          DISCOURSE SHIFTS TO MORAL, CULTURAL, AND CRIMINOLOGICAL DEFECTS TO JUSTIFY CONTINUING EXTRACTION
        </Copy>

        <div style={{position: 'absolute', left: right.x + 32, top: right.y + 360, width: 456, height: 170}}>
          <DrawRect box={{x: 0, y: 0, w: 456, h: 170}} startFrame={frame(cue.stereotypes)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.stereotypes} box={{x: right.x + 52, y: right.y + 386, w: 416, h: 28}} size={22} tone="color/fill/gold">
            FEEDBACK TO POPULAR BELIEF
          </Copy>
          <Copy at={cue.stereotypes} box={{x: right.x + 52, y: right.y + 426, w: 416, h: 80}} size={20} tone="color/text/soft">
            CULTIVATES PUBLIC SUPPORT FOR THE NEW NEUTRAL PROXY
          </Copy>
        </div>

        <Copy at={cue.running} box={{x: 200, y: 864, w: 1520, h: 36}} size={26} tone="color/fill/gold">
          RACE-NEUTRAL PROXIES KEEP EXTRACTION RUNNING WHILE CULTIVATING NEW STEREOTYPES
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
