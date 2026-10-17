# Brief: `figma_cues.py`, word-cued timing for Figma scenes

**Never run git. Do not touch `Paper/`. Write only the files named under "Deliver".**

## Why

YT02 goes hybrid: Figma for slides and cards, manimgx for equations and set diagrams. Figma
timelines are in seconds, while every manimgx beat is cued on a spoken word
(`self.at(k, "word", nth=)`). This tool converts word cues into Figma timeline seconds and
emits a script that retimes a Figma frame's animations to them.

## Inputs (formats already in use; see `outputs/YT01/` for real examples)

- `words.json`: list indexed by global turn: `{"turn", "turn_id", "text", "words": [{"w", "t"}]}`,
  where `t` is seconds from the turn's start.
- `episode_manifest.json`: `{"turns": [{"turn_index", "start_ms", "end_ms", ...}]}`.
- A cue spec you define, JSON, one entry per Figma frame:

```json
{
  "words": "outputs/YT02/words.json",
  "manifest": "outputs/YT02/episode_manifest.json",
  "scenes": [
    {"frame": "02 · Dictionary order", "turns": [3, 4, 5],
     "beats": [{"node": "bar 1", "turn": 0, "word": "prejudice"},
               {"node": "bar 2", "turn": 1, "word": "superiority", "nth": 0, "lead": 0.1}]}
  ]
}
```

## Rules (match manimgx exactly; see `yt01_redefining_racism/manim/common16x9.py`, `_norm` and `Timing.cue`)

- `turn` in a beat is the index into that scene's `turns` list (like `self.at(k, …)`).
- Word match: `_norm(w).startswith(_norm(word))`, with `_norm` = lowercase, keep `[a-z0-9]` only;
  `nth` picks the occurrence (default 0); `lead` defaults to 0.1 s.
- Beat time = turn start + word `t` − lead, floored at that turn's start, then made relative to
  the scene start (start of the scene's first turn).
- Scene duration = the next turn's `start_ms` after the scene's last turn, minus the scene start
  (the end of the last turn if it is the final turn).
- A missing word is an error naming the scene, the node, the turn and the words that turn has.

## Outputs

1. `--json out.json`: per scene, its absolute start, duration, and each beat's `node` and `at` (s).
2. `--js out.js`: one script per scene for Figma's `use_figma` tool (Plugin API, top-level
   `await`, ends in `return {...}`; no `figma.closePlugin`, no `figma.notify`, no console output).
   For the frame found by name on the current page:
   - find each beat's node by name among the frame's descendants (`frame.findOne(n => n.name === …)`);
   - shift that node's motion so its **earliest** start lands on `at`, keeping its internal spacing:
     every entry of `node.animationStyles` gets `timelineOffset += delta` (reassign the array with
     spread copies; keep `id`, `styleId`, `props`), and every keyframe in
     `node.manualKeyframeTracks` (including nested `fills`/`strokes`/`effects` tracks keyed by
     index) gets `timelinePosition += delta`;
   - set the frame timeline to the scene duration: `const [tl] = node.timelines;
     node.setTimelineDuration(tl.id, duration)` (it may lengthen or shorten here; this is the point);
   - return `{ mutatedNodeIds, missing: [names], beats: [{node, before, after}] }`; missing nodes
     are reported in `missing`, never thrown.

## Deliver

- `Architecting_the_operation/video/yt02/figma_cues.py` (stdlib only; `python3 figma_cues.py spec.json --json … --js …`)
- `Architecting_the_operation/video/yt02/cues_example.json`: a spec against the real YT01 data
  (turns 0–2, a few beats) that runs cleanly.
- `tests/test_figma_cues.py`: pytest with small synthetic words/manifest fixtures covering match by
  prefix, `nth`, the lead floor, scene duration (middle and final turn), the missing-word error,
  and that the JS contains the computed offsets. Run `python3 -m pytest tests/test_figma_cues.py`.
- A short usage section appended to `Architecting_the_operation/video/yt02/FIGMA_TEST_first5min.md`.
