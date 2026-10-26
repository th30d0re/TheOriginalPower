# Brief B — Phonon readings of "Angola" and "U.S.C." in YT02v2

Date: 2026-10-26. Agent: Kimi Code CLI.
Verify JSON: `Architecting_the_operation/video/yt02/logs/B_verify.json`.
Edit scope honored: `pronunciations.yaml` examined and left unchanged (see §3); this report is the only file written. No audio recorded. No git run.

## 1. Verification by ear (Whisper medium)

Command:

```
.venv-voice/bin/scriptcast-verify outputs/YT02v2 \
  --transcript Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md \
  --model medium --turns 269,357 --json-out Architecting_the_operation/video/yt02/logs/B_verify.json
```

The tool exited non-zero because turn 357 was flagged; transcription itself completed for both turns (`2 turns transcribed with whisper-medium.en | median 0.968`). The log also notes 3 manifest turns are stale relative to the script; that note does not touch turns 269 or 357.

### Turn 269 — "Angola": verified correct, no defect in this take

- Script (post-fix): "…traded twenty and odd captives from Angola seized from the Portuguese slave ship Sao Joao Bautista."
- Whisper medium heard: "The Virginia record opens in late August 1619 at Point Comfort when the privateer vessel White Lion traded 20 and odd captives from Angola seized from the Portuguese slave ship Sao Joao Batista."
- Score 0.997, turn passed. "Angola" comes out as "Angola". The earlier "Angolan → angle-land" failure is absent from this take. ("20" and "Batista" are Whisper's written normalizations of correctly spoken words.)

### Turn 357 — "U.S.C.": verified wrong

- Script: "…eighteen U.S.C. section nine twenty-two gee, paragraph one…"
- Whisper medium heard: "Today the felony in possession bar in 18 United States. Section 922G, paragraph 1 combines with racially disparate drug felony pipelines to preserve a proxy arms boundary."
- Score 0.940, failed, worst mangled run 3, alignment diff `[u s c -> united states]`.
- Phonon speaks "U.S.C." as "United States" — its normalizer expands the dotted abbreviation (United States Code). The required reading is the three letters "U S C".
- "922G" and "paragraph 1" are Whisper's number normalizations of correctly spoken "nine twenty-two gee" and "paragraph one" (the heard "G" confirms "gee" was spoken as the letter). These are transcription orthography, and the speech behind them is right.

## 2. Matching analysis — how a dotted key such as "U.S.C." is matched

Read of `~/Dev/Tools/scriptCast/scriptcast/pronunciation.py` (the file `.venv-voice` imports, an editable install) plus empirical probes with the real `respell()`:

- `_TOKEN_RE = [A-Za-z0-9']+` splits "U.S.C." into three tokens: `['U', 'S', 'C']` (dots are outside the class).
- `_COMPOUND_RE = [A-Za-z0-9']+(?:-[A-Za-z0-9']+)+` requires hyphens; it matches nothing in "U.S.C.".
- The heteronym pass cannot help: misaki's lexicon contains no `u.s.c.`, `u.s.c`, `usc`, `u.s.`, or `u.s` entry, so the word never enters the heteronym table.
- The `respell()` gate and both substitution passes therefore see no unit equal to a dotted key. Confirmed empirically on turn 357's text (engine="phonon", current yaml plus one probe key):

| Probe key | Result on turn 357 |
|---|---|
| `u.s.c.` → "you ess see" | NO CHANGE |
| `u.s.c` → "you ess see" | NO CHANGE |
| `usc` → "you ess see" | NO CHANGE |

A dotted key is matched nowhere. The single-letter tokens U / S / C are the only units the matcher can see inside "U.S.C.", and respelling those is unacceptable: across all 561 parsed turns, keys `u`/`s`/`c` → you/ess/see change 9 turns, 8 of them unintended — population **U** (turns 128, 152), capacitance **C** (138, 392, 394, 395), interface set **S** and **S-star** (391, 392), **Part C** (410) — and turn 357 itself would receive "eighteen You.Ess.See. section", with the dots still in the text.

Demonstrated working mechanism, for the fix that must come from the script side: had the text read "U-S-C", the compound matcher accepts key `u-s-c`:

```
in : Today the felony-in-possession bar in eighteen U-S-C section nine twenty-two gee, paragraph one.
out: Today the felony-in-possession bar in eighteen You ess see section nine twenty-two gee, paragraph one.
```

## 3. Changes made — none, with the reason for each

**Turn 269 ("Angola") — no entry added.** The current take is verified correct (§1). An `angola` key would also force a re-render of this turn: `speech_text_hash()` changes when the respelled text changes, and a re-render discards a take that just passed verification. The file's own header admits calibrated entries only, and calibration requires rendering takes, which this brief forbids. Probe for the record: `angola` → "an-GO-luh" would touch exactly 1 turn (269) and no other.

**Turn 357 ("U.S.C.") — no entry added, because none can work.** Every candidate key is dead (`u.s.c.`, `u.s.c`, `usc`) or script-wide poison (`u`, `s`, `c`). Adding a dead key would document a fix that does nothing and would activate silently if the matcher ever gains dot support. This is the admitted-gap outcome: the defect is real, confirmed by ear, and `pronunciations.yaml` has no lever that reaches it under the current `respell()`.

Respelled text, real `respell()` on `.venv-voice`, engine="phonon", current yaml (before == after, since no entry was added):

Turn 269 (the existing `record: default: reckerd` entry already fires here; "Angola" passes through plain):

```
before: The Virginia reckerd opens in late August 1619 at Point Comfort, when the privateer vessel White Lion traded twenty and odd captives from Angola seized from the Portuguese slave ship Sao Joao Bautista.
after : The Virginia reckerd opens in late August 1619 at Point Comfort, when the privateer vessel White Lion traded twenty and odd captives from Angola seized from the Portuguese slave ship Sao Joao Bautista.
```

Turn 357:

```
before: Today the felony-in-possession bar in eighteen U.S.C. section nine twenty-two gee, paragraph one combines with racially disparate drug felony pipelines to preserve a proxy arms boundary.
after : Today the felony-in-possession bar in eighteen U.S.C. section nine twenty-two gee, paragraph one combines with racially disparate drug felony pipelines to preserve a proxy arms boundary.
```

## 4. Side-effect diff

Diff of the respelled full script (all 561 turns from `parse_transcript`, engine="phonon") with and without the new keys: zero turns differ, because zero keys were added. The probe diffs that argue against the candidate keys are in §2: `u.s.c.` changes 0 turns anywhere in the script; `u`/`s`/`c` change 9 turns with 8 unintended victims.

## 5. Turns needing re-recording

- **Turn 269: none.** Verified correct.
- **Turn 357: yes, after a fix outside this brief's edit scope.** Re-recording now reproduces "United States" deterministically — `PhononEngine` is deterministic for the same text and voice, and the text it receives is unchanged. Unblock paths, in order of preference:
  1. Script edit to "eighteen U-S-C section …" plus yaml key `u-s-c: { phonon: you ess see }` — the text-level half is demonstrated in §2; the audio half still needs calibration takes and a re-verify.
  2. A `respell()` matcher that handles dotted abbreviations (scriptCast change).
  3. Script spelled "eighteen U S C section …" relying on Phonon's capital-letter spelling behavior — unverified hypothesis, needs calibration takes before use.
