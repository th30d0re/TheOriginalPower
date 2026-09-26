#!/usr/bin/env python3
"""Cut the full Chapter 135 episode into three-minute Instagram parts and add end cards.

Usage (from the repo root, with .venv-voice active):
    python Architecting_the_operation/video/cut_reels.py outputs/chapter135_reply/chapter135_reply_draft11.mp4

Parts 1 to 8 are cut at turn boundaries of the full episode's manifest. Parts 1 to 7 get a
4-second silent end card ("Part N of 8", sources and book QR codes, next part). Part 0, the
separately built three-minute cliff notes, is copied in unchanged if it is present.
"""
import argparse, json, subprocess, sys
from pathlib import Path

MANIFEST = Path("outputs/chapter135_reply/episode_manifest.json")
PART0 = Path("outputs/chapter135_part1v2/chapter135_part1_v2.mp4")  # the three-minute cliff notes
SOURCES = "https://github.com/th30d0re/TheOriginalPower/blob/main/Paper/chapter135_rebuttal_video/citations.md"
BOOK = "https://github.com/th30d0re/TheOriginalPower/releases"
# (first turn index, file stem, title)
PARTS = [(0, "part1_the_reel_and_the_first_answer", "The reel and the first answer"),
         (14, "part2_the_word_and_the_reel", "The one word she said"),
         (29, "part3_the_root_cause", "The root cause"),
         (49, "part4_what_works", "What works"),
         (64, "part5_the_process_and_grandfather_clauses", "The process and grandfather clauses"),
         (84, "part6_the_law_and_who_it_locks_out", "Who it locks out"),
         (100, "part7_the_features_and_the_framework", "The features and the framework"),
         (114, "part8_the_close", "The close")]


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", type=Path)
    ap.add_argument("--out", type=Path, default=Path("outputs/reels/with_sources"))
    args = ap.parse_args()
    turns = json.loads(MANIFEST.read_text())["turns"]
    args.out.mkdir(parents=True, exist_ok=True)
    work = Path("/tmp/reel_cuts"); work.mkdir(exist_ok=True)
    ends = [p[0] for p in PARTS[1:]] + [len(turns)]
    for k, ((a, stem, _), b) in enumerate(zip(PARTS, ends), start=1):
        start = max(0.0, turns[a]["start_ms"] / 1000 - 0.10)
        cut = work / f"{stem}.mp4"
        cmd = ["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-i", str(args.video)]
        if b < len(turns):
            cmd += ["-t", f"{turns[b]['start_ms'] / 1000 - 0.05 - start:.3f}"]
        run(cmd + ["-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", str(cut)])
        final = args.out / f"{stem}.mp4"
        if k == 8:  # the close already ends on the sources card
            final.write_bytes(cut.read_bytes())
        else:
            nxt = PARTS[k][2]  # title of part k+1
            card = {"component": "TitleCard", "headline": f"Part {k} of 8",
                    "items": [{"title": "Every source, on one page", "detail": "Scan the code."},
                              {"title": f"Next: Part {k + 1}", "detail": nxt}],
                    "sources": "Sources: Question 9 reply · The Original Power",
                    "qrs": [{"url": SOURCES, "label": "Sources"}, {"url": BOOK, "label": "The book"}]}
            cj, png, endmp4 = work / f"end{k}.json", work / f"end{k}.png", work / f"end{k}.mp4"
            cj.write_text(json.dumps(card))
            run([str(Path(sys.executable).parent / "scriptcast-video"), "still", str(cj), str(png)])
            run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-framerate", "30", "-t", "4", "-i", str(png), "-f", "lavfi", "-t", "4",
                 "-i", "anullsrc=r=48000:cl=stereo", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(endmp4)])
            run(["ffmpeg", "-y", "-v", "error", "-i", str(cut), "-i", str(endmp4), "-filter_complex",
                 "[0:v]setsar=1[v0];[1:v]setsar=1[v1];[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];"
                 "[1:a]aresample=48000,aformat=channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]",
                 "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
                 "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(final)])
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(final)],
                                   capture_output=True, text=True).stdout)
        print(f"part {k}: {int(dur // 60)}:{dur % 60:04.1f}  {final.name}")
    if PART0.exists():
        (args.out / "part0_the_cliff_notes.mp4").write_bytes(PART0.read_bytes())
        print("part 0: copied from", PART0)


if __name__ == "__main__":
    main()
