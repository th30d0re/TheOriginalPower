// YT01: a single camera moves around five persistent, opaque 3-D slabs.
// Queue, render, and save through the control channel after this script succeeds.
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
function smoothstep(t, a, b) {
  var u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
}
function lerp3(a, b, u) {
  return [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
}
function riseGapAt(t) {
  if (t < 5.0) return 0;
  if (t >= 6.0) return 1;
  var f = (t - 5.0) * FPS;
  if (f >= RISE_GAP.length - 1) return 1;
  var i = Math.floor(f);
  var u = f - i;
  return mix(RISE_GAP[i], RISE_GAP[i + 1], u);
}
function riseApproachAt(t) {
  if (t < 5.0) return 0;
  if (t >= 6.9) return 1;
  var f = (t - 5.0) * FPS;
  if (f >= RISE_APPROACH.length - 1) return 1;
  var i = Math.floor(f);
  var u = f - i;
  return mix(RISE_APPROACH[i], RISE_APPROACH[i + 1], u);
}
function riseTiltAt(t) {
  if (t < 6.15) return 0;
  if (t >= 6.95) return 1;
  return smoothstep(t, 6.15, 6.95);
}
var RISE_GAP = [
  0.00000, 0.00037, 0.00282, 0.00900, 0.02020, 0.03732, 0.03996, 0.04000, 0.07694, 0.12027, 0.16945, 0.22382,
  0.28252, 0.34457, 0.40892, 0.47442, 0.53992, 0.60426, 0.66632, 0.72502, 0.77939, 0.82859, 0.87190, 0.90884,
  0.93911, 0.96268, 0.97980, 0.99100, 0.99718, 0.99963, 1.00000
];
var RISE_APPROACH = [
  0.00000, 0.00150, 0.00599, 0.01325, 0.02319, 0.03566, 0.05053, 0.05053, 0.06977, 0.09101, 0.11409, 0.13887,
  0.16525, 0.19305, 0.22216, 0.25242, 0.28373, 0.31590, 0.34884, 0.38239, 0.41643, 0.45081, 0.48539, 0.52003,
  0.55464, 0.58900, 0.62303, 0.65658, 0.68952, 0.72172, 0.75301, 0.78329, 0.81237, 0.84020, 0.86656, 0.89136,
  0.91443, 0.93567, 0.95491, 0.97205, 0.98691, 0.99354, 0.99397, 0.99401, 0.99850, 1.00000, 1.00000, 1.00000,
  1.00000, 1.00000, 1.00000, 1.00000, 1.00000, 1.00000, 1.00000, 1.00000, 1.00000, 1.00000
];
var SWING_PITCH = [
  90, 86.8062, 83.6123, 80.4185, 77.2248, 74.0309, 70.8371, 67.6433, 64.4495, 61.2556,
  58.0619, 54.868, 51.6744, 48.4804, 45.2868, 42.0929, 38.899, 35.7054, 32.5114, 29.3176,
  26.1239, 22.93, 19.7363, 16.5425, 13.3487, 11.9971, 10.6283, 9.25396, 7.87282, 6.48285,
  5.07644, 3.67464, 2.26463, 0.865453, -0.544357, -1.94626, -3.35247, -4.74676, -6.14176, -7.51983,
  -8.8858, -10.2385, -13.3487, -16.5425, -19.7363, -22.93, -26.1239, -29.3176, -32.5114, -35.7054,
  -38.899, -42.0929, -45.2868, -48.4804, -51.6744, -54.868, -58.0619, -61.2556, -64.4495, -67.6433,
  -70.8371, -74.0309, -77.2248, -80.4185, -83.6123, -86.8062, -90
];
function swingPitchAt(t) {
  // One eased rotation: +90 (straight up, white) -> 0 (horizon) -> -90 (straight down, black).
  var u = Math.max(0, Math.min(1, (t - 10.6) / 2.2));
  // Slow through the horizon (both slabs in view), faster near the poles.
  var g = u + 0.75 * Math.sin(2 * Math.PI * u) / (2 * Math.PI);
  return 90 * Math.cos(Math.PI * g);
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
    position: [0, 0, 0], baseColor: color,
    acceptsLights: false, castsShadows: false, acceptsShadows: false
  });
  var layer = comp.layer(name);
  layer.threeDLayer = true;
  xf(layer, "Anchor Point").setValue([0, 0, 0]);
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
    gapY: 1700, endY: 1100, color: BLACK, corridorDepth: true},
  {name: "Buffer", width: 4600, height: 2200, closeY: -1100,
    gapY: -1700, endY: 540, color: WHITE, corridorDepth: true},
  {name: "Enforcement", width: 3500, height: 460, closeY: -2530,
    gapY: -3130, endY: -20, color: ENFORCE_C},
  {name: "Puppet", width: 2400, height: 460, closeY: -3090,
    gapY: -3690, endY: -580, color: PUPPET_C},
  {name: "Elite", width: 1300, height: 460, closeY: -3650,
    gapY: -4250, endY: -1140, color: ELITE_C}
];
function tierStateAt(tier, t) {
  var y = mix(tier.closeY, tier.gapY, riseGapAt(t));
  var settle = smooth(t, 13.4, 16.5);
  return {position: [0, mix(y, tier.endY, settle), 0],
    scale: [100, mix(100, 460 / tier.height * 100, settle), 100]};
}
function makeTier(tier) {
  var layer = cube(tier.name + " slab", tier.width, tier.height, tier.width, tier.color);
  layer.parent = stack;
  sampledKeys(xf(layer, "Position"), function(t) {
    return tierStateAt(tier, t).position;
  }, [[5.0, 6.0], [13.4, 16.5]]);
  var scaleRanges = tier.corridorDepth
    ? [[6.9, 7.5], [7.55, 12.8], [12.8, 13.4], [13.4, 16.5]]
    : [[13.4, 16.5]];
  sampledKeys(xf(layer, "Scale"), function(t) {
    var base = tierStateAt(tier, t).scale;
    if (!tier.corridorDepth) return base;
    var unbound = 50000 / tier.width * 100;
    if (t >= 7.55 && t < 12.8) return [unbound, base[1], unbound];
    if (t >= 12.8 && t < 13.4) {
      var u = smooth(t, 12.8, 13.4);
      return [mix(unbound, base[0], u), base[1], mix(unbound, base[2], u)];
    }
    return base;
  }, scaleRanges);
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
  var p = [0, 0, -5000];
  var pitch = 0;
  var yaw = 0;
  if (t >= 5.0 && t < 6.9) {
    var approach = riseApproachAt(t);
    var tilt = riseTiltAt(t);
    p = [0, mix(-30, -140, approach), mix(-5000, 0, approach)];
    pitch = mix(6, 90, 0.5 - 0.5 * Math.cos(Math.PI * tilt));
  } else if (t >= 6.9 && t < 10.6) {
    p = [0, -140, 0];
    pitch = 90;
  } else if (t >= 10.6 && t < 12.8) {
    p = [0, -140, 0];
    pitch = swingPitchAt(t);
  } else if (t >= 12.8 && t < 13.4) {
    p = [0, -140, 0];
    pitch = -90;
  } else if (t < 5.1) {
    p = [0, 0, -5000];
    pitch = 6;
  }
  if (t >= 13.4) {
    var reveal = smooth(t, 13.4, 16.5);
    p = bezier([0, -140, 0], [0, -140, -6500], [5000, -3000, -10000], END_CAMERA, reveal);
    var target = lerp3([0, 1700, 0], END_TARGET, smooth(t, 13.4, 14.6));
    var vx = target[0] - p[0], vy = target[1] - p[1], vz = target[2] - p[2];
    pitch = -Math.atan2(vy, Math.sqrt(vx*vx + vz*vz)) / RAD;
    yaw = Math.atan2(vx, vz) / RAD;
  }
  return {position: [p[0] + W/2, p[1] + H/2, p[2]], pitch: pitch, yaw: yaw};
}
var travel = [[5.0, 6.9], [6.9, 10.6], [10.6, 12.8], [12.8, 13.4], [13.4, 16.5]];
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
caption("What the In-group looks like to the Out-group", INK, 6.6, 6.9, 10.6, 10.9);
caption("What the Out-group looks like to the In-group", [1, 1, 1, 1],
  12.5, 12.8, 13.4, 13.7);

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
  var label = addText(tier.name, 36, [WHITE[0], WHITE[1], WHITE[2], 1], 40);
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

writeLn("built YT01_Ortho, " + comp.numLayers + " layers, " + DUR + "s");
