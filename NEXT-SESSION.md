# NEXT-SESSION — v1b3-blog

> Resume point. Last touched: 2026-07-21 — writing surface (posts collection + /writing/ routes).

## Done this session
- Registered the `posts` content collection and wired the writing surface:
  `/writing/` journal index + `/writing/[slug]/` long-form page (sans prose,
  mono structure, amber blockquote "thesis beats", eval-table styling).
- Added a `writing` section to the homepage ground below projects — the
  "ประตูทางเข้า" move from the growth backlog, rendered in the same row rhythm
  as projects but dated instead of numbered.
- First post live in the collection (from Codex's PR #5): "I Didn't Want to
  Start a New Chat" — the Living Memory Engine building journey.
- Synced `docs/project-inventory.md` (Living Memory Engine + writing routes).
- **Theme decision:** single twilight theme for everyone — removed the half-built
  dawn edition (`prefers-color-scheme` overrides in tokens.css, Sky/MeshBackground
  OS-preference branches, `color-scheme: dark light`). Dark base = ประหยัดแบต.
  `--c-dawn-*` tokens + `.sky-dawn` kept dormant for a possible future
  sun-driven (time-of-day) palette — that would follow `getSkyState()`, not the OS.

## Done earlier (2026-07-04)
- Added the persistent `v1b3topia radio`: an opt-in, no-repeat CC0 playlist
  that survives Astro client navigation, with explicit provenance for every
  local audio asset.
- Added the shipped Squish v1.0 product to the project collection from `getsquish.app` production truth, not the stale native-repo reset notes.
- Positioned Squish as Visual Context Compression: video → one timecoded contact sheet → vision-language-model reasoning, with client-side privacy and honest Free/Pro boundaries.
- Reworked the MDS page from the current eight-layer Field Guide and v5.12 skill-trigger reality.
- Added MDS issues #18–20 as explicit research questions, not shipped feature claims.
- Synchronized `docs/project-inventory.md` with all featured collection entries.

## Done last session
- FOUNDER row: fake-looking baked commit ("last commit Nd ago · v1b3-blog") → live Chiang Mai weather via wttr.in (`/api/weather`, same pattern as `/api/lastfm`). bake-git removed entirely.
- Fixed dead link: HomeLog project page `viibe.to/homelog` → `homelog.life`.

## Growth backlog (audit 2026-06-13 — "โตขึ้นได้หรือยัง")
1. ~~**No blog in the blog**~~ — ✅ shipped 2026-07-21 (PR #5 + writing surface). `posts` collection + `/writing/` routes exist; first post is the LME building journey. Candidate topic still open for post #2: "บางทีสิ่งที่ขาดไม่ใช่ feature แต่คือประตูทางเข้า" (HomeLog Day 26-27 narrative-over-feature lesson).
2. **Content frozen at 2026-05-27** — written before reality moved:
   - hi-introvert page predates the real npm publish (hi-introvert 1.3.0 is live on the registry now)
   - HomeLog page still tells pre-harness-narrative story; landing is LIVE at homelog.life with the real-loop video
   - interpreter-demo (OSS'd from watchdog) has no project page at all
3. **sprint.ts** hardcodes the finished 14-day sprint (self-hides past day 14, so not visible — but the slot needs a real source if it should show anything again).

## House rules (from this pass)
- HUD data must be real or absent — no baked/stale "founder activity" props. Live fetch w/ graceful null (see FounderRow weather/lastfm pattern).
