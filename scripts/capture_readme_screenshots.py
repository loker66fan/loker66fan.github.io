#!/usr/bin/env python3

import http.server
import os
import socketserver
import subprocess
import threading
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "assets" / "screenshots"
CHROME = "google-chrome-stable"


class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def capture(url: str, output_name: str, width: int, height: int):
    output_path = OUTPUT_DIR / output_name
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-background-networking",
        "--hide-scrollbars",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=12000",
        f"--window-size={width},{height}",
        f"--screenshot={output_path}",
        url,
    ]
    subprocess.run(cmd, check=True, cwd=ROOT)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    os.chdir(ROOT)
    server = ReusableTCPServer(("127.0.0.1", 0), SilentHandler)
    port = server.server_address[1]
    url = f"http://127.0.0.1:{port}/index.html?capture=1"
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    time.sleep(0.8)
    try:
        capture(url, "home-desktop.png", 1600, 1200)
        capture(url, "home-mobile.png", 430, 932)
    finally:
        server.shutdown()
        server.server_close()
        server_thread.join(timeout=2)


if __name__ == "__main__":
    main()
