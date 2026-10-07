import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seo = {
  title: z.string(),
  description: z.string(),
  draft: z.boolean().default(false),
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ ...seo, date: z.coerce.date() }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    ...seo,
    client: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    order: z.number().default(100),
  }),
});

const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: z.object({ ...seo, city: z.string(), cityIn: z.string() }),
});

export const collections = { blog, cases, cities };
