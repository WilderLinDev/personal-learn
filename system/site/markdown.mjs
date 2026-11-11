// Markdown components for lessons and reference documents. Authoring guide: system/site/README.md.
// Static components become plain HTML; interactive ones become `data-island` elements that
// islands/mount.ts turns into React components in the browser.

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const BLOCKS = {
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
const LEAVES = ['simulation'];

function walk(node, visit, parent = null, index = 0) {
  visit(node, parent, index);
  (node.children || []).forEach((child, i) => walk(child, visit, node, i));
}

function text(value) {
  return { type: 'text', value };
}

function labelOf(node) {
  const first = node.children?.[0];
  if (first?.type === 'paragraph' && first.data?.directiveLabel) {
    node.children.shift();
    return first.children;
  }
  return null;
}

function fail(file, node, message) {
  file.fail(`${message} See system/site/README.md.`, node);
}

function topicOf(file) {
  return String(file.path || '').match(/vault\/topics\/([^/]+)\//)?.[1] ?? null;
}

function simulation(node, file) {
  const name = node.attributes?.name;
  const topic = topicOf(file);
  if (!name || !/^[a-z0-9-]+$/.test(name) || !topic) {
    fail(file, node, 'simulation needs name="<file in this topic\'s simulations/, without .tsx>".');
  }
  const source = join(dirname(String(file.path)), '..', 'simulations', `${name}.tsx`);
  if (!existsSync(source)) fail(file, node, `Simulation not found: ${source}.`);
  node.data = {
    hName: 'div',
    hProperties: {
      className: ['simulation', 'not-prose'],
      dataIsland: 'simulation',
      dataProps: JSON.stringify({ topic, name, title: node.attributes.title || name }),
    },
  };
  node.children = [];
}

function diagram(node, file) {
  const code = node.children.filter((c) => c.type === 'code');
  if (code.length !== 1 || code[0].lang !== 'mermaid' || node.children.length !== 1) {
    fail(file, node, 'diagram holds exactly one ```mermaid code block.');
  }
  node.children = [
    {
      type: 'diagramSource',
      data: { hName: 'div', hProperties: { className: ['diagram-canvas', 'not-prose'], dataIsland: 'diagram', dataCode: code[0].value } },
      children: [],
    },
  ];
}

// A task list inside `check` is a multiple-choice question: `- [x]` marks a correct option.
function choices(node) {
  walk(node, (child) => {
    if (child.type !== 'list' || !child.children.some((item) => typeof item.checked === 'boolean')) return;
    child.data = { hProperties: { className: ['choices'], dataIsland: 'choice' } };
    for (const item of child.children) {
      item.data = { hProperties: { dataCorrect: String(item.checked === true) } };
      item.checked = null;
    }
  });
}

export function remarkComponents() {
  return (tree, file) => {
    walk(tree, (node, parent, index) => {
      if (node.type === 'html') {
        fail(file, node, 'Raw HTML is not allowed in lessons or reference documents.');
      }
      if (node.type === 'textDirective') {
        const { start, end } = node.position;
        parent.children[index] = text(String(file.value).slice(start.offset, end.offset));
        return;
      }
      if (node.type === 'leafDirective') {
        if (!LEAVES.includes(node.name)) fail(file, node, `Unknown component "::${node.name}".`);
        simulation(node, file);
        return;
      }
      if (node.type !== 'containerDirective') return;
      const spec = BLOCKS[node.name];
      if (!spec) fail(file, node, `Unknown component ":::${node.name}".`);
      const label = labelOf(node);
      const attrs = node.attributes || {};
      if (node.name === 'diagram') diagram(node, file);
      if (node.name === 'check') choices(node);
      if (spec.label && label) {
        node.children.unshift({ type: 'paragraph', data: { hProperties: { className: ['component-label'] } }, children: label });
      }
      if (spec.heading) {
        node.children.unshift({ type: 'heading', depth: 2, children: label || [text(spec.heading)] });
      }
      if (spec.summary) {
        node.children.unshift({ type: 'paragraph', data: { hName: 'summary' }, children: label || [text(spec.summary)] });
      }
      if (node.name === 'diagram' && label) {
        node.children.push({ type: 'paragraph', data: { hName: 'figcaption' }, children: label });
      }
      if (node.name === 'card' && attrs.foot) {
        node.children.push({ type: 'paragraph', data: { hProperties: { className: ['foot'] } }, children: [text(attrs.foot)] });
      }
      node.data = { hName: spec.tag, hProperties: { className: [spec.className] } };
    });
  };
}

export function rehypeTables() {
  return (tree) => {
    walk(tree, (node, parent, index) => {
      if (node.type === 'element' && node.tagName === 'table' && !(parent?.properties?.className || []).includes('table-scroll')) {
        parent.children[index] = { type: 'element', tagName: 'div', properties: { className: ['table-scroll'] }, children: [node] };
      }
    });
  };
}
