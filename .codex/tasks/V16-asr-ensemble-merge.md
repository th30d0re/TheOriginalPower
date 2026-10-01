# V16: ASR ensemble merge (Whisper + Phonon-2 + Phonon-1-Big)

You own exactly these files. Touch nothing else. Do not run `git` (no add, commit, checkout, stash).
Do not run `npm`, do not install packages, do not use the network. Verify with the pytest command at the end.

Owned files:
- `videolab/src/videolab/asr_merge.py` (new, pure functions, no model or network imports)
- `videolab/src/videolab/asr.py` (edit)
- `videolab/tests/test_asr_merge.py` (new)
- `videolab/tests/test_asr.py` (append tests only; do not change existing ones)
- `videolab/CONTRACT.md` (edit the stage C / `job.json` asr / `transcript.*` text only)
- `videolab/requirements.txt` (add one line)

Findings go in `videolab/docs/V16-findings.md`: contract bugs, ambiguities, anything you changed from this
spec and why.

## Why

Measured on 42 real reels (`videolab/docs/asr_phonon2_vs_whisper.md`). Phonon-2 gives word timestamps and
keeps disfluencies but silently skips whole passages (6 of 42 reels, 241 words, no warning flag).
Phonon-1-Big gives segment-level text only (no word timestamps) and skipped 43 words in 1 of 42 reels.
Whisper (current engine) skipped 43 words in 2 noisy reels. No single engine is complete. The fix is a
merge where each engine covers the others' gaps.

## Behavior to build

New engine mode `ensemble`, selected by `VIDEOLAB_ASR_ENGINE=ensemble` or `python -m videolab.asr --engine
ensemble`. Default stays `whisper`; with the default, behavior and outputs are byte-for-byte unchanged and
every existing test passes untouched. `videolab/src/videolab/cli.py` needs no edit because `_run_asr`
already forwards the environment.

Pipeline for `ensemble`:

1. **Whisper pass.** Run the existing path (`_mlx_transcribe`, degenerate-segment filter) first. Its
   segments are the backstop.
2. **Phonon-2 words.** Start `fermion serve phonon-2 --port <free port>` as a subprocess (binary from env
   `VIDEOLAB_FERMION`, else `shutil.which("fermion")`; absent means failure policy below). Poll
   `GET /health` until 200 (timeout 120 s). Then call
   `POST /v1/audio/transcriptions` as multipart with fields `response_format=verbose_json` and
   `timestamp_granularities[]=word`, using only the standard library (`urllib`, hand-built multipart).
   Response JSON has `words: [{"word","start","end"}]` and `duration`.
   - Primary pass: the whole `audio.wav`.
   - Fill passes: slice the audio with `ffmpeg` into 15 s windows with 2 s overlap, at start offsets
     0 s, 5 s and 10 s (three passes). Send every window to the server. Keep a word only if its midpoint
     lies in the window's owned span `[start + 1, start + 14)` (first window owns from 0, last window owns
     to the end). Shift word times by the window start.
   - Always terminate the server in a `finally`, including on exceptions and timeouts.
3. **Gap fill.** `fill_gaps` (below): for each gap over 2.0 s in the primary words, take the words of
   whichever fill pass has the most words with midpoints inside the gap, add them, sort by start time.
4. **Whisper backfill.** After gap fill, compare normalized text of the merged words against Whisper's
   segments. Any run of 8 or more consecutive Whisper words absent from the merged text is restored by
   inserting the Whisper segment(s) that hold those words, with Whisper's timestamps and
   `"engine": "whisper"`.
5. **Phonon-1-Big coverage check (warn only).** Start `fermion serve phonon-1-big` (after the Phonon-2
   server has exited), transcribe the whole file with `response_format=verbose_json` (no word
   timestamps; use the returned `text`), and run `coverage_warnings`. Do not insert Big text into the
   transcript. Record warnings only.
6. **Segments out.** `group_words_into_segments` turns the merged word stream into segments (new segment
   when the pause between words exceeds 0.8 s or the segment exceeds 30 s). Whisper-backfilled segments
   keep their own times. Every segment carries `"engine": "phonon-2"` or `"whisper"`. Sort by start.
   Write the same outputs as today (`transcript.txt|json|srt|vtt`) through the existing `_write_outputs`.
   `transcript.json` additionally gets `"engine": "ensemble"` and `"words"` (the merged Phonon-2 word
   list; backfilled Whisper text has no words).

**Failure policy.** Any failure in steps 2 to 5 (fermion missing, server never healthy, HTTP error, ffmpeg
failure, timeout) must not fail the stage when Whisper succeeded: write Whisper-only outputs exactly as
`whisper` mode would, and record the reason in `job.json` `stages.asr.detail.ensemble_error`.
If Phonon-2 steps succeed but only the Big check fails, keep the merged transcript and record
`detail.coverage_check_error`. If Whisper itself fails, the existing error handling applies unchanged.

**`job.json` `stages.asr`** for ensemble: `engine` is `"ensemble"`, and `detail` keeps `model`, `language`,
`dropped_segments` and adds `phonon_model: "FermionResearch/Phonon-2"`, `filled_gaps` (int, gaps that
received words), `unfilled_gaps` (int), `backfilled_segments` (int), `coverage_warnings` (list of
`{"words": int, "excerpt": str}`, excerpt at most 120 characters).

## `asr_merge.py` API (pure, no I/O, no imports of asr.py)

```python
Word = dict            # {"word": str, "start": float, "end": float}

def normalize_tokens(text: str) -> list[str]
def word_gaps(words: list[Word], duration: float, threshold: float = 2.0) -> list[tuple[float, float]]
def fill_gaps(primary: list[Word], passes: list[list[Word]], duration: float,
              threshold: float = 2.0) -> tuple[list[Word], int, int]   # words, filled, unfilled
def group_words_into_segments(words: list[Word], pause: float = 0.8, max_len: float = 30.0) -> list[dict]
def backfill_from_reference(segments: list[dict], reference: list[dict],
                            min_words: int = 8) -> tuple[list[dict], int]   # segments, inserted
def coverage_warnings(merged_text: str, check_text: str, min_words: int = 8) -> list[dict]
```

Rules:
- `normalize_tokens`: casefold, replace `%` with a space, keep letters and apostrophes inside words, split
  on everything else, and **drop numeric tokens**: digit tokens, and spelled number words
  (`zero` to `ninety`, `hundred`, `thousand`, `million`, `percent`, `point`, `dollars`, `and` is kept).
  Reason: engines disagree on digits versus spelled numbers and that must not register as a gap.
- `word_gaps`: gaps are between consecutive words (`next.start - prev.end > threshold`), plus the leading
  gap (`first.start - 0.0`) and trailing gap (`duration - last.end`) when over the threshold. Empty word
  list returns `[(0.0, duration)]` when `duration > threshold`.
- `fill_gaps`: gap membership uses word midpoint `(start+end)/2` in `[gap_start, gap_end)`. A gap with no
  words in any pass is unfilled. Never duplicate a word already present (same start within 0.05 s and
  same casefolded text). The result is sorted by `start`.
- `backfill_from_reference`: align token lists with `difflib.SequenceMatcher(autojunk=False)`; for each
  `delete` or `replace` opcode where `reference_tokens - merged_tokens >= min_words`, insert every
  reference segment that has at least half of its tokens inside the missing span. Inserted segments get
  `"engine": "whisper"`. Output sorted by `start`. Do not insert a reference segment twice.
- `coverage_warnings`: same alignment between merged text and check text; one warning per missing span of
  at least `min_words`: `{"words": n, "excerpt": first 120 chars of the missing words joined by spaces}`.

## Tests (offline, no fermion, no network, no real audio)

Inject fakes the way existing tests inject `mlx_transcriber`. `asr.transcribe_ensemble` (new public
function beside `transcribe`) takes injectable callables:
`whisper=`, `phonon_words=` (returns `(primary_words, [pass_words...], duration)`),
`big_text=` (returns str). Real implementations are the defaults.

Cases that must be covered, each from a real failure observed on the corpus:
1. Mid-file gap: primary has a 12 s hole at 36.5 to 48.2 s; one fill pass has words there. Expect the gap
   filled and `filled_gaps == 1`.
2. Opening gap no pass can fill: primary starts at 4.8 s, Whisper segment `0.0 to 4.4` holds
   "it even said like this but this is directed at a certain part of my audience". Expect that segment
   backfilled with `engine == "whisper"` and `backfilled_segments == 1`.
3. Digit versus spelled number: Whisper "78%" against Phonon "seventy eight percent" must produce no
   backfill and no warning.
4. Coverage warning: Big text contains a 10 word span absent from the merge. Expect one warning, and the
   transcript unchanged.
5. Failure policy: `phonon_words` raises. Expect Whisper-only outputs, stage `ok`, `detail.ensemble_error`
   set, engine value `mlx-whisper`.
6. Default mode unchanged: run the existing tests; they must pass untouched.
7. Server cleanup: with a fake subprocess object, the server is terminated when the request raises.

Verify (from the repo root, use the voice venv python if `.venv-voice/bin/python` exists, else `python3`):
`python -m pytest videolab/tests/test_asr.py videolab/tests/test_asr_merge.py -q`
All of `videolab/tests` must still collect.

## Contract edits (`CONTRACT.md`)

Stage C row: add the ensemble engine. `job.json` asr block: the new `detail` keys. `transcript.json`:
optional top-level `engine` and `words`, per-segment optional `engine`. Mark every addition as optional so
existing `whisper` jobs remain valid. Do not change any other section.

## Requirements

Append `fermion-research>=0.2.7` to `videolab/requirements.txt` with a comment line above it:
`# Phonon-2 / Phonon-1-Big ASR for the ensemble engine (host only; needs mlx-audio on Apple silicon)`.
Do not install it.
