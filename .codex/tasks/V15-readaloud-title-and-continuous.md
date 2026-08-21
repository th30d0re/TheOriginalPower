# TASK V15 — Speak the section title, and offer continuous playback

Two changes to the videolab read-aloud UI in the React site.

**Files:** `website/src/videolab/ReadAloud.tsx` (288 lines) and
`website/src/videolab/VideolabPage.tsx`. Do not touch `videolab/` (the Python
package) or `videolab/siri-speech/`.

## The current shape

`VideolabPage.tsx` renders each analysis block as:

```tsx
<div className="vl-analysis-block" key={key}>
  <h3>{key.replaceAll('_', ' ')}</h3>
  <ReadableValue value={value} label={key.replaceAll('_', ' ')} />
</div>
```

`ReadableValue` wraps `ReadAloud`, which receives only the body `sentences`.
The `<h3>` is never spoken, and each block's player is an island: when it
finishes, playback stops.

There are **two speech backends** and both matter here:

- the local Siri helper on `127.0.0.1:5277` (`/speak`, `/stop`, `/events`,
  tracked by `speakingOnHelperRef` and `eventSourceRef`)
- the browser `speechSynthesis` fallback (`utterance.onend`, ~line 231)

Instances already coordinate: on play, a `readaloud:start` CustomEvent carrying
`instanceId` is dispatched, and every other instance stops (~lines 130–134).

## Change 1 — speak the section title

Add an optional `title?: string` prop to `ReadAloud`. When present it is spoken
first, before the body.

**The trap:** do not prepend the title to the `sentences` array. Callers use
sentence indices for highlighting — `activeSentence === index`,
`activeWords.sentence === index` — and every index is assigned by a counter in
`ReadableValue`'s render. Prepending shifts all of them by one and silently
mis-highlights every sentence in every block. Keep the title outside the indexed
sentence list: speak it as its own leading utterance mapped to no rendered
sentence, or carry an internal offset that is stripped before any index reaches
`children`. The render-prop contract must not change.

Thread the title through `ReadableValue` from the `<h3>` text in
`VideolabPage.tsx`, at both call sites (the `Analysis` section, line ~210, and
the `Framework concepts` notes, line ~211). The `Transcript` player (line ~199)
has a real heading too — give it one for consistency.

While the title is being spoken, no body sentence should be marked active.

## Change 2 — continuous playback

The user wants to start one section and keep listening through the rest of the
analysis.

Add a `ReadAloudGroup` context provider wrapping the analysis sections. It owns:

- an **ordered registry** of the `ReadAloud` instances inside it, in DOM order.
  Registration must not depend on render order alone if that would diverge from
  visual order — verify the order you get is the order on screen.
- a **"Continue to the next section" toggle**, persisted in `localStorage` so it
  survives navigation. Default off.
- a **"Play all"** control at the group level that starts from the first section.

When an instance finishes and the toggle is on, the group advances to the next
registered instance and plays it, title first.

**Requirements:**

- **Both backends must signal completion.** The helper path ends through the
  `/events` EventSource, the fallback through `utterance.onend`. A chain that
  only works on one backend is half a feature — and the helper is the path that
  is actually used when it is running.
- **Do not fight the existing mutual exclusion.** `readaloud:start` currently
  stops every other instance. An advance must not stop the very instance it is
  starting, and must not trigger a stop-then-start race. Extend that mechanism
  rather than adding a second, competing one.
- **Stop means stop.** Pressing Stop cancels the whole chain, not just the
  current section. Pause pauses the chain and Resume continues it.
- Rate and voice selections carry across the chain.
- The advance must not scroll-jack the page. If you indicate which section is
  playing, do it visually without moving the viewport out from under the reader.
- A section with no sentences is skipped, not stalled on.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT modify `videolab/` (Python), `Paper/`, or `systemic_arbitrage/`.
- Do NOT change the `ReadAloudRenderState` render-prop contract — other call
  sites depend on it.
- TypeScript strict mode. No `any`.
- Keep the existing helper-unavailable notice and its fallback behaviour intact.

## Verify

```bash
cd website && npx tsc --noEmit -p tsconfig.app.json && npm run build
```

Both clean. Then reason explicitly about the two backends: state in your report
how you confirmed the chain advances on the helper path, not only on the browser
fallback. If you could not exercise the helper, say so rather than implying you
did.

## Report

`videolab/docs/V15-findings.md`: how the title is kept out of the sentence index
space, how the group registry establishes order, how completion is detected on
each backend, and anything you found that the brief got wrong.
