// Reads the Teach files of a Topic (system/teach/) for the Site. Their formats belong to Teach.
import type { RootContent } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';

export interface Term {
  term: string;
  definition: string;
  avoid?: string;
}
export interface TermGroup {
  group: string;
  terms: Term[];
}

const isHeading = (node: RootContent, depth: number) => node.type === 'heading' && node.depth === depth;

/** Title and Why of a MISSION.md (system/teach/MISSION-FORMAT.md). */
export function parseMission(body: string, slug: string) {
  const nodes = fromMarkdown(body).children;
  const title = nodes.find((n) => isHeading(n, 1));
  const why = nodes.findIndex((n) => isHeading(n, 2) && toString(n).trim() === 'Why');
  const next = nodes[why + 1];
  return {
    title: title ? toString(title).replace(/^Mission:\s*/, '') : slug,
    why: why >= 0 && next?.type === 'paragraph' ? toString(next) : '',
  };
}

/** Terms of a GLOSSARY.md (system/teach/GLOSSARY-FORMAT.md), grouped by `##` heading; `## Terms` is no group. */
export function parseGlossary(body: string): TermGroup[] {
  const groups: TermGroup[] = [];
  let current: TermGroup = { group: '', terms: [] };
  for (const node of fromMarkdown(body).children) {
    if (isHeading(node, 2)) {
      const name = toString(node).trim();
      current = { group: name === 'Terms' ? '' : name, terms: [] };
      groups.push(current);
    }
    if (node.type !== 'paragraph' || node.children[0]?.type !== 'strong') continue;
    const [strong, ...rest] = node.children;
    const avoidAt = rest.findIndex((c) => c.type === 'emphasis' && toString(c) === 'Avoid');
    const definition = avoidAt < 0 ? rest : rest.slice(0, avoidAt);
    const avoid =
      avoidAt < 0
        ? ''
        : toString(rest.slice(avoidAt + 1))
            .replace(/^:\s*/, '')
            .trim();
    current.terms.push({
      term: toString(strong).replace(/:$/, ''),
      definition: toString(definition).replace(/^:\s*/, '').trim(),
      avoid: avoid ? avoid : undefined,
    });
    if (!groups.includes(current)) groups.push(current);
  }
  return groups.filter((g) => g.terms.length > 0);
}
