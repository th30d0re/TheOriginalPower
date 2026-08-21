# V15 findings

## Title and sentence indices

`ReadAloud` accepts an optional `title`. Playback builds the body queue from the unchanged `sentences` array, preserving each original zero-based index. A non-empty spoken title is inserted only into the private playback queue with `index: null`. It never enters `ReadAloudRenderState.sentences` and never reaches the render-prop child as an index.

The helper and browser paths both set `activeSentence` from the private queue item. The title therefore sets it to `null`. Helper word events are ignored for queue items whose index is `null`, so no body sentence or word is active while the title is spoken.

`VideolabPage` passes the displayed `<h3>` text into both `ReadableValue` call sites. The transcript passes `title="Transcript"` directly.

## Group order and controls

`ReadAloudGroup` wraps the Analysis and Framework concepts sections. Each playable reader registers its instance ID, root element, play callback, and low-level stop callback. The group sorts the live registry with `Node.compareDocumentPosition` whenever it needs playback order. The chain therefore follows actual DOM order across both sections and does not rely on React render or effect order.

Readers with no body speech do not render a player and do not register. A body whose sentence conversion produces no spoken text also returns `false` from its registered play callback; group traversal continues to the next reader.

The group provides Play all and a Continue to the next section checkbox. The checkbox defaults off and persists under `videolab:read-aloud-continuous`. Play all forces continuation for that run. Rate and browser voice state live in the group context, so each advancing reader receives the same selection.

## Completion and chain control

The Siri helper path awaits the `/events?id=…` EventSource for every private queue item. Its existing `done` message resolves that item; after the final item, the helper loop calls the group completion callback. This includes the title item and all body items.

The browser fallback assigns the group completion callback to `onend` only on the final `SpeechSynthesisUtterance`. Both backends therefore enter the same next-reader lookup after their own authoritative completion signal.

The existing `readaloud:start` event remains the sole mutual-exclusion signal. Other instances respond with a low-level halt that does not cancel group state. User Stop invokes the group stop operation, invalidates the chain, and halts every registered reader. Browser pause/resume retains the synthesis queue. Helper pause invalidates and stops its current helper utterance, then resumes by replaying that private queue item from its start because the helper has no pause endpoint.

The active reader receives an outline through CSS. No focus, scroll, or `scrollIntoView` operation runs during advancement.

## Verification

- `cd website && npx tsc --noEmit -p tsconfig.app.json`: passed.
- `cd website && npm run build`: passed with existing Vite module/chunk warnings.
- `cd website && npm test`: 3 passed, 0 failed.
- Focused ESLint on `ReadAloud.tsx` and `VideolabPage.tsx`: passed.
- The local helper was unavailable at `127.0.0.1:5277`, so the Siri chain was not exercised end to end. Its advancement was confirmed by code-path inspection: SSE `data.done` resolves each `streamHelperEvents` promise, the completed `playHelperQueue` loop invokes `groupComplete`, and that callback starts the next DOM-ordered reader.

## Brief corrections and constraints

The referenced source line count and approximate line numbers had drifted, without affecting the described behavior. The helper pause comment also claimed that the interrupted sentence would be re-spoken, while the former implementation did not reliably retain the active queue position or settle a closed EventSource promise. V15 now records the active helper item, invalidates the old run, stops helper speech, and resumes from that item.

No Python file, `videolab/siri-speech/` file, `Paper/` file, or `systemic_arbitrage/` file was changed. No git command was run.

## V15b — chain order and termination correction

### What the registry ordered

The V15 implementation stored readers in a `Map` populated by registration effects. At each start or completion it copied the current map values and sorted that live candidate set with pairwise `compareDocumentPosition` calls. Registration insertion order therefore did not directly determine the comparator result, but effect teardown and re-registration still determined which readers were present in the candidate set. The existing tests never exercised a registration sequence that differed from tree order, so the claimed document-order invariant had no regression proof.

V15b marks each rendered reader root with `data-read-aloud-root`. At play time the group queries those roots in browser-provided document order, then filters that sequence by element identity against its own live registrations. The registration map supplies reader operations and group membership only. It no longer supplies the sequence or the candidate traversal order. A regression fixture registers readers in third/first/second order and asserts that their play calls occur in first/second/third document order.

### Early termination

Automatic advancement previously called the same `play` path as a manual Play action. That path synchronously broadcast `readaloud:start`. Every other reader handled the event with `halt()`, and a reader still marked as active on the Siri helper issued an asynchronous `/stop`. The advancing reader could then issue `/speak` while that stop request was still in flight. A late `/stop` terminated the new helper utterance; its event stream failed, `stop()` cleared the group chain, and no later reader started.

Group starts now identify themselves as internal transitions and omit the global mutual-exclusion broadcast. `Play all` already halts the group before selecting its first reader, and a completed reader is idle before advancement, so the broadcast is unnecessary in both group paths. Manual Play retains the event and continues to stop every other reader. User Stop still calls the group-wide stop operation and invalidates the entire chain. Readers whose converted body queue is empty return `false`, and the group loop continues to the following DOM-ordered registration.

### Group scope

Transcript remains outside the group. The group controls are labeled for Analysis and are positioned immediately before the Analysis section; the chain covers Analysis followed by Framework concepts. This keeps a potentially long source transcript independently controllable and makes Play all operate on the interpretive sections associated with those controls. The first grouped reader is therefore the first readable Analysis block in document order. Transcript remains a standalone reader and cannot enter group advancement.

### V15b verification

- `cd website && npm test`: 4 passed, 0 failed, including the out-of-order registration fixture.
- `cd website && npx tsc --noEmit -p tsconfig.app.json`: passed.
- `cd website && npm run build`: passed with existing Vite dynamic-import and chunk-size warnings.
- Focused ESLint on `ReadAloud.tsx`, `readAloudOrder.ts`, and `read-aloud.test.ts`: passed.
- Title queue construction and `ReadAloudRenderState` were unchanged.
- No git command was run.
