# Pre-registration: why fused RootLedger fine-tunes lose their training, and how to keep it

Registered 2026-09-28, before running E1–E3. Benchmark: this directory (240 forced items; 142
where the book speaks). Metrics, fixed now: Pearson r and MAE against `keys/gold_forced.tsv` on
the spoken items (left-pole values), extremity (share of SA/SD answers), mean |Δp| between keys.

## Observation that motivates this
Fused v4 ≈ v3 (mean |Δp| 0.011, 0/12 argmax changes on the smoke set; identical ladder metrics);
llama-v3 fused ≡ llama-v1 fused to 3 d.p. The same adapters applied at load change every answer
(mean |Δp| 0.32) and push 88% of answers to SA/SD. `training/fuse_adapter.py` calls
`mlx_lm.fuse` without `--dequantize` on 4-bit bases (group size 64, affine).

## E1 — mechanism: does 4-bit re-quantization erase the LoRA delta?
For every LoRA-adapted linear in the v4 adapter over the v3-Fused base: dequantize W, form
ΔW = scale · (lora_b.T @ lora_a.T) as mlx_lm fuses it, re-quantize W + ΔW at 4 and at 8 bits,
dequantize, and measure retained = ‖Q(W+ΔW) − Q'(W)‖ / ‖ΔW‖, where Q'(W) is the re-quantized
original (so pure rounding noise on W is not counted as signal), and the cosine between the
retained change and ΔW.
- **Prediction:** at 4 bits, median retained cosine < 0.5 and most of ΔW's norm lost; at 8 bits,
  cosine > 0.9. If 4-bit retains > 0.8 cosine, quantization is not the explanation — stop and
  re-diagnose (the fused ≈ base result would then need another cause, e.g. the adapter not
  loading at fuse time).

## E2 — adapter strength: is the live adapter over-scaled?
Live adapter (v3-Fused + v4 adapter), `lora_parameters.scale` ∈ {0.5, 1, 2, 4 (trained)}, with and
without the digest, forced items. Same for Llama (v1-Fused + v3 adapter; trained scale read from
its config).
- **Prediction:** r against the book peaks at a scale below the trained value, with extremity
  falling toward the gold key's 13% as scale drops. A scale-0.5 run should resemble the base.
- Negative outcome counts: if r is monotone in scale and highest at the trained value, the
  extremity is what the training taught and the fix is in training data, not scale.

## E3 — fusion method (only after E1 confirms, and after checking disk: ~44 GB free)
For the best E2 scale: fuse with `--dequantize` (fp16), then quantize that to 8-bit. Evaluate
fp16-fused, 8-bit, and the current 4-bit path on the forced items.
- **Prediction:** fp16-fused matches the live adapter (mean |Δp| < 0.02); 8-bit within 0.05;
  4-bit path collapses toward the base as observed.

A null or reversed result is recorded here exactly as a hit would be.

## Results

### E1 (2026-09-28) — confirmed, and stronger than predicted
`e1_requant.py`, 224 adapted linears per model, base 4-bit gs=64:

| adapter (scale) | median ‖ΔW‖/‖W‖ | 4-bit cosine (p10) | 8-bit cosine (p10) |
|---|---|---|---|
| gemma v4_final (4.0) on v3-Fused | 0.0049 | 0.035 (0.027) | 0.603 (0.441) |
| llama v3 rank16 (2.0) on v1-Fused | 0.0022 | 0.032 (0.020) | 0.167 (0.058) |

The 4-bit fused change is uncorrelated with the learned delta (cosine ≈ 0.03): the fused model
carries rounding noise, not the fine-tune. The 8-bit prediction (> 0.9) **failed**: 8-bit keeps
0.60 (Gemma) and 0.17 (Llama). Re-quantization at either width is not a viable fusion path;
E3 narrows to fp16 fusion (`--dequantize`) versus live adapters.

### E2 (2026-09-28) — prediction failed in its main form; a calibrated setting exists for Gemma
Live adapter over its fused parent, forced items. "0" = the fused model (≈ the parent, per E1).
r and MAE on the 142 spoken items; gold key extremity is 13%.

| family | scale | digest | r | MAE | extreme | axis dist gold | axis dist owner |
|---|---|---|---|---|---|---|---|
| llama | 0 | none | 0.56 | 0.212 | 16% | 9.6 | 19.6 |
| llama | 0.5 | none | 0.58 | 0.206 | 20% | 9.4 | 19.1 |
| llama | 1 | none | 0.60 | 0.202 | 28% | 9.1 | 18.8 |
| llama | **2 (trained)** | none | **0.62** | **0.197** | 32% | 8.6 | 18.7 |
| llama | 4 | none | 0.61 | 0.216 | 42% | 8.7 | 22.0 |
| llama | 0 | digest | **0.63** | **0.189** | 25% | 8.9 | 17.5 |
| llama | 0.5 | digest | 0.63 | 0.193 | 33% | 8.8 | 17.4 |
| llama | 1 | digest | 0.62 | 0.198 | 40% | 8.4 | 17.6 |
| llama | 2 (trained) | digest | 0.59 | 0.203 | 45% | 7.4 | 19.1 |
| llama | 4 | digest | 0.43 | 0.272 | 37% | 12.4 | 26.4 |
| gemma | 0 | none | 0.23 | 0.268 | 5% | 11.7 | 24.2 |
| gemma | 0.5 | none | 0.20 | 0.278 | 10% | 11.6 | 23.8 |
| gemma | 1 | none | 0.21 | 0.282 | 14% | 11.5 | 23.2 |
| gemma | 2 | none | 0.25 | 0.278 | 30% | 11.5 | 22.1 |
| gemma | 4 (trained) | none | 0.35 | 0.255 | 88% | 10.8 | 22.1 |
| gemma | 0 | digest | 0.46 | 0.231 | 4% | 8.9 | 21.6 |
| gemma | 0.5 | digest | 0.49 | 0.228 | 5% | 8.5 | 21.1 |
| gemma | 1 | digest | 0.53 | 0.221 | 8% | 8.1 | 20.5 |
| gemma | **2** | digest | **0.65** | 0.195 | **12%** | 7.1 | 19.2 |
| gemma | 4 (trained) | digest | 0.70 | 0.161 | 57% | 6.1 | 17.5 |

- The registered prediction (r peaks below the trained scale) **failed** without the digest: r is
  highest at the trained scale for both families. The negative clause applies: the extremity is
  what training taught, so scale alone does not fix it.
- With the digest the families split. Llama's adapter adds nothing and degrades at scale 4 (the
  adapter and the digest compete). Gemma's adapter and digest are complementary; r rises with scale.
- Gemma at scale 2 with the digest matches the gold key's extremity (12% vs 13%) at r 0.65, the best
  calibrated setting measured. Scale 4 buys r 0.70 at 57% extremity.
- Size of effects: the digest adds about +0.23 r for Gemma and +0.07 for Llama; the fine-tunes add
  at most +0.06 (Llama) and +0.12 (Gemma, at 88% extremity) without it.
