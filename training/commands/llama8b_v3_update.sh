#!/bin/bash
# llama8b_v3_update.sh — Update RootLedger-8B-Abliterated-Fused with v3 framework data.
#
# Run from repo root:
#   source .venv-voice/bin/activate
#   bash training/commands/llama8b_v3_update.sh

set -e

cd "$(dirname "$0")/../.."

FUSED_BASE="training/fused_models/RootLedger-8B-Abliterated-Fused"
ADAPTER_DIR="training/adapters/llama31_8b_abliterated_v3_rank16_e3"
V3_FUSED="training/fused_models/RootLedger-8B-Abliterated-v3-Fused"

echo "[1/2] Training v3 framework adapter on top of existing fused model..."
python3 training/train.py \
  --model "${FUSED_BASE}" \
  --adapter-path "${ADAPTER_DIR}" \
  --epochs 3 \
  --batch-size 1 \
  --grad-accumulation-steps 16 \
  --learning-rate 1e-5 \
  --max-seq-length 2048 \
  --lora-rank 16 \
  --lora-dropout 0.05 \
  --lora-scale 2.0 \
  --num-layers 32 \
  --save-every 100 \
  --steps-per-eval 100 \
  --grad-checkpoint \
  --val-batches 10

echo "[2/2] Fusing v3 adapter into fused model..."
python3 training/fuse_adapter.py \
  --model "${FUSED_BASE}" \
  --adapter-path "${ADAPTER_DIR}" \
  --save-path "${V3_FUSED}"

echo "Done. Updated v3 fused model available at: ${V3_FUSED}"
