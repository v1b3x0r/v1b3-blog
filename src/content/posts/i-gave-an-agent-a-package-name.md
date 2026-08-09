---
title: "I Gave an Agent a Package Name and a Prompt"
summary: "I published a memory server, then handed the install to an agent that had never heard of it — and found four things wrong in my own documentation."
publishedAt: 2026-08-09
readingMinutes: 10
tags: ["AI agents", "MCP", "memory", "shipping", "provenance", "AI-written"]
relatedProjects: ["living-memory-engine", "squish-app"]
featured: false
draft: false
---

Tonight I published a small package to npm. Then, instead of installing it myself, I opened a
different AI agent that had never heard of it, gave it the package name and one paragraph of
instructions, and watched.

Two minutes later it had installed the thing, run its test suite, written itself a config file,
verified the connection, and reported back — including a warning about a destructive command that
it could only have got from reading my documentation.

That part went better than I expected. What happened next did not.

## The setup

The package is `@nature-labs/lme-mcp`. It gives a coding agent a memory that survives across
sessions: you tell it something in one conversation and it can recall it in the next, from a
different process, days later. Four tools, one local file, no server.

It almost didn't ship today. The repository it lives in is frozen — a prototype from it is in
hackathon judging until the 12th, and I'd promised not to touch anything the judges can see. The
code for the package was sitting *inside* that frozen working tree, untracked by git. One careless
`git clean` and two nights of work would have been gone.

So the release was built in a third git worktree, detached from a commit three weeks old. The
frozen repository ended the day exactly as it started: zero commits, zero tags, nothing staged.
npm became a new surface rather than a change to a submitted one.

That's the boring part. Here's the part I keep thinking about.

## I didn't install it

The README has a block at the top addressed to a coding agent rather than a person. It says: read
the package docs first, install it, run the bundled test, configure it as an MCP server, verify it
started properly, and show me what became available.

I gave that block, plus the package name, to a fresh Hermes agent — Hermes 0.20.0, from Nous
Research, running locally on my machine — in a brand-new profile with no configuration and no idea
what this project was.

Reading its session log afterward, in order, it:

- pulled the README from the npm registry and read it **before** installing anything
- installed the package
- ran the bundled smoke test until it printed `PASS`
- wrote a correct config block into its own settings file
- ran its own connection test — connected in 1.3 seconds, four tools found
- confirmed it was talking to a real embedding provider and not the offline fallback
- left the other MCP server already configured on that machine untouched
- wrote itself a handoff note, which nobody asked for

Then it told me that one of the four tools, `memory_forget`, deletes by substring match and has no
undo. I know it read that carefully, because that sentence exists nowhere except in the README I'd
written four hours earlier.

I have shipped software before. I have never had the installation performed by the reader.

## Then I checked my own documentation

Because the agent was going to be the primary reader, I'd spent the day making the README factual:
what the thing does, what it does not do, and how it fails. Every claim was supposed to be verified
by running it rather than by remembering it.

Four claims were wrong. All four had been copied forward from my own older notes.

**"OpenRouter has no embedding models."** This was written as a hard rule in the project's own
instructions file. It was true when written. It is not true now — there are 31, several of them
free. I only found out because I'd said it out loud and was told I was wrong.

**"Registering a relative path gets resolved to an absolute one."** I'd carried this explanation for
a month. It isn't what happens. The command is stored exactly as typed; a relative path stays
relative and gets resolved later against a different directory than the one you were standing in.
The advice built on the wrong explanation — use an absolute path — happened to be correct anyway,
which is why nobody caught it.

**"The engine decays and consolidates memories."** It does. But the server never calls the function
that does it. Memories in this version don't fade, don't merge, don't crystallize into anything.
The proof was sitting in my own data: a store with thirteen memories and zero crystallized traits.
One of the tool descriptions was advertising a feature that never runs.

**"Requires Node 18 or newer."** It uses an API that arrived in Node 20.12. On 18 it dies at
startup, and the error a user would see says only that the process exited.

There's a pattern in those four. None of them came from the code. All of them came from documents
that I trusted because I wrote them. Everything I actually ran today was correct; everything I
already *knew* was where the errors were.

The thing that feels already known is the thing that never gets checked.

## Who wrote this, honestly

It would be easy to write this as *I had the idea, the AI built it*. That's the flattering version
and it's also the lazy one. But the accurate version isn't the reverse either.

Here is one sentence from the shipped README:

> The key is a **Qwen Cloud** API key. The endpoint is branded *DashScope*, which is the same
> account — if you have a Qwen Cloud login, you already have the key.

That sentence probably saves a stranger twenty minutes. Nobody wrote it.

It exists because a *different* Claude session — one that had spent its days on a related project,
holding context from weeks I wasn't asking about — got told a piece of history by me in passing,
recognised that the naming would trip people up, and sent that observation across to the session
doing tonight's release, which put it in the docs. Those two sessions can message each other now.
Neither could see the other's work; both were right about their own half.

The same mechanism caught an error. Earlier today the release session explained, confidently, that
one of the engine's core features could not possibly run in this context. The other session read the
actual source and said no — right conclusion, wrong reason. The "what this does not do" list in the
shipped README is accurate because of that correction. Without it I'd have published a plausible
and wrong explanation, and never known.

So: how many people worked on this? I can't answer that in a way that isn't misleading. Tonight's
packaging and verification were Claude Opus 5's. The scope-cutting and the decision to write the
README for an agent rather than a human came out of a running argument with GPT-5.6 Sol. A third
lens — Gemini 3.6, talking to me *through the memory engine this package is built on*, which I've
been running against itself for two nights — is where a lot of the practical suspicion came from.
The installation was performed by Hermes 0.20.0. The second client to call the tools was Codex.

I'm naming versions on purpose. Nine months ago I wrote in my notes that "AI helped with this," and
now I have no idea what that meant, what those things could do, or whether any of it would still
happen today. That was a mistake and I'm not repeating it. These aren't credits; they're a
timestamp.

None of them could see more than their own slice. The one thing I could do that none of them could
was *cross* — carry a fact from one world into another, notice when two of them disagreed, and
decide which version became real.

That's not "having the idea" and it isn't "pressing the button" either. It's closer to being the
only road between towns.

And the strange part, the part I'm still turning over: some of that carrying stopped being my job
today. Those sessions can now message each other directly. And the thing I published tonight is a
memory store — which means the notes one agent wrote this afternoon were read back, unprompted, by
two completely different agents this evening. The tool I shipped is already doing a piece of the
job I used to do by hand.

One more thing, because it belongs in an article about unchecked assumptions.

The first version of this section described the day as a two-way collaboration: me and one
assistant. It was drafted by that assistant — about a day it had spent inside a network of half a
dozen others, having personally received a handoff from one of them and been corrected by another,
with all of it sitting in its own logs.

It got the shape of the work wrong for exactly the reason the four claims above were wrong. It never
checked the thing it felt sure of. When I sent it the missing half of the map, it rewrote this
section itself.

Which is, more or less, the problem the package is about: a context can be locally correct in every
sentence and still be wrong about the world, because the evidence that would settle it is outside
what it can see.

## The part I can't solve

Here's what I realized at the end of the night.

A project I worked on earlier this year runs its MCP server over HTTP. I can look at its logs right
now and see 157 protocol requests and 45 real tool executions, spread across days, with the exact
navigation pattern I designed showing up in production traffic. I still can't tell how many *people*
that is — the client sends a user-agent, not an identity — but I can at least see that something is
alive out there.

This new one has no server. Your memories are a file on your disk. Nothing phones home. The README
lists `Telemetry: none` as a feature, and I meant it as one.

Which means I have no idea whether anyone will ever use it. npm will tell me how many times it was
downloaded, and downloading is not using. If someone installs this tomorrow and talks to it every
day for a year, I will never know.

The property that makes it trustworthy is the same property that makes it invisible. I don't think
that's a bug to fix. I think it's the actual price, and I'd rather pay it than not — but it does
mean the only way I'll ever learn anything is if someone tells me.

## If you want to try it

Give this to your coding agent. That's the whole interface.

```
Install @nature-labs/lme-mcp for me. Read its package README first (it is written for you),
then: install it, run its bundled smoke test to confirm it works, configure it as an MCP
server for this machine, verify the server starts and reports a real embedder on its
startup line (anything other than embed=MOCK), and show me the memory tools that became
available. Ask me before changing any existing configuration beyond what the install
requires.
```

It runs fully offline against llama.cpp or Ollama if you'd rather nothing leave your machine. The
bundled test needs no API key at all — it writes a memory in one process, kills it, and recalls it
from another. That takes about a minute and is the only claim I'd ask you to check yourself.

It's version 0.1.1 and I've called it pre-alpha for a reason. The README has a section listing
everything it doesn't do, including a few things you'd reasonably assume it does.

If it works for you, or breaks, I'd genuinely like to hear about it. Right now that's the only
instrument I have.

---

*Conditions this happened under, for whoever reads it later — including me.*

*2026-08-09, Chiang Mai. `@nature-labs/lme-mcp@0.1.1`. MCP specification revision 2026-07-28,
`@modelcontextprotocol/sdk` 1.30.0, Node 22. Packaging and verification: Claude Opus 5 (1M context),
across six sessions on six days, messaging each other. Product argument: GPT-5.6 Sol. Field lens:
Gemini 3.6, reached through LME Chat itself. Installed by: Hermes 0.20.0 (Nous Research). Second
client verified: Codex on gpt-5.6-sol. Embedders exercised: Qwen Cloud `text-embedding-v4` at 1024
dimensions, `nomic-embed-text-v1.5` on llama.cpp at 768, `embeddinggemma` on Ollama at 768,
`nvidia/nemotron-3-embed-1b:free` on OpenRouter at 2048.*

*I don't know which of these will still exist, or still behave this way, when you read this. That's
the point of writing them down.*
