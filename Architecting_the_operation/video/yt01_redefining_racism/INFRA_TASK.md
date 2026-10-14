# Infra task: 16:9 landscape support for YT01

**Never run git (no commit, add, checkout, stash, reset). The orchestrator commits after
review. Do not touch `Paper/`. Write only the files listed under "Owned files".**

Context: the Architecting the Operation pipeline renders vertical 1080×1920 reels. The
first YouTube video (see `BRIEF.md` in this folder, section "Visual system") needs the
same card language and the same manimgx math scenes in **1920×1080 landscape**. Vertical
output must keep working byte-for-byte as today.

## Part 1 — Remotion cards (repo `/Users/emmanuel/Documents/Theory/scriptCast/video`)

Today `src/safeZone.ts` hard-codes `WIDTH = 1080`, `HEIGHT = 1920` and Instagram safe
zones, and `Episode.tsx` places captions at a fixed `CAPTION_TOP = 1166`.

1. Add a layout notion with two values, `portrait` (current behaviour, default) and
   `landscape` (1920×1080). `EpisodePlan` already carries `width`/`height`; derive the
   layout from them. Landscape safe zone: 5% sides, 6% top, captions band in the bottom
   14%, no platform overlay reservations. Cards in landscape lay out wide: headline on
   top, body and art side by side where a card has art, QR bottom-right.
2. Every existing card (`TimelineCard`, `StatBarsCard`, `TitleCard`, `CompareCard`,
   `FreezeCallout`, `PartsCard`) renders correctly in both layouts. No text overflow at
   the longest JSON in `TheOriginalPower/Architecting_the_operation/video/cards_q9reply_v2/`.
3. Add three components, registered in `Root.tsx`, `Episode.tsx`'s `Card` union and
   `CardView`, each working in both layouts:
   - `EquationCard`: props `{headline, latex, number, terms: [{latex, gloss, color?}],
     reading, sources, qrUrl?}`. Renders the LaTeX with KaTeX (add `katex` as a
     dependency; render to HTML at build time, no network). Shows "Equation 2.7" style
     number, the equation large, then the term list (each term's LaTeX and its plain
     gloss), then `reading` (the sentence the equation says). Terms highlight in sequence
     over the card's duration so the narration can walk through them.
   - `QuoteCard`: props `{headline?, quote, speaker, work, year?, sources, qrUrl?}`.
   - `TableCard`: props `{headline, columns: string[], rows: string[][], latexCells?:
     boolean, sources}`; cells may contain inline LaTeX delimited by `$...$` when
     `latexCells` is true. Must fit a 4-row × 3-column table and a 6-row × 6-column
     table (the chapter's isomorphism table) legibly in landscape.
4. Add landscape compositions to `Root.tsx` for every card (ids suffixed `-16x9`) with
   default props, so each can be stilled with `npx remotion still`.
5. Acceptance (run these yourself and paste results in the findings file):
   - `npx tsc --noEmit` clean.
   - Existing check scripts in `scripts/` still pass (`check-copy`, `check-episode`,
     `check-quiver` as applicable — read each and run it the way it expects).
   - `npx remotion still` for every `-16x9` composition and for every existing portrait
     composition, written to `/private/tmp/claude-501/yt01_stills/`; open none of them,
     just confirm the files exist and report their dimensions.
   - Run the scriptCast python test suite from the repo root:
     `/Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest tests -q`
     and report the tail.

## Part 2 — manimgx landscape base (repo `/Users/emmanuel/Documents/Theory/TheOriginalPower`)

The vertical reels use `Architecting_the_operation/video/uef/common.py` (`UEFReel`,
`UEFReel3D`: timing from `outputs/<EP>/episode_manifest.json` turn starts and
`words.json` word timings; `cue(turn, word)`; `until(t)`; end card with QR).

1. Create `Architecting_the_operation/video/yt01_redefining_racism/manim/common16x9.py`
   with `YTScene` and `YTScene3D` that reuse that timing API but set 1920×1080
   (`frame_height = 8.0`, width follows 16:9). When the manifest for `EP` does not exist
   yet, fall back to placeholder timing (each turn 6 s, words evenly spaced) and log a
   warning, so scenes can be previewed before the voiceover is rendered. Turn indices in
   YT01 are segment-local: `cue(seg="03", turn=2, word="partition")`, resolved through
   the `<!-- SEG NN -->` markers in the script file
   `Architecting_the_operation/podcasts/YT01_what_racism_really_is.md` (parse it; the
   script may not exist yet, in which case placeholders apply).
2. Port `uef/orthographic.py` to
   `.../manim/orthographic16x9.py` (`class Orthographic16x9(YTScene3D)`) with the cone
   framed for landscape. Same tiers, colours, and camera moves; the in-group/out-group
   split, the stack reveal, the move under the Buffer looking straight up.
3. Acceptance: render a low-quality preview with placeholder timing and no audio:
   `.venv-manimgx/bin/manimgx render <file> Orthographic16x9 -r 960x540 --fps 15 -o
   /private/tmp/claude-501/yt01_stills/orthographic16x9_preview.mp4`. Report the
   command output tail and `ffprobe` dimensions.

## Owned files

- `scriptCast/video/src/**`, `scriptCast/video/package.json`, `package-lock.json`,
  `scriptCast/video/scripts/**` (only if a check needs a landscape case).
- `TheOriginalPower/Architecting_the_operation/video/yt01_redefining_racism/manim/**`.
- Findings: `TheOriginalPower/Architecting_the_operation/video/yt01_redefining_racism/logs/infra_findings.md`
  — what you changed, every acceptance command with its output tail, anything you could
  not do.
