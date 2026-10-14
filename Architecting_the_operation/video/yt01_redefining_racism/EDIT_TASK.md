# Edit task: YT01 script, technical-accuracy pass

**Never run git. Do not touch `Paper/`. Edit only the file named in your dispatch line.
Write findings to the findings file named there.**

The input is a draft written by another model from `BRIEF.md` (this folder). It reads
well; your job is accuracy, coverage and the hard rules, while keeping its voice.

1. Read `BRIEF.md` fully (hard rules and the segment table are binding) and the chapter
   source `Paper/The_Original_Power.tex` lines 1621–2735.
2. Check every turn of the draft against the chapter:
   - Every number, date, name, citation and quotation matches the tex exactly. Fix
     any that drift. Delete any fact the chapter does not contain (the Segment 02
     set-theory primer may explain standard notation).
   - Every book term is attached to the right mechanism (e.g. psi sub s is the status
     wage; R of t is repression; phase load is dispersion of class-alignment phases;
     the inductor L is cultural inertia; C is token-reform absorption). Equations are
     read correctly symbol by symbol and called by the numbers in the brief.
   - Every item in the segment table's "Content to cover" and "Must include" for the
     segments in the file is present. Add short turns for anything missing.
   - Precision qualifiers from rule 7 are present.
3. Enforce format: header `Emmanuel Theodore (MM:SS)`; one to three sentences and at
   most ~45 words per turn (split longer turns); `<!-- SEG NN · ... -->` markers kept;
   speakable text only (no LaTeX, symbols, or "Eq."); monotonic timestamps.
4. Enforce rule 2 (no antithesis). Run
   `python3 Architecting_the_operation/video/yt01_redefining_racism/check_script.py <file>`
   — it errors on structure and warns on possible contrasts and long turns. It expects
   all 23 segments, so on a partial file ignore only the "segments" and "missing
   reference" errors that belong to other parts. Rewrite every real contrast as a
   direct affirmative statement.
5. Keep the draft's voice and every correct sentence. Do not cut segments to save
   length.

Findings file: list each factual correction (draft said / tex says / tex line), each
added item, and anything you judged ambiguous in the chapter.
