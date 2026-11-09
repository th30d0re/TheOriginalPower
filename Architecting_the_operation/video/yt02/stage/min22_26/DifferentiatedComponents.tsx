import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="diff-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function DifferentiatedComponents({segment}: SceneProps) {
  const cue = {
    makes: useCue('t123Makes').at,
    racism: useCue('t123Racism').at,
    system: useCue('t123System').at,
    requirement: useCue('t123Requirement').at,
    one: useCue('t123One').at,
    differentiated: useCue('t123Differentiated').at,
    components: useCue('t123Components').at,
    specialized: useCue('t123Specialized').at,
    roles: useCue('t123Roles').at,
    baseline: useCue('t123Baseline').at,
    division: useCue('t123Division').at,
    population: useCue('t123Population').at,
    inGroup: useCue('t123InGroup').at,
    outGroup: useCue('t123OutGroup').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const stage = {x: 120, y: 204, w: 1680, h: 560};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.makes} beat/>
        <Copy at={cue.makes} box={{x: 154, y: 124, w: 1160, h: 36}} size={30}>
          WHAT MAKES RACISM COUNT AS A SYSTEM?
        </Copy>
        <Copy at={cue.requirement} box={{x: 1340, y: 128, w: 420, h: 28}} size={22} tone="color/fill/gold">
          REQUIREMENT 1
        </Copy>

        <Panel box={stage} at={cue.differentiated} beat/>
        <FitBox
          text="DIFFERENTIATED COMPONENTS"
          x={stage.x + 32}
          y={stage.y + 24}
          size={30}
          weight={600}
          tag="REQ 1"
          startFrame={frame(cue.differentiated)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.specialized} box={{x: 1080, y: 232, w: 688, h: 30}} size={24} tone="color/text/soft">
          SPECIALIZED ROLES
        </Copy>

        <div style={{position: 'absolute', left: 400, top: 310, width: 1120, height: 92}}>
          <DrawRect box={{x: 0, y: 0, w: 1120, h: 92}} startFrame={frame(cue.population)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.population} box={{x: 28, y: 18, w: 1064, h: 34}} size={28}>
            POPULATION
          </Copy>
          <Copy at={cue.baseline} box={{x: 28, y: 56, w: 1064, h: 24}} size={20} tone="color/text/soft">
            BASELINE DIVISION
          </Copy>
        </div>

        <DrawLine
          points={[[960, 402], [960, 470]]}
          startFrame={frame(cue.division)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
          end="arrow"
          beat
        />

        <div style={{position: 'absolute', left: 180, top: 470, width: 700, height: 250}}>
          <DrawRect box={{x: 0, y: 0, w: 700, h: 250}} startFrame={frame(cue.inGroup)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <FitBox
            text="IN-GROUP"
            x={24}
            y={20}
            size={28}
            weight={600}
            tag="SIDE A"
            startFrame={frame(cue.inGroup)}
            durationFrames={14}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
          <StickFigure x={340} y={600} group="ingroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.inGroup)} durationFrames={18} beat/>
          <StickFigure x={480} y={600} group="ingroup" emphasis={0.7} scale={1.6} animate startFrame={frame(cue.inGroup)} durationFrames={18}/>
          <Copy at={cue.inGroup} box={{x: 208, y: 650, w: 644, h: 30}} size={24}>
            MEMBERSHIP SIDE
          </Copy>
          <Copy at={cue.roles} box={{x: 208, y: 686, w: 644, h: 28}} size={20} tone="color/text/soft">
            ONE SPECIALIZED ROLE
          </Copy>
        </div>

        <div style={{position: 'absolute', left: 1040, top: 470, width: 700, height: 250}}>
          <DrawRect box={{x: 0, y: 0, w: 700, h: 250}} startFrame={frame(cue.outGroup)} durationFrames={18} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <FitBox
            text="OUT-GROUP"
            x={24}
            y={20}
            size={28}
            weight={600}
            tag="SIDE B"
            startFrame={frame(cue.outGroup)}
            durationFrames={14}
            textToken="color/text/primary"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            accentToken="color/marker/race"
            beat
          />
          <StickFigure x={1300} y={600} group="outgroup" emphasis={1} scale={1.6} animate startFrame={frame(cue.outGroup)} durationFrames={18} beat/>
          <StickFigure x={1440} y={600} group="outgroup" emphasis={0.7} scale={1.6} animate startFrame={frame(cue.outGroup)} durationFrames={18}/>
          <Copy at={cue.outGroup} box={{x: 1068, y: 650, w: 644, h: 30}} size={24}>
            OUTSIDE SIDE
          </Copy>
          <Copy at={cue.roles} box={{x: 1068, y: 686, w: 644, h: 28}} size={20} tone="color/text/soft">
            THE OTHER SPECIALIZED ROLE
          </Copy>
        </div>

        <DrawLine
          points={[[880, 595], [1040, 595]]}
          startFrame={frame(cue.components)}
          durationFrames={14}
          strokeToken="color/line/hairline-strong"
          strokeWidth={3}
        />
        <Copy at={cue.components} box={{x: 872, y: 620, w: 176, h: 26}} size={18} tone="color/text/soft">
          PARTITION
        </Copy>

        <Copy at={cue.system} box={{x: 240, y: 792, w: 1440, h: 34}} size={26} tone="color/fill/gold">
          A SYSTEM BEGINS WITH PARTS THAT DIFFER
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
