const CARDS = [
  {
    "kind": "title",
    "headline": "Episode 1 · What Racism Is",
    "items": [
      {
        "title": "Empirical Proposition Test",
        "detail": "Five centuries of primary archival records audit the causal direction of racial hierarchy."
      },
      {
        "title": "Construct Separation",
        "detail": "Interpersonal bias, prejudice, and discrimination separated from systemic racial architecture."
      },
      {
        "title": "Causal Reversal Hypothesis",
        "detail": "Four falsifiable predictions and three refutation standards tested against historical data."
      },
      {
        "title": "Narration Disclosure",
        "detail": "Artificial intelligence voice clone trained on the author's speech."
      }
    ],
    "sources": "The Original Power, Preface & Ch. 2, §2.2",
    "qrUrl": "",
    "id": "S00-10",
    "frame": "card v2 S00-01",
    "primary": "S00-01",
    "beats": [
      0.25,
      48.66,
      68.39
    ],
    "duration": 73.71
  },
  {
    "kind": "source",
    "headline": "Dictionary Order as Implicit Causal Theory",
    "items": [
      {
        "title": "Numbered Sense Sequence",
        "detail": "Lexical ranking encodes an unstated theory of causation before empirical inquiry starts."
      },
      {
        "title": "Slot 1 Priority Effect",
        "detail": "Assigning interpersonal hostility to Sense 1 frames institutional patterns as derivative byproducts."
      },
      {
        "title": "Moral-Psychologizing Audit",
        "detail": "Public controversy narrows to inspecting private hearts, personal phrasing, and subjective intent."
      },
      {
        "title": "Malice Inquiry Default",
        "detail": "Courts and workplaces search for individual animus when confronted with structural disparity."
      }
    ],
    "sources": "The Original Power, Ch. 2, §2.2",
    "qrUrl": "",
    "id": "S00-06",
    "frame": "card v2 S00-02",
    "primary": "S00-02",
    "beats": [
      0.25,
      12.86
    ],
    "duration": 26.12
  },
  {
    "kind": "title",
    "headline": "Segment 01 · Bias, Prejudice, Discrimination",
    "items": [
      {
        "title": "Four Conflated Terms",
        "detail": "Colloquial speech merges bias, prejudice, discrimination, and racism into one cluster."
      },
      {
        "title": "Social-Science Taxonomy",
        "detail": "Experimental psychology assigns distinct operational boundaries to the first three constructs."
      },
      {
        "title": "Analytical Assignment",
        "detail": "Preface and Chapter 2 preserve each psychological term for its exact interpersonal scope."
      }
    ],
    "sources": "The Original Power, Preface & Ch. 2, §2.2",
    "qrUrl": "",
    "id": "S01-01",
    "frame": "card v2 S00-04",
    "primary": "S00-04",
    "beats": [
      0.25
    ],
    "duration": 9.14
  },
  {
    "kind": "table",
    "headline": "Lexical Hierarchy · Standard Dictionary Entry",
    "columns": [
      "Slot",
      "Dictionary Sense",
      "Implied Causal Weight"
    ],
    "items": [
      {
        "cells": [
          "Entry Order",
          "Individual animus precedes systemic structure",
          "Lexical priority"
        ]
      },
      {
        "cells": [
          "Sense 1",
          "Interpersonal hostility or racial antipathy",
          "Primary root"
        ]
      },
      {
        "cells": [
          "Sense 2",
          "Doctrine of biological group hierarchy",
          "Ideological belief"
        ]
      },
      {
        "cells": [
          "Sense 3",
          "Institutional practices yielding unequal outcomes",
          "Secondary extension"
        ]
      },
      {
        "cells": [
          "Figure 2.3 (Left)",
          "Inverted pyramid resting on private attitude",
          "Conventional baseline"
        ]
      }
    ],
    "sources": "The Original Power, Ch. 2, §2.2, Fig. 2.3",
    "qrUrl": "",
    "id": "S00-01",
    "frame": "card v2 S00-07",
    "primary": "S00-07",
    "beats": [
      0.25,
      14.68,
      23.11,
      32.42,
      41.8
    ],
    "duration": 49.51
  },
  {
    "kind": "table",
    "headline": "Lexical Hierarchy · Standard Dictionary Entry",
    "columns": [
      "Slot",
      "Dictionary Sense",
      "Implied Causal Weight"
    ],
    "items": [
      {
        "cells": [
          "Entry Order",
          "Individual animus precedes systemic structure",
          "Lexical priority"
        ]
      },
      {
        "cells": [
          "Sense 1",
          "Interpersonal hostility or racial antipathy",
          "Primary root"
        ]
      },
      {
        "cells": [
          "Sense 2",
          "Doctrine of biological group hierarchy",
          "Ideological belief"
        ]
      },
      {
        "cells": [
          "Sense 3",
          "Institutional practices yielding unequal outcomes",
          "Secondary extension"
        ]
      },
      {
        "cells": [
          "Figure 2.3 (Left)",
          "Inverted pyramid resting on private attitude",
          "Conventional baseline"
        ]
      }
    ],
    "sources": "The Original Power, Ch. 2, §2.2, Fig. 2.3",
    "qrUrl": "",
    "id": "S00-01",
    "frame": "card v2 S00-11",
    "primary": "S00-11",
    "beats": [
      0.25,
      10.06
    ],
    "duration": 18.4
  },
  {
    "kind": "title",
    "headline": "Episode 1 · What Racism Is",
    "items": [
      {
        "title": "Empirical Proposition Test",
        "detail": "Five centuries of primary archival records audit the causal direction of racial hierarchy."
      },
      {
        "title": "Construct Separation",
        "detail": "Interpersonal bias, prejudice, and discrimination separated from systemic racial architecture."
      },
      {
        "title": "Causal Reversal Hypothesis",
        "detail": "Four falsifiable predictions and three refutation standards tested against historical data."
      },
      {
        "title": "Narration Disclosure",
        "detail": "Artificial intelligence voice clone trained on the author's speech."
      }
    ],
    "sources": "The Original Power, Preface & Ch. 2, §2.2",
    "qrUrl": "",
    "id": "S00-10",
    "frame": "card v2 S00-14",
    "primary": "S00-14",
    "beats": [
      0.25,
      9.16,
      18.35
    ],
    "duration": 26.98
  }
];
const PAGE_NAME = "YT02v2 · Cards";
let targetPage = figma.root.children.find(p => p.name === PAGE_NAME);
if (!targetPage) { targetPage = figma.createPage(); targetPage.name = PAGE_NAME; }
const PAGE_ID = targetPage.id;
const ORIGIN = 0;
const built = await (async () => {
// Figma card builder for YT02. Stored as the text of the "builder source" layer on the assets page and run with
// new AsyncFunction("figma", "CARDS", "PAGE_ID", "ORIGIN", source). Assets (math, QR, figures) are layers on the
// assets page named "<cardId>.latex", ".term<n>", ".qr", ".fig", uploaded by upload_assets from card_prep.py output.
const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const V = async id => figma.variables.getVariableByIdAsync(id);
const C = { field: await V("VariableID:1:18"), chart: await V("VariableID:1:20"), accent: await V("VariableID:1:21"), text: await V("VariableID:1:22"),
  textAccent: await V("VariableID:1:23"), textDim: await V("VariableID:1:24"), fillAccent: await V("VariableID:1:25"), gold: await V("VariableID:1:26"),
  red: await V("VariableID:1:27"), accentWash: await V("VariableID:4:421"), s1: await V("VariableID:9:490"), s2: await V("VariableID:9:491"), well: await V("VariableID:9:493") };
const bp = v => [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", v)];
const TS = Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s => [s.name, s]));
for (const s of Object.values(TS)) await figma.loadFontAsync(s.fontName);
await figma.loadFontAsync({ family: "Inter", style: "Italic" });
const ES = Object.fromEntries((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s.id]));
const ST = Object.fromEntries(figma.motion.figmaAnimationStyles().map(s => [s.styleId, s.styleId]));
const border = await figma.getNodeByIdAsync("3:119");
const X0 = 190, X1 = 1730, W = X1 - X0;                      // content area inside the rails
const assetsPage = figma.root.children.find(p => p.name === "YT02 · Assets");
const ASSET = Object.fromEntries(assetsPage.children.map(n => [n.name, n]));
async function txt(parent, name, s, style, color, x, y, w, align = "LEFT") {
  const t = figma.createText(); parent.appendChild(t); t.name = name; await t.setTextStyleIdAsync(TS[style].id); t.characters = String(s ?? ""); t.fills = bp(color); t.textAlignHorizontal = align;
  if (w) { t.resize(w, t.height); t.textAutoResize = "HEIGHT"; } t.x = x; t.y = y; return t; }
function panel(parent, name, x, y, w, h, { fill = C.s1, stroke = C.chart, effect = "Elevation/1 Panel", radius = 14 } = {}) {
  const f = figma.createFrame(); parent.appendChild(f); f.name = name; f.resize(w, h); f.x = x; f.y = y; f.fills = fill ? bp(fill) : []; f.cornerRadius = radius; f.clipsContent = false;
  if (stroke) { f.strokes = bp(stroke); f.strokeWeight = 1; } else f.strokes = []; if (effect) f.setEffectStyleIdAsync(ES[effect]); return f; }
function svgNode(parent, name, key, maxW, maxH) { const a = ASSET[key]; if (!a) throw new Error("missing asset " + key); const n = a.clone(); parent.appendChild(n); n.name = name; n.visible = true; const s = Math.min(maxW / n.width, maxH / n.height); n.rescale(s); return n; }
const fadeUp = (n, at, d = 0.5, dist = 20) => { n.applyAnimationStyle(ST.Opacity, { duration: d, timelineOffset: at, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } }); if (dist) n.applyAnimationStyle(ST.Position, { duration: d + 0.1, timelineOffset: at, props: { type: "slide_in", direction: "bottom", distance: dist, easing: { type: "EASE_OUT" } } }); };
const fit = (t, maxH, min = 18) => { let s = t.fontSize; while (t.height > maxH && s > min) { s -= 1; t.fontSize = s; } return t; };
const num = s => { const m = String(s).replace(/,/g, "").match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; };

async function build(card, idx) {
  const F = figma.createFrame(); F.name = card.frame || `card ${card.id}`; F.resize(1920, 1080); F.x = (ORIGIN + idx) % 6 * 2120; F.y = Math.floor((ORIGIN + idx) / 6) * 1400; F.fills = bp(C.field); F.clipsContent = true;
  const b = border.createInstance(); F.appendChild(b); b.name = "border";
  const head = await txt(F, "headline", card.headline, "Heading/H1", C.text, X0, 168, W - (card.hasQr ? 0 : 0)); fit(head, 160, 40);
  const rule = figma.createRectangle(); F.appendChild(rule); rule.name = "rule"; rule.resize(220, 4); rule.x = X0; rule.y = head.y + head.height + 14; rule.fills = bp(C.fillAccent); rule.cornerRadius = 2; rule.setEffectStyleIdAsync(ES["Glow/Accent"]);
  const top = rule.y + 44, bottom = card.hasQr ? 740 : 860;
  const items = card.items || [];
  const reveal = [];
  const kind = card.kind;
  if (kind === "title") {
    head.textAlignHorizontal = "CENTER"; const gs = [];
    for (let i = 0; i < items.length; i++) { const g = figma.createFrame(); F.appendChild(g); g.name = `item ${i + 1}`; g.fills = []; g.resize(W, 10); g.x = X0;
      const a = await txt(g, "title", items[i].title, "Display/Kicker", C.textAccent, 0, 0, W, "CENTER"); const d = await txt(g, "detail", items[i].detail, "Body/Large", C.text, 0, a.height + 8, W, "CENTER"); g.resize(W, d.y + d.height); gs.push(g); reveal.push(g); }
    const lay = () => head.height + 68 + gs.reduce((h, g) => h + g.height + 28, 0) - 28;
    let ds = gs.length ? gs[0].findOne(n => n.name === "detail").fontSize : 0;
    while (lay() > 700 && ds > 22) { ds -= 2; for (const g of gs) { const a = g.findOne(n => n.name === "title"), d = g.findOne(n => n.name === "detail"); d.fontSize = ds; d.y = a.height + 8; g.resize(W, d.y + d.height); } }
    head.y = Math.round(Math.min(330, Math.max(150, (1010 - lay()) / 2))); rule.x = 960 - 110; rule.y = head.y + head.height + 18;
    let y = rule.y + 50; for (const g of gs) { g.y = y; y += g.height + 28; }
  } else if (kind === "quote") {
    const q = panel(F, "item 1", X0, top, W, bottom - top - 20); const bar = figma.createRectangle(); q.appendChild(bar); bar.resize(6, q.height - 40); bar.x = 30; bar.y = 20; bar.fills = bp(C.gold); bar.cornerRadius = 3;
    const t = await txt(q, "quote", `“${card.quote || (items[0] && items[0].detail) || ""}”`, "Body/Large", C.text, 70, 40, W - 120); t.fontName = { family: "Inter", style: "Italic" }; t.fontSize = 48; fit(t, q.height - 140, 26);
    await txt(q, "attribution", card.attribution || (items[0] && items[0].title) || "", "Label/Mono", C.textAccent, 70, Math.min(q.height - 70, t.y + t.height + 30), W - 120);
    reveal.push(q);
  } else if (kind === "equation") {
    const terms = card.terms || []; const cols = Math.min(terms.length, 3), cw = (W - (cols - 1) * 24) / Math.max(cols, 1), rows = Math.ceil(terms.length / Math.max(cols, 1)), th = 124;
    const sh = Math.round(Math.max(180, Math.min(300, bottom - top - rows * (th + 18) - 12)));
    const shell = panel(F, "equation", X0, top, W, sh); const eq = svgNode(shell, "math", card.id + ".latex", W - 120, sh - 70); eq.x = (W - eq.width) / 2; eq.y = (sh - eq.height) / 2; reveal.push(shell);
    for (let i = 0; i < terms.length; i++) { const r = Math.floor(i / cols), c = i % cols; const p = panel(F, `term ${i + 1}`, X0 + c * (cw + 24), top + sh + 30 + r * (th + 18), cw, th, { fill: C.well, stroke: null, effect: "Inset/Well", radius: 10 });
      const m = svgNode(p, "symbol", card.id + ".term" + (i + 1), cw * 0.36, 60); m.x = 22; m.y = (th - m.height) / 2; const gt = await txt(p, "gloss", terms[i].gloss, "Body/Default", C.text, m.width + 44, 14, cw - m.width - 62); fit(gt, th - 24, 16); gt.y = Math.round((th - gt.height) / 2); reveal.push(p); }
  } else if (kind === "timeline") {
    const y = top + 150; const ln = figma.createRectangle(); F.appendChild(ln); ln.name = "track"; ln.resize(W, 4); ln.x = X0; ln.y = y; ln.fills = bp(C.chart); ln.cornerRadius = 2;
    const n = items.length, step = W / n;
    for (let i = 0; i < n; i++) { const g = figma.createFrame(); F.appendChild(g); g.name = `item ${i + 1}`; g.fills = []; g.resize(step - 20, 10); g.x = X0 + i * step + 10; g.y = top;
      const t = await txt(g, "title", items[i].title, "Heading/H2", C.textAccent, 0, 0, step - 20, "CENTER"); fit(t, 130, 26);
      const dot = figma.createEllipse(); g.appendChild(dot); dot.resize(22, 22); dot.x = (step - 20) / 2 - 11; dot.y = 150 - 9; dot.fills = bp(C.fillAccent); dot.setEffectStyleIdAsync(ES["Glow/Accent"]);
      const d = await txt(g, "detail", items[i].detail, "Body/Default", C.text, 0, 190, step - 20, "CENTER"); fit(d, bottom - top - 200, 18); g.resize(step - 20, d.y + d.height); reveal.push(g); }
  } else if (kind === "table" && card.columns) {
    const cols = card.columns.length, cw = W / cols; let y = top;
    const hdr = panel(F, "header row", X0, y, W, 60, { fill: C.s2, effect: "Elevation/2 Raised", radius: 10 });
    for (let c = 0; c < cols; c++) await txt(hdr, "col", card.columns[c], "Label/Mono", C.textAccent, c * cw + 20, 16, cw - 40);
    y += 76; const rh = Math.min(120, (bottom - y) / Math.max(items.length, 1) - 10);
    for (let i = 0; i < items.length; i++) { const row = panel(F, `item ${i + 1}`, X0, y, W, rh, { fill: C.s1, radius: 10 }); const cells = items[i].cells || [items[i].title, items[i].detail];
      for (let c = 0; c < cols; c++) { const t = await txt(row, "cell", cells[c] ?? "", c === 0 ? "Heading/H2" : "Body/Default", c === 0 ? C.text : C.text, c * cw + 20, 14, cw - 40); t.fontSize = Math.min(t.fontSize, 30); fit(t, rh - 24, 16); }
      y += rh + 10; reveal.push(row); }
  } else if (kind === "stat_bars") {   // one big figure per row: the book's numbers carry different units, so no shared bar scale
    const n = Math.max(items.length, 1), gap = 14, rh = Math.min(150, (bottom - top - gap * (n - 1)) / n); let y = top;
    for (let i = 0; i < items.length; i++) { const row = panel(F, `item ${i + 1}`, X0, y, W, rh, { radius: 10 });
      const m = String(items[i].detail).match(/\d[\d,.]*(\s?(%|x|to 1))?/) || String(items[i].title).match(/\d[\d,.]*%?/);
      const v = await txt(row, "stat", m ? m[0] : "", "Heading/H1", C.gold, 24, 0, 300, "RIGHT"); fit(v, rh - 16, 28); v.y = Math.round((rh - v.height) / 2);
      const t = await txt(row, "title", items[i].title, "Heading/H2", C.textAccent, 360, 0, W - 390); fit(t, 44, 22);
      const d = await txt(row, "detail", items[i].detail, "Body/Default", C.text, 360, 0, W - 390); fit(d, rh - t.height - 22, 18);
      t.y = Math.round((rh - t.height - d.height - 6) / 2); d.y = t.y + t.height + 6; y += rh + gap; reveal.push(row); }
  } else if (kind === "figure" && card.hasFigure) {
    const img = svgNode(F, "item 1", card.id + ".fig", W, bottom - top - 60); img.x = X0 + (W - img.width) / 2; img.y = top; reveal.push(img);
    const cap = await txt(F, "caption", card.caption || "", "Body/Default", C.text, X0, img.y + img.height + 14, W, "CENTER"); fit(cap, 60, 18);
  } else {   // source, compare, table without columns, figure fallback: one panel per item
    const n = Math.max(items.length, 1), horizontal = kind === "compare" && n <= 3;
    const gap = 24, pw = horizontal ? (W - gap * (n - 1)) / n : W, ph = horizontal ? bottom - top - 10 : Math.min(190, (bottom - top - gap * (n - 1)) / n);
    for (let i = 0; i < items.length; i++) { const p = panel(F, `item ${i + 1}`, horizontal ? X0 + i * (pw + gap) : X0, horizontal ? top : top + i * (ph + gap), pw, ph);
      if (horizontal) { const t = await txt(p, "title", items[i].title, "Heading/H2", C.textAccent, 28, 22, pw - 56); fit(t, 160, 24);
        const d = await txt(p, "detail", items[i].detail, "Body/Large", C.text, 28, t.y + t.height + 12, pw - 56); fit(d, ph - (t.y + t.height + 30), 18); }
      else { const tw = Math.round(pw * 0.36); const t = await txt(p, "title", items[i].title, "Heading/H2", C.textAccent, 28, 0, tw - 28); fit(t, ph - 20, 22); t.y = Math.round((ph - t.height) / 2);
        const d = await txt(p, "detail", items[i].detail, "Body/Large", C.text, tw + 24, 0, pw - tw - 52); fit(d, ph - 20, 20); d.y = Math.round((ph - d.height) / 2); }
      reveal.push(p); }
    if (kind === "figure") { const cap = await txt(F, "caption", card.caption || "", "Body/Default", C.textDim, X0, bottom - 40, W); }
  }
  // sources strip and QR
  const src = await txt(F, "source", card.sources || "", "Source/Citation", C.textDim, X0, 890, card.hasQr ? W - 190 : W); fit(src, 60, 16);
  if (card.hasQr) { const q = svgNode(F, "qr", card.id + ".qr", 150, 150); q.x = X1 - 150; q.y = 760; const qp = await txt(F, "qr label", "scan for the source", "Label/Mono Small", C.textDim, X1 - 190, 916, 190, "RIGHT"); }
  // motion (placeholder seconds; figma_cues.py retimes "item N" / "term N" on their words)
  fadeUp(head, 0.2, 0.5, 16); rule.applyAnimationStyle(ST.Opacity, { duration: 0.5, timelineOffset: 0.5, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } });
  // card.beats: seconds from the run start at which each turn begins (card_beats.py); card.duration: run length
  const beats = card.beats && card.beats.length ? card.beats : reveal.map((_, i) => 1.0 + i * 1.2);
  const at = i => beats[Math.min(i, beats.length - 1)];
  reveal.forEach((n, i) => fadeUp(n, Math.max(0.6, at(i)), 0.5, 20));
  // focus ring: a panel's stroke warms to the accent on its beat and cools on the next item's beat
  const hex = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255, a: 1 });
  reveal.forEach((n, i) => { if (!("strokes" in n) || !n.strokes || !n.strokes.length || reveal.length < 2) return;
    const on = Math.max(0.6, at(i)), off = i + 1 < reveal.length ? at(i + 1) : null;
    const kf = [{ timelinePosition: on, value: { type: "COLOR", value: hex("#8a6a45") } }, { timelinePosition: on + 0.35, value: { type: "COLOR", value: hex("#e08a3c") }, easing: { type: "EASE_OUT" } }];
    if (off) kf.push({ timelinePosition: off, value: { type: "COLOR", value: hex("#e08a3c") } }, { timelinePosition: off + 0.35, value: { type: "COLOR", value: hex("#8a6a45") }, easing: { type: "EASE_OUT" } });
    n.manualKeyframeTracks = { ...(n.manualKeyframeTracks || {}), strokes: { 0: { keyframes: kf } } }; });
  // turns beyond the item count: a gentle pulse on the last item, one visible change per turn
  const last = reveal[reveal.length - 1];
  if (last && beats.length > reveal.length) { const kf = []; for (let j = reveal.length; j < beats.length; j++) { kf.push({ timelinePosition: beats[j], value: { type: "VECTOR", value: { x: 1, y: 1 } } }, { timelinePosition: beats[j] + 0.3, value: { type: "VECTOR", value: { x: 1.03, y: 1.03 } }, easing: { type: "EASE_OUT" } }, { timelinePosition: beats[j] + 0.7, value: { type: "VECTOR", value: { x: 1, y: 1 } }, easing: { type: "EASE_IN_AND_OUT" } }); }
    last.applyManualKeyframeTrack({ type: "PROPERTY", name: "SCALE_XY" }, { keyframes: kf }); }
  const tl = head.timelines[0]; head.setTimelineDuration(tl.id, card.duration || Math.max(8, 2.5 + reveal.length * 1.2));
  return { id: F.id, name: F.name, items: reveal.length };
}
const out = [];
for (let i = 0; i < CARDS.length; i++) { const frameName = CARDS[i].frame || `card ${CARDS[i].id}`; const old = page.findOne(n => n.name === frameName && n.parent === page); if (old) old.remove(); out.push(await build(CARDS[i], i)); }
return out;

})();
return built.map(node => ({ frame: node.name, nodeId: node.id }));
