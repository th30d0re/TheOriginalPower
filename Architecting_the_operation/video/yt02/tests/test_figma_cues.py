"""Extended cue semantics for the YT02 Figma retimer."""

import importlib.util
import json
import shutil
import subprocess
from pathlib import Path

import pytest

MODULE_PATH = Path(__file__).resolve().parents[1] / "figma_cues.py"
module_spec = importlib.util.spec_from_file_location("figma_cues_yt02", MODULE_PATH)
figma_cues = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(figma_cues)

WORDS_LIST = [
    {"turn": 0, "words": [{"w": "alpha", "t": 0.5}, {"w": "omega", "t": 2.5}]},
    {"turn": 1, "words": [{"w": "finish", "t": 1.0}]},
]
MANIFEST = {"turns": [
    {"turn_index": 0, "start_ms": 1000, "end_ms": 4000},
    {"turn_index": 1, "start_ms": 4000, "end_ms": 6000},
]}
WORDS = {entry["turn"]: entry for entry in WORDS_LIST}
TURNS = MANIFEST["turns"]
BY_INDEX = {turn["turn_index"]: turn for turn in TURNS}


def test_subtree_flag_is_emitted():
    scene = {"frame": "frame", "turns": [0], "beats": [
        {"node": "panel", "turn": 0, "word": "alpha", "lead": 0, "subtree": True}
    ]}
    result = figma_cues.compute_scene(scene, WORDS, TURNS, BY_INDEX)
    assert result["beats"] == [{"node": "panel", "at": 0.5, "subtree": True}]


def test_until_resolves_a_second_word_cue():
    scene = {"frame": "frame", "turns": [0, 1], "beats": [
        {"node": "needle", "turn": 0, "word": "alpha", "lead": 0,
         "until": {"turn": 1, "word": "finish", "lead": 0}}
    ]}
    result = figma_cues.compute_scene(scene, WORDS, TURNS, BY_INDEX)
    assert result["beats"] == [{"node": "needle", "at": 0.5, "until": 4.0}]


def test_after_resolves_forward_reference_and_gap():
    scene = {"frame": "frame", "turns": [0], "beats": [
        {"node": "second", "after": "first", "gap": 0.6},
        {"node": "first", "turn": 0, "word": "alpha", "lead": 0},
    ]}
    result = figma_cues.compute_scene(scene, WORDS, TURNS, BY_INDEX)
    assert {beat["node"]: beat["at"] for beat in result["beats"]} == {
        "first": 0.5, "second": 1.1
    }


@pytest.mark.skipif(shutil.which("node") is None, reason="node is not installed")
def test_js_shifts_subtree_and_scales_named_node_to_until(tmp_path):
    scene = {"frame": "frame", "start": 0, "duration": 6, "beats": [
        {"node": "panel", "at": 1, "until": 5, "subtree": True}
    ]}
    script = figma_cues.render_js([scene])
    harness = script.replace(
        'const CUES = [{"node": "panel", "at": 1, "until": 5, "subtree": true}];',
        'const CUES = [{"node": "panel", "at": 1, "until": 5, "subtree": true}];'
    )
    prelude = r'''
const child = {id:"child", name:"child", animationStyles:[], manualKeyframeTracks:{X:{keyframes:[{timelinePosition:1},{timelinePosition:2}]}}};
const panel = {id:"panel", name:"panel", animationStyles:[{timelineOffset:2,props:{delay:2,duration:2}}], manualKeyframeTracks:{}, timelines:[{id:"tl"}], findAll:()=>[child], async setTimelineDuration(id,d){this.duration=d;}};
const targetFrame = {name:"frame", children:[panel], findOne:fn=>fn(panel)?panel:null};
const figma = {currentPage:{findOne:fn=>fn(targetFrame)?targetFrame:null}};
const run = async()=>{
'''
    ending = r'''
};
const result=await run();
process.stdout.write(JSON.stringify({result,panel,child}));
'''
    path = tmp_path / "run.mjs"
    path.write_text(prelude + harness + ending)
    process = subprocess.run(["node", str(path)], capture_output=True, text=True)
    assert process.returncode == 0, process.stderr
    output = json.loads(process.stdout)
    assert [keyframe["timelinePosition"] for keyframe in output["child"]["manualKeyframeTracks"]["X"]["keyframes"]] == [1, 2]
    style = output["panel"]["animationStyles"][0]
    assert style["timelineOffset"] == 1
    assert style["props"]["duration"] == 4
    assert output["result"]["mutatedNodeIds"] == ["panel", "child"]
