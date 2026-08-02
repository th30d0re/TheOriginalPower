# TASK V4 — Keep DM-sourced jobs out of git

You are working in the worktree on branch `agent/codex-V2`, which has been reset to
current `main` (all three loops merged). Read `videolab/CONTRACT.md` first.

## Why

Live DM ingest was run against the real `@ejtheodore` session. It downloaded a video
from a group chat named "UDFC" and wrote `dm.json` containing **27 participant
usernames**, sender IDs, message text, and timestamps.

The layout decision for `videolab/` is "everything commits except media", so those
artifacts would enter git history — and this repository has an `origin` remote.
Committing other people's private group-chat metadata is not acceptable, and no
redaction layer is trustworthy enough to rely on for this.

The owner's decision: **DM-sourced jobs stay local-only. URL- and file-sourced jobs
keep committing as designed.**

## Approach

Use two job roots rather than conditional ignore rules. Git cannot ignore by file
content, and a single root would depend on a pattern staying correct forever.

| Root | Sources | Git |
|---|---|---|
| `videolab/jobs/` | `url`, `file` | committed except `media/` |
| `videolab/jobs-private/` | `dm` | ignored entirely |

A whole ignored directory cannot be committed by accident, which a per-file rule can.

## Changes

**1. `config.py`** — add `private_jobs_dir` beside the existing `jobs_dir`
(`config.py:66`), defaulting to `<root>/jobs-private`, overridable with
`VIDEOLAB_PRIVATE_JOBS_DIR`. Create it with mode `0o700`.

**2. `instagram.py`** — `DEFAULT_JOBS` (`instagram.py:19`) points at
`jobs-private`. `ingest_dms` writes there. Keep the `jobs_root` parameter so tests
stay in control.

**3. `report.py`** — `_default_jobs_root()` (`report.py:85`) and
`render_bundle(slug, jobs_root=None)` (`report.py:392`) resolve a slug by checking
`jobs/` first, then `jobs-private/`. A caller asking for a slug by name should get
it wherever it lives; only *git* distinguishes the roots.

**4. `mcp_server.py`** — `_jobs_root()` (`mcp_server.py:42`) gains a private
counterpart. `videolab_list_jobs` returns jobs from both roots, each row carrying
`"private": true|false` so a reader can tell which are local-only. Slug and frame
path resolution must accept both roots while keeping the existing traversal guard:
a resolved path must stay inside whichever root it matched. Do not weaken that check
— reread `mcp_server.py:66` and `:134` before editing.

**5. `cli.py`** — `list` covers both roots and marks private rows. `ingest` keeps
using the public root; DM ingest is the only private-root writer.

**6. `videolab/.gitignore`** — add `jobs-private/`.

**7. `videolab/CONTRACT.md`** — document both roots in §2 and state the rule: DM
provenance carries third-party personal data and never enters git.

**8. Migrate the existing job.** `videolab/jobs/instagram-32938997257084586231511541081964544/`
is DM-sourced and currently untracked. Move it to `videolab/jobs-private/`. Do not
delete it and do not read its contents into your output.

## Exit criteria

- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- A test asserts `ingest_dms` writes under the private root by default.
- A test asserts `render_bundle` resolves a slug from either root.
- A test asserts the traversal guard still rejects `../` escapes for both roots.
- `git status --short videolab/` shows nothing under `jobs-private/`, and
  `git check-ignore -v videolab/jobs-private/<any>/dm.json` reports the rule.
- `git log --all --oneline -- 'videolab/jobs*'` returns nothing — confirming no DM
  artifact was ever committed.
- Append a "Loop 4" section to `videolab/docs/V2-findings.md`.

## Constraints

Never print, log, or copy DM contents — usernames, message text, thread titles — into
findings, commit messages, test fixtures, or tool output. Fixtures use invented
names. Do not run `instagram-cli` at all in this loop; the behaviour is already
verified live. Do not attempt `git commit`; the orchestrator commits for you.
