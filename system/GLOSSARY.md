# Personal Learn

## Repository

**System**:
The reusable part of the repository: skills, the Teach method, learning science, scripts, and an empty vault skeleton. Contains nothing about a specific learner.
_Avoid_: Engine, framework

**Vault**:
One learner's data: the north star, global notes, and topics.
_Avoid_: Data folder, personal folder

**Template**:
The public repository containing the System and an empty Vault, with no learner history.

**Instance**:
One learner's repository: the System plus a populated Vault.
_Avoid_: Fork

**Site**:
The published website of an Instance: its topics, lessons, reference documents, timeline, and glossary.
_Avoid_: Website, blog

**Design**:
The one look shared by every page of the Site: its layouts, its fixed set of components, and one stylesheet.
_Avoid_: Style, skin

**Component**:
A named building block a lesson or reference document may use, from the fixed set the Design defines. A page cannot add its own; a Topic's Simulation is the one exception.
_Avoid_: Widget, block, shortcode

**Diagram**:
A Component that shows structure, flow, or relationships as a hand-drawn-style picture, written as text by the tutor.
_Avoid_: Chart, figure, drawing

**Simulation**:
An interactive piece that belongs to one Topic, such as a payoff explorer, shown inside its page in the Design. The only way a page goes beyond the fixed Components.
_Avoid_: Embed, widget, demo

**Theme**:
The learner's own settings on top of the Design, such as the accent colour.

## Learning

**North star**:
The learner's long-term goals across all topics.
_Avoid_: Global mission

**Topic**:
One Teach workspace with its own concrete mission.
_Avoid_: Course, subject, domain

**Review item**:
One retrieval question with its answer, schedule, and log of attempts.
_Avoid_: Flashcard, card

**Mastery**:
How reliably the learner recalls and applies a topic, derived from its Review items, never from self-report. Levels: new, learning, retained, mastered.
_Avoid_: Understood, progress

**Mastery gate**:
The rule that a topic gets no new lesson while it has items never answered correctly or overdue.

**Confidence**:
The learner's rating (guess, unsure, sure) given before answering a Review item. Used to measure calibration, not Mastery.
