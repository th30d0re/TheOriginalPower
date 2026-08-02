# TASK V2 — Loop 3: format cap, cookie mount scope, Makefile targets

Loop 2 is committed on `agent/codex-V2` and verified: 399 words against the 404-word
reference, similarity 0.9714, no repetition tail. This loop closes three gaps found
while running the pipeline end to end.

## 1. The fetch stage has no format cap

`videolab/incontainer/fetch_job.py:67` sets `"format": "bv*+ba/b"`. Measured, in the
built container:

```bash
container run --rm -m 4G -v $J:/job videolab-worker:latest \
  python3 /app/fetch_job.py --job /job --url "https://www.youtube.com/watch?v=aqz-KE-bpKQ"
# → media/video.mp4  =  743 MB, 3840x2160
```

Nothing downstream uses that resolution. ASR reads a 16 kHz mono audio track, and OCR
reads frames where 1080p is already past the legibility ceiling for burned-in
captions. `media/` is gitignored, so oversized downloads accumulate silently until
the disk fills.

**Fix.** Cap the selector at 1080p with graceful degradation, keeping reel quality
intact since reels are vertical and rarely exceed it:

```
bv*[height<=1080]+ba/b[height<=1080]/bv*+ba/b
```

Add a `--max-height` argument defaulting to 1080 so the cap is adjustable, and add a
`--max-filesize` guard (default `2G`) passed through to yt-dlp's `max_filesize`, so a
mis-pasted link to a long video fails fast instead of filling the disk. Record the
effective cap in the fetch stage `detail` in `job.json`.

Add a unit test asserting the built `ydl_opts` carries the height cap and the
filesize guard, using the existing fake-YoutubeDL pattern in `test_containers.py`.
No network.

## 2. The cookie mount is directory-wide

`containers.py::fetch_argv` mounts `cookie_file.parent`, so a YouTube fetch can read
`instagram.com.txt` and every other cookie file in `~/.config/videolab/cookies/`.
`videolab/CONTRACT.md` §2 specified the directory, so this followed the contract —
the contract was too loose.

**Fix.** Mount only the single cookie file the fetch actually needs:

```
--mount type=bind,source=<cookie_file>,target=/cookies/<name>,readonly
```

Then a fetch for one platform cannot read another platform's session. Update the
existing `test_fetch_mounts_cookie_directory_read_only` test to assert the mount
source is the **file**, not the parent, and that no sibling cookie file is reachable.
Keep the derive-stage assertion that no cookie mount exists at all.

## 3. Makefile targets are missing

The plan called for them and no loop was assigned the root `Makefile`. Add these
targets, following the style of the existing `arbitrage-*` and `venv-*` targets:

| Target | Behaviour |
|---|---|
| `videolab-image` | `container build -f videolab/containerfiles/Containerfile.worker -t videolab-worker:latest videolab/` |
| `videolab-doctor` | `.venv-voice/bin/python -m videolab doctor` with `PYTHONPATH=videolab/src` |
| `videolab-test` | `.venv-voice/bin/python -m pytest videolab/tests/ -q` with `PYTHONPATH=videolab/src` |

Use `.venv-voice` — it already carries `fastmcp`, `mlx`, `mlx-whisper`, `Pillow`, and
`yt-dlp`, and it is the interpreter the MCP server runs under. Do not create a new
venv. Do not touch any other Makefile target; `make pdf` and the LaTeX targets are
manuscript infrastructure and out of scope.

## Exit criteria

- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- The fetch test asserts both the 1080 height cap and the filesize guard.
- The cookie test asserts a single-file mount.
- `make videolab-test` runs from the repo root.
- Append a "Loop 3" section to `videolab/docs/V2-findings.md`.

## Constraints

You own `fetch_job.py`, `containers.py`, the root `Makefile`, `videolab/tests/test_containers.py`,
and `V2-findings.md` in this loop. Do not touch `slugs.py`, `report.py`,
`derive_job.py`, `instagram.py`, or `mcp_server.py` — other agents own those and one
is still running. Do not attempt `git commit`; the sandbox denies writes to
`.git/worktrees/` and the orchestrator commits for you. Do not run `make pdf` or any
LaTeX target.
