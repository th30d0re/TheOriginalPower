# TASK V10 — Read-aloud widget and OpenDyslexic reading mode

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`,
which now contains the V9 videolab route. Read `videolab/CONTRACT.md` §12 first.

## 1. Read-aloud

Add `website/src/videolab/ReadAloud.tsx`, a small player used on the videolab detail
page for the transcript and for each analysis section.

Use the browser's built-in `window.speechSynthesis` (Web Speech API). Add no
dependency and call no network service: it works offline, costs nothing, and the
text never leaves the machine.

Controls: play, pause/resume, stop, a rate slider (0.75×–1.5×), and a voice picker
populated from `speechSynthesis.getVoices()`.

Requirements that matter:

- **Highlight the sentence being spoken.** Split the text into sentences, speak them
  as a queue, and mark the active one. Following along is most of the value for a
  dyslexic reader, and it is the reason to build this rather than rely on the OS
  reader.
- `getVoices()` returns empty on first call in Chrome and Safari until the
  `voiceschanged` event fires. Subscribe to it; do not read the list once at mount.
- Cancel any in-flight utterance on unmount and on route change, or speech continues
  after the user navigates away.
- Strip `$…$` math spans before speaking, replacing each with a short spoken form
  where one is obvious (`$\theta$` → "theta", `$\psi_m$` → "psi m",
  `$W + W^{*} = 2\psi_m$` → "W plus W conjugate equals two psi m"). Reading raw
  LaTeX aloud is unusable. Keep the substitution table small and explicit; fall back
  to skipping the span when no mapping exists.
- Degrade honestly: when `speechSynthesis` is unavailable, render nothing rather
  than a dead button.

## 2. OpenDyslexic reading mode

`website/public/fonts/` now contains `OpenDyslexic-{Regular,Bold,Italic,BoldItalic}.woff2`
(already converted and committed).

Declare the four `@font-face` rules with `font-display: swap`, and add a reading-mode
toggle that sets `data-font="dyslexic"` on `<html>`. Persist the choice in
`localStorage` so it survives navigation and reload.

When active, apply OpenDyslexic to body text, headings, transcript, OCR rows, and
analysis prose. Reading modes usually pair well with slightly looser spacing —
increase `line-height` and `letter-spacing` modestly in this mode.

**Equations keep their own font.** Scope the override so nothing inside `.katex`
inherits it:

```css
:root[data-font="dyslexic"] :not(.katex):not(.katex *) { font-family: …; }
```

or equivalently set the family broadly and reset `.katex, .katex *` back to KaTeX's
own stack. KaTeX positions glyphs using metrics from its bundled fonts, so
substituting a different family breaks fraction bars, radicals, and spacing. Verify
by rendering `$W + W^{*} = 2\psi_m$` in both modes and confirming the math is
identical.

Put the toggle where it applies site-wide, not only on the videolab route — the
story pages carry the most prose in the project.

## Exit criteria

- `cd website && npm run build` succeeds with no new TypeScript errors.
- The toggle flips fonts, persists across reload, and leaves `.katex` untouched.
- ReadAloud speaks the transcript, highlights the active sentence, and stops on
  unmount.
- A test asserts the LaTeX-to-speech substitution turns `$W + W^{*} = 2\psi_m$` into
  spoken words with no `$`, `\`, `^`, or `_` surviving.
- Append a "Loop 10" section to `videolab/docs/V2-findings.md`.

## Constraints

Add no dependencies. Do not modify the videolab pipeline modules. Do not change
existing routes beyond mounting the toggle. Never write DM text, usernames, or thread
titles into findings, fixtures, or tests. Do not attempt `git commit`.
