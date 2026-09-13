/-
# The node-to-circuit-element mapping

Source: `Paper/The_Original_Power.tex`, Section `sec:hardware_mapping`.
Four separate passages assign circuit elements to the five nodes:

  * the table's **Circuit Element** column        (tex lines 603--607)
  * the table's **Physical Role** column          (tex lines 603--607, same rows)
  * the prose paragraph following Equation 0.2    (tex lines ~652--660)
  * the `circuitikz` figure `fig:extraction_circuit` (tex lines ~613--637)
  * the AC-regime passage                         (tex line 1245)

WHAT THIS FILE CHECKS: whether those passages assign the *same* element to each
node. They do not. The disagreements are proved below from the electrical
behaviour of the elements, so they do not depend on how this file names things.

WHAT IT DOES NOT CHECK: whether the circuit analogy is apt. That is the
manuscript's dynamical-homology claim and it is empirical. See `README.md`.

STATUS: the repair proposed in
`Architecting_the_operation/notes/MAPPING_contradiction_proposal.md` is NOT
applied. `contradiction_still_present` below is a tripwire: when the repair
lands, it stops compiling, and this file must be updated to match.
-/
import Formal.Nodes

namespace OriginalPower

/-- Circuit elements named in the hardware-mapping passages. -/
inductive Element where
  | voltageSource
  | currentSource
  | potentialDivider
  | conductor
  | capacitor
  | inductor
  | insulator
  | ground
deriving DecidableEq, Repr

namespace Element

/-- An element is **active** when it injects energy into the network. Sources
are active; every other element here passes, drops, stores, or blocks energy
that something else supplied. -/
def isActive : Element → Bool
  | voltageSource => true
  | currentSource => true
  | potentialDivider => false
  | conductor => false
  | capacitor => false
  | inductor => false
  | insulator => false
  | ground => false

/-- Whether a steady current passes through the element at DC. An ideal
capacitor blocks DC; an ideal inductor is a short circuit to DC; an ideal
insulator passes nothing in any regime. -/
def conductsDC : Element → Bool
  | voltageSource => true
  | currentSource => true
  | potentialDivider => true
  | conductor => true
  | capacitor => false
  | inductor => true
  | insulator => false
  | ground => true

/-- Whether the element stores energy in a field and returns it to the circuit.
This separates a capacitor from a plain insulator, which stores nothing it can
give back. -/
def storesReactively : Element → Bool
  | capacitor => true
  | inductor => true
  | _ => false

end Element

open Node Element

/-- Reading 1: the table's **Circuit Element** column. -/
def tableElement : Node → Element
  | elite => voltageSource
  | puppet => potentialDivider
  | enforcement => currentSource
  | buffer => insulator
  | outgroup => ground

/-- Reading 2: the table's **Physical Role** column, same five rows.
Enforcement's role reads "the conductive path"; Buffer's role reads "stores
energy in the ideological field". -/
def tableRole : Node → Element
  | elite => voltageSource
  | puppet => potentialDivider
  | enforcement => conductor
  | buffer => capacitor
  | outgroup => ground

/-- Reading 3: the prose after Equation 0.2. Enforcement "is the conducting
element"; Buffer "is the insulating element ... transmits nothing". -/
def prose : Node → Element
  | elite => voltageSource
  | puppet => potentialDivider
  | enforcement => conductor
  | buffer => insulator
  | outgroup => ground

/-- Reading 4: the `circuitikz` figure. Enforcement is drawn `to[I]`, a current
source; Buffer is drawn `to[C]`, a capacitor. -/
def figure : Node → Element
  | elite => voltageSource
  | puppet => potentialDivider
  | enforcement => currentSource
  | buffer => capacitor
  | outgroup => ground

/-- Reading 5: the AC-regime passage, which makes the Buffer the reactive
element of an LC tank. -/
def acRegime : Node → Element
  | buffer => inductor
  | n => figure n

/-! ## The disagreements

Each is proved from the electrical predicates above, not from constructor
names, so renaming the elements would not make any of them go away.
-/

/-- **The table contradicts itself inside one row.** The Enforcement Class is
listed as a Current Source while the role description in the same row calls it
the conductive path. A source is active; a conductor is passive. -/
theorem enforcement_row_incoherent :
    (tableElement enforcement).isActive ≠ (tableRole enforcement).isActive := by
  decide

/-- The figure sides with the table's element column, so it inherits the same
conflict with the prose. -/
theorem figure_vs_prose_enforcement :
    (figure enforcement).isActive ≠ (prose enforcement).isActive := by
  decide

/-- **The Buffer cannot be both an insulator and an LC-tank element.** An ideal
insulator passes no current in any regime; an energised tank element carries the
full loop current reactively. At DC the two differ outright. -/
theorem buffer_dc_conflict :
    (prose buffer).conductsDC ≠ (acRegime buffer).conductsDC := by
  decide

/-- The reconcilable half, recorded so the repair does not over-correct: a
dielectric is the working insulator of a capacitor, and both store energy in a
field. The table's element column and its role column agree on that much. -/
theorem buffer_storage_agrees :
    (tableRole buffer).storesReactively = (figure buffer).storesReactively := by
  decide

/-- "Transmits nothing" is the part that fails: a capacitor blocks DC but is not
inert, and the figure already commits to the capacitor. -/
theorem buffer_prose_vs_figure :
    prose buffer ≠ figure buffer := by
  decide

/-! ## The headline result -/

/-- **No single assignment satisfies the manuscript's own readings.** Even the
two columns of one table cannot both be honoured. -/
theorem no_coherent_mapping (m : Node → Element) :
    ¬ (m = tableElement ∧ m = tableRole) := by
  rintro ⟨rfl, h⟩
  exact absurd (congrFun h enforcement) (by decide)

/-- TRIPWIRE. This theorem asserts that the defect is still in the manuscript.
Applying the repair in `notes/MAPPING_contradiction_proposal.md` will break this
build, which is the point: the file must then be updated to state the repaired
mapping and prove the readings agree. -/
theorem contradiction_still_present :
    tableElement enforcement ≠ tableRole enforcement := by
  decide

/-- What "repaired" will mean: one assignment that every passage matches. No
such assignment exists yet, so this predicate is stated and left unused. -/
def Coherent (m : Node → Element) : Prop :=
  m = tableElement ∧ m = tableRole ∧ m = prose ∧ m = figure

theorem nothing_is_coherent (m : Node → Element) : ¬ Coherent m := by
  rintro ⟨rfl, h, _, _⟩
  exact absurd (congrFun h enforcement) (by decide)

end OriginalPower
