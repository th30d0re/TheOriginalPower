# Videolab derive frame-boundary fix

Model: GPT-5 Codex

Updated `videolab/incontainer/derive_job.py` to clamp selected frame timestamps to 0.10 seconds before the probed media duration. This preserves `spread_cap()` tail retention while keeping the final seek inside the video stream. Frame extraction now also verifies that FFmpeg created a non-empty image; any extraction error is logged and that frame is omitted while derivation continues and writes `frames.json`.

Verification on `instagram-DbqRsFGMTYs`:

- Before: 11 frame images and no `frames.json`.
- After direct derive: 12 frame images, 12 entries in `frames.json`, and the last frame extracted at 161.91 seconds.
- `videolab/tests/test_derive.py`: 13 passed.
- The requested end-to-end ingest command could not run because the local container service and `container system start` both returned `Operation not permitted`. Consequently, `job.json` stage statuses could not be verified in this environment and remain pending.
