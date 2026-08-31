---
title: "Living Memory Engine"
summary: "A context composition engine for persistent agents. It decides what the model should see before inference without replaying an ever-growing transcript."
status: "active"
kind: "agent context substrate"
stack: ["TypeScript", "Vite", "IndexedDB", "Qwen Cloud", "Alibaba Cloud"]
site: "https://cm.viibe.to/"
siteLabel: "Meet Chiang Mai"
repo: "https://github.com/v1b3x0r/living-memory-engine"
relatedProjects:
  - slug: "squish-app"
    note: "A perception primitive built around the same many-to-few instinct."
featured: true
order: 10
---

Living Memory Engine decides what an AI model should see before it begins inference.

It sits between a growing world of conversation, memory, plans, live signals, and self-state, and the small working context sent to the model for one turn.

```text
conversation + memory + live + plans + self-state
                         ↓
                retrieve · rank · compose
                         ↓
                  working context
                         ↓
                        LLM
```

The full conversation is not replayed. Each turn retrieves a small, diverse set of relevant memories plus a capped recent tail. After the reply, a memory tick decays stale traces, reinforces useful ones, merges duplicates, prunes weak memories, and crystallizes repeated experience into durable self-facets.

## Proven through a living city

The reference entity is เชียงใหม่, a city that remembers people across sessions and senses its own environment.

Exteroception brings in live weather and air through Open-Meteo. Interoception tells the entity whether it is online, which model it is using, whether embeddings work, how fresh the world feed is, and how old its memory has become.

The point is not to make a city chatbot. The city makes memory behavior observable. If the feed becomes stale, the entity should know not to present old weather as current. If embeddings fail, it should not pretend recall is reliable.

## Context composition, not context stuffing

The interface exposes the result of retrieval as **Used context** and **Available, not used**. It also shows conversation size beside the working context the model actually received.

That view is useful for more than presentation. It exposed semantically duplicated self-facets that exact-string matching had missed. Fixing the deduplication reduced one observed working context from roughly 4,300 tokens to roughly 1,500.

The inspector became a profiler for the architecture.

## Honest evaluation

A deterministic H1 to H4 harness compares the engine with naive full-history replay. It demonstrates cross-session preference recall, critical-fact selection among 31 candidates, and forgetting after decay at smaller context sizes.

It also documents a failure: when a preference changes, both the old and new values may be retrieved. Semantic deduplication is not the same as contradiction-aware supersession. That gap remains open.

## What exists now

- a framework-agnostic TypeScript engine with storage, chat, and embedding ports
- provider-agnostic OpenAI-compatible adapters
- Qwen Cloud chat and embeddings through a key-safe proxy
- browser-local IndexedDB memory separated by persona
- memory, live-signal, plan, and self-state composition
- explainable used-versus-ignored context
- 177 automated tests at the hackathon submission point
- a live deployment on Alibaba Cloud Simple Application Server

This is still an experimental, single-user system. It is not a solved theory of memory, and it is not yet the place to entrust an entire life. What it proves is the smaller thesis underneath it:

**Memory is not only what an agent stores. It is how the agent decides what deserves to become working context now.**

Read the full building journey: [I Didn't Want to Start a New Chat](/writing/i-didnt-want-to-start-a-new-chat/).
