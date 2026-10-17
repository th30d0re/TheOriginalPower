# Brief: YT02 script draft, "What Racism Is"

**Never run git. Never edit anything under `Paper/` (read only). Write only:
`Architecting_the_operation/podcasts/YT02_what_racism_is.md`, a findings file
`Architecting_the_operation/video/yt02/logs/script_draft.md`, and the small change to
`check_script.py` described below.**

## Source of truth

- The plan: `Architecting_the_operation/notes/YT02_outline.md`. Follow its segment order (SEG 00–12),
  its claims and provenance tags, its "Hypothesis and test" section, and its "Decisions" section.
- The book: `Paper/The_Original_Power.tex`. Every claim comes from the book or from a source the
  outline cites. The bias/prejudice/discrimination definitions are now in the book itself: the
  Preface paragraph "A note on terms and host wetware" and Chapter 2's "The Critical Distinction".
  Paraphrase them faithfully; never invent figures, equation numbers, dates or quotations.
- Format and register reference: `Architecting_the_operation/podcasts/YT01_what_racism_really_is.md`
  (read SEG 00–02 and one later segment). YT02 must not repeat YT01 sentence for sentence.

## Format (the ScriptCast parser depends on it)

- Line 1: one-line description, like YT01's. Then for each segment a marker line
  `<!-- SEG NN · short title -->` (NN = 00 … 12, in order).
- Turns: a header line `Emmanuel Theodore (MM:SS)` then the spoken text on the next line, a blank
  line between turns. Timestamps non-decreasing, estimated at 150 words per minute.
- Each turn 12–40 words. Short turns keep re-renders cheap.
- Speakable text only: no `$`, `\`, `_`, `^`, braces, set symbols or arrows. Say math in words
  ("I union O", "the intersection of O and P is empty"). Say "Equation 2.5", never "Eq."
- Name every equation and figure by its printed number when it appears on screen, as the outline lists.
- Target: about 72 minutes, ~10,800 words. Each segment within ±15% of the outline's estimate.
- Put provenance in an HTML comment after a turn when the claim needs it:
  `<!-- [book §2.2] -->`, `<!-- [book Preface] -->`, `<!-- [external: Allport 1954, p. 9] -->`.
  Quote the book only verbatim, tagged `[book] "…"`.
- The first segment ends with the AI-voice disclosure, as YT01's does.

## Voice and rules

- Solo narrator, Emmanuel Theodore. College/graduate register; name the constructs; no K-12 scaffolding.
- Direct, affirmative declarative sentences. **No formulaic antithesis**: no "not X but Y", "it's not
  just X, it's Y", "more than just", "rather than", "instead of", "isn't X, it's Y". Plain negation
  of a fact is fine.
- The five positions are **tiers** (Elite, Puppet Class, Enforcement Class, Buffer Class, Out-group),
  never "jobs".
- Say "cannabis", never "marijuana" (statute names and quotations excepted).
- SEG 09 gives the brief timeline overview from the Preface's map of the book, and SEG 10 explains the Interference Engine (both new; see the outline). SEG 05 states the reversal as a hypothesis with its predictions and refutation standards, out loud,
  as the outline gives them; SEG 06–08 test it and say which prediction each case tests.

## Check (run it; fix until clean)

`Architecting_the_operation/video/yt01_redefining_racism/check_script.py` is YT01-specific: it
requires segments 00–22 and Chapter 2's equation list. Add two optional flags with YT01's behavior
as the default: `--segments N` (expect 00 … N−1) and `--require "Equation 2.5,Equation 2.6,…"`
(replaces the required list; empty string = none). Then run:

    python3 Architecting_the_operation/video/yt01_redefining_racism/check_script.py \
      Architecting_the_operation/podcasts/YT02_what_racism_is.md --segments 13 --require "<the equations and figures the outline names>"
    python3 tools/check_antithesis.py Architecting_the_operation/podcasts/YT02_what_racism_is.md

Pass = zero errors, no antithesis hits, and no turn warned over 45 words. Confirm YT01 still passes
with no flags.

## Findings file

`logs/script_draft.md`: word count and minutes per segment against the outline, the check output,
every external source cited on air, and any outline claim you could not ground in the book (left
out, and listed here).
