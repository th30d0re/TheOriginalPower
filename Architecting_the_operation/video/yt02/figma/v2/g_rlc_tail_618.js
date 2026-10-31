// RLC tail · OV turns 618 (54d5a1bdad4ea6d8) and 619 (27ad75bbffd2cbbe, from +54.0): the 1865 and 1964
// impulses and their overshoots, drawn as Figure 2.6 draws them. Run as g_head.js + this file.
// The wave is Equation 2.12 with ω₀ = 1: shock 1 displaces q to 1.6 with ζ = 0.17, shock 2 adds 1.0 at
// t = 15 with ζ = 0.59. The two ζ are the book's Laplace fits for 1865 and 1964 (tex 2390); every other
// value is illustrative, as the book says of its own Figure 2.6.
const T2 = 54.0;
const B = { base: 0.12, reform: 4.94, pulls: 8.4, amend: 12.96, positive: 18.06, inductor: 22.58, lenz: 25.44, discharge: 33.46, beyond: 40.2,
  over1: 42.38, zone: 48.42, cra: T2, smaller: T2 + 4.88, over2: T2 + 13.96, iface: T2 + 21.76, fig: T2 + 32.18, haxis: T2 + 35.78, vaxis: T2 + 38.22,
  trace: T2 + 41.7, illus: T2 + 46.24, end: 106.8 };
const { F, head } = await frame("g-rlc tail 618", "Figure 2.6 · Two Shocks, Two Overshoots", 8);
await captions(F, [[B.base, "THE EXTRACTION BASELINE IS CIRCUIT EQUILIBRIUM · q = 0"], [B.reform, "A REFORM MOVEMENT FORCES A POSITIVE DISPLACEMENT · THE CIRCUIT PULLS q BACK"],
  [B.amend, "SHOCK 1 · THE THIRTEENTH AMENDMENT (1865) DRIVES THE CHARGE STRONGLY POSITIVE"], [B.inductor, "LENZ'S LAW · THE INDUCTOR'S BACK EMF OPPOSES THE REFORM CURRENT"],
  [B.discharge, "THE REACTIVE ELEMENTS DISCHARGE THROUGH INSTITUTIONAL RESISTANCE · PAST THE BASELINE"], [B.over1, "OVERSHOOT 1 · RECONSTRUCTION'S COLLAPSE, BLACK CODES, KLAN TERROR, CONVICT LEASING"],
  [B.cra, "SHOCK 2 · THE CIVIL RIGHTS ACT (1964) · A SMALLER IMPULSE INTO A MORE DAMPED CIRCUIT"], [B.over2, "OVERSHOOT 2 · THE WAR ON DRUGS, MASS INCARCERATION, A MILITARIZED ENFORCEMENT CLASS"],
  [B.iface, "INTERFACE SWAP · EXPLICIT APARTHEID TO FACIALLY NEUTRAL CARCERAL PROXIES"], [B.fig, "FIGURE 2.6 · TIME ON THE HORIZONTAL AXIS, CHARGE DISPLACEMENT ON THE VERTICAL"],
  [B.trace, "TRACE THE TWO SHOCK-AND-OVERSHOOT CYCLES"], [B.illus, "THE PLOTTED VALUES ARE ILLUSTRATIVE"]]);
await source(F, "The Original Power, Ch. 2, Figure 2.6 · ζ = 0.17 (1865) and 0.59 (1964) from the book's Laplace fits · other values illustrative");
// ── the wave ──
const PL = { x: 190, y: 340, w: 1540, h: 460 }, TE = 36, QMAX = 1.9, QMIN = -1.2, TS2 = 15, Q1 = 1.6, Q2 = 1.0, Z1 = 0.17, Z2 = 0.59;
const TX = t => PL.x + t / TE * PL.w, QY = q => PL.y + (QMAX - q) / (QMAX - QMIN) * PL.h, y0 = QY(0);
const seg = (a, q0, v0) => { const w = Math.sqrt(1 - a * a); return t => Math.exp(-a * t) * (q0 * Math.cos(w * t) + (v0 + a * q0) / w * Math.sin(w * t)); };
const f1 = seg(Z1, Q1, 0), v1 = t => (f1(t + 1e-5) - f1(t - 1e-5)) / 2e-5, q15 = f1(TS2), f2 = seg(Z2, q15 + Q2, v1(TS2));
const N = 360, sample = (f, t0, t1) => Array.from({ length: N + 1 }, (_, i) => { const t = t0 + i * (t1 - t0) / N; return [t, f(t - t0)]; });
const s1 = sample(f1, 0, TS2), s2 = sample(f2, TS2, TE);
const firstMin = s => { for (let i = 1; i < s.length - 1; i++) if (s[i][1] < s[i - 1][1] && s[i][1] <= s[i + 1][1] && s[i][1] < 0) return s[i]; };
const firstZero = s => s.find(p => p[1] < 0);
const m1 = firstMin(s1), z1 = firstZero(s1), m2 = firstMin(s2);
// trim fraction at a time: by cumulative path length
const frac = (s, tq) => { let L = 0, at = 0; const P = s.map(([t, q]) => [TX(t), QY(q)]); for (let i = 1; i < P.length; i++) { L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (s[i][0] <= tq) at = L; } return at / L; };
const S = stage(F, "plot");
const eqz = figma.createRectangle(); S.appendChild(eqz); eqz.name = "equality zone"; eqz.resize(PL.w, y0 - PL.y); eqz.x = PL.x; eqz.y = PL.y; eqz.fills = solid(MAT, 0.08);
const exz = figma.createRectangle(); S.appendChild(exz); exz.name = "extraction zone"; exz.resize(PL.w, PL.y + PL.h - y0); exz.x = PL.x; exz.y = y0; exz.fills = solid(RED, 0.08);
const yAx = line(S, "q axis", [[PL.x, PL.y + PL.h], [PL.x, PL.y - 16]], INK, 3, { arrow: true }), tAx = line(S, "t axis", [[PL.x, y0], [PL.x + PL.w + 14, y0]], INK, 3, { arrow: true });
const ql = math(S, "q label", "q(t)", 34, INK, PL.x + 14, PL.y - 46), tl = math(S, "t label", "t", 30, INK, PL.x + PL.w - 4, y0 + 4);
const tlT = await txt(S, "t tag", "time", "Label/Mono Small", INK, PL.x + PL.w - 70, y0 + 16, 60, 16), qlT = await txt(S, "q tag", "charge displacement", "Label/Mono Small", INK, PL.x + 94, PL.y - 36, 260, 16);
for (const n of [yAx, tAx, ql, tl]) show(n, B.base);
show(tlT, B.haxis); show(qlT, B.vaxis);
kf(tAx, "STROKE_WEIGHT", [[0, 3], [B.haxis, 3], [B.haxis + 0.3, 7], [B.haxis + 1.8, 3]], "EASE_OUT"); kf(yAx, "STROKE_WEIGHT", [[0, 3], [B.vaxis, 3], [B.vaxis + 0.3, 7], [B.vaxis + 1.8, 3]], "EASE_OUT");
const bT = await txt(S, "baseline tag", "q = 0 · circuit equilibrium · the extraction baseline", "Label/Mono Small", INK, PL.x + PL.w - 660, y0 - 28, 640, 18); bT.textAlignHorizontal = "RIGHT"; show(bT, B.base + 0.6);
const eT = await txt(S, "equality tag", "Equality Zone · q > 0", "Label/Mono Small", MAT, PL.x + PL.w - 300, y0 - 80, 280, 18); eT.textAlignHorizontal = "RIGHT";
const xT = await txt(S, "extraction tag", "Extraction Zone · q < 0", "Label/Mono Small", RED, PL.x + PL.w - 300, y0 + 60, 280, 18); xT.textAlignHorizontal = "RIGHT";
show(eqz, B.reform); show(eT, B.reform + 0.3); show(exz, B.beyond); show(xT, B.zone);
// shock 1 and the first cycle
const sh1 = line(S, "shock 1 arrow", [[TX(0) + 8, y0], [TX(0) + 8, QY(Q1) + 4]], STAT, 6, { arrow: true }); draw(sh1, B.amend + 0.4, B.amend + 1.4);
const sh1T = await txt(S, "shock 1 tag", "Shock 1 · Thirteenth Amendment (1865)", "Label/Mono Small", STAT, TX(0) + 50, QY(Q1) - 30, 460, 18); show(sh1T, B.amend + 0.6);
const w1 = curve(S, "cycle 1 · ζ 0.17", s1.map(([t, q]) => [TX(t), QY(q)]), STAT, 5);
kf(w1, "PATH_TRIM_END", [[0, 0.001], [B.lenz, 0.001], [B.lenz + 5.6, frac(s1, z1[0])], [B.discharge + 3.2, frac(s1, z1[0])], [B.discharge + 7.6, frac(s1, m1[0])], [B.zone + 0.4, frac(s1, m1[0])], [B.zone + 4.6, 1]], "EASE_IN_AND_OUT");
op(w1, [[B.lenz - 0.01, 0], [B.lenz, 1]]);
const kick = math(S, "kickback", "−L di/dt", 30, MAT, TX(1.7), QY(0.95) - 20); const kickT = await txt(S, "kickback tag", "inductive kickback", "Label/Mono Small", MAT, TX(1.7), QY(0.95) + 28, 240, 16);
show(kick, B.lenz + 0.8); show(kickT, B.lenz + 1.0);
const o1 = [["Overshoot 1", B.over1 + 0.3], ["collapse of Reconstruction", 44.04], ["Black Codes", 45.72], ["Klan terror", 46.69], ["Convict Leasing", 47.64]];
for (let k = 0; k < o1.length; k++) { const t = await txt(S, "overshoot 1 · " + o1[k][0], o1[k][0], "Label/Mono Small", k ? RED : INK, TX(m1[0]) - 60, QY(m1[1]) + 18 + k * 22, 360, 16); show(t, o1[k][1]); }
const m1d = figma.createEllipse(); S.appendChild(m1d); m1d.name = "overshoot 1 dot"; m1d.resize(18, 18); m1d.x = TX(m1[0]) - 9; m1d.y = QY(m1[1]) - 9; m1d.fills = solid(RED); show(m1d, B.over1);
// shock 2 and the second cycle
const sh2 = line(S, "shock 2 arrow", [[TX(TS2), QY(q15)], [TX(TS2), QY(q15 + Q2) + 4]], STAT, 6, { arrow: true }); draw(sh2, B.cra + 0.2, B.cra + 1.2);
const sh2T = await txt(S, "shock 2 tag", "Shock 2 · Civil Rights Act (1964)", "Label/Mono Small", STAT, TX(TS2) + 16, QY(q15 + Q2) - 36, 420, 18); show(sh2T, B.cra + 0.5);
const ghost = line(S, "shock 1 height", [[TX(TS2) - 50, QY(Q1)], [TX(TS2) + 50, QY(Q1)]], STAT, 2, { dash: [6, 6] }); show(ghost, B.smaller + 2.4);
const ghT = await txt(S, "shock 1 height tag", "shock 1 reached here", "Label/Mono Small", DIMC, TX(TS2) + 60, QY(Q1) - 9, 260, 16); show(ghT, B.smaller + 2.6);
const w2 = curve(S, "cycle 2 · ζ 0.59", s2.map(([t, q]) => [TX(t), QY(q)]), STAT, 5);
kf(w2, "PATH_TRIM_END", [[0, 0.001], [B.smaller + 3.0, 0.001], [B.smaller + 7.2, frac(s2, m2[0])], [B.iface + 0.3, frac(s2, m2[0])], [B.iface + 4.2, 1]], "EASE_IN_AND_OUT");
op(w2, [[B.smaller + 2.99, 0], [B.smaller + 3.0, 1]]);
const ZP = await panel(F, "panel damping", 1250, 300, 480, 92, "DAMPING RATIO · THE BOOK'S FITS"); show(ZP, B.smaller + 0.6);
const z1m = math(ZP, "ζ 1865", "ζ = 0.17 (1865)", 30, STAT, 20, 34); const z2m = math(ZP, "ζ 1964", "→  ζ = 0.59 (1964)", 30, RED, 20 + z1m.width + 16, 34); show(z2m, B.smaller + 3.4);
const o2 = [["Overshoot 2", B.over2 + 0.3], ["War on Drugs", T2 + 15.76], ["Mass Incarceration", T2 + 16.58], ["militarized Enforcement Class", T2 + 19.36]];
for (let k = 0; k < o2.length; k++) { const t = await txt(S, "overshoot 2 · " + o2[k][0], o2[k][0], "Label/Mono Small", k ? RED : INK, TX(m2[0]) - 16 - 380, QY(m2[1]) + 24 + k * 22, 380, 16); t.textAlignHorizontal = "RIGHT"; show(t, o2[k][1]); }
const m2d = figma.createEllipse(); S.appendChild(m2d); m2d.name = "overshoot 2 dot"; m2d.resize(18, 18); m2d.x = TX(m2[0]) - 9; m2d.y = QY(m2[1]) - 9; m2d.fills = solid(RED); show(m2d, B.over2);
const ifc = await panel(F, "interface swap", 1250, 420, 480, 90); ifc.strokes = solid(STAT); await txt(ifc, "text", "interface swap · explicit racial apartheid → facially neutral carceral proxies", "Label/Mono Small", STAT, 18, 12, 444, 18); show(ifc, B.iface + 1.2);
// "trace the two shock-and-overshoot cycles": each cycle lights in turn
for (const [w, a, b] of [[w1, B.trace + 0.6, B.trace + 2.4], [w2, B.trace + 2.4, B.illus]]) kf(w, "STROKE_WEIGHT", [[0, 5], [a, 5], [a + 0.3, 10], [b, 10], [b + 0.3, 5]], "EASE_OUT");
const badge = await panel(F, "illustrative badge", 1250, 718, 480, 76, "ILLUSTRATIVE VALUES"); badge.strokes = solid(STAT);
math(badge, "values", "Q_0 = 1.6   ω_0 = 1   ζ_1 = 0.17   ζ_2 = 0.59", 26, INK, 20, 26); show(badge, B.illus + 0.4);
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length, m1, z1: z1[0], m2, q15 };
