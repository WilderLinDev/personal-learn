# ChatGPT Teach Integration

## Teach workspace model
The Teach skill defines a stateful teaching workspace with MISSION.md, RESOURCES.md, NOTES.md, lessons/*.html, reference/*.html, learning-records/*.md, and assets/*. This repository keeps those paths and adds a canonical Markdown knowledge layer.

## Important boundary
Teach's "current directory" is the active teaching workspace. It does not automatically mean that this remote GitHub repository is mounted as a local filesystem.

When Teach runs in ChatGPT:
1. Read the remote repository using the connected GitHub capability.
2. Use its mission, notes, resources, and learning records to ground the lesson.
3. Create or update artifacts in the remote repository through GitHub operations.
4. Verify the resulting commit and files.

Do not write only to a transient local workspace and assume it was synchronized.

## Mapping
| Teach concept | Repository location |
|---|---|
| Mission | MISSION.md |
| Resources | RESOURCES.md |
| Learner preferences | NOTES.md |
| Lessons | lessons/*.html |
| References | reference/*.html |
| Learning records | learning-records/*.md |
| Reusable assets | assets/* |
| Atomic knowledge | knowledge/<domain>/*.md |
| Topic syntheses | topics/*.md |
| Review state | Note frontmatter and reviews/QUEUE.md |

## Save behavior
At the end of a substantive lesson or intentional pause, follow docs/AI-WORKFLOW.md. Create a lesson and learning record, then update other artifacts only when warranted.

If GitHub cannot write in the current ChatGPT session, report that the lesson is not yet saved. Do not claim the Teach workspace is a durable backup.
