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
