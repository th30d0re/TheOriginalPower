# Shot-list task: YT01 on-screen plan

**Never run git. Do not touch `Paper/`. Write only the files listed under "Outputs".
No helper scripts left behind.**

Input: the finished script `Architecting_the_operation/podcasts/YT01_what_racism_really_is.md`
and `BRIEF.md` in this folder (its "Visual system" section and the "On screen" column of
the segment table are the plan you are expanding). Format model:
`Architecting_the_operation/video/q9_louijeune_reply_shotlist.md`; card JSON model:
`Architecting_the_operation/video/cards_q9reply_v2/*.json`; citation table model:
`Architecting_the_operation/video/reel_reciprocity/citations.md`.

## Rules

- **One shot per turn.** Every turn in the script gets exactly one shot whose anchor is
  that turn's header, e.g. `Emmanuel Theodore (12:34)`. Group shots under the segment's
  `<!-- SEG NN -->` heading. Consecutive turns may share one visual by marking the later
  shots `Type: hold` with `Holds: <shot id>`.
- **Shot ids** `S<seg>-<nn>`, e.g. `S03-07`.
- **Everything renders in manimgx** (BRIEF, "Visual system"). **Fields per shot:**
  `Anchor`, `Type` (`card` | `equation` | `diagram` | `figure` | `hold` | `title`),
  `Render` (`manim:<file>:<Scene>`; card shots also name `cards/<shot id>.json`), `Note` (what is on screen, in one or two lines, and the
  provenance tag `[book]` with a quoted phrase of four or more words from the tex, or
  `[source]` with the citation key).
- **Card JSON.** For every `card`, `equation` and `figure` shot write the data into
  `yt01_redefining_racism/cards/<shot id>.json` with a `kind` field: `title`, `stat_bars`,
  `quote`, `table`, `equation`, `figure`, `source`, `compare`, `timeline`. Field names
  may follow the Q9 card JSON (`headline`, `items`, `sources`, `qrUrl`); equations carry
  `latex` (copied verbatim from the tex, including `\dot\cup`), `number`, and `terms`
  `[{latex, gloss}]` in the order the narration introduces them. These JSON files are
  the contract for the manimgx card library that will be built next; keep the schema
  consistent and document it at the top of `shotlist_findings.md`. Card
  text obeys the BRIEF's no-antithesis rule.
- **Every equation turn** gets an `equation` card or a dedicated manimgx scene. The term list follows
  the order the narration introduces the symbols.
- **Every figure** (2.1–2.9) and Table 2.1 appears when the narration names it: PNGs
  from `figures/` with callouts (`figure` cards) for 2.4 and 2.7 (use the panel PNGs for
  2.7 one panel per turn), manim rebuilds for the TikZ figures, with the page still
  (`figures/fig2.*_p*.png`) named as fallback in the Note.
- **Every empirical claim** with a source in the chapter gets a source line on its card
  and a QR (`qrUrl`) when the chapter's bibliography entry gives a DOI or stable URL
  (look up the key in `Paper/references.bib`). No QR for a source without one; never
  invent a URL.
- **manim scenes** to be built later: list each distinct scene once in a
  `## Scene inventory` section at the end, with its class name, file name under
  `yt01_redefining_racism/manim/`, the shots it covers, the beats it must hit (cue words
  from the script turns), and which existing `video/uef/*.py` scene it ports, if any.
  `orthographic16x9.py` (`Orthographic16x9`) already exists.

## Outputs

- `Architecting_the_operation/video/YT01_shotlist.md`
- `Architecting_the_operation/video/yt01_redefining_racism/cards/*.json`
- `Architecting_the_operation/video/yt01_redefining_racism/citations.md` (every source
  shown on screen, full reference and URL, in on-screen order)
- `Architecting_the_operation/video/yt01_redefining_racism/logs/shotlist_findings.md`
  (counts: turns, shots, cards, manim shots, figures; any turn you could not illustrate;
  any source key missing from references.bib)
