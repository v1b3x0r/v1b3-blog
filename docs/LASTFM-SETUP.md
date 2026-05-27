# Last.fm setup — show what you're listening to

The site's HUD shows your currently-playing music via Last.fm's public API.
This is what makes the "founder presence" feel alive — visitors see what
song you have on right now (or most recently).

## Step 1 — Create a Last.fm account (if you don't have one)

Sign up at https://www.last.fm/join

## Step 2 — Get an API key

1. Visit https://www.last.fm/api/account/create
2. Fill in the form:

| field | what to put |
|---|---|
| **Application name** | `v1b3topia` (anything) |
| **Application description** | "personal site music status" |
| **Callback URL** | `https://v1b3x0r.com/` (anything valid — we don't use it) |
| **Application homepage** | `https://v1b3x0r.com` |

3. Submit. Last.fm will show:
   - **API Key** — copy this, you'll need it
   - **Shared Secret** — we don't use this (read-only public calls)
   - **Registered To** — your username, just confirms ownership

## Step 3 — Wire up scrobbling from YouTube

The site reads what you've recently listened to from Last.fm. For that to
work, something needs to *send* listening data to Last.fm. Install:

**Web Scrobbler** — https://web-scrobbler.com/

- Free browser extension (Chrome, Firefox, Edge, Brave)
- Scrobbles YouTube, YouTube Music, Apple Music, Bandcamp, SoundCloud and more
- Sign in with your Last.fm account once; it scrobbles automatically forever

Spotify scrobbling is built in via https://www.last.fm/settings/applications
(connect Spotify → enable scrobbling). But the spec assumes YouTube is your
main listening surface, so Web Scrobbler is the primary path.

## Step 4 — Drop credentials into `.env`

In your repo root, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:

```bash
LASTFM_API_KEY=your-api-key-here
LASTFM_USER=your-last-fm-username
```

## Step 5 — Set the same values in Vercel

Once you deploy to Vercel, set them in your project settings:

1. Open your Vercel dashboard → project → Settings → Environment Variables
2. Add `LASTFM_API_KEY` and `LASTFM_USER`
3. Set them for `Production`, `Preview`, and `Development`
4. Redeploy

## Verifying it works

1. Play a song on YouTube (with Web Scrobbler signed in)
2. Visit your site
3. Look at the HUD bar — you should see `♪ Artist — Track (Nm ago)`

If you see nothing:

- Check `https://www.last.fm/user/YOUR_USERNAME` shows the song you played
- Check `/api/lastfm` on your site directly — it should return JSON
- Check Vercel logs for the edge function

## Failure modes

| symptom | likely cause |
|---|---|
| No track shows | Web Scrobbler not signed in / not enabled for that site |
| `/api/lastfm` returns 503 | Last.fm API is down (rare) — the site silently falls back to git commit |
| Track is stale by hours | Scrobbler not running while you listened (e.g. you used a phone) |

The site degrades gracefully: if Last.fm is unreachable or returns nothing,
the founder row just shows the latest git commit instead.
