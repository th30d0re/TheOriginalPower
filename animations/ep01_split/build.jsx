// The orthographic split.
// The white in-group half leaves the center and fills the left side.
// The divider rotates from vertical to horizontal, white staying white and
// black staying black, so the frame becomes white above and black below.
// The camera pulls back. That white face is the buffer. Three tiers were
// above it, outside the frame.

var W = 1920;
var H = 1080;
var FPS = 30;
var DUR = 19;

var PAPER = [0.99, 0.98, 0.96];
var INK = [0.08, 0.08, 0.08, 1];
var WHITE = [0.96, 0.95, 0.92, 1];
var BLACK = [0.012, 0.012, 0.014];
var FIELD = [0.46, 0.46, 0.48];

var ELITE_C = [0.90, 0.76, 0.42];
var PUPPET_C = [0.62, 0.47, 0.29];
var ENFORCE_C = [0.40, 0.50, 0.58];

function applyEase(prop, index, dim) {
  var inn = [];
  var out = [];
  for (var d = 0; d < dim; d++) {
    inn.push(new KeyframeEase(0, 72));
    out.push(new KeyframeEase(0, 72));
  }
  prop.setTemporalEaseAtKey(index, inn, out);
}

function keys(prop, pairs) {
  var dim = (pairs[0][1] instanceof Array) ? pairs[0][1].length : 1;
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
  layer.threeDLayer = true;
  var src = layer.property("ADBE Text Properties").property("ADBE Text Document");
  var doc = src.value;
  doc.__set("size", style.size || 64);
  doc.__set("fill", style.fill || WHITE);
  doc.__set("justify", "center");
  if (style.tracking !== undefined) doc.__set("tracking", style.tracking);
  src.setValue(doc);
  try {
    layer.property("Material Options").property("Accepts Lights").setValue(0);
    layer.property("Material Options").property("Casts Shadows").setValue(0);
  } catch (err) {
    writeLn("text material " + err);
  }
  return layer;
}

function cube(name, w, h, d, pos, color) {
  app.run("layer.new3dPrimitive", {
    kind: "cube",
    name: name,
    width: w,
    height: h,
    depth: d,
    position: pos,
    baseColor: color
  });
  return comp.layer(name);
}

var comp = app.project.items.addComp("Main", W, H, 1, DUR, FPS);
comp.bgColor = [0, 0, 0];
comp.renderer = "ADBE Advanced 3d";

// The opening stays on black. The field rises to gray with the pullback,
// so the black out-group slab has a ground to sit on.
var field = comp.layers.addSolid(FIELD, "Field", W, H, 1);
keys(xf(field, "Opacity"), [
  [0, 0],
  [9.15, 0],
  [15.4, 100]
]);

var cam = comp.layers.addCamera("Cam", [W / 2, H / 2]);
var camPos = xf(cam, "Position");
var camPoi = xf(cam, "Point of Interest");
var homePos = [W / 2, H / 2, -2666.67];
var homePoi = [W / 2, H / 2, 0];
keys(camPos, [
  [0, homePos],
  [9.15, homePos],
  [15.4, [2320, -680, -4100]]
]);
keys(camPoi, [
  [0, homePoi],
  [9.15, homePoi],
  [15.4, [W / 2, 20, 0]]
]);

app.run("layer.newLight", {
  kind: "Spot",
  name: "Key",
  intensity: 64,
  position: [1700, -1100, -1800],
  poi: [W / 2, 40, 0],
  color: [1, 0.97, 0.93],
  coneAngle: 110,
  castsShadows: true
});
app.run("layer.newLight", {
  kind: "Ambient",
  name: "Fill",
  intensity: 42,
  color: [0.5, 0.55, 0.62]
});

// The rotating split. Parent origin is the center of the frame.
var rot = comp.layers.addNull();
rot.name = "Rotator";
rot.threeDLayer = true;
xf(rot, "Anchor Point").setValue([0, 0, 0]);
xf(rot, "Position").setValue([W / 2, H / 2, 0]);
keys(xf(rot, "Z Rotation"), [
  [0, 0],
  [5.15, 0],
  [8.35, 90]
]);

// The white cube's anchor sits on the center line, so scale grows left, up,
// and down from there.
var white = cube("White half", 2600, 2600, 6, [0, 0, 0], PAPER);
white.parent = rot;
xf(white, "Anchor Point").setValue([1300, 0, 0]);
xf(white, "Position").setValue([0, 0, 6]);
keys(xf(white, "Scale"), [
  [0.2, [0, 0, 100]],
  [1.45, [100, 100, 100]]
]);
keys(xf(white, "Opacity"), [
  [0, 100],
  [9.05, 100],
  [9.2, 0]
]);

function ridingLabel(name, str, fill, fromX, toX) {
  var seat = comp.layers.addNull();
  seat.name = name + " seat";
  seat.threeDLayer = true;
  seat.parent = rot;
  xf(seat, "Anchor Point").setValue([0, 0, 0]);
  keys(xf(seat, "Position"), [
    [0, [fromX, 0, -700]],
    [5.15, [fromX, 0, -700]],
    [8.35, [toX, 0, -700]]
  ]);
  var label = addText(comp, str, { size: 48, fill: fill, tracking: 70 });
  label.name = name;
  label.parent = seat;
  xf(label, "Position").setValue([0, 4, 0]);
  keys(xf(label, "Z Rotation"), [
    [0, 0],
    [5.15, 0],
    [8.35, -90]
  ]);
  return label;
}

var inBlack = ridingLabel("In-group black", "In-group", INK, -460, -270);
var outLabel = ridingLabel("Out-group", "Out-group", WHITE, 460, 270);

keys(xf(inBlack, "Opacity"), [
  [0, 0], [1.45, 0], [2.15, 100], [9.3, 100], [9.7, 0]
]);
keys(xf(outLabel, "Opacity"), [
  [0, 0], [1.55, 0], [2.25, 100], [9.3, 100], [9.7, 0]
]);

// Finite slabs. They match the split at the handoff, then settle into the pyramid
// while the camera pulls back. The three tiers above sit just outside the
// close frame and come into view as the camera retreats.
function slab(name, w, h, depth, closePos, endPos, closeScale, endScale, color, fadeIn) {
  var layer = cube(name, w, h, depth, closePos, color);
  keys(xf(layer, "Position"), [
    [0, closePos],
    [9.15, closePos],
    [15.2, endPos]
  ]);
  keys(xf(layer, "Scale"), [
    [0, closeScale],
    [9.15, closeScale],
    [15.2, endScale]
  ]);
  if (fadeIn) {
    keys(xf(layer, "Opacity"), [
      [0, 0], [fadeIn[0], 0], [fadeIn[1], 100]
    ]);
  }
  return layer;
}

var buffer = slab("Buffer", 1920, 540, 90,
  [960, 270, 0], [960, 100, 10],
  [100, 100, 100], [74, 26, 260],
  PAPER, [9.05, 9.2]);

var outGroup = slab("Out slab", 1920, 540, 90,
  [960, 810, 8], [960, 272, 30],
  [100, 100, 100], [90, 26, 260],
  BLACK, [9.05, 9.2]);

slab("Enforcement", 1180, 108, 130,
  [960, -58, -40], [960, -58, -40],
  [100, 100, 100], [100, 100, 190],
  ENFORCE_C, [10.4, 12.2]);

slab("Puppet", 860, 108, 130,
  [960, -198, -80], [960, -198, -80],
  [100, 100, 100], [100, 100, 190],
  PUPPET_C, [11.0, 12.8]);

slab("Elite", 540, 108, 130,
  [960, -338, -120], [960, -338, -120],
  [100, 100, 100], [100, 100, 190],
  ELITE_C, [11.6, 13.4]);

function worldLabel(str, fill, size, from, to, t0, t1) {
  var label = addText(comp, str, { size: size, fill: fill, tracking: 40 });
  label.name = str + " world";
  keys(xf(label, "Position"), [
    [0, from],
    [9.2, from],
    [15.2, to]
  ]);
  keys(xf(label, "Opacity"), [
    [0, 0], [t0, 0], [t1, 100]
  ]);
  return label;
}

var inWorld = worldLabel("In-group", INK, 60, [960, 270, -60], [960, 100, -170], 9.45, 9.9);
keys(xf(inWorld, "Opacity"), [
  [0, 0], [9.45, 0], [9.9, 100], [13.5, 100], [14.3, 0]
]);
worldLabel("Buffer", INK, 36, [960, 100, -70], [960, 100, -170], 13.6, 14.6);
worldLabel("Out-group", WHITE, 60, [960, 810, -60], [960, 272, -160], 9.45, 9.9);

worldLabel("Enforcement", WHITE, 28, [960, -58, -220], [960, -58, -220], 12.4, 13.4);
worldLabel("Puppet", WHITE, 28, [960, -198, -270], [960, -198, -270], 12.8, 13.8);
worldLabel("Elite", INK, 28, [960, -338, -310], [960, -338, -310], 13.2, 14.2);

writeLn("built Main, " + comp.numLayers + " layers, " + DUR + "s");
