/-
# The complex suppression allocation W

Source: `Paper/The_Original_Power.tex`, Definition "Complex Suppression
Allocation $W$" (tex line 2883) and the two theorems that follow it:
`thm:imaginary-squaring` (line 2918) and `thm:solidarity-cancellation` (line 2932).

WHAT THIS FILE CHECKS: that the algebraic claims made about `W` follow from the
definition of `W` as a complex number. These are the manuscript's only fully
deductive theorems, and all of them hold.

WHAT IT DOES NOT CHECK: that a material wage and a status wage compose the way
real and imaginary parts compose. That identification is the framework's
substantive claim and nothing here bears on it. See `README.md`.
-/
import Mathlib

namespace OriginalPower

open Complex

/-- The complex suppression allocation `W = ψ_m + j ψ_s`, where `ψ_m` is the
material wage and `ψ_s` the psychological wage. -/
def W (ψm ψs : ℝ) : ℂ := ⟨ψm, ψs⟩

@[simp] theorem W_re (ψm ψs : ℝ) : (W ψm ψs).re = ψm := rfl
@[simp] theorem W_im (ψm ψs : ℝ) : (W ψm ψs).im = ψs := rfl

/-! ## Theorem: Imaginary Squaring as Material Destruction -/

/-- A wage paid purely in status is `W = j ψ_s`. Squaring it lands on the
negative real axis: `(j ψ_s)^2 = -ψ_s^2`. -/
theorem imaginary_squaring (ψs : ℝ) : (W 0 ψs) ^ 2 = W (-(ψs ^ 2)) 0 := by
  simp [W, Complex.ext_iff, sq, Complex.mul_re, Complex.mul_im]

/-- The square of a pure status wage is a real quantity. -/
theorem imaginary_squaring_real (ψs : ℝ) : ((W 0 ψs) ^ 2).im = 0 := by
  rw [imaginary_squaring]; rfl

/-- And it is never positive: compounding a purely symbolic wage cannot produce
material gain. This is the content the manuscript draws from the theorem. -/
theorem imaginary_squaring_nonpos (ψs : ℝ) : ((W 0 ψs) ^ 2).re ≤ 0 := by
  rw [imaginary_squaring]
  simpa using neg_nonpos.mpr (sq_nonneg ψs)

/-- The loss is strict whenever any status wage is actually paid. -/
theorem imaginary_squaring_neg {ψs : ℝ} (h : ψs ≠ 0) : ((W 0 ψs) ^ 2).re < 0 := by
  rw [imaginary_squaring]
  simpa using pow_pos (abs_pos.mpr h) 2 |>.trans_eq (sq_abs ψs)

/-! ## Theorem: Solidarity as Imaginary Cancellation -/

/-- Adding the conjugate wage `W* = ψ_m - j ψ_s` cancels the status component
and doubles the material one. -/
theorem solidarity (ψm ψs : ℝ) :
    W ψm ψs + (starRingEnd ℂ) (W ψm ψs) = ((2 * ψm : ℝ) : ℂ) := by
  rw [Complex.add_conj]; norm_num

/-- The cancellation does not depend on the size of the status wage. However
large `ψ_s` grows, the conjugate pair sums to the same purely material result.
This is the manuscript's claim that the imaginary wage cancels *entirely*. -/
theorem solidarity_independent_of_status (ψm ψs ψs' : ℝ) :
    W ψm ψs + (starRingEnd ℂ) (W ψm ψs) = W ψm ψs' + (starRingEnd ℂ) (W ψm ψs') := by
  rw [solidarity, solidarity]

/-- The sum carries no status component at all. -/
theorem solidarity_no_status (ψm ψs : ℝ) :
    (W ψm ψs + (starRingEnd ℂ) (W ψm ψs)).im = 0 := by
  rw [solidarity]; simp

/-! ## Polar form and the phase angle

The manuscript writes `W = R ∠ θ = R e^{jθ}` and reads the operating mode off
`θ`: `θ = 0` is a wholly material wage, `θ = 90°` the default status-only mode,
and `θ > 90°` the quadrant it names as the formal definition of fascism.
-/

/-- Polar form of the allocation. -/
noncomputable def polar (R θ : ℝ) : ℂ := ⟨R * Real.cos θ, R * Real.sin θ⟩

/-- `R = √(ψ_m² + ψ_s²)`, stated squared to stay inside the reals. -/
theorem polar_modulus_sq (R θ : ℝ) :
    (polar R θ).re ^ 2 + (polar R θ).im ^ 2 = R ^ 2 := by
  have h := Real.sin_sq_add_cos_sq θ
  simp only [polar]
  nlinarith [h]

/-- At `θ = 0` the wage is wholly material. -/
theorem phase_zero_is_material (R : ℝ) : (polar R 0).im = 0 := by
  simp [polar]

/-- At `θ = 90°` the wage is wholly psychological: the material component is
exactly zero. The manuscript calls this the kernel's default operating mode. -/
theorem phase_ninety_is_status_only (R : ℝ) : (polar R (Real.pi / 2)).re = 0 := by
  simp [polar]

/-- **Quadrant II characterisation.** For a non-zero allocation, the phase angle
exceeding 90° is equivalent to a negative material wage: the Buffer Class is
being drained of material wealth while the status wage is inflated. This is the
manuscript's formal definition of fascism, and it is exactly the condition
`ψ_m < 0`. -/
theorem quadrant_two_iff_material_extraction {R θ : ℝ} (hR : 0 < R) :
    Real.cos θ < 0 ↔ (polar R θ).re < 0 := by
  simp only [polar]
  constructor
  · intro h; exact mul_neg_of_pos_of_neg hR h
  · intro h; nlinarith

end OriginalPower
