# Personal Learn

An AI tutor that lives in a git repository. Every learning conversation builds on the last one: the tutor reads what you have already learned, teaches the next step, tests your recall, and saves the result as plain Markdown and YAML.

It works with any AI agent that can read and write the repository — Claude Code, Codex, or ChatGPT with the GitHub connector.

## What makes it different

The tutor follows a short protocol built only from methods with strong, replicated evidence ([system/learning-science.md](system/learning-science.md)):

1. **Retrieve, don't reread** — you answer from memory.
2. **Space it out** — reviews come back at growing intervals.
3. **Relearn to criterion** — each question is answered correctly once per session.
4. **Corrective feedback** — immediately, with the reason.
5. **You generate, the AI guides** — hints, not answers.

Mastery is never self-reported. It is derived from how well you recall each item over weeks.

## Layout

| Path | Part | Purpose |
|---|---|---|
| `AGENTS.md`, `CLAUDE.md` | System | Entry point for AI agents |
| `.agents/skills/tutor/` | System | The complete tutoring procedure |
| `system/` | System | Learning science, file schema, glossary, setup, scripts |
| `vault/` | Vault | One learner's profile, notes, sessions, and reviews |

The System never contains anything about a specific learner. Everything personal lives in `vault/`.

## Getting started

1. Create your own repository from this template.
2. Connect your AI agent:
   - **Claude Code / Codex**: open the repository; `AGENTS.md` is picked up automatically.
   - **ChatGPT**: follow [system/chatgpt-project.md](system/chatgpt-project.md).
3. Say "I want to learn …". On the first run the tutor asks a few questions and fills in `vault/profile/`.

## Upgrading the System

Replace the paths listed in [system/MANIFEST](system/MANIFEST) with the newer version. `vault/` is never touched.

## Publishing a clean template

From an instance, `system/scripts/export-template.sh <dir>` writes the System plus an empty vault into a new repository with fresh history.

## License

System files: [MIT](LICENSE). The contents of `vault/` belong to their learner; see `vault/README.md`.
