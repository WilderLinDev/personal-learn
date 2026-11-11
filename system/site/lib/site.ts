import { getCollection, type CollectionEntry } from 'astro:content';
import { parseGlossary, parseMission } from './topic-files';

export type Kind = 'lessons' | 'reference';
export type Page = { [K in Kind]: PageOf<K> }[Kind];
export type Lesson = PageOf<'lessons'>;
export interface PageOf<K extends Kind> {
  kind: K;
  topic: string;
  slug: string;
  /** The lesson number from the file name (`0002-calls-and-puts` → 2); 0 for reference documents. */
  number: number;
  url: string;
  entry: CollectionEntry<K>;
  data: CollectionEntry<K>['data'];
}
export interface Topic {
  slug: string;
  title: string;
  why: string;
  lessons: Lesson[];
  reference: PageOf<'reference'>[];
}

/** Entry ids are `<topic>/<kind>/<file name>`, or `<topic>/<FILE>` for topic files. */
const topicOf = (entry: { id: string }) => entry.id.split('/')[0] ?? '';

function toPage<K extends Kind>(kind: K, entry: CollectionEntry<K>): PageOf<K> {
  const topic = topicOf(entry);
  const slug = entry.id.split('/').at(-1) ?? entry.id;
  return {
    kind,
    topic,
    slug,
    number: Number.parseInt(slug, 10) || 0,
    url: `/topics/${topic}/${kind}/${slug}/`,
    entry,
    data: entry.data,
  };
}

export const lastChange = (p: Page) => p.data.updated ?? p.data.date;
const byNumber = (a: Page, b: Page) => a.number - b.number || a.slug.localeCompare(b.slug);
const newestFirst = (a: Page, b: Page) =>
  lastChange(b).getTime() - lastChange(a).getTime() ||
  (a.kind === b.kind ? b.number - a.number : a.kind === 'lessons' ? -1 : 1);

export async function loadSite() {
  const lessons = (await getCollection('lessons')).map((e) => toPage('lessons', e));
  const reference = (await getCollection('reference')).map((e) => toPage('reference', e));
  const missions = Map.groupBy(await getCollection('missions'), topicOf);
  const glossaries = Map.groupBy(await getCollection('glossaries'), topicOf);
  const lessonsBy = Map.groupBy(lessons, (p) => p.topic);
  const referenceBy = Map.groupBy(reference, (p) => p.topic);
  const slugs = new Set([...missions.keys(), ...lessonsBy.keys(), ...referenceBy.keys()]);
  const topics: Topic[] = [...slugs]
    .map((slug) => ({
      slug,
      ...parseMission(missions.get(slug)?.[0]?.body ?? '', slug),
      lessons: (lessonsBy.get(slug) ?? []).sort(byNumber),
      reference: (referenceBy.get(slug) ?? []).sort(byNumber),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
  const bySlug = new Map(topics.map((t) => [t.slug, t]));
  return {
    topics,
    timeline: [...lessons, ...reference].sort(newestFirst),
    topic: (slug: string) => {
      const topic = bySlug.get(slug);
      if (!topic) throw new Error(`No topic ${slug}`);
      return topic;
    },
    glossary: (slug: string) => parseGlossary(glossaries.get(slug)?.[0]?.body ?? ''),
  };
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => dateFormat.format(d);
export const formatDay = (d: Date) => dayFormat.format(d);
export const formatMonth = (d: Date) => monthFormat.format(d);
export const kindLabel = (p: Page) =>
  p.kind === 'lessons' ? `Lesson ${String(p.number).padStart(2, '0')}` : 'Reference';
