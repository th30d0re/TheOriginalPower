# H segue: how the slave trade grew between Portugal and Virginia

## Hard rules

Write exactly one file: `Architecting_the_operation/podcasts/YT02_v2_H_segue_draft.md`. You may append your notes at its end, under `## Notes`. Never edit the episode script, `Paper/`, `outputs/`, shot lists, cards or Figma files. Run no git command that changes the tree, and do not run scriptcast.

## Where it goes

In `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`, the segue sits between the last SEG 08 turn and the first SEG 09 turn:

- the last SEG 08 turn starts "The boldest claim the Portugal archive licenses is chronological";
- the first SEG 09 turn starts "Why does Virginia test Prediction two after Portugal tests Prediction one?".

Read both segments so the segue picks up from the Portugal close and hands off to the Virginia opening. The Virginia opening's own question ("Why does Virginia test Prediction two…") must still make sense after the segue.

## Content

Use `Architecting_the_operation/video/yt02/logs/H_trade_research.md` as the source. Use only these figures, which are verified against SlaveVoyages:

- about twelve and a half million people embarked;
- about ten point seven million landed;
- about one point eight million died at sea (about fourteen and a half percent);
- Brazil received about forty-five percent;
- mainland North America received about three point six percent, roughly three hundred ninety thousand people;
- the quarter-century totals.

Do not use the per-flag or per-region sub-figures.

Cover, in order:

1. **Portugal's system goes Atlantic.** The Casa dos Escravos (1486), São Tomé as the first all-enslaved sugar island (1493), and Kongo and Angola (Luanda 1575).
2. **Spain's demand.** Hispaniola (1501) and the asiento (1518): a crown licence sold to carriers.
3. **Brazil's sugar.** The engenho (1532 onward), and the South Atlantic route from Brazil straight to Angola, which is why "triangle" oversimplifies.
4. **The northern companies.** The Dutch West India Company (1621; Brazil 1630, Elmina 1637), English Barbados (1627) and the 1640s sugar revolution, the Royal African Company (1672), and French Saint-Domingue (1697). Keep this brief: it looks ahead of 1619.
5. **The triangle.** Manufactured goods to Africa, captives across the Middle Passage, sugar, tobacco and rum back to Europe; the main ports.
6. **The Americas in 1619.** Who held what, where enslaved Africans were concentrated, and the Chesapeake as a marginal tobacco colony. Then hand off to Point Comfort.

Tie it to the book's vocabulary where the book supports it, citing `tex:LINE` in an HTML comment. Examples: the extraction kernel scaling across installations; Elite sponsorship through chartered companies. Never invent a book claim.

## Format and register

- Each turn is a header line `Emmanuel Theodore (m:ss)`, then the text. Reuse the timestamp of the SEG 08 last turn and add `<!-- TIME: estimate -->` under each header.
- About 10–14 turns and 3–4 minutes spoken.
- Open with `<!-- H1 · trade segue -->`.
- Add `<!-- SHOT: map … -->` comments saying which map frame each turn wants: route lines appearing, ports lighting, volumes scaling.
- Years are spelled out in words ("fifteen eighteen").
- Precise, then one plain restatement where the precision is dense. No first person. No question-begging. Direct affirmative statements only: no "not X but Y", "more than just" or "not merely".
- Put a `<!-- [source] -->` comment after every factual sentence.

## Stop

Stop when the draft exists. Then run `python3 tools/check_antithesis.py` on it and paste its CERTAIN hits under `## Notes`.
