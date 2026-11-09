import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="matrix-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function EmpiricalTestMatrix({segment}: SceneProps) {
  const cue = {
    segments: useCue('t118Segments').at,
    eight: useCue('t118Eight').at,
    nine: useCue('t118Nine').at,
    eleven: useCue('t118Eleven').at,
    test: useCue('t118Test').at,
    predictions: useCue('t118Predictions').at,
    standards: useCue('t118Standards').at,
    portugal: useCue('t118Portugal').at,
    virginia: useCue('t118Virginia').at,
    quantitative: useCue('t118Quantitative').at,
    american: useCue('t118American').at,
    record: useCue('t118Record').at,
    eighteen: useCue('t118Eighteen').at,
    twenty: useCue('t118Twenty').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const grid = {x: 120, y: 300, w: 1680, h: 480};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.segments} beat/>
        <Copy at={cue.segments} box={{x: 154, y: 124, w: 1020, h: 36}} size={30}>
          EMPIRICAL TEST MATRIX
        </Copy>
        <Copy at={cue.eight} box={{x: 1220, y: 128, w: 540, h: 28}} size={22} tone="color/fill/gold">
          SEGMENTS 8 · 9 · 11
        </Copy>

        <div style={{position: 'absolute', left: 120, top: 200, width: 1680, height: 76}}>
          <DrawRect box={{x: 0, y: 0, w: 1680, h: 76}} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.test} box={{x: 28, y: 22, w: 760, h: 32}} size={24}>
            TEST SIX CLAIMS
          </Copy>
          <Copy at={cue.predictions} box={{x: 860, y: 24, w: 280, h: 28}} size={22} tone="color/fill/gold">
            4 PREDICTIONS
          </Copy>
          <Copy at={cue.standards} box={{x: 1220, y: 24, w: 380, h: 28}} size={22} tone="color/marker/race">
            2 REFUTATIONS
          </Copy>
        </div>

        <Panel box={grid} at={cue.test} beat/>

        <Copy at={cue.predictions} box={{x: 392, y: 322, w: 220, h: 26}} size={20} tone="color/fill/gold">
          PREDICTION 1
        </Copy>
        <Copy at={cue.predictions} box={{x: 622, y: 322, w: 220, h: 26}} size={20} tone="color/fill/gold">
          PREDICTION 2
        </Copy>
        <Copy at={cue.predictions} box={{x: 852, y: 322, w: 220, h: 26}} size={20} tone="color/fill/gold">
          PREDICTION 3
        </Copy>
        <Copy at={cue.predictions} box={{x: 1082, y: 322, w: 220, h: 26}} size={20} tone="color/fill/gold">
          PREDICTION 4
        </Copy>
        <Copy at={cue.standards} box={{x: 1312, y: 322, w: 220, h: 26}} size={20} tone="color/marker/race">
          REFUTATION 1
        </Copy>
        <Copy at={cue.standards} box={{x: 1542, y: 322, w: 220, h: 26}} size={20} tone="color/marker/race">
          REFUTATION 2
        </Copy>

        <DrawLine points={[[360, 360], [360, 744]]} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[590, 360], [590, 744]]} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[820, 360], [820, 744]]} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[1050, 360], [1050, 744]]} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[1280, 360], [1280, 744]]} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[1510, 360], [1510, 744]]} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[120, 360], [1800, 360]]} startFrame={frame(cue.test)} durationFrames={16} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[120, 488], [1800, 488]]} startFrame={frame(cue.portugal)} durationFrames={14} strokeToken="color/line/hairline-strong" strokeWidth={2}/>
        <DrawLine points={[[120, 616], [1800, 616]]} startFrame={frame(cue.virginia)} durationFrames={14} strokeToken="color/line/hairline-strong" strokeWidth={2}/>

        <Copy at={cue.portugal} box={{x: 148, y: 410, w: 184, h: 30}} size={26}>
          PORTUGAL
        </Copy>
        <Copy at={cue.virginia} box={{x: 148, y: 538, w: 184, h: 30}} size={26}>
          VIRGINIA
        </Copy>
        <Copy at={cue.quantitative} box={{x: 148, y: 650, w: 184, h: 52}} size={22}>
          U.S. RECORD
        </Copy>
        <Copy at={cue.eighteen} box={{x: 148, y: 706, w: 184, h: 26}} size={20} tone="color/fill/gold">
          1840–2020
        </Copy>

        {[
          {x: 392, y: 400, at: cue.portugal, label: 'P1 · FOUNDING'},
          {x: 622, y: 400, at: cue.portugal, label: 'P2 · CODES'},
          {x: 852, y: 400, at: cue.portugal, label: 'P3 · PROXY'},
          {x: 1082, y: 400, at: cue.portugal, label: 'P4 · RATIO'},
          {x: 1312, y: 400, at: cue.portugal, label: 'R1 · ORDER'},
          {x: 1542, y: 400, at: cue.portugal, label: 'R2 · DEFEAT'},
          {x: 392, y: 528, at: cue.virginia, label: 'P1 · FOUNDING'},
          {x: 622, y: 528, at: cue.virginia, label: 'P2 · CODES'},
          {x: 852, y: 528, at: cue.virginia, label: 'P3 · PROXY'},
          {x: 1082, y: 528, at: cue.virginia, label: 'P4 · RATIO'},
          {x: 1312, y: 528, at: cue.virginia, label: 'R1 · ORDER'},
          {x: 1542, y: 528, at: cue.virginia, label: 'R2 · DEFEAT'},
          {x: 392, y: 656, at: cue.record, label: 'P1 · FOUNDING'},
          {x: 622, y: 656, at: cue.record, label: 'P2 · CODES'},
          {x: 852, y: 656, at: cue.record, label: 'P3 · PROXY'},
          {x: 1082, y: 656, at: cue.twenty, label: 'P4 · RATIO'},
          {x: 1312, y: 656, at: cue.twenty, label: 'R1 · ORDER'},
          {x: 1542, y: 656, at: cue.record, label: 'R2 · DEFEAT'},
        ].map((cell) => (
          <React.Fragment key={`${cell.x}-${cell.y}`}>
            <div style={{position: 'absolute', left: cell.x, top: cell.y, width: 198, height: 64}}>
              <DrawRect box={{x: 0, y: 0, w: 198, h: 64}} startFrame={frame(cell.at)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
            </div>
            <Copy at={cell.at} box={{x: cell.x + 14, y: cell.y + 20, w: 170, h: 24}} size={18} tone="color/text/soft">
              {cell.label}
            </Copy>
          </React.Fragment>
        ))}

        <Copy at={cue.twenty} box={{x: 240, y: 812, w: 1440, h: 32}} size={24} tone="color/fill/gold">
          EVERY CLAIM MEETS EVERY RECORD
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
