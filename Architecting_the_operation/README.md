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
| 3 | Chapter 2, Redefining Racism | `podcasts/ATO_EP03_redefining_racism.md` | `video/ATO_EP03_shotlist.md` | `notes/CH2_findings.md` |

Episode 3 opens the public run on the manuscript proper, and is expected to be the
first episode most new listeners encounter — the Preface and Chapter 0 run notation-
and logic-heavy and reward readers already sold on the framework's math, where
Chapter 2 states a claim a stranger already has an opinion about. It was drafted from
a full factual brief (`notes/CH2_findings.md`) built directly against
`Paper/The_Original_Power.tex` lines 1567–2681, following the same pattern as
`notes/CH0_findings.md`: a delegate-grade brief first (section map, every verbatim
definition, every named citation, a ranked hardest-ideas list, and a hazards audit),
then the script drafted by hand against that brief rather than against the manuscript
directly.

The script was then rebuilt around a four-level explanatory device — every named
mechanism in the chapter gets explained as if to a five-year-old, then a high
schooler, then a college student, then defended at PhD level with full citations and
falsification conditions — since this episode is the series' front door and needs to
work for a listener with zero prior exposure to the framework, while still carrying
the manuscript's actual rigor through to the fourth pass. Toussaint names the level,
Aisha delivers the first two registers, Emmanuel Theodore delivers the last two,
repeated across ten named mechanisms. It is unrendered as of this commit — 258 turns,
~11,100 words, ~74–77 minutes by word count, timestamps computed from word count and
not yet corrected by `tools/retime_script.py`. The hazards audit's two graphic-content
passages (the Thistlewood/Abba record, and the 1662 Virginia `partus sequitur ventrem`
law) are flagged verbally in the script itself and get a plain, image-free video
treatment per the shot list's content-note handling, and the shot list's signature
visual device is now a recurring "Level Card" badge tracking which of the four
registers is currently playing.

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

## Format decisions

Decided by Emmanuel on 2026-09-16, after the research brief in
`research/podcast_craft/BRIEF.md`. They apply to every script drafted from here on.
Episodes 1 to 3 predate them.

**One chapter per episode.** Episodes stay bound to a book chapter at whatever length
the chapter needs. Splitting a long chapter into parts stays available later, and
nothing is split now.

**Each voice owns explanation levels.**

| Voice | Owns |
|---|---|
| Emmanuel Theodore | PhD level |
| Aisha | College level |
| Toussaint | Elementary school and high school levels |

Episode 3 used a different split, with Aisha on the first two levels and Emmanuel on
the last two. The table above replaces it.

**The four-level device is used strategically.** The default register is high school
and college. A script expands from there when the material calls for it.

- **Central concepts** get the full pass, from elementary school through PhD.
- **Ideas every listener must understand** expand downward to elementary school.
- **Material that only exists at PhD level** gets said at PhD level, without being
  forced down the ladder.
- **Everything else** stays at high school and college.

Expertise-reversal research is why the full pass is rationed. Guidance that helps
beginners slows down listeners who already know the material. See decision 6 of the
brief.

**Each voice asks the question that pulls the next level up.** Toussaint asks the
question Aisha answers at college level. Aisha asks the question Emmanuel answers at
PhD level. The asker stands in for the listener at that moment, which gives the show
the audience-surrogate role the research recommends without adding a fourth voice.

**The feed is serial.** Apps show a serial feed's Episode 1 first to every new
listener, so the public numbering puts the front door there.

| Production file | Public release |
|---|---|
| `ATO_EP03_redefining_racism.md`, Chapter 2 | Episode 1 |
| `ATO_EP01_authors_preface.md` | Bonus episode |
| `ATO_EP02_preface.md` | Bonus episode |

Production file numbers stay as they are. Chapters after Chapter 2 take public episode
numbers in release order. Bonus episodes sit outside the numbered sequence.

**Every episode discloses that all three voices are synthetic.** Emmanuel's voice is
a clone made from his own recordings, the same as the other two. The disclosure credits
the research and every word to Emmanuel, the framing the brief found costs the least
trust. Episode 3 carries this version. Episodes 1 and 2 name only Toussaint and Aisha as
synthetic, which is inaccurate, and they need correcting before release.

**Every episode pulls real audio where it exists.** Before drafting, run
`python3 tools/chapter_audio_sources.py "<chapter title>"`. It lists every source
the chapter cites and flags the ones likely to have a recording, plus quotations
attributed to a speaker without a citation. Confirm each recording and its exact
words, cut the excerpt with `tools/make_clip.py`, and play it in the script as
an archive turn. The hosts then discuss what the listener just heard.

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

## Checking a render

Synthesis fails silently. MLX Chatterbox produces a valid WAV, a consistent manifest,
and a correct-looking Ableton set while the audio says the wrong thing. Three failure
modes seen on Episode 2, none of which any structural check can see:

| mode | what the audio does | duration |
|---|---|---|
| truncation | stops partway through the line | short |
| repetition | reads the line, then starts it again | long |
| opening babble | first few words are noise, then it recovers | correct |

Only the middle one has a duration signature, so **transcription is the check that
matters.** Run it after every render, before delivering anything:

```bash
python3 tools/verify_render.py outputs/ATO_EP02_local \
    --transcript Architecting_the_operation/podcasts/ATO_EP02_preface.md
```

It transcribes each segment with Whisper on device and scores it against the script.
The default `tiny` model runs at roughly a quarter-second per segment; re-check anything
it flags with `--model small` before regenerating, because tiny mishears proper nouns on
its own. The score that matters is the longest run of consecutive mangled words rather
than whole-turn similarity: Episode 2's opening rendered "Prejudice plus power" as
something no model could read as "prejudice" and still scored 0.909 overall.

To verify and repair in one step, which is the normal path:

```bash
python3 tools/repair_render.py outputs/ATO_EP02_local \
    --transcript Architecting_the_operation/podcasts/ATO_EP02_preface.md \
    --episode-id ATO_EP02_local --voices voice_pipeline/voices.local.yaml
```

That regenerates what fails, re-checks only those turns, repeats up to `--max-passes`,
and relays the timeline at the end. A turn that fails every pass is reported and left
alone, because repeated failure on the same text points at the text or the reference
audio rather than at a bad sample.

Chatterbox sampling is per-speaker config in `voices.yaml`. `temperature` defaults to
0.6 and `cfg_weight` to 0.7, tighter than the upstream 0.8 and 0.5, because reading a
fixed script wants faithfulness rather than expressive variation.

The duration check is still worth running as a cheap first look, though it catches only
the long-clip mode:

```bash
python3 tools/check_render_outliers.py outputs/ATO_EP02_local \
    --transcript Architecting_the_operation/podcasts/ATO_EP02_preface.md
```

It compares each turn's audio against what its own text predicts, using the per-speaker
milliseconds-per-word and milliseconds-per-mark in `voice_pipeline/speaker_rates.json`.
Turns shorter than 20 words are exempt, because fixed breath and pacing overhead does
not scale with length. Re-synthesize whatever it flags with `--regenerate-turns`, then
run `tools/relayout_episode.py` — a regenerated clip changes length and leaves a hole in
the timeline where the old one sat.

Punctuation is in the model deliberately. A comma-heavy list reads with a pause at every
mark, and a words-only model calls that turn broken when it is being read correctly.
The signal that does not work, so nobody adds it back: `speech_duration_ms` equalling
`duration_ms` looks like a clip that was still talking when generation stopped, but the
post-processor adds `--tail-ms` (150 by default) and clamps to the clip length, so the
two match on most healthy clips.

## Reference audio for voice cloning

A reference clip must be **a complete sentence whose exact text is known**, not the
loudest N-second window. `tools/extract_reference_audio.py` cuts by loudness and slices
mid-phrase, which is how the original Toussaint and Aisha clips ended on "or a culture"
and "the magnitude of". Chatterbox tolerates that because it conditions on audio alone.
OmniVoice conditions on the audio *and* its transcript together, so a truncated clip
gives it two signals that disagree.

Measured on eight passages chosen to stress the known failure modes, three runs each:

| engine | reference | mean | worst | catastrophic |
|---|---|---|---|---|
| Chatterbox | loudness-cut | 0.93 | 0.26 | yes |
| OmniVoice | loudness-cut | 0.93 | 0.00 | yes |
| OmniVoice | full sentence, exact text | 0.997 | 0.96 | none in 24 runs |

So the engine and the reference were both wrong, and fixing either alone leaves
catastrophic failures. Build references with `tools/audition_voice.py` to score
candidates before committing to one.

Working references and their exact transcripts live in `voices/candidates/`.

## Sourcing rules

Ground every claim in `Paper/The_Original_Power.tex`. The NotebookLM transcripts are
drafting input, never a source: they corrupt names ("From Bias to Bytes" → "bites",
Du Bois → "du guac", McKelvey–Schofield → "mchelvy showfield", Theodore → "Fyodor") and
they overstate qualified findings. The 2024 hiring result in particular is Tier 3 in the
manuscript and a 2026 matched-pair replication returned parity; any episode that cites
it states both.

Anything with an axis comes from `Paper/data/*.csv`.
