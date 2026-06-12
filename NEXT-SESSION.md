# NEXT-SESSION — v1b3-blog

> Resume point. Last touched: 2026-06-13 (late night) — "เอา commit เก๊ออก" pass.

## Done last session
- FOUNDER row: fake-looking baked commit ("last commit Nd ago · v1b3-blog") → live Chiang Mai weather via wttr.in (`/api/weather`, same pattern as `/api/lastfm`). bake-git removed entirely.
- Fixed dead link: HomeLog project page `viibe.to/homelog` → `homelog.life`.

## Growth backlog (audit 2026-06-13 — "โตขึ้นได้หรือยัง")
1. **No blog in the blog** — only `projects` collection exists; no posts/writing surface. First growth move = add a `posts` collection + first post. Candidate topic: "บางทีสิ่งที่ขาดไม่ใช่ feature แต่คือประตูทางเข้า" (HomeLog Day 26-27 narrative-over-feature lesson).
2. **Content frozen at 2026-05-27** — written before reality moved:
   - hi-introvert / mds pages predate the real npm publish (mds 5.12.0 + hi-introvert 1.3.0 are live on the registry now)
   - HomeLog page still tells pre-harness-narrative story; landing is LIVE at homelog.life with the real-loop video
   - interpreter-demo (OSS'd from watchdog) has no project page at all
3. **sprint.ts** hardcodes the finished 14-day sprint (self-hides past day 14, so not visible — but the slot needs a real source if it should show anything again).

## House rules (from this pass)
- HUD data must be real or absent — no baked/stale "founder activity" props. Live fetch w/ graceful null (see FounderRow weather/lastfm pattern).
