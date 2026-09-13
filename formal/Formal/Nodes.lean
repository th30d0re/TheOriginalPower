/-
# The five structural nodes and their benefit ordering

Source: `Paper/The_Original_Power.tex`, Chapter 0, Section "Hardware Mapping"
(`\label{sec:hardware_mapping}`) and Equation 0.2 (`eq:0.2-tier-voltage-drop`).

WHAT THIS FILE CHECKS: that the node set is well defined and that the ordinal
benefit chain asserted in Equation 0.2 is internally consistent and total.

WHAT IT DOES NOT CHECK: whether any real population occupies these nodes, or
whether the ordering holds empirically. See `formal/README.md`.
-/

namespace OriginalPower

/-- The five tiers of the extraction hierarchy.

Manuscript notation, in order: `E`, `P_uppet`, `F_enforce`, `I_buffer`,
`O_racialized`. -/
inductive Node where
  | elite
  | puppet
  | enforcement
  | buffer
  | outgroup
deriving DecidableEq, Repr

namespace Node

/-- Every node, for exhaustive decidable checks. -/
def all : List Node := [elite, puppet, enforcement, buffer, outgroup]

theorem mem_all (n : Node) : n ∈ all := by cases n <;> decide

/-- Ordinal benefit rank. Equation 0.2 orders the tiers

  `Benefit(E) ≫ Benefit(P_uppet) > Benefit(F_enforce) > Benefit(I_buffer) > Benefit(O)`

and this function is that ordering and nothing more. The manuscript's `≫` marks
a gap the ordinal scale does not attempt to quantify; only the direction is
encoded here. -/
def rank : Node → Nat
  | elite => 4
  | puppet => 3
  | enforcement => 2
  | buffer => 1
  | outgroup => 0

/-- Equation 0.2, as a chain of strict inequalities. -/
theorem benefit_chain :
    rank outgroup < rank buffer ∧
    rank buffer < rank enforcement ∧
    rank enforcement < rank puppet ∧
    rank puppet < rank elite := by
  decide

/-- The Out-group is strictly below every other node. The manuscript asserts
this by transitivity through the chain; here it is checked directly. -/
theorem outgroup_strictly_lowest {n : Node} (h : n ≠ outgroup) : rank outgroup < rank n := by
  cases n
  · decide
  · decide
  · decide
  · decide
  · exact absurd rfl h

/-- The Elite is strictly above every other node. -/
theorem elite_strictly_highest {n : Node} (h : n ≠ elite) : rank n < rank elite := by
  cases n
  · exact absurd rfl h
  · decide
  · decide
  · decide
  · decide

/-- The ordering separates all five nodes: no two tiers share a rank. This is
what makes the hierarchy five-tiered rather than fewer. -/
theorem rank_injective {m n : Node} (h : rank m = rank n) : m = n := by
  cases m <;> cases n <;> first | rfl | (exact absurd h (by decide))

end Node

end OriginalPower
