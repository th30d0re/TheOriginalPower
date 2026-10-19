# Findings: 12 Axes Quiz Runner (`take_quiz.py`)

## Architecture and Design Decisions

The runner implements two backends:
1. `mlx`: Executes local language models (specifically the fine-tuned RootLedger series) via MLX LM. The runner reads next-token logits from a single forward pass, extracts log-sum-exp over single-token encodings for options A through E, applies softmax normalization across the five choices, and reuses prefilled KV cache prefixes across items.
2. `systemone`: Interacts with servers adhering to the TypeSafe `/v1/systemone` wire protocol via Score questions, batching requests, caching responses on disk, and converting level probabilities directly to the SD..SA scale.

### Answer Scale Mapping
The CONTRACT specifies five ordinal answer levels:
- `SA`: Strongly agree (weight 1.0)
- `A`: Agree (weight 0.75)
- `N`: Neutral / it depends (weight 0.5)
- `D`: Disagree (weight 0.25)
- `SD`: Strongly disagree (weight 0.0)

For `mlx`:
Option letters map directly: A -> SA, B -> A, C -> N, D -> D, E -> SD.
`answer` is the argmax among `{SA, A, N, D, SD}`.
`expected` is the dot product of normalized probabilities with `[1.0, 0.75, 0.5, 0.25, 0.0]`.
`confidence` defaults to `max(p_SA, p_A, p_N, p_D, p_SD)`.

For `systemone`:
The five rubric levels 0 through 4 map in ascending order:
Level 0 -> SD, Level 1 -> D, Level 2 -> N, Level 3 -> A, Level 4 -> SA.
`confidence` is the score confidence returned by the endpoint.

### KV Cache Prefix Strategy
In MLX LM, the model's forward pass accepts a cache list. Prefilling the shared instruction prefix (and framework digest when provided) produces an initialized KV cache. For each subsequent quiz item:
- A copy of the initialized prefix cache is created via `copy.deepcopy`.
- Only the item tokens are evaluated in the forward pass.
- Logits at the final token position determine the probability distribution for the next generated token.
This avoids re-encoding the shared prefix for every question.

### Single-Token Vocabulary Resolution
Language model tokenizers assign distinct IDs to characters with and without whitespace prefixes (e.g. `A` versus ` A`), as well as byte-fallback tokens (e.g. `<0x41>`). The runner scans the model vocabulary during initialization and collects every token whose decoded string equals `X` or ` X` for each letter X in `{A, B, C, D, E}`. Log-sum-exp over the corresponding logits aggregates the total logit for each choice before softmax normalization.
