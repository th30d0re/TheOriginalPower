import React from 'react';
import {DrawLine, DrawRect, FitBox, StickFigure, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turns 166–167: the Thirteenth Amendment's exception clause opens a criminal-system extraction
// pipeline (paid police, county sheriffs, vagrancy laws, convict leasing), and paid officers with
// state authority and legal protection take over the policing compulsory patrols had performed.
export function ConvictLeasing({segment}: SceneProps) {
  const cue = {
    sixtyFive: useCue('t166SixtyFive').at,
    thirteenth: useCue('t166Thirteenth').at,
    abolished: useCue('t166Abolished').at,
    except_: useCue('t166Except').at,
    crime: useCue('t166Crime').at,
    police: useCue('t166Police').at,
    sheriffs: useCue('t166Sheriffs').at,
    vagrancy: useCue('t166Vagrancy').at,
    leasing: useCue('t166Leasing').at,
    extract: useCue('t166Extract').at,
    labor: useCue('t166Labor').at,
    criminal: useCue('t166Criminal').at,
    emancipation: useCue('t167Emancipation').at,
    officers: useCue('t167Officers').at,
    policing: useCue('t167Policing').at,
    citizens: useCue('t167Citizens').at,
    patrols: useCue('t167Patrols').at,
    positions: useCue('t167Positions').at,
    authority: useCue('t167Authority').at,
    protection: useCue('t167Protection').at,
  };
  const chips: readonly [string, number][] = [
    ['PAID POLICE', cue.police],
    ['SHERIFFS', cue.sheriffs],
    ['VAGRANCY LAWS', cue.vagrancy],
    ['CONVICT LEASING', cue.leasing],
  ];
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 110, w: 760, h: 230}} at={cue.thirteenth}/>
    <FitBox text="13TH AMENDMENT" x={150} y={140} size={34} weight={600} tag="1865" startFrame={frame(cue.thirteenth)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.abolished} box={{x: 150, y: 216, w: 400, h: 32}} size={24}>ABOLISHES SLAVERY</Copy>
    <DrawRect box={{x: 150, y: 262, w: 560, h: 44}} startFrame={frame(cue.except_)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
    <Copy at={cue.crime} box={{x: 168, y: 272, w: 520, h: 28}} size={22} tone="color/marker/race">EXCEPT AS PUNISHMENT FOR A CRIME</Copy>
    {chips.map(([text, at], i) => {
      const y = 420 + i * 110;
      return <React.Fragment key={text}>
        <Panel box={{x: 120, y, w: 380, h: 90}} at={at} accent="color/marker/race"/>
        <Copy at={at} box={{x: 150, y: y + 30, w: 320, h: 30}} size={22}>{text}</Copy>
        <DrawLine points={[[500, y + 45], [660, 560 + i * 70]]} startFrame={frame(at + 200)} durationFrames={14} strokeToken="color/line/hairline-strong" strokeWidth={2} end="arrow"/>
      </React.Fragment>;
    })}
    <Panel box={{x: 660, y: 470, w: 400, h: 320}} at={cue.criminal} accent="color/marker/race"/>
    <Copy at={cue.criminal} box={{x: 690, y: 610, w: 340, h: 34}} size={26} align="center" tone="color/marker/race">CRIMINAL SYSTEM</Copy>
    <DrawLine points={[[1060, 630], [1240, 630]]} startFrame={frame(cue.extract)} durationFrames={16} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <Copy at={cue.labor} box={{x: 1270, y: 612, w: 380, h: 34}} size={22}>EXTRACTED BLACK LABOR</Copy>
    <Panel box={{x: 120, y: 860, w: 1680, h: 140}} at={cue.emancipation}/>
    <div style={{position: 'absolute', inset: 0, opacity: .4}}>
      <StickFigure x={300} y={940} group="ingroup" emphasis={1} scale={1.2} animate startFrame={frame(cue.citizens)} durationFrames={16}/>
    </div>
    <Copy at={cue.patrols} box={{x: 170, y: 892, w: 340, h: 30}} size={22} tone="color/text/dim">COMPULSORY PATROLS</Copy>
    <DrawLine points={[[520, 930], [900, 930]]} startFrame={frame(cue.policing)} durationFrames={18} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} end="arrow" beat/>
    <Copy at={cue.officers} box={{x: 940, y: 892, w: 380, h: 30}} size={22}>PAID OFFICERS</Copy>
    <DrawLine points={[[940, 936], [1290, 936]]} startFrame={frame(cue.positions)} durationFrames={12} strokeToken="color/fill/gold" strokeWidth={3}/>
    <Panel box={{x: 1340, y: 886, w: 220, h: 44}} at={cue.authority}/>
    <Copy at={cue.authority} box={{x: 1356, y: 898, w: 190, h: 24}} size={20} tone="color/fill/gold">STATE AUTHORITY</Copy>
    <Panel box={{x: 1580, y: 886, w: 220, h: 44}} at={cue.protection}/>
    <Copy at={cue.protection} box={{x: 1596, y: 898, w: 190, h: 24}} size={20} tone="color/fill/gold">LEGAL PROTECTION</Copy>
  </Scene>;
}
