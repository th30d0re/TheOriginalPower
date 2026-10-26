# Brief (Codex): turn 18 card-like manim runs in YT02v2 into Figma cards

The author wants these runs shown as Figma cards (the house card style, with the circuit border) in place of the YT01-style
manim scenes. You author the card JSON and the build payloads. Claude runs the Figma build and export afterwards (you have
no Figma access).

Run:
```bash
codex exec -m gpt-5.6-sol -s danger-full-access -C /Users/emmanuel/Documents/Theory/TheOriginalPower "Carry out Architecting_the_operation/video/yt02/FIGMA_V2_MANIM_TO_CARDS_BRIEF.md exactly." < /dev/null > Architecting_the_operation/video/yt02/logs/manim_to_cards.codex.out 2>&1
```

## Rules
- **Never run git.** Leave every change uncommitted.
- Write only:
  - `Architecting_the_operation/video/yt02/cards/v2/*.json`;
  - files under `Architecting_the_operation/video/yt02/figma/v2/`;
  - `card_beats_v2.py`;
  - the 18 runs' blocks in `Architecting_the_operation/video/YT02v2_shotlist.md`.
- Never edit `Paper/`, the script, the audio, any manim scene, `common16x9.py` or `edit16x9.py`.
- **On-screen text rules:**
  - direct, declarative phrasing, with no formulaic antithesis ("not X but Y", "more than just");
  - "cannabis";
  - "tiers", never "jobs";
  - the 3-D model is a **cone**;
  - disjoint union is `\dot{\cup}` (∪̇), never ⊔ or `\sqcup`;
  - the phasor convention is ψ_m positive downward, extraction upward, ψ_s to the right.

## The 18 runs (v2 primary ids)
S03-10, S04-04, S05-11, S06-08, S06-19, S06-24, S06-30, S06-39, S08-43, S08-48, S09-43, S11-06, S11-11, S11-17, S11-38,
S13-01, S14-01, S15-11.

For each, find its current Render line in the shot list (a manim scene and method), read that method's source to see what
it shows, and read the narration of every turn in the run:

```
YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns <seg>
```

## Steps
1. **Card JSON.** Write one card per run: `yt02/cards/v2/v2-<primary>.json`.
   - **Stems.** The stem `v2-<primary>` is the asset key; never reuse an existing stem.
   - **Kinds.** Use the kinds and fields that `yt02/figma/card_builder.js` supports, modelled on existing cards in
     `yt02/cards/`:
     - `title` (items with title and detail);
     - `quote` (quote, attribution);
     - `equation` (`latex`, `number`, `terms[{latex, gloss}]`);
     - `timeline`;
     - `table` (columns, `items[{cells}]`);
     - `stat_bars`;
     - `compare`;
     - `source`.

     Read `card_builder.js` to see how each kind lays out and how many items fit.
   - **Content.** Each card shows what the manim scene showed (headline, labels, values, equation), in card form. Its
     items must reveal in the order the narration introduces them: the builder reveals item i on turn i, and the last
     item absorbs any extra turns. Keep 2–6 items per card.
   - **Numbers and equations.** Take every number and equation from the manim source or the narration. Invent nothing.
   - **Data shots.** Use `stat_bars` or `table` with the real series values:
     - S11-06: cotton revenue and the patrol ratio;
     - S11-38: the four backlash series;
     - S08-43: the cline variance;
     - S13-01: the Φ_load and coherence values.
   - **Sources.** Each card gets a `sources` line naming The Original Power chapter and section, plus any cited
     author, as the existing cards do.
2. **Shot list.** For each run, the primary's Render becomes ``figma-card:cards/v2/v2-<primary>.json`` and its Type becomes
   `card`. Each hold's Render becomes the same, keeping its Holds. Rewrite each Note to describe the card. Leave Anchors
   unchanged.
3. **Beats.** Extend `card_beats_v2.py` so it handles card paths with subfolders (stem = file stem) and counts 119 card
   runs. Regenerate `figma/v2/cards_v2.json`.
4. **Assets.** Run `card_prep.py` over the new equation cards with `--assets figma/v2/assets_new`. Write the
   asset-manifest entries for those cards only to `figma/v2/new_assets.json`, then check each SVG renders.
5. **Payloads.** Write the 18 new cards (text-only, with `frame = "card v2 <primary>"`, `beats`, `duration` and the
   `hasLatex` / `hasQr` flags from `card_prep`) into `figma/v2/build_new_01.js` …, 6 per file, in the same format as
   `build_01.js`, with `ORIGIN` continuing from 102.
5. **Export list.** Append 18 rows to `figma/v2/export_list.json`:
   - `frame`: `card v2 <primary>`;
   - `primary`;
   - `target`: `card-v2-<primary lowercased>@<primary lowercased>.mp4`;
   - `nodeId`: null (Claude fills it after the build).

## Acceptance
- `YT_EP=YT02v2 … edit16x9.py check` reports 0 problems. Until the clips exist, a missing-clip warning for these 18 is
  expected; list them.
- Grep the new card text for "pyramid", "⊔", "sqcup" and "not merely". All must return 0.
- Report in `yt02/logs/manim_to_cards.md`: per run, its card kind, item count, turn count, and one line on what it shows.
