// figma_cues.py · scene "Scene · Orthographic illusion" · start 1443.369 s · duration 188.809 s
const CUES = [{"node": "camera", "at": 23.85, "until": 178.779}, {"node": "label in-group", "at": 38.43}, {"node": "label out-group", "at": 40.28}, {"node": "caption white", "at": 37.99}, {"node": "caption black", "at": 39.81}, {"node": "title", "at": 12.15}, {"node": "tier label E · Elite", "at": 15.42}, {"node": "tier label P · Puppet Class", "at": 17.5}, {"node": "tier label F · Enforcement Class", "at": 18.22}, {"node": "tier label I_buffer · Buffer Class", "at": 19.46}, {"node": "tier label O · Out-group", "at": 21.68}, {"node": "border", "at": 22.28}];
const frame = figma.currentPage.findOne(n => n.name === "Scene · Orthographic illusion");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["Scene · Orthographic illusion"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 188.809);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 1 · System Stress" · start 4829.756 s · duration 42.16 s
const CUES = [{"node": "description", "at": 2.58}, {"node": "instrument", "at": 20.01}, {"node": "level MINIMAL", "at": 36.19}, {"node": "level MODERATE", "at": 36.85}, {"node": "level HIGH", "at": 37.53}, {"node": "level CRITICAL", "at": 38.05}];
const frame = figma.currentPage.findOne(n => n.name === "intro 1 · System Stress");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 1 · System Stress"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 42.16);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 2 · Capital" · start 4871.916 s · duration 10.29 s
const CUES = [{"node": "description", "at": 1.12}, {"node": "instrument", "at": 0.0}, {"node": "level BLOCKED", "at": 0.6}, {"node": "level STAGNANT", "at": 5.26}, {"node": "level EXPANDING", "at": 5.9}, {"node": "level AT RISK", "at": 8.04}];
const frame = figma.currentPage.findOne(n => n.name === "intro 2 · Capital");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 2 · Capital"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 10.29);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 3 · Interference State" · start 4882.206 s · duration 11.01 s
const CUES = [{"node": "description", "at": 0.34}, {"node": "instrument", "at": 0.12}, {"node": "phi bar", "at": 2.14}];
const frame = figma.currentPage.findOne(n => n.name === "intro 3 · Interference State");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 3 · Interference State"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 11.01);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 4 · Threshold Dial" · start 4893.216 s · duration 10.26 s
const CUES = [{"node": "description", "at": 1.42}, {"node": "instrument", "at": 0.0}, {"node": "rho needle", "at": 1.2, "until": 6.24}, {"node": "crash reading", "at": 5.38}, {"node": "crash dot", "at": 5.58}, {"node": "crash box", "at": 6.24}, {"node": "post-patch box", "at": 6.84}];
const frame = figma.currentPage.findOne(n => n.name === "intro 4 · Threshold Dial");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 4 · Threshold Dial"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 10.26);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 5 · Active Patch" · start 4903.476 s · duration 11.2 s
const CUES = [{"node": "description", "at": 1.24}, {"node": "instrument", "at": 0.0}, {"node": "patch", "at": 5.66}];
const frame = figma.currentPage.findOne(n => n.name === "intro 5 · Active Patch");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 5 · Active Patch"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 11.2);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 6 · Variables Deployed" · start 4914.676 s · duration 9.23 s
const CUES = [{"node": "description", "at": 1.0}, {"node": "instrument", "at": 0.0}, {"node": "chip I_buffer", "at": 2.04}, {"node": "chip F_enforce^proto", "at": 2.39}, {"node": "chip P_uppet^v1.0", "at": 2.74}, {"node": "chip W", "at": 3.09}, {"node": "chip E", "at": 3.44}, {"node": "chip O_racialized", "at": 3.79}, {"node": "chip I", "at": 4.14}];
const frame = figma.currentPage.findOne(n => n.name === "intro 6 · Variables Deployed");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 6 · Variables Deployed"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 9.23);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 7 · Executing Function" · start 4923.906 s · duration 12.78 s
const CUES = [{"node": "description", "at": 1.72}, {"node": "instrument", "at": 0.0}, {"node": "function", "at": 4.06}];
const frame = figma.currentPage.findOne(n => n.name === "intro 7 · Executing Function");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 7 · Executing Function"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 12.78);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 8 · Wage Phasor" · start 4936.686 s · duration 31.95 s
const CUES = [{"node": "description", "at": 1.573}, {"node": "instrument", "at": 0.0}, {"node": "wage phasor", "at": 1.947, "until": 16.96}, {"node": "projection material", "at": 8.4}, {"node": "projection psych", "at": 10.98}, {"node": "readout all material", "at": 8.8}, {"node": "readout pure status", "at": 16.1}, {"node": "readout Quadrant II", "at": 16.96}];
const frame = figma.currentPage.findOne(n => n.name === "intro 8 · Wage Phasor");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 8 · Wage Phasor"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 31.95);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 9 · Result" · start 4968.636 s · duration 9.76 s
const CUES = [{"node": "description", "at": 0.48}, {"node": "instrument", "at": 0.0}, {"node": "ticker 1", "at": 2.74}, {"node": "ticker 2", "at": 3.34}, {"node": "ticker 3", "at": 5.46}];
const frame = figma.currentPage.findOne(n => n.name === "intro 9 · Result");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["intro 9 · Result"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 9.76);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "assembly" · start 4978.396 s · duration 13.21 s
const CUES = [{"node": "era band", "at": 0.22}, {"node": "panel header", "at": 3.32}, {"node": "panel stress", "at": 4.44}, {"node": "panel capital", "at": 4.94}, {"node": "panel interference", "at": 5.84}, {"node": "panel patch", "at": 8.74}, {"node": "panel variables", "at": 9.36}, {"node": "panel function", "at": 10.02}, {"node": "panel wage", "at": 10.7}, {"node": "panel result", "at": 11.68}, {"node": "era progress", "at": 12.18}];
const frame = figma.currentPage.findOne(n => n.name === "assembly");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["assembly"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 13.21);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1486" · start 4991.606 s · duration 43.72 s
const CUES = [{"node": "era band", "at": 1.62}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 3.4, "subtree": true}, {"node": "panel capital", "at": 7.19, "subtree": true}, {"node": "panel interference", "at": 13.14, "subtree": true}, {"node": "rho needle", "at": 15.965, "until": 18.657}, {"node": "panel patch", "at": 19.43, "subtree": true}, {"node": "panel variables", "at": 25.2, "subtree": true}, {"node": "panel function", "at": 27.14, "subtree": true}, {"node": "panel wage", "at": 29.82, "subtree": true}, {"node": "wage phasor", "at": 31.52, "until": 33.0}, {"node": "panel result", "at": 34.3, "subtree": true}, {"node": "era progress", "at": 34.8}];
const frame = figma.currentPage.findOne(n => n.name === "era 1486");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["era 1486"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 43.72);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1676" · start 5035.326 s · duration 43.25 s
const CUES = [{"node": "era band", "at": 2.14}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 5.12, "subtree": true}, {"node": "panel capital", "at": 8.94, "subtree": true}, {"node": "panel interference", "at": 12.64, "subtree": true}, {"node": "rho needle", "at": 12.64, "until": 17.03}, {"node": "panel patch", "at": 18.6, "subtree": true}, {"node": "panel variables", "at": 21.11, "subtree": true}, {"node": "panel wage", "at": 29.69, "subtree": true}, {"node": "wage phasor", "at": 29.69, "until": 30.47}, {"node": "panel function", "at": 31.67, "subtree": true}, {"node": "panel result", "at": 36.23, "subtree": true}, {"node": "era progress", "at": 36.73}];
const frame = figma.currentPage.findOne(n => n.name === "era 1676");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["era 1676"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 43.25);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1704" · start 5078.576 s · duration 47.41 s
const CUES = [{"node": "era band", "at": 2.72}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 5.76, "subtree": true}, {"node": "panel capital", "at": 12.74, "subtree": true}, {"node": "panel interference", "at": 14.94, "subtree": true}, {"node": "rho needle", "at": 18.16, "until": 21.15}, {"node": "panel patch", "at": 15.54, "subtree": true}, {"node": "panel wage", "at": 24.47, "subtree": true}, {"node": "wage phasor", "at": 24.47, "until": 27.33}, {"node": "panel variables", "at": 31.75, "subtree": true}, {"node": "panel function", "at": 35.39, "subtree": true}, {"node": "panel result", "at": 42.75, "subtree": true}, {"node": "era progress", "at": 43.25}];
const frame = figma.currentPage.findOne(n => n.name === "era 1704");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["era 1704"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 47.41);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1894" · start 5125.986 s · duration 53.76 s
const CUES = [{"node": "era band", "at": 3.15}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 5.76, "subtree": true}, {"node": "panel capital", "at": 13.43, "subtree": true}, {"node": "panel interference", "at": 18.77, "subtree": true}, {"node": "rho needle", "at": 21.7, "until": 22.905}, {"node": "panel patch", "at": 19.37, "subtree": true}, {"node": "panel wage", "at": 24.9, "subtree": true}, {"node": "wage phasor", "at": 24.9, "until": 38.59}, {"node": "panel variables", "at": 39.31, "subtree": true}, {"node": "panel function", "at": 42.77, "subtree": true}, {"node": "panel result", "at": 44.19, "subtree": true}, {"node": "era progress", "at": 44.69}];
const frame = figma.currentPage.findOne(n => n.name === "era 1894");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["era 1894"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 53.76);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1968" · start 5179.746 s · duration 48.86 s
const CUES = [{"node": "era band", "at": 2.12}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 4.6, "subtree": true}, {"node": "panel capital", "at": 9.22, "subtree": true}, {"node": "panel interference", "at": 13.19, "subtree": true}, {"node": "rho needle", "at": 15.37, "until": 16.95}, {"node": "panel patch", "at": 13.79, "subtree": true}, {"node": "panel variables", "at": 18.05, "subtree": true}, {"node": "panel wage", "at": 23.56, "subtree": true}, {"node": "wage phasor", "at": 23.56, "until": 25.26}, {"node": "panel function", "at": 35.04, "subtree": true}, {"node": "panel result", "at": 40.08, "subtree": true}, {"node": "era progress", "at": 40.58}];
const frame = figma.currentPage.findOne(n => n.name === "era 1968");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["era 1968"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 48.86);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1994" · start 5228.606 s · duration 38.98 s
const CUES = [{"node": "era band", "at": 2.28}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 4.68, "subtree": true}, {"node": "panel capital", "at": 9.14, "subtree": true}, {"node": "panel interference", "at": 11.05, "subtree": true}, {"node": "rho needle", "at": 13.41, "until": 16.634}, {"node": "panel patch", "at": 11.65, "subtree": true}, {"node": "panel variables", "at": 17.59, "subtree": true}, {"node": "panel wage", "at": 20.08, "subtree": true}, {"node": "wage phasor", "at": 20.08, "until": 24.94}, {"node": "panel function", "at": 23.74, "subtree": true}, {"node": "panel result", "at": 30.01, "subtree": true}, {"node": "era progress", "at": 30.51}];
const frame = figma.currentPage.findOne(n => n.name === "era 1994");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["era 1994"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 38.98);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 2010" · start 5267.586 s · duration 58.73 s
const CUES = [{"node": "era band", "at": 2.92}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 5.14, "subtree": true}, {"node": "panel capital", "at": 12.12, "subtree": true}, {"node": "panel interference", "at": 18.08, "subtree": true}, {"node": "rho needle", "at": 20.62, "until": 22.28}, {"node": "panel patch", "at": 18.68, "subtree": true}, {"node": "panel variables", "at": 13.24, "subtree": true}, {"node": "panel wage", "at": 23.4, "subtree": true}, {"node": "wage phasor", "at": 23.4, "until": 25.42}, {"node": "panel function", "at": 33.73, "subtree": true}, {"node": "panel result", "at": 39.11, "subtree": true}, {"node": "era progress", "at": 45.59}];
const frame = figma.currentPage.findOne(n => n.name === "era 2010");
if (frame == null) {
  return { mutatedNodeIds: [], missing: ["era 2010"], beats: [] };
}
const trackTimes = (track, times) => {
  for (const kf of (track && track.keyframes) || []) {
    if (typeof kf.timelinePosition === "number") times.push(kf.timelinePosition);
  }
};
const collectTimes = (node) => {
  const times = [];
  for (const style of node.animationStyles || []) {
    if (typeof style.timelineOffset === "number") {
      times.push(style.timelineOffset);
      if (style.props && typeof style.props.duration === "number") {
        times.push(style.timelineOffset + style.props.duration);
      }
    }
  }
  for (const [field, value] of Object.entries(node.manualKeyframeTracks || {})) {
    if (field === "fills" || field === "strokes") {
      for (const track of Object.values(value || {})) trackTimes(track, times);
    } else if (field === "effects") {
      for (const byField of Object.values(value || {})) {
        for (const track of Object.values(byField || {})) trackTimes(track, times);
      }
    } else {
      trackTimes(value, times);
    }
  }
  return times;
};
const motionNodes = (node, subtree) => {
  const candidates = [node];
  if (subtree && typeof node.findAll === "function") candidates.push(...node.findAll(() => true));
  return candidates.filter(candidate => collectTimes(candidate).length > 0);
};
const shiftStyle = (style, delta) => {
  const shifted = { ...style, timelineOffset: style.timelineOffset + delta };
  if (style.props) {
    shifted.props = {
      ...style.props,
      delay: (typeof style.props.delay === "number" ? style.props.delay : style.timelineOffset) + delta,
    };
  }
  return shifted;
};
const shiftTrack = (track, delta) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({ ...kf, timelinePosition: kf.timelinePosition + delta })),
});
const shiftTracks = (mkt, delta) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) {
        copy[field][index] = shiftTrack(track, delta);
      }
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) {
          copy[field][index][effectField] = shiftTrack(track, delta);
        }
      }
    } else {
      copy[field] = shiftTrack(value, delta);
    }
  }
  return copy;
};
const scaleTime = (value, from, to, start, end) => {
  if (to === from) return start;
  return start + (value - from) * (end - start) / (to - from);
};
const scaleStyle = (style, from, to, start, end) => {
  const factor = to === from ? 0 : (end - start) / (to - from);
  const offset = scaleTime(style.timelineOffset, from, to, start, end);
  const scaled = { ...style, timelineOffset: offset };
  if (style.props) {
    scaled.props = { ...style.props };
    if (typeof style.props.delay === "number") scaled.props.delay = scaleTime(style.props.delay, from, to, start, end);
    if (typeof style.props.duration === "number") scaled.props.duration = style.props.duration * factor;
  }
  return scaled;
};
const scaleTrack = (track, from, to, start, end) => track == null ? track : ({
  ...track,
  keyframes: (track.keyframes || []).map(kf => ({
    ...kf,
    timelinePosition: scaleTime(kf.timelinePosition, from, to, start, end),
  })),
});
const scaleTracks = (mkt, from, to, start, end) => {
  const copy = {};
  for (const [field, value] of Object.entries(mkt)) {
    if (field === "fills" || field === "strokes") {
      copy[field] = {};
      for (const [index, track] of Object.entries(value || {})) copy[field][index] = scaleTrack(track, from, to, start, end);
    } else if (field === "effects") {
      copy[field] = {};
      for (const [index, byField] of Object.entries(value || {})) {
        copy[field][index] = {};
        for (const [effectField, track] of Object.entries(byField || {})) copy[field][index][effectField] = scaleTrack(track, from, to, start, end);
      }
    } else {
      copy[field] = scaleTrack(value, from, to, start, end);
    }
  }
  return copy;
};
const mutatedNodeIds = [];
const missing = [];
const applied = [];
let firstFound = null;
for (const beat of CUES) {
  const node = frame.findOne(n => n.name === beat.node);
  if (node == null) {
    missing.push(beat.node);
    continue;
  }
  if (firstFound == null) firstFound = node;
  const targets = motionNodes(node, beat.subtree === true);
  const times = targets.flatMap(collectTimes);
  if (times.length === 0) {
    applied.push({ node: beat.node, before: null, after: null });
    continue;
  }
  const before = Math.min(...times);
  const delta = beat.at - before;
  for (const target of targets) {
    if (Array.isArray(target.animationStyles)) target.animationStyles = target.animationStyles.map(style => shiftStyle(style, delta));
    if (target.manualKeyframeTracks) target.manualKeyframeTracks = shiftTracks(target.manualKeyframeTracks, delta);
    mutatedNodeIds.push(target.id);
  }
  if (typeof beat.until === "number") {
    const ownTimes = collectTimes(node);
    if (ownTimes.length > 0) {
      const ownStart = Math.min(...ownTimes);
      const ownEnd = Math.max(...ownTimes);
      if (Array.isArray(node.animationStyles)) node.animationStyles = node.animationStyles.map(style => scaleStyle(style, ownStart, ownEnd, beat.at, beat.until));
      if (node.manualKeyframeTracks) node.manualKeyframeTracks = scaleTracks(node.manualKeyframeTracks, ownStart, ownEnd, beat.at, beat.until);
    }
  }
  applied.push({ node: beat.node, before, after: beat.at, ...(typeof beat.until === "number" ? { until: beat.until } : {}) });
}
const timelineHost = firstFound || (frame.children || [])[0];
if (timelineHost) {
  const [tl] = timelineHost.timelines || [];
  if (tl) await timelineHost.setTimelineDuration(tl.id, 58.73);
}
return { mutatedNodeIds, missing, beats: applied };

