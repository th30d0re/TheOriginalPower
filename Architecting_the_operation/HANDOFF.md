# Handoff — Architecting the Operation

State as of 2026-09-11. Written for whoever picks this up next.

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
verified, stitched. Script and shot list are uncommitted in the working tree
(the last retime); commit them.

Both are de-sequenced: no episode carries a number or says "last episode", so
they can be released in any order.

**Manuscript.** 1152 pages, builds clean. This session added Lenz's Law at the
inductor definition, converted 716 paired em-dash asides to parentheses, cleared
22 banned rhetorical constructions, and stripped auditor-facing language from 11
figure captions.

## The decision that was just made

Release order is divorced from manuscript order. Emmanuel wants the public run to
**open on Chapter 2, "Redefining Racism"**, not Chapter 0.

The reasoning, which survived a dependency check: Chapter 2 is 19,000 words with
only eleven back-references into Chapter 0 and 1, and every one of them is a
circuit component (inductor, resistor, RLC, kernel optimization) rather than the
geometry. It does not depend on the pyramid, the Tri-Modal Enclosure, or the
Square Ceiling. And "Redefining Racism" states a claim a stranger already has an
opinion about, where "System Initialization: The Geometry of Extraction" offers
them nothing.

**Next task: extract Chapter 2 and draft that episode.** Use the same pattern as
`notes/CH0_findings.md` (brief a delegate for facts, write the script yourself).

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
