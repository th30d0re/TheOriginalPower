"""E1 (PREREG-training-fix.md): how much of a LoRA delta survives re-quantization during fusion.

Reproduces mlx_lm.tuner.lora.LoRALinear.fuse on the raw safetensors, without building the model:
W = dequantize(base), delta = scale * lora_b.T @ lora_a.T, then re-quantize W + delta.
retained = Q(W + delta) - Q(W): the change the fused model actually carries, net of plain
re-quantization noise on W. Reports its norm ratio and cosine against delta.

Usage: .venv-voice/bin/python e1_requant.py BASE_MODEL_DIR ADAPTER_DIR [--bits 4 8]
"""
import argparse
import glob
import json
import statistics
from pathlib import Path

import mlx.core as mx


def load_base(model_dir):
    weights = {}
    for f in sorted(glob.glob(str(Path(model_dir) / "*.safetensors"))):
        weights.update(mx.load(f))
    return weights


def requant(w, group_size, bits):
    q, s, b = mx.quantize(w, group_size=group_size, bits=bits)
    return mx.dequantize(q, s, b, group_size=group_size, bits=bits)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("adapter")
    ap.add_argument("--bits", type=int, nargs="+", default=[4, 8])
    args = ap.parse_args()

    cfg = json.loads((Path(args.adapter) / "adapter_config.json").read_text())
    scale = cfg["lora_parameters"]["scale"]
    qcfg = json.loads((Path(args.base) / "config.json").read_text())["quantization"]
    gs, base_bits = qcfg["group_size"], qcfg["bits"]
    lora = mx.load(str(Path(args.adapter) / "adapters.safetensors"))
    base = load_base(args.base)

    stats = {b: {"ratio": [], "cos": []} for b in args.bits}
    rel_delta = []
    for key in sorted(k for k in lora if k.endswith(".lora_a")):
        stem = key[: -len(".lora_a")]
        if stem + ".weight" not in base:
            # mlx_lm wraps the adapted linear as <name>.linear; base keys have no ".linear"
            stem_base = stem.replace(".linear", "")
        else:
            stem_base = stem
        W = mx.dequantize(base[stem_base + ".weight"], base[stem_base + ".scales"], base[stem_base + ".biases"],
                          group_size=gs, bits=base_bits).astype(mx.float32)
        delta = scale * (lora[stem + ".lora_b"].T @ lora[stem + ".lora_a"].T).astype(mx.float32)
        dn = mx.linalg.norm(delta).item()
        rel_delta.append(dn / mx.linalg.norm(W).item())
        for bits in args.bits:
            kept = requant(W + delta, gs, bits) - requant(W, gs, bits)
            kn = mx.linalg.norm(kept).item()
            cos = (mx.sum(kept * delta) / (kn * dn + 1e-12)).item()
            stats[bits]["ratio"].append(kn / dn)
            stats[bits]["cos"].append(cos)

    n = len(rel_delta)
    print(f"adapter={args.adapter} scale={scale} layers={n} base={base_bits}-bit gs={gs}")
    print(f"|delta|/|W| median={statistics.median(rel_delta):.4f} max={max(rel_delta):.4f}")
    for bits in args.bits:
        c, r = stats[bits]["cos"], stats[bits]["ratio"]
        print(f"requant {bits}-bit: cosine median={statistics.median(c):.3f} p10={sorted(c)[n // 10]:.3f} | "
              f"norm ratio median={statistics.median(r):.3f}")


if __name__ == "__main__":
    main()
