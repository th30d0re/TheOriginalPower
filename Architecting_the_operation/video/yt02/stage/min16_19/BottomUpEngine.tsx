import React from 'react';
import {Arrow, Copy, FitBox, KitSound, Panel, StageSceneFrame, StickFigure, frame, type SceneProps} from './shared';
import {useCue} from '@stage';

export function BottomUpEngine({segment}: SceneProps) {
  const c = {
    engine: useCue('t85Engine').at,
    private: useCue('t85Private').at,
    conventional: useCue('t86Conventional').at,
    millions: useCue('t86Millions').at,
    encounters: useCue('t86Encounters').at,
    housing: useCue('t86Housing').at,
    court: useCue('t87Court').at,
    intent: useCue('t87Intent').at,
    outcome: useCue('t87Outcome').at,
  };

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={{x: 120, y: 100, w: 1680, h: 116}} at={c.engine} accent="color/marker/race" />
        <Copy at={c.engine} box={{x: 155, y: 138, w: 1610, h: 40}} size={32} align="center">
          WHERE THE CONVENTIONAL MODEL PLACES THE CAUSAL ENGINE
        </Copy>

        <Panel box={{x: 120, y: 250, w: 470, h: 500}} at={c.private} accent="color/marker/race" />
        <FitBox
          text="PRIVATE PSYCHOLOGY"
          x={160}
          y={280}
          size={26}
          weight={600}
          tag="CAUSAL ENGINE"
          startFrame={frame(c.private)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />
        <StickFigure x={355} y={455} group="neutral" emphasis={1} scale={2} animate startFrame={frame(c.private)} beat />
        <Copy at={c.conventional} box={{x: 165, y: 620, w: 380, h: 64}} size={26} align="center">
          PRIVATE RACIAL{'\n'}HOSTILITY
        </Copy>

        <Arrow at={c.encounters} points={[[590, 500], [795, 500]]} red />

        <Panel box={{x: 795, y: 250, w: 405, h: 500}} at={c.encounters} />
        <FitBox
          text="DAILY SCALE"
          x={830}
          y={280}
          size={22}
          weight={600}
          tag="ENCOUNTERS"
          startFrame={frame(c.millions)}
          beat
        />
        <Copy at={c.millions} box={{x: 830, y: 355, w: 335, h: 36}} size={25} align="center">
          MILLIONS OF INDIVIDUALS
        </Copy>
        <StickFigure x={890} y={470} group="neutral" scale={1.2} animate startFrame={frame(c.millions)} beat />
        <StickFigure x={1030} y={470} group="outgroup" scale={1.2} animate startFrame={frame(c.millions)} />
        <Copy at={c.encounters} box={{x: 830, y: 600, w: 335, h: 70}} size={28} align="center">
          SEPARATE DAILY{'\n'}ENCOUNTERS
        </Copy>

        <Arrow at={c.housing} points={[[1200, 500], [1405, 500]]} />

        <Panel box={{x: 1405, y: 250, w: 395, h: 500}} at={c.housing} />
        <FitBox
          text="PATTERN PILE-UP"
          x={1435}
          y={280}
          size={22}
          weight={600}
          tag="DOWNSTREAM"
          startFrame={frame(c.housing)}
          beat
        />
        <Copy at={c.housing} box={{x: 1430, y: 385, w: 345, h: 260}} size={26} align="center">
          HOUSING{'\n'}SEGREGATION{'\n\n'}WEALTH GAPS{'\n\n'}SENTENCING{'\n'}DISPARITIES
        </Copy>

        <Panel box={{x: 240, y: 785, w: 1440, h: 96}} at={c.court} accent="color/marker/race" />
        <Copy at={c.court} box={{x: 275, y: 818, w: 450, h: 32}} size={22}>
          EQUAL-PROTECTION RULINGS
        </Copy>
        <Copy at={c.intent} box={{x: 770, y: 818, w: 400, h: 32}} size={22} align="center" tone="color/marker/race">
          REQUIRE PERSONAL INTENT
        </Copy>
        <Copy at={c.outcome} box={{x: 1210, y: 818, w: 430, h: 32}} size={22} align="right">
          BEFORE FIXING OUTCOMES
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
