import React from 'react';
import {DrawLine, FitBox, useCue, type SceneProps} from '@stage';
import {Box, Copy, Scene, frame} from './shared';

export function TermSeparation({segment}: SceneProps) {
  const c = {
    separating: useCue('t104Separating').at,
    bias: useCue('t104Bias').at,
    prejudice: useCue('t104Prejudice').at,
    discrimination: useCue('t104Discrimination').at,
    racism: useCue('t104Racism').at,
    common: useCue('t104Common').at,
    folding: useCue('t105Folding').at,
    blurry: useCue('t105Blurry').at,
    ancient: useCue('t105Ancient').at,
    modern: useCue('t105Modern').at,
    holding: useCue('t106Holding').at,
    preModern: useCue('t106PreModern').at,
    scalars: useCue('t106Scalars').at,
    structural: useCue('t106Structural').at,
    legal: useCue('t106Legal').at,
    chattel: useCue('t106Chattel').at,
  };

  const termCards = [
    {label: 'BIAS', tag: 'TERM 1', at: c.bias, accent: 'color/fill/gold'},
    {label: 'PREJUDICE', tag: 'TERM 2', at: c.prejudice, accent: 'color/fill/gold'},
    {label: 'DISCRIMINATION', tag: 'TERM 3', at: c.discrimination, accent: 'color/fill/gold'},
    {label: 'RACISM', tag: 'TERM 4', at: c.racism, accent: 'color/marker/race'},
  ];

  const leftCard = {x: 120, y: 390, w: 780, h: 420};
  const rightCard = {x: 980, y: 390, w: 820, h: 420};
  const bottomCard = {x: 120, y: 840, w: 1680, h: 110};

  return (
    <Scene segment={segment}>
      <Copy at={c.separating} box={{x: 120, y: 105, w: 1100, h: 48}} size={34}>
        SEPARATING TERMS · HISTORICAL TEST
      </Copy>
      <Copy at={c.separating} box={{x: 1400, y: 118, w: 360, h: 28}} size={20} tone="color/fill/gold" mono>
        METHODOLOGICAL PRECISION
      </Copy>

      {/* Top 4 Term Cards */}
      {termCards.map((t, i) => {
        const b = {x: 120 + i * 430, y: 220, w: 390, h: 130};
        return (
          <React.Fragment key={t.label}>
            <Box box={b} at={t.at} accent={t.accent} />
            <FitBox
              text={t.label}
              x={b.x + 28}
              y={b.y + 26}
              size={t.label === 'DISCRIMINATION' ? 24 : 28}
              weight={600}
              tag={t.tag}
              startFrame={frame(t.at)}
              durationFrames={16}
              textToken="color/text/primary"
              strokeToken={t.accent}
              fillToken="color/fill/panel-render"
              accentToken={t.accent}
              beat
            />
          </React.Fragment>
        );
      })}

      {/* Turn 104-105: The Common Defense (Collapse / Blurred Word) */}
      <Box box={leftCard} at={c.common} accent="color/marker/race" />
      <FitBox
        text="COMMON DEFENSE"
        x={leftCard.x + 36}
        y={leftCard.y + 28}
        size={26}
        weight={600}
        tag="FALLACY"
        startFrame={frame(c.common)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/marker/race"
        fillToken="color/fill/panel-render"
        accentToken="color/marker/race"
        beat
      />
      <Copy at={c.common} box={{x: leftCard.x + 36, y: leftCard.y + 110, w: 700, h: 30}} size={22} tone="color/marker/race" mono>
        COLLAPSE OF ANALYTICAL DISTINCTIONS
      </Copy>
      <Copy at={c.folding} box={{x: leftCard.x + 36, y: leftCard.y + 160, w: 700, h: 42}} size={28}>
        FOLDS FOUR DISTINCT CONCEPTS INTO
      </Copy>
      <Copy at={c.blurry} box={{x: leftCard.x + 36, y: leftCard.y + 215, w: 700, h: 48}} size={36} tone="color/marker/race">
        “ONE BLURRY WORD”
      </Copy>
      <Copy at={c.ancient} box={{x: leftCard.x + 36, y: leftCard.y + 285, w: 700, h: 52}} size={24} tone="color/text/soft">
        Cites any ancient hostility to claim racial oppression has always been that way.
      </Copy>
      <Copy at={c.modern} box={{x: leftCard.x + 36, y: leftCard.y + 348, w: 700, h: 40}} size={24} tone="color/marker/race">
        → Treats modern racial extraction as timeless human nature.
      </Copy>

      {/* Turn 106: Term Separation Dismantles the Move */}
      <Box box={rightCard} at={c.holding} />
      <FitBox
        text="TERM SEPARATION"
        x={rightCard.x + 36}
        y={rightCard.y + 28}
        size={26}
        weight={600}
        tag="DISMANTLED"
        startFrame={frame(c.holding)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.holding} box={{x: rightCard.x + 36, y: rightCard.y + 110, w: 740, h: 30}} size={22} tone="color/fill/gold" mono>
        DISMANTLES THE DEFENSE IMMEDIATELY
      </Copy>
      <Copy at={c.preModern} box={{x: rightCard.x + 36, y: rightCard.y + 160, w: 740, h: 42}} size={28}>
        PRE-MODERN COLOR PREJUDICE
      </Copy>
      <Copy at={c.scalars} box={{x: rightCard.x + 36, y: rightCard.y + 215, w: 740, h: 48}} size={24} tone="color/text/soft">
        Shows interpersonal scalars existed early without state enforcement.
      </Copy>
      <Copy at={c.structural} box={{x: rightCard.x + 36, y: rightCard.y + 285, w: 740, h: 32}} size={22} tone="color/fill/gold" mono>
        LEAVES THE STRUCTURAL QUESTION OPEN:
      </Copy>
      <Copy at={c.legal} box={{x: rightCard.x + 36, y: rightCard.y + 335, w: 740, h: 54}} size={26}>
        When did Elite institutions build a legal machine?
      </Copy>

      {/* Bottom Summary Panel */}
      <Box box={bottomCard} at={c.legal} accent="color/line/hairline-strong" />
      <Copy at={c.legal} box={{x: bottomCard.x + 36, y: bottomCard.y + 22, w: 1600, h: 28}} size={20} tone="color/fill/gold" mono>
        THE CORE STRUCTURAL QUESTION
      </Copy>
      <Copy at={c.chattel} box={{x: bottomCard.x + 36, y: bottomCard.y + 58, w: 1600, h: 36}} size={26} tone="color/marker/race">
        WHEN WAS PHENOTYPE FIRST LOCKED TO PERMANENT HEREDITARY CHATTEL STATUS?
      </Copy>
    </Scene>
  );
}
