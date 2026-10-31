// RLC tail · OV turn 620 (1b94d5f113f74a0a): the convergence prediction q(t) → 0, every impulse decaying
// at α, and α rising across adaptation cycles. Run as g_head.js + this file. Beats are seconds from the
// start of turn 620. The three cycles use the book's Laplace fits ζ = 0.17 (1865), 0.59 (1964) and
// 0.97 (2020) with ω₀ = 1 and Q₀ = 1, so α = ζ; the curves are Equation 2.12 evaluated here.
const B = { exact: 0.12, removed: 3.56, approaches: 6.48, every: 9.54, alpha: 11.48, higher: 12.9, increasing: 18.14, faster: 19.88, arc: 23.28, envelope: 31.28, end: 34.94 };
const { F, head } = await frame("g-rlc tail 620", "The Convergence Prediction", 9);
await captions(F, [[B.exact, "AN EXACT CIRCUIT-THEORETIC RESULT · WITHOUT A DRIVING VOLTAGE, q(t) RETURNS TO ZERO"], [B.every, "EVERY IMPULSE DECAYS AT THE RATE α"],
  [B.higher, "EACH ADAPTATION CYCLE ADDS CARCERAL RESISTANCE · α RISES · BACKLASH COMES FASTER"], [B.arc, "THE ARC BENDS TOWARD THE EXTRACTION BASELINE · THE DECAY ENVELOPE SHRINKS EACH CYCLE"]]);
await source(F, "The Original Power, Ch. 2, Eq. 2.12 · ζ = 0.17, 0.59, 0.97 from the book's Laplace fits for 1865, 1964, 2020 · ω₀ = 1, Q₀ = 1");
const lim = math(F, "limit", "q(t) → 0  as  t → ∞", 52, INK, 190, 272); show(lim, B.exact + 0.4);
const PL = { x: 190, y: 420, w: 1000, h: 430 }, TE = 24;
const y0 = PL.y + PL.h / 2, TX = t => PL.x + t / TE * PL.w, QY = q => y0 - q * PL.h / 2.3;
const pts = f => Array.from({ length: 241 }, (_, i) => { const t = i * TE / 240; return [TX(t), QY(f(t))]; });
const S = stage(F, "plot");
const yAx = line(S, "q axis", [[PL.x, PL.y + PL.h], [PL.x, PL.y - 16]], INK, 3, { arrow: true }), tAx = line(S, "t axis", [[PL.x, y0], [PL.x + PL.w + 14, y0]], INK, 3, { arrow: true });
const ql = math(S, "q label", "q(t)", 34, INK, PL.x + 14, PL.y - 44), tl = math(S, "t label", "t → ∞", 30, INK, PL.x + PL.w - 40, y0 + 6);
[yAx, tAx, ql, tl].forEach(n => show(n, 0.4));
const bT = await txt(S, "baseline tag", "q = 0 · the extraction baseline", "Label/Mono Small", INK, PL.x + PL.w - 400, y0 + 52, 340, 18); show(bT, B.approaches);
const CY = [["1865", 0.17, STAT, B.removed + 0.2], ["1964", 0.59, RED, B.higher + 2.4], ["2020", 0.97, DIMC, B.increasing + 0.2]];
const qf = z => { const w = Math.sqrt(1 - z * z); return t => Math.exp(-z * t) * (Math.cos(w * t) + z / w * Math.sin(w * t)); };
// settle time (5 %) and overshoot depth read off the same function
const metrics = z => { const f = qf(z); let last = 0, mn = 0; for (let t = 0; t <= 120; t += 0.01) { const v = f(t); if (Math.abs(v) > 0.05) last = t; mn = Math.min(mn, v); } return { settle: last, over: -mn }; };
const RP = await panel(F, "panel cycles", 1260, 420, 470, 300, "THE BOOK'S LAPLACE FITS"); show(RP, B.higher);
const qs = [];
for (let k = 0; k < 3; k++) {
  const [yr, z, col, on] = CY[k], m = metrics(z);
  const q = curve(S, `q · ${yr} · ζ ${z}`, pts(qf(z)), col, 5);
  kf(q, "PATH_TRIM_END", [[0, 0.001], [on, 0.001], [on + (k ? 1.6 : 4.6), 1]], "EASE_IN_AND_OUT"); op(q, [[on - 0.01, 0], [on, 1]]); qs.push(q);
  const ep = curve(S, `envelope + · ${yr}`, pts(t => Math.exp(-z * t)), col, 2, [10, 8]), en = curve(S, `envelope − · ${yr}`, pts(t => -Math.exp(-z * t)), col, 2, [10, 8]);
  const eOn = k ? on + 1.2 : B.every + 0.2; show(ep, eOn); show(en, eOn + 0.1);
  const row = math(RP, `row ${yr}`, `${yr}   ζ = α = ${z}`, 30, col, 20, 44 + k * 80);
  const rt = await txt(RP, `row ${yr} readout`, `settles by t ≈ ${m.settle.toFixed(1)} · backlash ${Math.round(100 * m.over)}%`, "Label/Mono Small", col, 20, 92 + k * 80, 440, 16);
  show(row, k ? on + 0.4 : B.higher + 0.4); show(rt, k ? on + 0.8 : B.higher + 0.8);
}
const ar = line(S, "to zero", [[PL.x + PL.w - 150, y0 - 70], [PL.x + PL.w - 30, y0 - 8]], INK, 3, { arrow: true }); show(ar, B.approaches + 0.8);
const arT = math(S, "→ 0 tag", "q → 0", 28, INK, PL.x + PL.w - 250, y0 - 112); show(arT, B.approaches + 0.8);
const aT = math(S, "alpha label", "± Q_0 e^{−αt}", 32, STAT, TX(3.4), QY(Math.exp(-0.17 * 3.4)) - 64); show(aT, B.every + 0.6, B.higher + 2.2);
const af = math(F, "alpha formula", "α = R/(2L)", 40, RED, 760, 284); show(af, B.alpha); const afT = await txt(F, "alpha tag", "higher carceral resistance R → larger α", "Label/Mono Small", RED, 760 + af.width + 20, 300, 520, 18); show(afT, B.higher + 1.0);
// the arc: the three envelopes light in order, oldest first
const envs = S.children.filter(n => n.name.startsWith("envelope +"));
envs.forEach((e, k) => kf(e, "STROKE_WEIGHT", [[0, 2], [B.envelope - 0.2 + k * 0.9, 2], [B.envelope + k * 0.9, 5], [B.end, 5]], "EASE_OUT"));
kf(qs[0], "OPACITY", [[0, 0], [B.removed + 0.2 - 0.01, 0], [B.removed + 0.2, 1], [B.higher + 2.4, 1], [B.higher + 3.0, 0.45]]);
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length, m: CY.map(c => metrics(c[1])) };
