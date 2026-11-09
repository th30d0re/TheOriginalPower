import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div
      data-text="pred1-copy"
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

export function PredictionOne({segment}: SceneProps) {
  const cue = {
    prediction: useCue('t111Prediction').at,
    institutional: useCue('t111Institutional').at,
    founding: useCue('t111Founding').at,
    archival: useCue('t111Archival').at,
    commercial: useCue('t111Commercial').at,
    extraction: useCue('t111Extraction').at,
    licensing: useCue('t111Licensing').at,
    first: useCue('t111First').at,
    commissioned: useCue('t111Commissioned').at,
    ideology: useCue('t111Ideology').at,
    written: useCue('t111Written').at,
    afterward: useCue('t111Afterward').at,
    justify: useCue('t111Justify').at,
    captives: useCue('t111Captives').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const left = {x: 120, y: 220, w: 720, h: 600};
  const right = {x: 1080, y: 220, w: 720, h: 600};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.prediction} beat/>
        <Copy at={cue.prediction} box={{x: 154, y: 124, w: 980, h: 36}} size={30}>
          PREDICTION 1 · INSTITUTIONAL PRODUCTION
        </Copy>
        <Copy at={cue.archival} box={{x: 1180, y: 128, w: 580, h: 28}} size={22} tone="color/fill/gold">
          FOUNDING ARCHIVAL RECORD · 1440s
        </Copy>

        <Panel box={left} at={cue.commercial} beat/>
        <FitBox
          text="EXTRACTION"
          x={left.x + 36}
          y={left.y + 36}
          size={34}
          weight={600}
          tag="STAGE 1 · FIRST"
          startFrame={frame(cue.commercial)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.extraction} box={{x: left.x + 36, y: left.y + 116, w: 648, h: 36}} size={28}>
          COMMERCIAL EXTRACTION &amp; LICENSING
        </Copy>

        <div style={{position: 'absolute', left: left.x + 36, top: left.y + 180, width: 648, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 648, h: 72}} startFrame={frame(cue.licensing)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.licensing} box={{x: 20, y: 22, w: 608, h: 30}} size={24}>
            FEITORIA MONOPOLIES &amp; STATE LICENSES
          </Copy>
        </div>

        <div style={{position: 'absolute', left: left.x + 36, top: left.y + 276, width: 648, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 648, h: 72}} startFrame={frame(cue.founding)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.founding} box={{x: 20, y: 22, w: 608, h: 30}} size={24}>
            COMMERCIAL ENTERPRISE PRECEDES DOCTRINE
          </Copy>
        </div>

        <div style={{position: 'absolute', left: left.x + 36, top: left.y + 372, width: 648, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 648, h: 72}} startFrame={frame(cue.captives)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.captives} box={{x: 20, y: 22, w: 608, h: 30}} size={24}>
            MATERIAL APPARATUS SECURES CAPTIVES
          </Copy>
        </div>

        <Copy at={cue.first} box={{x: left.x + 36, y: left.y + 490, w: 648, h: 34}} size={24} tone="color/fill/gold">
          APPEARS FIRST IN ARCHIVES · 1441–1448
        </Copy>

        <DrawLine
          points={[[870, 520], [1050, 520]]}
          startFrame={frame(cue.first)}
          durationFrames={16}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={6}
          end="arrow"
          beat
        />
        <Copy at={cue.afterward} box={{x: 840, y: 550, w: 240, h: 30}} size={20} tone="color/text/soft">
          WRITTEN AFTERWARD
        </Copy>

        <Panel box={right} at={cue.commissioned} accent="color/marker/race" beat/>
        <FitBox
          text="IDEOLOGY"
          x={right.x + 36}
          y={right.y + 36}
          size={34}
          weight={600}
          tag="STAGE 2 · DERIVATIVE"
          startFrame={frame(cue.commissioned)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />
        <Copy at={cue.ideology} box={{x: right.x + 36, y: right.y + 116, w: 648, h: 36}} size={28} tone="color/marker/race">
          COMMISSIONED RACIAL IDEOLOGY
        </Copy>

        <div style={{position: 'absolute', left: right.x + 36, top: right.y + 180, width: 648, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 648, h: 72}} startFrame={frame(cue.written)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.written} box={{x: 20, y: 22, w: 608, h: 30}} size={24}>
            COMMISSIONED CHRONICLES WRITTEN LATER
          </Copy>
        </div>

        <div style={{position: 'absolute', left: right.x + 36, top: right.y + 276, width: 648, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 648, h: 72}} startFrame={frame(cue.justify)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.justify} box={{x: 20, y: 22, w: 608, h: 30}} size={24}>
            JUSTIFIES CAPTIVES ALREADY TAKEN
          </Copy>
        </div>

        <div style={{position: 'absolute', left: right.x + 36, top: right.y + 372, width: 648, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 648, h: 72}} startFrame={frame(cue.afterward)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.afterward} box={{x: 20, y: 22, w: 608, h: 30}} size={24}>
            RACIAL DOCTRINE PRODUCED POST-HOC
          </Copy>
        </div>

        <Copy at={cue.justify} box={{x: right.x + 36, y: right.y + 490, w: 648, h: 34}} size={24} tone="color/marker/race">
          POST-HOC JUSTIFICATION · 1453 CHRONICLE
        </Copy>

        <Copy at={cue.justify} box={{x: 240, y: 864, w: 1440, h: 36}} size={26} tone="color/fill/gold">
          CHRONOLOGY: MATERIAL EXTRACTION ESTABLISHED BEFORE RACIAL DOCTRINE
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
