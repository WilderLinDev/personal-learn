import { getCollection, type CollectionEntry } from 'astro:content';

export type Kind = 'lessons' | 'reference';
export type Page = {
  kind: Kind;
  topic: string;
  slug: string;
  number: number;
  url: string;
  title: string;
  lead: string;
  date: Date;
  updated?: Date;
  entry: CollectionEntry<'lessons'> | CollectionEntry<'reference'>;
};
export type Topic = { slug: string; title: string; why: string; lessons: Page[]; reference: Page[] };
export type Term = { term: string; definition: string; avoid?: string };

const split = (id: string) => {
  const [topic, , file] = id.split('/');
  return { topic, slug: file };
};

const toPage = (kind: Kind) => (entry: CollectionEntry<'lessons'> | CollectionEntry<'reference'>): Page => {
  const { topic, slug } = split(entry.id);
  return {
    kind,
    topic,
    slug,
    number: Number.parseInt(slug, 10) || 0,
    url: `/topics/${topic}/${kind}/${slug}/`,
    title: entry.data.title,
    lead: entry.data.lead,
    date: entry.data.date,
    updated: entry.data.updated,
    entry,
  };
};

export const lastChange = (p: Page) => p.updated ?? p.date;
const byNumber = (a: Page, b: Page) => a.number - b.number || a.slug.localeCompare(b.slug);
const newestFirst = (a: Page, b: Page) =>
  lastChange(b).getTime() - lastChange(a).getTime() || (a.kind === b.kind ? b.number - a.number : a.kind === 'lessons' ? -1 : 1);

function parseMission(body: string, slug: string) {
  const title = body.match(/^# (?:Mission:\s*)?(.+)$/m)?.[1]?.trim() ?? slug;
  const why = body.match(/^## Why\s*\n+([\s\S]+?)(?:\n\s*\n|\n#|$)/m)?.[1]?.trim() ?? '';
  return { title, why };
}

export async function loadSite() {
  const lessons = (await getCollection('lessons')).map(toPage('lessons'));
  const reference = (await getCollection('reference')).map(toPage('reference'));
  const missions = await getCollection('missions');
  const slugs = [...new Set([...missions.map((m) => m.id.split('/')[0]), ...lessons.map((p) => p.topic), ...reference.map((p) => p.topic)])];
  const topics: Topic[] = slugs
    .map((slug) => {
      const mission = missions.find((m) => m.id.split('/')[0] === slug);
      return {
        slug,
        ...parseMission(mission?.body ?? '', slug),
        lessons: lessons.filter((p) => p.topic === slug).sort(byNumber),
        reference: reference.filter((p) => p.topic === slug).sort(byNumber),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
  const timeline = [...lessons, ...reference].sort(newestFirst);
  return { topics, timeline, topic: (slug: string) => topics.find((t) => t.slug === slug)! };
}

export function parseGlossary(body: string): { group: string; terms: Term[] }[] {
  const groups: { group: string; terms: Term[] }[] = [];
  let current = { group: '', terms: [] as Term[] };
  for (const block of body.split(/\n\s*\n/)) {
    const heading = block.match(/^##\s+(.+)$/m);
    if (heading && !block.includes('**')) {
      if (current.terms.length) groups.push(current);
      current = { group: heading[1].trim() === 'Terms' ? '' : heading[1].trim(), terms: [] };
      continue;
    }
    const term = block.match(/^\*\*(.+?)\*\*:?\s*\n([\s\S]+?)(?:\n_Avoid_:\s*(.+))?\s*$/);
    if (term) current.terms.push({ term: term[1].replace(/:$/, ''), definition: term[2].trim(), avoid: term[3]?.trim() });
  }
  if (current.terms.length) groups.push(current);
  return groups;
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => dateFormat.format(d);
export const formatMonth = (d: Date) => monthFormat.format(d);
export const kindLabel = (p: Page) => (p.kind === 'lessons' ? `Lesson ${String(p.number).padStart(2, '0')}` : 'Reference');

export function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups: { key: string; items: T[] }[] = [];
  for (const item of items) {
    const k = key(item);
    const last = groups.at(-1);
    if (last?.key === k) last.items.push(item);
    else groups.push({ key: k, items: [item] });
  }
  return groups;
}
