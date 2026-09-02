# Firmin 1885 — first pass against the framework

**Source:** `Sources/Firmin_De_l_egalite_des_races_humaines_1885.pdf`
Anténor Firmin, *De l'égalité des races humaines : anthropologie positive*, Paris,
1885. BnF scan via archive.org (`Antnor1885Bnf30437548r`), 687 pages, public domain.

**Status: PARTIAL.** The delegated pass (Kimi) assembled candidate passages and
then hit its provider usage limit before verifying them or writing up. Everything
under "Verified" below was checked by Claude directly against rendered page
images. Everything under "Unverified" is Kimi's candidate list, preserved with its
page numbers so the work is not lost — **none of it may be quoted until checked.**

**Page offset:** printed page = PDF page − 21. (PDF 178 → printed 157, confirmed
from the running head.) Kimi's log cites *PDF* pages; convert before use.

---

## Verified

### 1. The word "anarchic" is not Firmin's

`Paper/The_Original_Power.tex:2848` places "anarchic" in quotation marks and
attributes it to Firmin through `firmin_legacy`. No cognate occurs anywhere in the
1885 text: `anarchi` 0, `anarchique` 0, `anarchie` 0. Confirmed independently
twice, by Kimi against the BnF scan and by Claude against a separate extraction.
The OCR is imperfect, so this is strong evidence rather than proof — but a quoted
word that cannot be found in the source it is attributed to should not stand.

### 2. Replacement quotation, verbatim, printed page 157

Firmin's actual verdict on the anthropometric tables, read from the page image:

> « Comment parviendra-t-on jamais à une classification vraiment scientifique,
> "en suivant les principes de la méthode naturelle", quand les mesures
> anthropologiques, que l'on reconnaît comme les seules bases rationnelles, sont
> non-seulement trompeuses, irrégulières, mais le plus souvent contradictoires ? »

*How will anyone ever arrive at a truly scientific classification, "following the
principles of the natural method", when the anthropological measurements, which
are acknowledged to be the only rational basis, are not merely deceptive and
irregular but most often contradictory?*

Two notes for the author. The rendering carries a "not merely X but Y" construction
because **Firmin wrote one**; inside quotation marks that is faithful translation,
and the surrounding prose must still obey the AGENTS.md constraint. Second, the
same page has Firmin turning the charge on Broca directly — asking by what logic
Broca and his followers found "une manifestation quelconque de la vérité
scientifique" in a set of characters "qu'ils reconnaissent aussi trompeurs les uns
que les autres" — with Broca's own admission footnoted (*loco citato*, p. 634).

### 3. Firmin audited published tables; he took no measurements of his own

Printed page 136, read from the page image:

> « Mais voyons quelques chiffres, où sont condensés les résultats de divers essais
> de craniométrie. Nous commencerons par le cubage, en copiant les tableaux
> suivants tirés de l'*Anthropologie* du professeur Topinard. »

He says plainly that he is **copying** Topinard's tables. This settles the question
the Morton loop raised: Firmin alleged no fabricated data. He audited the numbers
the discipline had already published and showed they carried no classification.
That is claim [B], and it is why `:2763` must relocate the fraud from the
measurement to the inference — see [`research_morton-craniometry.md`](research_morton-craniometry.md).

### 4. The overlap is visible in Firmin's own reproduced table

The first table on printed page 136, four European samples, cranial capacity in cm³:

| n | group | men | women |
|---|---|---|---|
| 88 | Auvergnats | 1598 | 1445 |
| 69 | Bretons-Gallots | 1599 | 1426 |
| 63 | Bas-Bretons | 1564 | 1366 |
| 124 | Parisiens contemporains | 1558 | 1337 |

Four European populations spanning 41 cm³ in the male means. The book's claim that
the tables "wildly overlapped" is supportable directly from the page Firmin
reproduces, without relying on the anonymous secondary source.

---

## Unverified — Kimi's candidate passages

Preserved from the run log. Page numbers are **PDF** pages; subtract 21 for the
printed folio. Each needs checking against the page image before use. One of
Kimi's attributions was already found wrong (it placed a motive quotation on PDF
157, which is printed 136 and contains the Topinard tables instead), so treat the
whole list as leads rather than findings.

| PDF p. | printed | candidate | why it would matter |
|---|---|---|---|
| 156 | 135 | "l'irrégularité des résultats" | the audit's summary judgement |
| 157 | 136 | "Ils n'y voyaient qu'un moyen de légitimer le système de l'esclavage" | **motive** — the legitimation apparatus named. Attribution already suspect |
| 177 | 156 | "la plus grande confusion règne dans les chiffres" | alternative to the p157 quotation |
| 222 | 201 | "ne repose que sur l'idée de l'exploitation de l'homme par l'homme" | extraction stated as the base |
| 227 | 206 | "L'esclavage n'est une injustice qu'autant que…" | conditional framing of injustice |
| 503–507 | 482–486 | "méthodiquement dégradé" | systematic degradation as process |
| 513 | 492 | "l'orgueil et l'intérêt sont coalisés pour étouffer la vérité" | pride and interest coalesced against truth |
| 585 | 564 | modern civilisation "besoin d'une justification morale ou scientifique"; the best available rests on "la doctrine de l'inégalité des races humaines" | **the strongest candidate** — the legitimation requirement stated as a general property of the system |
| 230 | 209 | school mechanism | transmission |

The p585 candidate is the one to verify first. If it reads as summarised, Firmin
stated in 1885 that the system requires a moral or scientific justification and
that racial inequality was selected to supply it — which is the book's legitimation
apparatus, named by the man the book already cites.

---

## Citation repair

`Paper/references.bib:990` records `firmin_legacy` with `author = {{Anonymous}}`,
`journal = {Gradhiva}`, `year = {2009}`. It currently carries every Firmin claim in
the manuscript, including the unsupportable quotation. Cite the original instead:

```bibtex
@book{firmin1885,
  author       = {Firmin, Anténor},
  title        = {De l'égalité des races humaines: anthropologie positive},
  publisher    = {F. Pichon},
  address      = {Paris},
  year         = {1885},
  note         = {BnF scan, archive.org identifier Antnor1885Bnf30437548r},
}
```

Claims at `:2841--2858` that this entry can carry directly once verified: that
Firmin audited published craniometric tables rather than producing his own; that he
found the measurements deceptive, irregular and contradictory; that the reproduced
tables overlap across populations.

---

## Next pass

The book is not exhausted — this pass verified four items out of a 687-page source
and left nine leads unchecked. The method that worked: search the OCR for
distinctive single words (reliable), then render the candidate page and read the
image (authoritative). Long verbatim strings cannot be trusted from the OCR at all.
That two-step generalises to any scanned source in the planned survey of Black
scholars who documented the architecture from inside the out-group.
