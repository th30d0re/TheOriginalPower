"""Tests for Architecting_the_operation/video/yt02/figma_cues.py."""

import importlib.util
import json
import shutil
import subprocess
from pathlib import Path

import pytest

MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "Architecting_the_operation"
    / "video"
    / "yt02"
    / "figma_cues.py"
)
_spec = importlib.util.spec_from_file_location("figma_cues", MODULE_PATH)
figma_cues = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(figma_cues)

WORDS_LIST = [
    {
        "turn": 0,
        "turn_id": "t0",
        "text": "Hello, world. Hello again.",
        "words": [
            {"w": "Hello,", "t": 0.05},
            {"w": "world.", "t": 0.5},
            {"w": "Hello", "t": 1.0},
            {"w": "again.", "t": 1.4},
        ],
    },
    {
        "turn": 1,
        "turn_id": "t1",
        "text": "Second turn here.",
        "words": [
            {"w": "Second", "t": 0.2},
            {"w": "turn", "t": 0.6},
            {"w": "here.", "t": 1.0},
        ],
    },
    {
        "turn": 2,
        "turn_id": "t2",
        "text": "Final turn now.",
        "words": [
            {"w": "Final", "t": 0.3},
            {"w": "turn", "t": 0.9},
            {"w": "now.", "t": 1.5},
        ],
    },
]
MANIFEST = {
    "turns": [
        {"turn_index": 0, "start_ms": 0, "end_ms": 2000},
        {"turn_index": 1, "start_ms": 2500, "end_ms": 4500},
        {"turn_index": 2, "start_ms": 5000, "end_ms": 7000},
    ]
}
WORDS = {e["turn"]: e for e in WORDS_LIST}
TURNS = MANIFEST["turns"]
BY_INDEX = {t["turn_index"]: t for t in TURNS}


def scene(turns, beats, frame="01 · Test frame"):
    return {"frame": frame, "turns": turns, "beats": beats}


def test_prefix_match_normalizes_both_sides():
    s = scene([0], [{"node": "card", "turn": 0, "word": "wor", "lead": 0}])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["beats"] == [{"node": "card", "at": 0.5}]


def test_prefix_match_strips_case_and_punctuation():
    s = scene([0], [{"node": "card", "turn": 0, "word": "HELL", "lead": 0}])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["beats"][0]["at"] == 0.05


def test_nth_picks_occurrence():
    s = scene([0], [{"node": "card", "turn": 0, "word": "hello", "nth": 1, "lead": 0}])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["beats"][0]["at"] == 1.0


def test_lead_floors_at_turn_start():
    s = scene([1], [{"node": "card", "turn": 0, "word": "second", "lead": 0.5}])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["start"] == 2.5
    assert out["beats"][0]["at"] == 0.0


def test_default_lead_is_point_one():
    s = scene([0], [{"node": "card", "turn": 0, "word": "world"}])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["beats"][0]["at"] == pytest.approx(0.4)


def test_scene_duration_middle_turns_uses_next_turn_start():
    s = scene([0, 1], [])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["start"] == 0.0
    assert out["duration"] == 5.0


def test_scene_duration_final_turn_uses_its_end():
    s = scene([2], [])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["start"] == 5.0
    assert out["duration"] == 2.0


def test_beat_time_is_relative_to_scene_start():
    s = scene([1, 2], [{"node": "card", "turn": 1, "word": "now", "lead": 0.1}])
    out = figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    assert out["start"] == 2.5
    assert out["beats"][0]["at"] == pytest.approx(3.9)


def test_missing_word_error_names_scene_node_turn_and_words():
    s = scene([1], [{"node": "bar 2", "turn": 0, "word": "zebra"}])
    with pytest.raises(figma_cues.CueError) as excinfo:
        figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)
    msg = str(excinfo.value)
    assert "01 · Test frame" in msg
    assert "bar 2" in msg
    assert "zebra" in msg
    assert "turn 1" in msg
    assert "Second" in msg
    assert "here." in msg


def test_nth_out_of_range_is_a_missing_word():
    s = scene([0], [{"node": "card", "turn": 0, "word": "hello", "nth": 2}])
    with pytest.raises(figma_cues.CueError):
        figma_cues.compute_scene(s, WORDS, TURNS, BY_INDEX)


def test_cli_writes_json_and_js_with_computed_offsets(tmp_path):
    words_path = tmp_path / "words.json"
    manifest_path = tmp_path / "episode_manifest.json"
    words_path.write_text(json.dumps(WORDS_LIST))
    manifest_path.write_text(json.dumps(MANIFEST))
    spec_path = tmp_path / "spec.json"
    spec_path.write_text(
        json.dumps(
            {
                "words": str(words_path),
                "manifest": str(manifest_path),
                "scenes": [
                    scene(
                        [0, 1],
                        [
                            {"node": "bar 1", "turn": 0, "word": "world"},
                            {"node": "bar 2", "turn": 1, "word": "turn", "lead": 0.2},
                        ],
                    )
                ],
            }
        )
    )
    json_out = tmp_path / "out.json"
    js_out = tmp_path / "out.js"
    figma_cues.main([str(spec_path), "--json", str(json_out), "--js", str(js_out)])

    [s] = json.loads(json_out.read_text())["scenes"]
    assert s["frame"] == "01 · Test frame"
    assert s["start"] == 0.0
    assert s["duration"] == 5.0
    assert s["beats"] == [
        {"node": "bar 1", "at": pytest.approx(0.4)},
        {"node": "bar 2", "at": pytest.approx(2.9)},
    ]

    js = js_out.read_text()
    assert '"bar 1"' in js
    assert '"bar 2"' in js
    assert '"at": 0.4' in js
    assert '"at": 2.9' in js
    assert "setTimelineDuration(tl.id, 5.0)" in js
    assert '"01 · Test frame"' in js
    assert js.rstrip().endswith("return { mutatedNodeIds, missing, beats: applied };")
    assert "figma.closePlugin" not in js
    assert "figma.notify" not in js
    assert "console." not in js


NODE_HARNESS = """
const bar1 = {
  id: "10:1",
  name: "bar 1",
  animationStyles: [
    { id: "as1", styleId: "st1", props: { ease: "in", delay: 0.8 }, timelineOffset: 1.0 },
    { id: "as2", styleId: "st2", props: { ease: "out" }, timelineOffset: 2.2 },
    { id: "as3", styleId: "custom", timelineOffset: 1.6 },
  ],
  manualKeyframeTracks: {
    OPACITY: {
      id: "trkO",
      baseValue: 0,
      keyframes: [
        { id: "k1", timelinePosition: 2.0, baseValue: 0 },
        { id: "k2", timelinePosition: 2.5, baseValue: 1 },
      ],
    },
    strokes: {
      0: { id: "trkS", baseValue: 3, keyframes: [{ id: "k3", timelinePosition: 3.0, baseValue: 3 }] },
    },
  },
  timelines: [{ id: "tl1" }],
  timelineCalls: [],
  async setTimelineDuration(id, d) { this.timelineCalls.push([id, d]); },
};
const bar2 = {
  id: "10:2",
  name: "bar 2",
  animationStyles: [],
  manualKeyframeTracks: {
    TRANSLATION_X: { id: "trkX", baseValue: 0, keyframes: [{ id: "k4", timelinePosition: 0.5, baseValue: 0 }] },
    effects: {
      0: { RADIUS: { id: "trkR", baseValue: 4, keyframes: [{ id: "k5", timelinePosition: 0.8, baseValue: 4 }] } },
    },
  },
  timelines: [{ id: "tl2" }],
  timelineCalls: [],
  async setTimelineDuration(id, d) { this.timelineCalls.push([id, d]); },
};
const origStyles = bar1.animationStyles;
const origOpacity = bar1.manualKeyframeTracks.OPACITY;
const origStroke0 = bar1.manualKeyframeTracks.strokes[0];
const origEffectRadius = bar2.manualKeyframeTracks.effects[0].RADIUS;
const frame = {
  id: "1:1",
  name: "01 · Test frame",
  children: [bar1, bar2],
  timelines: [{ id: "frameTl" }],
  findOne(fn) {
    if (fn(this)) return this;
    for (const child of this.children) {
      if (fn(child)) return child;
    }
    return null;
  },
  async setTimelineDuration() {
    throw new Error("setTimelineDuration must not run on the top-level frame");
  },
};
const figma = { currentPage: { findOne: (fn) => (fn(frame) ? frame : null) } };
const run = async () => {
__SCRIPT__
};
const result = await run();
process.stdout.write(
  JSON.stringify({
    result,
    bar1: {
      animationStyles: bar1.animationStyles,
      manualKeyframeTracks: bar1.manualKeyframeTracks,
      timelineCalls: bar1.timelineCalls,
    },
    bar2: {
      manualKeyframeTracks: bar2.manualKeyframeTracks,
      timelineCalls: bar2.timelineCalls,
    },
    originals: {
      styleOffset: origStyles[0].timelineOffset,
      styleDelay: origStyles[0].props.delay,
      opacityKf0: origOpacity.keyframes[0].timelinePosition,
      strokeKf0: origStroke0.keyframes[0].timelinePosition,
      effectKf0: origEffectRadius.keyframes[0].timelinePosition,
    },
  })
);
"""


def _run_emitted_js(tmp_path):
    words_path = tmp_path / "words.json"
    manifest_path = tmp_path / "episode_manifest.json"
    words_path.write_text(json.dumps(WORDS_LIST))
    manifest_path.write_text(json.dumps(MANIFEST))
    spec_path = tmp_path / "spec.json"
    spec_path.write_text(
        json.dumps(
            {
                "words": str(words_path),
                "manifest": str(manifest_path),
                "scenes": [
                    scene(
                        [0, 1],
                        [
                            {"node": "bar 1", "turn": 0, "word": "world"},
                            {"node": "bar 2", "turn": 1, "word": "turn", "lead": 0.2},
                        ],
                    )
                ],
            }
        )
    )
    js_out = tmp_path / "out.js"
    figma_cues.main([str(spec_path), "--js", str(js_out)])

    harness = tmp_path / "run.mjs"
    harness.write_text(NODE_HARNESS.replace("__SCRIPT__", js_out.read_text()))
    proc = subprocess.run(["node", str(harness)], capture_output=True, text=True)
    assert proc.returncode == 0, proc.stderr
    return json.loads(proc.stdout)


@pytest.mark.skipif(shutil.which("node") is None, reason="node is not installed")
def test_emitted_js_shifts_object_shaped_tracks(tmp_path):
    out = _run_emitted_js(tmp_path)

    # bar 1: earliest start is the animationStyle offset 1.0; beat at 0.4 -> delta -0.6.
    assert out["result"]["beats"] == [
        {"node": "bar 1", "before": pytest.approx(1.0), "after": pytest.approx(0.4)},
        {"node": "bar 2", "before": pytest.approx(0.5), "after": pytest.approx(2.9)},
    ]
    assert out["result"]["missing"] == []
    assert out["result"]["mutatedNodeIds"] == ["10:1", "10:2"]

    styles = out["bar1"]["animationStyles"]
    assert styles[0]["timelineOffset"] == pytest.approx(0.4)
    assert styles[0]["id"] == "as1"
    assert styles[0]["styleId"] == "st1"
    assert styles[0]["props"]["ease"] == "in"

    tracks = out["bar1"]["manualKeyframeTracks"]
    opacity = tracks["OPACITY"]
    assert opacity["id"] == "trkO"
    assert opacity["baseValue"] == 0
    assert [kf["timelinePosition"] for kf in opacity["keyframes"]] == [
        pytest.approx(1.4),
        pytest.approx(1.9),
    ]
    assert [kf["id"] for kf in opacity["keyframes"]] == ["k1", "k2"]
    assert [kf["baseValue"] for kf in opacity["keyframes"]] == [0, 1]
    stroke0 = tracks["strokes"]["0"]
    assert stroke0["id"] == "trkS"
    assert stroke0["baseValue"] == 3
    assert stroke0["keyframes"][0]["timelinePosition"] == pytest.approx(2.4)

    # bar 2: earliest start is the TRANSLATION_X keyframe at 0.5; beat at 2.9 -> delta +2.4.
    tracks2 = out["bar2"]["manualKeyframeTracks"]
    assert tracks2["TRANSLATION_X"]["keyframes"][0]["timelinePosition"] == pytest.approx(2.9)
    assert tracks2["TRANSLATION_X"]["keyframes"][0]["id"] == "k4"
    radius = tracks2["effects"]["0"]["RADIUS"]
    assert radius["id"] == "trkR"
    assert radius["baseValue"] == 4
    assert radius["keyframes"][0]["timelinePosition"] == pytest.approx(3.2)
    assert radius["keyframes"][0]["id"] == "k5"

    # Deep copy: the original track and style objects were left untouched.
    assert out["originals"] == {
        "styleOffset": pytest.approx(1.0),
        "styleDelay": pytest.approx(0.8),
        "opacityKf0": pytest.approx(2.0),
        "strokeKf0": pytest.approx(3.0),
        "effectKf0": pytest.approx(0.8),
    }

    # The timeline duration lands on the first beat node's timeline, never on the frame.
    assert out["bar1"]["timelineCalls"] == [["tl1", 5.0]]
    assert out["bar2"]["timelineCalls"] == []


@pytest.mark.skipif(shutil.which("node") is None, reason="node is not installed")
def test_emitted_js_shifts_animation_style_delay(tmp_path):
    out = _run_emitted_js(tmp_path)
    styles = out["bar1"]["animationStyles"]

    # props.delay present: delay shifts from its own value (0.8 - 0.6), offset shifts too.
    assert styles[0]["timelineOffset"] == pytest.approx(0.4)
    assert styles[0]["props"]["delay"] == pytest.approx(0.2)
    assert styles[0]["props"]["ease"] == "in"

    # props without delay: delay falls back to the entry's timelineOffset (2.2 - 0.6).
    assert styles[1]["timelineOffset"] == pytest.approx(1.6)
    assert styles[1]["props"]["delay"] == pytest.approx(1.6)
    assert styles[1]["props"]["ease"] == "out"

    # CUSTOM entry (no props): only timelineOffset shifts; no props key is created.
    assert styles[2]["timelineOffset"] == pytest.approx(1.0)
    assert "props" not in styles[2]

    # The original style entries were not mutated.
    assert out["originals"]["styleOffset"] == pytest.approx(1.0)
    assert out["originals"]["styleDelay"] == pytest.approx(0.8)
