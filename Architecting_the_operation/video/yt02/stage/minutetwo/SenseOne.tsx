import React from 'react';
import {DrawLine, Flicker, KitSound, StickFigure, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';
import {EntryRail, SenseCard, type RailSlotSpec} from './EntryRail';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));
const cueFrame = (ms:number) => Math.round(ms * 30 / 1000);

const PHRASES = [
  {cue:'t7Prejudice', text:'individual prejudice,'},
  {cue:'t7Hostility', text:'hostility,'},
  {cue:'t7Discrimination', text:'or discrimination'},
  {cue:'t7Person', text:'directed against another person'},
  {cue:'t7Race', text:'on the basis of race or ethnicity.'},
] as const;

const ARROW_LABELS = [
  {cue:'t7Prejudice', text:'prejudice', y:80},
  {cue:'t7Hostility', text:'hostility', y:112},
  {cue:'t7Discrimination', text:'discrimination', y:144},
] as const;

// Diagram geometry inside the card's svg (viewBox 1240 × 410).
const GLYPH_A = 280, GLYPH_B = 960, GLYPH_CENTER_Y = 197, GLYPH_SCALE = 3, ARROW_Y = 190, ARROW_X1 = 380, ARROW_X2 = 880;

export function SenseOne({segment}:SceneProps) {
  const ms = useStageMs();
  const cue = {
    t7Sense:useCue('t7Sense'), t7Prejudice:useCue('t7Prejudice'), t7Hostility:useCue('t7Hostility'),
    t7Discrimination:useCue('t7Discrimination'), t7Person:useCue('t7Person'), t7Race:useCue('t7Race'),
  };
  const openP = enter(ms, cue.t7Sense.at, 500);
  const arrowP = enter(ms, cue.t7Person.at, 500);
  const unitP = enter(ms, cue.t7Race.at, 400);
  const slots:[RailSlotSpec,RailSlotSpec,RailSlotSpec] = [
    {state:'lit', unitP},
    {state:'placeholder'},
    {state:'placeholder'},
  ];
  return <KitSound mode="beats"><div data-scene="SenseOne" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    <EntryRail slots={slots} enter={openP}/>
    <SenseCard title="Sense 1" enter={openP}>
      <div data-definition="sense-1" style={{position:'absolute', left:40, top:116, width:1240, fontSize:38, lineHeight:1.55}}>
        {PHRASES.map(({cue:name, text}, index) => {
          const at = cue[name].at;
          const p = enter(ms, at, 380);
          return ms >= at && <React.Fragment key={name}>{index>0 && ' '}<Flicker startFrame={cueFrame(at)} durationFrames={Math.round(380*30/1000)} style={{position:'relative', inset:'auto', display:'inline'}}><span data-phrase={name} style={{opacity:p}}>{text}</span></Flicker></React.Fragment>;
        })}
      </div>
      <svg style={{position:'absolute', left:40, top:300}} width="1240" height="410" viewBox="0 0 1240 410" aria-label="One person acting on another">
        <defs><marker id="sense1-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill={color('color/fill/gold')}/></marker></defs>
        {ARROW_LABELS.map(({cue:name, text, y}) => {
          const at = cue[name].at;
          return ms >= at && <text key={name} data-arrow-label={text} x={630} y={y} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={22} fill={color('color/text/muted')} opacity={enter(ms, at, 350)}>{text}</text>;
        })}
        {ms >= cue.t7Race.at && <g data-unit-tag="one person" opacity={unitP}>
          <rect x={512} y={318} width={236} height={40} rx={6} fill={color('color/fill/panel-render')} stroke={color('color/line/hairline')}/>
          <text x={630} y={345} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={22} fill={color('color/text/muted')}>unit: one person</text>
        </g>}
      </svg>
      <StickFigure x={40+GLYPH_A} y={300+GLYPH_CENTER_Y} group="neutral" emphasis={1} scale={GLYPH_SCALE} startFrame={cueFrame(cue.t7Sense.at)} durationFrames={15}/>
      <StickFigure x={40+GLYPH_B} y={300+GLYPH_CENTER_Y} group="neutral" emphasis={1} scale={GLYPH_SCALE} startFrame={cueFrame(cue.t7Sense.at)} durationFrames={15}/>
      <div data-arrow="sense1" style={{position:'absolute', left:40, top:300, width:1240, height:410}}><DrawLine points={[[ARROW_X1,ARROW_Y],[ARROW_X2,ARROW_Y]]} startFrame={cueFrame(cue.t7Person.at)} durationFrames={15} strokeToken="color/fill/gold" strokeWidth={3} end="arrow" beat/></div>
    </SenseCard>
  </div></KitSound>;
}
