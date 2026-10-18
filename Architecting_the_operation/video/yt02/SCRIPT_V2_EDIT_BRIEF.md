# Brief: YT02 v2 edit pass

**Never run git. Edit ONLY `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`. Write the report to
`Architecting_the_operation/video/yt02/logs/script_v2_edit.md`. Never edit `Paper/` or any other file, and never
create files at the repo root.**

Keep the markup: `<!-- SEG -->` headers, `<!-- [book …] -->` provenance comments, `[clip:…]` tags and speaker
lines. Keep the style rules in `Architecting_the_operation/video/yt02/SCRIPT_V2_BRIEF.md`: no formulaic antithesis,
"cannabis", "tiers", and numbers written as spoken words.

1. **Why-questions.** Before each major claim, test or reveal, add one explicit question in the narrator's voice that
   the next passage answers ("So why does the dictionary list prejudice first?", "Why would a Crown pay a wage that
   costs it nothing?"). Aim for one at the top of every segment and one before each answer inside it, about 40–60
   in total. Make each question short and specific to its answer, with no rhetorical filler. State the through-line
   once in the cold open and once in the close: when something happens, ask why.
2. **The five tiers, introduced once.** Find every passage that introduces or re-explains the five tiers (Elite,
   Puppet Class, Enforcement Class, Buffer Class, Out-group). Keep the single full introduction at its first
   appearance. Turn every later re-introduction into a short back-reference. Report the line numbers before and after.
3. **Check every claim against the book.** For each sentence that states a fact, number, date, quote, equation or
   section reference, confirm it against `Paper/The_Original_Power.tex` (use the provenance comment to locate it) or
   against `Architecting_the_operation/video/yt02/archive/SOURCES.md`.
   - Fix any mismatch in the script so that it matches the book.
   - Delete any claim the book does not support.
   - Never change the book.
   Log every fix and deletion with the script line, the old text, the new text and the book line.
   Spoken equation and section numbers must match the book's labels.

Finish by appending to the report:
- the count of why-questions added;
- the tier-introduction line numbers;
- the fix/deletion table;
- the output of `grep -n -i -E "not (just|merely|only)|rather than|isn't (just|about)| but (rather|instead)"` on the
  script, which must return no corrective contrasts.
