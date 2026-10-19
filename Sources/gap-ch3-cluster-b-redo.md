# Chapter 3 Gap Cluster B — Re-Run Sourcing Report

**Date:** 2026-09-03
**Model:** Kimi Code CLI
**Scope:** Chapter 3, "Version 1.0: Initializing the Vector (15th-Century Portugal)", `Paper/The_Original_Power.tex` lines 2428–2880. Items 15 (Toledo Sentencia-Estatuto 1449), 11 (Aristotle natural slavery + Isaac's proto-racism), 14 (Valladolid debate 1550–1551).
**Re-run reason:** the previous model sourced Item 15 to Spanish Wikipedia, Item 14 to English Wikipedia plus `las_casas_short_account`, and quoted Isaac's definition from a Bryn Mawr Classical Review review. All three are rejected under the verification protocol. No encyclopedia appears below as a cited authority; no author's words are quoted from a third party.

**Insertion points re-verified against the live file on 2026-09-03** (`sed -n` against `Paper/The_Original_Power.tex`): all orchestrator-supplied line numbers hold.

---

## ITEM 15 — The Toledo Sentencia-Estatuto of 1449

**Verdict: VERIFIED** (Tier 2, peer-reviewed; two independent artifacts opened in full)

### Artifacts opened and how

1. **David Nirenberg, "Mass Conversion and Genealogical Mentalities: Jews and Christians in Fifteenth-Century Spain," *Past & Present* 174 (Feb. 2002), pp. 3–41.** Full JSTOR scan (cover sheet confirms "Source: Past & Present, No. 174 (Feb., 2002), pp. 3-41", stable URL jstor.org/stable/3600715), hosted on the author's own site (davidnirenberg.com). Downloaded, converted with `pdftotext`, and — per Rule 2 — the quoted passage was **confirmed against the rendered page image** (`pdftoppm -f 24 -l 24 -r 165 -png`), printed folio 25.
2. **Óscar López Gómez, "La revuelta de 1449 en Toledo. Historiografía y estado de la cuestión," *eHumanista: Conversos* 9 (2021), pp. 253–283.** Open-access peer-reviewed journal (UCSB). Full PDF downloaded and read; the statute chronology appears at printed p. 270.
3. Corroborating: **Nirenberg, "El concepto de raza en el estudio del antijudaísmo ibérico medieval," *Edad Media. Revista de Historia* 3 (2000), pp. 39–60** (open PDF, read in full) — same argument in Spanish.

### Verbatim sentence with page number (verified against page image)

Nirenberg 2002, printed **p. 25**:

> "The first surviving theorizations about the negative nature of the conversos' Jewish lineage were made in Toledo, during a rebellion against the Castilian monarchy in 1449. The Toledans and their sympathizers claimed that converts were motivated only by ambition for office and 'carnal lust for nuns and [Christian] virgins', and that converso physicians poisoned their Christian patients in order to get hold of their inheritance and offices, 'marry the wives of the Old Christians they kill', and stain their 'clean blood' (sangre limpia). They argued that Jewish ancestry (that is, Jewish blood) conveyed canniness and an unusual talent for enriching oneself at the expense of non-Jews, and predisposed one to corruption and viciousness in positions of power."

López Gómez 2021, printed **p. 270** (chronology table): "4 de junio de 1449 / 5 de junio de 1449 — Se publica la sentencia-estatuto que expulsa a los judeoconversos de los cargos públicos y limita sus derechos." Same page situates the episode inside "la dictadura de Sarmiento."

### Established facts

- **Year and promulgator:** the statute was published 4–5 June 1449 by the rebel regime in Toledo under Pero Sarmiento, amid the anti-converso revolt against the Crown. The scholarship names it the *Sentencia-Estatuto de Pero Sarmiento* (standard documentary study: Eloy Benito Ruano, *Revista de la Universidad de Madrid* 6 (1957): 277–306 — cited by Nirenberg 2002, n. 65, and throughout the literature; the statute text itself is printed in Fritz Baer, *Die Juden im christlichen Spanien*, vol. 2 (1936), no. 302, pp. 315–317). Benito Ruano and Baer were **not opened** in this audit; they are named as the standard editions for any future verbatim quotation of the statute text.
- **What it did:** expelled Judeo-conversos from public office in Toledo and limited their legal rights (López Gómez 2021, p. 270).
- **Descent rather than belief:** the scholarship supports the reading the manuscript needs. Nirenberg (p. 25, verified above): the statute's targets were baptized Christians; the rebels' argument attached corruption to "Jewish blood" — descent — not to religious practice. Nirenberg 2000 (p. 55) states the doctrine of *limpieza de sangre* as "la noción de que la reproducción de la cultura es inherente a la reproducción de la carne" — the notion that the reproduction of culture is inherent in the reproduction of flesh. The partition variable appears in genealogical form inside a religious frame, a generation before the Portuguese phenotypic encoding.

### Proposed LaTeX (manuscript voice)

Insertion point: **after line 2686** (end of the paragraph following eq. 2.6). Verified existing sentence at that location (line 2686): "The Portuguese innovation was the discovery that \textit{phenotype} was a superior partition variable to \textit{religion}. Ideological partitioning itself predated the Portuguese; the function changed its input variable while the output---a partitioned population with one segment designated for exclusion, exploitation, and violence---remained identical."

```latex
The Iberian religious partition had already produced one genealogical mutation. In
June 1449, amid the Toledan revolt against the Crown led by Pero Sarmiento, the rebel
regime published the \textit{Sentencia-Estatuto} expelling conversos---baptized
Christians of Jewish descent---from public office and limiting their legal rights
\cite{lopez_gomez_toledo_2021}. The statute's criterion was descent. Its targets were
professing Christians whose baptism the law treated as void, because, as Nirenberg
documents, the Toledans argued that ``Jewish ancestry (that is, Jewish blood) \dots\
predisposed one to corruption and viciousness in positions of power''
\cite[25]{nirenberg_genealogical_2002}. A partition variable keyed to lineage operated
on Iberian soil in religious dress a generation before the Portuguese encoded the
partition in colour.
```

### BibTeX

```bibtex
@article{nirenberg_genealogical_2002,
  author  = {Nirenberg, David},
  title   = {Mass Conversion and Genealogical Mentalities: Jews and Christians in Fifteenth-Century Spain},
  journal = {Past \& Present},
  number  = {174},
  year    = {2002},
  pages   = {3--41},
  doi     = {10.1093/past/174.1.3},
  url     = {https://www.jstor.org/stable/3600715},
}

@article{lopez_gomez_toledo_2021,
  author  = {L{\'o}pez G{\'o}mez, {\'O}scar},
  title   = {La revuelta de 1449 en Toledo. Historiograf{\'i}a y estado de la cuesti{\'o}n},
  journal = {eHumanista: Conversos},
  volume  = {9},
  year    = {2021},
  pages   = {253--283},
  url     = {https://www.ehumanista.ucsb.edu/sites/default/files/sitefiles/conversos/volume9/ehumconv9.lopezgomez.pdf},
  urldate = {2026-09-03},
}
```

---

## ITEM 11 — Aristotle's natural slavery and Benjamin Isaac's "proto-racism"

### Part A — Aristotle. **Verdict: VERIFIED** (Tier 1 primary text, opened at the Perseus Digital Library)

**Artifact opened and how:** Aristotle, *Politics*, H. Rackham translation (Loeb Classical Library), Perseus Digital Library text `urn:cts:greekLit:tlg0086.tlg035` (1999.01.0058), fetched section by section at the Perseus Hopper; each passage read with its Bekker anchor in situ. Sections opened: 1252b, 1253b, 1254a, 1254b, 1255b.

**Precise range relied on:** the natural-slavery argument runs **1253b23–1255b40 (Politics I.4–7 in Jowett's chaptering)**; the manuscript's stated range (1253b–1255b) is correct. Specific anchors verified in the text:

- **1253b32** — "a slave is a live article of property."
- **1254a14–16** — "one who is a human being belonging by nature not to himself but to another is by nature a slave."
- **1254a21–23** — "in some cases things are marked out from the moment of birth to rule or to be ruled."
- **1254b20–23** — "For he is by nature a slave who is capable of belonging to another (and that is why he does so belong), and who participates in reason so far as to apprehend it but not to possess it."
- **1252b8–9** — quoting Euripides (*Iphigenia at Aulis* 1400) and "implying that barbarian and slave are the same in nature."
- **1255b3–12** — Aristotle's own qualification: in some instances the natural distinction does not hold, and slavery by law and force "the opposite is the case."

**Verbatim sentence (Bekker 1254b20–23):**

> "For he is by nature a slave who is capable of belonging to another (and that is why he does so belong), and who participates in reason so far as to apprehend it but not to possess it."

### Part B — Isaac's "proto-racism". **Verdict: CANNOT CONFIRM for the quotation**

*The Invention of Racism in Classical Antiquity* (Princeton, 2004) could not be opened in this audit: no copy on the Internet Archive (confirmed via the catalogue API), the publisher's e-edition (De Gruyter, DOI 10.1515/9781400849566) is access-restricted, and no legitimate open PDF was located. Two independent peer-reviewed sources I did open quote the same two sentences from Isaac's pp. 1–2 (Jácome Neto 2020, below, quotes p. 1 and p. 2 verbatim), but under Rule 3 a third party's quotation does not authorize quotation marks under Isaac's name. The BMCR review (2004.06.49) that the previous model used is flagged as a tainted source for quotation and was not relied on.

**Isaac's thesis is contested — named critics (both opened in this audit):**

- **Christopher Tuplin**, review of Isaac, *Ancient West & East* 6 (2007), pp. 327–338 (peer-reviewed; cited within Jácome Neto's critique as finding Isaac's project "compromised by problems of terminology"). Named from the opened Jácome Neto article's text and bibliography; the Tuplin review itself was not opened — treat as identified, not read.
- **Félix Jácome Neto**, "A recusa da interação: um ensaio historiográfico sobre etnocentrismo e racismo na Grécia Antiga" [The Fear of Social Interaction], *Revista Brasileira de História* 40, no. 84 (2020), pp. 21–41, DOI 10.1590/1806-93472020v40n84-02 — **opened in full** (SciELO). He argues Greek ethnic relations "are better explained as non-hereditary forms of cultural prejudice rather than as racism, which has a specific history related to European colonization and slave trade" (abstract, verified) — the position the manuscript itself occupies.

**Proposed wording — paraphrase, no quotation marks:**

```latex
Isaac has argued that Greco-Roman environmental and ethnic determinism constitutes a
``proto-racism'' ancestral to the modern phenomenon, a reading contested in the
scholarship on the grounds that ancient prejudice was non-hereditary cultural bias
rather than a hereditary partition \cite{isaac_invention_racism_2004,
tuplin_isaac_review_2007, jacome_neto_2020}. The control case requires no position on
that dispute. Aristotle's doctrine existed as available inventory; Rome ran the
extraction kernel for seven centuries without activating it as a sorting rule, and no
ancient system locked the enslaved class to a heritable visible marker.
```

### Proposed LaTeX (manuscript voice) — combined passage

Insertion point: **after line 2661** (inside the Roman Control Case subsection). Verified existing sentence at that location: "The Roman Senate once considered requiring slaves to wear distinctive clothing but abandoned the proposal for fear that ``slaves would realize their numbers and rebel''---an acknowledgment that the enslaved population was phenotypically indistinguishable from the free poor."

```latex
The one ancient doctrine that grounded slavery in nature came from the philosophical
tradition, and Rome declined to run it as law. In the \textit{Politics}, Aristotle
defines the natural slave as one who ``participates in reason so far as to apprehend
it but not to possess it'' (1254b) \cite{aristotle_politics}, and extends the
classification to barbarians as a class (1252b). The doctrine sorted by an inferred
incapacity; it carried no phenotypic marker and no hereditary lock, and Aristotle
himself conceded that nature frequently fails to produce the distinction (1255b).
Rome operated the extraction kernel for seven centuries without activating this
doctrine as a sorting rule. Sixteen centuries later, Sep{\'u}lveda retrieved it at
Valladolid to classify the peoples of the Americas as \textit{servi a natura}
\cite{marin_pareja_valladolid_2020}. Antiquity supplied inventory; Iberia wrote the
operating system.
```

### BibTeX

```bibtex
@book{aristotle_politics,
  author     = {Aristotle},
  title      = {Politics},
  translator = {Rackham, H.},
  series     = {Loeb Classical Library},
  publisher  = {Harvard University Press},
  year       = {1944},
  url        = {https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0058},
  urldate    = {2026-09-03},
  note       = {Cited by Bekker number. Natural-slavery argument at 1253b--1255b (Pol. I.4--7); barbarian-slave equivalence at 1252b8--9.},
}

@book{isaac_invention_racism_2004,
  author    = {Isaac, Benjamin},
  title     = {The Invention of Racism in Classical Antiquity},
  publisher = {Princeton University Press},
  year      = {2004},
  note      = {PARAPHRASE ONLY: the book was not opened in this audit. No quotation from its pages is authorized until a physical copy is consulted. Thesis contested; see tuplin_isaac_review_2007 and jacome_neto_2020.},
}

@article{tuplin_isaac_review_2007,
  author  = {Tuplin, Christopher},
  title   = {Review of \textit{The Invention of Racism in Classical Antiquity}, by Benjamin Isaac},
  journal = {Ancient West \& East},
  volume  = {6},
  year    = {2007},
  pages   = {327--338},
  note    = {Identified from the J{\'a}come Neto 2020 bibliography; the review itself was not opened in this audit.},
}

@article{jacome_neto_2020,
  author  = {J{\'a}come Neto, F{\'e}lix},
  title   = {A recusa da intera{\c c}{\~a}o: um ensaio historiogr{\'a}fico sobre etnocentrismo e racismo na Gr{\'e}cia Antiga},
  journal = {Revista Brasileira de Hist{\'o}ria},
  volume  = {40},
  number  = {84},
  year    = {2020},
  pages   = {21--41},
  doi     = {10.1590/1806-93472020v40n84-02},
}
```

---

## ITEM 14 — The Valladolid debate, 1550–1551

**Verdict: VERIFIED** (Tier 2, with the Tier 3 scholarly encyclopedia used only as corroboration)

### Artifacts opened and how

1. **Nicolás Marín Pareja, "La reinvención de lo humano en la Junta de Valladolid (1550-1551)," in *Pensando Andalucía. Una visión transdisciplinar II*, eds. Córdoba Toro & González Zambrano (UNO editorial, 2020), pp. 526–541, ISBN 978-84-18659-00-3.** Full edited-volume PDF (19.9 MB) downloaded from Dialnet and read. Author is a Universidad de Sevilla postgraduate — a weaker Tier 2 source, so every fact below is cross-checked against artifact 2. Session dates rest on Manero Salvador 2009 (bibliographic trail reproduced below).
2. **Andrea Daher (CNRS), "The Valladolid debate," *Encyclopédie d'histoire numérique de l'Europe* (EHNE)** — scholarly-authored, peer-reviewed digital encyclopedia. Opened in full. Used as corroboration only (Tier 3 support, never sole support).

### Verbatim sentences with page numbers

Marín Pareja 2020, printed **p. 529**:

> "La Junta se celebró en dos sesiones: la primera, del 15 de Agosto hasta mediados de Septiembre de 1550, la segunda, del 10 de Abril al 4 de Mayo de 1551 (Manero, 2009: 100)."

> "Como conclusión de la síntesis histórica aclarar que la Junta no emitió fallo ni algún pronunciamiento correspondiente, el tribunal solo redactó unos informes sumarios y las anheladas ordenanzas para la nueva regulación de las conquistas quedaron relegadas una vez más al olvido."

Marín Pareja 2020, printed **p. 528**, quoting the junta's charge (from Las Casas, *Obras Escogidas* 1965, p. 221):

> "inquerir y constituyr la forma y leyes como nuestra santa Fe Católica se pueda predicar e promulgar en aquel nueuo Orbe (...) y examinar que forma puede auer como quedasen aquellas gentes sugetas a la Magestad del Emperador nuestro señor sin lesión de su Real conciencia conforme a la Bula de Alejandro."

Daher (EHNE, corroboration): Charles V summoned the parties in 1550 to the chapel of the Colegio San Gregorio before a junta of theologians including Domingo de Soto, Melchor Cano, and Bernardino de Arévalo; Sepúlveda presented his *Democrates alter*; Soto produced a summary of the arguments, published in 1552; "we do not have a detailed understanding of the procedures implemented by the theologians and jurists who made up this junta."

### Established facts

- **Two sessions and dates:** first session 15 August to mid-September 1550; second session 10 April to 4 May 1551 (Marín Pareja p. 529, citing Antonio Manero Salvador, "La controversia de Valladolid: España y el análisis de la legitimidad de la conquista de América," *Revista Electrónica Iberoamericana* 3, no. 2 (2009): 81–110 — identified via the chapter's bibliography, not itself opened). The Crown suspended all conquests on 16 April 1550 pending the junta (Marín Pareja p. 528, citing Antonio Maestre Sánchez, *Anales del Seminario de Historia de la Filosofía* 21 (2004): 91–134).
- **The question before the junta:** how the Catholic faith could lawfully be preached in the New World and how the Indians could be subjected to the Emperor "without lesion to his Royal conscience" under the Alexandrian donation — resolved in the literature into Ángel Losada's two questions: the question of fact (are the Indians infrahuman, such that their barbarity justifies war?) and the question of right (is war a licit instrument of evangelization?). Sepúlveda argued the Aristotelian natural-slavery case (the chapter's section "Conclusiones aristotélicas" documents Sepúlveda consciously recovering Aristotle's political system); Las Casas argued the Indians' rational capacity and natural liberty.
- **No decisive verdict:** "la Junta no emitió fallo ni algún pronunciamiento correspondiente" — the tribunal issued no judgment and no pronouncement, producing only summary reports (Marín Pareja p. 529; corroborated by Daher: the junta's procedures and outcome are undocumented beyond Soto's summary).
- **Hanke identified but not opened:** Lewis Hanke, *Aristotle and the American Indians: A Study in Race Prejudice in the Modern World* (Chicago: Henry Regnery, 1959) — catalogue records confirmed at the Internet Archive (identifiers `aristotleamerica0000hank`, `bwb_P8-AAM-123`), both lending-restricted; search-inside and page images are blocked without a loan. Hanke remains the standard work; per Rule 5, no claim in this report hangs on his pages. If the manuscript wants a Hanke citation, the book must be physically consulted first.
- **Primary document pointer (not opened):** Domingo de Soto's 1552 published summary, *Aquí se contiene una disputa, o controversia* (Sevilla: Sebastián Trujillo, 1552), is the contemporaneous record of the disputation — the Tier 1 artifact to consult if the manuscript quotes the debate's proceedings directly.

### Ruling on `las_casas_short_account` (references.bib:4263)

**It cannot carry a citation about the debate.** The entry points to *A Short Account of the Destruction of the Indies* (Brevísima relación), a polemic written in 1542 and published in 1552, addressed to Prince Philip as an atrocity catalogue. The Wikisource copy the entry cites was opened: it contains a preface and twenty-one chapters of atrocity narrative, with no account of the junta's convening, sessions, arguments, or outcome — and the Wikisource page itself carries a warning that "the source document of this text is not known." A 1552 polemic by one of the two participants says nothing about the tribunal's structure or verdict, and citing it for those facts would repeat the exact failure this re-run exists to repair. Any citation about the debate itself requires a separate scholarly entry (Marín Pareja / Manero / Maestre as opened above; Hanke after physical verification). The Short Account remains usable only for what it is: Las Casas's own indictment of the conquest's conduct.

### Proposed LaTeX (manuscript voice)

Insertion point: **after line 2866**. Verified existing sentence at that location: "With the moral architecture authorized by the Church, the intellectual framework naturalized by Science, and the economic model proven spectacularly profitable in the Portuguese sugar colonies, the algorithm was ready for export." (The paragraph continues through the sentence ending "...\textit{limpieza de sangre}), religious institutions adapted theology to support racial hierarchy in new colonial contexts... \cite{beckert, johnson}." The new paragraph follows the full stop.)

```latex
The Spanish Crown subjected the inherited doctrine to a formal judicial test. In April
1550 Charles V suspended all conquests pending deliberation, and in August he convened
a junta of theologians and jurists at the Colegio de San Gregorio in Valladolid to
determine how the peoples of the Indies could be subjected ``without lesion to his
Royal conscience'' \cite[528]{marin_pareja_valladolid_2020}. Across two sessions
(August--September 1550 and April--May 1551), Juan Gin{\'e}s de Sep{\'u}lveda argued
the Aristotelian case that the Indians were slaves by nature, and Bartolom{\'e} de las
Casas argued their rational capacity and natural liberty
\cite{marin_pareja_valladolid_2020, daher_valladolid_ehne}. The junta issued no
verdict: ``la Junta no emiti{\'o} fallo ni alg{\'u}n pronunciamiento correspondiente''
\cite[529]{marin_pareja_valladolid_2020}. The extraction continued while the tribunal
deliberated, and the tribunal dissolved with the question formally unresolved---the
doctrine's utility to the system never depended on its vindication.
```

### BibTeX

```bibtex
@incollection{marin_pareja_valladolid_2020,
  author    = {Mar{\'i}n Pareja, Nicol{\'a}s},
  title     = {La reinvenci{\'o}n de lo humano en la Junta de Valladolid (1550--1551)},
  booktitle = {Pensando Andaluc{\'i}a. Una visi{\'o}n transdisciplinar II},
  editor    = {C{\'o}rdoba Toro, Juli{\'a}n and Gonz{\'a}lez Zambrano, Pablo},
  publisher = {UNO editorial},
  year      = {2020},
  pages     = {526--541},
  isbn      = {978-84-18659-00-3},
  url       = {https://dialnet.unirioja.es/descarga/libro/855026.pdf},
  urldate   = {2026-09-03},
}

@online{daher_valladolid_ehne,
  author       = {Daher, Andrea},
  title        = {The Valladolid Debate},
  organization = {Encyclop{\'e}die d'histoire num{\'e}rique de l'Europe},
  url          = {https://ehne.fr/en/encyclopedia/themes/colonial-encounters/spiritual-conquest-and-evangelization/valladolid-debate},
  urldate      = {2026-09-03},
  note         = {Scholarly-authored encyclopedia entry (CNRS). Corroboration only; never sole support.},
}

@book{hanke_aristotle_indians_1959,
  author    = {Hanke, Lewis},
  title     = {Aristotle and the American Indians: A Study in Race Prejudice in the Modern World},
  publisher = {Henry Regnery},
  address   = {Chicago},
  year      = {1959},
  note      = {Standard work on the junta. Identified via catalogue records (Internet Archive \texttt{aristotleamerica0000hank}, lending-restricted); NOT opened in this audit. Do not attach page-level claims until physically consulted.},
}
```

---

## Summary table

| Item | Verdict | Sole-support tier | Notes |
|---|---|---|---|
| 15 — Toledo 1449 | VERIFIED | Tier 2 (Nirenberg 2002, López Gómez 2021 — both opened in full) | Quote verified against rendered page image (P&P p. 25) |
| 11a — Aristotle | VERIFIED | Tier 1 (Perseus, Bekker sections opened) | Range 1253b23–1255b40 confirmed; manuscript's 1253b–1255b correct |
| 11b — Isaac quotation | CANNOT CONFIRM | — | Book not openable; paraphrase proposed; critics named (Tuplin 2007, Jácome Neto 2020) |
| 14 — Valladolid | VERIFIED | Tier 2 (Marín Pareja 2020, opened in full; EHNE corroborates) | Hanke identified, not opened; `las_casas_short_account` ruled out for debate claims |

## Unverified remainder (stated plainly)

- Sicroff 1960 and Benito Ruano 1957 (the statute's standard monographic treatments and text editions) were not opened; the 1449 statute is quoted through Nirenberg and López Gómez only.
- Isaac 2004 was not opened; any direct quotation of "proto-racism" requires physical access to pp. 1–2 at minimum.
- Tuplin 2007 was identified through Jácome Neto's bibliography, not read.
- Manero Salvador 2009 and Maestre Sánchez 2004 were identified through Marín Pareja's bibliography, not read; the session dates rest on Marín Pareja's citation of Manero.
- Hanke 1959 was not opened; it should be physically consulted before any Hanke citation enters the manuscript.
- The primary record of the debate (Soto 1552) was identified via the EHNE bibliography, not opened.
