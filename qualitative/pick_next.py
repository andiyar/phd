#!/usr/bin/env python3
"""
Randomly pick the next file to code, excluding already-seen files.
Run from Manual_Coding/ directory:
    python3 pick_next.py
"""

import json
import os
import random
from pathlib import Path

SEEN_FILE = Path(__file__).parent / "seen_files.json"
WORKING_DATA = Path(__file__).parent.parent / "Working Data"

def load_seen():
    if SEEN_FILE.exists():
        with open(SEEN_FILE) as f:
            return {entry["file"] for entry in json.load(f)}
    return set()

def all_day_files():
    files = []
    for txt in WORKING_DATA.rglob("*.txt"):
        # Only files in a Day_* folder
        if any(part.startswith("Day_") for part in txt.parts):
            files.append(txt)
    return files

def mark_seen(filename, status="seen"):
    seen_list = []
    if SEEN_FILE.exists():
        with open(SEEN_FILE) as f:
            seen_list = json.load(f)
    seen_list.append({"file": filename, "status": status, "date": "2026-05-05"})
    with open(SEEN_FILE, "w") as f:
        json.dump(seen_list, f, indent=2)

def main():
    seen = load_seen()
    candidates = [f for f in all_day_files() if f.name not in seen]

    if not candidates:
        print("All files have been seen. Coding complete!")
        return

    chosen = random.choice(candidates)
    print(chosen)

    # Mark as seen immediately so re-runs don't repick it
    mark_seen(chosen.name, status="seen")

if __name__ == "__main__":
    main()
