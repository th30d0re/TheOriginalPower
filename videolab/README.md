# videolab

`videolab` turns a public video URL or local video file into a reproducible job directory containing source metadata, extracted frames, OCR, audio, and a transcript.

## Runtime

The worker image requires Apple Containerization 1.0.0 or newer. Start its service and build the image:

```bash
container system start
container build -f videolab/containerfiles/Containerfile.worker -t videolab-worker:latest videolab/
```

Stage A1 runs `yt-dlp` with network access and an optional read-only cookie-directory mount. Stage B uses DNS denial, dropped capabilities, a read-only container root, and a temporary `/tmp`. Apple Containerization's `--no-dns` flag prevents DNS resolution. This configuration does not create a sealed network namespace.

Transcription runs on the host with `mlx-whisper` and Metal from `.venv-voice`. The default model is `mlx-community/whisper-large-v3-turbo`. The pipeline uses the `openai-whisper` executable on `PATH` when MLX cannot run.

Add the source package to Python's import path for direct repository use:

```bash
export PYTHONPATH="$PWD/videolab/src"
python -m videolab doctor
python -m videolab ingest 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' --frames 12
python -m videolab ingest ./video.mp4 --no-ocr --asr host
python -m videolab list
```

## Cookies

Refresh a browser cookie export on the host:

```bash
python -m videolab cookies refresh --browser safari --domain instagram.com
```

Cookie exports live under `~/.config/videolab/cookies/` with mode `600`. They never live under `videolab/`. Fetch mounts only that cookie directory at `/cookies` as read-only. Derivation receives no cookie mount or other credential source.

## Siri speech helper

The videolab website's read-aloud widget uses Siri Voice 2 when the local speech helper is running. Install the persistent launchd daemon with:

```bash
python -m videolab speech install
python -m videolab speech status
```

The installer stages `siri-speech/Sources/main.swift` at `~/Library/Application Support/videolab/main.swift`, resolves the active Xcode developer directory, and loads `com.videolab.speech` with `RunAtLoad` and `KeepAlive`. The agent invokes Apple-signed `/usr/bin/swift` against that staged source, which preserves access to Siri Voice 2 without a TCC-protected `~/Documents` read, and writes output to `videolab/logs/speech.out.log` and `videolab/logs/speech.err.log`. Status requires the agent to be installed and loaded and `/health` to report both `ok: true` and `available: true`; it separately reports staged-source drift with a reinstall remedy. Remove the daemon and staged source with `python -m videolab speech uninstall`.

For foreground development, run:

```bash
make videolab-speech
```

The helper listens on `127.0.0.1:5277` only. Without it the widget falls back to the browser's built-in voices.

## DM watcher

Install the 15-minute DM watcher with a deep scan of up to 50 items per run:

```bash
python -m videolab watch install
```

Deep scanning is the default because the narrow inbox scan misses real reels. Adjust the batch limit with `--limit N`, or explicitly select the narrow scan with `--no-all-threads`. Use `python -m videolab watch status` to inspect it and `python -m videolab watch uninstall` to remove it.

## Output

Each job lives at `videolab/jobs/<slug>/`. Machine-readable paths stored in its JSON files are relative to the job directory. The `media/` child is the only ignored job path.

Run the unit tests with:

```bash
python -m pytest videolab/tests/test_containers.py videolab/tests/test_config.py -q
```
