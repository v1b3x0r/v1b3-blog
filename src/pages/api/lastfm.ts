import type { APIRoute } from 'astro';
import {
  buildYouTubeSearchUrl,
  pickLargestArtwork,
  type LastFmImage,
  type LastFmState,
} from '../../lib/lastfm';

export const prerender = false;

interface LastFmTrack {
  artist: { '#text': string };
  name: string;
  album?: { '#text': string };
  image?: LastFmImage[];
  url?: string;
  date?: { uts: string };
  '@attr'?: { nowplaying?: string };
}

interface LastFmResponse {
  recenttracks?: {
    track?: LastFmTrack[];
  };
}

interface LastFmTrackInfoResponse {
  track?: {
    album?: {
      title?: string;
      image?: LastFmImage[];
    };
  };
}

const jsonHeaders = { 'Content-Type': 'application/json' };

function emptyState(): LastFmState {
  return {
    track: null,
    artist: null,
    title: null,
    album: null,
    artworkUrl: null,
    lastfmUrl: null,
    youtubeUrl: null,
    playedAt: null,
    activityAt: null,
    nowPlaying: false,
  };
}

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.LASTFM_API_KEY;
  const user = import.meta.env.LASTFM_USER;

  if (!apiKey || !user) {
    return new Response(
      JSON.stringify({ ...emptyState(), error: 'not_configured' }),
      { status: 200, headers: jsonHeaders }
    );
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return new Response(
        JSON.stringify({ track: null, error: 'lastfm_down' }),
        { status: 503, headers: jsonHeaders }
      );
    }
    const data = (await r.json()) as LastFmResponse;
    const t = data.recenttracks?.track?.[0];
    if (!t) {
      return new Response(
        JSON.stringify(emptyState()),
        { status: 200, headers: jsonHeaders }
      );
    }
    const artist = t.artist['#text'];
    const title = t.name;
    const nowPlaying = t['@attr']?.nowplaying === 'true';
    const playedAt = t.date ? parseInt(t.date.uts, 10) * 1000 : null;
    const observedAt = Date.now();
    let album = t.album?.['#text'] || null;
    let artworkUrl = pickLargestArtwork(t.image);

    if (!artworkUrl) {
      const infoUrl = new URL('https://ws.audioscrobbler.com/2.0/');
      infoUrl.search = new URLSearchParams({
        method: 'track.getInfo',
        artist,
        track: title,
        api_key: apiKey,
        autocorrect: '1',
        format: 'json',
      }).toString();

      try {
        const infoResponse = await fetch(infoUrl);
        if (infoResponse.ok) {
          const info = await infoResponse.json() as LastFmTrackInfoResponse;
          album ||= info.track?.album?.title || null;
          artworkUrl = pickLargestArtwork(info.track?.album?.image);
        }
      } catch {
        // Track text is still useful when Last.fm has no matching artwork.
      }
    }

    const state: LastFmState = {
      track: `${artist} — ${title}`,
      artist,
      title,
      album,
      artworkUrl,
      lastfmUrl: t.url || null,
      youtubeUrl: buildYouTubeSearchUrl(artist, title),
      playedAt,
      activityAt: nowPlaying ? observedAt : playedAt,
      nowPlaying,
    };

    return new Response(
      JSON.stringify(state),
      {
        status: 200,
        headers: {
          ...jsonHeaders,
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ track: null, error: 'fetch_failed' }),
      { status: 503, headers: jsonHeaders }
    );
  }
};
