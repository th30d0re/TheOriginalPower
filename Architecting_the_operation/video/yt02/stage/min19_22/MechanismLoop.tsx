import React from 'react';
import {DrawLine, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Box, Copy, Scene, frame} from './shared';

export function MechanismLoop({segment}: SceneProps) {
  const c = {
    figure: useCue('t98Figure').at,
    complete: useCue('t98Complete').at,
    elite: useCue('t98Elite').at,
    systemic: useCue('t98Systemic').at,
    interpersonal: useCue('t98Interpersonal').at,
    curving: useCue('t99Curving').at,
    dashed: useCue('t99Dashed').at,
    feedback: useCue('t99Feedback').at,
    laws: useCue('t100Laws').at,
    manufactured: useCue('t100Manufactured').at,
    subordinated: useCue('t100Subordinated').at,
    cultivated: useCue('t100Cultivated').at,
    stabilize: useCue('t100Stabilize').at,
  };

  const cards = [
    {x: 120, y: 240, w: 460, h: 220},
    {x: 730, y: 240, w: 460, h: 220},
    {x: 1340, y: 240, w: 460, h: 220},
  ];

  return (
    <Scene segment={segment}>
      <Copy at={c.figure} box={{x: 120, y: 105, w: 1100, h: 48}} size={34}>
        FIGURE 2.2 · COMPLETE MECHANISM
      </Copy>
      <Copy at={c.complete} box={{x: 1400, y: 118, w: 360, h: 28}} size={20} tone="color/fill/gold" mono>
        GENERATIVE CHAIN
      </Copy>

      {/* Node 1: Elite Economic Interests */}
      <Box box={cards[0]} at={c.elite} />
      <FitBox
        text="NODE 1"
        x={cards[0].x + 32}
        y={cards[0].y + 26}
        size={24}
        weight={600}
        tag="GENERATIVE"
        startFrame={frame(c.elite)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.elite} box={{x: cards[0].x + 36, y: cards[0].y + 95, w: 390, h: 42}} size={32}>
        ELITE ECONOMIC
      </Copy>
      <Copy at={c.elite} box={{x: cards[0].x + 36, y: cards[0].y + 145, w: 390, h: 42}} size={32}>
        INTERESTS
      </Copy>

      {/* Node 2: Systemic Racialization */}
      <Box box={cards[1]} at={c.systemic} accent="color/marker/race" />
      <FitBox
        text="NODE 2"
        x={cards[1].x + 32}
        y={cards[1].y + 26}
        size={24}
        weight={600}
        tag="INSTITUTIONAL"
        startFrame={frame(c.systemic)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/marker/race"
        fillToken="color/fill/panel-render"
        accentToken="color/marker/race"
        beat
      />
      <Copy at={c.systemic} box={{x: cards[1].x + 36, y: cards[1].y + 95, w: 390, h: 42}} size={32}>
        SYSTEMIC
      </Copy>
      <Copy at={c.systemic} box={{x: cards[1].x + 36, y: cards[1].y + 145, w: 390, h: 42}} size={32}>
        RACIALIZATION
      </Copy>

      {/* Node 3: Interpersonal Prejudice */}
      <Box box={cards[2]} at={c.interpersonal} />
      <FitBox
        text="NODE 3"
        x={cards[2].x + 32}
        y={cards[2].y + 26}
        size={24}
        weight={600}
        tag="DOWNSTREAM"
        startFrame={frame(c.interpersonal)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.interpersonal} box={{x: cards[2].x + 36, y: cards[2].y + 95, w: 300, h: 42}} size={32}>
        INTERPERSONAL
      </Copy>
      <Copy at={c.interpersonal} box={{x: cards[2].x + 36, y: cards[2].y + 145, w: 300, h: 42}} size={32}>
        PREJUDICE
      </Copy>
      <StickFigure
        x={cards[2].x + 375}
        y={cards[2].y + 145}
        group="neutral"
        emphasis={1}
        scale={0.7}
        animate
        startFrame={frame(c.interpersonal)}
        durationFrames={16}
      />

      {/* Solid Forward Arrows */}
      <DrawLine
        points={[[580, 350], [730, 350]]}
        startFrame={frame(c.systemic)}
        durationFrames={18}
        strokeToken="color/fill/gold"
        glowToken="color/fill/gold"
        strokeWidth={6}
        end="arrow"
        beat
      />
      <DrawLine
        points={[[1190, 350], [1340, 350]]}
        startFrame={frame(c.interpersonal)}
        durationFrames={18}
        strokeToken="color/fill/gold"
        glowToken="color/fill/gold"
        strokeWidth={6}
        end="arrow"
        beat
      />

      {/* Turn 99: Dashed Feedback Loop */}
      <DrawLine
        points={[[1570, 460], [1570, 560], [960, 560], [960, 460]]}
        startFrame={frame(c.curving)}
        durationFrames={25}
        strokeToken="color/marker/race"
        glowToken="color/marker/race"
        strokeWidth={5}
        dash="12 10"
        end="arrow"
        beat
      />
      <Copy at={c.feedback} box={{x: 1040, y: 580, w: 480, h: 32}} size={22} tone="color/marker/race" mono>
        REINFORCING FEEDBACK LOOP
      </Copy>

      {/* Turn 100: Institutional Inputs & Stabilization */}
      <Box box={{x: 120, y: 660, w: 780, h: 200}} at={c.laws} accent="color/line/hairline-strong" />
      <FitBox
        text="INSTITUTIONAL INPUTS"
        x={154}
        y={685}
        size={22}
        weight={600}
        tag="STATE"
        startFrame={frame(c.laws)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/line/hairline-strong"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
      />
      <Copy at={c.laws} box={{x: 156, y: 745, w: 720, h: 34}} size={25}>
        LAWS · LABOR DIVISIONS · STATE PROPAGANDA
      </Copy>
      <Copy at={c.manufactured} box={{x: 156, y: 795, w: 720, h: 26}} size={21} tone="color/text/soft" mono>
        MANUFACTURES RACIAL CATEGORIES
      </Copy>

      <Box box={{x: 980, y: 660, w: 820, h: 200}} at={c.subordinated} accent="color/marker/race" />
      <FitBox
        text="FEEDBACK DYNAMICS"
        x={1014}
        y={685}
        size={22}
        weight={600}
        tag="LOOP"
        startFrame={frame(c.subordinated)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/marker/race"
        fillToken="color/fill/panel-render"
        accentToken="color/marker/race"
      />
      <Copy at={c.subordinated} box={{x: 1016, y: 745, w: 760, h: 34}} size={25} tone="color/marker/race">
        FORCES GROUP INTO SUBORDINATED POSITION
      </Copy>
      <Copy at={c.cultivated} box={{x: 1016, y: 795, w: 760, h: 26}} size={21} tone="color/fill/gold" mono>
        CULTIVATED PREJUDICE FEEDS BACK
      </Copy>

      <Copy at={c.stabilize} box={{x: 360, y: 915, w: 1200, h: 34}} size={25} tone="color/fill/gold" mono>
        STABILIZES AND JUSTIFIES THE INSTITUTIONAL ARRANGEMENT
      </Copy>
    </Scene>
  );
}
