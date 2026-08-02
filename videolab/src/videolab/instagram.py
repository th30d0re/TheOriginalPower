"""Read-only Instagram DM ingestion through ``instagram-cli``."""

from __future__ import annotations

import json
import os
import re
import subprocess
from collections.abc import Callable, Iterable, Mapping, Sequence
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .slugs import Source, UnsupportedSourceError, parse_source, slug_for


CLIResult = subprocess.CompletedProcess[str]
CLIRunner = Callable[[Sequence[str]], CLIResult]
INSTAGRAM_CLI_TIMEOUT_SECONDS = 60

DEFAULT_CURSOR = Path.home() / ".config" / "videolab" / "instagram-cursor.json"
DEFAULT_JOBS = Path(__file__).resolve().parents[2] / "jobs-private"
DEFAULT_PUBLIC_JOBS = Path(__file__).resolve().parents[2] / "jobs"
MEDIA_ITEM_TYPES = frozenset(
    {
        "clip",
        "clips",
        "media",
        "media_share",
        "media-share",
        "reel_share",
        "reel-share",
        "xma",
    }
)
_SLUG_PART = re.compile(r"[^a-zA-Z0-9._-]+")
_INSTAGRAM_URL = re.compile(
    r"https?://(?:www\.)?instagram\.com/(?:reel|reels|p)/([A-Za-z0-9_-]+)(?:[/?#]|$)",
    re.IGNORECASE,
)
_TEXT_URL = re.compile(r"https?://[^\s<>\"']+", re.IGNORECASE)
_TRAILING_URL_PUNCTUATION = ".,;:!?)]}"


class InstagramCLIError(RuntimeError):
    """Raised when the read-only Instagram CLI workflow fails."""


def _default_runner(argv: Sequence[str]) -> CLIResult:
    try:
        return subprocess.run(
            list(argv),
            capture_output=True,
            check=False,
            text=True,
            timeout=INSTAGRAM_CLI_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired as exc:
        raise InstagramCLIError(
            f"instagram-cli timed out after {INSTAGRAM_CLI_TIMEOUT_SECONDS} seconds"
        ) from exc
    except FileNotFoundError as exc:
        raise InstagramCLIError(
            "instagram-cli was not found on PATH. Under the launchd watcher this "
            "usually means the agent's PATH lacks the Homebrew prefix — reinstall "
            "it with `videolab watch install` to repin the resolved location. "
            f"Current PATH: {os.environ.get('PATH', '(unset)')}"
        ) from exc


def _run_json(runner: CLIRunner, argv: Sequence[str]) -> Any:
    result = runner(argv)
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "instagram-cli failed").strip()
        raise InstagramCLIError(detail)
    try:
        envelope = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise InstagramCLIError("instagram-cli returned invalid JSON") from exc
    if not isinstance(envelope, Mapping):
        raise InstagramCLIError("instagram-cli returned a non-object JSON envelope")
    if envelope.get("ok") is not True:
        raise InstagramCLIError(str(envelope.get("error") or "instagram-cli request failed"))
    return envelope.get("data")


def check_auth(*, runner: CLIRunner | None = None) -> str:
    """Confirm that instagram-cli has a live session without attempting login."""

    execute = runner or _default_runner
    result = execute(["instagram-cli", "auth", "whoami"])
    output = "\n".join(part for part in (result.stdout, result.stderr) if part).strip()
    if result.returncode != 0:
        raise InstagramCLIError(
            "Instagram authentication is unavailable. Run `instagram-cli auth login` "
            f"yourself, then retry. CLI detail: {output or 'unknown authentication error'}"
        )
    return output


def _as_list(value: Any, keys: Sequence[str]) -> list[Mapping[str, Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, Mapping)]
    if not isinstance(value, Mapping):
        return []
    for key in keys:
        candidate = value.get(key)
        if isinstance(candidate, list):
            return [item for item in candidate if isinstance(item, Mapping)]
        if isinstance(candidate, Mapping):
            nested = _as_list(candidate, keys)
            if nested:
                return nested
    return []


def _threads(data: Any) -> list[Mapping[str, Any]]:
    return _as_list(data, ("threads", "inbox"))


def _messages(data: Any) -> list[Mapping[str, Any]]:
    return _as_list(data, ("items", "messages", "thread"))


def _field(record: Mapping[str, Any], *names: str) -> Any:
    for name in names:
        value = record.get(name)
        if value is not None:
            return value
    return None


def _thread_id(thread: Mapping[str, Any]) -> str:
    value = _field(thread, "thread_id", "id")
    return str(value) if value is not None else ""


def _message_id(message: Mapping[str, Any]) -> str:
    value = _field(message, "message_id", "id", "item_id")
    return str(value) if value is not None else ""


def _item_type(message: Mapping[str, Any]) -> str:
    value = _field(message, "item_type", "itemType", "type")
    return str(value or "").casefold()


def _walk(value: Any) -> Iterable[tuple[str, Any]]:
    if isinstance(value, Mapping):
        for key, child in value.items():
            yield str(key), child
            yield from _walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk(child)


def _permalink(message: Mapping[str, Any]) -> str | None:
    preferred = {"permalink", "share_url", "shareUrl", "url", "link"}
    candidates: list[str] = []
    for key, value in _walk(message):
        if key in preferred and isinstance(value, str):
            candidates.append(value)
    for value in candidates:
        match = _INSTAGRAM_URL.search(value)
        if match:
            return match.group(0).split("?", 1)[0].rstrip("/") + "/"
    return None


def _text_urls(message: Mapping[str, Any]) -> list[Source]:
    """Return every supported video URL from an ordinary text message."""

    text = _field(message, "text")
    if not isinstance(text, str):
        return []
    sources: list[Source] = []
    for match in _TEXT_URL.finditer(text):
        candidate = match.group(0).rstrip(_TRAILING_URL_PUNCTUATION)
        try:
            source = parse_source(candidate)
        except UnsupportedSourceError:
            continue
        if source.kind == "url":
            sources.append(source)
    return sources


def _nested_text(message: Mapping[str, Any], names: set[str]) -> str | None:
    for key, value in _walk(message):
        if key in names:
            if isinstance(value, str) and value.strip():
                return value.strip()
            if isinstance(value, Mapping):
                text = _field(value, "text", "caption", "title")
                if isinstance(text, str) and text.strip():
                    return text.strip()
    return None


def _original_author(message: Mapping[str, Any]) -> dict[str, Any] | None:
    media = message.get("media")
    roots = [media] if isinstance(media, Mapping) else []
    roots.extend(
        value
        for key, value in _walk(message)
        if key in {"media_share", "clip", "reel_share", "xma"} and isinstance(value, Mapping)
    )
    for root in roots:
        for key, value in _walk(root):
            if key in {"user", "owner", "creator"} and isinstance(value, Mapping):
                username = _field(value, "username", "user_name")
                user_id = _field(value, "id", "pk", "user_id")
                full_name = _field(value, "full_name", "display_name")
                if username is not None or user_id is not None or full_name is not None:
                    return {
                        "username": username,
                        "display_name": full_name,
                        "user_id": str(user_id) if user_id is not None else None,
                    }
    username = _nested_text(message, {"owner_username", "original_author", "author_username"})
    return {"username": username, "display_name": None, "user_id": None} if username else None


def _user_summary(user: Any) -> dict[str, Any]:
    if not isinstance(user, Mapping):
        return {"username": str(user), "display_name": None, "user_id": None}
    user_id = _field(user, "id", "pk", "user_id")
    return {
        "username": _field(user, "username", "user_name"),
        "display_name": _field(user, "full_name", "display_name", "name"),
        "user_id": str(user_id) if user_id is not None else None,
    }


def _dm_document(thread: Mapping[str, Any], message: Mapping[str, Any]) -> dict[str, Any]:
    message_user_id = _field(message, "user_id", "userId")
    thread_users = [user for user in thread.get("users", []) if isinstance(user, Mapping)]
    matched_user = next(
        (
            user
            for user in thread_users
            if message_user_id is not None
            and str(_field(user, "id", "pk", "user_id")) == str(message_user_id)
        ),
        {},
    )
    sender = {
        "username": _field(message, "username", "user_name")
        or _field(matched_user, "username", "user_name"),
        "display_name": _field(message, "full_name", "display_name")
        or _field(matched_user, "full_name", "display_name", "name"),
        "user_id": str(message_user_id) if message_user_id is not None else None,
        "is_outgoing": bool(_field(message, "is_sent_by_viewer", "isOutgoing")),
    }
    users = [_user_summary(user) for user in thread.get("users", [])]
    return {
        "schema_version": 1,
        "thread": {
            "id": _thread_id(thread),
            "title": _field(thread, "thread_title", "title"),
            "users": users,
            "last_activity_at": _field(thread, "last_activity_at", "lastActivity"),
        },
        "message": {
            "message_id": _message_id(message),
            "item_type": _item_type(message),
            "timestamp": _field(message, "timestamp", "created_at", "sent_at"),
            "sender": sender,
            "text": _field(message, "text"),
            "caption": _nested_text(message, {"caption"}),
            "original_author": _original_author(message),
            "share_context": _nested_text(
                message,
                {"share_context", "share_text", "social_context", "header_title", "subtitle"},
            ),
            "url": _permalink(message),
        },
    }


def _load_cursor(path: Path) -> set[str]:
    if not path.exists():
        return set()
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise InstagramCLIError(f"Cannot read Instagram cursor {path}: {exc}") from exc
    if isinstance(value, list):
        return {str(item) for item in value}
    if isinstance(value, Mapping) and isinstance(value.get("seen_message_ids"), list):
        return {str(item) for item in value["seen_message_ids"]}
    raise InstagramCLIError(f"Instagram cursor {path} has an unsupported shape")


def _write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp-{os.getpid()}")
    temporary.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    temporary.replace(path)


def _write_cursor(path: Path, seen: set[str]) -> None:
    _write_json(path, {"schema_version": 1, "seen_message_ids": sorted(seen)})


def _slug_for_message(message: Mapping[str, Any]) -> str:
    url = _permalink(message)
    match = _INSTAGRAM_URL.search(url or "")
    identifier = match.group(1) if match else _message_id(message)
    try:
        from .slugs import Source as SlugSource
        from .slugs import slug_for as build_slug
    except ImportError:
        pass
    else:
        return build_slug(
            SlugSource(
                kind="dm",
                platform="instagram",
                id=identifier,
                url=url,
                path=None,
            )
        )
    # Case is preserved, never folded: Instagram shortcodes are case-sensitive,
    # so DZtCPIRPT87 and dztcpirpt87 are different posts (CONTRACT.md §3).
    identifier = _SLUG_PART.sub("-", identifier).strip("-._")
    if not identifier:
        raise InstagramCLIError("Media-bearing Instagram message has no usable message ID")
    return f"instagram-{identifier}"[:96].rstrip("-._")


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _job_document(slug: str, message: Mapping[str, Any], timestamp: str) -> dict[str, Any]:
    url = _permalink(message)
    match = _INSTAGRAM_URL.search(url or "")
    source_id = match.group(1) if match else _message_id(message)
    pending = {
        "status": "pending",
        "engine": None,
        "detail": {},
        "started_at": None,
        "ended_at": None,
        "error": None,
    }
    return {
        "schema_version": 1,
        "slug": slug,
        "source": {
            "kind": "dm",
            "platform": "instagram",
            "id": source_id,
            "url": url,
            "path": None,
        },
        "created_at": timestamp,
        "stages": {
            "fetch": {
                "status": "ok",
                "engine": "instagram-cli",
                "detail": {"message_id": _message_id(message)},
                "started_at": timestamp,
                "ended_at": timestamp,
                "error": None,
            },
            "derive": dict(pending),
            "asr": dict(pending),
            "report": dict(pending),
        },
    }


def _matches_thread(thread: Mapping[str, Any], query: str) -> bool:
    return _thread_id(thread) == query


def _url_job_document(
    source: Source, slug: str, message: Mapping[str, Any], created_at: str
) -> dict[str, Any]:
    pending = {
        "status": "pending", "engine": None, "detail": {},
        "started_at": None, "ended_at": None, "error": None,
    }
    source_document = {
        "kind": source.kind, "platform": source.platform, "id": source.id,
        "url": source.url, "path": source.path, "via": "self-dm",
    }
    message_timestamp = _field(message, "timestamp", "created_at", "sent_at")
    fetch = dict(pending)
    fetch["engine"] = "yt-dlp"
    fetch["detail"] = {
        "message_id": _message_id(message),
        "timestamp": message_timestamp,
    }
    return {
        "schema_version": 1, "slug": slug, "source": source_document,
        "created_at": created_at,
        "stages": {"fetch": fetch, "derive": dict(pending),
                   "asr": dict(pending), "report": dict(pending)},
    }


def _account_names(authenticated_account: Any) -> set[str]:
    names: set[str] = set()
    if isinstance(authenticated_account, Mapping):
        for key in ("username", "user_name", "full_name", "display_name", "name"):
            value = authenticated_account.get(key)
            if isinstance(value, str) and value.strip():
                names.add(value.strip().removeprefix("@").casefold())
    elif isinstance(authenticated_account, str):
        text = authenticated_account.strip()
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            parsed = None
        if isinstance(parsed, Mapping):
            data = parsed.get("data", parsed)
            names.update(_account_names(data))
        names.update(match.casefold() for match in re.findall(r"@([A-Za-z0-9._]+)", text))
        for pattern in (
            r"(?im)^\s*(?:display\s*name|full\s*name|name)\s*:\s*(.+?)\s*$",
            r"(?im)^\s*(?:username|account)\s*:\s*@?([A-Za-z0-9._]+)\s*$",
        ):
            names.update(match.strip().removeprefix("@").casefold() for match in re.findall(pattern, text))
    return {name for name in names if name}


def find_self_thread(
    inbox: Any,
    authenticated_account: Any,
) -> Mapping[str, Any]:
    """Return the uniquely identifiable authenticated account's self-thread."""

    available = _threads(inbox)
    empty_user_threads = [thread for thread in available if thread.get("users") == []]
    if len(empty_user_threads) == 1:
        return empty_user_threads[0]

    account_names = _account_names(authenticated_account)
    title_matches = [
        thread
        for thread in available
        if isinstance(_field(thread, "thread_title", "title"), str)
        and str(_field(thread, "thread_title", "title")).strip().removeprefix("@").casefold()
        in account_names
    ]
    if len(title_matches) == 1:
        return title_matches[0]

    candidates = title_matches or empty_user_threads or available
    candidate_ids = sorted(filter(None, (_thread_id(item) for item in candidates)))
    detail = ", ".join(candidate_ids) if candidate_ids else "none"
    raise InstagramCLIError(
        f"Cannot identify a unique Instagram self-thread; candidate thread ids: {detail}"
    )


def _select_threads(
    data: Any,
    thread: str | None,
    *,
    all_threads: bool,
    authenticated_account: Any,
) -> list[Mapping[str, Any]]:
    available = _threads(data)
    if thread is not None and all_threads:
        raise ValueError("thread and all_threads are mutually exclusive")
    if all_threads:
        return available
    if thread is None:
        return [find_self_thread(data, authenticated_account)]
    matches = [item for item in available if _matches_thread(item, thread)]
    if matches:
        return matches
    return [{"thread_id": thread, "thread_title": None, "users": []}]


def ingest_dms(
    limit: int = 20,
    thread: str | None = None,
    mark_seen: bool = False,
    all_threads: bool = False,
    *,
    cursor_path: Path | None = None,
    jobs_root: Path | None = None,
    public_jobs_root: Path | None = None,
    runner: CLIRunner | None = None,
) -> list[str]:
    """Download unseen media-bearing DMs and return their new job slugs.

    DM fields are serialized as provenance only. They never influence command
    selection or execution. ``mark_seen`` is opt-in because it changes account
    state.
    """

    if limit < 1:
        raise ValueError("limit must be positive")
    execute = runner or _default_runner
    authenticated_account = check_auth(runner=execute)
    inbox = _run_json(
        execute,
        ["instagram-cli", "inbox", "--output", "json", "--limit", str(limit)],
    )
    selected_threads = _select_threads(
        inbox,
        thread,
        all_threads=all_threads,
        authenticated_account=authenticated_account,
    )
    seen_path = cursor_path or DEFAULT_CURSOR
    root = jobs_root or DEFAULT_JOBS
    public_root = public_jobs_root or DEFAULT_PUBLIC_JOBS
    if jobs_root is None:
        root.mkdir(mode=0o700, parents=True, exist_ok=True)
        root.chmod(0o700)
    seen = _load_cursor(seen_path)
    created: list[str] = []

    for thread_record in selected_threads:
        identifier = _thread_id(thread_record)
        if not identifier:
            continue
        read_argv = [
            "instagram-cli",
            "read",
            identifier,
            "--output",
            "json",
            "--limit",
            str(limit),
        ]
        if mark_seen:
            read_argv.append("--mark-seen")
        messages = _messages(_run_json(execute, read_argv))
        for message in reversed(messages):
            message_id = _message_id(message)
            if not message_id or message_id in seen:
                continue
            text_sources = (
                [] if _item_type(message) in MEDIA_ITEM_TYPES else _text_urls(message)
            )
            if text_sources:
                timestamp = _utc_now()
                for source in text_sources:
                    slug = slug_for(source)
                    job_dir = public_root / slug
                    job_dir.mkdir(parents=True, exist_ok=True)
                    (job_dir / "media").mkdir(exist_ok=True)
                    if not (job_dir / "job.json").exists():
                        document = _url_job_document(source, slug, message, timestamp)
                        _write_json(job_dir / "job.json", document)
                    created.append(slug)
                seen.add(message_id)
                _write_cursor(seen_path, seen)
                continue
            if _item_type(message) not in MEDIA_ITEM_TYPES:
                continue
            slug = _slug_for_message(message)
            job_dir = root / slug
            video_path = job_dir / "media" / "video.mp4"
            if (job_dir / "job.json").is_file() and video_path.is_file():
                seen.add(message_id)
                _write_cursor(seen_path, seen)
                continue
            video_path.parent.mkdir(parents=True, exist_ok=True)
            _run_json(
                execute,
                [
                    "instagram-cli",
                    "read",
                    identifier,
                    "--download",
                    str(video_path),
                    "--message-id",
                    message_id,
                    "--output",
                    "json",
                ],
            )
            timestamp = _utc_now()
            _write_json(job_dir / "dm.json", _dm_document(thread_record, message))
            if not (job_dir / "job.json").exists():
                _write_json(job_dir / "job.json", _job_document(slug, message, timestamp))
            seen.add(message_id)
            _write_cursor(seen_path, seen)
            created.append(slug)
    return created
