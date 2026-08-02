# V12 findings — Siri Voice 2 read-aloud helper

## What was built

- `videolab/siri-speech/` — a dependency-free SwiftPM executable. `NWListener`-based HTTP
  server on 127.0.0.1:5277 (override with `SIRI_SPEECH_PORT`) exposing `GET /health`,
  `POST /speak`, `POST /stop`, and `GET /events?id=…` (SSE word ranges).
- `website/src/videolab/ReadAloud.tsx` — probes `/health` once on mount, plays through the
  helper when it reports the Siri voice available, and otherwise keeps the existing
  `speechSynthesis` path byte-for-byte in behavior, with a quiet note that Siri Voice 2
  needs the helper.
- `make videolab-speech` builds nothing and runs the helper; documented in
  `videolab/README.md`.

## The big discovery: Siri voices are gated by the calling binary's signature

The brief states the voice was verified on this machine. That is true only for the
Swift **interpreter**. Measured on this machine (Xcode 26 beta toolchain, Swift 6.4):

| Process | `speechVoices()` count | `AVSpeechSynthesisVoice(identifier: "com.apple.siri.natural.Simone")` |
|---|---|---|
| `swift script.swift` (swift-frontend, Apple-signed) | 190 | resolves, name "Voice 2", en-US, quality 2 |
| `swiftc`-compiled binary, ad-hoc signed | 180 | **nil** |
| same binary in a minimal `.app` bundle, ad-hoc signed | 180 | nil |
| same bundle signed with an Apple Development identity | 180 | nil |

The ten voices hidden from compiled binaries are exactly the Siri/premium voices.
There is no entitlement on the toolchain binary, so the gate appears to be the Apple
platform signature itself, not an entitlement a third-party binary could carry.

Consequence: `swift build` succeeds and the compiled helper runs correctly in every
respect except that `/health` reports `available:false` — by design it never substitutes
another voice. `make videolab-speech` therefore runs
`swift videolab/siri-speech/Sources/main.swift`, i.e. the interpreter, whose host process
can see the voice. Verified live: `/health` reports `available:true`,
`POST /speak` speaks aloud in Voice 2, and the SSE stream carries per-word ranges.

## Other behavior notes

- `AVSpeechSynthesizer.write()` producing no buffers for Siri voices (from the brief) was
  not re-verified; the helper only ever speaks live, so nothing depends on it.
- **Rate mapping.** The widget's slider treats 1.0 as normal speed;
  `AVSpeechUtterance.rate` treats `AVSpeechUtteranceDefaultSpeechRate` (0.5) as normal.
  The helper scales `rate × AVSpeechUtteranceDefaultSpeechRate` and clamps into
  `AVSpeechUtteranceMinimumSpeechRate…AVSpeechUtteranceMaximumSpeechRate`. A literal
  clamp of the slider value would pin normal speed to the platform maximum.
- **Word ranges are UTF-16.** `willSpeakRangeOfSpeechString` reports `NSRange` in UTF-16
  units of the spoken string, which matches JavaScript string indexing, so the client can
  `slice()` the `latexToSpeech()` output directly.
- **SSE close race.** Cancelling an `NWConnection` immediately after `send()` drops the
  queued frame, so the terminal `{"done":true}` must be sent with the close carried by the
  send completion. An early version lost the done event this way; fixed and re-verified
  for live, late, and unknown-id subscribers (late/unknown subscribers get a lone done so
  the client always terminates its highlight state).
- **Pause.** The HTTP surface has no pause endpoint. The client implements pause as
  `/stop` plus a resume cursor: Resume re-speaks the interrupted sentence from its start.
- **Preemption.** A second `/speak` while speaking stops the current utterance, sends done
  to its subscribers, and starts the new one.

## Security measures implemented

- Listener bound with `requiredInterfaceType = .loopback`, plus a per-connection check
  that the peer is 127.0.0.1, ::1, or localhost; anything else is dropped before parsing.
- `Access-Control-Allow-Origin` is echoed only for `http://localhost:*` and
  `http://127.0.0.1:*` (regex-anchored); any other `Origin` gets 403. Requests without an
  `Origin` header (curl and same-machine tools) are answered normally.
- Bodies are capped at 64 KB at both the declared `Content-Length` and the received byte
  count; larger requests get 413. Headers are capped at 16 KB.
- The server never shells out, never reads a path from a request, and writes only to its
  own stdout.

## Verification log

- `swift build` in `videolab/siri-speech/`: succeeds (warnings only: SDK `Sendable`
  annotations on `AVSpeechSynthesizer`).
- `curl 127.0.0.1:5277/health` → `{"ok":true,"voice":"Voice 2","identifier":"com.apple.siri.natural.Simone","available":true}`.
- `curl -X POST …/speak -d '{"text":"the conjugate move cancels the status wage"}'` →
  spoke aloud in Voice 2; `/events?id=…` streamed 7 word ranges then `{"done":true}`.
- `curl -H 'Origin: http://evil.example.com' …` → 403 `origin not allowed`;
  `Origin: http://localhost:5173` → 200 with the origin echoed.
- 70 KB body → 413.
- `cd website && npm run build` succeeds with no new TypeScript errors; `npm test` passes
  (3/3). `npm run lint` reports 10 errors, all pre-existing in
  `src/components/visualizations/InterferenceEngine3D.tsx`, untouched by this change.
- Fallback: when the helper is stopped the health probe fails, the helper state stays
  null, and the widget renders the unchanged `speechSynthesis` controls.
