/-
# The quaternion model of intersecting axes

Source: `Paper/The_Original_Power.tex`, the component table at tex line 15498
and `Theorem (Multiplicative Intersection Compounding (Misogynoir))` at line
15510, with the bivector discussion at line 15555.

WHAT THIS FILE CHECKS: the quaternion identities the theorem quotes, the
substantive claim that the product of two axes leaves the plane they span, and
one collision between the theorem and the table above it.

WHAT IT DOES NOT CHECK: that identity axes multiply like quaternion units. The
manuscript classifies this theorem as Tier 3, ordinal and structural, and that
classification is the right one. Nothing here raises its evidentiary tier.
-/
import Mathlib

namespace OriginalPower

open Quaternion QuaternionAlgebra

/-- The material wage, the real component `a`. -/
abbrev material (a : ℝ) : ℍ[ℝ] := ⟨a, 0, 0, 0⟩

/-- The racial status wage, component `b i`. -/
abbrev racial (b : ℝ) : ℍ[ℝ] := ⟨0, b, 0, 0⟩

/-- The gendered status wage, component `c j`. -/
abbrev gendered (c : ℝ) : ℍ[ℝ] := ⟨0, 0, c, 0⟩

/-- The cisnormative/sexuality status wage, component `d k`, as the component
table at tex line 15498 assigns it. -/
abbrev sexuality (d : ℝ) : ℍ[ℝ] := ⟨0, 0, 0, d⟩

/-- Unit racial axis. -/
abbrev qi : ℍ[ℝ] := ⟨0, 1, 0, 0⟩
/-- Unit gendered axis. -/
abbrev qj : ℍ[ℝ] := ⟨0, 0, 1, 0⟩
/-- Unit third axis. -/
abbrev qk : ℍ[ℝ] := ⟨0, 0, 0, 1⟩

/-! ## The identities the theorem quotes -/

theorem i_mul_j : qi * qj = qk := by
  ext <;> simp

theorem j_mul_i : qj * qi = -qk := by
  ext <;> simp

/-- The axes do not commute, so the order of intersection carries information.
-/
theorem axes_noncommute : qi * qj ≠ qj * qi := by
  intro h
  have hk := congrArg QuaternionAlgebra.imK h
  norm_num at hk

/-! ## The substantive claim

The manuscript's point is that intersectional oppression is qualitatively
distinct from the sum of its constituent axes. Formally: the product of the two
axes lies outside their linear span. That is provable.
-/

/-- **The product leaves the plane.** No weighted sum of the racial and gendered
axes equals their product. This is the formal content of the claim that the
intersection is a distinct location rather than an accumulation of two. -/
theorem product_not_in_span (a b : ℝ) : qi * qj ≠ a • qi + b • qj := by
  intro h
  have hk := congrArg QuaternionAlgebra.imK h
  simp at hk

/-- The same statement for wages of arbitrary magnitude. Both axes must actually
pay something: where either wage is zero the product vanishes and the claim
genuinely fails, which is the expected behaviour rather than a defect. -/
theorem intersection_not_additive {b c : ℝ} (hb : b ≠ 0) (hc : c ≠ 0) (x y : ℝ) :
    racial b * gendered c ≠ racial x + gendered y := by
  intro h
  have hk := congrArg QuaternionAlgebra.imK h
  simp at hk
  tauto

/-! ## A collision between the theorem and the table above it

The component table at tex line 15498 assigns `d k` to the cisnormative and
sexuality status wage. The theorem at line 15510 then derives `i * j = k` and
reads the result as the Black woman's distinct plane of extraction. Both
readings cannot hold: in the quaternions `k` is a single basis element, so it
cannot denote the sexuality axis and the race-by-gender intersection at once.

The manuscript's own repair sits one section later. In geometric algebra the
product of two basis vectors is a bivector, an object of a different grade, and
`e₁ ∧ e₂` never collides with a third axis `e₃`. The quaternions identify those
grades, and that identification is what produces the collision below.
-/

/-- Under the table's own assignment, the product of the racial and gendered
axes **is** the unit sexuality axis. The manuscript does not intend this
reading; it follows from the two passages taken together. -/
theorem misogynoir_collides_with_sexuality_axis : qi * qj = sexuality 1 :=
  i_mul_j

end OriginalPower
