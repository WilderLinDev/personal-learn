# Schema

`vault/` is a Teach workspace. Its files follow Teach's own formats in [system/teach/](teach/):

| File | Format |
|---|---|
| `vault/MISSION.md` | [MISSION-FORMAT.md](teach/MISSION-FORMAT.md) |
| `vault/RESOURCES.md` | [RESOURCES-FORMAT.md](teach/RESOURCES-FORMAT.md) |
| `vault/GLOSSARY.md` | [GLOSSARY-FORMAT.md](teach/GLOSSARY-FORMAT.md) |
| `vault/learning-records/NNNN-<slug>.md` | [LEARNING-RECORD-FORMAT.md](teach/LEARNING-RECORD-FORMAT.md) |
| `vault/lessons/NNNN-<slug>.html`, `vault/reference/*.html`, `vault/assets/*`, `vault/NOTES.md` | [Teach SKILL.md](teach/SKILL.md) |

The only addition is review items.

## Review items — `vault/reviews/<slug>.yaml`

One file per topic. `<slug>` matches the topic's lesson or reference document.

```yaml
topic: etf-basics
sources:                       # where the answers are taught
  - lessons/0003-etf-basics.html
  - reference/etf.html
items:
  - id: etf-basics-1           # <slug>-<n>; never reused
    kind: recall               # recall | why | apply
    question: What does an ETF hold?
    answer: A basket of assets, usually tracking an index.
    created: 2026-11-11
    interval: 1                # days
    due: 2026-11-12
    log:                       # append-only
      - {date: 2026-11-11, confidence: unsure, grade: good}   # confidence: guess | unsure | sure; grade: again | hard | good | easy
```

Scheduling and Mastery rules are in the tutor skill (sections C3 and C4).
