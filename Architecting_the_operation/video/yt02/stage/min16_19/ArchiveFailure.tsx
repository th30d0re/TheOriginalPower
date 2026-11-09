import React from 'react';
import {Arrow, Copy, FitBox, KitSound, Panel, StageSceneFrame, StickFigure, frame, type SceneProps} from './shared';
import {useCue} from '@stage';

export function ArchiveFailure({segment}: SceneProps) {
  const c = {
    archive: useCue('t91Archive').at,
    hatred: useCue('t91Hatred').at,
    laws: useCue('t91Laws').at,
    diagnostic: useCue('t92Diagnostic').at,
    opposite: useCue('t92Opposite').at,
    reset: useCue('t93Reset').at,
    ledgers: useCue('t93Ledgers').at,
    extraction: useCue('t93Extraction').at,
    untouched: useCue('t94Untouched').at,
    surface: useCue('t94Surface').at,
  };

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Copy at={c.archive} box={{x: 120, y: 90, w: 1680, h: 42}} size={32} align="center">
          Eq. 2.5 PREDICTS THIS HISTORICAL ORDER
        </Copy>

        <Panel box={{x: 160, y: 150, w: 620, h: 220}} at={c.hatred} accent="color/marker/race" />
        <FitBox
          text="POPULAR HATRED"
          x={190}
          y={175}
          size={22}
          weight={600}
          tag="PREDICTED FIRST"
          startFrame={frame(c.hatred)}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          accentToken="color/marker/race"
          beat
        />
        <StickFigure x={310} y={260} group="neutral" scale={1.15} animate startFrame={frame(c.hatred)} beat />
        <StickFigure x={470} y={260} group="neutral" scale={1.15} animate startFrame={frame(c.hatred)} beat />
        <StickFigure x={630} y={260} group="neutral" scale={1.15} animate startFrame={frame(c.hatred)} beat />
        <Copy at={c.hatred} box={{x: 195, y: 325, w: 550, h: 28}} size={22} align="center" tone="color/marker/race">
          WIDESPREAD PUBLIC HOSTILITY · APPEARS FIRST
        </Copy>

        <Arrow at={c.laws} points={[[780, 260], [1140, 260]]} red />

        <Panel box={{x: 1140, y: 150, w: 620, h: 220}} at={c.laws} />
        <FitBox
          text="STATUTORY CODES"
          x={1170}
          y={175}
          size={22}
          weight={600}
          tag="PREDICTED LATER"
          startFrame={frame(c.laws)}
          beat
        />
        <Copy at={c.laws} box={{x: 1170, y: 245, w: 560, h: 32}} size={28} align="center">
          LAWS AND STATUTES
        </Copy>
        <Copy at={c.laws} box={{x: 1170, y: 295, w: 560, h: 30}} size={22} align="center" tone="color/text/soft">
          WRITES PRE-EXISTING PUBLIC HATRED INTO LAW
        </Copy>

        <Panel box={{x: 240, y: 395, w: 1440, h: 140}} at={c.diagnostic} accent="color/marker/race" />
        <FitBox
          text="DIAGNOSTIC FAILURE"
          x={270}
          y={415}
          size={24}
          weight={600}
          tag="HISTORICAL ARCHIVE"
          startFrame={frame(c.diagnostic)}
          textToken="color/marker/race"
          strokeToken="color/marker/race"
          accentToken="color/marker/race"
          beat
        />
        <Copy at={c.diagnostic} box={{x: 620, y: 418, w: 1020, h: 32}} size={24} tone="color/marker/race">
          SECTION 2.2 · THE TIME SEQUENCE RUNS IN THE OPPOSITE DIRECTION
        </Copy>
        <Copy at={c.opposite} box={{x: 420, y: 460, w: 1080, h: 26}} size={20} align="center">
          HISTORICAL RECORD: ECONOMIC SLAVE CODES PRECEDE POPULAR HATRED
        </Copy>
        <Arrow at={c.opposite} points={[[1540, 505], [380, 505]]} red />

        <Panel box={{x: 120, y: 560, w: 1680, h: 235}} at={c.reset} />
        <FitBox
          text="OVERNIGHT RESET TEST"
          x={155}
          y={580}
          size={22}
          weight={600}
          tag="SECTION 2.2"
          startFrame={frame(c.reset)}
          beat
        />
        <Copy at={c.reset} box={{x: 155, y: 645, w: 420, h: 56}} size={22}>
          EVERY PRIVATE ATTITUDE{'\n'}RESET OVERNIGHT
        </Copy>
        <Arrow at={c.ledgers} points={[[585, 670], [715, 670]]} />
        <Copy at={c.ledgers} box={{x: 725, y: 635, w: 470, h: 76}} size={22} align="center">
          PROPERTY LEDGERS · STATUTES{'\n'}DISTRICT BOUNDARIES · DEBT
        </Copy>
        <Arrow at={c.extraction} points={[[1205, 670], [1335, 670]]} red />
        <Copy at={c.extraction} box={{x: 1345, y: 645, w: 430, h: 56}} size={24} tone="color/marker/race">
          PROGRAMMED EXTRACTION{'\n'}KEEPS RUNNING
        </Copy>

        <Copy at={c.untouched} box={{x: 155, y: 745, w: 780, h: 26}} size={20} tone="color/text/soft">
          EXTRACTION ENGINE REMAINS UNTOUCHED
        </Copy>
        <Copy at={c.surface} box={{x: 960, y: 745, w: 810, h: 26}} size={20} align="right" tone="color/text/soft">
          REFORM ENERGY SPENT ON SURFACE MAINTENANCE LAYER
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
