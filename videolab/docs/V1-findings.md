# V1 Findings — Deterministic Core

Contract points that were underspecified or internally inconsistent, and the
decision implemented in each case. Per CONTRACT.md, the contract was
implemented as written wherever it is unambiguous; the entries below record
where judgement filled a gap.

## 1. §3 slug regex contradicts the §4 example slug

§3 states slugs match `^[a-z0-9][a-z0-9._-]{0,95}$`, but §4's own example is
`instagram-DZtCPIRPT87`, which contains uppercase letters. Instagram
shortcodes and YouTube video ids are case-sensitive; lowercasing them breaks
the mapping back to the source URL.

**Decision:** `slug_for()` preserves the platform id verbatim. The regex is
treated as a constraint on the slug's character set (no whitespace, no
slashes, bounded length), not on case. `slugs.py` carries a comment saying so.

## 2. §8 key list does not match the reference file it says to mirror

§8 says to reproduce the shape of `reel_DZtCPIRPT87_metadata.json`, then lists
top-level keys that the reference file does not have (`id`, `slug`, `ocr`,
`frames`, `dm_provenance`), in an order the reference file does not use, and
omits keys the reference file has (`reach_note`).

**Decision:** the explicit §8 key list and order are authoritative (the exit
criteria test it). `reach_note` is dropped — §8 also removes the apology-note
convention it belongs to.

## 3. §8 tier pre-fill disagrees with the reference file

The reference file classifies `platform_metrics` as `"Tier 3"`; §8 instructs
that machine-generated fields (`transcript`, `ocr`, `platform_metrics`) are
`"Tier 2"` and interpretive fields `"Tier 3"`.

**Decision:** contract wins. `platform_metrics` is pre-filled `"Tier 2"`.

## 4. §6 scene/interval union tie-break is unspecified

When a fixed-interval timestamp lands on (or next to) a scene-change
timestamp, the contract does not say which candidate survives.

**Decision:** interval candidates within 0.25 s of a scene candidate are
dropped and the scene candidate carries the frame (`selected_by: "scene"`).
The window is the module constant `COINCIDENCE_WINDOW`.

## 5. §6 interval floor start point is unspecified

"Every `--min-interval` seconds" does not say whether the floor includes
`t = 0`.

**Decision:** the floor includes `0.0`, so the opening frame is always a
candidate.

## 6. §6 audio command fails on the §7-style silent fixture clip

The suggested test fixture (`ffmpeg -f lavfi -i testsrc=...`) produces a clip
with no audio stream, and the §6 audio command (`ffmpeg ... -vn ...`) fails on
it with "Output file does not contain any stream". Real reels carry audio, so
the derive command is kept exactly as the contract specifies.

**Decision:** tests generate the fixture with an added `sine` audio track. If
stage A ever delivers a silent video, stage B exits 1 with a clear error; a
silence-fallback would fabricate an ASR input and was rejected.

## 7. Tesseract stderr is not valid UTF-8 on some error paths

Leptonica error messages can contain raw non-UTF-8 bytes (observed: `0xff`
bytes in `fopenReadStream` errors). Strict `text=True` decoding in
`subprocess.run` turns a tool error into a `UnicodeDecodeError`.

**Decision:** `derive_job.py` captures bytes and decodes with
`errors="replace"`.

## 8. Leptonica refuses to open images through symlinked path components

On macOS, tesseract cannot open `/tmp/...` paths because `/tmp` symlinks to
`/private/tmp` ("failed to open locally with tail ..."). This cost a full
debug cycle during exit-criteria verification.

**Decision:** `derive_job.py` resolves the job directory (`Path.resolve()`)
before use. Only resolved paths reach subprocesses; every path written into
JSON artifacts stays relative to the job directory, so no absolute-path leak
is introduced.

## 9. §8 `ocr` / `frames` / `dm_provenance` value shapes are unspecified

The key list names these keys without describing their values.

**Decision:** `ocr` is `{"total_rows", "kept_rows", "rows"}` with the full
`ocr.jsonl` row list; `frames` is the `frames.json` frame list verbatim;
`dm_provenance` is the parsed contents of `dm.json` or `null`.

## 10. `parse_source()` handles `url` and `file`; `dm` is constructed, not parsed

§3's `Source.kind` includes `"dm"`, but no string syntax for a DM source is
defined anywhere in the contract.

**Decision:** `parse_source()` accepts URLs and local paths. Stage A2 (V3)
constructs `Source(kind="dm", ...)` directly; `slug_for()` already covers it.

# Loop 2 — OCR dedupe

Loop 2 replaced the §6 dedupe algorithm (last-kept-only, `SequenceMatcher ≥
0.92`) with two-pass clustering and token-set containment, per
`.kimi/tasks/V1-loop2-ocr-dedupe.md`. The decisions below record where the
loop-2 brief left room for judgement.

## L2.1 §6 still documents the loop-1 algorithm

The contract text (§6, §10) describes last-kept-only ratio matching and
consumers filtering on `duplicate_of is null`. The loop-2 brief supersedes
both, but `CONTRACT.md` is owned by another loop and was not edited.

**Decision:** `derive_job.py` implements the brief (containment `≥ 0.80` with
a 3-token floor, or ratio `≥ 0.92`; clusters compared against every cluster,
not the last kept row; every `ocr.jsonl` row carries an explicit `kept`
flag). `report.py` filters on `kept`. This entry records the contract drift
for the contract owner.

## L2.2 Canonical election ignores single-character tokens

The brief defines "better read" as more tokens, or equal tokens and higher
`mean_conf`. Applied to raw token counts, the garbled superset
`'F f Becoming a vessel ...'` (12 tokens) beats the clean full caption
`'Becoming a vessel of zero resistance as a Muslim in this universe'`
(11 tokens), while the brief names the clean full caption as the expected
canonical.

**Decision:** `_election_score()` counts content tokens (length ≥ 2) and
breaks ties on `mean_conf`. Single-character tokens are OCR noise
(`'F f ...'`, `'... zero S ...'`); they still count for containment, where
ignoring them would weaken matching. On `reel_DZe71fExaH3.mp4` this elects
the clean full caption (`mean_conf` 96.3) as the single kept row.

## L2.3 Cluster matching compares against the canonical-so-far

The brief requires comparing against every kept row; with two-pass clustering
the cluster representative is the canonical-so-far, updated on each election.

**Decision:** a new row joins the first cluster whose canonical-so-far it
matches. Near-duplicate chains (A matches B, B matches C, A does not match C)
would split into two clusters; no such chain appears in the verified reels,
and the alternative (compare against every member) merges unrelated captions
through a bridge row more readily.
