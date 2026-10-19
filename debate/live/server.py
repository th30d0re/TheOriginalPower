#!/usr/bin/env python3
"""Live debate deck — serves the card deck and a state file the assistant writes each turn.

    python3 debate/live/server.py [--port 7040]

Then open http://localhost:7040. The page polls state.json twice a second; writing a new
`ts` there makes the browser jump to and highlight the cards named in `active`.
"""
import argparse
import http.server
import json
import os
import socketserver
import webbrowser

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
FONTS = os.path.join(REPO, "website", "public", "fonts")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=HERE, **kw)

    def translate_path(self, path):
        # Fonts live in the website tree; everything else is served from debate/live.
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean.startswith("/fonts/"):
            name = os.path.basename(clean)
            return os.path.join(FONTS, name)
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # a live round does not need an access log


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=7040)
    ap.add_argument("--no-open", action="store_true")
    args = ap.parse_args()

    # Sanity-check the deck so a JSON typo fails here rather than silently in the page.
    with open(os.path.join(HERE, "cards.json")) as fh:
        deck = json.load(fh)
    print(f"deck: {len(deck['cards'])} cards")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", args.port), Handler) as httpd:
        url = f"http://localhost:{args.port}"
        print(f"live deck → {url}   (ctrl-c to stop)")
        if not args.no_open:
            webbrowser.open(url)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
