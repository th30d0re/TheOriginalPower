from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from videolab.config import Config
from videolab.containers import derive_argv, fetch_argv


def config(tmp_path: Path) -> Config:
    return Config(
        root=tmp_path,
        jobs_dir=tmp_path / "jobs",
        cookie_dir=tmp_path / "cookies",
        image="videolab-worker:latest",
        container_cli="container",
        voice_python=Path(sys.executable),
        asr_model="mlx-community/whisper-large-v3-turbo",
    )


def test_fetch_mounts_single_cookie_file_read_only(tmp_path: Path) -> None:
    cookie = tmp_path / "cookies" / "instagram.com.txt"
    sibling = cookie.with_name("youtube.com.txt")
    argv = fetch_argv(config(tmp_path), tmp_path / "job", "https://instagram.com/reel/abc", cookie)
    mount = argv[argv.index("--mount") + 1]
    assert mount == f"type=bind,source={cookie},target=/cookies/instagram.com.txt,readonly"
    assert str(sibling) not in " ".join(argv)
    assert argv[-2:] == ["--cookies", "/cookies/instagram.com.txt"]


def test_fetch_uses_single_job_volume_and_no_derive_restrictions(tmp_path: Path) -> None:
    argv = fetch_argv(config(tmp_path), tmp_path / "job", "https://youtu.be/abc")
    assert argv[argv.index("-v") + 1] == f"{(tmp_path / 'job').resolve()}:/job"
    assert "--no-dns" not in argv
    assert "--cap-drop" not in argv


def test_derive_denies_dns_and_drops_all_capabilities(tmp_path: Path) -> None:
    argv = derive_argv(config(tmp_path), tmp_path / "job")
    assert "--no-dns" in argv
    assert argv[argv.index("--cap-drop") + 1] == "ALL"
    assert "--read-only" in argv
    assert argv[argv.index("--tmpfs") + 1] == "/tmp"


def test_derive_has_no_cookie_mount(tmp_path: Path) -> None:
    argv = derive_argv(config(tmp_path), tmp_path / "job")
    assert "--mount" not in argv
    assert "/cookies" not in " ".join(argv)


def test_derive_propagates_options(tmp_path: Path) -> None:
    argv = derive_argv(config(tmp_path), tmp_path / "job", frames=7, ocr=False)
    assert argv[argv.index("--frames") + 1] == "7"
    assert "--no-ocr" in argv


def test_fetch_calls_extract_once_and_preserves_metadata(tmp_path: Path, monkeypatch) -> None:
    script = Path(__file__).resolve().parents[1] / "incontainer" / "fetch_job.py"
    spec = importlib.util.spec_from_file_location("fetch_job_for_test", script)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    calls: list[tuple[str, bool]] = []
    observed_options = {}
    complete_description = "complete description " * 30

    class FakeYoutubeDL:
        def __init__(self, options) -> None:
            self.options = options
            observed_options.update(options)

        def __enter__(self):
            return self

        def __exit__(self, *args) -> None:
            return None

        def extract_info(self, url: str, download: bool):
            calls.append((url, download))
            output = Path(self.options["outtmpl"].replace("%(ext)s", "mp4"))
            output.write_bytes(b"fixture")
            return {"id": "abc", "description": complete_description, "view_count": None}

    monkeypatch.setattr(module.yt_dlp, "YoutubeDL", FakeYoutubeDL)
    job_dir = tmp_path / "job"
    result = module.fetch(job_dir, "https://example.test/video")
    assert result["ok"] is True
    assert calls == [("https://example.test/video", True)]
    assert observed_options["format"] == "bv*[height<=1080]+ba/b[height<=1080]/bv*+ba/b"
    assert observed_options["max_filesize"] == 2 * 1024**3
    metadata = __import__("json").loads((job_dir / "source.info.json").read_text())
    assert metadata["description"] == complete_description
    assert metadata["view_count"] is None
    (job_dir / "job.json").write_text('{"stages": {}}')
    exit_code = module.main(
        ["--job", str(job_dir), "--url", "https://example.test/video", "--max-height", "720", "--max-filesize", "1G"]
    )
    assert exit_code == 0
    job = __import__("json").loads((job_dir / "job.json").read_text())
    assert job["stages"]["fetch"]["detail"] == {"max_height": 720, "max_filesize": "1G"}
