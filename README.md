# Personal Learn

An AI tutor that lives in a git repository. It teaches with [Teach](system/teach/SKILL.md), adds evidence-based practice and spaced review ([learning science](system/learning-science.md)), and saves everything as files you own.

Works with Claude Code, Codex, and ChatGPT (GitHub connector).

## Use

1. Create your repository from this template.
2. Claude Code / Codex: open it. ChatGPT: [setup](system/chatgpt-project.md).
3. Say "I want to learn …" or "review".

## Layout

| Path | |
|---|---|
| `.agents/skills/tutor/` | Learn a topic |
| `.agents/skills/review/` | Review due items |
| `system/` | Teach, learning science, review rules, scripts |
| `vault/` | Your data: `NORTH-STAR.md`, `NOTES.md`, `topics/<slug>/` |

## Scripts

- `system/scripts/review.py` — due items, grading, stats.
- `system/scripts/export-template.sh <dir> [deny-regex]` — export the System with an empty vault and fresh history.

To upgrade, replace the paths in [system/MANIFEST](system/MANIFEST); `vault/` is untouched.

## License

[MIT](LICENSE). `vault/` belongs to its learner.
