"""The show's sound, derived from the framework rather than decorated with it.

Three devices carry the whole system, and each one is a real acoustic fact
rather than a metaphor laid on top of a tune:

1. THE MISSING FUNDAMENTAL. Sound partials 2, 3, 4 ... of a frequency and
   leave that frequency silent. The ear supplies it anyway and names it as the
   bass note. The Elite tier is partial 1. It is never played, and it is the
   note everyone hears. Partial 2 is the Puppet Class: an octave above the
   fundamental, the same pitch class, the thing listeners point at when asked
   where the bass is.

2. THE TUNING GRID AS THE DETECTION FUNCTION. Partials 7, 11 and 13 land 31,
   49 and 41 cents away from the nearest key on a piano. They carry real
   energy and the twelve-tone grid has no name for them. That is the intent
   doctrine in tuning: present, loud, and unreadable by the instrument built
   to read it.

3. AMPLITUDE FALLS AS 1/n. The natural spectrum of a sawtooth, and the
   extraction gradient. The partials that define the perceived pitch are the
   quietest and the most numerous.

On top of those sit the chapter parameters, taken from fits printed in the
manuscript: the backlash damping ratios, the wage phase angle, and whether the
chapter runs the rectified DC interface or the AC one. See SONIC_SYSTEM.md.

    python soundmap.py partials          # the pitch table, with cents
    python soundmap.py theme --out out   # opener and closer
    python soundmap.py shocks --out out  # the four backlash envelopes as audio
    python soundmap.py midi --out out    # one file per tier, bent to the partial
"""
from __future__ import annotations

import argparse
import math
import struct
from pathlib import Path

import numpy
import soundfile

SR = 48_000

# D1. Chosen by ear for the register, not derived from anything; the series
# keeps it so every episode is the same machine heard from a different year.
F0 = 36.708

# Which partials each tier occupies. The ordering is the manuscript's: power
# falls as the partial number rises, exactly as amplitude does.
TIERS: dict[str, list[int]] = {
    "elite": [1],                      # never sounded
    "puppet": [2],
    "buffer": [3, 4],
    "enforcement": [5, 6],
    "outgroup": [8, 9, 10, 12, 15, 16],
    # Real energy, no name on the grid. 14 is the octave of 7, and carries
    # the same 31-cent offset: the illegible interval reproduces itself.
    "unnotated": [7, 11, 13, 14],
}

# Fitted second-order backlash responses, from the Laplace transfer-function
# section: (damping ratio, natural frequency in rad/yr). Each one is an
# impulse response the piece can use as an envelope, a tremolo, or a reverb
# tail. Across 155 years the response goes from a slow swell to a flutter.
SHOCKS: dict[str, tuple[float, float]] = {
    "1865": (0.17, 0.30),
    "1964": (0.59, 0.52),
    "2008": (0.70, 1.08),
    "2020": (0.97, 6.65),
}

_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


def partial(n: int) -> float:
    return F0 * n


def tet(freq: float) -> tuple[str, float]:
    """Nearest key on a piano, and how far the partial sits from it in cents."""
    midi = 69 + 12 * math.log2(freq / 440.0)
    nearest = round(midi)
    cents = (midi - nearest) * 100.0
    return f"{_NAMES[nearest % 12]}{nearest // 12 - 1}", cents


def amp(n: int) -> float:
    return 1.0 / n


# --- envelopes -------------------------------------------------------------

def _t(dur: float) -> numpy.ndarray:
    return numpy.arange(int(dur * SR), dtype=numpy.float64) / SR


def damped(zeta: float, wn: float, dur: float, years_per_second: float = 10.0,
           normalize: bool = True) -> numpy.ndarray:
    """A shock's impulse response, with years mapped onto seconds.

    h(t) = e^{-zeta*wn*t} sin(wd*t), wd = wn*sqrt(1-zeta^2). At ten years to
    the second, 1865 runs a two-second swell and 2020 a ten-hertz flutter.
    """
    t = _t(dur) * years_per_second
    wd = wn * math.sqrt(max(1e-9, 1.0 - zeta**2))
    h = numpy.exp(-zeta * wn * t) * numpy.sin(wd * t)
    if normalize:
        peak = float(numpy.max(numpy.abs(h)))
        if peak > 0:
            h = h / peak
    return h


def rectified(dur: float, rate_hz: float, full_wave: bool = False) -> numpy.ndarray:
    """The groove. Half-wave is the DC interface: current only ever flows one
    way, so the envelope has a gap where the other half of the cycle would be.
    Full-wave is the post-1965 AC interface, symmetric in both directions."""
    x = numpy.sin(2 * math.pi * rate_hz * _t(dur))
    return numpy.abs(x) if full_wave else numpy.clip(x, 0.0, None)


def fade(sig: numpy.ndarray, rise: float, fall: float) -> numpy.ndarray:
    out = sig.copy()
    r, f = int(rise * SR), int(fall * SR)
    shape = (-1, 1) if out.ndim == 2 else (-1,)
    if r:
        out[:r] *= (numpy.linspace(0, 1, r) ** 2).reshape(shape)
    if f:
        out[-f:] *= (numpy.linspace(1, 0, f) ** 2).reshape(shape)
    return out


def lenz(sig: numpy.ndarray, gain: float = 0.55) -> numpy.ndarray:
    """Counter-EMF. The opposing figure is proportional to the rate of change
    of the thing that caused it, and it points the other way: reversed in time
    and inverted in phase. A fast swell produces a violent answer; a slow one
    barely registers."""
    env = numpy.abs(sig).mean(axis=1) if sig.ndim == 2 else numpy.abs(sig)
    rate = float(numpy.max(numpy.abs(numpy.diff(env)))) * SR
    scale = gain * min(1.0, rate / 40.0)
    return -sig[::-1] * scale


# --- synthesis -------------------------------------------------------------

def stack(partials: list[int], dur: float, gains: dict[int, float] | None = None,
          drift: float = 0.06, spread: float = 0.85) -> numpy.ndarray:
    """Additive sines on the harmonic series, panned by partial number.

    Each partial gets a slow independent amplitude drift and a few cents of
    wander, which is what keeps an additive stack from sounding like a test
    tone. Nothing here is at F0."""
    t = _t(dur)
    rng = numpy.random.default_rng(1453)  # Zurara's commission
    left = numpy.zeros_like(t)
    right = numpy.zeros_like(t)
    for n in partials:
        f = partial(n)
        if f > SR / 2.2:
            continue
        g = amp(n) * (gains or {}).get(n, 1.0)
        wander = numpy.sin(2 * math.pi * rng.uniform(0.02, 0.09) * t) * rng.uniform(1.0, 4.0)
        phase = 2 * math.pi * f * t + numpy.cumsum(wander) * (2 * math.pi / SR) * 0.01
        voice = numpy.sin(phase + rng.uniform(0, 2 * math.pi))
        voice *= 1.0 + drift * numpy.sin(2 * math.pi * rng.uniform(0.03, 0.13) * t + rng.uniform(0, 6))
        # Higher partials spread wider; the low ones stay in the centre.
        pan = spread * math.tanh((n - 6) / 5.0) * (1 if n % 2 else -1)
        left += voice * g * math.cos((pan + 1) * math.pi / 4)
        right += voice * g * math.sin((pan + 1) * math.pi / 4)
    return numpy.stack([left, right], axis=1)


def collapse(partials: list[int], dur: float = 6.0, bright: float = 1.0) -> numpy.ndarray:
    """Faraday. The transient belongs to the cut, not the onset: the induced
    voltage follows the rate of change of the field, so the loudest moment in
    the theme is the moment the drone stops."""
    t = _t(dur)
    rng = numpy.random.default_rng(1831)  # Turner
    out = numpy.zeros((t.size, 2))
    for n in partials:
        f = partial(n)
        if f > SR / 2.2:
            continue
        decay = numpy.exp(-t * (1.6 + n * 0.22) / bright)
        voice = numpy.sin(2 * math.pi * f * t + rng.uniform(0, 6)) * amp(n) * decay
        pan = 0.8 * math.tanh((n - 6) / 5.0) * (1 if n % 2 else -1)
        out[:, 0] += voice * math.cos((pan + 1) * math.pi / 4)
        out[:, 1] += voice * math.sin((pan + 1) * math.pi / 4)
    air = rng.normal(0, 1, (t.size, 2)) * numpy.exp(-t * 14)[:, None] * 0.18
    return out + air


def master(sig: numpy.ndarray, peak: float = 0.89) -> numpy.ndarray:
    sig = numpy.tanh(sig * 0.8) / 0.8
    m = float(numpy.max(numpy.abs(sig)))
    return (sig * (peak / m)).astype(numpy.float32) if m > 0 else sig.astype(numpy.float32)


def _place(bed: numpy.ndarray, sig: numpy.ndarray, at: float) -> None:
    i = int(at * SR)
    end = min(bed.shape[0], i + sig.shape[0])
    if end > i:
        bed[i:end] += sig[: end - i]


# --- the theme -------------------------------------------------------------

def opener(dur: float = 26.0, shock: str = "1964", full_wave: bool = False,
           tiers: tuple[str, ...] = ("puppet", "buffer", "enforcement",
                                     "outgroup", "unnotated")) -> numpy.ndarray:
    """The order of entry is the order of construction: the out-group is
    already sounding before any of the machinery built to sort it exists."""
    bed = numpy.zeros((int(dur * SR), 2))
    have = lambda name: name in tiers

    if have("outgroup"):
        _place(bed, fade(stack(TIERS["outgroup"], 19.0) * 1.25, 4.0, 3.0), 0.0)
    if have("enforcement"):
        _place(bed, fade(stack(TIERS["enforcement"], 15.0) * 0.9, 2.5, 2.0), 3.5)
    if have("unnotated"):
        _place(bed, fade(stack(TIERS["unnotated"], 12.5) * 1.15, 3.0, 2.0), 6.0)
    if have("buffer"):
        _place(bed, fade(stack(TIERS["buffer"], 10.0) * 0.95, 1.5, 1.5), 9.0)

    # The groove, gated by the interface's rectifier.
    if have("enforcement"):
        pulse = rectified(9.5, 1.55, full_wave)[:, None]
        _place(bed, fade(stack(TIERS["enforcement"] + TIERS["outgroup"], 9.5) * 0.7 * pulse, 0.4, 1.0), 8.0)

    # The octave arrives last and takes the credit.
    if have("puppet"):
        _place(bed, fade(stack(TIERS["puppet"], 7.5) * 2.6, 1.2, 1.5), 12.0)

    # The swell, and the answer it induces.
    zeta, wn = SHOCKS[shock]
    swell_len = 3.2
    swell = stack([2, 3, 4, 6, 8, 12], swell_len) * 1.4
    swell *= numpy.abs(damped(zeta, wn, swell_len, 6.0))[:, None]
    _place(bed, swell, 15.4)
    _place(bed, lenz(swell), 18.6)

    _place(bed, collapse([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 16], 7.0) * 1.9, 19.0)
    return master(bed)


def closer(dur: float = 20.0, shock: str = "2020") -> numpy.ndarray:
    """The theme unbuilt. Tiers leave from the bottom up, and the last thing
    playing is the out-group, still defining a fundamental nobody is sounding."""
    bed = numpy.zeros((int(dur * SR), 2))
    _place(bed, collapse([2, 3, 4, 6, 8, 11, 13], 6.0) * 1.5, 0.0)
    _place(bed, fade(stack(TIERS["puppet"], 5.0) * 2.0, 0.6, 3.0), 0.4)
    _place(bed, fade(stack(TIERS["buffer"], 8.0) * 0.9, 1.0, 4.0), 1.0)
    _place(bed, fade(stack(TIERS["enforcement"], 11.0) * 0.8, 1.5, 5.0), 1.5)
    _place(bed, fade(stack(TIERS["unnotated"], 14.0) * 1.0, 2.0, 6.0), 2.0)
    outg = fade(stack(TIERS["outgroup"], 18.0) * 1.35, 2.0, 7.0)
    zeta, wn = SHOCKS[shock]
    trem = 1.0 - 0.35 * numpy.abs(damped(zeta, wn, 18.0, 10.0))
    _place(bed, outg * trem[:, None], 1.6)
    return master(bed)


# --- the palette -----------------------------------------------------------

# Every stem the sound lab opens with. The name is the contract: the lab set
# builds one track per entry, and a cue bounced back out keeps the stem name
# as its prefix so cues.py can tell what it was made from.
PALETTE: list[tuple[str, str]] = [
    ("implied_fundamental", "Upper partials alone. The bass you hear is not there."),
    ("tier_puppet", "Partial 2. The octave that gets mistaken for the power."),
    ("tier_buffer", "Partials 3 and 4. Enters the chord at Bacon's Rebellion."),
    ("tier_enforcement", "Partials 5 and 6."),
    ("tier_outgroup", "The dense top. Defines the pitch, carries the least amplitude."),
    ("tier_unnotated", "Partials 7, 11, 13, 14. Off the grid by 31 to 49 cents."),
    ("groove_dc_halfwave", "Pre-1965 interface. Current one way; the rhythm limps."),
    ("groove_ac_fullwave", "Post-1965 interface. Symmetric, and extracts the same."),
    ("swell_lenz", "A swell and the answer it induces, reversed and inverted."),
    ("collapse_faraday", "The transient that belongs to the cut."),
    ("backlash_1865", "zeta 0.17. Twenty-one year natural period; it breathes."),
    ("backlash_1964", "zeta 0.59."),
    ("backlash_2008", "zeta 0.70."),
    ("backlash_2020", "zeta 0.97. Rises and saturates inside a year."),
    ("theme_opener", "The full opener."),
    ("theme_closer", "The theme unbuilt."),
]


def render_palette(out: Path) -> list[tuple[str, Path]]:
    """Write every stem in PALETTE. Tier and groove stems are one length so
    they stack and loop against each other without trimming."""
    out.mkdir(parents=True, exist_ok=True)
    bed = 24.0
    made: dict[str, numpy.ndarray] = {}

    made["implied_fundamental"] = fade(stack([6, 8, 10, 12, 16], bed) * 1.3, 3.0, 3.0)
    made["tier_puppet"] = fade(stack(TIERS["puppet"], bed) * 2.4, 1.5, 2.5)
    made["tier_buffer"] = fade(stack(TIERS["buffer"], bed) * 1.1, 2.0, 2.5)
    made["tier_enforcement"] = fade(stack(TIERS["enforcement"], bed) * 1.0, 2.0, 2.5)
    made["tier_outgroup"] = fade(stack(TIERS["outgroup"], bed) * 1.35, 3.0, 3.0)
    made["tier_unnotated"] = fade(stack(TIERS["unnotated"], bed) * 1.2, 2.5, 3.0)

    voices = TIERS["enforcement"] + TIERS["outgroup"]
    for name, full in (("groove_dc_halfwave", False), ("groove_ac_fullwave", True)):
        gate = rectified(bed, 1.55, full)[:, None]
        made[name] = fade(stack(voices, bed) * 0.9 * gate, 0.3, 1.5)

    swell_len = 3.2
    zeta, wn = SHOCKS["1964"]
    swell = stack([2, 3, 4, 6, 8, 12], swell_len) * 1.4
    swell *= numpy.abs(damped(zeta, wn, swell_len, 6.0))[:, None]
    made["swell_lenz"] = numpy.concatenate([swell, lenz(swell)], axis=0)

    made["collapse_faraday"] = collapse([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 16], 7.0) * 1.9

    for year, (z, w) in SHOCKS.items():
        env = numpy.abs(damped(z, w, 8.0, 10.0))
        made[f"backlash_{year}"] = stack([4, 6, 8, 9, 12, 16], 8.0) * env[:, None]

    made["theme_opener"] = opener()
    made["theme_closer"] = closer()

    written: list[tuple[str, Path]] = []
    for index, (name, _) in enumerate(PALETTE, start=1):
        path = out / f"{index:02d}_{name}.wav"
        soundfile.write(str(path), master(made[name]), SR)
        written.append((name, path))
    return written


# --- MIDI ------------------------------------------------------------------

def _vlq(value: int) -> bytes:
    out = bytearray([value & 0x7F])
    value >>= 7
    while value:
        out.insert(0, (value & 0x7F) | 0x80)
        value >>= 7
    return bytes(out)


def write_midi(path: Path, pitches: list[tuple[int, float]], beats: float = 8.0,
               ppq: int = 480, bend_range: float = 2.0) -> None:
    """One file per tier. Each carries a pitch bend that places the notes on
    the true partial, so the seventh and the eleventh land where the harmonic
    series puts them and not where the keyboard does. Set the instrument's
    bend range to two semitones."""
    events = bytearray()
    cents = pitches[0][1] if pitches else 0.0
    bend = int(round(8192 + (cents / (bend_range * 100.0)) * 8191))
    bend = max(0, min(16383, bend))
    events += _vlq(0) + bytes([0xE0, bend & 0x7F, (bend >> 7) & 0x7F])
    for note, _ in pitches:
        events += _vlq(0) + bytes([0x90, max(0, min(127, note)), 72])
    events += _vlq(int(beats * ppq))
    for i, (note, _) in enumerate(pitches):
        events += (_vlq(0) if i else b"") + bytes([0x80, max(0, min(127, note)), 0])
    events += _vlq(0) + bytes([0xFF, 0x2F, 0x00])
    head = struct.pack(">4sIHHH", b"MThd", 6, 0, 1, ppq)
    path.write_bytes(head + struct.pack(">4sI", b"MTrk", len(events)) + bytes(events))


# --- CLI -------------------------------------------------------------------

def _table() -> str:
    rows = ["  n   tier          Hz        key     cents   amp",
            "  --  ------------  --------  ------  ------  -----"]
    owner = {n: t for t, ns in TIERS.items() for n in ns}
    for n in range(1, 17):
        f = partial(n)
        key, cents = tet(f)
        tier = owner.get(n, "-")
        mark = "  (silent)" if n == 1 else ("  <- no name on the grid" if abs(cents) > 25 else "")
        rows.append(f"  {n:2d}  {tier:12s}  {f:8.2f}  {key:6s}  {cents:+6.1f}  {amp(n):.3f}{mark}")
    return "\n".join(rows)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=["partials", "theme", "shocks", "midi", "palette"])
    ap.add_argument("--out", type=Path, default=Path("Architecting_the_operation/music/out"))
    ap.add_argument("--shock", choices=sorted(SHOCKS), default="1964")
    ap.add_argument("--full-wave", action="store_true", help="the post-1965 AC interface")
    args = ap.parse_args()

    if args.command == "partials":
        print(f"\n  fundamental {F0:.3f} Hz ({tet(F0)[0]}), never sounded\n")
        print(_table())
        print()
        print("  backlash fits, years mapped at ten to the second:")
        for name, (z, wn) in SHOCKS.items():
            wd = wn * math.sqrt(1 - z**2)
            print(f"    {name}  zeta {z:.2f}  wn {wn:.2f} rad/yr  ->  ring {wd*10/(2*math.pi):5.2f} Hz, "
                  f"decay {(3.0/(z*wn))/10.0:5.2f} s   (natural period {2*math.pi/wn:5.1f} yr)")
        return 0

    args.out.mkdir(parents=True, exist_ok=True)

    if args.command == "theme":
        soundfile.write(str(args.out / "theme_opener.wav"),
                        opener(shock=args.shock, full_wave=args.full_wave), SR)
        soundfile.write(str(args.out / "theme_closer.wav"), closer(), SR)
        print(f"wrote {args.out}/theme_opener.wav and theme_closer.wav")
    elif args.command == "shocks":
        for name, (z, wn) in SHOCKS.items():
            env = numpy.abs(damped(z, wn, 8.0, 10.0))
            sig = stack([4, 6, 8, 9, 12, 16], 8.0) * env[:, None]
            soundfile.write(str(args.out / f"backlash_{name}.wav"), master(sig), SR)
        print(f"wrote four backlash envelopes to {args.out}")
    elif args.command == "palette":
        written = render_palette(args.out)
        for name, path in written:
            print(f"  {path.name}")
        print(f"wrote {len(written)} stems to {args.out}")
    elif args.command == "midi":
        for tier, ns in TIERS.items():
            if tier == "elite":
                continue
            for n in ns:
                f = partial(n)
                key, cents = tet(f)
                midi_note = round(69 + 12 * math.log2(f / 440.0))
                write_midi(args.out / f"tier_{tier}_p{n:02d}_{key}.mid", [(midi_note, cents)])
        print(f"wrote per-partial MIDI to {args.out} (set bend range to 2 semitones)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
