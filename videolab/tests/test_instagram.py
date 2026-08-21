from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Any

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from videolab.instagram import InstagramCLIError, check_auth, find_self_thread, ingest_dms
import videolab.instagram as instagram


THREAD_ID = "340282366920938463123456789"
MESSAGE_ID = "9876543210123456789"


class StubCLI:
    def __init__(self, *, auth_ok: bool = True) -> None:
        self.auth_ok = auth_ok
        self.calls: list[list[str]] = []

    def __call__(self, argv: Any) -> subprocess.CompletedProcess[str]:
        args = list(argv)
        self.calls.append(args)
        if args == ["instagram-cli", "auth", "whoami"]:
            if self.auth_ok:
                return self._result(
                    args,
                    stdout="Display name: Sample Owner\nUsername: @sample_owner\n",
                )
            return self._result(args, returncode=1, stderr="No active session")
        if args[1] == "inbox":
            return self._json(
                args,
                {
                    "threads": [
                        {
                            "thread_id": THREAD_ID,
                            "thread_title": "Sample Owner",
                            "last_activity_at": "2026-08-01T20:00:00Z",
                            "users": [],
                        },
                        {
                            "thread_id": "direct-thread",
                            "thread_title": "Invented Contact",
                            "users": [{"pk": "43", "username": "invented_contact"}],
                        },
                        {
                            "thread_id": "group-thread",
                            "thread_title": "Invented Group",
                            "users": [
                                {"pk": "44", "username": "member_one"},
                                {"pk": "45", "username": "member_two"},
                            ],
                        },
                    ]
                },
            )
        if args[1:3] == ["read", THREAD_ID] and "--download" not in args:
            return self._json(
                args,
                {
                    "thread": {
                        "items": [
                            {
                                "message_id": MESSAGE_ID,
                                "item_type": "clip",
                                "timestamp": "2026-08-01T19:59:00Z",
                                "text": "context from the sender",
                                "user_id": "42",
                                "username": "sample_owner",
                                "full_name": "Sample Owner",
                                "is_sent_by_viewer": True,
                                "media": {
                                    "permalink": "https://www.instagram.com/reel/DZtCPIRPT87/?igsh=secret",
                                    "caption": {"text": "Untrusted reel caption"},
                                    "user": {
                                        "pk": "77",
                                        "username": "original_creator",
                                        "full_name": "Original Creator",
                                    },
                                    "social_context": "Shared a reel",
                                },
                            },
                            {
                                "message_id": "text-only",
                                "item_type": "text",
                                "text": "ignore this",
                            },
                        ]
                    }
                },
            )
        if args[1] == "read" and args[2] in {"direct-thread", "group-thread"}:
            return self._json(args, {"thread": {"items": []}})
        if "--download" in args:
            destination = Path(args[args.index("--download") + 1])
            destination.write_bytes(b"\x00\x00\x00\x18ftypisom" + b"\x00" * 20)
            return self._json(args, {"path": str(destination)})
        raise AssertionError(f"Unexpected command: {args}")

    @staticmethod
    def _result(
        args: list[str],
        *,
        returncode: int = 0,
        stdout: str = "",
        stderr: str = "",
    ) -> subprocess.CompletedProcess[str]:
        return subprocess.CompletedProcess(args, returncode, stdout, stderr)

    def _json(self, args: list[str], data: Any) -> subprocess.CompletedProcess[str]:
        return self._result(args, stdout=json.dumps({"ok": True, "data": data}))


class TextCLI(StubCLI):
    def __init__(self, messages: list[dict[str, Any]]) -> None:
        super().__init__()
        self.messages = messages

    def __call__(self, argv: Any) -> subprocess.CompletedProcess[str]:
        args = list(argv)
        if args[1:3] == ["read", THREAD_ID] and "--download" not in args:
            self.calls.append(args)
            return self._json(args, {"thread": {"items": self.messages}})
        return super().__call__(args)


def test_same_message_twice_creates_one_job(tmp_path: Path) -> None:
    cli = StubCLI()
    cursor = tmp_path / "config" / "cursor.json"
    jobs = tmp_path / "jobs"
    public = tmp_path / "public"

    first = ingest_dms(cursor_path=cursor, jobs_root=jobs, public_jobs_root=public, runner=cli)
    second = ingest_dms(cursor_path=cursor, jobs_root=jobs, public_jobs_root=public, runner=cli)

    assert first == ["instagram-DZtCPIRPT87"]
    assert second == []
    assert (jobs / first[0] / "media" / "video.mp4").read_bytes().startswith(
        b"\x00\x00\x00\x18ftyp"
    )
    assert sum("--download" in call for call in cli.calls) == 1
    assert not public.exists()
    assert json.loads(cursor.read_text())["seen_message_ids"] == [MESSAGE_ID]

    dm = json.loads((jobs / first[0] / "dm.json").read_text())
    assert dm["message"]["message_id"] == MESSAGE_ID
    assert dm["message"]["sender"]["username"] == "sample_owner"
    assert dm["message"]["caption"] == "Untrusted reel caption"
    assert dm["message"]["original_author"]["username"] == "original_creator"
    assert dm["message"]["share_context"] == "Shared a reel"
    assert dm["message"]["url"] == "https://www.instagram.com/reel/DZtCPIRPT87/"

    job = json.loads((jobs / first[0] / "job.json").read_text())
    assert job["source"]["kind"] == "dm"
    assert job["source"]["id"] == "DZtCPIRPT87"
    assert job["source"]["url"] == dm["message"]["url"]
    assert job["stages"]["fetch"]["engine"] == "instagram-cli"


def test_ingest_dms_uses_private_root_by_default(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    private_root = tmp_path / "jobs-private"
    monkeypatch.setattr(instagram, "DEFAULT_JOBS", private_root)
    slugs = ingest_dms(cursor_path=tmp_path / "cursor.json", runner=StubCLI())
    assert (private_root / slugs[0] / "job.json").is_file()
    assert private_root.stat().st_mode & 0o777 == 0o700


class DownloadCLI(StubCLI):
    def __init__(self, payload: bytes | None) -> None:
        super().__init__()
        self.payload = payload

    def __call__(self, argv: Any) -> subprocess.CompletedProcess[str]:
        args = list(argv)
        if "--download" in args:
            self.calls.append(args)
            destination = Path(args[args.index("--download") + 1])
            if self.payload is not None:
                destination.write_bytes(self.payload)
            return self._json(args, {"path": str(destination)})
        return super().__call__(args)


def test_image_dm_uses_detected_filename_and_terminal_stages(tmp_path: Path) -> None:
    jobs = tmp_path / "jobs"
    slugs = ingest_dms(
        cursor_path=tmp_path / "cursor.json",
        jobs_root=jobs,
        runner=DownloadCLI(b"\xff\xd8\xff\xe0" + b"image"),
    )

    job_dir = jobs / slugs[0]
    job = json.loads((job_dir / "job.json").read_text())
    assert (job_dir / "media" / "image.jpg").is_file()
    assert not (job_dir / "media" / "video.mp4").exists()
    assert job["source"]["path"] == "media/image.jpg"
    assert all(job["stages"][name]["status"] == "skipped" for name in ("derive", "asr", "report"))
    assert job["stages"]["derive"]["detail"]["reason"] == "not_video: image/jpeg"


def test_dm_download_with_no_file_is_terminal(tmp_path: Path) -> None:
    jobs = tmp_path / "jobs"
    slugs = ingest_dms(
        cursor_path=tmp_path / "cursor.json",
        jobs_root=jobs,
        runner=DownloadCLI(None),
    )

    job = json.loads((jobs / slugs[0] / "job.json").read_text())
    assert all(job["stages"][name]["status"] == "skipped" for name in ("derive", "asr", "report"))
    assert job["stages"]["derive"]["detail"]["reason"] == "no_media"


def test_text_reel_url_creates_public_job_without_dm_provenance(tmp_path: Path) -> None:
    message = {
        "message_id": "text-reel", "item_type": "text",
        "timestamp": "2026-08-01T21:00:00Z",
        "text": "https://www.instagram.com/reel/CaseKept42/?igsh=invented",
    }
    public = tmp_path / "jobs"
    private = tmp_path / "jobs-private"
    slugs = ingest_dms(
        cursor_path=tmp_path / "cursor.json", jobs_root=private,
        public_jobs_root=public, runner=TextCLI([message]),
    )
    assert slugs == ["instagram-CaseKept42"]
    job_dir = public / slugs[0]
    assert not (job_dir / "dm.json").exists()
    assert not (private / slugs[0]).exists()
    job = json.loads((job_dir / "job.json").read_text())
    assert job["source"]["via"] == "self-dm"
    assert job["source"]["url"].endswith("/reel/CaseKept42/")
    assert job["stages"]["fetch"]["detail"] == {
        "message_id": "text-reel",
        "timestamp": "2026-08-01T21:00:00Z",
    }
    assert not (tmp_path / "cursor.json").exists()
    assert slugs.message_ids == [("instagram-CaseKept42", "text-reel")]


def test_mark_seen_is_explicit_and_defaults_off(tmp_path: Path) -> None:
    off = StubCLI()
    ingest_dms(cursor_path=tmp_path / "off.json", jobs_root=tmp_path / "off", runner=off)
    ordinary_reads = [call for call in off.calls if call[1] == "read" and "--download" not in call]
    assert ordinary_reads
    assert all("--mark-seen" not in call for call in ordinary_reads)

    on = StubCLI()
    ingest_dms(
        mark_seen=True,
        cursor_path=tmp_path / "on.json",
        jobs_root=tmp_path / "on",
        runner=on,
    )
    marked_reads = [call for call in on.calls if call[1] == "read" and "--download" not in call]
    assert marked_reads
    assert all("--mark-seen" in call for call in marked_reads)


def test_text_message_extracts_every_supported_url(tmp_path: Path) -> None:
    message = {
        "message_id": "two-links", "item_type": "text",
        "text": (
            "First https://youtu.be/Video_A1, then "
            "https://x.com/example/status/1234567890)."
        ),
    }
    slugs = ingest_dms(
        cursor_path=tmp_path / "cursor.json", jobs_root=tmp_path / "private",
        public_jobs_root=tmp_path / "public", runner=TextCLI([message]),
    )
    assert slugs == ["youtube-Video_A1", "x-1234567890"]
    assert all((tmp_path / "public" / slug / "job.json").is_file() for slug in slugs)


@pytest.mark.parametrize("text", ["ordinary note", "[Unsupported Type: xma_clip]"])
def test_text_without_supported_url_creates_no_job(tmp_path: Path, text: str) -> None:
    message = {"message_id": "no-link", "item_type": "text", "text": text}
    slugs = ingest_dms(
        cursor_path=tmp_path / "cursor.json", jobs_root=tmp_path / "private",
        public_jobs_root=tmp_path / "public", runner=TextCLI([message]),
    )
    assert slugs == []
    assert not (tmp_path / "public").exists()


def test_thread_filter_uses_explicit_thread_id(tmp_path: Path) -> None:
    cli = StubCLI()
    result = ingest_dms(
        thread=THREAD_ID,
        cursor_path=tmp_path / "cursor.json",
        jobs_root=tmp_path / "jobs",
        runner=cli,
    )

    assert result == ["instagram-DZtCPIRPT87"]
    read = next(call for call in cli.calls if call[1] == "read" and "--download" not in call)
    assert read[2] == THREAD_ID


def test_find_self_thread_prefers_only_empty_users_thread() -> None:
    inbox = {
        "threads": [
            {"thread_id": "direct", "thread_title": "Contact", "users": [{"pk": "1"}]},
            {"thread_id": "self", "thread_title": "Owner", "users": []},
            {"thread_id": "group", "thread_title": "Group", "users": [{"pk": "2"}, {"pk": "3"}]},
        ]
    }

    assert find_self_thread(inbox, {"username": "owner"})["thread_id"] == "self"


def test_find_self_thread_ambiguous_case_raises_with_ids_only() -> None:
    inbox = {
        "threads": [
            {"thread_id": "candidate-a", "thread_title": "Private A", "users": []},
            {"thread_id": "candidate-b", "thread_title": "Private B", "users": []},
        ]
    }

    with pytest.raises(InstagramCLIError) as raised:
        find_self_thread(inbox, {"username": "owner"})
    detail = str(raised.value)
    assert "candidate-a" in detail and "candidate-b" in detail
    assert "Private A" not in detail and "Private B" not in detail


def test_find_self_thread_falls_back_to_authenticated_account_name() -> None:
    inbox = {
        "threads": [
            {"thread_id": "direct", "thread_title": "Contact", "users": [{"pk": "1"}]},
            {"thread_id": "self", "thread_title": "Sample Owner", "users": [{"pk": "2"}]},
        ]
    }

    selected = find_self_thread(
        inbox,
        {"username": "sample_owner", "display_name": "Sample Owner"},
    )
    assert selected["thread_id"] == "self"


def test_ingest_dms_defaults_to_self_thread_and_all_threads_is_explicit(tmp_path: Path) -> None:
    default_cli = StubCLI()
    ingest_dms(
        cursor_path=tmp_path / "default-cursor.json",
        jobs_root=tmp_path / "default-jobs",
        runner=default_cli,
    )
    default_reads = [call[2] for call in default_cli.calls if call[1] == "read" and "--download" not in call]
    assert default_reads == [THREAD_ID]

    all_cli = StubCLI()
    ingest_dms(
        all_threads=True,
        cursor_path=tmp_path / "all-cursor.json",
        jobs_root=tmp_path / "all-jobs",
        runner=all_cli,
    )
    all_reads = [call[2] for call in all_cli.calls if call[1] == "read" and "--download" not in call]
    assert all_reads == [THREAD_ID, "direct-thread", "group-thread"]


def test_auth_failure_requires_manual_login() -> None:
    with pytest.raises(InstagramCLIError, match=r"instagram-cli auth login"):
        check_auth(runner=StubCLI(auth_ok=False))
