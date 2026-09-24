# Handoff — Chapter 135 / Question 9 reaction video

Written 2026-09-23 for a fresh agent picking this up. Read this whole file before
touching anything — several steps below exist specifically because they weren't
obvious the first time and cost real render time to discover.

## What this is

A spoken-word reaction video: Emmanuel (Black Massachusetts resident, AR-15 owner,
author of *The Original Power*) reacting to an Instagram reel (@harvardseye
interviewing Gov. Healey at a "Yes on 9" campaign press event about gun violence
prevention), then delivering a long fact-grounded argument for voting **NO on
Question 9** on the November 3, 2026 Massachusetts ballot — NO repeals Chapter 135
(the 2024 gun law), YES keeps it. Rendered end-to-end: script → audio in Emmanuel's
cloned voice → shot list → 15 of 16 graphics generated. **Not yet done: the actual
video edit/assembly.**

Read [Paper/Repeal_Chapter_135.tex](../Repeal_Chapter_135.tex) for the broader
framework argument this project sits inside (not directly used in this video, but
informs tone/politics).

## State as of 2026-09-24 (supersedes any conflicting line below)

- **Audio is current** (`outputs/chapter135_reply/chapter135_reply.mp3`, ~13:07): includes
  the 69-day correction, the "without delay" / "Day One" reasons, and the corrected
  Louisiana line ("white registration fell by about a quarter"). Verified; the only two
  flagged turns are whisper-tiny mishearing the real reel audio.
- **Shot anchors are current** (16 of 16 resolved in `specs/chapter135_rebuttal.json`).
- **Kimi's overnight pass (2026-09-23 evening)** produced G-02 v3, the G-05 to G-15
  citation-footer batch, the HOLC scan, and the Card 15 verification. See the shot
  list's "Corrections pass" section for what was found and fixed after.
- **G-10 and G-11 are HTML-built** (`Architecting_the_operation/video/cards_html/`),
  not AI renders, because NotebookLM's infographic generator failed 4 times in a row
  on 2026-09-24 (probable daily quota). Re-render instructions are in the shot list.
  If AI regeneration becomes available again, don't overwrite them without checking
  the numbers: the AI versions carried the stale "71 days" and "barely moved" errors.
- **Known-unfixed AI-card flaws** (generator blocked): G-14 text cut off ("starting."
  with no date), G-02 Mini-14 "Post-2024" label. Pew figures on G-02 not re-verified.
- **Nothing in this project is committed to git.** Everything is untracked.

## Where everything lives

| What | Path |
|---|---|
| Source reel (local file) | `/Users/emmanuel/Downloads/d8c3f544f1a64668a92a53302d00f941.MP4` |
| Source reel (Instagram) | https://www.instagram.com/reel/DdoZBRXIbK5/ |
| **Current script** (scriptCast format, 92 turns, reaction structure) | [Architecting_the_operation/podcasts/chapter135_rebuttal_reply.md](../../Architecting_the_operation/podcasts/chapter135_rebuttal_reply.md) |
| Superseded script (v1, standalone monologue, no reel clips — kept for reference only) | [script.md](script.md) |
| **Citation deck, 22 cards** — every factual claim in the video, sourced | [citations.md](citations.md) |
| **Shot list v2** (16 shots, reaction structure, generation-status notes) | [Architecting_the_operation/video/chapter135_rebuttal_shotlist.md](../../Architecting_the_operation/video/chapter135_rebuttal_shotlist.md) |
| Resolved shot anchors (real ms timestamps) | [Architecting_the_operation/video/specs/chapter135_rebuttal.json](../../Architecting_the_operation/video/specs/chapter135_rebuttal.json) |
| Generated graphics (15 of 16 — see Open Items) | [Architecting_the_operation/video/images/](../../Architecting_the_operation/video/images/) `g02.png`–`g16.png` |
| Registered reel clips (archive engine) | [Architecting_the_operation/archive/clips.yaml](../../Architecting_the_operation/archive/clips.yaml) — ids `reel_q1`, `reel_a1`, `reel_q2`, `reel_a2`, `reel_close` |
| Cut clip source files | `Architecting_the_operation/archive/sources/reel_*.mp4` |
| Voice config (added the `the_reel` archive speaker + `emmanuel_theodore`'s existing OmniVoice clone) | [Architecting_the_operation/scriptcast/voices.omnivoice.yaml](../../Architecting_the_operation/scriptcast/voices.omnivoice.yaml) |
| **Final rendered audio**, ~13:04 | `outputs/chapter135_reply/chapter135_reply.mp3` |
| Also in that folder | `chapter135_reply.als` (Ableton), `chapter135_reply.fcpxml` (Final Cut timeline), `episode_manifest.json`, `TURN_INDEX.csv`, `render_state.json` |
| NotebookLM notebook (image generation) | https://notebooklm.google.com/notebook/e695c969-61c7-4e3a-961c-3a35e6a46499 — "Chapter 135 Reaction Video — Shot Graphics" |

## Established facts already verified (don't re-research these)

Full detail with URLs is in `citations.md` (22 cards). Headline list:

- Chapter 135 = Acts of 2024, H.4885, signed by Healey July 25, 2024.
- **The referendum timeline (this is the core of the "manufactured emergency"
  argument):** law's own effective date Oct 23, 2024 (standard 90-day) → Healey
  signed an emergency preamble Oct 2, 2024, **69 days after signing** (an earlier draft
  said 71; that came from a TV quote, the arithmetic is 69), which blocks a referendum
  petition from staying a law → reasons reported that day: "without delay" (AP) and
  time for agencies and municipalities to prepare for "implementation on Day One"
  (NBC Boston). She DID give reasons; don't claim she gave none. "Public convenience"
  appears only on the campaign's own site and was dropped → campaign submitted 93,229 raw
  signatures that same October → 78,707 certified Nov 22, 2024.
- Grandfather clause: firearms owned/registered before Aug 1, 2024 are exempt if
  registered/serialized by Oct 28, 2026; anything acquired after Aug 1, 2024 under
  the new definition cannot legally be acquired at all.
- AR-15 named as banned; Ruger Mini-14 explicitly named by the MA AG as NOT covered,
  despite identical caliber (5.56/.223) — the law uses a features test, not lethality.
- Bruen (June 23, 2022) forced MA from "may issue" to "shall issue" **for handguns
  (LTC) only** — rifles (FID card) already had no discretionary requirement. National
  Black gun-ownership surge started **2020** (+58%), two years *before* Bruen — don't
  conflate the two, MA's licensing fix and the national buying surge are different
  timelines that happen to intersect.
- Baltimore's 2024 homicide drop (−23%, 261→201) is credited to the Group Violence
  Reduction Strategy (focused deterrence + real investment) — **not reparations**,
  that's a correction we made to the user's original framing. NYC's 3-year shooting
  decline is credited by NYPD to hot-spot policing — also not a new gun statute, but
  also not "gun control did nothing."
- Neighborhood disadvantage predicts gun-violence exposure ~50 points more than
  household poverty alone (~5–10 points) — a real 2022 peer-reviewed study. The
  user's original claim of ".6 correlation" was NOT independently verifiable and was
  dropped in favor of this sourced figure.
- Lead-crime hypothesis: Reyes (2007), NBER WP 13097 — real, national, about
  leaded-gasoline phase-out timing by state, NOT specifically about Boston or
  redlining. Boston's own HOLC redlining history is real and well-documented but
  **the direct Boston-redlining→lead→crime causal chain was never independently
  verified this session** — see Open Items.
- MA LTC costs: $100 non-refundable state fee + $100–150 safety course (mandatory
  live-fire since Aug 1, 2024).
- Grandfather clause history: Louisiana 1898, cutoff Jan 1 1867, Black registration
  130,344→~5,320 in 3 years, struck down in *Guinn v. United States* (1915) despite
  being "racially neutral on its face" — real and solidly sourced.

## Still flagged ⚠ in citations.md — resolve before anything publishes

1. ~~Card 11~~ — **cleared 2026-09-23**: the Boston 1938 HOLC scan was pulled from
   Mapping Inequality's image store and inspected directly (Roxbury corridor = D/red
   zones D8/D9, Dorchester = C/yellow C8–C13). Full scan and a composite-ready crop
   are in `Architecting_the_operation/video/images/` (`holc_boston_1938_scan.jpg`,
   `holc_boston_1938_roxbury_dorchester.jpg`).
2. **Card 15** — the GOAL "HealeyPreamble" page is an advocacy source; its specific
   figures should be cross-checked against the Ballotpedia/Foley Hoag sources next to
   it before being repeated as fact.

## Production pipeline — how to actually run this

This project uses `scriptCast` (sibling repo `../scriptCast`, installed at
`.venv-voice/bin/`) for TTS, and NotebookLM MCP tools for image generation.

### Rendering audio

```bash
cd /Users/emmanuel/Documents/Theory/TheOriginalPower
.venv-voice/bin/scriptcast --transcript Architecting_the_operation/podcasts/chapter135_rebuttal_reply.md \
    --episode-id chapter135_reply --gap-ms 300 --precision-insert --fcpxml
```

`--precision-insert` only synthesizes new/changed turns (matched by a hash of
speaker+text) — never do a full `--overwrite` re-render unless you've changed most of
the script; it costs ~12 minutes for ~90 turns via OmniVoice.

### ⚠️ CRITICAL: the tail-clipping bug — always do this after ANY render

scriptCast's default trim (150ms tail grace, 0.04 RMS threshold) clips word-endings
on this voice — confirmed **91 of 92 segments** were affected in one render. The
audio survives intact in the segment wavs; the stitch step simply excludes it. After
every
`scriptcast` invocation (including `--precision-insert`), before `relayout`/`stitch`,
recompute `speech_duration_ms` for every segment straight from the wav files on disk
with a wider tail (this does NOT re-synthesize anything, it's instant):

```bash
.venv-voice/bin/python Architecting_the_operation/video/refit_tails.py outputs/chapter135_reply
```

(`refit_tails.py` lives in the repo now; it re-measures every segment from its wav with
`tail_ms=400`, `threshold=0.03` and rewrites `episode_manifest.json`.)

Then:
```bash
.venv-voice/bin/scriptcast-relayout outputs/chapter135_reply --gap-ms 300
.venv-voice/bin/scriptcast-stitch outputs/chapter135_reply
.venv-voice/bin/scriptcast-verify outputs/chapter135_reply --transcript Architecting_the_operation/podcasts/chapter135_rebuttal_reply.md
.venv-voice/bin/scriptcast-turn-index outputs/chapter135_reply --transcript Architecting_the_operation/podcasts/chapter135_rebuttal_reply.md
```

**Do this every single time**, including after inserting new turns — a fresh
`scriptcast` invocation resets segments back to the default (too-tight) trim even for
turns that were already fixed before.

### Re-resolving the shot list after any render

Timestamps shift whenever the script changes. Re-run:
```bash
.venv-voice/bin/python Architecting_the_operation/video/shotspec.py \
    Architecting_the_operation/video/chapter135_rebuttal_shotlist.md \
    --script Architecting_the_operation/podcasts/chapter135_rebuttal_reply.md \
    --manifest outputs/chapter135_reply/episode_manifest.json \
    --out Architecting_the_operation/video/specs/chapter135_rebuttal.json
```
If any shot's `Anchor` timestamp in the `.md` file no longer matches a real turn
(shotspec.py will warn "not a turn in the manifest"), find the new timestamp for that
turn's text with `grep -B1 "<turn text>" chapter135_rebuttal_reply.md` and update the
anchor line by hand.

### Generating more graphics (NotebookLM)

Notebook already exists (URL above), with a text source per shot already added for
14 of 16 shots. To add a new one: `source_add` (text, grounded facts + visual
description) → `studio_create(artifact_type="infographic", source_ids=[...],
orientation="portrait", confirm=true)` → poll `studio_status` → `download_artifact`.

**Don't bother trying to get the generator to leave blank safe-zone margins** — three
attempts, including literal pixel-band instructions, all failed. It fills the canvas
edge-to-edge regardless of phrasing. Fix safe zones in the video edit instead: scale
each PNG to ~60–65% of frame height, center over a backdrop. Full Reels safe-zone
numbers (1080×1920, top 14%/bottom 35%/sides 6%, bottom-right corner deeper) are in
the shot list's "Canvas & safe zone" section.

**Don't generate imagery of real people.** One attempt (G-02) produced a stylized
Gov. Healey likeness and had to be redone with an explicit "no human figure" — a
generic faceless silhouette is fine, an identifiable likeness of a real named person
is not, per this pipeline's existing rule (see `Architecting_the_operation/video/README.md`).

### If the `videolab` MCP tool errors with an XPC/container connection error

Run `container system start` in Bash first, then retry — the container backend
just needs to be launched, it's a one-time fix per session.

## Open items / next steps, in likely order

1. **G-01** (the "Yes on 9" wall-of-signs freeze-frame) still needs to be made — it's
   a real-footage frame with an annotation drawn over it, not an AI generation target
   (see shot list). Pull the frame via `videolab_get_frames` on the source reel around
   00:15–00:27, then annotate in the edit.
2. **G-04** (the plain "GRANDFATHER CLAUSE" text card) — two AI-generation attempts
   both failed by producing a meta-explainer instead of the card itself. Just make it
   directly with a text tool in the editor; it's three words on a dark background.
3. **Clear the remaining ⚠ citation** (Card 15, above) before anything publishes.
   Card 11 was cleared 2026-09-23.
4. **The actual video edit hasn't started.** Everything so far is: audio (done),
   shot list with real timestamps (done), 15/16 graphics (done). Next real step is
   importing `chapter135_reply.fcpxml` into an editor, laying the reel clips (audio
   already carries them, but the *video* of the reel itself needs to be cut in
   separately — the archive engine only handles audio) at their real timestamps from
   `specs/chapter135_rebuttal.json`, and compositing the graphics per the safe-zone
   approach above.
5. **G-16's close card has a placeholder `[link]`** for the citations deck — needs a
   real published URL once `citations.md` is hosted somewhere public.
6. Consider whether the user wants the older civil-rights history (Black Codes, Ida
   B. Wells, Mulford Act, from `Paper/Repeal_Chapter_135.tex`) folded into this video
   — it was deliberately left out of the reaction cut as a different, longer
   argument; ask before adding it.

## Political framing — don't flip this

The user is arguing **for repeal** (vote **NO** on Question 9) as a Black Massachusetts
gun owner, from the framework in *The Original Power*. The video is first-person, in
Emmanuel's own voice. Don't soften, both-sides, or reverse the position — the task is
executing this specific argument well and accurately, not adjudicating the underlying
policy debate.
