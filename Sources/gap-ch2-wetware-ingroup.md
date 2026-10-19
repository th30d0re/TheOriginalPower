# Chapter 2 Sourcing Report: Wetware / In-Group Bias

**Session date:** 2026-09-03  
**Model:** GPT-5.6  
**Scope:** Items 3 and 4 only. Research report; no manuscript or bibliography edits.

## What Was Requested

Verify primary-source support for a concise description of the Tajfel minimal-group experiment and for a deep-time, non-racial account of in-group sorting based on kinship or coalition recognition. Each item must include an artifact-contact record, verbatim supporting text, provenance tier, exact proposed LaTeX, complete BibTeX, and a confirmed insertion point.

## How I Researched and Verified It

1. Read `Paper/The_Original_Power.tex` at lines 1828--1840 with `sed -n '1828,1840p'`.
2. Read the existing Social Identity Theory entry at `Paper/references.bib:4159--4168`. It is a 1979 theoretical chapter, `tajfel_turner_intergroup_conflict_1979`; it does not cite either primary experiment requested here.
3. Downloaded the original articles to `/tmp`, used their text layers only to locate relevant pages, rendered those pages at 165 dpi, and read the page images.
4. Resolved both DOI records through DOI content negotiation with `Accept: application/x-bibtex` and compared the returned metadata with the journal pages.
5. Re-ran `sed -n '1834,1838p' Paper/The_Original_Power.tex` and `nl -ba ... | sed -n '1834,1838p'` to confirm the insertion point.

## Item 3 — Tajfel Minimal-Group Paradigm

### Verdict: VERIFIED

The 1970 primary article supports the random, trivial group assignment; anonymous matrix allocations; and the preference for maximum intergroup difference at a cost to absolute in-group gain. The article describes random assignment under dot-estimation labels in the first experiment and random assignment under Klee/Kandinsky labels in the second. It does **not** mention a coin flip. The proposed text therefore omits the coin-flip formulation.

**Coin-flip subclaim: CANNOT CONFIRM from the opened original artifact.**

### Artifact opened + how

- **Artifact:** Henri Tajfel, “Experiments in Intergroup Discrimination,” *Scientific American* 223, no. 5 (November 1970), 96--102. DOI: [10.1038/scientificamerican1170-96](https://doi.org/10.1038/scientificamerican1170-96).
- **PDF opened:** [page-facsimile PDF hosted by UC Merced](https://faculty.ucmerced.edu/jvevea/classes/Spark/readings/tajfel-1970-experiments-in-intergroup-discrimination.pdf). Downloaded with `curl -L --fail` to `/tmp/tajfel1970.pdf`.
- **Page-image procedure:** `pdftoppm -f 4 -l 7 -r 165 -png /tmp/tajfel1970.pdf /tmp/tajfel1970-page`, followed by direct image inspection of PDF pages 4--7, whose printed folios are 99--102.
- **Metadata check:** `curl -L -H 'Accept: application/x-bibtex' 'https://doi.org/10.1038/scientificamerican1170-96'` returned the author, title, journal, volume, issue, month, page range, and DOI used below.

### What the rendered pages establish

- Printed page 99 identifies the participants as schoolboys in Bristol and states that the dot-estimation groups were assigned at random.
- Printed page 100 reproduces an allocation matrix headed “Booklet for group preferring Klee.” Its caption states that recipients were identified only by number and group.
- Printed page 101 states that boys viewed unsigned Klee and Kandinsky reproductions, received random Klee/Kandinsky group assignments, and allocated points convertible to money. It distinguishes maximum joint profit, maximum in-group profit, and maximum difference in favor of the in-group.
- The result sentence begins at the foot of printed page 101 and continues at the top of printed page 102. It states that maximum difference prevailed despite the sacrifice of maximum joint profit and maximum in-group profit. This directly supports “they gave up in-group profit to widen the gap.”

### Verbatim source passage

Printed pages 101--102, sentence spanning the page break:

> “…at the sacrifice of both of these utilitarian advantages, it was the maximization of difference that seemed more important to them.”

This is the operative finding. The “two utilitarian advantages” are defined immediately before the page break as profit for all and profit for the in-group. No numerical result is proposed in the LaTeX, so no percentage, count, or sample-size figure is imported into the manuscript.

### Provenance tier

**Tier 1 — original paper.** Tajfel reports his Bristol experiments in his own 1970 article.

### Proposed LaTeX

```latex
In Tajfel's Bristol experiments, schoolboys were assigned at random to nominal groups under dot-estimation or Klee/Kandinsky labels, then used matrices to allocate money between anonymous in-group and out-group members. Where maximum difference conflicted with maximum joint profit and maximum in-group profit, they privileged the difference, surrendering absolute in-group gain to widen the gap \cite{tajfel_experiments_intergroup_discrimination_1970}.
```

### Proposed BibTeX

```bibtex
@article{tajfel_experiments_intergroup_discrimination_1970,
  author    = {Tajfel, Henri},
  title     = {Experiments in Intergroup Discrimination},
  journal   = {Scientific American},
  year      = {1970},
  month     = nov,
  volume    = {223},
  number    = {5},
  pages     = {96--102},
  issn      = {0036-8733},
  doi       = {10.1038/scientificamerican1170-96},
  url       = {https://doi.org/10.1038/scientificamerican1170-96}
}
```

### Exact insertion point

**Insert after `Paper/The_Original_Power.tex:1836`, after the sentence:**

> The framework rejects biological inevitability: the Elite's legal and social code exploited a general-purpose cognitive architecture by routing its prediction machinery through a legally enforced racial partition.

The line and sentence were confirmed with `sed -n '1834,1838p' Paper/The_Original_Power.tex` and numbered output from `nl -ba`.

## Item 4 — Deep-Time In-Group Bias

### Verdict: VERIFIED

The coalitional-recognition route is verified. The primary PNAS paper argues that racial encoding is a contingent output of an evolved alliance-tracking system. Its evolutionary account places coalitions and alliances in related primates and probably before the hominid lineage. Its experiments then show that racial encoding declines when visible coalition cues cease to correspond to race. This supports a deep-time sorting mechanism whose operative signal is alliance recognition, with phenotype functioning as a contingent coalition cue.

This verdict does not add a kin-selection claim. Hamilton is unnecessary for the tighter coalitional claim established by the opened artifact. Jebel Sahaba and Nataruk were neither consulted nor used.

### Artifact opened + how

- **Artifact:** Robert Kurzban, John Tooby, and Leda Cosmides, “Can Race Be Erased? Coalitional Computation and Social Categorization,” *Proceedings of the National Academy of Sciences of the United States of America* 98, no. 26 (2001), 15387--15392. DOI: [10.1073/pnas.251541498](https://doi.org/10.1073/pnas.251541498).
- **PDF opened:** [author/institution-hosted published PDF at the UCSB Center for Evolutionary Psychology](https://cep.ucsb.edu/wp-content/uploads/2023/05/eraserace.pdf). Downloaded with `curl -L --fail` to `/tmp/kurzban2001-ucsb.pdf`.
- **Page-image procedure:** `pdftoppm -f 1 -l 5 -r 165 -png /tmp/kurzban2001-ucsb.pdf /tmp/kurzban2001-ucsb-page`, followed by direct image inspection of printed pages 15387, 15390, and 15391.
- **Metadata check:** `curl -L -H 'Accept: application/x-bibtex' 'https://doi.org/10.1073/pnas.251541498'` returned the author list, title, journal, volume, issue, month, page range, and DOI used below.

### What the rendered pages establish

- Printed page 15387 says that categorization into “us” and “them” operated throughout human species history. It identifies racial encoding as a byproduct of adaptations for detecting coalitions and alliances.
- The same page places coalitions and alliances within ancestral bands, notes the pattern in related primates, and describes it as probably older than the hominid lineage.
- Printed page 15390 reports that coalition membership was tracked more carefully than race when race was irrelevant to the active coalition. It states that racial appearance stayed constant and that appearance cues, including race, were used according to their predictive value for coalition.
- Printed page 15391 concludes that race is a historically contingent subtype of coalition and reports a sharp reduction in racial categorization after brief exposure to a social setting in which race did not predict alliance.

### Verbatim source passage

Printed page 15387, right column:

> “…a pattern found in related primate species and likely to be far more ancient than the hominid lineage itself…”

The antecedent of “a pattern” in the same sentence is coalitions and alliances within bands. No archaeological site is involved, and no numerical evolutionary date is asserted.

### Provenance tier

- **Experimental coalition/race finding: Tier 1 — original paper.** The article reports the authors' own experiments.
- **Deep-time primate comparison: Tier 2 — peer-reviewed scholarly synthesis.** Kurzban, Tooby, and Cosmides state the comparison in the opened paper while citing an edited primatology volume for its underlying evidence. The proposed wording attributes the conclusion to these authors; it does not present an independently verified primatology result.

### Proposed LaTeX

```latex
Coalition tracking supplies the older architecture: Kurzban, Tooby, and Cosmides locate coalitions and alliances in related primates and probably before the hominid lineage. Their experiments showed that visible alliance cues reduced racial encoding when race ceased to track coalition; phenotype functioned as a contingent proxy for alliance \cite{kurzban_tooby_cosmides_race_2001}.
```

### Proposed BibTeX

```bibtex
@article{kurzban_tooby_cosmides_race_2001,
  author    = {Kurzban, Robert and Tooby, John and Cosmides, Leda},
  title     = {Can Race Be Erased? Coalitional Computation and Social Categorization},
  journal   = {Proceedings of the National Academy of Sciences of the United States of America},
  year      = {2001},
  month     = dec,
  volume    = {98},
  number    = {26},
  pages     = {15387--15392},
  issn      = {1091-6490},
  doi       = {10.1073/pnas.251541498},
  url       = {https://doi.org/10.1073/pnas.251541498}
}
```

### Exact insertion point

**Insert immediately after the Item 3 proposal above.** In the current unedited manuscript, this remains after `Paper/The_Original_Power.tex:1836`, after the sentence:

> The framework rejects biological inevitability: the Elite's legal and social code exploited a general-purpose cognitive architecture by routing its prediction machinery through a legally enforced racial partition.

The line and sentence were confirmed with `sed -n '1834,1838p' Paper/The_Original_Power.tex` and numbered output from `nl -ba`.

## Challenges Encountered

1. The Wiley PDF endpoint for the 1971 article returned HTTP 403. The accessible 1970 first-party article by Tajfel contains the requested procedure and maximum-difference result, so the report relies on that opened artifact.
2. The common “coin flip” description does not appear in the opened 1970 article. It was excluded from the proposed LaTeX.
3. The Tajfel PDF is a scan. Its text layer served only as a locator; every substantive point was checked against rendered page images and printed folios.
4. Item 4 required a deep-time route free of the two prohibited archaeological sites. The original PNAS article supplies a direct evolutionary and experimental coalitional route.
5. The PNAS article supports coalition recognition directly. Adding kin selection would require a separate argumentative bridge and would lengthen the passage without strengthening the verified sentence.

## Next Ideas (6 Ideas)

1. Ask the independent verifier to test the “absolute in-group gain” paraphrase specifically against the page 101--102 sentence spanning the page break.
2. Ask the verifier to inspect the rendered Klee/Kandinsky matrix on printed page 100 and confirm that “anonymous” is constrained to identity, with group membership still visible.
3. Keep the existing 1979 Social Identity Theory citation for the general theory and add the 1970 citation only for the experiment.
4. Consider whether “nominal groups” matches the chapter's technical vocabulary or whether “groups” alone is tighter.
5. Verify the final typeset line wrapping so the two additions do not create an orphaned paragraph heading.
6. After any manuscript edit, render the changed PDF page and inspect the citation output and paragraph rhythm before the edit is accepted.
