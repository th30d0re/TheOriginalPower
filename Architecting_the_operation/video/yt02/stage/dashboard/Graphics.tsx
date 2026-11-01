import React, {useId} from 'react';
import eras from '../../dashboard_eras.json';
import {color as c} from '../tokens';
// Geometry parameters are the authored JSON schema; graphics consume numeric fields directly.
export function Graphic({node, compact}: {node: any; compact: boolean}) {
 const values=eras.find(era=>era.log===2)!.fields.interference_state;
 const id=useId().replace(/:/g,''), p=node.params, [x,y,w,h]=node.box;
 const well=c('color/surface/well'), accent=c('color/fill/accent'), red=c('color/marker/race');
 let body: React.ReactNode=null;
 if(node.name==='rho_tau dial') {
  const [cx,cy]=p.centre, ro=p.ringRadiusOuter, ri=p.ringRadiusInner;
  const pt=(v:number,r:number)=>[cx+r*Math.cos(Math.PI*(1+v/1.2)),cy+r*Math.sin(Math.PI*(1+v/1.2))];
  const arc=(a:number,b:number)=>`M${pt(a,ro)} A${ro},${ro} 0 0 1 ${pt(b,ro)} L${pt(b,ri)} A${ri},${ri} 0 0 0 ${pt(a,ri)} Z`;
  const ray=(v:number,a:number,b:number,stroke:string,width:number)=>{const u=pt(v,a),q=pt(v,b);return <line x1={u[0]} y1={u[1]} x2={q[0]} y2={q[1]} stroke={c(stroke)} strokeWidth={width} strokeLinecap="round"/>;};
  body=<><path d={arc(0,1.2)} fill={well}/><path d={arc(values.rho_tau![0],values.rho_tau![1])} fill={c(p.range.fill)}/>{p.ticks.drawn&&p.ticks.values.map((v:number)=><React.Fragment key={v}>{ray(v,p.ticks.radiusFrom,p.ticks.radiusTo,p.ticks.stroke,p.ticks.width)}</React.Fragment>)}{ray(p.tauMark.value,p.tauMark.radiusFrom,p.tauMark.radiusTo,p.tauMark.stroke,p.tauMark.width)}{ray((values.rho_tau![0]+values.rho_tau![1])/2,0,p.needle.radius,p.needle.stroke,p.needle.width)}<circle cx={cx} cy={cy} r={p.hub.diameter/2} fill={c(p.hub.fill)}/></>;
 } else if(node.name==='phi track') {
  const [a,b]=values.phi_load!;
  body=<><rect width={w} height={h} rx={p.track.radius} fill={c(p.track.fill)}/><rect x={a*w} width={Math.max(6,(b-a)*w)} height={h} rx={p.pill.radius} fill={c(p.pill.fill)}/></>;
 } else if(node.name==='wage plane') {
  const H=p.halfSize_px,k=p.pxPerUnit,center=p.padding_px+H, a=p.W.arrowhead.size;
  const zone=[[-100,-100],[-100,60-40+70],[100,60-40-70],[100,-100]].map(([u,v])=>`${center+u*k},${center+v*k}`).join(' ');
  const grid=[-75,-50,-25,25,50,75];
  body=<><defs><clipPath id={id}><polygon points={zone}/></clipPath></defs><rect x={p.padding_px} y={p.padding_px} width={2*H} height={2*H} fill={well} stroke={c(p.box.stroke)} strokeWidth={p.box.strokeWidth}/><polygon points={zone} fill={c(p.tauZone.fill)}/><g clipPath={`url(#${id})`}>{Array.from({length:Math.ceil(4*H/(compact?6:11))+1},(_,i)=>{const d=-2*H+i*(compact?6:11);return <line key={i} x1={center-H} y1={center-H+d} x2={center+H} y2={center+H+d} stroke={c(p.hatch.stroke)} strokeWidth={p.hatch.width}/>;})}</g>{!compact&&<><line x1={center-H} y1={center+90*k} x2={center+H} y2={center-50*k} stroke={red} strokeWidth={1.6} strokeDasharray="6 4"/>{grid.map(v=><g key={v} stroke={c('color/line/chart-faint')}><line x1={center+v*k} x2={center+v*k} y1={center-H} y2={center+H}/><line y1={center+v*k} y2={center+v*k} x1={center-H} x2={center+H}/></g>)}</>}<circle cx={center} cy={center} r={H} fill="none" stroke={c(p.clockFace.stroke)} strokeWidth={p.clockFace.width} strokeDasharray={p.clockFace.dash.join(' ')}/>{!compact&&Array.from({length:12},(_,i)=>{const t=i*Math.PI/6;return <line key={i} x1={center+(H-6*k)*Math.sin(t)} y1={center+(H-6*k)*Math.cos(t)} x2={center+H*Math.sin(t)} y2={center+H*Math.cos(t)} stroke={c('color/line/hairline-strong')} strokeWidth={1.2}/>;})}<path d={`M${center-H-(compact?0:8)} ${center} H${center+H+(compact?0:8)} M${center} ${center-H-(compact?0:8)} V${center+H+(compact?0:8)}`} stroke={c(p.axes.stroke)} strokeWidth={p.axes.width}/>{!compact&&<circle cx={center} cy={center} r={60*k} fill="none" stroke={c(p.arcAtW.stroke)} strokeWidth={p.arcAtW.width} strokeDasharray={p.arcAtW.dash.join(' ')}/>}<line x1={center} y1={center} x2={center+60*k-a*.6} y2={center} stroke={accent} strokeWidth={p.W.vector.width} strokeLinecap="round"/><path d={`M${center+60*k} ${center} l${-a} ${-a/2} v${a} Z`} fill={accent}/>{p.W.origin&&<circle cx={center} cy={center} r={p.W.origin.diameter/2} fill={accent}/>}</>;
 } else if(node.name==='q(t) response') {
  const N=compact?400:600,{PL,PR,PT,PB}=compact?p.padding_compact:p.padding_expanded;
  const alpha=p.zeta*p.omega_n_rad_per_yr, omega=p.omega_d,T=p.T_yr;
  const q=Array.from({length:N+1},(_,i)=>Math.exp(-alpha*i/N*T)*Math.sin(omega*i/N*T));
  const A=Math.max(...q.map(Math.abs)), yy=(v:number)=>PT+(1.15*A-v)/(2.1*A)*(h-PT-PB),xx=(t:number)=>PL+t/T*(w-PL-PR),base=yy(0);
  body=<><rect width={w} height={h} rx={compact?4:6} fill={well}/><rect x={PL} y={base} width={w-PL-PR} height={h-PB-base} fill={c('color/fill/red-faint')}/>{!compact&&[20,40,60].map(t=><g key={t}><line x1={xx(t)} x2={xx(t)} y1={PT} y2={h-PB} stroke={c('color/line/chart-faint')}/><text x={xx(t)} y={h-8} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={11} fill={c('color/text/muted')}>{1865+t}</text></g>)}<path d={`M${PL} ${PT- (compact?0:4)} V${h-PB} M${PL} ${base} H${w-PR}`} fill="none" stroke={c('color/line/wire')} strokeWidth={compact?.8:1.6}/><line x1={PL+(compact?3:6)} x2={PL+(compact?3:6)} y1={base} y2={PT+(compact?1:10)} stroke={c('color/fill/gold')} strokeWidth={compact?1.5:3} strokeLinecap="round"/>{q.slice(1).map((v,i)=>{const x1=xx(i/N*T),x2=xx((i+1)/N*T),before=q[i];if(before*v<0){const z=x1+(x2-x1)*(-before)/(v-before);return <g key={i}><path d={`M${x1} ${yy(before)} L${z} ${base}`} stroke={before>=0?accent:red}/><path d={`M${z} ${base} L${x2} ${yy(v)}`} stroke={v>=0?accent:red}/></g>;}return <path key={i} d={`M${x1} ${yy(before)} L${x2} ${yy(v)}`} stroke={v>=0?accent:red}/>;})}</>;
 } else if(node.name==='RLC schematic') {
  body=p.vectors.map((v:any,i:number)=>v.ellipse?<ellipse key={i} cx={v.ellipse[0]-x+v.ellipse[2]/2} cy={v.ellipse[1]-y+v.ellipse[3]/2} rx={v.ellipse[2]/2} ry={v.ellipse[3]/2} fill="none" stroke={c(v.stroke)} strokeWidth={v.width}/>:<path key={i} transform={`translate(${v.box[0]-x},${v.box[1]-y})`} d={v.d} fill="none" stroke={c(v.stroke)} strokeWidth={v.width} strokeLinecap={v.cap} strokeLinejoin={v.join}/>);
 }
 return <svg width={w} height={h} style={{position:'absolute',left:x,top:y,overflow:'visible'}} fill="none" strokeWidth={compact?1.5:3} strokeLinecap="round">{body}</svg>;
}
