# Brief: storyboard for YT02v2_ov turns 11–34 (2:18.7–7:04.6)

This is a design task. Write **one file** and nothing else:

`Architecting_the_operation/video/yt02/stage/STORYBOARD_MIN3_7.md`

Do not write code, scripts or any other file, and do not run git commands that change state.
Run `git status --short` before and after you write. List anything new outside that one file in
the storyboard's last section; there must be nothing.

## Context

The episode is "What Racism Is" (Episode 1). Its picture is being rebuilt as code, as
TypeScript/React scenes on the Stage engine. The author approved minutes one and two (turns 0–10).
To see what exists, read these:

- **Engine and episode code:**
  - `Architecting_the_operation/video/yt02/stage/` holds `firstminute/`, `minutetwo/`,
    `dashboard/`, `stage_ov.yaml`, `BRIEF_FIRST_MINUTE.md` and `BRIEF_MINUTE_TWO.md`. The two
    briefs describe the visual language, the deterministic rules, and how each beat lands on a
    spoken cue word.
- **Turns 0–10:**
  - `../STAGE_PLAN.md` describes the first minute.
  - `BRIEF_MINUTE_TWO.md` describes turns 6–10: the dictionary senses and the Figure 2.3
    recreation.
- **Narration:**
  - Each turn's words with their start times (turn-relative) are in
    `outputs/YT02v2_ov/word_timings.json`, keyed by `turn_id`.
  - The turn order and start times are in `outputs/YT02v2_ov/episode_manifest.json`. Turns are
    indexed from 0.
  - The table below gives the text and the episode times.
- **Manuscript:** `Paper/The_Original_Power.tex`. It is the authority for every claim, label and
  equation on screen. Anchors:
  - Line 242–243: the note on terms and host wetware. It covers:
    - the APA definitions of ingroup, outgroup and ingroup bias;
    - the definitions of bias, prejudice and discrimination, with their citations;
    - Tajfel & Turner 1979;
    - the wetware / predictive network passage;
    - racism as psycho-legal social software.
  - Lines ~1885–1915: racism set apart from prejudice.
  - Lines 2127–2136: "Host wetware" and the equation
    `P_i(T | X, Π_race) ∝ P(X | T) · P_i(T | Π_race)`, which is Π_race as a prior given excessive
    precision.
  - Line 1803: Eq. 1.3, the conventional causal arrow, already shown in turn 1.
  - Lines ~1937–1971: Figure 2.3, shown in turn 10.

## Narration, turns 11–34

| Turn | Episode time | Text |
|---|---|---|
| 11 | 138.7–151.3 | That numbered sequence does analytical work before any argument begins. A numbered dictionary entry acts as an unstated theory of cause and effect: the order on the page tells the reader what caused what. |
| 12 | 151.6–162.3 | Placing personal hostility in the first slot tells the reader that private hatred is the root cause and institutional patterns are side effects that grow out of it later. |
| 13 | 162.7–171.2 | Under that ordering, public debate turns automatically into an audit of individual hearts, private vocabulary, and personal moral intentions. |
| 14 | 171.5–180.4 | When a public figure, a court, or a workplace confronts a racial disparity, the default definition asks who held malice inside their private thoughts. |
| 15 | 180.8–190.3 | The Original Power treats that causal ordering as a testable historical claim that can be stated formally and checked against five centuries of primary records. |
| 16 | 190.6–207.5 | Why separate bias, prejudice, and discrimination before naming racism? Clear analysis requires exact words before any formal modeling begins. Everyday conversation blends four distinct terms into one shared bucket: bias, prejudice, discrimination, and racism. |
| 17 | 207.9–215.8 | In the social sciences, the first three terms carry distinct technical definitions developed across experimental and social psychology. |
| 18 | 216.1–225.2 | The Preface and Chapter 2 of The Original Power adopt those established definitions directly so that each term does a specific analytical job. |
| 19 | 225.6–240.3 | The baseline begins with how human minds sort people into groups. The American Psychological Association Dictionary of Psychology defines an ingroup as a social unit in which a person holds membership or psychological identification. |
| 20 | 240.6–252.0 | The same reference defines an outgroup as any social unit outside a person's own group membership or identification, toward which that person feels detachment, competition, or opposition. |
| 21 | 252.3–264.8 | The American Psychological Association Dictionary defines ingroup bias as the tendency to favor one's own group and its members when dividing resources, judging conduct, and explaining behavior. |
| 22 | 265.1–275.2 | Henri Tajfel and John Turner formalized this dynamic in their nineteen seventy-nine formulation of Social Identity Theory within the psychology of intergroup relations. |
| 23 | 275.6–283.9 | Social Identity Theory demonstrates that human beings sort their social world into us and them with remarkable speed and minimal prompting. |
| 24 | 284.3–294.3 | That sorting mechanism evolved in small bands and alliances to manage trust, threat detection, reciprocity, belonging, and self-concept inside bounded groups. |
| 25 | 294.7–305.1 | In the terminology of the book's Preface, the human brain operates as biological host wetware: a predictive, pattern-compressing neural network tuned for fast categorization. |
| 26 | 305.5–314.6 | Because mental bandwidth is finite, the brain compresses complex social variation into simple group labels long before slow, deliberate reasoning starts. |
| 27 | 315.0–324.7 | That fast pattern compression served survival in small ancestral bands, where telling allies apart from strangers carried immediate physical consequences. |
| 28 | 325.1–335.9 | On top of that shared mental baseline, experimental psychology distinguishes three specific interpersonal concepts that govern how individuals process and act upon group categories. |
| 29 | 336.3–346.9 | The first concept is bias. Bias is a tendency or lean that favors or disfavors individuals or groups in perception, evaluation, and explanation because of group membership. |
| 30 | 347.3–367.9 | Why does the brain carry bias at all? Predictive-coding accounts treat perception as continuous error reduction: top-down priors meet incoming sensory data, and the nervous system updates or overrides. In plain words, the brain constantly guesses what it is about to see and compares that guess against what the senses report. |
| 31 | 368.2–382.5 | In that architecture, bias names a tilt in the starting assumption, not a moral defect in the brain's wiring. The guessing machinery is general-purpose; harm enters when a legally enforced racial division is given overwhelming weight. |
| 32 | 382.8–399.6 | Computer science uses the same word in two distinct ways. A neural network's bias term is a numerical offset in each layer. Social bias in large language models is different: it sits in weights trained on human text and repeats patterns found in that training text. |
| 33 | 400.0–411.9 | The book names the installed racial prior Pi-sub-race. Stereotypes compress into Bayesian priors that can override sensory evidence once institutions give that starting assumption high weight. |
| 34 | 412.3–424.6 | Bias therefore spans sociology, neuroscience, and machine learning as a property of prediction from prior experience. A starting assumption can be accurate, outdated, or earned by real history. |

## Rules the storyboard must follow (the author's standing rules)

- **Show, don't describe.**
  - Every concept gets a picture that does work.
  - Every equation gets an animation of what it represents, with at least one variable swept and
    its effect shown. For example, sweep the precision (weight) of Π_race in the line-2132
    equation and show the posterior moving from the evidence to the prior.
  - Derived behaviour is welcome when it is labelled "derived".
  - Never flash an equation. Introduce each component first, then highlight each term as it is
    spoken.
- **Teach.**
  - When the narration asks "why", put the question on screen.
  - Put the established literature first, and mark where the book's own material begins: turn 18
    and turn 25 are the hand-offs.
- **Quotes and definitions.**
  - Show the quoted definition with its source line: "APA Dictionary of Psychology", "Tajfel &
    Turner 1979", and so on, following the manuscript's citations.
  - Do not invent quotes or numbers.
  - The on-screen wording of a definition follows the narration, since the narration is the
    author's approved script. Mark it "(paraphrased)" when it differs from the source.
- **On-screen text** uses direct declarative statements. **No antithesis**: no "not X but Y",
  "X, not Y", "more than", and no corrective contrast. Some narration lines contain antithesis.
  The on-screen text for those lines must state the positive claim only. For turn 31, for
  example, "bias = a tilt in the starting assumption".
- **Reuse.**
  - Turn 11 continues from Figure 2.3 (turn 10) and from the Eq. 1.3 chain (turn 1).
  - Turn 16 reuses the four terms; the first minute's turn 3 shows bias, prejudice and
    discrimination as stacked blocks.
  - Keep one consistent visual for each construct across the episode.
- **Visual system.**
  - The dashboard tokens: navy field, cream and gold, red marker, IBM Plex.
  - The card border with the five-tier notch. These scenes have no map, so they use
    `SceneBorder`.
  - Fixed 1920 × 1080.
  - Body text at least 28 px.
  - Real subscripts (Π with subscript "race"), never underscores.
- **Determinism.** Every beat is a pure function of time and cue. Interactive controls exist only
  on the site, so do not describe hover or click in the video.
- **Images.** Do not use photographs of real people. A citation card for Tajfel & Turner shows
  names, year and title only.

## Output format (`STORYBOARD_MIN3_7.md`)

1. **Scene list.** Group turns into scenes. One scene may span several consecutive turns when
   they develop one picture, for example turns 22–24 and turns 25–27. Each turn is its own shot
   in the plan, and shots that share a scene share a scene component. Name each scene in
   PascalCase.
2. **One section per scene**, containing:
   - turns and episode time window;
   - purpose, one line;
   - the layout, with rough pixel boxes;
   - a beat table with columns **cue name** (turn-prefixed, camelCase, e.g. `t19Ingroup`),
     **spoken word**, **occurrence**, **what happens**. The spoken word must appear in that turn's
     words in `word_timings.json`. Check it, and give the occurrence number when a word repeats;
   - every on-screen string, verbatim;
   - every manuscript claim, label or equation used, with its tex line number;
   - any equation's sweep: which variable, its range, and what the viewer sees change;
   - the shared components it uses.
3. **Shared components.** List the components more than one scene needs, with their props: for
   example a `DefinitionCard` (term, definition, source, paraphrased flag), a `CitationCard`, the
   Π_race Bayesian-update plot, and an us/them sorting field.
4. **Build split.** Divide the scenes into four roughly equal build packages, A–D, each about 70
   seconds of picture. Packages must not share files beyond the shared components. Say which
   shared components must be built first.
5. **YAML.** A ready-to-paste `stage_ov.yaml` block, with one shot per turn `S00-11` … `S00-34`,
   each with `turn_id`, `scene` and `cues`. Use the cue names from the beat tables. Take the turn
   IDs from the manifest.
6. **Files touched.** Your before/after `git status` comparison.
