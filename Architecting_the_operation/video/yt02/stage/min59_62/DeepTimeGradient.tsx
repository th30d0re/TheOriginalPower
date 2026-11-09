import React from 'react';
import {DrawLine, DrawRect, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, frame} from './shared';

// Turns 280–283: a deep-time timeline carries human adaptation through different ultraviolet
// environments, dissolving fixed bundles without using portrait imagery.
export function DeepTimeGradient({segment}:SceneProps) {
  const c={ancient:useCue('t280Ancient').at, labrana:useCue('t280LaBrana').at, alleles:useCue('t280Alleles').at, haplotype:useCue('t280Haplotype').at, cheddar:useCue('t281Cheddar').at, bundles:useCue('t281Bundles').at, ancestors:useCue('t282Ancestors').at, melanin:useCue('t282MelaninRich').at, protection:useCue('t282Protection').at, hair:useCue('t282Hair').at, moved:useCue('t283Moved').at, lower:useCue('t283Lower').at, lighter:useCue('t283Lighter').at, paths:useCue('t283Paths').at, variants:useCue('t283Variants').at, years:useCue('t283Years').at};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Panel box={{x:120,y:104,w:1680,h:72}} at={c.ancient} beat/>
    <Copy at={c.ancient} box={{x:150,y:122,w:980,h:36}} size={30}>DEEP TIME · ADAPTATION</Copy>
    <DrawLine points={[[220,540],[1700,540]]} startFrame={frame(c.ancient)} durationFrames={26} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    <DrawRect box={{x:360,y:440,w:34,h:200}} startFrame={frame(c.labrana)} durationFrames={12} strokeToken="color/line/hairline" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
    <StickFigure x={377} y={415} group="outgroup" emphasis={1} scale={1.1} animate startFrame={frame(c.alleles)} durationFrames={16}/>
    <Copy at={c.labrana} box={{x:250,y:680,w:260,h:28}} size={20} align="center">LA BRAÑA</Copy>
    <DrawRect box={{x:760,y:440,w:34,h:200}} startFrame={frame(c.cheddar)} durationFrames={12} strokeToken="color/line/hairline" fillToken="color/fill/gold-wash" glowToken="color/fill/gold"/>
    <StickFigure x={777} y={415} group="outgroup" emphasis={1} scale={1.1} animate startFrame={frame(c.cheddar)} durationFrames={16}/>
    <Copy at={c.cheddar} box={{x:640,y:680,w:280,h:28}} size={20} align="center">CHEDDAR MAN</Copy>
    <Copy at={c.bundles} box={{x:590,y:720,w:380,h:24}} size={18} align="center" mono tone="color/text/soft">BUNDLES DISSOLVE</Copy>
    <DrawRect box={{x:1160,y:320,w:500,h:250}} startFrame={frame(c.ancestors)} durationFrames={18} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/>
    <FitBox text="MELANIN PROTECTION" x={1210} y={350} size={26} weight={600} tag="ORIGIN" startFrame={frame(c.melanin)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold"/>
    <Copy at={c.protection} box={{x:1200,y:455,w:420,h:30}} size={21} align="center">INTENSE ULTRAVIOLET</Copy>
    <Panel box={{x:270,y:830,w:640,h:112}} at={c.lower}/><Copy at={c.lower} box={{x:300,y:866,w:580,h:28}} size={22} align="center">LOWER ULTRAVIOLET</Copy>
    <Panel box={{x:1010,y:830,w:640,h:112}} at={c.paths}/><Copy at={c.paths} box={{x:1040,y:852,w:580,h:28}} size={22} align="center">MULTIPLE GENETIC PATHS</Copy>
    <DrawLine points={[[910,886],[1010,886]]} startFrame={frame(c.lighter)} durationFrames={14} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
  </KitSound></StageSceneFrame>;
}
