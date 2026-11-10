# Review items

`vault/topics/<slug>/reviews.json`, managed by [scripts/review.py](scripts/review.py).

```json
{
  "topic": "etf-basics",
  "items": [
    {
      "id": "etf-basics-1",
      "kind": "recall",
      "question": "What does an ETF hold?",
      "answer": "A basket of assets, usually tracking an index.",
      "source": "lessons/0001-etf-basics.html",
      "created": "2026-11-11",
      "interval": 1,
      "due": "2026-11-12",
      "log": [{"date": "2026-11-11", "confidence": "unsure", "grade": "good"}]
    }
  ]
}
```

- `kind`: `recall` | `why` | `apply`. `confidence`: `guess` | `unsure` | `sure`. `grade`: `again` | `hard` | `good` | `easy`.
- `id` is `<slug>-<n>` and never reused. `log` is append-only.
- A new item has `interval: 0` and is due today.

## Scheduling

After each graded answer, append to `log`, then set `interval` and `due = date + interval`:

| Grade | `interval` was 0 | otherwise |
|---|---|---|
| again | 0 | 1 |
| hard | 1 | max(1, round(interval × 1.2)) |
| good | 1 | max(3, round(interval × 2.5)) |
| easy | 3 | max(4, round(interval × 4)) |

## Mastery

Per topic, derived from its items:
- `new`: no items, or none ever answered correctly (any grade other than `again`).
- `learning`: otherwise, until `retained`.
- `retained`: every item has `interval` ≥ 21.
- `mastered`: `retained`, and an `apply` item's latest answer was correct at `interval` ≥ 21.
