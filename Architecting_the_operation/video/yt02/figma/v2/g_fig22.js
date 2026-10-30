// G5 · Figure 2.2 (book fig:causal_reversal), turns 98–100. Beats are seconds from the start of turn 98
// (c8a4cfdabb044e6c); B lists them by spoken phrase. Each box and arrow lights on the word that names it.
const B = {
  elite: 8.36, produce: 9.88, systemic: 10.28, cultivates: 13.3, inter: 14.12,          // turn 98
  figure: 16.0, mechanism: 19.08, twoArrows: 20.08, chainElite: 23.38, chainSys: 25.32, // turn 99 (+16.00)
  fromSys: 27.36, chainInter: 29.46,
  curving: 31.32, dashed: 34.0, fromInter: 35.98, backInto: 37.32, labeled: 39.3, rfl: 40.26, // turn 100 (+31.32)
  end: 42.4,
};
const { F, head } = await frame("g-fig2.2 causal chain", "Figure 2.2 · The Causal Reversal", 0);
await captions(F, [[0.5, "EQUATION 2.6 · THE GENERATIVE CHAIN"], [B.figure, "FIGURE 2.2 · TWO SOLID FORWARD ARROWS"], [B.curving, "FIGURE 2.2 · THE DASHED REINFORCING FEEDBACK LOOP"]]);
await source(F, "The Original Power, Ch. 2, Fig. 2.2 and Eq. 2.6");
const ids = [];

// ── conventional row (top, struck through), as in the book's figure ──
const top = figma.createFrame(); F.appendChild(top); top.name = "conventional row"; top.fills = []; top.clipsContent = false; top.resize(1920, 1080);
const TX = [500, 960, 1420], TY = 330;
for (const [i, s] of ["Individual Prejudice", "Discriminatory Actions", "Systemic Outcomes"].entries()) {
  const r = figma.createRectangle(); top.appendChild(r); r.name = "box " + s; r.resize(300, 72); r.x = TX[i] - 150; r.y = TY; r.cornerRadius = 10; r.fills = solid(RED, 0.10); r.strokes = solid(RED, 0.5); r.strokeWeight = 2;
  const t = await txt(top, "label " + s, s, "Body/Default", RED, TX[i] - 150, TY + 20, 300, 26); t.textAlignHorizontal = "CENTER";
  if (i < 2) line(top, "arrow " + i, [[TX[i] + 158, TY + 36], [TX[i + 1] - 162, TY + 36]], RED, 3, { arrow: true });
}
const strike = line(top, "strike-through", [[TX[0] - 190, TY + 36], [TX[2] + 190, TY + 36]], RED, 4);
const convT = await txt(top, "row tag", "conventional framing", "Label/Mono Small", RED, TX[0] - 150, TY - 34, 400, 20);
const rev = line(top, "causal reversal arrow", [[960, TY + 100], [960, 470]], DIMC, 4, { arrow: true });
const revT = await txt(top, "reversal tag", "causal reversal", "Label/Mono Small", DIMC, 980, TY + 112, 240, 20);
kf(top, "OPACITY", [[0, 0], [B.mechanism, 0], [B.mechanism + 0.6, 0.55], [B.twoArrows, 0.55], [B.twoArrows + 0.5, 0.3]], "EASE_OUT");
draw(strike, B.mechanism + 0.4, B.mechanism + 1.2);

// ── historical row: Elite Economic Interests → Systemic Racialization → Interpersonal Prejudice ──
const BX = [450, 960, 1470], BY = 520, BW = 310, BH = 124;
const box = [], hl = [];
for (const [i, s] of ["Elite Economic\nInterests", "Systemic\nRacialization", "Interpersonal\nPrejudice"].entries()) {
  const g = figma.createFrame(); F.appendChild(g); g.name = "node " + s.replace("\n", " "); g.fills = []; g.clipsContent = false; g.resize(BW, BH); g.x = BX[i] - BW / 2; g.y = BY;
  const r = figma.createRectangle(); g.appendChild(r); r.name = "box"; r.resize(BW, BH); r.cornerRadius = 14; r.fills = bp(C.s1); r.strokes = solid(MAT); r.strokeWeight = 3; await r.setEffectStyleIdAsync(ES["Elevation/1 Panel"]);
  const t = await txt(g, "label", s, "Heading/H2", C.text, 0, 18, BW, 38); t.textAlignHorizontal = "CENTER"; t.y = (BH - t.height) / 2;
  const h = figma.createRectangle(); g.appendChild(h); h.name = "highlight"; h.resize(BW + 20, BH + 20); h.x = -10; h.y = -10; h.cornerRadius = 20; h.fills = solid(STAT, 0.10); h.strokes = solid(STAT); h.strokeWeight = 4; await h.setEffectStyleIdAsync(ES["Glow/Accent"]);
  box.push(g); hl.push(h);
}
const rowT = await txt(F, "row tag historical", "historical record · Eq. 2.6", "Label/Mono Small", MAT, BX[0] - BW / 2, BY - 34, 500, 20);
show(rowT, B.elite);
show(box[0], B.elite); show(box[1], B.systemic); show(box[2], B.inter);
// the two solid forward arrows, drawn on the verbs that name them, and their gold highlight copies
const ay = BY + BH / 2;
const A = [[[BX[0] + BW / 2 + 10, ay], [BX[1] - BW / 2 - 14, ay]], [[BX[1] + BW / 2 + 10, ay], [BX[2] - BW / 2 - 14, ay]]];
const arr = A.map((p, i) => line(F, "forward arrow " + (i + 1), p, MAT, 7, { arrow: true }));
const arrH = A.map((p, i) => line(F, "forward arrow highlight " + (i + 1), p, STAT, 9, { arrow: true }));
const verb1 = await txt(F, "verb produce", "produces", "Label/Mono Small", MAT, A[0][0][0], ay - 40, A[0][1][0] - A[0][0][0], 20); verb1.textAlignHorizontal = "CENTER";
const verb2 = await txt(F, "verb cultivates", "cultivates", "Label/Mono Small", MAT, A[1][0][0], ay - 40, A[1][1][0] - A[1][0][0], 20); verb2.textAlignHorizontal = "CENTER";
draw(arr[0], B.produce - 0.2, B.produce + 0.5); show(verb1, B.produce);
draw(arr[1], B.cultivates - 0.2, B.cultivates + 0.5); show(verb2, B.cultivates);
// turn 98 names each node once; turn 99 walks the chain again, node → arrow → node
windows(hl[0], [[B.elite, B.produce], [B.chainElite, B.chainSys]]);
windows(hl[1], [[B.systemic, B.cultivates], [B.chainSys, B.fromSys + 0.8], [B.backInto, B.end]]);
windows(hl[2], [[B.inter, B.figure], [B.chainInter, B.curving + 0.6], [B.fromInter, B.backInto]]);
windows(arrH[0], [[B.twoArrows, B.twoArrows + 1.6], [B.chainElite + 0.9, B.chainSys + 0.6]]);
windows(arrH[1], [[B.twoArrows + 0.3, B.twoArrows + 1.9], [B.fromSys, B.chainInter + 0.6]]);
const solidT = await txt(F, "tag two solid arrows", "two solid forward arrows · the generative direction", "Label/Mono Small", STAT, BX[0] - BW / 2, BY + BH + 26, 900, 20);
show(solidT, B.twoArrows, B.curving);

// ── the dashed Reinforcing Feedback Loop: Interpersonal Prejudice back into Systemic Racialization ──
const x0 = BX[2] - 40, x1 = BX[1] + 40, yb = BY + BH + 8;
// Figma cannot path-trim a dashed stroke, so each dash is its own segment, lit in order along the arc.
const P = [[x0, yb], [x0 - 20, yb + 150], [x1 + 20, yb + 150], [x1, yb + 6]];
const bez = u => [0, 1].map(k => (1 - u) ** 3 * P[0][k] + 3 * (1 - u) ** 2 * u * P[1][k] + 3 * (1 - u) * u * u * P[2][k] + u ** 3 * P[3][k]);
const loop = figma.createFrame(); F.appendChild(loop); loop.name = "reinforcing feedback loop"; loop.fills = []; loop.clipsContent = false; loop.resize(1920, 1080);
const ND = 26;
for (let i = 0; i < ND; i++) { const d = line(loop, "dash " + i, [bez(i / ND), bez((i + 0.6) / ND)], STAT, 5); const t = B.dashed + (B.backInto + 0.4 - B.dashed) * i / ND; show(d, t, null, 0.15); }
const head2 = line(F, "loop arrowhead", [bez(0.97), [x1 + 1, yb + 4]], STAT, 5, { arrow: true });
show(head2, B.backInto + 0.4, null, 0.2);
const loopT = await txt(F, "label Reinforcing Feedback Loop", "Reinforcing Feedback Loop", "Heading/H2", STAT, x1 - 60, yb + 128, 600, 36); loopT.textAlignHorizontal = "CENTER";
const loopS = await txt(F, "label cultivated", "cultivated by the system that produced it", "Label/Mono Small", DIMC, x1 - 60, yb + 176, 600, 20); loopS.textAlignHorizontal = "CENTER";
show(loopT, B.labeled); show(loopS, B.rfl + 0.4);
const loopH = figma.createRectangle(); F.appendChild(loopH); loopH.name = "highlight loop label"; loopH.resize(loopT.width + 24, loopT.height + 14); loopH.x = loopT.x - 12; loopH.y = loopT.y - 7; loopH.cornerRadius = 10; loopH.fills = []; loopH.strokes = solid(STAT); loopH.strokeWeight = 2;
windows(loopH, [[B.rfl, B.rfl + 1.8]]);
const dashT = await txt(F, "tag dashed", "dashed · maintenance loop", "Label/Mono Small", STAT, x0 + 40, yb + 70, 300, 20);
show(dashT, B.dashed + 0.6);
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length, dashes: ND };
