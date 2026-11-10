# Instructions for AI Agents

This repository is an AI-operated learning system. It has two parts (see [system/GLOSSARY.md](system/GLOSSARY.md)):

- **System**: the reusable method. Listed in [system/MANIFEST](system/MANIFEST). Contains nothing about any specific learner.
- **Vault** (`vault/`): one learner's Teach workspace — mission, notes, resources, glossary, lessons, reference documents, learning records, and review items.

The base teaching method is Teach, kept verbatim in `system/teach/`. Do not edit those files; adapt it only in the tutor skill.

## Routing

When the user wants to learn, study, understand, practise, review, or "continue", use the tutor skill: [.agents/skills/tutor/SKILL.md](.agents/skills/tutor/SKILL.md). No trigger word is needed. Answer quick factual questions directly without starting a session.

## Rules

1. The skill is the single source of procedure. Do not copy its rules into other files.
2. Never write learner-specific content (names, repository names, preferences, goals) into System files. It belongs in `vault/`.
3. When changing the System, keep docs describing only the current design; do not keep history of old designs.
4. Durable files are written in clear English; conversation may be in any language the learner prefers.
