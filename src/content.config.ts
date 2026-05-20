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

export const collections = { projects };
