PASS: DESIGN AND TEXT PASS (Argon)
Checkpoint: {{HASH}} (clean)

# Brief: Question 9 — Bostopia reply. Make the ten portrait scenes read on a phone, and put the
# narration on screen: the speaker's key words appear as he says them, and the picture augments them.

Working directory: /Users/emmanuel/Documents/Theory/TheOriginalPower. The reel's scenes are in
Architecting_the_operation/video/q9_bostopia/stage/ (portrait 1080 × 1920, the Stage engine at
/Users/emmanuel/Documents/Theory/scriptCast-stage, which is read-only).

Read first:
- Architecting_the_operation/podcasts/q9_bostopia_reply_draft.md: the spoken script, the words that go
  on screen.
- Architecting_the_operation/video/q9_bostopia_reply_remotion_shotlist.md: what each shot shows, and
  what is recycled as an idea.
- Architecting_the_operation/video/q9_bostopia/FINDINGS_Q9_STAGE.md: what the baseline built, the
  sources, and the list of things that stay off screen. That list still holds.
- stage/stage_q9.yaml and stage/ov/stage_plan.json: segments and cue names.
- outputs/q9_bostopia_reply/word_timings.json: every spoken word with its time (keyed by turn id from
  outputs/q9_bostopia_reply/episode_manifest.json).
- The current frames (look at every one first):
  outputs/q9_bostopia_reply/video/baseline_stills/*_sheet.png and overview.jpg.
- The house style: Architecting_the_operation/video/yt02/stage/min3_7/b/APAGroupDefinitions.tsx and
  min3_7/d/InstalledRacialPrior.tsx (rendered: outputs/YT02v2_ov/video/stage_runs/ab_v2/e239.jpg,
  cd_v2/e405.jpg). The tokens are yt02/stage/tokens.ts.

## What is wrong with the baseline (from the frames)
- Every scene is a stack of small dark cards in the top third, with the lower two-thirds empty.
- Body type is about 20 px. On a phone that is unreadable.
- The picture rarely does work. The +87% is one bar, the $50,000 receipt is a grid of tiny squares,
  and the Locke, Mason and wage turns are only titled boxes.
- Much of what the speaker says never reaches the screen.

## What to build
1. **The narration on screen.**
   - In every Emmanuel Theodore turn, his key phrases appear on screen as he speaks them: short
     verbatim fragments from the draft (3–10 words), each revealed on its spoken word's cue.
   - Use large type: 60–84 px for the line being spoken; earlier lines step back in size and
     opacity.
   - Keep at most three phrase lines on screen at once. The newest is emphasised; older ones drop
     away.
   - This is a kinetic transcript of the argument's spine, chosen, never the whole sentence.
2. **The augmentation.** Under or beside the phrases, the picture shows what the words claim:
   - **BostonMap:** the 1938 map image, full width, with the rates as bars rising from grades C and D.
   - **Paranoia:** the +87% as a bar that grows from a baseline.
   - **TheCheck:**
     - the receipt drawn as a real receipt;
     - the 3,324 receipts as a field, with the 2,499 small ones in one colour;
     - the fee stack;
     - the wealth pair at true scale ($550k against $7.8k).
   - **TheRepeal:** the AR-15 and Mini-14 side by side, the date line, and stock and grip from
     scriptCast/video/public/assets/parts/.
   - **TheRight, TheWage:** quote cards with the cited sentence large, and the wage plane
     (yt02/stage/dashboard/ComplexWagePlane.tsx, ported to portrait).
   - **TheReturn:** the poverty scatter large, and the r values as a resolving bar pair.
   - Numbers, dates and sources stay exactly as the baseline has them. Each sourced beat keeps its
     source line and QR mark.
3. **Clip turns stay as they are.** The six clip turns show the source reel through
   scenes/shared/ClipFrames.tsx, lip-synced to the mix; do not edit ClipFrames or the extracted
   frames. Nothing overlays a clip except its attribution bar. Your scene's own beats start after the
   clip ends (clipEndMs in ClipFrames.tsx).
4. **The Green clip** inside TheCheck stays where it is, at 30 fps from cue "green". Give the beats
   around it room to breathe.

## Files you may write
- Architecting_the_operation/video/q9_bostopia/stage/scenes/*.tsx and scenes/shared/* (except
  ClipFrames.tsx).
- stage/stage_q9.yaml: **cue additions only**, for the words your phrases land on. Each is
  `name: {word: theword}` (add `occurrence: n` for a repeated word) in that turn's cues. Change no
  existing cue and no shot. Then recompile:
  cd Architecting_the_operation/video/q9_bostopia/stage && PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan stage_q9.yaml -o ov/stage_plan.json
- stage/tools/check_q9.tsx: extend it, never weaken it.
- Architecting_the_operation/video/q9_bostopia/FINDINGS_Q9_ARGON.md (new).
Read-only: the draft script, the shot lists, word_timings.json, the manifest, everything under yt02/,
the engine, cards_json/, ClipFrames.tsx and the extracted frames.
No git commands that change state. No rm -rf. Do not read .env or secrets.

## You may render stills to check your own work (and you must, before you stop)
  cd /Users/emmanuel/Documents/Theory/scriptCast-v04-base && PYTHONPATH=. /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage_stills --plan /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/q9_bostopia/stage/ov/stage_plan.json --episode-dir /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/q9_bostopia/stage --scenes <Scene,...> --out /tmp/q9argon --sheet
That renders one still per cue, plus each scene's end, and a contact sheet. Open the sheets and fix
what you see. Do not render video.

## The standard
- **Determinism:** pure function of stage ms and the plan: useCue, useStageMs, usePlan only. No state,
  effects, refs, DOM measurement, randomness or Date.
- **Portrait layout:**
  - safe area x 60–1020, y 140–1780;
  - no text on text, and no line through text;
  - a replaced element is unmounted;
  - every text and shape carries data-text / data-shape and its box for tools/layout_audit.ts.
- **Type for a phone:**
  - phrase lines 60–84 px;
  - headlines ≥ 56 px, body ≥ 40 px, source line ≥ 24 px;
  - IBM Plex; tokens through color().
- **Composition:** at each turn's end the frame is full: content spans at least ~70% of the safe
  height. Build-in beats may be sparse.
- **Text rules:**
  - Every on-screen string is one of:
    - a verbatim fragment of the speaker's own turn;
    - a sourced number, date or label already in the baseline or the shot list;
    - a source line.
  - No filler microcopy, and no internal labels (shot ids, turn numbers).
  - Use direct declarative statements with no antithesis. Run tools/check_antithesis.py on every file
    you write.
- **Sourcing** (unchanged):
  - The speaker's arguments stay his: captions or phrases in his voice, never sourced claims.
  - Nothing is put in Evan George's mouth.
  - Everything FINDINGS_Q9_STAGE.md keeps off screen stays off screen.

## Your check (extend tools/check_q9.tsx)
Keep every existing assert. Add:
- every on-screen string either appears in the speaker's draft turn for that ms (case- and
  punctuation-insensitive) or is in an allowlist of sourced strings you build from the baseline;
- a type-size floor (phrase ≥ 60, headline ≥ 56, body ≥ 40, source ≥ 24);
- the composition span at turn ends;
- no element mounted over a clip turn except the attribution bar.

## Done means (paste each tail into FINDINGS_Q9_ARGON.md)
- tsc: npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/q9_bostopia/stage
- node Architecting_the_operation/video/q9_bostopia/stage/tools/check_q9.mjs
- tools/check_antithesis.py on every file you wrote
- the contact-sheet paths for all ten scenes, and per scene one line: what the narration shows and
  what the picture adds.

Stop when Done means passes. Do not render the full reel.
