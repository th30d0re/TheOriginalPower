# TASK V14 — Four silent failures, each of which already cost real work

Every bug below fired in production during one session on 2026-08-21 and none of
them announced itself. The common defect is the same: **a check that reports
success without verifying the thing it claims.** Fix the checks, not just the
symptoms.

Each fix needs a regression test that fails against current `main`.

---

## Bug 1 — `done` without a file on disk (highest cost)

**Where:** `tools/chapter_audio_dive.py`, `next_pending()` (~line 215).

```python
st = state.get(str(unit["n"]), {})
if st.get("status") == "done":
    continue
```

**What happened:** 19 generated `.m4a` files (1.8 GB) disappeared from
`Paper/research/chapter_deep_dives/audio/`. `audio_state.json` still marked all
19 `done` with valid `audio_path` values. A plain resume would have generated the
remaining 21 and left 19 permanent gaps while reporting complete success.

**Fix:** a unit counts as `done` only when its `audio_path` exists on disk and is
at least 100 KB — the same threshold `process_unit` already uses at its
early-return. If the state says `done` and the file is missing, treat the unit as
pending. `print_status` must surface the discrepancy explicitly (e.g. a
`done (file missing)` count) rather than folding it into `done`.

Recovery is cheap and must stay cheap: when `artifact_id` is present,
`process_unit` already skips `audio create` and re-downloads. Do not break that
path — it is what made recovering the 19 cost zero generation quota.

---

## Bug 2 — `videolab doctor` reports auth OK against a dead session

**Where:** `videolab/src/videolab/cli.py:409`

```python
instagram_ok, instagram_lines = _run_lines(["instagram-cli", "auth", "whoami"])
```

**What happened:** `doctor` reported
`instagram_auth: {"ok": true, "detail": "Currently active account: @ejtheodore"}`
while **every** authenticated endpoint returned `403 login_required`. The DM
watcher failed every 15 minutes for days behind a green health check.

`auth whoami` reads local configuration. It returns exit 0 and prints the
configured account whether or not the session still authenticates.

**Fix:** probe an endpoint that actually requires authentication (for example
`instagram-cli inbox --limit 1`) and report `ok: false` when the response
contains `login_required` or a 403, with a detail line naming the remedy.
Keep it to one cheap call — `doctor` must stay fast. Preserve the existing
account-name detail on success.

Audit the rest of `doctor` for the same pattern: any probe that checks
*configuration* while claiming to check *capability*.

---

## Bug 3 — non-video DM media written to `video.mp4`, then pending forever

**Where:** `videolab/src/videolab/instagram.py:628`

```python
video_path = job_dir / "media" / "video.mp4"
```

**What happened:** five DM-sourced jobs sat at `derive=pending` indefinitely.
Their payloads:

| Job (truncated) | Actual content |
|---|---|
| `…32920925` | JPEG, 176 KB |
| `…32964446` | **WebP**, 208 KB |
| `…32582495` | JPEG, 156 KB |
| `…32798038` | no media at all (empty `frames/`) |
| `…32938997` | JPEG, 68 KB |

The name is hardcoded regardless of what was downloaded, and `MEDIA_ITEM_TYPES`
lets non-video items through. `derive` cannot run on a JPEG, so the job never
advances and is indistinguishable from a real backlog.

**Fix, two parts:**

1. **Detect the real type** after download (magic bytes; do not trust the
   extension or the DM item type) and store it under a correct filename.
2. **Terminal state, not `pending`.** A job whose media is not video must reach
   an explicit terminal status — `skipped` with a reason such as
   `not_video: image/jpeg`, or an equivalent already in the schema. `pending`
   must mean "work remains", never "will never run". A job with no media at all
   is also terminal, with its own reason.

Then reconcile the five existing jobs listed above into the new terminal state so
`videolab list` stops showing a phantom backlog. Do not delete them.

---

## Bug 4 — `cookies refresh` cannot reach a real Chrome profile

**Where:** `videolab/src/videolab/cookies.py:17` and `cli.py:476`

```python
if not browser or any(char not in "abcdefghijklmnopqrstuvwxyz0123456789_-+" for char in browser.lower()):
    raise ValueError(f"invalid browser name: {browser!r}")
```

and `refresh_cookies` calls `extract_cookies_from_browser(browser)` with no
profile argument.

**What happened:** yt-dlp's `chrome` path is
`~/Library/Application Support/Google/Chrome`, which holds no cookie database on
this machine. The live profile is
`~/Library/Application Support/Google/Chrome Canary/Default`. The validator
rejects any string containing a space or colon, so no CLI invocation can reach
it. Safari is unreadable by macOS design regardless of Full Disk Access — its
own error message says so. The export had to be done by calling yt-dlp directly.

**Fix:** add `--profile PATH` to `cookies refresh`, thread it through
`refresh_cookies` into `extract_cookies_from_browser(browser, profile=...)`.
Keep the browser-name validator as it is; validate the profile separately as a
filesystem path that must exist. Preserve every security property currently in
that function: `0o700` on the directory, `0o600` on the file, write-to-temp then
atomic `os.replace`.

**Also make the export verify what it exported.** A jar containing
`csrftoken`/`datr`/`mid` but no `sessionid` is a *logged-out* browser, and
exporting it produces a file that looks valid and authenticates nothing — this
happened today and cost two rounds of debugging. Warn loudly when
domain-appropriate session cookies are absent (for `instagram.com`: `sessionid`
and `ds_user_id`).

---

## Hard constraints

- Do NOT run any `git` command.
- Do NOT edit `Paper/` except `Paper/research/chapter_deep_dives/audio_state.json`
  if Bug 1's reconciliation requires it — and never delete a `.m4a`.
- Do NOT touch `systemic_arbitrage/`.
- Do NOT weaken the container isolation in `containers.py` — derive runs with
  DNS denial, dropped capabilities and a read-only root, and keeps no cookie
  mount. Bug 3's fix must not introduce one.
- Do NOT commit cookies, session files, or any credential to the repo.

## Verify

```bash
make videolab-test
PYTHONPATH=videolab/src .venv-voice/bin/python -m videolab doctor
python3 tools/chapter_audio_dive.py --status
```

All existing tests pass plus your new ones. `doctor` must still return in a few
seconds. `--status` must report 40 units with counts that match what is actually
on disk.

## Report

`videolab/docs/V14-findings.md`: what each root cause turned out to be, the test
that now catches it, and anything you found while auditing for the same pattern
elsewhere. If a fix is riskier than it looks, say so rather than shipping it
quietly.
