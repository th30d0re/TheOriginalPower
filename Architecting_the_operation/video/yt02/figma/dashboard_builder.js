// ── shared builder for one era frame (pasted into each use_figma call after `const ERAS = [...]; const IDX = n;`)
const page = await figma.getNodeByIdAsync("10:2");
await figma.setCurrentPageAsync(page);
const V = async id => figma.variables.getVariableByIdAsync(id);
const C = { field: await V("VariableID:1:18"), wire: await V("VariableID:1:19"), chart: await V("VariableID:1:20"), accent: await V("VariableID:1:21"),
  text: await V("VariableID:1:22"), textAccent: await V("VariableID:1:23"), textDim: await V("VariableID:1:24"), fillAccent: await V("VariableID:1:25"),
  gold: await V("VariableID:1:26"), red: await V("VariableID:1:27"), accentWash: await V("VariableID:4:421"),
  s1: await V("VariableID:9:490"), s2: await V("VariableID:9:491"), well: await V("VariableID:9:493") };
const bp = v => [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", v)];
const TS = Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s => [s.name, s]));
for (const s of Object.values(TS)) await figma.loadFontAsync(s.fontName);
const ES = Object.fromEntries((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s.id]));
const ST = Object.fromEntries(figma.motion.figmaAnimationStyles().map(s => [s.styleId, s.styleId]));
const created = [];
const E = ERAS[IDX];

function box(parent, name, x, y, w, h, { fill = C.s1, stroke = C.chart, radius = 14, effect = "Elevation/1 Panel", strokeW = 1 } = {}) {
  const f = figma.createFrame(); parent.appendChild(f); f.name = name; f.resize(w, h); f.x = x; f.y = y;
  f.fills = fill ? bp(fill) : []; f.cornerRadius = radius; f.clipsContent = false;
  if (stroke) { f.strokes = bp(stroke); f.strokeWeight = strokeW; } else f.strokes = [];
  created.push(f.id); return f;
}
async function txt(parent, name, s, style, color, x, y, w, { align = "LEFT", maxLines } = {}) {
  const t = figma.createText(); parent.appendChild(t); t.name = name;
  await t.setTextStyleIdAsync(TS[style].id); t.characters = s || ""; t.fills = bp(color); t.textAlignHorizontal = align;
  if (w) { t.resize(w, t.height); t.textAutoResize = "HEIGHT"; }
  if (maxLines) { t.maxLines = maxLines; t.textTruncation = "ENDING"; }
  t.x = x; t.y = y; created.push(t.id); return t;
}
const fx = async (n, style) => { await n.setEffectStyleIdAsync(ES[style]); };
const fadeUp = (n, at, d = 0.5, dist = 24) => { n.applyAnimationStyle(ST.Opacity, { duration: d, timelineOffset: at, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } }); if (dist) n.applyAnimationStyle(ST.Position, { duration: d + 0.1, timelineOffset: at, props: { type: "slide_in", direction: "bottom", distance: dist, easing: { type: "EASE_OUT" } } }); };
const levelColor = lv => !lv ? C.chart : /CRITICAL|AT RISK|FAILING/.test(lv) ? C.red : /HIGH|PEAK|EXPANDING/.test(lv) ? C.fillAccent : C.gold;

const F = figma.createFrame(); F.name = `era ${E.date.slice(0, 4)}`; F.resize(1920, 1080); F.x = IDX * 2120; F.y = 0; F.fills = bp(C.field); F.clipsContent = true; created.push(F.id);
// vignette (level 0)
const vig = figma.createRectangle(); F.appendChild(vig); vig.name = "vignette"; vig.resize(1920, 1080);
vig.fills = [{ type: "GRADIENT_RADIAL", gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [{ position: 0, color: { r: 0.11, g: 0.19, b: 0.28, a: 0.55 } }, { position: 1, color: { r: 0.02, g: 0.04, b: 0.07, a: 0.65 } }] }];
created.push(vig.id);

// 1 timeline strip
const strip = box(F, "era band", 40, 18, 1840, 46, { fill: C.well, radius: 10, effect: null }); await fx(strip, "Inset/Well");
const tabW = 1840 / ERAS.length;
for (let i = 0; i < ERAS.length; i++) {
  const on = i === IDX, past = i < IDX;
  const tab = box(strip, `tab ${i + 1}`, i * tabW + 4, 4, tabW - 8, 38, { fill: on ? C.s2 : null, stroke: on ? C.accent : null, radius: 8 });
  if (on) await fx(tab, "Elevation/2 Raised");
  await txt(tab, "tab label", `LOG ${ERAS[i].log} · ${ERAS[i].date}`, "Dashboard/Tab", on ? C.textAccent : past ? C.text : C.textDim, 0, 10, tabW - 8, { align: "CENTER", maxLines: 1 });
}
const prog = figma.createRectangle(); F.appendChild(prog); prog.name = "era progress"; prog.resize(Math.max(8, (IDX + 1) * tabW), 4); prog.x = 40; prog.y = 64; prog.fills = bp(C.fillAccent); prog.cornerRadius = 2; created.push(prog.id); await fx(prog, "Glow/Accent");

// 2 header + active patch
const hdr = box(F, "panel header", 40, 80, 1140, 104); await fx(hdr, "Elevation/1 Panel");
const date = await txt(hdr, "era date", E.date, "Dashboard/Era date", C.text, 28, 10, 760);
const place = await txt(hdr, "era place", E.place, "Dashboard/Place", C.textAccent, 30, 70, 760, { maxLines: 1 });
const tag = box(hdr, "log tag", 860, 30, 250, 44, { fill: C.well, stroke: C.chart, radius: 22 }); await fx(tag, "Inset/Well");
await txt(tag, "log tag label", `RUNTIME LOG ${E.log} · ${E.chapter}`, "Dashboard/Chip", C.textDim, 0, 11, 250, { align: "CENTER" });
const pat = box(F, "panel patch", 1196, 80, 684, 104); await fx(pat, "Elevation/1 Panel");
await txt(pat, "field", "Active Patch", "Dashboard/Field", C.textDim, 24, 12, 600);
const con = box(pat, "patch console", 20, 42, 644, 48, { fill: C.well, stroke: null, radius: 8 }); await fx(con, "Inset/Well");
const patch = await txt(con, "patch", "> " + (E.patch || "—"), "Dashboard/Console", C.textAccent, 16, 11, 612);

// 3–4 stress + capital
async function levelPanel(name, label, v, x) {
  const p = box(F, name, x, 196, 562, 190); await fx(p, "Elevation/1 Panel");
  await txt(p, "field", label, "Dashboard/Field", C.textDim, 22, 16, 520);
  let y = 52;
  if (v.level) {
    const col = levelColor(v.level);
    const b = figma.createAutoLayout("HORIZONTAL", { name: name.replace("panel", "badge"), paddingLeft: 18, paddingRight: 18, paddingTop: 8, paddingBottom: 8 });
    p.appendChild(b); b.fills = bp(col); b.cornerRadius = 8; b.x = 22; b.y = y; created.push(b.id);
    const bt = figma.createText(); b.appendChild(bt); await bt.setTextStyleIdAsync(TS["Dashboard/Badge"].id); bt.characters = v.level; bt.fills = bp(C.field); created.push(bt.id);
    await fx(b, col === C.red ? "Glow/Alert" : "Glow/Accent"); y += 56;
  }
  await txt(p, "reason", v.reason, "Dashboard/Body", C.text, 22, y, 518);
  return p;
}
const pS = await levelPanel("panel stress", "System Stress (min: class resistance)", E.stress, 40);
const pC = await levelPanel("panel capital", "Capital (max: extraction output)", E.capital, 618);

// 5 variables
const pV = box(F, "panel variables", 40, 402, 1140, 304); await fx(pV, "Elevation/1 Panel");
await txt(pV, "field", "Variables", "Dashboard/Field", C.textDim, 22, 14, 600);
const chipsWrap = figma.createAutoLayout("VERTICAL", { name: "chips", itemSpacing: 10 }); pV.appendChild(chipsWrap); chipsWrap.fills = []; chipsWrap.x = 22; chipsWrap.y = 46; created.push(chipsWrap.id);
const chipEls = [];
async function chipRow(title, items, active) {
  if (!items.length) return;
  const sec = figma.createAutoLayout("VERTICAL", { name: title, itemSpacing: 8 }); chipsWrap.appendChild(sec); sec.fills = []; created.push(sec.id);
  const h = figma.createText(); sec.appendChild(h); await h.setTextStyleIdAsync(TS["Dashboard/Field"].id); h.characters = title; h.fills = bp(active ? C.textAccent : C.textDim); created.push(h.id);
  const row = figma.createAutoLayout("HORIZONTAL", { name: "row", itemSpacing: 10 }); sec.appendChild(row); row.fills = []; row.layoutWrap = "WRAP"; row.counterAxisSpacing = 8; row.resize(1090, row.height); row.primaryAxisSizingMode = "FIXED"; created.push(row.id);
  for (const it of items) {
    const ch = figma.createAutoLayout("HORIZONTAL", { name: "chip " + it.split(" ")[0], paddingLeft: 14, paddingRight: 14, paddingTop: 5, paddingBottom: 5 });
    row.appendChild(ch); ch.cornerRadius = 30; ch.fills = active ? bp(C.accentWash) : []; ch.strokes = bp(active ? C.accent : C.chart); ch.strokeWeight = 1.5; created.push(ch.id);
    const t = figma.createText(); ch.appendChild(t); await t.setTextStyleIdAsync(TS["Dashboard/Chip"].id); t.characters = it.length > 70 ? it.slice(0, 68) + "…" : it; t.fills = bp(active ? C.textAccent : C.textDim); created.push(t.id);
    if (active) await fx(ch, "Glow/Accent");
    chipEls.push([ch, active]);
  }
}
await chipRow("Deployed this cycle", E.deployed, true);
await chipRow("Loaded", E.loaded, false);

// 6 executing function
const pF = box(F, "panel function", 40, 716, 1140, 104); await fx(pF, "Elevation/1 Panel");
await txt(pF, "field", "Executing Function", "Dashboard/Field", C.textDim, 22, 14, 600);
const fn = await txt(pF, "function", E.function, "Dashboard/Body", C.text, 22, 40, 1096);

// 7 interference state
const pI = box(F, "panel interference", 1196, 196, 684, 624); await fx(pI, "Elevation/1 Panel");
await txt(pI, "field", "Interference State (Φ_load, proximity to τ)", "Dashboard/Field", C.textDim, 22, 16, 640);
// Φ_load bar
await txt(pI, "phi label", "Φ_load", "Dashboard/Body", C.text, 22, 56, 200);
const track = box(pI, "phi track", 22, 96, 640, 18, { fill: C.well, stroke: null, radius: 9 }); await fx(track, "Inset/Well");
let phiFill = null;
if (E.phi) {
  await txt(pI, "phi value", `[${E.phi[0].toFixed(2)}, ${E.phi[1].toFixed(2)}]`, "Dashboard/Chip", C.textAccent, 400, 60, 262, { align: "RIGHT" });
  phiFill = figma.createRectangle(); pI.appendChild(phiFill); phiFill.name = "phi bar"; phiFill.x = 22 + 640 * E.phi[0]; phiFill.y = 96; phiFill.resize(Math.max(6, 640 * (E.phi[1] - E.phi[0])), 18); phiFill.cornerRadius = 9; phiFill.fills = bp(C.fillAccent); created.push(phiFill.id); await fx(phiFill, "Glow/Accent");
}
for (const [v, lbl] of [[0, "0"], [0.5, "0.5"], [1, "1"]]) await txt(pI, "phi tick", lbl, "Dashboard/Chip", C.textDim, 22 + 640 * v - 20, 120, 40, { align: "CENTER" });
// ρ_τ gauge: top semicircle, v in [0, 1.2], τ = 1.0
const R = 150, CX = 342, CY = 400, VMAX = 1.2;
const ang = v => Math.PI + Math.PI * Math.min(v, VMAX) / VMAX;            // Figma arc angles: clockwise from 3 o'clock
await txt(pI, "rho label", "ρ_τ = M(t)/τ", "Dashboard/Body", C.text, 22, 170, 300);
const arc = (name, a0, a1, color, inner, effect) => { const e = figma.createEllipse(); pI.appendChild(e); e.name = name; e.resize(2 * R, 2 * R); e.x = CX - R; e.y = CY - R; e.arcData = { startingAngle: a0, endingAngle: a1, innerRadius: inner }; e.fills = bp(color); e.strokes = []; created.push(e.id); return e; };
const dial = arc("rho dial", Math.PI, 2 * Math.PI, C.well, 0.84); await fx(dial, "Inset/Well");
let sector = null, needle = null;
if (E.rho) {
  await txt(pI, "rho value", `[${E.rho[0].toFixed(2)}, ${E.rho[1].toFixed(2)}]`, "Dashboard/Chip", (E.rho[1] >= 1 ? C.red : C.textAccent), 400, 174, 262, { align: "RIGHT" });
  sector = arc("rho range", ang(E.rho[0]), ang(E.rho[1]), E.rho[1] >= 1 ? C.red : C.fillAccent, 0.84); await fx(sector, E.rho[1] >= 1 ? "Glow/Alert" : "Glow/Accent");
}
// τ marker
const ta = ang(1.0); const tick = figma.createLine(); pI.appendChild(tick); tick.name = "tau mark";
const tx0 = CX + Math.cos(ta) * (R * 0.78), ty0 = CY + Math.sin(ta) * (R * 0.78), tx1 = CX + Math.cos(ta) * (R * 1.08), ty1 = CY + Math.sin(ta) * (R * 1.08);
tick.x = tx0; tick.y = ty0; tick.resize(Math.hypot(tx1 - tx0, ty1 - ty0), 0); tick.rotation = -ta * 180 / Math.PI; tick.strokes = bp(C.red); tick.strokeWeight = 4; tick.strokeCap = "ROUND"; created.push(tick.id);
await txt(pI, "tau label", "τ = 1.0", "Dashboard/Chip", C.red, tx1 + 6, ty1 - 20, 90);
for (const [v, l] of [[0, "0"], [0.6, "0.6"], [1.2, "1.2"]]) { const a = ang(v); await txt(pI, "rho tick", l, "Dashboard/Chip", C.textDim, CX + Math.cos(a) * (R + 26) - 22, CY + Math.sin(a) * (R + 26) - 12, 44, { align: "CENTER" }); }
if (E.rho) {
  // needle: a square frame centred on the hub, pointing up at rest, rotated about its centre
  const vF = (E.rho[0] + E.rho[1]) / 2, rotOf = v => 90 - 180 * v / VMAX;  // degrees, CCW positive; 0.6 → straight up
  needle = figma.createFrame(); pI.appendChild(needle); needle.name = "rho needle"; needle.resize(2 * R, 2 * R); needle.fills = []; needle.clipsContent = false; created.push(needle.id);
  const nl = figma.createRectangle(); needle.appendChild(nl); nl.name = "needle"; nl.resize(5, R * 0.92); nl.x = R - 2.5; nl.y = R - R * 0.92; nl.cornerRadius = 2.5; nl.fills = bp(C.text); created.push(nl.id);
  const hub = figma.createEllipse(); needle.appendChild(hub); hub.name = "hub"; hub.resize(22, 22); hub.x = R - 11; hub.y = R - 11; hub.fills = bp(C.fillAccent); created.push(hub.id); await fx(hub, "Glow/Accent");
  const r = rotOf(vF) * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
  needle.relativeTransform = [[cs, sn, CX - (cs * R + sn * R)], [-sn, cs, CY - (-sn * R + cs * R)]];
  const kf = [{ timelinePosition: 2.8, value: { type: "FLOAT", value: rotOf(0) - rotOf(vF) } }];
  if (E.crash) { kf.push({ timelinePosition: 3.8, value: { type: "FLOAT", value: rotOf(E.crash + 0.05) - rotOf(vF) }, easing: { type: "EASE_IN_AND_OUT" } }); kf.push({ timelinePosition: 4.6, value: { type: "FLOAT", value: rotOf(E.crash + 0.05) - rotOf(vF) } }); kf.push({ timelinePosition: 5.8, value: { type: "FLOAT", value: 0 }, easing: { type: "EASE_IN_AND_OUT" } }); }
  else kf.push({ timelinePosition: 4.0, value: { type: "FLOAT", value: 0 }, easing: { type: "EASE_IN_AND_OUT" } });
  needle.applyManualKeyframeTrack({ type: "PROPERTY", name: "ROTATION" }, { keyframes: kf });
  if (E.crash) { const cl = box(pI, "crash callout", 430, 426, 230, 40, { fill: C.well, stroke: C.red, radius: 8 }); await txt(cl, "crash text", `ρ_τ > ${E.crash.toFixed(2)} at crash`, "Dashboard/Chip", C.red, 0, 9, 230, { align: "CENTER" }); cl.applyManualKeyframeTrack({ type: "PROPERTY", name: "OPACITY" }, { keyframes: [{ timelinePosition: 3.6, value: { type: "FLOAT", value: 0 } }, { timelinePosition: 3.9, value: { type: "FLOAT", value: 1 }, easing: { type: "EASE_OUT" } }] }); }
}
const iw = box(pI, "interference text", 22, 476, 640, 128, { fill: C.well, stroke: null, radius: 10 }); await fx(iw, "Inset/Well");
await txt(iw, "interference", E.itext, "Dashboard/Body", C.text, 16, 12, 608);

// 8 result ticker
const pR = box(F, "panel result", 40, 836, 1840, 226); await fx(pR, "Elevation/1 Panel");
await txt(pR, "field", E.warn ? "WARNING" : "Result", "Dashboard/Field", E.warn ? C.red : C.textDim, 22, 12, 600);
const rows = [];
for (let i = 0; i < Math.min(3, E.results.length); i++) {
  const row = box(pR, `ticker ${i + 1}`, 20, 42 + i * 60, 1800, 52, { fill: C.well, stroke: null, radius: 8 }); await fx(row, "Inset/Well");
  const bar = figma.createRectangle(); row.appendChild(bar); bar.resize(5, 52); bar.fills = bp(E.warn ? C.red : C.fillAccent); bar.topLeftRadius = bar.bottomLeftRadius = 8; created.push(bar.id);
  await txt(row, "policy", E.results[i], "Dashboard/Body", C.text, 22, 11, 1760, { maxLines: 1 });
  rows.push(row);
}

// ── motion (placeholder seconds; figma_cues.py retimes each named layer on its spoken word)
fadeUp(hdr, 0.2, 0.5, 20); fadeUp(pat, 0.6, 0.5, 20);
const patchTxt = patch; patchTxt.applyAnimationStyle(ST.Opacity, { duration: 0.6, timelineOffset: 1.0, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } });
fadeUp(pS, 1.2); fadeUp(pC, 1.5); fadeUp(pI, 1.8);
if (phiFill) phiFill.applyManualKeyframeTrack({ type: "PROPERTY", name: "WIDTH" }, { keyframes: [{ timelinePosition: 2.3, value: { type: "FLOAT", value: 6 } }, { timelinePosition: 3.0, value: { type: "FLOAT", value: phiFill.width }, easing: { type: "EASE_OUT" } }] });
if (sector) sector.applyAnimationStyle(ST.Opacity, { duration: 0.5, timelineOffset: 3.0, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } });
fadeUp(pV, 5.0); chipEls.forEach(([c], i) => c.applyAnimationStyle(ST.Opacity, { duration: 0.35, timelineOffset: 5.4 + i * 0.18, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } }));
fadeUp(pF, 6.8); fadeUp(pR, 7.6); rows.forEach((r, i) => fadeUp(r, 8.0 + i * 0.7, 0.45, 16));
const [tl] = hdr.timelines; hdr.setTimelineDuration(tl.id, 12);
return { frame: F.id, name: F.name, nodes: created.length };
