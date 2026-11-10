# Personal Learn

The repository's own terms. A learner's topic glossary lives in `vault/GLOSSARY.md` and follows Teach's glossary format.

## Repository boundary

**System**:
The reusable part of the repository: the tutor skill, the Teach method, learning science, schemas, and an empty vault skeleton. Contains nothing specific to one learner.
_Avoid_: Engine, framework

**Vault**:
One learner's Teach workspace: mission, notes, resources, glossary, lessons, reference documents, learning records, and review items. Replaceable as a unit; the System never hard-codes its contents.
_Avoid_: Data folder, personal folder, workspace (when meaning the directory in this repository)

**Template**:
The public repository that contains the System and an empty Vault skeleton, with no learner history.
_Avoid_: Starter, boilerplate

**Instance**:
One learner's own repository, created from the Template, holding the System plus a populated Vault.
_Avoid_: Fork, personal repo

**Teach**:
The base teaching method, kept verbatim in `system/teach/`. The tutor skill adds to it but changes it only where necessary.
_Avoid_: Teach plugin (when meaning the method)

## Learner state

**Review item**:
A single retrieval question with an expected answer and a log of every attempt, used to schedule spaced review of one topic.
_Avoid_: Flashcard, quiz question

**Mastery**:
How reliably the learner can recall and apply a topic, derived from the state of its Review items, never from self-report or coverage. Levels: new, learning, retained, mastered.
_Avoid_: Familiarity, understanding level, understood

**Confidence**:
The learner's own rating of how sure they are, given before seeing the answer to a Review item. Recorded to measure calibration, not used as evidence of Mastery.
_Avoid_: Self-assessment
