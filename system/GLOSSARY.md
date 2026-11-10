# Personal Learn

A reusable, AI-operated system for long-term, cross-disciplinary learning, plus one learner's data that the system operates on.

## Repository boundary

**System**:
The reusable part of the repository: teaching method, agent skill, schemas, and empty scaffolding. Contains nothing specific to one learner.
_Avoid_: Engine, framework, template (when meaning the directory)

**Vault**:
Everything that belongs to one learner: mission, preferences, notes, sessions, and learner model. Replaceable as a unit; the System never hard-codes its contents.
_Avoid_: Data folder, personal folder, learning directory

**Template**:
The public repository that contains the System and an empty Vault skeleton, with no learner history.
_Avoid_: Starter, boilerplate

**Instance**:
One learner's own repository, created from the Template, holding the System plus a populated Vault.
_Avoid_: Fork, personal repo

## Learning content

**Note**:
A durable, learner-independent explanation of knowledge, with sources and verification status. Either a concept (one atomic idea) or a synthesis (connects several concepts into a larger picture).
_Avoid_: Knowledge note, topic, atomic note, card

**Session**:
The record of one substantive learning sitting: what was taught, and how the learner actually performed. Historical and append-only.
_Avoid_: Lesson, learning record, chat

**Review item**:
A single retrieval question with an expected answer, used to test recall of part of a Note.
_Avoid_: Flashcard, quiz, review entry

## Learner state

**Learner model**:
The learner-specific state of what they can recall and apply, kept separately from Notes.
_Avoid_: Mastery metadata, progress

**Verification status**:
How well a Note's claims are supported by sources. Describes the knowledge, never the learner.
_Avoid_: Confidence, accuracy

**Mastery**:
How reliably the learner can recall and apply a Note, derived from the state of its Review items, never from self-report. Levels: new, learning, retained, mastered.
_Avoid_: Familiarity, understanding level, understood

**Confidence**:
The learner's own rating of how sure they are, given before seeing the answer to a Review item. Recorded to measure calibration, not used as evidence of Mastery.
_Avoid_: Self-assessment
