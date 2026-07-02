# Squish and MDS Content Update

Date: 2026-07-02

## Goal

Add Squish as the ninth featured project and refresh the MDS project page from
its current Field Guide and three open research issues.

## Sources of truth

Squish copy follows the shipped web product, not stale repository planning:

- `https://www.getsquish.app/`
- `https://www.getsquish.app/for-ai-assistants`
- `https://www.getsquish.app/video-contact-sheet`

MDS copy follows:

- `docs/FIELD-GUIDE.md` in `v1b3x0r/mds`
- GitHub issues #18, #19, and #20
- the current `@v1b3x0r/mds-core` package metadata

## Squish page

Create `src/content/projects/squish-app.md` using the existing project content
schema. It will be featured with `order: 9`, link to the shipped web app and
repository, and describe Squish as a complete v1.0 product.

The narrative centers on video contact sheets as Visual Context Compression:
Squish turns temporal media into one spatial, timecoded artifact a
vision-language model can inspect in one pass. It runs locally in the browser,
requires no account for the free flow, and does not upload the user's media.
Free produces 3×3 sheets; the one-time Pro upgrade unlocks 4×4 through 6×6.

Photo support can be mentioned as a secondary capability, but the page's
identity remains video-to-contact-sheet. The page must not describe Squish as
unfinished, native-only, an AI model, or a video editor.

## MDS page

Keep the existing MDS page and frontmatter structure, but refresh its content
around the current eight-layer mental model:

1. existence,
2. inner life,
3. material world,
4. learning mind,
5. communication,
6. network,
7. world container,
8. human boundary.

The page will explain the Field Guide's main worldview without duplicating the
whole guide: existence precedes physics, inner state affects matter, decay is
the default, repetition can earn permanence, and the world itself carries
memory and emotional climate.

It will also describe MDS 5.12's declarative skill growth and add a focused
"open questions" section sourced from:

- #18: how limited agents choose what is worth preserving under universal
  decay,
- #19: when repetition becomes ritual and crystallized memory,
- #20: GitHub Issues as an encyclopedia for unresolved world questions.

These are research directions, not shipped API claims.

## Integration

- Do not change the Astro schema, rendering components, or layout.
- Update `docs/project-inventory.md` so its human-readable mirror includes
  Squish and the refreshed MDS framing.
- Update `NEXT-SESSION.md` as the existing task log instead of creating another
  log file.
- Preserve all existing project order values; Squish is the new final item.

## Verification

- Run the Astro content/type check.
- Run the test suite.
- Run the production build.
- Inspect the final diff for stale "in development" Squish language, duplicated
  file roles, unsupported MDS claims, and unused artifacts.
