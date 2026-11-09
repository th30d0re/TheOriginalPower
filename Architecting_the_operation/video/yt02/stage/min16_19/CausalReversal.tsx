import React from 'react';
import {EquationTerms} from '../equations';
import {Arrow, Copy, FitBox, KitSound, Panel, StageSceneFrame, StickFigure, frame, type SceneProps} from './shared';
import {useCue, useStageMs} from '@stage';

export function CausalReversal({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    replace: useCue('t95Replace').at,
    arrow: useCue('t95Arrow').at,
    six: useCue('t95Six').at,
    reversal: useCue('t95Reversal').at,
    tier: useCue('t96Tier').at,
    tested: useCue('t96Tested').at,
    sequence: useCue('t97Sequence').at,
    elite: useCue('t97Elite').at,
    racialization: useCue('t97Racialization').at,
    prejudice: useCue('t97Prejudice').at,
  };
  const boxes = [
    {x: 120, y: 440, w: 500, h: 230},
    {x: 710, y: 440, w: 500, h: 230},
    {x: 1300, y: 440, w: 500, h: 230},
  ];

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={{x: 120, y: 96, w: 1680, h: 120}} at={c.replace} accent="color/marker/race" />
        <Copy at={c.replace} box={{x: 155, y: 135, w: 1000, h: 36}} size={30}>
          REPLACE Eq. 2.5 · DO NOT PATCH IT
        </Copy>
        <FitBox
          text="EQUATION 2.6"
          x={1320}
          y={120}
          size={30}
          weight={600}
          tag="CAUSAL REVERSAL"
          startFrame={frame(c.six)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />

        <Copy at={c.reversal} box={{x: 120, y: 245, w: 1680, h: 38}} size={32} align="center" tone="color/marker/race">
          THE CAUSAL REVERSAL THAT GOVERNS THE BOOK
        </Copy>
        <Copy at={c.tier} box={{x: 120, y: 295, w: 1680, h: 26}} size={21} align="center" tone="color/text/soft">
          CONFIDENCE TIER 3 · STRUCTURAL EQUATION
        </Copy>
        <Copy at={c.tested} box={{x: 120, y: 330, w: 1680, h: 24}} size={19} align="center" tone="color/text/soft">
          FORMAL CLAIM TESTABLE AGAINST HISTORICAL DATES
        </Copy>

        <Copy at={c.sequence} box={{x: 120, y: 385, w: 1680, h: 28}} size={22} align="center">
          THE HYPOTHESIS IN FULL
        </Copy>

        <Panel box={boxes[0]} at={c.elite} />
        <FitBox
          text="INTERESTS"
          x={150}
          y={465}
          size={22}
          weight={600}
          tag="CAUSE 01"
          startFrame={frame(c.elite)}
          beat
        />
        <Copy at={c.elite} box={{x: 150, y: 545, w: 440, h: 60}} size={28} align="center">
          ELITE ECONOMIC{'\n'}INTERESTS
        </Copy>

        <Arrow at={c.racialization} points={[[620, 555], [710, 555]]} red />

        <Panel box={boxes[1]} at={c.racialization} accent="color/marker/race" />
        <FitBox
          text="STRUCTURE"
          x={740}
          y={465}
          size={22}
          weight={600}
          tag="CAUSE 02"
          startFrame={frame(c.racialization)}
          strokeToken="color/marker/race"
          accentToken="color/marker/race"
          beat
        />
        <Copy at={c.racialization} box={{x: 740, y: 545, w: 440, h: 60}} size={28} align="center" tone="color/marker/race">
          SYSTEMIC{'\n'}RACIALIZATION
        </Copy>

        <Arrow at={c.prejudice} points={[[1210, 555], [1300, 555]]} />

        <Panel box={boxes[2]} at={c.prejudice} />
        <FitBox
          text="DOWNSTREAM"
          x={1330}
          y={465}
          size={22}
          weight={600}
          tag="OUTCOME"
          startFrame={frame(c.prejudice)}
          beat
        />
        <StickFigure x={1550} y={535} group="neutral" emphasis={1} scale={1.3} animate startFrame={frame(c.prejudice)} beat />
        <Copy at={c.prejudice} box={{x: 1330, y: 615, w: 440, h: 32}} size={26} align="center">
          INTERPERSONAL PREJUDICE
        </Copy>

        <Panel box={{x: 220, y: 710, w: 1480, h: 96}} at={c.sequence} />
        <EquationTerms
          equation="Eq. 2.6 · causal reversal"
          ms={ms}
          box={{x: 260, y: 738, w: 1400, h: 40}}
          fontSize={28}
          align="center"
          tokens={[
            {text: 'Elite Economic Interests'},
            {text: ' → '},
            {text: 'Systemic Racialization'},
            {text: ' → '},
            {text: 'Interpersonal Prejudice'},
          ]}
          pulses={{}}
        />
      </KitSound>
    </StageSceneFrame>
  );
}
