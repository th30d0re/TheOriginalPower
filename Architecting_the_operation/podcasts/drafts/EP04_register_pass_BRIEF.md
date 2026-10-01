# Brief: EP04 register pass (college / graduate level)

## Rules (read first)
- Read `AGENTS.md` (the rhetorical constraint is a hard rule) and the format section of
  `Architecting_the_operation/README.md` before writing.
- Write exactly TWO files:
  1. `Architecting_the_operation/podcasts/drafts/ATO_EP04_register_pass.md` — the full revised script.
  2. `Architecting_the_operation/podcasts/drafts/ATO_EP04_register_pass_NOTES.md` — the change log.
- Do NOT edit `ATO_EP04_what_power_is.md` or any other file. Do not run git or make.
- Before finishing, run `python3 tools/check_antithesis.py <your draft>` and fix every CERTAIN hit
  in host prose. Paste its last line in your final message.

## Source
Start from `Architecting_the_operation/podcasts/ATO_EP04_what_power_is.md` (current, ~11,600 host
words, ~71 min). Ground every technical statement in `Paper/The_Original_Power.tex`.

## Audience and register
The author is retargeting the show: listeners with college or graduate education and the
emotional and material literacy to follow a technical argument. No five-level scaffolding.
Remove elementary, middle-school, and high-school explanations: re-explanations of what was just
said, "say more" prompts, lay definitions of common things (e.g. "A transistor. A real one, the
thing your phone is full of."), repeated summaries, and analogies that stand in for the claim when
the book states the claim directly. Replace them with the book's own constructs, named precisely:
- the five tiers by their book names (Elite, Puppet Class, Enforcement Class, Buffer Class,
  Out-group) and what each does (tex ~245-252);
- Social Identity Theory (Tajfel & Turner 1979) as the cognitive substrate the book starts from,
  and the book's move past it: "legal and social systems feed it malicious priors", the fractal
  mind virus, two coupled runtimes, institutional and cognitive (tex ~245-252, ~2111);
- Du Bois's psychological wage and the book's status wage (W = psi_m + j psi_s, spoken in words);
- the Drude resistance model (mean free time between collisions) (tex ~932-950);
- inductive kickback / Lenz (backlash), the Concession Theorem (delta-max equals zero),
  non-commutative policy sequence, multiplicative intersection compounding (tex ~5272, ~12680);
- Model C, the interference engine, class band vs identity bands (tex ~6720-7080);
- 1705 / Bacon's Rebellion where the script already gestures at the installed partition.
Use only references and figures that appear in the tex or in the EP04 notes. Never invent a study,
a statistic, a date, or a quotation.

## The worked example the author gave
The script says the machine "hands out" the two-box picture (Emmanuel's turn near 15:17 and the
weather-picture section). Elevate it: sociology and social psychology teach in-group/out-group
bias, Social Identity Theory, prejudice, cognitive bias, and stop at cognition. They do not teach
how institutions install and pay for the partition. Emmanuel can say this from his own coursework,
in first person, without claiming facts about specific curricula or institutions.

## Constraints
- Spoken audio: everything must be speakable by TTS. No symbols, Greek letters, equations, or
  markdown in turn text; say "psi-m", "the status wage", "delta-max equals zero" in words, sparingly.
  Numbers in words, as the script does now.
- Do not touch any `[clip:...]` turn (speaker label or text). Do not change speaker names.
  Keep every header in the exact form `Name (MM:SS)`; timestamps may be left as they are.
- Keep the cold open (through Toussaint's "Where you aim the anger matters…" turn) and the
  targeting-error segment that follows the show intro: tighten host lines there only if they
  read below the target register, and keep every case fact exactly as written (it was
  fact-checked; see `notes/EP04_cornell_case_record.md`).
- Keep the episode's arc, the three questions, and the closing. Keep the persuasion choices
  (camp three affirmed on the count, refutational two-sided structure).
- Length: technical density must not add length. Target at most 10,000 host words (cut about 14%)
  by removing redundancy and scaffolding.
- Never refer to the episode as "the hour" or "tonight".

## NOTES file format
For each changed or cut turn: original header, one line on what changed and why, and for any new
technical claim the tex line number it rests on. End with host word counts before and after.
