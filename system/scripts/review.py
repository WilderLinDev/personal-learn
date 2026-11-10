#!/usr/bin/env python3
"""Review items for vault/topics/<slug>/reviews.json. Rules: system/reviews.md.

  review.py due [--limit N]
  review.py answer <item-id>
  review.py grade <item-id> <again|hard|good|easy> <guess|unsure|sure>
  review.py add <topic> <recall|why|apply> "<question>" "<answer>" [--source PATH]
  review.py stats

--today YYYY-MM-DD overrides today's date (for testing).
"""
import argparse
import datetime as dt
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TOPICS = ROOT / "vault" / "topics"
GRADES = ("again", "hard", "good", "easy")
CONFIDENCE = ("guess", "unsure", "sure")
KINDS = ("recall", "why", "apply")


def fail(msg):
    sys.exit(f"error: {msg}")


def load(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        fail(f"{path} is not valid JSON ({e}); not modified")
    if not isinstance(data.get("items"), list):
        fail(f"{path} has no 'items' list; not modified")
    return data


def save(path, data):
    tmp = path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, path)


def all_files():
    return sorted(TOPICS.glob("*/reviews.json")) if TOPICS.exists() else []


def find(item_id):
    for path in all_files():
        data = load(path)
        for item in data["items"]:
            if item["id"] == item_id:
                return path, data, item
    fail(f"no item {item_id}")


def next_interval(interval, grade):
    if interval == 0:
        return {"again": 0, "hard": 1, "good": 1, "easy": 3}[grade]
    if grade == "again":
        return 1
    if grade == "hard":
        return max(1, round(interval * 1.2))
    if grade == "good":
        return max(3, round(interval * 2.5))
    return max(4, round(interval * 4))


def mastery(items):
    correct = [i for i in items if any(e["grade"] != "again" for e in i["log"])]
    if not items or not correct:
        return "new"
    if all(i["interval"] >= 21 for i in items):
        applied = any(
            i["kind"] == "apply" and i["interval"] >= 21 and i["log"] and i["log"][-1]["grade"] != "again"
            for i in items
        )
        return "mastered" if applied else "retained"
    return "learning"


def cmd_due(args, today):
    rows = []
    for path in all_files():
        data = load(path)
        rows += [(i["due"], data["topic"], i) for i in data["items"] if i["due"] <= today]
    rows.sort(key=lambda r: (r[1], r[0], r[2]["id"]))
    for _, topic, i in rows[: args.limit]:
        print(f"{i['id']}\t{topic}\t{i['kind']}\t{i['question']}")
    print(f"# {len(rows)} due, showing {min(len(rows), args.limit)}")


def cmd_answer(args, today):
    _, _, item = find(args.id)
    print(item["answer"])


def cmd_grade(args, today):
    path, data, item = find(args.id)
    item["log"].append({"date": today, "confidence": args.confidence, "grade": args.grade})
    item["interval"] = next_interval(item["interval"], args.grade)
    item["due"] = (dt.date.fromisoformat(today) + dt.timedelta(days=item["interval"])).isoformat()
    save(path, data)
    print(f"{item['id']}\tinterval {item['interval']}\tdue {item['due']}")


def cmd_add(args, today):
    folder = TOPICS / args.topic
    if not folder.is_dir():
        fail(f"no topic folder {folder}")
    path = folder / "reviews.json"
    data = load(path) if path.exists() else {"topic": args.topic, "items": []}
    numbers = [int(i["id"].rsplit("-", 1)[1]) for i in data["items"]]
    item = {
        "id": f"{args.topic}-{max(numbers, default=0) + 1}",
        "kind": args.kind,
        "question": args.question,
        "answer": args.answer,
        "source": args.source,
        "created": today,
        "interval": 0,
        "due": today,
        "log": [],
    }
    data["items"].append(item)
    save(path, data)
    print(item["id"])


def cmd_stats(args, today):
    calib = {c: [0, 0] for c in CONFIDENCE}
    for path in all_files():
        data = load(path)
        items = data["items"]
        due = sum(i["due"] <= today for i in items)
        print(f"{data['topic']}\t{mastery(items)}\t{len(items)} items\t{due} due")
        for i in items:
            for e in i["log"]:
                calib[e["confidence"]][0] += e["grade"] != "again"
                calib[e["confidence"]][1] += 1
    for c, (ok, n) in calib.items():
        if n:
            print(f"# confidence {c}: {ok}/{n} correct ({ok / n:.0%})")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--today", default=dt.date.today().isoformat())
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("due"); s.add_argument("--limit", type=int, default=10); s.set_defaults(f=cmd_due)
    s = sub.add_parser("answer"); s.add_argument("id"); s.set_defaults(f=cmd_answer)
    s = sub.add_parser("grade"); s.add_argument("id"); s.add_argument("grade", choices=GRADES)
    s.add_argument("confidence", choices=CONFIDENCE); s.set_defaults(f=cmd_grade)
    s = sub.add_parser("add"); s.add_argument("topic"); s.add_argument("kind", choices=KINDS)
    s.add_argument("question"); s.add_argument("answer"); s.add_argument("--source"); s.set_defaults(f=cmd_add)
    s = sub.add_parser("stats"); s.set_defaults(f=cmd_stats)
    args = p.parse_args()
    dt.date.fromisoformat(args.today)
    args.f(args, args.today)


if __name__ == "__main__":
    main()
