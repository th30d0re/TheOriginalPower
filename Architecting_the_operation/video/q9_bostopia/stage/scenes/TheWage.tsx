import React from 'react';
import type {SceneProps} from '@stage';
import {Beat, SourceLine} from './shared/Beat';
import {QrMark, bookUrl, cornerQr, cornerSource} from './shared/QrMark';

export function TheWage(_props: SceneProps) {
  return (
    <>
      <Beat id="captives" cue="planters" box={{x: 60, y: 160, w: 960, h: 360}} title="Arms for captives" body="Planters held the enslaved population with the firearms the trade put in their hands." />
      <Beat id="wage" cue="wage" box={{x: 60, y: 560, w: 960, h: 240}} title="The White buffer class, as a wage" />
      <Beat id="mason" cue="sink" bodyCue="date" box={{x: 60, y: 840, w: 960, h: 300}} title="Weaken them, and let them sink." body="Mason, Virginia, 1788. August 1, 2024 is the date in this law." />
      <Beat id="lexington" cue="lexington" bodyCue="muskets" box={{x: 60, y: 1160, w: 960, h: 420}} title="Massachusetts already drew this line" body="In Lexington, April 1775. The British marched on Lexington and Concord to take the colony's arms, and the people met them with muskets, the equivalent of an AR-15." />
      <QrMark id="book-qr" cue="planters" url={bookUrl} x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
      <SourceLine cue="planters" box={cornerSource} text="The Original Power, Ch. 9, §9.3.6 Arms as a Wage" />
    </>
  );
}
