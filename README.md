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
| `system/` | Teach, learning science, review rules, the Site, scripts |
| `vault/` | Your data: `NORTH-STAR.md`, `NOTES.md`, `topics/<slug>/` |

## Scripts

- `system/scripts/review.py` — due items, grading, stats.
- `system/scripts/export-template.sh <dir> [deny-regex]` — export the System with an empty vault and fresh history.

The scripts use only the Python standard library. Tests: `python3 -m unittest discover -s system/scripts`; style: `uvx ruff check` and `uvx ruff format`.

## Checks

GitHub Actions runs on every push and pull request: Prettier, ESLint, `astro check`, Vitest, and the build for the Site; Ruff and the unit tests for the scripts.

To upgrade, replace the paths in [system/MANIFEST](system/MANIFEST); `vault/` is untouched.

## Site

Lessons and reference documents are published as a website ([system/site/](system/site/README.md)). Preview with `pnpm install` and `pnpm dev` (Node 24; `corepack enable` provides pnpm). To publish on Cloudflare: Workers & Pages → Create → Import a repository. Worker name `personal-learn` (as in `wrangler.jsonc`), build command `pnpm build`, deploy command `pnpm run deploy`. Add a custom domain under the Worker's Settings → Domains & Routes, then set `Site` in `vault/NOTES.md`.

## License

[MIT](LICENSE). `vault/` belongs to its learner.
