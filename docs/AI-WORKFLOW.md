# AI Learning and Persistence Workflow

## 1. Session bootstrap
At the beginning of a learning session:
1. Read AGENTS.md, MISSION.md, NOTES.md, and INDEX.md.
2. Identify the requested topic and domain.
3. Search existing knowledge, topics, learning records, lessons, and references.
4. Read relevant records to understand prior learning, demonstrated understanding, misconceptions, and open questions.
5. Check reviews/QUEUE.md and relevant note-level review metadata.
6. Read RESOURCES.md and find current authoritative sources when freshness or precision matters.

Do not load the entire repository by default. Retrieve the smallest useful set of files.

## 2. Session type
Classify the session as new learning, continuation, review, connection, correction, or practical application. Do not force a formal lesson for a trivial factual exchange. A substantive Teach session should produce a lesson and learning record.

## 3. Teach
- Ground the lesson in the mission and learner's current level.
- Use clear English in durable materials and Chinese in conversation when useful.
- Teach mechanisms, examples, assumptions, and limitations rather than disconnected facts.
- Use active recall and application.
- Connect to prior knowledge when the relationship is meaningful.
- Cite reliable sources and record source details.

## 4. Save at a meaningful boundary
Save when a lesson is completed or intentionally paused. A paused lesson may be marked In Progress; do not pretend the topic is complete.

For a substantive session, update applicable artifacts:
1. lessons/NNNN-<slug>.html
2. learning-records/NNNN-<slug>.md
3. knowledge/<domain>/<slug>.md
4. topics/<slug>.md when a larger synthesis changes
5. reference/<slug>.html when a reusable quick reference is useful
6. RESOURCES.md for important recurring sources
7. reviews/QUEUE.md and note-level mastery/review metadata
8. domain maps and INDEX.md

Not every session needs every artifact. Avoid empty or redundant files.

## 5. Preserve history and correct knowledge
Learning records are historical and normally append-only. Knowledge notes and topic syntheses are living documents. If a prior understanding was wrong, correct the canonical note and record the misconception and correction in the new learning record. Use contested or superseded status when appropriate.

## 6. Review
Use docs/REVIEW-POLICY.md. At the beginning of a related session, surface a small number of due items. Ask for recall before showing answers. Update mastery and next review date after the learner responds.

## 7. Commit to GitHub
- Normal destination: main.
- Commit a coherent set of changes for the session.
- Read current contents and blob SHAs before updates.
- If the branch head changed, refresh and reconcile.
- Do not ask for confirmation for routine saves.
- Verify the commit and changed files.
- If GitHub write access is unavailable, say persistence did not happen.

## 8. Closeout
Report what was learned, what the learner demonstrated, remaining questions, files changed, cross-domain links, next review, and the verified commit reference. A conversation is not saved until the GitHub write is verified.
