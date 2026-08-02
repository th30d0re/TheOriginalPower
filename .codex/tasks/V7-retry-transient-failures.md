# TASK V7 — Distinguish transient failures from permanent ones

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`.
Read `videolab/CONTRACT.md` first. 89 tests pass.

## Why

The watcher fired while the Apple container service was stopped after a reboot. It
extracted the URL correctly, failed the fetch, **marked the message seen anyway**,
and moved on. The link was then unreachable through DM ingest forever; recovery
required noticing the failure in a log and re-ingesting the URL by hand.

The recorded error also misdirects. It reads:

```
Instagram fetch likely failed because cookies are unavailable or stale. Run
`videolab cookies refresh ...` with Full Disk Access, then retry. Fetch detail:
Error: interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`.
```

The real cause — a stopped container service — appears only after a confident and
wrong claim about cookies. Anyone reading that chases the wrong problem.

## What to build

**1. Classify the failure.** Add a helper that decides whether a fetch error is
*transient* (infrastructure, retry will plausibly succeed) or *permanent* (this URL
will never work as-is). Match on the error text:

- Transient: `XPC connection error`, `apiserver is not running`, `container system
  start`, `Connection invalid`, `Operation not permitted` from the container CLI,
  connection reset / timeout / temporary DNS failures.
- Permanent: `Unsupported URL`, `Video unavailable`, `private`, `removed`, HTTP 404.
- Anything unrecognised counts as transient. A message re-tried once too often is a
  smaller problem than a link silently lost forever.

**2. Only advance the cursor on a permanent outcome.** A message whose URLs all
succeeded, or failed permanently, is marked seen. A message with any transient
failure is left unseen so the next watcher pass retries it. Guard against an endless
loop: track an attempt count per message id in the cursor file and stop retrying
after 5 attempts, recording that the message was abandoned.

**3. Order the error message by evidence, not by guess.** Lead with the actual
error the tool reported. Append the cookie hint **only** when the failure is
Instagram-specific and the text does not already point at the container service.
Never assert a cause the error text does not support.

**4. Surface it.** `ingest-dms` output already carries `succeeded` and `failed`;
add `retrying` for transient failures so a reader can tell "will try again" from
"gave up". Include the same counts in `watch status`.

## Exit criteria

- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- A test asserts an `XPC connection error` leaves the message unseen and reports it
  under `retrying`.
- A test asserts an `Unsupported URL` marks the message seen and reports it under
  `failed`.
- A test asserts a message is abandoned after the fifth attempt rather than retried
  forever.
- A test asserts the error text for a container-service failure does not lead with
  the cookie hint, and that an Instagram auth failure still does.
- Append a "Loop 7" section to `videolab/docs/V2-findings.md`.

## Constraints

Do not run `instagram-cli`, `launchctl`, `container`, or any network fetch — the
orchestrator verifies live. Never write DM text, usernames, or thread titles into
findings, fixtures, tests, or commit messages. Do not attempt `git commit`.
