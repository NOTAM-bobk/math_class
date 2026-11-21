#!/usr/bin/env python3
"""Regenerates the cover derivatives and the cover manifest the catalog reads.

Two jobs:
  1. Upgrade covers that were saved at the feed's smallest size to its largest
     responsive size (the feed serves -xs 384px and -sm 512px). Existing files
     are only replaced when the larger rendition is genuinely bigger.
  2. Write a `covers/lqip/*.webp` blur-up placeholder for every cover, a wider
     source where the artwork is large enough to be worth a second `srcset`
     entry, and `src/lib/gameCoverMeta.ts` with the dimensions, srcset and
     placeholder path per game.

Run `npm run build:covers` first so every game has its cover file, then:
  python3 scripts/refresh-cover-sources.py
Requires Pillow.
"""

import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVER_DIR = os.path.join(ROOT, "covers")
LQIP_DIR = os.path.join(COVER_DIR, "lqip")
CATALOG = os.path.join(ROOT, "api", "_catalog.json")
COVERS_TS = os.path.join(ROOT, "src", "lib", "gameCovers.ts")
META_TS = os.path.join(ROOT, "src", "lib", "gameCoverMeta.ts")
FEED_URL = "https://www.onlinegames.io/media/plugins/genGames/embed.json"
FEED_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; polytrack-covers/1.0)"}
LQIP_WIDTH = 24
SRCSET_WIDTH = 480

normalize = lambda value: re.sub(r"[^a-z0-9]", "", str(value or "").lower())


def read_covers():
    """The generated id -> /covers/file map."""
    text = open(COVERS_TS, encoding="utf-8").read()
    return {
        m.group(1): m.group(2)
        for m in re.finditer(r'^\s*"([^"]+)":\s*"([^"]+)"', text, re.M)
    }


def upgrade_sources(catalog, covers, feed_path=None):
    try:
        if feed_path:
            feed = json.load(open(feed_path, encoding="utf-8"))
        else:
            request = urllib.request.Request(FEED_URL, headers=FEED_HEADERS)
            with urllib.request.urlopen(request, timeout=30) as response:
                feed = json.load(response)
    except Exception as error:  # noqa: BLE001 - the upgrade is best effort
        print(f"Cover feed unavailable ({error}); keeping current files")
        return

    by_name = {}
    for entry in feed if isinstance(feed, list) else []:
        key = normalize(entry.get("title"))
        if key and key not in by_name:
            by_name[key] = entry

    jobs = []
    for game in catalog:
        url = covers.get(game.get("id"))
        if not url:
            continue
        name = normalize(game.get("name"))
        entry = by_name.get(name)
        image = entry.get("image") if entry else ""
        if not image or "/responsive/" not in image or not image.endswith("-xs.jpg"):
            continue
        path = os.path.join(ROOT, url.lstrip("/"))
        if not os.path.exists(path):
            continue
        with Image.open(path) as current:
            if current.width > 384:
                continue
        jobs.append((path, image.replace("-xs.jpg", "-sm.jpg")))

    upgraded = 0

    def upgrade(job):
        nonlocal upgraded
        path, remote = job
        try:
            request = urllib.request.Request(remote, headers=FEED_HEADERS)
            with urllib.request.urlopen(request, timeout=20) as response:
                data = response.read()
            if len(data) < 2048:
                return
            with Image.open(path) as before:
                before_size = before.size
            tmp = path + ".new"
            with open(tmp, "wb") as handle:
                handle.write(data)
            with Image.open(tmp) as after:
                after_size = after.size
            if after.width > before_size[0]:
                os.replace(tmp, path)
                upgraded += 1
            else:
                os.remove(tmp)
        except Exception:  # noqa: BLE001 - leave the existing file alone
            if os.path.exists(path + ".new"):
                os.remove(path + ".new")

    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(upgrade, jobs))

    print(f"Sources: {upgraded} of {len(jobs)} covers upgraded to the larger rendition")


def build_derivatives(covers):
    os.makedirs(LQIP_DIR, exist_ok=True)
    meta = {}
    made = 0

    for game_id, url in covers.items():
        path = os.path.join(ROOT, url.lstrip("/"))
        if not os.path.exists(path):
            continue
        base = os.path.splitext(os.path.basename(path))[0]
        lqip_name = f"{base}.webp"
        lqip_path = os.path.join(LQIP_DIR, lqip_name)

        with Image.open(path) as source:
            image = source.convert("RGB")
            width, height = image.size
            thumb = image.copy()
            thumb.thumbnail((LQIP_WIDTH, LQIP_WIDTH * 4), Image.LANCZOS)
            thumb.save(lqip_path, "WEBP", quality=42, method=6)

            srcset = []
            wide = None
            if width >= 600:
                wide_name = f"{base}-{SRCSET_WIDTH}.webp"
                wide_path = os.path.join(COVER_DIR, wide_name)
                resized = image.copy()
                resized.thumbnail((SRCSET_WIDTH, 10000), Image.LANCZOS)
                resized.save(wide_path, "WEBP", quality=82, method=6)
                wide = f"/covers/{wide_name}"
                srcset.append(f"{wide} {resized.width}w")
            srcset.append(f"{url} {width}w")
            made += 1

        meta[game_id] = {
            "src": url,
            "width": width,
            "height": height,
            "lqip": f"/covers/lqip/{lqip_name}",
            "srcset": ", ".join(srcset),
        }

    entries = ",\n".join(
        f"  {json.dumps(game_id)}: {json.dumps(value)}"
        for game_id, value in sorted(meta.items())
    )
    source = (
        "// Generated by scripts/refresh-cover-sources.py - do not edit by hand.\n"
        "// Dimensions, srcset and blur-up placeholder for every cover in /covers.\n\n"
        "export interface GameCoverMeta {\n"
        "  src: string;\n"
        "  width: number;\n"
        "  height: number;\n"
        "  lqip: string;\n"
        "  srcset: string;\n"
        "}\n\n"
        f"export const GAME_COVER_META: Record<string, GameCoverMeta> = {{\n{entries}\n}};\n\n"
        "export function gameCoverMeta(id: string): GameCoverMeta | null {\n"
        "  return GAME_COVER_META[id] || null;\n"
        "}\n"
    )
    open(META_TS, "w", encoding="utf-8").write(source)
    print(f"Derivatives: {made} covers with placeholders and manifest entries")


def main():
    feed_path = sys.argv[1] if len(sys.argv) > 1 else None
    catalog = json.load(open(CATALOG, encoding="utf-8"))
    covers = read_covers()
    upgrade_sources(catalog, covers, feed_path)
    build_derivatives(read_covers())


if __name__ == "__main__":
    main()
