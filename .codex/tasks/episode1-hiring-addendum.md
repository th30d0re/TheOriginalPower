# Task — draft an Episode 1 addendum: the hiring-study cold open

## Boundaries

- **Do not** run `git`, `make`, or any build. **Do not** edit `Paper/` or the existing
  `podcast_prompts/Episode_01_Redefining_Racism.md`.
- You create ONE file: `podcast_prompts/Episode_01_ADDENDUM_hiring_precursor.md`.
- This is a proposed insert for Emmanuel to review and integrate himself.

## Context — read these first

- `podcast_prompts/Episode_00_How_to_Read_This_Book.md` and
  `podcast_prompts/Episode_01_Redefining_Racism.md` — the house format for these files.
  They are **NotebookLM generation prompts** (persona, serialization rules, banned-language
  protocol, block outlines, pull quotes, sign-off), not narration scripts. Match that
  format exactly.
- `Sources/hiring-talk-2024-transcript.md` — the source material. The three flagged
  passages (glass ceiling / personal experience; token executive; "throw a wrench in the
  middle").
- The Author's Preface in `Paper/The_Original_Power.tex` (search `Author's Preface`) — the
  precursor arc now has four beats: *From Bias to Bytes* / *The Calculus of Discrimination*
  (proposal) → *The Calculus of Injustice* (empirical shadow) → *Exploring Bias and
  Fairness in Language Models Applied to Hiring* (the built detector) → *The Original
  Power* (the mechanism).

## Why this addendum exists

Episode 1 is scoped to the Preface + Chapter 1. The hiring study is now a Preface beat, so
it is in scope. It gives Episode 1 a concrete cold open: the author built the bias detector
the proposal had named, pointed it at hiring, and a model with no racial instruction
reproduced the partition — sharpest at the mid-career rung. This grounds the Preface's
"identify → detect → build → derive" arc in something the listener can picture before any
history loads.

## What to produce — `podcast_prompts/Episode_01_ADDENDUM_hiring_precursor.md`

A file in the same style as the existing episode prompts, containing:

1. **Header** noting this is a proposed addendum to Episode 1, to be merged into the
   `### Bridge` / opening material, not a standalone episode.

2. **A cold-open block** (~150–250 words of prompt instruction, not verbatim narration)
   directing the hosts to open with the hiring study: synthetic résumés, explicit and
   inferred racial markers, four levels of seniority, a model given no racial instruction,
   near-parity at entry and executive, the mid-level selections going roughly two-to-one to
   White candidates, and the aggregate test showing nothing until the data is split by
   level. Frame it as the detector the proposal promised, now built. Keep it Tier-appropriate
   — this is one unpublished exploratory study, and the episode should say so.

3. **A short "supported by" note** for the hosts: the peer-reviewed version of the point is
   Weisshaar et al. (anti-Black hiring penalty concentrated at entry, "diversity
   commodification") and Law & Tan (board diversity rising while Black workforce
   representation falls, "diversity tokenism"). The mechanism is the framework's
   reform-absorption dynamic; name it as a forward reference only (the Concession Theorem
   is Episode 16 — do not explain it here).

4. **An optional first-person beat**, clearly marked optional, drawing on the transcript's
   personal-experience passage — the author is a Black engineer who observed the mid-level
   filter before he measured it. One or two sentences of guidance on how the hosts could
   acknowledge this without turning the episode into anecdote.

5. **Updated `### Bridge` text** — a revised version of Episode 1's early-draft→framework
   bridge paragraph that reflects the four-beat precursor arc instead of the current
   shorter account.

6. **Two or three pull quotes** in the file's existing style.

## Constraints

- Obey Episode 1's **banned-language protocol** (no dark/light morality, no admiring
  dominance talk, no romanticizing) and its **serialization rules** (Preface + Ch. 1 only;
  name later topics as forward references, do not explain them).
- Clinical, architectural tone. The study is evidence, presented with its confidence level,
  not a rhetorical flourish.
- Affirmative declaratives. No "not X but Y".

Print MEMO-COMPLETE when the file is written.
