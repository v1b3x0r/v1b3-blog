import type { APIRoute } from 'astro';
import {
  buildYouTubeSearchUrl,
  pickLargestArtwork,
  toListeningRows,
  type LastFmImage,
  type LastFmState,
  type LastFmTrack,
} from '../../lib/lastfm';

export const prerender = false;

// Three rows are shown. A fourth is requested because Last.fm reports the
// now-playing track twice — once as playing, once as the newest scrobble —
// and dropping that echo would otherwise leave the dock a row short.
const TRACK_REQUEST_LIMIT = 4;
const HISTORY_ROWS = 2;

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
    history: [],
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

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${apiKey}&format=json&limit=${TRACK_REQUEST_LIMIT}`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return new Response(
        JSON.stringify({ track: null, error: 'lastfm_down' }),
        { status: 503, headers: jsonHeaders }
      );
    }
    const data = (await r.json()) as LastFmResponse;
    const tracks = data.recenttracks?.track;
    const t = tracks?.[0];
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
      // Row 0 is the leading track above; only the tail is history. These rows
      // keep whatever artwork the feed carried — the track.getInfo fallback
      // stays reserved for the leading track so one request covers the dock.
      history: toListeningRows(tracks).slice(1, 1 + HISTORY_ROWS),
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
