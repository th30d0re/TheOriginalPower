# Dated lineage of The Original Power

Dates are `dcterms:created` / `dcterms:modified` read from each `.docx`'s internal
`docProps/core.xml`, not filesystem timestamps. The OneDrive folder is a 2026 backup
copy, so its file mtimes are all the backup date and are worthless. The embedded
metadata survived the copy.

Source: `OneDrive_2_8-8-2026/` (backup of a school Office 365 account Emmanuel no
longer has access to), plus this repository's git history.

| Date | Document | Note |
|---|---|---|
| 2020-01-30 | `spanish Amarican war report.docx` | The essay the Author's Preface dates as "early 2020". Now dated to the day. |
| 2020-02-07 | `How Race, Class and National Origin where affected by American Imperialism.docx` | The later paper the Preface says cited the essay as prior work. |
| 2023-05-11 | `The definition of racism should be changed… no seriously.docx` | Earliest recoverable seed of *Redefining Racism*. 88 revisions, last touched 2024-02-29. Already argues that racism begins when race begins and that race was invented to run In-group / Out-group sorting. |
| 2023-09-18 | `A Mathematical Model for Analyzing Systems of Oppression with a Focus on Systemic Racism.docx` | Modified through 2023-12-13. |
| 2024-02-25 | `Redefining Racism A Mathematical and Historical Approach.docx` | Abstract already names set theory, discrete mathematics, and historical analysis. |
| 2026-02-02 | commit `b774e80` | First commit in this repository. |

## What this settles

**Redefining Racism predates the Theodore Transform decision by roughly two years.**
The episode script originally said the decision to move off the gendered axis "produced
a manuscript called Redefining Racism". That is wrong. Redefining Racism was already
running on its own track. The transform sent Emmanuel back to work that existed, it did
not start it. Corrected in the Episode 1 script at the 11:29 mark.

**The Author's Preface's "early 2020" is now precise.** The Spanish-American War essay
is 30 January 2020 and the imperialism paper that cites it is 7 February 2020. The
manuscript could state either date directly.

## From Bias to Bytes — found

Recovered 2026-09-04 at `/Users/emmanuel/Documents/From Bias to Bytes.docx`, loose in
Documents rather than in either archive. Created **2023-10-06**, modified 2023-10-13,
3 revisions. Its title line matches the Preface, with one difference: the document reads
"Machine Learning-driven" where the manuscript writes "Machine Learning-Driven". Left as
title case pending a decision; see `.codex/tasks/verify-preface-dates.findings.md`.

No lineage document is missing any more.

Note the ordering this settles: the redefinition track (11 May 2023) predates the
*From Bias to Bytes* proposal (6 October 2023) by about five months. The Author's
Preface now records both tracks and says they converged.

The unpublished gendered-axis manuscript is not dated here. Emmanuel has it; it is not
in this backup and is not intended for publication.

## Reproducing this

```bash
unzip -p "<file>.docx" docProps/core.xml | grep -o '<dcterms:created[^<]*</dcterms:created>'
```
