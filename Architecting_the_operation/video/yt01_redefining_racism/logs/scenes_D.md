# Group D — scene worker findings (revision pass, Round 2)

Metal render verified at `960x540@15` via `edit16x9.py render … --force`. Sheets judged after each fix (`edit16x9.py sheet … -o /tmp`).

| Run | Class · file | Status | On screen |
|-----|----------------|--------|-----------|
| S09-01 | `KernelOptimizationCase` · `kerneloptimization16x9.py` | rendered · layout ok | Larger 12×4.6 frame; 34 px labels; revenue vs flat suppression; enforcement link |
| S09-13 | `CottonGinConfound` · `kerneloptimization16x9.py` | rendered · layout ok | Shot 0: gin + cost drop only; shot 1: acreage grid + labor demand bar (distinct tiles) |
| S09-16 | `MinimumForcing` · `minimumforcing16x9.py` | rendered · layout ok | Full-width coherence-risk chart; 1831 spike; slave-code box; τ-management footer |
| S10-01 | `ZeroDayExploit` · `zeroday16x9.py` | rendered · layout ok | Scaled target/payload diagram; defense callout |
| S10-05 | `ClineGradient` · `cline16x9.py` | rendered · layout ok | Wide cline bar; aDNA timeline beat on hold |
| S10-13 | `BinaryPartitionCut` · `cline16x9.py` | rendered · layout ok | Legal cut + permanent partition label on hold |
| S10-15 | `TransatlanticBotnet` · `botnet16x9.py` | rendered · layout ok | Expanded hub map; four distinct shot beats |
| S11-01 | `HostWetware` · `bayesdefense16x9.py` | rendered · layout ok | Larger brain/code; feature list; partition route |
| S11-09 | `BayesPriorSwamp` · `bayesdefense16x9.py` | rendered · layout ok | Larger Bayes panels; prior swell; harm-filter beat |
| S12-01 | `InterfaceSwapIntro` · `interfaceswap16x9.py` | rendered · layout ok | Full-width signature stack + payload; Interface Swap caption |
| S12-05 | `ExeRecompile` · `interfaceswap16x9.py` | rendered · layout ok | Large exe morph chain across four holds |
| S12-20 | `CostBarsOverTime` · `interfaceswap16x9.py` | rendered · layout ok | Taller bars; Brown + economic-rise beats; swap collapse |

## Revision changes (per run)

- **S09-01** — Scaled antebellum case frame and bar groups; 34 px column labels; fixed kernel/stack spacing for layout inspector.
- **S09-13** — Split primary vs hold: processing-cost transform on S09-13; acreage + labor bar only on S09-14; gin shifts left when grid appears.
- **S09-16** — Chart to ~11×4.6 units; coherence-risk title above axes; legislative response in side panel; τ label on management line.
- **S10-01** — Enlarged host/payload; hide vuln label when defense line appears.
- **S10-05 / S10-13** — Wider cline geometry; 34–44 px headings and axis labels.
- **S10-15** — Hub coordinates spread; 34 px labels; larger Middle Passage hull.
- **S11-01 / S11-09** — Scaled wetware and Bayes blocks; distinct beats per hold; bottom/side callouts cleared of overlap.
- **S12-01 / S12-05 / S12-20** — Wider exe chips and cost bars; S12-20 adds explicit economic-cost beat before Interface Swap.

## Contract / shared notes

- `MinimumForcing` exists in both `minimum_forcing16x9.py` (S08-17) and `minimumforcing16x9.py` (S09-16); shot list file names disambiguate renders.
- No cue-word `KeyError`s; beats unchanged from first pass.
- Figure 2.4 remains `CardScene`, not built here.

## Unfinished

- None for group D scope. All twelve primaries: `ok` and `layout: no problems` in run logs.
