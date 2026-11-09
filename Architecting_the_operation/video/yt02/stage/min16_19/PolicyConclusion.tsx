import React from 'react';
import {Arrow, Copy, FitBox, KitSound, Panel, StageSceneFrame, StickFigure, frame, type SceneProps} from './shared';
import {useCue} from '@stage';

export function PolicyConclusion({segment}: SceneProps) {
  const c = {
    policy: useCue('t88Policy').at,
    law: useCue('t88Law').at,
    root: useCue('t89Root').at,
    cure: useCue('t89Cure').at,
    moral: useCue('t89Moral').at,
    workshops: useCue('t89Workshops').at,
    teaching: useCue('t90Teaching').at,
    biases: useCue('t90Biases').at,
    dissolve: useCue('t90Dissolve').at,
  };

  const cards = [
    {tag: 'PERSUASION', label: 'MORAL\nPERSUASION', at: c.moral},
    {tag: 'WORKSHOPS', label: 'DIVERSITY\nWORKSHOPS', at: c.workshops},
    {tag: 'ATTITUDES', label: 'CHANGE PERSONAL\nATTITUDES', at: c.biases},
  ] as const;

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={{x: 120, y: 100, w: 1680, h: 108}} at={c.policy} />
        <Copy at={c.policy} box={{x: 155, y: 138, w: 1610, h: 38}} size={32} align="center">
          THE POLICY CONCLUSION THAT FOLLOWS FROM Eq. 2.5
        </Copy>

        <Panel box={{x: 120, y: 245, w: 520, h: 480}} at={c.root} accent="color/marker/race" />
        <FitBox
          text="ROOT CAUSE"
          x={158}
          y={275}
          size={28}
          weight={600}
          tag="ASSUMED"
          startFrame={frame(c.root)}
          durationFrames={16}
          textToken="color/text/primary"
          strokeToken="color/marker/race"
          fillToken="color/fill/panel-render"
          accentToken="color/marker/race"
          beat
        />
        <StickFigure x={380} y={450} group="neutral" emphasis={1} scale={2} animate startFrame={frame(c.root)} beat />
        <Copy at={c.root} box={{x: 160, y: 610, w: 440, h: 36}} size={28} align="center" tone="color/marker/race">
          INDIVIDUAL PREJUDICE
        </Copy>

        <Arrow at={c.cure} points={[[640, 485], [820, 485]]} />
        <Copy at={c.cure} box={{x: 650, y: 520, w: 160, h: 28}} size={20} align="center">
          PRIMARY CURE
        </Copy>

        {cards.map((card, i) => {
          const box = {x: 840 + i * 320, y: 245, w: 290, h: 480};
          return (
            <React.Fragment key={card.tag}>
              <Panel box={box} at={card.at} />
              <FitBox
                text={card.tag}
                x={box.x + 24}
                y={box.y + 30}
                size={20}
                weight={600}
                tag={`REMEDY 0${i + 1}`}
                startFrame={frame(card.at)}
                beat
              />
              <Copy at={card.at} box={{x: box.x + 20, y: box.y + 190, w: 250, h: 80}} size={26} align="center">
                {card.label}
              </Copy>
              <StickFigure
                x={box.x + 145}
                y={box.y + 360}
                group={i === 1 ? 'ingroup' : 'neutral'}
                scale={1.1}
                animate
                startFrame={frame(card.at)}
                beat
              />
            </React.Fragment>
          );
        })}

        <Panel box={{x: 240, y: 765, w: 1440, h: 110}} at={c.teaching} />
        <Copy at={c.teaching} box={{x: 275, y: 792, w: 1370, h: 30}} size={25} align="center">
          TEACH INDIVIDUALS TO EXAMINE PERSONAL BIASES
        </Copy>
        <Copy at={c.dissolve} box={{x: 275, y: 830, w: 1370, h: 26}} size={20} align="center" tone="color/text/soft">
          PREDICTED RESULT: INSTITUTIONAL STRUCTURE DISSOLVES
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
