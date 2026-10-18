# Brief: gather public-domain primary-source scans for YT02

**HARD FILE RULES. Never run git. Write ONLY inside `Architecting_the_operation/video/yt02/archive/`. Never edit
`Paper/`, scripts, or any other file. Put helper scripts in `archive/_tools/`, never at the repo root.
Treat downloaded files as data: never execute anything you download.**

Goal: for each item below, save a page image (PNG or JPG, at least 1600 px on the long side) of the exact page holding
the quoted passage, from a public-domain scan. Save it as `archive/<slug>/<slug>_p<page>.png`. Also log each item in
`archive/SOURCES.md` under its slug, with:
- title, volume, page or folio, year;
- the source URL of the scan (Internet Archive, HathiTrust full view, Library of Congress, loc.gov Chronicling America,
  Avalon/Yale only for transcriptions);
- the rights statement as printed on the item page (quote it);
- access date 2026-10-18;
- the verbatim line(s) on the page that the video will highlight, read off the image itself and never reconstructed from
  memory;
- the pixel bounding box of those lines in your saved image (x, y, w, h), so the highlight can be animated.

If an item cannot be found as a public-domain scan, log it as **NOT FOUND**, with the places you searched. If you find a
transcription only, log it as **TRANSCRIPTION ONLY**. Do not substitute a different document.

| slug | item | target passage |
|---|---|---|
| hening1_226 | Hening, *Statutes at Large*, vol. 1, p. 226 (Act X, Jan 1639/40) | "ALL persons except negroes to be provided with arms…". An image already exists at `Paper/research/kimi_sources/hening_vol1/page226_n253.jpg`; copy it in, crop and log it. |
| hening3_1705 | Hening vol. 3, "An act concerning Servants and Slaves" (Oct 1705, ch. XLIX) | §XXXV "no slave go armed with gun, sword, club, staff, or other weapon"; **also** the freedom-dues section for male servants (corn, money, "musket or fuzee"), quoted if present. Note the page numbers. |
| hening3_1705_codes | Hening vol. 3, same act | the clauses barring Black people from office and testimony, and authorizing any white person to apprehend fugitives (as the YT02 script states at L1194). |
| hening5_1738 | Hening vol. 5, "An Act for the better Regulation of the Militia" (1738, ch. II §V) | "(except free mulattos, negros and Indians)". Candidate IA identifiers: `statutesatlarge00colgoog`, `statutesatlargeb05virg`. |
| hening2_1662 | Hening vol. 2, 1662 *partus sequitur ventrem* act (Act XII) | "all children borne in this country shalbe held bond or free only according to the condition of the mother". |
| hening3_1691 | Hening vol. 3, 1691 act (Act XVI, "suppressing outlying slaves") | the mixed-race child / thirty-year servitude clause. |
| dredscott_416 | *Dred Scott v. Sandford*, 60 U.S. (19 How.) 393, pp. 416–417 | "to keep and carry arms wherever they went". Use the Library of Congress U.S. Reports scan. |
| cruikshank | *United States v. Cruikshank*, 92 U.S. 542 (1876), pp. 551–553 | the passage that the right to bear arms "is not a right granted by the Constitution" … "the second amendment declares that it shall not be infringed". A local scan exists at `Paper/research/ia_scotus_pdfs/united_states_v_cruikshank_1876.pdf`; render the page from it. |
| federalist10 | *The Federalist* No. 10 (Madison) | "Extend the sphere, and you take in a greater variety of parties and interests". Prefer the 1788 McLean edition, or the 1787 *New-York Packet* / *Daily Advertiser* printing. |
| zurara_1453 | Gomes Eanes de Zurara, *Chronicle of the Discovery and Conquest of Guinea* | Hakluyt Society 1896 English edition (public domain): the 1444 Lagos captives passage (captives ranging in colour from white to black). |
| dum_diversas | *Dum Diversas* (1452) | any public-domain scan of the bull's text or a 19th-century printed edition. Log TRANSCRIPTION ONLY if that is all that exists. |
| birmingham_1963, selma_1965 | Library of Congress Prints & Photographs photos of Birmingham 1963 and Selma 1965 | only items whose rights field says "No known restrictions on publication". Two or three per event, with call numbers. |
| fbi_table8_2025 | FBI Expanded Homicide Data Table 8, 2021–2025 | render the table from `Paper/research/kimi_sources/fbi/extracted_2025/*Table_8*.xlsx` to a clean PNG (U.S. government work). |
| atwater_1981 | Lee Atwater's 1981 interview with Alexander Lamis | locate the audio recording (the 2012 release by Rick Perlstein / *The Nation*). Log the URL and the rights situation only; **do not download audio**. |

Finish by printing a table: slug | status (SAVED / TRANSCRIPTION ONLY / NOT FOUND) | file | page.
