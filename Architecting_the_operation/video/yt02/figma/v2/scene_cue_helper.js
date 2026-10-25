const frame = figma.currentPage.findOne(n => n.name === FRAME);
if (frame == null) {
  return { mutatedNodeIds: [], missing: [FRAME], beats: [] };
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, DURATION);
}
return { mutatedNodeIds, missing, beats: applied };


