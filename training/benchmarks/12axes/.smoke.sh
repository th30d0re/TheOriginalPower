#!/bin/bash
cd /Users/emmanuel/Documents/Theory/TheOriginalPower
R=training/benchmarks/12axes
run(){ name=$1; shift; s=$(date +%s); echo "== $name"
  .venv-voice/bin/python $R/take_quiz.py --backend mlx --items $R/questions.tsv --limit 12 "$@" 2>&1 | grep -E 'ready|Completed 12|mass|rror'
  echo "  -> $(( $(date +%s)-s ))s"; }
run v4-none      --registry $R/models.tsv --run gemma-v4 --out $R/keys/smoke-v4-none.tsv
run v4-digest    --registry $R/models.tsv --run gemma-v4 --digest $R/framework_digest.md --out $R/keys/smoke-v4-digest.tsv
run v4u-final    --registry $R/models.tsv --run gemma-v4-unfused --out $R/keys/smoke-v4u-final.tsv
run v4u-e5       --model-path training/fused_models/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Fused --adapter-path training/adapters/gemma3_12b_npbp_abliterated_v3_v4_rank32_e5 --out $R/keys/smoke-v4u-e5.tsv
