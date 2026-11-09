import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="ref1-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function RefutationOne({segment}: SceneProps) {
  const cue = {
    alongside: useCue('t115Alongside').at,
    predictions: useCue('t115Predictions').at,
    standards: useCue('t115Standards').at,
    refutation: useCue('t115Refutation').at,
    durable: useCue('t115Durable').at,
    caste: useCue('t115Caste').at,
    without: useCue('t115Without').at,
    elite: useCue('t115Elite').at,
    sponsorship: useCue('t115Sponsorship').at,
    appearing: useCue('t115Appearing').at,
    before: useCue('t115Before').at,
    extraction: useCue('t115Extraction').at,
    falsify: useCue('t115Falsify').at,
    hypothesis: useCue('t115Hypothesis').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const hypo = {x: 120, y: 220, w: 480, h: 456};
  const condA = {x: 660, y: 220, w: 1140, h: 216};
  const condB = {x: 660, y: 460, w: 1140, h: 216};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.alongside} beat/>
        <Copy at={cue.alongside} box={{x: 154, y: 124, w: 1060, h: 36}} size={30}>
          REFUTATION STANDARD 1 · FALSIFICATION GATE
        </Copy>
        <Copy at={cue.standards} box={{x: 1240, y: 128, w: 520, h: 28}} size={22} tone="color/fill/gold">
          ALONGSIDE FOUR PREDICTIONS
        </Copy>

        <Panel box={hypo} at={cue.refutation} beat/>
        <FitBox
          text="HYPOTHESIS"
          x={hypo.x + 32}
          y={hypo.y + 30}
          size={32}
          weight={600}
          tag="CLAIM"
          startFrame={frame(cue.refutation)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.predictions} box={{x: hypo.x + 32, y: hypo.y + 118, w: 416, h: 68}} size={26}>
          EXTRACTION-FIRST ORIGIN OF RACIAL CASTE
        </Copy>
        <Copy at={cue.predictions} box={{x: hypo.x + 32, y: hypo.y + 204, w: 416, h: 100}} size={22} tone="color/text/soft">
          THE ORDER MATTERS: THE EXTRACTION ARRANGEMENT IS THE CONDITION THE CASTE SYSTEM SERVES
        </Copy>
        <div style={{position: 'absolute', left: hypo.x + 32, top: hypo.y + 330, width: 416, height: 76}}>
          <DrawRect box={{x: 0, y: 0, w: 416, h: 76}} startFrame={frame(cue.refutation)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.refutation} box={{x: 18, y: 24, w: 380, h: 30}} size={22} tone="color/fill/gold">
            EXPECTED ORDER HOLDS
          </Copy>
        </div>

        <Panel box={condA} at={cue.durable} accent="color/marker/race" beat/>
        <FitBox
          text="FALSIFIER A"
          x={condA.x + 28}
          y={condA.y + 22}
          size={26}
          weight={600}
          tag="CONDITION"
          startFrame={frame(cue.durable)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />
        <Copy at={cue.caste} box={{x: condA.x + 28, y: condA.y + 96, w: 1084, h: 34}} size={28}>
          DURABLE SKIN-COLOR CASTE WITHOUT ELITE SPONSORSHIP
        </Copy>
        <Copy at={cue.without} box={{x: condA.x + 28, y: condA.y + 142, w: 1084, h: 52}} size={22} tone="color/text/soft">
          CASTE HOLDS OVER TIME WITH NO SPONSORING ELITE BEHIND IT
        </Copy>

        <Panel box={condB} at={cue.appearing} accent="color/marker/race" beat/>
        <FitBox
          text="FALSIFIER B"
          x={condB.x + 28}
          y={condB.y + 22}
          size={26}
          weight={600}
          tag="CONDITION"
          startFrame={frame(cue.appearing)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />
        <Copy at={cue.before} box={{x: condB.x + 28, y: condB.y + 96, w: 1084, h: 34}} size={28}>
          CASTE APPEARING BEFORE THE EXTRACTION ARRANGEMENT
        </Copy>
        <Copy at={cue.extraction} box={{x: condB.x + 28, y: condB.y + 142, w: 1084, h: 52}} size={22} tone="color/text/soft">
          THE SERVING ORDER REVERSES: CASTE PRECEDES WHAT IT IS SAID TO SERVE
        </Copy>

        <DrawLine
          points={[[600, 448], [660, 448]]}
          startFrame={frame(cue.falsify)}
          durationFrames={14}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={5}
          end="arrow"
          beat
        />

        <div style={{position: 'absolute', left: 120, top: 700, width: 1680, height: 76}}>
          <DrawRect box={{x: 0, y: 0, w: 1680, h: 76}} startFrame={frame(cue.falsify)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.falsify} box={{x: 34, y: 22, w: 1100, h: 34}} size={28} tone="color/marker/race">
            EITHER FALSIFIER WOULD FALSIFY THE HYPOTHESIS
          </Copy>
          <Copy at={cue.hypothesis} box={{x: 1180, y: 26, w: 460, h: 28}} size={22} tone="color/text/soft">
            EXPLICIT STANDARD
          </Copy>
        </div>

        <Copy at={cue.sponsorship} box={{x: 200, y: 812, w: 1520, h: 32}} size={24} tone="color/fill/gold">
          SPONSORSHIP AND ORDER ARE THE TEST
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
