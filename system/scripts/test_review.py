"""Tests for review.py. Run: python3 -m unittest discover -s system/scripts"""

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from review import mastery, next_interval

SCRIPT = Path(__file__).with_name("review.py")


def item(kind="recall", interval=0, grades=()):
    return {"kind": kind, "interval": interval, "log": [{"grade": g, "confidence": "sure"} for g in grades]}


class NextInterval(unittest.TestCase):
    def test_first_review(self):
        self.assertEqual([next_interval(0, g) for g in ("again", "hard", "good", "easy")], [0, 1, 1, 3])

    def test_later_reviews(self):
        self.assertEqual(next_interval(10, "again"), 1)
        self.assertEqual(next_interval(10, "hard"), 12)
        self.assertEqual(next_interval(10, "good"), 25)
        self.assertEqual(next_interval(10, "easy"), 40)

    def test_minimums(self):
        self.assertEqual(next_interval(1, "good"), 3)
        self.assertEqual(next_interval(1, "easy"), 4)


class Mastery(unittest.TestCase):
    def test_new_until_a_correct_answer(self):
        self.assertEqual(mastery([]), "new")
        self.assertEqual(mastery([item(grades=["again"])]), "new")

    def test_learning(self):
        self.assertEqual(mastery([item(interval=3, grades=["good"]), item(interval=30, grades=["good"])]), "learning")

    def test_retained_without_an_applied_item(self):
        self.assertEqual(mastery([item(interval=21, grades=["good"])]), "retained")

    def test_mastered_with_an_applied_item(self):
        items = [item(interval=21, grades=["good"]), item("apply", interval=30, grades=["good"])]
        self.assertEqual(mastery(items), "mastered")


class Cli(unittest.TestCase):
    """add, due, and grade against a copy of the repository layout."""

    def setUp(self):
        self.root = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.root)
        (self.root / "system" / "scripts").mkdir(parents=True)
        (self.root / "vault" / "topics" / "demo").mkdir(parents=True)
        shutil.copy(SCRIPT, self.root / "system" / "scripts" / "review.py")

    def run_review(self, *args):
        script = self.root / "system" / "scripts" / "review.py"
        cmd = [sys.executable, "-I", str(script), "--today", "2026-01-01", *args]
        return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.strip()

    def test_add_due_grade(self):
        self.assertEqual(self.run_review("add", "demo", "recall", "Q?", "A."), "demo-1")
        self.assertIn("demo-1\tdemo\trecall\tQ?", self.run_review("due"))
        self.assertEqual(self.run_review("grade", "demo-1", "good", "sure"), "demo-1\tinterval 1\tdue 2026-01-02")
        data = json.loads((self.root / "vault" / "topics" / "demo" / "reviews.json").read_text(encoding="utf-8"))
        self.assertEqual(data["items"][0]["log"], [{"date": "2026-01-01", "confidence": "sure", "grade": "good"}])
        self.assertEqual(self.run_review("due", "--summary"), "")


if __name__ == "__main__":
    unittest.main()
