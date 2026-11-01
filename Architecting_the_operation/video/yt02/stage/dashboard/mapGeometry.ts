import {createProjection,type Camera,type MapFit} from '@stage';
export const mapSize=[1856,968] as const;
// Re-framed for the always-on instrument tray (tray top edge at map-clip y=860): the whole
// Lisbon → Elmina route (y 84.3..843.4), its labels, and Portugal sit above the tray and clear
// of both stacks. Equal Earth, scale 1137.92 (Portugal mainland 102.18px, within the approved
// ±10% band of the handoff's 100.07px); 1296-sample land-hit check: 0 hits.
export const iberiaFit:MapFit={center:[5,20],pxPerDeg:19.5,extent:[[-31.75,-1.21],[41.75,41.21]]};
export const regionalProjection=createProjection(iberiaFit,'equalEarth',...mapSize);
export const worldProjection=createProjection({center:[0,0],zoom:1},'equalEarth',...mapSize);
// Camera zoom is an Equal Earth world-scale multiplier, matching flyTo's units.
export const worldCamera:Camera={center:[0,0],zoom:1};
export const iberiaCamera:Camera={center:[5,20],zoom:regionalProjection.scale()/worldProjection.scale()};
export const labelOffsets=[[-63,-7],[-110.5,-7],[-93.5,-7],[14,-7]];
