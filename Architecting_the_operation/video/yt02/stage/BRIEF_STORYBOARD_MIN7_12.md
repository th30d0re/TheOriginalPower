# Brief: storyboard for YT02v2_ov turns 35–62 (7:05–12:32)

This is a design task. Write **one file** and nothing else:

`Architecting_the_operation/video/yt02/stage/STORYBOARD_MIN7_12.md`

Do not write code, scripts or any other file, and do not run git commands that change state. Run
`git status --short` before and after you write. List anything new outside that one file in the
storyboard's last section; there must be nothing.

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)

The checkpoint hash is on the prompt's first line. The dirty paths `.claude/launch.json`,
`yt02/logs/…` and `tmp/` belong to the author. Leave them alone and do not treat them as blocking.

## Context

Episode 1, "What Racism Is", is being rebuilt as TypeScript/React scenes on the Stage engine.
Turns 0–34 (0:00–7:05) are built. Read these before you design:

- **`STORYBOARD_MIN3_7.md`.** Its structure is the template for this file. Its scenes are the
  established visual vocabulary for this episode:
  - `DefinitionCard` and `CitationCard`;
  - the us/them sorting field;
  - `PersonMark` (head and shoulders);
  - the `PredictiveUpdatePlot` and `PrecisionGauge`;
  - the three-term blocks for bias, prejudice and discrimination, with their icons.
- **The code under `min3_7/`:**
  - `shared/`, the shared components;
  - `a/`–`d/`, the scenes;
  - `../equations/`, the colour registry and pulsing terms;
  - `tools/layout_audit.ts`.
- **`BRIEF_MIN3_7_FIX_CD.md`**, for the safe-area and no-collision rules. Design every layout box
  to satisfy them.
- **Narration word timings:** `outputs/YT02v2_ov/word_timings.json`, keyed by `turn_id`. The turn
  order and start times are in `outputs/YT02v2_ov/episode_manifest.json`.
- **The manuscript** `Paper/The_Original_Power.tex` is the authority. Anchors:
  - **Lines 1870–1885:** "Racism and Prejudice Are Different Phenomena". These are the book's own
    definitions of bias, prejudice, discrimination and racism, with their citations. One of them
    reads "can operate in any direction between any groups", for turns 58–61.
  - **Line 243:** the note on terms.
  - **Lines 2124–2136:** the Bayesian Defense and Eq. 2.8a (Π_race). Turns 35–37 build on turns
    33–34.
  - **Lines ~2206–2320:** the RLC backlash model, Eq. 2.11 and Eq. 2.12, and Figure 2.6. Turn 38
    previews it. Take every printed equation and figure number from
    `Paper/The_Original_Power.aux`, never from a `\label` name: `eq:1.7a-rlc-governing` prints as
    Eq. 2.11.
  - **`Paper/references.bib`:**
    - 4207: Allport 1954;
    - 4214: Fiske 1998;
    - 4226: Greenwald & Banaji 1995;
    - 4317: NCHS, "Maternal Mortality Rates in the United States, 2021".

## Sourcing limits (read these closely)

- **Turn 36.** The manuscript gives no maternal-mortality rates, so put **no numbers** on screen.
  Show the relationship qualitatively: an expectation that tracks a documented, elevated series.
  Its source line is the NCHS report title from references.bib 4317.
- **Turn 43.** The Greenwald, McGhee & Schwartz 1998 Implicit Association Test paper is not in
  references.bib. Use only what the narration says: names, year and journal. Record this as an
  open sourcing item in your last section.
- **Generally.** Never invent a quote, number or claim. Take definitions as the narration words
  them, marked "(paraphrased)" when they differ from the cited source.

## Narration, turns 35–62

| Turn | Episode time (s) | Text |
|---|---|---|
| 35 | 425.0–437.5 | Consider Black women's wariness toward the United States medical system. That wariness is a bias in the statistical sense: a starting expectation updated on documented harm and ongoing disparity. |
| 36 | 437.9–451.9 | The National Center for Health Statistics reports maternal mortality rates that remain elevated for Black women relative to white women across the surveillance series the book cites. The expectation tracks those documented numbers. |
| 37 | 452.2–464.8 | Pi-sub-race is a different object: an institutionally installed racial assumption that routes empathy and threat detection along a legal color line whether or not the facts in front of the observer support it. |
| 38 | 465.1–479.7 | The Bayesian Defense section pairs with the RLC backlash model later in this episode. Installed priors supply the mental half; inductance, resistance, and capacitance supply the institutional half that absorbs and damps reform shocks. |
| 39 | 480.1–486.9 | Bias operates across both explicit, consciously endorsed judgments and implicit, automatic mental associations. |
| 40 | 487.3–497.5 | Anthony Greenwald and Mahzarin Banaji established the formal study of implicit social cognition in their foundational nineteen ninety-five Psychological Review article. |
| 41 | 497.8–520.6 | Greenwald and Banaji define implicit attitudes as introspectively unidentified or inaccurately identified traces of past experience that shape favorable or unfavorable feeling, thought, or action toward social objects. In plain words, past experiences leave mental shortcuts that steer reactions without the person noticing where those reactions came from. |
| 42 | 521.0–532.0 | Notice the precision of that definition. An implicit bias runs automatically from accumulated surroundings even when the person holding it sincerely believes in equal treatment. |
| 43 | 532.3–543.9 | Three years later, in nineteen ninety-eight, Anthony Greenwald, Debbie McGhee, and Jordan Schwartz introduced the Implicit Association Test in the Journal of Personality and Social Psychology. |
| 44 | 544.3–559.3 | That nineteen ninety-eight test measured automatic mental associations by recording response-latency differentials in computerized sorting tasks — that is, split-second differences in how fast a person pairs faces and words on a screen. |
| 45 | 559.6–567.3 | Whether measured through reaction times or field audits, bias names a mental lean or weighting inside an individual's judgment. |
| 46 | 567.7–581.0 | Why does prejudice need its own label once bias is defined? The second concept is prejudice. Gordon Allport provided the classic definition in his nineteen fifty-four book The Nature of Prejudice, at page nine. |
| 47 | 581.3–590.9 | Allport defines ethnic prejudice as an antipathy grounded in a faulty and inflexible generalization, which may be felt internally or expressed outwardly. |
| 48 | 591.2–601.3 | Allport specifies that this hostility may be directed toward a group as a whole, or toward an individual specifically because that individual belongs to that group. |
| 49 | 601.7–611.9 | Where bias captures a mental lean or association, prejudice names an emotional hostility tied to a rigid, sweeping stereotype that resists contrary evidence. |
| 50 | 612.2–621.6 | Allport observed in nineteen fifty-four that people whose prejudice is habitual resist correcting their stereotype even when shown strong contradictory facts. |
| 51 | 622.0–631.1 | When met with a person who contradicts the group stereotype, the prejudiced mind fences that person off as a lone exception while keeping the stereotype intact. |
| 52 | 631.5–645.1 | Why does Fiske treat discrimination as its own category beside stereotyping and prejudice? The third concept is discrimination. Discrimination moves from internal thought and feeling into observable outward action. |
| 53 | 645.4–657.0 | Susan Fiske synthesized the standard three-part model in the nineteen ninety-eight fourth edition of the Handbook of Social Psychology, volume two, pages 357 through 411. |
| 54 | 657.3–671.7 | Fiske's chapter divides intergroup responses into three distinct psychological parts: stereotyping as the cognitive or thinking part, prejudice as the affective or feeling part, and discrimination as the behavioral or acting part. |
| 55 | 672.0–684.3 | In that three-part division, a stereotype supplies the group belief, prejudice supplies the emotional hostility, and discrimination carries out unequal treatment toward people because of group membership. |
| 56 | 684.6–694.3 | Unequal treatment between individuals includes verbal exclusion, worse customer service, biased grading, or refusing to rent an apartment to a qualified tenant. |
| 57 | 694.6–701.5 | Look closely at what bias, prejudice, and discrimination share across Greenwald and Banaji, Allport, and Fiske. |
| 58 | 701.8–711.4 | All three terms describe mental and behavioral actions that happen inside or between individuals and can run in any direction between any two social groups. |
| 59 | 711.8–720.4 | Any human being of any skin color or ancestry can hold a mental bias, feel a rigid hostility, or treat a member of another group unequally. |
| 60 | 720.8–730.1 | Those person-to-person actions require zero control over state legislatures, appellate courts, police departments, credit markets, or military force. |
| 61 | 730.5–740.4 | The Original Power assigns bias, prejudice, and discrimination to the interpersonal class of social behavior, where they already have exact scientific names. |
| 62 | 740.7–751.6 | This is where the established literature ends. Bias, prejudice, and discrimination name person-to-person operations with standard definitions from experimental psychology. |

## Rules (the author's standing rules)

- **Show, don't describe.**
  - Every concept gets a picture that does work.
  - Every equation is animated with at least one variable swept, labelled "derived" where it is.
  - Never flash an equation. Introduce each term, then assemble the equation. Use
    `equations/EquationTerms` so each symbol keeps its registry colour and pulses on its spoken
    word. Add any new symbol, such as L, R, C or q(t) for turn 38, to the registry table in your
    storyboard, with a free palette slot.
- **Teach.**
  - When the narration asks "why", put the question on screen (turns 46 and 52).
  - Plain-language restatements, such as "In plain words…" in turn 41 or the reaction-time
    explanation in turn 44, get their own picture: for the IAT, a derived face/word sorting task
    with a latency difference.
  - Mark where the established literature ends (turn 62) and where the book's structural argument
    begins. Turn 63 is the next section.
- **Reuse and continuity.**
  - Bias, prejudice and discrimination keep the icons and colours they had in turns 16–34.
  - Turns 35–37 continue the Π_race picture from turns 33–34.
  - Turns 57–61 gather the three terms into the interpersonal class. Show "any direction between
    any two groups" with the us/them field and arrows that run both ways.
  - Turn 60's list of state powers (legislatures, appellate courts, police, credit markets,
    military) shows as a set that the interpersonal class does not touch. State it positively:
    "requires zero control over…".
- **On-screen text** uses direct declarative statements with no antithesis: no "not X but Y", no
  "X, not Y", no "more than", no corrective contrast. Where a narration line contrasts, the screen
  states the positive claim.
- **Visual system:**
  - the dashboard tokens;
  - `SceneBorder` with the notch (no map);
  - 1920 × 1080;
  - body text at least 28 px, labels at least 20 px;
  - subscripts through `MathText`, never underscores;
  - no photographs of real people. Citation cards show names, year and title only.
- **Determinism:** every beat is a pure function of time and cue. Do not describe hover or click.

## Output format (`STORYBOARD_MIN7_12.md`)

Follow `STORYBOARD_MIN3_7.md`'s sections:

1. **The scene list.** Scenes are named in PascalCase. A scene may span consecutive turns that
   develop one picture.
2. **One section per scene**, containing:
   - the turns and time window, and a one-line purpose;
   - layout boxes in pixels, inside the safe area;
   - a beat table: cue name (turn-prefixed camelCase, unique across the whole episode), spoken
     word, occurrence, and what happens. Check each word against `word_timings.json`;
   - every on-screen string, verbatim;
   - the tex or bib line for every claim;
   - each equation's sweep;
   - the shared components the scene uses.
3. **Shared components.** List the new components with their props, and the existing ones to
   reuse from `min3_7/shared/` and `equations/`.
4. **Build split.** Four packages, E–H, each about 80 seconds of picture and sharing no files
   beyond the shared components. Name which new shared components must be built first.
5. **YAML.** A ready-to-paste `stage_ov.yaml` block: shots `S00-35` … `S00-62`, each with
   `turn_id`, `scene`, `instance` (equal to the scene name) and cues, using the cue syntax already
   in `stage_ov.yaml`.
6. **Open sourcing items and files touched.** Include your before/after `git status`.
