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

## Output

Each job lives at `videolab/jobs/<slug>/`. Machine-readable paths stored in its JSON files are relative to the job directory. The `media/` child is the only ignored job path.

Run the unit tests with:

```bash
python -m pytest videolab/tests/test_containers.py videolab/tests/test_config.py -q
```

