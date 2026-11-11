import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topics = './vault/topics';
const link = z.strictObject({ title: z.string(), url: z.url() });
const common = {
  title: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  lead: z.string(),
};

export const collections = {
  lessons: defineCollection({
    loader: glob({ base: topics, pattern: '*/lessons/*.md' }),
    schema: z.strictObject({
      ...common,
      minutes: z.number().int().positive().optional(),
      summary: z.string().optional(),
      source: link,
      further: z.array(link).optional(),
    }),
  }),
  reference: defineCollection({
    loader: glob({ base: topics, pattern: '*/reference/*.md' }),
    schema: z.strictObject({ ...common, sources: z.array(link).min(1) }),
  }),
  missions: defineCollection({ loader: glob({ base: topics, pattern: '*/MISSION.md' }) }),
  glossaries: defineCollection({ loader: glob({ base: topics, pattern: '*/GLOSSARY.md' }) }),
};
