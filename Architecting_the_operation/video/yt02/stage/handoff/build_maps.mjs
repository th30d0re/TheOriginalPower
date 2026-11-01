// Emits map_iberia_westafrica.svg, map_world.svg and map_overlay.json (route, rhumb hubs, compass rose, named points)
// Data: world-atlas countries-50m (Natural Earth). Run: node build_maps.mjs
// Map size = the full inner area of the dashboard frame: 1856 x 968 (inside the compact border, below the era strip).
import { writeFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const VIDEO = '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules';
const imp = (p) => import(pathToFileURL(path.join(VIDEO, p)).href);
const d3 = await imp('d3-geo/src/index.js');
const topo = await imp('topojson-client/src/index.js');
const OUT = path.dirname(new URL(import.meta.url).pathname);

const W = 1856, H = 968; // clip frame inside the compact border: x 32..1888, y 84..1052 (era strip above, border line at 20/1900/1060)
const C = { land: '#14263a', cream: '#e8c99b', gold: '#e0a33c' };
const world = JSON.parse(readFileSync(path.join(VIDEO, 'world-atlas/countries-50m.json'), 'utf8'));
const countries = topo.feature(world, world.objects.countries);
const land = topo.feature(world, world.objects.land);
const borders = topo.mesh(world, world.objects.countries, (a, b) => a !== b);
const portugal = countries.features.find((f) => String(f.id) === '620');
if (!portugal) throw new Error('Portugal (620) not found');

// graticule every 10 degrees: meridians pole to pole, parallels -80..80, both ending exactly on the sphere edge
const gratLines = [];
for (let lon = -180; lon <= 180; lon += 10) gratLines.push(Array.from({ length: 181 }, (_, i) => [lon, -90 + i]));
for (let lat = -80; lat <= 80; lat += 10) gratLines.push(Array.from({ length: 361 }, (_, i) => [-180 + i, lat]));
const grat = { type: 'MultiLineString', coordinates: gratLines };

function svg(projection, name, data = { land, borders, portugal }) {
  const { land: L, borders: B, portugal: PT } = data;
  projection.clipExtent([[0, 0], [W, H]]);
  const P = d3.geoPath(projection);
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">`);
  parts.push(`<g id="graticule"><path id="graticule 10deg" d="${P(grat)}" stroke="${C.cream}" stroke-opacity="0.16" stroke-width="0.8"/></g>`);
  parts.push(`<g id="land"><path id="land fill" d="${P(L)}" fill="${C.land}" stroke="${C.cream}" stroke-width="1.1" stroke-linejoin="round"/></g>`);
  parts.push(`<g id="borders"><path id="country borders" d="${P(B)}" stroke="${C.cream}" stroke-opacity="0.55" stroke-width="0.7"/></g>`);
  parts.push(`<path id="country 620 Portugal" d="${P(PT)}" fill="${C.gold}" stroke="${C.cream}" stroke-width="1.2" stroke-linejoin="round"/>`);
  parts.push('</svg>');
  writeFileSync(path.join(OUT, name), parts.join('\n'));
}

// Iberia / West Africa: equirectangular, 19.5 px/deg (86 deg of longitude across 1772 px), centred on lon 8 / lat 24.2.
// Framing keeps Portugal, the route and its labels clear of the floating panels (open Atlantic left, Levant right).
const pxPerDeg = 19.5; // 90.9 deg of longitude across 1772 px, 42.3 deg of latitude across 824 px
const iberia = d3.geoEquirectangular().scale(pxPerDeg * 180 / Math.PI).center([8, 24.2]).translate([W / 2, H / 2]);
svg(iberia, 'map_iberia_westafrica.svg');

// World: Natural Earth, fitted inside the frame, 110m atlas (50m detail is below one pixel at world scale).
const worldProj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' });
const w110 = JSON.parse(readFileSync(path.join(VIDEO, 'world-atlas/countries-110m.json'), 'utf8'));
const c110 = topo.feature(w110, w110.objects.countries);
svg(worldProj, 'map_world.svg', {
  land: topo.feature(w110, w110.objects.land),
  borders: topo.mesh(w110, w110.objects.countries, (a, b) => a !== b),
  portugal: c110.features.find((f) => String(f.id) === '620'),
});

// ---- overlay geometry (drawn as editable vectors in Figma) ----
const named = {
  Lisbon: [-9.14, 38.72],
  'Cape Bojador': [-14.5, 26.1],
  'Cape Verde': [-17.5, 14.7],
  Elmina: [-1.35, 5.08],
};
// sea route: every waypoint offshore (lon, lat); the four named points keep their coastal markers.
const waypoints = [
  [-9.14, 38.72],            // Lisbon (marker)
  [-9.30, 38.64],            // Tagus mouth
  [-9.6, 38.6],              // Lisbon offshore
  [-9.5, 36.8],              // off Cape St Vincent
  [-10.5, 32.5],             // off Cape Cantin
  [-15.2, 26.1],             // Cape Bojador offshore
  [-17.5, 20.8],             // Cape Blanc (offshore side)
  [-18.0, 14.7],             // Cape Verde offshore
  [-17.8, 11.2], [-15.8, 8.8], [-13.8, 7.0], [-11.6, 5.1], [-9.4, 4.4], // around the Guinea-Sierra Leone bulge
  [-7.9, 4.2],               // Cape Palmas
  [-5.0, 4.3], [-2.6, 4.35], // Ivory Coast / Cape Three Points, kept south of the coast
  [-1.35, 4.8],              // Elmina offshore
];
const pts = waypoints.map((p) => iberia(p));
function catmull(pts, t = 0.4) {
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const k = t / 3;
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}
const route = { d: catmull(pts), points: pts };

// land check: sample the spline and report any point that falls on land (50m atlas)
function bez(p0, c1, c2, p1, t) { const u = 1 - t; return [u*u*u*p0[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*p1[0], u*u*u*p0[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*p1[1]]; }
const segs = [...route.d.matchAll(/M ([\d.\-]+) ([\d.\-]+)|C ([\d.\-]+) ([\d.\-]+) ([\d.\-]+) ([\d.\-]+) ([\d.\-]+) ([\d.\-]+)/g)];
let cur = null; const hits = [];
for (const m of segs) {
  if (m[1] !== undefined) { cur = [+m[1], +m[2]]; continue; }
  const c1 = [+m[3], +m[4]], c2 = [+m[5], +m[6]], p1 = [+m[7], +m[8]];
  for (let k = 0; k <= 40; k++) { const q = bez(cur, c1, c2, p1, k / 40); const ll = iberia.invert(q); if (d3.geoContains(land, ll)) hits.push(ll.map((v) => +v.toFixed(2))); }
  cur = p1;
}
console.log('route land hits:', hits.length, JSON.stringify(hits));

const namedPx = Object.fromEntries(Object.entries(named).map(([k, v]) => [k, iberia(v)]));
const hubs = [[-26, 31], [-30, 13], [-5, 12], [-2, 38]].map((g) => iberia(g));
const roseCentre = iberia([-33, 21]);
function rose(cx, cy, R) {
  const p = [];
  for (let i = 0; i < 32; i++) {
    const a = (i * 11.25) * Math.PI / 180;
    const r = i % 8 === 0 ? R : i % 4 === 0 ? R * 0.72 : i % 2 === 0 ? R * 0.5 : R * 0.2;
    p.push([cx + r * Math.sin(a), cy - r * Math.cos(a)]);
  }
  return 'M ' + p.map((q) => q[0].toFixed(2) + ' ' + q[1].toFixed(2)).join(' L ') + ' Z';
}
const overlay = {
  size: [W, H],
  iberia: { route, named: namedPx, hubs, roseCentre, roseStar: rose(0, 0, 70), portugalCentroid: iberia(d3.geoCentroid(portugal)) },
  worldPortugalCentroid: worldProj(d3.geoCentroid(portugal)),
};
writeFileSync(path.join(OUT, 'map_overlay.json'), JSON.stringify(overlay, null, 1));
console.log('ok', Object.keys(namedPx).map((k) => k + ' ' + namedPx[k].map((v) => v.toFixed(0))).join(' | '));
