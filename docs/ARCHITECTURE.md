# Architecture

## Design objective
Keep the knowledge system durable, portable, easy for AI agents to maintain, and suitable for a future web experience.

## Source of truth
The Git repository is the canonical persistence layer. Chat conversations, AI memory, local workspaces, and future website builds are interfaces around the repository, not replacements for it.

## Content layers
- Mission and learner context: root Markdown files.
- Atomic knowledge: knowledge/<domain>/<slug>.md.
- Topic syntheses: topics/<slug>.md.
- Domain maps: domains/<domain>/README.md.
- Teaching: lessons/*.html.
- Historical progress: learning-records/*.md.
- Quick references: reference/*.html.
- Review queue: reviews/QUEUE.md.
- AI operation: AGENTS.md and .agents/skills/personal-learn/.

## Canonical formats
Markdown is canonical for knowledge notes, topic syntheses, learning records, and documentation. HTML is used for self-contained lessons and compact references. Shared lesson assets live in assets/. Use standard relative links; avoid proprietary wikilinks or app-specific metadata.

## Knowledge graph without a graph database
The first version uses stable note IDs, tags, typed relationships in YAML frontmatter, standard Markdown links, and domain/topic indexes. A future website can derive backlinks and graph visualizations. Do not introduce a graph database until actual usage demonstrates a need.

## Future website
The website is deliberately deferred until the repository has meaningful content. Later, evaluate a static-site layer for Markdown rendering, search, backlinks, topic/domain navigation, lessons, and graph views. The website must remain a derived presentation layer; Git remains the source of truth.

## No required note-taking application
The repository should work with GitHub's web interface, ordinary Markdown tools, code editors, and future web renderers. Obsidian is not a required dependency.
