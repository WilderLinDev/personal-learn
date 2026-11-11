import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { describe, expect, it } from 'vitest';
import { rehypeTables, remarkComponents } from './markdown';

const render = (value: string, path = 'vault/topics/demo/lessons/0001-demo.md') =>
  String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkComponents)
      .use(remarkRehype)
      .use(rehypeTables)
      .use(rehypeStringify)
      .processSync(new VFile({ value, path })),
  );

describe('remarkComponents', () => {
  it('renders a labelled key block', () => {
    expect(render(':::key[The core model]\nText.\n:::')).toBe(
      '<div class="key"><p class="component-label">The core model</p><p>Text.</p></div>',
    );
  });

  it('gives check a default heading and answer a summary', () => {
    expect(render('::::check\n**Q?**\n\n:::answer\nA.\n:::\n::::')).toBe(
      '<section class="check"><h2>Check yourself</h2><p><strong>Q?</strong></p>' +
        '<details class="answer"><summary>Show answer</summary><p>A.</p></details></section>',
    );
  });

  it('turns a task list inside check into a choice island', () => {
    const html = render('::::check\n- [ ] No\n- [x] Yes\n::::');
    expect(html).toContain('<ul class="choices" data-island="choice">');
    expect(html).toContain('<li data-correct="false">No</li>');
    expect(html).toContain('<li data-correct="true">Yes</li>');
  });

  it('turns a diagram into an island with its Mermaid source and caption', () => {
    const html = render(':::diagram[Flow]\n```mermaid\nflowchart TD\n  A --> B\n```\n:::');
    expect(html).toBe(
      '<figure class="diagram"><div class="diagram-canvas not-prose" data-island="diagram" ' +
        'data-code="flowchart TD\n  A --> B"></div><figcaption>Flow</figcaption></figure>',
    );
  });

  it('adds a card foot', () => {
    expect(render(':::card[Article I]{foot="Can veto"}\nText.\n:::')).toContain('<p class="foot">Can veto</p>');
  });

  it('keeps `:word` in prose as text', () => {
    expect(render('Ratio 3:1 and a:b.')).toBe('<p>Ratio 3:1 and a:b.</p>');
  });

  it.each([
    ['raw HTML', '<b>bold</b>', 'Raw HTML is not allowed'],
    ['an unknown container', ':::widget\nx\n:::', 'Unknown component ":::widget"'],
    ['an unknown leaf', '::widget', 'Unknown component "::widget"'],
    ['a diagram without Mermaid', ':::diagram\ntext\n:::', 'exactly one ```mermaid'],
    ['a missing simulation', '::simulation{name="nope"}', 'Simulation not found'],
  ])('fails the build on %s', (_, source, message) => {
    expect(() => render(source)).toThrow(message);
  });
});

describe('rehypeTables', () => {
  it('wraps tables so they scroll', () => {
    expect(render('| a |\n|---|\n| 1 |')).toMatch(/^<div class="table-scroll"><table>/);
  });
});
