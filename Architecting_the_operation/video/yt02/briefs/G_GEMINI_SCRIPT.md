# G script draft — YT02v2_ov notes of 2026-10-29

## Hard rules (read first)

You write exactly two files:

- `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.G_draft.md`: start by copying `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md` byte for byte, then edit the copy.
- `Architecting_the_operation/video/yt02/logs/G_script_gemini.md`: your change log.

Never edit the original script, the shot lists, cards, Figma files, `Paper/`, `outputs/` or `scriptcast.toml`. Create no helper scripts in the repo. Run no git command that changes the tree. Do not run scriptcast.

Read `Architecting_the_operation/video/yt02/briefs/G_AUTHOR_NOTES.md` in full. It is the authority. `Architecting_the_operation/video/yt02/feedback/OV_turn_map_2026-10-29.md` locates each turn by its spoken text. The book is `Paper/The_Original_Power.tex`.

## Format you must keep

- A turn is a header line `Emmanuel Theodore (m:ss)` followed by its text and optional HTML comments. A new turn reuses the previous turn's timestamp and adds `<!-- TIME: estimate -->`.
- Keep every `<!-- SEG nn · … -->` marker and every `<!-- [book …] -->` citation comment you do not deliberately move.
- When you move a passage, move its comments with it and add `<!-- MOVED from SEG nn (G10) -->`.
- Years spoken in this episode are written in words ("fourteen forty-one"). Keep that.
- Direct affirmative declarative sentences only. No "it is not X, it is Y", no "more than just", no "not merely". This is a hard project rule.

## Implement (script side only)

Work on SEG 00 through SEG 10 (the turns up to the complex-wage axes, OV turn ~350). Apply R1 (register) to those segments throughout.

- **G2.** Remove or rewrite the causal-arrow question at OV turn 78.
- **G3.** Merge turn 82 into turn 79's departure statement. Racism is classified only as a system: a new claim, derivable from the literature.
- **G4.** Register (R1). For every dense sentence, keep the precise version and add one plain restatement, or replace jargon that carries no precision. Example given by the author: turn 84.
- **G7.** At the theory→history switch (turn 105), ask where anti-Black phenotypical prejudice began. Say why the separation of prejudice, bias, discrimination and racism matters. Show that this precision dismantles "it has always been that way" and the arguments built on folding the terms together.
- **G9.** Rewrite turn 117 so nothing presupposes the tiers.
- **G10.** Reorder SEG 05–07 into the eight-step order in the notes:
  - Move Tajfel (turns 145–146 and their following turns) up next to the in-group and out-group definitions.
  - Bring the set-theory refresher (turns 150–151 and the "four operations" passage) before the first set appears.
  - Then I and O as sets, then the orthographic illusion, then the five tiers with Equation 2.2 (turns 160–161).
  - Then set theory over the tiers.
  - Drop the question-begging "why" lines that the reorder makes redundant.
  - Keep turn 121's "What makes racism count as a system at all?"
- **G14.** At turn 184, give each Table 2.1 level one example of a popular public argument. Use `<!-- FACT-HOLD: G14 -->` where you are not sure the argument is attributable.
- **G15.** Remove the first person around turn 193.
- **G16.** Add the four-tier → five-tier history: slave patrols drawn from the Buffer Class; the 13th Amendment exception clause; formal policing. Wrap it in `<!-- FACT-HOLD: G16 -->` until the research pass confirms it.
- **G17.** Rewrite the narration of turns 194–203 to match the new camera: zoomed 50/50 entry, no "rotate the image", the pull-back reveal, looking up (white) and looking down (black).
- **G18.** Refine turn 200: they can see the tiers; the failure is that they cannot locate the members. Add `<!-- BOOK-UPDATE? G18 -->`.
- **G19.** Turn 203: name the top three tiers as the control node.
- **G22.** Insert the firearms passage after turn 236 and foreshadow it at 234–235. FACT-HOLD each factual sentence until the research confirms it.
- **G23.** Insert the Zuraran-ideology step-back after turn 246.
- **G25.** Insert the moral-exclusion bridge at turn 252. Loop it back to the Lagos spectators (turn 232) and into the zero-day exploit.
- **G27.** Insert the out-of-Africa passage after turn 261, all FACT-HOLD.
- **G29.** Expand turn 331 with states as experiments, FACT-HOLD.
- **G31.** Remove the restatement at turn 345 so it builds on turn 338 instead of reintroducing it.
- **Visual cues.** Where a note asks for a picture, add `<!-- SHOT: G5 Figure 2.2, highlight forward arrows -->` and similar, so the shot-list rebuild can place it.

FACT-HOLD means writing the sentence and wrapping it as:

```
<!-- FACT-HOLD: G22 -->
sentence
<!-- /FACT-HOLD -->
```

The Codex pass resolves these markers against `Architecting_the_operation/video/yt02/logs/G_research.md`.

## Change log

`G_script_gemini.md` holds:

- a table with one row per G item: done / hold / not mine, and the new location;
- a list of moved passages (from → to);
- the old and new word counts.

## Stop

Stop when the draft and the log exist. Run `python3 tools/check_antithesis.py Architecting_the_operation/podcasts/YT02_v2_what_racism_is.G_draft.md` and paste its CERTAIN hits into the log.
