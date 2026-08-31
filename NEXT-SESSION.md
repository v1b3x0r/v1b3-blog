# NEXT-SESSION — v1b3-blog

> Resume point for v1b3.io. Sections are dated, newest first — relative labels
> like "this session" go stale silently and are how PRs #6–#8 fell out of this
> file.

## 2026-09-01 — /whoami is live

Shipped in the small hours: **PR #10** (`8c391e6`, five commits) and **PR #11**
(`17bbf05`, one line). Verified against production by requesting the real URLs
after the deploy, not by trusting a green build — `/whoami/` 200, and all four
shapes of `/about` (with and without `www`, with and without the trailing slash)
land on it.

The plan below was built as written, then changed on contact with a phone. What
follows is what is true now; where it disagrees with the 2026-08-31 entry, this
wins.

### Changed after reading it on a real device

- **The hero's identity sentence was removed entirely.** It shipped as
  `one person in chiang mai. each of these belongs to a different world.`, was
  read cold on a phone, and cut the same night: it stated something true without
  connecting to anything a reader could act on. The same idea works on `/whoami`,
  which has a page around it to give it meaning. **The `whoami →` door is the
  entrance, not a sentence.** `identity.line` is gone from `hero.json`; the
  labels and hrefs stay.
- **The copy sits low now** — `bottom: 22%` on mobile, `26%` on short phones (was
  32% and 30%). Everything had been stacking into the middle of the sky with a
  wide empty band beneath it. Anchoring the copy near the ridge opens the middle.
  17% was tried and is worse: the mail button lands across the horizon line.
- **Wider gap before the doors**, 10px → 22px. They are pressed, not read; at
  line spacing the row read as a third line of the paragraph.
- **The Thai hero variants and `isThaiSpeaker` were deleted.** The shell is
  English only. Thai inside `/writing` stays — that is English prose about Thai
  things.

### Mobile sky: a zero-sum band, and a caption that has always tucked

Codex flagged the hero overlapping the moon on short phones. Real, and worse than
reported: at 320x568 the copy started **107px above** the caption, covering the
moon; at **375x667 — an iPhone SE 2/3, not an exotic size** — it still overlapped
by 43px. At 390x844 there was already clearance. Fixed with a rule scoped to
`(max-width: 600px) and (max-height: 700px)`: a 460px floor under the sky, moon
and caption higher, tighter spacing.

Codex then flagged the caption overlapping the bottom of the moon. **That one was
declined, with measurements.** It predates all of this — on `main` it measures
-10px, on this branch -9px — and the sky is a single zero-sum band: pushing the
caption down to clear the moon takes the clearance straight back off the hero
(at `caption: 21%` the hero overlaps the caption again). Clearing all three gaps
needs a taller sky (`sky 490px · moon 4% · caption 18% · hero 29%`), which costs
86% of a 568px screen. Not taken; available if it is ever wanted.

**Before accepting any finding of the form "your change caused X", measure the
same distance on `main` first.** Reading the diff alone will keep producing this
one.

### Routing — and why none of it could live at Cloudflare

- **`v1b3.io` is DNS-only at Cloudflare on both apex and `www`** (grey cloud,
  CNAME straight to Vercel). A redirect rule on that zone saves fine, shows as
  active, and **never runs**. Proven with `curl -I`: `server: Vercel`, no
  `cf-ray`. Check `proxied` before ever proposing a rule for this domain again.
- So `/about` → `/whoami` lives in **`vercel.json`**, next to the page it points
  at, and ships with it. It needs both `/about` and `/about/` — `source` is an
  exact path match, and the assumption that Vercel normalises the trailing slash
  away was wrong and cost a 404 on a live path (PR #11).
- **`kode.studio` now 301s to `https://www.v1b3.io/` — the homepage, not
  `/whoami`.** This supersedes the decision recorded on 2026-08-31. Someone
  arriving through kode.studio is following an old credit link, not looking for
  the person; the homepage gives them more. `/about` already serves the people
  who are looking. **Do not "fix" this to point at `/whoami`.**
- The apex had **no DNS record at all** — that, not the rule, was why it failed.
  An `AAAA @ 100::` **proxied** gives the proxy something to answer. The HTTP 530
  that had been breaking the credit link in beachdazebag.com's footer for years
  is now gone. `squish.kode.studio` still answers 200, so the domain still cannot
  be allowed to lapse; `chat.kode.studio` is already dead on its own.
- A 301 is cached in visitors' browsers and cannot be taken back, so the rule was
  deliberately a **302 to the homepage** until `/whoami` was actually deployed,
  then promoted to 301.

### Living Memory, not Living Memory Engine

The founder settled a single public name and sentence for the whole thing (first
used on his HackerEarth profile), and the site was still describing the first
piece of it:

> **Living Memory** — https://viibe.to/living-memory — Dec 2025 to present.
> An ecosystem combining World Models and Memory for AI agents, featuring a
> digital environment for multi-human and multi-agent collaboration.

The project page was retitled, its summary rewritten to the ecosystem framing,
its `site` moved from `cm.viibe.to` to `viibe.to/living-memory`, and the stale
line "This is still an experimental, single-user system" corrected — it is
hosted, multi-user, and the one row on the ledger that asks for money.

**The dated posts under `/writing` still say "Living Memory Engine" on purpose.**
They are accounts of a particular week, not product surfaces; renaming the past
would make them lie about what existed at the time.

There was never a canonical description before this because the thing was never
designed top-down — engine first, then the stdio MCP, then HTTP, then rooms
several people could enter, and for a while it was genuinely unclear what it was.
The blurb is a resolution of real ambiguity, not a marketing line.

**One tension, deliberately left standing:** the GTM direction of 2026-08-28 says
to lead with discoverable terms (living memory / shared memory / context /
handoff) and reveal the shared-world model afterwards. This blurb leads with
"World Models". Both are right for different readers — jargon-forward suits a
judged technical audience, discoverable suits a stranger arriving cold. Ask which
audience a surface serves before rewriting one into the other.

### Still held back

**The `client work` block (beachdazebag / Kode Studio) is still not on the page**
— unchanged, and unchanged for a non-technical reason. It names someone else's
business and that conversation happens in person, once. Restoring it is an edit
to `whoami.json` and nothing else.

---

## 2026-08-31 — whoami: the person is missing from the site (the reasoning)

Decided in a talk-only session, then built the same afternoon. **Shipped
2026-09-01 — see the entry above for what actually went live and where it
departs from this.** Deploy had been waiting on the hackathon submissions, which
are out. The reasoning below is kept because it is still the reasoning; only the
outcomes moved.

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

**`kode.studio` gets a 301 and no site of its own** (decided 2026-08-31;
**superseded 2026-09-01 — the 301 goes to the homepage, not `/whoami`**, see the
top entry). It currently resolves to nothing at all — the apex has no A or
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
   - ~~`living-memory-engine.md`~~ — brought current 2026-09-01: retitled to
     *Living Memory*, ecosystem summary, `site` moved to viibe.to/living-memory,
     and the "experimental, single-user" claim corrected. **The remaining pages
     have the same disease** — a label that was true the day it was written.
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
5. **Project pages carry no dates.** The frontmatter has `status`, `kind`,
   `stack`, `order` — nothing for "Dec 2025 to present", which is how the work is
   described elsewhere now. Adding the field touches every project, so it was
   deliberately not done on 2026-09-01. Worth a decision, not a reflex.

## House rules

- **Measure on `main` before accepting "your change caused X"** (2026-09-01). A
  reviewer reading only the diff will attribute pre-existing behaviour to
  whatever is new beside it. The moon caption has tucked ~9px under the disc on
  mobile since long before `/whoami`; an afternoon can be spent "fixing" it, and
  the fix takes the clearance straight off the hero. Get the number on `main`
  first, then decide.

- **A green build says nothing about redirects** (2026-09-01). `npm test` 50/50
  and a clean `npm run build` both passed while `/about/` returned 404 in
  production. Redirects are platform behaviour, not code that runs in a test —
  request the real URLs after every deploy that touches routing.

- **Check `proxied` before proposing anything at Cloudflare** (2026-09-01).
  `v1b3.io` is grey-cloud on both hostnames, so a rule there saves successfully,
  displays as active, and never executes. Silent failure that looks like success.
  Redirects for this site belong in `vercel.json`.

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
