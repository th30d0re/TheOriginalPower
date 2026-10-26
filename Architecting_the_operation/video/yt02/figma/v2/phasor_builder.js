// Draws one SEG 10 wage-phasor frame from a phasor_specs.json entry, in the style of "wage S10-06".
// Run through use_figma with "const SPEC = <entry>;" prepended. θ opens from the downward ψ_m axis
// toward ψ_s; past 90° the arrow rises into Quadrant II (upper-right).
// Motion: W sits in a rig frame centred on the origin, so ROTATION pivots there; the ψ_m / ψ_s
// components and the dashed projections are rig frames scaled (and translated) by cos θ and sin θ.
const page = await figma.getNodeByIdAsync("64:3"); await figma.setCurrentPageAsync(page);
const V = async id => figma.variables.getVariableByIdAsync(id);
const C = { field: await V("VariableID:1:18"), chart: await V("VariableID:1:20"), text: await V("VariableID:1:22"), textAccent: await V("VariableID:1:23"), textDim: await V("VariableID:1:24"), fillAccent: await V("VariableID:1:25"), s1: await V("VariableID:9:490") };
const bp = v => [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", v)];
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = h => [{ type: "SOLID", color: rgb(h) }];
const MAT = "#5FC27E", STAT = "#D9A441", RED = "#E2573F", INK = "#F4EAD2", DIMC = "#9FB0CF";
const TS = Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s => [s.name, s]));
for (const s of Object.values(TS)) await figma.loadFontAsync(s.fontName);
const ES = Object.fromEntries((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s.id]));
const ST = Object.fromEntries(figma.motion.figmaAnimationStyles().map(s => [s.styleId, s.styleId]));
const border = await figma.getNodeByIdAsync("3:119");
const ap = figma.root.children.find(p => p.name === "YT02 · Assets"); await ap.loadAsync();
const ASSET = Object.fromEntries(ap.children.map(n => [n.name, n]));
async function txt(parent, name, s, style, fill, x, y, w, size) { const t = figma.createText(); parent.appendChild(t); t.name = name; await t.setTextStyleIdAsync(TS[style].id); t.characters = s; if (size) t.fontSize = size; t.fills = typeof fill === "string" ? solid(fill) : bp(fill); if (w) { t.resize(w, t.height); t.textAutoResize = "HEIGHT"; } t.x = x; t.y = y; return t; }
function svg(parent, name, key, h, tint) { const n = ASSET[key].clone(); parent.appendChild(n); n.name = name; n.visible = true; n.rescale(h / n.height); if (tint) n.findAll(c => "fills" in c && c.type !== "FRAME" && c.fills.length).forEach(c => c.fills = solid(tint)); return n; }
const kf = (n, name, pts, ease = "LINEAR") => n.applyManualKeyframeTrack({ type: "PROPERTY", name }, { keyframes: pts.map(([t, v]) => ({ timelinePosition: t, value: { type: "FLOAT", value: v }, easing: { type: ease } })) });
const op = (n, pts) => kf(n, "OPACITY", [[0, 0], ...pts], "EASE_OUT");
const show = (n, on, off) => op(n, off ? [[on, 0], [on + 0.4, 1], [off, 1], [off + 0.35, 0]] : [[on, 0], [on + 0.4, 1]]);
function line(parent, name, pts, color, w, { arrow = false, dash = null } = {}) {
  const v = figma.createVector(); parent.appendChild(v); v.name = name;
  const x0 = Math.min(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1]));
  v.vectorNetwork = { vertices: pts.map((p, i) => ({ x: p[0] - x0, y: p[1] - y0, ...(arrow && i === pts.length - 1 ? { strokeCap: "ARROW_EQUILATERAL" } : {}) })), segments: pts.slice(1).map((_, i) => ({ start: i, end: i + 1 })), regions: [] };
  v.x = x0; v.y = y0; v.strokes = solid(color); v.strokeWeight = w; if (dash) v.dashPattern = dash; return v; }
// A transparent square frame centred on (cx, cy): rotating or scaling it pivots on that point.
function rig(parent, name, cx, cy, half) { const r = figma.createFrame(); parent.appendChild(r); r.name = name; r.resize(2 * half, 2 * half); r.x = cx - half; r.y = cy - half; r.fills = [{ type: "SOLID", color: rgb("#000000"), opacity: 0 }]; r.clipsContent = false; return r; }

const NAME = SPEC.name, DUR = SPEC.duration;
const old = page.findOne(n => n.name === NAME && n.parent === page); if (old) old.remove();
const ref = page.findOne(n => n.name === "wage S10-06" && n.parent === page);
const F = figma.createFrame(); F.name = NAME; F.resize(1920, 1080); F.fills = bp(C.field); F.clipsContent = true;
F.x = ref.x; F.y = ref.y + 1400;
while (page.children.some(n => n !== F && n.x < F.x + 1920 && n.x + n.width > F.x && n.y < F.y + 1080 && n.y + n.height > F.y)) F.y += 1400;
const b = border.createInstance(); F.appendChild(b); b.name = "border";
const head = await txt(F, "headline", SPEC.headline, "Heading/H1", C.text, 190, 168, 1540);
const rule = figma.createRectangle(); F.appendChild(rule); rule.name = "rule"; rule.resize(220, 4); rule.x = 190; rule.y = head.y + head.height + 14; rule.fills = bp(C.fillAccent); rule.cornerRadius = 2;
head.applyAnimationStyle(ST.Opacity, { duration: 0.5, timelineOffset: 0.1, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } });
rule.applyAnimationStyle(ST.Opacity, { duration: 0.5, timelineOffset: 0.3, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } });

// ── θ over time: a held value with eased moves at each state's cue ──
const rad = d => d * Math.PI / 180;
const S = [[0, SPEC.theta0]]; let cur = SPEC.theta0;
for (const st of SPEC.states) {
  if (st.theta === null || st.theta === cur) continue;
  const d = Math.abs(st.theta - cur) > 60 ? 1.4 : 0.9, N = 14;
  for (let i = 0; i <= N; i++) S.push([st.t + d * i / N, cur + (st.theta - cur) * (0.5 - 0.5 * Math.cos(Math.PI * i / N))]);
  cur = st.theta;
}
const track = (n, name, f) => kf(n, name, S.map(([t, th]) => [t, f(th)]));
const EPS = 0.001, pos = v => Math.max(v, EPS);

const OX = 640, OY = 575, R = 270, L = 250;
const G = figma.createFrame(); F.appendChild(G); G.name = "plane"; G.fills = []; G.clipsContent = false; G.resize(1920, 1080);
const q2 = figma.createRectangle(); G.appendChild(q2); q2.name = "quadrant II"; q2.resize(R - 6, R - 6); q2.x = OX + 3; q2.y = OY - R + 3; q2.fills = [{ type: "SOLID", color: rgb(RED), opacity: 0.12 }]; q2.strokes = [{ type: "SOLID", color: rgb(RED), opacity: 0.5 }]; q2.strokeWeight = 1;
const q2T = await txt(G, "quadrant II tag", "Quadrant II · θ > 90°", "Label/Mono Small", RED, OX + 24, OY - R + 22);
for (const n of [q2, q2T]) kf(n, "OPACITY", [[0, 0], [0.5, 0.45], ...S.map(([t, th]) => [Math.max(t, 0.6), th > 90.5 ? 1 : 0.45])]);
const h = line(G, "axis horizontal", [[OX - R, OY], [OX + R, OY]], INK, 3, { arrow: true });
const vD = line(G, "axis vertical down", [[OX, OY - R], [OX, OY + R]], INK, 3, { arrow: true });
const psis = svg(G, "psi_s label", "w35.psis", 40, STAT); psis.x = OX + R + 14; psis.y = OY - psis.height / 2;
const psisT = await txt(G, "psi_s tag", "status (+)", "Label/Mono Small", STAT, OX + R + 14 + psis.width + 8, OY - 10);
const psim = svg(G, "psi_m label", "w35.psim", 40, MAT); psim.x = OX + 14; psim.y = OY + R + 4;
const psimT = await txt(G, "psi_m tag", "material delivered down (+)", "Label/Mono Small", MAT, OX + 14 + psim.width + 10, OY + R + 12);
const ext = line(G, "extraction up", [[OX - 40, OY - 30], [OX - 40, OY - R + 10]], RED, 5, { arrow: true });
const extT = await txt(G, "extraction tag", "extraction → Elite", "Label/Mono Small", RED, OX - 40 - 210, OY - R + 4, 190); extT.textAlignHorizontal = "RIGHT";
for (const n of [h, vD, psis, psisT, psim, psimT, ext, extT]) show(n, 0.3);

// constant-|W| circle (shown by "circle" … "nocircle")
const circ = []; for (let i = 0; i <= 36; i++) circ.push([OX + L * Math.sin(rad(5 * i)), OY + L * Math.cos(rad(5 * i))]);
const circle = line(G, "constant |W|", circ, DIMC, 2, { dash: [6, 8] });
const cOn = SPEC.states.find(s => s.x.includes("circle")), cOff = SPEC.states.find(s => s.x.includes("nocircle"));
if (cOn) show(circle, cOn.t - 0.6, cOff ? cOff.t : null); else circle.opacity = 0;

// components: ψ_m down (green, cos θ > 0) and up (red, cos θ < 0); ψ_s right
const mD = rig(G, "psi_m down rig", OX, OY, L); line(mD, "psi_m down", [[L, L], [L, 2 * L]], MAT, 10);
const mU = rig(G, "psi_m up rig", OX, OY, L); line(mU, "psi_m up", [[L, L], [L, 0]], RED, 10);
const sR = rig(G, "psi_s rig", OX, OY, L); line(sR, "psi_s", [[L, L], [2 * L, L]], STAT, 10);
track(mD, "SCALE_Y", th => pos(Math.cos(rad(th)))); track(mU, "SCALE_Y", th => pos(-Math.cos(rad(th)))); track(sR, "SCALE_X", th => pos(Math.sin(rad(th))));
// dashed projections from the tip to each axis
const hT = rig(G, "proj h shift", OX, OY, L), hS = rig(hT, "proj h scale", L, L, L); line(hS, "proj to vertical", [[L, L], [2 * L, L]], DIMC, 2, { dash: [10, 8] });
track(hT, "TRANSLATION_Y", th => L * Math.cos(rad(th))); track(hS, "SCALE_X", th => pos(Math.sin(rad(th))));
const vT = rig(G, "proj v shift", OX, OY, L);
const vSD = rig(vT, "proj v down", L, L, L); line(vSD, "proj to horizontal (down)", [[L, L], [L, 2 * L]], DIMC, 2, { dash: [10, 8] });
const vSU = rig(vT, "proj v up", L, L, L); line(vSU, "proj to horizontal (up)", [[L, L], [L, 0]], DIMC, 2, { dash: [10, 8] });
track(vT, "TRANSLATION_X", th => L * Math.sin(rad(th))); track(vSD, "SCALE_Y", th => pos(Math.cos(rad(th)))); track(vSU, "SCALE_Y", th => pos(-Math.cos(rad(th))));
// W itself, its labels, and the θ arc
const wR = rig(G, "W rig", OX, OY, L); const W = line(wR, "W arrow", [[L, L], [L, 2 * L]], STAT, 6, { arrow: true });
track(wR, "ROTATION", th => th);
const tip = (th, r) => [OX + r * Math.sin(rad(th)), OY + r * Math.cos(rad(th))];
const Wl = svg(G, "W label", "w35.W", 40, STAT);
const wAt = th => { const [x, y] = tip(th, L + 8); return [x + 30 * Math.cos(rad(th)) - Wl.width / 2, y - 30 * Math.sin(rad(th)) - Wl.height / 2]; };
[Wl.x, Wl.y] = wAt(0); track(Wl, "TRANSLATION_X", th => wAt(th)[0] - wAt(0)[0]); track(Wl, "TRANSLATION_Y", th => wAt(th)[1] - wAt(0)[1]);
const aW = svg(G, "|W| label", "w35.absW", 34, STAT);
const aAt = th => { const [x, y] = tip(th, 0.55 * L); return [x + 34 * Math.cos(rad(th)) - aW.width / 2, y - 34 * Math.sin(rad(th)) - aW.height / 2]; };
[aW.x, aW.y] = aAt(0); track(aW, "TRANSLATION_X", th => aAt(th)[0] - aAt(0)[0]); track(aW, "TRANSLATION_Y", th => aAt(th)[1] - aAt(0)[1]);
const arcPts = []; for (let i = 0; i <= 36; i++) arcPts.push(tip(5 * i, 80));
const arc = line(G, "theta arc", arcPts, INK, 3); track(arc, "PATH_TRIM_END", th => pos(th / 180));
const thl = svg(G, "theta label", "w35.theta", 32, INK);
const tAt = th => { const [x, y] = tip(Math.max(th, 12) / 2, 112); return [x - thl.width / 2, y - thl.height / 2]; };
[thl.x, thl.y] = tAt(0); track(thl, "TRANSLATION_X", th => tAt(th)[0] - tAt(0)[0]); track(thl, "TRANSLATION_Y", th => tAt(th)[1] - tAt(0)[1]);
for (const n of [mD, mU, sR, hT, vT, wR, Wl, aW, arc]) show(n, 0.6);
kf(thl, "OPACITY", [[0, 0], [0.6, 0], ...S.map(([t, th]) => [Math.max(t, 1.0), th < 8 ? 0 : 1])]);

// pulses: ψ_m / ψ_s stroke weight
const hiTimes = k => SPEC.states.filter(s => s.x.includes("hi:" + k)).map(s => s.t);
const pulse = (n, ts, base, peak) => { if (!ts.length) return; const pts = [[0, base]]; for (const t of ts) pts.push([t, base], [t + 0.35, peak], [t + 1.3, base]); kf(n, "STROKE_WEIGHT", pts, "EASE_OUT"); };
for (const r of [mD, mU]) pulse(r.children[0], hiTimes("m"), 10, 20);
pulse(sR.children[0], hiTimes("s"), 10, 20);

// caption under the plane
const caps = SPEC.states.filter(s => s.cap);
for (let i = 0; i < caps.length; i++) {
  const c = await txt(F, "caption · " + caps[i].cap, caps[i].cap, "Label/Mono Small", STAT, 190, 902, 900, 24);
  show(c, caps[i].t, caps[i + 1] ? caps[i + 1].t : null);
}
const src = await txt(F, "source", SPEC.source, "Source/Citation", C.textDim, 190, 944, 640); src.fontSize = 18;

// ── right column ──
async function panel(name, y, tag) { const p = figma.createFrame(); F.appendChild(p); p.name = name; p.x = 1180; p.y = y; p.fills = bp(C.s1); p.cornerRadius = 14; p.strokes = bp(C.chart); p.strokeWeight = 1; await p.setEffectStyleIdAsync(ES["Elevation/1 Panel"]); p.resize(550, 60); p.clipsContent = false;
  await txt(p, "tag", tag, "Label/Mono Small", C.textDim, 20, 12, 510); return p; }
function ring(parent, n, ts) { if (!ts.length) return; const r = figma.createRectangle(); parent.appendChild(r); r.name = "highlight · " + n.name; r.resize(n.width + 20, n.height + 16); r.x = n.x - 10; r.y = n.y - 8; r.fills = []; r.strokes = solid(STAT); r.strokeWeight = 2; r.cornerRadius = 8;
  const pts = []; for (const t of ts) pts.push([t, 0], [t + 0.3, 1], [t + 1.5, 1], [t + 1.9, 0]); op(r, pts); }
const eqOn = SPEC.eq ? 0.5 : SPEC.states.find(s => s.x.includes("eq")).t;
const csOn = SPEC.cs ? 0.7 : SPEC.states.find(s => s.x.includes("cs")).t;
const P1 = await panel("panel eq 3.5", 300, "EQUATION 3.5 · CH. 3"); show(P1, Math.min(eqOn, csOn) - 0.2);
const esv = svg(P1, "eq", "w35.eq", 48); esv.x = 20; esv.y = 40; show(esv, eqOn);
const csv = svg(P1, "cos", "w35.cos", 36, MAT); csv.x = 20; csv.y = 104; show(csv, csOn);
const snv = svg(P1, "sin", "w35.sin", 36, STAT); snv.x = 290; snv.y = 104; show(snv, csOn + 0.3);
P1.resize(550, 156);
ring(P1, esv, hiTimes("eq")); ring(P1, { name: "cos/sin", x: csv.x, y: csv.y, width: snv.x + snv.width - csv.x, height: csv.height }, hiTimes("cs"));

const P2 = await panel("panel phase angle", P1.y + P1.height + 16, "PHASE ANGLE · ILLUSTRATIVE PLACEMENT"); show(P2, 0.5); P2.resize(550, 104);
const regime = th => th === 0 ? ["pure material", MAT] : th === 90 ? ["pure status · ψ_m = 0", STAT] : th > 90 ? ["Quadrant II · ψ_m < 0", RED] : ["mixed · 0° < θ < 90°", INK];
const moves = [{ t: 0.5, theta: SPEC.theta0 }, ...SPEC.states.filter(s => s.theta !== null)].filter((s, i, a) => i === 0 || s.theta !== a[i - 1].theta);
for (let i = 0; i < moves.length; i++) {
  const [rt, rc] = regime(moves[i].theta), off = moves[i + 1] ? moves[i + 1].t : null;
  const a = await txt(P2, "θ = " + moves[i].theta, "θ = " + moves[i].theta + "°", "Body/Default", C.textAccent, 20, 40, 160, 30); show(a, moves[i].t, off);
  const r = await txt(P2, "regime " + moves[i].theta, rt, "Label/Mono Small", rc, 190, 50, 340, 20); show(r, moves[i].t, off);
}
let y4 = P2.y + P2.height + 16;
if (SPEC.pins) {
  const P3 = await panel("panel markers", y4, "HISTORICAL MARKERS"); show(P3, 0.5); P3.resize(550, 84);
  const pinNodes = [];
  for (const [i, lab] of ["1705", "1894–1965", "after 1965"].entries()) pinNodes.push(await txt(P3, "pin " + lab, lab, "Body/Default", STAT, 20 + i * 175, 40, 170, 22));
  const lit = [[0, new Set()]];
  for (const s of SPEC.states) for (const e of s.x) if (e.startsWith("pin:")) lit.push([s.t, new Set(e === "pin:all" ? [0, 1, 2] : [+e.slice(4)])]);
  pinNodes.forEach((n, i) => kf(n, "OPACITY", [[0, 0], [0.9, 0.35], ...lit.slice(1).flatMap(([t, set]) => [[t, 0.35], [t + 0.4, set.has(i) ? 1 : 0.35]])], "EASE_OUT"));
  y4 = P3.y + P3.height + 16;
}
const ctxs = SPEC.states.filter(s => s.ctx); let bottom = y4;
for (let i = 0; i < ctxs.length; i++) {
  const { tag, body, svg: key, lines } = ctxs[i].ctx, on = ctxs[i].t, off = ctxs[i + 1] ? ctxs[i + 1].t : null;
  const p = await panel("context · " + tag, y4, tag); show(p, on, off); let y = 42;
  if (key) { const s = svg(p, key, key, 38); s.x = 20; s.y = y; y += s.height + 12; }
  for (const ln of body || []) { const t = await txt(p, "line", ln, "Body/Default", C.text, 20, y, 510, 20); y += t.height + 4; }
  for (const [lt, ln] of lines || []) { const t = await txt(p, "line", ln, "Body/Default", C.text, 20, y, 510, 20); show(t, lt); y += t.height + 4; }
  p.resize(550, y + 14); bottom = Math.max(bottom, p.y + p.height);
}
head.setTimelineDuration(head.timelines[0].id, DUR);
return { id: F.id, x: F.x, y: F.y, samples: S.length, panelBottom: Math.round(bottom), nodes: F.findAll(() => true).length };
