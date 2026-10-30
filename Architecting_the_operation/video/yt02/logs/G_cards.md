# G_cards — card and table pictures (G1, G8, G13, G24, G28 + subscripts everywhere)

Figma file `6SPd7rWzwyvxHhIj4Cmb7a`, Cards page `64:3`. All G frames sit at slots 270+ (y ≥ 63000), named `g card <stem>@<primary>`, so no existing frame was touched. Clips are `outputs/YT02V2/video/figma/g-card-*.mp4` (1920×1080, 30 fps, via `fetch_clip.sh`). The Figma export link for each lives 24 h; the files are already local.

## Builder change (shared by every card)

`figma/card_builder.js` and the stored builder layer `64:2` carry the same patch (`figma/card_builder_patch_g.js`, applied locally by `figma/apply_g_patch.js`):

- **Real subscripts.** Any `X_abc` in card text becomes base text plus a smaller (0.62×) run lowered below the baseline. Figma has no per-range baseline or subscript setter (`textCase` rejects SUBSCRIPT, `openTypeFeatures` is whole-node and read-only). The builder therefore lays each text out as a wrapping auto-layout of word frames and positions the subscript run inside the word. `fit`/`cap` shrink these frames like plain text. Greek letters, `⁺ ⁻` superscripts, combining marks (d̂) and `O_adjacent,1` are handled; file names such as `x.py` are skipped.
- **Table columns.** `colWeights` per card, header cells fit-to-row and centered vertically.
- **Timeline `span`.** `{from,to,at,label}` draws a bracket under steps from..to, revealed at reveal index `at`.
- Card specs for this pass: `figma/g_cards.py` → `figma/v2/g_cards.json` (OV timings from `episode_manifest.json` / `words.json`; beats are seconds from the run's first turn).

## Items

| Item | Card JSON | Figma node | Clip | Screenshot check |
|---|---|---|---|---|
| G1 (turn 72) | new `cards/g-S02-07.json` ("Step 1 · Institutionalize": formal institutionalization → private attitudes → self-perpetuating apparatus serving Elite interests; reveals on those words) | `143:21747` | `g-card-s02-07@s02-07.mp4` (9.7 s) | viewed |
| G8 | `cards/S06-13.json`: added `colWeights [0.16,0.31,0.53]`; header row now fits and centers ("Testable Archival / Quantitative Claim" sits on one line, every row fits) | `143:21944` | `g-card-s06-13@s04-13.mp4` (76.7 s, turns 108–112) | viewed |
| G13 (turn 182) | `cards/S03-39.json` and `cards/S03-43.json` unchanged; builder renders `X⁺_α`, `X⁻_α`, `I_buffer` with real subscripts | `143:23406` (S03-39), `143:23626` (S03-43) | `g-card-s03-39@s06-36.mp4` (36.1 s), `g-card-s03-43@s06-40.mp4` (46.9 s, turns 184–187 only, see G1 table) | viewed |
| G28 (turn 327) | `cards/v2/v2-S09-43.json` unchanged; `L_white`, `L_black`, `I_buffer`, `O_racialized` now subscripted (also fixed a collapsed-detail bug in the first build) | `143:23862` | `g-card-v2-s09-43@s09-43.mp4` (48.9 s) | viewed |
| G24 (turn 247) | `cards/S07-33.json`: six steps (1441 raid · 1444 syndicate and Lagos · 1452 Dum Diversas · 1453 Zurara completes · Order of Christ · 1486), plus `span` bracket "1441–1453 · Extraction before ideology". Dates reveal on the spoken "fourteen …" words; the span appears just after "fifty-three"; steps 5 and 6 appear on turns 248 and 249 | `143:22853` | `g-card-s07-33@s08-33.mp4` (45.5 s) | frames at 8 s, 12 s, 22 s extracted and viewed |

Frames for every other card with subscripts were also rebuilt (no export, the orchestrator re-exports only the ones it keeps): S02-16 `143:24402`, S03-17 `143:24648`, v2-S06-19 `143:24995`, v2-S06-24 `143:25194`, v2-S06-30 `143:25401`, S08-16 `143:25676`, S08-32 `143:25907`, S08-48 `143:26138`, v2-S11-17 `143:26398`, v2-S13-01 `143:26623`, S13-09 `143:26901`, S13-24 `143:27153`, S13-20 `143:27397`. Viewed: S03-17, v2-S06-30, S13-24. In `cards/S13-20.json` the bogus `M_agnitude` became the plain word `Magnitude`. `P_uppet` and `F_enforce` are the book's notation (`P_{\mathrm{uppet}}`) and now render as subscripts. `S08-06`, `S10-25`, `v2-S11-06`, `v2-S11-38` only match because of `"kind": "stat_bars"` and need nothing.

## Proposed OV shot-list changes (key by turn_id + spoken text)

1. **Turn 72, `efe6af7b824b3692`** "Through formal institutionalization, that system transforms private attitudes into a self-perpetuating apparatus…": Render `figma-card:cards/g-S02-07.json` (clip `g-card-s02-07@s02-07.mp4`). Replaces `cards/S02-13.json`. (Option without a new clip: hold S13-06, which already shows the same sentence at turn 543.)
2. **Turn 247 `058e7216b599cade`** "Check the dates against Prediction 1 …": Render stays `cards/S07-33.json`; the run (247–249) now uses `g-card-s07-33@s08-33.mp4`.
3. **Turns 108–112** (first turn "Because Equation two point six is an empirical hypothesis, it generates four concrete predictions"): use `g-card-s06-13@s04-13.mp4`.
4. **Turn 180–182** (first "Table two point one, titled the Set-Resolution Ladder"): use `g-card-s03-39@s06-36.mp4`.
5. **Turns 184–187** (first `f596cbf44a15ea0e` "Whenever a public argument stalls in confusion"): use `g-card-s03-43@s06-40.mp4`. The current run holds this card through 193, which is a mismatch (G1 table).
6. **Turns 326–329** (first "Step four completed the installation in October seventeen oh-five"): use `g-card-v2-s09-43@s09-43.mp4`.

## G1 mismatch table (OV shot list, figma-card runs checked against their narration)

Runs checked: all 120+ `figma-card` runs. "Run" = consecutive turns sharing one Render. Everything else matched (card topic = spoken topic).

| Turns (first turn_id) | Card on screen | What is spoken | Verdict | Proposed card |
|---|---|---|---|---|
| 72 `efe6af7b824b3692` | `S02-13` Eq 4.2 / Eq 2.1 boundary | formal institutionalization turns attitudes into an apparatus | **Wrong** (G1) | `g-S02-07` (built) |
| 188–193 `a308534b47be174c` … `ea7174ba77385db6` | `S03-43` public-debate stall points (run 184–193) | Why in-group/out-group are insufficient; the tier build-up 2 → 3 → 4 → 5 tiers; "Build the cone" | **Wrong** for 188–193 (the card matches only 184–187) | New "Tier refinement ladder" card, five reveals: 2 tiers (I, O) · 3 tiers (Elite apex) · 4 tiers (Puppet) · 5 tiers (Enforcement), then the cone. Not built; the cone shot for 193 and the G10 reorder will change this run, so the orchestrator should say where 188–192 land before I build it. |
| 338–342 `4966d617267f45ec` … `1a8b00ba21498d95` | `S08-48` Virginia compile verdict (run 333–342) | Du Bois wage, status/material channels, wage as a complex pair, phasor (G30/G31 territory) | **Wrong** for 338–342 (card covers 333–337) | Complex-wage Figma explainer from the other session (G30). Until then end the S08-48 run at 337. |
| 585–596 `f72831566864e0b5` … `fc3271fc519aac95` | `S14-16` Concession Theorem falsification protocol (run 579–597) | wetware substrate, Tajfel Bristol, epistemic architecture, RLC hardware layer, impulses, resonance | **Wrong**; the card matches only 579–584 | 585–588: `S01-10` (Biological Host Wetware) or a Tajfel card; 589–596: `S02-23` (Feedback and RLC damping) or the new Figma RLC explainer (G11); 597 `44639ad97724b7d6` "For the full architecture … read the open-access manuscript": `S14-22` |
| 32–38 `…` ("Computer science uses the same word in two distinct registers" … Pi-sub-race, maternal mortality) | `S01-14` Construct 1 · Evaluative Bias (explicit/implicit) | predictive coding, ML bias term, installed prior Π_race, medical-system wariness | Weak (same topic, different content) | Optional: card with Π_race prior vs. bias term vs. maternal-mortality example |
| 509–535 `2f6c2b389735ba0c` | `v2-S13-01` Interference Engine (27 turns, 6 reveals) | Madison, Fed. 10, Kirchhoff, Eq 22.1/22.2, DFT tables 22.1/22.2 | Weak (one card across 27 turns; reveal times keyed by `revealTurns`) | Split into 3 runs: Madison/jammer (509–519), phase-loading Eq 22.1–22.2 (520–525), DFT tables (526–535); the DFT tables should be graphed (R4) |
| 281–287 `…` (Virginia opening: Point Comfort, no white tier, Chesapeake servants) | `S08-01` Segment 08 intro | historical narrative 284–287 | Weak | Hold is acceptable; a Point Comfort / Chesapeake card would be better |

Checked and fine: 0–62, 63–71, 73–127 (apart from 72), 129–183, 215–280, 288–332, 333–337, 403–462, 536–578, 598–599.

## Notes

- No antithesis on any new card text.
- The first build of the Eq 2.4 / S09-43 timeline showed collapsed detail text. Cause: `resize()` after the sizing modes reset the frame to FIXED height. Fixed in the builder; the exported S09-43 clip is from the fixed build.
- I did not edit the podcast script, shot lists, `Paper/`, `scriptcast.toml`, `phasor_builder.js`, cone/manim files or `runs/`. Nothing is committed. Files changed or added by this pass: `figma/card_builder.js`, `figma/card_builder_patch_g.js`, `figma/apply_g_patch.js`, `figma/g_cards.py`, `figma/v2/g_cards.json`, `cards/S06-13.json`, `cards/S07-33.json`, `cards/S13-20.json`, `cards/g-S02-07.json`, this log.
