// G-pass patch for card_builder.js (stored in Figma as text layer 64:2). Applied locally by apply_g_patch.js and in Figma by
// the same replacement list. Adds: real subscripts (text before "_" stays, the run after it is smaller and lowered inside a
// wrapping auto-layout of word frames), table column weights + header fit, and a timeline "span" bracket.
const REPL = [
[String.raw`async function txt(parent, name, s, style, color, x, y, w, align = "LEFT") {`,
String.raw`const RICHF = new Map(), SUBN = new Set();
const hasSub = s => typeof s === "string" && !/\.(py|json|png|md)\b/.test(s) && /[A-Za-zΑ-Ωα-ω⁺⁻)\u0300-\u036f]_[A-Za-z0-9Α-Ωα-ω]/.test(s);
const subRuns = word => { const out = []; let last = 0, m; const re = /_([A-Za-z0-9Α-Ωα-ω]+(?:,[0-9A-Za-z]+)?)/g;
  while ((m = re.exec(word))) { if (m.index > last) out.push({ t: word.slice(last, m.index) }); out.push({ t: m[1], sub: true }); last = m.index + m[0].length; }
  if (last < word.length) out.push({ t: word.slice(last) }); return out; };
const relayout = (f, size) => { f.itemSpacing = Math.round(size * 0.28);
  for (const w of f.children) { if (w.type === "TEXT") { w.fontSize = size; continue; }
    let cx = 0, h = 0; const kids = [...w.children]; for (const t of kids) { const sub = SUBN.has(t.id); t.fontSize = sub ? Math.max(8, Math.round(size * 0.62)) : size; t.x = cx; cx += t.width; if (!sub) h = Math.max(h, t.height); }
    let hh = h; for (const t of kids) { if (!SUBN.has(t.id)) { t.y = 0; continue; } t.y = Math.round(0.8 * h + 0.22 * size - 0.8 * t.height); hh = Math.max(hh, t.y + t.height); }
    w.resize(Math.max(cx, 1), Math.max(hh, 1)); } };
async function rich(parent, name, s, style, color, x, y, w, align) {
  const f = figma.createFrame(); parent.appendChild(f); f.name = name; f.fills = []; f.clipsContent = false; f.layoutMode = "HORIZONTAL"; f.layoutWrap = "WRAP";
  f.resize(w || 600, 10); f.primaryAxisSizingMode = "FIXED"; f.counterAxisSizingMode = "AUTO"; f.x = x; f.y = y;
  f.primaryAxisAlignItems = align === "CENTER" ? "CENTER" : align === "RIGHT" ? "MAX" : "MIN"; f.counterAxisAlignItems = "MIN"; f.counterAxisSpacing = 0;
  const mk = async str => { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = str; t.fills = bp(color); t.textAutoResize = "WIDTH_AND_HEIGHT"; return t; };
  const size = TS[style].fontSize;
  for (const word of String(s).split(/ +/).filter(Boolean)) {
    const runs = subRuns(word);
    if (!runs.some(r => r.sub)) { f.appendChild(await mk(word)); continue; }
    const wf = figma.createFrame(); f.appendChild(wf); wf.name = "word"; wf.fills = []; wf.clipsContent = false;
    for (const r of runs) { const t = await mk(r.t); wf.appendChild(t); if (r.sub) SUBN.add(t.id); } }
  RICHF.set(f.id, size); relayout(f, size); return f; }
async function txt(parent, name, s, style, color, x, y, w, align = "LEFT") {
  if (hasSub(s)) return rich(parent, name, s, style, color, x, y, w, align);`],
[String.raw`const fit = (t, maxH, min = 18) => { let s = t.fontSize;`,
String.raw`const cap = (t, m) => { if (RICHF.has(t.id)) { if (RICHF.get(t.id) > m) { RICHF.set(t.id, m); relayout(t, m); } } else t.fontSize = Math.min(t.fontSize, m); return t; };
const fit = (t, maxH, min = 18) => { if (RICHF.has(t.id)) { let r = RICHF.get(t.id); while (t.height > maxH && r > min) { r -= 1; relayout(t, r); RICHF.set(t.id, r); } return t; } let s = t.fontSize;`],
[String.raw`const cols = card.columns.length, cw = W / cols; let y = top;`,
String.raw`const cols = card.columns.length; const wt = card.colWeights || card.columns.map(() => 1 / cols); const cwA = wt.map(v => v * W); const cxA = cwA.map((_, i) => cwA.slice(0, i).reduce((a, b) => a + b, 0)); let y = top;`],
[String.raw`for (let c = 0; c < cols; c++) await txt(hdr, "col", card.columns[c], "Label/Mono", C.textAccent, c * cw + 20, 16, cw - 40);`,
String.raw`for (let c = 0; c < cols; c++) { const ht = await txt(hdr, "col", card.columns[c], "Label/Mono", C.textAccent, cxA[c] + 20, 16, cwA[c] - 40); fit(ht, 34, 12); ht.y = Math.round((60 - ht.height) / 2); }`],
[String.raw`c === 0 ? C.text : C.text, c * cw + 20, 14, cw - 40); t.fontSize = Math.min(t.fontSize, 30); fit(t, rh - 24, 16);`,
String.raw`c === 0 ? C.text : C.text, cxA[c] + 20, 14, cwA[c] - 40); cap(t, 30); fit(t, rh - 24, 16);`],
[String.raw`fit(d, bottom - top - 200, 18);`, String.raw`fit(d, bottom - top - (card.span ? 300 : 200), 18);`],
[String.raw`} else if (kind === "table" && card.columns) {`,
String.raw`if (card.span) {   // bracket over steps span.from..span.to, revealed at reveal index span.at
      const a = X0 + card.span.from * step + step / 2 - X0, z = X0 + card.span.to * step + step / 2 - X0;
      const sp = figma.createFrame(); F.appendChild(sp); sp.name = "span"; sp.fills = []; sp.clipsContent = false; sp.resize(W, 130); sp.x = X0; sp.y = bottom - 110;
      const bar = figma.createRectangle(); sp.appendChild(bar); bar.resize(z - a, 8); bar.x = a; bar.y = 30; bar.fills = bp(C.gold); bar.cornerRadius = 4; bar.setEffectStyleIdAsync(ES["Glow/Accent"]);
      for (const xx of [a, z]) { const tk = figma.createRectangle(); sp.appendChild(tk); tk.name = "span end"; tk.resize(6, 34); tk.x = xx - 3; tk.y = 8; tk.fills = bp(C.gold); tk.cornerRadius = 3; }
      const lb = await txt(sp, "span label", card.span.label, "Heading/H2", C.gold, a, 52, z - a, "CENTER"); fit(lb, 70, 22);
      reveal.splice(card.span.at, 0, sp);
    }
  } else if (kind === "table" && card.columns) {`],
];
if (typeof module !== "undefined") module.exports = REPL;
