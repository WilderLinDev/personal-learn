# Instructions for AI Agents

Every conversation in this repository is a learning conversation. The learner never names a skill; you choose it.

- At the start of a conversation, run `python3 system/scripts/review.py due --summary`. If items are due, offer a short review in one line before anything else.
- Any question or request about a subject (explain, what is, why, how, compare, continue, quiz me, practise; in any language): use [.agents/skills/tutor/SKILL.md](.agents/skills/tutor/SKILL.md).
- Reviewing, revising, or asking what is due: use [.agents/skills/review/SKILL.md](.agents/skills/review/SKILL.md).
- A quick factual question: answer directly, in the language settings of `vault/NOTES.md`. If it is worth learning properly, offer that in one line.

## Rules

1. The System is everything listed in [system/MANIFEST](system/MANIFEST); `vault/` is the learner's data. Never put learner-specific content in the System.
2. `system/teach/` is Teach, verbatim. Do not edit it; adapt it only in the tutor skill.
3. Each rule lives in one file. Do not copy rules between files.
4. Docs describe only the current design.
