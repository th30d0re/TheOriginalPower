#!/bin/bash
# gemma3_abliterate.sh — Train anti-refusal LoRA on top of the fused Gemma-3-12B-v3
# model, then fuse it to produce an abliterated variant.
#
# Run from repo root:
#   source .venv-voice/bin/activate
#   bash training/commands/gemma3_abliterate.sh

set -e

cd "$(dirname "$0")/../.."

FUSED_BASE="training/fused_models/RootLedger-Gemma3-12B-v3-Fused"
ADAPTER_DIR="training/adapters/gemma3_12b_abliterated_v1_rank8_e2"
ABLITERATED_FUSED="training/fused_models/RootLedger-Gemma3-12B-v3-Abliterated-Fused"

echo "[1/2] Training anti-refusal LoRA on fused model..."
python3 training/train.py \
  --model "${FUSED_BASE}" \
  --data training/data/anti_refusal \
  --adapter-path "${ADAPTER_DIR}" \
  --epochs 2 \
  --batch-size 1 \
  --grad-accumulation-steps 8 \
  --learning-rate 5e-6 \
  --max-seq-length 2048 \
  --lora-rank 8 \
  --lora-dropout 0.0 \
  --lora-scale 1.0 \
  --num-layers 48 \
  --save-every 50 \
  --steps-per-eval 50 \
  --grad-checkpoint \
  --val-batches 4

echo "[2/2] Fusing anti-refusal adapter into fused model..."
python3 training/fuse_adapter.py \
  --model "${FUSED_BASE}" \
  --adapter-path "${ADAPTER_DIR}" \
  --save-path "${ABLITERATED_FUSED}"

echo "Done. Abliterated fused model available at: ${ABLITERATED_FUSED}"
