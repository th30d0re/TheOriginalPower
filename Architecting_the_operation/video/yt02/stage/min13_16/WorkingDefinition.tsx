import React from 'react';
import {DefinitionCard, DrawLine, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, useStageMs, type SceneProps} from '@stage';
import {Copy, Panel, entered, frame} from './SceneUtils';

export function WorkingDefinition({segment}:SceneProps){
  const ms=useStageMs();
  const c={section:useCue('t71Section').at, working:useCue('t71Working').at, oppression:useCue('t71Oppression').at, weaponizes:useCue('t71Weaponizes').at, bias:useCue('t71Bias').at, prejudice:useCue('t71Prejudice').at, discrimination:useCue('t71Discrimination').at, mechanisms:useCue('t71Mechanisms').at, control:useCue('t71Control').at, formal:useCue('t72Formal').at, private:useCue('t72Private').at, machine:useCue('t72Machine').at, elite:useCue('t72Elite').at, systems:useCue('t73Systems').at, software:useCue('t73Software').at, wetware:useCue('t73Wetware').at, laws:useCue('t73Laws').at, brains:useCue('t73Brains').at, level:useCue('t73Level').at};
  const definition={x:120,y:190,w:760,h:750}, machine={x:940,y:190,w:860,h:750};
  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Copy at={c.section} box={{x:120,y:105,w:1680,h:46}} size={34}>SECTION 2.2 · WORKING DEFINITION</Copy>
    <Panel box={definition} at={c.working} seed={711}/><Panel box={machine} at={c.formal} accent="color/marker/race" seed={712}/>
    <div style={{position:'absolute',left:definition.x,top:definition.y,width:definition.w,height:definition.h}}><DefinitionCard term="RACISM" definition="A system of oppression that weaponizes interpersonal bias, prejudice, and discrimination into structural mechanisms of exploitation and control." source="SECTION 2.2 · WORKING DEFINITION" paraphrased progress={entered(ms,c.working)} accent="color/fill/gold"/></div>
    <FitBox text="FORMAL INSTITUTIONALIZATION" x={980} y={226} size={27} weight={600} tag="PROCESS" startFrame={frame(c.formal)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <StickFigure x={1090} y={430} group="neutral" emphasis={1} scale={1.7} pose="open" animate startFrame={frame(c.private)} durationFrames={20} beat/>
    <Copy at={c.private} box={{x:980,y:530,w:220,h:42}} size={24} align="center">PRIVATE ATTITUDES</Copy>
    <DrawLine points={[[1230,430],[1450,430]]} startFrame={frame(c.machine)} durationFrames={18} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <Panel box={{x:1490,y:350,w:230,h:170}} at={c.machine} accent="color/marker/race" seed={713}/><Copy at={c.machine} box={{x:1510,y:388,w:190,h:52}} size={27} align="center">SELF-<br/>SUSTAINING</Copy><Copy at={c.machine} box={{x:1510,y:456,w:190,h:30}} size={20} tone="color/text/soft" align="center">MACHINE</Copy>
    <Copy at={c.elite} box={{x:1170,y:600,w:500,h:34}} size={25} tone="color/marker/race" align="center">SERVES ELITE ECONOMIC INTERESTS</Copy>
    <DrawLine points={[[970,670],[1760,670]]} startFrame={frame(c.systems)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={3} beat/>
    <Copy at={c.software} box={{x:970,y:710,w:380,h:38}} size={23}>PSYCHO-LEGAL SOCIAL SOFTWARE</Copy><Copy at={c.wetware} box={{x:1380,y:710,w:380,h:38}} size={23}>BIOLOGICAL HOST WETWARE</Copy>
    <Copy at={c.level} box={{x:1000,y:780,w:720,h:28}} size={20} tone="color/text/soft" align="center">LAWS AND INSTITUTIONS WRITE · HUMAN BRAINS RUN</Copy>
  </KitSound></StageSceneFrame>;
}
