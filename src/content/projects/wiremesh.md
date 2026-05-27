---
title: "WireMesh"
summary: "A peer-to-peer protocol and single-binary app shape for entities that can host themselves, migrate between hosts, and keep their identity through the move."
status: "experimental"
kind: "P2P entity protocol"
stack: ["Go", "React", "P2P", "Ed25519", "single binary"]
repo: "https://github.com/v1b3x0r/wiremesh"
relatedProjects:
  - slug: "mds"
    note: "If MDS entities ever need to live on the network as first-class citizens, WireMesh is the shape that lets them carry their identity between hosts without re-registering."
  - slug: "homelog"
    note: "Future-latent — an offline-first Pi node version of HomeLog could speak the WireMesh protocol so spaces remain operable without the cloud."
featured: true
order: 4
---

WireMesh is an attempt to give entities sovereignty over their own data and identity, without forcing them into a self-hosting cliff.

The idea is simple: any cryptographically-identified entity should be able to *run anywhere*. On its own node. On someone else's host. Then move. The keys travel with the entity; the host is just convenient infrastructure.

```text
Single Entity:   "Clone → Deploy → Operate independently"
Multi-Entity:    "Run a host → Aggregate multiple entities → Shared infrastructure"
Protocol:        "Self-host OR join a host → Migrate anytime → Keep sovereignty"
```

## Why it exists

Most P2P protocols force a choice between "run your own server forever" and "trust the central platform." That binary breaks small projects, side-experiments, and anyone whose technical patience is finite.

WireMesh tries the middle ground. The protocol speaks both languages — independent operation and hosted operation — and treats migration between them as a first-class motion, not a data-export-and-pray operation.

## Shape

A single Go binary. A React UI embedded inside it. Ed25519 keys for identity. An append-only event log. Optional payment and interaction extensions. No magic dust.

Hosts compete on the boring things — uptime, bandwidth, region, price — instead of on lock-in. Entities can leave. The protocol does not punish departure.

The interface follows one rule on top of all of that: speak human language at the surface (store, products, orders) and protocol language only when someone asks to look under the hood. *Censorship resistance does not have to feel like a config file.*

## Where it sits in the ecosystem

WireMesh is parked, not abandoned.

The natural future use is offline-first nodes for HomeLog: a Raspberry Pi running a local WireMesh peer that holds the space's access events, runs DreamLink interpretation, and keeps the household operable when the cloud is unreachable. That is design intent, not a roadmap. HomeLog has to earn its access core first.

In the wider arc, WireMesh is the network layer the MDS ecosystem reaches for when entities need to live somewhere other than a single process.

## What it says about the builder

I want systems where leaving is as easy as staying. *Lock-in is a story we tell ourselves about complexity.* WireMesh is my attempt at the rebuttal.
