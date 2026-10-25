// figma_cues.py · scene "intro 1 · System Stress" · start 5056.534 s · duration 43.25 s
const CUES = [{"node": "description", "at": 21.61}, {"node": "instrument", "at": 21.03}, {"node": "level MINIMAL", "at": 37.89}, {"node": "level MODERATE", "at": 38.49}, {"node": "level HIGH", "at": 39.11}, {"node": "level CRITICAL", "at": 39.51}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 43.25);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 2 · Capital" · start 5099.784 s · duration 11.59 s
const CUES = [{"node": "description", "at": 1.0}, {"node": "instrument", "at": 0.0}, {"node": "level STAGNANT", "at": 5.8}, {"node": "level EXPANDING", "at": 6.5}, {"node": "level AT RISK", "at": 9.06}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 11.59);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 3 · Interference State" · start 5111.374 s · duration 10.77 s
const CUES = [{"node": "description", "at": 0.64}, {"node": "instrument", "at": 0.11}, {"node": "phi bar", "at": 2.72}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 10.77);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 4 · Threshold Dial" · start 5122.144 s · duration 10.83 s
const CUES = [{"node": "description", "at": 0.74}, {"node": "instrument", "at": 0.02}, {"node": "rho needle", "at": 1.37, "until": 6.94}, {"node": "crash reading", "at": 5.46}, {"node": "crash box", "at": 6.94}, {"node": "crash dot", "at": 5.66}, {"node": "post-patch box", "at": 7.54}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 10.83);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 5 · Active Patch" · start 5132.974 s · duration 10.03 s
const CUES = [{"node": "description", "at": 1.16}, {"node": "instrument", "at": 0.0}, {"node": "patch", "at": 5.14}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 10.03);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 6 · Variables Deployed" · start 5143.004 s · duration 8.85 s
const CUES = [{"node": "description", "at": 0.98}, {"node": "instrument", "at": 0.0}, {"node": "chip I_buffer", "at": 0.98}, {"node": "chip F_enforce^proto", "at": 1.33}, {"node": "chip P_uppet^v1.0", "at": 1.68}, {"node": "chip W", "at": 2.03}, {"node": "chip E", "at": 2.38}, {"node": "chip O_racialized", "at": 2.73}, {"node": "chip I", "at": 3.08}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 8.85);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 7 · Executing Function" · start 5151.854 s · duration 11.73 s
const CUES = [{"node": "description", "at": 1.46}, {"node": "instrument", "at": 0.0}, {"node": "function", "at": 3.14}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 11.73);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 8 · Wage Phasor" · start 5163.584 s · duration 30.76 s
const CUES = [{"node": "description", "at": 2.18}, {"node": "instrument", "at": 0.02}, {"node": "wage phasor", "at": 2.18, "until": 17.64}, {"node": "projection material", "at": 8.86}, {"node": "projection psych", "at": 11.56}, {"node": "readout all material", "at": 9.26}, {"node": "readout pure status", "at": 16.86}, {"node": "readout Quadrant II", "at": 17.64}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 30.76);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "intro 9 · Result" · start 5194.344 s · duration 9.38 s
const CUES = [{"node": "description", "at": 0.56}, {"node": "instrument", "at": 0.0}, {"node": "ticker 1", "at": 2.84}, {"node": "ticker 2", "at": 3.44}, {"node": "ticker 3", "at": 5.32}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 9.38);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "assembly" · start 5203.724 s · duration 13.86 s
const CUES = [{"node": "era band", "at": 0.02}, {"node": "panel header", "at": 3.06}, {"node": "panel stress", "at": 4.14}, {"node": "panel capital", "at": 4.66}, {"node": "panel interference", "at": 5.58}, {"node": "panel patch", "at": 8.22}, {"node": "panel variables", "at": 9.42}, {"node": "panel function", "at": 10.36}, {"node": "panel wage", "at": 11.2}, {"node": "panel result", "at": 12.46}, {"node": "era progress", "at": 12.96}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 13.86);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1486" · start 5217.584 s · duration 45.51 s
const CUES = [{"node": "era band", "at": 2.37}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 4.1, "subtree": true}, {"node": "panel capital", "at": 7.58, "subtree": true}, {"node": "panel interference", "at": 13.61, "subtree": true}, {"node": "rho needle", "at": 16.29, "until": 19.05}, {"node": "panel patch", "at": 20.79, "subtree": true}, {"node": "panel variables", "at": 26.44, "subtree": true}, {"node": "panel function", "at": 28.56, "subtree": true}, {"node": "panel wage", "at": 30.84, "subtree": true}, {"node": "wage phasor", "at": 32.56, "until": 34.4}, {"node": "panel result", "at": 35.59, "subtree": true}, {"node": "era progress", "at": 36.09}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 45.51);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1676" · start 5263.094 s · duration 46.29 s
const CUES = [{"node": "era band", "at": 2.57}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 7.22, "subtree": true}, {"node": "panel capital", "at": 11.54, "subtree": true}, {"node": "panel interference", "at": 14.47, "subtree": true}, {"node": "rho needle", "at": 14.47, "until": 18.53}, {"node": "panel patch", "at": 19.79, "subtree": true}, {"node": "panel variables", "at": 22.62, "subtree": true}, {"node": "panel wage", "at": 32.06, "subtree": true}, {"node": "wage phasor", "at": 32.06, "until": 33.08}, {"node": "panel function", "at": 34.24, "subtree": true}, {"node": "panel result", "at": 38.46, "subtree": true}, {"node": "era progress", "at": 38.96}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 46.29);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1704" · start 5309.384 s · duration 45.08 s
const CUES = [{"node": "era band", "at": 2.848}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 6.18, "subtree": true}, {"node": "panel capital", "at": 12.9, "subtree": true}, {"node": "panel interference", "at": 14.83, "subtree": true}, {"node": "rho needle", "at": 18.12, "until": 20.775}, {"node": "panel patch", "at": 15.43, "subtree": true}, {"node": "panel wage", "at": 24.04, "subtree": true}, {"node": "wage phasor", "at": 24.04, "until": 26.92}, {"node": "panel variables", "at": 31.08, "subtree": true}, {"node": "panel function", "at": 34.47, "subtree": true}, {"node": "panel result", "at": 40.99, "subtree": true}, {"node": "era progress", "at": 41.49}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 45.08);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1894" · start 5354.464 s · duration 51.74 s
const CUES = [{"node": "era band", "at": 3.44}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 6.48, "subtree": true}, {"node": "panel capital", "at": 13.64, "subtree": true}, {"node": "panel interference", "at": 18.7, "subtree": true}, {"node": "rho needle", "at": 21.54, "until": 22.755}, {"node": "panel patch", "at": 19.3, "subtree": true}, {"node": "panel wage", "at": 24.94, "subtree": true}, {"node": "wage phasor", "at": 25.64, "until": 38.13}, {"node": "panel variables", "at": 38.91, "subtree": true}, {"node": "panel function", "at": 41.91, "subtree": true}, {"node": "panel result", "at": 43.13, "subtree": true}, {"node": "era progress", "at": 43.63}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 51.74);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1968" · start 5406.204 s · duration 45.91 s
const CUES = [{"node": "era band", "at": 2.223}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 4.74, "subtree": true}, {"node": "panel capital", "at": 8.91, "subtree": true}, {"node": "panel interference", "at": 12.31, "subtree": true}, {"node": "rho needle", "at": 14.63, "until": 16.12}, {"node": "panel patch", "at": 12.91, "subtree": true}, {"node": "panel variables", "at": 17.29, "subtree": true}, {"node": "panel wage", "at": 22.12, "subtree": true}, {"node": "wage phasor", "at": 22.12, "until": 23.6}, {"node": "panel function", "at": 33.28, "subtree": true}, {"node": "panel result", "at": 37.88, "subtree": true}, {"node": "era progress", "at": 38.38}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 45.91);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 1994" · start 5452.114 s · duration 37.29 s
const CUES = [{"node": "era band", "at": 2.16}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 4.72, "subtree": true}, {"node": "panel capital", "at": 8.71, "subtree": true}, {"node": "panel interference", "at": 10.61, "subtree": true}, {"node": "rho needle", "at": 12.98, "until": 15.69}, {"node": "panel patch", "at": 11.21, "subtree": true}, {"node": "panel variables", "at": 17.34, "subtree": true}, {"node": "panel wage", "at": 19.51, "subtree": true}, {"node": "wage phasor", "at": 19.51, "until": 24.36}, {"node": "panel function", "at": 23.14, "subtree": true}, {"node": "panel result", "at": 29.13, "subtree": true}, {"node": "era progress", "at": 29.63}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 37.29);
}
return { mutatedNodeIds, missing, beats: applied };


// figma_cues.py · scene "era 2010" · start 5489.404 s · duration 54.61 s
const CUES = [{"node": "era band", "at": 2.58}, {"node": "panel header", "at": 0.0, "subtree": true}, {"node": "panel stress", "at": 4.88, "subtree": true}, {"node": "panel capital", "at": 10.92, "subtree": true}, {"node": "panel interference", "at": 16.83, "subtree": true}, {"node": "rho needle", "at": 19.5, "until": 21.072}, {"node": "panel patch", "at": 17.43, "subtree": true}, {"node": "panel variables", "at": 11.98, "subtree": true}, {"node": "panel wage", "at": 21.77, "subtree": true}, {"node": "wage phasor", "at": 21.77, "until": 23.57}, {"node": "panel function", "at": 31.14, "subtree": true}, {"node": "panel result", "at": 35.76, "subtree": true}, {"node": "era progress", "at": 41.45}];
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, 54.61);
}
return { mutatedNodeIds, missing, beats: applied };

