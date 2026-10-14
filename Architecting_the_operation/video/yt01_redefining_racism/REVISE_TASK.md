# Revision task: YT01 script, one part (round 2)

**FILE RULES FIRST. Never run git. Never modify any file except the one draft named in
your dispatch line. Create no other files.**

Re-read `BRIEF.md` in this folder (it was updated: see the length line at the top and
the plain-negation sentence in rule 2) and `DRAFT_TASK.md`. Then rewrite your draft in
place. Your round-1 draft was accurate and well formatted. It has four problems:

1. **Far too short.** It reaches roughly a third of the word targets in the BRIEF segment
   table. Each segment must land within about 15% of its target. Length must come from
   explanation, never filler: say what each claim means, why the book makes it, and how
   it connects to the previous segment.
2. **Equations are recited, not explained.** For every numbered equation use four beats,
   each its own short turn: (a) "Equation 2.N" and what it is for; (b) each symbol
   introduced one at a time, in the order the eye reads it on screen; (c) the whole
   equation said as one plain sentence; (d) what it predicts or rules out, with the
   chapter's example. Do the same for Figures: say what is on each axis or in each
   box, then what the viewer should notice.
3. **It reads as a list of facts.** Build each segment as an argument: claim, evidence,
   what follows. Use the book's computing and circuit models as the explanation itself.
   Transitions between segments carry the thread ("The kernel objective tells us what
   the system wants. The next question is how it keeps M of t below tau.").
4. **Workarounds for negation and brief leakage.** Write "no such period" where you
   wrote "zero such periods"; plain negation is allowed. Never mention the brief, its
   rule numbers, or "operationalize using rule nine" on air.

Segment 00 is the first thirty seconds of the channel: open on the dictionary ordering
as a concrete image, land the title line "What racism really is", and promise the
destination. Segment 02 (set theory) must leave a viewer who has never seen set
notation able to read Equation 2.1 aloud.

Keep every correct fact from round 1. Keep turns at one to three sentences, at most
about 45 words. Keep timestamps monotonic from your starting offset. Run
`python3 check_script.py <your file>` from this folder before finishing; the
"segments" and other parts' "missing reference" errors are expected on a partial file.
