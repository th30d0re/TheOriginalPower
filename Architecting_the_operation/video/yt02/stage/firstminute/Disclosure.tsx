import React from 'react';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import {color} from '../tokens';
import {CompactBorder} from '../dashboard/CompactBorder';
import waveform from './data/waveform_t5.json';

const WIDTH=1400,HEIGHT=170,CENTER=HEIGHT/2;
const maxRms=Math.max(...waveform.rms);
const points=waveform.rms.map((value,index)=>{
  const x=index/(waveform.rms.length-1)*WIDTH;
  const amplitude=Math.sqrt(value/maxRms)*(HEIGHT*.43);
  return {x,amplitude};
});
const upper=points.map(({x,amplitude},index)=>`${index?'L':'M'}${x.toFixed(2)},${(CENTER-amplitude).toFixed(2)}`).join(' ');
const lower=[...points].reverse().map(({x,amplitude})=>`L${x.toFixed(2)},${(CENTER+amplitude).toFixed(2)}`).join(' ');
const waveformPath=`${upper} ${lower} Z`;
const cloneColor=(amount:number)=>`rgba(${Math.round(232+(224-232)*amount)},${Math.round(201+(163-201)*amount)},${Math.round(155+(60-155)*amount)},1)`;

export function Disclosure() {
  const ms=useStageMs(),narration=useCue('narration'),clone=useCue('clone');
  const visible=cubicOut(progress(ms,narration.at,narration.at+650));
  const cloneGold=cubicOut(progress(ms,clone.at,clone.at+450));
  const played=progress(ms,waveform.start_ms,waveform.end_ms);
  const playhead=played*WIDTH;
  return <div data-scene="Disclosure" style={{position:'absolute',inset:0,width:1920,height:1080,overflow:'hidden',background:color('color/bg/field'),fontFamily:'IBM Plex Sans',color:color('color/text/primary')}}>
    <CompactBorder/>
    {ms>=narration.at&&<div style={{position:'absolute',left:245,top:320,width:1430,textAlign:'center',opacity:visible,transform:`translateY(${10*(1-visible)}px)`}}>
      <div style={{fontSize:40,lineHeight:1.48,fontWeight:400}}>
        <span>This narration uses an artificial intelligence </span>
        <span style={{color:cloneColor(cloneGold)}}>voice clone</span>
        <span> trained on my speech for long-form exposition.</span>
      </div>
    </div>}
    {ms>=narration.at&&<div style={{position:'absolute',left:260,top:570,width:WIDTH,height:HEIGHT,opacity:visible}}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-label="Narration amplitude envelope">
        <defs><clipPath id="disclosure-wave-played"><rect x="0" y="0" width={playhead} height={HEIGHT}/></clipPath></defs>
        <line x1="0" y1={CENTER} x2={WIDTH} y2={CENTER} stroke={color('color/line/graticule')} strokeWidth="1"/>
        <path d={waveformPath} fill={color('color/text/dim')} opacity=".42"/>
        <path d={waveformPath} fill={color('color/fill/gold')} opacity=".9" clipPath="url(#disclosure-wave-played)"/>
        <line x1={playhead} y1="4" x2={playhead} y2={HEIGHT-4} stroke={color('color/text/accent')} strokeWidth="2"/>
      </svg>
      <div style={{marginTop:22,textAlign:'center',font:'400 22px "IBM Plex Mono"',letterSpacing:.7,color:color('color/text/muted')}}>Narrator: Emmanuel Theodore, author of The Original Power</div>
    </div>}
  </div>;
}
