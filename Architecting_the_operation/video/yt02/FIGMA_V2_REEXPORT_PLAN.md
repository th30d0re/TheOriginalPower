# YT02v2: re-export every Figma clip from the current frames, timed to the Phonon audio

Status (2026-10-24): planned, not started. The v2 cut still plays the v1 exports in
`outputs/YT02/video/figma/` from Oct 17–18. `outputs/YT02V2/video/figma` is a symlink to that folder.
Those exports predate three changes:
- the border-symmetry fix (component 3:119);
- the ∪-with-a-dot cards (S02-13, S03-12, S03-25, S03-30);
- the reversed phasor axis (intro 8 and the era wage panels).

They also carry v1 timing.

## Scope
- **101 card runs**: 85 card JSON files, 12 of them used by more than one v2 run. Every run gets its own frame,
  timed to that run.
- **17 dashboard scenes**: intro 1–9, assembly, and the eras 1486, 1676, 1704, 1894, 1968, 1994 and 2010.
  Each has one v2 run, S12-01 to S12-41.

## Pipeline (all pieces exist in `yt02/figma/`)
1. **Assets.** For the 4 union-glyph cards, run `card_prep.py` to regenerate their `.latex` SVGs. Upload them with
   the Figma MCP `upload_assets` and `upload_assets.py`; the assets page is "YT02 · Assets", keyed `<cardId>.latex`.
2. **Beats.** Write a v2 variant of `card_beats.py` that reads `YT02v2_shotlist.md` and
   `outputs/YT02v2/episode_manifest.json`. Emit one entry per run, keeping `id = <card stem>` (the asset key) and
   adding `frame = "card v2 <primary>"`.
3. **Build.** In `card_builder.js`, name the frame `card.frame || \`card ${card.id}\`` and remove an old frame only
   by that name, so the v1 frames stay. Run it through `use_figma` on a new page "YT02v2 · Cards", about 6 cards
   per call.
4. **Scenes.** Fix intro 8 and the era wage panels for the reversed axis: positive ψ_m points down, ψ_s points right.
   Then write a v2 cue spec for `../figma_cues.py`. Codex's `scene_cues_yt02v2.proposed.json` is unverified. Apply
   the generated JS per frame.
5. **Export.** Call `export_video` for each frame (at most about 6 at a time; poll with the `jobId`). Download each
   clip into a real `outputs/YT02V2/video/figma/` directory: replace the symlink with per-file links to the v1
   clips, then add the new ones.
6. **Editor.** Change `edit16x9.py`'s `external_source()` to prefer `card-<stem>@<primary>.mp4` when that file
   exists. The log-based staleness check already re-conforms runs whose source changed. Re-cut the preview.
