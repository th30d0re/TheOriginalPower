import React from 'react';
import {DrawLine, FitBox, useCue, type SceneProps} from '@stage';
import {Box, Copy, Scene, frame} from './shared';

export function FieldsEvidence({segment}: SceneProps) {
  const c = {
    historian: useCue('t101Historian').at,
    barbara: useCue('t101Barbara').at,
    essay: useCue('t101Essay').at,
    page: useCue('t101Page').at,
    quotes: useCue('t102Quotes').at,
    people: useCue('t102People').at,
    inferior: useCue('t102Inferior').at,
    oppressed: useCue('t102Oppressed').at,
  };

  const leftCard = {x: 120, y: 220, w: 700, h: 630};
  const rightCard = {x: 900, y: 220, w: 900, h: 630};

  return (
    <Scene segment={segment}>
      <Copy at={c.historian} box={{x: 120, y: 105, w: 1100, h: 48}} size={34}>
        CAUSAL SEQUENCE · SOURCE RECORD
      </Copy>
      <Copy at={c.historian} box={{x: 1400, y: 118, w: 360, h: 28}} size={20} tone="color/fill/gold" mono>
        HISTORICAL ARCHIVE
      </Copy>

      {/* Turn 101: Barbara J. Fields Citation & Work */}
      <Box box={leftCard} at={c.barbara} />
      <FitBox
        text="BARBARA J. FIELDS"
        x={leftCard.x + 36}
        y={leftCard.y + 30}
        size={28}
        weight={600}
        tag="HISTORIAN"
        startFrame={frame(c.barbara)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.barbara} box={{x: leftCard.x + 36, y: leftCard.y + 115, w: 620, h: 64}} size={26} tone="color/text/soft">
        Historian of slavery, race, and ideology in the United States.
      </Copy>
      <Copy at={c.essay} box={{x: leftCard.x + 36, y: leftCard.y + 220, w: 620, h: 32}} size={22} tone="color/fill/gold" mono>
        FOUNDATIONAL ESSAY (1990)
      </Copy>
      <Copy at={c.essay} box={{x: leftCard.x + 36, y: leftCard.y + 270, w: 620, h: 72}} size={28}>
        SLAVERY, RACE AND IDEOLOGY IN THE UNITED STATES OF AMERICA
      </Copy>
      <Copy at={c.page} box={{x: leftCard.x + 36, y: leftCard.y + 380, w: 620, h: 32}} size={22} tone="color/text/muted" mono>
        NEW LEFT REVIEW 181 · PAGE 106
      </Copy>
      <Copy at={c.page} box={{x: leftCard.x + 36, y: leftCard.y + 440, w: 620, h: 64}} size={24} tone="color/text/soft">
        Documents that institutional oppression generates racial ideology, reversing the conventional causal arrow.
      </Copy>

      {/* Turn 102: Chapter 2 Verbatim Quotation */}
      <Box box={rightCard} at={c.quotes} accent="color/marker/race" />
      <FitBox
        text="CHAPTER 2"
        x={rightCard.x + 36}
        y={rightCard.y + 30}
        size={28}
        weight={600}
        tag="VERBATIM"
        startFrame={frame(c.quotes)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/marker/race"
        fillToken="color/fill/panel-render"
        accentToken="color/marker/race"
        beat
      />
      <Copy at={c.quotes} box={{x: rightCard.x + 36, y: rightCard.y + 115, w: 820, h: 30}} size={22} tone="color/marker/race" mono>
        EXACT QUOTATION FROM PAGE 106
      </Copy>
      <Copy at={c.people} box={{x: rightCard.x + 36, y: rightCard.y + 180, w: 820, h: 54}} size={36}>
        “People are more readily perceived
      </Copy>
      <Copy at={c.people} box={{x: rightCard.x + 36, y: rightCard.y + 245, w: 820, h: 54}} size={36}>
        as inferior by nature
      </Copy>
      <Copy at={c.inferior} box={{x: rightCard.x + 36, y: rightCard.y + 325, w: 820, h: 48}} size={32} tone="color/text/soft">
        when they are already seen as
      </Copy>
      <Copy at={c.oppressed} box={{x: rightCard.x + 36, y: rightCard.y + 385, w: 820, h: 56}} size={46} tone="color/fill/gold">
        oppressed.”
      </Copy>

      <DrawLine
        points={[[rightCard.x + 36, rightCard.y + 490], [rightCard.x + 820, rightCard.y + 490]]}
        startFrame={frame(c.oppressed)}
        durationFrames={18}
        strokeToken="color/fill/gold"
        glowToken="color/fill/gold"
        strokeWidth={4}
        end="arrow"
        beat
      />
      <Copy at={c.oppressed} box={{x: rightCard.x + 36, y: rightCard.y + 520, w: 820, h: 32}} size={24} tone="color/fill/gold" mono>
        OPPRESSION PRECEDES NATURALIZED INFERIORITY
      </Copy>
      <Copy at={c.oppressed} box={{x: rightCard.x + 36, y: rightCard.y + 565, w: 820, h: 32}} size={22} tone="color/text/soft">
        Systemic subjugation is the prerequisite, not the consequence.
      </Copy>

      {/* Bottom Takeaway */}
      <Copy at={c.oppressed} box={{x: 360, y: 915, w: 1200, h: 34}} size={25} tone="color/fill/gold" mono>
        VALIDATES CAUSAL REVERSAL · EQUATION 2.6
      </Copy>
    </Scene>
  );
}
