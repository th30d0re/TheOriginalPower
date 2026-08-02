# TASK V2 Findings and Session Log

Model: GPT-5 Codex

## What Was Requested

Implement TASK V2 according to `videolab/CONTRACT.md`, verify every available exit criterion, and commit the result on `agent/codex-V2`.

## Constraint Findings

- The required Obsidian log path is outside the worktree. TASK V2 forbids every write outside the worktree, so this owned findings file carries the session record.
- The source tree has no packaging metadata. Direct repository execution requires `PYTHONPATH=videolab/src`; the README states this explicitly. Packaging metadata belongs in a later integration change because TASK V2 limits file ownership.
- The committed `reel_DZe71fExaH3.wav` is 35.09 seconds and contains about 90 spoken words. Its adjacent reference `.txt` contains 404 words and continues beyond the WAV. The generated transcript matches the speech present in the WAV, including the opening discussion of zero resistance, divine attributes, low entropy, superpositions, rigid sine waves, and external triggers.
- `--asr container` appears in the required CLI grammar while the task explicitly removes Whisper and Torch from the image and assigns Stage C to the host. The CLI accepts the grammar and returns an actionable error before creating a job when `container` is selected.

## Work Performed

1. Adapted the reference Apple Containerization image to Python 3.11, ffmpeg, Tesseract, and yt-dlp. Removed every Torch and Whisper image dependency.
2. Implemented Stage A1 with one `extract_info(download=True)` call, complete source-info persistence, deterministic media placement, a single JSON stdout result, stderr progress, and stage-state updates.
3. Implemented fetch and derive argv assembly. Fetch mounts the host cookie directory read-only when a cookie is available. Derive uses DNS denial, drops all capabilities, uses a read-only root and `/tmp` tmpfs, and carries no cookie mount.
4. Implemented host cookie export with protected directory permissions, atomic replacement, mode `600`, validated domains, and argv-based subprocess invocation.
5. Implemented host ASR with MLX as the primary engine, OpenAI Whisper as the fallback, normalized segments, all four contract outputs, and the actual engine in `job.json`.
6. Implemented doctor, ingest, list, and cookie-refresh CLI commands plus local-file Stage A3 copying and relative job paths.
7. Added focused configuration, fetch-integrity, and container security-boundary tests. All 13 tests pass. The fetch fixture proves one extraction call, a preserved long description, and a missing view count stored as `null`.
8. Ran doctor against the local machine. It reports the inaccessible container service and names `container system start`. It reports the unavailable Metal device, live Instagram authentication, and cookie inventory without reading cookie values.
9. Exercised the committed WAV through the OpenAI Whisper fallback and verified `transcript.txt`, `.srt`, `.vtt`, and `.json`.

## Challenges Encountered

1. The managed sandbox rejects `container system status`, `container system start`, and `container build` with `Operation not permitted`. Image construction could not execute in this environment.
2. The managed sandbox denies writes to the shared Git worktree index. Git cannot create `.git/worktrees/codex-V2/index.lock`, which prevents both the pre-edit checkpoint and final commit.
3. MLX 0.31.2 imports from `.venv-voice` but raises `No Metal device available` in the headless sandbox. The required OpenAI Whisper fallback completed successfully.
4. Resolving the `.venv-voice/bin/python` symlink removed Python's virtual-environment context. Preserving the symlink path restored access to MLX packages.
5. The reference transcript is longer than the committed WAV, so verification used the speech covered by the WAV duration.
6. The public-URL container fetch could not run because the same sandbox denial prevents the worker image from building or starting. The network-free fetch test exercised the entrypoint with a yt-dlp-compatible fake.

## Next Ideas (6 Ideas)

1. Add integration fixtures for every supported URL platform.
2. Add image provenance labels after the first production build.
3. Add a generated JSON Schema for `job.json`.
4. Add cancellation-safe stage execution.
5. Add structured stage timing metrics.
6. Add an end-to-end test with a local HTTP fixture server.

## Loop 2 — ASR Repetition Guard

### Work Performed

1. Confirmed the installed `mlx-whisper` 0.4.3 `transcribe` signature directly from its source. It accepts `condition_on_previous_text`, `temperature`, `compression_ratio_threshold`, and `no_speech_threshold`.
2. Disabled conditioning on previous text and supplied the six-step temperature fallback schedule, compression-ratio threshold 2.4, and no-speech threshold 0.6.
3. Added a shared post-decode filter for MLX and OpenAI Whisper results. It drops segments composed entirely of a 1–4 word phrase repeated more than five times or containing more than 12 normalized words per second.
4. Rebuilt transcript text from retained segments before writing TXT, JSON, SRT, and VTT outputs.
5. Added `dropped_segments` to the ASR stage detail and the command result summary.
6. Added network-free tests for decoder arguments, both filter criteria, all output formats, job metadata, retained correction terms, and the OpenAI fallback path.

### Validation Notes

- Importing `mlx_whisper` still fails in the managed headless sandbox with `No Metal device available`; signature verification used the installed 0.4.3 source file.
- The synthetic regression retains `within`, `fracturing`, and `tawakkul` while removing the repeated tail from every output.
- A full 160.1-second fixture run through the OpenAI fallback produced 399 words, 1.2% below the 404-word reference. The output contains `within`, `fracturing`, and `tawakkul`, ends cleanly after `tawakkul`, and contains no repeated-phrase tail. The clean fallback decode reported zero dropped segments.
- The complete `videolab/tests/` suite passes: 17 tests in 0.13 seconds under the required `.venv-voice` interpreter and `PYTHONPATH=videolab/src`.

## Loop 3 — Resource Caps, Cookie Isolation, and Make Targets

### Work Performed

1. Added adjustable `--max-height` and `--max-filesize` fetch arguments, defaulting to 1080 and 2G.
2. Applied the height cap to the yt-dlp format selector and converted the size guard to bytes for `max_filesize`.
3. Recorded both effective fetch caps in the fetch-stage detail throughout pending, success, and error states.
4. Replaced the cookie-directory bind mount with a read-only mount of the selected cookie file.
5. Added `videolab-image`, `videolab-doctor`, and `videolab-test` root Makefile targets.
6. Extended network-free tests to assert the capped selector, 2 GiB guard, and isolated cookie mount.

### Validation Notes

- The full suite and exact Make target pass with a temporary link to the shared `.venv-voice` environment.
- The Makefile image target was inspected without building the container, preserving the task's validation scope.

## Loop 4 — Private DM Job Root

### What Was Requested

Keep every DM-sourced job local by routing it to an entirely ignored private job root. Preserve
the committed public root for URL- and file-sourced jobs. Support discovery and report rendering
across both roots while retaining path-traversal protections.

### Work Performed

1. Added `private_jobs_dir` with `VIDEOLAB_PRIVATE_JOBS_DIR` support and enforced mode `0700`.
2. Routed default Instagram DM ingestion and the MCP DM entrypoint to `jobs-private/`.
3. Updated report and MCP slug resolution to search `jobs/` before `jobs-private/`.
4. Updated CLI and MCP inventories to include both roots with an explicit `private` boolean.
5. Ignored the complete private root and documented the personal-data rule in the contract.
6. Moved the existing DM-sourced job by exact path without reading or printing its contents.
7. Added regression coverage for private default ingestion, dual-root report resolution, dual-root
   MCP lookup, privacy markers, and symlink traversal escapes from each root.

### Challenges Encountered

1. The required Obsidian session-log directory is outside the managed writable sandbox. This
   findings section records the implementation session within the task-owned documentation.
2. Explicit report roots must retain test control while supporting the sibling private root.
3. Root lookup had to preserve public-first precedence and validate resolved paths independently
   against the root that supplied each candidate.

### Validation Notes

- The complete required suite passes: 71 tests in 2.43 seconds under the specified interpreter.
- `git diff --check` passes.
- The private `dm.json` path matches the whole-directory ignore rule.
- `git status --short videolab/` reports no entry under `jobs-private/`.
- `git log --all --oneline -- 'videolab/jobs*'` returns no commits.
- No Instagram CLI command ran during this loop.

### Next Ideas (6 Ideas)

1. Add duplicate-slug diagnostics when the same slug exists in both roots.
2. Add a CLI filter for public-only or private-only inventory output.
3. Add startup diagnostics for unsafe private-root permissions.
4. Add platform-neutral tests for filesystems without symlink support.
5. Add a migration command for future provenance-policy changes.
6. Add a schema-level provenance-to-root consistency validator.

## Loop 5 — Self-Thread DM Watcher

### What Was Requested

Restrict default DM ingestion to the authenticated account's self-thread, provide an explicit
whole-inbox opt-in, run every new DM job through derive, ASR, and report, and add a macOS launchd
watcher with install, uninstall, and status commands.

### Work Performed

1. Added `find_self_thread`, which selects the unique empty-`users` thread and uses authenticated
   display-name or username matching when the structural signal is ambiguous.
2. Changed `ingest_dms` to select the self-thread by default. The `all_threads` parameter restores
   the inbox sweep, and explicit thread targeting accepts a thread id.
3. Added a 60-second timeout and clear timeout and missing-command errors to every default
   `instagram-cli` subprocess invocation.
4. Factored derive, ASR, and report into one shared post-fetch pipeline and applied it to URL,
   file, and newly downloaded DM jobs.
5. Added `ingest-dms` and `watch` command trees to the module CLI. DM scope and read-state changes
   remain explicit flags.
6. Added launchd plist generation and watcher install, uninstall, and status operations. The plist
   uses absolute Python and source paths, a configurable interval, `RunAtLoad` disabled, and
   repository-local output and error logs.
7. Added `all_threads` to the MCP DM tool and ignored the watcher log directory.
8. Added isolated coverage for structural and fallback self-thread selection, ambiguity errors,
   default and whole-inbox scopes, full DM pipeline dispatch, CLI parsing, safe plist content,
   watcher installation, and absent-agent status and uninstall behavior.

### Challenges Encountered

1. The installed `instagram-cli` version emits `auth whoami` as text. Account-name extraction
   accepts its text form and a future JSON envelope.
2. launchd state and plist state are separate inputs. Status reads the installed plist for its
   interval and queries launchd only when that plist exists.
3. The required Obsidian session-log path remains outside the managed writable sandbox. A temporary
   session log was maintained under `/tmp`.

### Validation Notes

- The required complete suite passes: 81 tests in 2.24 seconds under the specified interpreter.
- `python -m videolab watch status` returns a clean unloaded status under an isolated empty home.
- `git diff --check` passes.
- No Instagram CLI command or launchctl command ran during implementation or validation.
- No launch agent was installed, removed, or loaded.

### Next Ideas (6 Ideas)

1. Add a watcher health command that reports the last successful and failed run separately.
2. Add bounded retry metadata for jobs whose derive or ASR stage fails.
3. Add a lock file to prevent overlapping scheduled runs on slow videos.
4. Add rotation limits for watcher stdout and stderr logs.
5. Add schema fixtures for future `auth whoami` JSON output.
6. Add a dry-run command that reports the selected self-thread id without reading its messages.

## Loop 6 — Video URLs in Self-Thread Text

### What Was Requested

Recognize supported video URLs pasted into self-thread text messages, route them to the public
job root, run the normal URL pipeline, isolate fetch failures per URL, and retain direct-upload
DM behavior in the private root.

### Work Performed

1. Added generic HTTP URL candidate extraction and delegated platform validation to
   `slugs.parse_source`, preserving case-sensitive platform ids and removing share queries.
2. Created text-URL jobs under `jobs/` with `source.via = "self-dm"` and limited fetch-stage
   provenance containing the originating message id and timestamp.
3. Kept direct-upload jobs, media downloads, and `dm.json` under `jobs-private/`.
4. Routed public text-URL jobs through `run_fetch` and the shared post-fetch pipeline.
5. Recorded actionable Instagram cookie failures per job and continued with remaining URLs.
6. Reported complete, succeeded, and failed slug groups from the CLI command.

### Challenges Encountered

1. Fetch-stage updates from the container replace stage detail, so the host restores the limited
   self-thread provenance after each fetch attempt.
2. The required Obsidian session-log directory is outside the writable sandbox.
3. Live Instagram, network, and launch service commands remained outside validation scope.

### Validation Notes

- Added isolated tests for URL extraction, public routing, minimized provenance, cursor behavior,
  direct-upload privacy, failure recording, and batch continuation.
- No `instagram-cli`, `launchctl`, or network fetch command ran during implementation.

### Next Ideas (6 Ideas)

1. Add URL deduplication within one message while retaining source order.
2. Add structured fetch error categories alongside operator-facing remedies.
3. Add cursor transaction recovery for interruption between staging and fetch.
4. Add mixed supported and unsupported URL coverage in one message.
5. Add public-job collision diagnostics for links previously ingested elsewhere.
6. Add watcher summaries that retain recent partial-batch outcomes.
