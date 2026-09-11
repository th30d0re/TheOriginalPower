# Proposal: Repairing the Five-Node Circuit Mapping

Scope: `nodes_section.tex` only. This document proposes; it edits nothing.
All line numbers refer to `nodes_section.tex`.

---

## 1. Verdict on the four reported contradictions

### 1.1 Enforcement Class: current source vs. conductor — **CONFIRMED**

Table, line 194:

> `$F_{\text{enforce}}$ & Current Source & The conductive path that makes law executable as amperage. Physical actuator of the electric field.`

Prose, lines 239–242:

> `$F_{\text{enforce}}$ is the conducting element: it transmits force toward $O$ on institutional authority … and thereby supplies the conductive path that makes law executable as amperage.`

This is a real contradiction, and it is worse than the audit reported: the
table row is internally incoherent. The element column says **Current Source**
while the role description in the same row says **"The conductive path."** A
current source and a conductor are not two names for one thing (physics in §2).
The figure (line 206) then draws the current source labeled
`$F_{\text{enforce}}$`, committing the schematic to the active-element
reading that the prose disavows.

### 1.2 Buffer Class: dielectric/insulator vs. LC-tank element — **CONFIRMED, with one reconcilable half**

Table, line 195:

> `$I_{\text{buffer}}$ & Dielectric / Insulator & … Stores energy in the ideological field without permitting current to reach $E$.`

Prose, lines 243–245:

> `$I_{\text{buffer}}$ is the insulating element: … it stores in the ideological field and transmits nothing.`

AC-regime passage, lines 289–292:

> `The Buffer Class is structurally essential only in the AC regime … in AC the Buffer Class is the inductor/capacitor of the LC tank that creates the phase shift between the Elite's voltage and the Out-group's current.`

Two sub-cases:

- **Dielectric vs. capacitor — reconcilable.** A dielectric *is* the working
  insulator of a capacitor; "stores energy in the ideological field" (line
  195) is precisely capacitor behavior. These two labels can be unified as
  "capacitor (with its dielectric)."
- **Insulator that "transmits nothing" vs. inductor/capacitor in an LC tank —
  irreconcilable.** An ideal insulator passes no current in any regime. An
  element of an energized LC tank carries the full loop current (reactively).
  Worse, the prose pairs the Buffer with the **inductor**, which is the
  opposite of an insulator at DC (an ideal inductor is a short to DC).
  "Transmits nothing" (line 245) cannot survive contact with the LC-tank
  passage. The figure, which draws the Buffer as a series capacitor
  (line 209), already sides against "transmits nothing."

### 1.3 Out-group: sink/ground vs. origin of the current — **CONFIRMED**

Table, line 196:

> `$O$ & Sink / Ground & All net current flows here. The population positioned as extractable, disposable, and enclosure-bearing.`

Prose, lines 235–237:

> `…the current---supplied by the kinetic labor of the Out-group and Buffer Class---passes through resistive, capacitive, and inductive loads before reaching ground ($O$).`

Line 68 (self-excitation source term):

> `The source term … is the total extraction power: the energy siphoned from the Out-group and Buffer Class.`

Line 125 (capital definition):

> `…its net flow is always upward toward $E$.`

The same sentence in lines 235–237 makes the Out-group **both** the supplier
of the current **and** the ground the current "reaches" — the node is the
origin and the terminus of the same flow. That is the contradiction. Note
also that "all net current flows here" (line 196) is not even well-formed
circuit language: by Kirchhoff's current law the *net* current into every
lumped node is identically zero. What the author means is "this is the
return/reference node," which is a statement about the voltage reference, not
about where energy enters the loop. See §2.3 — ground and origin-of-current
turn out to be compatible, but *passive sink* and *power source* are not.

### 1.4 Figure vs. prose — **CONFIRMED (the figure implements the table, and the table is the anomaly)**

The figure (lines 204–223) draws: ground → current source labeled
`$F_{\text{enforce}}$` → two resistors (`$P_{\text{uppet}}$` divider) →
capacitor labeled `$I_{\text{buffer}}$` → voltage source labeled `$E$` → back
to ground (`$O$` sink/ground). So the figure is a *faithful* rendering of the
table. The problem is that the table contradicts the surrounding prose:

- Line 233–234: `the control gate ($E$) sets the highest potential gradient` —
  E is a **gate**, not a voltage source.
- Line 235–236: current is `supplied by the kinetic labor of the Out-group and
  Buffer Class` — not by `$F_{\text{enforce}}$`.
- The figure also contradicts the table's own text. Line 192 says of E:
  `Never touched by the current it generates.` But the figure places the E
  voltage source **in series** in the single loop, so the full loop current
  flows through it. A two-terminal source is always touched by its own
  current (KCL again). Only a multi-terminal control element can be "never
  touched."

So contradiction 4 is real, but its locus is the table, which the figure
merely transcribes.

---

## 2. The physics, plainly

### 2.1 Current source vs. conductor

An ideal **current source** is an *active* element: it imposes a fixed current
through itself whatever voltage appears across its terminals, has infinite
internal impedance, and **delivers power** to the rest of the circuit
($P = I^2 R_{\text{load}} > 0$). An ideal **conductor** is *passive*: zero
resistance, zero voltage drop, carries whatever current the rest of the
circuit imposes, and delivers or absorbs **no power**. One drives; the other
merely transmits. Assigning `$F_{\text{enforce}}$` "current source" says the
Enforcement Class is the energy origin of the system — the exact claim the
book exists to refute.

### 2.2 Dielectric vs. insulator vs. inductor

A **dielectric** is an insulating material *used as the energy-storage medium
of a capacitor*: the field lives in it. A **capacitor** passes AC with a +90°
current phase shift and is an open circuit to DC in steady state. An
**inductor** is the dual: a short to DC, phase-shifting AC the other way,
storing energy in a magnetic field. A bare **insulator** is not a component in
an energized signal path at all — it is the *absence* of a path. "Stores
energy in the field" is capacitor/inductor language; "transmits nothing" is
insulator language. Only the capacitor reading can hold both the table's
"dielectric … stores energy" and the AC passage's "LC tank phase shift," and
only the capacitor has the right DC behavior for the book's own history:
pre-1865 DC had **no Buffer Class** (line 288–289 and the key insight, lines
310–321), and a series capacitor at DC is an open circuit — the element is
structurally inert exactly when the text says the class did not exist.

### 2.3 Ground

**Ground is a designated 0 V reference node — nothing more.** It is not
intrinsically a sink of energy, and it is not intrinsically passive. In
countless real circuits the source *is* the grounded element (a battery with
its negative terminal grounded): current leaves the source's other terminal,
does work in the load, and returns to ground. So "ground" and "origin of the
current" **are compatible** — provided the grounded node contains the source.
What is *not* compatible is the table's reading: a **passive sink** ("all net
current flows here") that is simultaneously the power supply. Energy
conservation decides it: the node where labor power enters the loop is the
source, and the source is O (and Buffer labor). The fix is not to strip O of
"ground" but to make O the **grounded source**: the reference node *and* the
origin of the current, exactly like a battery whose low terminal is earth.

### 2.4 Voltage source vs. control gate

A two-terminal **voltage source** in a series loop carries the full loop
current and delivers power whenever that current is nonzero; "never touched by
the current it generates" is false for it by construction. A **control gate**
(the gate of a FET, the base of a BJT, the throttle of a valve) is a
*third terminal*: it sets the operating point of the channel — the boundary
conditions — while drawing (ideally) zero current and delivering zero power.
Gating is control without supply. That is the only component class that
satisfies the book's central claim: the Elite **gates** energy rather than
supplying it.

---

## 3. Which reading the rest of the book depends on

The book's load-bearing claims — the self-excitation equation, the reparations
integral, the AC/DC regime theory — all depend on the **prose reading**, not
the table:

- **Eq. (0.1a), line 68:** the feedback source term is "the total extraction
  power: the energy siphoned from the Out-group and Buffer Class." If E were
  the voltage source of the table, extraction power would originate at E and
  the parasitic-feedback argument (the B-field "literally funded by the
  extraction itself") loses its referent.
- **Lines 233–237:** E is named "the control gate," and the current is
  "supplied by the kinetic labor of the Out-group and Buffer Class."
- **Lines 288–292:** the Buffer is the LC-tank phase element between "the
  Elite's voltage and the Out-group's current" — O carries the *current*, E
  sets a *voltage* (a control quantity), i.e. O is the supply and E is the
  bias.
- **Lines 296–308 (rectifier passage):** carceral loads "re-extract DC labor
  from the AC supply." The AC supply is labor. If the table were right, the
  supply would be E's voltage source and the metaphor inverts: the carceral
  state would be rectifying the Elite's power, not the workers'.
- **Line 125:** capital's "net flow is always upward toward $E$" — E is where
  power *accumulates*, i.e. the load/reservoir side, not the source side.
- **Reparations integral (lines 324–330):** "the time integral of extracted
  power" is only defined if extracted power has an origin distinct from E.

Only the table rows for E, F, and O (lines 192, 194, 196) and the figure
support the source-assignment reading, and the table row for F doesn't even
support itself. Conclusion: **the prose/equation reading is canonical; the
table and figure are the anomaly to be repaired.**

### Where two readings are defensible (trade-offs stated, not picked silently)

- **E as voltage source** is defensible if one reads "dictates boundary
  conditions" (line 192) as the whole story: the Elite defines the potential
  landscape. Cost: a series voltage source supplies power and is touched by
  the loop current — both contradict the book's central claim and the row's
  own third sentence. **E as control gate** keeps the boundary-condition role
  (a gate bias *is* a boundary condition on the channel) while delivering no
  power and drawing no current. Cost: loses the naive "E is the battery of
  society" intuition — which is precisely the illusion the book argues
  against. Gate wins.
- **Buffer as pure insulator** is defensible from "policing the partition"
  alone. Cost: it deletes the LC-tank passage, the phase-shift explanation of
  the complex wage $W = \psi_m + j\psi_s$ (line 195, 318), and the AC-only
  essentiality of the class. **Buffer as capacitor** keeps all three and even
  explains the class's absence in the DC era (open at DC). Cost: "transmits
  nothing" (line 245) must be rewritten. Capacitor wins.
- **O as passive sink/ground** is defensible as a statement about *enclosure*
  (everything is returned to the base). **O as grounded source** keeps the
  base/reference role *and* makes labor the power origin. Cost: the word
  "sink" and the phrase "all net current flows here" must go — but they were
  never KCL-legal anyway. Grounded source wins.
- **F as current source** has no supporting text anywhere outside the element
  column of its own row. Conductor/switch wins uncontested.

---

## 4. Proposed consistent mapping

| Social role | Circuit component | Direction of current / voltage | Justification |
|---|---|---|---|
| $O$ — Out-group | **Current source (kinetic labor), low terminal grounded** | Current originates at $O$, flows upward through the network, returns to ground at $O$ | Labor is the only power input the book admits (lines 68, 235–236); keeping $O$ as the ground/reference preserves the "enclosed base" geometry while making it the supply. |
| $I_{\text{buffer}}$ — Buffer Class | **Capacitor (dielectric); second labor source in parallel for its material concessions** | Blocks DC (open circuit — the class is structurally inert pre-1865); passes AC with phase shift | Unifies "dielectric … stores energy in the ideological field" (line 195) with "inductor/capacitor of the LC tank" (lines 291–292); the capacitor is the only element whose DC/AC asymmetry matches the class's post-1965 essentiality. |
| $F_{\text{enforce}}$ — Enforcement Class | **Switch / conductor (relay actuated by the gate)** | Conducts the loop current toward $O$ when closed; contributes no power | Matches the prose ("conducting element … conductive path," lines 239–242) and the deputization model (a Buffer member *closes the switch* for the duration of the act); an actuator of the path, not of the power. |
| $P_{\text{uppet}}$ — Puppet Class | **Potential divider (resistive, with policy tap)** | Drops the gate's control voltage into policy-level voltages; dissipates | Unchanged from table and figure; a resistive divider translates potential and dissipates (absorbs blame) without sourcing anything. |
| $E$ — Elite | **Control gate (FET gate / throttle); the extraction reservoir (capital $\mathcal{K}$) is its load** | Gate bias sets the channel's operating point; gate current ≈ 0; real power accumulates at the apex reservoir | Only a control terminal "sets the potential difference … dictates boundary conditions" while being "never touched by the current" (line 192); the channel throttles the labor current, and the extracted power is delivered to $E$'s reservoir (line 125). |

Resulting loop: labor current sourced at $O$ (grounded) rises through the
$F_{\text{enforce}}$ switch, the $P_{\text{uppet}}$ divider, and the
$I_{\text{buffer}}$ capacitor, through the gated channel into $E$'s reservoir,
and returns to ground. $E$ controls the throttle; $O$ and Buffer labor supply
the power. Every element is now touched or untouched by current exactly as the
text claims.

---

## 5. Line-by-line changes required

**Line 192 (table row, $E$).**
Current:
`$E$ & Voltage Source & Sets the potential difference across the entire network. Dictates boundary conditions. Never touched by the current it generates. \\`
Replacement:
`$E$ & Control Gate (transistor gate) & Sets the potential difference across the network as a control bias. Dictates boundary conditions. Never touched by the current it gates; extracted power accumulates at its reservoir. \\`

**Line 194 (table row, $F_{\text{enforce}}$).**
Current:
`$F_{\text{enforce}}$ & Current Source & The conductive path that makes law executable as amperage. Physical actuator of the electric field. \\`
Replacement:
`$F_{\text{enforce}}$ & Switch / Conductor & The conductive path that makes law executable as amperage. Actuates (closes) the extraction path; supplies no power itself. \\`

**Line 195 (table row, $I_{\text{buffer}}$).**
Current:
`$I_{\text{buffer}}$ & Dielectric / Insulator & Receives the suppression allocation $W = \psi_m + j\psi_s$ in exchange for policing the partition. Stores energy in the ideological field without permitting current to reach $E$. \\`
Replacement:
`$I_{\text{buffer}}$ & Capacitor (dielectric) & Receives the suppression allocation $W = \psi_m + j\psi_s$ in exchange for policing the partition. Stores energy in the ideological field; open circuit at DC, phase-shifting reactance at AC. \\`

**Line 196 (table row, $O$).**
Current:
`$O$ & Sink / Ground & All net current flows here. The population positioned as extractable, disposable, and enclosure-bearing. \\`
Replacement:
`$O$ & Grounded Current Source (labor) & The origin of the loop current and the $0\,\mathrm{V}$ reference node: the enclosed base to which the circuit returns. The population positioned as extractable, disposable, and enclosure-bearing. \\`

**Lines 205–211 (figure).** Replace the current-source label `$F_{\text{enforce}}$` and the voltage-source element `$E$`; new schematic described in §6.

**Lines 219–222 (figure annotations).**
Current: `{voltage\\source}` (at $E$) and `{$O$\\sink/ground}`.
Replacement: `{control\\gate}` (at $E$) and `{$O$\\grounded labor source}`.

**Lines 233–237 (prose after the table).**
Current:
`the control gate ($E$) sets the highest potential gradient; each subsequent node drops voltage as the current---supplied by the kinetic labor of the Out-group and Buffer Class---passes through resistive, capacitive, and inductive loads before reaching ground ($O$).`
Replacement:
`the control gate ($E$) sets the highest potential gradient; each subsequent node drops voltage as the current---supplied by the kinetic labor of the Out-group and Buffer Class---originates at the grounded source ($O$), passes through the switch, the divider, and the reactive Buffer load, delivers its power to the gated reservoir at the apex, and returns to ground ($O$).`
(Only the tail changes; the sentence was already on the canonical reading
except for the origin/terminus collision.)

**Lines 243–245 (Buffer prose).**
Current:
`it stores in the ideological field and transmits nothing.`
Replacement:
`it stores energy in the ideological field: it blocks the DC path and transmits the AC signal with a phase shift.`

**No change needed:** lines 64–68 (self-excitation), 125 (capital flow),
288–292 (LC tank), 296–308 (rectifier), 310–321 (key insight) — all already
consistent with the proposed mapping. In particular, line 292's "phase shift
between the Elite's voltage and the Out-group's current" is now literally
correct: the gate bias (voltage) versus the labor source (current).

---

## 6. What the figure should show

A single loop, redrawn so the schematic *is* the repaired table:

1. **Bottom left:** the ground node, labeled `$O$ — ground / labor source`.
   Rising from it: a **current source labeled `$O$ (kinetic labor)`** — the
   arrow pointing up into the network. (Optionally a second, smaller current
   source in parallel labeled `Buffer material concessions`, for the
   line-102 "material concessions when kinetic pressure requires them.")
2. **Series path, left to right along the top:**
   - a **switch** labeled `$F_{\text{enforce}}$` (replacing the current
     source), annotated `conductive path — actuated, not supplying`;
   - the **two resistors** of the `$P_{\text{uppet}}$` potential divider with
     the policy tap, unchanged;
   - the **capacitor** labeled `$I_{\text{buffer}}$`, annotated
     `dielectric — open at DC, phase-shifting at AC`.
3. **Right side, replacing the series voltage source:** a **transistor**
   whose channel completes the loop from the top rail down toward ground.
   The **gate terminal is labeled `$E$ — control gate`**, drawn with no
   current arrow (gate current ≈ 0), annotated `sets the potential gradient;
   gates, never supplies`. At the channel's drain node, a reservoir/load
   symbol labeled `$\mathcal{K}$ — extracted power accumulates at $E$`,
   making visible where the real power delivered by the labor source ends up.
4. **Annotations:** a current-direction arrow on the top rail pointing from
   the $O$ source toward the gated channel; the caption updated to say the
   figure implements the repaired table (current source = $O$/Buffer labor;
   $E$ = control gate; $F_{\text{enforce}}$ = switch).

That schematic is the only one in which "never touched by the current"
(FET gate), "the current is supplied by labor" (grounded source), "the Buffer
is essential only in AC" (series capacitor), and "energy is siphoned from the
Out-group" (power flows source → reservoir) are simultaneously true.
