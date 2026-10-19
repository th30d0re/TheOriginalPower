// Episode 01 cold open.
// The coarse in-group/out-group binary is an orthographic projection of the
// five-tier pyramid. On the gendered axis the projection reads as one block.
// Three public readings collide inside that plane. Resolution puts extraction
// back at the apex, then shows the same tiers on the racial axis.

var W = 1920;
var H = 1080;
var FPS = 30;
var DUR = 36;

var BG = [0.043, 0.047, 0.059];
var PAPER = [0.94, 0.93, 0.90, 1];
var MUTED = [0.72, 0.70, 0.66, 1];
var GOLD = [0.90, 0.76, 0.42, 1];
var INK = [0.10, 0.08, 0.05, 1];

var TIERS = [
  { name: "ELITE",       y: -208, w: 260, h: 58, fill: [0.90, 0.76, 0.42], ink: INK,   role: "extracts" },
  { name: "PUPPET",      y: -128, w: 420, h: 58, fill: [0.62, 0.47, 0.29], ink: PAPER, role: "writes the law" },
  { name: "ENFORCEMENT", y: -48,  w: 580, h: 58, fill: [0.38, 0.49, 0.58], ink: PAPER, role: "actuates" },
  { name: "BUFFER",      y: 36,   w: 740, h: 60, fill: [0.50, 0.46, 0.42], ink: PAPER, role: "receives the wage" },
  { name: "OUT-GROUP",   y: 128,  w: 900, h: 68, fill: [0.70, 0.33, 0.29], ink: PAPER, role: "bears the harm" }
];

var COLLAPSE_Y = -40;
var HARM_Y = 228;

function dimOf(v) {
  return (v instanceof Array) ? v.length : 1;
}

function applyEase(prop, index, dim) {
  var inn = [];
  var out = [];
  for (var d = 0; d < dim; d++) {
    inn.push(new KeyframeEase(0, 76));
    out.push(new KeyframeEase(0, 76));
  }
  prop.setTemporalEaseAtKey(index, inn, out);
}

function keys(prop, pairs) {
  var dim = dimOf(pairs[0][1]);
  for (var i = 0; i < pairs.length; i++) {
    prop.setValueAtTime(pairs[i][0], pairs[i][1]);
  }
  for (var k = 0; k < pairs.length; k++) {
    try {
      applyEase(prop, k + 1, dim);
    } catch (e1) {
      try { applyEase(prop, k + 1, 3); }
      catch (e2) { writeLn("ease " + e2); }
    }
  }
}

function xf(layer, prop) {
  return layer.property("Transform").property(prop);
}

function addText(comp, str, style) {
  var layer = comp.layers.addText(str);
  layer.name = str;
  var src = layer.property("ADBE Text Properties").property("ADBE Text Document");
  var doc = src.value;
  if (style.size) doc.__set("size", style.size);
  if (style.fill) doc.__set("fill", style.fill);
  if (style.justify) doc.__set("justify", style.justify);
  if (style.tracking !== undefined) doc.__set("tracking", style.tracking);
  if (style.allCaps) doc.__set("allCaps", true);
  src.setValue(doc);
  return layer;
}

function addRect(comp, name, w, h, fill, round) {
  var layer = comp.layers.addShape();
  layer.name = name;
  var group = layer.property("Contents").addProperty("ADBE Vector Group");
  var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
  rect.property("Size").setValue([w, h]);
  if (round) rect.property("ADBE Vector Rect Roundness").setValue(round);
  var paint = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  paint.property("Color").setValue(fill);
  return { layer: layer, size: rect.property("Size") };
}

function addCaption(comp, str, t0, t1, y, size) {
  var layer = addText(comp, str, {
    size: size || 32,
    fill: PAPER,
    justify: "center",
    tracking: 12
  });
  xf(layer, "Position").setValue([W / 2, y, 0]);
  var end = t1 > DUR ? DUR : t1;
  var pairs = [[0, 0]];
  if (t0 > 0.05) pairs.push([t0, 0]);
  pairs.push([t0 + 0.35, 100]);
  if (end < DUR - 0.05) {
    pairs.push([Math.max(t0 + 0.5, end - 0.35), 100]);
    pairs.push([end, 0]);
  }
  keys(xf(layer, "Opacity"), pairs);
  return layer;
}

function buildTier(comp, parent, tier, mode) {
  var bar = addRect(comp, tier.name, tier.w, tier.h, tier.fill, 8);
  bar.layer.parent = parent;
  var label = addText(comp, tier.name, {
    size: 18,
    fill: tier.ink,
    justify: "center",
    tracking: 150,
    allCaps: true
  });
  label.parent = bar.layer;
  xf(label, "Position").setValue([0, 6, 0]);

  var role = addText(comp, tier.role, {
    size: 20,
    fill: MUTED,
    justify: "left",
    tracking: 8
  });
  role.parent = bar.layer;
  xf(role, "Position").setValue([tier.w / 2 + 26, 6, 0]);

  return { bar: bar, label: label, role: role, tier: tier };
}

var comp = app.project.items.addComp("Main", W, H, 1, DUR, FPS);

comp.layers.addSolid(BG, "Background", W, H, 1);

var primary = comp.layers.addNull();
primary.name = "Gendered";
xf(primary, "Anchor Point").setValue([0, 0, 0]);
xf(primary, "Position").setValue([W / 2, 500, 0]);

var twin = comp.layers.addNull();
twin.name = "Racial";
xf(twin, "Anchor Point").setValue([0, 0, 0]);
xf(twin, "Position").setValue([1400, 540, 0]);

var sight = addRect(comp, "Line of sight", 2, 430, [0.75, 0.72, 0.64], 0);
sight.layer.parent = primary;
xf(sight.layer, "Position").setValue([0, -40, 0]);
keys(xf(sight.layer, "Opacity"), [
  [0, 0], [6.5, 0], [7.1, 55], [8.3, 55], [8.9, 0]
]);

var bars = [];
for (var i = 0; i < TIERS.length; i++) {
  bars.push(buildTier(comp, primary, TIERS[i], "primary"));
}

var twinBars = [];
for (var j = 0; j < TIERS.length; j++) {
  twinBars.push(buildTier(comp, twin, TIERS[j], "twin"));
}

// Primary motion. Later layers sit in front, so the buffer occludes the apex
// when the upper tiers share its y.
for (var n = 0; n < bars.length; n++) {
  var item = bars[n];
  var tier = item.tier;
  var delay = 1.05 + (bars.length - 1 - n) * 0.38;
  var rest = [0, tier.y, 0];
  var dropped = [0, tier.y + 36, 0];
  var stacked = [0, COLLAPSE_Y, 0];
  var isHarm = tier.name === "OUT-GROUP";
  var isBuffer = tier.name === "BUFFER";
  var isUpper = !isHarm && !isBuffer;

  var pos = [[delay, dropped], [delay + 0.65, rest], [6.7, rest]];
  if (isHarm) pos.push([8.5, [0, HARM_Y, 0]], [18.6, [0, HARM_Y, 0]], [20.5, rest]);
  else pos.push([8.5, stacked], [18.6, stacked], [20.5, rest]);
  keys(xf(item.bar.layer, "Position"), pos);

  var op = [[delay, 0], [delay + 0.45, 100]];
  if (isUpper) op.push([7.5, 100], [8.45, 0], [19.3, 0], [20.2, 100]);
  keys(xf(item.bar.layer, "Opacity"), op);
  if (isBuffer) {
    keys(xf(item.label, "Opacity"), [
      [delay, 0], [delay + 0.45, 100],
      [8.35, 100], [8.9, 0],
      [19.05, 0], [19.75, 100]
    ]);
  } else {
    keys(xf(item.label, "Opacity"), op);
  }

  if (isBuffer) {
    keys(item.bar.size, [
      [0, [tier.w, tier.h]],
      [6.7, [tier.w, tier.h]],
      [8.5, [1020, tier.h]],
      [18.6, [1020, tier.h]],
      [20.5, [tier.w, tier.h]]
    ]);
  }

  keys(xf(item.role, "Opacity"), [
    [0, 0], [20.3, 0], [21.15, 100]
  ]);
}

var buffer = bars[3];
var slogan = addText(comp, "ALL MEN", {
  size: 26,
  fill: PAPER,
  justify: "center",
  tracking: 220,
  allCaps: true
});
slogan.parent = buffer.bar.layer;
xf(slogan, "Position").setValue([0, 7, 0]);
keys(xf(slogan, "Opacity"), [
  [0, 0], [8.5, 0], [9.15, 100], [18.5, 100], [19.2, 0]
]);

// Discourse cards live in comp space, in the gap the collapse opens.
function addChip(comp, title, sub, x, accent, enter) {
  var card = addRect(comp, title, 268, 104, [0.12, 0.13, 0.16], 10);
  var accentBar = addRect(comp, title + " accent", 6, 104, accent, 2);
  accentBar.layer.parent = card.layer;
  xf(accentBar.layer, "Position").setValue([-131, 0, 0]);
  var t1 = addText(comp, title, {
    size: 18,
    fill: PAPER,
    justify: "center",
    tracking: 120,
    allCaps: true
  });
  t1.parent = card.layer;
  xf(t1, "Position").setValue([8, -12, 0]);
  var t2 = addText(comp, sub, {
    size: 15,
    fill: MUTED,
    justify: "center",
    tracking: 6
  });
  t2.parent = card.layer;
  xf(t2, "Position").setValue([8, 18, 0]);

  var y = 592;
  keys(xf(card.layer, "Position"), [
    [enter, [x + (x < W / 2 ? -280 : 280), y, 0]],
    [enter + 0.9, [x, y, 0]],
    [enter + 2.2, [x + (x < W / 2 ? 42 : -42), y, 0]],
    [enter + 3.5, [x + (x < W / 2 ? -28 : 28), y, 0]],
    [enter + 4.8, [x, y, 0]],
    [17.6, [x, y, 0]]
  ]);
  var fade = [[0, 0], [enter, 0], [enter + 0.55, 100], [18.15, 100], [18.85, 0]];
  keys(xf(card.layer, "Opacity"), fade);
  keys(xf(accentBar.layer, "Opacity"), fade);
  keys(xf(t1, "Opacity"), fade);
  keys(xf(t2, "Opacity"), fade);
  return card;
}

addChip(comp, "ALL MEN", "the block", 620, [0.50, 0.46, 0.42], 11.15);
addChip(comp, "COMPLICITY", "the translation", 960, [0.62, 0.47, 0.29], 11.45);
addChip(comp, "NOT ALL MEN", "the refusal", 1300, [0.38, 0.49, 0.58], 11.75);

// Anger leaves the out-group, meets the slab, and runs along it.
var rise = addRect(comp, "Rise", 4, 4, [0.90, 0.76, 0.42], 0);
rise.layer.parent = primary;
keys(rise.size, [
  [0, [4, 4]], [16.05, [4, 4]], [17.05, [4, 204]], [18.3, [4, 204]], [18.9, [4, 4]]
]);
keys(xf(rise.layer, "Position"), [
  [16.05, [-470, 192, 0]],
  [17.05, [-470, 92, 0]],
  [18.9, [-470, 92, 0]]
]);
keys(xf(rise.layer, "Opacity"), [
  [0, 0], [16.05, 0], [16.3, 100], [18.35, 100], [18.95, 0]
]);

var run = addRect(comp, "Run", 4, 4, [0.90, 0.76, 0.42], 0);
run.layer.parent = primary;
keys(run.size, [
  [0, [4, 4]], [16.85, [4, 4]], [17.9, [980, 4]], [18.3, [980, 4]], [18.95, [4, 4]]
]);
keys(xf(run.layer, "Position"), [
  [16.85, [-468, -10, 0]],
  [17.9, [20, -10, 0]],
  [18.95, [20, -10, 0]]
]);
keys(xf(run.layer, "Opacity"), [
  [0, 0], [16.85, 0], [17.05, 100], [18.4, 100], [18.95, 0]
]);

// Twin stays resolved and appears when the primary pyramid steps aside.
for (var t = 0; t < twinBars.length; t++) {
  var twinItem = twinBars[t];
  xf(twinItem.bar.layer, "Position").setValue([0, twinItem.tier.y, 0]);
  var twinFade = [[0, 0], [25.15, 0], [26.35, 100]];
  keys(xf(twinItem.bar.layer, "Opacity"), twinFade);
  keys(xf(twinItem.label, "Opacity"), twinFade);
  xf(twinItem.role, "Opacity").setValue(0);
}

keys(xf(primary, "Position"), [
  [0, [W / 2, 500, 0]],
  [24.7, [W / 2, 500, 0]],
  [26.5, [500, 540, 0]]
]);
keys(xf(primary, "Scale"), [
  [0, [100, 100, 100]],
  [24.7, [100, 100, 100]],
  [26.5, [62, 62, 100]]
]);
keys(xf(twin, "Scale"), [
  [0, [62, 62, 100]],
  [DUR, [62, 62, 100]]
]);

var axisStyle = {
  size: 15,
  fill: GOLD,
  justify: "center",
  tracking: 380,
  allCaps: true
};
var axisHeader = addText(comp, "GENDERED AXIS", axisStyle);
xf(axisHeader, "Position").setValue([W / 2, 78, 0]);
keys(xf(axisHeader, "Opacity"), [
  [0.15, 0], [0.7, 100], [24.3, 100], [25.1, 0]
]);

var rule = addRect(comp, "Rule", 42, 2, [0.90, 0.76, 0.42], 0);
xf(rule.layer, "Position").setValue([W / 2, 102, 0]);
keys(xf(rule.layer, "Opacity"), [
  [0.3, 0], [0.9, 100], [24.3, 100], [25.1, 0]
]);

var leftAxis = addText(comp, "GENDERED AXIS", axisStyle);
leftAxis.parent = primary;
xf(leftAxis, "Position").setValue([0, -300, 0]);
keys(xf(leftAxis, "Opacity"), [[0, 0], [25.2, 0], [26.3, 100]]);

var rightAxis = addText(comp, "RACIAL AXIS", axisStyle);
rightAxis.parent = twin;
xf(rightAxis, "Position").setValue([0, -300, 0]);
keys(xf(rightAxis, "Opacity"), [[0, 0], [25.2, 0], [26.3, 100]]);

addCaption(comp, "Five tiers.", 4.45, 6.55, 1004, 34);
addCaption(comp, "Orthographic projection.", 8.65, 11.15, 1004, 34);
addCaption(comp, "The in-group reads as one block.", 10.95, 14.15, 1004, 32);
addCaption(comp, "Three readings. One plane.", 13.95, 17.55, 1004, 34);
addCaption(comp, "The apex stays out of reach.", 17.35, 20.35, 1004, 32);
addCaption(comp, "A single block looks innate.", 20.15, 23.15, 1004, 34);
addCaption(comp, "Extraction sits at the apex.", 22.95, 26.15, 980, 34);
addCaption(comp, "One architecture on every axis.", 26.55, 29.7, 980, 32);
addCaption(comp, "Direct the anger at the tier that extracts.", 29.9, 40, 900, 34);

var series = addText(comp, "THE ORIGINAL POWER", {
  size: 18,
  fill: GOLD,
  justify: "center",
  tracking: 420,
  allCaps: true
});
xf(series, "Position").setValue([W / 2, 990, 0]);
keys(xf(series, "Opacity"), [[0, 0], [31.1, 0], [31.8, 100]]);

writeLn("built Main, " + comp.numLayers + " layers, " + DUR + "s");
