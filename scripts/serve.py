#!/usr/bin/env python3
"""Serve the built site on localhost, without exposing repository files."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1] / '_site'
if not (root / 'index.html').exists():
    raise SystemExit('请先运行 python3 scripts/build.py')
port = int(sys.argv[1]) if len(sys.argv)>1 else 4173
server = ThreadingHTTPServer(('127.0.0.1', port), partial(SimpleHTTPRequestHandler, directory=str(root)))
print(f'算竞纪事: http://127.0.0.1:{port}', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
