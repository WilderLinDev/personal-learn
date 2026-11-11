// Markdown components for lessons and reference documents. Authoring guide: system/site/README.md.

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
};
const LEAVES = ['embed'];

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
  const match = String(file.path || '').match(/vault\/topics\/([^/]+)\//);
  return match ? match[1] : null;
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
        const src = node.attributes?.src;
        const topic = topicOf(file);
        if (!src || !topic || src.includes('/')) fail(file, node, 'embed needs src="<file in this topic\'s assets/>".');
        node.data = {
          hName: 'iframe',
          hProperties: {
            className: ['embed'],
            src: `/topics/${topic}/assets/${src}`,
            title: node.attributes.title || src,
            height: node.attributes.height || '420',
            loading: 'lazy',
          },
        };
        node.children = [];
        return;
      }
      if (node.type !== 'containerDirective') return;
      const spec = BLOCKS[node.name];
      if (!spec) fail(file, node, `Unknown component ":::${node.name}".`);
      const label = labelOf(node);
      const attrs = node.attributes || {};
      if (spec.label && label) {
        node.children.unshift({ type: 'paragraph', data: { hProperties: { className: ['label'] } }, children: label });
      }
      if (spec.heading) {
        node.children.unshift({ type: 'heading', depth: 2, children: label || [text(spec.heading)] });
      }
      if (spec.summary) {
        node.children.unshift({ type: 'paragraph', data: { hName: 'summary' }, children: label || [text(spec.summary)] });
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
      if (node.type === 'element' && node.tagName === 'table' && !(parent?.properties?.className || []).includes('table')) {
        parent.children[index] = { type: 'element', tagName: 'div', properties: { className: ['table'] }, children: [node] };
      }
    });
  };
}
