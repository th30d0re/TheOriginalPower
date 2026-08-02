from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Any

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from videolab.instagram import InstagramCLIError, check_auth, ingest_dms


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
                return self._result(args, stdout="Currently active account: @ejtheodore\n")
            return self._result(args, returncode=1, stderr="No active session")
        if args[1] == "inbox":
            return self._json(
                args,
                {
                    "threads": [
                        {
                            "thread_id": THREAD_ID,
                            "thread_title": "Saved reels",
                            "last_activity_at": "2026-08-01T20:00:00Z",
                            "users": [
                                {
                                    "pk": "42",
                                    "username": "ejtheodore",
                                    "full_name": "Emmanuel Theodore",
                                }
                            ],
                        }
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
        if "--download" in args:
            destination = Path(args[args.index("--download") + 1])
            destination.write_bytes(b"fake mp4")
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


def test_same_message_twice_creates_one_job(tmp_path: Path) -> None:
    cli = StubCLI()
    cursor = tmp_path / "config" / "cursor.json"
    jobs = tmp_path / "jobs"

    first = ingest_dms(cursor_path=cursor, jobs_root=jobs, runner=cli)
    second = ingest_dms(cursor_path=cursor, jobs_root=jobs, runner=cli)

    assert first == ["instagram-dztcpirpt87"]
    assert second == []
    assert (jobs / first[0] / "media" / "video.mp4").read_bytes() == b"fake mp4"
    assert sum("--download" in call for call in cli.calls) == 1
    assert json.loads(cursor.read_text())["seen_message_ids"] == [MESSAGE_ID]

    dm = json.loads((jobs / first[0] / "dm.json").read_text())
    assert dm["message"]["message_id"] == MESSAGE_ID
    assert dm["message"]["sender"]["username"] == "ejtheodore"
    assert dm["message"]["caption"] == "Untrusted reel caption"
    assert dm["message"]["original_author"]["username"] == "original_creator"
    assert dm["message"]["share_context"] == "Shared a reel"
    assert dm["message"]["url"] == "https://www.instagram.com/reel/DZtCPIRPT87/"

    job = json.loads((jobs / first[0] / "job.json").read_text())
    assert job["source"]["kind"] == "dm"
    assert job["source"]["id"] == "DZtCPIRPT87"
    assert job["source"]["url"] == dm["message"]["url"]
    assert job["stages"]["fetch"]["engine"] == "instagram-cli"


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


def test_thread_filter_uses_resolved_thread_id(tmp_path: Path) -> None:
    cli = StubCLI()
    result = ingest_dms(
        thread="ejtheodore",
        cursor_path=tmp_path / "cursor.json",
        jobs_root=tmp_path / "jobs",
        runner=cli,
    )

    assert result == ["instagram-dztcpirpt87"]
    read = next(call for call in cli.calls if call[1] == "read" and "--download" not in call)
    assert read[2] == THREAD_ID


def test_auth_failure_requires_manual_login() -> None:
    with pytest.raises(InstagramCLIError, match=r"instagram-cli auth login"):
        check_auth(runner=StubCLI(auth_ok=False))
