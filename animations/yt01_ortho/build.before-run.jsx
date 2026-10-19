// YT01: a single camera moves around five persistent, opaque 3-D slabs.
// Run this file from its delivery directory; output paths follow $.fileName.
var W = 1920;
var H = 1080;
var FPS = 30;
var DUR = 18.1;
var ZOOM = 2400;
var WHITE = [0.96, 0.95, 0.92];
var BLACK = [0.012, 0.012, 0.014];
var NAVY = [0.06, 0.09, 0.17];
var INK = [0.08, 0.08, 0.08, 1];
var ENFORCE_C = [0.40, 0.50, 0.58];
var PUPPET_C = [0.62, 0.47, 0.29];
var ELITE_C = [0.90, 0.76, 0.42];
var RAD = Math.PI / 180;

function applyEase(prop, index, dim) {
  var inn = [], out = [];
  for (var d = 0; d < dim; d++) {
    inn.push(new KeyframeEase(0, 72));
    out.push(new KeyframeEase(0, 72));
  }
  prop.setTemporalEaseAtKey(index, inn, out);
}

function keys(prop, pairs, sampled) {
  var dim = (pairs[0][1] instanceof Array) ? pairs[0][1].length : 1;
  for (var i = 0; i < pairs.length; i++) prop.setValueAtTime(pairs[i][0], pairs[i][1]);
  for (var k = 0; k < pairs.length; k++) {
    if (sampled) {
      // Easing is already sampled at the delivery frame rate.
      prop.setInterpolationTypeAtKey(k + 1, KeyframeInterpolationType.LINEAR,
        KeyframeInterpolationType.LINEAR);
    } else {
      try { applyEase(prop, k + 1, dim); }
      catch (e1) { applyEase(prop, k + 1, 1); }
    }
    // Disable spatial overshoot between the baked positions.
    if (prop.isSpatial) {
      prop.setSpatialAutoBezierAtKey(k + 1, false);
      var tangent = dim === 2 ? [0, 0] : [0, 0, 0];
      prop.setSpatialTangentsAtKey(k + 1, tangent, tangent);
    }
  }
}

function xf(layer, prop) { return layer.property("Transform").property(prop); }
function mix(a, b, u) { return a + (b - a) * u; }
function smooth(t, a, b) {
  var u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * u * (u * (u * 6 - 15) + 10);
}
function lerp3(a, b, u) {
  return [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
}
function bezier(a, b, c, d, u) {
  var v = 1 - u, p = [];
  for (var i = 0; i < 3; i++) {
    p.push(v*v*v*a[i] + 3*v*v*u*b[i] + 3*v*u*u*c[i] + u*u*u*d[i]);
  }
  return p;
}
function sampledKeys(prop, fn, ranges) {
  var pairs = [[0, fn(0)]];
  for (var f = 1; f < Math.round(DUR * FPS); f++) {
    var t = f / FPS;
    for (var r = 0; r < ranges.length; r++) {
      if (t >= ranges[r][0] - 0.00001 && t <= ranges[r][1] + 0.00001) {
        pairs.push([t, fn(t)]);
        break;
      }
    }
  }
  pairs.push([DUR, fn(DUR)]);
  keys(prop, pairs, true);
}

function unlit(layer) {
  layer.property("Material Options").property("Accepts Lights").setValue(0);
  layer.property("Material Options").property("Casts Shadows").setValue(0);
}
function addText(str, size, fill, tracking) {
  var layer = comp.layers.addText(str);
  layer.name = str;
  // The reference leaves font selection at EffectCraft's text default.
  var src = layer.property("ADBE Text Properties").property("ADBE Text Document");
  var doc = src.value;
  doc.__set("size", size);
  doc.__set("fill", fill);
  doc.__set("justify", "center");
  doc.__set("tracking", tracking);
  src.setValue(doc);
  layer.threeDLayer = false;
  return layer;
}
function cube(name, w, h, d, color) {
  app.run("layer.new3dPrimitive", {
    kind: "cube", name: name, width: w, height: h, depth: d,
    position: [0, 0, 0], baseColor: color
  });
  var layer = comp.layer(name);
  layer.threeDLayer = true;
  xf(layer, "Anchor Point").setValue([0, 0, 0]);
  unlit(layer);
  return layer;
}

var comp = app.project.items.addComp("YT01_Ortho", W, H, 1, DUR, FPS);
comp.bgColor = NAVY;
comp.renderer = "ADBE Advanced 3d";

var stack = comp.layers.addNull();
stack.name = "Stack: left-right to above-below";
stack.threeDLayer = true;
xf(stack, "Anchor Point").setValue([0, 0, 0]);
xf(stack, "Position").setValue([W / 2, H / 2, 0]);
sampledKeys(xf(stack, "Z Rotation"), function(t) {
  return mix(-90, 0, smooth(t, 2.3, 4.8));
}, [[2.3, 4.8]]);

// Initial slab heights fill every corner throughout the divider's rotation.
// Upper tiers start beyond the Buffer's upper boundary and stay opaque.
var tiers = [
  {name: "Out-group", width: 5600, height: 2200, closeY: 1100,
    gapY: 1700, endY: 1100, color: BLACK},
  {name: "Buffer", width: 4600, height: 2200, closeY: -1100,
    gapY: -1700, endY: 540, color: WHITE},
  {name: "Enforcement", width: 3500, height: 460, closeY: -2530,
    gapY: -3130, endY: -20, color: ENFORCE_C},
  {name: "Puppet", width: 2400, height: 460, closeY: -3090,
    gapY: -3690, endY: -580, color: PUPPET_C},
  {name: "Elite", width: 1300, height: 460, closeY: -3650,
    gapY: -4250, endY: -1140, color: ELITE_C}
];
function tierStateAt(tier, t) {
  var y = mix(tier.closeY, tier.gapY, smooth(t, 5.1, 5.6));
  var settle = smooth(t, 14.4, 16.5);
  return {position: [0, mix(y, tier.endY, settle), 0],
    scale: [100, mix(100, 460 / tier.height * 100, settle), 100]};
}
function makeTier(tier) {
  var layer = cube(tier.name + " slab", tier.width, tier.height, tier.width, tier.color);
  layer.parent = stack;
  sampledKeys(xf(layer, "Position"), function(t) {
    return tierStateAt(tier, t).position;
  }, [[5.1, 5.6], [14.4, 16.5]]);
  sampledKeys(xf(layer, "Scale"), function(t) {
    return tierStateAt(tier, t).scale;
  }, [[14.4, 16.5]]);
  return layer;
}
for (var ti = 0; ti < tiers.length; ti++) makeTier(tiers[ti]);

// Camera and POI share a parent. Its local forward vector stays +Z even
// at the vertical poles; the parent supplies pitch and yaw in world space.
var rig = comp.layers.addNull();
rig.name = "Camera physical travel";
rig.threeDLayer = true;
xf(rig, "Anchor Point").setValue([0, 0, 0]);
var cam = comp.layers.addCamera("Cam", [W / 2, H / 2]);
cam.parent = rig;
xf(cam, "Position").setValue([0, 0, 0]);
xf(cam, "Point of Interest").setValue([0, 0, 1000]);
cam.property("Camera Options").property("Zoom").setValue(ZOOM);

var END_CAMERA = [6500, -3600, -11000];
var END_TARGET = [600, 300, 0];
var dx = END_TARGET[0] - END_CAMERA[0];
var dy = END_TARGET[1] - END_CAMERA[1];
var dz = END_TARGET[2] - END_CAMERA[2];
var END_YAW = Math.atan2(dx, dz) / RAD;
var END_PITCH = -Math.atan2(dy, Math.sqrt(dx*dx + dz*dz)) / RAD;

function cameraPoseAt(t) {
  var approach = smooth(t, 5.1, 6.5);
  var p = [0, -140 * approach, mix(-5000, 0, approach)];
  var pitch = mix(0, 90, approach);
  var yaw = 0;
  if (t >= 11.6) {
    var swing = smooth(t, 11.6, 12.6);
    // The arc stays inside the 1200-unit gap throughout the pole-to-pole move.
    p = [0, -140 - 100 * Math.sin(2 * Math.PI * swing), -350 * Math.sin(Math.PI * swing)];
    pitch = mix(90, -90, swing);
  }
  if (t >= 13.4) {
    var reveal = smooth(t, 13.4, 16.5);
    p = bezier([0, -140, 0], [0, -140, -6500], [5000, -3000, -10000], END_CAMERA, reveal);
    pitch = mix(-90, END_PITCH, reveal);
    yaw = mix(0, END_YAW, reveal);
  }
  return {position: [p[0] + W/2, p[1] + H/2, p[2]], pitch: pitch, yaw: yaw};
}
var travel = [[5.1, 6.5], [11.6, 12.6], [13.4, 16.5]];
sampledKeys(xf(rig, "Position"), function(t) { return cameraPoseAt(t).position; }, travel);
sampledKeys(xf(rig, "X Rotation"), function(t) { return cameraPoseAt(t).pitch; }, travel);
sampledKeys(xf(rig, "Y Rotation"), function(t) { return cameraPoseAt(t).yaw; }, travel);

function openingLabel(str, sign, fill) {
  var label = addText(str, 48, fill, 70);
  sampledKeys(xf(label, "Position"), function(t) {
    var turn = smooth(t, 2.3, 4.8);
    var theta = turn * Math.PI / 2;
    var r = mix(480, 270, turn);
    var y = H/2 + sign * r * Math.sin(theta) + 16;
    return [W/2 + sign * r * Math.cos(theta),
      mix(y, sign < 0 ? -140 : H + 140, smooth(t, 5.1, 5.5)), 0];
  }, [[2.3, 4.8], [5.1, 5.5]]);
}
openingLabel("In-group", -1, INK);
openingLabel("Out-group", 1, [WHITE[0], WHITE[1], WHITE[2], 1]);

function caption(str, fill, entry0, entry1, exit0, exit1) {
  var label = addText(str, 32, fill, 0);
  sampledKeys(xf(label, "Position"), function(t) {
    var y = mix(1180, 1006, smooth(t, entry0, entry1));
    return [W/2, mix(y, 1180, smooth(t, exit0, exit1)), 0];
  }, [[entry0, entry1], [exit0, exit1]]);
}
caption("What the In-group looks like to the Out-group", INK, 6.2, 6.5, 11.6, 11.9);
caption("What the Out-group looks like to the In-group", [1, 1, 1, 1],
  12.3, 12.6, 13.4, 13.7);

// Pinhole projection of the final camera basis, used to place screen labels.
function projectEnd(p) {
  var pitch = END_PITCH * RAD, yaw = END_YAW * RAD;
  var right = [Math.cos(yaw), 0, -Math.sin(yaw)];
  var down = [Math.sin(yaw)*Math.sin(pitch), Math.cos(pitch), Math.cos(yaw)*Math.sin(pitch)];
  var forward = [Math.sin(yaw)*Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw)*Math.cos(pitch)];
  var delta = [p[0]-END_CAMERA[0], p[1]-END_CAMERA[1], p[2]-END_CAMERA[2]];
  function dot(v) { return delta[0]*v[0] + delta[1]*v[1] + delta[2]*v[2]; }
  return [W/2 + ZOOM*dot(right)/dot(forward), H/2 + ZOOM*dot(down)/dot(forward)];
}
function revealLabel(tier) {
  var point = projectEnd([tier.width/2, tier.endY, tier.width/2]);
  var label = addText(tier.name, 30, [WHITE[0], WHITE[1], WHITE[2], 1], 40);
  sampledKeys(xf(label, "Position"), function(t) {
    return [mix(2200, 1730, smooth(t, 16.5, 16.9)), point[1] + 10, 0];
  }, [[16.5, 16.9]]);
  // A 2-pixel solid supplies a horizontal leader outside the projected face.
  var start = point[0] + 10;
  var length = 1580 - start;
  var line = comp.layers.addSolid(WHITE, tier.name + " leader", Math.ceil(length), 2, 1);
  xf(line, "Anchor Point").setValue([0, 1, 0]);
  xf(line, "Position").setValue([start, point[1], 0]);
  sampledKeys(xf(line, "Scale"), function(t) {
    return [100 * smooth(t, 16.5, 16.9), 100, 100];
  }, [[16.5, 16.9]]);
}
for (var li = 0; li < tiers.length; li++) revealLabel(tiers[li]);

// Delivery: AE-style render queue and project save. Template support is host-specific.
var outputDir = new File($.fileName).parent;
var outputFile = new File(outputDir.fsName + "/yt01_ortho.mp4");
var projectFile = new File(outputDir.fsName + "/yt01_ortho.ecproj");
var queueError = null;
try {
  var rq = app.project.renderQueue.items.add(comp);
  rq.timeSpanStart = 0;
  rq.timeSpanDuration = DUR;
  var om = rq.outputModule(1);
  var template = "H.264";
  var templates = om.templates;
  if (templates) {
    for (var ot = 0; ot < templates.length; ot++) {
      if (templates[ot] === "H.264") { template = templates[ot]; break; }
      if (/h[.\s_-]?264/i.test(templates[ot])) template = templates[ot];
    }
  }
  om.applyTemplate(template);
  om.file = outputFile;
  rq.render = true;
} catch (renderError) {
  queueError = renderError;
  writeLn("H.264 queue setup requires host support: " + renderError);
}
app.project.save(projectFile);
if (queueError) throw new Error("Saved project; H.264 queue setup failed: " + queueError);
writeLn("built YT01_Ortho, " + comp.numLayers + " layers, " + DUR + "s; queued " + outputFile.fsName);
