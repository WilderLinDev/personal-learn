---
name: review
description: Spaced review of due items across all topics in this repository's vault. Use when items are due at the start of a conversation (offer it), or whenever the user wants to review, revise, be tested on past material, or asks what is due — in any language, e.g. "review", "复习", "考考我之前学的". Never wait for the user to name this skill.
---

# Review

1. `python3 system/scripts/review.py due` lists due items (id, topic, kind, question). Ask at most ~10. Put easily confused items next to each other.
2. For each item:
   1. Ask the question. Ask for confidence first (`guess` / `unsure` / `sure`), then the answer from memory.
   2. `python3 system/scripts/review.py answer <item-id>`, compare, and give corrective feedback with the reason. Give extra attention to wrong `sure` answers.
   3. `python3 system/scripts/review.py grade <item-id> <again|hard|good|easy> <confidence>`.
   4. Ask `again` items once more at the end of the session.
3. If an item turns out ambiguous or wrong, fix its question or answer in `reviews.json` with the learner's agreement.
4. Save after every reply that graded an answer, as the `Saving` section of [AGENTS.md](../../../AGENTS.md) requires. At the end, report: items reviewed, misses, wrong `sure` answers, next due date.

Language follows section 5 of the [tutor skill](../tutor/SKILL.md): answers in either language, graded on content only.

Without a shell, read and update `vault/topics/*/reviews.json` by hand using [system/reviews.md](../../../system/reviews.md). Never show an answer before the learner has answered.
