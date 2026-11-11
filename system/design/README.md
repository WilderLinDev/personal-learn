# Design

Every lesson and reference document uses this design, so all topics read as one course.

- Start from [templates/lesson.html](templates/lesson.html) or [templates/reference.html](templates/reference.html). Keep the `<head>` links, masthead, and colophon.
- Style only with [learn.css](learn.css), the learner's `vault/theme.css`, and, for components that only one topic needs, that topic's `assets/`. No `<style>` blocks or `style` attributes.
- Plain HTML is already styled: headings, paragraphs, lists, links, `blockquote`, `code`, `pre`, `figure`, `figcaption`, `details`.
- One `h1`. Lesson sections are `h2`, numbered `1.`, `2.`, …
- A glossed term: `<strong>separation of powers（权力分立）</strong>` on first use.

## Components

| Component | Markup | Use |
|---|---|---|
| Masthead | `header.masthead` › `p.kicker`, `h1`, `p.lead`, `p.meta` | Top of every page |
| Key idea | `div.key` › `p.label`, content | The idea to remember; at most two per lesson |
| Note | `p.note` or `aside.note` | Caveats and asides; moves to the margin on wide screens |
| Cards | `div.cards` › `section.card` › optional `p.label`, `h3`, `p`, optional `p.foot` | Two to four parallel things |
| Table | `div.table` › `table` | Any table; scrolls on narrow screens |
| Steps | `ol.steps` | Procedures, methods, worked examples |
| Stats | `div.stats` › `div.stat` › `strong`, `span` | Two to four key numbers with their source in the text |
| Terms | `dl.terms` › `dt`, `dd` | A list of terms with meanings |
| Check yourself | `section.check` › `h2`, `p`, `p.q`, optional `details` › `summary`, answer | The retrieval question at the end of a lesson |
| Colophon | `footer.colophon` › `section.source`, `nav.pager`, `p.ask` | Primary source, links to other lessons and reference, the reminder to ask the tutor |

`body.reference` makes a reference document denser and print-ready.
