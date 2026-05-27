import type { APIRoute } from 'astro';

export const prerender = false;

interface LastFmTrack {
  artist: { '#text': string };
  name: string;
  date?: { uts: string };
  '@attr'?: { nowplaying?: string };
}

interface LastFmResponse {
  recenttracks?: {
    track?: LastFmTrack[];
  };
}

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.LASTFM_API_KEY;
  const user = import.meta.env.LASTFM_USER;

  if (!apiKey || !user) {
    return new Response(
      JSON.stringify({ track: null, error: 'not_configured' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return new Response(
        JSON.stringify({ track: null, error: 'lastfm_down' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const data = (await r.json()) as LastFmResponse;
    const t = data.recenttracks?.track?.[0];
    if (!t) {
      return new Response(
        JSON.stringify({ track: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const nowPlaying = t['@attr']?.nowplaying === 'true';
    const playedAt = t.date ? parseInt(t.date.uts, 10) * 1000 : null;

    return new Response(
      JSON.stringify({
        track: `${t.artist['#text']} — ${t.name}`,
        playedAt,
        nowPlaying,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ track: null, error: 'fetch_failed' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
