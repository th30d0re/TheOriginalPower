# Brief: minutes 7–12, cleanup pass (after Argon's design pass)

The prompt's first line names the packages: for example `PACKAGES: F, G`. Do only those.

Read these first:
- `BRIEF_MIN7_12_BUILD.md` (its Rules, Checkpoint and Standard all apply);
- the added rules in `BRIEF_MIN7_12_FIX_F.md`, `BRIEF_MIN7_12_FIX_EH.md` and
  `BRIEF_MIN7_12_POLISH.md`. Keep every check they added passing;
- your packages' sections of `STORYBOARD_MIN7_12.md`.

**Files you may write:**
- `min7_12/<x>/*` and `tools/check_min7_12_<x>.*` for your packages;
- a new file, `FINDINGS_MIN7_12_CLEANUP.md`. Do not edit `FINDINGS_MIN7_12.md`, which another
  worker is writing.

**Frames:** `outputs/YT02v2_ov/video/stage_runs/v3/e<episode-seconds>.jpg` covers F and G. Open
and look at every one for your packages before you change code.

**What this pass is for:** the scenes are now full, but often full of words. The author's rule is
"show, don't describe". A picture carries the idea, and text names things. This pass removes
filler text and makes the pictures carry the meaning.

## Rules

1. **No filler labels.**
   - Every on-screen string is one of these:
     - a storyboard string;
     - a source line;
     - a term the narration says;
     - a short name for a pictured thing.
   - Delete descriptive microcopy that restates the picture, such as "EXPERIENTIAL LOG",
     "VALENCE SCALE", "BYPASS ROUTE", "INSPECTION SCREEN", "FEEDS TRACE STORE", "STEERS
     REACTION", "INDIVIDUAL RESPONSE NODE · SIMULTANEOUS CHANNEL OUTPUT", "PAIRED CATEGORIZATION
     TRIAL" and "AUTOMATIC SORTING TASK · SPLIT-SECOND KEY TIMING".
   - Aim for at most ~25 words of on-screen text per settled beat, sources excluded.
2. **No internal vocabulary.**
   - Never "socket", "slot", "module", "node", "channel output", "store", "template structure",
     "part n of 3", or anything else that names the implementation.
   - Say what the thing is: "Stereotyping · thinking", "Prejudice · feeling",
     "Discrimination · acting".
3. **Nothing ahead of its word.**
   - An element appears when the narration names it.
   - No captioned empty placeholders wait for later content. In turn 54, for example, the
     affective and behavioural modules are absent until "affective" and "behavioral" are spoken.
4. **Balance.** After deleting text, re-lay so each settled beat is balanced. The polish rules
   still hold: ~70% height span, cards fit their text, and the 28/20 px size floor.
5. **No contrast headings.**
   - Replace "CONCEPT DISTINCTION · DIRECTIONAL LEAN VS. RIGID AFFECTIVE ANTIPATHY" with a direct
     label such as "BIAS AND PREJUDICE".
   - Keep "Where bias captures…" as a picture of the two side by side.
   - No "vs.", "not", "rather than" or "instead of" in on-screen text.

## Specific items

- **F, turn 41.** Reduce to: the definition card; three trace chips ("accumulated surroundings",
  "repeated exposure", "stored association") flowing into one unnoticed trace; and a reaction
  dial with + and − ends. Use no other labels.
- **F, turn 42.** Keep two lanes (the belief and the automatic association) converging on one
  person, with a reaction dial. Labels: "SINCERE EQUAL-TREATMENT BELIEF", "AUTOMATIC
  ASSOCIATION", "ONE PERSON", "REACTION". Nothing more.
- **F, IAT.** Keep the face, the word, two keys and the latency bars. The key labels read
  "FACE A + pleasant" and "FACE B + unpleasant". Remove the rest of the microcopy.
- **G, turns 49–50.** Rebalance the left-heavy frames into centred or two-column compositions.
- **G, turns 52–54.** Remove "SOURCE SOCKET" and every "SOCKET n" or "MODULE SOCKET" label. Build
  the three modules on their spoken words.

## Done means

All of these pass:
- episode tsc;
- your packages' checks, with every earlier assert kept, plus:
  - an assert that no on-screen string matches
    `/\b(socket|slot|module|node|store)\b/i` or `/\bvs\.?\b/i`;
  - a per-beat word-count assert, with its threshold documented;
- every other check in `BRIEF_MIN7_12_BUILD.md`;
- `check_antithesis.py` on your files.

Report in `FINDINGS_MIN7_12_CLEANUP.md`. List the strings you removed, by scene.

## Packages E and H (after Argon's design pass)

**Frames:** `outputs/YT02v2_ov/video/stage_runs/v4/e<episode-seconds>.jpg`. When you run E or H, write
your report to `FINDINGS_MIN7_12_CLEANUP_EH.md`, not `FINDINGS_MIN7_12_CLEANUP.md`.

**Blocking defects:**
- **E, `RLCBridge` (`e476`, `e479`).**
  - A stack of term labels ("L", "R", "C", "q(t)", "V(t)") and a faint band reading "CHAPTER 2 ·
    SYSTEM COUPLING / RLC BACKLASH MODEL" render at y 0–80. They cross the top border and the
    notch. Remove them, or move them into the safe area.
  - The layout audit missed them because they carry no `data-text` or `data-shape` box. Add an
    assert that every rendered text node sits inside a declared `data-text` box, so undeclared
    text fails the check.
- **H, `InterpersonalClass`, turn 60 (`e726`).** The state-power list must use the narration's
  words, verbatim:
  - STATE LEGISLATURES;
  - APPELLATE COURTS;
  - POLICE DEPARTMENTS;
  - CREDIT MARKETS;
  - MILITARY FORCE.

  Remove "COERCIVE POLICING", "CAPITAL ALLOCATION", "ARMED SOVEREIGNTY" and "STRUCTURAL LEVERS
  OUTSIDE DYADIC SCOPE".
- **Invented or unsourced claims.** Delete all of these:
  - "BIB 4226";
  - "PART I · FORMAL MODEL";
  - "CHAPTERS 2–21";
  - "CIVIL RIGHTS AND RECONSTRUCTION FORCING";
  - "INGROUP SOLIDARITY GRANT";
  - "OUTGROUP SUSPICION TRIGGER";
  - "VITAL STATISTICS SURVEILLANCE";
  - "Macro-level control over law, courts, policing, and credit";
  - "CALIBRATED TO EMPIRICAL RECORD".

  An on-screen claim must come from the storyboard, the narration or a cited source line.
- **H, `UnequalTreatment` (`e683`).** The cards titled "INTERPERSONAL CASE 03/04" are placeholders.
  Each card appears when its example is spoken.

**Filler to strip.** Keep the rules above and the 25-word budget. Examples:
- **E:** "CLINICAL RECORD LEDGER", "OBSERVED STREAM FEEDS LIKELIHOOD P(X | T)", "SOURCE-BACKED
  BAYESIAN UPDATE", "EMPIRICAL REVISION RULE", "BAYESIAN EMPIRICAL REVISION", "DIRECTIONAL
  SURVEILLANCE COMPARISON", "ORDINAL COMPARISON · NO NUMERICAL AXES OR RATES" (keep the one
  "QUALITATIVE · NO RATES SHOWN"), "INSTALLED PRIOR MODULE", "PRIOR ROUTING STAGE · CH. 2",
  "AUTOMATIC GATEWAY SELECTION", "UPPER/LOWER OUTPUT GATE", "CROSS-TIER COUPLING", "STATE FEEDBACK ·
  CH. 2", "CIRCUIT PARAMETERS · FIVE TERM CHIPS", "FOUNDATIONAL FORMULATION · CITATION RECORD",
  "DUAL-CHANNEL SOURCE", "UPPER CHANNEL · SELF-REPORT", "LOWER CHANNEL · TRACE ACTIVATION",
  "BEHAVIORAL OUTPUT", and the descriptive sentences under them.
- **H:** "OPERATIONAL LOCUS · INDIVIDUAL & DYADIC INTERACTION", "SYMMETRICAL INTERGROUP
  CAPABILITY", "SOCIAL COHORT 01/02" (use GROUP A / GROUP B), "BILATERAL INTERPERSONAL CAPABILITY
  ACROSS GROUPS", "SYMMETRICAL DYADIC GRAPH", "UNIVERSAL TRAIT", "UNIVERSAL ORIGIN", "INTERPERSONAL
  UBIQUITY", "DYADIC INTERACTION FIELD", "TAXONOMIC CALIBRATION · THREE INTERPERSONAL TERMS",
  "CHAPTER 2 · NOMENCLATURE SPECIFICATION", "SEQUENTIAL INTERPERSONAL PIPELINE", "STAGE 01 → STAGE
  02 → STAGE 03", "PATHWAY SIGNAL…", "THREE-STAGE TRANSMISSION", "LOCUS · …", "CASE 0n ·
  SPEECH/COMMERCE/…", "SPEECH BOUNDARY", "SERVICE COUNTER", "GRADING SHEET", "QUALIFIED TENANT",
  "ATTITUDE RECORD", "ANTIPATHY RECORD", "BEHAVIORAL RECORD", "Three canonical constructs…",
  "Complete specification of…", "CHAPTER 2 · SECTION TRANSITION", "LITERATURE BOUNDARY ·
  INTERPERSONAL TO STRUCTURAL HANDOFF".
