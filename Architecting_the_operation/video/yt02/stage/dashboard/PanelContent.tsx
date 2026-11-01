import React,{useContext} from 'react';
import {ClockContext, GlassPanel, MathText, type InstrumentMode} from '@stage';
import spec from '../handoff/spec.json';
import {color, Tokens} from '../tokens';
import {ComplexWagePlane} from './ComplexWagePlane';
import {Graphic} from './Graphics';
export const instruments: Record<string,any> = spec.instruments;
const fontStyle=(f:any):React.CSSProperties=>({fontFamily:f.family,fontSize:f.size,fontWeight:f.style==='Bold'?700:f.style==='Medium'?500:400,fontStyle:f.style==='Italic'?'italic':'normal',letterSpacing:f.letterSpacing_px??0,lineHeight:`${f.lineHeight_px??Math.round(f.size*1.3)}px`});
const pos=(b:number[]):React.CSSProperties=>({position:'absolute',left:b[0],top:b[1],width:b[2],height:b[3]});
function Nodes({nodes,compact}:{nodes:any[];compact:boolean}) {
 return <>{nodes.map((n,i)=>{
  let own:React.ReactNode;
  if(n.k==='graphic') own=<Graphic node={n} compact={compact}/>;
  else if(n.k==='richText') {
   // Keep authored word positions, while MathText handles each base/subscript group.
   const groups:any[]=[];
   for(const r of n.runs??[]) {const prev=groups[groups.length-1];if(prev&&(r.sub||Math.abs(r.box[0]-(prev.end))<.15&&Math.abs(r.box[1]-prev.box[1])<.15)){prev.text+=r.sub?`_{${r.t}}`:r.t;prev.end=r.box[0]+r.box[2];}else groups.push({box:r.box,text:r.t,end:r.box[0]+r.box[2]});}
   own=<>{groups.map((r,j)=><span key={j} style={{...pos(r.box),...fontStyle(n.font),color:color(n.colour),whiteSpace:'nowrap',width:'max-content'}}><MathText>{r.text}</MathText></span>)}</>;
  } else if(n.k==='text') own=<div style={{...pos(n.box),...fontStyle(n.font),color:color(n.colour),whiteSpace:'pre-wrap'}}>{n.text}</div>;
  else own=<div style={{...pos(n.box),boxSizing:'border-box',background:n.fill?color(typeof n.fill==='string'?n.fill:n.fill.token):undefined,border:n.stroke?`${n.stroke.width}px solid ${color(n.stroke.token)}`:undefined,borderRadius:n.k==='ellipse'?'50%':n.radius??0}}/>;
  return <React.Fragment key={i}>{own}{n.children&&<Nodes nodes={n.children} compact={compact}/ >}{n.parts&&<Nodes nodes={n.parts} compact={compact}/>}</React.Fragment>;
 })}</>;
}
function Settings({data}:{data:any}) {
 const t=spec.settingsTemplate;
 return <><div style={{position:'absolute',left:17.6,top:17.6,width:490,height:28,display:'flex',alignItems:'center',...fontStyle(t.header.title.font),color:color(t.header.title.colour)}}>{data.content.title}</div><div style={{position:'absolute',...pos(t.header.close.box),border:`1.6px solid ${color('color/line/hairline-strong')}`,borderRadius:6,boxSizing:'border-box',textAlign:'center',fontFamily:Tokens.fonts.mono,fontSize:20,lineHeight:'24px'}}>×</div><div style={{position:'absolute',left:17.6,right:17.6,top:61.6,display:'flex',flexDirection:'column',gap:16}}>{t.rows.map((r,i)=>{const key=['source','units','log'][i],text=data.content[key];return <div key={key}><div style={{fontFamily:Tokens.fonts.mono,fontSize:12,letterSpacing:.6,lineHeight:'16px',color:color('color/text/muted'),marginBottom:8}}>{r.label}</div><div style={{background:color('color/surface/well'),borderRadius:6,padding:'8px 10px',...fontStyle(r.valueFont),color:color(r.valueColour)}}>{text.includes('_{')?<MathText>{text}</MathText>:text}</div></div>;})}</div></>;
}
export function PanelContent({name,mode}:{name:string;mode:InstrumentMode}) {
 const {interactive}=useContext(ClockContext);
 const data=instruments[name][mode],compact=mode==='compact';
 return <GlassPanel fill={color(compact?'color/fill/panel-wash':'color/fill/glass')} blur={interactive&&compact?6:0} padding={0} radius={compact?8:10} style={{backdropFilter:interactive&&compact?'blur(6px)':'none',WebkitBackdropFilter:interactive&&compact?'blur(6px)':'none',position:'relative',width:data.w,height:data.h,border:'none',boxShadow:`inset 0 0 0 ${compact?1:1.6}px ${color('color/line/hairline')}`,color:color('color/text/primary')}}>{name==='Wage plane'&&mode==='expanded'?<ComplexWagePlane/>:mode==='settings'?<Settings data={data}/>:<Nodes nodes={data.children} compact={compact}/>}</GlassPanel>;
}
