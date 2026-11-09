import React from 'react';
import {DrawLine, FitBox, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Box, Copy, Scene, frame} from './shared';

export function HypothesisGate({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    because: useCue('t110Because').at,
    equation: useCue('t110Equation').at,
    testable: useCue('t110Testable').at,
    generates: useCue('t110Generates').at,
    four: useCue('t110Four').at,
    three: useCue('t110Three').at,
    refutation: useCue('t110Refutation').at,
    historical: useCue('t110Historical').at,
    files: useCue('t110Files').at,
  };

  const topCard = {x: 120, y: 210, w: 1680, h: 160};
  const leftCard = {x: 120, y: 400, w: 780, h: 430};
  const rightCard = {x: 980, y: 400, w: 820, h: 430};
  const bottomCard = {x: 120, y: 860, w: 1680, h: 100};

  return (
    <Scene segment={segment}>
      <Copy at={c.because} box={{x: 120, y: 105, w: 1100, h: 48}} size={34}>
        TESTABLE HYPOTHESIS · BEFORE THE CASE FILES
      </Copy>
      <Copy at={c.because} box={{x: 1400, y: 118, w: 360, h: 28}} size={20} tone="color/fill/gold" mono>
        EPISTEMIC GATE
      </Copy>

      {/* Top Card: Equation 2.6 as Testable Hypothesis */}
      <Box box={topCard} at={c.equation} />
      <FitBox
        text="EQUATION 2.6"
        x={topCard.x + 36}
        y={topCard.y + 24}
        size={28}
        weight={600}
        tag="HYPOTHESIS"
        startFrame={frame(c.equation)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <EquationTerms
        equation="Eq. 2.6 · Elite Causal Arrow"
        ms={ms}
        box={{x: 460, y: topCard.y + 24, w: 1300, h: 54}}
        fontSize={25}
        tokens={[
          {text: 'Elite Economic Interests'},
          {text: ' → '},
          {text: 'Systemic Racialization'},
          {text: ' → '},
          {text: 'Interpersonal Prejudice'},
        ]}
        pulses={{}}
      />
      <Copy at={c.testable} box={{x: 460, y: topCard.y + 95, w: 1300, h: 28}} size={20} tone="color/text/muted" mono>
        FORMAL HYPOTHESIS · CRITERIA STATED BEFORE OPENING THE HISTORICAL ARCHIVE
      </Copy>

      {/* Left Card: Four Concrete Predictions */}
      <Box box={leftCard} at={c.four} />
      <FitBox
        text="FOUR PREDICTIONS"
        x={leftCard.x + 36}
        y={leftCard.y + 26}
        size={26}
        weight={600}
        tag="CONCRETE"
        startFrame={frame(c.four)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.generates} box={{x: leftCard.x + 36, y: leftCard.y + 105, w: 700, h: 28}} size={20} tone="color/fill/gold" mono>
        GENERATES CONCRETE HISTORICAL EXPECTATIONS:
      </Copy>
      <Copy at={c.four} box={{x: leftCard.x + 36, y: leftCard.y + 145, w: 700, h: 46}} size={22}>
        1. Economic extraction precedes racialized legal statutes.
      </Copy>
      <Copy at={c.four} box={{x: leftCard.x + 36, y: leftCard.y + 200, w: 700, h: 46}} size={22}>
        2. Phenotypical categories codify during acute labor crises.
      </Copy>
      <Copy at={c.four} box={{x: leftCard.x + 36, y: leftCard.y + 255, w: 700, h: 46}} size={22}>
        3. Interpersonal prejudice is cultivated to stabilize elite policy.
      </Copy>
      <Copy at={c.four} box={{x: leftCard.x + 36, y: leftCard.y + 310, w: 700, h: 46}} size={22}>
        4. Institutional extraction persists across statutory resets.
      </Copy>
      <Copy at={c.four} box={{x: leftCard.x + 36, y: leftCard.y + 375, w: 700, h: 28}} size={19} tone="color/text/soft" mono>
        PRE-REGISTERED HISTORICAL PREDICTIONS
      </Copy>

      {/* Leader line between predictions and refutations */}
      <DrawLine
        points={[[leftCard.x + leftCard.w, 615], [rightCard.x, 615]]}
        startFrame={frame(c.three)}
        durationFrames={16}
        strokeToken="color/fill/gold"
        strokeWidth={4}
        end="arrow"
        beat
      />

      {/* Right Card: Three Explicit Refutation Standards */}
      <Box box={rightCard} at={c.three} accent="color/marker/race" />
      <FitBox
        text="THREE REFUTATIONS"
        x={rightCard.x + 36}
        y={rightCard.y + 26}
        size={26}
        weight={600}
        tag="FALSIFICATION"
        startFrame={frame(c.three)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/marker/race"
        fillToken="color/fill/panel-render"
        accentToken="color/marker/race"
        beat
      />
      <Copy at={c.three} box={{x: rightCard.x + 36, y: rightCard.y + 105, w: 740, h: 28}} size={20} tone="color/marker/race" mono>
        EXPLICIT STANDARDS FOR MODEL FAILURE:
      </Copy>
      <Copy at={c.refutation} box={{x: rightCard.x + 36, y: rightCard.y + 145, w: 740, h: 46}} size={22}>
        1. Spontaneous mass prejudice prior to elite economic design.
      </Copy>
      <Copy at={c.refutation} box={{x: rightCard.x + 36, y: rightCard.y + 200, w: 740, h: 46}} size={22}>
        2. Legal machinery established without elite extraction motive.
      </Copy>
      <Copy at={c.refutation} box={{x: rightCard.x + 36, y: rightCard.y + 255, w: 740, h: 46}} size={22}>
        3. Elimination of personal bias dismantling systemic extraction.
      </Copy>
      <Copy at={c.refutation} box={{x: rightCard.x + 36, y: rightCard.y + 375, w: 740, h: 28}} size={19} tone="color/text/soft" mono>
        MODEL FAILS IF ANY REFUTATION CRITERION HOLDS
      </Copy>

      {/* Bottom Summary: Open Case Files */}
      <Box box={bottomCard} at={c.historical} accent="color/line/hairline-strong" />
      <Copy at={c.historical} box={{x: bottomCard.x + 36, y: bottomCard.y + 18, w: 1600, h: 36}} size={26} tone="color/fill/gold">
        OPEN THE HISTORICAL CASE FILES
      </Copy>
      <Copy at={c.files} box={{x: bottomCard.x + 36, y: bottomCard.y + 58, w: 1600, h: 28}} size={20} tone="color/text/muted" mono>
        PORTUGUESE ATLANTIC EXTRACTION (1450s) · VIRGINIA CHATTEL CODIFICATION (1660s–1705)
      </Copy>
    </Scene>
  );
}
