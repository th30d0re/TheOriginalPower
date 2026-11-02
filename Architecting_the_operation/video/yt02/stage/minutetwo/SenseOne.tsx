import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';
import {EntryRail, SenseCard, type RailSlotSpec} from './EntryRail';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));

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
const GLYPH_A = 280, GLYPH_B = 960, ARROW_Y = 190, ARROW_X1 = 380, ARROW_X2 = 880;

function PersonGlyph({cx, p}: {cx:number; p:number}) {
  const stroke = color('color/line/hairline-strong');
  return <g>
    <circle cx={cx} cy={150} r={36} fill="none" stroke={stroke} strokeWidth={3} pathLength={1} strokeDasharray="1" strokeDashoffset={1-p}/>
    <path d={`M ${cx-70} 280 Q ${cx} 200 ${cx+70} 280`} fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1-p}/>
  </g>;
}

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
  return <div data-scene="SenseOne" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    <EntryRail slots={slots} enter={openP}/>
    <SenseCard title="Sense 1" enter={openP}>
      <div data-definition="sense-1" style={{position:'absolute', left:40, top:116, width:1240, fontSize:38, lineHeight:1.55}}>
        {PHRASES.map(({cue:name, text}, index) => {
          const at = cue[name].at;
          const p = enter(ms, at, 380);
          return ms >= at && <React.Fragment key={name}>{index>0 && ' '}<span data-phrase={name} style={{opacity:p}}>{text}</span></React.Fragment>;
        })}
      </div>
      <svg style={{position:'absolute', left:40, top:300}} width="1240" height="410" viewBox="0 0 1240 410" aria-label="One person acting on another">
        <defs><marker id="sense1-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill={color('color/fill/gold')}/></marker></defs>
        <PersonGlyph cx={GLYPH_A} p={openP}/>
        <PersonGlyph cx={GLYPH_B} p={openP}/>
        {ARROW_LABELS.map(({cue:name, text, y}) => {
          const at = cue[name].at;
          return ms >= at && <text key={name} data-arrow-label={text} x={630} y={y} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={22} fill={color('color/text/muted')} opacity={enter(ms, at, 350)}>{text}</text>;
        })}
        {ms >= cue.t7Person.at && <line data-arrow="sense1" x1={ARROW_X1} y1={ARROW_Y} x2={ARROW_X1 + (ARROW_X2-ARROW_X1)*arrowP} y2={ARROW_Y} stroke={color('color/fill/gold')} strokeWidth={3} markerEnd={arrowP>.9 ? 'url(#sense1-arrow)' : undefined}/>}
        {ms >= cue.t7Race.at && <g data-unit-tag="one person" opacity={unitP}>
          <rect x={512} y={318} width={236} height={40} rx={6} fill={color('color/fill/panel-render')} stroke={color('color/line/hairline')}/>
          <text x={630} y={345} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={22} fill={color('color/text/muted')}>unit: one person</text>
        </g>}
      </svg>
    </SenseCard>
  </div>;
}
