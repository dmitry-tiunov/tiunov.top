import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seo = {
  title: z.string(),
  description: z.string(),
  draft: z.boolean().default(false),
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ ...seo, date: z.coerce.date(), cover: z.string().optional() }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    ...seo,
    client: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    order: z.number().default(100),
    isNew: z.boolean().default(false),
    cover: z.string().optional(),
    gallery: z.array(z.string()).default([]),
  }),
});

const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: z.object({ ...seo, city: z.string(), cityIn: z.string() }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    ...seo,
    name: z.string(),
    label: z.string(),
    h1: z.string(),
    lead: z.string(),
    price: z.number(),
    priceText: z.string(),
    term: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    includes: z.array(z.string()).default([]),
    packages: z.array(z.string()).default([]),
    cases: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    order: z.number().default(100),
  }),
});

export const collections = { blog, cases, cities, services };
