import React from 'react';
import {color} from '../../tokens';
import type {PersonGroup} from './types';

export type PersonMarkProps = {
  x: number;
  y: number;
  group: PersonGroup;
  emphasis: number;
  scale: number;
};

const groupColor = (group: PersonGroup) => group === 'ingroup'
  ? color('color/fill/gold')
  : group === 'outgroup' ? color('color/marker/race') : color('color/text/muted');

export function PersonMark({x, y, group, emphasis:rawEmphasis, scale}: PersonMarkProps) {
  const emphasis=Math.max(0,Math.min(1,rawEmphasis)), size=44*Math.max(.2,scale);
  return <div data-shared="PersonMark" data-group={group} style={{position:'absolute', left:x, top:y, width:size, height:size*1.3, transform:'translate(-50%,-50%)', opacity:.42+.58*emphasis, color:groupColor(group)}}>
    <svg width="100%" height="100%" viewBox="0 0 44 58" fill="none" aria-hidden="true">
      <circle cx="22" cy="12" r="8" fill="currentColor"/>
      <path d="M9 51C9 34 14 25 22 25C30 25 35 34 35 51" stroke="currentColor" strokeWidth={3+2*emphasis} strokeLinecap="round"/>
      <path d="M5 37H39" stroke="currentColor" strokeWidth={2+emphasis} strokeLinecap="round"/>
    </svg>
  </div>;
}

