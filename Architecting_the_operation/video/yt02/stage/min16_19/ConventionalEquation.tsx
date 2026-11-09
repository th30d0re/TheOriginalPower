import React from 'react';
import {DefinitionCard, useCue, useStageMs} from '@stage';
import {EquationTerms} from '../equations';
import {Arrow, Copy, FitBox, KitSound, Panel, StageSceneFrame, StickFigure, frame, type SceneProps} from './shared';

export function ConventionalEquation({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {
    taxonomy: useCue('t83Taxonomy').at,
    tier: useCue('t83Tier').at,
    structural: useCue('t83Structural').at,
    tested: useCue('t83Tested').at,
    read: useCue('t84Read').at,
    prejudice: useCue('t84Prejudice').at,
    actions: useCue('t84Actions').at,
    outcomes: useCue('t84Outcomes').at,
  };
  const boxes = [
    {x: 150, y: 435, w: 430, h: 230},
    {x: 745, y: 435, w: 430, h: 230},
    {x: 1340, y: 435, w: 430, h: 230},
  ];

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={{x: 120, y: 96, w: 1680, h: 250}} at={c.taxonomy} />
        <div style={{position: 'absolute', left: 140, top: 104, width: 1020, height: 234}}>
          <DefinitionCard
            term="CONFIDENCE TIER 3"
            definition="Ordinal and structural equation: a formal claim with a direction that can be tested against historical order."
            source="EMPIRICAL METHODOLOGY · Eq. 2.5"
            paraphrased
            progress={ms >= c.tier ? 1 : 0}
            accent="color/fill/gold"
          />
        </div>
        <FitBox
          text="EQUATION 2.5"
          x={1260}
          y={130}
          size={34}
          weight={600}
          tag="EMPIRICAL TAXONOMY"
          startFrame={frame(c.structural)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={c.tested} box={{x: 1200, y: 230, w: 560, h: 34}} size={22} tone="color/text/soft" align="center">
          TESTABLE AGAINST HISTORICAL ORDER
        </Copy>

        <Copy at={c.read} box={{x: 150, y: 370, w: 1620, h: 44}} size={32} align="center">
          READ LEFT TO RIGHT · THE CONVENTIONAL CAUSAL STORY
        </Copy>

        <Panel box={boxes[0]} at={c.prejudice} accent="color/marker/race" />
        <FitBox
          text="INPUT NODE"
          x={170}
          y={455}
          size={20}
          weight={600}
          tag="TERM 01"
          startFrame={frame(c.prejudice)}
          strokeToken="color/marker/race"
          accentToken="color/marker/race"
          beat
        />
        <StickFigure x={365} y={520} group="neutral" emphasis={1} scale={1.2} animate startFrame={frame(c.prejudice)} beat />
        <Copy at={c.prejudice} box={{x: 185, y: 595, w: 360, h: 54}} size={28} align="center" tone="color/marker/race">
          INDIVIDUAL PREJUDICE
        </Copy>

        <Arrow at={c.actions} points={[[580, 550], [745, 550]]} />

        <Panel box={boxes[1]} at={c.actions} />
        <FitBox
          text="ACTION NODE"
          x={765}
          y={455}
          size={20}
          weight={600}
          tag="TERM 02"
          startFrame={frame(c.actions)}
          beat
        />
        <Copy at={c.actions} box={{x: 780, y: 535, w: 360, h: 90}} size={28} align="center">
          DISCRIMINATORY{'\n'}ACTIONS
        </Copy>

        <Arrow at={c.outcomes} points={[[1175, 550], [1340, 550]]} />

        <Panel box={boxes[2]} at={c.outcomes} />
        <FitBox
          text="OUTCOME NODE"
          x={1360}
          y={455}
          size={20}
          weight={600}
          tag="TERM 03"
          startFrame={frame(c.outcomes)}
          beat
        />
        <Copy at={c.outcomes} box={{x: 1375, y: 535, w: 360, h: 90}} size={28} align="center">
          SYSTEMIC{'\n'}OUTCOMES
        </Copy>

        <Panel box={{x: 320, y: 695, w: 1280, h: 96}} at={c.read} />
        <EquationTerms
          equation="Eq. 2.5 · conventional causal arrow"
          ms={ms}
          box={{x: 360, y: 722, w: 1200, h: 42}}
          fontSize={30}
          align="center"
          tokens={[
            {term: 'IndividualPrejudice'},
            {text: ' → '},
            {term: 'DiscriminatoryActions'},
            {text: ' → '},
            {term: 'SystemicOutcomes'},
          ]}
          pulses={{
            IndividualPrejudice: [c.prejudice],
            DiscriminatoryActions: [c.actions],
            SystemicOutcomes: [c.outcomes],
          }}
        />
      </KitSound>
    </StageSceneFrame>
  );
}
