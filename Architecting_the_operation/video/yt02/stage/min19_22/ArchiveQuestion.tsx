import React from 'react';
import {DrawLine, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Box, Copy, Scene, frame} from './shared';

export function ArchiveQuestion({segment}: SceneProps) {
  const c = {
    before: useCue('t103Before').at,
    archive: useCue('t103Archive').at,
    definitions: useCue('t103Definitions').at,
    direct: useCue('t103Direct').at,
    where: useCue('t103Where').at,
    antiBlack: useCue('t103AntiBlack').at,
    begin: useCue('t103Begin').at,
  };

  const leftCard = {x: 120, y: 220, w: 560, h: 630};
  const rightCard = {x: 780, y: 220, w: 1020, h: 630};

  return (
    <Scene segment={segment}>
      <Copy at={c.before} box={{x: 120, y: 105, w: 1100, h: 48}} size={34}>
        HISTORICAL ARCHIVE · ENTRY QUESTION
      </Copy>
      <Copy at={c.before} box={{x: 1400, y: 118, w: 360, h: 28}} size={20} tone="color/fill/gold" mono>
        CHAPTER TWO · EMPIRICAL TEST
      </Copy>

      {/* Left Card: Definitions from Segment 1 */}
      <Box box={leftCard} at={c.definitions} />
      <FitBox
        text="SEGMENT ONE"
        x={leftCard.x + 36}
        y={leftCard.y + 30}
        size={28}
        weight={600}
        tag="FOUNDATION"
        startFrame={frame(c.definitions)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.definitions} box={{x: leftCard.x + 36, y: leftCard.y + 115, w: 480, h: 30}} size={22} tone="color/fill/gold" mono>
        ANALYTICAL TAXONOMY
      </Copy>
      <Copy at={c.definitions} box={{x: leftCard.x + 36, y: leftCard.y + 165, w: 480, h: 40}} size={26}>
        1. COGNITIVE BIAS
      </Copy>
      <Copy at={c.definitions} box={{x: leftCard.x + 36, y: leftCard.y + 215, w: 480, h: 40}} size={26}>
        2. INTERPERSONAL PREJUDICE
      </Copy>
      <Copy at={c.definitions} box={{x: leftCard.x + 36, y: leftCard.y + 265, w: 480, h: 40}} size={26}>
        3. DISCRIMINATORY ACTIONS
      </Copy>
      <Copy at={c.definitions} box={{x: leftCard.x + 36, y: leftCard.y + 315, w: 480, h: 40}} size={26} tone="color/marker/race">
        4. RACISM (EXTRACTION)
      </Copy>
      <Copy at={c.archive} box={{x: leftCard.x + 36, y: leftCard.y + 390, w: 480, h: 56}} size={22} tone="color/text/soft">
        Precise definitions make the empirical question testable against archives.
      </Copy>
      <StickFigure
        x={leftCard.x + 380}
        y={leftCard.y + 490}
        group="neutral"
        emphasis={1}
        scale={0.75}
        animate
        startFrame={frame(c.definitions)}
        durationFrames={16}
      />

      {/* Leader line from definitions to question */}
      <DrawLine
        points={[[leftCard.x + leftCard.w, 480], [rightCard.x, 480]]}
        startFrame={frame(c.direct)}
        durationFrames={16}
        strokeToken="color/fill/gold"
        glowToken="color/fill/gold"
        strokeWidth={5}
        end="arrow"
        beat
      />

      {/* Right Card: The Direct Question */}
      <Box box={rightCard} at={c.direct} accent="color/marker/race" />
      <FitBox
        text="DIRECT QUESTION"
        x={rightCard.x + 36}
        y={rightCard.y + 30}
        size={28}
        weight={600}
        tag="HISTORICAL TEST"
        startFrame={frame(c.direct)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/marker/race"
        fillToken="color/fill/panel-render"
        accentToken="color/marker/race"
        beat
      />
      <Copy at={c.direct} box={{x: rightCard.x + 36, y: rightCard.y + 115, w: 800, h: 30}} size={22} tone="color/marker/race" mono>
        FORMAL INQUIRY POSED TO THE ARCHIVE
      </Copy>
      <Copy at={c.where} box={{x: rightCard.x + 36, y: rightCard.y + 180, w: 800, h: 64}} size={48}>
        WHERE AND WHEN
      </Copy>
      <Copy at={c.antiBlack} box={{x: rightCard.x + 36, y: rightCard.y + 260, w: 900, h: 56}} size={36}>
        DID ANTI-BLACK PHENOTYPICAL PREJUDICE
      </Copy>
      <Copy at={c.begin} box={{x: rightCard.x + 36, y: rightCard.y + 335, w: 800, h: 72}} size={58} tone="color/fill/gold">
        BEGIN?
      </Copy>

      <Copy at={c.begin} box={{x: rightCard.x + 36, y: rightCard.y + 445, w: 860, h: 32}} size={22} tone="color/fill/gold" mono>
        CHRONOLOGICAL ANCHOR: 1450s ATLANTIC TRANSITION
      </Copy>
      <Copy at={c.begin} box={{x: rightCard.x + 36, y: rightCard.y + 490, w: 860, h: 56}} size={24} tone="color/text/soft">
        Distinguishes pre-modern interpersonal scalars from state-backed institutional machinery.
      </Copy>

      {/* Bottom Takeaway */}
      <Copy at={c.begin} box={{x: 360, y: 915, w: 1200, h: 34}} size={25} tone="color/text/muted" mono>
        SEGMENT ONE DEFINITIONS UNLOCK THE HISTORICAL ARCHIVE
      </Copy>
    </Scene>
  );
}
