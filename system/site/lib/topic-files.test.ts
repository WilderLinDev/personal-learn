import { describe, expect, it } from 'vitest';
import { parseGlossary, parseMission } from './topic-files';

describe('parseMission', () => {
  it('reads the title and the Why paragraph', () => {
    const body =
      '# Mission: Understand Options\n\n## Why\nRead option quotes\nwithout guessing.\n\n## Success looks like\n- One\n';
    expect(parseMission(body, 'options')).toEqual({
      title: 'Understand Options',
      why: 'Read option quotes\nwithout guessing.',
    });
  });

  it('falls back to the slug when there is no mission', () => {
    expect(parseMission('', 'options')).toEqual({ title: 'options', why: '' });
  });
});

describe('parseGlossary', () => {
  it('reads terms, definitions, and aliases to avoid', () => {
    const body = [
      '# Fitness Glossary',
      '',
      'Terms for training.',
      '',
      '## Terms',
      '',
      '**Hypertrophy**:',
      'Muscle growth driven by **mechanical tension**.',
      '_Avoid_: Bulking, getting big',
      '',
      '**RPE (Rate of Perceived Exertion)**:',
      'A 1–10 self-rating of how hard a set felt.',
    ].join('\n');
    expect(parseGlossary(body)).toEqual([
      {
        group: '',
        terms: [
          {
            term: 'Hypertrophy',
            definition: 'Muscle growth driven by mechanical tension.',
            avoid: 'Bulking, getting big',
          },
          {
            term: 'RPE (Rate of Perceived Exertion)',
            definition: 'A 1–10 self-rating of how hard a set felt.',
            avoid: undefined,
          },
        ],
      },
    ]);
  });

  it('groups terms under subheadings and drops empty groups', () => {
    const body = '## Anatomy\n\n**Muscle**:\nTissue.\n\n## Programming\n\nNo terms yet.\n';
    expect(parseGlossary(body)).toEqual([
      { group: 'Anatomy', terms: [{ term: 'Muscle', definition: 'Tissue.', avoid: undefined }] },
    ]);
  });
});
