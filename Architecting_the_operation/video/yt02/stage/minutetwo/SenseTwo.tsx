import React from 'react';
import {cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';
import {EntryRail, SenseCard, type RailSlotSpec} from './EntryRail';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));

const PHRASES = [
  {cue:'t8Ideological', text:'an ideological belief'},
  {cue:'t8Doctrine', text:'or doctrine'},
  {cue:'t8Biological', text:'holding that built-in biological differences'},
  {cue:'t8Groups', text:'among human racial groups'},
  {cue:'t8Determine', text:'determine cultural or intellectual achievement.'},
] as const;

// Doctrine chain diagram inside the card's svg (viewBox 1240 × 410): the claimed chain sits
// inside a thought-bubble outline. Fixed box positions; landing order follows the cues.
const BOXES = [
  {key:'groups', cue:'t8Groups', label:'racial groups', x:120},
  {key:'differences', cue:'t8Biological', label:'biological differences', x:480},
  {key:'achievement', cue:'t8Achievement', label:'achievement', x:840},
] as const;
const BOX_W = 300, BOX_H = 96, BOX_Y = 130;
const ARROWS = [{x1:424, x2:476}, {x1:784, x2:836}];

export function SenseTwo({segment}:SceneProps) {
  const ms = useStageMs();
  const cue = {
    t8Sense:useCue('t8Sense'), t8Ideological:useCue('t8Ideological'), t8Doctrine:useCue('t8Doctrine'),
    t8Biological:useCue('t8Biological'), t8Groups:useCue('t8Groups'), t8Determine:useCue('t8Determine'),
    t8Achievement:useCue('t8Achievement'),
  };
  const openP = enter(ms, cue.t8Sense.at, 500);
  const bubbleP = enter(ms, cue.t8Doctrine.at, 500);
  const arrowP = enter(ms, cue.t8Determine.at, 500);
  const unitP = enter(ms, cue.t8Achievement.at, 400);
  const slots:[RailSlotSpec,RailSlotSpec,RailSlotSpec] = [
    {state:'dim', unitP:1},
    {state:'lit', unitP},
    {state:'placeholder'},
  ];
  return <div data-scene="SenseTwo" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    <EntryRail slots={slots} enter={openP}/>
    <SenseCard title="Sense 2" enter={openP}>
      <div data-definition="sense-2" style={{position:'absolute', left:40, top:116, width:1240, fontSize:36, lineHeight:1.5}}>
        {PHRASES.map(({cue:name, text}, index) => {
          const at = cue[name].at;
          const p = enter(ms, at, 380);
          return ms >= at && <React.Fragment key={name}>{index>0 && ' '}<span data-phrase={name} style={{opacity:p}}>{text}</span></React.Fragment>;
        })}
      </div>
      <svg style={{position:'absolute', left:40, top:300}} width="1240" height="410" viewBox="0 0 1240 410" aria-label="The doctrine's claimed chain">
        <defs><marker id="sense2-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill={color('color/fill/gold')}/></marker></defs>
        {ms >= cue.t8Doctrine.at && <g data-thought-bubble="true" opacity={bubbleP}>
          <rect x={60} y={30} width={1140} height={300} rx={80} fill="none" stroke={color('color/line/hairline')} strokeWidth={2} strokeDasharray="10 8"/>
          <circle cx={150} cy={366} r={13} fill="none" stroke={color('color/line/hairline')} strokeWidth={2}/>
          <circle cx={112} cy={394} r={7} fill="none" stroke={color('color/line/hairline')} strokeWidth={2}/>
          <rect x={573} y={12} width={134} height={36} rx={6} fill={color('color/bg/field')} stroke={color('color/line/hairline')}/>
          <text x={640} y={38} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={22} fill={color('color/text/muted')}>doctrine</text>
        </g>}
        {BOXES.map(({key, cue:name, label, x}) => {
          const at = cue[name].at;
          const p = enter(ms, at, 350);
          return ms >= at && <g key={key} data-diagram-box={label} opacity={p}>
            <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill={color('color/fill/panel-render')} stroke={color('color/line/hairline-strong')} strokeWidth={1.5}/>
            <text x={x+BOX_W/2} y={BOX_Y+57} textAnchor="middle" fontFamily="IBM Plex Sans" fontSize={22} fill={color('color/text/primary')}>{label}</text>
          </g>;
        })}
        {ms >= cue.t8Determine.at && <g>
          {ARROWS.map(({x1, x2}) => <line key={x1} x1={x1} y1={178} x2={x1+(x2-x1)*arrowP} y2={178} stroke={color('color/fill/gold')} strokeWidth={3} markerEnd={arrowP>.9 ? 'url(#sense2-arrow)' : undefined}/>)}
          <text x={630} y={266} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={20} fill={color('color/text/muted')} opacity={arrowP}>claimed to determine</text>
        </g>}
        {ms >= cue.t8Achievement.at && <g data-unit-tag="a belief" opacity={unitP}>
          <rect x={525} y={348} width={210} height={40} rx={6} fill={color('color/fill/panel-render')} stroke={color('color/line/hairline')}/>
          <text x={630} y={375} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={22} fill={color('color/text/muted')}>unit: a belief</text>
        </g>}
      </svg>
    </SenseCard>
  </div>;
}
