# Video

`ATO_EP0N_shotlist.md` is the authored artifact: prose written for a human
editor, with an anchor, a hold, what is on screen, and a provenance tag.

`shotspec.py` reads one and emits a JSON spec per shot into `specs/`, so the
same shot can be sent to any image model and a comparison between two models
is about the models rather than about how the prompt was phrased that day. It
also checks the provenance key, which is only worth declaring if something
enforces it.

    python shotspec.py ATO_EP01_shotlist.md \
        --script ../podcasts/ATO_EP01_authors_preface.md \
        --manifest ../../outputs/ATO_EP01_local/episode_manifest.json \
        --out specs/ATO_EP01.json

## Pass the script, not just the manifest

Shot lists anchor to the script's timestamps. `scriptcast-retime` rewrites
those after a render, so a manifest's own `source_timestamp` drifts away from
the list that was written against it. Turn order does not drift. With
`--script`, anchors resolve through the script's turn index into the manifest
and every shot lands on real milliseconds; without it, resolution silently
collapses to a handful of lucky matches.

## What the checks mean

- **error** — the list disagrees with the repository. A `[book]` tag with no
  `.tex` citation, a `[data]` tag with no file under `Paper/data/`, a cited
  file that does not exist, a line number past the end of its file, or a shot
  with no anchor at all.
- **warn** — a person should look. No provenance tag, an anchor written as
  prose rather than a timestamp, or an anchor that names a turn the manifest
  does not have.

## Tracks

Each spec carries a `suggested_track`. `archival` means the shot describes
real footage, a photograph, or a recording, and wants licensed material.
`vector` is everything else: diagrams, cards, charts, timelines, which is what
these lists are mostly made of and what an SVG model can produce.

Generated imagery of real events or people is not an option here. The work
argues about how the historical record is read, and a fabricated
evidence-shaped image undercuts that wherever it appears. Synthetic visuals
carry the same disclosure the synthetic voices do.

## prompt_seed is not a prompt

Each spec has a `prompt_seed` assembled mechanically from the shot's own
fields. It is a placeholder so adapters have something to send. A prompt pass
with the chapter's text and citations should replace it before anything is
rendered.
