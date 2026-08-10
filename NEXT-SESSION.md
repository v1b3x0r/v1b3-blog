# NEXT-SESSION — v1b3-blog

> Resume point for v1b3.io. Sections are dated, newest first — relative labels
> like "this session" go stale silently and are how PRs #6–#8 fell out of this
> file.

## 2026-08-10 — listening history + writing order (PR #9)

- **Fixed: new posts were being hidden from the homepage.** `WritingList.astro`
  filtered on `featured` *before* sorting, so the 2026-08-09 post left the set
  before the (already correct) newest-first sort ran. The homepage now takes the
  three newest non-draft posts by date. New writing surfaces with no manual step.
- `featured` is now **dead for posts** — still in the schema, read by nothing.
  Removing it is an open call.
- **Listening dock shows three tracks**, not one: what is playing, then what came
  before with a real elapsed label from the scrobble timestamp. `/api/lastfm`
  asks for four and drops the now-playing echo Last.fm repeats as the newest
  scrobble.
- **Dock has two shapes.** Below `100rem` a bar flush to the bottom edge, one row
  plus a chevron. At or above `100rem` an aside in the gutter with all three rows
  open. `AmbientRadio` follows both shapes so the corner never jumps.
- Design notes: `docs/superpowers/specs/2026-08-10-listening-history-and-writing-order-design.md`

## 2026-08-09 — LME MCP shipping story (PR #8)

- Post: "I Gave an Agent a Package Name and a Prompt" — field notes from shipping
  `@nature-labs/lme-mcp` 0.1, including a provenance colophon.

## 2026-07-31 — inhabited and connected (PR #6, #7)

- Published the HomeLog field note "0/7 Did Not Mean Nobody Was Using It" and
  linked the public HomeLog evidence notes; enabled analytics.
- Turned scrobbles into the site heartbeat: a now-listening dock while Last.fm
  activity is fresh, falling back to the ambient radio after three quiet hours,
  with the HUD live/quiet state driven by the same signal.
- Added footer paths back to the person behind the site (GitHub, LinkedIn, email).
- Floated the dock off the bottom edge to dodge mobile Safari chrome —
  **superseded 2026-08-10**, see House rules.

## 2026-07-21 — writing surface (PR #5)

- Registered the `posts` collection and wired `/writing/` index +
  `/writing/[slug]/` (sans prose, mono structure, amber blockquote "thesis
  beats", eval-table styling).
- Added the `writing` section to the homepage ground below projects.
- First post live: "I Didn't Want to Start a New Chat".
- **Theme decision:** single twilight theme for everyone — removed the half-built
  dawn edition. Dark base = ประหยัดแบต. `--c-dawn-*` tokens and `.sky-dawn` kept
  dormant for a possible future sun-driven palette, which would follow
  `getSkyState()`, not the OS.

## 2026-07-02 → 07-04 — radio, weather, product pages (PR #2, #3, #4)

- Persistent `v1b3topia radio`: opt-in, no-repeat CC0 playlist that survives Astro
  client navigation, with explicit provenance for every local audio asset.
- Shipped Squish v1.0 from `getsquish.app` production truth, positioned as Visual
  Context Compression, with honest Free/Pro boundaries.
- Reworked the MDS page from the eight-layer Field Guide and v5.12 reality; added
  MDS issues #18–20 as research questions, not shipped feature claims.
- Normalised HUD weather to Celsius.

## 2026-06-13 — HUD honesty pass

- Replaced the fake-looking baked commit ("last commit Nd ago") with live Chiang
  Mai weather via wttr.in (`/api/weather`). `bake-git` removed entirely.
- Fixed dead link: HomeLog project page `viibe.to/homelog` → `homelog.life`.

---

## Growth backlog

1. ~~**No blog in the blog**~~ — shipped 2026-07-21. Three posts live.
   Still unwritten: "บางทีสิ่งที่ขาดไม่ใช่ feature แต่คือประตูทางเข้า" (HomeLog
   Day 26–27, narrative-over-feature). Adjacent to the shipped 0/7 post but not
   the same argument — decide whether it still stands alone.
2. **Project pages older than reality** (dates verified 2026-08-10):
   - `hi-introvert.md` — 2026-05-26, predates the real npm publish (1.3.0 is live)
   - `homelog.md` — 2026-06-13, but that edit was only the dead-link fix; the page
     still tells the pre-harness-narrative story while homelog.life is live with
     the real-loop video
   - `world-interpreter-engine.md` — 2026-05-27. **Correction:** an earlier note
     here claimed interpreter-demo had no project page at all. It does. What is
     unverified is whether the page reflects the standalone OSS release.
3. **`sprint.ts` hardcodes the finished 14-day sprint.** It self-hides past day 14
   so nothing shows, but the slot needs a real source if it should show anything.
4. **`featured` is dead for posts** (see 2026-08-10). Decide: drop it from the
   schema, or repurpose it as an explicit pin.

## House rules

- **HUD data must be real or absent.** No baked or stale "founder activity" props.
  Live fetch with graceful null — see the `FounderRow` weather/lastfm pattern.
- **Never draw data the source does not provide.** Last.fm exposes no playback
  position, so the dock shows an animated equalizer and never a progress bar. A
  moving bar would be invented data under the rule above.
- **The dock sits flush to the bottom edge on purpose** (2026-08-10). This
  reverses the 2026-07-31 decision to lift it away from mobile Safari chrome. The
  overlap was re-tested and accepted — do not "fix" it back toward a floating
  pill.
