#!/bin/bash
# gemma3_v3_training.sh — Train a LoRA adapter on Gemma-3-12B-IT (local LM Studio copy)
# with the framework synthesis v3 data injected, then fuse it.
#
# Run from repo root:
#   source .venv-voice/bin/activate
#   bash training/commands/gemma3_v3_training.sh

set -e

cd "$(dirname "$0")/../.."

MODEL_PATH="/Users/emmanuel/.lmstudio/models/mlx-community/gemma-3-12b-it-4bit"
ADAPTER_DIR="training/adapters/gemma3_12b_v3_rank16_e3"
FUSED_DIR="training/fused_models/RootLedger-Gemma3-12B-v3-Fused"

echo "[1/3] Merging synthesis v3 into training data..."
python3 training/merge_synthesis.py

echo "[2/3] Launching LoRA training on Gemma-3-12B-IT..."
python3 training/train.py \
  --model "${MODEL_PATH}" \
  --adapter-path "${ADAPTER_DIR}" \
  --epochs 3 \
  --batch-size 4 \
  --grad-accumulation-steps 4 \
  --learning-rate 1e-5 \
  --max-seq-length 2048 \
  --lora-rank 16 \
  --lora-dropout 0.05 \
  --lora-scale 2.0 \
  --num-layers 48 \
  --save-every 100 \
  --steps-per-eval 100

echo "[3/3] Fusing adapter into base model..."
python3 training/fuse_adapter.py \
  --model "${MODEL_PATH}" \
  --adapter-path "${ADAPTER_DIR}" \
  --save-path "${FUSED_DIR}"

echo "Done. Fused model available at: ${FUSED_DIR}"
