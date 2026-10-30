# Research pass on the 2026-10-28 YT02v2 notes

## Prohibitions

You are a read-only researcher. Write one file and nothing else:

`Architecting_the_operation/video/yt02/logs/F_research.md`

Do not edit the podcast script, shotlist, cards, Figma, pronunciations, voice files, `scriptcast.toml`, `Paper/`, or anything under `outputs/`. Do not commit. Do not run scriptcast. Do not run git commands that change the tree (`checkout`, `reset`, `revert`, `clean`).

A supported "cannot confirm" is a successful result. A quotation you did not read in an opened file is a failure. Disagreement with the author’s memory is a valued outcome. Write it as DISAGREE and cite the file you opened.

## Goal

For each claim below, open the artifact and record one status:

- MANUSCRIPT — the sentence is in `Paper/The_Original_Power.tex` or an episode script. Quote it and give `file:line`.
- PRIMARY — you opened a contemporaneous source (page image, opinion PDF, statute). Name the file or the URL and the page.
- CANNOT CONFIRM — you looked and did not find it. Say where you looked.

Tertiary web pages are a flag, not a verification. Do not upgrade a claim by restating it.

Write the findings file first, with the table headers, then fill rows. If you are cut off, the partial table is the deliverable.

## Claims

Re-open these leads. They are grep hits from the orchestrator, not verified quotes.

1. Lincoln on white people treated as though they were black, in connection with the Know-Nothings or immigrant status. Search `Paper/` and `Architecting_the_operation/podcasts/`. If absent, CANNOT CONFIRM. Do not supply a quotation from memory.
2. Know-Nothings and European immigrants moving from out-group treatment into the in-group. Same search.
3. Du Bois, "propaganda of history," and any line the manuscript draws from the 1450s to the present. Lead: `Architecting_the_operation/podcasts/ATO_EP03_redefining_racism.md` mentions the phrase. Re-open it and the `.tex`.
4. Dum Diversas, 1452, as papal authorization in the Portugal sequence. The script already says this at line 968 of `YT02_v2_what_racism_is.md`. Confirm the manuscript sentence. Do not add a new causal claim.
5. Public and psychological wage, the two-part wage, and the complex form `W = ψ_m + jψ_s`. Leads: `ATO_EP01_authors_preface.md` near the Du Bois sentence, `Paper/The_Original_Power.tex` (search `psychological wage`). Quote the derivation the book actually gives: tuple or not, imaginary component or not, phasor or not. If the phasor-as-engineering-reading is only the author’s spoken note and not in the book, say so.
6. Tier progression from two tiers to five. Leads: `ATO_EP02_preface.md` ("It started with two tiers"), `ATO_EP04_what_power_is.md` ("That gave three tiers"). Quote the passages a script rewrite can copy, with file:line.
7. Puppet Class versus any "profit class" string in the manuscript. Report which name the book uses.
8. Log 3 / θ = 90° / pure status / Second Amendment as a material concession. Shotlist cites Ch 3 lines 2914–2925 and Compiled Runtime Log 2. Open the `.tex` around those themes (search `pure status`, `fascism`, `Second Amendment`, `Quadrant`). State whether the manuscript still calls 90° pure status with ψ_m = 0. If the Second Amendment is treated as a material concession anywhere, quote it.
9. The §2.2 definition of racism and any later, fuller definition. Script block 515, line 2135, quotes §2.2. Find the later definition and quote both with file:line.
10. Bayesian defense and the RLC derivation sections that line 2309 of the v2 script currently pushes to another video. Locate the spoken derivations in `YT02_what_racism_is.md`, `ATO_EP03_redefining_racism.md`, `YT01_what_racism_really_is.md`, and the `.tex`. List file:line ranges a rewrite can lift. Note the approximate word count.
11. Title 18 USC §922(g)(1), NYSRPA v. Bruen, and an MLK pistol-permit denial. Search the manuscript and `Paper/research/` first. If the repo has an opinion PDF or a cited page, open it. If the only hit is memory or a tertiary page, mark CANNOT CONFIRM and name the page. Do not assert that a 2020 Black gun-ownership surge differed by licensing regime unless you can point at a dataset or a paper in the repo or a named primary series. The author believes it differed. Belief is not a result. A null result is a valid row.
12. Equation numbers the author remembered at turns 488–495 (Figure 0.6, Eq 0.5, Eq 0.6) versus the script (Eq 0.15 at line 2026, Fig 0.6 at line 2038, Eq 22.1 at line 2046, Eq 22.2 at line 2050). Say which objects the manuscript defines, with file:line.

## Also in the findings file

A copy-ready block for the script author: for items 5, 6, 9, and 10, paste the shortest manuscript or episode passage that already says the thing, with file:line. Mark anything that is your paraphrase.

A verification rule, in testable form, for note N2: a card fails when a content word on the card is absent from the spoken turn and from the turns that hold that card, and the card is not labeled as a short aside. Name the shotlist fields (`**Note:**`, `**Holds:**`) as the authority. Do not implement the checker.

## Stop

Stop after `F_research.md` is written. Do not start a second file.
