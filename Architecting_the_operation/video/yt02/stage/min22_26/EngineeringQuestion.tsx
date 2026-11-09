import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="engq-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function EngineeringQuestion({segment}: SceneProps) {
  const cue = {
    why: useCue('t119Why').at,
    engineering: useCue('t119Engineering').at,
    checklist: useCue('t119Checklist').at,
    social: useCue('t119Social').at,
    definition: useCue('t119Definition').at,
    calling: useCue('t119Calling').at,
    system: useCue('t119System').at,
    requires: useCue('t119Requires').at,
    working: useCue('t119Working').at,
    parts: useCue('t119Parts').at,
    formal: useCue('t119Formal').at,
    theory: useCue('t119Theory').at,
  };

  const question = {x: 120, y: 104, w: 1680, h: 110};
  const left = {x: 120, y: 250, w: 760, h: 500};
  const right = {x: 1040, y: 250, w: 760, h: 500};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={question} at={cue.why} beat/>
        <Copy at={cue.why} box={{x: 154, y: 138, w: 1612, h: 48}} size={36}>
          WHY USE AN ENGINEERING CHECKLIST TO TEST A SOCIAL DEFINITION?
        </Copy>

        <Panel box={left} at={cue.engineering} beat/>
        <FitBox
          text="SOCIAL DEFINITION"
          x={left.x + 32}
          y={left.y + 30}
          size={30}
          weight={600}
          tag="UNDER TEST"
          startFrame={frame(cue.social)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.calling} box={{x: left.x + 32, y: left.y + 124, w: 696, h: 68}} size={30}>
          CALLING RACISM A SYSTEM
        </Copy>
        <Copy at={cue.definition} box={{x: left.x + 32, y: left.y + 208, w: 696, h: 90}} size={22} tone="color/text/soft">
          THE WORD CARRIES A CLAIM ABOUT HOW THE THING IS BUILT
        </Copy>
        <div style={{position: 'absolute', left: left.x + 32, top: left.y + 330, width: 696, height: 120}}>
          <DrawRect box={{x: 0, y: 0, w: 696, h: 120}} startFrame={frame(cue.checklist)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.checklist} box={{x: left.x + 52, y: left.y + 354, w: 656, h: 30}} size={24}>
            ENGINEERING CHECKLIST AS THE TEST
          </Copy>
          <Copy at={cue.checklist} box={{x: left.x + 52, y: left.y + 392, w: 656, h: 44}} size={20} tone="color/text/soft">
            A DEFINITION EARNS THE WORD OR IT DOES NOT
          </Copy>
        </div>

        <DrawLine
          points={[[880, 500], [1040, 500]]}
          startFrame={frame(cue.requires)}
          durationFrames={16}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={6}
          end="arrow"
          beat
        />
        <Copy at={cue.requires} box={{x: 862, y: 524, w: 196, h: 28}} size={20} tone="color/fill/gold">
          REQUIRES
        </Copy>

        <Panel box={right} at={cue.formal} accent="color/fill/gold" beat/>
        <FitBox
          text="FORMAL SYSTEM"
          x={right.x + 32}
          y={right.y + 30}
          size={30}
          weight={600}
          tag="STANDARD"
          startFrame={frame(cue.formal)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.working} box={{x: right.x + 32, y: right.y + 124, w: 696, h: 68}} size={30}>
          SHOW THE WORKING PARTS
        </Copy>
        <Copy at={cue.parts} box={{x: right.x + 32, y: right.y + 208, w: 696, h: 90}} size={22} tone="color/text/soft">
          THE CLAIM HOLDS ONLY IF THE PARTS ARE THERE TO BE SHOWN
        </Copy>
        <div style={{position: 'absolute', left: right.x + 32, top: right.y + 330, width: 696, height: 120}}>
          <DrawRect box={{x: 0, y: 0, w: 696, h: 120}} startFrame={frame(cue.system)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.system} box={{x: right.x + 52, y: right.y + 354, w: 656, h: 30}} size={24} tone="color/fill/gold">
            IN ENGINEERING &amp; SYSTEMS THEORY
          </Copy>
          <Copy at={cue.theory} box={{x: right.x + 52, y: right.y + 392, w: 656, h: 44}} size={20} tone="color/text/soft">
            THE FORMAL MEANING SETS THE BAR
          </Copy>
        </div>

        <Copy at={cue.theory} box={{x: 300, y: 792, w: 1320, h: 34}} size={26} tone="color/fill/gold">
          THE WORD SYSTEM MUST BE EARNED
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
