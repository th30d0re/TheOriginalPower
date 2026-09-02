# Firmin citation repair

Model: GPT-5 Codex  
Date: 2026-09-02  
Scope: citation research only. No manuscript or bibliography file was edited.

## Result

The anonymous <code>firmin_legacy</code> entry should carry none of the audited claims. Ten verified sources can replace it. Four claims can cite Firmin's 1885 book directly. The historical claims divide between supported statements, statements that require factual correction, and admitted gaps that cannot be repaired by changing a citation alone.

A literal search finds 21 <code>\cite{...firmin_legacy...}</code> occurrences, although the established mining split counts 20 claims: line 12759 contains two occurrences, while line 12763 contains two claims behind one occurrence. The replacement map below covers all 21 occurrences.

The material factual corrections are:

1. Firmin's surviving correspondence says that Gherardi supplied details on 12 February 1891 and agreed that day to seek full powers. It does not support 20 February as the date of that request.
2. Firmin sent the refusal on 22 April. Douglass and Gherardi acknowledged it on 24 April, and Firmin confirmed that afternoon that negotiations were closed.
3. Douglass resigned on 30 July 1891, not in August.
4. The vetted primary accounts support Killick sending the crew ashore, lighting a fuse to the magazine, sitting on deck, and awaiting the explosion. They do not support his wrapping himself in the flag, sitting on the bow, or dying with exactly four crew members.
5. The 1802 Crête-à-Pierrot garrison threatened destruction, then broke through the besieging lines and escaped. It did not self-detonate.
6. U.S. State Department legal adviser John Bassett Moore, not German advisers, called the German sinking “illegal and excessive.”
7. Henry Sylvester Williams convened the 1900 conference. Du Bois attended and chaired the committee that drafted “To the Nations of the World.” The verified sources do not identify Firmin as a main organizer or Du Bois as author of an “official report.”
8. The “fatal to both…” language is Du Bois's, not Firmin's.
9. Du Bois used the color-line sentence in the published 1900 conference appeal. The interval from Firmin's 1885 book is fifteen years, not eighteen.
10. Nkrumah named Firmin among contributors “in the New World.” “New World pioneer” is Fluehr-Lobban's characterization, not a verified quotation from Nkrumah.
11. The evidence supports long neglect and exclusion from the canon. It does not establish a coordinated twentieth-century “institutional suppression.”

## Verified source set and complete BibTeX

### 1. Firmin, 1885

Identifier: Internet Archive <code>Antnor1885Bnf30437548r</code>; ARK <code>ark:/13960/t6vx1zb7b</code>.

Verification performed: fetched <https://archive.org/metadata/Antnor1885Bnf30437548r> successfully and read the BnF scan at <https://archive.org/details/Antnor1885Bnf30437548r>. The cited printed folios were checked against the page images: 147, 204, 566–570, and 645; the Preface passage was checked at PDF page 16.

<pre>
@book{firmin1885,
  author       = {Firmin, Anténor},
  title        = {De l'égalité des races humaines: anthropologie positive},
  publisher    = {Librairie Cotillon, F. Pichon},
  address      = {Paris},
  year         = {1885},
  pagetotal    = {662},
  url          = {https://archive.org/details/Antnor1885Bnf30437548r},
  note         = {Public-domain BnF scan; archive.org identifier Antnor1885Bnf30437548r},
}
</pre>

### 2. Firmin, 1905

Identifiers: Internet Archive <code>mrooseveltprsi00firm</code>; LCCN <code>06000026</code>; OCLC <code>2080321</code>.

Verification performed: fetched <https://archive.org/metadata/mrooseveltprsi00firm> successfully; read the Open Library catalogue record at <https://openlibrary.org/books/OL24760709M/M._Roosevelt_pr%C3%A9sident_des_%C3%89tats-Unis_et_la_R%C3%A9publique_d%27Ha%C3%AFti>; and read the scanned Appendix, printed pp. 497–501. Those pages reproduce the 21, 22, and 24 April correspondence and Firmin's statement that closure was confirmed on 24 April.

<pre>
@book{firmin1905,
  author       = {Firmin, Anténor},
  title        = {M. Roosevelt, président des États-Unis et la République d'Haïti},
  publisher    = {Hamilton Bank Note Engraving and Printing Company; F. Pichon et Durand-Auzias},
  address      = {New York and Paris},
  year         = {1905},
  pages        = {x, 501},
  url          = {https://archive.org/details/mrooseveltprsi00firm},
  note         = {LCCN 06000026; OCLC 2080321; archive.org identifier mrooseveltprsi00firm},
}
</pre>

### 3. Douglass, 1892

Identifier: Internet Archive <code>lifeandtimesoffr00dougiala</code>.

Verification performed: fetched <https://archive.org/metadata/lifeandtimesoffr00dougiala> successfully; read the 1892 title-page record at <https://en.wikisource.org/wiki/Life_and_Times_of_Frederick_Douglass_(1892)>; and read chapters XII–XIII at <https://en.wikisource.org/wiki/Life_and_Times_of_Frederick_Douglass_(1892)/Chapter_53> and <https://en.wikisource.org/wiki/Life_and_Times_of_Frederick_Douglass_(1892)/Chapter_54>. Chapter XIII records Firmin's credentials demand, the appeal to Washington, the two-month delay, the seven warships, and the coercive effect of the squadron.

<pre>
@book{douglass1892,
  author       = {Douglass, Frederick},
  title        = {Life and Times of Frederick Douglass, Written by Himself},
  edition      = {New revised edition},
  publisher    = {De Wolfe \& Fiske Co.},
  address      = {Boston},
  year         = {1892},
  url          = {https://archive.org/details/lifeandtimesoffr00dougiala},
  note         = {Archive.org identifier lifeandtimesoffr00dougiala; chapters XII--XIII reproduce the author's 1891 North American Review account of the Môle negotiations},
}
</pre>

### 4. Léger, 1907

Identifier: Internet Archive <code>haitiherhistoryh00lguoft</code>.

Verification performed: fetched <https://archive.org/metadata/haitiherhistoryh00lguoft> successfully; read the title page and printed pp. 116–117, 245–246, and 252–254 in the scan at <https://archive.org/details/haitiherhistoryh00lguoft>. Léger was a Haitian diplomat. His account documents the Môle mission, Firmin's credentials demand, the 1802 breakout, Killick's support for Firmin, the Markomannia seizure, the Panther demand, the fuse, Killick seated on deck with a cigar, the loss of Firmin's naval position, Firmin's departure, and Alexis's election.

<pre>
@book{leger1907,
  author       = {Léger, Jacques Nicolas},
  title        = {Haiti: Her History and Her Detractors},
  publisher    = {The Neale Publishing Company},
  address      = {New York and Washington},
  year         = {1907},
  url          = {https://archive.org/details/haitiherhistoryh00lguoft},
  note         = {Archive.org identifier haitiherhistoryh00lguoft},
}
</pre>

### 5. Official U.S. diplomatic record, 1902

Stable URL: <https://history.state.gov/historicaldocuments/frus1902/d653>.

Verification performed: fetched the Office of the Historian volume record at <https://history.state.gov/historicaldocuments/frus1902>, which gives the Washington, Government Printing Office, 1903 imprint, and read the Haiti documents at <https://history.state.gov/historicaldocuments/frus1902/ch191> and document 653. The enclosures include Killick's contraband report, Firmin's proclamation, Powell's report, and witness accounts of the explosion and Panther fire.

<pre>
@book{frus1902haiti,
  author       = {{United States Department of State}},
  title        = {Papers Relating to the Foreign Relations of the United States, With the Annual Message of the President Transmitted to Congress December 2, 1902},
  publisher    = {United States Government Printing Office},
  address      = {Washington},
  year         = {1903},
  pages        = {592--662},
  url          = {https://history.state.gov/historicaldocuments/frus1902/ch191},
  note         = {Section ``Revolution in Haiti,'' documents 592--653},
}
</pre>

### 6. Mitchell, 1996

Identifier: DOI <code>10.1111/j.1467-7709.1996.tb00622.x</code>.

Verification performed: resolved <https://doi.org/10.1111/j.1467-7709.1996.tb00622.x> to the Oxford Academic article record and fetched the issue catalogue at <https://academic.oup.com/dh/issue/20/2>. The indexed article text at p. 202 identifies Moore as the State Department legal adviser, gives “illegal and excessive,” states that the judgment bestirred neither the Department nor the press, and reproduces the New York Times “housecleaning” sentence.

<pre>
@article{mitchell1996,
  author       = {Mitchell, Nancy},
  title        = {The Height of the German Challenge: The Venezuela Blockade, 1902--3},
  journal      = {Diplomatic History},
  volume       = {20},
  number       = {2},
  year         = {1996},
  pages        = {185--210},
  doi          = {10.1111/j.1467-7709.1996.tb00622.x},
  url          = {https://doi.org/10.1111/j.1467-7709.1996.tb00622.x},
}
</pre>

### 7. Holley, 2024

Identifier: DOI <code>10.1017/S0003055423000126</code>.

Verification performed: resolved the DOI to Cambridge Core and fetched the full PDF from <https://www.cambridge.org/core/services/aop-cambridge-core/content/view/0B6142E5D38F8A1196F52C05CAAEE8CA/S0003055423000126a.pdf/racial_equality_and_anticolonial_solidarity_antenor_firmins_global_haitian_liberalism.pdf>. Pages 314–315 document the forty-two-issue serialization, Firmin's representation of Haiti at the 1900 conference, and Du Bois's authorship of the “fatal” sentence.

<pre>
@article{holley2024,
  author       = {Holley, Jared},
  title        = {Racial Equality and Anticolonial Solidarity: Anténor Firmin's Global Haitian Liberalism},
  journal      = {American Political Science Review},
  volume       = {118},
  number       = {1},
  year         = {2024},
  pages        = {304--317},
  doi          = {10.1017/S0003055423000126},
  url          = {https://doi.org/10.1017/S0003055423000126},
}
</pre>

### 8. Fluehr-Lobban, 2005

Identifier: DOI <code>10.4000/gradhiva.302</code>.

Verification performed: resolved <https://doi.org/10.4000/gradhiva.302> to OpenEdition and fetched the journal PDF at <https://journals.openedition.org/gradhiva/pdf/302>. Pages 95–96 document the book's neglect and the Société's failure to review it; p. 102 reproduces Nkrumah's naming of Firmin among New World contributors. This is the real Gradhiva article that the anonymous entry appears to have displaced.

<pre>
@article{fluehrlobban2005,
  author       = {Fluehr-Lobban, Carolyn},
  title        = {Anténor Firmin and Haiti's Contribution to Anthropology},
  journal      = {Gradhiva},
  number       = {1},
  year         = {2005},
  pages        = {95--108},
  doi          = {10.4000/gradhiva.302},
  url          = {https://doi.org/10.4000/gradhiva.302},
}
</pre>

### 9. Adi and Sherwood, 2003

Identifiers: ISBN <code>9780415173537</code>; OCLC <code>50243646</code>.

Verification performed: fetched the WorldCat catalogue record at <https://search.worldcat.org/title/Pan-African-history-%3A-political-figures-from-Africa-and-the-Diaspora-since-1787/oclc/50243646>, the Routledge record at <https://www.routledge.com/Pan-African-History-Political-Figures-from-Africa-and-the-Diaspora-sin/Adi-Sherwood/p/book/9780415173520>, and the scan at <https://sahistory.org.za/sites/default/files/archive-files/hakim_adi_pan-african_history_political_figuresbook4you.org_.pdf>. Page 48 states that Du Bois attended and chaired the committee drafting the appeal; pp. 190–194 identify Henry Sylvester Williams as convener.

<pre>
@book{adi_sherwood2003,
  author       = {Adi, Hakim and Sherwood, Marika},
  title        = {Pan-African History: Political Figures from Africa and the Diaspora since 1787},
  publisher    = {Routledge},
  address      = {London},
  year         = {2003},
  isbn         = {9780415173537},
  url          = {https://search.worldcat.org/title/Pan-African-history-%3A-political-figures-from-Africa-and-the-Diaspora-since-1787/oclc/50243646},
  note         = {OCLC 50243646},
}
</pre>

### 10. Douglass resignation chronology

Stable URL: <https://www.nps.gov/frdo/learn/kidsyouth/chronology.htm>.

Verification performed: fetched the National Park Service chronology. It dates Douglass's resignation to 30 July 1891 and connects it to the Môle maneuvering.

<pre>
@online{nps_douglass_chronology,
  author       = {{National Park Service}},
  title        = {Chronology of the Life of Frederick Douglass},
  url          = {https://www.nps.gov/frdo/learn/kidsyouth/chronology.htm},
  urldate      = {2026-09-02},
}
</pre>

## Twenty-claim audit

### Group A: four claims that can move to Firmin 1885

1. **L633 — attack on pseudo-scientific hierarchy as an early counter-signal.** Supported. Printed folio 204 explicitly calls racial inequality “anti-philosophical and pseudo-scientific” and ties it to exploitation; folios 566–570 trace its scientific legitimation. Exact replacement: <code>\cite[204, 566--570]{firmin1885}</code>.

2. **L12755 — empirically grounded model of racial hierarchy as extraction architecture.** Substantially supported as an interpretive synthesis. Folios 566–570 connect racial doctrine to European domination, material appetite, colonization, and scientific propaganda; folio 645 derives a small ruling nucleus and caste order. The phrase “rehabilitation of the Black race” occurs at printed folio 147, not 144. Exact replacement: <code>\cite[147, 204, 566--570, 645]{firmin1885}</code>.

3. **L12763 — race as a managed partition boundary.** Supported as an interpretive mapping. Preface PDF p. 16 says the doctrine creates harmful antagonism among elements of the Haitian people; folio 645 connects equality to ending privilege and inequality to caste. Exact source form: <code>\cite[Preface, PDF p.~16; p.~645]{firmin1885}</code>.

4. **L12763 — Firmin precedes Du Bois.** Firmin's framework is supported at folios 561–581 and 645. The stated eighteen-year interval is doubtful. Adi and Sherwood p. 48 report that the color-line sentence first appeared in Du Bois's 1900 conference appeal, giving a fifteen-year interval. A citation-only change cannot support the current “not until 1903” wording. After correcting the chronology, use <code>\cite[561--581, 645]{firmin1885}\cite[48]{adi_sherwood2003}</code>.

### Group B: sixteen historical claims

5. **L12607–12609 — Gherardi mission, Firmin's office, 28 January conference, and U.S. naval pressure.** Léger, pp. 245–246, Douglass, chapter XII, and Firmin, pp. 497–501 support the episode and identify Firmin as Secretary of State for External Relations. They do not independently establish the full combined Finance, Commerce, and External Relations portfolio. Léger says Gherardi failed to secure Douglass's cooperation; Douglass records that he nevertheless participated in the conference. The “shouted” description is unsourced; Douglass reports Gherardi's forceful claim that Haiti was bound.

6. **L12611 — Firmin demanded Gherardi's commission and instructions.** Supported directly by Douglass, chapter XIII. Firmin read the papers, pronounced them insufficient, and argued that they could not bind the United States. Use <code>\cite[chap.~XIII]{douglass1892}\cite[498--499]{firmin1905}</code>.

7. **L12611 and L12658 — Gherardi wrote Washington on 20 February 1891.** **NO SOURCE FOUND for the date in a vetted source.** Firmin p. 498 says Gherardi supplied details on 12 February and agreed that day to write for full powers. Douglass records preparation of a telegram but supplies no date. Searches performed: <code>"Gherardi February 20 1891 credentials Firmin"</code>, <code>"February 20, 1891" Gherardi Haiti credentials</code>, and the French equivalent. Only tertiary reproductions supplied 20 February. The date must be removed or independently established from an archival dispatch.

8. **L12613 — refusal, coercive squadron, and closure on 24 April.** Supported with a date correction. Firmin's refusal is dated 22 April; pp. 499–500 cite the two squadrons and appearance of foreign pressure. Douglass and Gherardi acknowledged the refusal on 24 April; Firmin says he confirmed closure that afternoon. Douglass resigned 30 July, not in August. Use <code>\cite[499--501]{firmin1905}\cite{nps_douglass_chronology}</code> after those corrections.

9. **L12619 — Killick supported Firmin and used the Crête-à-Pierrot in the civil war.** Supported by Léger pp. 252–253 and the official diplomatic record pp. 631–662. Léger says Killick espoused Firmin's cause and followed him to Gonaïves. Use <code>\cite[631--662]{frus1902haiti}\cite[252--254]{leger1907}</code>.

10. **L12619 — Markomannia seizure, contraband theory, and Panther dispatch.** Supported with qualification. Killick's report in FRUS calls the arms contraband and describes the seizure; the United States rejected the provisional government's effort to classify Crête-à-Pierrot as a pirate. The legality remained contested, so “legally defensible” should be presented as a position supported by the contemporary record, not a settled judgment. Same replacement as claim 9.

11. **L12623 — crew evacuation and Killick's self-detonation.** The core is supported. Léger p. 253 says Killick sent his crew ashore, lit a fuse to the magazine, sat on deck, lit a cigar, and awaited the explosion. FRUS pp. 657–661 contains differing early casualty accounts. **NO SOURCE FOUND in the vetted sources for wrapping himself in the Haitian flag, sitting on the bow, or exactly four crew deaths.** Current wording cannot be rescued by citation alone. After factual correction, use <code>\cite[253]{leger1907}\cite[657--661]{frus1902haiti}</code>.

12. **L12629 — 1802 Crête-à-Pierrot garrison as a self-detonation precedent.** The stated analogy is materially inaccurate. Léger pp. 116–117 says Dessalines threatened to blow the powder rooms if the defenders faltered; the garrison later refused surrender, abandoned the fort at night, and broke through the French lines. There was no self-detonation. **NO SOURCE FOUND for the precedent as currently formulated.** A revised claim about refusal to surrender and breakout can cite <code>\cite[116--117, 253]{leger1907}</code>.

13. **L12631 — “illegal and excessive,” State Department response, and New York Times response.** Supported only after correcting attribution. Mitchell p. 202 identifies U.S. State Department legal adviser John Bassett Moore as the author of the judgment. She says it bestirred neither the State Department nor the press and gives the “housecleaning” sentence. This supports documented non-response; “tacit endorsement” is an interpretation, not an official position established by the source. No German-adviser source was found. Use <code>\cite[202]{mitchell1996}</code>.

14. **L12631 — revolt collapsed, Alexis became president, Firmin entered exile.** Léger pp. 253–254 says Killick's death and the ship's loss left Firmin's cause without a chance, Firmin sailed for Inagua on 15 October, and Alexis was elected 21 December. “Permanent exile” is inaccurate for the 1902 departure because Firmin later returned to Haitian politics. Use <code>\cite[253--254]{leger1907}</code>.

15. **L12757 — 1893 serialization in La Fraternité.** Supported. Holley p. 314 documents an edited, abridged second edition across forty-two issues and quotes the journal's aim of advancing the interests of Haiti and the Black race. The “counter-public” reading is also Holley's explicit analytical framing. Use <code>\cite[314]{holley2024}</code>.

16. **L12759 — First Pan-African Conference in London, July 1900, and Firmin's attendance.** Supported. Holley p. 315 says Firmin represented Haiti and was present when Du Bois issued the declaration. Adi and Sherwood document the July conference. Use <code>\cite[315]{holley2024}\cite[48, 190--194]{adi_sherwood2003}</code>.

17. **L12759 — Firmin as main organizer and Du Bois as author of the official report.** **NO SOURCE FOUND for either formulation.** Adi and Sherwood p. 190 identify Henry Sylvester Williams as convener. Their p. 48 says Du Bois attended and chaired the committee that drafted the appeal “To the Nations of the World.” Holley identifies Firmin as Haiti's representative, not as a main organizer. The sentence requires revision before the citations in claim 16 can be used.

18. **L12759 — “fatal to both…” attributed to Firmin.** Incorrect attribution. Holley p. 315 quotes and attributes the language to Du Bois's 1900 address. A citation-only replacement would preserve a false statement. After attribution to Du Bois, use <code>\cite[315]{holley2024}</code>.

19. **L12765 — Nkrumah's 1964 University of Ghana invocation of Firmin.** Supported through Fluehr-Lobban p. 102, which reproduces Nkrumah's sentence naming Firmin and Price-Mars among contributors in the New World, alongside Crummell, Woodson, and Du Bois. “New World pioneer” is Fluehr-Lobban's description immediately before the quotation, not Nkrumah's verified wording. After removing quotation marks or using Nkrumah's actual construction, cite <code>\cite[102]{fluehrlobban2005}</code>.

20. **L12765 — twentieth-century institutional suppression.** The evidence supports neglect, dismissal, disciplinary silencing, non-review by the Société, delayed translation, and relative obscurity: Fluehr-Lobban pp. 95–96. It does not demonstrate a coordinated century-long suppression campaign. The clause saying the Western establishment “produced Firmin's work” is also factually wrong. A defensible wording about institutional neglect and exclusion from the canon can cite <code>\cite[95--96]{fluehrlobban2005}</code>. The stronger current claim has **NO SOURCE FOUND**.

## Exact replacement map for every current occurrence

| Line | Current citation | Exact replacement | Condition |
|---:|---|---|---|
| 633 | <code>\cite{firmin_legacy}</code> | <code>\cite[204, 566--570]{firmin1885}</code> | None |
| 12607 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[245--246]{leger1907}\cite[chap.~XII]{douglass1892}\cite[497--501]{firmin1905}</code> | Verify the combined portfolio separately; reconcile Douglass participation; remove “shouted” |
| 12611 | <code>\cite{firmin_legacy}</code> | <code>\cite[chap.~XIII]{douglass1892}\cite[498--499]{firmin1905}</code> | Replace or remove 20 February |
| 12613 | <code>\cite{firmin_legacy}</code> | <code>\cite[499--501]{firmin1905}\cite{nps_douglass_chronology}</code> | Distinguish 22 April refusal from 24 April closure; change August to 30 July |
| 12619 | <code>\cite{firmin_legacy}</code> | <code>\cite[631--662]{frus1902haiti}\cite[252--254]{leger1907}</code> | Present legality as contested |
| 12623 | <code>\cite{firmin_legacy}</code> | <code>\cite[253]{leger1907}\cite[657--661]{frus1902haiti}</code> | Remove flag-wrapping, bow, and exact four-person claim |
| 12629 | <code>\cite{firmin_legacy}</code> | <code>\cite[116--117, 253]{leger1907}</code> | Replace “self-detonation precedent” with refusal-to-surrender/breakout precedent |
| 12631 | <code>\cite{firmin_legacy}</code> | <code>\cite[202]{mitchell1996}\cite[253--254]{leger1907}</code> | Attribute Moore correctly; characterize U.S. conduct as non-response; change “permanent exile” |
| 12647 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[497--501]{firmin1905}\cite[chap.~XIII]{douglass1892}</code> | None |
| 12658 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[498--499]{firmin1905}\cite[chap.~XIII]{douglass1892}</code> | Replace or remove 20 February |
| 12664 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[499--500]{firmin1905}</code> | Source supports Firmin's coercion objection |
| 12670 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[chap.~XIII]{douglass1892}\cite[499--500]{firmin1905}</code> | None |
| 12685 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[497--501]{firmin1905}\cite[631--662]{frus1902haiti}\cite[202]{mitchell1996}</code> | Correct Moore attribution in connected prose |
| 12711 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[497--501]{firmin1905}</code> | None |
| 12717 | <code>\cite{firmin_legacy, rodney, acemoglu_robinson}</code> | <code>\cite[631--662]{frus1902haiti}\cite[202]{mitchell1996}\cite{rodney, acemoglu_robinson}</code> | Correct Moore attribution |
| 12755 | <code>\cite{firmin_legacy, manigat}</code> | <code>\cite[147, 204, 566--570, 645]{firmin1885}</code> | None |
| 12757 | <code>\cite{firmin_legacy}</code> | <code>\cite[314]{holley2024}</code> | None |
| 12759, first | <code>\cite{firmin_legacy}</code> | <code>\cite[315]{holley2024}\cite[48, 190--194]{adi_sherwood2003}</code> | Correct organizer and Du Bois role |
| 12759, second | <code>\cite{firmin_legacy}</code> | <code>\cite[315]{holley2024}</code> | Attribute the sentence to Du Bois |
| 12763 | <code>\cite{firmin_legacy}</code> | <code>\cite[Preface, PDF p.~16; pp.~561--581, 645]{firmin1885}\cite[48]{adi_sherwood2003}</code> | Change 1903/eighteen years to 1900/fifteen years |
| 12765 | <code>\cite{firmin_legacy}</code> | <code>\cite[95--96, 102]{fluehrlobban2005}</code> | Recast suppression as documented neglect; correct Nkrumah wording |

## Honest gaps and searches

- **20 February 1891:** no verified primary or scholarly source found. The date appears in tertiary web reproductions. Primary searches and Firmin's Appendix point to 12 February for the agreement to seek full powers.
- **Killick wrapped in the flag / sat on the bow / four crew deaths:** no vetted source found. The Haitian contemporary source and FRUS give different, less embellished accounts and inconsistent early casualty totals.
- **1802 self-detonation precedent:** no source found because the event did not occur in the verified Haitian account; the garrison escaped through the lines.
- **Firmin as main organizer of the 1900 conference:** no verified source found. The sources establish attendance and representation of Haiti.
- **Du Bois authored an official report:** no verified source found. His documented role was chairing the committee that drafted the appeal.
- **Coordinated twentieth-century suppression:** no source found. The verified evidence establishes neglect, dismissal, non-review, and delayed recovery.

## Recommended disposition

Delete <code>firmin_legacy</code> after the manuscript is separately corrected and all 21 occurrences are replaced. The real Gradhiva source is Fluehr-Lobban 2005. It is useful for reception history and Nkrumah, but it should not carry the Môle or Crête-à-Pierrot narrative. Firmin 1905, Douglass 1892, Léger 1907, and the official 1902 diplomatic record provide the historical spine; Holley 2024, Mitchell 1996, Adi and Sherwood 2003, and Fluehr-Lobban 2005 supply the modern scholarly checks.
