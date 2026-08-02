# V3 Findings and Session Log

Model: GPT-5 Codex

Session started: 2026-08-01 22:44:27 EDT

## What Was Wrong / What Was Requested

TASK V3 requires a host-side Instagram DM ingestion stage, a six-tool FastMCP
stdio server, a Root Ledger framework-analysis prompt, isolated tests, and a
findings record. The implementation must use the authenticated
`instagram-cli` process without reading session files, preserve DM provenance,
deduplicate messages through a persistent cursor, and expose frame JPEGs as
bounded MCP image content.

The owned implementation paths are `videolab/src/videolab/instagram.py`,
`videolab/src/videolab/mcp_server.py`,
`videolab/prompts/framework_analysis.md`,
`videolab/tests/test_instagram.py`, and this file.

## How I Fixed It / What I Did

1. Read `videolab/CONTRACT.md`, the task specification, the shipped Instagram
   CLI skill and schemas, the production metadata example, and the Root Ledger
   system prompt source.
2. Confirmed that the worktree was clean and checked out on
   `agent/codex-V3` before making the first batch of changes.
3. Implemented a subprocess-only Instagram adapter. Every argument is a distinct
   argv element. Authentication uses `auth whoami`; inbox, message reads, and
   downloads use the documented JSON envelope.
4. Added schema-tolerant extraction for snake_case and camelCase identifiers,
   message collections nested under `thread.items`, captions, creator identity,
   share context, timestamps, and Instagram post permalinks.
5. Added atomic JSON writes for `dm.json`, `job.json`, and the persistent cursor.
   Cursor state advances after a successful media download and provenance write.
6. Added explicit read-state control. The ordinary message read omits
   `--mark-seen`; the argument is appended only when `mark_seen=True`.
7. Added isolated subprocess tests covering cursor idempotency, media and
   provenance output, default read-state preservation, explicit read-state
   mutation, thread resolution, and manual-login error guidance.
8. Added the FastMCP stdio server with six registered tools. Parallel V1 and V2
   boundaries use late imports or the documented CLI surface.
9. Added frame-index validation, job-root confinement, a default four-frame
   response, an eight-frame hard cap, JPEG base64 encoding, and Pillow downscaling
   to a maximum width of 1024 pixels.
10. Added the Root Ledger prompt with the source `SYSTEM` constant reproduced
    verbatim and a JSON analysis schema carrying Tier 2 and Tier 3 assignments.
11. Verified four Instagram tests under Python 3.11 and the voice environment.
    Verified that FastMCP 3.4.1 lists all six expected tools. Verified a generated
    2048-pixel-wide JPEG returns as MCP `ImageContent` at 1024 pixels wide.
12. Exercised `videolab_get_frames` through FastMCP's tool-call path with ten
    generated frames. The default response contained four image blocks and an
    explicit ten-index request was capped at eight image blocks.

## Challenges Encountered

1. The required Obsidian session-log directory is outside the writable
   worktree and conflicts with TASK V3's explicit prohibition on writes outside
   the worktree. This owned findings file contains the session record.
2. Parallel-task interfaces named in the contract are absent from this
   worktree, so MCP imports require guarded late binding.
3. The managed filesystem exposes the parent repository Git metadata read-only.
   Git cannot create `.git/worktrees/codex-V3/index.lock`; commit attempts fail
   with `Operation not permitted`.
4. The installed `instagram-cli` 1.5.0 rejects `--output json` on
   `auth whoami`. The authentication check therefore consumes only its exit code
   and diagnostic text.
5. The authenticated session for `@ejtheodore` is active. Live inbox inspection
   failed because the execution environment cannot resolve
   `i.instagram.com`. No live message data or session material was printed.
6. The shell provides `python3` and no `python` command. The exit suite ran with
   `python3` and the absolute `.venv-voice/bin/python` interpreter.

## Next Ideas (6 Ideas)

1. Add pagination across older inbox pages if the CLI exposes an inbox cursor.
2. Add contract fixtures captured from sanitized real CLI responses.
3. Add cursor compaction for accounts with very large DM histories.
4. Add atomic job-state transitions shared across all ingestion paths.
5. Add MCP integration tests using an in-memory FastMCP client.
6. Add image-response byte budgets alongside the frame-count cap.

## Contract Findings

### Shared-reel permalink

Live verification remains unavailable because the sandbox blocks DNS resolution
for `i.instagram.com`. The shipped `message-schema.json` enumerates top-level
keys and does not specify the nested `media` structure. The implementation checks
known `permalink`, `share_url`, `url`, and `link` fields recursively, accepts only
Instagram reel/post URLs, removes query parameters, and stores the result at
`dm.json.message.url` and `job.json.source.url`. The sanitized fixture proves this
path. A live payload may require one additional field mapping after network access
is available.

### Interface discrepancies and underspecification

1. TASK V3 describes JSON output for every CLI operation, while
   `instagram-cli auth whoami --output json` is unsupported in version 1.5.0.
2. The CLI skill documents camelCase summary fields. The raw schema enumerates
   snake_case fields. The adapter accepts both forms.
3. The contract's slug regular expression requires lowercase characters, while
   its Instagram examples preserve uppercase shortcode characters. The adapter
   calls V1's specified `slug_for(Source)` when available. Its isolated fallback
   emits lowercase filesystem slugs and preserves the case-sensitive Instagram
   shortcode in `job.json.source.id` and the canonical URL.
4. The MCP contract defines A1/A3 behavior without a programmatic V2 function
   signature. `videolab_ingest` and `videolab_doctor` invoke the documented
   `python -m videolab` CLI surface. `videolab_get_bundle` late-imports and calls
   the specified `report.render_bundle(slug)` function.
5. The task locates `.venv-voice` inside the worktree. The available environment
   is at the parent repository path. Validation used that interpreter directly.

## Final Status

Implementation completed on 2026-08-01. The final exit run reported four passing
tests, a clean Python compile, FastMCP 3.4.1 importing with exactly six registered
tools, no prohibited Instagram command, and `--mark-seen` confined to the
explicit opt-in branch and its assertions.

The branch commit could not be created. `git add` failed with:

```text
fatal: Unable to create '/Users/emmanuel/Documents/Theory/TheOriginalPower/.git/worktrees/codex-V3/index.lock': Operation not permitted
```

The managed sandbox grants read-only access to that Git metadata path. The five
owned deliverables remain present in the worktree and ready for staging when the
index becomes writable.
