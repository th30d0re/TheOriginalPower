"""Convert manimgx-style word cues into Figma timeline seconds.

Reads a cue spec naming one Figma frame per scene plus the turns and words each
beat listens to, then emits:

- ``--json``: per scene, its absolute start, duration, and each beat's ``node``
  and ``at`` in seconds, relative to the scene start.
- ``--js``: one Plugin API script per scene for the ``use_figma`` tool. Each
  script finds the frame by name on the current page, shifts every beat node's
  motion so its earliest start lands on the beat's ``at`` (reassigning a shifted
  deep copy of ``manualKeyframeTracks``), and sets the scene duration on the
  first beat node's timeline.

Cue semantics match ``common16x9.py`` (``_norm`` and ``Timing.cue``): words
match by normalized prefix, ``nth`` picks the occurrence (default 0), ``lead``
(default 0.1 s) starts the motion ahead of the word, and a beat never lands
before its turn's start.

Usage: python3 figma_cues.py spec.json --json out.json --js out.js
"""

import argparse
import json
import re
import sys
from pathlib import Path

DEFAULT_LEAD = 0.1


class CueError(Exception):
    """A beat references a turn or word the inputs do not contain."""


def _norm(word):
    return re.sub(r"[^a-z0-9]", "", word.lower())


def _round(seconds):
    return round(seconds, 3)


def _input_path(value):
    path = Path(value)
    if path.exists() or path.is_absolute():
        return path
    repository_path = Path(__file__).resolve().parents[3] / path
    return repository_path if repository_path.exists() else path


def load_inputs(spec_path):
    spec = json.loads(Path(spec_path).read_text())
    words_list = json.loads(_input_path(spec["words"]).read_text())
    manifest = json.loads(_input_path(spec["manifest"]).read_text())
    words = {entry.get("turn", i): entry for i, entry in enumerate(words_list)}
    turns = manifest["turns"]
    by_index = {t["turn_index"]: t for t in turns}
    return spec, words, turns, by_index


def _word_time(entry, word, nth, frame, node, scene_turn, global_turn):
    hits = [w["t"] for w in entry["words"] if _norm(w["w"]).startswith(_norm(word))]
    if len(hits) <= nth:
        available = " ".join(w["w"] for w in entry["words"])
        raise CueError(
            f"scene {frame!r}, node {node!r}: word {word!r} #{nth} absent from turn "
            f"{global_turn} (scene turn {scene_turn}); that turn's words: {available}"
        )
    return hits[nth]


def _cue_time(cue, node, frame, global_turns, words, by_index, scene_start):
    scene_turn = cue["turn"]
    if not 0 <= scene_turn < len(global_turns):
        raise CueError(
            f"scene {frame!r}, node {node!r}: scene turn {scene_turn} out of range "
            f"for a scene with {len(global_turns)} turns"
        )
    global_turn = global_turns[scene_turn]
    word = cue["word"]
    nth = cue.get("nth", 0)
    lead = cue.get("lead", DEFAULT_LEAD)
    if nth < 0 or not _norm(word):
        raise CueError(f"scene {frame!r}, node {node!r}: a beat needs a word and a nonnegative nth")
    t = _word_time(words[global_turn], word, nth, frame, node, scene_turn, global_turn)
    absolute = by_index[global_turn]["start_ms"] / 1000 + max(0.0, t - lead)
    return _round(absolute - scene_start)


def compute_scene(scene, words, turns, by_index):
    frame = scene["frame"]
    global_turns = scene["turns"]
    if not global_turns:
        raise CueError(f"scene {frame!r}: the turns list is empty")
    for g in global_turns:
        if g not in by_index:
            raise CueError(f"scene {frame!r}: turn {g} absent from the manifest")
        if g not in words:
            raise CueError(f"scene {frame!r}: turn {g} absent from words.json")
    scene_start_ms = by_index[global_turns[0]]["start_ms"]
    last = global_turns[-1]
    position = next(i for i, t in enumerate(turns) if t["turn_index"] == last)
    if position + 1 < len(turns):
        scene_end_ms = turns[position + 1]["start_ms"]
    else:
        scene_end_ms = by_index[last]["end_ms"]
    scene_start = scene_start_ms / 1000
    beats = []
    pending = list(scene.get("beats", []))
    by_node = {}
    while pending:
        progressed = False
        for beat in pending[:]:
            node = beat["node"]
            if "after" in beat:
                dependency = by_node.get(beat["after"])
                if dependency is None:
                    continue
                at = _round(dependency["at"] + beat.get("gap", 0.0))
            else:
                if "word" not in beat or "turn" not in beat:
                    raise CueError(
                        f"scene {frame!r}, node {node!r}: a beat needs either word/turn or after"
                    )
                at = _cue_time(beat, node, frame, global_turns, words, by_index, scene_start)
            out = {"node": node, "at": at}
            if beat.get("subtree"):
                out["subtree"] = True
            if "until" in beat:
                until = beat["until"]
                if "word" not in until or "turn" not in until:
                    raise CueError(f"scene {frame!r}, node {node!r}: until needs word and turn")
                out["until"] = _cue_time(
                    until, node, frame, global_turns, words, by_index, scene_start
                )
                if out["until"] < at:
                    raise CueError(f"scene {frame!r}, node {node!r}: until precedes at")
            beats.append(out)
            by_node[node] = out
            pending.remove(beat)
            progressed = True
        if not progressed:
            dependencies = ", ".join(
                f"{beat['node']!r} after {beat.get('after')!r}" for beat in pending
            )
            raise CueError(f"scene {frame!r}: unresolved after dependency: {dependencies}")
    return {
        "frame": frame,
        "start": _round(scene_start),
        "duration": _round((scene_end_ms - scene_start_ms) / 1000),
        "beats": beats,
    }


def compute(spec_path):
    spec, words, turns, by_index = load_inputs(spec_path)
    return [compute_scene(scene, words, turns, by_index) for scene in spec["scenes"]]


JS_SCENE = """// figma_cues.py · scene __FRAME__ · start __START__ s · duration __DURATION__ s
const CUES = __CUES__;
const frame = figma.currentPage.findOne(n => n.name === __FRAME__);
if (frame == null) {
  return { mutatedNodeIds: [], missing: [__FRAME__], beats: [] };
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
  if (tl) await timelineHost.setTimelineDuration(tl.id, __DURATION__);
}
return { mutatedNodeIds, missing, beats: applied };
"""


def render_js(scenes):
    parts = []
    for scene in scenes:
        parts.append(
            JS_SCENE.replace("__FRAME__", json.dumps(scene["frame"], ensure_ascii=False))
            .replace("__START__", repr(scene["start"]))
            .replace("__DURATION__", repr(scene["duration"]))
            .replace("__CUES__", json.dumps(scene["beats"], ensure_ascii=False))
        )
    return "\n\n".join(parts) + "\n"


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("spec", help="cue spec JSON (words, manifest, scenes)")
    parser.add_argument("--json", dest="json_out", help="write computed cue times to this JSON file")
    parser.add_argument("--js", dest="js_out", help="write one Figma Plugin API script per scene")
    args = parser.parse_args(argv)
    if not args.json_out and not args.js_out:
        parser.error("at least one of --json or --js is required")
    try:
        scenes = compute(args.spec)
    except CueError as exc:
        print(f"figma_cues: {exc}", file=sys.stderr)
        raise SystemExit(2)
    if args.json_out:
        Path(args.json_out).write_text(json.dumps({"scenes": scenes}, indent=2, ensure_ascii=False) + "\n")
    if args.js_out:
        Path(args.js_out).write_text(render_js(scenes))


if __name__ == "__main__":
    main()
