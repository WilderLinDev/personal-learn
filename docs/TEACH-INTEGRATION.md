# Teach Method Integration

## Goal

Personal Learn incorporates the teaching method of the Teach workflow into its own Agent Skill. This means a learning session can use the same core pedagogical approach without requiring the user to manually invoke the separate `@Teach` plugin.

## What is integrated

The repository's `.agents/skills/personal-learn/SKILL.md` includes:
- Mission-grounded teaching and zone of proximal development.
- Knowledge, skills, and wisdom as complementary learning outcomes.
- Short, focused, self-contained lessons.
- Knowledge-first or practice-first teaching depending on the subject.
- Retrieval practice, spacing, desirable difficulty, and long-term storage strength.
- High-trust source discovery and citations.
- Reusable HTML lessons, references, glossaries, and shared assets.
- Real-world practice and communities when useful.
- Learner preference capture and continuity across sessions.
- Automatic saving to the GitHub source of truth.

The detailed principles are in `docs/TEACHING-METHOD.md`.

## Important platform boundary

A repository can store instructions and a portable Agent Skill, but it cannot itself invoke a ChatGPT plugin, activate a tool, or grant GitHub permissions.

The installed Teach plugin's own entry workflow is configured for explicit selection. Therefore, embedding its teaching method does not make the external plugin auto-run. Instead, Personal Learn provides its own default teaching workflow.

For ChatGPT, configure the **Personal Learning** Project once using `docs/CHATGPT-PROJECT-INSTRUCTIONS.md`. Inside that Project, ordinary natural-language learning requests should use Personal Learn automatically; typing `@Teach` is not required.

Outside that Project, a new ChatGPT conversation may not have the repository instructions or GitHub context. Start learning chats inside the configured Project, or provide the repository/skill context in another environment.

## Teach workspace boundary

The Teach workflow's "current directory" refers to its active teaching workspace. It does not automatically mean this remote GitHub repository is mounted as a local filesystem.

When using the repository:
1. Read remote files through the connected GitHub capability.
2. Use the repository's mission, notes, resources, and learning records.
3. Write artifacts to the remote repository through GitHub operations.
4. Verify the commit and changed files.

Do not write only to a transient local workspace and assume it was synchronized.

## Mapping

| Teaching concept | Repository location |
|---|---|
| Mission | `MISSION.md` |
| Learner preferences | `NOTES.md` |
| Resources | `RESOURCES.md` |
| Lessons | `lessons/*.html` |
| References and glossaries | `reference/*.html` |
| Learning records | `learning-records/*.md` |
| Shared components | `assets/*` |
| Atomic knowledge | `knowledge/<domain>/*.md` |
| Topic syntheses | `topics/*.md` |
| Review state | Note frontmatter and `reviews/QUEUE.md` |
