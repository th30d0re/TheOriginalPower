# V17: stop duplicate text when a Whisper backfill overlaps Phonon words

Same rules as `.codex/tasks/V16-asr-ensemble-merge.md`: no `git`, no network, no installs. You own only
`videolab/src/videolab/asr.py`, `videolab/src/videolab/asr_merge.py`, `videolab/tests/test_asr_merge.py`,
`videolab/tests/test_asr.py` (append only), and a short addition to `videolab/docs/V16-findings.md`
(heading "V17 backfill dedup").

## Defect, observed on real audio (`file-a5b3738c54c0`)

After gap fill, Phonon words covered the first half of a Whisper sentence. Backfill then inserted the whole
Whisper segment, so the transcript contains the sentence twice:

```
29.8-40.0 phonon-2 | ... male and female sexuality too. and are shamed for having a lot of sex. Sex is treated as something that a man
38.5-42.6 whisper  | Sex is treated as something that a man takes from a woman, as if it decreases her value.
```

## Required behavior

When `transcribe_ensemble` inserts a Whisper-backfilled segment, the Phonon words whose midpoint lies in
`[segment.start, segment.end)` are removed from the merged word list **before** segments are regrouped, so the
inserted Whisper segment replaces them. Order of operations:

1. gap fill, producing `merged_words`;
2. group into Phonon segments and run `backfill_from_reference` to find which Whisper segments to insert
   (the function stays as is);
3. for every inserted segment, drop Phonon words inside its time span;
4. regroup the remaining Phonon words, then add the inserted Whisper segments and sort by `start`.

`transcript.json["words"]` must reflect step 3 (no words from the replaced span). Counts in `job.json`
(`backfilled_segments`, `filled_gaps`) are unchanged in meaning.

Edge: if removing words leaves a Phonon segment of zero words, it simply disappears. If two inserted
segments overlap in time, remove words for both spans.

## Tests

Add one test in `test_asr.py` using the fakes pattern already there that reproduces the example above:
Phonon words cover "male and female sexuality too and are shamed for having a lot of sex sex is treated as
something that a man" up to 40.0 s, Whisper has the complete sentence 38.5 to 42.6 s, and the following
Phonon words start at 43.0 s. Assert the final `transcript.txt` contains "Sex is treated as something that a
man takes from a woman" exactly once, and that no Phonon word has a midpoint in `[38.5, 42.6)`.
Add a unit test in `test_asr_merge.py` only if you factor a pure helper out (name it
`drop_words_in_spans(words, spans)`), in which case test its half-open boundary behavior.

Verify: `.venv-voice/bin/python -m pytest videolab/tests -q` from the repo root. Report the pass count.
