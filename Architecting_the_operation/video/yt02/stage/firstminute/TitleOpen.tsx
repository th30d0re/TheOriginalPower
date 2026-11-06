import React from 'react';
import {MathText, cubicOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {color} from '../tokens';
import {SceneBorder} from '../dashboard/SceneBorder';

const panel: React.CSSProperties = {
  background: color('color/fill/panel-render'),
  border: `1px solid ${color('color/line/hairline')}`,
  boxShadow: `inset 0 0 0 1px ${color('color/fill/panel-wash')}`,
};

const rise = (ms: number, at: number, duration = 500) => cubicOut(progress(ms, at, at + duration));

// Fixed 1920 × 1080 layout. The title-plus-tiles block spans 306–773 (centre ≈ 540) and
// the post-fold block of title, strip, episode line and subtitle spans 306–767.
const TITLE_Y = 306;
const TILE = {w: 340, h: 240, y: 533, xs: [350, 790, 1230]};
// Folded tiles keep the tile's aspect ratio: one uniform scale, centred on x 834 / 960 / 1086 (24 px gaps).
const STRIP = {y: 493, scale: .30, xs: [783, 909, 1035]};
const SERIES_Y = 596, EPISODE_Y = 646, SUBTITLE_Y = 742;
const BOOK = {w: 270, h: 360, x: 960 - 135, y: 490};

// Exponentially decaying shake after the slam lands (px).
function shake(ms: number, at: number): [number, number] {
  const t = ms - at;
  if (t < 0 || t > 900) return [0, 0];
  const a = 14 * Math.exp(-t / 170);
  return [a * Math.sin(t / 19), a * .7 * Math.cos(t / 23)];
}

function Textbook() {
  const page = color('color/line/hairline');
  return <svg width={BOOK.w + 26} height={BOOK.h + 26} viewBox={`0 0 ${BOOK.w + 26} ${BOOK.h + 26}`} aria-label="The Original Power, 1,158 pages">
    {[22, 16, 10, 4].map(o => <g key={o}><rect x={o} y={o} width={BOOK.w} height={BOOK.h} rx="4" fill={color('color/bg/field')}/><rect x={o} y={o} width={BOOK.w} height={BOOK.h} rx="4" fill={color('color/fill/panel-wash')} stroke={page} strokeWidth="1.5"/></g>)}
    <rect x="0" y="0" width={BOOK.w} height={BOOK.h} rx="6" fill={color('color/bg/field')}/>
    <rect x="0" y="0" width={BOOK.w} height={BOOK.h} rx="6" fill={color('color/fill/panel-render')} stroke={color('color/fill/gold')} strokeWidth="3"/>
    <rect x="22" y="22" width={BOOK.w - 44} height={BOOK.h - 44} fill="none" stroke={color('color/fill/gold')} strokeWidth="1" opacity=".55"/>
    <text x={BOOK.w / 2} y="118" textAnchor="middle" fill={color('color/fill/gold')} fontFamily="IBM Plex Sans" fontWeight="600" fontSize="31">THE ORIGINAL</text>
    <text x={BOOK.w / 2} y="156" textAnchor="middle" fill={color('color/fill/gold')} fontFamily="IBM Plex Sans" fontWeight="600" fontSize="31">POWER</text>
    <line x1="75" y1="182" x2={BOOK.w - 75} y2="182" stroke={color('color/fill/gold')} strokeWidth="2"/>
    <text x={BOOK.w / 2} y="212" textAnchor="middle" fill={color('color/text/muted')} fontFamily="IBM Plex Mono" fontSize="14" letterSpacing="2">EMMANUEL THEODORE</text>
    <text x={BOOK.w / 2} y={BOOK.h - 38} textAnchor="middle" fill={color('color/text/primary')} fontFamily="IBM Plex Mono" fontSize="20" letterSpacing="3">1,158 PAGES</text>
  </svg>;
}

function Shockwaves({ms, at}: {ms: number; at: number}) {
  const cx = 960, cy = BOOK.y + BOOK.h / 2;
  return <svg style={{position:'absolute', inset:0, pointerEvents:'none'}} width="1920" height="1080" aria-hidden="true">
    {[0, 140, 300].map(delay => {
      const p = progress(ms, at + delay, at + delay + 1100);
      if (p <= 0 || p >= 1) return null;
      const r = 60 + 1150 * cubicOut(p);
      return <circle key={delay} cx={cx} cy={cy} r={r} fill="none" stroke={color('color/fill/gold')} strokeWidth={10 * (1 - p) + 1} opacity={.75 * (1 - p)}/>;
    })}
  </svg>;
}

function FolioGraphic() {
  return <svg width="260" height="149" viewBox="0 0 220 126" aria-label="Archive folio">
    <path d="M48 10h112l18 18v88H48z" fill={color('color/fill/panel-wash')} stroke={color('color/line/hairline')} strokeWidth="2"/>
    <path d="M160 10v19h18" fill="none" stroke={color('color/line/hairline')} strokeWidth="2"/>
    <text x="62" y="33" fill={color('color/text/muted')} fontFamily="IBM Plex Mono" fontSize="9.5" letterSpacing="0.8">ARCHIVE · 1676</text>
    {[51,64,77,90].map((y, i) => <line key={y} x1="63" y1={y} x2={i === 3 ? 126 : 162} y2={y} stroke={color('color/line/chart')} strokeWidth="2"/>)}
    <circle cx="151" cy="93" r="14" fill={color('color/fill/red-wash')} stroke={color('color/marker/race')} strokeWidth="2"/>
    <path d="M145 93l5 5 9-11" fill="none" stroke={color('color/marker/race')} strokeWidth="2"/>
  </svg>;
}

function EquationGraphic() {
  return <div style={{height:178, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12}}>
    <div style={{font:'500 31px "IBM Plex Mono"', color:color('color/text/primary')}}><MathText>{'W = ψ_m + jψ_s'}</MathText></div>
    <svg width="205" height="74" viewBox="0 0 180 65" aria-label="Complex wage phasor plane">
      <defs><marker id="title-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill={color('color/fill/gold')}/></marker></defs>
      <line x1="48" y1="14" x2="48" y2="58" stroke={color('color/line/hairline')} strokeWidth="2"/>
      <line x1="48" y1="14" x2="158" y2="14" stroke={color('color/line/hairline')} strokeWidth="2"/>
      <line x1="48" y1="14" x2="128" y2="44" stroke={color('color/fill/gold')} strokeWidth="3" markerEnd="url(#title-arrow)"/>
      <text x="160" y="19" fill={color('color/text/muted')} fontFamily="IBM Plex Mono" fontSize="13"><MathText svg>{'ψ_s'}</MathText></text>
      <text x="35" y="62" fill={color('color/text/muted')} fontFamily="IBM Plex Mono" fontSize="13"><MathText svg>{'ψ_m'}</MathText></text>
    </svg>
  </div>;
}

function TestsGraphic() {
  return <svg width="260" height="149" viewBox="0 0 220 126" aria-label="Three tests">
    {[
      {y:25, pass:true, width:118},
      {y:61, pass:true, width:92},
      {y:97, pass:false, width:130},
    ].map(({y, pass, width}) => <g key={y}>
      <line x1="28" y1={y} x2={28 + width} y2={y} stroke={color('color/line/chart')} strokeWidth="4" strokeLinecap="round"/>
      <circle cx="181" cy={y} r="13" fill={pass ? color('color/fill/gold-wash') : color('color/fill/red-wash')} stroke={pass ? color('color/fill/gold') : color('color/marker/race')} strokeWidth="2"/>
      <path d={pass ? `M174 ${y}l5 5 9-11` : `M175 ${y-6}l12 12m0-12l-12 12`} fill="none" stroke={pass ? color('color/fill/gold') : color('color/marker/race')} strokeWidth="3" strokeLinecap="round"/>
    </g>)}
  </svg>;
}

function MethodTile({label, at, children, ms, index, fold}: React.PropsWithChildren<{label:string; at:number; ms:number; index:number; fold:number}>) {
  const visible = rise(ms, at, 480);
  const left = TILE.xs[index];
  const foldedLeft = STRIP.xs[index];
  const x = left + (foldedLeft - left) * fold;
  const y = TILE.y + (STRIP.y - TILE.y) * fold;
  const scale = 1 + (STRIP.scale - 1) * fold;
  return <div style={{...panel, position:'absolute', left:x, top:y, width:TILE.w, height:TILE.h, opacity:visible, transform:`translateY(${18*(1-visible)}px) scale(${scale})`, transformOrigin:'top left', overflow:'hidden'}}>
    <div style={{height:178, display:'grid', placeItems:'center'}}>{children}</div>
    <div style={{borderTop:`1px solid ${color('color/line/hairline')}`, paddingTop:17, textAlign:'center', font:'500 28px "IBM Plex Mono"', letterSpacing:2, color:color('color/text/primary')}}>{label}</div>
  </div>;
}

export function TitleOpen({segment}:SceneProps) {
  const ms = useStageMs();
  const title = useCue('title'), archives = useCue('archives'), equations = useCue('equations'), tests = useCue('tests');
  const episode = useCue('episode'), definition = useCue('definition'), fails = useCue('fails');
  const slam = useCue('slam'), series = useCue('series');
  const titleIn = rise(ms, title.at, 650);
  const fold = cubicOut(progress(ms, series.at, series.at + 650));
  const seriesIn = rise(ms, series.at + 250, 520);
  // Book falls for 220 ms (accelerating), lands at slam.at + 220, squashes, then clears at the series cue.
  const LAND = slam.at + 220;
  const fall = Math.min(1, Math.max(0, (ms - slam.at) / 220)) ** 2;
  const squash = ms >= LAND ? 1 - .06 * Math.exp(-(ms - LAND) / 60) * Math.cos((ms - LAND) / 25) : 1;
  const bookOut = cubicOut(progress(ms, series.at, series.at + 420));
  const [sx, sy] = shake(ms, LAND);
  const episodeIn = rise(ms, episode.at, 580);
  const definitionIn = rise(ms, definition.at, 520);
  const underline = cubicOut(progress(ms, fails.at, fails.at + 500));
  return <div data-scene="TitleOpen" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <SceneBorder segment={segment}/>
    <div style={{position:'absolute', inset:0, transform:`translate(${sx}px, ${sy}px)`}}>
    {ms >= title.at && <div style={{position:'absolute', left:120, right:120, top:TITLE_Y, textAlign:'center', opacity:titleIn, transform:`translateY(${24*(1-titleIn)}px)`}}>
      <div style={{fontSize:96, lineHeight:1, fontWeight:500, letterSpacing:-2}}>The Original Power</div>
      <div style={{marginTop:22, font:'400 30px "IBM Plex Mono"', letterSpacing:3, color:color('color/text/muted')}}>Emmanuel Theodore</div>
    </div>}
    {ms >= archives.at && <MethodTile label="Archives" at={archives.at} ms={ms} index={0} fold={fold}><FolioGraphic/></MethodTile>}
    {ms >= equations.at && <MethodTile label="Equations" at={equations.at} ms={ms} index={1} fold={fold}><EquationGraphic/></MethodTile>}
    {ms >= tests.at && <MethodTile label="Tests" at={tests.at} ms={ms} index={2} fold={fold}><TestsGraphic/></MethodTile>}
    {ms >= series.at && <div style={{position:'absolute', left:180, right:180, top:SERIES_Y, textAlign:'center', opacity:seriesIn, transform:`translateY(${14*(1-seriesIn)}px)`, font:'500 26px "IBM Plex Mono"', letterSpacing:5, color:color('color/fill/gold')}}>
      ARCHITECTING THE OPERATION · SERIES PREMIERE
    </div>}
    {ms >= episode.at && <div style={{position:'absolute', left:180, right:180, top:EPISODE_Y, textAlign:'center', opacity:episodeIn, transform:`translateY(${25*(1-episodeIn)}px)`}}>
      <div style={{fontSize:70, fontWeight:500, letterSpacing:-.6}}>What Racism Actually Is</div>
    </div>}
    {ms >= definition.at && <div style={{position:'absolute', left:300, right:300, top:SUBTITLE_Y, textAlign:'center', opacity:definitionIn, transform:`translateY(${18*(1-definitionIn)}px)`, fontSize:40, lineHeight:1.45, color:color('color/text/soft')}}>
      <span>(It's </span><span style={{position:'relative', display:'inline-block'}}>Not What You Were Taught
        <span data-fails-underline="true" aria-hidden="true" style={{position:'absolute', left:0, right:0, bottom:-8, height:5, background:color('color/marker/race'), transform:`scaleX(${underline})`, transformOrigin:'left center', borderRadius:4}}/>
      </span><span>)</span>
    </div>}
    </div>
    {ms >= slam.at && bookOut < 1 && <div style={{position:'absolute', left:BOOK.x, top:BOOK.y, opacity:1 - bookOut, transform:`translateY(${-520 * (1 - fall)}px) scale(${(1.9 - .9 * fall) * (1 - .25 * bookOut)}, ${(1.9 - .9 * fall) * squash * (1 - .25 * bookOut)})`, transformOrigin:'center bottom', filter:'drop-shadow(0 18px 30px rgba(0,0,0,.55))'}}><Textbook/></div>}
    {ms >= LAND && <Shockwaves ms={ms} at={LAND}/>}
  </div>;
}
