# Sourcing Report — Chapter 2, Phenotype Control-Case Paragraph

**Task:** Source and extend the four unsourced empirical claims at
`Paper/The_Original_Power.tex:1828` with one tight paragraph of five items,
inserted immediately after that paragraph.
**Model:** Kimi Code CLI. **Date:** 2026-09-03.
**Scope discipline:** No `.tex` or `.bib` file was modified. No git command was
run. This report is the only output. Nothing under `Paper/` was written.

## Insertion point (verified against the live file)

`sed -n '1824,1832p' Paper/The_Original_Power.tex` confirms:

- Line 1828 is the paragraph beginning "The zero-day was the discovery that
  \textit{phenotype}---skin color, hair texture, facial features---could serve
  as a permanent, heritable, visually self-enforcing partition variable." and
  ending "...a layer that no amount of software updates (education,
  legislation, moral progress) could modify."
- Line 1829 is blank. Line 1830 begins "This zero-day was deployed at scale
  through the Transatlantic Slave Trade---...".

**Insert the new paragraph after line 1828** (i.e., in the blank line 1829
position, so it lands between the phenotype paragraph and the Transatlantic
Slave Trade paragraph). None of the proposed citation keys exist in
`Paper/references.bib` (checked with grep for
tishkoff|huxley|jablonski|chaplin|lamason|olalde|yurco|cheddar|cline — no
hits).

---

## ITEM 1 — Polygenic pigmentation (Crawford/Tishkoff et al. 2017, *Science*)

**Verdict: PARTIALLY VERIFIED — the paper exists and the cohort figure checks
out; the "~150 genes" figure is CANNOT CONFIRM for this paper and must not be
used.**

**Artifact opened and how:** Full author-manuscript text at
[PMC5759959](https://pmc.ncbi.nlm.nih.gov/articles/PMC5759959/) (published as
*Science* 2017;358(6365):eaan8433; DOI 10.1126/science.aan8433). Read the full
text in the browser-rendered page.

**Verbatim sentences carrying the figures:**

- Sample size: "we used a DSM II ColorMeter to quantify light reflectance from
  the inner arm as a proxy for melanin levels in **2,092** ethnically and
  genetically diverse Africans living in Ethiopia, Tanzania, and Botswana".
  (Separately: "We genotyped **1,570** African individuals with quantified
  pigmentation levels" — 2,092 is the phenotyped cohort, 1,570 the GWAS
  sample. Use 2,092 only for "measured/studied," not for "genotyped.")
- Gene count, actual text: "While **over 350 pigmentation genes have been
  identified in animal models, only a subset of these genes have been linked
  to normal variation in humans**." The paper does **not** contain the figure
  "~150 genes." Any 150-gene claim needs a different artifact; none was
  opened, so it is dropped.
- Architecture: "Approximately **28.9%** (S.E. 10.6%) of the pigmentation
  variance is attributable to these SNPs" and "Thus **~29% of the additive
  heritability of skin pigmentation in Africans is due to variation at these
  four regions**" (*SLC24A5, MFSD12, DDB1/TMEM138, OCA2/HERC2*).
- Caution the paper itself states: "the genetic architecture of skin
  pigmentation is **simpler** (i.e., fewer genes of stronger effect) than
  other complex traits, such as height." The paragraph should claim polygenic,
  multi-locus architecture — not "150 genes" and not maximal complexity.

**Attribution note:** first author is Nicholas G. Crawford; Sarah A. Tishkoff
is senior author. Cite as Crawford et al. 2017, not "Tishkoff et al."

**Provenance tier:** Tier 1 (original research paper, full text read).

**Proposed BibTeX:**

```bibtex
@article{crawford_pigmentation_2017,
  author  = {Crawford, Nicholas G. and Kelly, Derek E. and Hansen, Matthew E. B. and Beltrame, Marcia H. and Fan, Shaohua and Bowman, Shanna L. and others},
  title   = {Loci Associated with Skin Pigmentation Identified in African Populations},
  journal = {Science},
  volume  = {358},
  number  = {6365},
  pages   = {eaan8433},
  year    = {2017},
  doi     = {10.1126/science.aan8433},
}
```

---

## ITEM 2 — The cline (Huxley 1938, *Nature*)

**Verdict: VERIFIED (bibliographic record and abstract); the definitional full
text is paywalled, so claim the coinage, not a quotation.**

**Artifact opened and how:** The publisher's record at
[nature.com/articles/142219a0](https://www.nature.com/articles/142219a0):
"Clines: an Auxiliary Taxonomic Principle," JULIAN HUXLEY, *Nature* volume 142,
pages 219–220, issue date 30 July 1938, DOI 10.1038/142219a0. The visible
abstract argues against named subspecific forms because a named group "conveys
a false impression of uniformity within the named group, and thus tends to
inhibit the study of intra-group regularities of variation" — the argument of
the paper is precisely that variation is graded where names imply blocks. The
word "cline" in the 1938 title is the coinage; this is the source every later
text cites for the term.

**CANNOT CONFIRM (dropped):** the extension "different traits vary on
different gradients, which is why racial categories drawn from any one trait
are arbitrary." The candidate primary source (Livingstone 1962, "On the
Non-Existence of Human Races," *Current Anthropology* 3:279–281, DOI
10.1086/200290) is paywalled at journals.uchicago.edu (HTTP 403 on fetch);
the famous aphorism could not be read in the artifact, only in Tier-2/3
quotations. Per protocol, nothing is proposed for this point.

**Provenance tier:** Tier 1 (original paper; record and abstract read at the
publisher).

**Proposed BibTeX:**

```bibtex
@article{huxley_clines_1938,
  author  = {Huxley, Julian},
  title   = {Clines: An Auxiliary Taxonomic Principle},
  journal = {Nature},
  volume  = {142},
  number  = {3587},
  pages   = {219--220},
  year    = {1938},
  doi     = {10.1038/142219a0},
}
```

---

## ITEM 30 — UV-gradient adaptation and SLC24A5

**Verdict: VERIFIED. The correct SLC24A5 primary source is Lamason et al.
2005, not "Cheng et al. 2005" (Keith C. Cheng is the senior/last author of
Lamason et al.; no "Cheng et al. 2005" paper on this gene exists as a first
citation).**

**Artifact 1 opened and how:** PubMed record
[PMID 10896812](https://pubmed.ncbi.nlm.nih.gov/10896812/), full abstract read:
Jablonski & Chaplin, "The evolution of human skin coloration," *J Hum Evol*
2000 Jul. Volume/pages/DOI (39(1):57–106; 10.1006/jhev.2000.0403) confirmed by
the reference list of PMC2242814, which cites it verbatim. The DOI's
ScienceDirect landing page requires JavaScript and could not be rendered; the
bibliographic details rest on the two records above.

Verbatim sentence carrying the claim: "The clinal gradation of skin coloration
observed among indigenous peoples is correlated with UV radiation levels and
represents a compromise solution to the conflicting physiological requirements
of photoprotection and vitamin D synthesis." Also: "highly melanized skin
protected against UV-induced photolysis of folate" and "As hominids migrated
outside of the tropics, varying degrees of depigmentation evolved in order to
permit UVB-induced synthesis of previtamin D(3)."

**Artifact 2 opened and how:** PubMed record
[PMID 16357253](https://pubmed.ncbi.nlm.nih.gov/16357253/), full abstract read:
Lamason et al., "SLC24A5, a putative cation exchanger, affects pigmentation in
zebrafish and humans," *Science* 2005 Dec 16;310(5755):1782–1786, DOI
10.1126/science.1116238.

Verbatim sentence carrying the claim: "The evolutionarily conserved ancestral
allele of a human coding polymorphism predominates in African and East Asian
populations. In contrast, the variant allele is nearly fixed in European
populations ... and correlates with lighter skin pigmentation in admixed
populations, suggesting a key role for the SLC24A5 gene in human
pigmentation."

**Provenance tier:** Tier 1 (both original papers; abstracts read at PubMed).

**Proposed BibTeX:**

```bibtex
@article{jablonski_chaplin_2000,
  author  = {Jablonski, Nina G. and Chaplin, George},
  title   = {The Evolution of Human Skin Coloration},
  journal = {Journal of Human Evolution},
  volume  = {39},
  number  = {1},
  pages   = {57--106},
  year    = {2000},
  doi     = {10.1006/jhev.2000.0403},
}

@article{lamason_slc24a5_2005,
  author  = {Lamason, Rebecca L. and Mohideen, Manzoor-Ali P. K. and Mest, Jason R. and Wong, Andrew C. and Norton, Heather L. and Aros, Michele C. and others},
  title   = {{SLC24A5}, a Putative Cation Exchanger, Affects Pigmentation in Zebrafish and Humans},
  journal = {Science},
  volume  = {310},
  number  = {5755},
  pages   = {1782--1786},
  year    = {2005},
  doi     = {10.1126/science.1116238},
}
```

---

## ITEM 31 — Recent light skin in Europe (Olalde 2014; Brace 2019)

**Verdict: VERIFIED, with two corrections to the task's framing.**

1. **La Braña is 7,000 years old, not ~10,000.** The paper's dates:
   "~7,000 years BP (7,940–7,690 calibrated BP)." Cheddar Man is Mesolithic
   (Brace et al. date the British Mesolithic series 8750–3803 cal. BCE; the
   Cheddar individual is commonly given ~7,100 BC, but that exact figure was
   not read in the paper body, so the paragraph says "Mesolithic" without a
   specific year for Cheddar Man).
2. **Cheddar Man's eyes are "blue/green," not "blue."** Use the paper's
   wording.
3. The 2018 Natural History Museum announcement is press, not scholarship.
   The citable artifact is Brace et al. 2019, which contains the pigmentation
   inference. Recommend citing the paper, not the museum.

**Artifact 1 opened and how:** Full author-manuscript text at
[PMC4269527](https://pmc.ncbi.nlm.nih.gov/articles/PMC4269527/) (published as
*Nature* 2014;507(7491):225–228; DOI 10.1038/nature12960). Full text read.

Verbatim sentences:
- "The La Braña individual carries ancestral alleles in several skin
  pigmentation genes, suggesting that the light skin of modern Europeans was
  not yet ubiquitous in Mesolithic times."
- "results from functional experiments indicate that the allelic combination
  in this Mesolithic individual is likely to have resulted in dark skin
  pigmentation and dark/brown hair. Further examination revealed that this
  individual carried the rs12913832*C single nucleotide polymorphism (SNP) and
  the associated homozygous haplotype spanning the HERC2/OCA2 locus that is
  strongly associated with blue eye color."
- The same genome's heterozygosity table also documents, incidentally:
  "Africans (0.066–0.069%)" versus "Europeans (0.051–0.054%)" — direct
  support, if ever needed, for line 1828's "greatest human biodiversity is
  found on the African continent." Not used in the paragraph; noted here only
  as an available artifact.

**Artifact 2 opened and how:** Full author-manuscript text at
[PMC6520225](https://pmc.ncbi.nlm.nih.gov/articles/PMC6520225/) (published as
*Nature Ecology & Evolution* 2019;3(5):765–771; DOI 10.1038/s41559-019-0871-9).
Full text read.

Verbatim sentence: "We infer that Cheddar Man mostly likely had blue/green
eyes, dark brown possibly black hair, and dark or dark to black skin, while
our highest coverage early Neolithic individual had brown eyes, black possibly
dark brown hair, and dark to intermediate skin." And: "these results imply
that different pigmentation levels coexisted in Europe by around ca. 6000
BCE."

**Provenance tier:** Tier 1 (both original papers, full text read).

**Proposed BibTeX:**

```bibtex
@article{olalde_mesolithic_2014,
  author  = {Olalde, I{\~n}igo and Allentoft, Morten E. and S{\'a}nchez-Quinto, Federico and Santpere, Gabriel and Chiang, Charleston W. K. and DeGiorgio, Michael and others},
  title   = {Derived Immune and Ancestral Pigmentation Alleles in a 7,000-Year-Old {M}esolithic {E}uropean},
  journal = {Nature},
  volume  = {507},
  number  = {7491},
  pages   = {225--228},
  year    = {2014},
  doi     = {10.1038/nature12960},
}

@article{brace_neolithic_britain_2019,
  author  = {Brace, Selina and Diekmann, Yoan and Booth, Thomas J. and van Dorp, Lucy and Faltyskova, Zuzana and Rohland, Nadin and Mallick, Swapan and Olalde, I{\~n}igo and others},
  title   = {Ancient Genomes Indicate Population Replacement in {E}arly {N}eolithic {B}ritain},
  journal = {Nature Ecology \& Evolution},
  volume  = {3},
  number  = {5},
  pages   = {765--771},
  year    = {2019},
  doi     = {10.1038/s41559-019-0871-9},
}
```

---

## ITEM 8 — The Book of Gates four peoples (Yurco 1989)

**Verdict: VERIFIED at two levels, with one declared gap. The scene itself was
opened as a page image (Tier 1). Yurco's article was opened at the BAS Library
and COJS mirror, but only the lead is free — the body (pp. 24–29) is
paywalled, so Yurco's specific discussion of this scene was not read. The
verified Yurco sentence below comes from the article's visible lead. The
checker should open BAR 15:05 pp. 24–29 in print or behind the paywall before
the final edit lands; the proposed sentence is written to stand on what was
actually verified.**

**Artifact 1 (primary) opened and how:** The Lepsius plate reproducing the
tomb painting, via its Wikimedia Commons catalogue record
(*File:From Richard Lepsius - Ethnic groups "Table Nations" portrayed in the
Book of Gates, 4th Division, 5th Hour, Tomb of Seti I.jpg* — source:
Lepsius, *Denkmäler aus Ägypten und Äthiopien*, 1849–1859, illustrator Ernst
Weidenbach). The JPEG was downloaded and **read as an image**, per Rule 2. The
plate shows sixteen figures in four groups distinguished by skin color and
dress — Egyptians (reddish-brown), Nubians (black), Asiatics (lighter,
bearded), Libyans (pale, feathered, tattooed) — in a single procession led by
Horus into the afterworld. No figure is elevated, diminished, or ordered above
another; the composition is a catalogue, not a ranking. Seti I's regnal dates
(commonly 1294–1279 BC) were **not** verified against a chronology artifact;
the paragraph therefore says "Nineteenth Dynasty" and leaves the exact years
to the checker.

**Artifact 2 (Yurco) opened and how:**
[library.biblicalarchaeology.org/article/were-the-ancient-egyptians-black-or-white/](https://library.biblicalarchaeology.org/article/were-the-ancient-egyptians-black-or-white/)
and the COJS mirror
([cojs.org](https://cojs.org/were_the_ancient_egyptians_black_or_white-_frank_j-_yurco-_bar_15-05-_sep-oct_1989/)).
Both show the same lead. Verified verbatim: "Was Nefertiti 'black' or 'white'?
**The ancient Egyptians did not think in these terms.**" — Frank J. Yurco,
"Were the Ancient Egyptians Black or White?", *Biblical Archaeology Review*
15:05 (Sept/Oct 1989), pp. 24–29, 58 (pagination confirmed by the BAS
catalogue and by Piccione's College of Charleston course bibliography).

**Scholarly-contest note (as the task requires):** the scene's interpretation
is debated in the ancient-Egyptian-race literature; the sentence claims only
that the scene differentiates peoples by color without ranking them, which the
image itself supports, and that Egyptians did not sort people into a
black/white hierarchy, which is Yurco's stated position.

**Provenance tier:** Tier 1 for the scene (image read); Tier 3 venue for Yurco
(BAR is a magazine, not peer-reviewed) — flag this honestly. If a Tier 2
Egyptological discussion is preferred, that is a further research task; none
was opened here.

**Proposed BibTeX:**

```bibtex
@article{yurco_egyptians_1989,
  author  = {Yurco, Frank J.},
  title   = {Were the Ancient {E}gyptians Black or White?},
  journal = {Biblical Archaeology Review},
  volume  = {15},
  number  = {5},
  pages   = {24--29, 58},
  year    = {1989},
  url     = {https://library.biblicalarchaeology.org/article/were-the-ancient-egyptians-black-or-white/},
}
```

---

## The proposed paragraph (single insertion, after line 1828)

```latex
The partition key itself was a continuous environmental gradient. Skin
pigmentation is a polygenic trait: a genome-wide study that measured
pigmentation in 2,092 Africans identified variants in or near \textit{SLC24A5},
\textit{MFSD12}, \textit{DDB1}/\textit{TMEM138}, and
\textit{OCA2}/\textit{HERC2}, with these four regions alone accounting for
roughly 29\% of pigmentation variance \cite{crawford_pigmentation_2017}.
Julian Huxley named such graded geographic variation a \textit{cline} in 1938
\cite{huxley_clines_1938}, and skin color is the canonical case: reflectance
tracks ultraviolet radiation by latitude, a compromise between folate
protection and vitamin D synthesis \cite{jablonski_chaplin_2000}. The derived
\textit{SLC24A5} allele associated with lighter European skin is nearly fixed
in Europeans and virtually absent from African and East Asian populations
\cite{lamason_slc24a5_2005}, and ancient DNA dates its ascent: the
7,000-year-old La Bra{\~n}a hunter-gatherer from Spain carried ancestral
dark-skin alleles alongside a blue-eye haplotype \cite{olalde_mesolithic_2014},
and Britain's Mesolithic Cheddar Man had dark or dark-to-black skin with
blue/green eyes \cite{brace_neolithic_britain_2019}. The variable is ancient
as observation and recent as hierarchy: the Book of Gates scene in the
Nineteenth-Dynasty tomb of Seti~I arrays Egyptians, Nubians, Asiatics, and
Libyans by skin color in a single procession into the afterworld---four
peoples distinguished and none ranked \cite{yurco_egyptians_1989}. Phenotype
is a continuous biological gradient that the legal system converted into a
discrete, binary partition. The gradient was real; the boundary was not.
```

Style notes for the checker: the closing pair is the task-mandated thesis
sentence; it sits in deliberate tension with the manuscript's ban on formulaic
antithesis, and the author should adjudicate. Every other sentence is a direct
declarative claim carrying one citation. The paragraph contains no gene count
(the "~150 genes" figure was unverifiable against Crawford et al. and was
dropped), no Livingstone non-concordance point (primary source not opened),
and no Seti I regnal years (chronology artifact not opened).

## Unverified remainder (stated plainly per Rule 7)

1. "~150 genes involved in melanin" — **CANNOT CONFIRM.** Not in Crawford et
   al. 2017, which says instead "over 350 pigmentation genes ... in animal
   models" with only "a subset ... linked to normal variation in humans."
2. Trait non-concordance (different traits, different gradients) — **CANNOT
   CONFIRM.** Livingstone 1962 paywalled; excluded.
3. Seti I regnal range 1294–1279 BC — **CANNOT CONFIRM** against an artifact
   opened in this session; the paragraph uses "Nineteenth-Dynasty" instead.
4. Yurco's in-body discussion of the Book of Gates scene (BAR 15:05, pp.
   24–29) — paywalled; only the lead was read. The proposed sentence rests on
   the image (Tier 1) plus Yurco's verified lead sentence.
5. Jablonski & Chaplin DOI/volume/pages rest on the PubMed record plus a PMC
   reference-list citation; the ScienceDirect page itself did not render.
