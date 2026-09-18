# The sound of the show

The theme is built out of the framework rather than written to match its mood.
Three devices carry it, and each is a fact about hearing, not a simile.

## 1. The Elite is the note that is never played

Sound the partials of a frequency and leave that frequency silent, and the ear
supplies it anyway. This is the missing fundamental, and it is why a phone
speaker too small to move air at 80 Hz still gives you a bass line.

The tiers sit on the harmonic series of D1, 36.708 Hz. Partial 1 is the Elite.
It never sounds in any episode, and it is the note a listener names when asked
what key the theme is in.

| partial | tier | pitch | cents off the grid | amplitude |
|---|---|---|---|---|
| 1 | Elite | D1 | 0 | **never sounded** |
| 2 | Puppet Class | D2 | 0 | 0.500 |
| 3, 4 | Buffer Class | A2, D3 | +2, 0 | 0.333, 0.250 |
| 5, 6 | Enforcement | F#3, A3 | −14, +2 | 0.200, 0.167 |
| 8, 9, 10, 12, 15, 16 | Out-group | D4 … D5 | 0 to −14 | 0.125 down to 0.062 |
| 7, 11, 13, 14 | *(see below)* | C4, G#4, A#4, C5 | −31, −49, +41, −31 | 0.143 down to 0.071 |

Partial 2 is the Puppet Class on purpose. An octave is the same pitch class as
the fundamental, so the ear files it under the same name. Ask a listener where
the bass is and they point at the octave. Ask a citizen where the power is and
they point at the office-holder.

Amplitude falls as 1/n, which is the spectrum of a sawtooth and also the
extraction gradient. The partials that fix the perceived pitch are the
quietest and the most numerous, and if you mute them the fundamental goes with
them.

## 2. The tuning grid is the detection function

Partials 7, 11, 13 and 14 land 31, 49, 41 and 31 cents from the nearest key on
a piano. They carry real energy. Twelve-tone equal temperament has no name for
any of them, so a transcription of the theme reports nothing there.

That is the intent doctrine written in cents. The harm is present and
measurable; the instrument built to detect it returns zero, because the thing
sits between the categories the instrument can express. Partial 11 is the
worst case at 49 cents, almost exactly between two keys.

Partial 14 is the octave of 7 and carries the same 31-cent offset. The
illegible interval reproduces itself at every scale, which is the fractal
claim.

## 3. The loudest moment is the cut

Faraday: the induced voltage follows the rate of change of the field, so
collapsing a field produces a bigger transient than establishing one. The
theme's biggest hit is not an entrance. It is the moment the drone stops.

Lenz gives the other half. Every swell generates an answering figure whose
size is proportional to how fast the swell rose, pointing the other way. In
the code it is the swell reversed in time and inverted in phase, scaled by the
peak of its own derivative. A fast gesture gets a violent answer; a slow one
barely registers. That is the reform-and-backlash finding as a production rule.

## Per-episode parameters

The opener is the same every time. What changes underneath it:

**Which tiers are sounding.** The chord assembles across the series as the
tiers are invented. A Portugal episode has partial 2 and the dense top and
nothing in between. Bacon's Rebellion and 1705 bring partial 3 in, and the
fifth appearing in the chord *is* the Buffer Class being installed. By the
modern chapters the whole spectrum is running. The final closer can take them
away one at a time.

**The backlash fit.** Four shocks are fitted in the manuscript's transfer
function section, and each is an impulse response the music can use directly
as an envelope, a tremolo, or a reverb tail. At ten years to the second:

| shock | ζ | ω_n (rad/yr) | ring | decay | natural period |
|---|---|---|---|---|---|
| 1865 | 0.17 | 0.30 | 0.47 Hz | 5.9 s | 20.9 yr |
| 1964 | 0.59 | 0.52 | 0.67 Hz | 1.0 s | 12.1 yr |
| 2008 | 0.70 | 1.08 | 1.23 Hz | 0.4 s | 5.8 yr |
| 2020 | 0.97 | 6.65 | 2.57 Hz | 0.05 s | 0.9 yr |

An 1865 episode breathes; a 2020 episode flutters. The room gets smaller as
the show moves forward in time, and that is the manuscript's own finding about
response bandwidth, audible without anyone narrating it.

**The rectifier.** Pre-1965 chapters gate the groove with a half-wave
rectified sine: current flows one way only, so the envelope has a hole where
the other half of the cycle should be, and the rhythm limps. Post-1965
chapters use full-wave, symmetric in both directions, which sounds fair and
extracts the same amount. `--full-wave` switches it.

**The wage angle.** W = ψ_m + jψ_s is a complex number, so it has a phase.
Render the material layer and the status layer as two copies of the same
material and offset the second by θ in degrees of the beat. A status-wage
chapter has the two layers far out of phase, which reads as width and
unease without changing a note.

**Non-commutativity**, for the intersectional chapters. Quaternions: i·j = k
but j·i = −k. Two motifs, A then B, give a third; B then A gives that third
inverted. Same material, opposite polarity, and the order is the only
difference. That is the chapter's argument with no words in it.

## Conventions, marked as conventions

Not everything here is derived, and the distinction should survive contact
with an audience the way the manuscript's tiers do.

- D1 as the fundamental is an ear choice. Any pitch works; the series keeps
  one so every episode is the same machine.
- Tempo, entry times, and the length of the opener are arranged by feel.
- Ten years to the second is a convenient scale factor, not a finding.

Derived, and defensible in public: the missing fundamental, the octave as the
Puppet Class, 1/n amplitude, the cents offsets of partials 7/11/13/14, the four
backlash fits, half-wave rectification, and the Lenz and Faraday gestures.

## Running it

    python Architecting_the_operation/music/soundmap.py partials
    python Architecting_the_operation/music/soundmap.py theme --shock 1964
    python Architecting_the_operation/music/soundmap.py theme --shock 2020 --full-wave
    python Architecting_the_operation/music/soundmap.py shocks
    python Architecting_the_operation/music/soundmap.py midi

The MIDI files are one per partial, each carrying a pitch bend that puts the
note on the true harmonic rather than the nearest key. Set the instrument's
bend range to two semitones and drop each file on its own track. The seventh
and the eleventh will sound wrong against a tempered pad, which is the point.

Renders land in `music/out/`, which is gitignored. The audio is a sketch to
build on in Ableton, not a finished cue.

## The lab, and how music reaches an episode

Sounds get made in one place and used in many. Three steps, and only the
middle one is yours.

**1. Render the palette.** `soundmap.py palette` writes sixteen stems into
`music/lab/stems/`: each tier on its own, both groove rectifiers, the swell
with its induced answer, the Faraday collapse, all four backlash envelopes,
and the opener and closer as they stand.

**2. Open the lab.** `lab.py` builds `music/lab/ATO_Sound_Lab.als` with one
named track per stem, each clip at bar 1 and the derivation written into the
track's annotation. This is the workbench: load the stems into samplers,
resample them, run them through whatever you want. The set is rebuilt from
scratch on every run, so save anything worth keeping under a new name.

**3. Bounce cues.** A finished sound goes to `music/cues/` as a plain WAV.
`cues.yaml` then says which episode uses it and where:

    episodes:
      ATO_EP03_five_levels:
        opener: opener.wav
        closer: closer.wav
        beds:
          - cue: bed_unnotated.wav
            from_turn: 120
            to_turn: 124
            gain_db: -26
          - cue: collapse_faraday.wav
            at_turn: 180

`python music/cues.py outputs/<episode_id>` mixes it: the opener runs first
with the first line starting before it ends, the closer comes up under the
sign-off, and beds sit under the turn ranges they name, looped and faded to
fit. It writes `<episode>_music.wav` alongside the stitched voices and a
`cues_applied.json` recording every placement and how far the speech moved.

Positions are named by turn, never by timestamp. Re-render a turn, change its
length, and its cue follows it. Nothing in the music step touches the voices,
so it can be re-run as often as the sounds change.

The stems, the lab set and the bounced cues are all gitignored. What is
tracked is the thing that generates them and the plan that places them.
