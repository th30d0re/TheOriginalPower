import React from 'react';
import {useCue,useStageMs,usePlan,flyTo,cubicInOut,progress,type SceneProps,type ModeKey,type FlyKey} from '@stage';
import {Dashboard,slugs,type DashboardProps} from './dashboard/Dashboard';
export function DashboardBoot() {
 const ms=useStageMs(),plan=usePlan();
 return <Dashboard world empty dim={.3} lights={slugs.map((_,i)=>{const at=plan.cues[`i${i+1}`];return at===undefined?.3:.3+.7*progress(ms,at,at+250);})} routeDraw={0}/>;
}
export function Dashboard1486({shotAt}:SceneProps) {
 const ms=useStageMs(),plan=usePlan(),fly=useCue('fly'),route=useCue('route');
 const props=(shotAt(ms)?.props??{}) as DashboardProps & {cameraKeys?:FlyKey[]};
 const camera=flyTo(ms,props.cameraKeys??[{at:fly.at,camera:{center:[0,0],zoom:1856/360}},{at:fly.at+2200,camera:{center:[8,24.2],zoom:19.5}}],cubicInOut);
 const timelines:Record<string,ModeKey[]>={};
 for(const slug of slugs) {
  timelines[slug]=Object.entries(plan.cues).flatMap(([name,at])=>{
   const local=name.includes('.')?name.slice(name.indexOf('.')+1):name;
   const [action,target]=local.split(':');
   if(target!==slug||!['expand','collapse','settings'].includes(action))return [];
   return [{at,mode:action==='expand'?'expanded' as const:action==='settings'?'settings' as const:'compact' as const}];
  }).filter((k,i,all)=>all.findIndex(v=>v.at===k.at&&v.mode===k.mode)===i).sort((a,b)=>a.at-b.at);
 }
 return <Dashboard {...props} camera={props.camera??camera} world={ms<=fly.at} worldOpacity={1-progress(ms,fly.at,fly.at+800)} routeDraw={props.routeDraw??progress(ms,route.at,route.at+3400)} modeTimelines={{...timelines,...props.modeTimelines}}/>;
}
