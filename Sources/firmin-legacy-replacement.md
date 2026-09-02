# Firmin Legacy Citation-Replacement Report

All 12 live `firmin_legacy` citations can be eliminated. Eight occurrences are covered solely by existing bibliography entries, three use one of two new entries alongside existing sources, and line 12711 should be cut in full because its historical sources do not establish a zero denominator or an infinite leverage ratio. Two additional phrases should be cut: the unsupported comparative superlative at line 12607 and the unsupported priority claim at line 12755. After the replacements and cuts specified below, `Paper/The_Original_Power.tex` would contain zero `firmin_legacy` occurrences and the fabricated bibliography entry could be deleted.

Model: GPT-5 Codex

Research date: 2026-09-02

Scope: research report only. No `.tex` or `.bib` file was edited.

## Corpus check and method

The required live checks returned 12 manuscript matches on 12 separate lines and one bibliography match:

```text
$ grep -n 'firmin_legacy' Paper/The_Original_Power.tex
633:$P_{\text{gaslight}}$ \cite{firmin_legacy}; Chapter~\ref{ch:contemporary-architecture} then tests the same mechanism in predictive form.
12607:The containment of Haiti met resistance. The most sophisticated documented instance of a peripheral actor using $E_{\text{global}}$'s own protocols against it occurred in 1891, when Ant\'{e}nor Firmin---then serving as Haiti's Minister of Finance, Commerce, and External Relations---outmaneuvered a US naval force in what stands as a textbook demonstration of using the system's own rules as a defensive weapon \cite{firmin_legacy, manigat}.
12619:Admiral Hammerton Killick commanded the Haitian Navy and had thrown his full support behind Firmin, using the gunboat \textit{Crête-à-Pierrot} to blockade Nord Alexis's ports. When Nord Alexis ordered munitions from overseas via a German commercial vessel (the \textit{Markomannia}), Killick intercepted and confiscated the weapons---a legally defensible act of war-contraband seizure. The provisional government alerted German authorities. Imperial Germany dispatched the gunboat SMS \textit{Panther} to Gonaïves to recover the munitions and capture or sink the Haitian vessel \cite{firmin_legacy}.
12647:... \cite{firmin_legacy, manigat}. ...
12664:... \cite{firmin_legacy, manigat}. ...
12670:... \cite{firmin_legacy, manigat}. ...
12685:... \cite{firmin_legacy, manigat}. ...
12711:... \cite{firmin_legacy, manigat}.
12717:... \cite{firmin_legacy, rodney, acemoglu_robinson}. ...
12755:... \cite{firmin_legacy, manigat}.
12757:... \cite{firmin_legacy}.
12763:... \cite{firmin_legacy}.

$ grep -c 'firmin_legacy' Paper/references.bib
1
```

The abbreviated equation-footnote rows above are quoted in full in the per-occurrence analysis. Each replacement key named in this report was checked directly in `Paper/references.bib`. The confirmed existing keys are `firmin1885`, `firmin1905`, `leger1907haiti_en`, `leger1907haiti_fr`, `frus1902haiti`, `mitchell1996`, `holley2024`, `fluehrlobban2005`, `adisherwood2003`, `nps_douglass_chronology`, `manigat`, `drouinhans`, and `lewis_morton`. The proposed keys `fajardofernandez2020` and `vclt1969` do not currently occur in that file.

Scanned pages were located with text extraction and then rendered at 165 dpi with `pdftoppm`. The page images, rather than the OCR layer, supplied the verification. The earlier research files were used as an index and audit trail. Their conclusions were retained only where an opened artifact supported them. In particular, this report rechecked the principal Firmin, Léger, FRUS, Manigat, Holley, Adi and Sherwood, Fajardo Fernández et al., and Vienna Convention passages. The relevant prior reports are [firmin-citation-repair.md](firmin-citation-repair.md), [killick-leger-1907-haitian-account.md](killick-leger-1907-haitian-account.md), [facts-edit-review.md](facts-edit-review.md), [facts-edit-review-round2.md](facts-edit-review-round2.md), [facts-edit-review-round3.md](facts-edit-review-round3.md), [firmin-folio-crosscheck.md](firmin-folio-crosscheck.md), [firmin-corrections-7-to-11.md](firmin-corrections-7-to-11.md), [firmin-1885-mining-pass.md](firmin-1885-mining-pass.md), and [firmin-1885-framework-pass.md](firmin-1885-framework-pass.md).

## Per-occurrence analysis

### Line 633 — Firmin against pseudo-scientific racial hierarchy

Current command: `\cite{firmin_legacy}`

Manuscript sentence:

```tex
Firmin's attack on pseudo-scientific racial hierarchy supplies an early counter-signal against the epistemic layer of $P_{\text{gaslight}}$ \cite{firmin_legacy}; Chapter~\ref{ch:contemporary-architecture} then tests the same mechanism in predictive form.
```

The citation supports two historical-textual predicates: Firmin characterized racial inequality doctrine as pseudo-scientific, and he connected that doctrine to domination and exploitation. It does not independently validate the manuscript's formal variable `$P_{\text{gaslight}}$`; that mapping is the author's stated interpretation.

Disposition: **covered by an existing entry**.

Source and locator: `firmin1885`, printed folio 204 and folios 566--570. Folio 204 calls the inequality doctrine anti-philosophical and pseudo-scientific and links it to exploitation. Folios 566--570 describe European domination, colonial material interests, and the scientific legitimation supplied by racial doctrine.

Artifact contact: I opened `Sources/Firmin_De_l_egalite_des_races_humaines_1885.pdf`, the local copy of Internet Archive item `Antnor1885Bnf30437548r`. I rendered PDF pages 225 and 587--591 at 165 dpi and read the page images. The printed folios were 204 and 566--570, consistent with the verified offset recorded in [firmin-folio-crosscheck.md](firmin-folio-crosscheck.md).

Provenance tier: **primary/contemporaneous intellectual work**.

Exact replacement:

```tex
\cite[204, 566--570]{firmin1885}
```

### Line 12607 — Firmin's office and the Môle Saint-Nicolas refusal

Current command: `\cite{firmin_legacy, manigat}`

Manuscript sentence:

```tex
The containment of Haiti met resistance. The most sophisticated documented instance of a peripheral actor using $E_{\text{global}}$'s own protocols against it occurred in 1891, when Ant\'{e}nor Firmin---then serving as Haiti's Minister of Finance, Commerce, and External Relations---outmaneuvered a US naval force in what stands as a textbook demonstration of using the system's own rules as a defensive weapon \cite{firmin_legacy, manigat}.
```

The verifiable claims are Firmin's combined Finance, Commerce, and External Relations portfolio in 1889--1891; his role in preventing the United States from acquiring the Môle; and the documentary sequence in which he demanded proper powers, invoked Haitian sovereignty, refused negotiation under visible naval pressure, and closed the exchange without a cession. The formal `$E_{\text{global}}$` description and “textbook demonstration” are authorial interpretations of those facts.

Disposition: **a new source is needed for the exact ministerial portfolio; existing entries cover the diplomatic episode**.

New source and locator: Fajardo Fernández, Laëthier, Argyriadis, and Clormeus, “Après le rêve antillais,” p. 155. The page states that between 1889 and 1891 Firmin was Secretary of State for Finance, Commerce, and External Relations under Florvil Hyppolite and that he prevented the United States from acquiring the Môle Saint-Nicolas. Existing `manigat`, pp. 20--21, identifies Firmin's diplomatic role and the outcome. Existing `firmin1905`, pp. 497--501, reproduces the correspondence over Gherardi's powers, Haitian sovereignty, the presence of two American squadrons, Firmin's refusal to negotiate under that pressure, and the final closure.

Artifact contact: I downloaded the full chapter PDF from the Institut de recherche pour le développement record `fdi:010081203`, rendered PDF page 19, and read printed p. 155. I rendered and read printed pp. 20--21 from `Sources/antenorfirminles00mani.pdf`. For Firmin's 1905 book, Internet Archive item `mrooseveltprsi00firm`, I opened the full-resolution page images `n514` through `n518` and read printed pp. 497--501.

Provenance tiers: Fajardo Fernández et al. and Manigat are **scholarly secondary**; Firmin's published documentary account is **primary**.

No opened source makes the comparative claim “most sophisticated.” Recommend cutting exactly `most sophisticated ` and changing the resulting initial article from `The` to `A` for grammar. The surviving historical sentence begins, “A documented instance of a peripheral actor ... occurred in 1891.”

Exact replacement after that limited cut:

```tex
\cite[155]{fajardofernandez2020}\cite[20--21]{manigat}\cite[497--501]{firmin1905}
```

### Line 12619 — Killick, the Markomannia, and the Panther

Current command: `\cite{firmin_legacy}`

Manuscript sentences:

```tex
Admiral Hammerton Killick commanded the Haitian Navy and had thrown his full support behind Firmin, using the gunboat \textit{Crête-à-Pierrot} to blockade Nord Alexis's ports. When Nord Alexis ordered munitions from overseas via a German commercial vessel (the \textit{Markomannia}), Killick intercepted and confiscated the weapons---a legally defensible act of war-contraband seizure. The provisional government alerted German authorities. Imperial Germany dispatched the gunboat SMS \textit{Panther} to Gonaïves to recover the munitions and capture or sink the Haitian vessel \cite{firmin_legacy}.
```

The citation supports Killick's alignment with Firmin, the blockade and arms-interdiction purpose, the seizure from the `Markomannia`, and the German dispatch and action. “Legally defensible” is supportable as the existence of Firmin's and Killick's contemporaneous prize-law defense. The FRUS documents also preserve the opposing American assessment, so the wording cannot be read as a settled adjudication.

Disposition: **covered by existing entries**.

Sources and locators: `leger1907haiti_en`, pp. 252--253; `frus1902haiti`, pp. 657 and 661--662. Léger describes Killick's Firminist alignment, seizure, Germany's piracy characterization, the `Panther`'s arrival, and the demand made to Killick. FRUS p. 661 reproduces Firmin's instructions describing the blockade and contraband purpose; p. 662 reproduces Killick's seizure certificate and the American naval officer's contrary view; p. 657 records the German action.

Artifact contact: I opened Internet Archive item `haitiherhistoryh00lguoft`, viewed full-resolution page images `n275` and `n278`, and read printed pp. 252--253. I opened the official Office of the Historian FRUS document 653 and read pp. 657 and 661--662 in the HTML page. These checks reproduce the relevant artifact work recorded in [killick-leger-1907-haitian-account.md](killick-leger-1907-haitian-account.md) and the three adversarial review reports.

Provenance tiers: Léger is a **named scholarly secondary/contemporary history**; FRUS is **primary/contemporaneous diplomatic documentation**.

Exact replacement:

```tex
\cite[252--253]{leger1907haiti_en}\cite[657, 661--662]{frus1902haiti}
```

### Line 12647 — Legitimation Constraint Set

Current command: `\cite{firmin_legacy, manigat}`

Manuscript sentence containing the citation:

```tex
This equation is classified as Tier~3 (ordinal/structural); the Legitimation Constraint Set $\mathcal{L}$ is an enumerative device whose empirical content is validated by the M\^{o}le Saint-Nicolas affair (1891) as primary instantiation and by the three-phase Firmin Protocol table (Section~\ref{sec:imperial_core_theorem} and the table immediately following this definition) that documents the specific $\ell_i$ invoked at each phase \cite{firmin_legacy, manigat}.
```

The surrounding definition enumerates diplomatic authorization, freely negotiated consent, sovereign equality, and prohibition on coerced treaties. Firmin's correspondence documents the full-powers objection, the sovereignty objection, and refusal to negotiate under naval pressure. Article 52 of the Vienna Convention supplies the positive-law rule for treaties procured by threat or use of force. The set notation and its completeness remain an authorial Tier-3 construction.

Disposition: **existing coverage plus a new primary legal source**.

Sources and locators: `firmin1905`, pp. 497--501; new `vclt1969`, art. 52.

Artifact contact: I read Firmin's printed pp. 497--501 in the full-resolution Internet Archive images for item `mrooseveltprsi00firm`. I downloaded the official United Nations PDF of the Vienna Convention, rendered PDF page 18 at 165 dpi, and read Article 52 on the image. The UN Treaty Collection record identifies the instrument as registration no. 18232, concluded at Vienna on 23 May 1969 and published at 1155 UNTS 331.

Provenance tiers: Firmin is **primary**; the Vienna Convention is a **primary legal instrument**. The equation is an **authorial analytic construct**, so the citations establish its inputs rather than the set's mathematical status.

Exact replacement:

```tex
\cite[497--501]{firmin1905}\cite[art.~52]{vclt1969}
```

### Line 12664 — Coercion-legitimacy frontier

Current command: `\cite{firmin_legacy, manigat}`

Manuscript sentence containing the citation:

```tex
This equation is classified as Tier~3 (ordinal/structural); the coercion--legitimacy frontier $F^L$ is codified in positive international law by the Vienna Convention on the Law of Treaties (1969), Article~52, which voids treaties procured by the threat or use of force against a sovereign. The Môle Saint-Nicolas case is the pre-codification instantiation of the same structural constraint, and Firmin's refusal to negotiate while US warships were present in Haitian waters is the documented invocation \cite{firmin_legacy, manigat}.
```

Article 52 supports the modern treaty-law statement. Firmin's p. 500 supports the historical predicate: two American squadrons were present, and he stated that he could not negotiate without appearing to yield to foreign pressure. Calling the 1891 episode a pre-codification “instantiation” is the manuscript's structural comparison.

Disposition: **a new primary legal source plus an existing primary historical source**.

Artifact contact: I rendered and read Article 52 from the official United Nations convention PDF, PDF p. 18. I opened the Internet Archive full-resolution image `n517` for `mrooseveltprsi00firm` and read printed p. 500.

Provenance tiers: **primary legal instrument** and **primary historical account/documentation**. The frontier is an **authorial analytic construct**.

Exact replacement:

```tex
\cite[art.~52]{vclt1969}\cite[500]{firmin1905}
```

### Line 12670 — Firmin Extraction Threshold

Current command: `\cite{firmin_legacy, manigat}`

Manuscript sentence containing the citation:

```tex
This equation is classified as Tier~3 (ordinal/structural); the Firmin Extraction Threshold $F^*$ is estimable from the predatory actor's revealed deployment decisions. In the Môle affair, the US revealed-preference estimate of $F^*$---the White Squadron deployment under Admiral Gherardi---visibly exceeded the coercion-legitimacy frontier $F^L$, and Firmin's invocation of $\mathcal{L}$ exposed the resulting Force-Validity Inversion \cite{firmin_legacy, manigat}.
```

Firmin's correspondence supports Gherardi's mission, the demand for full powers, the presence of two American squadrons, Firmin's sovereignty objection, and his refusal to negotiate under the visible pressure. The variables, threshold comparison, and “Force-Validity Inversion” are authorial Tier-3 inferences from those events.

Disposition: **covered by an existing entry for the historical inputs**.

Source and locator: `firmin1905`, pp. 497--500.

Artifact contact: I read printed pp. 497--500 from full-resolution Internet Archive images `n514` through `n517` for item `mrooseveltprsi00firm`.

Provenance tier: **primary historical account/documentation**. The equation is an **authorial analytic construct** and is not a proposition stated by the source.

Exact replacement:

```tex
\cite[497--500]{firmin1905}
```

### Line 12685 — Interface Optimizer and the 1891/1902 boundary conditions

Current command: `\cite{firmin_legacy, manigat}`

Manuscript sentence containing the citation:

```tex
This equation is classified as Tier~3 (ordinal/structural); the non-existence statement is a structural infeasibility condition. It is validated by the documented outcome of the Môle Saint-Nicolas affair, in which the extraction attempt was abandoned ($\mathcal{E} \to 0$) after Firmin's $\mathcal{L}$-invocation, and by the complementary boundary condition demonstrated by the SMS \textit{Panther} intervention of 1902, in which $E_{\text{global}}$ chose the alternative losing outcome---abandoning $\mathcal{L}$ entirely (see Equation~\ref{eq:13.11-legitimation-abandonment-condition}) \cite{firmin_legacy, manigat}.
```

Firmin's correspondence supports the unsuccessful end of the Môle negotiations after his full-powers, sovereignty, and coercion objections. FRUS supports the German intervention and destruction of the `Crête-à-Pierrot` in 1902. The extraction variable, boundary-condition pairing, and cost interpretation are authorial Tier-3 inferences.

Disposition: **covered by existing entries for both historical inputs**.

Sources and locators: `firmin1905`, pp. 497--501; `frus1902haiti`, pp. 657--662.

Artifact contact: I read printed pp. 497--501 from the Internet Archive page images for `mrooseveltprsi00firm`. I opened the official FRUS document 653 and read pp. 657--662. The 1902 verification follows the artifact record in [killick-leger-1907-haitian-account.md](killick-leger-1907-haitian-account.md) and the independent reviews, with the official document re-opened for this report.

Provenance tier: **primary** for both sources. The equation is an **authorial analytic construct**.

Exact replacement:

```tex
\cite[497--501]{firmin1905}\cite[657--662]{frus1902haiti}
```

### Line 12711 — Claimed infinite leverage from a zero-resource denominator

Current command: `\cite{firmin_legacy, manigat}`

Manuscript sentence:

```tex
The Môle affair documented above yields $\Lambda_{\text{M\^{o}le}} \to \infty$ (zero-resource denominator: Haiti's only investment is $\mathcal{L}$-knowledge) \cite{firmin_legacy, manigat}.
```

Firmin and Manigat document a successful diplomatic refusal. They do not establish that Haiti invested zero resources, that its only investment was knowledge of the legitimation rules, or that a denominator in the manuscript's leverage function was zero. Firmin's own pages describe ministerial correspondence and a crisis involving deployed naval forces; they do not provide a resource accounting from which an infinite ratio can be calculated.

Disposition: **NO SOURCE FOUND** for the sentence's empirical parameterization.

Artifact contact: I read `firmin1905`, pp. 497--501, from Internet Archive images `n514`--`n518`, and `manigat`, pp. 20--21, from rendered images of `Sources/antenorfirminles00mani.pdf`. Neither artifact states or quantifies the claimed denominator. The earlier [firmin-citation-repair.md](firmin-citation-repair.md) proposed a citation-only substitution here, but it did not identify artifact language supporting the zero-resource premise.

Provenance tier: the historical episode is covered by **primary** and **scholarly secondary** sources; the zero-resource denominator is **unsourced**.

Recommended cut: remove the whole sentence, including its citation:

```tex
The Môle affair documented above yields $\Lambda_{\text{M\^{o}le}} \to \infty$ (zero-resource denominator: Haiti's only investment is $\mathcal{L}$-knowledge) \cite{firmin_legacy, manigat}.
```

What survives: the paragraph's subsequent general discussion of the scaling parameter survives. Any later use of the Môle value as a calibrated observation requires either a resource denominator defined by authorial stipulation or actual resource evidence. This report found neither.

Exact replacement: **none; cut the cited sentence**.

### Line 12717 — Legitimation Abandonment Threshold

Current command: `\cite{firmin_legacy, rodney, acemoglu_robinson}`

Manuscript sentence containing the citation:

```tex
This equation is classified as Tier~3 (ordinal/structural); the abandonment condition is a comparative inequality between two incommensurable costs whose sign can be inferred from $E_{\text{global}}$'s revealed behavior. It is validated by four documented cases in which the dominant actor accepted measurable material or reputational costs rather than preserve $\mathcal{L}$: the SMS Panther intervention (German diplomatic isolation and the establishment of a US intervention precedent); the 1953 Iran coup (the long-run cost of Iranian anti-Americanism); the 1973 Chile coup (the long-run cost of delegitimating US democracy promotion); and the 2003 Iraq invasion (the long-run cost of coalition fracture and regional destabilization) \cite{firmin_legacy, rodney, acemoglu_robinson}.
```

The remaining fabricated key carries only the 1902 case in this multi-case citation. FRUS documents the German action and the immediate diplomatic record. The comparative cost inequality and the long-run interpretation are authorial Tier-3 analysis. The fit of `rodney` and `acemoglu_robinson` to the later cases is outside this narrow `firmin_legacy` audit; those existing citations remain unchanged.

Disposition: **covered by an existing entry for the 1902 historical input**.

Source and locator: `frus1902haiti`, pp. 657--662.

Artifact contact: I opened official FRUS document 653 and read pp. 657--662. Page 657 documents the `Panther` action; pp. 658--662 preserve the Haitian and American diplomatic positions. The report does not claim that FRUS itself states the manuscript's later reputational-cost inference.

Provenance tier: FRUS is **primary/contemporaneous diplomatic documentation**. The inequality and cost comparison are **authorial analytic constructs**.

Exact replacement:

```tex
\cite[657--662]{frus1902haiti}\cite{rodney, acemoglu_robinson}
```

### Line 12755 — Firmin's 1885 framework and extraction architecture

Current command: `\cite{firmin_legacy, manigat}`

Manuscript sentence:

```tex
The Môle Saint-Nicolas gambit and the Firminist Revolt constituted the operational expressions of a theoretical framework Firmin had already formalized in 1885: the first complete, empirically grounded model of how Western racial hierarchies functioned as global extraction architectures \cite{firmin_legacy, manigat}.
```

Firmin's book supplies extensive empirical argument and links racial hierarchy to exploitation, European domination, colonization, privilege, oligarchy, and caste. Holley independently reads Firmin's project as an analysis of colonialism combining economic exploitation and discursive domination. Manigat links Firmin's thought and political action and discusses the Môle and 1902 episodes. These artifacts support the interpretive synthesis that the political episodes expressed the 1885 framework.

Disposition: **covered by existing entries after a limited cut**.

Sources and locators: `manigat`, pp. 7 and 20--21; `firmin1885`, printed folios 147, 204, 566--570, and 645; `holley2024`, p. 304.

Artifact contact: I rendered and read printed pp. 7 and 20--21 from `Sources/antenorfirminles00mani.pdf`; printed folios 147, 204, 566--570, and 645 from `Sources/Firmin_De_l_egalite_des_races_humaines_1885.pdf`; and p. 304 from `Sources/holley2024.pdf`. The Firmin page selections agree with the image-verified folios in [firmin-1885-mining-pass.md](firmin-1885-mining-pass.md), [firmin-1885-framework-pass.md](firmin-1885-framework-pass.md), and [firmin-folio-crosscheck.md](firmin-folio-crosscheck.md).

Provenance tiers: Firmin is **primary**; Manigat is **scholarly secondary**; Holley is **peer-reviewed scholarly secondary**.

No opened artifact establishes the comparative priority claim “the first complete.” Recommend cutting exactly `the first complete, ` and using `an` before the surviving phrase for grammar. The supported remainder reads “an empirically grounded model of how Western racial hierarchies functioned as global extraction architectures.”

Exact replacement after that limited cut:

```tex
\cite[7, 20--21]{manigat}\cite[147, 204, 566--570, 645]{firmin1885}\cite[304]{holley2024}
```

### Line 12757 — The 1893 La Fraternité serialization

Current command: `\cite{firmin_legacy}`

Manuscript sentence:

```tex
In 1893, seeking to break the isolation of his intervention from the French intellectual establishment, Firmin serialized an abridged second edition of \textit{De l'égalité des races humaines} across forty-two issues of \textit{La Fraternité}, a Paris-based diaspora journal dedicated explicitly to ``the interests of Haiti and the black race'' \cite{firmin_legacy}.
```

Holley documents the 1893 edited and abridged second edition across 42 issues and quotes the journal's stated dedication to the interests of Haiti and the Black race. Holley's surrounding analysis identifies the diaspora counter-public and its relation to Firmin's exclusion from the French institutional audience.

Disposition: **covered by an existing entry**.

Source and locator: `holley2024`, p. 314.

Artifact contact: I opened `Sources/holley2024.pdf`, DOI `10.1017/S0003055423000126`, rendered p. 314 at 165 dpi, and read the image. This confirms the artifact finding previously recorded in [firmin-citation-repair.md](firmin-citation-repair.md).

Provenance tier: **peer-reviewed scholarly secondary**.

Exact replacement:

```tex
\cite[314]{holley2024}
```

### Line 12763 — Firmin and Du Bois on race as a partition

Current command: `\cite{firmin_legacy}`

Manuscript sentence:

```tex
Firmin's framework preceded Du Bois's by fifteen years. Both had identified the same structural variable---race as a \textbf{managed partition boundary} used to divide populations whose material interests otherwise aligned \cite{firmin_legacy}.
```

The fifteen-year interval runs from Firmin's 1885 book to the 1900 Pan-African Conference appeal in which the color-line formulation appeared. Firmin's preface says the inequality doctrine creates antagonism among elements of the Haitian population; folio 645 links inequality to privilege, a small governing nucleus, oligarchy, and caste. Holley describes Firmin's counter-public and anticolonial solidarity framework. “Managed partition boundary” is the manuscript's formal synthesis rather than source language.

Disposition: **covered by existing entries**.

Sources and locators: `firmin1885`, Preface p. xiv and printed folio 645; `adisherwood2003`, p. 48; `holley2024`, p. 314.

Artifact contact: I rendered PDF p. 16 of `Sources/Firmin_De_l_egalite_des_races_humaines_1885.pdf` and read printed Preface p. xiv; I also rendered and read printed folio 645. I rendered PDF p. 62 of `Sources/adi_sherwood.pdf` and read the printed p. 48 page image, which states that the color-line sentence first appeared in the 1900 conference appeal. I rendered and read Holley p. 314. These checks confirm the chronology and source division recorded in [firmin-corrections-7-to-11.md](firmin-corrections-7-to-11.md).

Provenance tiers: Firmin is **primary**; Adi and Sherwood are **scholarly secondary**; Holley is **peer-reviewed scholarly secondary**.

Exact replacement:

```tex
\cite[Preface, p.~xiv; p.~645]{firmin1885}\cite[48]{adisherwood2003}\cite[314]{holley2024}
```

## Line-by-line replacement table

| Line | Current command | Exact replacement command | Disposition |
|---:|---|---|---|
| 633 | `\cite{firmin_legacy}` | `\cite[204, 566--570]{firmin1885}` | Covered by existing primary source |
| 12607 | `\cite{firmin_legacy, manigat}` | `\cite[155]{fajardofernandez2020}\cite[20--21]{manigat}\cite[497--501]{firmin1905}` | New scholarly source for portfolio; existing sources for episode; cut `most sophisticated ` |
| 12619 | `\cite{firmin_legacy}` | `\cite[252--253]{leger1907haiti_en}\cite[657, 661--662]{frus1902haiti}` | Covered by existing secondary and primary sources |
| 12647 | `\cite{firmin_legacy, manigat}` | `\cite[497--501]{firmin1905}\cite[art.~52]{vclt1969}` | Existing primary history plus new primary legal source |
| 12664 | `\cite{firmin_legacy, manigat}` | `\cite[art.~52]{vclt1969}\cite[500]{firmin1905}` | New primary legal source plus existing primary history |
| 12670 | `\cite{firmin_legacy, manigat}` | `\cite[497--500]{firmin1905}` | Historical inputs covered; equation remains authorial |
| 12685 | `\cite{firmin_legacy, manigat}` | `\cite[497--501]{firmin1905}\cite[657--662]{frus1902haiti}` | Both historical inputs covered; equation remains authorial |
| 12711 | `\cite{firmin_legacy, manigat}` | None | **NO SOURCE FOUND**; cut the entire cited sentence |
| 12717 | `\cite{firmin_legacy, rodney, acemoglu_robinson}` | `\cite[657--662]{frus1902haiti}\cite{rodney, acemoglu_robinson}` | 1902 input covered; other existing keys retained |
| 12755 | `\cite{firmin_legacy, manigat}` | `\cite[7, 20--21]{manigat}\cite[147, 204, 566--570, 645]{firmin1885}\cite[304]{holley2024}` | Covered after cutting `the first complete, ` and normalizing the article to `an` |
| 12757 | `\cite{firmin_legacy}` | `\cite[314]{holley2024}` | Covered by existing scholarly source |
| 12763 | `\cite{firmin_legacy}` | `\cite[Preface, p.~xiv; p.~645]{firmin1885}\cite[48]{adisherwood2003}\cite[314]{holley2024}` | Covered; formal partition language remains authorial |

## New BibTeX entries

### Fajardo Fernández et al. 2020

```bibtex
@incollection{fajardofernandez2020,
  author    = {Fajardo Fern{\'a}ndez, Yuleisy and La{\"e}thier, Maud and Argyriadis, Kali and Clormeus, Lewis Ampidu},
  title     = {Apr{\`e}s le r{\^e}ve antillais: les d{\'e}clinaisons nationales et pan-nationales de l'identit{\'e} chez Ant{\'e}nor Firmin et Rafael Serra},
  booktitle = {Cuba-Ha{\"i}ti: engager l'anthropologie: anthologie critique et histoire compar{\'e}e (1884--1959)},
  editor    = {Argyriadis, Kali and Gobin, E. and La{\"e}thier, Maud and N{\'u}{\~n}ez Gonz{\'a}lez, N. and Picard Byron, J.},
  publisher = {CIDIHCA France},
  address   = {Paris},
  year      = {2020},
  pages     = {137--168},
  isbn      = {9782491035099},
  url       = {https://www.documentation.ird.fr/hor/fdi:010081203},
  urldate   = {2026-09-02},
  note      = {IRD identifier fdi:010081203}
}
```

Existence and content confirmation: I opened the IRD catalogue record `fdi:010081203`, whose metadata identifies the chapter, authors, book, page range, publisher, year, and ISBN. I downloaded the linked full-text PDF from IRD, rendered PDF p. 19, and read printed p. 155. That page gives Firmin's combined Finance, Commerce, and External Relations portfolio for 1889--1891 and states that he prevented the acquisition of the Môle Saint-Nicolas by the United States.

Provenance tier: **scholarly secondary**.

### Vienna Convention on the Law of Treaties

```bibtex
@misc{vclt1969,
  author    = {{United Nations}},
  title     = {Vienna Convention on the Law of Treaties},
  year      = {1969},
  date      = {1969-05-23},
  type      = {Multilateral treaty},
  series    = {United Nations Treaty Series},
  volume    = {1155},
  number    = {18232},
  url       = {https://legal.un.org/ilc/texts/instruments/english/conventions/1_1_1969.pdf},
  urldate   = {2026-09-02},
  note      = {Concluded at Vienna on 23 May 1969; 1155 UNTS 331; Article 52}
}
```

Existence and content confirmation: I opened the official United Nations PDF, rendered PDF p. 18, and read Article 52 on the image. It states the voidness rule for a treaty procured by threat or use of force in violation of the principles embodied in the United Nations Charter. I also opened the UN Treaty Collection registration page, which records no. 18232, Vienna, 23 May 1969, and 1155 UNTS 331.

Provenance tier: **primary legal instrument**.

## Delete/keep verdict for `firmin_legacy`

**Yes. `firmin_legacy` can be deleted from `Paper/references.bib` after the specified manuscript work is applied.** Eleven live commands receive real-source replacements. The twelfth occurrence, line 12711, disappears with the unsupported sentence. A fresh `grep -n 'firmin_legacy' Paper/The_Original_Power.tex` should then return no output before the bibliography entry is removed. This report does not perform those edits.

## URLs, identifiers, and local artifacts opened

### Online artifacts

1. Internet Archive identifier `Antnor1885Bnf30437548r` — Anténor Firmin, *De l'égalité des races humaines* (1885).
2. Internet Archive identifier `mrooseveltprsi00firm` — Anténor Firmin, *M. Roosevelt, président des États-Unis et la République d'Haïti* (1905).
3. `https://archive.org/download/mrooseveltprsi00firm/page/n514.jpg` — printed p. 497.
4. `https://archive.org/download/mrooseveltprsi00firm/page/n515.jpg` — printed p. 498.
5. `https://archive.org/download/mrooseveltprsi00firm/page/n516.jpg` — printed p. 499.
6. `https://archive.org/download/mrooseveltprsi00firm/page/n517.jpg` — printed p. 500.
7. `https://archive.org/download/mrooseveltprsi00firm/page/n518.jpg` — printed p. 501.
8. Internet Archive identifier `haitiherhistoryh00lguoft` — Jacques Nicolas Léger, *Haiti: Her History and Her Detractors* (1907).
9. `https://archive.org/download/haitiherhistoryh00lguoft/page/n270.jpg` — facing-page image checked while resolving the scan pagination.
10. `https://archive.org/download/haitiherhistoryh00lguoft/page/n271.jpg` — blank/facing page checked while resolving the scan pagination.
11. `https://archive.org/download/haitiherhistoryh00lguoft/page/n274.jpg` — printed p. 251.
12. `https://archive.org/download/haitiherhistoryh00lguoft/page/n275.jpg` — printed p. 252.
13. `https://archive.org/download/haitiherhistoryh00lguoft/page/n278.jpg` — printed p. 253.
14. `https://archive.org/download/haitiherhistoryh00lguoft/page/n279.jpg` — printed p. 254.
15. `https://history.state.gov/historicaldocuments/frus1902/ch191` — FRUS 1902 chapter “Revolution in Haiti.”
16. `https://history.state.gov/historicaldocuments/frus1902/d653` — FRUS document 653, pp. 656--662.
17. `https://www.documentation.ird.fr/hor/fdi%3A010081203` — IRD catalogue record `fdi:010081203`.
18. `https://horizon.documentation.ird.fr/exl-doc/pleins_textes/2025-07/010081203.pdf` — full text of Fajardo Fernández et al. (2020).
19. ISBN `978-2-491-03509-9` — book identifier confirmed in the IRD record.
20. `https://legal.un.org/ilc/texts/instruments/english/conventions/1_1_1969.pdf` — official United Nations text of the Vienna Convention.
21. `https://treaties.un.org/pages/showdetails.aspx?objid=080000028003902f` — UN Treaty Collection registration record.
22. UN Treaty Series registration no. `18232`, `1155 UNTS 331`.
23. DOI `10.1017/S0003055423000126` — Jared Holley, “Racial Equality and Anticolonial Solidarity.”
24. ISBN `9780415173537` — Adi and Sherwood, *Pan-African History*.

### Local source artifacts

1. `Sources/Firmin_De_l_egalite_des_races_humaines_1885.pdf` — rendered PDF pp. 16, 168, 225, 587--591, and 666; read printed Preface p. xiv and folios 147, 204, 566--570, and 645.
2. `Sources/antenorfirminles00mani.pdf` — rendered and read printed pp. 7, 20--21, and 23.
3. `Sources/holley2024.pdf` — rendered and read article pp. 304 and 314.
4. `Sources/adi_sherwood.pdf` — rendered PDF p. 62 and read printed p. 48.
5. `Sources/fluehr_lobban.html` — opened for cross-reference; it is not needed in the final replacements.
6. `Sources/23-11_drouin-hans.pdf` — opened for cross-reference; it is not needed in the final replacements.
7. `Sources/firmin-citation-repair.md`.
8. `Sources/killick-leger-1907-haitian-account.md`.
9. `Sources/facts-edit-review.md`.
10. `Sources/facts-edit-review-round2.md`.
11. `Sources/facts-edit-review-round3.md`.
12. `Sources/firmin-folio-crosscheck.md`.
13. `Sources/firmin-corrections-7-to-11.md`.
14. `Sources/firmin-1885-mining-pass.md`.
15. `Sources/firmin-1885-framework-pass.md`.
