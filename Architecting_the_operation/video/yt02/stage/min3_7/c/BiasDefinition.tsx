// Stub: replaced by package C of STORYBOARD_MIN3_7.md.
import React from 'react';
import type {SceneProps} from '@stage';
import {color} from '../../tokens';
import {SceneBorder} from '../../dashboard/SceneBorder';
export function BiasDefinition({segment}:SceneProps) {
 return <div style={{position:'absolute',inset:0,width:1920,height:1080,background:color('color/bg/field')}}><SceneBorder segment={segment}/><div style={{position:'absolute',left:0,right:0,top:500,textAlign:'center',font:'500 40px "IBM Plex Mono"',color:color('color/text/dim')}}>BiasDefinition</div></div>;
}
