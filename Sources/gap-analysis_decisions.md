# Gap Analysis — Author Decisions

Decisions by Emmanuel Theodore, 2026-09-02, on
[`gap-analysis_how-did-humans-invent-racism.md`](gap-analysis_how-did-humans-invent-racism.md).
Item numbers refer to that report's §2 table. Placements marked *(§3 rank N)* carry
the rationale and suggested location from that report's ranked list.

**Standing rule set by the author:** where an item requested below also appears on
the analysis's "Do not add" list, the do-not-add list wins. Five requested items
were removed under that rule — see the last table.

---

## Approved for addition

| # | Item | Where | Note |
|---|---|---|---|
| 1 | Melanin polygenic (~150 genes); Tishkoff 2017 | Ch. 1, phenotype passage `:1828` | §3 rank 1. Author to specify placement in detail |
| 2 | Skin colour is a cline; Huxley coined the term 1938 | Ch. 1, same passage | §3 rank 1 |
| 3 | Tajfel minimal-group experiment (1970) — promote PARTIAL to full | Ch. 1 / wetware passage `:1836` | §3 rank 6. Gap-seeking over gain-seeking maps to the status wage |
| 4 | In-group bias is ancient and kinship-based, not racial — promote PARTIAL to full | Ch. 1 | Make the claim without items 6–7, which are excluded |
| 11 | Aristotle's natural slavery, *barbaroi*, Isaac's proto-racism | Ch. 2 | Author: "part of the pathway of racism formalization" |
| 12 | Gonçalves takes the first captives, 1441 | Ch. 2, before Zurara | Author: "we start with Zurara, but maybe we should start with 12 and move on to that" |
| 14 | Valladolid debate, 1550 (Sepúlveda vs Las Casas) | Ch. 2, export section | §3 rank 4. `references.bib:4242` already holds an uncited Las Casas entry |
| 15 | Toledo *Sentencia-Estatuto*, 1449 — promote PARTIAL to full | Ch. 2 | §3 rank 3. Author: "necessary" |
| 16 | Bernier 1684, first published racial classification | Ch. 1, scientific-racism passage | §3 rank 7 |
| 18 | Blumenbach — cover fully (Caucasian coinage, degeneration model, date) | Ch. 1 `:2761` | Book currently dates him 1776 |
| 23 | Barbara Fields 1990 — add the citation | wherever the causal-reversal thesis is stated (`:1530`) | Claim already the book's own; this is scholarly credit |
| 25 | Boas 1912 immigrant head-shape study — promote PARTIAL to full | Ch. 1 `:2850` | Currently one clause |
| 26 | Clark & Clark doll experiments, 1947 | `ch:recompile`, near *Brown* `:7476` | §3 rank 5 |
| 27 | Lewontin 1972 — 85.4% within / 6.3% between | Ch. 1, Firmin counter-signal `:2841–2858` | §3 rank 2 — **contingent on the Morton loop** |
| 28 | Human Genome Project 2003, ~99.9% shared | same | §3 rank 2 — **contingent on the Morton loop** |
| 29 | Rosenberg 2002, 377 markers | same | §3 rank 2 — **contingent on the Morton loop** |
| 30 | Jablonski & Chaplin 2000 UV cline; SLC24A5 | Ch. 1 `:1828` | §3 rank 1 — **contingent on the Morton loop** |
| 31 | Ancient DNA: La Braña 2014, Cheddar Man 2018 | Ch. 1 `:1828` | §3 rank 1. Light European skin ~10,000 years old |
| 32 | AAA 1998 Statement on Race | Ch. 1, Firmin paragraph | §3 rank 2, "optional ballast" |

## Open research

| # | Item | Action |
|---|---|---|
| 19 | Morton craniometry | **RESOLVED** — see [`research_morton-craniometry.md`](research_morton-craniometry.md). The fraud was in the inference, not the data. Items 27–30 are unblocked; proceed |

### Outcome of the Morton loop

**The claim at `:2763` is not defensible and must be replaced.** Lewis et al. 2011
physically remeasured 308 of the 670 skulls Morton published: the data are
generally reliable and the errors random with respect to population. Gould's
specific charges of manipulation do not survive inspection. Two live critiques
(Weisberg & Paul 2016; Kaplan, Pigliucci & Batta 2015) attack the remeasurement's
*relevance*, not its result, and neither restores the fraud charge. Nobody in the
literature defends the capacity-to-intelligence inference.

**This strengthens the book.** Firmin audited published tables; he never alleged
fabricated numbers. He attacked instrument reliability and found the tables
carried no basis for classification — claim [B], not [A]. Relocating the fraud
from measurement to inference makes `:2763` agree with the Firmin section instead
of contradicting it, and converts Morton from bad measurement into evidence that
the legitimation apparatus manufactures signal out of noise by fiat. The exact
replacement LaTeX and the required `lewis_morton` BibTeX entry are in the report.
The companion sentence at `:2844` ("analytically fraudulent") is already correct
under this reading and should be kept consistent.

### Two citation-integrity problems surfaced by the same loop

Both verified directly against the repository, 2026-09-02. Neither is part of the
source gap analysis; both need the author's attention.

1. **`firmin_legacy` is an unusable citation.** `Paper/references.bib:990` records
   `author = {{Anonymous}}`, `journal = {Gradhiva}`, `year = {2009}`. An anonymous
   author in a named journal will not survive scrutiny, and this entry is the sole
   support for the book's Firmin claims — including a direct quotation.
2. **The word "anarchic" at `:2848` is quoted but unverified.** The manuscript puts
   it in quotation marks and attributes it via `firmin_legacy`. It does not appear
   in Firmin's 1885 French original. It may be legitimate from the 2000 Asselin
   Charles translation, which is the thing to check. A quoted word carried by an
   anonymous citation is the weakest link in an otherwise load-bearing section.

Note also that `Sources/antenorfirminles00mani.pdf` is Leslie Manigat's work, not
Firmin's *De l'égalité des races humaines* — confirmed from the file's own RDF
metadata. The repository does not currently hold Firmin's original.

## Held

| # | Item | Status |
|---|---|---|
| 5 | Dunbar's number (1992) | Pending. Not needed for any current assertion — the book makes no group-size argument. Keep on file in case a later passage needs the citation |

## Removed under the do-not-add rule

The author asked for each of these, then set the standing rule that the analysis's
"Do not add" list overrides. Recorded here so the decision is visible and reversible.

| # | Item | Author's stated reason for wanting it | Why the list excludes it |
|---|---|---|---|
| 6 | Jebel Sahaba (~13,000 BP) | "there's probably a place we could talk about that" | Rome `:2671` and the trans-Saharan trade `:2486` already prove the extraction kernel operating non-racially; adds length, not load |
| 7 | Nataruk (~10,000 BP) | goes with 6 | same |
| 8 | Book of Gates; Yurco 1989 | "we should add and talk about that a little bit" | Same structural point as the Rome comparison, and farther from the Atlantic scope the book declares at `:12535` |
| 10 | Herodotus; Hippocrates climate theory | "to prove lack of racial animus before the Portuguese" | same |
| 24 | Jefferson, *Notes*, Hemings, Foster 1998 DNA | "we should add 24" | The Constitutional-patch chapter already carries the contradiction structurally; a Jefferson character study would be a tonal departure |

Item 9 (25th Dynasty, Taharqa) falls in the same excluded 8–10 range and was not
requested.

## No action

Items 13, 17, 20, 21, 22, 33, 35 are already COVERED in the manuscript. Item 34
(the source's "10–15% probability" figures) is unfalsifiable pseudo-quantification
and must not be imported under any circumstances — the tier system exists to
exclude exactly this.

---

## Scope discipline — second opinion (Gemini, 2026-09-02)

A second model reviewed the same source and argued the additions risk conceding
the battlefield: arguing race's biological invalidity at length treats biology as
the terrain the case is won on, when the Elite neither possessed modern genetics
nor cared about empirical truth. Its recommendation was to compress the
pigmentation material into a single bounded "control case" paragraph and pivot
back to extraction mechanics.

**Adopted, for the phenotype passage only.** Items 1, 2, 30 and 31 go into the
zero-day passage at `The_Original_Power.tex:1828` as one tight control-case
paragraph with citations. Not a genetics section. The point that paragraph must
carry is architectural: the partition variable was a continuous environmental
gradient, and the Elite forced it into a binary legal partition.

**Not adopted for the Firmin counter-signal section** (`:2841–2858`). The book has
already entered the empirical arena there — it asserts Firmin found the data
"wildly overlapped", that there was "no signal", that the tables were "anarchic".
Having made that claim, the book supports it or withdraws it. Items 27, 28, 29
and 32 are the modern confirmation of a claim already on the page, so the
dosage argument does not reach them. The same reasoning governs item 19: the
"methodologically fraudulent" sentence at `:2763` is an empirical claim the book
already threw, and it cannot decline the fight in a passage where it swung first.

**The catch worth keeping.** Gemini connected this material to `Biological
Embedding`, already a defined term at `The_Original_Power.tex:1694`, alongside
allostatic load, $\beta_{\text{bio}}$ and epigenetic ageing. Neither the gap
analysis nor Claude made that link. The two ends belong together: the control
case at `:1828` establishes that the body did not generate the partition, and
Biological Embedding at `:1694` establishes that the architecture then wrote
itself into the body. Cross-reference them.

**One correction to that review.** It asserts the book has "already established
the necessary scientific consensus". It has not. Line `:1828` makes four
empirical claims — phenotype is permanent, heritable and visually self-enforcing;
race does not rest on significant genetic difference; the greatest human
biodiversity is on the African continent; phenotype resists conversion and
migration — and carries no citation at all. That absence is the gap items 1, 2,
30 and 31 exist to close. [book: Paper/The_Original_Power.tex:1828, verified
2026-09-02]
