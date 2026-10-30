# H2: a full Haitian Revolution section for YT02v2

## Hard rules

You write exactly the files your step names below. Never edit the episode script, `Paper/`, `outputs/`, shot lists, cards or Figma files. Run no git command that changes the tree, and do not run scriptcast.

## Why

The author, on 2026-10-30, called the Haitian Revolution the one major condition of racism this episode leaves out, and wants a full section on it. The episode's tests run as follows:

- Portugal (SEG 08) tests Prediction 1;
- Virginia (SEG 09) tests Prediction 2;
- the wage phasor (SEG 10) formalizes Virginia's buffer wage;
- the American backlash 1840–2020 (SEG 11) tests the circuit.

The episode closes on the Concession Theorem (Δmax = 0; no peaceful reform has produced a sustained reduction). Haiti, 1791–1804, sits between Virginia and 1840. It is the book's one case of local kernel termination, and the Elite's containment of it is the reimposition pattern that SEG 11's circuit then models.

The section is a new `<!-- SEG 10b · Haiti, 1791–1825 -->`, placed after the last SEG 10 turn and before `<!-- SEG 11 · Test 3 … -->` in `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`. Read SEG 08–11 and SEG 15 first.

## The book is the authority

`Paper/The_Original_Power.tex`. Read:

- tex:363 (anchor-case table);
- Ch 6, "The Haitian Export" (tex:3519 onward, including Runtime Log: Haiti at tex:3523);
- §20.3.1, "Haiti (1804): Revolution Succeeded, Liberation Contained" (tex:13062);
- the Haitian Theorem definition and case study (tex:12296–12345);
- Saint-Domingue in 1802 (tex:14125–14236);
- the Firmin passage (tex:3207–3231).

Use the book's vocabulary exactly: E_global, P_debt, O_emancipated, O_degraded, ρ_τ, kernel termination, Inverse Contagion, Sovereign Ransom. Tag every book claim `<!-- [book tex:LINE] -->`.

## Step 1: research. Write `Architecting_the_operation/video/yt02/logs/H_haiti_research.md`

Verify each historical claim the section will use, giving a source and a confidence for each, and record agreement or disagreement with the book's figures:

- Saint-Domingue's place in the 1780s Atlantic economy: its share of world sugar and coffee, and enslaved versus free populations. The book says about 450–500k enslaved against about 30k white planters (tex:3569).
- Bois Caïman and the August 1791 northern uprising.
- Toussaint Louverture; the 1793–1794 emancipations (Sonthonax, then the National Convention's decree of 16 Pluviôse an II).
- The 1801 constitution; Leclerc's 1802 expedition; Napoleon's 1802 restoration of slavery elsewhere; Vertières (November 1803); independence on 1 January 1804.
- The Louisiana Purchase link (1803).
- The 1825 indemnity: 150 million francs, reduced to 90 million in 1838; the "double debt" and when it was paid off. Check the book's "up to 80% of the national budget until 1947" claim.
- US non-recognition until 1862.
- The US response at home: slaveholder fear, the 1811 German Coast uprising, tightened codes. Use this to test Prediction 2 at hemispheric scale.
- Pétion's aid to Bolívar, 1815–1816, conditioned on abolition.
- The 1915–1934 US occupation and the corvée.

Cite C. L. R. James, *The Black Jacobins*; Laurent Dubois, *Avengers of the New World*; the 2022 New York Times "The Ransom" investigation; and primary decrees where possible. If you cannot source a claim, say so.

## Step 2: draft. Write `Architecting_the_operation/podcasts/YT02_v2_H_haiti_draft.md`

About 8–12 minutes spoken, roughly 25–40 turns. Arc:

1. **The bridge.** From Virginia's buffer wage to the richest plantation colony on earth.
2. **Saint-Domingue as the extraction apex.**
3. **The revolution, 1791–1804,** as kinetic kernel termination. Use the book's framing (Haitian Theorem, ρ_τ = 1.0) and give the theorem's scope qualifications exactly as the book states them.
4. **The Elite's response**, as the reimposition pattern:
   - quarantine (non-recognition);
   - P_debt (the 1825 Sovereign Ransom);
   - F_enforce^global (the 1915 occupation).
5. **The US domestic response** as a Prediction 2 test.
6. **The Inverse Contagion** (Pétion and Bolívar).
7. **The handoff into SEG 11:** reimposition after a breach is the pattern the backlash circuit now models.

Format, exactly as in the episode:

- each turn is a header line `Emmanuel Theodore (m:ss)` plus the text;
- reuse the last SEG 10 timestamp with `<!-- TIME: estimate -->`;
- add `<!-- SHOT: … -->` comments for maps, documents, equation cards and a Haiti timeline;
- spell out years in words;
- give precise statements, then one plain restatement where the precision is dense;
- no first person and no question-begging;
- direct affirmative statements only: no "not X but Y", "more than just" or "not merely";
- a `<!-- [source] -->` after every factual sentence.

**Framing safety.** The episode is for YouTube. State the Haitian Theorem as the book's descriptive historical claim with its scope. Never phrase it as a call to action or an endorsement of violence. Name the revolution's violence plainly as history.

Run `python3 tools/check_antithesis.py` on the draft and paste the CERTAIN hits under `## Notes` at its end.
