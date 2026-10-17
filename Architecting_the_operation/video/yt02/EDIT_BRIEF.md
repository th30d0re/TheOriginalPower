# Brief: Codex edit pass on Gemini's YT02 draft

**Never run git. Never edit anything under `Paper/` (read only). Edit only
`Architecting_the_operation/podcasts/YT02_what_racism_is.md` and append to
`Architecting_the_operation/video/yt02/logs/script_draft.md`.**

Input: Gemini's draft at `Architecting_the_operation/podcasts/YT02_what_racism_is.md`, written to
`Architecting_the_operation/video/yt02/SCRIPT_BRIEF.md`. Read both briefs.

**The outline changed after Gemini started.** Gemini wrote to an earlier 13-segment plan. The
current `notes/YT02_outline.md` has **15 segments (SEG 00–14, about 90 minutes, ~13,500 words)**
and its "Decisions" item 7 lists what was added. Restructure the draft to the current outline:
renumber the SEG markers, and write the new material in Gemini's register:
SEG 04 (orthographic illusion), SEG 09 (the wage as a phasor: explain complex numbers from zero and
narrate the rotating phasor through θ = 0, 90° and Quadrant II, then each historical implementation;
leave out the Unified Lorentz Force), the zero-day block in SEG 07, the biological-embedding block
in SEG 10, the Concession Theorem in SEG 14, and SEG 11 narrated over the runtime dashboard
(`video/yt02/DASHBOARD_SPEC.md`), naming each era's fields as the logs state them. The outline wins
wherever it and the draft disagree.

Edit for technical accuracy and keep Gemini's voice:

1. Check every claim, number, date, equation number, figure number and named source against
   `Paper/The_Original_Power.tex` and `Architecting_the_operation/notes/YT02_outline.md`. Fix or cut
   anything the book does not support. Book vocabulary attached to the wrong mechanism is the
   known Gemini failure; check every framework term (tiers, In-group, Out-group, Buffer Class,
   psychological wage, interface swap, Interference Engine, Tweedism Filter, Variable Swap, kernel, suppression envelope) against its definition.
2. Check the three definitions (bias, prejudice, discrimination) against the Preface paragraph
   "A note on terms and host wetware" and Chapter 2's "The Critical Distinction".
3. Check that SEG 05 states the hypothesis, its predictions and its refutation standards as the
   outline gives them, and that SEG 06–08 say which prediction each case tests.
4. Length: each segment within ±15% of the outline's estimate at 150 wpm (about 13,500 words total).
   Expand thin segments from the book; do not pad.
5. Keep turns 12–40 words, speakable, with the exact header format. Rerun the checks from
   SCRIPT_BRIEF.md until clean, with `--segments 15`.

Append to `logs/script_draft.md` a "Codex edit pass" section: each factual correction with the
`.tex` line it rests on, word counts per segment after the edit, and the final check output.
