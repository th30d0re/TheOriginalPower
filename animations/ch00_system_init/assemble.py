"""Assemble Chapter 0, video 1.

Manuscript boards, with the host in the corner, then the Lorentz explainer
between the bridge line and Figure 0.1, then the boards through equation 0.2.

    .venv/bin/python animations/ch00_system_init/assemble.py
"""

import json
import subprocess
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
RIG = REPO / "Architecting_the_operation" / "video" / "avatar_rig" / "parts"
EP = HERE / "voice" / "ch00_video_01"
BOARDS = HERE / "boards"
WORK = HERE / "work"
LORENTZ = REPO / "animations" / "ep00_preface" / "lorentz.mp4"
RHUBARB = Path("/tmp/rhubarb/Rhubarb-Lip-Sync-1.14.0-macOS/rhubarb")
STITCH = REPO / ".venv-voice" / "bin" / "scriptcast-stitch"

W, H = 1920, 1080
FPS = 30
TILT = -24
MAX_H = 280
MARGIN = 18
# The bridge line is turn 9. Figure 0.1 is turn 10. The explainer sits between them.
INSERT_BEFORE = 10

SHAPE = {
    "X": "rest", "A": "rest", "B": "ee", "C": "ah", "D": "ah",
    "E": "oh", "F": "oh", "G": "fv", "H": "ah",
}
PATHS = {
    "rest": RIG / "head.png",
    "ee": RIG / "mouths" / "ee.png",
    "ah": RIG / "mouths" / "ah.png",
    "oh": RIG / "mouths" / "oh.png",
    "fv": RIG / "mouths" / "fv.png",
}

BOARD_FOR = {}
for i in range(0, 1):
    BOARD_FOR[i] = "title"
for i in range(1, 4):
    BOARD_FOR[i] = "layers"
for i in range(4, 10):
    BOARD_FOR[i] = "eq01"
BOARD_FOR[10] = "fig01"
for i in range(11, 15):
    BOARD_FOR[i] = "eq01a"
BOARD_FOR[15] = "substrate"
BOARD_FOR[16] = "nodes_0"
for n, i in enumerate(range(17, 22), start=1):
    BOARD_FOR[i] = f"nodes_{n}"
BOARD_FOR[22] = "nodes_5"
for i in (23, 24):
    BOARD_FOR[i] = "capital"
BOARD_FOR[25] = "pyramid"
BOARD_FOR[26] = "circuit_-1"
for n, i in enumerate(range(27, 32)):
    BOARD_FOR[i] = f"circuit_{n}"
for i in range(32, 35):
    BOARD_FOR[i] = "eq02"


def run(cmd):
    subprocess.run(cmd, check=True)


def scaled():
    turned, names = [], []
    for name, path in PATHS.items():
        im = Image.open(path).convert("RGBA")
        im = im.rotate(TILT, resample=Image.Resampling.BICUBIC, expand=True)
        turned.append(im)
        names.append(name)
    boxes = []
    for im in turned:
        mask = im.getchannel("A").point(lambda p: 255 if p > 8 else 0)
        boxes.append(mask.getbbox())
    crop = (
        min(b[0] for b in boxes),
        min(b[1] for b in boxes),
        max(b[2] for b in boxes),
        max(b[3] for b in boxes),
    )
    out = {}
    for name, im in zip(names, turned):
        im = im.crop(crop)
        nw = max(1, round(im.width * MAX_H / im.height))
        im = im.resize((nw, MAX_H), Image.Resampling.LANCZOS)
        out[name] = im
    return out


def load_cues(path):
    data = json.loads(Path(path).read_text())
    return [(c["start"], c["end"], SHAPE[c["value"]]) for c in data["mouthCues"]]


def shape_at(t, spoken):
    for start, end, name in spoken:
        if start <= t < end:
            return name
    return "rest"


def turn_at(ms, turns):
    idx = 0
    for i, turn in enumerate(turns):
        if ms + 0.01 >= turn["start_ms"]:
            idx = i
    return idx


def compose(board_name, mouth, faces, cache):
    dest = cache / f"{board_name}_{mouth}.png"
    if dest.exists():
        return dest
    frame = Image.open(BOARDS / f"{board_name}.png").convert("RGBA")
    face = faces[mouth]
    frame.alpha_composite(face, (MARGIN, H - face.height - MARGIN))
    frame.convert("RGB").save(dest)
    return dest


def hold_list(t0, t1, turns, cues, faces, cache):
    edges = [t0, t1]
    for start, end, _ in cues:
        if t0 < start < t1:
            edges.append(start)
        if t0 < end < t1:
            edges.append(end)
    for turn in turns:
        s = turn["start_ms"] / 1000
        if t0 < s < t1:
            edges.append(s)
    edges = sorted(set(round(e, 3) for e in edges))
    rows = []
    for a, b in zip(edges, edges[1:]):
        if b - a < 0.04 and rows:
            png, dur = rows[-1]
            rows[-1] = (png, dur + (b - a))
            continue
        idx = turn_at(a * 1000, turns)
        mouth = shape_at(a, cues)
        png = compose(BOARD_FOR[idx], mouth, faces, cache)
        rows.append((png, b - a))
    covered = sum(d for _, d in rows)
    gap = (t1 - t0) - covered
    if rows and abs(gap) > 0.001:
        png, dur = rows[-1]
        rows[-1] = (png, dur + gap)
    return rows


def write_holds(rows, audio, out):
    lst = WORK / (out.stem + "_concat.txt")
    lines = ["ffconcat version 1.0"]
    for png, dur in rows:
        lines.append(f"file '{png}'")
        lines.append(f"duration {dur:.4f}")
    lines.append(f"file '{rows[-1][0]}'")
    lst.write_text("\n".join(lines) + "\n")
    run([
        "ffmpeg", "-y", "-v", "error",
        "-f", "concat", "-safe", "0", "-i", str(lst),
        "-i", str(audio),
        "-vf", "fps=30,format=yuv420p",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
        "-shortest", "-movflags", "+faststart",
        str(out),
    ])


def cut_audio(src, t0, t1, dest):
    run([
        "ffmpeg", "-y", "-v", "error",
        "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}", "-i", str(src),
        "-ar", "48000", "-ac", "1", str(dest),
    ])


def rhubarb(wav, dialog, dest):
    if dest.exists() and dest.stat().st_mtime >= wav.stat().st_mtime:
        return
    run([
        str(RHUBARB), "-r", "pocketSphinx", "-f", "json",
        "-d", str(dialog), "-o", str(dest), str(wav),
    ])


def composite_lorentz(cues_path, out, source=LORENTZ):
    partial = out.with_suffix(".partial.mp4")
    spoken = load_cues(cues_path)
    faces = scaled()
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(source)],
        check=True, capture_output=True, text=True,
    )
    duration = float(probe.stdout.strip())
    nframes = int(round(duration * FPS))
    decode = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", str(source), "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"],
        stdout=subprocess.PIPE,
    )
    encode = subprocess.Popen(
        [
            "ffmpeg", "-y", "-v", "error",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
            "-i", "pipe:0",
            "-i", str(source),
            "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-crf", "18",
            "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
            "-movflags", "+faststart",
            str(partial),
        ],
        stdin=subprocess.PIPE,
    )
    frame_bytes = W * H * 3
    for i in range(nframes):
        raw = decode.stdout.read(frame_bytes)
        if len(raw) < frame_bytes:
            break
        frame = Image.frombytes("RGB", (W, H), raw).convert("RGBA")
        face = faces[shape_at(i / FPS, spoken)]
        frame.alpha_composite(face, (MARGIN, H - face.height - MARGIN))
        encode.stdin.write(frame.convert("RGB").tobytes())
        if i and i % 300 == 0:
            print(f"lorentz host {i}/{nframes}", flush=True)
    encode.stdin.close()
    decode.stdout.close()
    decode.wait()
    code = encode.wait()
    if code != 0:
        raise SystemExit(code)
    partial.replace(out)


def spoken_dialog(turns):
    # Speech belongs to the speaker header above it. The title line before the
    # first header is the preamble, and it is not a turn.
    lines, seen, buf = [], False, []
    for line in (HERE / "video_01_script.md").read_text().splitlines():
        if line.startswith("Emmanuel"):
            seen = True
            if buf:
                lines.append(" ".join(buf))
                buf = []
            continue
        if seen and line.strip():
            buf.append(line.strip())
    if buf:
        lines.append(" ".join(buf))
    if len(lines) != len(turns):
        raise SystemExit(f"script lines {len(lines)} != turns {len(turns)}")
    return lines


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    if not (EP / "episode_manifest.json").exists():
        raise SystemExit(f"voice render is not finished: {EP}")
    mp3 = EP / "ch00_video_01.mp3"
    if not mp3.exists():
        run([str(STITCH), str(EP)])
    turns = json.loads((EP / "episode_manifest.json").read_text())["turns"]
    wav = WORK / "manuscript.wav"
    if not wav.exists() or wav.stat().st_mtime < mp3.stat().st_mtime:
        run(["ffmpeg", "-y", "-v", "error", "-i", str(mp3), "-ar", "16000", "-ac", "1", str(wav)])
    dialog = WORK / "manuscript_dialog.txt"
    lines = spoken_dialog(turns)
    dialog.write_text("\n".join(lines) + "\n")
    cues_path = WORK / "manuscript_cues.json"
    rhubarb(wav, dialog, cues_path)
    cues = load_cues(cues_path)

    split = turns[INSERT_BEFORE]["start_ms"] / 1000
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)],
        check=True, capture_output=True, text=True,
    )
    total = float(probe.stdout.strip())
    audio_a = WORK / "part_a.wav"
    audio_c = WORK / "part_c.wav"
    cut_audio(mp3, 0, split, audio_a)
    cut_audio(mp3, split, total, audio_c)

    faces = scaled()
    cache = WORK / "frames"
    cache.mkdir(exist_ok=True)
    write_holds(hold_list(0, split, turns, cues, faces, cache), audio_a, WORK / "part_a.mp4")
    cues_c = [(s - split, e - split, n) for s, e, n in cues if e > split]
    write_holds(hold_list(split, total, turns, [(s + split, e + split, n) for s, e, n in cues_c], faces, cache), audio_c, WORK / "part_c.mp4")

    lorentz_out = WORK / "lorentz_host.mp4"
    if not lorentz_out.exists():
        composite_lorentz(HERE / "lorentz_cues.json", lorentz_out)

    final = HERE / "ch00_video_01.mp4"
    run([
        "ffmpeg", "-y", "-v", "error",
        "-i", str(WORK / "part_a.mp4"),
        "-i", str(lorentz_out),
        "-i", str(WORK / "part_c.mp4"),
        "-filter_complex",
        "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]",
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart",
        str(final),
    ])
    print(final)


def manimgx_cut():
    """Host on the ManimGX film, with the Lorentz explainer inserted before Figure 0.1."""
    WORK.mkdir(parents=True, exist_ok=True)
    hosted = WORK / "chapterzero_host.mp4"
    composite_lorentz(WORK / "manuscript_cues.json", hosted, source=HERE / "ChapterZero.mp4")
    split = TURNS_SPLIT
    part_a = WORK / "gx_a.mp4"
    part_c = WORK / "gx_c.mp4"
    run(["ffmpeg", "-y", "-v", "error", "-i", str(hosted), "-to", f"{split:.3f}",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2", str(part_a)])
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{split:.3f}", "-i", str(hosted),
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2", str(part_c)])
    final = HERE / "ch00_video_01_manimgx.mp4"
    run([
        "ffmpeg", "-y", "-v", "error",
        "-i", str(part_a), "-i", str(WORK / "lorentz_host.mp4"), "-i", str(part_c),
        "-filter_complex", "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]",
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", str(final),
    ])
    print(final)


# Figure 0.1 starts at this second in both the voice manifest and the ManimGX scene.
TURNS_SPLIT = 161.05


if __name__ == "__main__":
    import sys
    WORK.mkdir(parents=True, exist_ok=True)
    if len(sys.argv) > 1 and sys.argv[1] == "lorentz":
        composite_lorentz(HERE / "lorentz_cues.json", WORK / "lorentz_host.mp4")
    elif len(sys.argv) > 1 and sys.argv[1] == "gx":
        manimgx_cut()
    else:
        main()
