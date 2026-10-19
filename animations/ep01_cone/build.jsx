// The orthographic split, ending on a circular pyramid.
// The white in-group half leaves the center and fills the left side.
// The divider rotates from vertical to horizontal, white staying white and
// black staying black, so the frame becomes white above and black below.
// The camera pulls back. Those halves are disks. Three smaller disks were
// above them, outside the frame. The radii taper to a cone.

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

function disk(name, radius, height, pos, color) {
  app.run("layer.new3dPrimitive", {
    kind: "cylinder",
    name: name,
    radius: radius,
    height: height,
    segments: 72,
    position: pos,
    baseColor: color
  });
  return comp.layer(name);
}

var comp = app.project.items.addComp("Main", W, H, 1, DUR, FPS);
comp.bgColor = [0, 0, 0];
comp.renderer = "ADBE Advanced 3d";

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
  [15.4, [2100, -980, -3600]]
]);
keys(camPoi, [
  [0, homePoi],
  [9.15, homePoi],
  [15.4, [W / 2, 40, 0]]
]);

app.run("layer.newLight", {
  kind: "Spot",
  name: "Key",
  intensity: 70,
  position: [1500, -1400, -1600],
  poi: [W / 2, 40, 0],
  color: [1, 0.97, 0.93],
  coneAngle: 120,
  castsShadows: true
});
app.run("layer.newLight", {
  kind: "Ambient",
  name: "Fill",
  intensity: 46,
  color: [0.55, 0.58, 0.62]
});

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

// The two halves are born as wide cylinders, so the frontal view still fills
// the frame. X and Z scale stay equal, and the radii step down to a cone.
var HALF_R = 960;
var HALF_H = 540;

function settle(layer, closePos, endPos, endScale, fadeIn) {
  keys(xf(layer, "Position"), [
    [0, closePos],
    [9.15, closePos],
    [15.2, endPos]
  ]);
  keys(xf(layer, "Scale"), [
    [0, [100, 100, 100]],
    [9.15, [100, 100, 100]],
    [15.2, endScale]
  ]);
  if (fadeIn) {
    keys(xf(layer, "Opacity"), [
      [0, 0], [fadeIn[0], 0], [fadeIn[1], 100]
    ]);
  }
}

var buffer = disk("Buffer disk", HALF_R, HALF_H, [960, 270, 0], PAPER);
settle(buffer, [960, 270, 0], [960, 162, 0], [53.6, 18.5, 53.6], [9.05, 9.2]);

var outGroup = disk("Out disk", HALF_R, HALF_H, [960, 810, 0], BLACK);
settle(outGroup, [960, 810, 0], [960, 280, 0], [66.7, 18.5, 66.7], [9.05, 9.2]);

// Enforcement and the tiers above it start inside the buffer and rise out of its top.
var INSIDE = 176;

function emerge(name, radius, endY, color, t0, t1) {
  var start = [960, INSIDE, 0];
  var end = [960, endY, 0];
  var layer = disk(name, radius, 100, start, color);
  keys(xf(layer, "Position"), [
    [0, start],
    [t0, start],
    [t1, end]
  ]);
  keys(xf(layer, "Opacity"), [
    [0, 0],
    [t0, 0],
    [t0 + 0.12, 100]
  ]);
  return layer;
}

emerge("Enforcement disk", 390, 44, ENFORCE_C, 14.2, 15.6);
emerge("Puppet disk", 265, -74, PUPPET_C, 14.8, 16.2);
emerge("Elite disk", 140, -192, ELITE_C, 15.4, 16.8);

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

var inWorld = worldLabel("In-group", INK, 48, [960, 270, -1100], [960, 100, -560], 9.45, 9.9);
keys(xf(inWorld, "Opacity"), [
  [0, 0], [9.45, 0], [9.9, 100], [13.5, 100], [14.3, 0]
]);
worldLabel("Buffer", INK, 32, [960, 162, -560], [960, 162, -560], 13.6, 14.6);
worldLabel("Out-group", WHITE, 44, [960, 810, -1100], [960, 230, -700], 9.45, 9.9);

function riseLabel(str, fill, size, from, to, t0, t1) {
  var label = addText(comp, str, { size: size, fill: fill, tracking: 40 });
  label.name = str + " world";
  keys(xf(label, "Position"), [
    [0, from],
    [t0, from],
    [t1, to]
  ]);
  keys(xf(label, "Opacity"), [
    [0, 0],
    [t0 + 0.35, 0],
    [t0 + 0.85, 100]
  ]);
  return label;
}

riseLabel("Enforcement", WHITE, 26, [960, 176, -440], [960, 44, -440], 14.2, 15.6);
riseLabel("Puppet", WHITE, 26, [960, 176, -320], [960, -74, -320], 14.8, 16.2);
riseLabel("Elite", INK, 24, [960, 176, -190], [960, -192, -190], 15.4, 16.8);

writeLn("built Main, " + comp.numLayers + " layers, " + DUR + "s");
