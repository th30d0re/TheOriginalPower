# TASK V16c — `speech install` must stage the source outside ~/Documents

Follow-up to V16b, which is merged. **The plist shape is correct and verified —
`/usr/bin/swift` on the source, `DEVELOPER_DIR` pinned, `RunAtLoad`+`KeepAlive`,
no `StartInterval`. Do not change any of that.** One thing remains, and it is the
reason the agent does not actually run.

## The failure

After `speech install`, the agent was installed but never stayed up.
`videolab/logs/speech.err.log`:

```
<unknown>:0: error: error opening input file
'/Users/emmanuel/Documents/Theory/TheOriginalPower/videolab/siri-speech/Sources/main.swift'
(Operation not permitted)
```

`launchctl print` showed `last exit code = 1` with `state = spawn scheduled` —
KeepAlive retrying a command that could never succeed.

**Cause: macOS TCC.** The repository lives under `~/Documents`, which macOS
protects. A user LaunchAgent may *execute* a binary from there — the earlier
compiled-binary agent ran fine — but `/usr/bin/swift` **reading** `main.swift`
as an input file is a protected file read, and TCC denies it. Note that
`StandardErrorPath` still worked, because launchd opens the log files itself
rather than the child process opening them.

So the two constraints are jointly binding: the interpreter is required for Siri
voice access (V16b), and the interpreter cannot read the source where it lives.

## The fix, already proven manually

Copy the source out of the protected area at install time and point the plist at
the copy. Verified by hand on this machine:

```
~/Library/Application Support/videolab/main.swift
ProgramArguments: ['/usr/bin/swift', '/Users/emmanuel/Library/Application Support/videolab/main.swift']
```

Result — the agent loads, stays up, and serves:

```json
{"ok":true,"voice":"Voice 2","identifier":"com.apple.siri.natural.Simone","available":true}
```

KeepAlive verified: killing pid 86388 produced a fresh pid 86470 answering within
ten seconds.

## What to implement

1. **Stage on install.** `speech install` copies
   `videolab/siri-speech/Sources/main.swift` to a staging path outside the
   protected area — `~/Library/Application Support/videolab/main.swift` is the
   verified location — creating the directory as needed, and points
   `ProgramArguments` at the copy. Overwrite on every install so a reinstall
   always deploys current source.

2. **Report the staged path** in the install result dict alongside the existing
   `swift`, `source` and `developer_dir` keys, so it is obvious what is actually
   running.

3. **Detect drift in `status`.** The staged copy can fall behind
   `Sources/main.swift`. `status` must compare them — content hash, not mtime —
   and report a `stale_source: true` field with a remedy naming
   `videolab speech install`. A stale copy is not a hard failure, so do not force
   top-level `ok` to false for it alone; surface it as its own field.

4. **`uninstall` removes the staged copy** along with the plist. Do not leave an
   orphan script in Application Support.

5. **Do not stage into the repository.** The staged file must live outside the
   working tree so it is never committed, and the repo is not the deployed
   artifact.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT modify `videolab/siri-speech/Sources/main.swift`.
- Do NOT change the plist shape decided in V16b, or V16's Part B
  (`--all-threads` / `--limit` in the watch plist).
- Do NOT modify `Paper/`, `systemic_arbitrage/`, or `website/`.
- Tests must use temporary home directories and must not install, load, bootstrap
  or unload any real launchd agent.

## Verify

```bash
make videolab-test
```

122 tests pass today; all must still pass plus new ones covering: install writes
the staged copy and references it in `ProgramArguments`, the staged path is
outside the repository root, `status` reports `stale_source` when the copy
differs from the source, and `uninstall` removes the copy.

## Report

Append to `videolab/docs/V16-findings.md`: the TCC constraint and why executing
from `~/Documents` is permitted while reading from it is not, the staging
location and why it was chosen, and how staleness is detected.
