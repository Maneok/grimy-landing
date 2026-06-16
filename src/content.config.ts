import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog collection — articles SEO/GEO produits par la routine de publication.
// Les fichiers vivent dans src/content/blog/*.md
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70, 'title > 70 car. = risque de troncature SERP'),
    description: z.string().min(50).max(160, 'meta description hors plage 50-160'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Équipe GRIMY'),
    tags: z.array(z.string()).default([]),
    // Traçabilité routine GEO ↓
    targetQuery: z.string().optional(), // requête GEO ciblée par l'article
    geoIssue: z.number().optional(), // numéro de l'issue GitHub liée
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
