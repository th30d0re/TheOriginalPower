# Codex loop: framework digest, atomic split, and book-grounded gold key

## Prohibitions
- Do not run `git` (no add, commit, checkout, stash, reset). The repo has uncommitted user work.
- Write only the files listed under "Files you own". Everything else is read-only, including
  `questions.tsv`, `score.py`, `CONTRACT.md`, and all of `Paper/`.
- No network. You do not need it. Do not look up the 12axes site or any outside commentary on
  the book; the manuscript is the only authority.

## Goal
Answer the 240-item 12 Axes quiz **as The Original Power's framework would**, with every answer
traceable to the manuscript, and separate the quiz's compound items into single claims so the
distortion from its wording can be measured. A well-supported "the book is silent on this" is a
correct answer (`N`, basis `silent`), not a failure. Do not fill silence with general left-wing
positions; the point of the key is to show exactly where the book speaks.

## Read first
- `training/benchmarks/12axes/CONTRACT.md` (schemas; binding).
- `training/benchmarks/12axes/questions.tsv` (the items).
- `AGENTS.md` at the repo root (rhetorical constraint applies to the digest's prose).
- The manuscript: `Paper/The_Original_Power.tex` (15,683 lines). Chapter map:
  `grep -n '\\chapter{\|\\part{' Paper/The_Original_Power.tex`.

## Established facts (orchestrator-verified line numbers, `Paper/The_Original_Power.tex`)
These anchor the axes most likely to be misread. Re-open each before relying on it.
- The goal state is a **republic**, not statelessness: "An Open-Source Republic is a state
  architecture designed specifically to prevent the re-installation of an extraction hierarchy" (14569).
  Keeps the Constitution and Bill of Rights as kernel (14573).
- Du Bois plank 4, **federal** enforcement of civil rights: without it every guarantee reverts to
  what the local enforcement class will honor (14590). 18 U.S.C. §242 and abolition of qualified
  and absolute immunity (14652–14660).
- Agencies judged by function: EPA retained, ATF dismantled (14639).
- Anti-Monopoly on Kinetic Force: no militarized standing police; kinetic parity decentralized to
  the populace. Algorithmic/state transparency. Hard cap on the max variable (e.g. 100% tax above a
  billionaire threshold) plus universal baseline provisioning (14671–14673).
- Perpetual Battle: solidarity fractured along race, class, religion, or gender lets new elites
  re-introduce phase-loading (14676).
- Geographic Interface Swap: splitting rights across jurisdictions (MA vs NH) is itself an
  extraction mechanism, "à la carte rights" (14743 onward).
- Imperial Core Theorem and its condition 2 (regional bloc self-sufficiency in food, energy,
  currency, defense): 13142–13167, restated 14813.
- Kinetic chapter (Second Amendment, disarmament timeline): chapter starts 10478. Gendered
  disarmament and "mental gun control": 4041–4110.
- Religion as the pre-racial partition variable and the Church as moral authorization: 3003–3041, 3086.
- Capital and capitalism defined: 526–548. Concession Theorem (non-kinetic reform absorbed as
  min-management): chapter starting 11531, restated 14811.
- Tweedism filter and public campaign finance: 14662–14664; omnibus ban / single-issue legislation: 14649.
- Kinship as distributed network, atomization: 3789–3820.

## Definition: compound item
An item is **compound** when it contains two or more claims that a respondent could assess
separately and answer differently. This includes: conjoined objects or policies ("its own
constitution, its own laws, and its own police"); a factual premise joined to a normative
conclusion ("provide a decisive advantage, and my country should develop them"); a stated
justification or condition that is itself contestable ("…because it ends a human life"); and a
contrast whose halves can be judged separately. A list of near-synonyms ("drugs, gambling,
prostitution" as examples of private conduct) is compound only if the framework's positions on
the listed members differ. When in doubt, mark compound and split; the analysis tolerates
over-splitting better than under-splitting.

## Files you own (all under `training/benchmarks/12axes/`)
1. `FINDINGS.md`: write it first and update as you go. Record brief or contract defects, items
   you found hard, and every place you had to infer rather than cite.
2. `framework_digest.md`: the text a small model will read before answering. ≤ 1,800 words.
   Organize by the twelve axis topics (structure/federalism, representation, security vs liberty,
   immigration, military/diplomacy, foreign intervention, public vs private economy, planning vs
   market, trade, religion, morality, technology). Under each, state the book's positions as direct
   declarative sentences, each ending with `[The_Original_Power.tex:LINE]`, and a line naming what
   the book does not address. Use the book's own vocabulary (Elite, Buffer Class, extraction kernel,
   phase-loading, kinetic, Open-Source Republic); do not translate it into standard political
   science terms. **Do not mention quiz items, quote them, or write positions shaped to answer a
   specific item.** The digest describes the framework; the models answer the quiz from it.
3. `atomic.tsv`: every item split per the definition above (schema in CONTRACT). `agree_pole` of
   an atomic row: the pole that agreeing with *that clause* pushes toward. Usually the parent's;
   state it explicitly and record in FINDINGS any clause whose pole differs from its parent's.
4. `keys/gold_forced.tsv`: one row per quiz item. The answer the framework gives **when forced to
   answer the item as worded**, as the quiz requires. For a compound item whose clauses pull in
   opposite directions, choose what the framework would choose if made to pick one; do not default
   to `N` unless it truly would. `rationale` ≤ 30 words.
5. `keys/gold_atomic.tsv`: one row per atomic id, answered the same way.

## Acceptance (run these)
- `python3 score.py keys/gold_forced.tsv` runs and prints a URL.
- A self-check you write (`check_keys.py`, owned) confirming: all 240 ids present exactly once in
  `gold_forced.tsv`; every parent id appears in `atomic.tsv`; every atomic id appears exactly once in
  `gold_atomic.tsv`; answers in {SA,A,N,D,SD}; `basis` in {book,inferred,silent}; every `cite` line
  number exists in the `.tex` and every non-silent row has a cite; `silent` rows are `N` with an
  empty cite; `framework_digest.md` ≤ 1,800 words and every sentence making a claim carries a cite.
- Spot-check 20 random `book` rows yourself by re-opening the cited line; record the result in
  FINDINGS (how many held, and fix the ones that did not).
- In FINDINGS, report: counts of compound items per axis; counts of basis per axis; the score.py
  output for `gold_forced.tsv`.

## Not yours to claim
Running any model against the digest, and the forced-versus-atomic comparison. The orchestrator
runs those.

## Stop conditions
- If a cited line does not say what the rationale claims, fix the citation or downgrade the basis
  to `inferred` / `silent`. Never keep a citation you have not re-read.
- If the manuscript contradicts itself on an axis, record both lines in FINDINGS and answer from
  the later / more specific passage, naming which one you used.
