import React from 'react';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import {color} from '../tokens';
import {CompactBorder} from '../dashboard/CompactBorder';

const reveal=(ms:number,at:number,duration=480)=>cubicOut(progress(ms,at,at+duration));
const blocks=[
  {name:'Bias',definition:'a tendency to favor or disfavor people because of group membership',citation:'Greenwald & Banaji 1995',y:220},
  {name:'Prejudice',definition:'antipathy toward a group, grounded in a rigid, erroneous generalization',citation:'Allport 1954, p. 9',y:360},
  {name:'Discrimination',definition:'behavior that treats people differently because of group membership',citation:'',y:500},
] as const;

function LiteratureBlock({index,amount}:{index:number;amount:number}) {
  const block=blocks[index];
  return <div style={{position:'absolute',left:220,top:block.y,width:1480,height:112,display:'grid',gridTemplateColumns:'280px 1fr 300px',alignItems:'center',padding:'0 30px',opacity:amount,transform:`translateY(${20*(1-amount)}px)`,background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`}}>
    <strong style={{fontSize:38,fontWeight:500,color:color('color/fill/gold')}}>{block.name}</strong>
    <span style={{fontSize:28,lineHeight:1.25,color:color('color/text/primary')}}>{block.definition}</span>
    <span style={{font:'400 20px "IBM Plex Mono"',textAlign:'right',color:color('color/text/muted')}}>{block.citation}</span>
  </div>;
}

function Tripartite({amount}:{amount:number}) {
  const components=[['thinking','stereotype'],['feeling','prejudice'],['behavior','discrimination']];
  return <div style={{position:'absolute',left:330,top:668,width:1260,height:166,opacity:amount,transform:`translateY(${20*(1-amount)}px)`}}>
    <svg aria-hidden="true" width="1260" height="166" viewBox="0 0 1260 166" style={{position:'absolute',inset:0,overflow:'visible'}}>
      <path d="M18 16v128h22M18 80H0M18 16h22" fill="none" stroke={color('color/fill/gold')} strokeWidth="3"/>
      <path d="M630 0V-196M1050 0V-56" fill="none" stroke={color('color/line/hairline')} strokeWidth="2"/>
    </svg>
    <div style={{position:'absolute',left:58,right:0,top:18,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
      {components.map(([kind,name])=><div key={kind} style={{height:92,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:color('color/fill/panel-render'),border:`1px solid ${color('color/line/hairline')}`}}>
        <span style={{font:'500 20px "IBM Plex Mono"',letterSpacing:1.4,color:color('color/text/muted')}}>{kind}</span>
        <strong style={{marginTop:8,fontSize:28,fontWeight:500,color:color('color/text/primary')}}>{name}</strong>
      </div>)}
    </div>
    <div style={{position:'absolute',left:58,bottom:0,font:'500 20px "IBM Plex Mono"',letterSpacing:1,color:color('color/fill/gold')}}>Tripartite model · Fiske 1998</div>
  </div>;
}

export function LiteratureStack() {
  const ms=useStageMs();
  const established=useCue('established'),bias=useCue('bias'),prejudice=useCue('prejudice'),discrimination=useCue('discrimination'),tripartite=useCue('tripartite'),stops=useCue('stops');
  const headerIn=reveal(ms,established.at,520);
  const blockCues=[bias.at,prejudice.at,discrimination.at];
  const tripartiteIn=reveal(ms,tripartite.at,560);
  const boundary=cubicOut(progress(ms,stops.at,stops.at+600));
  return <div data-scene="LiteratureStack" style={{position:'absolute',inset:0,width:1920,height:1080,overflow:'hidden',background:color('color/bg/field'),fontFamily:'IBM Plex Sans',color:color('color/text/primary')}}>
    <CompactBorder/>
    {ms>=established.at&&<div style={{position:'absolute',left:220,top:88,fontSize:68,fontWeight:500,opacity:headerIn,transform:`translateY(${18*(1-headerIn)}px)`}}>Established social science</div>}
    {blockCues.map((at,index)=>ms>=at?<LiteratureBlock key={at} index={index} amount={reveal(ms,at)}/>:null)}
    {ms>=tripartite.at&&<Tripartite amount={tripartiteIn}/>} 
    {ms>=stops.at&&<div style={{position:'absolute',left:140,top:893,width:1640,height:110}}>
      <div style={{width:`${boundary*100}%`,height:4,background:color('color/fill/gold'),transformOrigin:'left center'}}/>
      <div style={{marginTop:14,font:'500 21px "IBM Plex Mono"',letterSpacing:1.6,color:color('color/fill/gold'),opacity:boundary}}>where the literature stops</div>
    </div>}
  </div>;
}
