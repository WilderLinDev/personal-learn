// Markdown Components for lessons and reference documents. Authoring guide: system/site/README.md.
// Static Components become plain HTML; interactive ones become `data-island` elements that
// islands/mount.tsx turns into React components in the browser.

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Element, Root as HastRoot } from 'hast';
import type { Paragraph, PhrasingContent, Root, RootContent } from 'mdast';
import type { ContainerDirective, LeafDirective } from 'mdast-util-directive';
import { SKIP, visit } from 'unist-util-visit';
import type {} from 'mdast-util-to-hast';
import type { VFile } from 'vfile';

interface Block {
  tag: string;
  className: string;
  /** The label is shown as a caption line inside the block. */
  label?: boolean;
  /** The label, or this default, becomes the block's heading. */
  heading?: string;
  /** The label, or this default, becomes the `<summary>` of a `<details>`. */
  summary?: string;
}

const BLOCKS: Record<string, Block> = {
  key: { tag: 'div', className: 'key', label: true },
  note: { tag: 'aside', className: 'note' },
  cards: { tag: 'div', className: 'cards' },
  card: { tag: 'section', className: 'card', label: true },
  steps: { tag: 'div', className: 'steps' },
  stats: { tag: 'div', className: 'stats' },
  terms: { tag: 'div', className: 'terms' },
  check: { tag: 'section', className: 'check', heading: 'Check yourself' },
  answer: { tag: 'details', className: 'answer', summary: 'Show answer' },
  diagram: { tag: 'figure', className: 'diagram' },
};

function fail(file: VFile, node: RootContent, message: string): never {
  file.fail(`${message} See system/site/README.md.`, node);
}

function paragraph(children: PhrasingContent[], data: Paragraph['data']): Paragraph {
  return { type: 'paragraph', data, children };
}

/** Removes and returns the `[label]` of a container directive. */
function takeLabel(node: ContainerDirective): PhrasingContent[] | undefined {
  const [first] = node.children;
  if (first?.type !== 'paragraph' || !first.data?.directiveLabel) return undefined;
  node.children.shift();
  return first.children;
}

function simulation(node: LeafDirective, file: VFile) {
  const name = node.attributes?.name;
  const topic = /vault\/topics\/([^/]+)\//.exec(file.path)?.[1];
  if (!name || !/^[a-z0-9-]+$/.test(name) || !topic) {
    fail(file, node, 'simulation needs name="<file in this topic\'s simulations/, without .tsx>".');
  }
  const source = join(dirname(file.path), '..', 'simulations', `${name}.tsx`);
  if (!existsSync(source)) fail(file, node, `Simulation not found: ${source}.`);
  node.data = {
    hName: 'div',
    hProperties: {
      className: ['simulation', 'not-prose'],
      dataIsland: 'simulation',
      dataProps: JSON.stringify({ topic, name, title: node.attributes?.title ?? name }),
    },
  };
  node.children = [];
}

function diagram(node: ContainerDirective, file: VFile) {
  const [code] = node.children;
  if (node.children.length !== 1 || code?.type !== 'code' || code.lang !== 'mermaid') {
    fail(file, node, 'diagram holds exactly one ```mermaid code block.');
  }
  node.children = [
    paragraph([], {
      hName: 'div',
      hProperties: { className: ['diagram-canvas', 'not-prose'], dataIsland: 'diagram', dataCode: code.value },
    }),
  ];
}

/** A task list inside `check` is a multiple-choice question: `- [x]` marks a correct option. */
function choices(node: ContainerDirective) {
  visit(node, 'list', (list) => {
    if (!list.children.some((item) => typeof item.checked === 'boolean')) return;
    list.data = { hProperties: { className: ['choices'], dataIsland: 'choice' } };
    for (const item of list.children) {
      item.data = { hProperties: { dataCorrect: String(item.checked === true) } };
      item.checked = null;
    }
  });
}

function container(node: ContainerDirective, file: VFile) {
  const spec = BLOCKS[node.name];
  if (!spec) fail(file, node, `Unknown component ":::${node.name}".`);
  const label = takeLabel(node);
  if (node.name === 'diagram') diagram(node, file);
  if (node.name === 'check') choices(node);
  if (spec.label && label) {
    node.children.unshift(paragraph(label, { hProperties: { className: ['component-label'] } }));
  }
  if (spec.heading) {
    node.children.unshift({ type: 'heading', depth: 2, children: label ?? [{ type: 'text', value: spec.heading }] });
  }
  if (spec.summary) {
    node.children.unshift(paragraph(label ?? [{ type: 'text', value: spec.summary }], { hName: 'summary' }));
  }
  if (node.name === 'diagram' && label) node.children.push(paragraph(label, { hName: 'figcaption' }));
  const foot = node.attributes?.foot;
  if (node.name === 'card' && foot) {
    node.children.push(paragraph([{ type: 'text', value: foot }], { hProperties: { className: ['foot'] } }));
  }
  node.data = { hName: spec.tag, hProperties: { className: [spec.className] } };
}

export function remarkComponents() {
  return (tree: Root, file: VFile) => {
    visit(tree, (node, index, parent) => {
      switch (node.type) {
        case 'html':
          return fail(file, node, 'Raw HTML is not allowed in lessons or reference documents.');
        case 'textDirective': {
          // `:word` in prose is text, not a directive.
          if (!parent || index === undefined || !node.position) return;
          const { start, end } = node.position;
          parent.children[index] = { type: 'text', value: String(file.value).slice(start.offset, end.offset) };
          return SKIP;
        }
        case 'leafDirective':
          if (node.name !== 'simulation') fail(file, node, `Unknown component "::${node.name}".`);
          simulation(node, file);
          return SKIP;
        case 'containerDirective':
          container(node, file);
          return;
      }
    });
  };
}

/** Wraps every table so it scrolls on narrow screens. */
export function rehypeTables() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return;
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [node],
      };
      parent.children[index] = wrapper;
      return SKIP;
    });
  };
}
