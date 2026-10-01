# Brief v2: EP04 register pass (college / graduate level), turn by turn

Supersedes `EP04_register_pass_BRIEF.md`. Draft v1 (`ATO_EP04_register_pass.md`) was rejected for
three reasons. Do not repeat them:
1. It cut whole segments the author had just added (the oppression-Olympics bit).
2. It flattened the three hosts into one seminar voice; Toussaint became a source of essay prompts
   ("Take those four components in order.", "Assess the apparent fatalism through...").
3. It treated analogy as scaffolding. The author wants analogies kept.

## Rules (read first)
- Read `AGENTS.md` (the rhetorical constraint is a hard rule) and the format section of
  `Architecting_the_operation/README.md`.
- Write exactly TWO files:
  1. `Architecting_the_operation/podcasts/drafts/ATO_EP04_register_pass_v2.md` — the full revised script.
  2. `Architecting_the_operation/podcasts/drafts/ATO_EP04_register_pass_v2_NOTES.md` — the change log.
- Do NOT edit `ATO_EP04_what_power_is.md` or any other file. Do not run git or make.
- Run `python3 tools/check_antithesis.py <your draft>` and fix every CERTAIN hit in host prose.

## Method: edit turn by turn, do not restructure
Start from the current `Architecting_the_operation/podcasts/ATO_EP04_what_power_is.md`. Keep the
order of segments and the arc. Revise, tighten, or cut individual turns. Do not merge segments,
move segments, or delete a segment wholesale.

## Register
College and graduate listeners with the emotional and material literacy for a technical argument.
- KEEP analogies that work at that level, where the analogy is itself a model the book uses: the
  computing substrate / host wetware / malicious priors / fractal mind virus; the circuit, the
  transistor gate, current and control current; Drude resistance and mean free time between
  collisions; inductive kickback; weather versus a located structure. These are collegiate
  analogies. Sharpen them with the book's precise terms; do not remove them.
- CUT elementary scaffolding: lay definitions of everyday things (e.g. "A transistor. A real one,
  the thing your phone is full of."), "say more" prompts, re-explaining what was just said,
  repeated summaries, and analogies that only restate something the listener already knows.
- NAME the book's constructs precisely where the script is vague (five tiers by name, status wage,
  Concession Theorem, Model C / interference engine, non-commutative policy sequence,
  multiplicative intersection). Use only what is in `Paper/The_Original_Power.tex` or the EP04
  notes. Never invent a study, statistic, date, or quotation.

## Voices stay distinct
- Toussaint is the skeptic and the listener's advocate. He pushes back, objects, presses for the
  strongest counter-case, and is sometimes right. He never issues instructions or essay prompts.
- Aisha carries the analysis and the evidence.
- Emmanuel speaks as the author, first person, from his research and experience.
- Keep the humor and the conversational texture. Keep the refutational two-sided moves.

## Protected — leave the text exactly as is
- Every `[clip:...]` turn and every speaker name.
- The cold open through Toussaint's "Where you aim the anger matters" turn (case facts are
  fact-checked: `notes/EP04_cornell_case_record.md`).
- The targeting-error segment (from "So let's name what the feed is doing" through Emmanuel's
  "Keep the anger. It is earned. Change the aim.").
- The classroom / Social Identity Theory / two runtimes passage ("It hands it out in classrooms
  too" through the fractal mind virus turn).
- The oppression-Olympics segment: from "I have to ask the question everybody makes fun of"
  through "The oppression Olympics is a targeting error with a scoreboard", including handedness,
  the left-hand curve, height, Crenshaw, and Greenfield.
- The closing (the Texas prison farm object, the next-episode tease, Emmanuel's sign-off).

## Constraints
- Speakable by TTS: no symbols, Greek letters, equations, or markdown; numbers in words.
- Headers in the exact form `Name (MM:SS)`; timestamps may stay as they are.
- Never refer to the episode as "the hour" or "tonight" (the literal "every hour you spend furious
  at your neighbor" and the two listener-evening "tonight"s may stay).
- Length: cut at most about 10 percent of host words, all from unprotected turns.

## NOTES format
Per changed or cut turn: original header, what changed and why, and the tex line for any new
technical claim. End with host word counts before and after, and a list confirming each protected
section is byte-identical.
