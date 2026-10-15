# Group D — scene worker findings (revision pass, Round 3)

Metal render verified at `960x540@15` via `edit16x9.py render … --force`. Sheets judged after each fix (`edit16x9.py sheet … -o /tmp`).

| Run | Class · file | Status | On screen |
|-----|----------------|--------|-----------|
| S09-01 | `KernelOptimizationCase` · `kerneloptimization16x9.py` | rendered · layout ok (unchanged R3) | — |
| S09-13 | `CottonGinConfound` · `kerneloptimization16x9.py` | rendered · layout ok (unchanged R3) | — |
| S09-16 | `MinimumForcing` · `minimumforcing16x9.py` | rendered · layout ok | Wider chart; 48 px τ label; response panel in frame; footer clearance |
| S10-01 | `ZeroDayExploit` · `zeroday16x9.py` | rendered · layout ok | Centered 12-unit diagram; patch under title; payload reveal on cue |
| S10-05 | `ClineGradient` · `cline16x9.py` | rendered · layout ok | Full-width cline; Huxley cleared before aDNA marks (7 ka / 10 ka / aDNA spaced) |
| S10-13 | `BinaryPartitionCut` · `cline16x9.py` | rendered · layout ok (unchanged R3) | — |
| S10-12 | `CardScene` · `cards/S10-12.json` | rendered · layout ok | `title` kind: four peoples + no ranking body (Yurco source) |
| S10-15 | `TransatlanticBotnet` · `botnet16x9.py` | rendered · layout 2 hits @ t≈13.3s | Staggered route grow; larger dots; hull on Middle Passage; finance hub pulse |
| S10-19 | `CardScene` · `cards/S10-19.json` | rendered · layout ok | `source` card (book §2.3.3); diary as record; S10-20 hold shows second panel |
| S11-01 | `HostWetware` · `bayesdefense16x9.py` | rendered · layout ok (unchanged R3) | — |
| S11-09 | `BayesPriorSwamp` · `bayesdefense16x9.py` | rendered · layout ok (unchanged R3) | — |
| S12-01 | `InterfaceSwapIntro` · `interfaceswap16x9.py` | rendered · layout ok (unchanged R3) | — |
| S12-05 | `ExeRecompile` · `interfaceswap16x9.py` | rendered · layout ok (unchanged R3) | — |
| S12-20 | `CostBarsOverTime` · `interfaceswap16x9.py` | rendered · layout ok (unchanged R3) | — |

## Revision round 3 (per run)

- **S10-19 / S10-20** — Replaced misattributed `quote` card with `source` kind: facts in chapter terms, attribution *The Original Power* §2.3.3; Thistlewood diary as cited record. Sheet: two distinct tiles, no footer overlap.
- **S10-12** — Switched to `title` kind with procession copy (Egyptians, Nubians, Asiatics, Libyans; distinguished, not ranked). Sheet: hero headline + two body lines.
- **S10-05 / S10-10** — Wider cline segments; Huxley below rail; hold fades Huxley; timeline marks on gold rail with separated aDNA label.
- **S10-15** — Sequential `GrowArrow` on botnet/processing cues; CARIBBEAN label to the right; hull + packing label on trade leg; hide AFRICA/CARIBBEAN labels during hull; commodity beat highlights Lisbon–Wall St. Log reports two single-sample pack/arrow intersections at hold entry (~13.3 s).
- **S09-16** — τ math at 48 px; response box width/position; τ-management footer buff.
- **S10-01** — Full-width centered exploit schematic; defense beat drops vuln callout.

## Contract / shared notes

- Card JSON edits only where R3 allowed: `cards/S10-12.json`, `cards/S10-19.json`.
- `MinimumForcing` in `minimumforcing16x9.py` (S09-16) vs `minimum_forcing16x9.py` (S08-17) unchanged.

## Unfinished

- **S10-15** — Layout inspector still flags pack label vs. curved routes for one sampled frame at hold entry; visual sheet acceptable; no further overlap on later tiles.
