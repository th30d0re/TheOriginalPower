import React from 'react';
import type {Segment} from '@stage';
import {CardBorder} from './CardBorder';
import {useNotch} from './notch';
// The card border for a scene: its notch collapses or expands at map show/hide boundaries.
export function SceneBorder({segment}:{segment:Segment}) {
 return <CardBorder notch={useNotch(segment)}/>;
}
