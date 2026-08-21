# V14 Silent-Failure Findings

Model: GPT-5 Codex

## Bug 1: completed audio state without a usable file

### Root cause

`next_pending()` treated `audio_state.json` as authoritative. A `done` string
bypassed processing even when `audio_path` was absent, missing, or undersized.
`print_status()` repeated the same assumption. `process_unit()` already checked
the generated file, but its threshold comparison differed at the 100,000-byte
boundary.

The implementation now resolves the recorded path, requires a regular file of
at least 100,000 bytes, and uses that check in scheduling and status reporting.
Missing and undersized artifacts receive separate status counts. The existing
`artifact_id` remains intact, so recovery enters the polling and download path
without issuing `audio create`.

### Regression test

`test_done_unit_with_missing_audio_is_pending_and_reported` creates two `done`
entries. One points to a missing file and one points to a 100,000-byte file. It
requires the missing unit to become pending and requires the status output to
contain distinct `done` and `done (file missing)` counts. The test failed against
the previous implementation because `next_pending()` returned `None`.

## Bug 2: doctor accepted local Instagram configuration as live authentication

### Root cause

`instagram-cli auth whoami` reads the configured account and can exit successfully
after the remote session has expired. `doctor()` equated that exit code with live
authenticated capability.

The doctor now makes one `instagram-cli inbox --limit 1` request. It treats exit
failure, HTTP 403, `login_required`, unauthorized responses, and expired-session
responses as failed authentication. Authentication failures name
`instagram-cli auth login` as the remedy. Transport and other probe failures
remain failed health checks with a capability-probe detail. Successful output
retains an emitted account line and otherwise reports `session active`.

`_run_lines()` now inspects stdout and stderr together. The former implementation
discarded stderr whenever stdout contained any text, which could hide an error
following a progress message.

### Regression tests

`test_doctor_rejects_login_required_from_authenticated_probe` supplies an
exit-zero response containing HTTP 403 and `login_required`. It requires a false
health result and the login remedy. The test failed against the previous code
because the doctor invoked `auth whoami`.

`test_doctor_preserves_account_detail_after_live_probe` verifies the successful
account-detail behavior.

### Doctor audit

The remaining doctor probes exercise capabilities directly: container service
status, image inspection, containerized ffmpeg and Tesseract execution, and host
Python imports for MLX and mlx-whisper. The cookie section reports file inventory,
age, and mode; it makes no authentication claim. No other configuration-only
probe was presented as a capability check.

## Bug 3: DM item labels determined a false video filename and permanent backlog

### Root cause

Every media-bearing DM download targeted `media/video.mp4`. `MEDIA_ITEM_TYPES`
describes Instagram message envelopes and includes image-bearing envelopes. The
ingestion path never examined the downloaded bytes. The CLI then sent every new
job into video derivation, leaving non-video jobs pending after processing could
never succeed.

Downloads now land at `media/download.tmp`. A bounded 32-byte read identifies
JPEG, PNG, GIF, WebP, ISO-BMFF video, WebM/Matroska, AVI, and MPEG signatures.
The file is atomically renamed to a MIME-appropriate name. Images and unknown
binary payloads receive `skipped` states for derive, ASR, and report with a
`not_video: <mime>` reason. A missing or empty download receives `no_media`.
`ingest_dm_jobs()` recognizes the terminal derive state and does not invoke the
post-fetch pipeline.

### Regression tests

`test_image_dm_uses_detected_filename_and_terminal_stages` supplies JPEG bytes,
requires `media/image.jpg`, checks `source.path`, and requires all downstream
stages to be terminal. `test_dm_download_with_no_file_is_terminal` covers the
successful downloader response that creates no file.

`test_ingest_dm_jobs_does_not_run_pipeline_for_terminal_media` verifies that the
CLI respects the ingestion disposition. The existing video ingestion test now
uses an MP4 `ftyp` signature and confirms the video path remains operational.

### Historical reconciliation

All five listed jobs now have terminal `skipped` stages and MIME-specific reasons.
Their media bytes were preserved and renamed in place. Inspection found four
JPEG files and one WebP file. Job `instagram-32798038007989608713287174910377984`,
described in the task as having no media, currently contains a 107,565-byte JPEG;
its empty derived frames reflected the failed video interpretation. Its recorded
reason follows the source bytes: `not_video: image/jpeg`.

The detector intentionally classifies unrecognized content as
`application/octet-stream` and terminates it. Adding a supported media container
requires adding a signature and filename mapping. This conservative boundary
prevents unknown content from entering the isolated video pipeline.

## Bug 4: cookie export could not select a browser profile or detect logout

### Root cause

The CLI exposed only a browser identifier, and `refresh_cookies()` always passed
that identifier alone to yt-dlp. The browser-name validator correctly excludes
spaces and colons, so it could not carry a profile path. Cookie validation only
required one domain-matching cookie. Logged-out Instagram profiles commonly meet
that condition through `csrftoken`, `datr`, or `mid`.

`cookies refresh` now accepts `--profile PATH`. The profile is expanded, required
to exist, resolved, and passed through yt-dlp's separate `profile` parameter. The
browser-name validator is unchanged. Instagram exports inspect cookie names and
emit a `RuntimeWarning` when `sessionid` or `ds_user_id` is missing. The export
still completes so the warning does not turn diagnostics into data loss.

Directory mode `0700`, temporary-file writing, file mode `0600`, and atomic
`os.replace` remain in place.

### Regression tests

`test_refresh_uses_existing_profile_and_warns_without_session_cookies` verifies
an existing path containing spaces reaches yt-dlp, confirms the logged-out warning,
and checks the resulting file mode. `test_refresh_rejects_missing_profile` covers
path validation. `test_cookies_refresh_threads_profile_from_cli` exercises the
full argument path from the parser to `refresh_cookies()`.

## Verification

- `make videolab-test`: 112 passed; one third-party OpenTelemetry deprecation warning.
- `PYTHONPATH=videolab/src .venv-voice/bin/python -m videolab doctor`: completed in
  1.60 seconds during the first operational check. The sandbox denied the local
  container service and Instagram DNS, and the command reported both as failed.
- `python3 tools/chapter_audio_dive.py --status`: 40 units; 40 usable files marked
  done. Unit 40 changed from pending to done during the session when its audio
  file appeared from an external/background process; this implementation did not
  create, modify, or delete that file.
- `videolab list`: all five reconciled jobs report fetch `ok` and derive, ASR, and
  report `skipped`.

No container isolation code changed. No cookie or session data entered the
repository. No `.m4a` file was deleted or modified.
