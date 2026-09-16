# D_equations_without_visuals

**Question.** How should equations, mathematical notation, graphs, and diagrams be conveyed in audio alone? Cover MathSpeak and accessible description guidelines, how science audio journalists handle numbers and formulas, and what must be carried by speech when no visual is available.

Conveying complex equations, mathematical notation, graphs, and visual diagrams in an audio-only medium requires navigating the fundamental constraints of human working memory and transient speech. Below is an evidence-grounded analysis covering accessibility frameworks, audio journalism practices, and cognitive constraints.

---

### 1. Conveying Equations & Mathematical Notation in Audio Alone

#### A. MathSpeak & Disambiguation Rules
* **The Ambiguity Problem**: Everyday spoken language is inherently ambiguous when describing mathematical expressions [1, 2]. For example, the spoken phrase *"the square root of a plus b"* can be interpreted as either \\(\sqrt{a}+b\\) or \\(\sqrt{a+b}\\) [1].
* **The MathSpeak Rule Set**: Developed by blind mathematician Dr. Abraham Nemeth (creator of Nemeth Braille) and refined by gh LLC and Purdue University, **MathSpeak** establishes a standardized, character-by-character rule set to speak mathematics without ambiguity [3-5]. It introduces explicit structural indicators:
  * \\(\sqrt{a}+b\\) is rendered as `"start root a end root plus b"` [1].
  * \\(\sqrt{a+b}\\) is rendered as `"start root a plus b end root"` [1].
  * Fractions use structural anchors: `"start fraction [numerator] over [denominator] end fraction"` [6].
* **ClearSpeak Alternative**: Texthelp's **ClearSpeak** speech engine provides a more natural, conversational phrasing (e.g., `"the fraction with numerator a plus b and denominator c"`) suitable for general audiences, whereas MathSpeak prioritizes strict structural precision for technical dictation [7].
* **Evidentiary Basis & Specific Study**: **Isaacson, Schleppenbach, & Lloyd (2014)** conducted an automated **controlled laboratory experiment** (\\(N=52\\)) evaluating MathSpeak versus common spoken math [8, 9]. Participants scored **18.93 out of 20** correct with MathSpeak versus **8.07 out of 20** (chance level) without MathSpeak (\\(p < .001\\)), establishing that MathSpeak successfully disambiguates spoken math after just 4 minutes of instruction [9, 10].

#### B. Accessible Description Guidelines for Notation
* **Symbol Expansion Rules**: The National Center for Accessible Media (**NCAM** at GBH/WGBH) and the **DIAGRAM Center** specify that simple equations should be read by explicitly expanding symbols into full words ("plus", "minus", "equals", "squared", "to the sixth power", "square root of") [11, 12]. Nested or non-standard notation must be written out fully in spoken text rather than relying on concise visual shorthands [11].
* **Evidentiary Basis**: **Practitioner experience and accessibility standards** (GBH/WGBH NCAM Guidelines [11-13]; DIAGRAM Center [14]).

---

### 2. Conveying Graphs & Visual Diagrams in Audio

#### A. The Summary-First Principle & Table Conversion
* **Trend Over Detail**: Guidelines from **NCAM and the DIAGRAM Center** mandate that when converting visual graphs (bar charts, line graphs, pie charts) into audio descriptions, producers must state the title, label the x- and y-axes, and provide a high-level conceptual summary of overall trends first (e.g., *"In each state, coverage increases over time"*) [15, 16].
* **Elimination of Visual Clutter**: Visual attributes—such as bar colors, solid vs. dashed lines, or pie slice shading—should be omitted entirely unless strictly required to answer a specific question [15-17]. Data should be organized logically (e.g., listing pie chart categories from smallest to largest percentage) [17].
* **Scatter Plots & Relational Diagrams**: Require defining axis scales, describing cluster density/direction, highlighting macro-correlations, and noting significant outliers [18].
* **Evidentiary Basis**: **Practitioner experience and accessibility standards** (DIAGRAM Center [15-17]; NCAM / GBH Guidelines [13, 19]).

---

### 3. How Science Audio Journalists Handle Numbers & Data

#### A. Rounding and Approximating Numbers
* **Rule**: Spoken audio is strictly linear and transient; precise figures fly past the ear in an instant and cannot be processed or re-examined on a live broadcast [20-23]. Audio journalists round off exact numbers (e.g., turning "1,987,452" into "nearly two million") and use conversational approximations like "about half" or "more than double" [21, 23, 24].
* **Evidentiary Basis**: **Practitioner experience** (**Jonathan Kern / NPR Guide** [23, 25]; **Journalism University / NBC News Academy** [21, 26]; **University of Dayton Style Guide** [21]).

#### B. Limiting Figure Density & Sentence Length
* **Rule**: Broadcast scripts enforce strict limits on data density, avoiding stacking multiple statistics within a single sentence or story segment [23, 26]. Audio writers enforce "One Thought Per Sentence" (OTPS) with sentence lengths kept to 15–20 words (\\(\le 17\\) words) to match human breathing and listening capacity [22, 27, 28].
* **Evidentiary Basis**: **Practitioner experience** (Journalism University [22, 26, 27]; NPR / Kern [23]; Dramarrator computational script analysis [28]).

#### C. Concrete Analogies & Text Normalization
* **Rule**: Abstract numbers must be translated into tangible physical comparisons (e.g., translating a \$50 million budget cut into "enough money to fund three new schools") [26]. For text-to-speech (TTS) script preparation, technical guidelines require explicit pre-normalization of currency, dates, and units into full spoken words (e.g., "\$42.50" \\(\rightarrow\\) "forty-two dollars and fifty cents") [29-32].
* **Evidentiary Basis**: **Practitioner experience & technical documentation** (AFTRS Media Lab [29]; ElevenLabs Documentation [30-32]; Journalism University [26]).

---

### 4. What Speech Must Carry When Visuals Are Absent

#### A. Constructing Conceptual Mental Models
* **Transience & Cognitive Load Constraints**: Spoken information is **transient**—once uttered, it disappears immediately [33, 34]. Attempting to recite complex equations or spatial diagrams verbatim in audio transforms permanent visual representations into transient speech, causing rapid working memory overload and forgetting [33-35].
* **Dual-Coding Offloading**: Paivio's **Dual-Coding Theory** establishes that learning relies on complementary verbal and visual channels [36, 37]. When no visual channel is present, audio cannot simply act as an exact verbal transcript of a page; speech must actively construct a mental model using spatial metaphors, physical analogies, and conceptual relationships [20, 38-40].
* **Evidentiary Basis**: **Controlled laboratory experiments** (**Leahy & Sweller, 2003, 2016** [33, 41, 42]; **Davis et al., 2026** [38, 39, 43]) and **cognitive theory** (**Clark & Paivio, 1991** [36]).

#### B. Essential Companion Materials
* **Rule**: Because formal derivations and detailed statistical graphs cannot be fully comprehended through transient speech alone, professional producers provide companion text notes, transcripts, or video shot lists alongside the audio episode [38, 44, 45].
* **Evidentiary Basis**: **Practitioner experience & observational data** (NPR.org / Ellen Weiss & Todd Holzman [44]; Amplify Manifesto [45]; Davis et al., 2026 interview data [38]).

---

### 5. Disagreements, Evidence Thinness, & Methodological Gaps

1. **Accessibility Precision vs. Podcast Narrative Flow**:
   * *The Tension*: Formal accessibility standards (**MathSpeak / Nemeth Code**) mandate character-by-character structural syntax (`"start fraction... end fraction"`) to ensure exact, non-ambiguous dictation for blind students [1, 4, 5]. Conversely, audio journalism coaches (**Kern / NPR**) and cognitive load researchers (**Leahy & Sweller**) demonstrate that reciting line-by-line syntax in general podcasts imposes extreme **transient cognitive load**, destroying narrative momentum and listener engagement [20, 23, 25, 35].
2. **Thinness of Empirical Data on Long-Form Podcast Math**:
   * *Evidence Gap*: While **Isaacson et al. (2014)** provides **controlled experimental evidence** for MathSpeak disambiguating short, isolated equations among print-disabled learners [8-10], there is **zero controlled experimental research** evaluating general audience retention or comprehension when complex mathematical notation or diagrams are delivered via MathSpeak versus conceptual analogies in long-form audio episodes.

---

📊 Would you like to draft a standardized style guide entry for your scriptwriters that defines how to translate mathematical equations into conceptual audio analogies versus companion text notes?


## Sources cited

- [1, 3, 4, 8, 9, 10] Increasing STEM Accessibility in Students with Print Disabilities through MathSpeak https://jsesd.github.io/web-articles/JSESD-Volume-14/1015-Isaacson/
- [2, 5] What is MathSpeak? - DO-IT: Disabilities, Opportunities, Internetworking, and Technology - University of Washington https://doit.uw.edu/knowledge-base/what-is-mathspeak
- [6, 7] ClearSpeak And MathSpeak Speech Engines In Equatio | T - Texthelp® Support https://support.texthelp.com/help/clearspeak-and-mathspeak-speech-engines-in-equatio
- [11, 12] Invent + Build / Web + Multimedia / Accessible Digital Media Guidelines / ADM Guidelines: Appendices / NCAM http://ncamftp.wgbh.org/ncam-old-site/invent_build/web_multimedia/accessible-digital-media-guide/adm-guidelines-appendices.html
- [13, 19] Effective Practices for Description of Science Content - Resources | GBH - WGBH https://www.wgbh.org/ncam-resources/2026-08-11/effective-practices-for-description-of-science-content-within-digital-talking-books-resources
- [14, 15, 16, 17, 18] Specific Guidelines - Graphs - DIAGRAM Center http://diagramcenter.org/specific-guidelines-e.html
- [20] A Guide to Translating Science to Audio - The Open Notebook https://www.theopennotebook.com/2018/06/26/a-guide-to-translating-science-to-audio/
- [21, 26, 27] Crafting Compelling Scripts for TV News Anchors - Journalism University https://journalism.university/broadcast-and-online-journalism/compelling-scripts-tv-news-anchors/
- [22, 23, 24] The Distinctive Language of Radio Versus Print - Journalism University https://journalism.university/broadcast-and-online-journalism/language-differences-radio-print/
- [25] Sound Reporting: The NPR Guide to Audio Journalism and Production (9780226431789): Jonathan Kern - BiblioVault https://www.bibliovault.org/BV.book.epl?ISBN=9780226431789
- [28] Dramarrator: Object-Based Audio Editing for Audio Drama Production from Books - arXiv https://arxiv.org/html/2608.08349
- [29] ADVANCED PODCASTING | AFTRS Media Lab https://medialab.aftrs.edu.au/wp-content/uploads/2021/07/AFTRS16_Podcasting.pdf
- [30, 31, 32] Best practices | ElevenLabs Documentation https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices
- [33] Cognitive load theory and the effects of transient information on the modality effect https://researchers.mq.edu.au/en/publications/cognitive-load-theory-and-the-effects-of-transient-information-on/
- [34] The Transient Information Principle in Multimedia Learning (Chapter 21) https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/transient-information-principle-in-multimedia-learning/670D96C3B9520320CE558AA855A49EE9
- [35] Research: Transient information effect - Tips for Teachers by Craig Barton https://tipsforteachers.co.uk/research-transient-information-effect/
- [36, 40] Dual Coding Theory: What It Is and When Visuals Backfire - Structural Learning https://www.structural-learning.com/post/dual-coding-a-teachers-guide
- [37, 41, 42] When auditory presentations should and should not be a component of multimedia instruction - TECFA https://tecfa.unige.ch/tecfa/teaching/methodo/Leahy_etal03.pdf
- [38, 39, 43] Cognitive Load and Working Memory in Multimedia Video Podcasts: Effects of Elaborative and Seductive Details - MDPI https://www.mdpi.com/2079-3200/14/5/74
- [44] Sound Reporting: The NPR Guide to Audio Journalism and Production by Jonathan Kern, an excerpt - The University of Chicago Press https://press.uchicago.edu/Misc/Chicago/431789.ht
- [45] The Amplify Manifesto: Rewind, Replay, Reflect - UOW Open Access Journals https://www.uowoajournals.org/rdr/article/42/galley/41/view/