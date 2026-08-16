import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(["active", "experimental", "archived", "private-context"]),
    kind: z.string(),
    stack: z.array(z.string()),
    site: z.string().url().optional(),
    siteLabel: z.string().optional(),
    repo: z.string().url().optional(),
    relatedProjects: z
      .array(
        z.object({
          slug: z.string(),
          note: z.string(),
        }),
      )
      .default([]),
    featured: z.boolean().default(false),
    order: z.number().int(),
  }),
});

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
  // image() puts the file through the asset pipeline (hashing, WebP/AVIF,
  // srcset) instead of leaving it a raw string path. Optional because the
  // three posts written before this existed have no hero.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      publishedAt: z.coerce.date(),
      readingMinutes: z.number().int().positive(),
      tags: z.array(z.string()).default([]),
      relatedProjects: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      heroImage: image().optional(),
      // Required alongside the image, not globally: a hero with no alt text is a
      // decorative image, and this one carries the argument of the post.
      heroImageAlt: z.string().optional(),
    }),
});

export const collections = { projects, posts };
