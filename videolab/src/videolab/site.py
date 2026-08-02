"""Build a self-contained HTML viewer for videolab job artifacts."""

from __future__ import annotations

import base64
import html
import io
import json
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urlparse

from PIL import Image, ImageOps

from .config import Config


STAGES = ("fetch", "derive", "asr", "report")


def _read_json(path: Path, default: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def _text(value: Any, fallback: str = "—") -> str:
    if value is None or value == "":
        return fallback
    return str(value)


def _h(value: Any, fallback: str = "—") -> str:
    return html.escape(_text(value, fallback), quote=True)


def _seconds(value: Any) -> str:
    if not isinstance(value, (int, float)):
        return "—"
    total = max(0, int(value))
    hours, remainder = divmod(total, 3600)
    minutes, seconds = divmod(remainder, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes:02d}:{seconds:02d}"


def _safe_url(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    parsed = urlparse(value)
    return value if parsed.scheme.lower() in {"http", "https"} and parsed.netloc else None


def _nonempty(value: Any) -> bool:
    if value is None or value == "" or value == [] or value == {}:
        return False
    if isinstance(value, dict):
        return any(_nonempty(item) for item in value.values())
    if isinstance(value, list):
        return any(_nonempty(item) for item in value)
    return True


def _metadata(job_dir: Path, slug: str) -> dict[str, Any]:
    exact = job_dir / f"{slug}_metadata.json"
    if exact.is_file():
        value = _read_json(exact, {})
        return value if isinstance(value, dict) else {}
    candidates = sorted(job_dir.glob("*_metadata.json"))
    value = _read_json(candidates[0], {}) if candidates else {}
    return value if isinstance(value, dict) else {}


def _jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        for line in path.read_text(encoding="utf-8").splitlines():
            try:
                value = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(value, dict):
                rows.append(value)
    except OSError:
        pass
    return rows


def _frame_data(job_dir: Path, relative: Any) -> str | None:
    if not isinstance(relative, str):
        return None
    try:
        root = job_dir.resolve()
        source = (root / relative).resolve()
        source.relative_to(root)
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            if image.width > 640:
                height = max(1, round(image.height * 640 / image.width))
                image = image.resize((640, height), Image.Resampling.LANCZOS)
            output = io.BytesIO()
            image.save(output, format="JPEG", quality=80, optimize=True)
        encoded = base64.b64encode(output.getvalue()).decode("ascii")
        return f"data:image/jpeg;base64,{encoded}"
    except (OSError, ValueError, Image.DecompressionBombError):
        return None


def _render_value(value: Any) -> str:
    if isinstance(value, dict):
        return "".join(
            f'<div class="analysis-item"><h5>{_h(key)}</h5>{_render_value(item)}</div>'
            for key, item in value.items()
            if _nonempty(item)
        )
    if isinstance(value, list):
        return "<ul>" + "".join(f"<li>{_render_value(item)}</li>" for item in value) + "</ul>"
    return f"<p>{_h(value)}</p>"


def _load_job(job_dir: Path, private: bool) -> dict[str, Any] | None:
    job = _read_json(job_dir / "job.json", None)
    if not isinstance(job, dict):
        return None
    slug = str(job.get("slug") or job_dir.name)
    meta = _metadata(job_dir, slug)
    source = job.get("source") if isinstance(job.get("source"), dict) else {}
    content = meta.get("content") if isinstance(meta.get("content"), dict) else {}
    creator = meta.get("creator") if isinstance(meta.get("creator"), dict) else {}
    return {
        "dir": job_dir,
        "job": job,
        "meta": meta,
        "source": source,
        "content": content,
        "creator": creator,
        "slug": slug,
        "private": private,
        "created_at": str(job.get("created_at") or ""),
    }


def _stage_health(job: dict[str, Any]) -> str:
    stages = job.get("stages") if isinstance(job.get("stages"), dict) else {}
    statuses = [stages.get(name, {}).get("status", "pending") for name in STAGES]
    if "error" in statuses:
        return "error"
    if "pending" in statuses:
        return "pending"
    return "ok"


def _render_rail(job: dict[str, Any], index: int) -> str:
    meta = job["meta"]
    creator = job["creator"]
    platform = meta.get("platform") or job["source"].get("platform")
    handle = creator.get("username")
    duration = job["content"].get("duration_seconds")
    private = '<span class="private-badge">private</span>' if job["private"] else ""
    return (
        f'<button class="job-row" type="button" data-target="job-{index}" '
        f'aria-pressed="{str(index == 0).lower()}">'
        f'<span class="health {_stage_health(job["job"])}" aria-hidden="true"></span>'
        f'<span><strong>{_h(platform)}</strong> {_h("@" + str(handle) if handle else None)}'
        f'<small>{_h(_seconds(duration))} {private}</small></span></button>'
    )


def _render_stages(job: dict[str, Any]) -> str:
    stages = job.get("stages") if isinstance(job.get("stages"), dict) else {}
    rendered = []
    errors = []
    for name in STAGES:
        stage = stages.get(name) if isinstance(stages.get(name), dict) else {}
        status = str(stage.get("status") or "pending")
        if status not in {"ok", "skipped", "pending", "error"}:
            status = "pending"
        rendered.append(f'<span class="stage {status}">{_h(name)} · {_h(status)}</span>')
        if status == "error" and stage.get("error"):
            errors.append(f'<p class="stage-error"><strong>{_h(name)}:</strong> {_h(stage["error"])}</p>')
    return '<section><h3>Stages</h3><div class="stage-strip">' + "".join(rendered) + "</div>" + "".join(errors) + "</section>"


def _render_transcript(job_dir: Path) -> str:
    transcript = _read_json(job_dir / "transcript.json", {})
    segments = transcript.get("segments") if isinstance(transcript, dict) else None
    rows = []
    copy_text = ""
    if isinstance(segments, list) and segments:
        for segment in segments:
            if not isinstance(segment, dict):
                continue
            text = _text(segment.get("text"), "").strip()
            if not text:
                continue
            rows.append(f'<div class="segment"><time>[{_h(_seconds(segment.get("start")))}]</time><p>{_h(text)}</p></div>')
            copy_text += (" " if copy_text else "") + text
    if not rows:
        try:
            copy_text = (job_dir / "transcript.txt").read_text(encoding="utf-8").strip()
        except OSError:
            copy_text = ""
        rows.append(f'<p class="transcript-block">{_h(copy_text, "Transcript unavailable.")}</p>')
    return (
        '<section><div class="section-heading"><h3>Transcript</h3>'
        '<button class="copy" type="button">Copy transcript</button></div>'
        f'<div class="transcript" data-copy-text="{html.escape(copy_text, quote=True)}">'
        + "".join(rows) + "</div></section>"
    )


def _render_ocr(job_dir: Path) -> str:
    rows = _jsonl(job_dir / "ocr.jsonl")
    kept = [row for row in rows if row.get("kept") is True]
    summary = f"{len(kept)} of {len(rows)} frames kept after dedupe"
    items = "".join(
        f'<div class="ocr-row"><time>[{_h(_seconds(row.get("t_seconds")))}]</time>'
        f'<p>{_h(row.get("text"))}<small>Mean confidence: {_h(row.get("mean_conf"))}</small></p></div>'
        for row in kept
    )
    if not items:
        items = '<p class="quiet">No OCR text was kept.</p>'
    return f'<section><h3>On-screen text</h3><p class="quiet">{_h(summary)}</p>{items}</section>'


def _render_frames(job_dir: Path) -> str:
    document = _read_json(job_dir / "frames.json", {})
    frames = document.get("frames") if isinstance(document, dict) else []
    items = []
    for frame in frames if isinstance(frames, list) else []:
        if not isinstance(frame, dict):
            continue
        data = _frame_data(job_dir, frame.get("file"))
        if data is None:
            continue
        caption = f'{_seconds(frame.get("t_seconds"))} · {_text(frame.get("selected_by"))}'
        items.append(
            '<figure><button class="frame-button" type="button">'
            f'<img src="{data}" alt="Frame at {_h(_seconds(frame.get("t_seconds")))}" loading="lazy">'
            f'</button><figcaption>{_h(caption)}</figcaption></figure>'
        )
    body = "".join(items) if items else '<p class="quiet">No frames are available.</p>'
    return f'<section><h3>Frames</h3><div class="frames">{body}</div></section>'


def _render_analysis(meta: dict[str, Any]) -> str:
    analysis = meta.get("content_analysis") if isinstance(meta.get("content_analysis"), dict) else {}
    fields = (
        ("Primary theme", analysis.get("primary_theme")),
        ("Secondary themes", analysis.get("secondary_themes")),
        ("Rhetorical frame", analysis.get("rhetorical_frame")),
        ("Key moments", analysis.get("key_moments")),
    )
    meaningful = [(label, value) for label, value in fields if _nonempty(value)]
    content = "".join(f'<div class="analysis-item"><h4>{label}</h4>{_render_value(value)}</div>' for label, value in meaningful)
    if not content:
        content = '<p class="quiet">Content analysis is not yet analysed.</p>'

    notes = meta.get("framework_notes") if isinstance(meta.get("framework_notes"), dict) else {}
    if _nonempty(notes):
        framework = "".join(
            f'<div class="analysis-item"><h4>{_h(str(key).replace("_", " ").title())}</h4>{_render_value(value)}</div>'
            for key, value in notes.items()
            if _nonempty(value)
        )
    else:
        framework = '<p class="quiet">Framework analysis is not yet analysed.</p>'
    return f'<section><h3>Content analysis</h3>{content}<h3>Framework analysis</h3>{framework}</section>'


def _render_tiers(meta: dict[str, Any]) -> str:
    tiers = meta.get("tier_classification") if isinstance(meta.get("tier_classification"), dict) else {}
    justification = tiers.get("justification")
    badges = "".join(
        f'<span class="tier"><b>{_h(str(key).replace("_", " "))}</b> {_h(value)}</span>'
        for key, value in tiers.items()
        if key != "justification" and _nonempty(value)
    )
    detail = f'<p>{_h(justification)}</p>' if _nonempty(justification) else '<p class="quiet">No justification is recorded.</p>'
    return f'<section><h3>Tier classification</h3><div class="tiers">{badges}</div>{detail}</section>'


def _render_detail(job: dict[str, Any], index: int) -> str:
    meta = job["meta"]
    creator = job["creator"]
    content = job["content"]
    source = job["source"]
    platform = meta.get("platform") or source.get("platform")
    url = _safe_url(meta.get("url") or source.get("url"))
    link = f'<a href="{html.escape(url, quote=True)}" target="_blank" rel="noopener noreferrer">Source</a>' if url else '<span>Source unavailable</span>'
    private = '<span class="private-badge">Private job</span>' if job["private"] else ""
    posted = meta.get("metadata", {}).get("posted_at_iso") if isinstance(meta.get("metadata"), dict) else None
    engagement = meta.get("engagement") if isinstance(meta.get("engagement"), dict) else {}
    metrics = (
        ("Likes", engagement.get("likes")),
        ("Comments", engagement.get("comments_count")),
        ("Plays", engagement.get("play_count")),
        ("Views", engagement.get("views")),
    )
    metric_html = "".join(f'<div><dt>{label}</dt><dd>{_h(value)}</dd></div>' for label, value in metrics)
    hidden = "" if index == 0 else " hidden"
    return (
        f'<article id="job-{index}" class="job-detail"{hidden}>'
        f'<header><div>{private}<h2>{_h(creator.get("display_name"), "Unknown creator")}</h2>'
        f'<p class="handle">{_h("@" + str(creator["username"]) if creator.get("username") else None)}</p></div>'
        f'<dl class="header-meta"><div><dt>Platform</dt><dd>{_h(platform)}</dd></div>'
        f'<div><dt>Duration</dt><dd>{_h(_seconds(content.get("duration_seconds")))}</dd></div>'
        f'<div><dt>Posted</dt><dd>{_h(posted)}</dd></div><div><dt>Link</dt><dd>{link}</dd></div></dl>'
        f'<code>{_h(job["slug"])}</code></header>'
        + _render_stages(job["job"])
        + f'<section><h3>Engagement</h3><dl class="metrics">{metric_html}</dl></section>'
        + _render_transcript(job["dir"])
        + _render_ocr(job["dir"])
        + _render_frames(job["dir"])
        + _render_analysis(meta)
        + _render_tiers(meta)
        + "</article>"
    )


def _discover(config: Config, include_private: bool) -> list[dict[str, Any]]:
    roots: Iterable[tuple[Path, bool]] = [(config.jobs_dir, False)]
    if include_private:
        roots = [*roots, (config.private_jobs_dir, True)]
    jobs = []
    for root, private in roots:
        for path in root.glob("*/job.json"):
            loaded = _load_job(path.parent, private)
            if loaded is not None:
                jobs.append(loaded)
    return sorted(jobs, key=lambda item: item["created_at"], reverse=True)


def build_site(config: Config, out: Path | None = None, *, include_private: bool = False) -> Path:
    """Build and return the path to one portable HTML artifact."""
    destination = out or config.root / "site" / "index.html"
    jobs = _discover(config, include_private)
    rail = "".join(_render_rail(job, index) for index, job in enumerate(jobs))
    details = "".join(_render_detail(job, index) for index, job in enumerate(jobs))
    if not jobs:
        rail = '<p class="empty">No jobs found.</p>'
        details = '<main class="empty-main"><h2>No jobs found</h2><p>Add a videolab job and rebuild this page.</p></main>'
    document = _document(rail, details)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(document, encoding="utf-8")
    return destination


def _document(rail: str, details: str) -> str:
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>videolab jobs</title><style>
:root{{--bg:#f5f5f2;--panel:#fff;--text:#202124;--muted:#696b70;--line:#deded8;--accent:#5269c7;--ok:#31865b;--skip:#657080;--pending:#b27716;--error:#bd3b3b}}@media(prefers-color-scheme:dark){{:root{{--bg:#17181b;--panel:#222328;--text:#f0f0ec;--muted:#aaaeb7;--line:#3a3c43;--accent:#91a2f3;--ok:#55ad7d;--skip:#9299a6;--pending:#d3a24a;--error:#e26a6a}}}}*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.55}}button{{font:inherit}}.layout{{display:grid;grid-template-columns:18rem minmax(0,1fr);min-height:100vh}}aside{{position:sticky;top:0;height:100vh;overflow:auto;padding:1.3rem 1rem;border-right:1px solid var(--line);background:var(--panel)}}aside h1{{font-size:1.1rem;margin:0 0 1rem}}.job-row{{display:grid;grid-template-columns:auto 1fr;gap:.7rem;width:100%;padding:.8rem;border:0;border-radius:.55rem;background:transparent;color:inherit;text-align:left;cursor:pointer}}.job-row:hover,.job-row[aria-pressed=true]{{background:color-mix(in srgb,var(--accent) 13%,transparent)}}.job-row small{{display:block;color:var(--muted);margin-top:.2rem}}.health{{width:.65rem;height:.65rem;margin-top:.35rem;border-radius:50%;background:var(--ok)}}.health.pending{{background:var(--pending)}}.health.error{{background:var(--error)}}main,.job-detail{{width:min(100% - 2rem,74ch);margin:0 auto;padding:2.5rem 0 6rem}}header{{padding-bottom:1.6rem;border-bottom:1px solid var(--line)}}h2{{font-size:clamp(1.7rem,4vw,2.5rem);line-height:1.12;margin:.4rem 0}}h3{{margin:0 0 .8rem;font-size:1.15rem}}h4,h5{{margin:.6rem 0 .25rem}}section{{padding:1.7rem 0;border-bottom:1px solid var(--line)}}.handle,.quiet,figcaption,.empty{{color:var(--muted)}}code{{display:inline-block;margin-top:1rem;padding:.25rem .45rem;border:1px solid var(--line);border-radius:.3rem}}dl{{margin:1rem 0 0}}.header-meta,.metrics{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.8rem}}dt{{font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}}dd{{margin:0;font-weight:650;overflow-wrap:anywhere}}a{{color:var(--accent)}}.stage-strip,.tiers{{display:flex;flex-wrap:wrap;gap:.45rem}}.stage,.tier,.private-badge{{display:inline-block;padding:.25rem .55rem;border-radius:99rem;font-size:.78rem;border:1px solid var(--line)}}.stage.ok{{border-color:var(--ok);color:var(--ok)}}.stage.skipped{{border-color:var(--skip);color:var(--skip)}}.stage.pending{{border-color:var(--pending);color:var(--pending)}}.stage.error{{border-color:var(--error);color:var(--error)}}.stage-error{{padding:.75rem;border-left:3px solid var(--error);white-space:pre-wrap}}.private-badge{{background:var(--accent);border-color:var(--accent);color:#fff}}.section-heading{{display:flex;align-items:center;justify-content:space-between;gap:1rem}}.copy{{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:.4rem;padding:.35rem .65rem;cursor:pointer}}.segment,.ocr-row{{display:grid;grid-template-columns:4.7rem 1fr;gap:1rem}}.segment time,.ocr-row time{{color:var(--muted);font-variant-numeric:tabular-nums;padding-top:.2rem}}.segment p,.ocr-row p{{margin:0 0 .85rem;font-size:1.04rem;line-height:1.75}}.transcript-block{{white-space:pre-wrap;font-size:1.04rem;line-height:1.75}}.ocr-row small{{display:block;color:var(--muted)}}.frames{{display:grid;grid-template-columns:repeat(auto-fill,minmax(11rem,1fr));gap:1rem}}figure{{margin:0}}.frame-button{{display:block;border:0;padding:0;background:none;cursor:zoom-in;width:100%}}.frame-button img{{display:block;width:100%;height:auto;border-radius:.45rem}}figcaption{{font-size:.8rem;margin-top:.35rem}}.analysis-item{{padding:.1rem 0}}.analysis-item p{{white-space:pre-wrap}}.analysis-item ul{{padding-left:1.25rem}}.empty-main{{align-self:start}}.frame-overlay{{position:fixed;inset:0;z-index:10;display:grid;place-items:center;padding:2rem;background:rgba(0,0,0,.86);border:0;width:100%;height:100%;cursor:zoom-out}}.frame-overlay img{{max-width:100%;max-height:100%;object-fit:contain}}[hidden]{{display:none!important}}@media(max-width:760px){{.layout{{display:block}}aside{{position:static;height:auto;border-right:0;border-bottom:1px solid var(--line);max-height:42vh}}.header-meta,.metrics{{grid-template-columns:repeat(2,minmax(0,1fr))}}main,.job-detail{{width:min(100% - 1.4rem,74ch);padding-top:1.4rem}}}}
</style></head><body><div class="layout"><aside><h1>videolab jobs</h1>{rail}</aside><div>{details}</div></div>
<script>
document.querySelectorAll('.job-row').forEach(function(button){{button.addEventListener('click',function(){{document.querySelectorAll('.job-row').forEach(function(item){{item.setAttribute('aria-pressed','false')}});document.querySelectorAll('.job-detail').forEach(function(item){{item.hidden=true}});button.setAttribute('aria-pressed','true');var target=document.getElementById(button.dataset.target);if(target){{target.hidden=false;window.scrollTo(0,0)}}}})}});
document.querySelectorAll('.copy').forEach(function(button){{button.addEventListener('click',function(){{var block=button.closest('section').querySelector('.transcript');var value=block.dataset.copyText;var copied=function(){{button.textContent='Copied'}};if(navigator.clipboard&&navigator.clipboard.writeText){{navigator.clipboard.writeText(value).then(copied).catch(function(){{fallbackCopy(value);copied()}})}}else{{fallbackCopy(value);copied()}}}})}});function fallbackCopy(value){{var area=document.createElement('textarea');area.value=value;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove()}}
document.querySelectorAll('.frame-button').forEach(function(button){{button.addEventListener('click',function(){{var overlay=document.createElement('button');overlay.type='button';overlay.className='frame-overlay';var image=document.createElement('img');image.src=button.querySelector('img').src;image.alt=button.querySelector('img').alt;overlay.appendChild(image);overlay.addEventListener('click',function(){{overlay.remove()}});document.body.appendChild(overlay)}})}});
</script></body></html>'''
