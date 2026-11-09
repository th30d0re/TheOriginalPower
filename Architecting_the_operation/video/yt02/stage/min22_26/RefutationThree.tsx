import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="ref3-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function RefutationThree({segment}: SceneProps) {
  const cue = {
    refutation: useCue('t117Refutation').at,
    vector: useCue('t117Vector').at,
    definition: useCue('t117Definition').at,
    racism: useCue('t117Racism').at,
    fail: useCue('t117Fail').at,
    personal: useCue('t117Personal').at,
    prejudice: useCue('t117Prejudice').at,
    produced: useCue('t117Produced').at,
    systemic: useCue('t117Systemic').at,
    without: useCue('t117Without').at,
    institutional: useCue('t117Institutional').at,
    control: useCue('t117Control').at,
    legislatures: useCue('t117Legislatures').at,
    policing: useCue('t117Policing').at,
    courts: useCue('t117Courts').at,
    capital: useCue('t117Capital').at,
    allocation: useCue('t117Allocation').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const left = {x: 120, y: 220, w: 560, h: 600};
  const right = {x: 860, y: 220, w: 940, h: 600};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.refutation} beat/>
        <Copy at={cue.refutation} box={{x: 154, y: 124, w: 1060, h: 36}} size={30}>
          REFUTATION STANDARD 3 · VECTOR TEST
        </Copy>
        <Copy at={cue.vector} box={{x: 1240, y: 128, w: 520, h: 28}} size={22} tone="color/fill/gold">
          DEFINITION ON TRIAL
        </Copy>

        <Panel box={left} at={cue.personal} beat/>
        <FitBox
          text="PREJUDICE ALONE"
          x={left.x + 32}
          y={left.y + 30}
          size={30}
          weight={600}
          tag="SCALAR"
          startFrame={frame(cue.personal)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <StickFigure x={left.x + 280} y={left.y + 250} group="neutral" emphasis={1} scale={2} animate startFrame={frame(cue.prejudice)} durationFrames={18} beat/>
        <Copy at={cue.prejudice} box={{x: left.x + 32, y: left.y + 360, w: 496, h: 34}} size={26}>
          PERSONAL PREJUDICE
        </Copy>
        <Copy at={cue.produced} box={{x: left.x + 32, y: left.y + 408, w: 496, h: 60}} size={22} tone="color/text/soft">
          A GROUP HOLDS THE ATTITUDE AND ACTS ON IT
        </Copy>
        <div style={{position: 'absolute', left: left.x + 32, top: left.y + 492, width: 496, height: 72}}>
          <DrawRect box={{x: 0, y: 0, w: 496, h: 72}} startFrame={frame(cue.without)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.without} box={{x: left.x + 50, y: left.y + 514, w: 460, h: 30}} size={22} tone="color/marker/race">
            WITHOUT INSTITUTIONAL CONTROL
          </Copy>
        </div>

        <DrawLine
          points={[[680, 520], [860, 520]]}
          startFrame={frame(cue.produced)}
          durationFrames={16}
          strokeToken="color/line/hairline-strong"
          strokeWidth={4}
        />
        <DrawLine
          points={[[740, 495], [790, 545]]}
          startFrame={frame(cue.fail)}
          durationFrames={14}
          strokeToken="color/marker/race"
          strokeWidth={5}
          beat
        />
        <DrawLine
          points={[[790, 495], [740, 545]]}
          startFrame={frame(cue.fail)}
          durationFrames={14}
          strokeToken="color/marker/race"
          strokeWidth={5}
        />
        <Copy at={cue.fail} box={{x: 700, y: 556, w: 140, h: 26}} size={20} tone="color/marker/race">
          BLOCKED
        </Copy>

        <Panel box={right} at={cue.institutional} accent="color/marker/race" beat/>
        <FitBox
          text="CONTROL REQUIRED"
          x={right.x + 32}
          y={right.y + 30}
          size={30}
          weight={600}
          tag="VECTOR"
          startFrame={frame(cue.institutional)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />
        <Copy at={cue.control} box={{x: right.x + 32, y: right.y + 118, w: 876, h: 34}} size={26}>
          SYSTEMIC RACISM AGAINST WHITE AMERICANS
        </Copy>
        <Copy at={cue.systemic} box={{x: right.x + 32, y: right.y + 164, w: 876, h: 52}} size={22} tone="color/text/soft">
          THE CLAIMED OUTCOME NEEDS ALL FOUR LEVERS HELD AT ONCE
        </Copy>

        <div style={{position: 'absolute', left: right.x + 32, top: right.y + 240, width: 420, height: 84}}>
          <DrawRect box={{x: 0, y: 0, w: 420, h: 84}} startFrame={frame(cue.legislatures)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.legislatures} box={{x: right.x + 54, y: right.y + 268, w: 376, h: 30}} size={24}>
            LEGISLATURES
          </Copy>
        </div>
        <div style={{position: 'absolute', left: right.x + 488, top: right.y + 240, width: 420, height: 84}}>
          <DrawRect box={{x: 0, y: 0, w: 420, h: 84}} startFrame={frame(cue.policing)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.policing} box={{x: right.x + 510, y: right.y + 268, w: 376, h: 30}} size={24}>
            POLICING
          </Copy>
        </div>
        <div style={{position: 'absolute', left: right.x + 32, top: right.y + 344, width: 420, height: 84}}>
          <DrawRect box={{x: 0, y: 0, w: 420, h: 84}} startFrame={frame(cue.courts)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.courts} box={{x: right.x + 54, y: right.y + 372, w: 376, h: 30}} size={24}>
            COURTS
          </Copy>
        </div>
        <div style={{position: 'absolute', left: right.x + 488, top: right.y + 344, width: 420, height: 84}}>
          <DrawRect box={{x: 0, y: 0, w: 420, h: 84}} startFrame={frame(cue.capital)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.capital} box={{x: right.x + 510, y: right.y + 372, w: 376, h: 30}} size={24}>
            CAPITAL ALLOCATION
          </Copy>
        </div>

        <Copy at={cue.allocation} box={{x: right.x + 32, y: right.y + 464, w: 876, h: 32}} size={22} tone="color/marker/race">
          MISSING CONTROL BREAKS THE VECTOR
        </Copy>
        <Copy at={cue.definition} box={{x: 200, y: 864, w: 1520, h: 34}} size={26} tone="color/fill/gold">
          PREJUDICE WITHOUT CONTROL DOES NOT MAKE A SYSTEMIC VECTOR
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
