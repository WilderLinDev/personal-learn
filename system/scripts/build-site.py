#!/usr/bin/env python3
"""Build the Site: every topic's lessons/, reference/ and assets/, plus an index, into _site/.

  build-site.py [--out DIR]
"""
import argparse
import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TOPICS = ROOT / "vault" / "topics"
PUBLISHED = ("lessons", "reference", "assets")
SECTIONS = (("lessons", "Lessons"), ("reference", "Reference"))

STYLE = """
:root { --bg: #fff; --fg: #1d1d1f; --muted: #6e6e73; --line: #e5e5ea; --link: #0a58ca; }
@media (prefers-color-scheme: dark) {
  :root { --bg: #111113; --fg: #f2f2f7; --muted: #a1a1a6; --line: #2c2c2e; --link: #6ea8fe; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg);
  font: 17px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 720px; margin: 0 auto; padding: 40px 16px 64px; }
h1 { font-size: 28px; margin: 0 0 32px; }
section { border-top: 1px solid var(--line); padding: 24px 0; }
h2 { font-size: 21px; margin: 0 0 6px; }
p { margin: 0 0 16px; color: var(--muted); }
h3 { font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 16px 0 6px; }
ul { margin: 0; padding-left: 20px; }
li { margin: 4px 0; }
a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }
"""


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
    blocks = []
    for folder in sorted(p for p in TOPICS.glob("*") if p.is_dir()) if TOPICS.exists() else []:
        for name in PUBLISHED:
            if (folder / name).is_dir():
                shutil.copytree(folder / name, out / folder.name / name)
        title, why = mission_of(folder)
        parts = [f"<h2>{html.escape(title)}</h2>"]
        if why:
            parts.append(f"<p>{html.escape(why)}</p>")
        for name, label in SECTIONS:
            pages = sorted((folder / name).glob("*.html"))
            if pages:
                items = "".join(
                    f'<li><a href="{folder.name}/{name}/{p.name}">{html.escape(title_of(p))}</a></li>' for p in pages
                )
                parts.append(f"<h3>{label}</h3><ul>{items}</ul>")
        blocks.append(f"<section>{''.join(parts)}</section>")
    body = "".join(blocks) or "<p>No topics yet.</p>"
    (out / "index.html").write_text(
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f"<title>Learning</title><style>{STYLE}</style></head>"
        f"<body><main><h1>Learning</h1>{body}</main></body></html>\n",
        encoding="utf-8",
    )
    print(f"Site built in {out}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--out", type=Path, default=ROOT / "_site")
    build(p.parse_args().out.resolve())


if __name__ == "__main__":
    main()
