import React from 'react';
import {DrawRect, FitBox, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

// Turn 178: Lincoln's letter to Joshua F. Speed (August 24, 1855) maps the admission price the
// Know-Nothings were setting — the Declaration strip resolves "all men are created equal" in
// cream, then three red exception chips append as spoken.
export function AdmissionPrice({segment}: SceneProps) {
  const cue = {
    lincoln: useCue('t178Lincoln').at,
    speed: useCue('t178Speed').at,
    fiftyFive: useCue('t178FiftyFive').at,
    admission: useCue('t178Admission').at,
    knowNothings: useCue('t178KnowNothings').at,
    control: useCue('t178Control').at,
    declaration: useCue('t178Declaration').at,
    equal: useCue('t178Equal').at,
    except: useCue('t178Except').at,
    foreigners: useCue('t178Foreigners').at,
    catholics: useCue('t178Catholics').at,
  };
  const exceptions: readonly {text: string; at: number; x: number; w: number}[] = [
    {text: 'EXCEPT NEGROES', at: cue.except, x: 190, w: 300},
    {text: 'AND FOREIGNERS', at: cue.foreigners, x: 520, w: 290},
    {text: 'AND CATHOLICS', at: cue.catholics, x: 840, w: 270},
  ];
  return <Scene segment={segment}>
    <Panel box={{x: 150, y: 180, w: 720, h: 330}} at={cue.lincoln}/>
    <FitBox text="ABRAHAM LINCOLN" x={190} y={216} size={30} weight={600} tag="LETTER" startFrame={frame(cue.lincoln)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.speed} box={{x: 190, y: 330, w: 600, h: 34}} size={26}>TO JOSHUA F. SPEED</Copy>
    <Copy at={cue.fiftyFive} box={{x: 190, y: 380, w: 400, h: 30}} size={22} mono tone="color/text/dim">AUGUST 24, 1855</Copy>
    <FitBox text="ADMISSION PRICE" x={1230} y={216} size={26} weight={600} startFrame={frame(cue.admission)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Copy at={cue.knowNothings} box={{x: 1230, y: 330, w: 560, h: 34}} size={24} tone="color/text/soft">KNOW-NOTHINGS</Copy>
    <Copy at={cue.control} box={{x: 1230, y: 372, w: 560, h: 34}} size={24} tone="color/text/dim">IF THEY GOT CONTROL</Copy>
    <Panel box={{x: 150, y: 600, w: 1620, h: 320}} at={cue.declaration} accent="color/marker/race"/>
    <Copy at={cue.declaration} box={{x: 190, y: 640, w: 700, h: 30}} size={22} tone="color/text/dim">THE DECLARATION WOULD READ</Copy>
    <Copy at={cue.equal} box={{x: 190, y: 706, w: 1100, h: 60}} size={44}>“ALL MEN ARE CREATED EQUAL</Copy>
    {exceptions.map((chip) => <React.Fragment key={chip.text}>
      <DrawRect box={{x: chip.x, y: 820, w: chip.w, h: 60}} startFrame={frame(chip.at)} durationFrames={14} strokeToken="color/marker/race" fillToken="color/fill/red-faint" glowToken="color/marker/race" beat/>
      <Copy at={chip.at} box={{x: chip.x + 20, y: 838, w: chip.w - 40, h: 30}} size={22} tone="color/marker/race">{chip.text}</Copy>
    </React.Fragment>)}
    <Copy at={cue.catholics} box={{x: 1140, y: 838, w: 60, h: 44}} size={34}>”</Copy>
  </Scene>;
}
