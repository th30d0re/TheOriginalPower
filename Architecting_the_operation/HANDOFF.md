# Handoff — Architecting the Operation

State as of 2026-09-11 (third pass, same day). Written for whoever picks this up next.

## What just happened (this pass — re-architecture)

Emmanuel reviewed the drafted Episode 3 and made two calls that changed its shape.
First: Episode 3 ("Redefining Racism") is very likely the **first episode most new
listeners will encounter**, because the Preface and Chapter 0 are notation- and
logic-heavy and mostly reward readers already sold on the math, while Chapter 2
states a claim a stranger already has an opinion about. Second: he wants every named
mechanism in the chapter explained at **four escalating levels** — five-year-old,
high schooler, college, PhD — rather than the single-register walkthrough the first
draft used, and he explicitly chose to let the episode run long rather than trim
scope to hit a target length.

`podcasts/ATO_EP03_redefining_racism.md` was rebuilt end to end around that device.
Toussaint names the level ("Five year old." / "High schooler." / "College." /
"PhD."), Aisha delivers the first two registers, Emmanuel Theodore delivers the last
two — a consistent rhythm repeated across ten named mechanisms (the five-tier
refinement, recursive local partition, the Du Bois "Propaganda of History" /
gaslighting-variable result, the causal-arrow reversal, prejudice vs. racism, and
the seven modules of the diagnostic model: biological embedding, the kernel/rootkit
objective, the zero-day exploit, the Bayesian defense, polymorphic code, the RLC
backlash circuit, fractal execution, the lexical fractal, the corrupted firewall,
and the Δmax=0 invariant, plus the closing three-modes note). Almost all of the prior
draft's researched substance — the antebellum cotton case study, the post-1965
Backlash Wave numbers, the Jim Crow→War on Drugs cost-optimizer walkthrough, the
master/slave lexical timeline, the Great Compression's three-part rebuttal — survives
inside the PhD-level continuations rather than being cut; the rewrite is a
restructuring of delivery, not a loss of research. The cold open was also rewritten
to be genuinely self-contained: no "last time" or episode-order reference, since this
script can no longer assume any prior episode has been heard.

It parses clean (258 turns, 11,110 words, no unknown speakers, no bracket leaks) and
passes `check_antithesis.py` with zero CERTAIN findings. Runtime by word count is
**~74–77 minutes**, comparable to the original single-register draft despite covering
roughly twice as many distinct explanatory passes — the four-level device is doing
real compression work per minute of runtime. `video/ATO_EP03_shotlist.md`
was rewritten to match: the old episode-spanning "SYSTEM SCAN" HUD is now scoped only
to the diagnostic-model interior, and a new recurring "Level Card" badge (AGE 5 / HIGH
SCHOOL / COLLEGE / PhD, color-shifting cooler as it climbs) is the episode's signature
visual device.

**Update, same session — rendered.** Episode 3 went through the full pipeline:
OmniVoice render (258 turns, 258/258 speakers resolved, 76:42 runtime) into
`outputs/ATO_EP03_local/`, `verify_render.py` (whisper-tiny flagged 19 turns,
mostly whisper-tiny mishearing short isolated Level-Card lines like "College."
as "call it." — whisper-small cleared all but two), `repair_render.py`
(whisper-small, threshold 0.90, 4 passes). One flagged turn was a real defect:
turn 96 (Aisha) had ~900ms of dead air where "Module two." should have
synthesized, confirmed directly by waveform inspection rather than the
transcript diff alone — regenerated clean. Two other regenerated turns (178, 195) also cleared. One
turn (93, Emmanuel Theodore, the antebellum cotton figures) stayed flagged at
score 0.943 purely from Whisper's numeral normalization ("seventy four point
one million dollars" heard back as "$74.1 million"); waveform-checked
separately (66.6s, longest silent run 0.8s) and accepted as a false positive —
`check_render_outliers.py` also finds zero duration outliers episode-wide.
Stitched to `ATO_EP03_local.mp3` (76:42), then `retime_script.py --apply`
rewrote 252 of 258 script header timestamps and remapped 60 shot-list anchors
against the real manifest (drift up to 7s in a few places), recalibrating
`voice_pipeline/speaker_rates.json` from this render's measured rates. The
`.als` is at `outputs/ATO_EP03_local/ATO_EP03_local.als`. `outputs/` is
gitignored; the retimed script, retimed shot list, and recalibrated speaker
rates are committed. The split-vs-single-episode question below is still
open — the render exists as one ~77-minute file either way, and splitting
later is a shot-list/script edit, not a re-render.

One technical note for whoever renders this: an early draft embedded literal LaTeX
math (`$...$`, `\text{}`, subscripts) directly in spoken turns, and the markup
tokenizer choked on stray `[0,1]`-style bracket pairs and silently dropped underscores/
carets in a way that mangled prose (confirmed by a bracket-leak and word-count check
against `voice_pipeline.parser`/`voice_pipeline.markup`). All formalism in this script
is now spoken English ("the inverse square root of inductance times capacitance"),
matching Episodes 1–2's convention. If a future rewrite is tempted to paste LaTeX into
a script for precision, don't — verify with the parser/markup check in the pipeline
section below first.

A delegate attempt at the original brief (Codex, `gpt-5.6-sol`) correctly refused to
write it: the working tree had unrelated uncommitted changes elsewhere in the repo
(`.mcp.json`, `debate/police-origin.md`, several untracked directories) and the
commit-before-destroy rule blocked it from creating a new file until those were
committed. That refusal was correct per AGENTS.md and is not a bug to route around —
either commit first, or do what happened here: write the brief yourself from a direct
read of the chapter instead of delegating it.

Given the length (~75 minutes) and that this is now expected to be the series' front
door, the split question below is worth revisiting again before rendering: the
four-level device gives cleaner seams than the old single-register draft did, since
each of the ten named-mechanism blocks is now a self-contained seven-to-nine-minute
unit. A natural split, if one is wanted, is Parts 1–2 (the binary refined, the word
rebuilt — roughly the first 17 minutes) as a short primer, against Part 3 (the full
diagnostic model — roughly 58 minutes) as its own episode. Not yet decided.

Two passages needed explicit handling per the hazards audit and still get it: the
Thistlewood/Abba historical record gets a spoken content note before it airs
(Toussaint) and a plain image-free video treatment (shot G-20); the 1662 Virginia
`partus sequitur ventrem` law gets a citation-only, no-imagery treatment (shot G-38).
Three other hazards from the audit were deliberately preserved rather than smoothed
over, because cutting them would have understated the chapter's own argument: the
Ehrlichman quote's disputed status (shot G-26), the Anslinger quote the manuscript
explicitly declines to use (shot G-27), and the Great Compression counter-case getting
its full three-part rebuttal rather than a wave-away (shot G-49).

## What this is

A podcast and video series unpacking *The Original Power*, Emmanuel Theodore's
book modelling systemic oppression as an extraction circuit. Scripts are
rendered to speech on device, laid out into an Ableton set, and cut against a
shot list. The manuscript itself is worked on in the same repo.

Read `AGENTS.md` first. Two rules there are non-negotiable and both have been
violated in this project with real cost: the rhetorical constraint, and
commit-before-destroy.

## Where things stand

**Episode 1, the Author's Preface.** 287 turns, 58:54, rendered entirely on
OmniVoice, verified, stitched, committed.

**Episode 2, the Preface.** 271 turns, 40:24, rendered entirely on OmniVoice,
verified, stitched, committed.

Both are de-sequenced: no episode carries a number or says "last episode", so
they can be released in any order.

**Episode 3, Redefining Racism.** 258 turns, 76:42, rendered entirely on
OmniVoice this session, verified and repaired, stitched, retimed. Not yet
committed to the de-sequenced release rotation — the split question (one
episode or two) is still open, and it hasn't had the human listen-through
Episodes 1–2 got before their final commit.

**Manuscript.** 1152 pages, builds clean. This session added Lenz's Law at the
inductor definition, converted 716 paired em-dash asides to parentheses, cleared
22 banned rhetorical constructions, and stripped auditor-facing language from 11
figure captions.

## The decision that was made last session

Release order is divorced from manuscript order. Emmanuel wants the public run to
**open on Chapter 2, "Redefining Racism"**, not Chapter 0.

The reasoning, which survived a dependency check: Chapter 2 is 19,000 words with
only eleven back-references into Chapter 0 and 1, and every one of them is a
circuit component (inductor, resistor, RLC, kernel optimization) rather than the
geometry. It does not depend on the pyramid, the Tri-Modal Enclosure, or the
Square Ceiling. And "Redefining Racism" states a claim a stranger already has an
opinion about, where "System Initialization: The Geometry of Extraction" offers
them nothing.

**Next task: listen through the Episode 3 render, then decide the split question**
(one ~77-minute episode or two shorter ones — see "What just happened" above) and
cut the video against the retimed shot list. Episode 3 itself is rendered,
verified, stitched, and retimed; it just hasn't had the human pass Episodes 1–2
got before their final commit. After that, Chapter 0 (item 3 below) is the next
unstarted chapter — and if the four-level device reads well in Episode 3, it's a
candidate for adoption across the whole series going forward.

## Open items

1. **The N line.** Episode 2 turn 189 reads "Fully engaged in N competing
   conflicts." Spoken, "in N" sounds like "in in" and both Whisper models
   transcribe it that way. The audio is fine; the script is not. Emmanuel is
   deciding the rewording himself. The same hazard applies anywhere a bare
   symbol is read aloud.
2. **The five-node mapping contradiction.** Kimi's analysis is in
   `notes/MAPPING_contradiction_proposal.md`. It confirms the Enforcement Class
   is called both a current source and a conductor in the same table row, and
   that the figure commits to the reading the prose disavows. This is a
   manuscript fix and it **blocks the component-library episode**, which would
   otherwise inherit the contradiction. Not yet applied; read the proposal and
   decide before editing.
3. **Chapter 0 is two episodes.** The Systemic Component Library is 63% of the
   chapter. Split at the chapter's own section break: geometry first, components
   second. Findings for the whole chapter are in `notes/CH0_findings.md`,
   including a ranked list of the four hardest ideas and a 28-point hazards
   audit. The hazards are substantive, not cosmetic.
4. **Voices are placeholders.** Toussaint and Aisha are OmniVoice clones of
   sentence-boundary clips taken from earlier renders. Emmanuel asked four
   people for real reference audio and all declined. LibriVox was auditioned and
   rejected: audiobook narration is the wrong register for conversational
   co-hosts. His own voice is real and final.

## The pipeline

```bash
source .venv-voice/bin/activate

# render (full)
python -m voice_pipeline --transcript <script>.md --episode-id <id> \
  --out-dir ./outputs --voices voice_pipeline/voices.omnivoice.yaml --gap-ms 350

# render (changed turns only)
... --precision-insert
... --regenerate-turns 3,38

# then, in this order
python3 tools/verify_render.py outputs/<id> --transcript <script>.md --model small
python3 tools/relayout_episode.py outputs/<id> --gap-ms 350
python3 tools/stitch_episode.py outputs/<id> --pad-ms 350
python3 tools/retime_script.py <script>.md --manifest outputs/<id>/episode_manifest.json \
  --shotlist <shotlist>.md --apply
python3 tools/turn_index.py outputs/<id> --transcript <script>.md
```

`tools/repair_render.py` wraps verify-and-regenerate into a loop.

**Archival clips.** A turn can play a real recording instead of a synthetic
voice. Give the speaker `engine: archive` in the voices file, register the
excerpt with `tools/make_clip.py` (it finds the start and end phrases by
Whisper word timing), and write the turn as `[clip:id]` followed by the
verbatim transcript. The transcript is what verification checks the clip
against. Clips are loudness-matched to the voices. Sources live in
`Architecting_the_operation/archive/sources/`, gitignored; the registry is
`Architecting_the_operation/archive/clips.yaml`.

**Heteronyms.** OmniVoice picks noun or verb stress on its own and often picks
wrong ("the historical re-CORD"). Whisper cannot hear the difference, so
`verify_render.py` also cuts every heteronym out of the audio and judges it with
a phoneme recognizer against the reading misaki's part-of-speech tagging expects
(`tools/stress_check.py`). "wrong" and "garbled" fail the turn and the repair
loop re-renders it. Known limits: misaki occasionally mistags a word in a long
sentence ("animus converts into" read as a noun), and pairs differing only in an
unstressed vowel or a voicing ("deliberate", "use") are skipped. Words that keep
failing get a respelling handed to the engine only, recorded in
`voice_pipeline/pronunciations.yaml` after calibration:

```bash
python3 tools/calibrate_pronunciation.py record --reading default \
  --candidates reckerd,wreck-urd --takes 6 --write
```

OmniVoice runs ~12s per turn, so a fresh episode is about an hour. It lives in
its own `.venv-omnivoice` because it pins torch 2.8 against the voice venv's
2.11; the pipeline talks to it through a persistent worker
(`voice_pipeline/omnivoice_worker.py`).

## Things that cost time to learn

**Verification that passes is not the same as work that is right.** Three
separate checks in this project reported clean on defective output.

- *Duration checking misses everything that is the right length.* Three failure
  modes exist — truncation, repetition, opening babble — and only one has a
  duration signature.
- *Whisper repairs disfluencies.* Splice a 220ms stutter into a clip,
  re-transcribe, and it returns the original sentence. `verify_render.py` scored
  that 1.000. Emmanuel heard stutters the check had passed for days.
- *A similarity threshold is the wrong shape for a repetition.* The stutter he
  found scored 0.940 with a worst run of 2, under both limits. Repetition now
  has its own rule: an inserted span that duplicates its neighbours is a defect
  at any length.

**The gate can be wrong about the work.** `check_antithesis.py` matched inside
quotations, so Codex "fixed" a 1788 Tench Coxe quote and a cited ambassador's
statement by paraphrasing them. It now masks quoted material. Review delegate
output against the source; passing the gate is not evidence.

**Chapters are numbered from zero.** `\setcounter{chapter}{-1}`. System
Initialization is Chapter 0, Dynamical Systems is 1, Redefining Racism is 2,
Portugal 3, Bacon 4. Twenty-two body chapters plus seven appendices. This was
got wrong twice.

**Do not hardcode line numbers.** Chapter boundaries move whenever anyone edits
upstream. An extraction pinned to a stale line number silently truncated a
chapter and Codex caught it, not me. Find boundaries dynamically.

**Never put `PATH` in a LaTeX Workshop tool's `env`.** The extension expands
placeholders in `args` and not in `env`, so the value is passed literally and
replaces the real PATH. Build dies with `spawn latexmk ENOENT`. See AGENTS.md.

**Scope regex cleanups to the match.** A line-wide spacing fix inserted a space
before every `(` on any line it touched, including inside math, and broke the
build. Counting braces and delimiters did not catch it because spacing moves no
count. Verify by stripping what you changed and requiring the remainder to be
byte-identical.

## Delegation

Codex: `codex exec -m gpt-5.6-sol -s workspace-write --skip-git-repo-check \
-c model_reasoning_effort="medium" -C <dir> "<prompt>" < /dev/null`
Kimi: `kimi -p "<prompt>"` — bare `-p` only, and keep tasks bounded.

Both have been reliable at extraction and analysis. Codex altering quotations is
the one serious failure; brief delegates to propose rather than edit when the
material is load-bearing, which is what Kimi was told for the mapping fix.
