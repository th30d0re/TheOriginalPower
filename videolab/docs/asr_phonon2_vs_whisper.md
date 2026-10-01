# Phonon-2 vs Whisper on the existing reel corpus

Run date: 2026-10-01. Model: `FermionResearch/Phonon-2` (fermion-research CLI, MLX backend, Apple silicon).
Reference engine: the committed `transcript.txt` in each job (mlx-whisper large-v3-turbo). 42 jobs with
audio, 37 to 182 seconds each, 5,308 seconds in total.

There is no human ground truth, so every number below is disagreement between two engines. Disagreement
locates errors; it does not say which engine made them. Texts were normalized before comparing
(lowercase, digits to words, `%` to "percent", hyphens and punctuation removed) because Phonon spells
numbers out and Whisper uses digits.

## Result

| | |
|---|---|
| Reels run | 42 of 42, none flagged `truncated` |
| Median disagreement with Whisper | 2.5% of words |
| Reels under 5% disagreement | 33 of 42 |
| Reels over 15% | 5 (`file-3ae132e72fd1`, `file-3b2138cf9a5b`, `file-a5b3738c54c0`, `instagram-DcLvlJaD8qa`, `instagram-DcPPit0vy6I`) |
| Wall clock per reel | 16.5 to 21.3 s, almost all of it process start-up (model load and shader setup) |

## Defect: Phonon silently skips stretches of speech on full-length files

In 6 of 42 reels Phonon omits whole passages, 16 to 74 words per reel. Total omitted by Phonon: 241 words.
Total omitted by Whisper under the same test: 36 words across 2 reels (8 words of filler in
`instagram-DcLvlJaD8qa`, 28 words in the noisy `instagram-DcPPit0vy6I`).

Evidence that the omissions are Phonon's and not Whisper hallucinations:

- In the three reels checked, the omitted stretch is a 10 to 13 second gap in Phonon's word timestamps while Whisper has a coherent,
  in-context sentence at the same timestamps (`file-a5b3738c54c0` 36.5 to 48.2 s;
  `file-e9a4f90ab1ea` 120.1 to 130.6 s; `instagram-DcUV8wbSkBd` 28.4 to 41.6 s).
- Cropping `file-a5b3738c54c0` to 34 to 50 s and re-running Phonon recovers the sentence in full:
  "men are shamed for having a lot of sex. Sex is treated as something that a man takes from a woman ..."
  The audio is intelligible to the model. The skip is a long-form decoding defect.
- The `truncated` flag is `false` on every affected file, so the tool gives no signal.

In `instagram-DcPPit0vy6I` (archival experiment audio) both engines struggle: Phonon omits 74 words and
Whisper omits 28, so that file needs manual review whichever engine is used.

## Other observations

- Phonon keeps disfluencies ("uh", "um") that Whisper mostly drops. For a corpus that is quoted, this is
  closer to verbatim.
- Phonon writes numbers as words; Whisper writes digits. A downstream normalization step is needed
  wherever statistics are extracted from transcripts.
- Phonon provides per-word timestamps. The existing Whisper output has segment-level timing only.
- The fermion CLI accepts `--hotwords`. It has not been tested here.

## Mitigation tests (same day)

All run on the 6 reels with Phonon omissions plus 2 reels with none, using `fermion serve phonon-2`
(one process, model loaded once; about 1 second of decode per pass over a whole reel).

| Test | Result |
|---|---|
| 15 s chunks with 2 s overlap, replacing the full-file run | **Worse.** Omitted words rose on 7 of 8 reels, including both clean controls (0 to 41 and 0 to 68). The skip also happens inside short chunks, so window length is not the cause. |
| 1 to 2 s of leading silence | No effect. The first words still start where the skip ends. |
| Full-file run as primary, then fill each gap over 2 s from the best of four extra passes (chunked passes at start offsets 0, 5 and 10 s, plus a repeat full run) | **Recovers most of it.** Omitted words 241 to 72 across the 8 reels. `file-e9a4f90ab1ea` and `instagram-DcUV8wbSkBd` go to 0, `file-a5b3738c54c0` from 54 to 10, `instagram-DcPPit0vy6I` from 74 to 30. Both controls stay at 0. |
| Same fill on `file-3ae132e72fd1` and `file-3b2138cf9a5b` | **No recovery.** Phonon never transcribes the opening 4.4 s ("It even said like this, but this is directed at a certain part of my audience.") under any alignment or padding. Whisper has it. |

Reading: the skips depend on the audio content, not on file length or alignment, and different alignments
skip different stretches. That makes multi-pass gap filling work for mid-file gaps. Skipped openings and
very noisy audio need a second engine.

Normalization note: chunked output writes some numbers as digits ("78 %") where full-file output spells
them out; both were normalized before comparing.

## Phonon-1-Big

Run on all 42 reels, whole-file, through `fermion serve phonon-1-big` (581 MB model, 2 to 5 s per reel).
It returns segment-level text only (about 29 s segments) and no word timestamps.

| | Phonon-2 | Phonon-1-Big |
|---|---|---|
| Words omitted against Whisper (spans of 8 or more words) | 241 words, 6 reels | 43 words, 1 reel (`file-dbb362caf313`) |
| Median disagreement with Whisper | 2.5% | 3.7% |
| Reels under 5% disagreement | 33 of 42 | 29 of 42 |
| Reels over 15% | 5 | 2 (`instagram-DcLvlJaD8qa`, `instagram-DcPPit0vy6I`) |
| Opening sentence of `file-3ae132e72fd1` and `file-3b2138cf9a5b` | lost | present |
| Word timestamps | yes | no |

On the 8 reels used for the mitigation tests, Phonon-1-Big omitted 0 words (Phonon-2: 241). Whisper omitted
43 words against Big, all in the two noisy reels (`instagram-DcLvlJaD8qa` 8 words, `instagram-DcPPit0vy6I`
35 words). No engine is complete. The engines fail on different stretches, so coverage comes from combining them.

## Recommendation

Use Phonon-2 for word-level timestamps and verbatim disfluencies, and keep Whisper as the backstop:

1. Run Phonon on the full file, then fill every word-gap over 2 s from three offset chunked passes
   (about 4 seconds of extra decode per reel with the server running).
2. Compare the merged Phonon text against Whisper. Where Whisper has more than 8 words that Phonon lacks,
   insert Whisper's segment at its timestamps and mark it `engine: whisper` in the transcript.
3. Flag for manual listening any reel still above 15% disagreement (`instagram-DcPPit0vy6I` is one).

Phonon-2 alone is not safe as the only engine: two reels lose their opening sentence under every
configuration tried. Phonon-1-Big alone is not safe either (it skipped 43 words in one reel and has no word
timing). In the built ensemble, Phonon-1-Big is a coverage check that warns when it holds 8 or more words
the merged transcript lacks. It does not insert text, because its segments are about 29 s long and cannot
place a missing sentence in time.

## Effect on the Gender Wars reel notes (checked 2026-10-01, notes not changed)

The ensemble recovered missing words in two reels only (`instagram-DcPPit0vy6I`, 30 words, and
`instagram-DcLvlJaD8qa`, 8 words). Neither has a note in `ModernMisandry/the gender wars/social media
research/`. Eleven notes cite a `file-*` job and a twelfth (`reel_Dd110O6pMRz.md`) maps by shortcode.
For those twelve, the ensemble text differs from the note's Whisper text by 0 to 30 words each, and the
differences run in both directions:

- Ensemble improves: "Wholes" to "Holes" (`reel_Dd9AT1wReaS.md`), "bio essentialist" to "bioessentialist".
- Ensemble worsens: "exploited" to "floited" and "Men are shamed" to "and are shamed"
  (`reel_Dd4EXExhU4m.md`), "Hoosiers" to "Hoosier's" (`reel_DdwapUUg6mc.md`).
- Style only: "going to" to "gonna", "it's" to "is", numbers spelled out ("ninety plus percent").

No ground truth exists, so the ensemble cannot be called more accurate. It guarantees coverage. It does
not guarantee wording. Replacing the notes' transcripts wholesale would swap some correct words for
errors. A note should change only after someone listens to the disputed words.
