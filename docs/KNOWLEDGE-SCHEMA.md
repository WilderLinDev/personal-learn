# Knowledge Schema

## Atomic knowledge note
Location: knowledge/<domain>/<slug>.md

Use one note for a reusable concept, mechanism, event, framework, person, or other unit that can be understood independently.

Example frontmatter:

```yaml
---
id: finance-etf
title: Exchange-Traded Fund
type: concept
domain: finance
tags:
  - investing
  - funds
verification_status: draft
mastery_status: new
created: 2026-11-11
updated: 2026-11-11
last_reviewed:
next_review:
sources:
  - title: Source title
    url: https://example.com/source
    source_type: primary
    accessed: 2026-11-11
relations:
  - type: prerequisite
    target: ../economics/interest-rates.md
---
```

Replace examples with verified information. Never invent source URLs or review dates.

Recommended body sections:
- Plain-language explanation
- How it works (when applicable)
- Example
- Common misconceptions
- Why it matters
- Related knowledge
- Open questions (when applicable)

## Stable IDs
Use a readable stable slug such as finance-etf. Do not change an ID merely because the title changes.

## Verification status and mastery status are separate

verification_status:
- draft: preliminary explanation; important claims need checking.
- verified: claims checked against suitable sources.
- contested: credible sources or interpretations disagree.
- superseded: no longer the current canonical explanation; link to its replacement.

mastery_status:
- new: not meaningfully studied.
- learning: introduced, but recall or explanation is unreliable.
- understood: can explain the core idea accurately without the note.
- mastered: can explain, distinguish, and apply the idea in a new context.

Do not mark mastery based only on reading.

## Relationship types
Use these when meaningful:
- prerequisite
- part_of
- contrasts_with
- applies_to
- example_of
- influences
- related_to

Each relation includes a relative target path. Explain non-obvious relationships in the note body.

## Topic synthesis
Location: topics/<slug>.md. Include scope, central question, coherent explanation, key mechanisms/distinctions, links to atomic notes, open questions, and next learning steps. Use frontmatter with id, title, domains, tags, created, and updated.

## Learning record
Location: learning-records/NNNN-<slug>.md. Include date, session status, topic/domain, what was taught, what the learner explained or applied, misconceptions and difficult areas, open questions, files created/updated, sources, next steps, and review schedule. Use sequential four-digit numbering and never reuse a number.

## Lesson and reference HTML
Lessons are short, self-contained HTML documents in lessons/. References are compact, printable HTML pages in reference/. Link to assets/lesson.css with the correct relative path. Use semantic headings, readable typography, responsive layout, and links to related notes.

## Links and filenames
Use lowercase kebab-case English filenames and standard relative Markdown links. Do not use app-specific wikilinks. Keep one canonical note per concept.
