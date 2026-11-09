import React from 'react';
import {DrawLine, KitSound, QRCode, StageSceneFrame, Trace, color, cubicInOut, progress, useCue, useStageMs, type SceneProps} from '@stage';
import {AtlanticMap, Copy, Panel} from './shared';

export function PortugalAuthorship({segment}:SceneProps){
  const ms=useStageMs();
  const cue={portugal:useCue('t221Portugal').at, institutions:useCue('t221Institutions').at, selected:useCue('t221Selected').at, captains:useCue('t222Captains').at, crown:useCue('t222Crown').at, papacy:useCue('t222Papacy').at, chronicler:useCue('t222Chronicler').at, casa:useCue('t222Casa').at, profitable:useCue('t223Profitable').at, zurara:useCue('t223Zurara').at, cover:useCue('t223Cover').at, dubois:useCue('t224Bois').at, propaganda:useCue('t224Propaganda').at, downward:useCue('t224Downward').at};
  const authors=[['CAPTAINS',cue.captains],['CROWN',cue.crown],['PAPACY',cue.papacy],['CHRONICLER',cue.chronicler],['CASA',cue.casa]] as const;

  // Animate the 5-tier notch triangles away while the map is active (t221Institutions until t223Zurara)
  const notchOut = 1 - cubicInOut(progress(ms, cue.institutions, cue.institutions + 400));
  const notchIn = cubicInOut(progress(ms, cue.zurara, cue.zurara + 400));
  const notch = ms < cue.institutions ? 1 : ms < cue.zurara ? notchOut : notchIn;

  return <StageSceneFrame segment={segment} notch={notch}><KitSound mode="beats">
    <AtlanticMap at={cue.institutions} until={cue.zurara} drawAt={cue.selected} coastAt={cue.casa} label="ATLANTIC SYSTEM"/>
    <Panel box={{x:120,y:104,w:1680,h:72}} at={cue.portugal} beat/><Copy at={cue.portugal} box={{x:154,y:124,w:760,h:34}} size={30}>PORTUGAL · INSTITUTIONAL AUTHORS</Copy>

    {/* Compressed, portrait (narrower and taller) authors/Casa panel */}
    <Panel box={{x:120,y:220,w:460,h:590}} at={cue.captains}/>
    {authors.map(([name,at],i)=>{
      const y=254+i*58;
      return <React.Fragment key={name}>
        <Copy at={at} box={{x:160,y,w:260,h:32}} size={22} tone="color/fill/gold">{name}</Copy>
        {i<4&&<DrawLine points={[[220,y+34],[220,y+54]]} startFrame={Math.round(at*30/1000)} durationFrames={12} strokeToken="color/fill/gold" strokeWidth={3} end="arrow"/>}
      </React.Fragment>;
    })}
    <Copy at={cue.casa} box={{x:160,y:550,w:380,h:36}} size={24}>ATLANTIC SYSTEM</Copy>
    <Trace points={[[160,594],[520,594]]} drawn={Math.max(0,Math.min(1,(ms-cue.selected)/700))} width={4} strokeToken="color/marker/race" glowToken="color/marker/race"/>

    {/* Moral cover panel */}
    <Panel box={{x:1320,y:220,w:480,h:590}} at={cue.zurara} red/>
    <Copy at={cue.profitable} box={{x:1356,y:280,w:400,h:32}} size={24}>PROFITABLE TRADE</Copy>
    <Copy at={cue.zurara} box={{x:1356,y:380,w:390,h:60}} size={30} tone="color/marker/race">MORAL COVER</Copy>

    {/* Du Bois panel */}
    <Panel box={{x:330,y:835,w:1260,h:72}} at={cue.dubois}/>
    <Copy at={cue.propaganda} box={{x:364,y:855,w:800,h:30}} size={25}>PROPAGANDA OF HISTORY</Copy>
    <Copy at={cue.downward} box={{x:1160,y:857,w:390,h:27}} size={20} tone="color/marker/race">RESPONSIBILITY DOWNWARD</Copy>

    {ms >= cue.zurara && <div data-shared="SourceLine" style={{position:'absolute',right:116,top:928,display:'flex',alignItems:'center',gap:16,opacity:Math.max(0,Math.min(1,(ms-cue.zurara)/267)),pointerEvents:'none'}}>
      <div style={{font:'400 20px "IBM Plex Mono"',lineHeight:1.35,letterSpacing:.35,color:color('color/text/muted'),textAlign:'right',whiteSpace:'nowrap'}}>
        Zurara · Chronicle of Guinea
      </div>
      <QRCode url="https://archive.org/details/chronicleofdisco01zura" size={112}/>
    </div>}
  </KitSound></StageSceneFrame>;
}
