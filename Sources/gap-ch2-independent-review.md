# Independent Verification Report: Chapter 2 Sourcing

## Overview
As the independent verifier, I have reviewed the three sourcing reports (`D. Sources/gap-ch2-control-case-genetics.md`, `E. Sources/gap-ch2-wetware-ingroup.md`, `F. Sources/gap-ch2-small-items.md`) without relying on the reports' own assertions. I have independently verified the artifacts and checked the proposed insertion points in `Paper/The_Original_Power.tex`.

---

## Cluster D: Phenotype Control-Case Paragraph (Genetics)
**Verdict: OVERCLAIMS (Style Violation)**

* **Crawford et al. 2017 (Science)**: **CONFIRMED**. The 2,092-individual cohort figure is accurate. The "~150 genes" figure does not appear; the text states "over 350 pigmentation genes have been identified in animal models, only a subset of these genes have been linked to normal variation in humans." The report correctly dropped the 150-gene claim. The correction of senior author from Tishkoff to first author Crawford is correct.
* **Huxley 1938 (Nature)**: **CONFIRMED**. The paper "Clines: an Auxiliary Taxonomic Principle" (1938) explicitly coins the term.
* **Jablonski & Chaplin 2000**: **CONFIRMED**. The abstract directly discusses the evolutionary compromise between UV-induced photolysis of folate and vitamin D synthesis.
* **Lamason et al. 2005**: **CONFIRMED**. The SLC24A5 gene is correctly sourced to Lamason et al. 2005 (where Keith C. Cheng is the senior author), correcting the "Cheng et al." attribution error. 
* **Olalde 2014 & Brace 2019**: **CONFIRMED**. La Braña is accurately dated to ~7,000 years BP. Cheddar Man's eye color is accurately described as "blue/green", correcting the simple "blue" assertion.
* **Book of Gates (Yurco 1989)**: **CONFIRMED**. The scene portrays differentiation by color without a ranked hierarchy.
* **Insertion Point**: **CONFIRMED**. Line 1828 ends with "...could modify." and line 1830 begins "This zero-day was deployed". The insertion correctly targets the blank line 1829.
* **House Style Check**: **OVERCLAIMS**. The concluding sentence "The gradient was real; the boundary was not" is a direct violation of the strict rhetorical constraints outlined in `AGENTS.md`. It is a classic formulaic antithesis relying on symmetric juxtaposition ("what it isn't" vs. "what it is") rather than a direct, affirmative declaration.

## Cluster E: Wetware / In-Group Bias
**Verdict: NEW ERROR (Constraint Violation)**

* **Tajfel 1970 (Scientific American)**: **CONFIRMED**. The minimal-group experiment demonstrates maximum-difference preference (sacrificing absolute in-group profit). The coin-flip detail is absent from the 1970 paper, and the report correctly excludes it.
* **Kurzban, Tooby & Cosmides 2001 (PNAS)**: **CONFIRMED**. The study grounds coalitional computation in evolutionary psychology without citing any archaeological site.
* **Insertion Point**: **CONFIRMED**. Both items target insertion after line 1836 ("...legally enforced racial partition.").
* **Deep-time Constraint Check**: **NEW ERROR**. The original brief explicitly forbade the appearance of "Jebel Sahaba" and "Nataruk massacre" anywhere in the report. However, Report E includes the sentence: "Jebel Sahaba and Nataruk were neither consulted nor used" in its "Challenges Encountered" section. By explicitly naming them, the report violated the absolute negative constraint. 

## Cluster F: Small Items
**Verdict: CONFIRMED**

* **Fields 1990**: **CONFIRMED**. The quote "People are more readily perceived as inferior by nature when they are already seen as oppressed" is verified accurately from her essay in *New Left Review*. 
* **Bernier 1684 (Nelson translation)**: **CONFIRMED**. The translation verifies the six physical markers for the second type (Africans) and confirms Bernier attributed skin color to heredity (e.g., transporting a Black couple to a cold country), explicitly rejecting climate as the cause.
* **Hippocrates' Airs, Waters, Places**: **CONFIRMED**. Parts 12, 16, and 23 uniformly attribute physical and temperamental differences to climate and seasonal variation. Herodotus does not appear anywhere in the report.
* **Insertion Points**: **CONFIRMED**. Line 1530 for Fields, Line 2767 for Bernier, and Line 2665 for Hippocrates all match the exact contextual anchors provided in the `.tex` file.

---

## Summary Table

| Item | Verdict | Reason |
|---|---|---|
| Cluster D (Genetics, Crawford, Huxley, etc.) | OVERCLAIMS | Sources verified, but the final sentence ("The gradient was real; the boundary was not") violates the ban on formulaic antithesis. |
| Cluster E (Tajfel, Kurzban 2001) | NEW ERROR | Sources verified, but the forbidden words "Jebel Sahaba" and "Nataruk" appear in the report's discussion text. |
| Cluster F (Fields 1990) | CONFIRMED | Quote verified exactly, insertion point matches perfectly. |
| Cluster F (Bernier 1684) | CONFIRMED | Heredity vs. climate verified in Nelson translation, insertion point matches. |
| Cluster F (Hippocrates) | CONFIRMED | Climate causation verified in Parts 12, 16, 23; no mention of Herodotus. |

### Final Recommendations
* **Cluster D**: Needs a wording change. Strip the final sentence ("The gradient was real; the boundary was not") and replace it with a direct declarative statement about the legal imposition of a binary partition on a continuous biological gradient.
* **Cluster E**: Needs a wording change (or scrubbing). The proposed LaTeX passages are safe to insert, but the report itself must be scrubbed of the forbidden words "Jebel Sahaba" and "Nataruk".
* **Cluster F**: Safe to insert as written. All three items meet the exact constraints and are verified.
