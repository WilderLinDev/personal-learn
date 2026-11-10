# Learning Science

Why the tutor works the way it does. The base method is [Teach](teach/SKILL.md), which already calls for retrieval practice, spacing, interleaving, and tight feedback loops; this document gives the evidence for those principles and for the tutor's additions. Only methods with strong, replicated evidence are part of the default protocol. Everything else is either situational or excluded.

Sources were accessed on 2026-11-11. Effect sizes marked † were taken from abstracts or secondary summaries, not checked against the full text.

## Core rules (every session)

### 1. Retrieve; don't reread
Answering from memory produces more durable learning than rereading the same material.
- Dunlosky et al. (2013) rated ten common techniques; only practice testing and distributed practice received "high utility". Rereading, highlighting, and summarising were rated low. [APS summary](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html)
- Adesope, Trevisan & Sundararajan (2017), meta-analysis of practice testing: g ≈ 0.70 †, robust in lab and classroom. [DOI 10.3102/0034654316689306](https://journals.sagepub.com/doi/10.3102/0034654316689306)
- Yang et al. (2021), 222 classroom studies, ~48,000 students: g ≈ 0.50 overall, ≈ 0.33 versus restudying †. [Psychological Bulletin 147(4)](https://scholars.hkbu.edu.hk/en/publications/testing-quizzing-boosts-classroom-learning-a-systematic-and-meta-/)

### 2. Space it out; too long beats too short
- Cepeda et al. (2008), >1,350 participants: the best gap between sessions grows with how long you want to remember; a gap that is too short hurts more than one that is too long. [PubMed 19076480](https://pubmed.ncbi.nlm.nih.gov/19076480/)
- Implementation: expanding intervals (see the skill's scheduling table).

### 3. Relearn to criterion
Practise until each item is recalled correctly once in a session, then do so again in later spaced sessions ("successive relearning").
- Rawson, Dunlosky & Sciartelli (2013) and later studies show large gains in long-term retention and course exams. Most evidence is from controlled studies. [Review, Educ. Psych. Review 2023](https://link.springer.com/content/pdf/10.1007/s10648-023-09809-2.pdf)

### 4. Give corrective feedback, with the reason
- Wisniewski, Zierer & Hattie (2020), 435 studies: average d ≈ 0.48, with high variation; corrective, information-rich feedback is most effective; praise and rewards are weak. [Frontiers in Psychology 10:3087](https://pmc.ncbi.nlm.nih.gov/articles/PMC6987456)
- Hypercorrection: errors made with high confidence are more likely to be corrected after feedback (Butterfield & Metcalfe, 2001, replicated). This is why confidence is asked before each answer. [Review](https://pmc.ncbi.nlm.nih.gov/articles/PMC4084803)

### 5. The learner generates; the AI guides
- Bisra et al. (2018), self-explanation meta-analysis, 64 reports: g ≈ 0.55 †. [SFU record](https://summit.sfu.ca/item/34322)
- Bastani et al. (2025, PNAS), ~1,000 high-school students: an unrestricted GPT-4 helper improved practice scores but lowered later test scores by 17% once removed; a tutor that gave hints instead of answers largely avoided the harm. [PNAS 122](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html)
- Kestin et al. (2025), RCT with 194 physics students: a carefully structured AI tutor produced larger gains than in-class active learning (small, narrow study). [Scientific Reports](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)

## Situational rules

### Worked examples, then fading
Novices learn procedures better from complete worked examples; for more knowledgeable learners the same examples become useless or harmful (expertise reversal; Kalyuga et al., 2003; Kalyuga, 2007). Remove steps as competence grows. [Overview](https://en.wikipedia.org/wiki/Expertise_reversal_effect)

### Interleave only confusable things
Brunmair & Richter (2019), 59 studies: interleaving helps on average (g ≈ 0.42), most for similar, easily confused categories; when items differ a lot, blocked practice can be better. [Meta-analysis PDF](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)

## Deliberately excluded

| Idea | Why it is not in the protocol |
|---|---|
| Pre-questions before teaching | Helps only the exact questions asked (g ≈ 0.54) and barely transfers to other content (g ≈ 0.04) — St. Hilaire, Chan & Ahn (2023). [Summary](https://www.bohrium.com/paper-details/guessing-as-a-learning-intervention-a-meta-analytic-review-of-the-prequestion-effect/903820706179973241-12382) |
| Rereading, highlighting, summarising as study | Low utility (Dunlosky et al., 2013). |
| Matching teaching to "learning styles" | No adequate evidence (Pashler et al., 2008). [PubMed 26162104](https://pubmed.ncbi.nlm.nih.gov/26162104/) |
| Self-rated mastery | Feeling fluent right after study is a poor predictor of later recall; judgments made after a delay are far more accurate (Nelson & Dunlosky, 1991; Bjork & Bjork's storage vs. retrieval strength). Mastery is therefore derived from spaced recall, and confidence is recorded only at review time. [Bjork & Bjork 2020](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2021/01/RABjorkELBjorkJARMAC2020ForPostingSingleSpaced.pdf) |

## Scheduling choice

The scheduler is a simple multiplier rule without a per-item ease factor, so any AI can apply it by hand without errors. Every review is logged (date, confidence, grade). Once enough logs exist, the rule can be replaced by FSRS, which predicts recall better than SM-2 for about 99.6% of ~10,000 Anki collections in an open benchmark. [Benchmark](https://expertium.github.io/Benchmark.html)

## Changing this document

Add a method to the core rules only if it is supported by at least one meta-analysis or a replicated large study, and it can be applied without extra tooling. Record the source and access date.
