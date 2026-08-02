# videolab — Interface Contract

**Every agent working on `videolab/` builds against this file. It is the authority.**
If your code and this document disagree, this document wins. If you believe the contract is
wrong, write your objection into your loop's findings file and implement the contract anyway —
the orchestrator reconciles.

Three loops build `videolab/` in parallel in separate worktrees. They never see each other's
code until merge, so every boundary between them is specified here.

---

## 1. Pipeline stages and ownership

```
A1  fetch    container, network on, cookies ro   yt-dlp             → V2 (codex)
A2  dm       HOST, instagram-cli @ejtheodore     --download         → V3 (codex)
A3  file     no fetch                            local .mp4         → V2 (codex)
B   derive   container, --no-dns, no creds       ffmpeg + tesseract → V1 (kimi)
C   asr      HOST, .venv-voice, MLX/Metal        mlx-whisper        → V2 (codex)
D   report   HOST, pure Python                   md + json          → V1 (kimi)
```

**Credentials never enter the container.** A1 mounts a cookie file read-only into a stage that
runs `yt-dlp` and nothing else. A2 runs wholly on the host; `~/.instagram-cli/users/ejtheodore`
holds a live session and must never be mounted into a container. Stage B parses
attacker-controlled bytes and therefore carries no credentials of any kind.

---

## 2. Job directories

One job = one directory. URL- and file-sourced jobs live under `videolab/jobs/` and commit
except for media. DM-sourced jobs live under `videolab/jobs-private/`, which is ignored in its
entirety. DM provenance contains third-party personal data and never enters git. Nothing outside
the selected job root is ever written.

```
videolab/jobs/<slug>/                 # URL and file sources
# or videolab/jobs-private/<slug>/    # DM sources; local-only
├── job.json                    # state machine; every stage updates it
├── source.info.json            # A1 only — complete raw yt-dlp info dict, unmodified
├── dm.json                     # A2 only — instagram-cli thread + message provenance
├── frames.json                 # B — frame index with timestamps
├── ocr.jsonl                   # B — one JSON object per line
├── transcript.txt|srt|vtt|json # C
├── <slug>.md                   # D
├── <slug>_metadata.json        # D
└── media/                      # gitignored for committed jobs
    ├── video.mp4
    ├── audio.wav
    └── frames/frame_0001.jpg …
```

Paths inside `job.json`, `frames.json`, `ocr.jsonl`, and `<slug>_metadata.json` are always
**relative to the job directory** (`media/frames/frame_0001.jpg`), never absolute. Absolute paths
break the container/host boundary and leak the operator's home directory into committed files.

---

## 3. Slugs — `videolab/src/videolab/slugs.py` (V1 owns)

```python
def parse_source(src: str) -> Source
def slug_for(source: Source) -> str
```

```python
@dataclass(frozen=True)
class Source:
    kind: Literal["url", "file", "dm"]
    platform: Literal["instagram", "x", "youtube", "tiktok", "file"]
    id: str
    url: str | None
    path: str | None
```

Slug format: `<platform>-<id>`, matching `^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$`.

**Case is preserved, never folded.** Instagram shortcodes and YouTube video ids are
case-sensitive: `DZtCPIRPT87` and `dztcpirpt87` are different posts, so lowercasing destroys
identity. The platform prefix is always lowercase; the id keeps its original case. This also keeps
generated filenames consistent with the seven committed `reel_DZtCPIRPT87.*` files.

| Input | platform | id |
|---|---|---|
| `instagram.com/reel/DZtCPIRPT87/…` | `instagram` | `DZtCPIRPT87` |
| `x.com/user/status/187845…` / `twitter.com/…` | `x` | numeric status id |
| `youtube.com/watch?v=aqz-KE-bpKQ`, `youtu.be/…` | `youtube` | video id |
| `tiktok.com/@u/video/123…` | `tiktok` | numeric id |
| local path | `file` | first 12 hex of file SHA-256 |

Rules: strip all query strings before extracting an id — Instagram share links carry `?igsh=…`
and it must not reach the slug. Unknown hosts raise `UnsupportedSourceError`. Slug generation is
pure and total: same input always yields the same slug, no clock, no network, no filesystem
access except the hash for `kind="file"`.

---

## 4. `job.json`

Written by the CLI at job creation; each stage rewrites its own block only.

```json
{
  "schema_version": 1,
  "slug": "instagram-DZtCPIRPT87",
  "source": {
    "kind": "url",
    "platform": "instagram",
    "id": "DZtCPIRPT87",
    "url": "https://www.instagram.com/reel/DZtCPIRPT87/",
    "path": null
  },
  "created_at": "2026-08-01T22:40:00Z",
  "stages": {
    "fetch":  {"status": "ok", "engine": "yt-dlp",     "detail": {}, "started_at": "…", "ended_at": "…", "error": null},
    "derive": {"status": "ok", "engine": "ffmpeg+tesseract", "detail": {"frames": 12, "ocr_rows": 12, "ocr_kept": 4}, "…": null},
    "asr":    {"status": "ok", "engine": "mlx-whisper", "detail": {"model": "mlx-community/whisper-large-v3-turbo", "language": "en"}, "…": null},
    "report": {"status": "ok", "engine": "videolab.report", "detail": {}, "…": null}
  }
}
```

`status` ∈ `pending | ok | skipped | error`. Timestamps are UTC ISO-8601 with a trailing `Z`.
`skipped` is a success state — A3 file-drop legitimately skips `fetch`.

---

## 5. In-container entrypoints

Both scripts live in `videolab/incontainer/`, are copied to `/app/` in the image, run under
Python 3.11 with **no third-party imports except those in the image**, write only under `/job`,
print exactly **one** JSON line to stdout as their last action, and exit `0` on success / `1` on
failure. All human-readable progress goes to stderr.

```bash
# A1 — V2 owns
python3 /app/fetch_job.py --job /job --url <URL> [--cookies /cookies/<domain>.txt]
# → {"ok": true, "video": "media/video.mp4", "info": "source.info.json"}

# B — V1 owns
python3 /app/derive_job.py --job /job [--frames 12] [--scene-threshold 0.3] \
                           [--min-interval 2.0] [--no-ocr] [--ocr-lang eng]
# → {"ok": true, "frames": 12, "ocr_rows": 12, "ocr_kept": 4, "audio": "media/audio.wav"}
```

Failure on either: `{"ok": false, "error": "<message>"}`, exit 1.

---

## 6. Stage B outputs

`media/audio.wav` — 16 kHz mono PCM, matching the existing
`Paper/research/video_transcripts/audio/*.wav`:

```
ffmpeg -nostdin -y -i media/video.mp4 -vn -ac 1 -ar 16000 media/audio.wav
```

`frames.json`:

```json
{"schema_version": 1,
 "frames": [{"index": 1, "file": "media/frames/frame_0001.jpg", "t_seconds": 3.24, "selected_by": "scene"}]}
```

`selected_by` ∈ `scene | interval`. Selection is scene-change
(`select='gt(scene,<threshold>)'`) unioned with a fixed-interval floor every `--min-interval`
seconds, so a static talking-head clip still yields stills.

**Default `--scene-threshold` is 0.15.** Measured against
`supporting_material/instagram_reels/reel_DZe71fExaH3.mp4`, a threshold of 0.3 detects zero scene
changes across 160 seconds while 0.1 detects 19. Reels are commonly single-shot with soft
transitions, so 0.3 leaves frame selection entirely to the interval floor. Sort by `t_seconds`, renumber
`index` from 1, cap at `--frames N` by keeping an even spread across the duration rather than
truncating the tail — the end of a reel is often where the claim lands.

`ocr.jsonl` — one object per line, one line per frame, **in frame order**:

```json
{"frame_index": 1, "t_seconds": 3.24, "text": "THEY DONT WANT YOU TO KNOW", "mean_conf": 87.4, "duplicate_of": null}
```

**Dedupe is the point of this stage.** Burned-in captions persist across dozens of frames; without
dedupe the OCR channel is repetition and worthless as model input. Compare each row's normalized
text (casefold, collapse whitespace, strip non-alphanumerics) against the last **kept** row using
`difflib.SequenceMatcher.ratio()`. Ratio ≥ `0.92` sets `duplicate_of` to that row's `frame_index`;
otherwise `null` and this row becomes the new "last kept". Rows with empty text or
`mean_conf < 40` get `text: ""` and are never kept.

Every row is written regardless — dedupe marks, it does not drop. Consumers render only rows where
`duplicate_of` is `null`.

---

## 7. Stage C outputs — V2 owns

`transcript.txt` (plain), `.srt`, `.vtt`, `.json` (segments with `start`, `end`, `text`) — the
same file set already in `Paper/research/video_transcripts/transcripts/`.

---

## 8. Stage D — `<slug>_metadata.json` (V1 owns)

Mirror the schema already in production. Read
`supporting_material/instagram_reels/reel_DZtCPIRPT87_metadata.json` before writing this code and
reproduce its shape. Top-level keys, in order:

```
id, slug, url, platform, reel_id?, creator, content, engagement, metadata,
transcription, ocr, frames, dm_provenance, content_analysis, framework_notes,
tier_classification
```

`reel_id` is emitted **only** when `platform == "instagram"`, carrying the same value as `id`, for
backward compatibility with the seven committed reel files.

`content_analysis`, `framework_notes`, and `tier_classification` are emitted as empty scaffolds
for a model to fill — `videolab` never invents interpretation. `tier_classification` pre-fills the
mechanical judgements only: machine-generated fields (`transcript`, `ocr`, `platform_metrics`) get
`"Tier 2"`, interpretive fields get `"Tier 3"`.

### Three bugs that must not be reproduced

These come from `~/Dev/tulu/external/URL-to-Text/Python_MVP/src/video_downloader.py` and they
corrupted the committed metadata. Both V1 and V2 are bound by them.

1. **`:142` defaults `view_count` to `0`.** That is the actual origin of `"play_count": 0` plus
   the hand-written "likely a scraping artifact" note in `reel_DZtCPIRPT87_metadata.json`. A
   missing count is `null`. Never `0`. `0` is a real value that means zero.
2. **`:143` truncates the description at 200 chars and appends `"..."`.** That is why the stored
   hashtag list literally ends `"#equa..."`. Store descriptions in full; derive hashtags from the
   complete string.
3. **`validate_url()` then `download_video()` each run a full `extract_info`,** doubling network
   hits against platforms that rate-limit. Exactly one `extract_info(download=True)` per fetch.

### `engagement`

```json
{"likes": null, "comments_count": null, "play_count": null, "views": null, "shares": null, "saves": null}
```

Absent metrics are `null` with no apology note. The note in the old file existed to explain a bug
that no longer exists.

---

## 9. Stage D — `<slug>.md` (V1 owns)

Mirror `supporting_material/instagram_reels/reel_DZtCPIRPT87.md`, including its **Data Sources
(Mode Labels)** table — now populated programmatically rather than by hand. Sections in order:
title, bullet header, Data Sources table, Video Metadata, Transcription, On-Screen Text (OCR),
Frames, Content Analysis (empty scaffold), Framework Notes (empty scaffold).

Prose in this file is subject to `AGENTS.md`: direct affirmative declarative statements. No
"It is not merely X, it is Y" constructions, no corrective contrasts.

---

## 10. Bundle format — `videolab/src/videolab/report.py::render_bundle(slug) -> str`

V1 owns it; V3's MCP server calls it. This is the single string handed to a model for framework
analysis. Markdown, in this order:

1. `# <slug>` and the source URL
2. `## Metadata` — creator, duration, posted date, full description, hashtags
3. `## Transcript` — full text from `transcript.txt`
4. `## On-Screen Text` — only `ocr.jsonl` rows with `duplicate_of == null`, as `[MM:SS] text`
5. `## Frames` — count and timestamps, noting that images come from `videolab_get_frames`
6. `## Provenance` — per-stage engine and status from `job.json`

Pure function of on-disk state. No network, no model calls.

---

## 11. Hard constraints — all loops

1. Never write outside your own worktree.
2. Never modify `Paper/` — manuscript source.
3. Never commit or print credentials. Cookies live at `~/.config/videolab/cookies/` (mode 600),
   outside the repo. The instagram-cli session at `~/.instagram-cli/` is read via the CLI only,
   never parsed, copied, or mounted.
4. Never `git checkout --`, `git reset`, or rewrite history (`AGENTS.md`).
5. Python 3.11, 4-space indent, type hints on public functions, `from __future__ import
   annotations`.
6. Determinism: no wall-clock or randomness in any output except the explicit `*_at` timestamp
   fields in `job.json`.
7. Tests use fixtures, never the network. A test that needs a video uses a tiny generated clip
   (`ffmpeg -f lavfi -i testsrc`) or a committed fixture — never a download.
