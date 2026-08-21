# TASK V16 — Keep the speech helper alive, and stop the watcher missing reels

Two independent changes in `videolab/src/videolab/`. Both address the same class
of problem this project keeps hitting: **something that is supposed to run
unattended, silently not running.**

---

## Part A — `videolab speech` launchd agent

The Siri helper is started by `make videolab-speech`, which runs
`cd videolab/siri-speech && swift Sources/main.swift` in the **foreground**. It
dies with the terminal. When it is not running, the website's read-aloud silently
falls back to the browser voice — the user sees only a small note and loses
Siri Voice 2 without anything failing.

Add `videolab speech {install,uninstall,status}`, mirroring the existing
`videolab watch` subcommand in `watch.py`. Read that file first and follow its
structure, naming, and return-dict shape.

**Differences from `watch`, which matter:**

1. **This is a long-running daemon, not an interval job.** `watch` uses
   `StartInterval` with `RunAtLoad: False`. The speech helper needs
   `RunAtLoad: true` and `KeepAlive` so launchd restarts it if it exits. Do not
   copy `StartInterval`.

2. **Build a binary; do not run the interpreter.** `swift Sources/main.swift`
   compiles on every launch and requires the Xcode toolchain on `PATH` —
   launchd's minimal `PATH` (`/usr/bin:/bin:/usr/sbin:/sbin`) does not have it.
   At install time run `swift build -c release` in `videolab/siri-speech`
   (package name `siri-speech`, one executable target of the same name) and
   point `ProgramArguments` at the built binary's absolute path. If the build
   fails, fail the install with the compiler output — never install an agent
   pointing at a binary that does not exist.

3. **Label and logs.** Use a label consistent with the existing
   `com.videolab.dmwatch` (e.g. `com.videolab.speech`), and write
   `StandardOutPath`/`StandardErrorPath` into the same `logs/` directory as
   `speech.out.log` / `speech.err.log`.

4. **`status` must probe, not assume.** `watch_status` reads the plist and log
   state. For speech, that is not enough — the whole point is catching a helper
   that is installed but not answering. `status` must `GET http://127.0.0.1:5277/health`
   with a short timeout and report the parsed result
   (`{"ok":true,"voice":"Voice 2","identifier":"com.apple.siri.natural.Simone","available":true}`)
   alongside the plist state. Installed-but-unreachable must read as **not ok**.

5. **Port.** 5277 is hardcoded in `Sources/main.swift`. Do not change the Swift
   source. Reference the port from one constant in the Python side.

Also add the probe to `videolab doctor` as a `speech_helper` entry, using the
same `/health` call, reporting `ok: false` with a remedy string naming
`videolab speech install` when it is unreachable. Keep it to one short-timeout
request — `doctor` already costs a network round trip for the Instagram check and
must not get slower still. A helper that is not installed at all should read as
`ok: false` with a clear detail, not as an error.

Update `make videolab-speech` to keep working as the foreground path for
development, and document the agent in `videolab/README.md`.

---

## Part B — the watcher misses reels

`build_watch_plist` in `watch.py` emits:

```python
"ProgramArguments": [
    str(config.voice_python.absolute()), "-m", "videolab", "ingest-dms",
],
```

No `--all-threads`, so the agent runs the default narrow scan every 15 minutes.

**Measured on 2026-08-21:** with authentication working, the default scan
returned `{"count":0,"slugs":[]}`. The same account scanned with
`--all-threads --limit 50` immediately ingested **five reels**
(`DcFOePMtqL1`, `DcIoIJryfh4`, `DcRXQM-y72X`, `DcQpPwJAgbb`, `DcLvlJaD8qa`),
all of which decoded cleanly through every stage. The agent had been running the
whole time and would never have found them.

**Fix:** let `videolab watch install` take `--all-threads` and `--limit N`, and
thread them into `ProgramArguments` so the installed agent uses the same scan
that actually works. `build_watch_plist` must accept them as parameters — it is
already unit-tested, so keep it pure and writable-free.

**Default to `--all-threads` on**, because the narrow scan demonstrably misses
real content and a watcher that misses is worse than no watcher. Make the flag
able to turn it off.

**State the tradeoff in your findings.** A deep scan every 15 minutes is more
Instagram API traffic than a shallow one, and this account has already hit
`403 login_required` once. If you judge that a deep scan at that frequency is
risky, say so and propose a concrete alternative (for example a longer interval
for the deep scan, or shallow-often plus deep-occasionally) rather than silently
choosing a compromise. Do not implement the alternative unless it is clearly
better; the decision is the user's.

Reinstalling must replace the existing agent cleanly — unload the old one before
writing the new plist, as `install_watch` already does.

---

## Hard constraints

- Do NOT run any `git` command.
- Do NOT modify `videolab/siri-speech/Sources/main.swift`, `Paper/`,
  `systemic_arbitrage/`, or anything under `website/`.
- Do NOT weaken container isolation in `containers.py`.
- Do NOT load, unload, or otherwise touch the user's **currently running**
  `com.videolab.dmwatch` agent as a side effect of testing. Tests must use a
  temporary `home` directory, exactly as the existing `watch` tests do.
- Do NOT commit any credential, cookie, or session file.

## Verify

```bash
make videolab-test
PYTHONPATH=videolab/src .venv-voice/bin/python -m videolab doctor
```

All existing tests pass plus new ones covering: the speech plist shape
(`RunAtLoad`/`KeepAlive`, absolute binary path, log paths), install failing when
the Swift build fails, `status` reporting not-ok when the port is unreachable,
and `build_watch_plist` emitting `--all-threads`/`--limit` when asked.

Do not install either agent onto the developer machine as part of the test run.

## Report

`videolab/docs/V16-findings.md`: the plist differences between an interval job
and a daemon, what `swift build -c release` produces and where, how `status`
distinguishes not-installed from installed-but-unreachable, and your reasoned
position on deep-scan frequency versus API load.
