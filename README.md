# Personal Learn

A public, English-first personal knowledge system for learning across disciplines, improving reasoning, and building practical skills over time.

**Repository:** https://github.com/WilderLinDev/personal-learn  
**Primary language:** English  
**Conversation language:** Chinese or mixed Chinese/English, as useful  
**Source of truth:** This Git repository

## Why this exists

This repository turns separate learning conversations into one cumulative body of knowledge. A new chat should not mean starting from zero: an AI tutor should read the relevant learning history, teach from the learner's current level, connect new ideas to existing knowledge, and save the outcome.

The long-term goal is to:
- Build a broad, connected understanding of the world.
- Improve reasoning, judgment, and the ability to evaluate claims.
- Develop practical skills that can be applied outside the learning environment.
- Improve English through sustained exposure to clear, useful English content.

## Core principles

1. **Repository as source of truth.** Chat history is temporary; durable learning state belongs here.
2. **English-first knowledge.** Write canonical knowledge, lessons, references, and records in clear English. Use Chinese explanations when they materially improve understanding. Preserve important English terminology.
3. **One connected system.** Use domains for navigation, tags for cross-cutting topics, and explicit links for relationships.
4. **Two levels of knowledge.** Maintain topic syntheses and reusable atomic knowledge notes.
5. **Separate truth from mastery.** A claim's verification status is not the same as the learner's mastery.
6. **Preserve the learning journey.** Learning records are historical records; update canonical knowledge when understanding improves.
7. **Save at meaningful boundaries.** Save when a lesson is completed or intentionally paused, not after every chat message.
8. **Public by design.** This repository is public. Detailed learning records, progress, weak areas, preferences, and personal learning reflections are intentionally part of the published knowledge project. Do not add privacy-based redaction rules that remove this learning context.
9. **Portable content.** Prefer Markdown, standard relative links, and standalone HTML. Do not make a proprietary note-taking app a required dependency.
10. **No invented persistence.** An AI must verify successful GitHub writes before claiming that work was saved.

## Repository map

| Path | Purpose |
|---|---|
| `AGENTS.md` | Repository-wide instructions for AI agents |
| `MISSION.md` | Long-term learning mission |
| `NOTES.md` | Teaching and interaction preferences |
| `RESOURCES.md` | Curated learning sources |
| `INDEX.md` | Main navigation and knowledge index |
| `domains/` | Domain landing pages and maps |
| `knowledge/` | Atomic, reusable knowledge notes |
| `topics/` | Larger topic syntheses that connect atomic notes |
| `lessons/` | Self-contained HTML lessons |
| `reference/` | Compact HTML reference pages |
| `learning-records/` | Historical records of what was learned |
| `reviews/QUEUE.md` | Spaced-review queue |
| `assets/` | Shared lesson assets |
| `.agents/skills/personal-learn/` | Portable Agent Skill for maintaining this system |
| `docs/` | Architecture, workflows, schemas, and setup guides |

## Start here

### For a person

1. Read [MISSION.md](MISSION.md) and [INDEX.md](INDEX.md).
2. Browse [knowledge](knowledge/README.md), [topics](topics/README.md), and [learning records](learning-records/README.md).
3. Use the repository with any Markdown viewer or a future static website. No Obsidian installation is required.

### For an AI agent

1. Read [AGENTS.md](AGENTS.md).
2. Read [MISSION.md](MISSION.md), [NOTES.md](NOTES.md), and [INDEX.md](INDEX.md).
3. Activate [the Personal Learn skill](.agents/skills/personal-learn/SKILL.md) when teaching, saving, connecting, reviewing, or maintaining knowledge.
4. Follow [the AI workflow](docs/AI-WORKFLOW.md) and [knowledge schema](docs/KNOWLEDGE-SCHEMA.md).
5. For ChatGPT Projects, copy [the project instructions](docs/CHATGPT-PROJECT-INSTRUCTIONS.md) into the Project's instructions and enable the GitHub connection for this repository.

## ChatGPT Teach integration

The Teach plugin uses a stateful workspace with files such as `MISSION.md`, `RESOURCES.md`, `NOTES.md`, `lessons/`, `reference/`, `learning-records/`, and `assets/`. This repository deliberately preserves those familiar locations while adding a canonical Markdown knowledge layer.

A GitHub connection is not the same thing as a local filesystem mount. When using Teach in ChatGPT, the agent must explicitly read and write this repository through the connected GitHub capability; it must not assume the plugin's current local directory is this repository. See [Teach integration](docs/TEACH-INTEGRATION.md).

## Future website

The content model is designed to support a future website, but the website is intentionally deferred until the knowledge structure has real content. A later static-site layer can render Markdown notes, topic pages, search, backlinks, a knowledge graph, lessons, and review views without changing the repository's role as the source of truth.

## License

No open-source content license has been selected yet. Public visibility does not, by itself, grant permission to reuse or redistribute repository content.
