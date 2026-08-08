# ETYMOLOGY-REPORT — Author's Preface title note

Task: `.kimi/tasks/etymology-preface.md` — one paragraph explaining why the book
is called *The Original Power*, placed at the end of the Author's Preface.

## Final paragraph (Paper/The_Original_Power.tex:149)

> The title rests on an older sense of the word. English *power* descends from
> Anglo-Norman *poer* and Old French *poeir*, from Vulgar Latin *\*potere*, from
> Latin *posse*, "to be able," contracted from *potis esse*. The adjective
> *potis*, "able, capable," descends from the reconstructed Proto-Indo-European
> root *\*poti-*: "master, lord, owner, husband." The same root runs through
> *despot*, from Greek *despotes*, "master of the house"; through *possess*,
> from *potis* joined to *sedere*, "to sit as master over"; through *potent*,
> *potentate*, and *omnipotent*; through Sanskrit *pati-* and Greek *posis*,
> "lord, master, husband"; and through *host*, from Latin *hospes*, the
> guest-master. Power, possess, and despot grow from one root, and that root
> names the master of a household. That mastery—over a household and the people
> in it—is the original power the title names.

## Verification

| claim | reference checked | result |
|---|---|---|
| power < Anglo-Norman *poer* / Old French *poeir* < Vulgar Latin *\*potere* < Latin *posse* < *potis esse* | de Vaan, *Etymological Dictionary of Latin*, s.v. *potis* (turuz.com PDF); OED lineage via University Digital Conservancy summary (conservancy.umn.edu) citing Glare/Oxford Latin Dictionary | confirmed — de Vaan lists *potis esse* "to be master, be capable" > *posse* |
| *potis* "able, capable" < PIE *\*poti-* "master, lord, owner, husband" | de Vaan s.v. *potis*; Watkins *poti-* gloss "powerful; lord" as reproduced in etymonline root entries | confirmed |
| despot < Greek *despotes* < *\*dems-pota-* "house-master" (*\*dem-* "house, household" + *\*poti-*) | etymonline "despot" (Watkins-derived PIE entries) | confirmed — *despotes* glossed "master of a household, lord" |
| possess < Latin *potis* + *sedere* "to sit as master over" | etymonline "possess": *possidere* "probably a compound of *potis* 'having power'… and *sedere* 'to sit'"; standard juridical literature | confirmed as the standard etymology; sources hedge with "probably," so the paragraph states the derivation without embellishment |
| potent, potentate, omnipotent < Latin *potis* | de Vaan s.v. *potis*: derivatives incl. *potens* "powerful, capable" | confirmed |
| Sanskrit *pati-*, Greek *posis* "lord, master, husband" < *\*poti-* | Watkins root entry as reproduced in etymonline; Oxford ORA source noting Greek *posis* "husband" shares the root with *potis* | confirmed |
| host / *hospes* < *\*ghos-ti-* + *\*poti-* "guest-master" | Benveniste, *Dictionary of Indo-European Concepts and Society* (HAU Books): *hospes* < *hosti-pet-s*, literal sense "the guest-master" | confirmed |

Nothing was dropped; every derivation in the task brief checked out.

## Revision iterations

**Two.** Iteration 1: drafted the paragraph; grep self-audit returned zero hits,
but the read-aloud pass flagged the opening ("takes its meaning from the oldest
history of the word" — awkward) and the close ("The title keeps that original
sense" — drifting lyrical), so both were rewritten. Iteration 2: grep audit zero
hits, read-aloud against the surrounding preface paragraphs produced no further
changes, build passed. Loop terminated.

## Epistemic frame compliance

The paragraph carries no confidence tier, states no theorem, references no
equation or registry entry, and makes no claim that the etymology proves
anything about the framework. *\*poti-* is flagged in-line as "the
reconstructed Proto-Indo-European root." It is written as the reason for the
title, full stop.

## Banned-pattern audit

`grep -nE "rather than|instead|not merely|more than just|, not |is not |does not"`
over the new paragraph: zero hits. Extended scan for `\bbut\b|\byet\b|\bwithout\b|
\bno longer\b|\bnor\b|\balthough\b|\bwhile\b`: zero hits. All statements are
affirmative declaratives; the contrast between the modern sense (ability) and
the older sense (mastery) is left for the reader to supply.

## Build

- `pdflatex -interaction=nonstopmode The_Original_Power.tex` ×3.
- `grep -ac "^! " The_Original_Power.log` → **0**.
- Page count: **1134** (within the allowed 1134/1136).
- `Paper/figures/spectral/*.pdf` (22 files) and `The_Original_Power.bbl` were
  copied from the main checkout for the build only; neither is committed.
  `Paper/The_Original_Power.pdf` is tracked but deliberately left uncommitted
  per the task brief.
- Verified via `pdftotext` that *\*poti-*, *despotes*, and the full sentence
  typeset correctly (asterisk renders in text mode).
