# NEXT-SESSION — v1b3-blog

> Resume point for v1b3.io. Sections are dated, newest first — relative labels
> like "this session" go stale silently and are how PRs #6–#8 fell out of this
> file.

## 2026-08-31 — whoami: the person is missing from the site (built, not deployed)

Decided in a talk-only session, then built the same afternoon. It is committed
on a branch and **not deployed** — deploy waits until the hackathon submissions
are out, so nothing here has to be revisited under time pressure. `npm test`
50/50 and `npm run build` both pass. The reasoning below is kept so it does not
have to be rebuilt.

### State

- `/whoami` exists, with every word in `src/content/copy/whoami.json` — copy
  changes never touch code.
- Hero gained an identity line and two doors: `whoami →` as a ghost, and an
  outline-only square button, `direct email to me`.
- `under construction` is gone from the HUD strip. The wordmark is now a link
  home.
- Living Memory's project page says `active`, which is what the ledger and
  `/whoami` had already started assuming.
- Contact is `v1b3019@proton.me` everywhere (it was `v1b3@getsquish.app`, an
  address on a product's domain).
- **The `client work` block is held back.** It is written up below and belongs on
  the page, but it names someone else's business and that conversation should
  happen in person and once, not by shipping first. Restore it by adding the
  block back to `whoami.json`; nothing else has to change.

### Rejected, so it is not proposed again

The hero briefly counted: *"one person, ten worlds, five of them running."* The
count was derived from the collection so it could not drift, and it was still
removed. A total means nothing without a published definition of "running", and
publishing one means maintaining one — while the ledger already carries a status
per row, which a reader can weigh better than a sum can. The same note sits above
`heroIdentity` in `src/lib/text-variants.ts`.

**The problem.** The site has no `/about` and never says a human is behind it.
`src/pages/` is `index`, `projects/[...slug]`, `writing/`, `api/`, `404` — the
only path back to a person is three footer links. A stranger met at a meetup has
no URL that can be said out loud. Read cold, the homepage says
`under construction` beside `● live`, calls someone `FOUNDER` of nothing named,
places him `somewhere` in Chiang Mai, invites him to *watch*, and lists ten
projects with no links and no users. Nothing on the page has a customer: every
line says what a thing **is**, never who uses it. Compare winkgrooming.com,
built by the same person, where every line has a cat, a price, and a phone
number.

**The through-line that came out of it** — all four shipped things are the same
problem: *a place that has to work when its owner is not there.* Wink is a shop
whose owner is away for months. HomeLog is a building whose shift keeps
changing. Living Memory is a project whose agent gets replaced by a different
vendor's agent. Squish is footage nobody has time to watch. This is the sentence
that turns "ten unrelated side projects" into one obsession.

### Decided

1. **Both** a new line in the hero **and** a separate page. Different lengths.
2. Page lives at **`/whoami`**; `/about` redirects to it at Cloudflare.
3. No photo, no legal name. Same ledger grammar as `ProjectList`/`WritingList` —
   numbered-feeling rows, mono name, italic description, status right-aligned.
4. **Living Memory sits at the top, tagged `SELLING`** — it is the only row that
   asks for money, and the status column should say so. Wink comes next as its
   *evidence*, not as a competitor.
5. Wink can name the relationship: designed and paid for with his partner, built
   from nothing; he knows the whole, not the daily operations. Keep it short.
6. Being solo is stated as a **mode, not a confession**:
   `solo by default · a team when the work needs one`. People are not afraid of
   one person; they are afraid of messaging into silence — which is why
   `i answer email` is the hardest-working line on the page.
7. The invitation to hire sits there quietly, never as a button. Same posture as
   Wink's `จองผ่าน LINE`: always present, never shouting.
8. **Copy may not promise physical control.** See House rules.

### The rows, and where the old studio name goes

Two blocks, so that work done *for other people* is not confused with work that
is his own. Living Memory leads because it is the only row that asks for money.
Wink follows immediately as its evidence, not as a competitor.

```
running in the real world

  living memory   viibe.to/living-memory   a shared world your agents step into.
                  npm @nature-labs/lme-mcp  tell one agent today, ask a different
                                            one tomorrow.                 SELLING
  wink grooming   winkgrooming.com          a cat hotel my partner and i designed,
                                            paid for and built from nothing. she
                                            runs it remotely for months at a time.
                                            its agent answers guests now.    LIVE
  homelog         homelog.life              access and timeline for a real
                                            building, built to outlive whoever
                                            is on shift.                     LIVE
  squish          getsquish.app             agents read video instead of
                                            transcripts.                     LIVE

client work

  beachdazebag    beachdazebag.com          a Thai bag label that sells almost
                                            entirely to buyers abroad. i have
                                            kept its site alive since 2016,
                                            under the name Kode Studio.      LIVE
```

**`kode.studio` gets a 301 to `/whoami`, and no site of its own** (decided
2026-08-31). It currently resolves to nothing at all — the apex has no A or
CNAME record, so `www` answers HTTP 530 and the credit link in
beachdazebag.com's footer has been landing on a Cloudflare error page for years,
on a site taking roughly 40k pageviews a month. A redirect rule stops that in
two minutes and costs nothing to maintain: no hosting, no worker, no
certificate.

Giving the old studio name a second website was considered and rejected. One
site already fails to keep up with reality; a second identity doubles exactly
the debt this whole entry exists to pay down, and "client work" already has a
home — it is a row on this page, not a domain. But the name itself is worth
keeping: *Kode Studio* reads like something you can hire, and *v1b3topia* reads
like an art project. So the name survives inside somebody else's sentence, which
is all a name has ever needed. When the footer on beachdazebag.com is eventually
changed to point at v1b3 instead, the domain can be allowed to lapse — check
`squish.kode.studio` (Vercel) and `chat.kode.studio` (delegated to DigitalOcean)
before that happens.

One courtesy, and it is why the block is held back: the client row names a real
person's business. Mention it to her before it ships, even though the credit is
already public in her own footer — and mention it once, in a real conversation,
rather than in passing.

### Hero changes

Keep `building v1b3topia, somewhere in chiang mai.` Add one line under it, which
is also the entrance to `/whoami`:

> `one person, ten worlds, four of them running.`

It does three jobs at once: says a single human is here, gives a stranger
something checkable, and opens the funnel. It is honest in both directions — it
admits the other six are not running, which the ledger below already says.

`you came to watch — stay as long as you like` **moves down** to just above the
footer and becomes a farewell rather than an instruction to stay passive:

> `stay as long as you need.`
> `nothing exciting today, but everything here is running.`

### Also true, fix while in there

- **`under construction` has to go.** It contradicts `● live` on the same strip,
  it is no longer true with four things running, and it violates this repo's own
  rule that HUD data must be real or absent. It is a two-second permission to
  close the tab.

### Explicitly out of scope this round

- The ten-row homepage ledger keeps no links, versions or users. That is the
  other half of the cold read and it doubles the work — ship `/whoami` first.
- The `WUTTY.WORLD`-style "world browser" (decaying worlds, `SEND YOUR AGENT`
  MCP endpoint, traces left by visiting agents) is parked, not dead. Its table
  needs N worlds to be worth drawing and there is exactly one. Revisit after the
  Wink WebMCP work stands up, since that is the same shape pointed at a shop
  instead of at a person.

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

- **Copy may not promise physical control** (2026-08-31). A world does not
  "have a body", and sharing a world never grants the right to touch anything.
  Membership gets an agent into the room; it never gets it the keys. Physical
  authority lives behind a separate HomeLog boundary, is delegated by a specific
  human, and is checked server-side — never inferred from world membership or an
  agent's claim about itself. Public wording should stay future-facing without
  overclaiming: a world connects agents, people, and a business's own knowledge
  today, and outside capabilities only *when granted*.

- **HUD data must be real or absent.** No baked or stale "founder activity" props.
  Live fetch with graceful null — see the `FounderRow` weather/lastfm pattern.
- **Never draw data the source does not provide.** Last.fm exposes no playback
  position, so the dock shows an animated equalizer and never a progress bar. A
  moving bar would be invented data under the rule above.
- **The dock sits flush to the bottom edge on purpose** (2026-08-10). This
  reverses the 2026-07-31 decision to lift it away from mobile Safari chrome. The
  overlap was re-tested and accepted — do not "fix" it back toward a floating
  pill.
