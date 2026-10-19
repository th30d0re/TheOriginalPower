import io
import json
import os
import shutil
import ssl
import urllib.request
from PIL import Image

ctx = ssl._create_unverified_context()
BASE_DIR = "Architecting_the_operation/video/yt02/archive"


def fetch_bytes(url):
  req = urllib.request.Request(
      url,
      headers={
          "User-Agent": (
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
              " AppleWebKit/537.36"
          )
      },
  )
  return urllib.request.urlopen(req, timeout=30, context=ctx).read()


def save_png(img_bytes, out_path):
  os.makedirs(os.path.dirname(out_path), exist_ok=True)
  im = Image.open(io.BytesIO(img_bytes))
  im.save(out_path, format="PNG")
  print(f"Saved {out_path} ({im.size[0]}x{im.size[1]})")


# 1. hening1_226 from local file
os.makedirs(f"{BASE_DIR}/hening1_226", exist_ok=True)
im1 = Image.open("Paper/research/kimi_sources/hening_vol1/page226_n253.jpg")
im1.save(f"{BASE_DIR}/hening1_226/hening1_226_p226.png", format="PNG")
print(f"Saved hening1_226_p226.png ({im1.size[0]}x{im1.size[1]})")

# 2. hening2_1662 (statutesatlargeb02virg, page 170, leaf 176 -> n175)
for leaf in ["n175", "n176"]:
  url = f"https://archive.org/download/statutesatlargeb02virg/page/{leaf}_w1800.jpg"
  try:
    b = fetch_bytes(url)
    save_png(b, f"{BASE_DIR}/hening2_1662/test_{leaf}.png")
  except Exception as e:
    print("Err hening2:", leaf, e)

# 3. hening5_1738 (statutesatlargeb05virg, page 17, leaf 25 -> n24)
for leaf in ["n23", "n24", "n25"]:
  url = f"https://archive.org/download/statutesatlargeb05virg/page/{leaf}_w1800.jpg"
  try:
    b = fetch_bytes(url)
    save_png(b, f"{BASE_DIR}/hening5_1738/test_{leaf}.png")
  except Exception as e:
    print("Err hening5:", leaf, e)


# 4. Hening Vol 3 from Google Books F7jokIX5B1oC
def fetch_gb_page(book_id, pg, out_path):
  meta_url = (
      f"https://books.google.com/books?id={book_id}&pg=PA{pg}&jscmd=click3"
  )
  data = json.loads(fetch_bytes(meta_url).decode("utf-8", errors="ignore"))
  for p in data.get("page", []):
    if p.get("pid") == f"PA{pg}" and p.get("src"):
      src = p["src"] + "&w=1800"
      b = fetch_bytes(src)
      save_png(b, out_path)
      return True
  print(f"Could not find PA{pg} in {book_id}")
  return False


for pg in [86, 87]:
  fetch_gb_page(
      "F7jokIX5B1oC", pg, f"{BASE_DIR}/hening3_1691/hening3_1691_p{pg}.png"
  )

for pg in [447, 450, 451, 459]:
  fetch_gb_page(
      "F7jokIX5B1oC", pg, f"{BASE_DIR}/hening3_1705/hening3_1705_p{pg}.png"
  )

for pg in [250, 251, 298, 455, 456, 460, 461]:
  fetch_gb_page(
      "F7jokIX5B1oC",
      pg,
      f"{BASE_DIR}/hening3_1705_codes/hening3_1705_codes_p{pg}.png",
  )
