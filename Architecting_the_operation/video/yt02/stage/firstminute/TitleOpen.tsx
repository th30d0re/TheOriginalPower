import React from 'react';
import {MathText, cubicOut, progress, useCue, useStageMs} from '@stage';
import {color} from '../tokens';
import {CardBorder} from '../dashboard/CardBorder';

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
const STRIP = {y: 493, xs: [643.2, 878.2, 1113.2], scaleX: .48, scaleY: .30};
const EPISODE_Y = 605, SUBTITLE_Y = 709;

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
  const scaleX = 1 + (STRIP.scaleX - 1) * fold;
  const scaleY = 1 + (STRIP.scaleY - 1) * fold;
  return <div style={{...panel, position:'absolute', left:x, top:y, width:TILE.w, height:TILE.h, opacity:visible, transform:`translateY(${18*(1-visible)}px) scale(${scaleX}, ${scaleY})`, transformOrigin:'top left', overflow:'hidden'}}>
    <div style={{height:178, display:'grid', placeItems:'center'}}>{children}</div>
    <div style={{borderTop:`1px solid ${color('color/line/hairline')}`, paddingTop:17, textAlign:'center', font:'500 28px "IBM Plex Mono"', letterSpacing:2, color:color('color/text/primary')}}>{label}</div>
  </div>;
}

export function TitleOpen() {
  const ms = useStageMs();
  const title = useCue('title'), archives = useCue('archives'), equations = useCue('equations'), tests = useCue('tests');
  const episode = useCue('episode'), definition = useCue('definition'), fails = useCue('fails');
  const titleIn = rise(ms, title.at, 650);
  const fold = cubicOut(progress(ms, episode.at, episode.at + 650));
  const episodeIn = rise(ms, episode.at, 580);
  const definitionIn = rise(ms, definition.at, 520);
  const underline = cubicOut(progress(ms, fails.at, fails.at + 500));
  return <div data-scene="TitleOpen" style={{position:'absolute', inset:0, width:1920, height:1080, overflow:'hidden', background:color('color/bg/field'), color:color('color/text/primary'), fontFamily:'IBM Plex Sans'}}>
    <CardBorder/>
    {ms >= title.at && <div style={{position:'absolute', left:120, right:120, top:TITLE_Y, textAlign:'center', opacity:titleIn, transform:`translateY(${24*(1-titleIn)}px)`}}>
      <div style={{fontSize:96, lineHeight:1, fontWeight:500, letterSpacing:-2}}>The Original Power</div>
      <div style={{marginTop:22, font:'400 30px "IBM Plex Mono"', letterSpacing:3, color:color('color/text/muted')}}>Emmanuel Theodore</div>
    </div>}
    {ms >= archives.at && <MethodTile label="Archives" at={archives.at} ms={ms} index={0} fold={fold}><FolioGraphic/></MethodTile>}
    {ms >= equations.at && <MethodTile label="Equations" at={equations.at} ms={ms} index={1} fold={fold}><EquationGraphic/></MethodTile>}
    {ms >= tests.at && <MethodTile label="Tests" at={tests.at} ms={ms} index={2} fold={fold}><TestsGraphic/></MethodTile>}
    {ms >= episode.at && <div style={{position:'absolute', left:180, right:180, top:EPISODE_Y, textAlign:'center', opacity:episodeIn, transform:`translateY(${25*(1-episodeIn)}px)`}}>
      <div style={{fontSize:70, fontWeight:500, letterSpacing:-.6}}>Episode 1 · What Racism Is</div>
    </div>}
    {ms >= definition.at && <div style={{position:'absolute', left:300, right:300, top:SUBTITLE_Y, textAlign:'center', opacity:definitionIn, transform:`translateY(${18*(1-definitionIn)}px)`, fontSize:40, lineHeight:1.45, color:color('color/text/soft')}}>
      <span>and why </span><span style={{position:'relative', display:'inline-block'}}>the definition most of us were taught
        <span data-fails-underline="true" aria-hidden="true" style={{position:'absolute', left:0, right:0, bottom:-8, height:5, background:color('color/marker/race'), transform:`scaleX(${underline})`, transformOrigin:'left center', borderRadius:4}}/>
      </span><span> fails</span>
    </div>}
  </div>;
}
