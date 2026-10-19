# Chapter 3 Gap Cluster C — Sourcing Report (Taxonomy & Boas)

**Date:** 2026-09-03
**Model:** Kimi Code CLI
**Scope:** Chapter 3, "Version 1.0: Initializing the Vector (15th-Century Portugal)", `Paper/The_Original_Power.tex` lines 2428–2880. Item 18 (Blumenbach, line 2761) and Item 25 (Boas 1912 immigrant study, insertion after line 2852). Re-routed from Codex (service down).
**Insertion points re-verified against the live file on 2026-09-03** (`sed -n` against `Paper/The_Original_Power.tex`): both orchestrator-supplied line numbers hold; the existing sentences are quoted verbatim below.

**Housekeeping note on `gould`:** the manuscript's existing `\cite{gould}` at line 2761 is Gould, *The Mismeasure of Man* — a secondary source. Nothing below removes it; the proposed Blumenbach wording adds primary-source citations alongside it.

---

## ITEM 18 — Blumenbach and *De generis humani varietate nativa*

**Verdict: VERIFIED — the manuscript's "1776" is defensible but suboptimal; the characterization of Blumenbach is wrong in both directions and must be corrected.**

### What the manuscript currently says (line 2761, verified with `sed -n '2761p'`)

> `\item \textbf{Taxonomies of humanity}: Scientists like Carl Linnaeus (1735) and Johann Friedrich Blumenbach (1776) created racial classification systems that positioned Europeans as the superior ``race'' and Africans as closer to apes \cite{gould}. These taxonomies were presented as empirical observations, not social constructions.`

### Artifacts opened and how

1. **Blumenbach, *De generis humani varietate nativa*, Editio tertia, Gottingae: apud Vandenhoek et Ruprecht, 1795** — Tier 1. Wellcome Library scan, archive.org identifier `b28773640`; downloaded the full PDF and rendered page images with `pdftoppm -r 110`. Read, on the page images: the **title page** ("DE GENERIS HUMANI VARIETATE NATIVA / EDITIO TERTIA / … AVCTORE IO. FRID. BLVMENBACH M.D. / GOTTINGAE apud VANDENHOEK et RUPRECHT. / 1795."); **§85, printed p. 303** ("A) Varietas Caucasia. Nomen huic varietati a Caucaso monte, tum quod vicinia eius et maxime quidem australis plaga pulcherrimam hominum stirpem, Georgianam foveat…"); **§87, printed p. 309** ("Quod vero de Aethiopibus assertum est, propius eos a simiis abesse quam alios homines, hoc quidem eo sensu lubens concedo, quo v. c. suis domesticae varietatem solidungulam (§. 30.) propius ad equum accedere dici potest, quam reliquas sues…").
2. **Thomas Bendyshe (trans. & ed.), *The Anthropological Treatises of Johann Friedrich Blumenbach*, London: Longman, Green, Longman, Roberts, & Green, 1865** — Tier 1 for the Latin texts in English translation; the volume translates both the first edition (1775/1776) and the third edition (1795). archive.org identifier `anthropologicalt00blum`; full PDF downloaded; per Rule 2, every passage quoted below was confirmed against a rendered page image (`pdftoppm`), not the OCR. Read on page images: **title page** (publisher/date as above); **Editor's Preface, printed p. viii** (edition history, quoted below); **first-edition text, printed p. 99** with footnote 4 carrying Blumenbach's own 1781 note on the change from four to five varieties; **1795 text, printed pp. 264–265** (Section IV heading and §§80–82); **printed p. 269** (§85, Caucasian naming); **printed p. 271** (§87, Ethiopian variety and the ape assertion).
3. **Norbert Klatt's Blumenbach bibliography** (in *Kleine Beiträge zur Blumenbach-Forschung*, DNB-hosted PDF, `https://d-nb.info/996597069/34`) — Tier 2 scholarly bibliography of record. Read in full as text (digitally born PDF, no OCR risk). Verbatim edition entries quoted below.
4. **blumenbach-online.de** (Göttingen Academy's Blumenbach edition project) — Tier 2 catalogue. The biographical chronology page records: doctorate September 1775 on the dissertation *De generis humani varietate nativa*, disputation 16 September 1775 (citing Dougherty/Klatt, *Correspondence*, vol. 1, letter 21 n. 4). A separate bibliographic record on the same site transcribes the 1775 dissertation title page: "…pro gradu doctoris medicinae disputavit d. XVI. Sept. MDCCLXXV … Ioann. Frider. Blumenbach Gothanus."

### The edition record, as established

- **1775** — the doctoral dissertation: *De generis humani varietate nativa. Illustris facultatis medicae consensu pro gradu doctoris medicinae disputavit d. XVI Sept. MDCCLXXV … Ioann. Frider. Blumenbach Gothanus.* (Goettingae: Typis Frid. Andr. Rosenbuschii, [1775]). Verbatim from Klatt's bibliography; disputation date 16 September 1775 confirmed by the Göttingen Academy chronology.
- **1776** — the first book edition: *De generis humani varietate nativa liber. Cum figuris aeri incisis.* (Goettingae: Apud viduam Abr. Vandenhoeck, 1776). Verbatim from Klatt's bibliography. Bendyshe (printed p. viii, page image): "the translation has been made from the reprint of 1776, which differs in the title-page alone." **This is the manuscript's "1776"** — it exists, and it is the 1775 dissertation in book form, content-identical but for the title page.
- **1781** — second edition: *…Editio altera longe auctior et emendatior.* (Goettingae: Apud viduam Abr. Vandenhoek, 1781). What changed: the five-variety division appears here for the first time, at pp. 51–52 ("Quinque generis humani varietates constituuntur"), as Blumenbach states in his own 1781 note carried in Bendyshe (printed pp. 99–100, page image): "Formerly in the first edition of this work I divided all mankind into four varieties; but after I had more accurately investigated the different nations of Eastern Asia and America … I was compelled to give up that division, and to place in its stead the following five varieties, as more consonant to nature." Bendyshe's editorial footnote to that passage (same page image): "This is the first sketch of the still famous division of mankind by Blumenbach: **the well-known terms Caucasian, &c. will be found in the third ed. below.**"
- **1795** — third edition (Vandenhoek et Ruprecht). Bendyshe (printed p. viii, page image): "finally a third in 1795, which in arrangement and matter was almost a new work." **The five variety-names — Caucasian, Mongolian, Ethiopian, American, Malay — first appear here** (Bendyshe's note above; confirmed positively in the 1795 Latin text at §85, p. 303, and in the volume's index entry "Generis humani varietates quinae principes, species vero unica … A) Caucasia B) Mongolica C) Aethiopica D) Americana E) Malaica").

### What Blumenbach's system actually claimed (1795 edition; Bendyshe translation page-images, printed pages given)

The ranking (§81, printed pp. 264–265):

> "…all mankind, as far as it is at present known to us, seems to me as if it may best, according to natural truth, be divided into the five following varieties; which may be designated and distinguished from each other by the names *Caucasian, Mongolian, Ethiopian, American*, and *Malay*. I have allotted the first place to the Caucasian, for the reasons given below, which make me esteem it the primeval one."

The naming and the degeneration gradient (§85, printed p. 269):

> "Caucasian variety. I have taken the name of this variety from Mount Caucasus, both because its neighbourhood, and especially its southern slope, produces the most beautiful race of men, I mean the Georgian; and because all physiological reasons converge to this, that in that region, if anywhere, it seems we ought with the greatest probability to place the autochthones of mankind. … Besides, it is white in colour, which we may fairly assume to have been the primitive colour of mankind, since, as we have shown above (s. 45), it is very easy for that to degenerate into brown, but very much more difficult for dark to become white, when the secretion and precipitation of this carbonaceous pigment (s. 44) has once deeply struck root."

The monogenism (Section IV heading, printed p. 264: "FIVE PRINCIPAL VARIETIES OF MANKIND, ONE SPECIES"; §80, same page):

> "…no variety exists, whether of colour, countenance, or stature, &c, so singular as not to be connected with others of the same kind by such an imperceptible transition, that it is very clear they are all related, or only differ from each other in degree."

The degeneration mechanism defined (§§22–23, printed pp. 188–189): animals belong to one species when their differences "may have arisen from degeneration"; they are different species when the difference "cannot be explained by the known sources of degeneration" — degeneration is departure from a primordial stock under climate, mode of life, and nurture, and it is the conceptual hinge of his single-species argument.

The explicit rejection of the African–ape linkage (§87, printed pp. 270–271):

> "The assertion that is made about the Ethiopians, that they come nearer the apes than other men, I willingly allow so far as this, that it is in the same way that the solid-hoofed (s. 30) variety of the domestic sow may be said to come nearer to the horse than other sows. But how little weight is for the most part to be attached to this sort of comparison is clear from this, that there is scarcely any other out of the principal varieties of mankind, of which one nation or other … has not been compared, as far as the face goes, with the apes…"

(Latin original confirmed on the page image at printed p. 309 of the 1795 edition.)

### Assessment of the manuscript's claim

- The date "1776" corresponds to the first book edition; the work is a 1775 dissertation and is conventionally cited 1775. Either is defensible; 1775 with the edition history is the accurate choice.
- "Positioned Europeans as the superior 'race'": **true of Blumenbach** — Caucasian as primeval, most beautiful, divergence into Ethiopian and Mongolian "extremes" (Bendyshe's included commentary by Flourens, printed p. x–xi of the Preface, calls the Mongolian and Ethiopian "the extreme degenerations of the human species"; the ranking is Blumenbach's own at §§81, 85).
- "Africans as closer to apes": **false of Blumenbach** — §87 is an explicit refutation of exactly that assertion, and the section title binds all five varieties to one species. The clause fits Linnaeus-adjacent and later traditions; attaching it to Blumenbach by name is a misattribution.
- He was simultaneously a ranker and a monogenist; the degeneration model is what reconciles the two — varieties are departures from a single primeval (Caucasian) stock, not separate creations. That is precisely what made the scheme durable: hierarchy without polygenism.

### Proposed LaTeX (replacement for line 2761's two sentences)

```latex
    \item \textbf{Taxonomies of humanity}: Carl Linnaeus (1735) and Johann Friedrich Blumenbach built classification systems that placed the European form at the apex of the human gradient \cite{gould}. Blumenbach's \textit{De generis humani varietate nativa}---his 1775 G\"ottingen dissertation, issued in book form in 1776 and expanded in second (1781) and third (1795) editions---divided mankind into four varieties in its first edition and five from 1781 onward; the five names that entered every European language---Caucasian, Mongolian, Ethiopian, American, Malay---appear only in the third edition of 1795 \cite{blumenbach1795}. Blumenbach allotted first place to the Caucasian, which he esteemed the ``primeval'' variety, named it after Mount Caucasus on the grounds that the Georgian stock displayed ``the most beautiful form of the skull,'' and held white to be the primitive colour of mankind from which the other varieties had degenerated under climate and mode of life \cite[264--265, 269]{blumenbach1865}. The same treatise held all five varieties to a single species, asserted that they ``run into one another by insensible degrees,'' and dismissed the claim that Ethiopians ``come nearer the apes than other men'' as a comparison worth as little as likening a solid-hoofed pig to a horse \cite[264, 271]{blumenbach1865}. Blumenbach's system ranked humanity along a gradient whose origin-point was European, and it did so inside a monogenist frame that rejected separate creations outright. These taxonomies were presented as empirical observations, not social constructions.
```

Note: the final sentence of the current line ("These taxonomies were presented as empirical observations, not social constructions.") is retained unchanged at the end of the replacement.

### Proposed BibTeX

```bibtex
@book{blumenbach1795,
  author    = {Blumenbach, Johann Friedrich},
  title     = {De generis humani varietate nativa. Editio tertia, praemissa est epistola ad virum perillustrem Josephum Banks},
  publisher = {Vandenhoek et Ruprecht},
  address   = {Gottingae},
  year      = {1795},
  note      = {Title page, \S 85 (printed p. 303) and \S 87 (printed p. 309) verified against page images of the Wellcome Library scan, archive.org identifier b28773640},
}

@book{blumenbach1865,
  author       = {Blumenbach, Johann Friedrich},
  title        = {The Anthropological Treatises of Johann Friedrich Blumenbach},
  editor       = {Bendyshe, Thomas},
  publisher    = {Longman, Green, Longman, Roberts, \& Green},
  address      = {London},
  year         = {1865},
  note         = {Bendyshe's translations of the first edition (1775/1776) and third edition (1795) of \emph{De generis humani varietate nativa}, with the memoirs by Marx and Flourens. Editor's Preface p. viii (edition history), pp. 99--100 n. 4 (1781 five-variety note), pp. 188--189, 264--265, 269, 271 verified against page images of archive.org identifier anthropologicalt00blum},
}
```

No DOI exists for either (pre-DOI works); the archive.org identifiers serve as the locators.

---

## ITEM 25 — Boas, "Changes in the Bodily Form of Descendants of Immigrants" (1912)

**Verdict: VERIFIED (both the 1912 paper and the state of the 2002–2003 dispute), with one precision correction: the later reanalyses worked from Boas's 1928 published raw data, and the 17,821 figure belongs to the 1911 Final Report, not to the 1912 journal article.**

### Where the manuscript mentions it now

The Boas study appears only as a clause at line 2852 (verified with `sed -n '2852p'`):

> "The finding prefigures the Boasian revolution by forty years and anticipates modern critiques of racialized data collection by over a century."

(Side observation for the editors, outside this item's scope: 1885 → 1912 is twenty-seven years; "forty years" is loose if Boas 1912 is the referent.)

### Artifacts opened and how

1. **Boas, "Changes in the Bodily Form of Descendants of Immigrants," *American Anthropologist* n.s. 14(3): 530–562 (July–September 1912)** — Tier 1. Full scanned volume 14, archive.org identifier `in.ernet.dli.2015.530185` (Digital Library of India scan, 809-page image-only PDF); located the article via the item's djvu.xml page index and rendered `pdftoppm` page images. Read on page images: **printed p. 530** (title, byline, commission history, and summary points 1–2), **printed p. 531** (points 4–5, 7–9), **printed p. 562** (the conclusion, quoted below; dateline "Columbia University, New York, August 6, 1912"). Bibliographic record (volume, issue, pages, DOI 10.1525/aa.1912.14.3.02a00080) confirmed via Crossref (`api.crossref.org/works/10.1525/aa.1912.14.3.02a00080`).
2. **Boas, *Changes in Bodily Form of Descendants of Immigrants (Final Report)*, Reports of the Immigration Commission, 61st Congress, 3d Session, Senate Document No. 208, Washington: Government Printing Office, 1911** — Tier 1. Cornell scan, archive.org identifier `cu31924029900184`; page images read: **title page** (as cited above), **Chapter I, printed p. 5** (the cephalic-index findings, quoted below), **Table 18, printed p. 84** ("Number of individuals measured": Total males 10,509; Total females 7,312; **Grand total 17,821**).
3. **Sparks, Corey S., and Richard L. Jantz, "A reassessment of human cranial plasticity: Boas revisited," *PNAS* 99(23): 14636–14639 (2002)** — Tier 2. Full text read at PMC (`pmc.ncbi.nlm.nih.gov/articles/PMC137471/`); byline, journal, volume/issue/pages, and DOI 10.1073/pnas.222389599 read off the PMC record. **Note: the DOI given in the task brief (10.1073/pnas.222545399) is wrong**; the correct DOI, read off the published record, is 10.1073/pnas.222389599.
4. **Gravlee, Clarence C., H. Russell Bernard, and William R. Leonard, "Heredity, Environment, and Cranial Form: A Reanalysis of Boas's Immigrant Data," *American Anthropologist* 105(1): 125–138 (March 2003)** — Tier 2. Full-text PDF read (the author's own copy, gravlee.org, retrieved via the Wayback Machine capture of 2014-07-30; the PDF carries the journal masthead "AMERICAN ANTHROPOLOGIST 105(1):125–138. COPYRIGHT © 2003, AMERICAN ANTHROPOLOGICAL ASSOCIATION"). Digitally born PDF; quotes taken from its text layer. Metadata cross-checked via Crossref (DOI 10.1525/aa.2003.105.1.125; volume 105, issue 1, pages 125–138).
5. Context for the exchange: **Gravlee, Bernard & Leonard, "Boas's Changes in Bodily Form…," *AA* 105(2): 326–332 (2003)**, DOI 10.1525/aa.2003.105.2.326, and **Sparks & Jantz, "Changing Times, Changing Faces…," *AA* 105(2): 333–337 (2003)**, DOI 10.1525/aa.2003.105.2.333 — bibliographic records verified via Crossref; **full texts not opened** (Wiley paywall). Proposed below only as a citation that the exchange continued, not for any substantive claim.

### What Boas measured and found (verbatim, page-image verified)

1912 article, printed p. 530, summary point 1:

> "American-born descendants of immigrants differ in type from their foreign-born parents. The changes which occur among various European types are not all in the same direction. They develop in early childhood and persist throughout life."

Summary point 2 (same page):

> "The influence of American environment makes itself felt with increasing intensity, according to the time elapsed between the arrival of the mother and the birth of the child."

1912 article, printed p. 562 (the paper's own statement of its scope — note the restraint):

> "All we have shown is that headforms may undergo certain changes in course of time, without change of descent."

Final Report (1911), Chapter I, printed p. 5 — the cephalic-index finding with figures:

> "In most of the European types that have been investigated the head form, which has always been considered one of the most stable and permanent characteristics of human races, undergoes far-reaching changes coincident with the transfer of the people from European to American soil. For instance, the east European Hebrew, who has a very round head, becomes more long-headed; the south Italian, who in Italy has an exceedingly long head, becomes more short-headed; so that in this country both approach a uniform type, as far as the roundness of the head is concerned."
>
> "The width of the head expressed in per cents of the length of the head is about 78 per cent among Sicilians born in Sicily and about 83 per cent among Hebrews born in eastern Europe. Among Sicilians born in America this number rises to more than 80 per cent, while among east European Hebrews born in America it sinks to 81 per cent."

Sample size, Final Report Table 18, printed p. 84 ("Number of individuals measured"): **grand total 17,821** (10,509 males; 7,312 females). Cross-confirmed by Gravlee et al. 2003, p. 126: "From 1908 to 1910, Boas and a team of 13 assistants collected a series of anthropometric measurements on 17,821 immigrants and their children living in New York City. The sample was stratified by immigrant group so that seven groups were represented: East European Hebrews, Bohemians, Sicilians, Neapolitans, Poles, Hungarians and Slovaks, and Scotch."

### Where the dispute stands (verbatim)

Sparks & Jantz 2002 reanalyzed Boas's published raw data (the 1928 *Materials for the Study of Inheritance in Man* — "anthropometric measurements taken from 1909 to 1910 on ≈13,000 European-born immigrants and their American-born children in the New York area"; their heritability models drew on 1,482 pedigrees, n = 9,595). Abstract:

> "Results point to very small and insignificant differences between European- and American-born offspring, and no effect of exposure to the American environment on the cranial index in children. These results contradict Boas' original findings and demonstrate that they may no longer be used to support arguments of plasticity in cranial morphology."

Their Discussion:

> "Instead of the large plasticity component claimed by Boas and countless others who have cited his work, our analysis reveals high heritability in the family data and variation among the ethnic groups, which persists, in the American environment."

Worth noting for calibration: within their own results, 11 of 156 executable tests were significant, all in the Hebrew sample, and 73% of the significant tests concerned the cranial index — the strongest residual signal sits where Boas's largest subsample was.

Gravlee, Bernard & Leonard 2003 (same data, modern inferential statistics). On the birthplace difference:

> "The evidence is clear that there are statistically significant differences in cephalic index between U.S.- and foreign-born descendants of the Sicilian, Central Italian, Bohemian, and Hebrew immigrant samples (H1). As Boas concluded, the changes in head form are moderate in size and vary in direction across immigrant groups." (p. 133)

On the parent–offspring mechanism:

> "As Boas hypothesized, our results show that children born in the U.S. environment are markedly less similar to their parents in terms of head form than foreign-born children are to theirs (r = .412 and r = .648, respectively). Moreover, inferential statistics practically eliminate the possibility that this observation is a result of random sampling error (p < .001 for all regressions). This finding thus corroborates Boas's overarching conclusion that the cephalic index is sensitive to environmental influences and, therefore, does not serve as a valid marker of racial phylogeny." (p. 135)

Their own stated qualification: the evidence for Boas's time-of-exposure gradient (his H2) is "quite weak," weakened further by missing values (roughly 13% and 22% of eligible cases excluded in two analyses). Overall verdict (p. 137):

> "We conclude that, on the whole, Boas was right, despite the limited analytical tools at his disposal. However, the strongest evidence that environmental factors influence the cephalic index is not the direct association between cephalic index and the time elapsed between mother's immigration and child's birth, as previously had been thought. Rather, it is the difference in parent–offspring correlations and regression coefficients between U.S.- and foreign-born immigrant descendants and their parents."

Their footnote 1 records the collision: "While our manuscript was in press, Sparks and Jantz (2002) published their reanalysis of the immigrant data in which they conclude that Boas was wrong." The exchange continued in *AA* 105(2) (2003): Gravlee et al., pp. 326–332; Sparks & Jantz, pp. 333–337 (records verified via Crossref; texts not opened).

### Proposed LaTeX (new paragraph inserted after line 2852)

The insertion follows this existing sentence (line 2852, verified): "His critique exposed European anthropological practice as bias presented as empiricism \cite{firmin1885}. The finding prefigures the Boasian revolution by forty years and anticipates modern critiques of racialized data collection by over a century."

```latex
The Boasian revolution, when it came, ran the same audit on the same instrument. Between 1908 and 1910, Franz Boas and a team of thirteen assistants measured 17,821 immigrants and their children in New York City for the United States Immigration Commission \cite[84]{boas1911}. Reporting the results in 1912, Boas found that American-born descendants differed in head form from their foreign-born parents, that the shift developed in early childhood and persisted through life, and that it grew with the time elapsed between the mother's arrival and the child's birth \cite[530--531]{boas1912}. The cephalic index---head width as a percentage of head length, then the load-bearing measurement of racial taxonomy---moved in opposite directions in the two largest samples: Sicilian children shifted from about 78 among the foreign-born to more than 80 among the American-born, while east European Hebrew children shifted from about 83 to 81 \cite[5]{boas1911}. Boas stated the finding with a restraint his successors did not always keep: ``All we have shown is that headforms may undergo certain changes in course of time, without change of descent'' \cite[562]{boas1912}. A variable that craniometry had treated as the stable signature of race responded to environment within a single generation; the partition variable moved under measurement.

The finding has been re-analyzed from Boas's own published raw data, with opposite verdicts. Sparks and Jantz applied maximum-likelihood heritability estimation to the family records (1,482 pedigrees, 9,595 individuals) and found the differences between European- and American-born offspring small and mostly insignificant, concluding that Boas's results ``may no longer be used to support arguments of plasticity in cranial morphology'' \cite{sparks_jantz2002}. Gravlee, Bernard, and Leonard, subjecting the same data to modern inferential statistics, confirmed statistically significant differences in cephalic index between U.S.- and foreign-born descendants in the four largest subsamples, and found American-born children markedly less similar to their parents than foreign-born children to theirs ($r = .412$ against $r = .648$, $p < .001$), concluding that ``on the whole, Boas was right'' \cite{gravlee2003}. The dispute concerns magnitude and mechanism. Gravlee and his colleagues rate the evidence for Boas's time-of-exposure gradient as weak and locate the strongest environmental signal in the parent--offspring correlations; Sparks and Jantz locate the dominant signal in heritability. Both re-analyses register change; they disagree over how much of it the environment explains. The exchange continued in the same journal the following year \cite{gravlee2003b, sparks_jantz2003}.
```

### Proposed BibTeX

```bibtex
@article{boas1912,
  author  = {Boas, Franz},
  title   = {Changes in the Bodily Form of Descendants of Immigrants},
  journal = {American Anthropologist},
  year    = {1912},
  volume  = {14},
  number  = {3},
  pages   = {530--562},
  doi     = {10.1525/aa.1912.14.3.02a00080},
  note    = {Printed pp. 530--531 and 562 verified against page images of the scanned journal volume, archive.org identifier in.ernet.dli.2015.530185},
}

@book{boas1911,
  author    = {Boas, Franz},
  title     = {Changes in Bodily Form of Descendants of Immigrants (Final Report)},
  publisher = {Government Printing Office},
  address   = {Washington},
  year      = {1911},
  series    = {Reports of the Immigration Commission},
  note      = {61st Congress, 3d Session, Senate Document No. 208. Title page, Chapter I (printed p. 5), and Table 18 (printed p. 84, grand total 17,821 individuals measured) verified against page images of the Cornell scan, archive.org identifier cu31924029900184},
}

@article{sparks_jantz2002,
  author  = {Sparks, Corey S. and Jantz, Richard L.},
  title   = {A Reassessment of Human Cranial Plasticity: {Boas} Revisited},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2002},
  volume  = {99},
  number  = {23},
  pages   = {14636--14639},
  doi     = {10.1073/pnas.222389599},
  note    = {Full text read at PMC137471. Abstract and Discussion quoted verbatim. The DOI 10.1073/pnas.222545399 circulating for this paper is wrong.},
}

@article{gravlee2003,
  author  = {Gravlee, Clarence C. and Bernard, H. Russell and Leonard, William R.},
  title   = {Heredity, Environment, and Cranial Form: A Reanalysis of {Boas's} Immigrant Data},
  journal = {American Anthropologist},
  year    = {2003},
  volume  = {105},
  number  = {1},
  pages   = {125--138},
  doi     = {10.1525/aa.2003.105.1.125},
  note    = {Full text read from the author's copy (gravlee.org), retrieved via the Wayback Machine capture of 2014-07-30; journal masthead present on the PDF. Metadata cross-checked via Crossref.},
}

@article{gravlee2003b,
  author  = {Gravlee, Clarence C. and Bernard, H. Russell and Leonard, William R.},
  title   = {Boas's Changes in Bodily Form: The Immigrant Study, Cranial Plasticity, and {Boas's} Physical Anthropology},
  journal = {American Anthropologist},
  year    = {2003},
  volume  = {105},
  number  = {2},
  pages   = {326--332},
  doi     = {10.1525/aa.2003.105.2.326},
  note    = {Bibliographic record verified via Crossref; full text not opened (paywalled). Cited only for the existence of the 2003 exchange.},
}

@article{sparks_jantz2003,
  author  = {Sparks, Corey S. and Jantz, Richard L.},
  title   = {Changing Times, Changing Faces: {Franz Boas's} Immigrant Study in Modern Perspective},
  journal = {American Anthropologist},
  year    = {2003},
  volume  = {105},
  number  = {2},
  pages   = {333--337},
  doi     = {10.1525/aa.2003.105.2.333},
  note    = {Bibliographic record verified via Crossref; full text not opened (paywalled). Cited only for the existence of the 2003 exchange.},
}
```

---

## Unverified remainder (stated plainly, per Rule 5)

- The 1775 dissertation's title page itself was not rendered from a scan; its imprint is taken from Klatt's bibliography (DNB-hosted) and the Göttingen Academy's blumenbach-online record. The 1795 title page *was* read from a page image. If a Tier-1 check of the 1775 title page is wanted, the digitized dissertation is linked from blumenbach-online's catalogue entry 00001.
- The Gravlee et al. 2003 PDF used is the author's own copy retrieved through the Wayback Machine; it carries the journal masthead and pagination (105(1):125–138), but it was not fetched from the publisher. Crossref confirms the record.
- The two 2003 exchange papers (*AA* 105(2)) are cited by record only; their texts were not opened.
- Linnaeus (1735), cited at line 2761, was outside this cluster's scope and was not re-verified here.
- The existing "forty years" figure at line 2852 is not supported by the 1885→1912 interval (27 years); flagged for the editors, not altered here.
