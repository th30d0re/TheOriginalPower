# TASK V2 — Container Orchestration, Fetch, ASR, CLI (videolab)

You are working in a dedicated git worktree on branch `agent/codex-V2`. Commit your
work to that branch. Do not switch branches. Do not touch `main`.

## Context

Read these first, in order:

1. `videolab/CONTRACT.md` — **the authority.** Sections 2, 4, 5, 7 are yours.
   Where your judgement and the contract disagree, implement the contract.
2. `~/Dev/tulu/external/URL-to-Text/Python_MVP/deploy/Containerfile.video-mcp` and
   `deploy/run-apple-container-video-mcp.sh` — a working Apple Containerization
   setup for exactly this workload. Adapt it; do not start from scratch.
3. `~/Dev/tulu/external/URL-to-Text/Python_MVP/src/video_downloader.py` — the prior
   fetch implementation. It contains three bugs you must not reproduce (below).
4. `AGENTS.md` — project rules. The rhetorical constraint applies to your README.

## Objective

Build the orchestration spine: the container image, the argv assembly that runs
stages inside it, the yt-dlp fetch stage, host-side Metal transcription, and the CLI
that drives all of it.

## Deliverables — you own these files and no others

| File | Purpose |
|---|---|
| `videolab/containerfiles/Containerfile.worker` | image: python:3.11-slim + ffmpeg + tesseract-ocr + yt-dlp |
| `videolab/incontainer/fetch_job.py` | Stage A1, runs in container (CONTRACT §5) |
| `videolab/src/videolab/config.py` | paths, defaults, env resolution |
| `videolab/src/videolab/containers.py` | `container run` argv assembly + execution |
| `videolab/src/videolab/cookies.py` | host cookie export |
| `videolab/src/videolab/asr.py` | Stage C, host MLX |
| `videolab/src/videolab/cli.py`, `__main__.py` | `python -m videolab …` |
| `videolab/requirements.txt`, `videolab/README.md` | |
| `videolab/tests/test_containers.py`, `test_config.py` | |
| `videolab/docs/V2-findings.md` | |

Do not create or edit `slugs.py`, `report.py`, `derive_job.py`, `instagram.py`, or
`mcp_server.py`. Other agents own those and are working in parallel.

## Dependency note

`slugs.py` (V1, kimi) and `instagram.py` / `mcp_server.py` (V3, codex) are being
written in parallel and do not exist in your worktree. **Do not block on them and do
not write them.** Import against the signatures in CONTRACT.md §3 and stub what you
need for tests:

```python
try:
    from videolab.slugs import parse_source, slug_for
except ImportError:  # V1 not merged yet
    ...
```

Record any signature mismatch you hit in `V2-findings.md`.

## The three bugs you must not reproduce

From `src/video_downloader.py` in the tulu project. These corrupted the committed
metadata in `supporting_material/instagram_reels/`:

1. **`:142` defaults `view_count` to `0`.** That is the actual origin of
   `"play_count": 0` plus a hand-written "likely a scraping artifact" note in
   `reel_DZtCPIRPT87_metadata.json`. A missing count is `null`. `0` is a real value
   meaning zero.
2. **`:143` truncates descriptions at 200 chars and appends `"..."`,** which is why
   a stored hashtag list literally ends `"#equa..."`. Persist the complete raw
   yt-dlp info dict to `source.info.json`, unmodified.
3. **`validate_url()` and `download_video()` each run a full `extract_info`,**
   doubling network hits against platforms that rate-limit aggressively. Exactly
   **one** `extract_info(download=True)` per fetch.

## Container specifics — verified against `container` CLI v1.0.0

`container run` supports `-v/--volume`, `--mount type=bind,source=,target=,readonly`,
`--no-dns`, `--cap-drop`, `--read-only`, `--tmpfs`, `--rm`, `-m`, `-c`. It has **no
`--network none`**; do not invent that flag.

- both stages: `--rm -m 4G -v <jobdir>:/job`
- A1 fetch adds `--mount type=bind,source=<cookiedir>,target=/cookies,readonly`
- B derive adds `--no-dns --cap-drop ALL --read-only --tmpfs /tmp` and **no cookie
  mount** — that stage parses attacker-controlled media bytes and carries no
  credentials of any kind.

Say plainly in the README that this is DNS-denial plus dropped capabilities, not a
sealed network namespace. Do not describe it as a stronger sandbox than it is.

**Drop torch and whisper from the image entirely** — transcription moved to the host.
That takes the tulu image from multi-GB to a few hundred MB.

`container system status` currently reports `apiserver is not running` on this
machine. Detect that and emit an actionable error naming `container system start`.

## Stage C — ASR on the host

`mlx-whisper` into `.venv-voice`, which already carries `mlx` 0.31.2 and
`mlx-metal`. Default model `mlx-community/whisper-large-v3-turbo`. Emit
`transcript.txt/.srt/.vtt/.json` matching the file set already in
`Paper/research/video_transcripts/transcripts/`. Fall back to the `openai-whisper`
already on `PATH` when MLX is unavailable, and record which engine ran in
`job.json`.

## CLI surface

```
python -m videolab doctor
python -m videolab ingest <url|path> [--frames N] [--no-ocr] [--asr host|container]
python -m videolab list
python -m videolab cookies refresh --browser safari --domain instagram.com
```

`doctor` checks: container service reachable, image present, ffmpeg and tesseract
present inside the image, MLX importable, `instagram-cli auth whoami` (report only —
V3 owns that integration), cookie files and their ages.

`cookies refresh` wraps `yt-dlp --cookies-from-browser`, writing to
`~/.config/videolab/cookies/<domain>.txt` at mode `600` — **outside the repo**. Never
write a cookie file under `videolab/`; one `git add -f` away from leaking a live
session.

## Testing

`test_containers.py` must assert argv assembly without invoking `container`: that the
derive stage carries `--no-dns` and `--cap-drop`, that it carries **no** cookie
mount, and that the fetch stage mounts cookies read-only. That is the security
boundary and it needs a regression test.

## Hard constraints

1. Never write outside your worktree.
2. Never modify `Paper/` — manuscript source.
3. Never commit or print a cookie value or session token.
4. Never `git checkout --`, `git reset`, or rewrite history.
5. Python 3.11, `from __future__ import annotations`, type hints on public functions.
6. Tests never touch the network.
7. Do not run `make pdf` or any LaTeX target.

## Exit criteria

- `container build -f videolab/containerfiles/Containerfile.worker -t videolab-worker:latest videolab/` succeeds.
- `python -m videolab doctor` runs and reports honestly on a machine where the
  container service may be stopped.
- `python -m pytest videolab/tests/test_containers.py videolab/tests/test_config.py -q` passes.
- `fetch_job.py --job <dir> --url <public URL>` writes `source.info.json` with the
  complete info dict, `media/video.mp4`, and prints one JSON line.
- `asr.py` transcribes `supporting_material/instagram_reels/reel_DZe71fExaH3.wav`
  (already committed) and the result is recognizably the same speech as
  `reel_DZe71fExaH3.txt`.
- `videolab/docs/V2-findings.md` records anything in the contract you found
  underspecified or wrong.
