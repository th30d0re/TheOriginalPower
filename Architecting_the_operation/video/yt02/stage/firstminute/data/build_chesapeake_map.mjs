import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const engineRequire=createRequire('/Users/emmanuel/Documents/Theory/scriptCast-stage/video/package.json');
const {geoEqualEarth,geoPath}=engineRequire('d3-geo');
const {feature}=engineRequire('topojson-client');
const atlas=engineRequire('world-atlas/countries-50m.json');
const width=320,height=180,center=[-76.3,37.5],extent=[[-79,35.1],[-73.6,40.1]];
const projection=geoEqualEarth().translate([width/2,height/2]).center(center).scale(1).translate([0,0]);
const points=Array.from({length:181},(_,index)=>{
  const t=index/180;
  return [
    [extent[0][0]+(extent[1][0]-extent[0][0])*t,extent[0][1]],
    [extent[0][0]+(extent[1][0]-extent[0][0])*t,extent[1][1]],
    [extent[0][0],extent[0][1]+(extent[1][1]-extent[0][1])*t],
    [extent[1][0],extent[0][1]+(extent[1][1]-extent[0][1])*t],
  ];
}).flat().map(point=>projection(point));
const x=Math.max(...points.map(point=>Math.abs(point[0]))),y=Math.max(...points.map(point=>Math.abs(point[1])));
projection.scale(Math.min(width/(2*x),height/(2*y))).translate([width/2,height/2]).clipExtent([[0,0],[width,height]]);
const land=feature(atlas,atlas.objects.land);
const path=geoPath(projection).digits(2)(land);
if(!path)throw new Error('Equal Earth Chesapeake coastline path is empty');
const output=resolve(dirname(fileURLToPath(import.meta.url)),'chesapeake_coastline.json');
writeFileSync(output,JSON.stringify({width,height,projection:'Equal Earth',source:'world-atlas countries-50m land',center,extent,path},null,2)+'\n');
console.log(`wrote ${output} (${path.length} path characters)`);
