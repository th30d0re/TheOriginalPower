import React,{useId} from 'react';
import {MathText} from '@stage';
import {Tokens} from '../tokens';
// Port of the supplied artifact: buildStatic, clipDanger, elite and render.
export const wageModel={M0:60,tau:40,a:1,b:.7,smax:80,m:0,s:60};
export function wageReadings(model=wageModel) {
 const {M0,tau,a,b,smax,m,s}=model,theta=Math.atan2(s,m)*180/Math.PI;
 const minutes=((Math.round((6-theta/30)*60)%720)+720)%720;
 return {theta,magnitude:Math.hypot(m,s),clock:`${Math.floor(minutes/60)||12}:${String(minutes%60).padStart(2,'0')}`,quadrant:m>=0?(s>=0?1:4):(s>=0?2:3),M:M0-a*m-b*s,margin:tau-(M0-a*m-b*s),elite:{s:smax,m:Math.max(-100,Math.min(100,(M0-tau-b*smax)/a))}};
}
export function dangerPolygon(model=wageModel) {
 const {M0,tau,a,b}=model,poly=[[-100,-100],[100,-100],[100,100],[-100,100]],out:number[][]=[];
 const f=([s,m]:number[])=>a*m+b*s-(M0-tau);
 for(let i=0;i<4;i++){const A=poly[i],B=poly[(i+1)%4],fa=f(A),fb=f(B);if(fa<=0)out.push(A);if(fa*fb<0){const t=fa/(fa-fb);out.push([A[0]+t*(B[0]-A[0]),A[1]+t*(B[1]-A[1])]);}}
 return out;
}
const palette={plane:'#0D1B2A',ink:'#ECE7DC',muted:'#A9B6C4',bronze:'#8A6A45',red:'#FF7A6B',green:'#62CC9E',accent:'#E08A3C',hi:'#F7C38E'};
export function ComplexWagePlane() {
 const id=useId().replace(/:/g,''),c=palette,r=wageReadings(),K=2.1,CX=300,CY=275;
 const sx=(s:number)=>CX+s*K,sy=(m:number)=>CY+m*K;
 const polar=(degrees:number)=>{const t=degrees*Math.PI/180;return [sx(60*Math.sin(t)),sy(60*Math.cos(t))];};
 const zone=dangerPolygon().map(([s,m])=>`${sx(s)},${sy(m)}`).join(' ');
 const rows=[['Angle θ','90.0°'],['Size |W|','60.0'],['Clock position',r.clock],['Quadrant','QI · Joint wage'],['M',`${r.M.toFixed(1)} (τ = 40)`],['Margin to τ',`${r.margin.toFixed(1)} below τ`]];
 return <div data-artifact="Complex Wage Plane" style={{position:'absolute',inset:17.6,fontFamily:Tokens.fonts.sans,color:c.ink}}>
 <div style={{fontSize:18,fontWeight:500}}>Complex Wage Plane</div>
 <svg width={600} height={570} viewBox="0 0 600 570" style={{position:'absolute',left:0,top:30}} fontFamily={Tokens.fonts.mono} fontSize={12} fill={c.ink}>
 <defs>
 <pattern id={`${id}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke={c.ink} strokeOpacity=".25" strokeWidth="1.5"/></pattern>
 <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" x="80" y="55" width="440" height="440"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 {['bronze','red','green','accent'].map(key=><marker key={key} id={`${id}-${key}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill={c[key as keyof typeof c]}/></marker>)}
 </defs>
 <rect data-plane-size="420" x={90} y={65} width={420} height={420} fill={c.plane} stroke={c.bronze} strokeWidth={1.5}/>
 {[-75,-50,-25,25,50,75].map(g=><g key={g} stroke={c.bronze} strokeOpacity={.5}><line x1={sx(g)} x2={sx(g)} y1={65} y2={485}/><line y1={sy(g)} y2={sy(g)} x1={90} x2={510}/></g>)}
 <polygon points={zone} fill={c.ink} opacity={.05}/><polygon points={zone} fill={`url(#${id}-hatch)`}/>
 <line x1={sx(-100)} y1={sy(90)} x2={sx(100)} y2={sy(-50)} stroke={c.ink} strokeWidth={2}/>
 <text transform={`translate(${CX},${sy(20)}) rotate(-34.99)`} dy={-9} textAnchor="middle">τ boundary · M = τ</text>
 <circle cx={CX} cy={CY} r={210} fill="none" stroke={c.bronze} strokeWidth={1.2} strokeDasharray="2 6"/>
 {Array.from({length:12},(_,i)=>{const t=(6-i)*Math.PI/6,x=Math.sin(t),y=Math.cos(t);return <g key={i}><line x1={CX+197.4*x} y1={CY+197.4*y} x2={CX+210*x} y2={CY+210*y} stroke={c.bronze} strokeWidth={1.5}/>{i%3!==0&&<text x={CX+227*x} y={CY+227*y} textAnchor="middle" dominantBaseline="middle" fill={c.muted}>{i}</text>}</g>;})}
 <line x1={90} y1={CY} x2={526} y2={CY} stroke={c.bronze} strokeWidth={2} markerEnd={`url(#${id}-bronze)`}/>
 <line x1={CX} y1={CY} x2={CX} y2={501} stroke={c.green} strokeWidth={2} markerEnd={`url(#${id}-green)`}/>
 <line x1={CX} y1={CY} x2={CX} y2={24} stroke={c.red} strokeWidth={2} markerEnd={`url(#${id}-red)`}/>
 <text x={535} y={CY-12}><MathText svg>{'ψ_s (+)'}</MathText></text><text x={535} y={CY+10} fontSize={10}>3 o’clock</text><text x={535} y={CY+26}>90°</text>
 <text x={80} y={CY-12} textAnchor="end"><MathText svg>{'ψ_s (−)'}</MathText></text><text x={80} y={CY+10} textAnchor="end" fontSize={10}>9 o’clock</text><text x={80} y={CY+26} textAnchor="end">−90°</text>
 <text x={CX+16} y={28} fill={c.red}><MathText svg>{'ψ_m (−) · extraction'}</MathText></text><text x={CX+16} y={47} fill={c.muted}>12 o’clock · 180°</text>
 <text x={CX} y={532} textAnchor="middle" fill={c.green}><MathText svg>{'ψ_m (+) · 6 o’clock · 0°'}</MathText></text>
 {[-50,50].map(v=><g key={v} fill={c.muted} fontSize={11}><text x={sx(v)} y={CY+18} textAnchor="middle">{v}</text><text x={CX+8} y={sy(v)+4}>{v}</text></g>)}
 {[[1,55,66,'Joint wage'],[2,55,-66,'Fascism zone'],[3,-55,-66,'Buffer demotion'],[4,-55,66,'Solidarity side']].map(([q,s,m,name])=><g key={q} textAnchor="middle" fill={q===1?c.ink:c.muted}><text x={sx(Number(s))} y={sy(Number(m))} fontFamily={Tokens.fonts.sans} fontSize={16}>{name}</text><text x={sx(Number(s))} y={sy(Number(m))+17} fontSize={10}>{['','QI · manuscript','QII · manuscript','QIII · proposed','QIV · proposed'][Number(q)]}</text></g>)}
 {Array.from({length:180},(_,i)=>{const deg=-180+i*2,a=polar(deg),b=polar(deg+2),t=(deg+1)*Math.PI/180,bad=60-60*Math.cos(t)-.7*60*Math.sin(t)>40;return <path key={i} d={`M${a} L${b}`} fill="none" stroke={bad?c.red:c.green} strokeWidth={4} opacity={.5}/>;})}
 <circle cx={CX} cy={sy(60)} r={6} fill={c.green} stroke={c.plane} strokeWidth={2}/><text x={CX+11} y={sy(60)+5} fill={c.green} fontSize={11}>6:00 ideal</text>
 <path d={`M${sx(r.elite.s)} ${sy(r.elite.m)-10} l10 10 l-10 10 l-10 -10 Z`} fill={c.red} stroke={c.plane} strokeWidth={2}/><text x={sx(r.elite.s)-15} y={sy(r.elite.m)+5} textAnchor="end" fill={c.red} fontSize={11}>Elite optimum 2:12</text>
 <line x1={CX} y1={CY} x2={sx(60)-5} y2={CY} stroke={c.accent} strokeWidth={5} markerEnd={`url(#${id}-accent)`} filter={`url(#${id}-glow)`}/><line x1={CX+5} y1={CY-1.3} x2={sx(60)-15} y2={CY-1.3} stroke={c.hi} strokeWidth={1.4}/>
 <path d={`M${CX} ${CY+34} A34 34 0 0 0 ${CX+34} ${CY}`} fill="none" stroke={c.bronze} strokeWidth={2}/><text x={CX+36} y={CY+40} fontSize={18}>θ</text>
 <circle cx={CX} cy={CY} r={10} fill={c.plane} stroke={c.bronze} strokeWidth={2}/><circle cx={CX} cy={CY} r={2.5} fill={c.bronze}/><text x={CX-18} y={CY-16} textAnchor="end" fill={c.muted}>Buffer class</text>
 <circle cx={sx(60)} cy={CY} r={16} fill={c.accent} fillOpacity={.26} stroke={c.accent} strokeOpacity={.8}/><text x={sx(60)+20} y={CY+26} fill={c.accent} fontSize={24}>W</text><text x={CX+63} y={CY-13} textAnchor="middle"><MathText svg>{'ψ_s = 60'}</MathText></text>
 </svg>
 <div style={{position:'absolute',left:620,top:65,width:285}}><div style={{fontSize:24,color:c.accent,marginBottom:12}}>pure status</div><div style={{fontSize:17,marginBottom:20}}><MathText>{'W = jψ_s'}</MathText></div>{rows.map(([label,value])=><div key={label} style={{marginBottom:14}}><div style={{fontFamily:Tokens.fonts.mono,fontSize:11,color:c.muted}}>{label}</div><div style={{fontSize:19,lineHeight:'26px'}}>{value}</div></div>)}
 <div style={{fontFamily:Tokens.fonts.mono,fontSize:12,marginTop:16}}>M = 18.0　τ = 40</div><svg width={280} height={34} role="img" aria-label="M 18, threshold 40, scale 0 to 150"><rect y={8} width={280} height={10} rx={5} fill="#091521"/><rect y={8} width={280*r.M/150} height={10} rx={5} fill={c.green}/><line x1={280*40/150} x2={280*40/150} y1={3} y2={23} stroke={c.red} strokeWidth={2}/><text y={34} fill={c.muted} fontSize={10}>0</text><text x={260} y={34} fill={c.muted} fontSize={10}>150</text></svg>
 </div>
 <div style={{position:'absolute',left:0,right:0,bottom:0,display:'flex',gap:20,fontSize:12,color:c.muted}}><span>▧ τ zone: M above τ</span><span style={{color:c.accent}}>━ W</span><span style={{color:c.red}}>◆ Elite optimum</span><span style={{color:c.green}}>● 6 o’clock ideal</span><span>Arc at the current |W|</span></div>
 </div>;
}
