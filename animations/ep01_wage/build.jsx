// The complex wage, as a lecture on one diagram.
// W = ψm + jψs. Material on the real axis, status on the imaginary axis.
// The spoken cues are the start of each line. Every motion is a fraction of
// the gap before the next line, so the picture retimes when CUE changes.

var W = 1920;
var H = 1080;
var FPS = 30;

// Measured from the synthesized turns. Overwritten after the voice render
// if these estimates are still in place.
// Start of each spoken line, from the scriptCast manifest (seconds).
var CUE = [
  0.00,   // 0  two currencies
  4.75,   // 1  Du Bois
  9.40,   // 2  ordinary sum
  15.86,  // 3  complex number
  19.65,  // 4  quarter turn
  25.54,  // 5  real axis
  31.81,  // 6  imaginary axis
  41.68,  // 7  right angle
  50.45,  // 8  polar form
  58.86,  // 9  theta 0
  64.14,  // 10 theta 90
  71.67,  // 11 past 90
  82.55,  // 12 square
  96.15   // 13 conjugate
];
var DUR = 108;

var BG = [0.043, 0.047, 0.059];
var PAPER = [0.94, 0.93, 0.90, 1];
var MUTED = [0.62, 0.60, 0.56, 1];
var INK = [0.10, 0.08, 0.06, 1];
var GOLD = [0.90, 0.76, 0.42];
var BLUE = [0.55, 0.73, 0.84];
var PALE = [0.74, 0.80, 0.86];
var RED = [0.82, 0.40, 0.34];
var AXIS = [0.45, 0.44, 0.42];
var BAR = [0.30, 0.30, 0.32];

var OX = 1040;
var OY = 690;
var PM = 380;
var PS = 258;
var R = Math.sqrt(PM * PM + PS * PS);
var TH = Math.atan2(PS, PM) * 180 / Math.PI;

function span(i, frac) {
  var next = (i + 1 < CUE.length) ? CUE[i + 1] : DUR;
  return CUE[i] + frac * (next - CUE[i]);
}

function dimOf(v) {
  return (v instanceof Array) ? v.length : 1;
}

function applyEase(prop, index, dim) {
  var inn = [];
  var out = [];
  for (var d = 0; d < dim; d++) {
    inn.push(new KeyframeEase(0, 70));
    out.push(new KeyframeEase(0, 70));
  }
  prop.setTemporalEaseAtKey(index, inn, out);
}

function keys(prop, pairs) {
  var dim = dimOf(pairs[0][1]);
  for (var i = 0; i < pairs.length; i++) prop.setValueAtTime(pairs[i][0], pairs[i][1]);
  for (var k = 0; k < pairs.length; k++) {
    try { applyEase(prop, k + 1, dim); }
    catch (e1) {
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
  doc.__set("size", style.size || 48);
  doc.__set("fill", style.fill || PAPER);
  doc.__set("justify", style.justify || "center");
  if (style.tracking !== undefined) doc.__set("tracking", style.tracking);
  try { doc.__set("font", "TimesNewRomanPSMT"); } catch (err) { writeLn("font " + err); }
  src.setValue(doc);
  return layer;
}

function showText(layer, i0, i1) {
  var tIn = span(i0, 0.02);
  var tOut = (i1 < CUE.length) ? span(i1, 0.06) : DUR + 1;
  var pairs = [];
  if (tIn > 0.05) {
    pairs.push([0, 0]);
    pairs.push([tIn, 0]);
  } else {
    pairs.push([0, 0]);
  }
  pairs.push([tIn + 0.28, 100]);
  if (tOut < DUR - 0.05) {
    pairs.push([Math.max(tIn + 0.5, tOut - 0.22), 100]);
    pairs.push([tOut, 0]);
  }
  keys(xf(layer, "Opacity"), pairs);
  return layer;
}

function addRect(comp, name, w, h, fill) {
  var layer = comp.layers.addShape();
  layer.name = name;
  var group = layer.property("Contents").addProperty("ADBE Vector Group");
  var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
  rect.property("Size").setValue([w, h]);
  var paint = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  paint.property("Color").setValue(fill);
  return layer;
}

function addStrokeRect(comp, name, w, h, color, sw) {
  var layer = comp.layers.addShape();
  layer.name = name;
  var group = layer.property("Contents").addProperty("ADBE Vector Group");
  var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
  rect.property("Size").setValue([w, h]);
  var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
  stroke.property("Color").setValue(color);
  stroke.property("Stroke Width").setValue(sw);
  return layer;
}

function shaft(comp, name, color, thick) {
  var layer = addRect(comp, name, 100, thick, color);
  try { xf(layer, "Anchor Point").setValue([-50, 0]); }
  catch (e1) {
    try { xf(layer, "Anchor Point").setValue([-50, 0, 0]); }
    catch (e2) { writeLn("anchor " + name + " " + e2); }
  }
  xf(layer, "Position").setValue([OX, OY, 0]);
  return layer;
}

function arrowHead(comp, name, color) {
  var layer = comp.layers.addShape();
  layer.name = name;
  var group = layer.property("Contents").addProperty("ADBE Vector Group");
  var star = group.property("Contents").addProperty("ADBE Vector Shape - Star");
  star.property("Type").setValue(2);
  star.property("Points").setValue(3);
  star.property("Outer Radius").setValue(16);
  var paint = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  paint.property("Color").setValue(color);
  return layer;
}

function tip(angleDeg, length) {
  var r = angleDeg * Math.PI / 180;
  return [OX + Math.cos(r) * length, OY - Math.sin(r) * length, 0];
}

function track(shaftLayer, headLayer, samples) {
  var list = samples;
  if (list[0].t > 0.02) {
    list = [{ t: 0, ang: list[0].ang, len: 0, op: 0 }].concat(list);
  }
  var rot = [];
  var scl = [];
  var op = [];
  var hp = [];
  var ho = [];
  var hr = [];
  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    rot.push([s.t, -s.ang]);
    scl.push([s.t, [Math.max(0.01, s.len), 100]]);
    op.push([s.t, s.op]);
    if (headLayer) {
      hp.push([s.t, tip(s.ang, s.len)]);
      ho.push([s.t, s.op]);
      hr.push([s.t, 90 - s.ang]);
    }
  }
  keys(xf(shaftLayer, "Rotation"), rot);
  keys(xf(shaftLayer, "Scale"), scl);
  keys(xf(shaftLayer, "Opacity"), op);
  if (headLayer) {
    keys(xf(headLayer, "Position"), hp);
    keys(xf(headLayer, "Opacity"), ho);
    keys(xf(headLayer, "Rotation"), hr);
  }
}

function arcTrim(theta) {
  var start = (90 - theta) / 360 * 100;
  if (start < 0) start += 100;
  return { start: start, end: 25 };
}

var comp = app.project.items.addComp("Main", W, H, 1, DUR, FPS);
comp.bgColor = BG;
comp.layers.addSolid(BG, "Background", W, H, 1);

var axisH = addRect(comp, "Real axis", 1500, 2, AXIS);
xf(axisH, "Position").setValue([OX, OY, 0]);
var axisV = addRect(comp, "Imag axis", 2, 980, AXIS);
xf(axisV, "Position").setValue([OX, OY, 0]);
keys(xf(axisH, "Scale"), [
  [0, [0, 100]],
  [span(3, 0.02), [0, 100]],
  [span(3, 0.42), [100, 100]]
]);
keys(xf(axisV, "Scale"), [
  [0, [100, 0]],
  [span(3, 0.02), [100, 0]],
  [span(3, 0.42), [100, 100]]
]);
keys(xf(axisH, "Opacity"), [[0, 0], [span(3, 0.02), 0], [span(3, 0.3), 100]]);
keys(xf(axisV, "Opacity"), [[0, 0], [span(3, 0.02), 0], [span(3, 0.3), 100]]);

var axReal = addText(comp, "\u03C8m    real", { size: 32, fill: GOLD.concat([1]), tracking: 40 });
xf(axReal, "Position").setValue([OX + 640, OY + 48, 0]);
showText(axReal, 3, CUE.length);

var axImag = addText(comp, "j\u03C8s    imaginary", { size: 32, fill: BLUE.concat([1]), tracking: 20 });
xf(axImag, "Position").setValue([OX + 210, OY - 420, 0]);
showText(axImag, 3, CUE.length);

var cardM = addRect(comp, "Material card", 340, 92, GOLD);
xf(cardM, "Position").setValue([740, 560, 0]);
var cardMLabel = addText(comp, "Material", { size: 36, fill: INK, tracking: 60 });
cardMLabel.parent = cardM;
xf(cardMLabel, "Position").setValue([0, 8, 0]);

var cardS = addRect(comp, "Status card", 340, 92, BLUE);
xf(cardS, "Position").setValue([1180, 560, 0]);
var cardSLabel = addText(comp, "Status", { size: 36, fill: INK, tracking: 80 });
cardSLabel.parent = cardS;
xf(cardSLabel, "Position").setValue([0, 8, 0]);

var plus = addText(comp, "+", { size: 64, fill: PAPER });
xf(plus, "Position").setValue([960, 575, 0]);

function windowOpacity(layer, tIn, tHoldOut, tOut) {
  keys(xf(layer, "Opacity"), [
    [0, 0],
    [tIn, 0],
    [tIn + 0.3, 100],
    [tHoldOut, 100],
    [tOut, 0]
  ]);
}
windowOpacity(cardM, span(0, 0.08), span(2, 0.28), span(2, 0.5));
windowOpacity(cardMLabel, span(0, 0.08), span(2, 0.28), span(2, 0.5));
windowOpacity(cardS, span(0, 0.16), span(2, 0.28), span(2, 0.5));
windowOpacity(cardSLabel, span(0, 0.16), span(2, 0.28), span(2, 0.5));
windowOpacity(plus, span(2, 0.02), span(2, 0.28), span(2, 0.48));

var oneSize = addRect(comp, "One size", 460, 28, BAR);
xf(oneSize, "Position").setValue([960, 575, 0]);
var oneLabel = addText(comp, "one size", { size: 28, fill: MUTED, tracking: 80 });
xf(oneLabel, "Position").setValue([960, 630, 0]);
windowOpacity(oneSize, span(2, 0.42), span(3, 0.05), span(3, 0.32));
windowOpacity(oneLabel, span(2, 0.48), span(3, 0.05), span(3, 0.32));

var s120 = Math.sin(120 * Math.PI / 180);
var c120 = Math.cos(120 * Math.PI / 180);

var realBar = shaft(comp, "psi m", GOLD, 10);
var imagBar = shaft(comp, "psi s", BLUE, 10);
var imagNeg = shaft(comp, "minus psi s", BLUE, 10);
var negBar = shaft(comp, "negative real", RED, 12);
var negHead = arrowHead(comp, "negative head", RED);
var result = shaft(comp, "W", [0.96, 0.95, 0.92], 6);
var resultHead = arrowHead(comp, "W head", [0.96, 0.95, 0.92]);
var conj = shaft(comp, "W star", PALE, 6);
var conjHead = arrowHead(comp, "W star head", PALE);
var unit = shaft(comp, "quarter turn", GOLD, 8);
var unitHead = arrowHead(comp, "quarter head", GOLD);

track(unit, unitHead, [
  { t: span(4, 0.06), ang: 0, len: 0, op: 0 },
  { t: span(4, 0.22), ang: 0, len: 210, op: 100 },
  { t: span(4, 0.42), ang: 0, len: 210, op: 100 },
  { t: span(4, 0.88), ang: 90, len: 210, op: 100 },
  { t: span(5, 0.12), ang: 90, len: 210, op: 0 }
]);

track(realBar, null, [
  { t: span(5, 0.08), ang: 0, len: 0, op: 0 },
  { t: span(5, 0.5), ang: 0, len: PM, op: 100 },
  { t: span(9, 0.08), ang: 0, len: PM, op: 100 },
  { t: span(9, 0.62), ang: 0, len: R, op: 100 },
  { t: span(10, 0.08), ang: 0, len: R, op: 100 },
  { t: span(10, 0.62), ang: 0, len: 0, op: 0 },
  { t: span(13, 0.06), ang: 0, len: 0, op: 0 },
  { t: span(13, 0.22), ang: 0, len: PM, op: 100 },
  { t: span(13, 0.48), ang: 0, len: PM, op: 100 },
  { t: span(13, 0.78), ang: 0, len: 2 * PM, op: 100 }
]);

track(imagBar, null, [
  { t: span(6, 0.08), ang: 90, len: 0, op: 0 },
  { t: span(6, 0.48), ang: 90, len: PS, op: 100 },
  { t: span(9, 0.08), ang: 90, len: PS, op: 100 },
  { t: span(9, 0.62), ang: 90, len: 0, op: 0 },
  { t: span(10, 0.08), ang: 90, len: 0, op: 0 },
  { t: span(10, 0.62), ang: 90, len: R, op: 100 },
  { t: span(11, 0.08), ang: 90, len: R, op: 100 },
  { t: span(11, 0.6), ang: 90, len: R * s120, op: 100 },
  { t: span(12, 0.04), ang: 90, len: R * s120, op: 100 },
  { t: span(12, 0.16), ang: 90, len: R, op: 0 },
  { t: span(13, 0.06), ang: 90, len: 0, op: 0 },
  { t: span(13, 0.22), ang: 90, len: PS, op: 100 },
  { t: span(13, 0.46), ang: 90, len: PS, op: 100 },
  { t: span(13, 0.7), ang: 90, len: 0, op: 0 }
]);

track(imagNeg, null, [
  { t: span(13, 0.08), ang: -90, len: 0, op: 0 },
  { t: span(13, 0.26), ang: -90, len: PS, op: 100 },
  { t: span(13, 0.46), ang: -90, len: PS, op: 100 },
  { t: span(13, 0.7), ang: -90, len: 0, op: 0 }
]);

track(negBar, negHead, [
  { t: span(11, 0.1), ang: 180, len: 0, op: 0 },
  { t: span(11, 0.6), ang: 180, len: -R * c120, op: 100 },
  { t: span(12, 0.04), ang: 180, len: -R * c120, op: 100 },
  { t: span(12, 0.16), ang: 180, len: 0, op: 0 },
  { t: span(12, 0.62), ang: 180, len: 0, op: 0 },
  { t: span(12, 0.8), ang: 180, len: R, op: 100 },
  { t: span(13, 0.02), ang: 180, len: R, op: 100 },
  { t: span(13, 0.14), ang: 180, len: 0, op: 0 }
]);

track(result, resultHead, [
  { t: span(7, 0.08), ang: TH, len: 0, op: 0 },
  { t: span(7, 0.42), ang: TH, len: R, op: 100 },
  { t: span(9, 0.08), ang: TH, len: R, op: 100 },
  { t: span(9, 0.62), ang: 0, len: R, op: 100 },
  { t: span(10, 0.08), ang: 0, len: R, op: 100 },
  { t: span(10, 0.62), ang: 90, len: R, op: 100 },
  { t: span(11, 0.08), ang: 90, len: R, op: 100 },
  { t: span(11, 0.6), ang: 120, len: R, op: 100 },
  { t: span(12, 0.04), ang: 120, len: R, op: 100 },
  { t: span(12, 0.18), ang: 90, len: R, op: 100 },
  { t: span(12, 0.62), ang: 180, len: R, op: 100 },
  { t: span(12, 0.8), ang: 180, len: R, op: 0 },
  { t: span(13, 0.08), ang: TH, len: 0, op: 0 },
  { t: span(13, 0.24), ang: TH, len: R, op: 100 },
  { t: span(13, 0.42), ang: TH, len: R, op: 100 },
  { t: span(13, 0.72), ang: TH, len: R, op: 0 }
]);

track(conj, conjHead, [
  { t: span(13, 0.1), ang: -TH, len: 0, op: 0 },
  { t: span(13, 0.28), ang: -TH, len: R, op: 100 },
  { t: span(13, 0.42), ang: -TH, len: R, op: 100 },
  { t: span(13, 0.68), ang: -TH, len: R, op: 0 }
]);

var corner = addStrokeRect(comp, "right angle", 36, 36, PAPER, 2);
xf(corner, "Position").setValue([OX + 28, OY - 28, 0]);
keys(xf(corner, "Opacity"), [
  [0, 0],
  [span(7, 0.3), 0],
  [span(7, 0.48), 100],
  [span(9, 0.15), 100],
  [span(9, 0.4), 0],
  [span(13, 0.2), 0],
  [span(13, 0.32), 100],
  [span(13, 0.5), 100],
  [span(13, 0.66), 0]
]);

var arc = comp.layers.addShape();
arc.name = "theta arc";
var arcGroup = arc.property("Contents").addProperty("ADBE Vector Group");
var arcEll = arcGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
arcEll.property("Size").setValue([260, 260]);
var arcStroke = arcGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
arcStroke.property("Color").setValue(GOLD);
arcStroke.property("Stroke Width").setValue(3);
var arcTrimPath = arcGroup.property("Contents").addProperty("ADBE Vector Filter - Trim");
xf(arc, "Position").setValue([OX, OY, 0]);

function arcKeys(thetaAt) {
  var starts = [];
  var ends = [];
  var ops = [];
  for (var i = 0; i < thetaAt.length; i++) {
    var tr = arcTrim(thetaAt[i].th);
    starts.push([thetaAt[i].t, tr.start]);
    ends.push([thetaAt[i].t, tr.end]);
    ops.push([thetaAt[i].t, thetaAt[i].op]);
  }
  keys(arcTrimPath.property("Start"), starts);
  keys(arcTrimPath.property("End"), ends);
  keys(xf(arc, "Opacity"), ops);
}
arcKeys([
  { t: 0, th: TH, op: 0 },
  { t: span(8, 0.08), th: TH, op: 0 },
  { t: span(8, 0.3), th: TH, op: 100 },
  { t: span(9, 0.08), th: TH, op: 100 },
  { t: span(9, 0.62), th: 0.01, op: 40 },
  { t: span(10, 0.08), th: 0.01, op: 40 },
  { t: span(10, 0.62), th: 90, op: 100 },
  { t: span(11, 0.05), th: 90, op: 100 },
  { t: span(11, 0.16), th: 90, op: 0 }
]);

var dot = comp.layers.addShape();
dot.name = "buffer";
var dotGroup = dot.property("Contents").addProperty("ADBE Vector Group");
var dotEll = dotGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
dotEll.property("Size").setValue([18, 18]);
var dotFill = dotGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
dotFill.property("Color").setValue([0.96, 0.95, 0.92]);
var dotLabel = addText(comp, "buffer", { size: 26, fill: PAPER, justify: "left" });
dotLabel.parent = dot;
xf(dotLabel, "Position").setValue([22, -16, 0]);
keys(xf(dot, "Position"), [
  [0, [OX, OY, 0]],
  [span(7, 0.05), [OX, OY, 0]],
  [span(7, 0.38), tip(0, PM * 0.72)],
  [span(7, 0.88), tip(TH, R * 0.9)]
]);
windowOpacity(dot, span(7, 0.05), span(7, 0.9), span(8, 0.12));
windowOpacity(dotLabel, span(7, 0.05), span(7, 0.9), span(8, 0.12));

function chip(str, x, y, i0, i1) {
  var layer = addText(comp, str, { size: 24, fill: MUTED, tracking: 20 });
  xf(layer, "Position").setValue([x, y, 0]);
  showText(layer, i0, i1);
  return layer;
}
chip("land", OX + 90, OY + 86, 5, 7);
chip("credit", OX + 180, OY + 86, 5, 7);
chip("wages", OX + 275, OY + 86, 5, 7);
chip("immunity", OX + 390, OY + 86, 5, 7);
chip("deference", OX + 188, OY - 100, 6, 7);
chip("titles", OX + 188, OY - 185, 6, 7);
chip("standing", OX + 188, OY - 270, 6, 7);

var title = addText(comp, "The complex wage", { size: 44, fill: PAPER, tracking: 80 });
xf(title, "Position").setValue([W / 2, 78, 0]);

var equations = [
  [0, "two currencies"],
  [1, "a public and psychological wage"],
  [2, "\u03C8 = \u03C8s + \u03C8m"],
  [3, "W = \u03C8m + j\u03C8s"],
  [4, "\u00D7 j    rotates a quarter turn"],
  [5, "\u03C8m    real power"],
  [6, "j\u03C8s    reactive power"],
  [7, "a right angle"],
  [8, "W = R \u2220 \u03B8      R = \u221A(\u03C8m\u00B2 + \u03C8s\u00B2)"],
  [9, "\u03B8 = 0\u00B0"],
  [10, "\u03B8 = 90\u00B0"],
  [11, "\u03B8 = 120\u00B0"],
  [12, "(j\u03C8s)\u00B2 = \u2212\u03C8s\u00B2"],
  [13, "W + W* = 2\u03C8m"]
];
for (var e = 0; e < equations.length; e++) {
  var eq = addText(comp, equations[e][1], { size: 48, fill: PAPER, tracking: 10 });
  xf(eq, "Position").setValue([W / 2, 158, 0]);
  showText(eq, equations[e][0], equations[e][0] + 1);
}

var captions = [
  [0, "material concessions, and status"],
  [1, "Du Bois, 1935"],
  [2, "the payment collapses to a single size"],
  [3, "the wage is a complex number"],
  [4, "multiplying by j rotates a quarter turn"],
  [5, "this component performs work"],
  [6, "holds a field. transfers zero wealth"],
  [7, "off the material axis"],
  [8, "a length, and a phase angle"],
  [9, "the wage is entirely material"],
  [10, "zero capital. the default"],
  [11, "in this framework, that phase is fascism"],
  [12, "compounding symbolic status destroys real wealth"],
  [13, "the status terms cancel. twice the material wage remains"]
];
for (var c = 0; c < captions.length; c++) {
  var cap = addText(comp, captions[c][1], { size: 28, fill: MUTED, tracking: 12 });
  xf(cap, "Position").setValue([W / 2, 1010, 0]);
  var end = CUE.length;
  for (var n = c + 1; n < captions.length; n++) {
    if (captions[n][0] > captions[c][0]) { end = captions[n][0]; break; }
  }
  showText(cap, captions[c][0], end);
}

var wLabel = addText(comp, "W", { size: 36, fill: PAPER });
xf(wLabel, "Position").setValue([OX + R * Math.cos(TH * Math.PI / 180) + 36, OY - R * Math.sin(TH * Math.PI / 180) - 28, 0]);
keys(xf(wLabel, "Opacity"), [
  [0, 0],
  [span(7, 0.4), 0],
  [span(7, 0.55), 100],
  [span(9, 0.1), 100],
  [span(9, 0.3), 0],
  [span(13, 0.22), 0],
  [span(13, 0.36), 100],
  [span(13, 0.5), 100],
  [span(13, 0.66), 0]
]);

var wStar = addText(comp, "W*", { size: 36, fill: PALE.concat([1]) });
xf(wStar, "Position").setValue([OX + R * Math.cos(TH * Math.PI / 180) + 36, OY + R * Math.sin(TH * Math.PI / 180) + 36, 0]);
windowOpacity(wStar, span(13, 0.2), span(13, 0.5), span(13, 0.7));

var twoPm = addText(comp, "2\u03C8m", { size: 36, fill: GOLD.concat([1]) });
xf(twoPm, "Position").setValue([OX + 2 * PM - 10, OY - 46, 0]);
windowOpacity(twoPm, span(13, 0.62), span(13, 0.95), DUR + 1);

var plusPsi = addText(comp, "+\u03C8s", { size: 28, fill: BLUE.concat([1]) });
xf(plusPsi, "Position").setValue([OX - 56, OY - PS * 0.55, 0]);
windowOpacity(plusPsi, span(13, 0.18), span(13, 0.48), span(13, 0.68));
var minusPsi = addText(comp, "\u2212\u03C8s", { size: 28, fill: BLUE.concat([1]) });
xf(minusPsi, "Position").setValue([OX - 56, OY + PS * 0.55, 0]);
windowOpacity(minusPsi, span(13, 0.18), span(13, 0.48), span(13, 0.68));

writeLn("R=" + R.toFixed(1) + " theta=" + TH.toFixed(2));
