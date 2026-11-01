import {createProjection,type Camera,type MapFit} from '@stage';
export const mapSize=[1856,968] as const;
export const iberiaFit:MapFit={center:[5,22.2],pxPerDeg:19.5,extent:[[-30,2.0],[40,42.4]]};
export const regionalProjection=createProjection(iberiaFit,'equalEarth',...mapSize);
export const worldProjection=createProjection({center:[0,0],zoom:1},'equalEarth',...mapSize);
// Camera zoom is an Equal Earth world-scale multiplier, matching flyTo's units.
export const worldCamera:Camera={center:[0,0],zoom:1};
export const iberiaCamera:Camera={center:[5,22.2],zoom:regionalProjection.scale()/worldProjection.scale()};
export const labelOffsets=[[-63,-7],[-110.5,-7],[-93.5,-7],[14,-7]];
