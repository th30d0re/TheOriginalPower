# L9 Findings — Per-Axis Identity Decomposition

## Implemented scope

The Trends ingestion layer now emits `identity_race`, `identity_gender`,
`identity_religion`, `identity_sexuality`, `identity_nationality`,
`identity_ability`, and `identity_unattributed`. The legacy `identity_band`
column remains the mean of every available configured identity term. Its
configured membership is asserted to equal the complete union of the six axes
and `unattributed`, and duplicate assignment across lists raises an error.

The interference engine computes high-frequency band power for each measured
manuscript axis with the configured FFT window and frequency bands. Each axis
reports `band_power`, `share_of_P_id`, and its own `O_x`. Unmeasured axes carry
`NaN` for all three fields and do not enter the `P_id` denominator.
`identity_unattributed` does not enter the decomposition.

## Keyword provenance

### Race

Manuscript mechanism: White primaries, the Variable Swap, War on Drugs proxy
variables, and “law and order” campaigns.

- `crt` and `dei`: contemporary racial-policy proxy queries.
- `war on drugs`: direct mechanism query.
- `law and order`: direct campaign-frame query.
- `white primary`: direct historical mechanism query.
- `racial profiling`: racial-policing proxy query within the specified routing.

### Gender

Manuscript mechanism: anti-ERA campaigns, “war on men” media narratives, and
the routing of feminism into a liberal corporate track.

- `anti ERA`: direct campaign query.
- `equal rights amendment`: the issue targeted by the anti-ERA campaign.
- `war on men`: direct media-frame query.
- `corporate feminism`: direct query for the corporate routing mechanism.
- `men's rights`: a common query for the gender-antagonism frame associated
  with “war on men” narratives.

### Religion

Manuscript mechanism: Moral Majority organization and evangelical mobilization
through abortion and school-prayer disputes.

- `moral majority`: direct organization query.
- `evangelical`: direct constituency query.
- `abortion`: direct mobilization issue.
- `school prayer`: direct mobilization issue.
- `religious right`: common query for the organized political formation.

### Sexuality

Manuscript mechanism: Anita Bryant's campaign, DOMA, anti-trans legislation,
and queer-straight working-class fragmentation.

- `transgender`: legacy term assigned to this axis.
- `anita bryant`: direct campaign-figure query.
- `doma`: direct legislation query.
- `anti trans`: direct query for the anti-trans legislative frame.
- `gay rights`: query for the contested advocacy frame.
- `save our children`: direct campaign-name query.

### Nationality

Manuscript mechanism: anti-busing campaigns, immigration restriction, and
nativist partition.

- `anti busing` and `school busing`: direct campaign and issue queries.
- `immigration restriction` and `illegal immigration`: direct restriction and
  grievance-frame queries.
- `nativism`: direct partition-frame query.

### Ability

Manuscript mechanism: ADA treatment as individual accommodation and disability
as a medical category separated from structural labor rights.

- `ada`: direct legislation query.
- `disability`: direct category query.
- `disability accommodation` and `workplace accommodation`: individual
  accommodation-track queries.
- `medical model of disability`: direct medical-category framing query.

### Unattributed

- `woke`
- `culture war`

Both legacy terms can refer to several axes and name no single manuscript axis.
They remain in the backward-compatible identity aggregate and are excluded
from the per-axis sum. No other configured term was left unattributed.

## Trends batching and anchor normalization

Each request contains `rent` plus no more than four other terms, keeping every
payload at or below Google Trends' five-keyword limit. The first batch supplies
the reference anchor scale. Every later batch is multiplied by the ratio of
the reference batch's mean `rent` value to that batch's mean `rent` value.
This places all returned keyword columns on the first batch's scale. A missing,
all-null, or flat-zero `rent` series raises `AnchorScalingError`; the ingestion
layer does not fall back around an invalid anchor normalization.

The committed fallback snapshot contains only the five legacy identity terms:
`woke`, `crt`, `transgender`, `dei`, and `culture war`. It therefore measures
two race terms, one sexuality term, and both unattributed terms. It contains no
configured terms for gender, religion, nationality, or ability. Those four
axis columns are `NaN`. Missing terms are individually logged with their axis.

## Backward compatibility

On the frozen fallback snapshot, the new `identity_band` equals the pre-change
mean of the five legacy columns to within `1e-12`, with the same dtype. Existing
top-level interference fields retain their prior calculations and rounding.
The new output is confined to the added `per_axis` block.

## Verification

`make arbitrage-test` completed successfully:

```text
170 passed in 3.81s
```

The total consists of the existing 166 tests and four new L9 tests. The new
coverage verifies a frozen single-axis sinusoid, fallback aggregate identity,
`NaN` denominator handling, and exclusion of `unattributed`.

## Specification choices

The manuscript table specifies mechanisms rather than a unique search basket.
I selected short US Google Trends queries that directly name the listed
campaigns, legislation, constituencies, proxy frames, or accommodation model.
The `identity_band` registry now lists the complete axis union so the required
runtime membership assertion has an explicit backward-compatible seam. On old
snapshots, unavailable additions are omitted from the aggregate and the five
available legacy terms reproduce the old value.

The brief requires anchor rescaling and does not prescribe a statistic for the
anchor ratio. I used the full-period mean, a single stable multiplier per batch
that preserves each keyword's time-series shape.

## What was not measured

No live Google Trends request was made during verification. The relative scale
of live batches and live coverage of the added terms remain unmeasured. No
backtest was run or modified, so this change supplies no revised Brier score,
forecast calibration, trading result, or claim that per-axis decomposition
improves predictive performance. `V_E` remains the existing `0.0` placeholder.
