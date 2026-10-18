# Brief: close out the YT02 scan archive

**Never run git. Write ONLY inside `Architecting_the_operation/video/yt02/archive/`. Helper scripts go in
`archive/_tools/`. Never execute downloaded files. Python's SSL is broken on this machine, so fetch with `curl -sL`.**

Read `archive/SOURCES.md` first. Three tasks:

1. **dum_diversas.** Find a public-domain page image of the printed text of *Dum Diversas* (Nicholas V, 18 June 1452).
   Leads:
   - *Bullarium patronatus Portugalliae regum*, vol. 1 (Lisbon, 1868): search Internet Archive (`advancedsearch.php`),
     HathiTrust full-text search, Google Books and Gallica;
   - *Levi Marrero* or other 19th-century printings;
   - for *Romanus Pontifex* (1455), Davenport, *European Treaties bearing on the History of the United States*
     (Carnegie, 1917), which is on Internet Archive.
   Save the page holding "invadendi, conquirendi, expugnandi" or "perpetuam servitutem" as
   `archive/dum_diversas/dum_diversas_p<page>.jpg` (≥1600 px). If only Romanus Pontifex is found, save it as
   `archive/romanus_pontifex/…` and label the row clearly. If neither is found, mark NOT FOUND and list the searches.
   Do not substitute a transcription for a scan.
2. **Library of Congress photo rights.** For each of the six LOC items behind `birmingham_1963/*` and `selma_1965/*`
   (ids in `_tools/fetch_loc_photos.py`: ppmsca 72946, 72947, 04293, 08102; cph 3d02329; ds 05267), open the item page
   on loc.gov (try `https://www.loc.gov/pictures/item/<id>/` and `https://www.loc.gov/item/<id>/`). Record the title,
   date, photographer, call number and the **Rights Advisory** text verbatim. Mark the row USE OK only if it says
   "No known restrictions on publication."
3. **Pixel boxes.** Measure (x, y, w, h) in the saved image for the target lines of `federalist10_leaf71.jpg`
   ("Extend the fphere … rights of other citizens") and `zurara_1453_leaf164.jpg` ("amongst them were some white
   enough … as black as Ethiops"). Use `tesseract <img> - tsv` and take the union of the matching word boxes.

Update the matching rows of `archive/SOURCES.md` and leave every other row unchanged. Print the changed rows at the end.
