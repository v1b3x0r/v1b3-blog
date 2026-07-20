---
title: "Squish"
summary: "Give AI random access to video. Squish turns continuous footage into an addressable visual map that an agent can inspect, zoom, and cite."
status: "active"
kind: "agent video navigation primitive"
stack: ["TypeScript", "CLI", "MCP", "ffmpeg", "hosted API"]
site: "https://www.getsquish.app/"
siteLabel: "Open Squish"
repo: "https://github.com/v1b3x0r/squish-app"
featured: true
order: 9
---

Squish gives AI agents random access to video.

It converts continuous footage into an addressable visual representation: timestamped contact sheets an agent can inspect, revisit, and progressively refine. The contact sheet is the first implementation of the primitive, not the final answer.

```text
video → overview → inspect the grid → zoom a time range → cite evidence
```

The browser app makes that idea easy to use by hand. The CLI and MCP server let an agent run the navigation loop itself.

## The problem is not video playback

When someone asks an AI "what happens in this clip?" the obvious input is the video itself. But a continuous stream is awkward for an agent that needs one precise moment. It either watches linearly, samples too little, or spends heavily to inspect far more footage than the question requires.

Sending one frame does not solve the real problem either. A still image can show *what* happened, but not what changed before or after it.

A contact sheet keeps the frames that carry the sequence and drops the redundant time between them. The timecodes preserve the link back to the source:

- the error first appears around `0:32`,
- the scene changes at `1:02`,
- the goal happens near `1:48`.

Without timestamps, the grid is a pile of thumbnails. With them, it becomes something a model can reason over.

## The contact sheet is a map

Squish began as **Visual Context Compression**: turn temporal media into a spatial artifact a vision model can read in one pass. Using it with agents revealed a bigger idea. The grid is not only compressed context. It is an index into the source timeline.

Every cell carries an absolute timecode. An agent first reads a coarse overview, spots a relevant region, then asks Squish for a denser sheet of only that range. The addresses stay absolute, so the agent can repeat the process until the event becomes observable.

```text
overview → spot 0:30 to 0:40 → zoom → spot 0:33 to 0:35 → cite 0:34.2
```

Squish adjusts the lens. The model interprets what it sees.

## Local, hosted, or inside an AI client

The local CLI and stdio MCP server process everything on the user's machine. Nothing is uploaded, every density is free, and one command replaces the usual download, ffmpeg, frame extraction, and montage pipeline.

```bash
npx -y @getsquish/squish clip.mov
npx -y @getsquish/squish mcp
```

For clients without a shared filesystem, the hosted MCP connector accepts a public video URL at `https://api.getsquish.app/mcp`. The hosted API and browser product cover workflows where remote processing is intentional.

The privacy boundary stays explicit: local tools stay local; hosted paths move media through Squish.

## When it earns its keep

Use Squish when:

- an agent needs to search a local video without uploading it,
- a question depends on one moment inside a long recording,
- a screen recording needs to become inspectable evidence,
- the model can understand images but cannot navigate raw video,
- repeated zooming is cheaper and clearer than processing the whole clip densely.

Do not use it for a single still image or when audio is the only thing that matters. Compression is useful only when it preserves the evidence the question needs.

## What it says about the builder

I like tools that do one translation cleanly enough to disappear.

Squish does not ask the model to become a video player. It gives the model a map and a way to move through it.

The strongest proof has been dogfooding. Agents have used Squish to inspect demo recordings, locate evidence, and help prepare the submissions that describe Squish itself.

Read the [guide for AI assistants](https://www.getsquish.app/for-ai-assistants), the [MCP reference](https://getsquish.gitbook.io/squish/reference/mcp), or the deeper explanation of [video contact sheets](https://www.getsquish.app/video-contact-sheet).
