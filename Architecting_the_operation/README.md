# Architecting the Operation

Episode workspace for the podcast and video series on *The Original Power*.

```
podcasts/   scripts, one per episode, pipeline-parseable
video/      shot lists, one per episode
notes/      Emmanuel's reading notes, raw input
```

## Episodes

| Episode | Book section | Script | Shot list | Notes |
|---|---|---|---|---|
| 1 | Author's Preface | `podcasts/ATO_EP01_authors_preface.md` | `video/ATO_EP01_shotlist.md` | none |
| 2 | Preface (framework) | `podcasts/ATO_EP02_preface.md` | `video/ATO_EP02_shotlist.md` | `notes/TOP02_preface_overview_transcript.md` |

Episode 1 was drafted from the manuscript and from Emmanuel's own interjections in the
NotebookLM session on the Author's Preface.

Episode 2 was drafted from the Preface itself (`Paper/The_Original_Power.tex:174`),
with its objections taken from `podcasts/ATO_EP0.md`. That file is an earlier
interview-format draft on the same section: bold headers make it unparseable, and its
twelve questions were written to be answered on mic. Episode 2 converts them into the
teaching spine, so Toussaint and Aisha raise each objection and the answer follows.
`notes/TOP02_preface_overview_transcript.md` supplied the ordering of topics and
nothing else; its vernacular is the formulaic antithesis the project bans.

The book has two front pieces and they cover different ground. The **Author's Preface**
(`Paper/The_Original_Power.tex:141`) is the research lineage: four documents over five
years. The **Preface** (`:164`) defines the framework itself: psycho-legal social
software, wetware, the fractal mind virus, the five-tier hierarchy. `ATO_EP0.md` was
written against the second one.

## Script format contract

`voice_pipeline/parser.py` accepts exactly one header shape:

```
Display Name (MM:SS)
Body text on the following lines.
```

Rules that the pipeline enforces, and what breaks when they are violated:

- **No markdown bold on the header line.** The regex anchors on the closing paren at
  end of line, so `**Name (00:01)**` matches nothing and the whole file yields zero
  turns. This is why `ATO_EP0.md` currently fails to parse.
- **Speaker names must resolve to ids in `voice_pipeline/voices.yaml`.** The id is the
  lowercased name with spaces as underscores. Currently configured: `emmanuel_theodore`,
  `toussaint`, `aisha`.
- **Every line inside a turn is spoken.** Stage directions, graphic cues, and
  `[RECORD ANSWER HERE]` placeholders get read aloud by the TTS engine. Graphics belong
  in `video/`.
- **Only four inline tags are recognized**, per `voice_pipeline/markup.py`:
  `[pause:800ms]`, `[beat]` (400ms), `[emphasis]` and `[tone]` (no-ops in v1). Any other
  bracketed tag falls through and is spoken verbatim.
- **Text before the first header is skipped** with a warning, so a title line at the top
  is safe.
- **Timestamps are derived, never hand-maintained.** Inter-turn gaps come from the
  `--gap-ms` flag, so these values do not drive the render. They are the join key
  between a script and its shot list, so they have to match where the audio actually
  lands. `tools/retime_script.py` computes them: measured durations from the rendered
  manifest for turns whose audio exists, and a words-per-second rate calibrated on that
  same manifest for turns that are new or edited. `turn_id` is a hash of speaker and
  text, so retiming changes no ids and forces no re-synthesis.

  ```bash
  python3 tools/retime_script.py Architecting_the_operation/podcasts/ATO_EP01_authors_preface.md \
      --manifest outputs/ATO_EP01_local/episode_manifest.json \
      --shotlist Architecting_the_operation/video/ATO_EP01_shotlist.md --apply
  ```

  The same pass remaps the shot list. An anchor is rewritten only when it resolves to a
  real turn by that speaker within 30 seconds; anything further is reported as
  UNRESOLVED and left alone, because a silent snap to the nearest turn is how a cue ends
  up illustrating the wrong sentence. Run it after every render, then regenerate the
  editor's lookup table with `tools/turn_index.py`.

Validate a script before rendering:

```bash
source .venv-voice/bin/activate && python3 -c "
from pathlib import Path
from voice_pipeline.parser import parse_transcript
from voice_pipeline.markup import tokenize_markup
from voice_pipeline.voices import load_voices
import sys
turns = tokenize_markup(parse_transcript(Path(sys.argv[1])))
known = set(load_voices(Path('voice_pipeline/voices.yaml')))
unknown = {t.speaker_id for t in turns} - known
leaks = [c.text for t in turns for c in t.markup_chunks if c.kind=='speech' and '[' in (c.text or '')]
words = sum(len((c.text or '').split()) for t in turns for c in t.markup_chunks if c.kind=='speech')
print(f'{len(turns)} turns, {words} words, ~{words/150:.1f} min')
print('unknown speakers:', unknown or 'none')
print('bracket leaks:', leaks or 'none')
" Architecting_the_operation/podcasts/ATO_EP01_authors_preface.md
```

Render:

```bash
source .venv-voice/bin/activate && python -m voice_pipeline --transcript Architecting_the_operation/podcasts/ATO_EP01_authors_preface.md --episode-id ATO_EP01 --out-dir ./outputs
```

## Rendered episode layout

A render writes one folder per episode under `outputs/`. Only the working files sit at
its root, because Ableton lists every `.als` beside the set in its own browser and a
folder full of extras buries the one file the editor opens.

```
outputs/<episode_id>/
  <episode_id>.als          the set you open
  <episode_id>.mp3          the stitched preview of the whole episode
  episode_manifest.json     per-turn ids, durations, positions
  render_state.json         fingerprints that drive incremental re-render
  TURN_INDEX.csv            editor's lookup table (tools/turn_index.py)
  Samples/                  the rendered audio
  _backups/                 timestamped .als copies, written automatically
  _previews/                short audition clips cut from the stitched mp3
```

`voice_pipeline/als_generator.py` writes backups to `_backups/` and reparents their
project-relative sample paths, so an old backup still opens and finds its audio from one
level down. Short clips cut for review go in `_previews/`; keep the episode root to the
files above.

## Sourcing rules

Ground every claim in `Paper/The_Original_Power.tex`. The NotebookLM transcripts are
drafting input, never a source: they corrupt names ("From Bias to Bytes" → "bites",
Du Bois → "du guac", McKelvey–Schofield → "mchelvy showfield", Theodore → "Fyodor") and
they overstate qualified findings. The 2024 hiring result in particular is Tier 3 in the
manuscript and a 2026 matched-pair replication returned parity; any episode that cites
it states both.

Anything with an axis comes from `Paper/data/*.csv`.
