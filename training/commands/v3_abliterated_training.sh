#!/bin/bash
# v3_abliterated_training.sh — Train a new adapter on the abliterated base model
# with the framework synthesis v3 data injected.
#
# Run from repo root:
#   source .venv-voice/bin/activate
#   bash training/commands/v3_abliterated_training.sh

set -e

cd "$(dirname "$0")/../.."

echo "[1/2] Merging synthesis v3 into training data..."
python3 training/merge_synthesis.py

echo "[2/2] Launching LoRA training on abliterated base..."
python3 training/train.py \
  --model mlx-community/Meta-Llama-3.1-8B-Instruct-abliterated-4bit \
  --adapter-path training/adapters/llama31_8b_abliterated_v3_rank16_e5 \
  --epochs 5 \
  --batch-size 4 \
  --grad-accumulation-steps 4 \
  --learning-rate 1e-5 \
  --max-seq-length 2048 \
  --lora-rank 16 \
  --lora-dropout 0.05 \
  --lora-scale 2.0 \
  --num-layers 32 \
  --save-every 100 \
  --steps-per-eval 100

echo "Training complete. Adapters saved to training/adapters/llama31_8b_abliterated_v3_rank16_e5/"
echo "To fuse into a single MLX model, run:"
echo "  python3 training/fuse_adapter.py \\"
echo "    --model mlx-community/Meta-Llama-3.1-8B-Instruct-abliterated-4bit \\"
echo "    --adapter-path training/adapters/llama31_8b_abliterated_v3_rank16_e5 \\"
echo "    --save-path training/fused_models/RootLedger-8B-Abliterated-v3-Fused"
