// G11 · Equation 2.11, the series RLC circuit, and derived sweeps of L, R and C.
// Run as: g_prelude.js + "const DATA = <rlc_sweep.json>;" + this file. Part A beats are seconds from the
// start of turn 141 (6017b9e8036ac25d); part B (the sweeps) runs on this frame's clock from B.sweep and
// has no narration yet. Every curve is the computed solution from rlc_sweep.py, placed as path data.
const B = { dynamic: 1.98, shocks: 3.02, series: 4.18, diffeq: 4.92, inertia: 6.56, resistance: 7.66, capacitance: 10.04, absorb: 11.82, sweep: 15.0 };
const { F, head } = await frame("g-eq2.11 RLC sweep", "Equation 2.11 · The Series RLC Circuit", 1);
const PL = DATA.plot, ids = {};
const pathOf = ys => "M " + ys.map((y, i) => `${(i * PL.w / (ys.length - 1)).toFixed(1)} ${y}`).join(" L ");
const COL = { L: MAT, R: RED, C: INK };
const NAME = { L: "state inertia", R: "institutional resistance", C: "legal buffering\ncapacitance" };

// ── circuit: source V(t) on the left wire; R, L, C in series along the top wire ──
const cir = figma.createFrame(); F.appendChild(cir); cir.name = "circuit"; cir.fills = []; cir.clipsContent = false; cir.resize(1920, 1080);
const XL = 230, XR = 770, YT = 386, YB = 626, SY = 506, SR = 36;
const wires = [[[XL, SY - SR], [XL, YT], [305, YT]], [[415, YT], [460, YT]], [[580, YT], [672, YT]], [[688, YT], [XR, YT], [XR, YB], [XL, YB], [XL, SY + SR]]];
const wireN = wires.map((w, i) => line(cir, "wire " + i, w, INK, 3));
const zz = [[305, YT]]; for (let i = 0; i < 6; i++) zz.push([313 + i * 17.5, YT + (i % 2 ? 16 : -16)]); zz.push([415, YT]);
const part = { R: [line(cir, "resistor", zz, RED, 4)] };
const coil = figma.createVector(); cir.appendChild(coil); coil.name = "inductor";
coil.vectorPaths = [{ windingRule: "NONZERO", data: "M 0 40 " + [0, 1, 2, 3].map(i => `C ${i * 30} 0 ${i * 30 + 30} 0 ${i * 30 + 30} 40`).join(" ") }];
coil.x = 460; coil.y = YT - 30; coil.strokes = solid(MAT); coil.strokeWeight = 4; coil.strokeCap = "ROUND"; part.L = [coil];
part.C = [line(cir, "capacitor plate 1", [[672, YT - 32], [672, YT + 32]], INK, 5), line(cir, "capacitor plate 2", [[688, YT - 32], [688, YT + 32]], INK, 5)];
const src = figma.createEllipse(); cir.appendChild(src); src.name = "source"; src.resize(2 * SR, 2 * SR); src.x = XL - SR; src.y = SY - SR; src.fills = bp(C.field); src.strokes = solid(STAT); src.strokeWeight = 4;
const sq = figma.createVector(); cir.appendChild(sq); sq.name = "source wave"; sq.vectorPaths = [{ windingRule: "NONZERO", data: "M 0 10 C 8 -6 14 -6 20 10 C 26 26 32 26 40 10" }]; sq.x = XL - 20; sq.y = SY - 9; sq.strokes = solid(STAT); sq.strokeWeight = 3;
part.V = [src, sq];
const vl = svg(cir, "label V(t)", "g.V", 40, STAT); vl.x = XL + SR + 14; vl.y = SY - 20;
const vT = await txt(cir, "tag V", "reform shock", "Label/Mono Small", STAT, XL + SR + 14, SY + 24, 200, 18);
const CX = { R: 360, L: 520, C: 680 };
const lab = {}, tag = {}, ring = {};
for (const k of ["R", "L", "C"]) {
  lab[k] = svg(cir, "label " + k, "g." + k, 44, COL[k]); lab[k].x = CX[k] - lab[k].width / 2; lab[k].y = YT - 104;
  tag[k] = await txt(cir, "tag " + k, NAME[k], "Label/Mono Small", COL[k], CX[k] - 72, YT + 48, 144, 16); tag[k].textAlignHorizontal = "CENTER";
  ring[k] = figma.createRectangle(); cir.appendChild(ring[k]); ring[k].name = "highlight " + k; ring[k].resize(150, 190); ring[k].x = CX[k] - 75; ring[k].y = YT - 116; ring[k].cornerRadius = 14; ring[k].fills = solid(STAT, 0.08); ring[k].strokes = solid(STAT); ring[k].strokeWeight = 3; await ring[k].setEffectStyleIdAsync(ES["Glow/Accent"]);
}
for (const w of wireN) draw(w, 0.3, 1.6);
for (const k of ["R", "L", "C", "V"]) for (const n of part[k]) show(n, B.series + { V: 0, R: 0.15, L: 0.3, C: 0.45 }[k]);
for (const k of ["R", "L", "C"]) { show(lab[k], B.series + 0.4); }
show(vl, B.series); show(vT, B.shocks);

// ── Equation 2.11 under the circuit, with its L, R and C terms ringed when named ──
const eq = svg(F, "Equation 2.11", "g.eq211", 78, INK); eq.x = 250; eq.y = 664; show(eq, B.diffeq);
const leaves = eq.findAll(n => n.type === "VECTOR" || n.type === "RECTANGLE");
const termBox = idx => { const bb = idx.map(i => leaves[i].absoluteBoundingBox), fb = F.absoluteBoundingBox; const x0 = Math.min(...bb.map(b => b.x)), x1 = Math.max(...bb.map(b => b.x + b.width)), y0 = Math.min(...bb.map(b => b.y)), y1 = Math.max(...bb.map(b => b.y + b.height)); return [x0 - fb.x - 8, y0 - fb.y - 8, x1 - x0 + 16, y1 - y0 + 16]; };
const TERM = { L: [0, 1, 2], R: [4, 5, 6], C: [8, 9, 10, 11] }, eqR = {};
for (const k of ["L", "R", "C"]) { const [x, y, w, h] = termBox(TERM[k]); const r = figma.createRectangle(); F.appendChild(r); r.name = "eq term " + k; r.resize(w, h); r.x = x; r.y = y; r.cornerRadius = 8; r.fills = []; r.strokes = solid(COL[k] === INK ? STAT : COL[k]); r.strokeWeight = 3; eqR[k] = r; }
const HA = { L: [B.inertia, B.resistance], R: [B.resistance, B.capacitance], C: [B.capacitance, B.absorb] };
const RW = { L: [HA.L], R: [HA.R], C: [HA.C] };  // component rings: named in turn 141, lit again for its sweep
for (const k of ["L", "R", "C"]) { windows(eqR[k], [HA[k]]); show(tag[k], HA[k][0]); }

// ── the scope: q(t) after a reform shock, baseline q = 0 ──
const sc = figma.createFrame(); F.appendChild(sc); sc.name = "scope"; sc.fills = []; sc.clipsContent = false; sc.resize(1920, 1080);
const y0 = PL.y + PL.h * PL.qmax / (PL.qmax - PL.qmin);
const zone = figma.createRectangle(); sc.appendChild(zone); zone.name = "extraction zone"; zone.resize(PL.w, PL.y + PL.h - y0 + 10); zone.x = PL.x; zone.y = y0; zone.fills = solid(RED, 0.07);
const yAx = line(sc, "q axis", [[PL.x, PL.y + PL.h + 10], [PL.x, PL.y - 24]], INK, 3, { arrow: true });
const tAx = line(sc, "t axis", [[PL.x, y0], [PL.x + PL.w + 12, y0]], INK, 3, { arrow: true });
const ql = svg(sc, "label q(t)", "g.q", 40, INK); ql.x = PL.x + 16; ql.y = PL.y - 52;
const tl = svg(sc, "label t", "g.t", 34, INK); tl.x = PL.x + PL.w - 10; tl.y = y0 + 14;
const qT = await txt(sc, "tag q", "equality-surplus charge", "Label/Mono Small", DIMC, PL.x + 16 + ql.width + 12, PL.y - 44, 300, 18);
const bT = await txt(sc, "tag baseline", "q = 0 · extraction baseline", "Label/Mono Small", INK, PL.x + PL.w - 330, y0 - 30, 330, 18); bT.textAlignHorizontal = "RIGHT";
const zT = await txt(sc, "tag zone", "below q = 0 · backlash into the extraction zone", "Label/Mono Small", RED, PL.x + 16, PL.y + PL.h - 26, 560, 18);
for (const n of [zone, yAx, tAx, ql, tl, qT, bT, zT]) show(n, B.dynamic);
const shock = line(sc, "shock arrow", [[PL.x + 8, y0], [PL.x + 8, PL.y + 6]], STAT, 5, { arrow: true }); draw(shock, B.shocks, B.shocks + 0.5);
const base = figma.createVector(); sc.appendChild(base); base.name = "response · baseline"; base.vectorPaths = [{ windingRule: "NONE", data: pathOf(DATA.curves.base.ys) }]; base.x = PL.x; base.y = PL.y; base.strokes = solid(STAT); base.strokeWeight = 4; base.strokeJoin = "ROUND";
kf(base, "PATH_TRIM_END", [[0, 0.001], [B.absorb, 0.001], [B.absorb + 2.4, 1]], "EASE_IN_AND_OUT");
kf(base, "OPACITY", [[0, 0], [B.absorb, 0], [B.absorb + 0.05, 1], [B.sweep, 1], [B.sweep + 0.5, 0.28]]);
const absorbT = await txt(sc, "tag absorb", "the circuit absorbs the shock and rings back past the baseline", "Label/Mono Small", STAT, PL.x + 16, PL.y + PL.h + 24, 860, 18);
show(absorbT, B.absorb + 1.2, B.sweep);

// ── part B: each parameter raised and lowered; curves from rlc_sweep.json ──
const pill = await panel(F, "derived badge", PL.x + PL.w - 300, PL.y - 70, 300, 44); pill.strokes = solid(STAT); pill.cornerRadius = 22;
await txt(pill, "derived", "DERIVED · NOT IN THE BOOK", "Label/Mono Small", STAT, 18, 11, 270, 18); show(pill, B.sweep);
const SL = { L: [0.4, 2.5, 784], R: [0.1, 2.8, 829], C: [0.4, 2.5, 874] }, TX0 = 300, TW = 440;
const pos = (k, v) => TX0 + TW * Math.log(v / SL[k][0]) / Math.log(SL[k][1] / SL[k][0]);
const knob = {};
const sl = figma.createFrame(); F.appendChild(sl); sl.name = "sliders"; sl.fills = []; sl.clipsContent = false; sl.resize(1920, 1080); show(sl, B.sweep);
for (const k of ["L", "R", "C"]) {
  const y = SL[k][2], l = svg(sl, "slider label " + k, "g." + k, 32, COL[k]); l.x = 240; l.y = y - 18;
  line(sl, "slider track " + k, [[TX0, y], [TX0 + TW, y]], DIMC, 3);
  line(sl, "slider base " + k, [[pos(k, DATA.base[k]), y - 12], [pos(k, DATA.base[k]), y + 12]], DIMC, 2);
  const kn = figma.createEllipse(); sl.appendChild(kn); kn.name = "slider knob " + k; kn.resize(22, 22); kn.x = pos(k, DATA.base[k]) - 11; kn.y = y - 11; kn.fills = solid(COL[k]); kn.strokes = bp(C.field); kn.strokeWeight = 3; knob[k] = kn;
}
const TAKE = {
  L: "Derived · raising L lowers ζ: deeper backlash, slower swings, longer ringing. Lowering L softens all three.",
  R: "Derived · raising R raises ζ: the overshoot shrinks and vanishes at ζ = 1; past that the return slows.",
  C: "Derived · raising C slows each swing and softens the overshoot; the envelope decay rate R/2L holds steady.",
};
const CAP = [[0.5, "EQUATION 2.11 · SERIES RLC RESPONSE TO A REFORM SHOCK"]];
const fmt = c => c.zeta >= 1 ? `ζ = ${c.zeta.toFixed(2)} · ${c.regime} · no backlash · back to baseline by t ≈ ${c.settle}` : `ζ = ${c.zeta.toFixed(2)} · backlash ${Math.round(100 * c.overshoot)}% of the shock · settles (5%) by t ≈ ${c.settle} · period ${c.period}`;
const readBox = await panel(F, "readout", PL.x, 776, PL.w, 112, "READOUT · FROM THE COMPUTED CURVE"); show(readBox, B.sweep);
const zf = svg(readBox, "zeta formula", "g.zeta", 64, INK); zf.x = PL.w - zf.width - 24; zf.y = 26;
let t = B.sweep;
for (const k of ["L", "R", "C"]) {
  const seq = DATA.sweeps[k], d = k === "R" ? 0.8 : 0.9, s0 = t + 1.2;
  CAP.push([t, `DERIVED · RAISE AND LOWER ${k} · ${NAME[k].replace("\n", " ").toUpperCase()}`]);
  RW[k].push([t, s0 + seq.length * d + 2.4]);
  const kpts = [[0, 0]];
  for (let i = 0; i < seq.length; i++) {
    const c = DATA.curves[seq[i]], on = s0 + i * d, off = i === seq.length - 1 ? s0 + seq.length * d + 2.4 : on + d;
    const v = figma.createVector(); sc.appendChild(v); v.name = `response · ${k} step ${i} · ${seq[i]}`; v.vectorPaths = [{ windingRule: "NONE", data: pathOf(c.ys) }]; v.x = PL.x; v.y = PL.y; v.strokes = solid(STAT); v.strokeWeight = 4; v.strokeJoin = "ROUND";
    op(v, [[on - 0.01, 0], [on + 0.2, 1], [off, 1], [off + 0.2, 0]]);
    const r = await txt(readBox, `read ${k} ${i}`, fmt(c), "Body/Default", C.text, 20, 44, PL.w - zf.width - 70, 22);
    op(r, [[on - 0.01, 0], [on + 0.2, 1], [off, 1], [off + 0.2, 0]]);
    kpts.push([on, pos(k, c[k]) - pos(k, DATA.base[k])]);
  }
  kf(knob[k], "TRANSLATION_X", [[0, 0], ...kpts.slice(1).map(([a, b]) => [a + 0.45, b])], "EASE_IN_AND_OUT");
  const take = await txt(F, "takeaway " + k, TAKE[k], "Label/Mono Small", STAT, 190, 922, 1540, 22);
  const tOn = s0 + seq.length * d - 0.6; show(take, tOn, s0 + seq.length * d + 2.4);
  CAP.push([tOn, ""]);
  t = s0 + seq.length * d + 2.8;
}
CAP.push([t, "ILLUSTRATIVE, DIMENSIONLESS PARAMETERS · NOT CALIBRATED TO THE HISTORICAL RECORD"]);
for (const k of ["L", "R", "C"]) windows(ring[k], RW[k]);
// an empty caption clears the line while a takeaway sits there
await captions(F, CAP.map(([a, s]) => [a, s || " "]));
await source(F, "The Original Power, Ch. 2, Eq. 2.11 and Eq. 1.7b · curves solved in rlc_sweep.py");
kf(base, "OPACITY", [[0, 0], [B.absorb, 0], [B.absorb + 0.05, 1], [B.sweep, 1], [B.sweep + 0.5, 0.28], [t, 0.28], [t + 0.5, 1]]);
const DUR = t + 3.5; finish(head, DUR);
return { id: F.id, dur: DUR, nodes: F.findAll(() => true).length, cap: CAP.map(c => [Math.round(c[0] * 100) / 100, c[1]]) };
