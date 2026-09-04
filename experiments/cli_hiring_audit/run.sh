#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

BATCH_COUNT="${BATCH_COUNT:-15}"
MODEL="${MODEL:-gpt-5.6-sol}"
MODEL_CMD="${MODEL_CMD:-codex exec -m gpt-5.6-sol -s read-only}"
PYTHON_BIN="${PYTHON_BIN:-python3}"
CALL_COUNT=$((BATCH_COUNT * 3))

echo "Estimated CLI calls: ${CALL_COUNT} (${BATCH_COUNT} batches x 3 levels)"
"${PYTHON_BIN}" build_pairs.py
"${PYTHON_BIN}" assemble_batches.py --count "${BATCH_COUNT}"
"${PYTHON_BIN}" run_model.py --count "${BATCH_COUNT}" --model "${MODEL}" --model-cmd "${MODEL_CMD}"
"${PYTHON_BIN}" parse.py --model "${MODEL}"
"${PYTHON_BIN}" join_race.py --model "${MODEL}"
"${PYTHON_BIN}" analyze.py
