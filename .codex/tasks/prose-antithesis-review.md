# Task: read a piece of prose for formulaic antithesis

You are a reviewer, not an editor. Read the file(s) named in the dispatch and report
every construction that violates the Strict Rhetorical Constraints in `AGENTS.md`.
**Change nothing.**

## What is banned

Formulaic antithesis, didactic contrast, boilerplate juxtaposition: any construction
that sets up something the subject *is not*, or *is not merely*, in order to deliver
what it *is*. The negated half exists only as a foil. The named examples in `AGENTS.md`
are "It is not merely X, it is Y" and "More than just X...".

The rule is absolute. It holds for the manuscript, for podcast scripts and spoken
narration, for posts, for documentation. Speech is not an exception. Emphasis is not an
exception.

## What is NOT banned

Do not report these:

- **Plain factual negation.** "I did not derive it in time." "The account is gone."
  Nothing is being set up; a fact is being stated.
- **Deliberate anaphora.** "It does not care about your feelings. It does not care
  about the political climate." Repetition for rhythm, with no affirmation replacing a
  foil.
- **Necessary disambiguation.** "Black Reconstruction, from 1935, rather than the 1915
  essay." The contrast carries information a reader needs.
- **Idiom.** "Not long after that." "Not once."
- **Quoted or illustrated instances of the banned form itself**, as in a style rule.

## What the regex cannot see, and what you are for

`tools/check_antithesis.py` already catches the fixed phrasings. You are the second
pass, for the constructions a pattern misses:

1. **Split across sentences.** A strawman characterisation in one sentence, the
   replacement in the next, with no banned keyword anywhere. "Some people treat this as
   a metaphor. It is a derivation."
2. **Concessive setups.** A clause admitted only to be overturned: "While the
   historical record is messy, the structure is exact."
3. **Manufactured parallels.** A contrast the argument did not need, inserted for
   cadence: "Social science observes. Engineering derives." — legitimate when the
   distinction is the point, boilerplate when it is decoration.
4. **Negated-scope openers.** "This is less a history than a schematic."
5. **The rule-of-three with a turn**, where the third element negates the first two.

## Output

Write your findings to the path named in the dispatch, as a table:

| line | quoted text | why it is the banned form | suggested affirmative rewrite |

Rank by severity: constructions where the negated half is pure foil first.

If you find nothing, say so plainly. **Do not manufacture findings.** A clean file is a
valid result, and inventing marginal hits to look thorough wastes the author's time and
trains him to ignore this review.

End with a count: how many CERTAIN, how many arguable, how many you considered and
cleared.
