# TASK V6 — Ingest video URLs pasted into the self-thread

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`.
Read `videolab/CONTRACT.md` first. 83 tests pass.

## Why

Natively-shared reels are unreachable. Instagram now delivers them as `xma_clip`,
which `instagram-cli` 1.5.0 does not support. Verified against the live account: the
message arrives as `itemType: "placeholder"` with `text: "[Unsupported Type:
xma_clip]"`, carrying no media payload, and `read --download` on it returns
`{"ok": false, "error": "Message does not contain media"}`.

The owner will paste the reel's **link** into his self-thread instead. That arrives
as an ordinary text message, which the client handles fine. So DM ingest needs to
recognise a video URL inside message text and route it through the existing
URL pipeline.

Direct uploads (`item_type: "media"`) already work and must keep working.

## What to build

**1. URL extraction.** In `instagram.py`, scan text-bearing messages for supported
video URLs. Reuse `slugs.parse_source` to decide whether a candidate is supported
rather than re-implementing host rules — it already covers instagram, x/twitter,
youtube, and tiktok, and raises `UnsupportedSourceError` otherwise. Extract every
URL in the message, not only the first; strip trailing punctuation that commonly
gets pasted alongside a link.

**2. Route to the public jobs root.** A pasted link points at a public post, so its
artifacts belong in the committed `jobs/` root, not `jobs-private/`. Do **not** write
`dm.json` for these — record only that the job arrived via the self-thread, as
`source.via = "self-dm"` plus the originating `message_id` and timestamp in the
`fetch` stage detail. No message text, no usernames, no thread title reaches a
committed file. Direct-upload DM jobs keep going to `jobs-private/` exactly as now.

**3. Fetch through the existing path.** These jobs run the normal container fetch
(`run_fetch`) followed by derive, ASR and report — the same `_run_post_fetch_pipeline`
already used elsewhere. Do not duplicate that logic.

**4. Fail one URL at a time.** Instagram fetches currently fail without cookies, and
cookie export is blocked on this machine. One unfetchable link must not abort the run
or lose the other links in the batch. Record the failure in that job's `fetch` stage
with `status: "error"` and a message that names the likely cause and the remedy
(`videolab cookies refresh --browser safari --domain instagram.com`, which needs Full
Disk Access), then continue to the next URL. Return both the succeeded and failed
slugs so the caller can report honestly.

**5. Cursor.** Mark a text message seen once its URLs have been attempted, so the
15-minute watcher does not retry a permanently failing link forever. A URL that
failed should appear in the result as failed rather than silently vanishing.

## Exit criteria

- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- A test asserts a text message containing an Instagram reel URL with a `?igsh=`
  query produces a job whose slug carries the shortcode with case preserved.
- A test asserts a message with two URLs produces two jobs.
- A test asserts a message with no URL produces none, and that
  `[Unsupported Type: xma_clip]` specifically yields none.
- A test asserts a failing fetch records `status: "error"` on that job and still
  processes a second, healthy URL in the same batch.
- A test asserts URL-sourced jobs land in the public root and write no `dm.json`,
  while direct-upload jobs still land in `jobs-private/`.
- Append a "Loop 6" section to `videolab/docs/V2-findings.md`.

## Constraints

Do not run `instagram-cli`, `launchctl`, or any network fetch — the orchestrator does
live verification. Never write DM text, usernames, or thread titles into findings,
fixtures, tests, or commit messages; fixtures use invented values. Do not attempt
`git commit`; the orchestrator commits for you.
