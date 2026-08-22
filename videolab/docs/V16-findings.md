# V16 findings — persistent speech and complete DM scans

## Speech launch agent

`videolab speech install` builds the Swift package in `videolab/siri-speech/` with
`swift build -c release`. SwiftPM produces the executable at
`videolab/siri-speech/.build/release/siri-speech` on this project. The generated
plist points at the executable through an absolute path. Installation stops when
the compiler returns a failure or the expected executable is absent. Compiler
output is included in the reported error, and no plist is written in either case.

The `com.videolab.speech` plist models a continuously available daemon:

- `RunAtLoad` starts the helper when the agent is loaded.
- `KeepAlive` directs launchd to restart the helper after an exit.
- `ProgramArguments` contains the release executable path.
- `StandardOutPath` and `StandardErrorPath` resolve to
  `videolab/logs/speech.out.log` and `videolab/logs/speech.err.log`.
- `StartInterval` is absent.

The DM watcher remains an interval job. Its plist uses `StartInterval` and
`RunAtLoad: false`, with no `KeepAlive` key. This schedule starts one ingestion
run every configured interval. The speech process must remain available between
requests, which requires launchd lifecycle supervision.

`videolab speech status` reports four independent fields: plist installation,
launchd load state, the parsed health payload, and a combined `ok` value. It
performs one short-timeout request to `http://127.0.0.1:5277/health`. The combined
value requires the plist, a loaded launchd job, and a successful health response.
An absent plist yields `installed: false`. A present plist with a refused or
timed-out request yields `installed: true` and `ok: false`, with the connection
failure under `health.detail`.

`videolab doctor` performs the same single health request. An unreachable helper
produces `speech_helper.ok: false` and a remedy naming
`videolab speech install`. When the plist is absent, its detail states that the
helper is not installed.

`make videolab-speech` remains the foreground development command and continues
to run `swift Sources/main.swift`. The launchd installer uses only the release
binary.

## DM watcher scan depth

`videolab watch install` now defaults to `--all-threads --limit 50`. These values
are written into the plist `ProgramArguments`, so launchd runs the scan mode that
recovered the five measured reels. `--no-all-threads` selects the narrow scan,
and `--limit N` controls its batch bound. Reinstallation unloads the prior job
before replacing its plist.

A deep scan every 15 minutes creates materially more Instagram API traffic than
the former narrow scan. The recorded `403 login_required` makes account-session
pressure a credible operational risk. The implemented default follows the
measured completeness requirement because the narrow scan returned zero while
five valid reels remained available.

My recommended operating alternative is a 60-minute deep scan when ingestion
latency of up to one hour is acceptable. A two-tier schedule could run the narrow
scan every 15 minutes and the deep scan every 60 minutes, though that requires a
second launchd job or scheduler logic. No frequency alternative was implemented;
the current default remains one deep scan every 15 minutes for the user to assess
against observed API behavior.

## Verification

`make videolab-test` passes 120 tests with one third-party deprecation warning.
The added coverage verifies the daemon plist shape, release build invocation,
build-failure safety, parsed health data, unreachable-port status, watcher scan
arguments, watcher replacement order, and temporary-home isolation.

The required live doctor command exits successfully. Its `speech_helper` result
contains `ok: true`, `Voice 2`, the Simone Siri identifier, and
`available: true`. Unrelated readiness entries report that the container service
is unavailable in the execution sandbox and that `mlx_whisper` does not import.

A direct release-build verification was attempted. SwiftPM reached manifest
compilation, then the execution sandbox rejected `sandbox-exec` with
`sandbox_apply: Operation not permitted`. This is a host sandbox restriction,
not Swift compiler output from the package. The install tests exercise both the
successful artifact path and the compiler-failure path without loading an agent.
No launchd agent was installed, loaded, unloaded, or modified during verification.

## V16b addendum — Apple-signed interpreter agent

The release executable cannot provide the service described above. Its ad-hoc
signature hides Siri Voice 2. The corrected installer performs no SwiftPM build
and deploys no compiled product. Its plist now contains these arguments:

```text
/usr/bin/swift <absolute-repository-path>/videolab/siri-speech/Sources/main.swift
```

`/usr/bin/swift` is the Apple-signed xcode-select shim. At installation time,
`/usr/bin/xcode-select -p` returned
`/Applications/Xcode-beta.app/Contents/Developer`. The installer validates that
selection and pins it as `EnvironmentVariables.DEVELOPER_DIR`. launchd's default
`PATH` already contains `/usr/bin`. A clean environment with that minimal `PATH`
resolved both `xcode-select -p` and `swift --version`, so the machine-wide active
selection is sufficient. The plist still pins the resolved directory to preserve
the install-time toolchain choice without depending on later global changes.

With a clean environment containing only launchd's default `PATH`, `HOME`, the
pinned `DEVELOPER_DIR`, and a test port, the interpreter reached `/health` in
0.976 seconds. The response was:

```json
{"ok":true,"voice":"Voice 2","identifier":"com.apple.siri.natural.Simone","available":true}
```

The repository test suite uses temporary home directories and launchctl stubs.
It never installs, loads, or unloads a real agent. The tests assert the interpreter
arguments, developer-directory environment, replacement order, and the degraded
health rule. `make videolab-test` passes 122 tests with one third-party warning.

The attempted live replacement of the previously installed compiled-binary agent
was blocked by the execution sandbox when writing
`~/Library/LaunchAgents/com.videolab.speech.plist` (`Operation not permitted`).
The old job remained loaded and its `/health` response remained
`available: false`. The corrected `videolab speech status` reported top-level
`ok: false` and copied the helper's signature-gate reason into `detail`. A live
installation from a terminal with normal home-directory access remains required
to replace that external plist and confirm the shim-backed response on port 5277.

The stale `videolab/siri-speech/.build` directory was moved out of the repository
to `/private/tmp/v16b-siri-speech-build-backup-2026-08-21-140001`. It can be
restored from that temporary backup if needed; the installer does not reference it.

## V16c addendum — source staging outside TCC-protected Documents

The V16b plist shape was correct, but its repository source path was unusable
under launchd. macOS TCC protects `~/Documents`; `/usr/bin/swift` received
`Operation not permitted` when it tried to read `Sources/main.swift` there.
launchd could execute the earlier compiled binary from the same tree because
that operation did not require the child process to read a protected input file.

Installation now copies the current source to
`~/Library/Application Support/videolab/main.swift`, creating the application
support directory when needed and overwriting the copy on every reinstall. This
location is outside the TCC-protected repository tree and is intended for
per-user application runtime data. The plist retains `/usr/bin/swift`, the pinned
`DEVELOPER_DIR`, `RunAtLoad`, and `KeepAlive`, and changes only its source
argument to the staged path.

`videolab speech status` computes SHA-256 hashes of the repository source and
the staged copy. Different content, including a missing staged copy, produces
`stale_source: true` and a remedy naming `videolab speech install`. Staleness
alone does not change the combined top-level `ok` result. Uninstall removes both
the launch-agent plist and the staged source, including an orphan staged source
left after a missing plist.

The isolated speech tests and the complete `make videolab-test` target use
temporary home directories and injected launchctl runners. The final suite
passes 124 tests with one third-party deprecation warning. No real launchd agent
was installed, loaded, bootstrapped, unloaded, or modified during V16c.
