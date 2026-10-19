"""Corner-bust test on the opening of the Lorentz explainer.

Mouth changes come from Rhubarb Lip Sync cues in host_corner_cues.json,
timed to the narration. Writes host_corner_test.mp4 beside this file.
"""

import json
import subprocess
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
RIG = REPO / "Architecting_the_operation" / "video" / "avatar_rig" / "parts"
SOURCE = HERE / "lorentz.mp4"
OUT = HERE / "host_corner_test.mp4"
CUES = HERE / "host_corner_cues.json"

W, H = 1920, 1080
FPS = 30
DURATION = 14.0
# Clockwise, so the cocked chin sits upright. PIL rotates counterclockwise.
TILT = -24
MAX_H = 280
MARGIN = 18

# Hanna-Barbera shapes from Rhubarb, drawn with the mouths we have.
SHAPE = {
    "X": "rest",
    "A": "rest",
    "B": "ee",
    "C": "ah",
    "D": "ah",
    "E": "oh",
    "F": "oh",
    "G": "fv",
    "H": "ah",
}
PATHS = {
    "rest": RIG / "head.png",
    "ee": RIG / "mouths" / "ee.png",
    "ah": RIG / "mouths" / "ah.png",
    "oh": RIG / "mouths" / "oh.png",
    "fv": RIG / "mouths" / "fv.png",
}


def cues():
    data = json.loads(CUES.read_text())
    return [(c["start"], c["end"], SHAPE[c["value"]]) for c in data["mouthCues"]]


def shape_at(t, spoken):
    for start, end, name in spoken:
        if start <= t < end:
            return name
    return "rest"


def scaled():
    turned = []
    names = []
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


def main():
    spoken = cues()
    faces = scaled()
    nframes = int(DURATION * FPS)
    decode = subprocess.Popen(
        [
            "ffmpeg", "-v", "error", "-t", str(DURATION), "-i", str(SOURCE),
            "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
        ],
        stdout=subprocess.PIPE,
    )
    encode = subprocess.Popen(
        [
            "ffmpeg", "-y", "-v", "error",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
            "-i", "pipe:0",
            "-t", str(DURATION), "-i", str(SOURCE),
            "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
            "-c:a", "aac", "-b:a", "160k",
            "-movflags", "+faststart",
            str(OUT),
        ],
        stdin=subprocess.PIPE,
    )
    frame_bytes = W * H * 3
    for i in range(nframes):
        raw = decode.stdout.read(frame_bytes)
        if len(raw) < frame_bytes:
            break
        frame = Image.frombytes("RGB", (W, H), raw).convert("RGBA")
        name = shape_at(i / FPS, spoken)
        face = faces[name]
        origin = (MARGIN, H - face.height - MARGIN)
        frame.alpha_composite(face, origin)
        encode.stdin.write(frame.convert("RGB").tobytes())
    encode.stdin.close()
    decode.stdout.close()
    decode.wait()
    code = encode.wait()
    if code != 0:
        raise SystemExit(code)
    print(OUT)


if __name__ == "__main__":
    main()
