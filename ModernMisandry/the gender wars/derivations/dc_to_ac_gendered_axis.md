# DC-to-AC on the gendered axis: derivation

Provenance tags: `[book: file:line]` stated in `Paper/The_Original_Power.tex` (TOP); `[prereg: file]` a
registered test in `Paper/prereg/`; `[operator: date]` stated by Emmanuel; `[claude-inferred, verify]`
derived here, not in the book. Equations are numbered G1..; the book's own are cited by label.

## 0. What the derivation has to deliver

Claim to derive `[operator: 2026-10-01]`: since the legal architecture of the gendered partition was
dismantled, the material return to men on the gendered axis fell while the obligations of the male script
persisted, and the gendered axis now runs on status wage. In book terms: the gendered axis moved from DC
mode to AC mode, and the man's wage phasor rotated from the real axis toward the imaginary axis.

## 1. Definitions used (all from the book)

- Complex wage on one axis: `W = ψ_m + jψ_s`, polar form `W = R e^{jθ}`, `R = √(ψ_m²+ψ_s²)`
  `[book: eq:2.2b, eq:2.2c, TOP:2886-2905]`. So `θ = atan2(ψ_s, ψ_m)`.
- `ψ_m` is real material allocation, "sourced from deeper `O` extraction"; `ψ_s` is the status wage and
  "costs E zero capital" `[book: TOP:2890-2897]`.
- AC mapping: `ψ_m = P_real = |V||I|cosθ`, `ψ_s = Q_reactive = |V||I|sinθ` `[book: eq:0.9, TOP:1123-1126]`.
- DC mode: `W_DC = ψ_m`, `θ = 0`; the partition is enforced kinetically (statute), so `ψ_s` is
  "structurally unnecessary" `[book: eq:0.7a, TOP:1100-1103]`. AC mode: covert, plausibly neutral
  extraction; `θ` is the tuning knob; `θ = 90°` is pure psychological wage; `θ > 90°` (`ψ_m < 0`) is
  Quadrant II `[book: TOP:1135-1145]`.
- The buffer receives `W` "in exchange for policing the partition" `[book: TOP:606]`.
- The gendered axis is the second imaginary component, `j₂ψ_{s,gender}` `[book: TOP:4837, keyinsight]`.
- Suppression cost: `λ` equals the systemic cost `W` `[book: TOP:1531]`.
- Within the dyad both partners remain outside `E`; advantaged and disadvantaged positions align with
  the In/Out extraction relation "without elevating either partner to ruling-class status"
  `[book: TOP:4826, §Contemporary Intimate Sphere]`.

## 2. Assumptions

- **A1 (source).** Before reform, the male node's `ψ_m,g` was sourced from `O_gendered` extraction through
  statutory channels: coverture, property and legal personhood, the marital rape exemption
  `[book: §Coverture TOP:4396, §Marital Rape Exemption TOP:4446]`. Follows from the definition of `ψ_m`
  as sourced from `O` extraction.
- **A2 (channel closure).** Reform closes those channels in part (ECOA 1974, removal of the marital rape
  exemption), so `ψ_m,g` falls by `Δ(t) ≥ 0`. `[book: §Coverture, "Persistence of the Economic Algorithm"
  TOP:4406]`, closure magnitude `[claude-inferred, verify]`.
- **A3 (holding requirement).** The node must still police the partition, so the allocation magnitude
  needed to hold it, `R*`, does not fall with the reform. `[claude-inferred, verify]` This is the least
  secure assumption. The book supplies the requirement ("in exchange for policing") but no number.
- **A4 (substitution).** `ψ_s` costs `E` nothing, so the minimum-cost way to keep `R` at `R*` after
  losing `ψ_m` is to raise `ψ_s`. The book's cost statement gives the premise `[book: TOP:2890-2897]`;
  the optimization step is `[claude-inferred, verify]`.

## 3. Derivation

**Step 1. DC state.** Statute enforces the partition, so the node's wage is purely material:

```
G1:  W_DC = ψ_m,0,    θ_0 = 0      [book: eq:0.7a]
```

**Step 2. Channel closure.** By A2 the material component becomes `ψ_m(t) = ψ_m,0 − Δ(t)`, with `Δ`
non-decreasing as channels close.

**Step 3. Substitution under a fixed holding requirement.** By A3 and A4, `|W| = R*` is held and the
shortfall is made up in the free component:

```
G2:  ψ_s(t) = √( R*² − ψ_m(t)² )
G3:  θ(t)   = arccos( ψ_m(t) / R* )
```

**Step 4. Monotonicity.** Differentiating G3,

```
G4:  dθ/dψ_m = −1 / √(R*² − ψ_m²) = −1/ψ_s  <  0     (for ψ_s > 0)
```

`θ` rises strictly as `ψ_m` falls. Starting from `θ_0 = 0`, the node rotates continuously toward the
imaginary axis. That rotation is the DC-to-AC transition on this axis: the regime label changes when
`ψ_s` stops being "structurally unnecessary" `[book: TOP:1102]` and becomes the term carrying the
holding requirement.

**Step 5. Reactive power rises one for one in squares.** From `R*² = P² + Q²` with `R*` fixed:

```
G5:  dQ = −(P/Q) dP,        Q² = R*² − P²
```

Every unit of material wage withdrawn reappears as reactive power. The reactive component is the one the
book identifies as culture war: "at `θ = 90°` ... the system runs on pure reactive power, i.e., culture
war" `[book: TOP:1141-1143]`. Hence the gender war is the observable form of `Q_gender` growing as
`P_gender` shrinks. Caveat `[claude-inferred, verify]`: the book's Parseval statement conserves variance
across the spectral distribution of axes `[memory: ground-claims-in-original-power]`. Using fixed `R*`
inside a single axis is a separate assumption (A3), not a corollary of Parseval.

**Step 6. Stationary regimes of the male node on the axis.**

| `ψ_m` | `θ` | Reading |
|---|---|---|
| `> 0` | `0 < θ < 90°` | Material wage present, status wage supplementary. |
| `= 0` | `90°` | The book's default operating mode `[book: TOP:2911-2913]`. Pure buffer signature. |
| `< 0` | `> 90°` | Quadrant II geometry: net material outflow with inflated status wage. |

## 4. The Quadrant II step needs a ledger

The statement "men give more than they receive" `[operator]` is a net-transfer claim. Write the man's net
material position on the axis as

```
G6:  ψ_m,net = ψ_m − T
```

where `T` is provision transferred to the partner. Two cases follow from the dyadic mapping
`[book: TOP:4826]`:

1. **`T` to the partner is within-axis redistribution.** The partner is in `O_gendered`, not `E`. Within a
   closed two-node accounting these transfers sum to zero. `[prereg: tt-oos-03 §1]` states the same
   constraint for earnings: net-of-contribution accumulation is zero-sum inside the axis. So `T > ψ_m` is a
   within-dyad imbalance. By itself it does not produce Quadrant II in the book's sense, which describes
   extraction toward `E`.
2. **Leakage `L` to `E` is the Quadrant II term.** Dating-market spend, therapy, separate households after
   dissolution, and similar revenue streams `[book: TOP:4832, "commodification of intimacy"]` flow to
   `E`. The dyad as a whole is in Quadrant II on the axis when `L > ψ_m`. This is the book's "corrupted
   middle" `[draft: The_Gender_Wars.tex]` stated as an inequality.

Consequence for the draft: the man's grievance is a claim about `T` versus `ψ_m` (an imbalance inside the
contract). The structural claim about `E` is a claim about `L`. The two must be kept apart. Merging them
produces the "men are being extracted from by women" reading that the framework does not support.

## 5. Where the derivation touches the data

- **TT-OOS-03** `[prereg: tt-oos-03-RESULTS.md]` (FRED, real data, 1979 Q1 to 2025 Q3): men's real median
  weekly earnings grew 2.6% against 136.8% productivity growth, a near-flat line, which the prereg
  identifies as the `I_buffer` signature (`P_real ≈ 0`). Women's grew 35.3%. Prediction G3 says the male
  node approaches `θ = 90°`; the earnings result is directionally consistent. Limits stated by that
  result: it measures labour-market earnings, not the gendered-axis allocation `ψ_m,g`; composition change
  confounds the between-branch comparison; and `ψ_s` is unmeasured. It supports "near-flat". It does not
  establish `ψ_m,g → 0`.
- **TT-OOS-02** is not usable. Its input is a synthesized series and the result carries a correction
  notice `[prereg: tt-oos-02-RESULTS.md, CORRECTION 2026-08-10]`. Do not cite it for the gender axis.
- **A2 reading.** The within-axis zero-sum constraint means the fall in `ψ_m,g` for men is the other face
  of women regaining the claim on their own labour. Under A1 the male `ψ_m,g` was sourced from that
  labour. The derivation therefore carries no deficiency charge against women. The grievance that
  survives is that the status obligations were not retired when the sourcing channel closed, and `E`
  substituted `ψ_s` at no cost (A4).

## 6. Consequences already in the book

- **Imaginary squaring** `[book: eq:2.2d, TOP:2918]`: a node whose allocation is pure `jψ_s` compounds to
  `−ψ_s²`. At `θ → 90°` the male node is exposed to this. The red-pill response is an identity built
  from `ψ_s` alone (status, "alpha") and falls under the theorem. The pink-pill counterpart falls under
  it only if its position is also pure `ψ_s`. That needs its own derivation `[claude-inferred, verify]`.
- **Conjugate repair** `[book: eq:2.2e, TOP:2932]`: `W + W* = 2ψ_m`. Rejecting `ψ_s` removes the horizontal
  deflection. For the male node this is the divestment the book names as the white masculine response
  `[book: TOP:4710]`. The book defines `W*` for the buffer only. The `O_gendered` analogue is undefined, so
  the symmetric repair statement is an open item.

## 7. Scope: which quadrant this covers

The initial condition `θ_0 = 0` fits `I ∩ I_masculine` (white men), whose wound is "enclosure as the
contract" `[book: TOP:4700]`. For `O_racialized ∩ I_masculine` (Black men) the contract was never granted
and the script was demanded anyway `[book: TOP:4717]`. Their `ψ_m,g(0)` is not positive, so G1 does not
apply and the trajectory starts at or beyond `θ = 90°`. The four-quadrant map `[book: TOP:4752]` supplies
the four initial conditions. This derivation is the white-male case. `[claude-inferred, verify]`

## 8. Open items before this goes into `.tex`

1. **Book inconsistency.** `θ = 0` is "genuine economic investment (strong social democracy)" at TOP:2909-2910
   and "chattel slavery, Jim Crow" at TOP:1100-1113. These are different readings of `θ` (composition of
   the allocation to the node versus regime of extraction). Resolve in the book before the draft leans on
   either reading. This derivation uses the composition reading throughout.
2. **`θ` versus `φ_k`.** `θ` is the wage phase. `φ_k` is the per-axis phase in the interference engine
   `[book: eq:0.10]`. The book does not state their relation. Do not assert that `θ_gender` moving is
   `φ_gender` moving. The controlled parameters of the engine are `φ_k, f_k, ρ_k`, not amplitude `A_k`.
3. **A3.** Fixed `R*` has no source in the book or the data. Alternatives (`R*` declining but slower than
   `ψ_m`) preserve the sign of G4 and change the magnitude of G5.
4. **Measure `ψ_s`.** TT-OOS-03 leaves it unmeasured. The reel corpus is the available instrument:
   code each reel for demands on the male node that carry no material return (emotional labour directed
   at her, performance of protector status). Corpus coding is the route to a `Q_gender` proxy.
5. **Quadrant II language.** The book defines `θ > 90°` as "the mathematical definition of fascism"
   `[book: TOP:2914-2915]`. Use "Quadrant II geometry" for the axis-level condition. Importing the label to a
   dyad or to one axis needs an argument the book has not made.
6. **Register.** AGENTS.md requires direct affirmative statements. §5's last bullet is the template:
   state the structure, then the residual claim, without "not X but Y" scaffolding.
