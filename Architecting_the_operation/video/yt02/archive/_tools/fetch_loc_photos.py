import io
import os
import ssl
import urllib.request
from PIL import Image

ctx = ssl._create_unverified_context()
BASE_DIR = "Architecting_the_operation/video/yt02/archive"

# Rename Dred Scott and Cruikshank files
for old, new in [
    ("dredscott_416/tmp-024.png", "dredscott_416/dredscott_416_p416.png"),
    ("dredscott_416/tmp-025.png", "dredscott_416/dredscott_416_p417.png"),
    ("cruikshank/tmp-10.png", "cruikshank/cruikshank_p551.png"),
    ("cruikshank/tmp-11.png", "cruikshank/cruikshank_p552.png"),
    ("cruikshank/tmp-12.png", "cruikshank/cruikshank_p553.png"),
]:
  op = os.path.join(BASE_DIR, old)
  np = os.path.join(BASE_DIR, new)
  if os.path.exists(op):
    os.rename(op, np)
    im = Image.open(np)
    print(f"Renamed {np} ({im.size[0]}x{im.size[1]})")

# Fetch LOC photos for birmingham_1963 and selma_1965 from master TIFs, resize to ~2400px on long side (well >= 1600px) and save as PNG
loc_photos = [
    (
        "birmingham_1963",
        "birmingham_1963_p1.png",
        "https://tile.loc.gov/storage-services/master/pnp/ppmsca/72900/72946a.tif",
    ),
    (
        "birmingham_1963",
        "birmingham_1963_p2.png",
        "https://tile.loc.gov/storage-services/master/pnp/ppmsca/72900/72947a.tif",
    ),
    (
        "birmingham_1963",
        "birmingham_1963_p3.png",
        "https://tile.loc.gov/storage-services/master/pnp/ppmsca/04200/04293u.tif",
    ),
    (
        "selma_1965",
        "selma_1965_p1.png",
        "https://tile.loc.gov/storage-services/master/pnp/ppmsca/08100/08102u.tif",
    ),
    (
        "selma_1965",
        "selma_1965_p2.png",
        "https://tile.loc.gov/storage-services/master/pnp/cph/3d00000/3d02000/3d02300/3d02329u.tif",
    ),
    (
        "selma_1965",
        "selma_1965_p3.png",
        "https://tile.loc.gov/storage-services/master/pnp/ds/05200/05267u.tif",
    ),
]

for slug, fname, url in loc_photos:
  out_dir = os.path.join(BASE_DIR, slug)
  os.makedirs(out_dir, exist_ok=True)
  out_path = os.path.join(out_dir, fname)
  print("Downloading", url)
  req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
  data = urllib.request.urlopen(req, timeout=90, context=ctx).read()
  im = Image.open(io.BytesIO(data))
  orig_size = im.size
  # Keep >= 2400px on long side so PNG size is fast and crisp
  long_side = max(im.size)
  if long_side > 2400:
    scale = 2400.0 / long_side
    new_size = (int(round(im.size[0] * scale)), int(round(im.size[1] * scale)))
    im = im.resize(new_size, Image.Resampling.LANCZOS)
  im.save(out_path, format="PNG")
  print(
      f"Saved {out_path}: {im.size[0]}x{im.size[1]} (from master"
      f" {orig_size[0]}x{orig_size[1]})"
  )
