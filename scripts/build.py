#!/usr/bin/env python3
"""Create a portable static site; no dependency installation or network needed."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
target = ROOT / '_site'
if target.exists():
    shutil.rmtree(target)
target.mkdir()
for folder in ['assets', 'data']:
    shutil.copytree(ROOT / folder, target / folder, dirs_exist_ok=True)
shutil.copy2(ROOT / 'index.html', target / 'index.html')
(target / '.nojekyll').touch()
print(f'Built static site: {target}')
