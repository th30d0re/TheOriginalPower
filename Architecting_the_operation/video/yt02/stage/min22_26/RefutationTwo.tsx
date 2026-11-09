import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="ref2-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function RefutationTwo({segment}: SceneProps) {
  const cue = {
    refutation: useCue('t116Refutation').at,
    empirical: useCue('t116Empirical').at,
    defeat: useCue('t116Defeat').at,
    conditions: useCue('t116Conditions').at,
    rising: useCue('t116Rising').at,
    cotton: useCue('t116Cotton').at,
    revenue: useCue('t116Revenue').at,
    flat: useCue('t116Flat').at,
    falling: useCue('t116Falling').at,
    patrol: useCue('t116Patrol').at,
    spending: useCue('t116Spending').at,
    post1965: useCue('t116Post1965').at,
    rise: useCue('t116Rise').at,
    union: useCue('t116Union').at,
    incarceration: useCue('t116Incarceration').at,
    wealth: useCue('t116Wealth').at,
    share: useCue('t116Share').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const condA = {x: 120, y: 204, w: 1680, h: 330};
  const condB = {x: 120, y: 558, w: 1680, h: 300};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.refutation} beat/>
        <Copy at={cue.refutation} box={{x: 154, y: 124, w: 1080, h: 36}} size={30}>
          REFUTATION STANDARD 2 · TWO DEFEAT CONDITIONS
        </Copy>
        <Copy at={cue.empirical} box={{x: 1250, y: 128, w: 510, h: 28}} size={22} tone="color/fill/gold">
          EMPIRICAL TEST
        </Copy>

        <Panel box={condA} at={cue.conditions} beat/>
        <FitBox
          text="CONDITION A"
          x={condA.x + 28}
          y={condA.y + 22}
          size={26}
          weight={600}
          tag="DIVERGENCE"
          startFrame={frame(cue.conditions)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.rising} box={{x: condA.x + 560, y: condA.y + 24, w: 520, h: 28}} size={22} tone="color/fill/gold">
          COTTON REVENUE RISES
        </Copy>
        <Copy at={cue.patrol} box={{x: condA.x + 1120, y: condA.y + 24, w: 620, h: 28}} size={22} tone="color/marker/race">
          SLAVE-PATROL SPENDING FLAT OR FALLING
        </Copy>
        <DrawLine
          points={[[180, 470], [1760, 470]]}
          startFrame={frame(cue.conditions)}
          durationFrames={14}
          strokeToken="color/line/hairline-strong"
          strokeWidth={2}
        />
        <DrawLine
          points={[[180, 290], [180, 470]]}
          startFrame={frame(cue.conditions)}
          durationFrames={14}
          strokeToken="color/line/hairline-strong"
          strokeWidth={2}
        />
        <DrawLine
          points={[[240, 440], [620, 360], [1040, 320], [1560, 270]]}
          startFrame={frame(cue.rising)}
          durationFrames={22}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
          beat
        />
        <DrawLine
          points={[[240, 400], [620, 405], [1040, 415], [1560, 440]]}
          startFrame={frame(cue.flat)}
          durationFrames={22}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={5}
          beat
        />
        <Copy at={cue.cotton} box={{x: 300, y: 336, w: 300, h: 26}} size={20} tone="color/fill/gold">
          REVENUE UP
        </Copy>
        <Copy at={cue.spending} box={{x: 1180, y: 446, w: 360, h: 26}} size={20} tone="color/marker/race">
          SPENDING FLAT / DOWN
        </Copy>
        <Copy at={cue.defeat} box={{x: 700, y: 492, w: 520, h: 28}} size={22} tone="color/text/soft">
          THE PAIR MUST MOVE TOGETHER
        </Copy>

        <Panel box={condB} at={cue.post1965} accent="color/marker/race" beat/>
        <FitBox
          text="CONDITION B"
          x={condB.x + 28}
          y={condB.y + 22}
          size={26}
          weight={600}
          tag="JOINT MOVE"
          startFrame={frame(cue.post1965)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />
        <Copy at={cue.post1965} box={{x: condB.x + 620, y: condB.y + 26, w: 540, h: 28}} size={22} tone="color/text/soft">
          SIMULTANEOUS · POST-1965
        </Copy>

        <div style={{position: 'absolute', left: 150, top: 646, width: 500, height: 150}}>
          <DrawRect box={{x: 0, y: 0, w: 500, h: 150}} startFrame={frame(cue.union)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.rise} box={{x: 178, y: 668, w: 444, h: 30}} size={24}>
            UNION MEMBERSHIP RISE
          </Copy>
          <Copy at={cue.union} box={{x: 178, y: 706, w: 444, h: 44}} size={20} tone="color/fill/gold">
            INDICATOR ONE MOVES UP
          </Copy>
        </div>
        <div style={{position: 'absolute', left: 710, top: 646, width: 500, height: 150}}>
          <DrawRect box={{x: 0, y: 0, w: 500, h: 150}} startFrame={frame(cue.incarceration)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.incarceration} box={{x: 738, y: 668, w: 444, h: 30}} size={24}>
            INCARCERATION FALL
          </Copy>
          <Copy at={cue.incarceration} box={{x: 738, y: 706, w: 444, h: 44}} size={20} tone="color/marker/race">
            INDICATOR TWO MOVES DOWN
          </Copy>
        </div>
        <div style={{position: 'absolute', left: 1270, top: 646, width: 500, height: 150}}>
          <DrawRect box={{x: 0, y: 0, w: 500, h: 150}} startFrame={frame(cue.wealth)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <Copy at={cue.wealth} box={{x: 1298, y: 668, w: 444, h: 30}} size={24}>
            TOP-10% WEALTH SHARE FALL
          </Copy>
          <Copy at={cue.share} box={{x: 1298, y: 706, w: 444, h: 44}} size={20} tone="color/marker/race">
            INDICATOR THREE MOVES DOWN
          </Copy>
        </div>

        <Copy at={cue.share} box={{x: 280, y: 884, w: 1360, h: 34}} size={26} tone="color/fill/gold">
          EITHER CONDITION DEFEATS THE ACCOUNT
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
