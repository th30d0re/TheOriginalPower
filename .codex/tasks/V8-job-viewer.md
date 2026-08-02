# TASK V8 — A visual viewer for videolab job artifacts

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`.
Read `videolab/CONTRACT.md` first. 95 tests pass.

## Why

Every job currently ends as JSON, JSONL, and loose transcript files. Reading a
`_metadata.json` by eye to see what a reel said is miserable, and the frames sit in
`media/frames/` where nothing ever looks at them. The owner wants to *see* a job.

## What to build

`videolab site build [--out videolab/site/index.html] [--include-private]`

One **self-contained HTML file**. No CDN, no external stylesheet, no separate asset
files — frames are inlined as base64 data URIs and all CSS/JS is inline. The file
must open correctly from `file://` and survive being moved elsewhere.

Read every job under `config.jobs_dir`. Include `config.private_jobs_dir` **only**
when `--include-private` is passed; it is off by default because those jobs carry
DM provenance. Mark any private job clearly in the UI when included.

### Page structure

A left rail listing jobs (newest first) — each row showing platform, creator handle,
duration, and a stage-health dot. Selecting one shows its detail in the main pane.
Plain client-side JS, no framework.

### Per-job detail, in this order

1. **Header** — creator display name and `@handle`, platform, duration, posted date,
   source URL as a real link, and the slug in monospace.
2. **Stage strip** — four pills (fetch, derive, asr, report) coloured by status:
   ok, skipped, pending, error. On error, show the recorded message; it is the first
   thing someone debugging needs.
3. **Engagement** — likes, comments, plays, views. Render a missing metric as `—`,
   never as `0`. That distinction is load-bearing: a real zero and an unknown are
   different facts, and conflating them is the exact bug this pipeline was built to
   stop repeating.
4. **Transcript** — segments from `transcript.json` with `[MM:SS]` timestamps in a
   left gutter, text right. Fall back to `transcript.txt` as one block when segments
   are unavailable. Include a copy-to-clipboard control.
5. **On-screen text** — rows from `ocr.jsonl` where `kept` is true, each with its
   timestamp and mean confidence. State the deduplication plainly, e.g.
   "1 of 8 frames kept after dedupe", so a reader understands the filtering rather
   than assuming OCR found only one thing.
6. **Frames** — a responsive grid from `frames.json`, each captioned with its
   timestamp and whether it was selected by `scene` or `interval`. Clicking one
   opens it larger. Downscale to 640px wide at JPEG quality 80 before embedding;
   full-resolution frames would make the page enormous.
7. **Framework analysis** — when `framework_notes` holds any non-empty value, render
   each key as a labelled section: extraction kernel, buffer class, psychological
   wage, snubber circuits, and the three mappings. Render `content_analysis`
   (primary theme, secondary themes, rhetorical frame, key moments with timestamps)
   above it. When these are empty scaffolds, show a quiet "not yet analysed" state
   rather than empty headings.
8. **Tier classification** — as small labelled badges, with the justification text.

### Design

Dark and light via `prefers-color-scheme`. System font stack. Generous line-height
on transcript text — it is the thing people actually read. Restrained colour: one
accent, status colours only on the stage pills. Content column capped around 70ch
for readability. Responsive down to a phone width, since this may be viewed on one.

Any prose you write into the template follows `AGENTS.md`: direct affirmative
declarative statements.

## Safety

Every value rendered originates in an untrusted source — captions, transcripts, OCR
text, and creator names all come from third-party media. **Escape all of it.** Build
the DOM with `textContent` or escape before interpolation; never assign
attacker-influenced strings to `innerHTML`. A caption containing `<script>` must
display as text. Add a test asserting that.

Source URLs are rendered as links: allow only `http` and `https` schemes so a
crafted `javascript:` URL cannot execute.

## Deliverables

| File | Purpose |
|---|---|
| `videolab/src/videolab/site.py` | Generator |
| `videolab/tests/test_site.py` | Tests |
| CLI wiring for `site build` | |
| `videolab/.gitignore` | add `site/` |

`videolab/site/` must be gitignored: the generated file embeds frame images, and
media never enters git.

## Exit criteria

- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- `python -m videolab site build` produces one HTML file that references no external
  URL. Assert this in a test by scanning the output for `http://` and `https://`
  outside of anchor hrefs.
- A test asserts a job whose creator name contains `<script>alert(1)</script>`
  renders escaped.
- A test asserts a missing engagement metric renders as `—` and a genuine `0`
  renders as `0`.
- A test asserts private jobs are excluded by default and included with the flag.
- Append a "Loop 8" section to `videolab/docs/V2-findings.md`.

## Constraints

Do not run `instagram-cli`, `launchctl`, `container`, or any network fetch. Do not
modify the pipeline modules — `slugs.py`, `report.py`, `derive_job.py`,
`fetch_job.py`, `asr.py`, `containers.py`, `instagram.py` — beyond the CLI wiring
needed for the new subcommand. Never write DM text, usernames, or thread titles into
findings, fixtures, or tests; fixtures use invented values. Do not attempt
`git commit`.
