# Instructions for AI Agents

This is the repository-wide entry point. Follow it whenever you read, teach from, or modify this repository.

## Automatic learning intent

Treat this repository's learning system as the default teaching workflow. When the user asks to learn, study, understand, explore, or be taught a subject; asks a conceptual question that calls for explanation; requests practice or review; or says "continue learning", automatically activate `.agents/skills/personal-learn/SKILL.md`.

Do not require the user to type `@Teach` or explicitly name the skill. Do not wait for a special trigger phrase.

Distinguish a quick factual question from a substantive learning session:
- Answer simple one-off questions directly.
- Use the full learning workflow for explicit learning requests, multi-step explanations, broad concepts, practice, review, or topics the user wants to study over time.
- When uncertain, start with a useful explanation and offer to turn it into a structured lesson; do not create formal files for every trivial exchange.

The repository instructions cannot invoke an external ChatGPT plugin. The Personal Learn skill contains the teaching method needed to operate independently.

## Start every learning session

1. Read `MISSION.md`, `NOTES.md`, and `INDEX.md`.
2. Read `RESOURCES.md` when sourcing or validating knowledge.
3. Read and follow `.agents/skills/personal-learn/SKILL.md`.
4. Search existing knowledge, topics, lessons, references, and learning records before creating new content.
5. Check relevant review items.
6. Treat this repository as the durable source of truth across chats and AI tools.

## Language

- Conversation may be in Chinese.
- Durable knowledge artifacts should be in clear, accessible English by default.
- Use Chinese explanations when they materially improve comprehension; preserve important English terminology.
- Do not mechanically translate every sentence.
- Gradually increase English complexity with demonstrated comprehension.

## Content model

- Atomic concepts: `knowledge/<domain>/<slug>.md`
- Larger topic syntheses: `topics/<slug>.md`
- Domain maps: `domains/<domain>/README.md`
- Self-contained lessons: `lessons/*.html`
- Compact references: `reference/*.html`
- Historical learning sessions: `learning-records/NNNN-<slug>.md`
- Review worklist: `reviews/QUEUE.md`
- Shared lesson assets: `assets/`
- Follow `docs/KNOWLEDGE-SCHEMA.md`, `docs/AI-WORKFLOW.md`, and `docs/TEACHING-METHOD.md`.

## Learning quality

- Separate source verification from learner mastery.
- Prefer primary and authoritative sources; record URLs and access dates.
- Mark uncertainty and disagreement.
- Use retrieval and application to assess mastery; reading alone is not mastery.
- Preserve historical learning records. Revise canonical knowledge notes when understanding improves.
- Use standard Markdown links and relative paths. Do not require Obsidian-specific syntax.

## Saving and GitHub

- Save substantive lessons when completed or intentionally paused.
- Update only artifacts warranted by the session; avoid mechanical duplication.
- Commit ordinary learning updates directly to `main` without per-save confirmation.
- Read current contents and blob SHAs before updating files. Reconcile if the branch has changed.
- Verify GitHub writes before claiming success.
- If GitHub write access is unavailable, say clearly that the work remains unsaved.

## Public repository

This repository is intentionally public. The user explicitly chose to publish detailed learning records, progress, weak areas, preferences, reflections, and learning goals. Do not add privacy-based redaction or extra filtering that removes this learning context.

## Closeout

After saving, report key takeaways, demonstrated understanding, open questions, files changed, cross-domain links, next review, and the verified commit.
