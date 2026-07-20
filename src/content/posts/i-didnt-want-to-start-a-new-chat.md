---
title: "I Didn't Want to Start a New Chat"
summary: "How a personal AI wrapper, an old annoyance, and a 19-hour hackathon sprint became Living Memory Engine."
publishedAt: 2026-07-21
readingMinutes: 10
tags: ["AI agents", "memory", "Qwen", "building journey"]
relatedProjects: ["living-memory-engine", "squish-app"]
featured: true
draft: false
---

I did not set out to build an AI memory engine.

I wanted an AI client of my own.

At home, I wanted it to work with Ollama or LM Studio. Away from home, with only an internet connection, I wanted OpenRouter and the option to use a stronger hosted model. The original problem was not research. It was convenience.

Then I ran into something more annoying: **why did I have to keep pressing New Chat?**

Humans do not start a new session every time they return to the same person. The conversation may pause, the topic may change, and months may pass, but the relationship does not reset to an empty window.

AI chat felt different. Once a thread became too long, I had to leave it behind. The words were still stored somewhere, but the continuity was gone.

That annoyance became the first version of this project on December 19, 2025.

## It began as a chat, not an engine

The first repository was called `neural-chat`. Its job was simple to describe: one personal chat that could keep going.

The early commits already contained the seeds of the later system. There was memory retrieval, session import and export, and an attempt at cognitive grounding. But I was still thinking in product terms. I wanted a better chat client, so I built chat features.

There was no grand thesis. No pitch about reinventing memory. I was irritated by a button.

The project then slowed down for a very ordinary reason: it did not make money, and nothing was forcing me to finish it. It became something I would revisit when I had free time, which meant it mostly sat there.

The git history is useful here because it is less romantic than memory. The project did not sleep for one perfectly clean seven-month gap. A blueprint appeared in May. A proper ports-and-adapters engine arrived later that month. In early June, the interface moved from a mobile prototype to the web, Chiang Mai gained live weather and air as senses, and the entity learned to inspect its own runtime state.

But seven months after the first commit, the project was still unfinished and still lacked a reason to become urgent.

Then I finished another hackathon project.

## Nineteen hours left

On July 20, 2026, I had just submitted [Squish](https://www.getsquish.app/), a tool that gives AI agents random access to video. I noticed the Qwen Cloud Global AI Hackathon still had a MemoryAgent track open.

There were about 19 hours left.

I asked ChatGPT, almost casually, whether this was even possible. The plan was not heroic: if I woke up and enough time remained, I would dust off an old project and see if it fit.

I spawned Claude inside the repository with a narrow job: explore what was already there, find the track it matched, and avoid inventing a rewrite that the deadline could not afford.

Claude did not create the project. It entered as an archaeologist.

The surprising part was how much of the MemoryAgent problem already existed in the old code. The engine had decay, reinforcement, retrieval, duplicate merging, prospective memories, and self-facets that could crystallize from repeated experience. The web app already proved it through a strange little entity named เชียงใหม่, a city that senses its weather, knows whether its world feed is stale, and remembers people across sessions.

What the project did not have was a clear explanation of itself.

I thought I was reviving a persistent chat. During the sprint, that description stopped being enough.

## The model never sees the conversation

The turning point was a simple realization:

> LLMs do not remember. They receive context. This engine decides what that context should be.

That changed the center of the product.

The important output was not a database full of memories. It was the small working context assembled before inference.

```text
conversation + memory + live signals + plans + self-state
                              ↓
                   context composition
                              ↓
                     working context
                              ↓
                            LLM
```

The engine retrieves candidates, ranks and filters them, mixes in a capped recent tail, and composes the prompt the model actually receives. After the reply, the system ingests the new turn and runs a memory tick: decay what is stale, reinforce what was useful, merge duplicates, prune weak traces, and crystallize durable traits.

This is why I now call it **Living Memory Engine**, and why its more precise description is a context composition engine for persistent agents.

Retrieval is one operation inside it. Storage is one component underneath it. The product idea is selection.

## The interface became an instrument

At first, the memory panel looked like a database inspector. It exposed labels such as episodic, self, prospective, and tail. Those words were technically correct and experientially useless to anyone meeting the project for the first time.

So the interface was reorganized around a more useful question:

> Why did the model answer this way?

The panel began showing **Used context** and **Available, not used**, with source labels for memory, live signals, and plans. Then we added a direct comparison between the growing conversation and the bounded working context.

One demo run showed roughly 6,900 tokens of conversation becoming about 1,400 tokens of working context. The exact number changes with the turn, and that percentage is not the point. The important property is that the model does not need the whole transcript replayed every time.

Making that visible immediately exposed a problem.

The first version of the panel showed a working context of roughly 4,300 tokens, much larger than expected. Several self-facets said nearly the same thing in slightly different words. The consolidation code only removed exact-string duplicates, while the model rewrote the same idea on every tick.

The UI had become an architecture profiler.

We changed self-facet deduplication from exact matching to semantic similarity. The same scenario dropped to roughly 1,500 tokens. That was not cosmetic optimization. It improved what the model saw and made the architecture's claim more honest.

Explainability helped the user understand the engine, then helped the builder find a defect inside it.

## Measuring the parts that worked, and the part that did not

The hackathon sprint also added a deterministic evaluation harness against a naive full-history baseline. It runs the real engine through four scenarios with a seeded clock and a deliberately simple lexical embedder.

| Scenario | What happened | Engine context | Full history |
| --- | --- | ---: | ---: |
| Cross-session preference | relevant preference recalled | ~42 tokens | ~143 tokens |
| Updated preference | both old and new values recalled | ~25 tokens | ~24 tokens |
| Critical fact among 31 candidates | critical fact surfaced | ~23 tokens | ~428 tokens |
| Expired memory after about 12 weeks | stale fact forgotten | ~0 tokens | ~12 tokens |

Three scenarios supported the intended behavior. One did not.

The updated-preference scenario retrieved both the old window-seat preference and the newer aisle-seat preference. Deduplication can recognize reworded versions of the same trait, but the engine does not yet understand that a later fact supersedes an earlier contradiction.

I kept that row in the README.

An evaluation that only reports victories is a demo script. This row describes the next real problem: contradiction-aware consolidation.

## What changed during the sprint

The repository existed before the submission period, so the honest story is not that the whole system appeared in one day.

The sprint changed its shape and made the new thesis observable. Across 33 commits on July 20, the project gained:

- Qwen Cloud chat and embeddings through a server-side, key-safe proxy
- a deterministic H1 to H4 evaluation against full-history replay
- explainability for context used and context intentionally left out
- a bounded working-context visualization
- semantic deduplication for crystallized self-facets
- safe Markdown rendering for the context document and chat
- an English-first demo experience
- a zero-dependency production server deployed on Alibaba Cloud
- 177 automated tests across the engine and web app at submission time

The visible sprint was fast. The system underneath it was not new. That distinction matters.

The hackathon did not give me enough time to invent the architecture from scratch. It gave me enough pressure to finally understand the architecture I had already been circling.

## This is not a memory system I would trust with everything

Living Memory Engine is still a proof of concept.

I do not yet know the optimal reason to remember something. I do not know whether every memory it keeps is clean enough, or whether the current policy will behave well after years of use. The deterministic evaluation proves specific mechanics, not human-level memory. The live demo contains tens of memories, not millions.

There is no contradiction-aware supersession yet. Memory privacy across multiple people has a design, but not the complete scoped-retrieval implementation. The current deployed entity is browser-local, not a canonical 24-hour server process living continuously in the world.

In Thai, I would say it is not something I can *ฝากผีฝากไข้* with yet. It is not something I would trust with my whole life.

What it does prove is narrower and, to me, more interesting:

> Memory is not only the act of storing the past. It is the act of deciding what deserves to become the present working context.

That question now feels larger than the chat client that produced it.

## The original problem is still here

Squish and Living Memory Engine now sit next to each other in my project list. They solve different problems, but I can see the same instinct in both.

Squish turns a long video into a small, addressable set of visual evidence. Living Memory Engine turns a long relationship with an agent into a small, relevant working context. One works on perception. The other works on continuity.

Both ask the model to carry less and see better.

The funny part is that if I could send one sentence back to myself on December 19, 2025, it would not be a technical insight.

It would be this:

> Seven months later, the original problem is still here, idiot.

I still do not want to start a new chat.

That annoyance is no longer just a product feature I want. It has become a much better engineering question: **what should an AI be allowed to remember, forget, and see right now?**

The project is live at [cm.viibe.to](https://cm.viibe.to/). The source, evaluation, and deployment evidence are in the [Living Memory Engine repository](https://github.com/v1b3x0r/living-memory-engine).
