import React from 'react';
import {cubicInOut, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';
import {RAIL, RAIL_LABEL_LINES, RailSlotContent} from './EntryRail';

const enter = (ms:number, at:number, duration=460) => cubicOut(progress(ms, at, at + duration));

// Figure 2.3 plate geometry. Layer widths are 115 × (5.2, 4.2, 3.2) from the tikz
// minimum widths in Paper/The_Original_Power.tex lines 1953–1955 and 1965–1967.
// Exported for the ratio assert in tools/check_minute_two.tsx.
export const FIGURE_LAYOUT = {
  plate:{x:440, y:110, w:1440, h:890},
  captionY:178, sourceY:210, ruleY:222, headerY:328,
  leftCenter:760, rightCenter:1560,
  layerY:[352,466,580], layerH:92,
  layerWidths:[598,483,368],
  landW:598,
  arrow:{x1:1090, x2:1230, y:500},
  pyramid:{leftX:452, rightX:1068, topY:344, apexX:760, apexY:724},
  noteY:768,
} as const;

const LAYERS_LEFT = [
  {main:'1. Individual Prejudice', tail:'', fill:'color/fill/red-wash', fillOp:1},
  {main:'2. Belief in Superiority', tail:'', fill:'color/fill/red-faint', fillOp:1},
  {main:'3. Systemic ', tail:'(if present)', fill:'color/fill/red-faint', fillOp:.6},
] as const;
const LAYERS_RIGHT = [
  '1. Systemic Policies',
  '2. Ideological Narratives',
  '3. Interpersonal Prejudice',
] as const;

const FLIGHT = {dur:800, stagger:220} as const;

export function FigureTwoThree({segment}:SceneProps) {
  const ms = useStageMs();
  const cue = {
    t10Figure:useCue('t10Figure'), t10Chapter:useCue('t10Chapter'), t10Displays:useCue('t10Displays'),
    t10Order:useCue('t10Order'), t10Column:useCue('t10Column'), t10Pyramid:useCue('t10Pyramid'),
  };
  const F = FIGURE_LAYOUT;
  const plateP = enter(ms, cue.t10Figure.at, 700);
  const captionP = enter(ms, cue.t10Figure.at + 150, 500);
  const dimP = enter(ms, cue.t10Figure.at, 500);
  const sourceP = enter(ms, cue.t10Chapter.at, 400);
  const columnP = enter(ms, cue.t10Column.at, 400);
  const bracketP = enter(ms, cue.t10Column.at + 100, 450);
  const taperP = enter(ms, cue.t10Pyramid.at, 500);
  const traceP = enter(ms, cue.t10Pyramid.at + 150, 600);
  const noteP = enter(ms, cue.t10Pyramid.at + 250, 400);
  const labelP = 1 - progress(ms, cue.t10Displays.at, cue.t10Displays.at + 400);
  const flights = [0,1,2].map(i => {
    const t0 = cue.t10Displays.at + i*FLIGHT.stagger;
    return {p:cubicInOut(progress(ms, t0, t0 + FLIGHT.dur)), q:progress(ms, t0 + 480, t0 + FLIGHT.dur)};
  });
  return <div data-scene="FigureTwoThree" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    {ms >= cue.t10Figure.at && <>
      <svg style={{position:'absolute', inset:0}} width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" aria-hidden="true">
        <rect data-plate="true" x={F.plate.x} y={F.plate.y} width={F.plate.w} height={F.plate.h} stroke={color('color/line/hairline')} strokeWidth={1} pathLength={1} strokeDasharray="1" strokeDashoffset={1-plateP}/>
        <line x1={F.plate.x+40} y1={F.ruleY} x2={F.plate.x+F.plate.w-40} y2={F.ruleY} stroke={color('color/line/hairline')} strokeWidth={1} opacity={captionP}/>
        <g data-right-column="true" opacity={.25*dimP}>
          <text x={F.rightCenter} y={F.headerY} textAnchor="middle" fontFamily="IBM Plex Sans" fontWeight={700} fontSize={26} fill={color('color/text/primary')}>Correct Hierarchy</text>
          {LAYERS_RIGHT.map((label, i) => {
            const w = F.layerWidths[i];
            return <g key={label}>
              <rect x={F.rightCenter - w/2} y={F.layerY[i]} width={w} height={F.layerH} rx={4} fill={color('color/fill/gold-wash')} fillOpacity={[1,.65,.4][i]} stroke={color('color/line/hairline-strong')} strokeWidth={1.5}/>
              <text x={F.rightCenter} y={F.layerY[i]+56} textAnchor="middle" fontFamily="IBM Plex Sans" fontSize={24} fontWeight={600} fill={color('color/text/primary')}>{label}</text>
            </g>;
          })}
          <text x={F.rightCenter} y={F.noteY} textAnchor="middle" fontFamily="IBM Plex Sans" fontSize={22} fill={color('color/fill/gold')}>↑ epiphenomenal, downstream</text>
          <g stroke={color('color/text/dim')} strokeWidth={6}>
            <line x1={F.arrow.x1} y1={F.arrow.y-6} x2={F.arrow.x2} y2={F.arrow.y-6}/>
            <line x1={F.arrow.x1} y1={F.arrow.y+6} x2={F.arrow.x2} y2={F.arrow.y+6}/>
          </g>
          <path d={`M ${F.arrow.x2} ${F.arrow.y-14} L ${F.arrow.x2+22} ${F.arrow.y} L ${F.arrow.x2} ${F.arrow.y+14} Z`} fill={color('color/text/dim')}/>
          <text x={(F.arrow.x1+F.arrow.x2)/2 + 11} y={F.arrow.y+52} textAnchor="middle" fontFamily="IBM Plex Sans" fontWeight={700} fontSize={22} fill={color('color/text/dim')}>Must</text>
          <text x={(F.arrow.x1+F.arrow.x2)/2 + 11} y={F.arrow.y+80} textAnchor="middle" fontFamily="IBM Plex Sans" fontWeight={700} fontSize={22} fill={color('color/text/dim')}>invert</text>
        </g>
        <text data-left-header="true" x={F.leftCenter} y={F.headerY} textAnchor="middle" fontFamily="IBM Plex Sans" fontWeight={700} fontSize={26} fill={color('color/text/primary')} opacity={.25*dimP + .75*columnP}>Conventional Hierarchy</text>
        {columnP>0 && <path data-column-bracket="true" d={`M 469 340 L 445 340 L 445 684 L 469 684 M 1051 340 L 1075 340 L 1075 684 L 1051 684`} stroke={color('color/fill/gold')} strokeWidth={3} pathLength={1} strokeDasharray="1" strokeDashoffset={1-bracketP}/>}
        {traceP>0 && <path data-pyramid-outline="true" d={`M ${F.pyramid.leftX} ${F.pyramid.topY} L ${F.pyramid.apexX} ${F.pyramid.apexY} L ${F.pyramid.rightX} ${F.pyramid.topY} Z`} stroke={color('color/line/hairline-strong')} strokeWidth={2} pathLength={1} strokeDasharray="1" strokeDashoffset={1-traceP}/>}
        {noteP>0 && <text x={F.leftCenter} y={F.noteY} textAnchor="middle" fontFamily="IBM Plex Sans" fontSize={22} fill={color('color/marker/race')} opacity={noteP}>↑ buried, rarely referenced</text>}
      </svg>
      <div data-caption="true" style={{position:'absolute', left:F.plate.x, width:F.plate.w, top:150, textAlign:'center', font:'500 28px "IBM Plex Mono"', letterSpacing:2, color:color('color/text/primary'), opacity:captionP}}>Figure 2.3 · Inverting the Definitional Hierarchy</div>
      {ms >= cue.t10Chapter.at && <div data-source-line="true" style={{position:'absolute', left:F.plate.x, width:F.plate.w, top:188, textAlign:'center', font:'400 20px "IBM Plex Mono"', color:color('color/text/muted'), opacity:sourceP}}>The Original Power, Chapter 2</div>}
      <div data-rail-label="true" style={{position:'absolute', left:RAIL.x, top:RAIL.labelY, font:'400 20px "IBM Plex Mono"', lineHeight:1.4, color:color('color/text/muted'), opacity:labelP}}>
        {RAIL_LABEL_LINES.map(line => <div key={line}>{line}</div>)}
      </div>
      {flights.map(({p, q}, i) => {
        const w = RAIL.w + (F.landW - RAIL.w)*p + (F.layerWidths[i]-F.landW)*taperP;
        const cx = (RAIL.x + RAIL.w/2) + (F.leftCenter - (RAIL.x + RAIL.w/2))*p;
        const y = RAIL.slotY[i] + (F.layerY[i]-RAIL.slotY[i])*p;
        const h = RAIL.slotH + (F.layerH-RAIL.slotH)*p;
        const layer = LAYERS_LEFT[i];
        return <div key={i} data-flight-layer={i+1} style={{position:'absolute', left:cx-w/2, top:y, width:w, height:h, background:color('color/fill/panel-render'), border:`1px solid ${color('color/line/hairline-strong')}`}}>
          {q>0 && <span aria-hidden="true" style={{position:'absolute', inset:0, background:color(layer.fill), opacity:q*layer.fillOp}}/>}
          <span aria-hidden="true" style={{position:'absolute', left:0, top:8, bottom:8, width:4, background:color('color/fill/gold'), opacity:1-q}}/>
          {q<1 && <div style={{position:'absolute', left:'50%', top:'50%', width:RAIL.w, height:RAIL.slotH, transform:'translate(-50%,-50%)', opacity:1-q, color:color('color/fill/gold')}}>
            <RailSlotContent index={i} unitP={1}/>
          </div>}
          {q>0 && <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', opacity:q, fontSize:24, color:color('color/text/primary'), whiteSpace:'nowrap'}}>
            <span><strong>{layer.main}</strong>{layer.tail && <span style={{fontWeight:400}}>{layer.tail}</span>}</span>
          </div>}
        </div>;
      })}
    </>}
  </div>;
}
