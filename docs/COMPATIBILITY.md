# Agent and ChatGPT Compatibility

## Portable skill format
The repository stores its reusable workflow as an Agent Skill at .agents/skills/personal-learn/SKILL.md. Agent Skills use a folder containing SKILL.md with YAML frontmatter and instructions, with optional references and assets.

The format is portable, but discovery locations and repository access differ by client. A compatible format does not mean every AI product automatically discovers the same path or has GitHub write access.

## ChatGPT
Use a ChatGPT Project named Personal Learning. Copy docs/CHATGPT-PROJECT-INSTRUCTIONS.md into its Project Instructions and enable the GitHub connection for this repository. Project instructions provide the bootstrap; the GitHub connection provides remote file access.

## Other AI agents
Use AGENTS.md as repository-wide context where supported. Configure each agent to discover .agents/skills/personal-learn/SKILL.md or install/link the skill in the location expected by that client. Follow that client's current documentation; do not assume identical discovery behavior across products.

## Persistence requirement
An agent must have repository read and write access to provide automatic GitHub persistence. If it only has local workspace access, it must explicitly synchronize changes or report that the repository was not updated.
