# Brief: finish the YT02 scan archive

**Never run git. Write ONLY inside `Architecting_the_operation/video/yt02/archive/`. Helper scripts go in
`archive/_tools/`. Never execute downloaded files. Never download audio.**

Read `archive/SOURCES.md` (the current state) and `archive/SCAN_GATHER_BRIEF.md` (the original spec: file naming,
≥1600 px images, verbatim lines, pixel boxes). Then:

## A. Gather the four missing items

1. **federalist10**: Federalist No. 10, the page with "Extend the sphere, and you take in a greater variety of parties
   and interests". Candidate: Internet Archive `federalistcollec00hami` (1788 McLean edition). Use its page images
   (`https://archive.org/download/<id>/page/n<leaf>_w1800.jpg`) and find the leaf via the IA full-text search or the
   `_djvu.txt`.
2. **zurara_1453**: Zurara, *Chronicle of the Discovery and Conquest of Guinea*, Hakluyt Society 1896, vol. 1. Find the
   Lagos 1444 captives passage (captives white enough, fair to look upon / like mulattoes / black as Ethiops). Candidate
   IA `chronicleofdisco01zura`.
3. **dum_diversas**: Nicholas V, *Dum Diversas* (1452). Search IA and HathiTrust for a public-domain printed edition
   (e.g. *Bullarium patronatus Portugalliae regum*, or Davenport's *European Treaties* 1917, which prints *Romanus
   Pontifex*). If only *Romanus Pontifex* is available, save that page and label it clearly as Romanus Pontifex (1455).
   If nothing exists, mark NOT FOUND.
4. **atwater_1981**: find the public URL of the 1981 Atwater–Lamis interview audio (released by Rick Perlstein /
   *The Nation*, November 2012). Log the URL, the publisher and any rights or licensing statement. Do not download it.

## B. Verify the unchecked pages already saved

Verify `hening2_1662`, `hening3_1691`, `hening3_1705_codes`, `dredscott_416`, `cruikshank` and `fbi_table8_2025`.
For each image:
- read the page itself (OCR with `tesseract` if installed, else view the image);
- confirm that the page header and page number match the citation;
- quote the target line verbatim;
- give its pixel box (x, y, w, h).
Delete nothing. If an image is the wrong page, say so and fetch the right one. For `hening3_1705_codes` pp. 250, 251
and 298, say which act each page belongs to.

## C. Update `archive/SOURCES.md`

Update each row's status (VERIFIED / WRONG PAGE→FIXED / NOT FOUND / TRANSCRIPTION ONLY), the source URL, the
verbatim line and the pixel box. Leave the existing VERIFIED rows unchanged. Print the final table.
