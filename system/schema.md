# Schema

Formats for everything in `vault/`. All files are Markdown or YAML with lowercase kebab-case English filenames and standard relative links.

```
vault/
  profile/mission.md        long-term goals
  profile/preferences.md    language, teaching style, persistence settings
  notes/<id>.md             one Note per file
  sessions/YYYY-MM-DD-<slug>.md
  reviews/<note-id>.yaml    Review items for one Note
  resources.md              recurring high-quality sources
  INDEX.md                  navigation (derived; may be regenerated)
```

## Note — `vault/notes/<id>.md`

A learner-independent explanation. Contains no Mastery or review data.

```yaml
---
id: finance-etf                # stable; equals the filename; never changes
title: Exchange-Traded Fund
type: concept                  # concept | synthesis
tags: [finance, investing]     # first tag is the main domain
verification: draft            # draft | verified | contested | superseded
sources:
  - title: Source title
    url: https://example.com
    kind: primary              # primary | secondary | explanatory
    accessed: 2026-11-11
related:
  - rel: prerequisite          # prerequisite | part_of | contrasts_with | example_of | related_to
    to: interest-rates         # another Note id
created: 2026-11-11
updated: 2026-11-11
---
```

Body sections (use what applies): **In short** · **How it works** · **Example** · **Common misconceptions** · **Why it matters** · **Open questions**.

A `synthesis` connects several concepts: state its central question, explain the overall structure, and link to concept Notes instead of repeating them.

`verification`:
- `draft`: important claims not yet checked against sources.
- `verified`: claims checked against suitable sources.
- `contested`: credible sources disagree; describe both sides.
- `superseded`: replaced; link to the replacement.

Never invent sources, URLs, or dates.

## Session — `vault/sessions/YYYY-MM-DD-<slug>.md`

Historical and append-only. Add `-2`, `-3` for more sessions on the same day and slug.

```yaml
---
date: 2026-11-11
status: completed              # completed | paused
notes: [finance-etf]           # Note ids touched
---
```

Body sections: **Objective** · **Covered** (short; the explanation lives in the Note) · **Performance** (items answered, wrong answers, confidence mismatches, misconceptions) · **Open questions** · **Next**.

## Review items — `vault/reviews/<note-id>.yaml`

```yaml
note: finance-etf
items:
  - id: finance-etf-1          # <note-id>-<n>; never reused
    kind: recall               # recall | why | apply
    question: What does an ETF hold?
    answer: A basket of assets, usually tracking an index.
    created: 2026-11-11
    interval: 1                # days
    due: 2026-11-12
    log:
      - {date: 2026-11-11, confidence: unsure, grade: good}   # confidence: guess | unsure | sure
```

Scheduling and Mastery rules are in the tutor skill (section 4). The `log` is append-only.

## Profile

Templates: [system/vault-skeleton/profile/](vault-skeleton/profile/).

## Index — `vault/INDEX.md`

One line per Note, grouped by main tag: `- [Title](notes/<id>.md) — <mastery>`. It is derived from Notes and reviews; if it disagrees with them, they win.
