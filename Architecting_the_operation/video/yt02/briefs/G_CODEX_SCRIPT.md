# G script edit — Codex on Gemini's draft

## Hard rules

You edit exactly:

- `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.G_draft.md`, Gemini's draft and your input;
- `Architecting_the_operation/video/yt02/logs/G_script_codex.md`, your findings.

Never edit the original script, `Paper/`, `outputs/`, the shot lists, cards, Figma files or `scriptcast.toml`. Do not commit. Do not run scriptcast or any render.

## Read

- `Architecting_the_operation/video/yt02/briefs/G_AUTHOR_NOTES.md`: the authority.
- `Architecting_the_operation/video/yt02/logs/G_script_gemini.md`: what Gemini says it did.
- `Architecting_the_operation/video/yt02/logs/G_research.md`: verdicts for the FACT-HOLD items.
- `Paper/The_Original_Power.tex`: technical accuracy.

## Do

1. **Accuracy.** Check every new or moved sentence against the tex: tier names, equation numbers, set notation, what each equation says. Fix every wrong attachment of a book term to a mechanism. Gemini has done this before.
2. **FACT-HOLD.** Resolve each block against `G_research.md`:
   - SUPPORTED: remove the markers and add `<!-- [source] -->`.
   - PARTLY: rewrite it to the supported part, with a source comment.
   - UNSUPPORTED or DISAGREE: keep the hold and quote the research verdict in the comment.
   Never speak an unsupported claim.
3. **Coverage.** Each G item in the notes' script scope is implemented, or listed in your findings with the reason it is not.
4. **Register (R1) on SEG 11–15**, which Gemini did not cover. Apply the same rule: precise, then one plain restatement where the precision is dense; no question-begging (R2); no first person (R6).
5. **Integrity.**
   - No turn lost: compare against the original, and list every original turn's fate (kept / edited / moved / merged / deleted) in your findings, keyed by its first eight words.
   - Every SEG marker is present.
   - Spoken years are written in words.
6. Run `python3 tools/check_antithesis.py Architecting_the_operation/podcasts/YT02_v2_what_racism_is.G_draft.md`. Fix every CERTAIN hit in new lines.

## Findings file

`G_script_codex.md` holds:

- a corrections table: line | was | now | tex:LINE;
- the FACT-HOLD resolutions;
- the turn-fate list;
- the antithesis output;
- the old, Gemini and final word counts.

## Stop

Stop when the findings file records the checker output.
