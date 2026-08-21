# TASK V16b — The speech agent must run the Apple-signed `swift`, not a binary

Follow-up to `.codex/tasks/V16-speech-agent-and-deep-dm-scan.md`, which is merged
in the working tree. **Part B (the watcher deep scan) is correct and verified —
do not touch it.** Part A's central design decision was wrong, and the mistake
was in the brief you were given, not in your implementation of it.

## What is wrong

V16 told you to run `swift build -c release` and point the plist at the compiled
binary. That is exactly what breaks the feature.

Verified on the machine after installing your agent:

```json
{"ok": true, "installed": true, "loaded": true,
 "health": {"ok": true, "available": false,
   "reason": "Siri Voice 2 is not visible to this process. Siri voices are gated
   by code signature: an ad-hoc-signed binary sees 180 voices and no Siri, while
   Apple-signed swift sees 190 including it."}}
```

Signatures confirm it:

- `/usr/bin/swift` → `Authority=macOS Software Signing`, `Identifier=com.apple.dt.xcode_select.tool-shim-public`
- `.build/out/Products/Release/siri-speech` → `Signature=adhoc`, `TeamIdentifier=not set`

**This was already documented in this repository** — `videolab/docs/V12-findings.md`
opens with "The big discovery: Siri voices are gated by the calling binary's
signature", and tabulates `swift script.swift` (Apple-signed) seeing 190 voices
and resolving "Voice 2". Read that file before you start.

The helper's own `/health` already detects and explains the condition. It is the
only reason this was caught.

## Fix 1 — run the interpreter under launchd

`ProgramArguments` must invoke the Apple-signed shim on the source:

```
/usr/bin/swift <repo>/videolab/siri-speech/Sources/main.swift
```

`/usr/bin/swift` is inside launchd's minimal `PATH` (`/usr/bin:/bin:/usr/sbin:/sbin`),
so the shim itself resolves. It still needs an active developer directory to find
a toolchain. Determine at install time what that requires — `DEVELOPER_DIR`, or
`xcode-select -p` being valid — and pin whatever is needed into the plist's
`EnvironmentVariables`, exactly as `build_watch_plist` already pins `PATH` for
`instagram-cli`. **Do not assume it works; verify the agent actually serves after
install.**

Startup now includes a compile, so it is slower than a prebuilt binary. That is
acceptable and is the price of Siri access. `KeepAlive` and `RunAtLoad` stay.

Drop the `swift build -c release` step and the install-time build failure path,
or keep the build only as an optional pre-flight *syntax* check that never
becomes the thing launchd runs. Do not leave a stale `.build/` product that a
future reader could mistake for the deployed artifact.

## Fix 2 — `ok` must not be true when the feature is unavailable

The status above reports top-level `"ok": true` while `available` is `false`.
The agent is loaded and the HTTP server answers, but Siri Voice 2 — the entire
point of the helper — is not usable. That is the same defect class this project
spent the day removing: a green check sitting on top of a degraded service.

Top-level `ok` must require **installed AND loaded AND health.ok AND
health.available**. When `available` is false, surface the helper's own `reason`
string in the status output so the cause is visible without a second command.

Apply the same rule to the `speech_helper` entry in `videolab doctor`.

## Reinstall cleanly

An agent from the previous design is currently installed and loaded as
`com.videolab.speech` (visible in `launchctl list`). Installing must unload and
replace it, not stack a second copy.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT modify `videolab/siri-speech/Sources/main.swift` — its voice detection
  and its `reason` message are correct and are what caught this.
- Do NOT change Part B of V16 (`--all-threads` / `--limit` in the watch plist).
  It is verified working and emits
  `['…python','-m','videolab','ingest-dms','--all-threads','--limit','50']`.
- Do NOT modify `Paper/`, `systemic_arbitrage/`, or `website/`.
- Tests must use temporary home directories and must not install, load, or
  unload any real launchd agent.

## Verify

```bash
make videolab-test
```

All existing tests pass plus new ones asserting: `ProgramArguments` invokes
`/usr/bin/swift` against `Sources/main.swift`, and `ok` is false when
`available` is false even though installed, loaded and reachable are all true.

## Report

Append to `videolab/docs/V16-findings.md`: what the developer-directory
requirement turned out to be under launchd, measured helper startup time with
the interpreter path, and confirmation that `/health` reports
`available: true` once the agent is running the shim.
