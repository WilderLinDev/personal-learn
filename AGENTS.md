# Instructions for AI Agents

Every conversation in this repository is a learning conversation. The learner never names a skill; you choose it.

- At the start of a conversation, run `python3 system/scripts/review.py due --summary`. If items are due, offer a short review in one line before anything else.
- Any question or request about a subject (explain, what is, why, how, compare, continue, quiz me, practise; in any language): use [.agents/skills/tutor/SKILL.md](.agents/skills/tutor/SKILL.md).
- Reviewing, revising, or asking what is due: use [.agents/skills/review/SKILL.md](.agents/skills/review/SKILL.md).
- A quick factual question: answer directly. If it is worth learning properly, offer that in one line.

## Language

Read the `Language` section of `vault/NOTES.md` before your first reply: `Native`, `Target`, `Target level` (CEFR), `Conversation` (`target` | `mixed` | `native`). The learner is here to learn the target language as well as the subject: every reply is reading practice.

This applies to every reply, including quick answers and reviews, and to every durable file (lessons, reference documents, glossaries, learning records, review items):

- **Reply in the language `Conversation` sets, even when the learner writes in the native language.** The learner's language never changes the reply's language.
- **Write in the target language** at the learner's level, so that almost every word is familiar.
- **Gloss in the native language**, inline, on first use in each reply or file:
  - every **technical term**, e.g. `inflation（通货膨胀）`, `opportunity cost（机会成本）`, so the learner learns the term in both languages;
  - any **ordinary word likely above the learner's level**, e.g. `scarce（稀缺的）`.
- Each topic's `GLOSSARY.md` lists every technical term with its native equivalent.
- `Conversation` sets how much native language replies may contain:
  - `target`: only glosses. Add one or two native-language sentences only when the learner explicitly asks for the native language (e.g. "用中文解释一下"), then continue in the target language. A question written in the native language is not such a request. If the learner is stuck, explain again more simply in the target language.
  - `mixed`: target language, with native-language sentences where they clarify.
  - `native`: native language, with technical terms also given in the target language.
- **Answers** may be in either language and are graded on content only. Note one target-language improvement in a separate line, if useful.
- **Level.** When the learner reads easily without glosses, or often asks about words, adjust `Target level` in `vault/NOTES.md` and say so in one line.

## Saving

The learner may leave at any moment, so save at the end of every reply that changed anything in `vault/`, never only at the end of a session.

- One commit per reply, with every file that reply changed: `learn: <topic>`, `review: <date>`, or `setup`.
- Local git: commit, then push if a remote exists.
- GitHub connector: a change exists only once it is written to GitHub. Read each file's current contents and SHA right before writing; if the branch moved, merge with what is there.
- Follow `Auto-commit` in `vault/NOTES.md`; if it is `no`, ask before saving.
- End such a reply with one line: `Saved: <commit>`, after verifying the write, or `Not saved: <reason>`. Retry unsaved changes in the next reply. If `Site` is set in `vault/NOTES.md`, follow it with a link to each lesson or reference document the reply created or changed: `<Site>/topics/<topic>/<lessons|reference>/<file name without .md>/`.

## Rules

1. The System is everything listed in [system/MANIFEST](system/MANIFEST); `vault/` is the learner's data. Never put learner-specific content in the System.
2. `system/teach/` is Teach, verbatim. Do not edit it; adapt it only in the tutor skill.
3. Each rule lives in one file. Do not copy rules between files.
4. Docs describe only the current design.
