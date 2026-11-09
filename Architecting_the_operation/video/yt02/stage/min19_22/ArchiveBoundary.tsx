import React from 'react';
import {DrawLine, FitBox, useCue, type SceneProps} from '@stage';
import {Box, Copy, Scene, frame} from './shared';

export function ArchiveBoundary({segment}: SceneProps) {
  const c = {
    historians: useCue('t107Historians').at,
    james: useCue('t107James').at,
    francisco: useCue('t107Francisco').at,
    documented: useCue('t107Documented').at,
    medieval: useCue('t107Medieval').at,
    before: useCue('t108Before').at,
    shifting: useCue('t108Shifting').at,
    scalars: useCue('t108Scalars').at,
    without: useCue('t108Without').at,
    atlantic: useCue('t109Atlantic').at,
    compiled: useCue('t109Compiled').at,
    durable: useCue('t109Durable').at,
  };

  const sweetCard = {x: 120, y: 220, w: 760, h: 250};
  const bethencourtCard = {x: 960, y: 220, w: 840, h: 250};
  const preCard = {x: 120, y: 520, w: 760, h: 330};
  const postCard = {x: 1040, y: 520, w: 760, h: 330};

  return (
    <Scene segment={segment}>
      <Copy at={c.historians} box={{x: 120, y: 105, w: 1100, h: 48}} size={34}>
        ARCHIVAL BOUNDARY · BEFORE 1450
      </Copy>
      <Copy at={c.historians} box={{x: 1400, y: 118, w: 360, h: 28}} size={20} tone="color/fill/gold" mono>
        HISTORICAL EVIDENCE
      </Copy>

      {/* Turn 107: James H. Sweet (1997) */}
      <Box box={sweetCard} at={c.james} />
      <FitBox
        text="JAMES H. SWEET"
        x={sweetCard.x + 36}
        y={sweetCard.y + 26}
        size={28}
        weight={600}
        tag="1997"
        startFrame={frame(c.james)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.documented} box={{x: sweetCard.x + 36, y: sweetCard.y + 110, w: 680, h: 40}} size={26}>
        COLOR-CODED CULTURAL ATTITUDES
      </Copy>
      <Copy at={c.james} box={{x: sweetCard.x + 36, y: sweetCard.y + 165, w: 680, h: 56}} size={22} tone="color/text/soft">
        Documented phenotypical prejudices in medieval Mediterranean and Islamic worlds.
      </Copy>

      {/* Leader line between historians */}
      <DrawLine
        points={[[sweetCard.x + sweetCard.w, 345], [bethencourtCard.x, 345]]}
        startFrame={frame(c.documented)}
        durationFrames={16}
        strokeToken="color/fill/gold"
        strokeWidth={4}
        end="arrow"
        beat
      />

      {/* Turn 107: Francisco Bethencourt (2013) */}
      <Box box={bethencourtCard} at={c.francisco} />
      <FitBox
        text="FRANCISCO BETHENCOURT"
        x={bethencourtCard.x + 36}
        y={bethencourtCard.y + 26}
        size={28}
        weight={600}
        tag="2013"
        startFrame={frame(c.francisco)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.medieval} box={{x: bethencourtCard.x + 36, y: bethencourtCard.y + 110, w: 760, h: 40}} size={26}>
        MEDITERRANEAN & ISLAMIC CIRCULATION
      </Copy>
      <Copy at={c.francisco} box={{x: bethencourtCard.x + 36, y: bethencourtCard.y + 165, w: 760, h: 56}} size={22} tone="color/text/soft">
        Pre-1450 prejudices circulated without a unified institutional machine.
      </Copy>

      {/* Turn 108: Pre-1450 Interpersonal Scalars */}
      <Box box={preCard} at={c.before} />
      <FitBox
        text="PRE-1450 SCALARS"
        x={preCard.x + 36}
        y={preCard.y + 28}
        size={26}
        weight={600}
        tag="INTERPERSONAL"
        startFrame={frame(c.before)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/fill/gold"
        fillToken="color/fill/panel-render"
        accentToken="color/fill/gold"
        beat
      />
      <Copy at={c.before} box={{x: preCard.x + 36, y: preCard.y + 105, w: 680, h: 28}} size={20} tone="color/fill/gold" mono>
        BEFORE THE MID-FIFTEENTH CENTURY
      </Copy>
      <Copy at={c.shifting} box={{x: preCard.x + 36, y: preCard.y + 145, w: 680, h: 38}} size={28}>
        SHIFTING CULTURAL PREJUDICES
      </Copy>
      <Copy at={c.scalars} box={{x: preCard.x + 36, y: preCard.y + 195, w: 680, h: 48}} size={24} tone="color/text/soft">
        Interpersonal scalars carrying emotional weight without statutory codification.
      </Copy>
      <Copy at={c.without} box={{x: preCard.x + 36, y: preCard.y + 255, w: 680, h: 48}} size={24} tone="color/marker/race">
        WITHOUT A STATE-BACKED LEGAL MACHINE
      </Copy>

      {/* Central transformation arrow */}
      <DrawLine
        points={[[preCard.x + preCard.w, 685], [postCard.x, 685]]}
        startFrame={frame(c.without)}
        durationFrames={18}
        strokeToken="color/marker/race"
        glowToken="color/marker/race"
        strokeWidth={6}
        end="arrow"
        beat
      />

      {/* Turn 109: Atlantic Extraction System */}
      <Box box={postCard} at={c.atlantic} accent="color/marker/race" />
      <FitBox
        text="ATLANTIC EXTRACTION"
        x={postCard.x + 36}
        y={postCard.y + 28}
        size={26}
        weight={600}
        tag="LEGAL MACHINE"
        startFrame={frame(c.atlantic)}
        durationFrames={16}
        textToken="color/text/primary"
        strokeToken="color/marker/race"
        fillToken="color/fill/panel-render"
        accentToken="color/marker/race"
        beat
      />
      <Copy at={c.atlantic} box={{x: postCard.x + 36, y: postCard.y + 105, w: 680, h: 28}} size={20} tone="color/marker/race" mono>
        ATLANTIC EXTRACTION APPARATUS
      </Copy>
      <Copy at={c.compiled} box={{x: postCard.x + 36, y: postCard.y + 145, w: 680, h: 38}} size={28}>
        COMPILED INTO LEGAL DIVISION
      </Copy>
      <Copy at={c.durable} box={{x: postCard.x + 36, y: postCard.y + 195, w: 680, h: 48}} size={26} tone="color/fill/gold">
        DURABLE · HERITABLE · STATE-ENFORCED
      </Copy>
      <Copy at={c.durable} box={{x: postCard.x + 36, y: postCard.y + 255, w: 680, h: 48}} size={22} tone="color/text/soft">
        Locks phenotype permanently to hereditary chattel slavery.
      </Copy>

      {/* Bottom Takeaway */}
      <Copy at={c.durable} box={{x: 360, y: 895, w: 1200, h: 34}} size={25} tone="color/fill/gold" mono>
        PRE-EXISTING SCALARS COMPILED INTO INSTITUTIONAL EXTRACTION VECTOR
      </Copy>
    </Scene>
  );
}
