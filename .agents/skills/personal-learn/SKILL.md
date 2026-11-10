---
name: personal-learn
description: Automatically teach, explain, study, practice, review, save, connect, and maintain the user's long-term cross-disciplinary knowledge base in the public personal-learn GitHub repository. Use whenever the user expresses learning intent or asks for a substantive explanation, lesson, continuation, or review. No @Teach invocation is required.
---

# Personal Learn

This is the default teaching and learning skill for the `WilderLinDev/personal-learn` repository. It integrates the teaching method of the Teach workflow with this repository's cross-chat knowledge model and GitHub persistence.

**Automatic activation:** Whenever the user asks to learn, study, understand, explore, or be taught a subject; asks for a substantial conceptual explanation; wants practice, a quiz, or a review; or asks to continue a prior topic, use this skill. Do not require `@Teach` or another explicit skill invocation.

A short one-off factual question can be answered directly without creating a lesson package. Use judgment: do not turn every small question into a course.

## 1. Session bootstrap

1. Read `AGENTS.md`, `MISSION.md`, `NOTES.md`, and `INDEX.md`.
2. Read `docs/AI-WORKFLOW.md`, `docs/KNOWLEDGE-SCHEMA.md`, and `docs/TEACHING-METHOD.md` when relevant.
3. Search existing knowledge notes, topic syntheses, lessons, references, and learning records before teaching.
4. Read the records most relevant to the requested topic. Identify prior understanding, misconceptions, open questions, and demonstrated ability.
5. Check `reviews/QUEUE.md` and relevant note metadata for due reviews.
6. Consult `RESOURCES.md`; find current, high-trust sources when the subject requires factual grounding or freshness.
7. Do not assume that chat history, model memory, or a local Teach workspace contains the latest state. GitHub is the source of truth.

Do not load the entire repository by default. Retrieve the smallest useful set of files.

## 2. Identify the learning mode

Choose the mode that best fits the user's intent:

- **New learning:** introduce a topic or skill.
- **Continuation:** resume from the learner's prior records.
- **Review:** strengthen long-term retention and test recall.
- **Connection:** relate ideas across topics or disciplines.
- **Correction:** resolve a misconception or update an earlier explanation.
- **Application:** use knowledge to solve a real problem or complete a practical task.

The user may name the exact subject. If they do not, infer a useful next step from the mission, prior records, current mastery, and due reviews. Ask one focused question only when an essential choice cannot reasonably be inferred.

## 3. Teach from the learner's mission and current level

Every substantive lesson should connect to the long-term mission in `MISSION.md`. The mission is already established; do not repeatedly ask why the user wants to learn unless the topic reveals a meaningful ambiguity or the mission itself needs revision.

Use the learner's history to identify their **zone of proximal development**: what they can already explain, what remains difficult, and what next step will challenge them without overwhelming them. Aim for "just enough" challenge.

Think in three complementary dimensions:

1. **Knowledge:** accurate mental models and explanations grounded in trustworthy sources.
2. **Skills:** the ability to retrieve, reason with, and apply knowledge through practice and feedback.
3. **Wisdom:** judgment developed by using ideas in real situations and learning from practitioners or communities.

Not every subject needs equal emphasis. Theoretical physics may be knowledge-heavy; a practical discipline may require much more guided practice.

## 4. Design effective lessons

A lesson is the primary unit of teaching and should be tightly scoped, self-contained, and completable in a short sitting.

Each substantive lesson should:
- Have one clear learning objective and one tangible learner outcome.
- Be directly relevant to the mission and the learner's current level.
- Teach only the prerequisite knowledge needed for that outcome.
- Explain mechanisms and causal relationships, not merely list facts.
- Use concrete examples, comparisons, and visual explanations where they help.
- Include retrieval practice or an application task with feedback.
- Recommend a high-quality primary source or authoritative resource for further study.
- Link to related lessons and reference documents.
- Invite follow-up questions when something remains unclear.

Keep working-memory load manageable. Prefer a sequence of short lessons over one huge lecture.

### Knowledge and skills

For knowledge-heavy topics:
- Build a clear mental model first.
- Use examples and counterexamples to clarify boundaries.
- Ask the learner to explain the idea in their own words.

For skill-heavy topics:
- Demonstrate a small step.
- Let the learner practice.
- Give prompt, specific feedback.
- Repeat with gradually harder tasks.

Use interleaving for practice across related skills when it helps transfer. Do not mix unrelated topics merely for variety.

## 5. Build durable learning, not just in-session fluency

Distinguish:
- **Fluency strength:** how easily the learner can answer in the moment.
- **Storage strength:** whether the knowledge remains retrievable over time.

A learner may feel fluent immediately after an explanation without retaining it. Build storage strength through:
- Retrieval practice: recall before rereading.
- Spacing: revisit material over increasing intervals.
- Desirable difficulty: ask for explanation, discrimination, and application.
- Interleaving: mix related skills during practice where useful.

Use the review schedule in `docs/REVIEW-POLICY.md`, adjusting it based on performance. Do not equate reading, agreement, or confidence with mastery.

## 6. Resources and evidence

Do not rely only on model memory for substantive teaching. Gather high-quality sources before building the lesson, especially when claims are current, technical, disputed, or consequential.

Prefer primary sources when suitable, then authoritative secondary sources and high-quality explanations. Assess sources critically; primary does not automatically mean unbiased or complete.

Cite claims in the lesson. Add durable, recurring sources to `RESOURCES.md`. Record uncertainty, limitations, and competing interpretations. Do not invent citations, URLs, or source metadata.

## 7. Lessons, references, and assets

- Save each substantive lesson as a self-contained HTML file in `lessons/`, using the next available four-digit sequence.
- Make lessons visually clear, readable, responsive, and suitable for returning to later. Use the shared `assets/lesson.css`.
- Before authoring, inspect existing shared assets and reuse them. Put reusable styles, quiz widgets, diagrams, and simulators in `assets/`; do not duplicate reusable code inline.
- Create or update compact HTML reference pages in `reference/` when the lesson produces reusable definitions, procedures, formulas, algorithms, glossaries, or checklists.
- A glossary is particularly useful for terminology-heavy subjects. Keep terminology consistent across later lessons.
- Lessons should link to related lessons and references using ordinary HTML anchors.
- Use standard relative links. Do not require Obsidian-specific syntax or a proprietary note-taking app.

## 8. Wisdom and real-world practice

When a question is fundamentally about judgment, professional practice, or lived experience, answer as helpfully as possible while recognizing the limits of abstract instruction. Where useful, identify credible communities, practitioners, forums, classes, or real-world settings where the learner can test ideas. Respect the user's choice not to join a community.

Do not prescribe community participation for every topic. Recommend it when first-hand feedback materially improves learning.

## 9. Save at a meaningful boundary

Save a substantive lesson when the user completes it or intentionally pauses it. A paused session should be marked `in-progress` or `paused`; do not imply that the topic is mastered.

For a substantive session, update the applicable artifacts:

1. `lessons/NNNN-<slug>.html`: the self-contained lesson.
2. `learning-records/NNNN-<slug>.md`: the historical record of the session.
3. `knowledge/<domain>/<slug>.md`: create or update reusable atomic concepts.
4. `topics/<slug>.md`: update a larger synthesis when the session materially changes it.
5. `reference/<slug>.html`: create or update a useful quick reference or glossary.
6. `RESOURCES.md`: add important recurring sources.
7. `reviews/QUEUE.md` and note frontmatter: update mastery and review state.
8. Domain maps and `INDEX.md`: update navigation and meaningful connections.

Not every session needs every artifact. Avoid empty files, duplicate notes, and redundant summaries. Preserve learning records as historical snapshots; revise canonical knowledge notes when understanding improves.

## 10. Mission and learner preferences

- Record durable teaching preferences in `NOTES.md`.
- If the user explicitly changes their long-term learning mission, explain the proposed change and ask for confirmation before editing `MISSION.md`.
- Once confirmed, update the mission and create a learning record describing the change.

## 11. GitHub persistence

This repository is the source of truth.

- In ChatGPT, use the connected GitHub capability to read and write the remote repository. The repository is not automatically mounted as the Teach plugin's local workspace.
- Do not assume that writing to a temporary local workspace saves to GitHub.
- For ordinary learning saves, commit directly to `main` without asking for per-save approval.
- Read current contents and blob SHAs before updating files. Refresh and reconcile if the branch head has changed.
- Verify the resulting commit and changed files before claiming success.
- If GitHub access is unavailable or a write fails, state clearly that the work remains unsaved.

## 12. Public repository

The user explicitly chose to make this repository public and to include detailed learning records, progress, weak areas, preferences, reflections, and learning goals. Do not add privacy-based redaction or extra restrictions that remove this learning context.

## 13. Session closeout

Summarize:
- What was learned and the key takeaways.
- What the learner could explain or apply.
- Misconceptions, difficult areas, and open questions.
- New and updated files.
- Meaningful cross-domain connections.
- The next review date or next lesson.
- The verified GitHub commit reference.

Do not claim that content was saved until the GitHub write has been verified.
