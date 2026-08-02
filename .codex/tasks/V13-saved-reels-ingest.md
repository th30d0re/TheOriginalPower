# TASK V13 — Investigate and implement saved-reel ingest

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`.
Read `videolab/CONTRACT.md` first.

## Why

Ingest currently requires the owner to paste a link into his Instagram self-thread.
He already bookmarks reels worth analysing using Instagram's **Saved** feature, so
reading the saved collection would remove the DM step entirely and make "save it on
your phone" the whole gesture.

## What is already known — do not re-derive

- **yt-dlp cannot enumerate saved posts.** Its Instagram extractors are
  `InstagramIE`, `InstagramIOSIE`, `InstagramPlaylistBaseIE`, `InstagramStoryIE`,
  `InstagramTagIE`, `InstagramUserIE`. There is no saved or collection extractor.
  yt-dlp remains the right tool to *download* a reel once its URL is known.
- **`instagram-cli` 1.5.0 has no saved command.** Its verbs are `auth`, `chat`,
  `cleanup`, `config`, `feed`, `inbox`, `notify`, `profile`, `read`, `reply`, `send`,
  `stories`, `unsend`. The only "saved" references in its source concern saved
  *accounts*, not saved posts.
- A working Instagram cookie file exists at
  `~/.config/videolab/cookies/instagram.com.txt`, and `instagram-cli` holds a live
  authenticated session for `@ejtheodore`.

**Your sandbox has no network access.** Earlier loops in this project failed DNS to
`i.instagram.com`. Do not attempt live calls, and do not treat their failure as a
finding. Determine capability by reading source, then write code the orchestrator can
test live.

## 1. Investigate — this is the substance of the task

Read `~/Dev/Tools/instagram-cli/source/` and establish, with file and line citations:

1. How it authenticates and what client it uses to reach Instagram's private API
   (headers, app id, session handling).
2. Which endpoint would return the authenticated user's saved posts, and whether the
   session it already holds is sufficient to call it.
3. Whether saved *reels* are distinguishable from saved photos in that response, and
   whether the response yields a shortcode or permalink per item — a shortcode is what
   the videolab pipeline needs, since `parse_source` turns
   `instagram.com/reel/<shortcode>/` into a job.
4. Whether saved **collections** (named folders) are separately addressable.

Write this up in `videolab/docs/V13-findings.md` **before** writing implementation
code. If the honest conclusion is that no reliable route exists without a fork of
`instagram-cli`, say so plainly and stop there — that is a valid and useful outcome.

## 2. Implement, if the investigation supports it

Add `videolab saved [--limit N] [--collection NAME] [--dry-run]`.

- Enumerate saved items, keep those that are reels, and derive each shortcode.
- Build `https://www.instagram.com/reel/<shortcode>/` and run each through the
  **existing** URL pipeline — `parse_source`, container fetch, derive, ASR, report.
  Do not write a second ingest path; reuse `_run_post_fetch_pipeline`.
- Skip shortcodes that already have a job directory, so re-running is cheap and
  idempotent.
- `--dry-run` lists what would be ingested and fetches nothing. Make this the way the
  owner inspects his collection before committing to a batch.

**This command is manual only.** Do not wire it into the launchd watcher and do not
call it from `ingest-dms`. A saved collection contains items bookmarked for many
reasons; sweeping it automatically would ingest things the owner never meant to
analyse. The gesture must stay deliberate.

Reuse the cookie handling already in `containers.run_fetch`. Do not add a second
credential path, and do not copy the cookie anywhere new.

## Exit criteria

- `videolab/docs/V13-findings.md` answers the four investigation questions with
  citations, and states plainly whether implementation is viable.
- If viable: `python -m videolab saved --dry-run` runs and prints the shortcodes it
  would ingest, without network calls in tests.
- A test asserts `--dry-run` performs no fetch.
- A test asserts an already-present slug is skipped.
- A test asserts non-reel saved items are filtered out.
- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- Append a "Loop 13" section to `videolab/docs/V2-findings.md`.

## Constraints

Make no network calls. Do not install a launch agent or modify the existing one. Never
write DM text, usernames, thread titles, or any saved-post content into findings,
fixtures, tests, or commit messages — fixtures use invented shortcodes. Do not attempt
`git commit`; the orchestrator commits for you.
