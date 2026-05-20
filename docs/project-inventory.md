# Project Inventory

This file is a human-readable mirror of the Astro project content collection.
The source of truth for rendered pages lives in `src/content/projects/*.md`.

## Featured

- MDS
- World Interpreter Engine
- HomeLog
- WireMesh
- DreamFlow

## Current Site Shape

- `/` is the only main page.
- `/projects/[slug]/` renders detail pages from the `projects` content collection.
- Theme follows the visitor's system preference through CSS variables.

## Notes

- Keep the site HTML-first.
- Add Tailwind only if repeated layout primitives become painful.
- Keep project metadata in frontmatter before rendering it in pages.
- HomeLog should be framed as LINE-based space access and trust coordination, with gate access as the wedge, timeline as memory, and pricing/install details kept honest while still early.
