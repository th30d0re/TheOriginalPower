# TASK V12 — Siri Voice 2 read-aloud via a local speech helper

You are working in a dedicated git worktree on branch `agent/kimi-V1`. Commit your
work to that branch. Do not switch branches. Do not touch `main`.

## Why

The videolab read-aloud widget currently uses the browser's `speechSynthesis`, whose
macOS voices sound poor. The owner wants **Siri Voice 2**.

Verified on this machine already — you do not need to rediscover any of this:

| Route | Siri Voice 2 |
|---|---|
| Web Speech API | not exposed |
| `say` command | 187 voices, none Siri |
| **AVSpeechSynthesizer** | **available** as `com.apple.siri.natural.Simone`, name "Voice 2", en-US, quality 2 |

`AVSpeechSynthesizer.speak()` with that voice works. `AVSpeechSynthesizer.write()`
produces **no buffers** — Apple blocks capturing Siri voice audio to a file. Do not
spend time trying to render it to disk; it is deliberately prevented. Speech therefore
has to happen live, on the Mac running the browser.

## 1. The helper — `videolab/siri-speech/`

A small Swift package exposing an HTTP server on **127.0.0.1 only**.

```
GET  /health          → {"ok":true,"voice":"Voice 2","identifier":"com.apple.siri.natural.Simone","available":true}
POST /speak           → {"text":"…","rate":1.0}   begins speaking, returns {"ok":true,"id":"…"}
POST /stop            → stops immediately
GET  /events?id=…     → Server-Sent Events carrying word ranges while speaking
```

Implementation notes:

- Use `AVSpeechSynthesisVoice(identifier: "com.apple.siri.natural.Simone")`. When that
  returns nil, `/health` reports `available:false` with the reason. Never silently
  substitute a different voice — the whole point is this specific one.
- Implement `AVSpeechSynthesizerDelegate.speechSynthesizer(_:willSpeakRangeOfSpeechString:utterance:)`
  and emit each `NSRange` as an SSE event `{"start":N,"length":M}`. This gives the
  browser true word-level highlighting, which is better than the sentence-level
  approximation it has now.
- Emit a final `{"done":true}` event when `didFinish` or `didCancel` fires, so the
  client always terminates its highlight state.
- `rate` maps onto `AVSpeechUtterance.rate`; clamp it into
  `AVSpeechUtteranceMinimumSpeechRate…AVSpeechUtteranceMaximumSpeechRate`.

Build it with Swift Package Manager and no third-party dependencies — use
`Network` or `NIO`-free plain `URLSession`/`socket` handling, or the simplest
`NWListener`-based HTTP you can write. Keep it under a few hundred lines.

### Security — this matters more than the feature

- **Bind to `127.0.0.1`, never `0.0.0.0`.** A speech server reachable from the network
  lets anyone on the LAN make this Mac talk.
- Send `Access-Control-Allow-Origin` only for `http://localhost:*` and
  `http://127.0.0.1:*` origins. Reject every other origin.
- The server speaks text and nothing else. It must never shell out, never read a file
  path from the request, and never write outside its own log.
- Cap request bodies at 64 KB and refuse longer text with a clear error, so a runaway
  paste cannot pin the machine speaking for an hour.

## 2. Client — `website/src/videolab/ReadAloud.tsx`

Probe `GET /health` once on mount.

- Helper reachable and `available:true` → use it. Show the voice name.
- Otherwise → fall back to the existing `speechSynthesis` path, unchanged, and say
  quietly in the UI that Siri Voice 2 needs the local helper running.

Never leave the user with a dead button. The fallback already works; keep it working.

Use the SSE word ranges to highlight while speaking. The text sent to the helper is the
output of `latexToSpeech()` from `speechText.ts` — ranges therefore index the spoken
string, so highlight against that same string rather than the raw source.

Stop speech on unmount and on route change by calling `/stop`.

## 3. Running it

Add a `make videolab-speech` target that builds and runs the helper, and document the
one-line start command in `videolab/README.md`. Do **not** install a launch agent —
the owner already has one background agent from this project and should opt into a
second one deliberately.

## Exit criteria

- `swift build` inside `videolab/siri-speech/` succeeds.
- `curl 127.0.0.1:<port>/health` reports the Siri voice as available.
- `curl -X POST 127.0.0.1:<port>/speak -d '{"text":"the conjugate move cancels the status wage"}'`
  speaks aloud in Siri Voice 2.
- `curl` from a non-localhost `Origin` header is rejected.
- `cd website && npm run build` succeeds with no new TypeScript errors, and
  `npm test` still passes.
- With the helper stopped, the widget still works via `speechSynthesis`.
- `videolab/docs/V12-findings.md` records what you found, including anything about
  the AVSpeechSynthesizer behaviour that differs from the description above.

## Constraints

Never write outside your worktree. Do not modify `Paper/`. Do not add npm or Swift
dependencies. Do not install a launchd agent. Never write DM text, usernames, or
thread titles into findings, fixtures, or tests. Python 3.11 conventions do not apply
here; follow ordinary Swift and TypeScript style.
