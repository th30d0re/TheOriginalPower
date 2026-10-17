"""POST card_prep.py assets to Figma upload URLs (from the Figma MCP upload_assets tool).

    python3 upload_assets.py MANIFEST.json URLS.txt [--offset N]

URLS.txt holds one submitUrl per line, in order; asset i of the manifest (from --offset) goes to URL i.
Multipart upload, so the layer name in Figma is the file name: "<key>.svg" / "<key>.png".
"""
import json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

manifest = json.load(open(sys.argv[1]))
urls = [u.strip() for u in open(sys.argv[2]) if u.strip()]
offset = int(sys.argv[sys.argv.index("--offset") + 1]) if "--offset" in sys.argv else 0
jobs = list(zip(manifest[offset:offset + len(urls)], urls))


def post(job):
    (key, path, mime), url = job
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-F", f"file=@{path};type={mime}", url], capture_output=True, text=True)
    return key, r.stdout


with ThreadPoolExecutor(6) as ex:
    for key, code in ex.map(post, jobs):
        print(code, key)
