# Squish and MDS Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the shipped Squish product to the project collection after the existing entries and update MDS from its current Field Guide and open research issues.

**Architecture:** Keep the implementation entirely inside the existing Astro content collection. Add one Markdown entry, revise one Markdown entry, and update the two existing human-facing documentation files; do not change schema, components, routes, or positional UI logic.

**Tech Stack:** Astro 6 content collections, Markdown frontmatter, Zod validation, TypeScript

---

### Task 1: Add the Squish project entry

**Files:**
- Create: `src/content/projects/squish-app.md`
- Verify: `src/content.config.ts`
- Verify: `src/components/ground/ProjectList.astro`

- [ ] **Step 1: Confirm the current collection contract**

Read `src/content.config.ts` and confirm the entry supplies every required
frontmatter field. Read `ProjectList.astro` and confirm it consumes the
collection generically and needs no Squish-specific condition.

- [ ] **Step 2: Create the Squish content entry**

Create `src/content/projects/squish-app.md` with:

- title `Squish`,
- summary centered on video-to-timecoded-contact-sheet,
- status `active`,
- kind `visual context compressor`,
- the shipped site and repository URLs,
- featured collection metadata following the existing data-driven sequence,
- sections explaining the product, the contact-sheet reasoning primitive,
  local/private processing, timestamps, Free versus Pro density, and what the
  product deliberately is not.

Use only claims verified on `getsquish.app`: v1.0.0, client-side processing,
no upload, no account for the free flow, Free 3×3, one-time Pro 4×4–6×6,
vision-language-model compatibility, and photo support as a secondary path.

- [ ] **Step 3: Validate the new content entry**

Run:

```bash
npx astro check
```

Expected: exit 0 with no content schema errors. If unrelated existing
diagnostics appear, record them separately and verify there is no diagnostic
for `squish-app.md`.

- [ ] **Step 4: Commit the Squish entry**

```bash
git add src/content/projects/squish-app.md
git commit -m "content: add shipped Squish project"
```

### Task 2: Refresh the MDS narrative

**Files:**
- Modify: `src/content/projects/mds.md`
- Reference: `/Users/v1b3_/_dev/project-world-log/mds/docs/FIELD-GUIDE.md`
- Reference: GitHub issues `v1b3x0r/mds#18`, `#19`, and `#20`

- [ ] **Step 1: Preserve valid frontmatter and current ecosystem links**

Keep the existing title, status, repository, related-project links, featured
state, and collection sequence metadata. Update the summary and stack only
when the current Field Guide or package metadata gives stronger wording.

- [ ] **Step 2: Rewrite the body around current MDS truth**

Retain the concise essence-first introduction, then structure the page around:

- what MDS is and is not,
- the eight-layer world stack,
- one rainstorm as a cross-layer data flow,
- the worldview encoded by the runtime,
- v5.12 declarative skill growth,
- open research questions under universal decay,
- its place in the surrounding project ecosystem.

State the issues as unresolved research:

- #18 asks how limited agents choose what to preserve,
- #19 asks when repetition becomes ritual and permanence,
- #20 treats the issue tracker as memory for unresolved world questions.

Do not imply these questions are shipped APIs. Do not copy the Field Guide
wholesale; synthesize its strongest claims and link readers to the guide.

- [ ] **Step 3: Validate the revised MDS entry**

Run:

```bash
npx astro check
```

Expected: exit 0 with no content schema errors and no diagnostic for `mds.md`.

- [ ] **Step 4: Commit the MDS update**

```bash
git add src/content/projects/mds.md
git commit -m "content: refresh MDS from field guide"
```

### Task 3: Synchronize project documentation

**Files:**
- Modify: `docs/project-inventory.md`
- Modify: `NEXT-SESSION.md`

- [ ] **Step 1: Update the project inventory**

Add Squish to the featured project inventory. Add short notes that:

- Squish is the shipped Visual Context Compression product,
- project placement remains collection-driven,
- MDS now reflects its eight-layer Field Guide and research issues #18–20.

- [ ] **Step 2: Update the existing task log**

Refresh the `NEXT-SESSION.md` timestamp and add a completed-work section for
the Squish entry and MDS refresh. Remove the stale backlog claim that the MDS
page predates v5.12.0 while preserving unrelated backlog items.

- [ ] **Step 3: Check documentation consistency**

Run:

```bash
rg -n "in development|product-complete|positional logic" \
  src/content/projects/squish-app.md docs/project-inventory.md NEXT-SESSION.md
```

Expected: no matches.

- [ ] **Step 4: Commit documentation synchronization**

```bash
git add docs/project-inventory.md NEXT-SESSION.md
git commit -m "docs: sync project inventory and task log"
```

### Task 4: Verify the integrated result

**Files:**
- Verify: `src/content/projects/squish-app.md`
- Verify: `src/content/projects/mds.md`
- Verify: `docs/project-inventory.md`
- Verify: `NEXT-SESSION.md`

- [ ] **Step 1: Run the test suite**

```bash
npm test
```

Expected: exit 0 and all Vitest tests pass.

- [ ] **Step 2: Run Astro validation**

```bash
npx astro check
```

Expected: exit 0 with zero errors.

- [ ] **Step 3: Run the production build**

```bash
npm run build
```

Expected: exit 0 and generated project routes include `/projects/squish-app/`.

- [ ] **Step 4: Audit the final diff**

```bash
git status --short
git diff --check HEAD~3..HEAD
git log -4 --oneline
```

Confirm no component/schema changes, no duplicated docs or temporary files,
no stale unfinished-Squish language, and MDS issue claims remain explicitly
research-stage.
