#!/usr/bin/env python3
"""Build the Site into _site/, with the same paths as the repository:
system/design/, vault/theme.css, and each topic's lessons/, reference/ and assets/, plus an index.

  build-site.py [--out DIR]
"""
import argparse
import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VAULT = ROOT / "vault"
TOPICS = VAULT / "topics"
DESIGN = ROOT / "system" / "design"
PUBLISHED = ("lessons", "reference", "assets")
SECTIONS = (("lessons", "Lessons"), ("reference", "Reference"))


def title_of(path):
    match = re.search(r"<title>(.*?)</title>", path.read_text(encoding="utf-8"), re.S | re.I)
    return html.unescape(match.group(1).strip()) if match else path.stem


def mission_of(folder):
    path = folder / "MISSION.md"
    if not path.exists():
        return folder.name, ""
    text = path.read_text(encoding="utf-8")
    heading = re.search(r"^# (?:Mission:\s*)?(.+)$", text, re.M)
    why = re.search(r"^## Why\s*\n+(.+?)(?:\n\s*\n|\n#|\Z)", text, re.M | re.S)
    return (heading.group(1).strip() if heading else folder.name), (why.group(1).strip() if why else "")


def build(out):
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    shutil.copytree(DESIGN, out / "system" / "design", ignore=shutil.ignore_patterns("*.md", "templates"))
    (out / "vault").mkdir()
    if (VAULT / "theme.css").exists():
        shutil.copy2(VAULT / "theme.css", out / "vault" / "theme.css")
    blocks = []
    for folder in sorted(p for p in TOPICS.glob("*") if p.is_dir()) if TOPICS.exists() else []:
        base = f"vault/topics/{folder.name}"
        for name in PUBLISHED:
            if (folder / name).is_dir():
                shutil.copytree(folder / name, out / base / name)
        title, why = mission_of(folder)
        parts = [f"<h2>{html.escape(title)}</h2>"]
        if why:
            parts.append(f"<p>{html.escape(why)}</p>")
        for name, label in SECTIONS:
            pages = sorted((folder / name).glob("*.html"))
            if pages:
                items = "".join(
                    f'<li><a href="{base}/{name}/{p.name}">{html.escape(title_of(p))}</a></li>' for p in pages
                )
                parts.append(f'<p class="label">{label}</p><ul class="contents">{items}</ul>')
        blocks.append(f'<section class="topic">{"".join(parts)}</section>')
    body = "".join(blocks) or "<p>No topics yet.</p>"
    (out / "index.html").write_text(
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Learning</title>\n'
        '<link rel="stylesheet" href="system/design/learn.css">\n<link rel="stylesheet" href="vault/theme.css">\n'
        '</head>\n<body class="index">\n<header class="masthead"><p class="kicker">Personal Learn</p><h1>Learning</h1></header>\n'
        f"<main>{body}</main>\n</body>\n</html>\n",
        encoding="utf-8",
    )
    print(f"Site built in {out}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--out", type=Path, default=ROOT / "_site")
    build(p.parse_args().out.resolve())


if __name__ == "__main__":
    main()
