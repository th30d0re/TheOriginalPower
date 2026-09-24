# Anchor shot-list citations to quoted passages

## What this is

`Architecting_the_operation/video/*_shotlist.md` are video shot lists for a
podcast adapting a research manuscript, `Paper/The_Original_Power.tex`. A shot
tagged `[book]` asserts that what it puts on screen is stated in the
manuscript, and cites it.

Those citations were written as line numbers. The manuscript has been edited
since, so the numbers now point at unrelated lines. Line numbers are being
replaced with phrases quoted from the manuscript, which do not drift.

## Your task

Each line of your batch file is one shot, as JSON:

    {"spec", "shot", "title", "on_screen", "note", "currently_cited", "candidates"}

`on_screen` describes what the graphic shows. `candidates` are manuscript
passages pre-ranked by word overlap, each with its `line` and `text`.

For each shot, decide which candidate passage actually supports what the shot
puts on screen, and return a short phrase quoted from it.

## Output

Append one JSON object per shot to your output file, one per line:

    {"shot": "G-12", "line": 2043, "quote": "systematic transfer of wealth and power upward", "why": "the shot's three inputs and single output are this sentence's claim"}

Rules, and each one is checked mechanically after you finish:

1. `quote` must appear **verbatim** in the manuscript line you name. Copy it
   character for character from the candidate `text`. Do not paraphrase, do
   not fix spelling, do not change capitalisation.
2. `quote` must be between 5 and 15 words.
3. `quote` must contain no LaTeX markup: no backslash, no `{`, `}`, `$`, `\\cite`,
   and no double quote character.
4. `line` must be one of the `candidates` lines for that shot.
5. `why` is one sentence saying why that passage supports that graphic.
6. If no candidate supports the shot, return
   `{"shot": "G-12", "line": null, "quote": null, "why": "<what is missing>"}`.
   Returning null is a correct answer and is better than a loose match. A
   citation that is approximately right is worse than one that is obviously
   absent, because this book argues about how carefully the record is read.

## Do not

- Do not edit any file other than your output file.
- Do not modify the shot lists, the manuscript, or the batch files.
- Do not invent line numbers outside the candidate list.
- Do not skip a shot. Every shot in your batch gets exactly one output line.

## Done when

Your output file has exactly as many lines as your batch file, each valid JSON
with the five keys.
