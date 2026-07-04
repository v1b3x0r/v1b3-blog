# NEXT-SESSION — v1b3-blog

> Resume point. Last touched: 2026-07-04 — Celsius HUD weather.

## Done this session
- Forced Chiang Mai HUD weather to Celsius at the API boundary, including a
  Fahrenheit-to-Celsius fallback for locale/cache drift.
- Added the shipped Squish v1.0 product to the project collection from `getsquish.app` production truth, not the stale native-repo reset notes.
- Positioned Squish as Visual Context Compression: video → one timecoded contact sheet → vision-language-model reasoning, with client-side privacy and honest Free/Pro boundaries.
- Reworked the MDS page from the current eight-layer Field Guide and v5.12 skill-trigger reality.
- Added MDS issues #18–20 as explicit research questions, not shipped feature claims.
- Synchronized `docs/project-inventory.md` with all featured collection entries.

## Done last session
- FOUNDER row: fake-looking baked commit ("last commit Nd ago · v1b3-blog") → live Chiang Mai weather via wttr.in (`/api/weather`, same pattern as `/api/lastfm`). bake-git removed entirely.
- Fixed dead link: HomeLog project page `viibe.to/homelog` → `homelog.life`.

## Growth backlog (audit 2026-06-13 — "โตขึ้นได้หรือยัง")
1. **No blog in the blog** — only `projects` collection exists; no posts/writing surface. First growth move = add a `posts` collection + first post. Candidate topic: "บางทีสิ่งที่ขาดไม่ใช่ feature แต่คือประตูทางเข้า" (HomeLog Day 26-27 narrative-over-feature lesson).
2. **Content frozen at 2026-05-27** — written before reality moved:
   - hi-introvert page predates the real npm publish (hi-introvert 1.3.0 is live on the registry now)
   - HomeLog page still tells pre-harness-narrative story; landing is LIVE at homelog.life with the real-loop video
   - interpreter-demo (OSS'd from watchdog) has no project page at all
3. **sprint.ts** hardcodes the finished 14-day sprint (self-hides past day 14, so not visible — but the slot needs a real source if it should show anything again).

## House rules (from this pass)
- HUD data must be real or absent — no baked/stale "founder activity" props. Live fetch w/ graceful null (see FounderRow weather/lastfm pattern).
