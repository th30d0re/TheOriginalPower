# Codex prompt: audit and fix picture/narration sync in the YT02v2 preview

Run from the repo root, outside any sandbox (manimgx renders need Metal):

```bash
codex exec -m gpt-5.6-sol -s danger-full-access -C /Users/emmanuel/Documents/Theory/TheOriginalPower "Carry out Architecting_the_operation/video/yt02/CODEX_SYNC_AUDIT_PROMPT.md exactly." < /dev/null > Architecting_the_operation/video/yt02/logs/sync_audit.codex.out 2>&1
```

---

## Rules
- **Never run git.** Leave every change uncommitted for the author to review.
- Edit only:
  - `Architecting_the_operation/video/YT02v2_shotlist.md` (its `Render:` and `Holds:` lines);
  - `Architecting_the_operation/video/yt02/*.py`;
  - files under `outputs/YT02V2/`.
- Write the report to `Architecting_the_operation/video/yt02/logs/sync_audit.md`.
- Never edit `Paper/`, the script, the audio, or `yt01_redefining_racism/` scene files.
- On-screen text follows the house rules:
  - no formulaic antithesis;
  - "cannabis";
  - "tiers".

## The problem (the author's report)
In the preview `outputs/YT02V2/video/preview/960x540/YT02v2_preview1.mp4`, the picture runs out of step with the
words. Example: while the narration is still on what bias, prejudice and discrimination *share in common*
(script line ~241, shot S01-37), the screen already shows the "-ism" suffix / logical boundary of the term. The
author reports that the timing is off throughout.

## Already verified (do not re-litigate)
- The audio and video streams are the same length (6829.4 s).
- Every shot's `Anchor` timestamp matches its recorded turn start within 20 s.
- The cut assigns shot i to turn i of `outputs/YT02V2/episode_manifest.json` (561 shots, 561 turns).

So the cut does not drift. The fault lies in **what each shot shows** and **when content appears inside a clip**.

## Likely causes (check each one)
1. **Wrong reused asset.** `YT02v2_shotlist.md` was written by reusing v1 ids by title. Card and scene names carry
   *v1* shot ids. For example, S01-37 renders `figma-card:cards/S01-33.json`, and that card's text may belong to a
   later idea, such as the "-ism" boundary.
   - Check: for each shot, compare the card JSON text (`Architecting_the_operation/video/yt02/cards/<id>.json`) or
     the scene's on-screen text with the words of that shot's turn.
2. **Stale internal timing in reused Figma clips.** The clips under `outputs/YT02/video/figma/` (symlinked into
   YT02V2) were exported to v1 run lengths, with item reveals cued to v1 words. `edit16x9.py` pads or trims them to the
   v2 run length, so the reveals land at v1 times.
   - Check: list each figma/figma-card run's v1 length (from the YT02 manifest and shot list) against its v2 length.
   - Flag: any run whose ratio falls outside 0.85–1.15, or whose items are revealed in a different word order in v2.
3. **Reused manim scenes cued to v1 words.** Shots with `as=<old id>` play v1 methods. In preview mode,
   `YT_LENIENT_CUES=1` moves every missing cue word to its turn midpoint (grep `preview cue` in
   `outputs/YT02v2/cut3.log`), so those elements appear at the wrong moment.
4. **Holds that span an idea change.** A run whose holds cross from one idea to the next keeps showing the first
   visual.

## Method
1. Build an audit table, one row per shot, with these columns:
   - shot id;
   - turn index and start time;
   - the first 15 words of the turn (from `outputs/YT02V2/words.json` or `edit16x9.py turns <seg> --only <id>`);
   - Render;
   - the on-screen text at the shot's midpoint. Extract the frame from the preview with ffmpeg and OCR it with
     `tesseract`. For a card, also read the card JSON.
   - a match verdict: **OK**, **WRONG ASSET**, **EARLY/LATE**, or **HOLD SPANS IDEAS**.

   Put the full table in the report. Start with SEG 01 (shots S01-30 to S01-48 include the author's example), then
   do every segment.
2. **Fix the WRONG ASSET rows.** Choose the card or scene whose content matches the turn. Search `yt02/cards/*.json`
   and the v1 shot list (`Architecting_the_operation/video/YT02_shotlist.md`) by content, not by id. If no existing
   asset matches, mark it NEEDS NEW CARD and leave the Render line unchanged.
3. **Fix the HOLD SPANS IDEAS rows.** Split the run so that the new idea gets its own primary, with the correct
   asset.
4. **Fix the EARLY/LATE rows.**
   - Manim scenes: replace v1 cue words with words actually spoken in the v2 turn that name each element. The
     render must pass **without** `YT_LENIENT_CUES`.
   - Figma clips: these cannot be re-exported here (Figma auth is pending). List them in the report with their v2
     beat words, and propose the cue edits in the format of `Architecting_the_operation/video/yt02/figma/scene_cues_yt02.json`.
     Write the proposals to `Architecting_the_operation/video/yt02/figma/scene_cues_yt02v2.proposed.json`, so the
     author can apply them once Figma is re-authorized.
5. **Re-render and re-cut** only the segments you changed:
   - render: `YT_PREVIEW_SLATE=1 YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render <segs> -r 960x540 --fps 15 -j 4`
   - cut: the same command with `cut` in place of `render`.
   - Then concatenate SEG00–SEG15 into `outputs/YT02V2/video/preview/960x540/YT02v2_preview2.mp4`, using the ffmpeg
     concat demuxer with `-c copy`, and confirm its duration is 6829.4 s ± 0.5.

## Acceptance
- Re-run the step 1 audit on preview2. It reports no WRONG ASSET and no HOLD SPANS IDEAS row, except those marked
  NEEDS NEW CARD.
- No manim run relies on lenient cues: `grep -c "preview cue"` returns 0 for the runs you changed.
- `YT_EP=YT02v2 … edit16x9.py check` reports 0 problems.

The report ends with these counts:
- shots audited;
- rows fixed, by verdict;
- NEEDS NEW CARD shots;
- Figma cue proposals;
- shots still slated or placeholder (currently S02-06, S03-04, S03-08, S03-09, S03-11, S03-13..15, S06-07..12,
  S10-29, S10-43..44, S14-12).

Adapt those 18 shots to their v2 runs as well, if the time allows. Their aliased v1 methods index holds that the v2
runs do not have.
