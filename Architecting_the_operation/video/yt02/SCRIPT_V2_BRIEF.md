# Brief: YT02 script v2 ("What Racism Is", now the channel's Episode 1)

**HARD FILE RULES. Never run git. Write ONLY `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md` and
`Architecting_the_operation/video/yt02/logs/script_v2.md`. Never edit `Paper/`, the v1 script, or any other file.
Never create helper scripts at the repo root.**

## Inputs (read them; do not paste them back)
- v1 script: `Architecting_the_operation/podcasts/YT02_what_racism_is.md`. Keep its markup conventions:
  `<!-- SEG nn · title -->` headers, the `<!-- [book §…, Eq …] -->` provenance comment after each claim, and
  `[clip:<id>]` tags.
- The author's revision list: `Architecting_the_operation/video/yt02/REVISION_v2_FEEDBACK.md`. Implement every item
  in sections A, B, C, E/F, and the narration parts of G and H. Sections D, G and H are visual; add a
  `<!-- VISUAL: … -->` note where a shot must change, without designing it.
- The authority on every claim: `Paper/The_Original_Power.tex`. New material is in `subsec:arms_joint_wage`, the
  complex-wage axis paragraph (search "quarter turn clockwise"), and §"The Bayesian Defense: Hardwiring the Priors".
- Verified primary sources with exact wording: `Architecting_the_operation/video/yt02/archive/SOURCES.md`. Quote only
  from there or from the .tex.
- `AGENTS.md`: the rhetorical rule.

## Non-negotiable style
- **No formulaic antithesis anywhere**: no "not X but Y", "it's not just X", "more than merely", "X, not Y" used as a
  correction, or "rather than" setups. Write direct declarative sentences.
- The audience is college/graduate level. Name the constructs and skip K-12 scaffolding.
- Say "cannabis". The five positions are **tiers**, never "jobs".
- Every clip is introduced on air: who is speaking, the platform or source, what it is, and when.
  For Atwater, use `[clip:atwater_1981]` with the YT01 introduction (YT01 script L1083–1092).
- Write numbers as the TTS should speak them: "Equation two point nineteen", "two point one five". Never write "2.19".
- Ask "why" out loud before answering it. The episode's through-line is: always ask why.

## Structure (author-directed)
1. Cold open and hook: "the definition of racism most of us were taught is wrong, and here is why". Then a roadmap of
   the episode. The narrator is the author of *The Original Power*. Credit the book, and drop any credit to the
   Architecting the Operation series.
2. Established literature first: bias (sociological, neurological/predictive-coding, and computer-science views,
   including the earned-bias example from item 8), prejudice, discrimination, the tripartite model. Then say plainly:
   "This is where the established literature ends."
3. The book's new material: the vector definition of racism, defined here before it is used anywhere else. Then the
   five tiers, introduced **once**, followed by the remaining segments in v1 order. Fold v1 SEG 05 in before the tiers.
4. Before the complex-number math, say why the diagnostic tool matters. The axis explanation follows section F of the
   revision list (a quarter turn, ×(−j), lengths, angles and handedness all preserved; extraction points up toward the
   Elite).
5. Arms as a joint wage, from the book subsection, with the verified Hening quotes (1640, 1705 §XIII musket, 1705
   §XXXV, 1738 §§V–VI), the Second Amendment "the people" linchpin, today's dual erosion, and the two-series
   calibration. This replaces v1 L1336.
6. Keep the late-book reach (the Concession Theorem and so on). The closing points viewers to the chapter-by-chapter
   series, which starts with the Chapter 2 walkthrough.

Target length: within ±10% of v1 (~19,000 words). Write segment by segment, appending to the output file, and after
each segment append one line to the log (segment, words, revision items covered). If you stop early, the log shows
where to resume.

## Final self-checks (record the results in the log)
- `grep -n -i -E "not (just|merely|only)|rather than|isn't (just|about)| but (rather|instead)"` on the output.
  Rewrite every hit that is a corrective contrast.
- `grep -n -E "[0-9]+\.[0-9]+"` returns no equation numbers written as digits.
- Every item number in the revision list appears as covered in the log.
