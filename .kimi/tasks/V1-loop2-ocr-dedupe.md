# TASK V1 — Loop 2: OCR dedupe misses garbled repeats

Your loop-1 work is committed as `c450a04` on `agent/kimi-V1`. This is a follow-up on
the same branch. 40/40 tests pass and the frame/audio pipeline is correct; this loop
fixes one algorithm and one edge case.

## The defect

Run against a real committed reel:

```bash
mkdir -p ~/vl-derive-test/media
cp supporting_material/instagram_reels/reel_DZe71fExaH3.mp4 ~/vl-derive-test/media/video.mp4
python3 videolab/incontainer/derive_job.py --job ~/vl-derive-test --frames 12
# → {"ok": true, "frames": 12, "ocr_rows": 12, "ocr_kept": 5, ...}
```

The clip has **one** burned-in caption for its entire 160 seconds. Five rows survived:

```
  0.00 KEPT     conf=80.8  'resistaniie as a Muslim in this Universe'
 14.00 KEPT     conf=93.7  'Becoming a vessel of zero resistance as a Muslim in this universe'
 30.00 dup->2   conf=94.2  'Becoming a vessel of zero resistance as a Muslim in this universe'
  …    dup->2   (five more clean repeats correctly caught)
116.00 KEPT     conf=92.5  'resistance as a Muslim in this Universe'
130.00 KEPT     conf=87.2  'F f Becoming a vessel of zero resistance as a Muslim in this universe'
146.00 KEPT     conf=95.3  'vessel of zero S a Muslim in this Universe'
160.00 KEPT     conf= 0.0  ''
```

Every one of those is the same caption. The clean repeats were caught; the partial
and garbled OCR reads of the identical caption were not. `SequenceMatcher.ratio() ≥
0.92` is too strict when tesseract reads part of a caption, drops leading words, or
inserts noise like `'F f '`.

The result is a bundle that shows a model five near-identical captions instead of
one. That is the failure this stage exists to prevent.

## Required fix

**1. Switch to token-set containment.** Tokenize the normalized text into a set of
words. Two rows are duplicates when

```
|A ∩ B| / min(|A|, |B|)  ≥  0.80
```

Verify against the case above — every garbled row resolves to a duplicate:

| row | ∩ | min | ratio |
|---|---|---|---|
| `'resistaniie as a Muslim in this Universe'` | 6 | 7 | 0.857 |
| `'resistance as a Muslim in this Universe'` | 7 | 7 | 1.000 |
| `'vessel of zero S a Muslim in this Universe'` | 8 | 9 | 0.889 |

Keep the existing `SequenceMatcher ≥ 0.92` check as well and treat a row as a
duplicate when **either** test fires. Sequence ratio still catches reorderings that
token containment misses.

Guard the short-string case: require at least 3 tokens on both sides before applying
containment, otherwise a two-word caption matches almost anything.

**2. Compare against every kept row, not only the last one.** Captions alternate —
A, B, A, B — and last-kept-only re-keeps A on every return. Set `duplicate_of` to
the `frame_index` of the **first** kept row that matches.

**3. Choose the best variant as canonical.** When a later row duplicates an earlier
kept row and is a *better* read (more tokens, or equal tokens and higher
`mean_conf`), the kept row should be the better text. Simplest correct approach: run
selection in two passes — cluster rows first, then elect one canonical row per
cluster and mark the rest `duplicate_of` that row's index. In the case above the
canonical row is the full `'Becoming a vessel of zero resistance as a Muslim in this
universe'`, not the truncated `'resistaniie …'` that happened to come first.

**4. Empty and low-confidence rows must never read as kept.** The `160.00` row has
`text: ""`, `mean_conf: 0.0`, and `duplicate_of: null`, so
`render_bundle()`'s `duplicate_of is None` filter renders it as a blank line. Add an
explicit `"kept": true|false` field to every `ocr.jsonl` row, set it `false` for
empty or `mean_conf < 40` rows and for all duplicates, and have `render_bundle()`
filter on `kept` instead. Keep writing `duplicate_of` — it stays useful for audit.

## Exit criteria

- The command above yields `"ocr_kept": 1` for `reel_DZe71fExaH3.mp4`, and the single
  kept row carries the full caption text, not a truncated variant.
- A unit test encodes the exact five strings above and asserts one survivor with the
  full text. No ffmpeg, no tesseract, no network — feed the rows in as data.
- A unit test covers the alternating A/B/A/B case and asserts two survivors.
- A unit test asserts a 2-token row does not match an unrelated 2-token row.
- Every `ocr.jsonl` row carries `kept`; `render_bundle()` filters on it.
- `pytest videolab/tests/ -q` passes.
- Append a "Loop 2" section to `videolab/docs/V1-findings.md`.

## Note on your loop-1 findings

Your finding 1 was right and the contract is now fixed on `main` — slug ids preserve
case. Your finding 3 (tier pre-fill) was also right that §8 and the reference file
disagree; the contract stands as written, `platform_metrics` is Tier 2 when metrics
are present. Both are settled; no action needed.

## Constraints

Unchanged from loop 1. You own `derive_job.py`, `report.py`, and
`videolab/tests/` in this loop. Do not touch `slugs.py` logic, and do not touch any
file owned by V2 or V3 (`config.py`, `containers.py`, `cookies.py`, `asr.py`,
`cli.py`, `fetch_job.py`, `instagram.py`, `mcp_server.py`, the Containerfile).
Commit to `agent/kimi-V1` when the exit criteria pass.
