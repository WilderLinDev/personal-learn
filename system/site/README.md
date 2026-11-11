# Site

The Site is built from the vault with [Astro](https://astro.build). Layouts, components, and styles live here; lessons and reference documents are Markdown in `vault/topics/<topic>/`. Pages contain only front matter, Markdown, and the components below, so every page looks the same.

## Files

- Lesson: `lessons/NNNN-<slug>.md`, numbered from `0001`.
- Reference document: `reference/<slug>.md`.
- Files a topic needs for `::embed`: `assets/`.

## Front matter

Lesson:

```yaml
---
title: Calls and Puts
date: 2026-11-11          # created
updated: 2026-11-20       # optional, last meaningful change
lead: One or two sentences: the single win of this lesson.
minutes: 7                # optional
summary: A short line under the title   # optional
source:                   # the primary source
  title: "SEC: An Introduction to Options"
  url: https://www.investor.gov/…
further:                  # optional
  - title: …
    url: …
---
```

Reference document: `title`, `date`, optional `updated`, `lead`, and `sources` (a list of `title` + `url`). No other fields are allowed.

The Site adds the header, breadcrumbs, lesson number, previous / next links, sources, and the reminder to ask the tutor. Do not write them in the body.

## Body

- Markdown only: paragraphs, `##` and `###` headings, lists, tables, links, `**bold**`, `*italic*`, `` `code` ``, code blocks, `>` quotes, images. Raw HTML fails the build.
- Lesson sections are `##`, numbered `1.`, `2.`, …; the title is never repeated in the body.
- Link to other pages by path: `/topics/<topic>/lessons/<file name without .md>/`.
- Gloss a term on first use: `**separation of powers（权力分立）**`.

## Components

A component is a fenced block: `:::name[optional label]` … `:::`. An outer block that contains another uses one more colon (`::::`). Unknown components fail the build.

| Component | Use | Example |
|---|---|---|
| `key` | The idea to remember; at most two per lesson | `:::key[The core model]` … `:::` |
| `note` | A caveat or aside; sits in the margin on wide screens | `:::note` … `:::` |
| `cards` + `card` | Two to four parallel things; `foot` is optional | `::::cards` › `:::card[Article I]{foot="Can veto bills"}` with `### Title` and text › `::::` |
| `steps` | A procedure or worked example, as a numbered list | `:::steps` › `1. …` › `:::` |
| `stats` | Two to four key numbers, as a list | `:::stats` › `- **58%** had an unfavourable view` › `:::` |
| `terms` | Terms with meanings, as a list | `:::terms` › `- **Strike price（行权价）** The fixed price…` › `:::` |
| `check` | The retrieval question that ends a lesson; label defaults to "Check yourself" | `::::check` › question, `**the question in bold**` › optional `:::answer` … `:::` › `::::` |
| `answer` | Hidden answer inside `check` | `:::answer` … `:::` |
| `embed` | A topic's own interactive file from `assets/` | `::embed{src="simulator.html" title="Option payoff" height="420"}` |

Tables are plain Markdown tables; they scroll on narrow screens.

## Pronunciation

Every lesson and reference document has it; authors add nothing.

- Tap a word: its General American IPA (CMU Pronouncing Dictionary), its gloss if one follows it, and a play button.
- Each paragraph has a play button. Native-language glosses are not read aloud.
- Speech comes from Volcano Engine TTS (`seed-tts-2.0`), called directly from the browser with the reader's own App ID and Access Token, asked for on first use and kept only in that browser's `localStorage`. The reader can choose the system voice instead. Audio is not cached.

## Commands

```bash
npm install
npm run dev     # preview at http://localhost:4321
npm run build   # build into dist/; fails on any rule above
```
