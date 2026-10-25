# Brief (Codex): local half of the YT02v2 Figma re-export

Context: `Architecting_the_operation/video/yt02/FIGMA_V2_REEXPORT_PLAN.md`. You have no Figma access. Claude runs
every Figma call (build, export, download) from the files you produce. Your job is to make those calls mechanical.

Run:
```bash
codex exec -m gpt-5.6-sol -s danger-full-access -C /Users/emmanuel/Documents/Theory/TheOriginalPower "Carry out Architecting_the_operation/video/yt02/FIGMA_V2_LOCAL_BRIEF.md exactly." < /dev/null > Architecting_the_operation/video/yt02/logs/figma_v2_local.codex.out 2>&1
```

## Rules
- **Never run git.** Leave every change uncommitted.
- Edit or create files only under `Architecting_the_operation/video/yt02/figma/`, plus `edit16x9.py` (step 5).
- Never touch `outputs/YT02/` (the v1 clips), `Paper/`, the scripts, the audio, or any v1 shot list.
- On-screen text: no formulaic antithesis.

## Inputs
- **v2 shot list:** `Architecting_the_operation/video/YT02v2_shotlist.md`. Parse it with `load_shots()` from
  `Architecting_the_operation/video/yt01_redefining_racism/manim/common16x9.py`, run with `YT_EP=YT02v2` under
  `.venv-manimgx/bin/python`.
- **v2 manifest:** `outputs/YT02v2/episode_manifest.json` (Phonon audio, final timings).
- **v2 words:** `outputs/YT02V2/words.json`.
- **Cards:** `Architecting_the_operation/video/yt02/cards/<stem>.json`.
- **Card tools:** `yt02/figma/card_prep.py`, `card_beats.py` and `card_builder.js`.

## Steps
1. **`card_beats_v2.py`.** Write it in the style of `card_beats.py`. For every v2 run whose primary renders
   `figma-card:cards/<stem>.json`, emit one entry:
   - the card JSON's fields;
   - `id = <stem>` (the asset key; keep it);
   - `frame = "card v2 <primary>"`;
   - `primary`;
   - `beats`: each turn's start in the run, minus the run start, plus 0.25 s;
   - `duration`: from the run start to the next shot's start, or to the episode end.

   Read the beat and duration times from the v2 manifest. Expect 101 entries; check the count. Write
   `yt02/figma/v2/cards_v2.json`.
2. **`card_builder.js`.**
   - Name the frame `card.frame || \`card ${card.id}\``.
   - Look up an old frame to remove by that same name, so building v2 frames never deletes a v1 `card <stem>` frame.
   - Change nothing else.
3. **Build payloads.** Run `card_prep.py` over every card stem the v2 runs use, with `--assets yt02/figma/v2/assets`.
   Then split `cards_v2.json` into batches of 6 and write `yt02/figma/v2/build_NN.js` for each batch. Each file is a
   complete `use_figma` script:
   - it defines `CARDS` (the batch, text-only, with `frame`, `beats` and `duration`);
   - `PAGE_ID` is looked up by page name "YT02v2 · Cards", created if missing;
   - `ORIGIN` is the batch's offset (batch index × 6);
   - then it contains the full builder source, wrapped so the script returns
     `[{frame, nodeId}]` for the frames it built.

   Also write `yt02/figma/v2/union_assets.json`: the asset-manifest entries for the four ∪-with-a-dot cards
   (S02-13, S03-12, S03-25, S03-30), whose `.latex` and `.term` SVGs must be re-uploaded before the build. Check
   that those SVGs render the dotted union (`\dot\cup`), not `\sqcup`.
4. **Scene cues.** Write `yt02/figma/v2/scene_cues_yt02v2.json` for the 17 dashboard frames: intro 1–9,
   assembly, and the eras 1486, 1676, 1704, 1894, 1968, 1994 and 2010.
   - Use the format of `yt02/figma/scene_cues_yt02.json`, with each frame's v2 run (S12-01 … S12-41).
   - Node names come from `yt02/figma/scene_nodes.json`. Cue each node on a word actually spoken in its v2 turn
     (check against `words.json`).
   - Start from Codex's earlier `scene_cues_yt02v2.proposed.json`, but verify every word.
   - Then run `../figma_cues.py` to emit `yt02/figma/v2/scene_cues_yt02v2.js` and
     `yt02/figma/v2/scene_timings_yt02v2.json`.
5. **Editor.** In `edit16x9.py`, `external_source()` for a `figma-card` shot returns
   `EP/video/figma/card-<stem>@<primary lowercased>.mp4` when that file exists; otherwise it returns the current
   path. Keep YT01 and YT02 behavior unchanged.
6. **Clip directory script.** Write `yt02/figma/v2/make_clip_dir.sh`. It replaces the symlink
   `outputs/YT02V2/video/figma` with a real directory holding one symlink per v1 clip, so that new exports land
   next to them without writing into `outputs/YT02/`. Do not run it.
7. **Export list.** Write `yt02/figma/v2/export_list.json`: one row per frame to export (101 cards and 17 scenes),
   with the target clip filename. Cards are `card-<stem>@<primary>.mp4`; scenes keep their current
   `figma_slug` name.

## Acceptance
- `python3 -c` loads every `build_NN.js` payload as text. Each defines `CARDS` with 6 or fewer entries, and the
  entries total 101.
- Each scene cue word exists in its turn in `words.json`. Write a small checker and include its output.
- `YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check`
  reports 0 problems.
- Report in `yt02/logs/figma_v2_local.md`: the files written, the counts, and any card or scene you could not
  prepare, with the reason.
