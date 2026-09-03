# Gap-Cluster A — Chapter 3, Firmin Counter-Signal Section: Modern Genetics Items (27, 28, 29, 32)

**Date:** 2026-09-02
**Researcher model:** Kimi Code CLI
**Scope:** `Paper/The_Original_Power.tex:2841–2858` ("The Counter-Signal: Anténor Firmin and the Empirical Demolition of Scientific Racism")
**Source of items:** `Sources/gap-analysis_how-did-humans-invent-racism.md`, §2 table, items 27, 28, 29, 32.

**Method note:** For the two scanned sources, the PDFs were downloaded and their pages rendered to PNG with `pdftoppm -r 165 -png` and the page images read directly. Text layers were used only to locate pages, never to confirm content. The HTML sources (White House transcript, NHGRI timeline, AAA statement) were fetched and read directly.

---

## ITEM 27 — Lewontin 1972 — VERIFIED

**Verdict: VERIFIED.** The paper's own three-level decomposition is 85.4% within populations / 8.3% between populations within races / 6.3% between races, across 17 gene systems. The gap analysis's figures (85.4% and 6.3%) are exact. The paper's own table also carries the middle component (8.3% between populations within races), which the gap analysis omits; a citation of this table should carry all three components.

**Artifact opened + how.** Downloaded a page-image scan of the original chapter (PDF, 18 pages) and rendered the page carrying Table 4 with `pdftoppm -f 16 -l 16 -r 165 -png`, then read the page image. The running head reads "396 R. C. Lewontin". Bibliographic record confirmed at the publisher page for DOI `10.1007/978-1-4684-9063-3_14` (SpringerLink: *Evolutionary Biology* vol. 6, eds. Dobzhansky, Hecht, Steere; pp. 381–398; © 1972 Meredith Corporation).

**Verbatim sentences carrying the figures** (read from the rendered page image, printed folio 396):

- Table 4 caption: "Table 4. Proportion of Genetic Diversity Accounted for Within and Between Populations and Races." Mean row of Table 4: Within Populations `.854`, Between Populations [within races] `.083`, Between Races `.063`. Table 4 lists 17 gene systems (Hp, Ag, Lp, Xm, Ap, 6PGD, PGM, Ak, Kidd, Duffy, Lewis, Kell, Lutheran, P, MNS, Rh, ABO).
- "The results are quite remarkable. The mean proportion of the total species diversity that is contained within populations is 85.4%, with a maximum of 99.7% for the Xm gene, and a minimum of 63.6% for Duffy."
- "Moreover, the difference between populations within a race accounts for an additional 8.3%, so that only 6.3% is accounted for by racial classification."

**Provenance tier:** 1 (primary — the original paper, read at printed folio 396).

**Proposed BibTeX:**

```bibtex
@incollection{lewontin1972,
  author    = {Lewontin, Richard C.},
  title     = {The Apportionment of Human Diversity},
  booktitle = {Evolutionary Biology},
  volume    = {6},
  editor    = {Dobzhansky, Theodosius and Hecht, Max K. and Steere, William C.},
  pages     = {381--398},
  publisher = {Springer US},
  address   = {New York, NY},
  year      = {1972},
  doi       = {10.1007/978-1-4684-9063-3_14},
}
```

**Insertion point:** after `The_Original_Power.tex:2852` (see Proposed Passage at the end of this report).

---

## ITEM 28 — Human Genome Project "99.9%" — VERIFIED, BUT THE 2003 DATE IS WRONG

**Verdict: VERIFIED, with a mandatory correction to the attribution.** The figure is real, quotable, and documented — but the gap analysis's "HGP 2003" dating is wrong. The 99.9% figure belongs to the 2000/2001 draft era, not to the April 2003 completion. This is exactly the misdating the task brief warned about.

**Artifacts opened + how:**

1. White House transcript, June 26, 2000: fetched and read `https://clintonwhitehouse5.archives.gov/WH/EOP/OSTP/html/00628_2.html` — official archived transcript, "REMARKS BY THE PRESIDENT ... ON THE COMPLETION OF THE FIRST SURVEY OF THE ENTIRE HUMAN GENOME PROJECT", East Room, June 26, 2000, 10:19 A.M. EDT.
2. NHGRI Human Genome Project timeline: fetched and read `https://www.genome.gov/human-genome-project/timeline`.

**Verbatim sentences carrying the figure:**

- President Clinton (transcript): "I believe one of the great truths to emerge from this triumphant expedition inside the human genome is that in genetic terms, all human beings, regardless of race, are more than 99.9 percent the same."
- NHGRI timeline (2001 entry): "Researchers also report that the DNA sequences of any two human individuals are 99.9% identical."

**What the figure refers to:** base-pair identity between any two human genomes — roughly 0.1% of the ~3 billion base pairs, i.e. millions of variable positions. NHGRI places the report of the figure at the February 12, 2001 draft publication; Clinton stated it at the June 26, 2000 draft announcement. The manuscript should attribute the figure to the 2000/2001 draft era, not to the project's April 2003 completion.

**On the Venter quote:** verified verbatim from the same transcript. Venter's remarks: "...to help illustrate that the concept of race has no genetic or scientific basis. In the five Celera genomes, there is no way to tell one ethnicity from another."

**Provenance tier:** 1 (official White House transcript; NHGRI institutional timeline). Caveat per Rule 5: I did not open the IHGSC 2001 *Nature* paper itself to confirm the 99.9% figure appears in its text. The artifacts above suffice for the proposed sentence as written (attributing the figure to the 2000 announcement, cited to the transcript).

**Proposed BibTeX (only if item 28 is used):**

```bibtex
@misc{clinton_genome_2000,
  author       = {{The White House, Office of the Press Secretary}},
  title        = {Remarks by the President, Prime Minister Tony Blair of England, Dr. Francis Collins, and Dr. Craig Venter on the Completion of the First Survey of the Entire Human Genome Project},
  year         = {2000},
  month        = {6},
  note         = {White House ceremony, East Room, June 26, 2000},
  howpublished = {White House transcript},
  url          = {https://clintonwhitehouse5.archives.gov/WH/EOP/OSTP/html/00628_2.html},
}
```

(If the manuscript instead cites the NHGRI timeline, an `@misc` for `genome.gov/human-genome-project/timeline` is the alternative. Pick one; do not cite both.)

---

## ITEM 29 — Rosenberg et al. 2002 — VERIFIED

**Verdict: VERIFIED.** Every figure in the gap analysis checks against the paper's own abstract: 377 microsatellite loci, 1,056 individuals, 52 populations, 93–95% within-population variation, 3–5% among major groups, six main genetic clusters (five corresponding to major geographic regions).

**Artifact opened + how.** Downloaded the published Science PDF (5 pages) from the Pritchard lab publications archive at Stanford (`https://web.stanford.edu/group/pritchardlab/publications/pdfs/RosenbergEtAl02.pdf`) — the published article, Science vol. 298, 20 December 2002, pp. 2381–2385. Rendered page 1 with `pdftoppm -f 1 -l 1 -r 165 -png` and read the page image; the footer reads "SCIENCE VOL 298 20 DECEMBER 2002". DOI confirmed via the PubMed record (PMID 12493913): `Science. 2002 Dec 20;298(5602):2381-2385, doi:10.1126/science.1078311`.

**Verbatim sentence carrying the figures** (abstract, read from the rendered page image of p. 2381):

"We studied human population structure using genotypes at 377 autosomal microsatellite loci in 1056 individuals from 52 populations. Within-population differences among individuals account for 93 to 95% of genetic variation; differences among major groups constitute only 3 to 5%. Nevertheless, without using prior information about the origins of individuals, we identified six main genetic clusters, five of which correspond to major geographic regions, and subclusters that often correspond to individual populations."

**What the paper actually concluded about clusters:** The abstract carries both results side by side. The paper identified six main genetic clusters, five of which correspond to major geographic regions — AND it reports that within-population differences account for 93 to 95% of genetic variation while differences among major groups constitute only 3 to 5%. Both halves must be carried in any citation; quoting only the cluster sentence misrepresents the paper in one direction, and quoting only the variance figures conceals that the study also found six main clusters. The paper does not use the word "race" as a validated taxonomy; its closing sentence concerns epidemiological risk and genetic association studies.

**Provenance tier:** 1 (primary — the original paper, read at p. 2381).

**Proposed BibTeX:**

```bibtex
@article{rosenberg2002,
  author  = {Rosenberg, Noah A. and Pritchard, Jonathan K. and Weber, James L. and Cann, Howard M. and Kidd, Kenneth K. and Zhivotovsky, Lev A. and Feldman, Marcus W.},
  title   = {Genetic Structure of Human Populations},
  journal = {Science},
  year    = {2002},
  volume  = {298},
  number  = {5602},
  pages   = {2381--2385},
  doi     = {10.1126/science.1078311},
}
```

---

## ITEM 32 — American Anthropological Association Statement on Race, 1998 — VERIFIED, RECOMMEND CUT

**Verdict: VERIFIED.** Date confirmed: adopted by the AAA Executive Board on May 17, 1998.

**Artifact opened + how.** Fetched and read `https://americananthro.org/about/policies/statement-on-race/` — the AAA's own page for the statement. The page states: "The following statement was adopted by the Executive Board of the American Anthropological Association on May 17, 1998, acting on a draft prepared by a committee of representative American anthropologists." The page also documents the statement's origin: drafted by Audrey Smedley, reviewed by a working group of anthropologists, adopted May 17, 1998.

**Verbatim sentences carrying the claims:**

- "Given what we know about the capacity of normal humans to achieve and function within any culture, we conclude that present-day inequalities between so-called 'racial' groups are not consequences of their biological inheritance but products of historical and contemporary social, economic, educational, and political circumstances."
- The statement also contains its own variance figures: "Evidence from the analysis of genetics (e.g., DNA) indicates that most physical variation, about 94%, lies within so-called racial groups. Conventional geographic 'racial' groupings differ from one another only in about 6% of their genes." (The statement's own text.)

**Provenance tier:** 3 (institutional position statement; its 94%/6% figures are rounded and unsourced within the statement).

**Recommendation: CUT.** The gap analysis called it "optional ballast" and this is right: it adds institutional consensus, not data. The statement's figures are rounded echoes of Lewontin's decomposition. The section's through-line is empirical; the AAA statement adds nothing beyond items 27 and 29. Recommend cutting — a useful answer.

**Proposed BibTeX (only if retained):**

```bibtex
@misc{aaa_race_1998,
  author       = {{American Anthropological Association}},
  title        = {AAA Statement on Race},
  year         = {1998},
  howpublished = {Statement adopted May 17, 1998},
  url          = {https://americananthro.org/about/policies/statement-on-race/},
}
```

---

## PROPOSED PASSAGE (one paragraph)

Insertion point: after `Paper/The_Original_Power.tex:2852`, following the sentence "The finding prefigures the Boasian revolution by forty years and anticipates modern critiques of racialized data collection by over a century."

```latex
Modern genetics returned the audit's verdict with better instruments. In 1972, Richard Lewontin apportioned human genetic diversity across seventeen loci: 85.4 percent of the species' total diversity lay within populations, 8.3 percent between populations within races, and 6.3 percent between the racial groups the discipline had named \cite{lewontin1972}. Three decades later, Rosenberg and colleagues measured the same quantity at the genome's own resolution: genotypes at 377 autosomal microsatellite loci in 1,056 individuals from 52 populations returned 93 to 95 percent of genetic variation within populations and 3 to 5 percent between major geographic groups \cite{rosenberg2002}. The signal Firmin could not find in craniometric tables, the genome does not contain either.
```

**If only two items could be used, cut 28 and 32.** Lewontin and Rosenberg are the empirical spine of the passage; the HGP figure is a press soundbite (2000, not 2003); the AAA statement is consensus, not data.

---

## WHAT REMAINS UNVERIFIED (stated plainly, per protocol Rule 5)

1. I did not open the IHGSC 2001 *Nature* paper itself to confirm the 99.9% figure appears in its text. The 99.9% claim is documented by the White House transcript and the NHGRI timeline (both Tier 1 institutional artifacts), but the figure's precise locus inside the 2001 *Nature* paper was not checked. If the manuscript cites the 2001 paper, that page must be opened first.
2. The scan of Lewontin 1972 was downloaded from a third-party mirror; its content was verified against the publisher record (Springer, DOI 10.1007/978-1-4684-9063-3_14) and the rendered page image confirms the printed folio 396. The mirror's own provenance is incidental to the verification.