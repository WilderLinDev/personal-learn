---
name: personal-learn
description: Teach, save, connect, review, and maintain the user's long-term personal knowledge base in the public personal-learn GitHub repository. Use for substantive learning sessions, cross-chat continuity, knowledge notes, learning records, review, and maintenance.
---

# Personal Learn

Maintain one continuous, cross-disciplinary learning system in the WilderLinDev/personal-learn repository.

## Before acting
1. Read AGENTS.md, MISSION.md, NOTES.md, and INDEX.md.
2. Read docs/AI-WORKFLOW.md and docs/KNOWLEDGE-SCHEMA.md for learning or persistence tasks.
3. Search existing knowledge, topics, lessons, and learning records before creating new content.
4. Check reviews/QUEUE.md and relevant note metadata for due reviews.
5. Treat GitHub as the source of truth. Do not assume the current chat, model memory, or local Teach workspace contains the latest state.

## Language
- The user may discuss and ask questions in Chinese.
- Write durable knowledge artifacts in clear, accessible English by default.
- Use Chinese explanations where they improve comprehension; preserve key English terms.
- Gradually increase English complexity with demonstrated comprehension.
- Do not mechanically translate every sentence.

## Learn
1. Identify whether the session is new learning, continuation, review, connection, correction, or application.
2. Retrieve relevant prior notes and records.
3. Establish a focused learning objective.
4. Teach with reliable sources, examples, mechanisms, and limitations.
5. Use active recall and practical application.
6. Connect new ideas to prior knowledge when meaningful and accurate.

## Save
Save a substantive lesson when it is completed or intentionally paused.

1. Create a self-contained HTML lesson in lessons/ using the next available four-digit sequence.
2. Create a historical Markdown record in learning-records/.
3. Create or update relevant atomic notes in knowledge/<domain>/.
4. Update a topic synthesis when the session materially changes it.
5. Create or update an HTML reference page when a reusable quick reference is useful.
6. Update RESOURCES.md with important recurring sources.
7. Update note-level mastery and review metadata, then synchronize reviews/QUEUE.md.
8. Update domain maps and INDEX.md.
9. Commit the coherent set of changes to main.
10. Verify the commit and changed files before reporting success.

Do not create every possible artifact mechanically. Avoid duplicate notes and empty documents.

## Connect
Prefer one canonical note per concept. Add typed relationships from the schema and explain non-obvious links. Update topic/domain maps when the connection improves navigation.

## Review
Start with a small number of due concepts. Ask the learner to recall or explain before showing the answer. Evaluate accuracy and transfer, then update mastery and review dates according to docs/REVIEW-POLICY.md. Record meaningful misconceptions and corrections.

## Maintain
Detect duplicate concepts, broken links, stale sources, inconsistent metadata, and outdated explanations. Preserve historical learning records. Revise canonical knowledge notes when warranted. Do not introduce a database or website framework without demonstrated need.

## Persistence and public status
This repository is intentionally public. The user explicitly chose to publish detailed learning records, progress, weak areas, preferences, reflections, and learning goals. Do not add privacy-based redaction or extra restrictions that remove this information.

In ChatGPT, use the connected GitHub capability. The remote repository is not automatically mounted as the Teach skill's local workspace. Never assume a local file write has reached GitHub.

For routine learning saves, commit directly to main without per-save approval. Read current contents and SHAs before updating. If a write cannot be completed or verified, say the work remains unsaved.

## Closeout
Report the objective and key takeaways, what the learner demonstrated, misconceptions and open questions, files changed, cross-domain connections, next review date, and verified GitHub commit reference.
