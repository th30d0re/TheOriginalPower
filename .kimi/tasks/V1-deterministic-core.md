# TASK V1 — Deterministic Core (videolab)

You are working in a dedicated git worktree on branch `agent/kimi-V1`. Commit your
work to that branch. Do not switch branches. Do not touch `main`.

## Context

Read these first, in order:

1. `videolab/CONTRACT.md` — **the authority.** Sections 3, 6, 8, 9, 10 are yours.
   Where your judgement and the contract disagree, implement the contract.
2. `supporting_material/instagram_reels/reel_DZtCPIRPT87_metadata.json` — the metadata
   schema you are reproducing. Read the whole file before writing `report.py`.
3. `supporting_material/instagram_reels/reel_DZtCPIRPT87.md` — the markdown you are
   reproducing, including its "Data Sources (Mode Labels)" table.
4. `AGENTS.md` — project rules. The rhetorical constraint applies to every line of
   prose your code emits into `.md` files.

## Objective

Build the three pure-Python pieces of videolab: source identification, the derive
stage, and report rendering. Everything you write is deterministic and offline. No
network, no containers, no credentials, no LLM calls.

## Deliverables — you own these files and no others

| File | Contract § |
|---|---|
| `videolab/src/videolab/slugs.py` | 3 |
| `videolab/incontainer/derive_job.py` | 5, 6 |
| `videolab/src/videolab/report.py` | 8, 9, 10 |
| `videolab/tests/test_slugs.py` | |
| `videolab/tests/test_derive.py` | |
| `videolab/tests/test_report.py` | |
| `videolab/tests/fixtures/*` | |
| `videolab/docs/V1-findings.md` | |

Do not create or edit `config.py`, `containers.py`, `cookies.py`, `asr.py`, `cli.py`,
`instagram.py`, `mcp_server.py`, `fetch_job.py`, the Containerfile, or the root
`Makefile`. Other agents own those and are working in parallel.

## The three things that actually matter

**1. OCR dedupe (`derive_job.py`).** This is the highest-value part of the task.
Burned-in captions persist across dozens of consecutive frames. Without dedupe the
OCR channel is near-pure repetition and useless as model input. Implement exactly
the rule in CONTRACT.md §6: normalize (casefold, collapse whitespace, strip
non-alphanumerics), compare against the last **kept** row with
`difflib.SequenceMatcher.ratio()`, mark `duplicate_of` at ratio ≥ 0.92. Mark, never
drop — every frame gets a row. Test it with a synthetic sequence of near-identical
caption strings and assert exactly which rows survive.

**2. Never reproduce the three upstream bugs (CONTRACT.md §8).** A missing view
count is `null`, never `0`. Descriptions are stored in full, never truncated to 200
chars. These bugs are why the committed metadata says `"play_count": 0` with an
apologetic note and why a stored hashtag reads `"#equa..."`. Write a test asserting
a missing count serializes as `null` and a 5000-char description round-trips intact.

**3. Empty scaffolds stay empty.** `content_analysis`, `framework_notes`, and
`tier_classification` are emitted as empty structures for a model to fill later.
`videolab` never invents interpretation. Pre-fill only the mechanical tier
judgements described in §8.

## Frame selection detail

Union of scene-change frames and a fixed-interval floor, sorted by timestamp,
renumbered from 1. When over the `--frames N` cap, keep an **even spread across the
duration** rather than truncating the tail — the end of a reel is usually where the
claim lands. Test this: given 40 candidates and a cap of 12, assert the kept
timestamps span the full duration.

## Testing

`ffmpeg` and `tesseract` are installed on the host, so `derive_job.py` is directly
testable. Generate fixture clips rather than committing binaries:

```bash
ffmpeg -f lavfi -i testsrc=duration=6:size=320x240:rate=10 -pix_fmt yuv420p /tmp/vl_test.mp4
```

Never download anything in a test. Pure-logic units (dedupe, frame-cap spreading,
slug parsing, schema emission) must be tested without invoking ffmpeg at all —
factor them so they take data, not file paths.

## Hard constraints

1. Never write outside your worktree.
2. Never modify `Paper/` — manuscript source.
3. `derive_job.py` runs inside a Linux container with **stdlib only** — no `pip`
   packages. It shells out to `ffmpeg` and `tesseract`. It writes only under `/job`,
   emits exactly one JSON line on stdout as its final action, sends progress to
   stderr, and exits 0 or 1 (CONTRACT.md §5).
4. All paths written into JSON artifacts are **relative to the job directory**.
   Absolute paths leak the operator's home directory into committed files.
5. Python 3.11, `from __future__ import annotations`, type hints on public functions.
6. No wall-clock and no randomness in any output.

## Exit criteria

- `python -m pytest videolab/tests/ -q` passes.
- `python3 videolab/incontainer/derive_job.py --job <dir>` on a fixture clip produces
  `media/audio.wav` at 16 kHz mono, `frames.json`, and `ocr.jsonl`, and prints one
  valid JSON line.
- `report.py` round-trips: a hand-built job directory renders a
  `<slug>_metadata.json` whose top-level keys match CONTRACT.md §8 in order, and a
  `<slug>.md` structurally comparable to `reel_DZtCPIRPT87.md`.
- `render_bundle()` returns markdown containing only non-duplicate OCR rows.
- `videolab/docs/V1-findings.md` records anything in the contract you found
  underspecified or wrong.

## Environment

```bash
python3 -m venv /tmp/vl-v1 && /tmp/vl-v1/bin/pip install pytest
/tmp/vl-v1/bin/python -m pytest videolab/tests/ -q
```

Do not create a venv inside the repo. Do not run `make`. Do not run `git` commands
other than `git add` / `git commit` on your own branch.
