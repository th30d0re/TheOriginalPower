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
| 2 | Preface (framework) | not yet written; `podcasts/ATO_EP0.md` is an earlier interview-format draft, not pipeline-parseable | — | `notes/TOP_0_notes.txt` |

`notes/TOP_0_notes.txt` records Emmanuel's thoughts while reading the **Preface**, not
the Author's Preface, so it is input for Episode 2. Episode 1 was drafted from the
manuscript and from Emmanuel's own interjections in the NotebookLM session on the
Author's Preface.

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
- **Timestamps are source references.** Inter-turn gaps come from the `--default-gap-ms`
  flag, not from these values. Keep them monotonic and plausible anyway; they are the
  join key between a script and its shot list.

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

## Sourcing rules

Ground every claim in `Paper/The_Original_Power.tex`. The NotebookLM transcripts are
drafting input, never a source: they corrupt names ("From Bias to Bytes" → "bites",
Du Bois → "du guac", McKelvey–Schofield → "mchelvy showfield", Theodore → "Fyodor") and
they overstate qualified findings. The 2024 hiring result in particular is Tier 3 in the
manuscript and a 2026 matched-pair replication returned parity; any episode that cites
it states both.

Anything with an axis comes from `Paper/data/*.csv`.
