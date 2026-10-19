# 12 Axes benchmark results

Gold key: 142 of 240 items where the book speaks (book or inferred basis); 98 silent. 119 items are compound.

## Agreement with the book (forced items)

MAE and r are on left-pole agreement values over the items where the book speaks. `dist` is mean absolute axis-score distance (percentage points). `extreme` is the share of answers at SA or SD.

| run | digest | MAE spoken | exact spoken | r spoken | dist to gold | dist to owner | extreme |
|---|---|---|---|---|---|---|---|
| **gold (book)** | — | 0 | 100% | 1.00 | 0.0 | 18.9 | 13% |
| gemma-base | none | 0.264 | 24% | 0.25 | 11.3 | 24.1 | 4% |
| gemma-base | digest | 0.231 | 25% | 0.42 | 8.9 | 21.9 | 3% |
| gemma-plain | none | 0.258 | 13% | 0.41 | 11.4 | 24.7 | 3% |
| gemma-plain | digest | 0.232 | 20% | 0.50 | 9.8 | 22.6 | 2% |
| gemma-v3 | none | 0.268 | 23% | 0.23 | 11.7 | 24.2 | 5% |
| gemma-v3 | digest | 0.231 | 23% | 0.46 | 8.9 | 21.6 | 4% |
| gemma-v4 | none | 0.269 | 23% | 0.23 | 11.7 | 24.2 | 5% |
| gemma-v4 | digest | 0.231 | 23% | 0.45 | 8.8 | 21.8 | 3% |
| gemma-v4-i1000 | none | 0.270 | 23% | 0.22 | 11.7 | 24.4 | 5% |
| gemma-v4-i1000 | digest | 0.232 | 24% | 0.45 | 8.9 | 21.7 | 3% |
| gemma-v4-unfused | none | 0.255 | 18% | 0.35 | 10.8 | 22.1 | 88% |
| gemma-v4-unfused | digest | 0.161 | 29% | 0.70 | 6.1 | 17.5 | 57% |
| llama-base | none | 0.219 | 38% | 0.53 | 9.5 | 20.1 | 11% |
| llama-base | digest | 0.196 | 33% | 0.63 | 8.6 | 18.7 | 28% |
| llama-plain | none | 0.218 | 43% | 0.53 | 9.6 | 21.6 | 17% |
| llama-plain | digest | 0.175 | 37% | 0.69 | 7.3 | 19.4 | 52% |
| llama-v1 | none | 0.212 | 42% | 0.56 | 9.6 | 19.6 | 16% |
| llama-v1 | digest | 0.189 | 43% | 0.63 | 8.9 | 17.5 | 25% |
| llama-v3 | none | 0.211 | 42% | 0.56 | 9.6 | 19.5 | 16% |
| llama-v3 | digest | 0.189 | 44% | 0.63 | 9.0 | 17.5 | 26% |
| llama-v3-unfused | none | 0.197 | 39% | 0.62 | 8.6 | 18.7 | 32% |
| llama-v3-unfused | digest | 0.203 | 39% | 0.59 | 7.4 | 19.1 | 45% |

## Axis profiles, forced items (left-pole %)

| run | digest | Feder | Democ | Secur | Assim | Milit | Non-i | Publi | Plann | Prote | Irrel | Progr | Techn |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **owner** | — | 81 | 70 | 0 | 5 | 62 | 51 | 84 | 81 | 55 | 95 | 98 | 62 |
| gold (book) | — | 50 | 79 | 24 | 32 | 52 | 60 | 76 | 62 | 64 | 60 | 65 | 49 |
| gemma-base | none | 57 | 59 | 41 | 42 | 52 | 45 | 55 | 51 | 58 | 48 | 54 | 56 |
| gemma-base | digest | 58 | 63 | 45 | 41 | 52 | 51 | 65 | 53 | 56 | 54 | 58 | 51 |
| gemma-plain | none | 55 | 57 | 41 | 40 | 49 | 48 | 53 | 50 | 55 | 51 | 51 | 51 |
| gemma-plain | digest | 60 | 58 | 43 | 41 | 50 | 52 | 62 | 50 | 54 | 58 | 54 | 50 |
| gemma-v3 | none | 58 | 58 | 40 | 43 | 51 | 44 | 55 | 51 | 58 | 49 | 53 | 56 |
| gemma-v3 | digest | 58 | 61 | 45 | 39 | 54 | 51 | 66 | 51 | 56 | 59 | 56 | 50 |
| gemma-v4 | none | 58 | 58 | 40 | 43 | 51 | 45 | 55 | 51 | 58 | 49 | 53 | 55 |
| gemma-v4 | digest | 57 | 61 | 45 | 40 | 54 | 51 | 66 | 51 | 56 | 59 | 56 | 50 |
| gemma-v4-i1000 | none | 57 | 58 | 40 | 43 | 51 | 44 | 55 | 51 | 58 | 49 | 53 | 55 |
| gemma-v4-i1000 | digest | 58 | 61 | 45 | 39 | 54 | 51 | 66 | 51 | 56 | 59 | 56 | 51 |
| gemma-v4-unfused | none | 58 | 56 | 36 | 41 | 56 | 36 | 67 | 48 | 52 | 55 | 62 | 56 |
| gemma-v4-unfused | digest | 61 | 69 | 36 | 31 | 46 | 51 | 77 | 56 | 52 | 60 | 68 | 50 |
| llama-base | none | 63 | 62 | 40 | 36 | 40 | 50 | 69 | 54 | 47 | 62 | 67 | 54 |
| llama-base | digest | 65 | 69 | 32 | 33 | 32 | 65 | 72 | 52 | 54 | 69 | 74 | 52 |
| llama-plain | none | 63 | 62 | 36 | 35 | 36 | 52 | 66 | 49 | 45 | 60 | 67 | 49 |
| llama-plain | digest | 66 | 74 | 29 | 34 | 30 | 64 | 74 | 56 | 59 | 68 | 72 | 44 |
| llama-v1 | none | 63 | 62 | 39 | 35 | 39 | 49 | 69 | 56 | 48 | 62 | 71 | 55 |
| llama-v1 | digest | 67 | 70 | 30 | 30 | 33 | 64 | 73 | 51 | 56 | 70 | 76 | 54 |
| llama-v3 | none | 63 | 62 | 39 | 35 | 39 | 49 | 69 | 56 | 48 | 62 | 71 | 55 |
| llama-v3 | digest | 67 | 70 | 30 | 30 | 33 | 64 | 73 | 51 | 57 | 70 | 76 | 54 |
| llama-v3-unfused | none | 62 | 63 | 38 | 35 | 41 | 49 | 71 | 59 | 51 | 63 | 72 | 53 |
| llama-v3-unfused | digest | 65 | 68 | 30 | 33 | 37 | 61 | 69 | 50 | 61 | 68 | 71 | 52 |

## Wording effect: split-clause minus forced, per axis (percentage points)

Positive means splitting compound items into single claims moves the axis toward its left pole.

| run | digest | Feder | Democ | Secur | Assim | Milit | Non-i | Publi | Plann | Prote | Irrel | Progr | Techn | mean abs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| gold (book) | — | +1 | -1 | +3 | +1 | +1 | +1 | -1 | -2 | +1 | -2 | -2 | -0 | 1.2 |
| gemma-base | none | -3 | +0 | -2 | +2 | -4 | +1 | -2 | -2 | -3 | +2 | -0 | -3 | 1.9 |
| gemma-base | digest | -0 | -1 | +1 | +2 | -1 | +1 | -3 | -3 | +1 | +3 | -1 | -2 | 1.4 |
| gemma-plain | none | -2 | +2 | -2 | +0 | -1 | +0 | -1 | -1 | -2 | +1 | +1 | +0 | 1.3 |
| gemma-plain | digest | -1 | +0 | +2 | +1 | +2 | +1 | -4 | +0 | +1 | -0 | +0 | -0 | 1.1 |
| gemma-v3 | none | -3 | +2 | -2 | +2 | -4 | +1 | -2 | -3 | -3 | +1 | +0 | -3 | 2.2 |
| gemma-v3 | digest | -0 | -0 | -0 | +2 | -1 | +2 | -4 | -1 | -0 | +0 | -0 | -1 | 1.0 |
| gemma-v4 | none | -3 | +2 | -2 | +2 | -4 | +1 | -2 | -2 | -2 | +1 | +0 | -3 | 2.1 |
| gemma-v4 | digest | -0 | -1 | -0 | +2 | -1 | +2 | -4 | -1 | -1 | -1 | -1 | -1 | 1.2 |
| gemma-v4-i1000 | none | -4 | +2 | -2 | +2 | -4 | +1 | -2 | -2 | -2 | +1 | +0 | -3 | 2.1 |
| gemma-v4-i1000 | digest | -0 | -0 | +0 | +2 | -1 | +2 | -4 | -1 | -0 | -0 | -0 | -1 | 1.1 |
| gemma-v4-unfused | none | -4 | -0 | -0 | +0 | -3 | +1 | -1 | +2 | +1 | -3 | -3 | -1 | 1.6 |
| gemma-v4-unfused | digest | -2 | -1 | +1 | +2 | -1 | +3 | -2 | -0 | +1 | -4 | -4 | -0 | 1.8 |
| llama-base | none | -2 | +0 | -2 | +2 | -0 | +2 | +0 | -2 | +3 | -3 | -4 | -2 | 1.8 |
| llama-base | digest | -2 | -1 | +2 | +2 | +1 | +1 | -1 | -1 | -1 | -3 | -6 | -2 | 1.8 |
| llama-plain | none | -2 | +1 | -0 | +0 | -2 | +3 | +1 | -1 | +2 | -1 | -5 | -1 | 1.5 |
| llama-plain | digest | -2 | -2 | +0 | +0 | +1 | +1 | -1 | -1 | +0 | -2 | -5 | -0 | 1.4 |
| llama-v1 | none | -2 | +0 | -2 | +1 | -1 | +3 | +1 | -2 | +2 | -3 | -4 | -2 | 1.8 |
| llama-v1 | digest | -2 | -2 | +2 | +2 | -0 | +1 | -0 | +0 | -1 | -3 | -5 | -1 | 1.6 |
| llama-v3 | none | -2 | +0 | -2 | +1 | -1 | +3 | +1 | -2 | +2 | -3 | -4 | -2 | 1.9 |
| llama-v3 | digest | -2 | -2 | +2 | +2 | -0 | +1 | -0 | +0 | -1 | -3 | -5 | -1 | 1.6 |
| llama-v3-unfused | none | -3 | -0 | -2 | +2 | -1 | +3 | +0 | -2 | +2 | -4 | -4 | -2 | 2.0 |
| llama-v3-unfused | digest | -2 | -2 | +1 | +2 | -0 | +1 | +0 | +1 | -2 | -2 | -3 | -0 | 1.3 |

## Compound items: does the model hedge more?

Mean probability on N (neutral), compound items vs single-claim items, forced keys.

| run | digest | p(N) compound | p(N) single |
|---|---|---|---|
| gemma-base | none | 0.524 | 0.606 |
| gemma-base | digest | 0.597 | 0.645 |
| gemma-plain | none | 0.801 | 0.833 |
| gemma-plain | digest | 0.755 | 0.768 |
| gemma-v3 | none | 0.531 | 0.595 |
| gemma-v3 | digest | 0.655 | 0.654 |
| gemma-v4 | none | 0.524 | 0.593 |
| gemma-v4 | digest | 0.670 | 0.663 |
| gemma-v4-i1000 | none | 0.523 | 0.588 |
| gemma-v4-i1000 | digest | 0.659 | 0.660 |
| gemma-v4-unfused | none | 0.083 | 0.069 |
| gemma-v4-unfused | digest | 0.222 | 0.190 |
| llama-base | none | 0.303 | 0.287 |
| llama-base | digest | 0.325 | 0.348 |
| llama-plain | none | 0.164 | 0.181 |
| llama-plain | digest | 0.185 | 0.193 |
| llama-v1 | none | 0.204 | 0.199 |
| llama-v1 | digest | 0.183 | 0.205 |
| llama-v3 | none | 0.200 | 0.195 |
| llama-v3 | digest | 0.176 | 0.199 |
| llama-v3-unfused | none | 0.194 | 0.188 |
| llama-v3-unfused | digest | 0.116 | 0.143 |
