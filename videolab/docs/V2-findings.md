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
