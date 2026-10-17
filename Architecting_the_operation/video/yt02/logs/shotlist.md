# YT02 Shot-List Production Log

Model: Codex (GPT-5)

## What Was Requested

Create one ordered shot for every turn in `podcasts/YT02_what_racism_is.md`, route each shot to a Figma card, an existing Figma frame, or a Manim scene, create every primary-card JSON file, and provide complete scene and frame inventories.

The source script contains 15 segments and 526 turns. The completed shot list is `video/YT02_shotlist.md`.

## What I Did

1. Read the script, outline, YT01 shot-list model, representative YT01 card files, relevant YT01 Manim docstrings, and the SEG 11 dashboard specification.
2. Created 526 ordered shot records with IDs from `S00-01` through `S14-24`.
3. Preserved every script header verbatim as its shot anchor.
4. Assigned 46 primary Figma cards and created 46 matching JSON files in `video/yt02/cards/`.
5. Assigned the SEG 04 orthographic frame and every specified SEG 11 dashboard frame.
6. Reused 12 existing Manim file/class pairs for matching set, causal, historical, and hierarchy material.
7. Specified `yt02/wage_phasor.py:WagePhasor` and `yt02/interference_engine.py:InterferenceEngine`, including turn-keyed beats and rendered equations in LaTeX.
8. Added an end inventory with counts by shot type, counts by render target, every Manim scene, and every Figma frame.

## Counts

### By segment

| Segment | Shots |
|---|---:|
| S00 | 13 |
| S01 | 43 |
| S02 | 26 |
| S03 | 46 |
| S04 | 17 |
| S05 | 18 |
| S06 | 21 |
| S07 | 65 |
| S08 | 51 |
| S09 | 42 |
| S10 | 58 |
| S11 | 45 |
| S12 | 27 |
| S13 | 30 |
| S14 | 24 |
| **Total** | **526** |

### By shot type

| Type | Count |
|---|---:|
| card | 46 |
| diagram | 16 |
| hold | 446 |
| scene | 18 |
| **Total** | **526** |

### By render family

| Family | Shots |
|---|---:|
| Figma cards | 206 |
| Figma frames | 62 |
| Manim scenes | 258 |
| **Total** | **526** |

The shot-list inventory gives the count for each of the 78 distinct render targets.

## Grounding Status

Every turn is grounded in the provenance comment attached to its script turn. Card source fields preserve the script's section, equation, figure, table, page, or line locator. Page ranges appear wherever the script supplies them. Every source locator originates in the script.

Ungrounded turns: 0.

Two production files remain specified assets: `yt02/wage_phasor.py` and `yt02/interference_engine.py`. This task requested their scene specifications in the inventory. Their implementation falls outside the brief's permitted write paths.

## Challenges Encountered

1. The transition at `S10-49` began a card block immediately after a reused Manim run. The first generation pass omitted that JSON file. I added `S10-49.json` and confirmed complete card-target parity.
2. SEG 11 introduces nine instruments across turns 3 through 14. I aligned frame changes with the instrument narration and retained holds within the System Stress and Wage Phasor introductions.
3. Existing YT01 scenes use YT01 timing cues. The inventory records their conceptual reuse targets; production retiming belongs in the later scene-build stage.

## Validation Output

```text
SHOTS=526 UNIQUE=526 IDS_MATCH=True ANCHORS_MATCH=True
HOLD_ERRORS 0
TYPE_COUNTS {'card': 46, 'diagram': 16, 'hold': 446, 'scene': 18}
RENDER_TARGETS 78
CARD_TARGETS=46 CARD_FILES=46 CARD_PARITY=True
JSON_SCHEMA_ERRORS 0
REUSED_MANIM_MISSING []
FIGMA_REQUIRED_PRESENT True
INVENTORY_RENDER_MATCH True
check-antithesis: no banned constructions found.
CARD_PROSE_CHECK=clean
```

The brief prohibited Git commands. The repository-wide `make check-prose` target inspects changes through Git, so it was omitted. The required direct checker ran on the shot list and every card JSON file.

## Next Ideas (6 Ideas)

1. Implement the two new Manim scenes from the inventory beat tables.
2. Add a card-generator schema validator to the YT02 build pipeline.
3. Render a low-resolution animatic for timing review.
4. Add automated checks for Figma frame-name drift.
5. Verify card typography at the longest source locator and detail rows.
6. Add cue exports for focus-ring changes on every hold.
