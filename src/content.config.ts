import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per post, one file per language: hello-world/en.md, hello-world/it.md
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '*/{en,it}.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
