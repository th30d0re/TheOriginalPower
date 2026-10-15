# SEG 16–17 shot realign findings

Model: Composer

## Shot list

- **S16-14–S16-55:** Notes shifted one turn earlier per `REALIGN_TASK.md`; S16-14 new L/I gloss hold on card `S16-13`; S16-55 merges prior S16-54 + S16-55 notes.
- **S16-15 run:** New `ComplexWage` primary (was wrongly folded into `S16-13`); holds S16-16–S16-18.
- **Card primaries moved:** `S16-18.json` → `S16-19.json` (Faraday); `S16-37.json` → `S16-38.json` (back-EMF); `S16-47.json` → `S16-48.json` (recovered energy). Shotlist `Render`/`Holds` updated; S16-37 and S16-47 are coil-gun holds on `S16-31`.
- **S17-07–S17-15:** Notes shifted; S17-09 hold on five-scale card (redlining turn); content warning `S17-09.json` → `S17-10.json`; biological source card `S17-10.json` → `S17-11.json`; S17-15 merged bucking + documented-facts notes.
- **S17-05–S17-24:** All holds on `S17-04` use `cards/S17-04.json` render (fixes check conflict with `FractalExecution`).

## Scene methods

| File | Change |
|------|--------|
| `complex_wage16x9.py` | `shot_S16_13` → `shot_S16_15`; cues on microaggression / collapse turn |
| `coil_gun16x9.py` | Run indices +1 after S16-37 collapse hold; beat 6 `collapsed`, beat 11 `Nixon`, 14-shot run |
| `lorentz_force16x9.py` | unchanged |
| `fractal16x9.py` | unchanged |

## Card renames (descending)

1. `S16-47.json` → `S16-48.json`
2. `S16-37.json` → `S16-38.json`
3. `S16-18.json` → `S16-19.json`
4. `S17-10.json` → `S17-11.json`
5. `S17-09.json` → `S17-10.json`

## check

```
every Render target exists
234 runs, 0 problems
```

## render (16 17 -j 2 --force)

All primaries `ok`. Layout tails (SEG 16–17 affected runs):

```
S16-13.log: layout: no problems in 10 samples
S16-15.log: layout: no problems in 10 samples
S16-19.log: layout: no problems in 9 samples
S16-31.log: layout: no problems in 38 samples
S16-38.log: layout: no problems in 11 samples
S16-48.log: layout: no problems in 11 samples
S16-54.log: layout: no problems in 8 samples
S17-04.log: layout: no problems in 13 samples
S17-10.log: layout: no problems in 6 samples
S17-11.log: layout: no problems in 8 samples
```

Sheets: `/tmp/seg16.png` (56 shots), `/tmp/seg17.png` (67 shots).
