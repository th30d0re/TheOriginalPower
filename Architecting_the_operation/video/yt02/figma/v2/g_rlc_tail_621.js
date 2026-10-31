// RLC tail · OV turn 621 (02842d2f4f1ab121): the resonance escape condition (tex 2318-2330). Amplitude
// against driving frequency peaks at ω₀ = 1/√(LC); at the peak |q_{res}| = V₀/(Rω₀), Q_f times the
// sub-resonant response; lowering R raises the peak; a sustained drive at ω₀ accumulates. Run as
// g_head.js + this file. Beats are seconds from the start of turn 621. Curves are the driven series-RLC
// steady state |q(ω)| = V₀ / √((1/C − Lω²)² + (Rω)²) and an RK4 solve of the drive from rest, with
// L = C = V₀ = 1 (illustrative); the R sweep and the build-up are derived from the book's statements.
const B = { cond: 0.08, omega: 3.28, w0: 5.58, root: 7.62, cancel: 10.94, qres: 13.4, Qf: 20.66, times: 25.36, sustained: 31.86, exceed: 40.28, plain: 43.72, end: 50.68 };
const { F, head } = await frame("g-rlc tail 621", "The Resonance Escape Condition", 10);
await captions(F, [[B.cond, "THE RESONANCE ESCAPE CONDITION · DRIVE THE CIRCUIT AT ITS NATURAL FREQUENCY"], [B.cancel, "AT RESONANCE THE REACTIVE IMPEDANCES CANCEL · ONLY R REMAINS"],
  [B.qres, "THE STEADY-STATE CHARGE AMPLITUDE AT RESONANCE"], [B.times, "THE RESONANT RESPONSE IS THE QUALITY FACTOR TIMES THE SUB-RESONANT RESPONSE"],
  [B.sustained, "DERIVED SWEEP · LOWER R RAISES THE QUALITY FACTOR AND THE RESONANT PEAK"], [B.plain, "COORDINATION AT THE CIRCUIT'S OWN RHYTHM ACCUMULATES ACROSS REPEATED IMPULSES"]]);
await source(F, "The Original Power, Ch. 2, resonance escape condition · L = C = V₀ = 1, R swept (derived, illustrative)");
const top = math(F, "resonance condition", "ω = ω_0 = 1/√(LC)", 48, INK, 190, 272); show(top, B.omega);
windows(ringAround(F, top, STAT, 4), [[B.w0, B.cancel - 0.2]]);
// ── amplitude against driving frequency ──
const PL = { x: 190, y: 400, w: 900, h: 440 }, WM = 2.4, AM = 11;
const WX = w => PL.x + w / WM * PL.w, AY = v => PL.y + PL.h - Math.min(v, AM) / AM * PL.h;
const amp = R => w => 1 / Math.sqrt((1 - w * w) ** 2 + (R * w) ** 2);
const pts = f => Array.from({ length: 241 }, (_, i) => { const w = i * WM / 240; return [WX(w), AY(f(w))]; });
const S = stage(F, "plot");
const yAx = line(S, "amplitude axis", [[PL.x, PL.y + PL.h], [PL.x, PL.y - 16]], INK, 3, { arrow: true }), xAx = line(S, "ω axis", [[PL.x, PL.y + PL.h], [PL.x + PL.w + 14, PL.y + PL.h]], INK, 3, { arrow: true });
const al = math(S, "|q| label", "|q|", 34, INK, PL.x + 14, PL.y - 44), wl = math(S, "ω label", "ω", 32, INK, PL.x + PL.w - 2, PL.y + PL.h + 2);
const wT = await txt(S, "ω tag", "driving frequency", "Label/Mono Small", INK, PL.x + PL.w - 220, PL.y + PL.h + 14, 200, 16); wT.textAlignHorizontal = "RIGHT";
[yAx, xAx, al, wl, wT].forEach(n => show(n, 0.5));
const w0m = line(S, "ω0 marker", [[WX(1), PL.y + PL.h], [WX(1), PL.y]], STAT, 2, { dash: [8, 8] }); show(w0m, B.w0);
const w0l = math(S, "ω0 tick", "ω_0", 30, STAT, WX(1) - 16, PL.y + PL.h + 2); show(w0l, B.w0);
const RS = [[0.4, 1.4], [0.25, B.sustained + 2.5], [0.15, B.sustained + 4.1], [0.1, B.sustained + 6.8]];
const RP = await panel(F, "panel readout", 1180, 612, 550, 72, "READOUT · DERIVED, ILLUSTRATIVE"); show(RP, 1.4);
for (let i = 0; i < RS.length; i++) {
  const [R, on] = RS[i], off = (RS[i + 1] || [0, B.end + 1])[1], last = i === RS.length - 1;
  const c = curve(S, `amplitude · R ${R}`, pts(amp(R)), i ? RED : STAT, 5);
  if (i === 0) { kf(c, "PATH_TRIM_END", [[0, 0.001], [on, 0.001], [on + 1.8, 1]], "EASE_IN_AND_OUT"); op(c, [[on - 0.01, 0], [on, 1]]); }
  else op(c, [[on - 0.01, 0], [on + 0.3, 1], ...(last ? [] : [[off, 1], [off + 0.25, 0.25]])]);
  const r = math(RP, `readout R ${R}`, `R = ${R}    Q_f = ${(1 / R).toFixed(1)}    |q_{res}| = ${(1 / R).toFixed(1)} V_0 C`, 26, INK, 20, 26);
  op(r, [[on - 0.01, 0], [on + 0.3, 1], ...(last ? [] : [[off, 1], [off + 0.2, 0]])]);
}
// reactance crossing: ωL rises, 1/(ωC) falls, they meet at ω₀ (own scale, 0 to 3)
const ZY = z => PL.y + PL.h - z / 3 * PL.h;
const xl = curve(S, "ωL", Array.from({ length: 61 }, (_, i) => { const w = i * WM / 60; return [WX(w), ZY(Math.min(w, 3))]; }), MAT, 3, [10, 6]);
const xc = curve(S, "1/(ωC)", Array.from({ length: 61 }, (_, i) => { const w = 1 / 3 + i * (WM - 1 / 3) / 60; return [WX(w), ZY(1 / w)]; }), INK, 3, [10, 6]);
const xT = math(S, "reactance tag", "ωL = 1/(ωC)", 30, MAT, WX(1) + 18, ZY(1) - 54);
for (const n of [xl, xc, xT]) show(n, B.cancel + 0.1, B.qres + 1.6);
// |q_{res}| bracket at the base peak, and the Q_f comparison with the sub-resonant level V₀C
const pk = AY(1 / 0.4);
const br = line(S, "q_{res} bracket", [[WX(1) + 26, PL.y + PL.h], [WX(1) + 26, pk]], STAT, 3, { arrow: true }); const brT = math(S, "q_{res} tag", "|q_{res}| = V_0/(R ω_0)", 28, STAT, WX(1) + 40, pk - 6);
show(br, B.qres + 1.4, B.sustained); show(brT, B.qres + 1.6, B.sustained);
const lvl = line(S, "sub-resonant level", [[PL.x, AY(1)], [PL.x + PL.w, AY(1)]], DIMC, 2, { dash: [8, 8] });
const lvlT = await txt(S, "sub-resonant tag", "sub-resonant response · |q| ≈ V₀C", "Label/Mono Small", DIMC, WX(1.45), AY(1) - 26, 420, 16);
const qa = line(S, "× Q_f arrow", [[WX(0.62), AY(1)], [WX(0.62), pk + 4]], STAT, 3, { arrow: true }); const qaT = math(S, "× Q_f tag", "× Q_f", 30, STAT, WX(0.62) - 92, (AY(1) + pk) / 2 - 24);
for (const n of [lvl, lvlT]) show(n, B.times + 1.0); show(qa, B.times + 1.6, B.sustained); show(qaT, B.times + 1.8, B.sustained);
const boundT = await txt(S, "unbounded tag", "as R → 0 the resonant response grows without bound", "Label/Mono Small", RED, WX(1) + 24, PL.y + 6, 520, 16); show(boundT, B.exceed);
// ── right column: the drive, the resonant amplitude, the quality factor ──
const P1 = await panel(F, "panel drive", 1180, 300, 550, 92, "SUSTAINED PERIODIC DRIVE"); math(P1, "drive", "V(t) = V_0 cos(ωt)", 34, INK, 20, 32); show(P1, B.cond + 0.4);
const P2 = await panel(F, "panel q_{res}", 1180, 404, 550, 92, "STEADY-STATE AMPLITUDE AT RESONANCE"); math(P2, "q_{res}", "|q_{res}| = V_0/(R ω_0) = (V_0/R)√(L/C)", 30, STAT, 20, 34); show(P2, B.qres + 1.2);
const P3 = await panel(F, "panel Q_f", 1180, 508, 550, 92, "QUALITY FACTOR"); math(P3, "Q_f", "Q_f = (1/R)√(L/C)", 34, RED, 20, 32); show(P3, B.Qf);
// ── a sustained drive at ω₀ from rest accumulates (RK4, R = 0.1) ──
const P5 = await panel(F, "panel accumulation", 1180, 696, 550, 196, "DRIVEN AT ω₀ FROM REST · R = 0.1"); show(P5, B.plain - 0.6);
const sim = []; { let q = 0, v = 0; const h = 0.05, R = 0.1, fz = (t, q, v) => [v, Math.cos(t) - R * v - q];
  for (let i = 0; i <= 1200; i++) { const t = i * h; if (i % 2 === 0) sim.push([t, q]);
    const k1 = fz(t, q, v), k2 = fz(t + h / 2, q + h / 2 * k1[0], v + h / 2 * k1[1]), k3 = fz(t + h / 2, q + h / 2 * k2[0], v + h / 2 * k2[1]), k4 = fz(t + h, q + h * k3[0], v + h * k3[1]);
    q += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); } }
const MX = t => 1200 + t / 60 * 510, MY = q => 696 + 120 - q / 10 * 62;
const base = line(F, "mini baseline", [[MX(0), MY(0)], [MX(60), MY(0)]], DIMC, 1); show(base, B.plain - 0.4);
const acc = curve(F, "build-up at ω0", sim.map(([t, q]) => [MX(t), MY(q)]), STAT, 2);
kf(acc, "PATH_TRIM_END", [[0, 0.001], [B.plain + 0.3, 0.001], [B.plain + 5.0, 1]], "LINEAR"); op(acc, [[B.plain + 0.29, 0], [B.plain + 0.3, 1]]);
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length, qmax: Math.max(...sim.map(s => Math.abs(s[1]))) };
