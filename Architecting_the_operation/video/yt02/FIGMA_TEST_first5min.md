# YT02 · Figma test: first five minutes (SEG 00 and the opening of SEG 01)

A visual test: can Figma's motion tools beat the manimgx cards on slides and motion? Equations
stay in manimgx either way. Each scene below is one 1920×1080 Figma frame with its own timeline.
The look matches YT01: background `#0F1B33`, panel `#16264A`, ink `#F4EAD2`, dim `#9FB0CF`,
gold `#D9A441`, In-group blue `#5FA8D3`, Out-group red `#E2573F`. Type: Noto Sans (Inter as a
fallback).

Narration beats follow `notes/YT02_outline.md`. Provenance tags as in the outline.

| # | Time | Narration beat | On screen | Motion |
|---|------|----------------|-----------|--------|
| 1 | 0:00–0:20 | "What is racism? Most answers start in the dictionary." | Title **What Racism Is**, subtitle *Architecting the Operation · Part 2* | Title types in word by word (text stagger); gold rule draws left to right under it; subtitle fades up 0.4 s later |
| 2 | 0:20–1:10 | The conventional dictionary order: prejudice or discrimination first, belief in superiority second, systemic racism third "if present at all" [book §2.2] | Three stacked definition bars numbered 1, 2, 3. Bar 3 is smaller, dim, with the tag *if present at all* | Bars rise in one at a time on their names; bar 3 arrives late and at half opacity; a soft spotlight settles on bar 1 |
| 3 | 1:10–2:00 | "That order encodes a causal theory." Prejudice → discriminatory actions → systemic outcomes (Equation 2.5) [book Eq 2.5] | The three bars reflow into a left-to-right chain joined by arrows; *Equation 2.5* label under the chain | Bars slide and shrink into a row; arrows draw between them in sequence; the label fades in last |
| 4 | 2:00–2:30 | "Before we test it, we need precise terms. The book now defines three." [book Preface; §2.2] | Three cards side by side: **Bias**, **Prejudice**, **Discrimination** | Cards flip up in a stagger, 0.15 s apart |
| 5 | 2:30–3:20 | Thinking, feeling, behavior: the stereotype/prejudice/discrimination split [Fiske 1998] | Under each card a component label: *thinking* (stereotype), *feeling* (prejudice), *behavior* (discrimination) | Labels drop in under their cards on the words; a thin bracket spans all three with *interpersonal* |
| 6 | 3:20–4:10 | Prejudice: antipathy grounded in an erroneous generalization held rigidly [Allport 1954, p. 9] | The Prejudice card expands to fill the frame; the definition sets in ink with *erroneous generalization* and *held rigidly* in gold; citation strip at the bottom | Card scales up from its row position; phrase highlights sweep in on the spoken words |
| 7 | 4:10–4:45 | Bias, and implicit bias: past experience shaping responses outside awareness [Greenwald & Banaji 1995] | Bias card expands; a faint *awareness* line runs across it, and the word *implicit* sits below the line | The line draws; *implicit* slides under it and dims |
| 8 | 4:45–5:00 | Discrimination is behavior; all three run in any direction between any groups. Racism is the system that weaponizes them [book §2.2] | The three cards return to a row; four arrows between them point both ways; then a large frame labelled **system** draws around all three | Arrows pulse both ways; the system frame draws its stroke around the row (path trim) |

## What the test measures

- Image quality of type, panels and easing against the manimgx cards (YT01 SEG 12 cards are the comparison).
- Workflow: how long one scene takes, and whether word-cued timing survives (Figma timelines are in
  seconds, so cues must be converted from `words.json` per turn).
- Export: `export_video` returns MP4 per frame. Each scene would be conformed into the edit as an
  `ext:` Render target, the same way the EffectCraft clip is.

## Result (2026-10-17)

Figma file: https://www.figma.com/design/RLwN5ZVKuDJBHIti52FwEE (8 frames, one per scene).
Reel: `outputs/YT02/figma_test/YT02_figma_test_reel.mp4` (77 s, 1920×1080, 30 fps, silent,
placeholder timings; the real cut would cue each beat from `words.json`).

- **Quality.** Type, panels and easing render cleanly at 1080p. Slide, scale, fade, path-draw
  arrows and stroke-color changes all export as built.
- **Limit: text stagger.** The native word-by-word reveal (`TextStagger`) exports as a whole-layer
  fade. Per-word reveals would need one text node per phrase.
- **Limit: math.** No equation typesetting; equations stay in manimgx, as planned.
- **Limit: export.** Server-side render, at most ~6 exports at once, links expire (set to 24 h).
- **Workflow.** All 8 scenes built in two scripted calls; edits are visual in Figma afterwards,
  which manimgx cannot offer. Timing is in seconds, so a small converter from `words.json`
  would be needed to cue beats on spoken words.

## Cueing frames from `words.json` (`figma_cues.py`)

`figma_cues.py` is that converter. It reads a cue spec — one entry per Figma frame, naming the
global turns the scene covers and one beat per node — and emits the scene timings plus a
retiming script per scene:

```bash
python3 Architecting_the_operation/video/yt02/figma_cues.py \
    Architecting_the_operation/video/yt02/cues_example.json \
    --json /tmp/cues.json --js /tmp/cues.js
```

- Beat rules match manimgx (`self.at(k, "word", nth=, lead=)`): `turn` indexes the scene's
  `turns` list, the word matches by normalized prefix, `nth` picks the occurrence (default 0),
  and `lead` (default 0.1 s) pulls the motion ahead of the word, floored at the turn start.
  Beat times come out relative to the scene start; scene duration runs to the next turn's start
  (the last turn's own end when the scene closes the episode).
- `--json` records each scene's absolute start, duration, and every beat's `node` and `at` in
  seconds.
- `--js` writes one Plugin API script per scene, for the `use_figma` tool. Run it on the page
  that holds the frame: it finds each beat node by name, shifts the node's motion so its
  earliest start lands on `at`, and sets the scene duration on the first beat node's timeline.
  Missing nodes come back in `missing`; the script never throws for them.
- Animation styles store their start twice, as `timelineOffset` and `props.delay`, and Figma
  keeps `props.delay`. The scripts shift both, falling back to `timelineOffset` when `delay`
  is absent; CUSTOM entries (no `props`) shift on `timelineOffset` alone.
- A cue word that the turn does not contain is a hard error naming the scene, the node, the
  turn, and the words that turn has.

`cues_example.json` times the `02 · Dictionary order` frame against YT01 turns 0–2 (bar 1 on
"prejudice", bar 2 on "superiority", bar 3 on "systemic", tag 3 on "appears"). Tests live in
`tests/test_figma_cues.py` (`python3 -m pytest tests/test_figma_cues.py`).
