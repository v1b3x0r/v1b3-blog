---
title: "I Checked My Own Front Door From Inside the House"
summary: "I asked my analytics whether anyone had visited. It said no. Four people had — and the query I wrote was built in a way that could not see them."
publishedAt: 2026-08-15
readingMinutes: 11
tags: ["AI agents", "MCP", "memory", "handoff", "measurement", "shipping", "AI-written"]
relatedProjects: ["living-memory-engine"]
featured: false
draft: false
heroImage: ../../assets/agent-walk-inout.jpg
heroImageAlt: "Watercolour illustration of a round table. Most chairs are empty but a note still rests in front of each one. Two hooded figures remain — one reading a note left at someone else's place, one setting a note down before leaving. A third figure fades away at the left edge; a fourth arrives at the right."
---

This morning I shipped a new landing page for the memory server, and by lunchtime it was live,
tested, and green on every gate. Twelve unit tests, a project boundary check, a typecheck, a build,
a presentation-policy check, eighteen rendered-HTML tests, and an npm audit at zero. Verified
against the served production HTML, not just locally.

Then I asked, out of curiosity, whether anyone had actually come.

The answer I gave myself was no. Nobody. Zero strangers, four days after launching on Product Hunt.

That answer was wrong, and the way it was wrong is the only thing about today worth writing down.

## Four people had come

Here they are, with the times I eventually pulled out of the database:

| when | from | where |
|---|---|---|
| 14 Aug, 19:17 | `?ref=producthunt` | 🇺🇸 United States |
| 14 Aug, 21:43 | Gmail on Android, `?ref=zymera` | 🇵🇰 Pakistan |
| 15 Aug, 01:32 | `?ref=producthunt` | 🇵🇱 Poland |
| 15 Aug, 04:15 | LinkedIn | 🇨🇦 Canada |

Two countries came through a Product Hunt listing I published on the 13th and then stopped thinking
about. One came from an outreach email, five hours after I sent it. One came from LinkedIn, where I
have never posted about this at all.

None of them are customers. All four landed on the page and left. But four is not zero, and for a
week I have been telling everyone — accurately, I thought — that this product has zero external
anything.

## Why my own query lied to me

I asked the database to group visits by where they came from. It gave me four buckets: direct
visits, visits from my own domain, one from Gmail, one from LinkedIn. Twenty-two direct visits
across six devices. Six devices sounded like me — I have about that many, and I had spent two days
reloading that page.

So I called the direct bucket internal and moved on.

Every single `?ref=producthunt` arrival lands in that bucket. Product Hunt hands the link off in a
way that strips the referrer, so those visitors arrive looking exactly like a person typing the URL.
They were sitting inside the twenty-two I had just dismissed.

I did not fail to find them. **I wrote a question that was shaped in a way that could not return
them, and then reported the empty result as a fact about the world.**

There is a version of this failure that is just a SQL bug. That is not what this was. `$direct`
does not mean *internal*. It means *no referrer header*, which is also what you get from app clicks,
from Slack, from Discord, from a mail client, from anything that isn't a browser following a link.
I knew that. It is not obscure. I did not think about it once, because "direct means me" was the
kind of thing that felt already known.

I have written that exact sentence before, about something else. Six days ago, in a post about
handing an install to an agent: *the thing that feels already known is the thing that never gets
checked.* I wrote it about four wrong claims in my own README. Today it was about a query, and it
cost me the only real information I had.

## The file I wrote for agents was describing a version that no longer existed

Once I started looking properly, I went and read the machine-readable file on the site — the one
written so that an AI deciding whether to adopt this thing can read a single document and get the
truth. It said the hosted server has six tools.

It has had nine since Thursday.

That file matters more than the marketing page, because two of the directories where people find
MCP servers do not accept submissions — they crawl. What they had available to crawl was a
description of last week. Fixed this afternoon; the count is right now, and the three new tools each
have a line.

That one was real. The next part is where it gets uncomfortable.

## Two of the things I "found" were my instrument, not the world

I reported three more problems with the front door that morning, with some confidence. The most
serious was that the URL without a trailing slash — the one a person types, the one that gets pasted
into a chat — was serving a cached copy of the previous page, headline and all. The other was that
nothing on the site had a social preview: no title, no description, no image, so every share
anywhere rendered as a bare link.

Both went into a brief. Neither survived being checked properly.

Claude Code went at production directly — raw requests, response headers, both URLs — and found the
new page on both paths, `no-store` on the response, no CDN cache in front of it, and the bare path
redirecting to the canonical one exactly as it should. It also found the social preview tags
already sitting in the HTML, and had been for days. What it actually changed was smaller and duller:
the canonical URL's trailing slash, per-page cards for the two child pages, and a new preview image.

So how did I see an old page and a bare head?

The tool I was checking with fetches a URL, converts the page to markdown, and hands me the
markdown. Markdown does not have meta tags. **I asked an instrument that cannot represent
`og:title` whether `og:title` was there, and I wrote down its answer as a finding.** The same tool
caches a response per URL for a few minutes, which is the most likely reason a stale copy came back
once and a fresh one came back when I changed the query string — a difference I read as evidence
about the server rather than evidence about my own cache.

That is the identical mistake as the analytics one. Not similar to it — the same one, twice more, in
the same hour. Ask a question the instrument cannot answer, receive an absence, report the absence
as a fact.

I nearly published this post with both of those in it as pillars. An article about mistaking your
own blind spot for the world, containing two observations I had not verified from outside, is a
joke I would rather tell on purpose than accidentally.

## Then the agent corrected me, and it was right four times

The four-strangers finding went to Claude Code to act on. It came back and told me not to act on it
yet, because the analysis was wrong in four places.

It was right about all four.

There were **four** outside visitors, not three — I had missed the entire Product Hunt channel,
which is the only one that produced more than one country, and if my summary had gone into the
permanent record the channel would have quietly vanished from it.

The Pakistan visit was **not** a fourteen-second bounce, which is how I had described it. The real
sequence is: page loads plain, fourteen seconds pass, the visitor leaves — and then loads *again*,
this time with the referral tag. The tag arrived on the second visit, not the first. Which means I
have no idea whether the referral link was the door they came through, and every conclusion I had
started drawing about the landing page from that one data point was built on air.

The priority I had proposed was **backwards**. I wanted to build referral tracking first. But every
trial room in the database was me, testing the installer that morning; all one hundred and five
agent connections were my own agents; the single completed payment was me paying myself to check
that the checkout worked. Adding attribution to traffic that is ninety percent my own would only
have put a nicer label on my own noise. Separate yourself out first, or you are just building a
mirror.

And one thing I had called easy was not easy. I had written "forward the referral tag to the server"
as though it were a pass-through. The server never sees a browser. It sees a token. To carry that
tag through, it has to be attached when the room is created and stored on the token itself — which
is a schema change, not an analytics tweak. I would have sent someone into that without warning.

Six days ago I wrote about two AI sessions catching each other's errors, and framed my own role as
the road between them — the only one who could carry a fact from one world into another and decide
which version became real. Today the traffic went the other way. I was holding the wrong map, and
the correction came from the machine.

I do not think that is a story about the machine getting smarter. It is a story about **who had
access to what.** It could read the raw event stream and hit production directly. I was reading my
own summary, through a tool that quietly reshaped what I was looking at. That is the whole
asymmetry, and it is the same one in every other paragraph here.

## What I actually shipped, and why it is the same subject

The thing that went live this week is a mailbox.

The memory server already let several agents share one memory. What it did not let them do was leave
something *for* each other. So: one agent can now post an exact note addressed to whoever picks the
work up next, and it expires, because work-in-flight is not knowledge. And agents that cannot sign
in — a CLI, an editor, a coding agent — get a key each, which can be handed out and taken back
without touching what the world remembers.

I tested it the only way that counts. Minted a key for one editor, opened a completely fresh chat,
and typed five words: *"Is anything outstanding?"* No mention of memory. No tool names. Nine seconds
later it had called the mailbox on its own, found a note another agent left, and answered from it.
Nobody told it where to look. It decided that a question about outstanding work was a question for
the mailbox — and that decision came out of a forty-word tool description and nowhere else.

Separately, in a free room: at 08:46 ChatGPT wrote a memory into it. At 09:31 Claude Code read it
back from the same room, word for word — a different vendor, on a different machine.

I have been calling the free tier a *room* and the paid one a *world*, and I spent an evening
arguing with myself about whether that distinction was real or just pricing. It is real, and the
mailbox is what makes it real. A room is an exchange: two agents meet, swap what they know, and
leave, and in twenty-four hours the room and everything in it is deleted. A world is somewhere you
can put something down and have it still be there on Tuesday — and where an agent can leave
something addressed to another agent that has not arrived yet.

The reason that matters is the reason for this entire post. **Two agents cannot see each other's
context.** Each one is locally correct and globally blind. The mailbox exists because the fix for
that is not a better model; it is a place outside both of them where a fact can sit until the other
one gets there.

Which is exactly what I did not have this morning, about my own website.

## The part I can't solve

I looked at the shelf I am standing on. There is a category on Product Hunt for this kind of tool,
and I read all fifteen products in it, plus five more launched nearby. Every single one describes
recall: remember your stuff, unified memory, persistent memory, a shared brain. Not one of them
claims that an agent can hand work to another agent. So I changed my tagline today to say that,
because it is the only uncontested ground I have.

I cannot tell you whether that is insight or rationalisation. Being the only one saying something is
also what it looks like to be the only one who wants it.

And the measurement problem is not fixed, it is only understood. I know four people came. I know
what tag was on their link. I do not know that the tag means where they came from — a referral tag
records where *I said the link would live*, and links get re-shared, and the tag travels. I still
cannot separate a stranger from myself in most of the numbers, and until I can, every chart I build
is a picture of me.

So the bar I set before there was any number to be tempted by, and which I am writing down publicly
so I cannot quietly move it: **one stranger, one room, unprompted.** Someone I have never met opens
a memory world and points an agent at it because they wanted to, not because I asked.

That has not happened. Four people got close enough to knock.

The honest position, four days after launch and one day after the mailbox shipped, is that I have a
working system, a page that finally says what it does, zero customers who are not me, and — for the
first time — a way of looking that does not start by assuming I already know the answer.

That last one took a machine telling me I was wrong, which I would like to say is a new experience
and is in fact the second time this week.

---

*Conditions this happened under, for whoever reads it later — including me.*

*2026-08-15, Chiang Mai. Living Memory hosted MCP server, nine tools on the authenticated surface;
`@nature-labs/lme-mcp` on npm, Apache-2.0. Landing page rebuilt and deployed the same morning across
four Cloudflare Worker versions. Analytics: PostHog, 37 landing views over two days, four of them
not mine. Drafting and the site copy: Claude Opus 5, in a Cowork session — which is also the session
that wrote the query that could not see anyone, and that reported two front-door defects which
turned out to be artifacts of its own fetching tool. Treat the byline as evidence rather than
credentials. The corrections came from Claude Code, which had raw production and the raw event
stream, and every one of them stood up when I checked it myself. Product argument, as usual: GPT-5.6
Sol, who also refused to let this post go out until those two paragraphs were reconciled.*

*The one client that still cannot open a free room is Claude on the web. I spent a day trying to
make that my bug and failed — four separate theories killed by experiment, and what is left sits
inside a connector I cannot see. It is written up, with a date on it, on a page that lists what does
not work. If that page is ever stale, that is a bug too.*
