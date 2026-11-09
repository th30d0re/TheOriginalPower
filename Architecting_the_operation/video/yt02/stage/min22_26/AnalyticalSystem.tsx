import React from 'react';
import {BootIn, DefinitionCard, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, cubicOut, progress, useCue, useStageMs, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="anasys-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function AnalyticalSystem({segment}: SceneProps) {
  const ms = useStageMs();
  const cue = {
    strict: useCue('t120Strict').at,
    analytical: useCue('t120Analytical').at,
    system: useCue('t120System').at,
    bounded: useCue('t120Bounded').at,
    feedback: useCue('t120Feedback').at,
    machine: useCue('t120Machine').at,
    measurable: useCue('t120Measurable').at,
    variables: useCue('t120Variables').at,
    governing: useCue('t120Governing').at,
    equations: useCue('t120Equations').at,
    working: useCue('t120Working').at,
    apparatus: useCue('t120Apparatus').at,
    inputs: useCue('t120Inputs').at,
    internal: useCue('t120Internal').at,
    parts: useCue('t120Parts').at,
    outputs: useCue('t120Outputs').at,
    tracked: useCue('t120Tracked').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const defPanel = {x: 120, y: 204, w: 1680, h: 210};
  const machine = {x: 520, y: 470, w: 880, h: 300};
  const definitionProgress = cubicOut(progress(ms, cue.bounded, cue.bounded + 500));

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.strict} beat/>
        <Copy at={cue.strict} box={{x: 154, y: 124, w: 1060, h: 36}} size={30}>
          SYSTEM · STRICT ANALYTICAL USAGE
        </Copy>
        <Copy at={cue.analytical} box={{x: 1240, y: 128, w: 520, h: 28}} size={22} tone="color/fill/gold">
          DEFINITION
        </Copy>

        <Panel box={defPanel} at={cue.system} beat/>
        <Flicker startFrame={frame(cue.bounded)} durationFrames={16} beat>
          <div style={{position: 'absolute', left: defPanel.x, top: defPanel.y, width: defPanel.w, height: defPanel.h}}>
            <DefinitionCard term="SYSTEM" definition="A bounded, feedback-regulated machine with measurable variables and governing equations." source="ANALYTICAL USAGE · TURN 120" paraphrased progress={definitionProgress} accent="color/fill/gold"/>
          </div>
        </Flicker>

        <div style={{position: 'absolute', left: 120, top: 540, width: 320, height: 170}}>
          <DrawRect box={{x: 0, y: 0, w: 320, h: 170}} startFrame={frame(cue.inputs)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <FitBox
            text="INPUTS"
            x={20}
            y={20}
            size={26}
            weight={600}
            tag="IN"
            startFrame={frame(cue.inputs)}
            durationFrames={14}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
          <Copy at={cue.inputs} box={{x: 20, y: 106, w: 280, h: 44}} size={20} tone="color/text/soft">
            WHAT ENTERS
          </Copy>
        </div>

        <Panel box={machine} at={cue.apparatus} accent="color/fill/gold" beat/>
        <FitBox
          text="WORKING APPARATUS"
          x={machine.x + 28}
          y={machine.y + 22}
          size={28}
          weight={600}
          tag="BOUNDED"
          startFrame={frame(cue.apparatus)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <div style={{position: 'absolute', left: machine.x + 28, top: machine.y + 90, width: 392, height: 92}}>
          <DrawRect box={{x: 0, y: 0, w: 392, h: 92}} startFrame={frame(cue.measurable)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.measurable} box={{x: 18, y: 18, w: 356, h: 28}} size={22}>
            MEASURABLE VARIABLES
          </Copy>
          <Copy at={cue.variables} box={{x: 18, y: 52, w: 356, h: 26}} size={20} tone="color/text/soft">
            VALUES THAT CAN BE READ
          </Copy>
        </div>
        <div style={{position: 'absolute', left: machine.x + 460, top: machine.y + 90, width: 392, height: 92}}>
          <DrawRect box={{x: 0, y: 0, w: 392, h: 92}} startFrame={frame(cue.governing)} durationFrames={14} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <Copy at={cue.governing} box={{x: 18, y: 18, w: 356, h: 28}} size={22}>
            GOVERNING EQUATIONS
          </Copy>
          <Copy at={cue.equations} box={{x: 18, y: 52, w: 356, h: 26}} size={20} tone="color/text/soft">
            RULES THAT BIND THE PARTS
          </Copy>
        </div>
        <Copy at={cue.internal} box={{x: machine.x + 28, y: machine.y + 206, w: 824, h: 32}} size={24}>
          INTERNAL PARTS
        </Copy>
        <Copy at={cue.parts} box={{x: machine.x + 28, y: machine.y + 244, w: 824, h: 28}} size={20} tone="color/text/soft">
          THE WORKING INSIDE OF THE BOUNDARY
        </Copy>

        <div style={{position: 'absolute', left: 1480, top: 540, width: 320, height: 170}}>
          <DrawRect box={{x: 0, y: 0, w: 320, h: 170}} startFrame={frame(cue.outputs)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <FitBox
            text="OUTPUTS"
            x={20}
            y={20}
            size={26}
            weight={600}
            tag="OUT"
            startFrame={frame(cue.outputs)}
            durationFrames={14}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
          <Copy at={cue.outputs} box={{x: 20, y: 106, w: 280, h: 44}} size={20} tone="color/text/soft">
            WHAT LEAVES
          </Copy>
        </div>

        <DrawLine
          points={[[440, 625], [520, 625]]}
          startFrame={frame(cue.inputs)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
          end="arrow"
          beat
        />
        <DrawLine
          points={[[1400, 625], [1480, 625]]}
          startFrame={frame(cue.outputs)}
          durationFrames={14}
          strokeToken="color/fill/gold"
          glowToken="color/fill/gold"
          strokeWidth={5}
          end="arrow"
          beat
        />
        <DrawLine
          points={[[1400, 740], [1400, 804], [520, 804], [520, 770]]}
          startFrame={frame(cue.feedback)}
          durationFrames={20}
          strokeToken="color/marker/race"
          glowToken="color/marker/race"
          strokeWidth={4}
          end="arrow"
          beat
        />
        <Copy at={cue.feedback} box={{x: 820, y: 778, w: 280, h: 26}} size={20} tone="color/marker/race">
          FEEDBACK LOOP
        </Copy>

        <Copy at={cue.tracked} box={{x: 280, y: 858, w: 1360, h: 34}} size={26} tone="color/fill/gold">
          INPUTS, PARTS, AND OUTPUTS CAN BE TRACKED
        </Copy>
        <Copy at={cue.working} box={{x: 148, y: 474, w: 320, h: 28}} size={20} tone="color/text/soft">
          A WORKING APPARATUS
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
