import React from 'react';
import {DrawLine, DrawRect, Flicker, KitSound, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';
import {EntryRail, SenseCard, type RailSlotSpec} from './EntryRail';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));
const cueFrame = (ms:number) => Math.round(ms * 30 / 1000);

const PHRASES = [
  {cue:'t9Institutional', text:'institutional or systemic practices'},
  {cue:'t9Unequal', text:'that produce unequal outcomes'},
  {cue:'t9Categories', text:'across racial categories.'},
] as const;

// Institution network (left) and outcome meter (right) inside the card's svg
// (viewBox 1240 × 410). Meter bar heights exported for tools/check_minute_two.tsx.
const NODES = [
  {x:60, y:60}, {x:300, y:30}, {x:540, y:100}, {x:140, y:220}, {x:420, y:250},
] as const;
const NODE_W = 150, NODE_H = 64;
const CENTER = NODES.map(({x, y}) => [x + NODE_W/2, y + NODE_H/2] as const);
const WIRES = [[0,1],[1,2],[0,3],[3,4],[2,4],[1,3]].map(([a,b]) => [CENTER[a], CENTER[b]] as const);

export const SENSE3_NETWORK = {nodes:NODES, nodeW:NODE_W, nodeH:NODE_H, wires:WIRES} as const;

export const SENSE3_METER = {trackY:110, trackH:190, baseline:300, barAX:850, barBX:1060, barW:90, barAH:170, barBH:58} as const;

export function SenseThree({segment}:SceneProps) {
  const ms = useStageMs();
  const cue = {
    t9Sense:useCue('t9Sense'), t9Third:useCue('t9Third'), t9Institutional:useCue('t9Institutional'),
    t9Practices:useCue('t9Practices'), t9Unequal:useCue('t9Unequal'), t9Categories:useCue('t9Categories'),
  };
  const openP = enter(ms, cue.t9Sense.at, 500);
  const solidP = enter(ms, cue.t9Third.at, 450);
  const netP = enter(ms, cue.t9Practices.at, 600);
  const meterP = enter(ms, cue.t9Unequal.at, 600);
  const unitP = enter(ms, cue.t9Categories.at, 400);
  const slots:[RailSlotSpec,RailSlotSpec,RailSlotSpec] = [
    {state:'dim', unitP:1},
    {state:'dim', unitP:1},
    {state:solidP>.5?'lit':'dashed', solidify:solidP, unitP},
  ];
  const M = SENSE3_METER;
  return <KitSound mode="beats"><div data-scene="SenseThree" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    <EntryRail slots={slots} enter={openP}/>
    <SenseCard title="Sense 3" enter={openP} dashed={1-solidP}>
      <div data-definition="sense-3" style={{position:'absolute', left:40, top:116, width:1240, fontSize:36, lineHeight:1.5}}>
        {PHRASES.map(({cue:name, text}, index) => {
          const at = cue[name].at;
          const p = enter(ms, at, 380);
          return ms >= at && <React.Fragment key={name}>{index>0 && ' '}<Flicker startFrame={cueFrame(at)} durationFrames={Math.round(380*30/1000)} style={{position:'relative', inset:'auto', display:'inline'}}><span data-phrase={name} style={{opacity:p}}>{text}</span></Flicker></React.Fragment>;
        })}
      </div>
      <svg style={{position:'absolute', left:40, top:300}} width="1240" height="410" viewBox="0 0 1240 410" aria-label="A system of practices and unequal outcomes">
        {ms >= cue.t9Practices.at && <g data-network="true">
          {NODES.map(({x, y}, i) => {
            const p = enter(ms, cue.t9Practices.at + i*90, 400);
            const cx = x + NODE_W/2, cy = y + NODE_H/2;
            return <g key={i} data-institution-node={i+1} opacity={p} transform={`translate(${cx} ${cy}) scale(${.8+.2*p}) translate(${-cx} ${-cy})`}>
              <foreignObject x={x} y={y} width={NODE_W} height={NODE_H}><DrawRect box={{x:0,y:0,w:NODE_W,h:NODE_H}} progress={p} strokeToken="color/line/hairline-strong" fillToken="color/bg/field" glowToken="color/fill/gold" strokeWidth={2} seed={151+i}/></foreignObject>
            </g>;
          })}
        </g>}
        {ms >= cue.t9Unequal.at && <g data-outcome-meter="true">
          <line x1={820} y1={M.baseline} x2={1180} y2={M.baseline} stroke={color('color/line/hairline')} strokeWidth={2}/>
          {[M.barAX, M.barBX].map(x => <rect key={x} x={x} y={M.trackY} width={M.barW} height={M.trackH} fill="none" stroke={color('color/line/graticule')} strokeWidth={2}/>)}
          <rect data-bar="a" x={M.barAX} y={M.baseline - M.barAH*meterP} width={M.barW} height={M.barAH*meterP} fill={color('color/fill/gold-wash')} stroke={color('color/fill/gold')} strokeWidth={2}/>
          <rect data-bar="b" x={M.barBX} y={M.baseline - M.barBH*meterP} width={M.barW} height={M.barBH*meterP} fill={color('color/fill/gold-wash')} stroke={color('color/fill/gold')} strokeWidth={2}/>
          <text x={895} y={328} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={20} fill={color('color/text/muted')}>category A</text>
          <text x={1105} y={328} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={20} fill={color('color/text/muted')}>category B</text>
          <foreignObject x={1000} y={40} width={164} height={34}><DrawRect box={{x:0,y:0,w:164,h:34}} progress={meterP} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" strokeWidth={1} seed={161}/></foreignObject>
          <text x={1082} y={63} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={20} fill={color('color/text/muted')}>illustrative</text>
        </g>}
        {ms >= cue.t9Categories.at && <g data-unit-tag="a system" opacity={unitP}>
          <foreignObject x={872} y={358} width={216} height={40}><DrawRect box={{x:0,y:0,w:216,h:40}} progress={unitP} strokeToken="color/line/hairline" fillToken="color/fill/panel-render" glowToken="color/fill/gold" strokeWidth={1} seed={171}/></foreignObject>
          <text x={980} y={385} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={22} fill={color('color/text/muted')}>unit: a system</text>
        </g>}
      </svg>
      <div data-network-wires="true" style={{position:'absolute', left:40, top:300, width:1240, height:410}}>{WIRES.map((points,i) => <div key={i} data-network-wire={i+1} style={{position:'absolute', inset:0}}><DrawLine points={points} startFrame={cueFrame(cue.t9Practices.at)} durationFrames={18} strokeToken="color/line/chart" strokeWidth={2} nodes={false} origin={false} beat={i===0}/></div>)}</div>
    </SenseCard>
  </div></KitSound>;
}
