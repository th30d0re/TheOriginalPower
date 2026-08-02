# TASK V2 — Loop 2: fix the ASR repetition loop

Your loop-1 work is committed on `agent/codex-V2`. This is a follow-up on the same
branch. Read `.codex/tasks/V2-container-fetch-asr.md` for the original scope and
`videolab/CONTRACT.md` §7 for the output contract.

## The defect

`videolab/src/videolab/asr.py::_mlx_transcribe` calls:

```python
mlx_whisper.transcribe(str(audio_path), path_or_hf_repo=model, verbose=None)
```

It passes no decoding guards, so the model falls into a repetition loop. Verified
end to end against a committed fixture:

```
ffmpeg -nostdin -y -i supporting_material/instagram_reels/reel_DZe71fExaH3.mp4 \
       -vn -ac 1 -ar 16000 /tmp/vl-asr-full/media/audio.wav      # 160.1s
transcribe(audio, job_dir)                                       # 44 segments, 15.6s
```

Segment 44 spans `00:02:39,880 --> 00:02:40,140` — **0.26 seconds** — and contains
`"to be continued"` followed by `"to process"` repeated roughly one hundred times.
Word count inflates from 404 (committed reference) to 620. Everything before
segment 44 is correct and measurably better than the committed Whisper-small
reference, which is why this is the only thing to fix.

A transcript is the primary input to framework analysis. A hundred repetitions of a
two-word phrase corrupt that input and waste the model's context, so this blocks
the pipeline.

## Required fix

**1. Pass decoding guards in `_mlx_transcribe`.** `condition_on_previous_text=False`
is the primary control — carrying prior text into the next window is what seeds the
loop. Also pass the temperature fallback schedule and the threshold pair that let
Whisper retry a degenerate window: `temperature=(0.0, 0.2, 0.4, 0.6, 0.8, 1.0)`,
`compression_ratio_threshold=2.4`, `no_speech_threshold=0.6`. Confirm each keyword
against the installed `mlx_whisper` signature before using it; drop any the version
does not accept rather than guessing.

**2. Add a post-decode degenerate-segment filter.** Decoding guards reduce these
loops without eliminating them, so filter as well. A segment is degenerate when its
text, after normalization, consists of one short n-gram (1–4 words) repeated more
than 5 times, or when its word count divided by its duration in seconds exceeds a
plausible speech rate (use 12 words/second as the ceiling — real speech peaks near
4). Drop degenerate segments from all four outputs and record the count in the
`asr` stage `detail` in `job.json` as `dropped_segments`. Silent data loss is worse
than the bug; the count has to be visible.

**3. Apply the same filter to the `_openai_transcribe` fallback path.** It has the
identical failure mode.

## Exit criteria

- Re-running the fixture above yields a transcript with **no repeated-phrase tail**,
  and a word count within 10% of the committed 404-word reference in
  `supporting_material/instagram_reels/reel_DZe71fExaH3.txt`.
- The corrections that already beat the reference survive: the transcript still
  contains `within` (not `with an`), `fracturing` (not `for acturing`), and
  `tawakkul` (not `to what could`). These prove the filter removed only the garbage.
- A unit test feeds a synthetic degenerate segment through the filter and asserts it
  is dropped and counted, with no network and no model load.
- `job.json` records `dropped_segments`.
- `python -m pytest videolab/tests/ -q` passes under
  `/Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python` with
  `PYTHONPATH=videolab/src`.
- Append a "Loop 2" section to `videolab/docs/V2-findings.md`.

## Constraints

Unchanged from loop 1. You own only `asr.py`, `videolab/tests/`, and
`V2-findings.md` in this loop. Do not touch `slugs.py`, `report.py`,
`derive_job.py`, `instagram.py`, or `mcp_server.py`. Do not attempt `git commit` —
the sandbox denies writes to `.git/worktrees/`; the orchestrator commits for you.
