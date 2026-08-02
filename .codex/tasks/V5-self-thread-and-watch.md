# TASK V5 — Self-thread default and the DM watcher

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`.
Read `videolab/CONTRACT.md` first. All videolab loops are merged; 71 tests pass.

## Why

DM ingest works but is unusable as designed. `ingest_dms` sweeps the entire inbox,
so a test run pulled a video out of a 27-person group chat the owner never intended
to analyse. The owner's intent is narrow and explicit: **he shares a reel to himself
on Instagram, and only those become jobs.**

Second gap: nothing runs on a schedule, so a reel shared from his phone sits
untouched until someone manually invokes the tool. He wants it already processed by
the time he sits down.

## 1. Default to the self-thread

The self-thread is structurally identifiable. In `instagram-cli inbox --output json`
the account's own note-to-self thread is the **only** thread whose `users` array is
empty — every 1:1 has exactly one other user and every group has two or more.
Verified against the live inbox: 20 threads, exactly one with `users == []`, titled
with the account holder's own display name.

Implement `find_self_thread(...)`:

1. Prefer the single thread with an empty `users` array.
2. If that is ambiguous (zero matches, or more than one), fall back to matching the
   thread title against the authenticated account's display name or username from
   `instagram-cli auth whoami`.
3. If still ambiguous, raise a clear error naming the candidates by thread id — **not
   by title**, since titles are other people's names.

Change `ingest_dms` so its default scope is the self-thread alone. Keep the existing
`thread` parameter for targeting a specific thread by id. Add `all_threads: bool =
False` as an explicit opt-in that restores the old sweep, and surface it as
`--all-threads` on the CLI and as a parameter on the `videolab_ingest_dms` MCP tool.
Default off in all three places.

## 2. CLI subcommands

`cli.py` currently registers `doctor`, `ingest`, `list`, and `cookies`. Add:

```
python -m videolab ingest-dms [--limit N] [--thread ID] [--all-threads] [--mark-seen]
python -m videolab watch install [--interval-minutes 15]
python -m videolab watch uninstall
python -m videolab watch status
```

`ingest-dms` must run the **full pipeline** on each new DM job — derive, ASR, report
— not just the download. Reuse the same stage-recording path `ingest()` uses; factor
the shared portion rather than duplicating it. Right now DM jobs stop after download
and never get a transcript, which is the whole point.

## 3. The watcher

`watch install` writes `~/Library/LaunchAgents/com.videolab.dmwatch.plist` and loads
it with `launchctl bootstrap gui/$UID` (falling back to `launchctl load` on older
macOS). Requirements:

- `StartInterval` from `--interval-minutes`, default 15 minutes.
- `ProgramArguments` invokes the repo's `.venv-voice/bin/python -m videolab
  ingest-dms` with `PYTHONPATH` set via `EnvironmentVariables`, using absolute paths
  resolved at install time.
- `RunAtLoad` false — do not fire a network job the instant it is installed.
- `StandardOutPath` / `StandardErrorPath` to `videolab/logs/dmwatch.{out,err}.log`.
  Create `videolab/logs/` and gitignore it.
- **Never** pass `--all-threads` or `--mark-seen` in the generated plist. The
  unattended path stays narrow and read-only.

`watch status` reports whether the agent is loaded, its interval, the last run time
from the log, and the current job count. `watch uninstall` bootouts and removes the
plist, and is safe to run when nothing is installed.

A scheduled job that fails silently is worse than none: on failure, `ingest-dms` must
write the error to the log and exit non-zero, never hang. Give the instagram-cli
subprocess calls a timeout so a network stall cannot wedge the agent.

## Exit criteria

- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- A test asserts self-thread selection picks the empty-`users` thread from a stubbed
  inbox containing 1:1 and group threads.
- A test asserts the ambiguous case raises rather than guessing.
- A test asserts `ingest_dms` defaults to the self-thread and only sweeps when
  `all_threads=True`.
- A test asserts the generated plist contains neither `--all-threads` nor
  `--mark-seen`, and carries the expected interval.
- `python -m videolab watch status` runs cleanly when nothing is installed.
- Append a "Loop 5" section to `videolab/docs/V2-findings.md`.

## Constraints

Do **not** run `instagram-cli`, install the launch agent, or call `launchctl` — the
orchestrator does live verification. Never print DM contents, thread titles, or
usernames into findings, fixtures, tests, or commit messages; fixtures use invented
names. Do not attempt `git commit`; the orchestrator commits for you.
