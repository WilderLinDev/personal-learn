# Personal Learn

An AI tutor that lives in a git repository. Every learning conversation builds on the last one: the tutor reads what you have already learned, teaches the next step in a short lesson, tests your recall, and saves everything in the repository.

It works with any AI agent that can read and write the repository — Claude Code, Codex, or ChatGPT with the GitHub connector.

## How it teaches

The base method is **Teach** ([system/teach/](system/teach/SKILL.md), kept verbatim): every lesson is tied to your mission, pitched in your zone of proximal development, grounded in trusted, cited sources, and followed by practice with immediate feedback. Knowledge comes from resources, skills from practice, wisdom from communities.

On top of Teach, the tutor adds a few rules with strong, replicated evidence ([system/learning-science.md](system/learning-science.md)):

1. **Retrieve, don't reread** — you answer from memory, saying how confident you are first.
2. **Space it out** — review items come back at growing intervals.
3. **Relearn to criterion** — each question is answered correctly once per session.
4. **Corrective feedback** — immediately, with the reason.
5. **You generate, the AI guides** — hints, not answers.

Mastery is never self-reported. It is derived from how well you recall each item over weeks.

## Layout

| Path | Part | Purpose |
|---|---|---|
| `AGENTS.md`, `CLAUDE.md` | System | Entry point for AI agents |
| `.agents/skills/tutor/` | System | The tutor: how Teach is applied here, plus the additions |
| `system/teach/` | System | The Teach method, verbatim |
| `system/` | System | Learning science, review schema, glossary, setup, scripts |
| `vault/` | Vault | One learner's Teach workspace: mission, lessons, reference docs, learning records, reviews |

The System never contains anything about a specific learner. Everything personal lives in `vault/`.

## Getting started

1. Create your own repository from this template.
2. Connect your AI agent:
   - **Claude Code / Codex**: open the repository; `AGENTS.md` is picked up automatically.
   - **ChatGPT**: follow [system/chatgpt-project.md](system/chatgpt-project.md).
3. Say "I want to learn …". On the first run the tutor interviews you and writes `vault/MISSION.md` and `vault/NOTES.md`.

## Upgrading the System

Replace the paths listed in [system/MANIFEST](system/MANIFEST) with the newer version. `vault/` is never touched.

## Publishing a clean template

From an instance, `system/scripts/export-template.sh <dir> [deny-regex]` writes the System plus an empty vault into a new repository with fresh history, and fails if any file matches the deny pattern.

## License

System files: [MIT](LICENSE). The Teach method in `system/teach/` keeps its original authors' terms. The contents of `vault/` belong to their learner; see `vault/README.md`.
