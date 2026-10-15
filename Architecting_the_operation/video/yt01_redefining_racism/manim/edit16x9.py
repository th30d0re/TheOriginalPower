"""YT01 editor: render runs, cut each shot's window out of its run, lay the voiceover under it.

    .venv-manimgx/bin/python edit16x9.py turns 03 --only S03-08   # a run's spoken words and notes
    .venv-manimgx/bin/python edit16x9.py check                       # every Render target exists and defines its class
    .venv-manimgx/bin/python edit16x9.py render 00 01 -r 960x540 --fps 15 -j 3
    .venv-manimgx/bin/python edit16x9.py cut 00 01 -r 960x540 --fps 15   # outputs/YT01/video/preview/<WxH>/SEG00.mp4

A run is a primary shot and its holds (see common16x9). Each run renders once, silent, to
outputs/YT01/video/runs/<WxH>@<fps>/<primary>.mp4, starting at the primary's turn start on the
frame grid. Shot i occupies frames [F(i), F(i+1)) of the episode, F(i) = round(start_i * fps),
so a cut never drifts against the voiceover. Renders need Metal: run this outside the sandbox.
"""
import argparse
import ast
import json
import math
import os
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from common16x9 import ROOT, YT, load_shots, runs_of  # noqa: E402

EP = ROOT / "outputs" / "YT01"
MANIMGX = ROOT / ".venv-manimgx/bin/manimgx"
FONT = next((ROOT / ".venv-manimgx/lib").glob("python*/site-packages/manimgx_fonts/NotoSans[[]wdth,wght[]].ttf"), None) \
    or next((ROOT / ".venv-manimgx/lib").glob("python*/site-packages/manimgx_fonts/NotoSans*.ttf"))


def beats():
    turns = json.loads((EP / "episode_manifest.json").read_text())["turns"]
    return [t["start_ms"] / 1000 for t in turns], turns[-1]["end_ms"] / 1000


def frame(t, fps):
    return math.floor(t * fps + 0.5)


def classes(path):
    try:
        tree = ast.parse(path.read_text())
    except (OSError, SyntaxError):
        return set()
    return {n.name for n in tree.body if isinstance(n, ast.ClassDef)}


def seg_shots(shots, segs):
    want = {s.zfill(2) for s in segs} if segs else None
    return [s for s in shots if want is None or s.seg in want]


def run_path(primary, res, fps):
    return EP / "video" / "runs" / f"{res}@{fps}" / f"{primary}.mp4"


def stale(out, shot):
    if not out.exists():
        return True
    deps = [HERE / shot.file, HERE / "common16x9.py", EP / "words.json", EP / "episode_manifest.json"]
    if shot.file == "cards16x9.py" or shot.card:
        deps.append(HERE / "cards16x9.py")
    if shot.card:
        deps.append(YT / shot.card)
    return any(d.exists() and d.stat().st_mtime > out.stat().st_mtime for d in deps)


def cmd_turns(args):
    """Print each run's shots: id, start time, spoken words (what cues match), note."""
    shots = load_shots()
    starts, _ = beats()
    words = json.loads((EP / "words.json").read_text())
    for primary, run in runs_of(seg_shots(shots, args.segs)).items():
        if args.only and primary not in args.only:
            continue
        s = run[0]
        print(f"=== run {primary} · {s.file}:{s.scene}" + (f" · {s.card}" if s.card else ""))
        for k, r in enumerate(run):
            print(f"  [{k}] {r.id} {r.type} @{starts[r.index]:.2f}s  {words[r.index]['text']}")
            print(f"       note: {r.note}")
    return 0


def cmd_check(args):
    shots = load_shots()
    bad = []
    for primary, run in runs_of(seg_shots(shots, args.segs)).items():
        s = run[0]
        f = HERE / s.file
        if not f.exists():
            bad.append(f"{primary}: missing file {s.file}")
        elif s.scene not in classes(f):
            bad.append(f"{primary}: {s.file} defines no class {s.scene}")
        if s.card and not (YT / s.card).exists():
            bad.append(f"{primary}: missing card {s.card}")
        if any(r.file != s.file or r.scene != s.scene for r in run):
            bad.append(f"{primary}: holds name a different render target")
    print("\n".join(bad) or "every Render target exists")
    print(f"{len(runs_of(seg_shots(shots, args.segs)))} runs, {len(bad)} problems")
    return 1 if bad else 0


def render_one(primary, shot, args):
    out = run_path(primary, args.res, args.fps)
    if not args.force and not stale(out, shot):
        return primary, "fresh", ""
    out.parent.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ, YT01_SHOT=primary)
    cmd = [str(MANIMGX), "render", str(HERE / shot.file), shot.scene, "-r", args.res, "--fps", str(args.fps),
           "--preset", "veryfast", "-o", str(out)]
    p = subprocess.run(cmd, env=env, capture_output=True, text=True, cwd=ROOT)
    log = out.with_suffix(".log")
    log.write_text(p.stdout + "\n" + p.stderr)
    return primary, "ok" if p.returncode == 0 else f"FAILED ({p.returncode})", p.stderr[-600:] if p.returncode else ""


def cmd_render(args):
    shots = load_shots()
    todo = []
    for primary, run in runs_of(seg_shots(shots, args.segs)).items():
        if args.only and primary not in args.only:
            continue
        s = run[0]
        if not (HERE / s.file).exists() or s.scene not in classes(HERE / s.file):
            print(f"{primary}: skipped, {s.file}:{s.scene} not built")
            continue
        todo.append((primary, s))
    failed = 0
    with ThreadPoolExecutor(args.jobs) as pool:
        for primary, status, err in pool.map(lambda x: render_one(*x, args), todo):
            print(f"{primary}: {status}", flush=True)
            if err:
                failed += 1
                print("   " + err.strip().replace("\n", "\n   "))
    return 1 if failed else 0


def placeholder(shot, n, fps, res, out):
    w, h = res.split("x")
    text = f"{shot.id} · {shot.file}:{shot.scene} (not built)".replace(":", r"\:").replace("'", "")
    vf = (f"drawtext=fontfile='{FONT}':text='{text}':fontcolor=0xF4EAD2:fontsize={int(h) // 24}:"
          "x=(w-text_w)/2:y=(h-text_h)/2")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x0F1B33:s={w}x{h}:r={fps}",
                    "-frames:v", str(n), "-vf", vf, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                    "-pix_fmt", "yuv420p", str(out)], check=True)


def cmd_cut(args):
    shots = load_shots()
    starts, end = beats()
    if len(starts) != len(shots):
        sys.exit(f"manifest has {len(starts)} turns; shot list has {len(shots)}")
    fps = args.fps
    F = [frame(t, fps) for t in starts] + [frame(end + 1.0, fps)]
    runs = runs_of(shots)
    first_of = {p: r[0].index for p, r in runs.items()}
    segs = sorted({s.seg for s in seg_shots(shots, args.segs)})
    outdir = EP / "video" / "preview" / args.res
    work = outdir / "_clips"
    work.mkdir(parents=True, exist_ok=True)
    for seg in segs:
        mine = [s for s in shots if s.seg == seg]
        listing, missing = [], []
        for s in mine:
            n = F[s.index + 1] - F[s.index]
            clip = work / f"{s.id}.mp4"
            src = run_path(s.primary, args.res, fps)
            if src.exists():
                offset = (F[s.index] - F[first_of[s.primary]]) / fps
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{offset:.6f}", "-i", str(src),
                                "-vf", f"tpad=stop_mode=clone:stop={n},fps={fps}", "-frames:v", str(n), "-an",
                                "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
                                str(clip)], check=True)
            else:
                missing.append(s.id)
                placeholder(s, n, fps, args.res, clip)
            listing.append(f"file '{clip}'")
        lst = work / f"SEG{seg}.txt"
        lst.write_text("\n".join(listing) + "\n")
        a0, a1 = F[mine[0].index] / fps, F[mine[-1].index + 1] / fps
        out = outdir / f"SEG{seg}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
                        "-ss", f"{a0:.6f}", "-t", f"{a1 - a0:.6f}", "-i", str(EP / "YT01.mp3"),
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest",
                        str(out)], check=True)
        print(f"SEG {seg}: {out} ({a1 - a0:.1f} s, {len(mine)} shots"
              + (f"; placeholders: {', '.join(missing)}" if missing else "") + ")")
    if not args.keep:
        shutil.rmtree(work, ignore_errors=True)
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("action", choices=["check", "turns", "render", "cut"])
    ap.add_argument("segs", nargs="*", help="segment numbers (default: all)")
    ap.add_argument("-r", "--res", default="960x540")
    ap.add_argument("--fps", type=int, default=15)
    ap.add_argument("-j", "--jobs", type=int, default=3)
    ap.add_argument("--only", nargs="*", help="render only these primary shot ids")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--keep", action="store_true", help="keep the per-shot clips")
    args = ap.parse_args()
    return {"check": cmd_check, "turns": cmd_turns, "render": cmd_render, "cut": cmd_cut}[args.action](args)


if __name__ == "__main__":
    sys.exit(main())
