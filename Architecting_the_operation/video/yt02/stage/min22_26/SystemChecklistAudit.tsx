import React from 'react';
import {BootIn, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div data-text="checklist-copy" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}>
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

export function SystemChecklistAudit({segment}: SceneProps) {
  const cue = {
    formal: useCue('t121Formal').at,
    fivePart: useCue('t121FivePart').at,
    checklist: useCue('t121Checklist').at,
    components: useCue('t121Components').at,
    policed: useCue('t121Policed').at,
    boundary: useCue('t121Boundary').at,
    inputs: useCue('t121Inputs').at,
    outputs: useCue('t121Outputs').at,
    objective: useCue('t121Objective').at,
    purpose: useCue('t121Purpose').at,
    stabilizing: useCue('t121Stabilizing').at,
    feedback: useCue('t121Feedback').at,
    loops: useCue('t121Loops').at,
    american: useCue('t122American').at,
    hierarchy: useCue('t122Hierarchy').at,
    audited: useCue('t122Audited').at,
    five: useCue('t122Five').at,
    requirements: useCue('t122Requirements').at,
    equations: useCue('t122Equations').at,
    diagrams: useCue('t122Diagrams').at,
    chapters: useCue('t122Chapters').at,
    ch0: useCue('t122Ch0').at,
    ch2: useCue('t122Ch2').at,
    ch4: useCue('t122Ch4').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const rows = [
    {y: 204, num: '1', label: 'IDENTIFIABLE COMPONENTS', detail: 'PARTS THAT CAN BE NAMED', at: cue.components, tag: 'PARTS'},
    {y: 328, num: '2', label: 'POLICED BOUNDARY', detail: 'AN EDGE THAT IS HELD', at: cue.boundary, tag: 'EDGE'},
    {y: 452, num: '3', label: 'DEFINED INPUTS & OUTPUTS', detail: 'WHAT CROSSES THE EDGE', at: cue.inputs, tag: 'FLOW'},
    {y: 576, num: '4', label: 'OBJECTIVE FUNCTION / PURPOSE', detail: 'WHAT THE SYSTEM HOLDS', at: cue.objective, tag: 'AIM'},
    {y: 700, num: '5', label: 'STABILIZING FEEDBACK LOOPS', detail: 'CORRECTION THAT HOLDS COURSE', at: cue.stabilizing, tag: 'LOOP'},
  ];

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.formal} beat/>
        <Copy at={cue.formal} box={{x: 154, y: 124, w: 1060, h: 36}} size={30}>
          FORMAL SYSTEM · FIVE-PART CHECKLIST
        </Copy>
        <Copy at={cue.fivePart} box={{x: 1240, y: 128, w: 520, h: 28}} size={22} tone="color/fill/gold">
          ENGINEERING STANDARD
        </Copy>

        {rows.map((row) => (
          <React.Fragment key={row.num}>
            <div style={{position: 'absolute', left: 120, top: row.y, width: 1180, height: 100}}>
              <DrawRect box={{x: 0, y: 0, w: 1180, h: 100}} startFrame={frame(row.at)} durationFrames={16} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
            </div>
            <FitBox
              text={row.num}
              x={148}
              y={row.y + 22}
              size={30}
              weight={600}
              tag={row.tag}
              startFrame={frame(row.at)}
              durationFrames={14}
              textToken="color/text/primary"
              strokeToken="color/fill/gold"
              fillToken="color/fill/panel-render"
              accentToken="color/fill/gold"
              beat
            />
            <Copy at={row.at} box={{x: 270, y: row.y + 18, w: 760, h: 32}} size={26}>
              {row.label}
            </Copy>
            <Copy at={row.at} box={{x: 270, y: row.y + 56, w: 760, h: 28}} size={20} tone="color/text/soft">
              {row.detail}
            </Copy>
            <div style={{position: 'absolute', left: 1080, top: row.y + 24, width: 52, height: 52}}>
              <DrawRect box={{x: 0, y: 0, w: 52, h: 52}} startFrame={frame(row.at)} durationFrames={12} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
            </div>
          </React.Fragment>
        ))}

        <div style={{position: 'absolute', left: 1340, top: 204, width: 460, height: 620}}>
          <DrawRect box={{x: 0, y: 0, w: 460, h: 620}} startFrame={frame(cue.audited)} durationFrames={20} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <FitBox
            text="AUDIT"
            x={1368}
            y={226}
            size={28}
            weight={600}
            tag="TEST"
            startFrame={frame(cue.audited)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
          <Copy at={cue.american} box={{x: 1368, y: 292, w: 404, h: 68}} size={26}>
            AMERICAN RACIAL HIERARCHY
          </Copy>
          <Copy at={cue.hierarchy} box={{x: 1368, y: 368, w: 404, h: 32}} size={22} tone="color/text/soft">
            AUDITED REQUIREMENT BY REQUIREMENT
          </Copy>
          <Copy at={cue.five} box={{x: 1368, y: 424, w: 404, h: 30}} size={22} tone="color/fill/gold">
            FIVE REQUIREMENTS
          </Copy>
          <Copy at={cue.equations} box={{x: 1368, y: 462, w: 404, h: 30}} size={22}>
            EQUATIONS &amp; DIAGRAMS
          </Copy>
          <div style={{position: 'absolute', left: 1368, top: 516, width: 124, height: 64}}>
            <DrawRect box={{x: 0, y: 0, w: 124, h: 64}} startFrame={frame(cue.ch0)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
            <Copy at={cue.ch0} box={{x: 1382, y: 536, w: 96, h: 28}} size={24} tone="color/fill/gold">
              CH. 0
            </Copy>
          </div>
          <div style={{position: 'absolute', left: 1508, top: 516, width: 124, height: 64}}>
            <DrawRect box={{x: 0, y: 0, w: 124, h: 64}} startFrame={frame(cue.ch2)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
            <Copy at={cue.ch2} box={{x: 1522, y: 536, w: 96, h: 28}} size={24} tone="color/fill/gold">
              CH. 2
            </Copy>
          </div>
          <div style={{position: 'absolute', left: 1648, top: 516, width: 124, height: 64}}>
            <DrawRect box={{x: 0, y: 0, w: 124, h: 64}} startFrame={frame(cue.ch4)} durationFrames={14} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
            <Copy at={cue.ch4} box={{x: 1662, y: 536, w: 96, h: 28}} size={24} tone="color/fill/gold">
              CH. 4
            </Copy>
          </div>
          <Copy at={cue.chapters} box={{x: 1368, y: 600, w: 404, h: 52}} size={20} tone="color/text/soft">
            THE BOOK SUPPLIES THE EVIDENCE FOR EACH ROW
          </Copy>
          <Copy at={cue.requirements} box={{x: 1368, y: 664, w: 404, h: 52}} size={20} tone="color/fill/gold">
            EACH ROW IS CHECKED IN TURN
          </Copy>
          {rows.map((row, i) => (
            <Copy key={`check-${row.num}`} at={cue.audited} box={{x: 1092, y: row.y + 34, w: 28, h: 28}} size={24} tone="color/fill/gold">
              {i === 0 ? '✓' : '·'}
            </Copy>
          ))}
        </div>

        <Copy at={cue.loops} box={{x: 200, y: 848, w: 1520, h: 32}} size={24} tone="color/fill/gold">
          A SYSTEM HOLDS TOGETHER AS A CHECKED WHOLE
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
