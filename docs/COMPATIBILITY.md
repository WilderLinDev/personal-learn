# Agent and ChatGPT Compatibility

## Portable skill format

The repository stores its reusable workflow as an Agent Skill at `.agents/skills/personal-learn/SKILL.md`, with optional reference files. `AGENTS.md` is the repository-wide instruction entry point.

The Skill description is written to make learning intent explicit. Agents that load repository instructions should automatically use Personal Learn for substantive learning requests, without requiring the user to invoke `@Teach`.

The format is portable, but discovery locations and repository access differ by client. A compatible format does not mean every AI product automatically discovers the same path or has GitHub write access.

## ChatGPT

Create a Project named **Personal Learning**. Copy `docs/CHATGPT-PROJECT-INSTRUCTIONS.md` into its Project Instructions and enable the GitHub connection for this repository.

Project Instructions are the one-time bootstrap that tells ChatGPT to use the repository Skill for natural-language learning requests. Inside that Project, the user should not need to manually invoke `@Teach`.

The separate Teach plugin remains an optional tool. Personal Learn includes its core teaching method and does not depend on invoking the plugin.

## Other AI agents

Use `AGENTS.md` as repository-wide context where supported. Configure each agent to discover `.agents/skills/personal-learn/SKILL.md` or install/link the Skill in the location expected by that client. Follow that client's current documentation; do not assume identical discovery behavior across products.

## Persistence requirement

An agent must have repository read and write access to provide automatic GitHub persistence. If it only has local workspace access, it must explicitly synchronize changes or report that the repository was not updated.
