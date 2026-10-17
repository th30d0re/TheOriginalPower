# Brief: give bias, prejudice and discrimination their own definitions in the manuscript

**Never run git. Edit only `Paper/The_Original_Power.tex` and `Paper/references.bib`.**
The author commits.

## Why

The book defines In-group and Out-group in the Preface ("A note on terms and host wetware",
~line 243) from APA Dictionary entries and Tajfel & Turner 1979. It never defines bias,
prejudice and discrimination separately. Chapter 2 groups them into one entry ("Prejudice or
bias", ~line 1865, in "The Critical Distinction: Racism and Prejudice Are Different
Phenomena"). The author wants each one defined from the standard sources and cited in the book.

## Do

1. Add three BibTeX entries to `Paper/references.bib`, matching the style of neighbouring
   entries. Verify every field against a primary record (publisher page, DOI or catalogue)
   before you write it:
   - Allport, G. W. (1954). *The Nature of Prejudice*. Addison-Wesley. The prejudice definition
     is on p. 9.
   - Fiske, S. T. (1998). "Stereotyping, prejudice, and discrimination." In Gilbert, Fiske &
     Lindzey (Eds.), *The Handbook of Social Psychology* (4th ed., Vol. 2, pp. 357–411).
     McGraw-Hill.
   - Greenwald, A. G., & Banaji, M. R. (1995). "Implicit social cognition: Attitudes,
     self-esteem, and stereotypes." *Psychological Review*, 102(1), 4–27.
2. **Preface, "A note on terms" paragraph.** After the ingroup-bias sentence, add two or three
   sentences that define:
   - **bias:** including implicit bias (Greenwald & Banaji)
   - **prejudice:** Allport's antipathy based on a faulty and inflexible generalization
   - **discrimination:** behavior that treats people differently by group membership
   
   Name the split into a thinking part (stereotype), a feeling part (prejudice) and a behavior
   part (discrimination), citing Fiske. Cite all three entries with `\cite{}`. Paraphrase;
   quote Allport only if you can confirm the exact wording.
3. **Chapter 2, ~line 1865.** Split the single "Prejudice or bias" entry into separate
   definitions for bias, prejudice and discrimination, consistent with the Preface and citing
   the same sources. Keep the book's argument intact: all three are interpersonal and can run
   in any direction between any groups, and racism is the system that weaponizes them.
4. Run `make pdf-from-tex` and confirm there are no undefined citations or references
   (`grep -i "undefined" Paper/The_Original_Power.log`).
5. Write a short report to `Architecting_the_operation/notes/MANUSCRIPT_bias_prejudice_discrimination_REPORT.md`:
   the before/after text of each edit, the sources you used to verify each BibTeX field, and
   the build result.

## Rules (AGENTS.md)

- Direct, affirmative declarative sentences. No formulaic antithesis ("not X but Y", "more
  than just X", "it is not merely…").
- Keep the book's vocabulary (In-group, Out-group, Elite, tiers) as written.
- Touch nothing else in the manuscript.
